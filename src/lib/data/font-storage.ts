import { del, getMany, set } from 'idb-keyval';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { randomId } from '$lib/utils';
import { CustomFont, type FontMetadata } from './types';

type ImportFontMetadata = Omit<FontMetadata, 'id'> & { id?: string };

const ctxKey = Symbol('font storage');

export function createFontStorage(): FontStorage {
  const storage = new FontStorage();
  setContext(ctxKey, storage);
  return storage;
}

export function useFontStorage(): FontStorage {
  return getContext(ctxKey);
}

export class FontStorage {
  readonly #meta: Map<string, FontMetadata> = loadFontList();
  readonly #fonts: Map<string, CustomFont> = new Map();

  get available(): Map<string, FontMetadata> {
    return this.#meta;
  }

  async import(file: File, { id = randomId(), ...metadata }: ImportFontMetadata): Promise<void> {
    const meta: FontMetadata = { id, ...metadata };
    this.#meta.set(meta.id, meta);
    this.#fonts.set(meta.id, new CustomFont(meta, file));

    await set(`font:${meta.id}`, file);
    saveFontList(this.#meta);
  }

  async remove(id: string): Promise<void> {
    await this.#fonts.get(id)?.destroy();
    this.#fonts.delete(id);
    this.#meta.delete(id);
    await del(`font:${id}`);
    saveFontList(this.#meta);
  }

  loadAll(fonts: FontMetadata[]): CustomFont[] {
    const filesToLoad: Map<string, (file: File | undefined) => void> = new Map();
    const loaded = fonts.map((meta) => {
      const existing = this.#fonts.get(meta.id);

      if (existing) {
        return existing;
      }

      const [font, fileLoaded] = this.#loadMeta(meta);
      this.#fonts.set(meta.id, font);

      if (fileLoaded) {
        filesToLoad.set(meta.id, fileLoaded);
      }

      return font;
    });

    if (filesToLoad.size) {
      void this.#loadData(filesToLoad);
    }

    return loaded;
  }

  #loadMeta(meta: FontMetadata): [font: CustomFont, loaded?: (file: File | undefined) => void] {
    const data = this.#meta.get(meta.id);

    if (!data) {
      return [new CustomFont(meta)];
    }

    const { promise, resolve } = Promise.withResolvers<File | undefined>();
    return [new CustomFont(data, promise), resolve];
  }

  async #loadData(ids: Map<string, (file: File | undefined) => void>): Promise<void> {
    try {
      const files = await getMany([...ids.keys()].map((id) => `font:${id}`));
      let idx = 0;

      for (const resolve of ids.values()) {
        const file = files[idx++];
        resolve(file instanceof File ? file : undefined);
      }
    } catch (e: unknown) {
      console.log('Error loading fonts:', e);

      for (const resolve of ids.values()) {
        resolve(undefined);
      }
    }
  }
}

function loadFontList(): Map<string, FontMetadata> {
  const data = localStorage.getItem('font-list');

  if (data === null) {
    return new SvelteMap();
  }

  return new SvelteMap(Object.entries(JSON.parse(data) as Record<string, FontMetadata>));
}

function saveFontList(list: Map<string, FontMetadata>): void {
  if (!list.size) {
    localStorage.removeItem('font-list');
    return;
  }

  window.localStorage.setItem('font-list', JSON.stringify(Object.fromEntries(list)));
}
