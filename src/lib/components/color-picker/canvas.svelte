<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from '$lib/utils';

  export type CanvasDrawFn = (
    data: ImageData,
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D,
  ) => void;

  export type CanvasProps = {
    draw: CanvasDrawFn;
    deps?: () => any;
    height?: number;
    onpointer?: (x: number, y: number) => void;
    onend?: () => void;
    class?: ClassValue;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { on } from 'svelte/events';
  import { cn, touch } from '$lib/utils';

  let {
    draw,
    deps,
    height: forcedHeight,
    onpointer,
    onend,
    class: className,
    children,
  }: CanvasProps = $props();
  let canvas: HTMLCanvasElement | undefined = $state();
  let ctx = $derived(canvas?.getContext('2d'));
  let width = $state(0);
  let height = $derived(forcedHeight ?? width);
  let img = $derived(new ImageData(width, height));
  let frame: number | undefined = undefined;

  $effect(() => {
    touch(width, height, draw, img);
    deps?.();

    if (!canvas || !ctx || frame) {
      return;
    }

    frame = requestAnimationFrame(redraw);
  });

  $effect(() => () => frame && cancelAnimationFrame(frame));

  function redraw(): void {
    frame = undefined;

    if (!canvas || !ctx) {
      return;
    }

    canvas.width = width;
    canvas.height = height;

    draw(img, width, height, ctx);
    ctx.putImageData(img, 0, 0);
  }

  function onpointerdown(evt: PointerEvent): void {
    if (!canvas) {
      return;
    }

    update(evt);

    const cleanup: Set<() => void> = new Set();

    canvas.setPointerCapture(evt.pointerId);
    cleanup.add(canvas.releasePointerCapture.bind(canvas, evt.pointerId));
    cleanup.add(on(canvas, 'pointermove', update));
    cleanup.add(on(canvas, 'pointerup', end.bind(null, cleanup)));
    cleanup.add(on(canvas, 'pointercancel', end.bind(null, cleanup)));
  }

  function update(evt: PointerEvent): void {
    evt.preventDefault();
    onpointer?.(
      Math.max(0, Math.min(1, evt.offsetX / width)),
      Math.max(0, Math.min(1, evt.offsetY / height)),
    );
  }

  function end(cleanup: Set<() => void>): void {
    for (const cb of cleanup) {
      cb();
    }

    cleanup.clear();
    onend?.();
  }
</script>

<div
  class={cn(
    'relative shrink-0 touch-none',
    "after:absolute after:top-0 after:left-0 after:size-full after:content-['']",
    className,
  )}
  {onpointerdown}
>
  <canvas bind:this={canvas} bind:offsetWidth={width} class="size-full"></canvas>
  {@render children?.()}
</div>
