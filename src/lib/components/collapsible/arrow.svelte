<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type ArrowProps = {
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { cn } from '$lib/utils';
  import { useCollapsible } from './context.svelte';

  const ctx = useCollapsible();

  let { class: className }: ArrowProps = $props();
</script>

<Icon
  class={cn(
    'icon-[lucide--chevron-right] transition-transform',
    ctx.open && 'rotate-90',
    className,
  )}
/>
