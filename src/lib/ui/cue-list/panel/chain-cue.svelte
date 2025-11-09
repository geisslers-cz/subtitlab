<script module lang="ts">
  import type { AnyCue } from '$lib/data';

  export type ChainCueProps = {
    cue?: AnyCue;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { ManualCue } from '$lib/data';

  let { cue }: ChainCueProps = $props();

  function onclick(): void {
    if (cue && cue.previous instanceof ManualCue) {
      cue.previous.chain = !cue.previous.chain;
    }
  }
</script>

<Button
  variant="ghost"
  size="xs"
  disabled={!cue || !cue.previous || !(cue instanceof ManualCue)}
  active={cue && cue.previous?.chain}
  tooltip="Chain with previous cue"
  {onclick}
>
  <Icon class="icon-[lucide--git-pull-request-create-arrow]" />
  <span class="sr-only">Chain with previous cue</span>
</Button>
