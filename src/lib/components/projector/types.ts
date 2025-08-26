import type { FontStorage, Playhead, Settings } from '$lib/data';

export type ProjectorProps = {
  settings: Settings;
  fonts: FontStorage;
  playhead?: Playhead;
};
