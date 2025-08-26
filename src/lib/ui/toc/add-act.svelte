<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type AddActProps = {
    class?: ClassValue;
  };

  const lookup: [string, number][] = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ];

  function toRoman(num: number): string {
    return lookup.reduce((acc, [k, v]) => {
      acc += k.repeat(Math.floor(num / v));
      num = num % v;
      return acc;
    }, '');
  }
</script>

<script lang="ts">
  import { useId } from 'bits-ui';
  import { Button } from '$lib/components/button';
  import * as Dialog from '$lib/components/dialog';
  import { Icon } from '$lib/components/icon';
  import { Input } from '$lib/components/input';
  import { Label } from '$lib/components/label';
  import { useProjectContext } from '$lib/state';

  const project = useProjectContext();

  let { class: className }: AddActProps = $props();
  let title = $derived(`Act ${toRoman(project.current.acts.length + 1)}`);
  let open = $state(false);
  let id = useId('inp-add-act');

  function onsubmit(evt: SubmitEvent): void {
    evt.preventDefault();

    if (!title.length) {
      return;
    }

    project.current.acts.insert(project.current.acts.create({ title }));
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={className}>
    {#snippet child({ props })}
      <Button variant="ghost" size="xs" tooltip="Add act" {...props}>
        <Icon class="icon-[lucide--book-plus]" />
        <span class="sr-only">Add act</span>
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <form {onsubmit}>
      <Dialog.Header>
        <Dialog.Title>New act</Dialog.Title>
      </Dialog.Header>
      <div class="py-6">
        <div class="flex flex-row items-center gap-4">
          <Label for={id} class="whitespace-nowrap">Act name:</Label>
          <Input name="name" {id} bind:value={title} aria-invalid={!title.length} class="grow" />
        </div>
      </div>
      <Dialog.Footer>
        <Button type="submit" disabled={!title.length}>Add</Button>
        <Button variant="secondary" onclick={() => (open = false)}>Cancel</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
