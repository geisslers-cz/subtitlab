<script module lang="ts">
  import type { AnyCue } from '$lib/data';

  export type EditCueProps = {
    cue?: AnyCue;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useUiContext } from '$lib/state';

  const ui = useUiContext();

  let { cue }: EditCueProps = $props();

  function onclick(): void {
    if (cue) {
      ui.editCue(cue);
    }
  }
</script>

<Button variant="ghost" size="xs" tooltip="Edit cue" {onclick} disabled={!cue}>
  <Icon class="icon-[lucide--pen-square]" />
  <span class="sr-only">Edit cue</span>
</Button>
