<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { FontMetadata, FontStorage } from '$lib/data';

  export type FontLoaderProps = {
    storage: FontStorage;
    window?: Window;
    document?: Document;
    fonts: FontMetadata[];
    children?: Snippet;
  };

  async function loadFonts(
    win: Window,
    doc: Document,
    storage: FontStorage,
    fonts: FontMetadata[],
  ): Promise<void> {
    doc.fonts.clear();

    await Promise.all(
      storage.loadAll(fonts).map(async (font) => {
        await font.loaded;

        if (font.missing) {
          return;
        }

        doc.fonts.add(
          new (win as any).FontFace(font.family, font.url, {
            weight: font.weight?.toString(),
            style: font.style,
          }),
        );
      }),
    );

    await doc.fonts.ready;
  }
</script>

<script lang="ts">
  let {
    window: win = window,
    document: doc = document,
    storage,
    fonts,
    children,
  }: FontLoaderProps = $props();
</script>

{#await loadFonts(win, doc, storage, fonts) then _}
  {@render children?.()}
{/await}
