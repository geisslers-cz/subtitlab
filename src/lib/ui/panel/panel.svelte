<script lang="ts">
  import { ModeSwitch } from '$lib/components/mode-switch';
  import { useProjectContext } from '$lib/state';
  import Logo from './logo.svelte';
  import OpenProjectManager from './open-project-manager.svelte';
  import Redo from './redo.svelte';
  import { SaveProject } from './save-project';
  import Undo from './undo.svelte';

  const project = useProjectContext();
</script>

<div class="flex flex-row items-center gap-4 p-4">
  <Logo class="size-10" />
  <h1 class="text-2xl">
    {#if project.loading}
      <em class="text-muted-foreground">Loading project...</em>
    {:else}
      {project.current.title}{project.current.history.atSavePoint ? '' : '*'}
    {/if}
  </h1>
  <div class="ml-auto flex flex-row items-center gap-2">
    <OpenProjectManager />
    <SaveProject />
    <Undo />
    <Redo />
    <ModeSwitch />
  </div>
</div>
