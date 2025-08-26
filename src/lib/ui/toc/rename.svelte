<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type RenameProps = {
    type: string;
    target: { title: string };
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { useId } from 'bits-ui';
  import { Button } from '$lib/components/button';
  import * as Dialog from '$lib/components/dialog';
  import { Icon } from '$lib/components/icon';
  import { Input } from '$lib/components/input';
  import { Label } from '$lib/components/label';

  let { type, target, class: className }: RenameProps = $props();
  let value = $derived(target.title);
  let open = $state(false);
  let id = useId('inp-rename');

  function onsubmit(evt: SubmitEvent): void {
    evt.preventDefault();

    if (value.length) {
      target.title = value;
      open = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={className}>
    {#snippet child({ props })}
      <Button variant="ghost" size="xs" tooltip="Rename" {...props}>
        <Icon class="icon-[lucide--square-pen]" />
        <span class="sr-only">Rename</span>
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <form {onsubmit}>
      <Dialog.Header>
        <Dialog.Title>Rename {type}</Dialog.Title>
      </Dialog.Header>
      <div class="py-6">
        <div class="flex flex-row items-center gap-4">
          <Label for={id} class="whitespace-nowrap">New name:</Label>
          <Input name="name" {id} bind:value aria-invalid={!value.length} class="grow" />
        </div>
      </div>
      <Dialog.Footer>
        <Button type="submit" disabled={!value.length}>Rename</Button>
        <Button variant="secondary" onclick={() => (open = false)}>Cancel</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
