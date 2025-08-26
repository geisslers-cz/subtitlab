<script module lang="ts">
  import type { Act } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type AddSceneProps = {
    act: Act;
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
  import * as RadioGroup from '$lib/components/radio-group';
  import ImportScene, { type ImportedCue } from './import-scene.svelte';

  let { act = $bindable(), class: className }: AddSceneProps = $props();
  let title = $derived(`Scene ${act.scenes.length + 1}`);
  let type: 'manual' | 'timed' = $state('manual');
  let cues: ImportedCue[] | undefined = $state();
  let open = $state(false);
  let id = useId('inp-add-scene');

  function onsubmit(evt: SubmitEvent): void {
    evt.preventDefault();

    if (!title.length) {
      return;
    }

    const scene = act.scenes.create({ title, type });
    act.scenes.insert(scene);

    if (cues?.length) {
      for (const cue of cues) {
        scene.cues.insert(scene.cues.create(cue) as any);
      }
    }

    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={className}>
    {#snippet child({ props })}
      <Button variant="ghost" size="xs" tooltip="Add scene" {...props}>
        <Icon class="icon-[lucide--image-plus]" />
        <span class="sr-only">Add scene</span>
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <form {onsubmit}>
      <Dialog.Header>
        <Dialog.Title>New scene in act '{act.title}'</Dialog.Title>
      </Dialog.Header>
      <div class="grid grid-cols-[max-content_1fr] items-center gap-x-4 gap-y-2 py-6">
        <Label for={`${id}-title`} class="whitespace-nowrap">Scene name:</Label>
        <Input name="name" id={`${id}-title`} bind:value={title} aria-invalid={!title.length} />
        <div
          class="text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Scene mode:
        </div>
        <RadioGroup.Root bind:value={type} orientation="horizontal" class="flex items-center py-2">
          <div class="flex items-center gap-2">
            <RadioGroup.Item id={`${id}-type-manual`} value="manual" />
            <Label for={`${id}-type-manual`}>Manual</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroup.Item id={`${id}-type-timed`} value="timed" />
            <Label for={`${id}-type-timed`}>Timed</Label>
          </div>
        </RadioGroup.Root>
      </div>
      <Dialog.Footer class="items-center">
        <ImportScene bind:cues bind:type class="mr-auto" />
        <Button type="submit" disabled={!title.length}>Add</Button>
        <Button variant="secondary" onclick={() => (open = false)}>Cancel</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
