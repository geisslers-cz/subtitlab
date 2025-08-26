<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from '$lib/utils';
  import type { TimelinePaintProps } from './timeline-canvas.svelte';

  export type TimelineCanvasLayer = (props: TimelinePaintProps) => void;

  export type TimelineContentProps = {
    width: number;
    duration: number;
    viewStart: number;
    viewLength: number;
  };

  export type TimelineProps = {
    layers?: TimelineCanvasLayer[];
    class?: ClassValue;
    peaks?: { height?: number };
    minDuration?: number;
    pxPerSecond?: number;
    followMargin?: number;
    content?: Snippet<[TimelineContentProps]>;
  };
</script>

<script lang="ts">
  import { addEventListener } from 'svelte-toolbelt';
  import { ScrollArea } from '$lib/components/scroll-area';
  import { cn, reset } from '$lib/utils';
  import { useAudioPlayerInternals } from './audio-player.svelte';
  import PeaksCanvas from './peaks-canvas.svelte';
  import PlayheadCanvas from './playhead-canvas.svelte';
  import TimelineCanvas from './timeline-canvas.svelte';

  const ctx = useAudioPlayerInternals();

  let {
    layers = [],
    class: className,
    peaks,
    minDuration = 0,
    pxPerSecond = 100,
    followMargin = 0.05,
    content,
  }: TimelineProps = $props();
  let offsetWidth = $state(0);
  let scrollWidth = $derived((ctx.duration ?? minDuration) * ctx.zoom * pxPerSecond);
  let viewport: HTMLElement | null = $state(null);
  let waveform: HTMLElement | undefined = $state();
  let viewStart = $derived(reset(0, ctx.url));
  let viewLength = $derived(offsetWidth / (ctx.zoom * pxPerSecond));
  let ignoreScroll = false;

  $effect(() => {
    if (viewport) {
      return addEventListener(viewport, 'scroll', onscroll, { passive: false });
    }
  });

  $effect(() => {
    // this effect follows changes to viewStart, which we update to follow playback
    if (!viewport || !ctx.duration) {
      ignoreScroll = false;
      return;
    }

    ignoreScroll = true;
    viewport.scrollLeft = scrollWidth * (viewStart / ctx.duration);

    const tmr = requestAnimationFrame(() => (ignoreScroll = false));
    return () => cancelAnimationFrame(tmr);
  });

  $effect(() => {
    // this effect updates viewStart to automatically follow playback
    if (ctx.duration && ctx.playing && ctx.follow) {
      if (ctx.follow === 'instant') {
        viewStart = Math.max(
          0,
          Math.min(ctx.duration - viewLength, ctx.currentTime - viewLength / 2),
        );
      } else if (
        ctx.currentTime < viewStart + viewLength * followMargin ||
        ctx.currentTime > viewStart + viewLength * (1 - followMargin)
      ) {
        viewStart = Math.max(
          0,
          Math.min(ctx.duration - viewLength, ctx.currentTime - viewLength * followMargin),
        );
      }
    }
  });

  function onscroll(): void {
    if (!viewport || ignoreScroll || !(ctx.duration ?? minDuration)) {
      return;
    }

    viewStart = (ctx.duration ?? minDuration) * (viewport.scrollLeft / scrollWidth);

    if (ctx.playing) {
      ctx.follow = undefined;
    }
  }

  function onpointerdown(evt: PointerEvent): void {
    if (!waveform || !ctx.duration || evt.defaultPrevented) {
      return;
    }

    seek(evt);

    waveform.setPointerCapture(evt.pointerId);

    waveform.addEventListener('pointermove', seek);
    waveform.addEventListener('pointerup', end);
    waveform.addEventListener('pointercancel', end);

    function end(evt: PointerEvent): void {
      evt.preventDefault();
      waveform?.removeEventListener('pointermove', seek);
      waveform?.removeEventListener('pointerup', end);
      waveform?.removeEventListener('pointercancel', end);
      waveform?.releasePointerCapture(evt.pointerId);
    }
  }

  function seek(evt: PointerEvent): void {
    evt.preventDefault();

    if (ctx.duration) {
      ctx.currentTime = ctx.duration * (evt.offsetX / scrollWidth);
    }
  }
</script>

<div bind:offsetWidth class={cn('relative flex items-stretch', className)}>
  {#if ctx.peaks}
    <PeaksCanvas {viewStart} {viewLength} peaks={ctx.peaks} height={peaks?.height} />
    <PlayheadCanvas {viewStart} {viewLength} currentTime={ctx.currentTime} />
  {/if}
  {#if scrollWidth}
    {#each layers as layer (layer)}
      <TimelineCanvas {viewStart} {viewLength} paint={layer} />
    {/each}
  {/if}
  <ScrollArea bind:viewport type="auto" orientation="horizontal" class="grow rounded-[inherit]">
    {#if ctx.duration ?? minDuration}
      <div
        bind:this={waveform}
        class={cn('flex h-full flex-col justify-end', ctx.duration && 'cursor-pointer')}
        style:width={`${scrollWidth}px`}
        {onpointerdown}
      >
        {@render content?.({
          width: scrollWidth,
          duration: ctx.duration ?? minDuration,
          viewStart,
          viewLength,
        })}
      </div>
    {/if}
  </ScrollArea>
</div>
