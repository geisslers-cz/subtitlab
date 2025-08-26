<script module lang="ts">
  export type CueTimeProps = {
    label: string;
    value: number;
    min?: number;
    onchange?: (time: number, previous: number) => void;
  };
</script>

<script lang="ts">
  import { TimeInputPrimitive } from '$lib/components/input';
  import { formatTime } from '$lib/utils';

  let { label, value = $bindable(), min = 0, onchange }: CueTimeProps = $props();
  let input: HTMLInputElement | undefined = $state();
  let editing = $state(false);

  $effect(() => {
    input?.focus();
  });

  function ondblclick(): void {
    editing = true;
  }

  function onblur(): void {
    editing = false;
  }
</script>

{#if !editing}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span class="py-2" {ondblclick}>{formatTime(value)}</span>
{:else}
  <TimeInputPrimitive
    bind:ref={input}
    bind:value
    {min}
    class="field-sizing-content min-h-8 py-2 outline-0"
    {onchange}
    {onblur}
    aria-label={label}
  />
{/if}
