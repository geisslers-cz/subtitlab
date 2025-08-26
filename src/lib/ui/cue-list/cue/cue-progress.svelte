<script module lang="ts">
  import type { TimedCue } from '$lib/data';

  export type CueProgressProps = {
    cue: TimedCue;
  };
</script>

<script lang="ts">
  import { useUiContext } from '$lib/state';
  import { cn } from '$lib/utils';

  const ui = useUiContext();

  let { cue }: CueProgressProps = $props();

  let duration = $derived.by(() => {
    switch (ui.playhead?.chain.get(cue)) {
      case 'show':
        return Math.max(0, cue.to - ui.playhead.t0) - Math.max(0, cue.from - ui.playhead.t0);
      case 'waiting':
        return cue.from - ui.playhead.t0;
      default:
        return 0;
    }
  });
</script>

<div role="progressbar" class="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden rounded">
  <span
    class={cn(
      'block h-full transition-none',
      'group-data-[state=waiting]/cue:bg-warning/60',
      'group-data-[state=waiting]/cue:animate-progress-in',
      'group-data-[state=waiting]/cue:origin-left',
      'group-data-[state=show]/cue:bg-destructive/60',
      'group-data-[state=show]/cue:animate-progress-out',
      'group-data-[state=show]/cue:origin-right',
    )}
    style:--duration={duration}
  >
  </span>
</div>
