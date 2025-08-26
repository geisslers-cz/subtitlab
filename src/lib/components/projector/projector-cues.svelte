<script module lang="ts">
  import type { Playhead } from '$lib/data';

  export type ProjectorCuesProps = {
    doc: Document;
    playhead?: Playhead;
    transitionOutDuration?: number;
  };

  type ViewState = 'show' | 'hide';
</script>

<script lang="ts">
  let { doc, playhead, transitionOutDuration = 0 }: ProjectorCuesProps = $props();
  let current: Playhead | undefined = $state.raw();
  let view: ViewState | undefined = $state();

  const transitioning: Set<any> = new Set();

  $effect(() => {
    if (current?.chain !== playhead?.chain) {
      if (!current) {
        current = playhead;
        view = undefined;
      } else if (transitionOutDuration < 1) {
        current = view = undefined;
      } else {
        view = 'hide';

        setTimeout(() => {
          if (!transitioning.size) {
            current = view = undefined;
          }
        }, transitionOutDuration / 2);
      }

      return;
    }

    if (current && view === undefined) {
      doc.body.getBoundingClientRect();
      view = 'show';
    }
  });

  function ontransitionstart(evt: TransitionEvent): void {
    if (current && view === 'hide' && transitionOutDuration > 0) {
      transitioning.add((evt.target as any).dataset.id);
    }
  }

  function ontransitionend(evt: TransitionEvent): void {
    if (current && view === 'hide' && transitionOutDuration > 0) {
      transitioning.delete((evt.target as any).dataset.id);

      if (!transitioning.size) {
        current = view = undefined;
      }
    }
  }
</script>

{#if current}
  {#each current.chain as [cue, cueState] (cue.id)}
    <p
      data-id={cue.id}
      data-state={view !== 'show' ? (view ?? 'waiting') : cueState}
      {ontransitionstart}
      {ontransitionend}
    >
      {cue.content}
    </p>
  {/each}
{/if}
