<script module lang="ts">
  export type FontManagerProps = {
    open?: boolean;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import * as Dialog from '$lib/components/dialog';
  import FontList from './font-list.svelte';
  import ImportFont from './import-font.svelte';

  let { open = $bindable(false) }: FontManagerProps = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content showCloseButton={false} class="gap-2">
    <Dialog.Header class="flex flex-row items-center border-b px-2">
      <Dialog.Title class="py-2">Font manager</Dialog.Title>
      <div class="ml-auto flex items-center gap-1">
        <ImportFont />
      </div>
    </Dialog.Header>
    <FontList />
    <Dialog.Footer class="flex items-center justify-end">
      <Button variant="secondary" onclick={() => (open = false)}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
