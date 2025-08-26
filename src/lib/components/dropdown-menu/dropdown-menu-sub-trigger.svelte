<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
  import { Icon } from '$lib/components/icon';
  import { cn } from '$lib/utils';

  let {
    ref = $bindable(null),
    class: className,
    inset,
    children,
    ...restProps
  }: DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean;
  } = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
  bind:ref
  data-slot="dropdown-menu-sub-trigger"
  data-inset={inset}
  class={cn(
    "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_[data-slot=icon]:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_[data-slot=icon]]:shrink-0",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  <Icon class="icon-[lucide--chevron-right] ml-auto" />
</DropdownMenuPrimitive.SubTrigger>
