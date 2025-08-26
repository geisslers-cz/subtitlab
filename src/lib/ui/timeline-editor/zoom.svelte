<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type ZoomProps = {
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { useAudioPlayer } from '$lib/components/audio-player';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { cn } from '$lib/utils';
  import { zoomMultiplier } from './utils';

  const player = useAudioPlayer();

  let { class: className }: ZoomProps = $props();
</script>

<div
  class={cn(
    'bg-popover text-muted-foreground z-50 flex items-center gap-0.5 rounded-md border px-1 py-0.5 shadow-md',
    className,
  )}
>
  <Button
    variant="ghost"
    size="xs"
    tooltip="Zoom in"
    onclick={() => (player.zoom *= zoomMultiplier)}
  >
    <Icon class="icon-[lucide--zoom-in]" />
  </Button>
  <Button
    variant="ghost"
    size="xs"
    tooltip="Zoom out"
    onclick={() => (player.zoom /= zoomMultiplier)}
  >
    <Icon class="icon-[lucide--zoom-out]" />
  </Button>
</div>
