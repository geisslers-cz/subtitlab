<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type MidiInputsProps = {
    id?: string;
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import { Icon } from '$lib/components/icon';
  import * as Select from '$lib/components/select';
  import { useUiContext } from '$lib/state';
  import { cn } from '$lib/utils';

  const ui = useUiContext();

  let { id, class: className }: MidiInputsProps = $props();

  const enabled = box.with(
    () => [...ui.midi.enabled.keys()],
    (enabled) => {
      for (const id of ui.midi.inputs.keys()) {
        ui.midi.toggle(id, enabled.includes(id));
      }

      for (const { id } of ui.midi.missing) {
        ui.midi.toggle(id, enabled.includes(id));
      }
    },
  );

  async function onclick(evt: MouseEvent): Promise<void> {
    if (ui.midi.permission === 'prompt') {
      evt.preventDefault();
      await ui.midi.init();
    }
  }
</script>

{#if ui.midi.permission === undefined}
  <em class="text-muted-foreground">Checking MIDI access...</em>
{:else if ui.midi.permission === 'denied'}
  <span class="text-destructive">MIDI disabled</span>
{:else}
  <Select.Root type="multiple" bind:value={enabled.current}>
    <Select.Trigger
      {id}
      class={cn(
        'grid items-center',
        ui.midi.missing.size
          ? 'grid-cols-[1fr_min-content_min-content]'
          : 'grid-cols-[1fr_min-content]',
        className,
      )}
      {onclick}
    >
      <span class="overflow-hidden text-start text-ellipsis whitespace-nowrap">
        {#if ui.midi.enabled.size > 1}
          {ui.midi.enabled.size} devices
        {:else if ui.midi.enabled.size}
          {#each ui.midi.enabled.values() as input (input.id)}
            {input.name ?? 'unknown'} {input.manufacturer && `(${input.manufacturer})`}
          {/each}
        {:else}
          <em class="text-muted-foreground">select device(s)</em>
        {/if}
      </span>
      {#if ui.midi.missing.size}
        <Icon class="icon-[lucide--triangle-alert] text-destructive ml-auto" />
      {/if}
    </Select.Trigger>
    <Select.Content>
      {#if ui.midi.missing.size}
        <Select.Group>
          <Select.GroupHeading>Missing devices</Select.GroupHeading>
          {#each ui.midi.missing as input (input.id)}
            <Select.Item value={input.id} class="text-destructive">
              {input.name ?? 'unknown'}
              {input.manufacturer && `(${input.manufacturer})`}
            </Select.Item>
          {/each}
        </Select.Group>
      {/if}
      <Select.Group>
        <Select.GroupHeading>Available devices</Select.GroupHeading>
        {#each ui.midi.inputs.values() as input (input.id)}
          <Select.Item value={input.id}>
            {input.name ?? 'unknown'}
            {input.manufacturer && `(${input.manufacturer})`}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
{/if}
