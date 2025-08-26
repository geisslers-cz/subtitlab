export type Oklch = {
  lightness: number; // 0-1
  chroma: number; // 0-0.4
  hue: number; // deg (0-360)
  alpha?: number; // 0-1
};

export function oklch(lightness: number, chroma: number, hue: number, alpha?: number): Oklch {
  return { lightness, chroma, hue, alpha };
}

oklch.toCSS = (color: Oklch): string => {
  const alpha = color.alpha !== undefined ? ` / ${color.alpha}` : '';
  return `oklch(${color.lightness}% ${color.chroma} ${color.hue}deg${alpha})`;
};
