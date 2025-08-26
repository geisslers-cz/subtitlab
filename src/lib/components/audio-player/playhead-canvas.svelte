<script module lang="ts">
  export type PlayheadCanvasProps = {
    currentTime: number;
    viewStart: number;
    viewLength: number;
  };
</script>

<script lang="ts">
  import TimelineCanvas, { type TimelinePaintProps } from './timeline-canvas.svelte';

  let { currentTime, ...rest }: PlayheadCanvasProps = $props();

  function paint({ ctx, width, height, viewStart, viewLength }: TimelinePaintProps): void {
    if (currentTime < viewStart || currentTime > viewStart + viewLength) {
      return;
    }

    const x = Math.round(width * ((currentTime - viewStart) / viewLength));

    ctx.strokeStyle = 'oklch(0.6 0.118 184.704)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
</script>

<TimelineCanvas {paint} {...rest} />
