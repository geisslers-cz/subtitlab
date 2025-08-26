<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from '$lib/utils';

  export type ProjectManagerProps = {
    open?: boolean;
    class?: ClassValue;
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import * as Dialog from '$lib/components/dialog';
  import { Icon } from '$lib/components/icon';
  import { useProjectContext } from '$lib/state';
  import ConfirmCloseCurrent from './confirm-close-current.svelte';
  import ImportProject from './import-project.svelte';
  import ProjectList from './project-list.svelte';

  const ctx = useProjectContext();

  let { open = $bindable(false), class: className, trigger }: ProjectManagerProps = $props();

  function create(): void {
    ctx.create();
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={className} child={trigger} />
  <Dialog.Content showCloseButton={false} class="gap-2">
    <Dialog.Header class="flex flex-row items-center border-b px-2">
      <Dialog.Title class="py-2">Projects</Dialog.Title>
      <div class="ml-auto flex items-center gap-1">
        <ImportProject />
        <ConfirmCloseCurrent execute={create}>
          {#snippet child(props)}
            <Button variant="ghost" size="xs" tooltip="New" {...props}>
              <Icon class="icon-[lucide--file-plus-2]" />
              <span class="sr-only">New project</span>
            </Button>
          {/snippet}
        </ConfirmCloseCurrent>
      </div>
    </Dialog.Header>
    <ProjectList close={() => (open = false)} />
    <Dialog.Footer class="flex items-center justify-end">
      <Button variant="secondary" onclick={() => (open = false)}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
