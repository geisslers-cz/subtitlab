<script module lang="ts">
  import { getContext, type Snippet } from 'svelte';
  import type { ClassValue } from '$lib/utils';
  import type { SortableItem } from './sortable.svelte';

  export type SortableListProps<T extends SortableItem> = {
    key: string;
    items: Iterable<T>;
    getItem: (id: string) => T;
    removeFromGroup: (item: T) => void;
    insertIntoGroup: (item: T, index?: number) => void;
    disabled?: boolean;
    class?: ClassValue;
    child?: Snippet<[props: Record<string, unknown>, items: Iterable<T>]>;
    children?: Snippet;
  };

  const ctxKey = Symbol('sortable list');

  export type SortableListContext = {
    key: string;
  };

  export function getSortableListContext(): SortableListContext {
    return getContext(ctxKey);
  }
</script>

<script lang="ts" generics="T extends SortableItem">
  import { setContext } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { box } from 'svelte-toolbelt';
  import { cn } from '$lib/utils';
  import { sortable } from './sortable.svelte';

  let {
    key,
    items,
    getItem,
    removeFromGroup,
    insertIntoGroup,
    disabled = false,
    class: className,
    child,
    children,
  }: SortableListProps<T> = $props();

  setContext(ctxKey, box.flatten({ key: box.with(() => key) }));

  let listProps = $derived({
    [createAttachmentKey()]: sortable({
      key,
      getItem,
      removeFromGroup,
      insertIntoGroup,
      isDisabled: () => disabled,
    }),
    class: cn(
      'data-[sortable-active]:outline-2',
      'data-[sortable-active]:outline-ring',
      'data-[sortable-active]:outline-offset-2',
      className,
    ),
  });
</script>

{#if child}
  {@render child(listProps, items)}
{:else}
  <ul {...listProps}>
    {@render children?.()}
  </ul>
{/if}
