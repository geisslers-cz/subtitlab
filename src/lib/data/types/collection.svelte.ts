import { SvelteMap } from 'svelte/reactivity';
import { EventDispatcher } from '$lib/utils';
import { ChildNode, type ParentOf } from './node.svelte';
import type { UndoManager } from './undo.svelte';

export interface CollectionEvents<Item> {
  attached: Item;
  detached: Item;
}

export class Collection<Item extends ChildNode<any, Item>, Data>
  extends EventDispatcher<CollectionEvents<Item>>
  implements Iterable<Item>
{
  readonly #parent: ParentOf<Item>;
  readonly #history: UndoManager;
  readonly #create: (data: Partial<Data>) => Item;
  readonly #items: Item[];
  readonly #map: Map<string, Item> = new SvelteMap();

  constructor(
    parent: ParentOf<Item>,
    history: UndoManager,
    data: Data[],
    create: (data: Partial<Data>) => Item,
  ) {
    super();
    this.#parent = parent;
    this.#history = history;
    this.#create = create;
    const items = data.map(create);
    this.#items = $state(items);

    for (const item of items) {
      this.#map.set(item.id, item);
      item.attach(this.#parent);
    }
  }

  get length(): number {
    return this.#items.length;
  }

  create(data: Partial<Data> = {}): Item {
    return this.#create(data);
  }

  insert(item: Item, index: number = this.#items.length): void {
    this.#history.add(
      () => {
        this.#items.splice(index, 0, item);
        this.#map.set(item.id, item);
        item.attach(this.#parent);
        this.emit('attached', item);
      },
      () => {
        this.emit('detached', item);
        item.detach();
        this.#items.splice(index, 1);
        this.#map.delete(item.id);
      },
    );
  }

  remove(id: string): void;
  remove(item: Item): void;
  remove(itemOrId: Item | string): void {
    const item = typeof itemOrId === 'string' ? this.#map.get(itemOrId) : itemOrId;

    if (!item) {
      return;
    }

    const idx = this.#items.indexOf(item);

    this.#history.add(
      () => {
        this.emit('detached', item);
        item.detach();
        this.#items.splice(idx, 1);
        this.#map.delete(item.id);
      },
      () => {
        this.#items.splice(idx, 0, item);
        this.#map.set(item.id, item);
        item.attach(this.#parent);
        this.emit('attached', item);
      },
    );
  }

  get(key: string, need: true): Item;
  get(key: string, need?: false): Item | undefined;
  get(index: number, need: true): Item;
  get(index: number, need?: false): Item | undefined;
  get(key: number | string, need: boolean = false): Item | undefined {
    return this.#throwIfNeeded(
      typeof key === 'string' ? this.#map.get(key) : this.#items[key],
      need,
    );
  }

  get first(): Item | undefined {
    return this.#items[0];
  }

  get last(): Item | undefined {
    return this.#items[this.#items.length - 1];
  }

  indexOf(id: string): number;
  indexOf(item: Item): number;
  indexOf(item: Item | string): number {
    const value = typeof item === 'string' ? this.#map.get(item) : item;
    return value ? this.#items.indexOf(value) : -1;
  }

  find(predicate: (item: Item, index: number) => boolean): Item | undefined {
    return this.#items.find(predicate);
  }

  findLast(predicate: (item: Item, index: number) => boolean): Item | undefined {
    return this.#items.findLast(predicate);
  }

  findIndex(predicate: (item: Item, index: number) => boolean): number {
    return this.#items.findIndex(predicate);
  }

  map<R>(callback: (item: Item, index: number) => R): R[] {
    return this.#items.map(callback);
  }

  sort(compare: (a: Item, b: Item) => number): void {
    this.#items.sort(compare);
  }

  toArray(): Item[] {
    return this.#items.slice();
  }

  *[Symbol.iterator](): IterableIterator<Item> {
    yield* this.#items;
  }

  #throwIfNeeded(item: Item | undefined, need: boolean): Item | undefined {
    if (!item && need) {
      throw new Error(`Item not found`);
    }

    return item;
  }
}
