<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type ModeSwitchProps = {
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils';

  let { class: className }: ModeSwitchProps = $props();

  function get(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  function set(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
</script>

<label
  class={cn(
    'border-input bg-secondary w-11 cursor-pointer rounded-full border p-1',
    'hover:ring-1',
    'group/mode-switch',
    className,
  )}
>
  <input type="checkbox" bind:checked={get, set} class="sr-only" />
  <span
    class={[
      'flex size-4 items-center rounded-full',
      'transition-transform group-has-[input:checked]/mode-switch:translate-x-4.5',
    ]}
  >
    <span
      class="icon-[lucide--sun] group-has-[input:checked]/mode-switch:icon-[lucide--moon] size-4"
    ></span>
  </span>
</label>
