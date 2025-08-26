<script module lang="ts">
  export type ProjectListProps = {
    close?: () => void;
  };

  const df = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
</script>

<script lang="ts">
  import * as Table from '$lib/components/table';
  import { useProjectContext } from '$lib/state';
  import ConfirmCloseCurrent from './confirm-close-current.svelte';
  import ExportProject from './export-project.svelte';
  import RemoveProject from './remove-project.svelte';

  const ctx = useProjectContext();

  let { close }: ProjectListProps = $props();

  function openProject(id: string): void {
    ctx.open(id);
    close?.();
  }
</script>

<Table.Root>
  <Table.Body>
    {#each ctx.projects as [id, meta] (id)}
      <Table.Row>
        <Table.Cell>
          <ConfirmCloseCurrent execute={() => openProject(id)} class="cursor-pointer">
            {#snippet child(props)}
              <button type="button" {...props}>
                {meta.title}
              </button>
            {/snippet}
          </ConfirmCloseCurrent>
        </Table.Cell>
        <Table.Cell class="text-muted-foreground">{df.format(meta.ts)}</Table.Cell>
        <Table.Cell class="w-px">
          <div class="flex items-center gap-1">
            <ExportProject {id} />
            <RemoveProject {id} title={meta.title} />
          </div>
        </Table.Cell>
      </Table.Row>
    {:else}
      <Table.Row>
        <Table.Cell colspan={3} class="py-4 text-muted-foreground text-center">
          No saved projects
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
