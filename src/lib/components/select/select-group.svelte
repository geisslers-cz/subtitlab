<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SelectPrimitive.GroupProps = $props();
</script>

<SelectPrimitive.Group
  data-slot="select-group"
  class={cn('not-first:mt-2', className)}
  {...restProps}
/>
