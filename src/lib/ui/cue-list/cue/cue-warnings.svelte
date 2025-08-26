<script module lang="ts">
  import { type AnyCue, projectorArea } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type CueWarningsProps = {
    cue: AnyCue;
    class?: ClassValue;
  };

  function getChainHeight(cue: AnyCue, gap: number): number {
    if (cue.chain || !cue.size) {
      return 0;
    }

    let height = cue.size.height;

    for (let prev = cue.previous; prev && prev.chain && prev.size; prev = prev.previous) {
      height += gap + prev.size.height;
    }

    return height;
  }

  function getCueWarnings(cue: AnyCue, gap: number, aspectRatio: number): string | undefined {
    const warnings: string[] = [];

    if (cue.size?.wrapped) {
      warnings.push('Cue is too wide');
    }

    const height = getChainHeight(cue, gap) * aspectRatio;

    if (height > projectorArea) {
      warnings.push(`Cue chain is too long`);
    }

    switch (warnings.length) {
      case 0:
        return undefined;
      case 1:
        return warnings[0];
      default:
        return `Warnings:\n - ${warnings.join('\n - ')}`;
    }
  }
</script>

<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { tooltip } from '$lib/components/tooltip';
  import { useProjectContext, useUiContext } from '$lib/state';

  const project = useProjectContext();
  const ui = useUiContext();

  let { cue, class: className }: CueWarningsProps = $props();
  let warnings = $derived(getCueWarnings(cue, project.current.settings.cueGap, ui.aspectRatio));
</script>

<div class={className}>
  {#if warnings !== undefined}
    <button type="button" use:tooltip={warnings} class="flex cursor-pointer items-center">
      <Icon class="icon-[lucide--triangle-alert] text-warning" />
    </button>
  {/if}
</div>
