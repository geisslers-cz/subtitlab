<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import { useProjectContext } from '$lib/state';
  import { CueList } from '$lib/ui/cue-list';
  import { Midi } from '$lib/ui/midi';
  import { Panel } from '$lib/ui/panel';
  import { ProjectorPreview } from '$lib/ui/preview';
  import { Settings } from '$lib/ui/settings';
  import { TableOfContents } from '$lib/ui/toc';

  const ctx = useProjectContext();
  let expanded: 'settings' | 'midi' | undefined = $state();

  const expand = box.flatten({
    settings: box.with(
      () => expanded === 'settings',
      (on) => (expanded = on ? 'settings' : undefined),
    ),
    midi: box.with(
      () => expanded === 'midi',
      (on) => (expanded = on ? 'midi' : undefined),
    ),
  });
</script>

<Panel />

<div class="grid grow grid-cols-[16rem_1fr_30rem] gap-4 p-4">
  <div class="flex flex-col gap-4">
    <TableOfContents />

    {#if !ctx.loading}
      <Settings bind:open={expand.settings} />
      <Midi bind:open={expand.midi} />
    {/if}
  </div>

  <CueList />

  <div class="flex flex-col gap-4">
    {#if !ctx.loading}
      <ProjectorPreview />
    {/if}
  </div>
</div>
