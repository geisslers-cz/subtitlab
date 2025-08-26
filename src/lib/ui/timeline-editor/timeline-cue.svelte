<script module lang="ts">
  import type { TimedCue } from '$lib/data';

  export type TimelineCueProps = {
    cue: TimedCue;
    chainIdx: number;
    timelineWidth: number;
    timelineDuration: number;
    dragDx?: number;
  };

  type EdgeOperation = {
    update: (x: number) => void;
    end: (commit: boolean) => void;
    mode: 'self' | 'ripple';
    edge: string;
  };
</script>

<script lang="ts">
  import { tooltip } from '$lib/components/tooltip';
  import { useProjectContext } from '$lib/state';
  import { cn, formatTime } from '$lib/utils';
  import { useLaydownContext } from './laydown';

  const project = useProjectContext();
  const laydown = useLaydownContext();

  let {
    cue,
    chainIdx,
    timelineWidth,
    timelineDuration,
    dragDx = $bindable(),
  }: TimelineCueProps = $props();
  let start = $derived((timelineWidth * cue.from) / timelineDuration);
  let end = $derived((timelineWidth * laydown.getCueEnd(cue)) / timelineDuration);
  let op: EdgeOperation | undefined = $state.raw();

  function onpointerdown(evt: PointerEvent): void {
    const btn = evt.target instanceof Element ? evt.target.closest('button') : null;
    const edge = btn?.dataset.edge;
    const ripple = evt.shiftKey;

    if (!edge) {
      return;
    }

    evt.preventDefault();
    btn.setPointerCapture(evt.pointerId);
    btn.addEventListener('pointermove', onpointermove);
    btn.addEventListener('pointerup', onpointerup);
    btn.addEventListener('pointercancel', onpointercancel);

    if (edge !== 'start') {
      dragDx = 0;
    }

    const x0 = evt.screenX;
    const s0 = start;
    const e0 = end;
    const update =
      edge === 'start'
        ? (x: number) => {
            start = Math.max(0, Math.min(end - 40, s0 + (x - x0)));
          }
        : edge === 'end'
          ? (x: number) => {
              dragDx = x - x0;
              end = Math.max(start + 40, e0 + dragDx);
            }
          : (x: number) => {
              dragDx = x - x0;
              start = Math.max(0, s0 + dragDx);
              end = Math.max(40, e0 + dragDx);
            };

    op = {
      mode: ripple ? 'ripple' : 'self',
      edge,
      update,
      end: (commit) => {
        btn.releasePointerCapture(evt.pointerId);
        btn.removeEventListener('pointermove', onpointermove);
        btn.removeEventListener('pointerup', onpointerup);
        btn.removeEventListener('pointercancel', onpointercancel);

        const dt = (timelineDuration * (dragDx ?? 0)) / timelineWidth;

        op = dragDx = undefined;

        if (!commit) {
          return;
        }

        cue.from = (timelineDuration * start) / timelineWidth;
        cue.to = (timelineDuration * end) / timelineWidth;

        if (ripple) {
          for (let next = cue.next; next; next = next.next) {
            next.from += dt;
            next.to += dt;
          }
        }

        if (
          (!cue.previous || cue.from >= cue.previous.from) &&
          (ripple || !cue.next || cue.from <= cue.next.from)
        ) {
          return;
        }

        const order = new Map(cue.parent.cues.toArray().map((cue, i) => [cue, i]));

        project.current.history.add(
          () => cue.parent.cues.sort((a, b) => a.from - b.from),
          () => cue.parent.cues.sort((a, b) => order.get(a)! - order.get(b)!),
        );
      },
    };
  }

  function onpointermove(evt: PointerEvent): void {
    evt.preventDefault();
    op?.update(evt.screenX);
  }

  function onpointerup(evt: PointerEvent): void {
    evt.preventDefault();
    op?.end(true);
  }

  function onpointercancel(evt: PointerEvent): void {
    evt.preventDefault();
    op?.end(false);
  }
</script>

{#if op}
  {#if op.edge !== 'end'}
    <span
      class="border-accent-foreground absolute top-0 h-full w-0 border-l"
      style:left={`${start - 1}px`}
    ></span>
  {/if}
  {#if op.edge !== 'start'}
    <span
      class="border-accent-foreground absolute top-0 h-full w-0 border-l"
      style:left={`${end}px`}
    ></span>
  {/if}
{/if}

<span
  class={cn(
    'absolute top-[calc(1px*var(--peaks-height)+(7*var(--idx)+1)*var(--spacing))] h-6 rounded px-2',
    'bg-chart-1 text-primary-foreground overflow-hidden text-sm leading-6 text-ellipsis whitespace-nowrap',
    'data-[dragging]:z-10 data-[dragging]:ring-1',
    'peer peer-data-[dragging=ripple]:translate-x-[calc(1px*var(--drag-dx))]',
    'peer-data-[dragging=ripple]:ring-1',
  )}
  data-dragging={op?.mode}
  style:--idx={chainIdx}
  style:left={`${start}px`}
  style:width={`${end - start}px`}
>
  {cue.content}
  <button
    type="button"
    class="absolute top-0 left-0 h-full w-4 cursor-w-resize outline-0"
    aria-label="Adjusts cue start"
    data-edge="start"
    use:tooltip={op ? formatTime((timelineDuration * start) / timelineWidth) : 'Adjust cue start'}
    {onpointerdown}
  ></button>
  <button
    type="button"
    class="absolute top-0 right-4 left-4 h-full cursor-ew-resize outline-0"
    aria-label="Adjusts cue position"
    data-edge="both"
    use:tooltip={op
      ? `${formatTime((timelineDuration * start) / timelineWidth)} - ${formatTime((timelineDuration * end) / timelineWidth)}`
      : 'Adjust cue position'}
    {onpointerdown}
  ></button>
  <button
    type="button"
    class="absolute top-0 right-0 h-full w-4 cursor-e-resize outline-0"
    aria-label="Adjusts cue end"
    data-edge="end"
    use:tooltip={op ? formatTime((timelineDuration * end) / timelineWidth) : 'Adjust cue end'}
    {onpointerdown}
  ></button>
</span>
