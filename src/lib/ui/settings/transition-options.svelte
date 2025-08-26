<script module lang="ts">
  import type { Transition } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type TransitionOptionsProps = {
    transition?: Transition;
    id?: string;
    class?: ClassValue;
  };

  const transitions: Map<string, string> = new Map([
    ['none', 'none'],
    ['fade', 'fade'],
    ['blur', 'blur'],
    ['fly-up', 'fly up'],
    ['fly-down', 'fly down'],
    ['fly-left', 'fly left'],
    ['fly-right', 'fly right'],
  ]);
</script>

<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import { Input } from '$lib/components/input';
  import * as Select from '$lib/components/select';
  import { cn } from '$lib/utils';

  let { transition = $bindable(), id, class: className }: TransitionOptionsProps = $props();

  const type = box.with(
    () => transition?.type ?? 'none',
    (type) => {
      if (type === 'none') {
        transition = undefined;
      } else if (transition) {
        transition.type = type;
      } else {
        transition = { type, duration: 200 };
      }
    },
  );

  const duration = box.with(
    () => transition?.duration ?? 0,
    (duration) => {
      if (transition) {
        transition.duration = duration;
      }
    },
  );
</script>

<div class={cn('flex items-center', className)}>
  <Select.Root type="single" bind:value={type.current}>
    <Select.Trigger
      {id}
      data-hasvalue={transition ? true : undefined}
      class="peer data-[hasvalue]:rounded-r-none"
    >
      {#if transition}
        {transitions.get(transition.type)}
      {:else}
        none
      {/if}
    </Select.Trigger>
    <Select.Content>
      {#each transitions as [type, label] (type)}
        <Select.Item value={type}>{label}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  <div class="group relative not-peer-data-[hasvalue]:hidden">
    <Input
      type="number"
      class="peer rounded-l-none border-l-0"
      aria-label="Duration"
      bind:value={duration.current}
      min={50}
      max={5000}
      step={1}
    />
    <span
      class="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm group-focus-within:hidden group-hover:hidden"
    >
      ms
    </span>
  </div>
</div>
