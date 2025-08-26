<script module lang="ts">
  import { type FontMetadata, type FontStorage, getProjectFonts } from '$lib/data';
  import type { ProjectContext } from '$lib/state';

  function* resolveMissing(project: ProjectContext, fonts: FontStorage): Iterable<FontMetadata> {
    if (project.loading) {
      return;
    }

    for (const font of getProjectFonts(project.current.settings)) {
      if (!fonts.available.has(font.id)) {
        yield font;
      }
    }
  }
</script>

<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import * as Table from '$lib/components/table';
  import { tooltip } from '$lib/components/tooltip';
  import { useFontStorage } from '$lib/data';
  import { useProjectContext } from '$lib/state';
  import { fontWeights } from '$lib/utils';
  import RemoveFont from './remove-font.svelte';

  const project = useProjectContext();
  const fonts = useFontStorage();
</script>

<Table.Root>
  <Table.Body>
    {#each resolveMissing(project, fonts) as font (font.id)}
      {@render row(font, true)}
    {/each}
    {#each fonts.available.values() as font (font.id)}
      {@render row(font)}
    {/each}
  </Table.Body>
</Table.Root>

{#snippet row(font: FontMetadata, missing = false)}
  <Table.Row>
    <Table.Cell class="w-px">
      {#if missing}
        <button
          class="flex cursor-pointer items-center"
          use:tooltip={'Font is used in project, but not available'}
        >
          <Icon class="icon-[lucide--triangle-alert] text-destructive" />
        </button>
      {/if}
    </Table.Cell>
    <Table.Cell>
      {font.family}
    </Table.Cell>
    <Table.Cell class="text-muted-foreground">
      {font.weight ? fontWeights.get(font.weight) : 'any'}
    </Table.Cell>
    <Table.Cell class="text-muted-foreground">
      {font.style ?? 'any'}
    </Table.Cell>
    <Table.Cell class="w-px">
      {#if !missing}
        <RemoveFont id={font.id} family={font.family} />
      {/if}
    </Table.Cell>
  </Table.Row>
{/snippet}
