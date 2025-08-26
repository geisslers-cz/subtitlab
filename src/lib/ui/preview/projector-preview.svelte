<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { EmbedRenderer, ProjectorContent } from '$lib/components/projector';
  import { useUiContext } from '$lib/state';
  import { merge } from '$lib/utils';

  const ui = useUiContext();
  const props = merge(
    ui.projectorProps,
    box.flatten({
      editing: box.with(() => ui.editing),
    }),
  );
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center px-2">
    <h3>{ui.editing ? 'Preview' : 'Output'}</h3>
    <Button
      variant="ghost"
      size="xs"
      class="text-muted-foreground ml-auto"
      tooltip="Open projector"
      onclick={() => ui.openProjector()}
    >
      <Icon class="icon-[lucide--screen-share]" />
    </Button>
  </div>

  <EmbedRenderer
    aspectRatio={ui.aspectRatio}
    content={ProjectorContent}
    {props}
    class="rounded-md border"
  />
</div>
