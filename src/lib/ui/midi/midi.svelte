<script module lang="ts">
  export type MidiProps = {
    open?: boolean;
  };
</script>

<script lang="ts">
  import * as Collapsible from '$lib/components/collapsible';
  import { Icon } from '$lib/components/icon';
  import { Label } from '$lib/components/label';
  import { useProjectContext } from '$lib/state';
  import Binding from './binding.svelte';
  import MidiInputs from './midi-inputs.svelte';

  const project = useProjectContext();

  let { open = $bindable(false) }: MidiProps = $props();
</script>

<Collapsible.Root bind:open>
  <div class="flex flex-col">
    <Collapsible.Trigger class="border-b p-2">
      <h3 class="grow text-left">MIDI</h3>
    </Collapsible.Trigger>
    <Collapsible.Content>
      <div class="flex flex-col gap-2 border-b p-2">
        <div class="grid grid-cols-[min-content_1fr] items-center gap-2">
          <Label for="midi-inp-list" tooltip="Input devices">
            <Icon class="icon-[lucide--microchip]" />
            <span class="sr-only">Input devices</span>
          </Label>
          <MidiInputs id="midi-inp-list" class="w-full" />

          <Binding
            id="go"
            action="Go"
            icon="icon-[lucide--circle-play]"
            bind:trigger={project.current.midi.go}
          />
          <Binding
            id="panic"
            action="Panic"
            icon="icon-[lucide--circle-x]"
            bind:trigger={project.current.midi.panic}
          />
        </div>
      </div>
    </Collapsible.Content>
  </div>
</Collapsible.Root>
