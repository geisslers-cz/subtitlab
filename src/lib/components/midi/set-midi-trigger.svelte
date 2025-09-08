<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { MidiTrigger } from '$lib/data';

  export type SetMidiTriggerProps = {
    id?: string;
    trigger?: MidiTrigger;
    isOpen?: boolean;
    child?: Snippet<[{ props: Record<string, unknown> }]>;
    children?: Snippet;
  };

  function isSame(a: MidiTrigger, b?: MidiTrigger): boolean {
    if (!b || a.channel !== b.channel) {
      return false;
    }

    if (a.type === 'note' && b.type === 'note') {
      return a.note === b.note;
    } else if (a.type === 'program' && b.type === 'program') {
      return a.bank.msb === b.bank.msb && a.bank.lsb === b.bank.lsb && a.program === b.program;
    } else {
      return false;
    }
  }

  function clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, Math.round(value)));
  }
</script>

<script lang="ts">
  import { useId } from 'bits-ui';
  import { Button } from '$lib/components/button';
  import * as Dialog from '$lib/components/dialog';
  import { Input } from '$lib/components/input';
  import { Label } from '$lib/components/label';
  import * as RadioGroup from '$lib/components/radio-group';
  import * as Select from '$lib/components/select';
  import { useUiContext } from '$lib/state';
  import { extractNoteInfo, type MidiNote, noteOptions } from '$lib/utils';

  const ui = useUiContext();

  let { trigger = $bindable(), isOpen = $bindable(false), ...rest }: SetMidiTriggerProps = $props();
  let open = $state(false);
  let learn = $state(false);
  let type = $derived(trigger?.type ?? 'note');
  let channel = $derived(trigger?.channel ?? 0);
  let value = $derived(
    trigger?.type === 'note' ? trigger.note : trigger?.type === 'program' ? trigger.program : 60,
  );
  let bankMsb = $derived(trigger?.type === 'program' ? trigger.bank.msb : 0);
  let bankLsb = $derived(trigger?.type === 'program' ? trigger.bank.lsb : 0);
  let id = useId('inp-set-midi-trigger');
  let current: MidiTrigger = $derived(
    type === 'note'
      ? { type, channel, note: value }
      : { type, channel, bank: { msb: bankMsb, lsb: bankLsb }, program: value },
  );

  let used = $derived(!isSame(current, trigger) && ui.midi.isMapped(current));

  $effect(() => {
    if (!open || !learn) {
      return;
    }

    const ctrl = new AbortController();

    ui.midi.learn(ctrl.signal).then((trigger) => {
      type = trigger.type;
      channel = trigger.channel;
      value = trigger.type === 'note' ? trigger.note : trigger.program;
      bankMsb = trigger.type === 'program' ? trigger.bank.msb : 0;
      bankLsb = trigger.type === 'program' ? trigger.bank.lsb : 0;
      learn = false;
    });

    return () => {
      ctrl.abort();
    };
  });

  function onsubmit(evt: SubmitEvent): void {
    evt.preventDefault();

    if (!used) {
      trigger = current;
      open = learn = false;
    }
  }

  function clear(): void {
    trigger = undefined;
    open = learn = false;
  }
</script>

<Dialog.Root
  bind:open
  onOpenChange={(o) => {
    if (o) isOpen = true;
  }}
  onOpenChangeComplete={(o) => {
    if (!o) isOpen = false;
  }}
>
  <Dialog.Trigger {...rest} />
  <Dialog.Content>
    <form {onsubmit}>
      <Dialog.Header>
        <Dialog.Title>MIDI trigger</Dialog.Title>
      </Dialog.Header>
      <div class="grid grid-cols-[max-content_1fr] items-center gap-x-4 gap-y-2 py-6">
        <div
          class="text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Message type:
        </div>
        <RadioGroup.Root bind:value={type} orientation="horizontal" class="flex items-center py-2">
          <div class="flex items-center gap-2">
            <RadioGroup.Item id={`${id}-type-note`} value="note" />
            <Label for={`${id}-type-note`}>Note on</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroup.Item id={`${id}-type-program`} value="program" />
            <Label for={`${id}-type-program`}>Program change</Label>
          </div>
        </RadioGroup.Root>
        {#if type === 'program'}
          <Label for={`${id}-bank-msb`} class="whitespace-nowrap">Bank:</Label>
          <div class="flex flex-row items-center gap-2">
            <Input
              type="number"
              name="bank-msb"
              id={`${id}-bank-msb`}
              bind:value={() => bankMsb + 1, (msb) => (bankMsb = clamp(msb - 1, 127))}
              min={1}
              max={128}
              step={1}
              class="w-20"
            />
            <Input
              type="number"
              name="bank-lsb"
              id={`${id}-bank-lsb`}
              bind:value={() => bankLsb + 1, (lsb) => (bankLsb = clamp(lsb - 1, 127))}
              min={1}
              max={128}
              step={1}
              class="w-20"
            />
          </div>

          <Label for={`${id}-value`} class="whitespace-nowrap">Program:</Label>
          <div>
            <Input
              type="number"
              name="value"
              id={`${id}-value`}
              bind:value={() => value + 1, (v) => (value = clamp(v - 1, 127))}
              min={1}
              max={128}
              step={1}
              class="w-20"
            />
          </div>
        {:else}
          <Label for={`${id}-value`} class="whitespace-nowrap">Note:</Label>
          <div>
            <Select.Root
              type="single"
              bind:value={() => value.toString(), (v) => (value = parseInt(v, 10))}
            >
              <Select.Trigger id={`${id}-value`} class="w-20">
                {@render note(extractNoteInfo(value))}
              </Select.Trigger>
              <Select.Content>
                {#each noteOptions as [v, info] (v)}
                  <Select.Item value={v.toString()}>
                    {@render note(info)}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        {/if}
        <Label for={`${id}-channel`}>Channel:</Label>
        <div>
          <Input
            type="number"
            name="channel"
            id={`${id}-channel`}
            bind:value={() => channel + 1, (ch) => (channel = clamp(ch - 1, 15))}
            min={1}
            max={16}
            step={1}
            class="w-20"
          />
        </div>
        {#if used}
          <p class="text-destructive col-start-2">This MIDI trigger is already used elsewhere.</p>
        {/if}
      </div>
      <Dialog.Footer class="flex items-center gap-2">
        <Button variant="secondary" active={learn} onclick={() => (learn = !learn)}>
          {learn ? 'Learning...' : 'Learn'}
        </Button>
        {#if trigger}
          <Button variant="secondary" onclick={clear}>Remove trigger</Button>
        {/if}
        <Button type="submit" class="ml-auto" disabled={used}>Save</Button>
        <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

{#snippet note({ name, sharp, octave }: MidiNote)}
  <div>
    {name}{#if sharp}<sup>#</sup>{/if}<sub>{octave}</sub>
  </div>
{/snippet}
