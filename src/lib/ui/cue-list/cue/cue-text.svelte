<script module lang="ts">
  import type { AnyCue } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type CueTextProps = {
    cue: AnyCue;
    class?: ClassValue;
  };
</script>

<script lang="ts">
  import { useUiContext } from '$lib/state';
  import { cn, composeKey } from '$lib/utils';

  const ui = useUiContext();

  let { cue, class: className }: CueTextProps = $props();
  let editor: HTMLTextAreaElement | null = $state(null);

  $effect(() => {
    editor?.focus();
  });

  function ondblclick(evt: MouseEvent): void {
    evt.preventDefault();
    ui.editCue(cue);
  }

  function onkeydown(evt: KeyboardEvent): void {
    if (!ui.editing) {
      return;
    }

    const key = composeKey(evt);

    if (key === 'Escape') {
      evt.preventDefault();
      ui.editCue(undefined);
      return;
    }

    if (key !== 'Enter' && key !== 'Ctrl+Enter') {
      return;
    }

    evt.preventDefault();
    cue.content = ui.editing.content;

    if (key === 'Ctrl+Enter') {
      ui.addCue(cue.parent, cue);
    } else {
      ui.editCue(undefined);
    }
  }

  function onblur(): void {
    if (ui.editing?.target === cue) {
      cue.content = ui.editing.content;
      ui.editCue(undefined);
    }
  }
</script>

{#if cue === ui.editing?.target}
  <textarea
    bind:this={editor}
    bind:value={ui.editing.content}
    {onkeydown}
    {onblur}
    class={cn('field-sizing-content min-h-8 resize-none p-2 outline-0', className)}
    aria-label="Cue text"
  ></textarea>
{:else}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class={cn('min-h-8 overflow-hidden p-2 text-ellipsis whitespace-pre-line', className)}
    {ondblclick}
  >
    {cue.content}
  </div>
{/if}
