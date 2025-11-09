<script module lang="ts">
</script>

<script lang="ts">
  import { Separator } from '$lib/components/separator';
  import { ManualCue, TimedScene } from '$lib/data';
  import { useProjectContext, useUiContext } from '$lib/state';
  import { EditTimeline } from '$lib/ui/timeline-editor';
  import AddCue from './add-cue.svelte';
  import ChainCue from './chain-cue.svelte';
  import EditCue from './edit-cue.svelte';
  import ReformatCue from './reformat-cue.svelte';
  import RemoveCue from './remove-cue.svelte';
  import SetMidiTrigger from './set-midi-trigger.svelte';

  const project = useProjectContext();
  const ui = useUiContext();

  let disabled = $derived(project.loading);
  let midiTarget = $derived(
    ui.cursor
      ? ui.cursor.cue
        ? ui.cursor.cue instanceof ManualCue
          ? ui.cursor.cue
          : undefined
        : ui.cursor.scene instanceof TimedScene
          ? ui.cursor.scene
          : undefined
      : undefined,
  );
</script>

<div class="text-muted-foreground flex items-center gap-0.5">
  <EditCue cue={ui.cursor?.cue} />
  <ReformatCue cue={ui.cursor?.cue} />
  <ChainCue cue={ui.cursor?.cue} />
  <SetMidiTrigger bind:target={midiTarget} />
  <Separator orientation="vertical" class="my-1 h-auto! self-stretch" />
  <AddCue scene={ui.cursor?.scene} after={ui.cursor?.cue} {disabled} />
  <EditTimeline scene={ui.cursor?.scene instanceof TimedScene ? ui.cursor.scene : undefined} />
  <Separator orientation="vertical" class="my-1 h-auto! self-stretch" />
  <RemoveCue cue={ui.cursor?.cue} />
</div>
