<script module lang="ts">
  import type { Act, AnyScene } from '$lib/data';

  export type SceneHeaderProps = {
    act: Act;
    scene: AnyScene;
  };
</script>

<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { TimedScene } from '$lib/data';
  import { useUiContext } from '$lib/state';
  import { cn } from '$lib/utils';
  import MidiTrigger from '../common/midi-trigger.svelte';
  import ScenePanel from '../panel/scene-panel.svelte';

  const ui = useUiContext();

  let { act, scene }: SceneHeaderProps = $props();
  let elem: HTMLDivElement | null = $state(null);
  let hover: boolean = $state(false);

  $effect(() => {
    if (elem && scene === ui.cursor?.scene) {
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

    ui.selectScene(scene, true);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events,a11y_no_static_element_interactions -->
<div
  bind:this={elem}
  class={cn(
    'relative flex items-center gap-2 rounded py-2 pl-2',
    'hover:bg-muted/50 cursor-pointer',
    'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground',
  )}
  data-selected={scene === ui.cursor?.scene && !ui.cursor.cue}
  onpointerenter={() => (hover = true)}
  onpointerleave={() => (hover = false)}
  {onclick}
>
  <Icon
    class={[scene instanceof TimedScene ? 'icon-[lucide--image-down]' : 'icon-[lucide--image]']}
  />
  <span>{act.title} / {scene.title}</span>
  <hr class="h-0 grow border-t border-dotted bg-transparent" />
  {#if scene instanceof TimedScene && scene.trigger}
    <MidiTrigger trigger={scene.trigger} />
    <hr class="h-0 w-6 border-t border-dotted bg-transparent" />
  {/if}
  <ScenePanel {scene} show={hover} />
</div>
