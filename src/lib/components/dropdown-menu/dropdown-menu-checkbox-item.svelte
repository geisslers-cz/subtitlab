<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import { Icon } from '$lib/components/icon';
  import { cn, type WithoutChildrenOrChild } from '$lib/utils';

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    children: childrenProp,
    ...restProps
  }: WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
    children?: Snippet;
  } = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
  bind:ref
  bind:checked
  bind:indeterminate
  data-slot="dropdown-menu-checkbox-item"
  class={cn(
    'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_[data-slot=icon]]:shrink-0',
    className,
  )}
  {...restProps}
>
  {#snippet children({ checked, indeterminate })}
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      {#if indeterminate}
        <Icon class="icon-[lucide--minus]" />
      {:else}
        <Icon class={['icon-[lucide--check]', !checked && 'text-transparent']} />
      {/if}
    </span>
    {@render childrenProp?.()}
  {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
