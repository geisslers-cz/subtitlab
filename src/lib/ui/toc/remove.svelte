<script module lang="ts">
  import { ChildNode, Collection } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export interface RemovableItem {
    title: string;
  }

  export type RemoveProps<T extends ChildNode<any, T> & RemovableItem> = {
    type: string;
    target: Collection<T, any>;
    item: T;
    class?: ClassValue;
  };
</script>

<script lang="ts" generics="T extends ChildNode<any, T> & RemovableItem">
  import { Confirm } from '$lib/components/alert-dialog';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';

  let { type, target = $bindable(), item, class: className }: RemoveProps<T> = $props();

  function execute(): void {
    target.remove(item);
  }
</script>

<Confirm
  {execute}
  destructive
  title={`Are you sure you want to remove ${type} '${item.title}'?`}
  class={className}
>
  {#snippet child({ props })}
    <Button variant="ghost" size="xs" tooltip="Remove" {...props}>
      <Icon class="icon-[lucide--trash]" />
      <span class="sr-only">Remove</span>
    </Button>
  {/snippet}
</Confirm>
