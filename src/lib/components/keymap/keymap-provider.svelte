<script module lang="ts">
  import { getContext } from 'svelte';
  import { DefaultKeymapContext } from './context.svelte';
  import type { Keymap } from './keymap';
  import type { KeymapContext } from './types';

  const contextKey = Symbol('keymap');

  export function useKeymapContext(): KeymapContext {
    return getContext(contextKey);
  }

  export function useKeymap(keymap: Keymap | 'none'): void {
    const ctx = useKeymapContext();
    $effect(() => ctx.use(keymap));
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { composeKey } from '$lib/utils';

  let { children } = $props();

  const ctx = new DefaultKeymapContext();
  setContext(contextKey, ctx);

  $effect(() => {
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  });

  function handleKey(evt: KeyboardEvent): void {
    if (evt.target instanceof Element && evt.target.closest('input, select, textarea')) {
      return;
    }

    if (ctx.handle(composeKey(evt))) {
      evt.preventDefault();
    }
  }
</script>

{@render children?.()}
