<script module lang="ts">
  import type { TimedCue } from '$lib/data';

  export type TimelineProps = {
    chains: Iterable<TimedCue[]>;
    timelineWidth: number;
    timelineDuration: number;
    viewStart: number;
    viewLength: number;
    peaksHeight: number;
  };

  function* extractChains(
    chains: Iterable<TimedCue[]>,
    viewStart: number,
    viewLength: number,
  ): Iterable<TimedCue[]> {
    for (const chain of chains) {
      if (chain[0].from > viewStart + 3 * viewLength) {
        continue;
      }

      for (let i = chain.length - 1; i >= 0; --i) {
        if (chain[i].to > viewStart - 2 * viewLength) {
          yield chain;
          break;
        }
      }
    }
  }
</script>

<script lang="ts">
  import TimelineCue from './timeline-cue.svelte';

  let {
    chains,
    timelineWidth,
    timelineDuration,
    viewStart,
    viewLength,
    peaksHeight,
  }: TimelineProps = $props();
  let dragDx: number | undefined = $state();
</script>

<div class="relative h-full" style:--peaks-height={peaksHeight} style:--drag-dx={dragDx}>
  {#each extractChains(chains, viewStart, viewLength) as chain (chain
    .map((cue) => cue.id)
    .join('|'))}
    {#each chain as cue, chainIdx (cue.id)}
      <TimelineCue {cue} {chainIdx} {timelineWidth} {timelineDuration} bind:dragDx />
    {/each}
  {/each}
</div>
