<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import { Icon } from '$lib/components/icon';
  import { cn, type WithoutChildrenOrChild } from '$lib/utils';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
  bind:ref
  data-slot="select-scroll-up-button"
  class={cn('flex cursor-default items-center justify-center py-1', className)}
  {...restProps}
>
  <Icon class="icon-[lucide--chevron-up]" />
</SelectPrimitive.ScrollUpButton>
