<script module lang="ts">
  import type { AnyCue, AnyScene } from '$lib/data';

  export type AddCueProps = {
    scene?: AnyScene;
    after?: AnyCue;
    disabled?: boolean;
    class?: string;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useUiContext } from '$lib/state';

  let { scene, after, disabled, class: className }: AddCueProps = $props();

  const ui = useUiContext();

  function onclick(): void {
    ui.addCue(scene, after);
  }
</script>

<Button variant="ghost" size="xs" tooltip="Add cue" class={className} {disabled} {onclick}>
  <Icon class="icon-[lucide--list-plus]" />
  <span class="sr-only">Add cue</span>
</Button>
