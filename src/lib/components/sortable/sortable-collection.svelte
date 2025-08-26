<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { ChildNode, Collection } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type SortableCollectionProps<T extends ChildNode<any, T>> = {
    key: string;
    items?: Collection<T, any>;
    disabled?: boolean;
    class?: ClassValue;
    child?: Snippet<[props: Record<string, unknown>, items: Iterable<T>]>;
    children?: Snippet;
  };
</script>

<script lang="ts" generics="T extends ChildNode<any, T>">
  import SortableList from './sortable-list.svelte';

  let { items: collection, ...rest }: SortableCollectionProps<T> = $props();

  let items: Iterable<T> = $derived(collection ?? []);

  function getItem(id: string): T {
    if (!collection) {
      throw new Error();
    }

    return collection.get(id, true);
  }

  function removeFromGroup(item: T): void {
    collection?.remove(item);
  }

  function insertIntoGroup(item: T, index?: number): void {
    collection?.insert(item, index);
  }
</script>

<SortableList {items} {getItem} {removeFromGroup} {insertIntoGroup} {...rest} />
