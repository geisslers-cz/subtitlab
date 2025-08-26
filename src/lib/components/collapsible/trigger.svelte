<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from '$lib/utils';

  export type TriggerProps = {
    class?: ClassValue;
    child?: Snippet<[props: Record<string, unknown>]>;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils';
  import Arrow from './arrow.svelte';
  import { useCollapsible } from './context.svelte';

  const ctx = useCollapsible();

  let { class: className, child, children }: TriggerProps = $props();

  function onclick(): void {
    ctx.toggle();
  }
</script>

{#if child}
  {@render child({ 'aria-controls': ctx.id, class: className, onclick })}
{:else}
  <button
    type="button"
    class={cn('flex cursor-pointer items-center gap-1', className)}
    aria-controls={ctx.id}
    {onclick}
  >
    {@render children?.()}
    <Arrow />
  </button>
{/if}
