<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { ScrollArea } from '$lib/components/scroll-area';
  import { SortableCollection, SortableItem } from '$lib/components/sortable';
  import { TimedScene } from '$lib/data';
  import { useProjectContext } from '$lib/state';
  import AddAct from './add-act.svelte';
  import AddScene from './add-scene.svelte';
  import EntryTitle from './entry-title.svelte';
  import Remove from './remove.svelte';
  import Rename from './rename.svelte';

  const project = useProjectContext();
</script>

<div class="-mx-2 flex grow flex-col gap-2">
  <div class="mx-2 flex items-center border-b px-1 pb-2">
    <h3 class="grow px-1.5">Index</h3>
    <AddAct class="text-muted-foreground" />
  </div>

  <ScrollArea orientation="vertical" class="grow">
    <SortableCollection
      key="acts"
      items={project.loading ? undefined : project.current.acts}
      class="m-0 flex list-none flex-col px-3 py-2 [&_[data-slot=icon]]:shrink-0"
    >
      {#if project.loading}
        <li class="text-muted-foreground flex items-center justify-center py-1">
          <Icon class="icon-[lucide--loader] animate-spin" />
        </li>
      {:else}
        {#each project.current.acts as act (act.id)}
          <SortableItem id={act.id} class="[&.sortable-drag]:bg-secondary!">
            <div class="hover:bg-muted/50 relative flex items-center rounded">
              <EntryTitle icon="icon-[lucide--book]" select={() => act.scenes.first}>
                {act.title}
              </EntryTitle>
              <AddScene {act} class="text-muted-foreground" />
              <Rename type="act" target={act} class="text-muted-foreground" />
              <Remove
                type="act"
                target={project.current.acts}
                item={act}
                class="text-muted-foreground"
              />
            </div>
            <SortableCollection
              key="scenes"
              items={act.scenes}
              class="m-0 ml-4 flex list-none flex-col p-0"
            >
              {#each act.scenes as scene (scene.id)}
                <SortableItem id={scene.id} class="hover:bg-muted/50 flex items-center rounded">
                  <EntryTitle
                    icon={scene instanceof TimedScene
                      ? 'icon-[lucide--image-down]'
                      : 'icon-[lucide--image]'}
                    select={() => scene}
                  >
                    {scene.title}
                  </EntryTitle>
                  <Rename type="scene" target={scene} class="text-muted-foreground" />
                  <Remove
                    type="scene"
                    target={act.scenes}
                    item={scene}
                    class="text-muted-foreground"
                  />
                </SortableItem>
              {/each}
            </SortableCollection>
          </SortableItem>
        {/each}
      {/if}
    </SortableCollection>
  </ScrollArea>

  <hr class="mx-2" />
</div>
