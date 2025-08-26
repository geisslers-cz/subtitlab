<script module lang="ts">
  import type { AnyScene } from '$lib/data';

  export type CuePanelProps = {
    scene: AnyScene;
    show?: boolean;
  };
</script>

<script lang="ts">
  import { Separator } from '$lib/components/separator';
  import { TimedScene } from '$lib/data';
  import { EditTimeline } from '$lib/ui/timeline-editor';
  import AddCue from './add-cue.svelte';
  import SetMidiTrigger from './set-midi-trigger.svelte';

  let { scene, show }: CuePanelProps = $props();
  let midiDlgOpen = $state(false);
  let tlEditorOpen = $state(false);
</script>

{#if show || midiDlgOpen || tlEditorOpen}
  <div
    class="bg-popover text-muted-foreground absolute top-full right-8 z-50 flex -translate-y-2 items-center gap-0.5 rounded-md border px-1 py-0.5 shadow-md"
  >
    {#if scene instanceof TimedScene}
      <EditTimeline
        {scene}
        disabled={!scene.cues.length}
        bind:isOpen={tlEditorOpen}
        class="text-muted-foreground"
      />
      <SetMidiTrigger bind:target={scene} bind:isOpen={midiDlgOpen} />
      <Separator orientation="vertical" class="my-1 h-auto! self-stretch" />
    {/if}
    <AddCue {scene} />
  </div>
{/if}
