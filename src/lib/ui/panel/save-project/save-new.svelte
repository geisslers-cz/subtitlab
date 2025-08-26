<script lang="ts">
  import { Button } from '$lib/components/button';
  import * as Dialog from '$lib/components/dialog';
  import { Input } from '$lib/components/input';
  import { Label } from '$lib/components/label';
  import { useProjectContext } from '$lib/state';

  const ctx = useProjectContext();

  let rest: Record<string, unknown> = $props();
  let value = $state(ctx.current.title);
  let open = $state(false);

  function onsubmit(evt: SubmitEvent): void {
    evt.preventDefault();

    if (value.length) {
      ctx.current.title = value;
      ctx.save();
      open = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger {...rest} />
  <Dialog.Content>
    <form {onsubmit}>
      <Dialog.Header>
        <Dialog.Title>Save project</Dialog.Title>
      </Dialog.Header>
      <div class="py-6">
        <div class="flex flex-row items-center gap-4">
          <Label for="save-project-name" class="whitespace-nowrap">Project name:</Label>
          <Input
            name="name"
            id="save-project-name"
            bind:value
            aria-invalid={!value.length}
            class="grow"
          />
        </div>
      </div>
      <Dialog.Footer>
        <Button type="submit" disabled={!value.length}>Save</Button>
        <Button variant="secondary" onclick={() => (open = false)}>Cancel</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
