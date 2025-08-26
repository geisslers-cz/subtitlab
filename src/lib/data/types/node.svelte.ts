import { randomId } from '$lib/utils';
import type { Collection } from './collection.svelte';

export abstract class Node {
  constructor(readonly id: string = randomId()) {}
}

export abstract class ChildNode<
  Parent extends Node,
  Siblings extends ChildNode<any, any>,
> extends Node {
  #parent?: Parent;

  constructor(id?: string) {
    super(id);
  }

  get attached(): boolean {
    return this.#parent !== undefined;
  }

  get parent(): Parent {
    if (!this.#parent) {
      throw new Error('Node is detached');
    }

    return this.#parent;
  }

  lookup<T extends Node>(type: abstract new (...args: any) => T, need?: true): T;
  lookup<T extends Node>(type: abstract new (...args: any) => T, need: false): T | undefined;
  lookup<T extends Node>(
    type: abstract new (...args: any) => T,
    need: boolean = true,
  ): T | undefined {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: Node | undefined = this;

    do {
      if (cursor instanceof type) {
        return cursor;
      }
    } while ((cursor = cursor instanceof ChildNode ? cursor.parent : undefined));

    if (need) {
      throw new Error(`Unable to locate node of type ${type.name} from ${this.constructor.name}`);
    }

    return undefined;
  }

  attach(parent: Parent): void {
    this.#parent = parent;
  }

  detach(): void {
    this.#parent = undefined;
  }

  get previous(): Siblings | undefined {
    const idx = this.#parent ? this.siblings.indexOf(this.id) : -1;
    return idx < 1 ? undefined : this.siblings.get(idx - 1);
  }

  get next(): Siblings | undefined {
    const idx = this.#parent ? this.siblings.indexOf(this.id) : -1;
    return idx < 0 ? undefined : this.siblings.get(idx + 1);
  }

  protected abstract get siblings(): Collection<Siblings, any>;
}

export type ParentOf<N extends ChildNode<any, any>> = N extends ChildNode<infer P, any> ? P : never;
