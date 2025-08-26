<script module lang="ts">
  import type { AnyCue } from '$lib/data';

  export type ReformatCueProps = {
    cue: AnyCue;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useUiContext } from '$lib/state';

  const ui = useUiContext();

  let { cue }: ReformatCueProps = $props();

  function onclick(): void {
    ui.reformat(cue);
  }
</script>

<Button variant="ghost" size="xs" tooltip="Reformat cue" {onclick}>
  <Icon class="icon-[lucide--wand-sparkles]" />
  <span class="sr-only">Reformat cue</span>
</Button>
