import { type Project, projectorArea } from '$lib/data';

export function computeAutoFontSize(project: Project): number {
  const widths: number[] = [];
  let sum = 0;
  let n = 0;

  for (const act of project.acts) {
    for (const scene of act.scenes) {
      for (const cue of scene.cues) {
        if (cue.size) {
          widths.push(cue.size.width);
          sum += cue.size.width;
          ++n;
        }
      }
    }
  }

  const mean = sum / n;
  const stddev = (widths.reduce((s, w) => s + (w - mean) ** 2, 0) / n) ** 0.5;
  let maxWidth = 0;

  for (const width of widths) {
    if (width > maxWidth && width <= mean + 2 * stddev) {
      maxWidth = width;
    }
  }

  const computed = toPrecision(projectorArea * (project.settings.fontSize / maxWidth), 3);
  return computed >= 0.01 && computed <= 0.2 ? computed : project.settings.fontSize;
}

function toPrecision(value: number, precision: number): number {
  const multiplier = 10 ** precision;
  return Math.floor(value * multiplier) / multiplier;
}
