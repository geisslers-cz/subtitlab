<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type OpenProjectManagerProps = {
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useUiContext } from '$lib/state';
  import { ProjectManager } from '$lib/ui/project-manager';

  const ui = useUiContext();

  let { class: className }: OpenProjectManagerProps = $props();
  let elem: HTMLElement | null = $state(null);

  $effect(() =>
    ui.keymap.add('Ctrl+o', () => {
      elem?.click();
    }),
  );
</script>

<ProjectManager class={className}>
  {#snippet trigger({ props })}
    <Button bind:ref={elem} variant="ghost" size="icon" {...props} tooltip="Open project">
      <Icon class="icon-[lucide--folder-open] size-6" />
      <span class="sr-only">Open project</span>
    </Button>
  {/snippet}
</ProjectManager>
