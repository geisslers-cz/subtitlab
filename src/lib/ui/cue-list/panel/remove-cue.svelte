<script module lang="ts">
  import type { AnyCue } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type RemoveCueProps = {
    cue: AnyCue;
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useUiContext } from '$lib/state';

  const ui = useUiContext();

  let { cue, class: className }: RemoveCueProps = $props();

  function onclick(): void {
    ui.removeCue(cue);
  }
</script>

<Button variant="ghost" size="xs" tooltip="Remove" class={className} {onclick}>
  <Icon class="icon-[lucide--trash]" />
  <span class="sr-only">Remove</span>
</Button>
