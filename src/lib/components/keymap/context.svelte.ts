import { Keymap } from './keymap';
import type { KeymapContext } from './types';

export class DefaultKeymapContext implements KeymapContext {
  readonly #stack: Keymap[] = [];
  #current?: Keymap;

  use(keymap: Keymap | 'none'): () => void {
    if (this.#current) {
      this.#current.setActive(false);
      this.#stack.push(this.#current);
    }

    const map = keymap === 'none' ? new Keymap() : keymap;
    this.#current = map;
    map.setActive(true);

    return () => {
      map.setActive(false);

      if (map === this.#current) {
        this.#current = this.#stack.pop();
        this.#current?.setActive(true);
      } else {
        const idx = this.#stack.indexOf(map);

        if (idx >= 0) {
          this.#stack.splice(idx, 1);
        }
      }
    };
  }

  handle = (key: string): boolean => {
    return this.#current?.handle(key) ?? false;
  };
}
