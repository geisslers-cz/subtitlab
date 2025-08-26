<script module lang="ts">
  import type { AnyCue } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type CueChainProps = {
    cue: AnyCue;
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils';

  let { cue, class: className }: CueChainProps = $props();
  let previous = $derived(cue.previous);
</script>

<span
  class={cn(
    'text-muted-foreground group/cue-chain relative',
    'flex items-center justify-center self-stretch',
    '[.sortable-drag_&]:opacity-0 [[data-sortable-active]_&]:opacity-0',
    className,
  )}
  data-active={cue.chain || previous?.chain}
>
  <span
    class={cn(
      'inline-block size-2.5 rounded-full border-2 border-current opacity-0',
      'group-data-[active=true]/cue-chain:opacity-100',
    )}
  ></span>
  {#if previous?.chain}
    <span
      class={cn(
        'absolute -top-px bottom-[calc(50%+1.25*var(--spacing))] left-1/2 w-0 -translate-x-px',
        'border-l-2 border-current',
      )}
    ></span>
  {/if}
  {#if cue.chain}
    <span
      class={cn(
        'absolute top-[calc(50%+1.25*var(--spacing))] -bottom-px left-1/2 w-0 -translate-x-px',
        'border-l-2 border-current',
      )}
    ></span>
  {/if}
</span>
