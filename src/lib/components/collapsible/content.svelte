<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from '$lib/utils';

  export type ContentProps = {
    class?: ClassValue;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils';
  import { useCollapsible } from './context.svelte';
  import { expand } from './expand';

  const ctx = useCollapsible();

  let { class: className, children }: ContentProps = $props();
</script>

<div id={ctx.id} aria-expanded={ctx.open}>
  {#if ctx.open}
    <div class={cn('overflow-hidden', className)} transition:expand>
      {@render children?.()}
    </div>
  {/if}
</div>
