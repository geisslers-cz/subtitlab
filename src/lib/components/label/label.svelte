<script lang="ts">
  import { Label as LabelPrimitive } from 'bits-ui';
  import { tooltip } from '$lib/components/tooltip';
  import { cn } from '$lib/utils';

  let {
    ref = $bindable(null),
    class: className,
    tooltip: tt,
    ...restProps
  }: LabelPrimitive.RootProps & {
    tooltip?: string;
  } = $props();
</script>

<LabelPrimitive.Root
  bind:ref
  data-slot="label"
  class={cn(
    'flex cursor-pointer items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    className,
  )}
  {...tooltip.attach(() => tt)}
  {...restProps}
/>
