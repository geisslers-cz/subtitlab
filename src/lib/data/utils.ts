import { SvelteMap } from 'svelte/reactivity';
import type { Act, AnyCue, AnyScene, FontMetadata, Settings, SettingsData } from './types';

export type CueChain<Cue extends AnyCue = AnyCue> = Map<Cue, 'waiting' | 'show' | 'hide'>;

export type Cursor = {
  act: Act;
  scene: AnyScene;
  cue?: AnyCue;
};

export type Playhead<Cue extends AnyCue = AnyCue> = {
  chain: CueChain<Cue>;
  t0: number;
};

export type EditContext<Cue extends AnyCue = AnyCue> = {
  chain: CueChain<Cue>;
  target: Cue;
  content: string;
};

export function resolveChain<Cue extends AnyCue>(cue: Cue): CueChain<Cue> {
  const chain: CueChain<Cue> = new SvelteMap();

  while (cue.previous?.chain) {
    cue = cue.previous as Cue;
  }

  let cursor: Cue | undefined = cue;

  do {
    chain.set(cursor, 'waiting');
  } while (cursor.chain && (cursor = cursor.next as Cue | undefined));

  return chain;
}

export function firstInChain<Cue extends AnyCue>(chain: CueChain<Cue>): Cue | undefined {
  for (const cue of chain.keys()) {
    return cue;
  }

  return undefined;
}

export function lastInChain<Cue extends AnyCue>(chain: CueChain<Cue>): Cue | undefined {
  return [...chain.keys()].pop();
}

export function lastShown<Cue extends AnyCue>(chain: CueChain<Cue>): Cue | undefined {
  return [...chain]
    .filter(([, state]) => state !== 'waiting')
    .map(([cue]) => cue)
    .pop();
}

export function getProjectFonts(settings?: Settings | SettingsData): FontMetadata[] {
  const fonts: FontMetadata[] = [];

  if (typeof settings?.fontFamily === 'object') {
    fonts.push(settings.fontFamily);
  }

  return fonts;
}
