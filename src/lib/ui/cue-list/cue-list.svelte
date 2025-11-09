<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { ScrollArea } from '$lib/components/scroll-area';
  import { SortableCollection } from '$lib/components/sortable';
  import { type AnyCue, type Collection, TimedScene } from '$lib/data';
  import { useProjectContext } from '$lib/state';
  import Cue from './cue/cue.svelte';
  import Panel from './panel/panel.svelte';
  import SceneHeader from './scene/scene-header.svelte';

  const project = useProjectContext();
</script>

<div class="flex h-full flex-col">
  <div class="mx-2 flex items-center border-b px-1 pb-2">
    <h3 class="grow px-2">Cues</h3>
    <Panel />
  </div>
  <ScrollArea class="grow">
    <ul class="m-0 list-none px-3 pt-2 pb-6">
      {#if project.loading}
        <li class="flex items-center justify-center py-6">
          <Icon class="icon-[lucide--loader] text-muted-foreground animate-spin" />
        </li>
      {:else}
        {#each project.current.acts as act (act.id)}
          {#each act.scenes as scene (scene.id)}
            <li class="pb-2">
              <SceneHeader {act} {scene} />
              <SortableCollection
                key="cues"
                items={scene.cues as Collection<AnyCue, any>}
                disabled={scene instanceof TimedScene}
                class="text-muted-foreground flex flex-col gap-0.5"
              >
                {#each scene.cues as cue (cue.id)}
                  <Cue {cue} />
                {/each}
              </SortableCollection>
            </li>
          {/each}
        {/each}
      {/if}
    </ul>
  </ScrollArea>

  <hr class="mx-2" />
</div>
