<script lang="ts">
  import { createFontStorage } from '$lib/data';
  import { createProjectContext } from './project-context.svelte';
  import { createUiContext } from './ui-context.svelte';

  let { children } = $props();

  const projectCtx = createProjectContext();
  const fontStorage = createFontStorage();
  createUiContext(projectCtx, fontStorage);
</script>

{@render children?.()}
