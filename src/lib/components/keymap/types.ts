import type { Keymap } from './keymap';

export interface KeymapContext {
  use(keymap: Keymap | 'none'): () => void;
}
