<script module lang="ts">
  export type SortableGripProps = {
    class?: string;
  };
</script>

<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { cn } from '$lib/utils';

  let { class: className }: SortableGripProps = $props();
</script>

<Icon
  class={cn(
    'icon-[lucide--grip-vertical]',
    'text-muted-foreground absolute top-1/2 right-full size-3 -translate-y-1/2 opacity-0',
    '[[data-sortable-active=true]_&]:opacity-0 [[data-sortable-disabled=true]_&]:opacity-0',
    className,
  )}
/>
