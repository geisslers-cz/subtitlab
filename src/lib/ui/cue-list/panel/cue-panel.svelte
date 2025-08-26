<script module lang="ts">
  import type { AnyCue } from '$lib/data';

  export type CuePanelProps = {
    cue: AnyCue;
    show?: boolean;
  };
</script>

<script lang="ts">
  import { Separator } from '$lib/components/separator';
  import { ManualCue } from '$lib/data';
  import AddCue from './add-cue.svelte';
  import ChainCue from './chain-cue.svelte';
  import EditCue from './edit-cue.svelte';
  import ReformatCue from './reformat-cue.svelte';
  import RemoveCue from './remove-cue.svelte';
  import SetMidiTrigger from './set-midi-trigger.svelte';

  let { cue, show }: CuePanelProps = $props();
  let force = $state(false);
</script>

{#if show || force}
  <div
    class="bg-popover text-muted-foreground absolute top-full right-8 z-50 flex -translate-y-2 items-center gap-0.5 rounded-md border px-1 py-0.5 shadow-md"
  >
    <EditCue {cue} />
    <ReformatCue {cue} />
    {#if cue instanceof ManualCue}
      <ChainCue {cue} />
      <SetMidiTrigger bind:target={cue} bind:isOpen={force} />
    {/if}
    <Separator orientation="vertical" class="my-1 h-auto! self-stretch" />
    <AddCue scene={cue.parent} after={cue} />
    <Separator orientation="vertical" class="my-1 h-auto! self-stretch" />
    <RemoveCue {cue} />
  </div>
{/if}
