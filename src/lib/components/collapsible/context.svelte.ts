import { getContext, setContext } from 'svelte';

export interface CollapsibleContext {
  readonly id: string;
  readonly open: boolean;
  toggle(open?: boolean): void;
}

export class DefaultCollapsibleContext implements CollapsibleContext {
  #id: () => string;
  #open: { get: () => boolean; set: (open: boolean) => void };

  constructor(id: () => string, get: () => boolean, set: (open: boolean) => void) {
    this.#id = id;
    this.#open = { get, set };
  }

  get id(): string {
    return this.#id();
  }

  get open(): boolean {
    return this.#open.get();
  }

  toggle = (open?: boolean): void => {
    this.#open.set(open ?? !this.#open.get());
  };
}

const key = Symbol('collapsible');

export function createCollapsible(
  id: () => string,
  get: () => boolean,
  set: (open: boolean) => void,
): CollapsibleContext {
  const ctx = new DefaultCollapsibleContext(id, get, set);
  setContext(key, ctx);
  return ctx;
}

export function useCollapsible(): CollapsibleContext {
  return getContext(key);
}
