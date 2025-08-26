<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useLaydownContext } from './context.svelte';

  const ctx = useLaydownContext();
</script>

<div class="flex items-center gap-2">
  <Button
    variant={ctx.active ? 'destructive' : 'ghost'}
    size="icon"
    tooltip="Lay down cues while playing"
    class="text-muted-foreground"
    onclick={() => (ctx.active = !ctx.active)}
  >
    <Icon class="icon-[lucide--clapperboard]" />
  </Button>

  <div
    class="h-9 min-w-0 grow overflow-hidden rounded bg-black p-2 text-sm text-ellipsis whitespace-nowrap"
  >
    {ctx.next}
  </div>
</div>
