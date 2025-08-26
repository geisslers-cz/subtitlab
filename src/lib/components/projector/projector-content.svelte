<script module lang="ts">
  import type { EditContext } from '$lib/data';
  import type { ProjectorProps } from './types';

  export type ProjectorContentProps = ProjectorProps & {
    win: Window;
    doc: Document;
    editing?: EditContext;
  };
</script>

<script lang="ts">
  import { FontLoader } from '$lib/components/font-loader';
  import { getProjectFonts } from '$lib/data';
  import ProjectorCues from './projector-cues.svelte';
  import ProjectorMain from './projector-main.svelte';

  let { win, doc, fonts, settings, playhead, editing }: ProjectorContentProps = $props();
</script>

<FontLoader window={win} document={doc} storage={fonts} fonts={getProjectFonts(settings)}>
  <ProjectorMain {settings} transitions={!editing}>
    {#if editing}
      {#each editing.chain.keys() as cue (cue.id)}
        <p data-state="show" style:opacity={cue !== editing.target ? 0.5 : 1}>
          {cue === editing.target ? editing.content : cue.content}
        </p>
      {/each}
    {:else}
      <ProjectorCues {doc} {playhead} transitionOutDuration={settings.transitionOut?.duration} />
    {/if}
  </ProjectorMain>
</FontLoader>
