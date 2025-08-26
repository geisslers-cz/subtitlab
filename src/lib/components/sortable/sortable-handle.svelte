<script module lang="ts">
  import type { Snippet } from 'svelte';

  export type SortableHandleProps = {
    key?: string;
    child?: Snippet<[props: Record<string, unknown>]>;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { getSortableListContext } from './sortable-list.svelte';

  let { key, child, children }: SortableHandleProps = $props();

  const list = getSortableListContext();

  let handleProps = $derived({
    'data-drag-handle': key ?? list.key,
  });
</script>

{#if child}
  {@render child(handleProps)}
{:else}
  <div style:display="contents" {...handleProps}>
    {@render children?.()}
  </div>
{/if}
