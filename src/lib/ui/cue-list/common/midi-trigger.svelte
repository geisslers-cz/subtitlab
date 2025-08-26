<script module lang="ts">
  import type { MidiNoteTrigger, MidiProgramTrigger, MidiTrigger } from '$lib/data';
  import { type ClassValue, extractNoteInfo } from '$lib/utils';

  export type MidiTriggerProps = {
    trigger: MidiTrigger;
    class?: ClassValue;
  };

  function formatNote(trigger: MidiNoteTrigger): string {
    const note = extractNoteInfo(trigger.note);
    return `note ${note.name}${note.sharp ? '<sup>#</sup>' : ''}<sub>${note.octave}</sub>`;
  }

  function formatProgram(trigger: MidiProgramTrigger): string {
    return `program #${trigger.program + 1} in bank #${trigger.bank.msb + 1}.${trigger.bank.lsb + 1}`;
  }

  function formatTrigger(trigger: MidiTrigger): string {
    const val = trigger.type === 'note' ? formatNote(trigger) : formatProgram(trigger);
    return `MIDI trigger: ${val} on channel ${trigger.channel + 1}`;
  }
</script>

<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { tooltip } from '$lib/components/tooltip';
  import { cn } from '$lib/utils';

  let { trigger, class: className }: MidiTriggerProps = $props();
</script>

<button
  type="button"
  class={cn('cursor-pointer', className)}
  use:tooltip={{ html: formatTrigger(trigger) }}
>
  <Icon
    class={[
      trigger?.type === 'note' ? 'icon-[lucide--music-4]' : 'icon-[lucide--keyboard-music]',
      'text-active',
    ]}
  />
</button>
