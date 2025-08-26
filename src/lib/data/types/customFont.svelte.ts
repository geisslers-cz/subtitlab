import type { FontMetadata } from './types';

export class CustomFont {
  readonly id: string;
  readonly family: string;
  readonly weight?: number;
  readonly style?: string;

  #loading?: Promise<void> = $state();
  #file?: File = $state();
  #url?: string = $derived(this.#file && URL.createObjectURL(this.#file));

  constructor(meta: FontMetadata, file?: Promise<File | undefined> | File) {
    this.id = meta.id;
    this.family = meta.family;
    this.weight = meta.weight;
    this.style = meta.style;

    if (file instanceof File) {
      this.#file = file;
    } else if (file) {
      this.#loading = file
        .then((f) => {
          this.#file = f;
        })
        .finally(() => {
          this.#loading = undefined;
        });
    }
  }

  get loaded(): Promise<void> {
    return this.#loading ?? Promise.resolve();
  }

  get loading(): boolean {
    return this.#loading !== undefined;
  }

  get file(): File | undefined {
    return this.#file;
  }

  get url(): string | undefined {
    return this.#url;
  }

  get missing(): boolean {
    return !this.loading && !this.file;
  }

  async destroy(): Promise<void> {
    await this.#loading;

    if (this.#url !== undefined) {
      URL.revokeObjectURL(this.#url);
    }

    this.#loading = this.#file = undefined;
  }
}
