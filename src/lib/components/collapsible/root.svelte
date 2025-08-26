<script module lang="ts">
  import type { Snippet } from 'svelte';

  export type RootProps = {
    id?: string;
    open?: boolean;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { useId } from 'bits-ui';
  import { createCollapsible } from './context.svelte';

  let { id = useId('collapsible'), open = $bindable(false), children }: RootProps = $props();

  createCollapsible(
    () => id,
    () => open,
    (o) => (open = o),
  );
</script>

{@render children?.()}
