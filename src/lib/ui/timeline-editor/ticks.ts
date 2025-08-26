import type { TimelinePaintProps } from '$lib/components/audio-player';
import { formatTime } from '$lib/utils';
import { waveformHeight } from './utils';

const tickIntervals = [60, 30, 15, 10, 5, 1, 0.5, 0.25, 0.1];
const pxPerTick = 150;
const y0 = waveformHeight - 10;
const y1 = waveformHeight;

export function timeTicks({
  ctx,
  width,
  viewStart,
  viewLength,
  devicePixelRatio,
}: TimelinePaintProps): void {
  const n = Math.floor(width / (devicePixelRatio * pxPerTick));
  const interval = tickIntervals.find((i) => i * n < viewLength);

  if (interval === undefined) {
    return;
  }

  ctx.strokeStyle = 'oklch(0.35 0.006 286.033)';
  ctx.fillStyle = 'oklch(0.35 0.006 286.033)';
  ctx.lineWidth = 2;
  ctx.font = `${12 * devicePixelRatio}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  ctx.beginPath();
  ctx.moveTo(0, waveformHeight * devicePixelRatio);
  ctx.lineTo(width, waveformHeight * devicePixelRatio);
  ctx.stroke();

  const t0 = interval * Math.ceil(viewStart / interval);

  for (let i = 0; i * interval < viewLength; ++i) {
    const t = t0 - viewStart + i * interval;
    const x = width * (t / viewLength);

    ctx.beginPath();
    ctx.moveTo(x, y0 * devicePixelRatio);
    ctx.lineTo(x, y1 * devicePixelRatio);
    ctx.stroke();

    ctx.fillText(formatTime(viewStart + t, interval < 1), x, y0 * devicePixelRatio);
  }
}

export function bpmTicks(T0?: number, bpm?: number) {
  return ({ ctx, width, viewStart, viewLength, devicePixelRatio }: TimelinePaintProps): void => {
    if (T0 === undefined || bpm === undefined) {
      return;
    }

    const interval = 60 / bpm;
    const t0 = T0 + interval * Math.ceil((viewStart - T0) / interval);

    ctx.strokeStyle = 'oklch(0.35 0.006 286.033)';
    ctx.lineWidth = 2;

    for (let i = 0; i * interval < viewLength; ++i) {
      const t = t0 - viewStart + i * interval;
      const x = width * (t / viewLength);

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 10 * devicePixelRatio);
      ctx.stroke();
    }
  };
}
