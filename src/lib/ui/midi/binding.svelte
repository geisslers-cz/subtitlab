<script module lang="ts">
  import type { MidiTrigger } from '$lib/data';

  export type BindingProps = {
    id: string;
    action: string;
    icon: string;
    trigger?: MidiTrigger;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { Label } from '$lib/components/label';
  import { SetMidiTrigger } from '$lib/components/midi';
  import { extractNoteInfo } from '$lib/utils';

  let { id, action, icon, trigger = $bindable() }: BindingProps = $props();
</script>

<Label for={`midi-binding-${id}`} tooltip={`MIDI trigger for action '${action}'`}>
  <Icon class={icon} />
  <span class="sr-only">MIDI trigger for action '{action}'</span>
</Label>
<SetMidiTrigger id={`midi-binding-${id}`} bind:trigger>
  {#snippet child({ props })}
    <Button variant="outline" class="justify-start px-3" {...props}>
      {#if trigger}
        <span>
          {#if trigger.type === 'note'}
            {@const info = extractNoteInfo(trigger.note)}
            note {info.name}{#if info.sharp}<sup>#</sup>{/if}<sub>{info.octave}</sub>
          {:else}
            program #{trigger.program + 1} in bank #{trigger.bank.msb + 1}.{trigger.bank.lsb + 1}
          {/if}
        </span>
      {:else}
        <em class="text-muted-foreground">set...</em>
      {/if}
    </Button>
  {/snippet}
</SetMidiTrigger>
