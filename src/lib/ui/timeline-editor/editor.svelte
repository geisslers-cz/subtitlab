<script module lang="ts">
  import type { TimedScene } from '$lib/data';
  import type { EditorKeymap } from './keymap';

  export type EditorProps = {
    scene: TimedScene;
    keymap: EditorKeymap;
    close?: () => void;
  };
</script>

<script lang="ts">
  import * as AudioPlayer from '$lib/components/audio-player';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useProjectContext, useUiContext } from '$lib/state';
  import { cn } from '$lib/utils';
  import GridSettings from './grid-settings.svelte';
  import { createLaydownContext, LaydownControls } from './laydown';
  import LoadFile from './load-file.svelte';
  import PlayerControls from './player-controls.svelte';
  import Preview from './preview.svelte';
  import { bpmTicks, timeTicks } from './ticks';
  import Timeline from './timeline.svelte';
  import { waveformHeight } from './utils';
  import Zoom from './zoom.svelte';

  const player = AudioPlayer.useAudioPlayer();
  const project = useProjectContext();
  const ui = useUiContext();

  let { scene, keymap, close }: EditorProps = $props();
  let gridOffset = $state(0);
  let bpm: number | undefined = $state();
  const laydown = createLaydownContext(scene, player, project);

  $effect(() => keymap.useContext(ui, player, laydown));
</script>

<div class="flex grow flex-col gap-6 py-6" data-vaul-no-drag>
  <div class="relative">
    <h4 class="text-muted-foreground text-center text-2xl">
      {scene.parent.title} / {scene.title}
    </h4>
    <Button
      variant="ghost"
      size="icon"
      tooltip="Close"
      class="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2"
      onclick={close}
    >
      <Icon class="icon-[lucide--x]" />
    </Button>
  </div>
  <div class="flex grow flex-col items-center">
    <Preview chains={laydown.getChains()} currentTime={player.currentTime} />
  </div>
  <div class="relative border-t border-b">
    <AudioPlayer.Timeline
      class="bg-secondary h-72 dark:bg-black"
      minDuration={(scene.cues.last?.to ?? 0) + 30}
      peaks={{ height: waveformHeight }}
      layers={[timeTicks, bpmTicks(gridOffset, bpm)]}
    >
      {#snippet content({ width, duration, viewStart, viewLength })}
        <Timeline
          chains={laydown.getChains()}
          timelineWidth={width}
          timelineDuration={duration}
          {viewStart}
          {viewLength}
          peaksHeight={waveformHeight}
        />
      {/snippet}
    </AudioPlayer.Timeline>
    <Zoom class="absolute top-2 right-2" />
    <LoadFile />
  </div>
  <div
    class={cn(
      'grid grid-cols-[min-content_min-content_1fr] items-center gap-4 px-4',
      !player.duration && 'pointer-events-none opacity-0',
    )}
  >
    <PlayerControls />
    <GridSettings {keymap} bind:offset={gridOffset} bind:bpm />
    <LaydownControls />
  </div>
</div>
