<script module lang="ts">
  import { TimedScene } from '$lib/data';
  import type { ClassValue } from '$lib/utils';
  import { EditorKeymap } from './keymap';

  export type EditTimelineProps = {
    scene: TimedScene;
    disabled?: boolean;
    isOpen?: boolean;
    class?: ClassValue;
  };

  const keymap = new EditorKeymap();
</script>

<script lang="ts">
  import { AudioPlayer } from '$lib/components/audio-player';
  import { Button } from '$lib/components/button';
  import * as Drawer from '$lib/components/drawer';
  import { Icon } from '$lib/components/icon';
  import Editor from './editor.svelte';

  let {
    scene,
    disabled,
    isOpen = $bindable(false),
    class: className,
  }: EditTimelineProps = $props();
  let open = $state(false);
</script>

<Drawer.Root
  bind:open
  onOpenChange={(o) => {
    if (o) isOpen = true;
  }}
  onOpenChangeComplete={(o) => {
    if (!o) isOpen = false;
  }}
  dismissible={false}
  {keymap}
>
  <Drawer.Trigger class={className}>
    {#snippet child({ props })}
      <Button variant="ghost" size="xs" {disabled} tooltip="Edit timeline" {...props}>
        <Icon class="icon-[lucide--film]" />
        <span class="sr-only">Edit timeline</span>
      </Button>
    {/snippet}
  </Drawer.Trigger>
  <Drawer.Content
    class={[
      'outline-0',
      'data-[vaul-drawer-direction=bottom]:h-full',
      'data-[vaul-drawer-direction=bottom]:max-h-none',
      'data-[vaul-drawer-direction=bottom]:rounded-none',
    ]}
  >
    <AudioPlayer>
      <Editor {scene} {keymap} close={() => (open = false)} />
    </AudioPlayer>
  </Drawer.Content>
</Drawer.Root>
