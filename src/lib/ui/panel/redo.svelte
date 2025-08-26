<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type RedoProps = {
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useProjectContext, useUiContext } from '$lib/state';

  const project = useProjectContext();
  const ui = useUiContext();

  let rest: RedoProps = $props();
  let elem: HTMLElement | null = $state(null);

  $effect(() =>
    ui.keymap.add('Ctrl+Shift+z', () => {
      elem?.click();
    }),
  );

  function onclick(): void {
    project.current.history.redo();
  }
</script>

<Button
  bind:ref={elem}
  variant="ghost"
  size="icon"
  disabled={project.loading || !project.current.history.canRedo}
  {...rest}
  {onclick}
>
  <Icon class="icon-[lucide--redo] size-6" />
</Button>
