<script lang="ts">
  import { useAudioPlayer } from '$lib/components/audio-player';
  import { Icon } from '$lib/components/icon';
  import { waveformHeight } from './utils';

  const player = useAudioPlayer();

  function clear(): FileList | undefined {
    return new DataTransfer().files;
  }

  function load(files: FileList | undefined): void {
    player.load(files?.item(0) ?? undefined);
  }
</script>

{#if player.loading}
  <div
    class="text-muted-foreground/50 absolute top-0 left-0 flex w-full items-center justify-center"
    style:height={`${waveformHeight}px`}
  >
    <Icon class="icon-[lucide--disc-3] size-12 animate-spin" />
  </div>
{:else if !player.duration}
  <label
    class="text-muted-foreground/50 hover:text-muted-foreground absolute top-0 left-0 flex w-full cursor-pointer flex-col items-center justify-center text-xs outline-0"
    style:height={`${waveformHeight}px`}
  >
    <Icon class="icon-[lucide--step-forward] size-12 -rotate-90" />
    click to load audio file
    <input type="file" class="sr-only" accept="audio/*,video/*" bind:files={clear, load} />
  </label>
{/if}
