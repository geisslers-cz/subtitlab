<script module lang="ts">
  import type { Playhead, TimedCue } from '$lib/data';

  export type PreviewProps = {
    chains: Iterable<TimedCue[]>;
    currentTime: number;
  };

  function getCurrentChain(
    chains: Iterable<TimedCue[]>,
    currentTime: number,
  ): TimedCue[] | undefined {
    for (const chain of chains) {
      if (chain[0].from <= currentTime && chain.some((cue) => cue.to > currentTime)) {
        return chain;
      }
    }

    return undefined;
  }
</script>

<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import { box } from 'svelte-toolbelt';
  import { EmbedRenderer, ProjectorContent } from '$lib/components/projector';
  import { useFontStorage } from '$lib/data';
  import { useProjectContext, useUiContext } from '$lib/state';

  const project = useProjectContext();
  const fonts = useFontStorage();
  const ui = useUiContext();

  let { chains, currentTime }: PreviewProps = $props();
  let cues = $derived(getCurrentChain(chains, currentTime));
  let playhead: Playhead<TimedCue> | undefined = $derived(
    cues ? { chain: new SvelteMap(cues.map((cue) => [cue, 'waiting'])), t0: 0 } : undefined,
  );

  const projectorProps = box.flatten({
    settings: box.with(() => project.current.settings),
    fonts: box.with(() => fonts),
    playhead: box.with(() => playhead),
  });

  $effect(() => {
    if (!playhead) {
      return;
    }

    for (const cue of playhead.chain.keys()) {
      if (cue.from > currentTime) {
        playhead.chain.set(cue, 'waiting');
      } else if (cue.to > currentTime) {
        playhead.chain.set(cue, 'show');
      } else {
        playhead.chain.set(cue, 'hide');
      }
    }
  });
</script>

<div class="relative grow">
  <EmbedRenderer
    aspectRatio={ui.aspectRatio}
    content={ProjectorContent}
    props={projectorProps}
    class="absolute top-0 left-0 h-full w-auto -translate-x-1/2 rounded-md border"
  />
</div>
