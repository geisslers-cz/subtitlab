<script module lang="ts">
  import { ManualCue, TimedCue } from '$lib/data';

  export type CueProps = {
    cue: ManualCue | TimedCue;
  };
</script>

<script lang="ts">
  import { SortableGrip, SortableItem } from '$lib/components/sortable';
  import { lastShown } from '$lib/data';
  import { useUiContext } from '$lib/state';
  import MidiTrigger from '../common/midi-trigger.svelte';
  import CueChain from './cue-chain.svelte';
  import CueProgress from './cue-progress.svelte';
  import CueText from './cue-text.svelte';
  import CueTimes from './cue-times.svelte';
  import CueWarnings from './cue-warnings.svelte';

  const ui = useUiContext();

  let { cue }: CueProps = $props();
  let elem: HTMLLIElement | null = $state(null);

  let cueState = $derived(cue === ui.cursor?.cue ? 'selected' : ui.playhead?.chain.get(cue));

  $effect(() => {
    if (!elem) {
      return;
    }

    if (cue === (ui.cursor ? ui.cursor.cue : ui.playhead && lastShown(ui.playhead.chain))) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  function onclick(evt: MouseEvent): void {
    if (
      !(evt.target instanceof HTMLElement) ||
      evt.target.closest('input, select, textarea, button, a')
    ) {
      return;
    }

    ui.selectCue(cue, true);
  }
</script>

<SortableItem
  id={cue.id}
  handle
  class={[
    'hover:bg-muted/50',
    'data-[state]:text-foreground',
    'data-[state=selected]:text-primary-foreground',
    'dark:data-[state]:text-primary-foreground',
    'data-[state=selected]:bg-primary',
    'data-[state=selected]:bg-primary',
    cue instanceof ManualCue && [
      'data-[state=waiting]:bg-warning/60',
      'data-[state=show]:bg-destructive/60',
    ],
    'grid',
    'cursor-pointer',
    'grid-cols-[1rem_1fr_9rem_1.5rem]',
    'pl-2',
    'items-center',
    'group/cue',
    'relative',
    'rounded',
    'hover:z-20',
  ]}
>
  {#snippet child(props)}
    <li bind:this={elem} data-state={cueState} {onclick} {...props}>
      {#if cue instanceof TimedCue}
        <CueProgress {cue} />
      {/if}
      <SortableGrip class="group-hover/cue:opacity-100" />
      <CueWarnings {cue} />
      <CueText {cue} />
      <div class="flex items-center justify-center text-xs">
        {#if cue instanceof TimedCue}
          <CueTimes {cue} />
        {:else if cue.trigger}
          <MidiTrigger class="mr-2 ml-auto" trigger={cue.trigger} />
        {/if}
      </div>
      <CueChain {cue} />
    </li>
  {/snippet}
</SortableItem>
