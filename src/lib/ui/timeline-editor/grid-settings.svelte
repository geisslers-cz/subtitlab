<script module lang="ts">
  import type { ClassValue } from '$lib/utils';
  import type { EditorKeymap } from './keymap';

  export type GridSettingsProps = {
    keymap: EditorKeymap;
    offset?: number;
    bpm?: number;
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { useAudioPlayer } from '$lib/components/audio-player';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { Input, TimeInput } from '$lib/components/input';
  import { Label } from '$lib/components/label';
  import { cn, formatTime } from '$lib/utils';

  const player = useAudioPlayer();

  let {
    keymap,
    offset = $bindable(0),
    bpm = $bindable(),
    class: className,
  }: GridSettingsProps = $props();
  let inpBpm: HTMLInputElement | null = $state(null);

  $effect(() => keymap.add('t', tap));

  const taps: number[] = [];
  let last: number = 0;

  function tap(): void {
    const now = Date.now();

    if (last < now - 3000) {
      taps.length = 0;
    } else {
      taps.push(now - last);
    }

    last = now;

    if (taps.length > 2) {
      bpm = Math.round(60000 / (taps.reduce((sum, dt) => sum + dt) / taps.length));
      setTimeout(() => inpBpm?.blur(), 100);
    }

    if (taps.length > 3) {
      taps.shift();
    }
  }
</script>

<div class={cn('flex items-center gap-2', className)}>
  <Label for="inp-editor-grid-bpm" tooltip="BPM" onmousedown={tap} class="px-1">
    <Icon class="icon-[mdi--metronome]" />
    <span class="sr-only">BPM</span>
  </Label>
  <Input
    bind:ref={inpBpm}
    id="inp-editor-grid-bpm"
    type="number"
    min={1}
    max={512}
    step={1}
    bind:value={bpm}
    class="h-8 w-16 appearance-none px-2 py-0.5 text-center"
  />
  <Label for="inp-editor-grid-offset" tooltip="Grid offset" class="px-1">
    <span class="tracking-[-0.125em]">
      T<sub>0</sub>
    </span>
    <span class="sr-only">Grid offset</span>
  </Label>
  <TimeInput id="inp-editor-grid-offset" bind:value={offset} class="h-8 w-20 px-2 py-0.5" />
  <Button
    variant="ghost"
    size="xs"
    active={offset === player.currentTime}
    onclick={() => (offset = player.currentTime)}
    tooltip={`Set to current position (${formatTime(player.currentTime)})`}
  >
    <Icon class="icon-[lucide--flip-horizontal]" />
    <span class="sr-only">Set to current position</span>
  </Button>
</div>
