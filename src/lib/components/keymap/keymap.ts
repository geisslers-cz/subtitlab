export type KeyHandler = (key: string) => boolean | void;

export class Keymap {
  readonly #handlers: Map<string, KeyHandler> = new Map();
  #active: boolean = false;

  constructor(handlers?: Record<string, KeyHandler>) {
    if (handlers) {
      for (const [key, handler] of Object.entries(handlers)) {
        this.#handlers.set(key, handler);
      }
    }
  }

  handle = (key: string): boolean => {
    if (!this.#active) {
      return false;
    }

    const handler = this.#handlers.get(key);
    return handler ? handler(key) !== false : false;
  };

  add(key: string, handler: KeyHandler): () => void {
    this.#handlers.set(key, handler);

    return () => {
      this.#handlers.delete(key);
    };
  }

  setActive(active: boolean): void {
    this.#active = active;
  }
}
