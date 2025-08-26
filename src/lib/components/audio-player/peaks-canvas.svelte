<script module lang="ts">
  export type PeaksCanvasProps = {
    viewStart: number;
    viewLength: number;
    peaks: number[];
    height?: number;
  };
</script>

<script lang="ts">
  import TimelineCanvas, { type TimelinePaintProps } from './timeline-canvas.svelte';
  import { peaksPerSecond } from './utils';

  let { peaks, height: maxHeight, ...rest }: PeaksCanvasProps = $props();

  function paint({
    ctx,
    width,
    height: canvasHeight,
    viewStart,
    viewLength,
    devicePixelRatio,
  }: TimelinePaintProps): void {
    const height = maxHeight ? maxHeight * devicePixelRatio : canvasHeight;
    const i0 = Math.floor(viewStart * peaksPerSecond);
    const n = Math.floor(viewLength * peaksPerSecond);

    ctx.strokeStyle = 'oklch(0.705 0.015 286.067)';
    ctx.lineWidth = (0.5 * width) / n;

    for (let i = 0; i < n; ++i) {
      const spl = peaks[i0 + i];
      const h = spl * height;
      const x = (width * i) / n;
      const y = (height - h) / 2;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.stroke();
    }

    ctx.strokeStyle = 'oklch(0.274 0.006 286.033)';
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 5]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
</script>

<TimelineCanvas {paint} {...rest} />
