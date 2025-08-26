<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type PlayerControlsProps = {
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { useAudioPlayer } from '$lib/components/audio-player';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { cn } from '$lib/utils';

  const player = useAudioPlayer();

  let { class: className }: PlayerControlsProps = $props();
</script>

<div
  class={cn(
    'bg-popover text-muted-foreground flex items-center gap-1 rounded-lg border p-1 shadow-md',
    className,
  )}
>
  <Button
    variant="ghost"
    size="sm"
    tooltip="Restart from beginning"
    disabled={!player.currentTime}
    onclick={() => (player.currentTime = 0)}
  >
    <Icon class="icon-[lucide--skip-back]" />
    <span class="sr-only">Restart from beginning</span>
  </Button>
  <Button
    variant={player.playing ? 'secondary' : 'ghost'}
    size="sm"
    tooltip={player.playing ? 'Pause' : 'Play'}
    disabled={!player.duration}
    active={player.playing}
    onclick={() => (player.playing = !player.playing)}
    class="group/play"
  >
    <Icon class="icon-[lucide--play] group-hover/play:group-data-[active=true]/play:hidden" />
    <Icon
      class="icon-[lucide--pause] hidden group-hover/play:group-data-[active=true]/play:block"
    />
    <span class="sr-only">Play / Pause</span>
  </Button>
  <Button
    variant={player.follow ? 'secondary' : 'ghost'}
    size="sm"
    tooltip="Follow playback"
    active={player.follow !== undefined}
    onclick={() => player.cycleFollow()}
  >
    {#if player.follow === 'window'}
      <Icon class="icon-[lucide--flip-horizontal]" />
    {:else if player.follow === 'instant'}
      <Icon class="icon-[lucide--separator-vertical]" />
    {:else}
      <Icon class="icon-[lucide--unfold-horizontal]" />
    {/if}
    <span class="sr-only">Follow playback</span>
  </Button>
</div>
