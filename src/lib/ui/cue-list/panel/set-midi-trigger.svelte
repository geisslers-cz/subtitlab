<script module lang="ts">
  import type { ManualCue, TimedScene } from '$lib/data';

  export type SetMidiTriggerProps = {
    target?: ManualCue | TimedScene;
    isOpen?: boolean;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { SetMidiTrigger } from '$lib/components/midi';

  let { target = $bindable(), isOpen = $bindable(false) }: SetMidiTriggerProps = $props();
</script>

{#if target}
  <SetMidiTrigger bind:isOpen bind:trigger={target.trigger}>
    {#snippet child({ props })}
      <Button variant="ghost" size="xs" active={!!target.trigger} {...props} tooltip="MIDI trigger">
        <Icon class="icon-[lucide--keyboard-music]" />
        <span class="sr-only">MIDI trigger</span>
      </Button>
    {/snippet}
  </SetMidiTrigger>
{:else}
  <Button variant="ghost" size="xs" disabled tooltip="MIDI trigger">
    <Icon class="icon-[lucide--keyboard-music]" />
    <span class="sr-only">MIDI trigger</span>
  </Button>
{/if}
