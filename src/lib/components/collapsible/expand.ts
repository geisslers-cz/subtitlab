import { sineInOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function expand(node: Element): TransitionConfig {
  const { height } = node.getBoundingClientRect();

  return {
    duration: Math.max(150, Math.min(750, 0.35 * height)),
    easing: sineInOut,
    css: (t) => `height: ${height * t}px`,
  };
}
