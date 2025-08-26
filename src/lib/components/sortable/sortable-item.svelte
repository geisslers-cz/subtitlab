<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from '$lib/utils';

  export type SortableItemProps = {
    id: string;
    class?: ClassValue;
    handle?: boolean | string;
    child?: Snippet<[props: Record<string, unknown>]>;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils';
  import { getSortableListContext } from './sortable-list.svelte';

  const list = getSortableListContext();

  let { id, class: className, handle = false, child, children }: SortableItemProps = $props();

  let itemProps = $derived({
    class: cn('[&.sortable-ghost]:opacity-0', className),
    'data-drag-handle': typeof handle === 'string' ? handle : handle ? list.key : undefined,
    'data-id': id,
  });
</script>

{#if child}
  {@render child(itemProps)}
{:else}
  <li {...itemProps}>
    {@render children?.()}
  </li>
{/if}
