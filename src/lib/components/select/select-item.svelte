<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import { Icon } from '$lib/components/icon';
  import { cn, type WithoutChild } from '$lib/utils';

  let {
    ref = $bindable(null),
    class: className,
    value,
    label,
    children: childrenProp,
    ...restProps
  }: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
  bind:ref
  {value}
  data-slot="select-item"
  class={cn(
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_[data-slot=icon]:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_[data-slot=icon]]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
    className,
  )}
  {...restProps}
>
  {#snippet children({ selected, highlighted })}
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      {#if selected}
        <Icon class="icon-[lucide--check]" />
      {/if}
    </span>
    {#if childrenProp}
      {@render childrenProp({ selected, highlighted })}
    {:else}
      {label || value}
    {/if}
  {/snippet}
</SelectPrimitive.Item>
