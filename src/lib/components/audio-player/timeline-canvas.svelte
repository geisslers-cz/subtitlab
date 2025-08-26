<script module lang="ts">
  export type TimelinePaintProps = {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    viewStart: number;
    viewLength: number;
    devicePixelRatio: number;
  };

  export type TimelineCanvasProps = {
    viewStart: number;
    viewLength: number;
    paint: (props: TimelinePaintProps) => void;
  };
</script>

<script lang="ts">
  let { viewStart, viewLength, paint }: TimelineCanvasProps = $props();
  let canvas: HTMLCanvasElement | undefined = $state();
  let ctx: CanvasRenderingContext2D | undefined = $derived(canvas?.getContext('2d') ?? undefined);
  let canvasWidth = $state(0);
  let canvasHeight = $state(0);
  let devicePixelRatio: number = $state(1);

  $effect(() => {
    if (!canvas || !ctx || !canvasWidth || !canvasHeight) {
      return;
    }

    const width = (canvas.width = canvasWidth * devicePixelRatio);
    const height = (canvas.height = canvasHeight * devicePixelRatio);
    paint({ ctx, width, height, viewStart, viewLength, devicePixelRatio });
  });
</script>

<svelte:window bind:devicePixelRatio />

<canvas
  bind:this={canvas}
  bind:offsetWidth={canvasWidth}
  bind:offsetHeight={canvasHeight}
  class="absolute top-0 left-0 size-full rounded-[inherit]"
></canvas>
