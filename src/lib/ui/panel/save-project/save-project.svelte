<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type SaveProjectProps = {
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useProjectContext, useUiContext } from '$lib/state';
  import SaveNew from './save-new.svelte';

  const project = useProjectContext();
  const ui = useUiContext();

  let rest: SaveProjectProps = $props();
  let elem: HTMLElement | null = $state(null);

  $effect(() =>
    ui.keymap.add('Ctrl+s', () => {
      elem?.click();
    }),
  );

  function onclick(): void {
    project.save();
  }
</script>

{#if project.loading || project.projects.has(project.current.id)}
  {@render btn({
    props: { ...rest, disabled: project.loading || !project.current.dirty, onclick },
  })}
{:else}
  <SaveNew {...rest} child={btn} />
{/if}

{#snippet btn({ props }: { props: Record<string, unknown> })}
  <Button bind:ref={elem} variant="ghost" size="icon" tooltip="Save project" {...props}>
    <Icon class="icon-[lucide--save] size-6" />
  </Button>
{/snippet}
