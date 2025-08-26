export function formatTime(s: number, ms: boolean = true): string {
  const m = Math.floor(s / 60);
  s -= m * 60;
  return `${m}:${s.toFixed(ms ? 3 : 0).padStart(ms ? 6 : 2, '0')}`;
}
