<script module lang="ts">
  import type { TimedCue } from '$lib/data';

  export type CueTimesProps = {
    cue: TimedCue;
  };
</script>

<script lang="ts">
  import { useProjectContext } from '$lib/state';
  import CueTime from './cue-time.svelte';

  const project = useProjectContext();

  let { cue }: CueTimesProps = $props();

  function onchange(from: number, prev: number): void {
    cue.to += from - prev;

    if ((!cue.previous || from >= cue.previous.from) && (!cue.next || from <= cue.next.from)) {
      return;
    }

    const order = new Map(cue.parent.cues.toArray().map((cue, i) => [cue, i]));

    project.current.history.add(
      () => cue.parent.cues.sort((a, b) => a.from - b.from),
      () => cue.parent.cues.sort((a, b) => order.get(a)! - order.get(b)!),
    );
  }
</script>

<div class="grid grid-cols-[1fr_min-content_1fr] items-center">
  <CueTime label="Start time" bind:value={cue.from} {onchange} />
  <span class="px-1">&ndash;</span>
  <CueTime label="End time" bind:value={cue.to} min={cue.from} />
</div>
