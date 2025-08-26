<script module lang="ts">
  export type SettingsProps = {
    open?: boolean;
  };
</script>

<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import { Button } from '$lib/components/button';
  import * as Collapsible from '$lib/components/collapsible';
  import { ColorPicker } from '$lib/components/color-picker';
  import { Icon } from '$lib/components/icon';
  import { Input } from '$lib/components/input';
  import { Label } from '$lib/components/label';
  import { useProjectContext } from '$lib/state';
  import FontPicker from './font-picker.svelte';
  import TransitionOptions from './transition-options.svelte';
  import { computeAutoFontSize } from './utils';
  import WeightPicker from './weight-picker.svelte';

  const project = useProjectContext();

  let { open = $bindable(false) }: SettingsProps = $props();

  const fontSize = box.with(
    () => Math.round(project.current.settings.fontSize * 1000),
    (v) => (project.current.settings.fontSize = v / 1000),
  );

  const leading = box.with(
    () => Math.round(project.current.settings.lineHeight * 1000),
    (v) => (project.current.settings.lineHeight = v / 1000),
  );

  const gap = box.with(
    () => Math.round(project.current.settings.cueGap * 1000),
    (v) => (project.current.settings.cueGap = v / 1000),
  );

  function toggleItalic(): void {
    project.current.settings.fontStyle =
      project.current.settings.fontStyle === 'italic' ? 'normal' : 'italic';
  }

  function autoSize(): void {
    project.current.settings.fontSize = computeAutoFontSize(project.current);
  }
</script>

<Collapsible.Root bind:open>
  <div class="flex flex-col">
    <Collapsible.Trigger class="border-b p-2">
      <h3 class="grow text-left">Settings</h3>
    </Collapsible.Trigger>

    <Collapsible.Content>
      <div class="flex flex-col gap-2 border-b p-2">
        <div class="grid grid-cols-[min-content_1fr_min-content_min-content] items-center gap-2">
          <Label for="settings-font-family" tooltip="Font">
            <Icon class="icon-[radix-icons--text] size-5" />
            <span class="sr-only">Font</span>
          </Label>
          <FontPicker
            id="settings-font-family"
            class="col-span-3 w-auto"
            bind:value={project.current.settings.fontFamily}
          />

          <WeightPicker
            bind:value={project.current.settings.fontWeight}
            class="col-start-2 w-auto"
            aria-label="Font weight"
          />
          <Button
            variant="outline"
            active={project.current.settings.fontStyle === 'italic'}
            class="w-9"
            onclick={toggleItalic}
            tooltip="Italic"
          >
            <Icon class="icon-[radix-icons--font-italic] size-5" />
            <span class="sr-only">Toggle italic</span>
          </Button>
          <ColorPicker
            bind:value={project.current.settings.color}
            class="w-9"
            aria-label="Font color"
          />
        </div>

        <div class="grid grid-cols-[min-content_1fr_min-content_1fr] items-center gap-2">
          <Label for="settings-font-size" tooltip="Font size">
            <Icon class="icon-[radix-icons--font-size] size-5" />
            <span class="sr-only">Font size</span>
          </Label>
          <Input
            type="number"
            id="settings-font-size"
            bind:value={fontSize.current}
            class="w-auto"
            min={1}
            max={200}
            step={1}
          />
          <Button variant="ghost" tooltip="Adjust automatically" onclick={autoSize}>
            <Icon class="icon-[lucide--wand-sparkles]" />
            <span class="sr-only">Adjust font size automatically</span>
          </Button>

          <Label for="settings-leading" tooltip="Line height" class="col-start-1">
            <Icon class="icon-[mdi--arrow-expand-vertical] size-5" />
            <span class="sr-only">Line height</span>
          </Label>
          <Input
            type="number"
            id="settings-leading"
            bind:value={leading.current}
            class="w-auto"
            min={1}
            max={250}
            step={1}
          />

          <Label for="settings-gap" tooltip="Vertical cue spacing" class="justify-self-center">
            <Icon class="icon-[radix-icons--line-height] size-5" />
            <span class="sr-only">Vertical cue spacing</span>
          </Label>
          <Input
            type="number"
            id="settings-gap"
            bind:value={gap.current}
            class="w-auto"
            min={1}
            max={100}
            step={1}
          />

          <Label for="settings-txn-in" tooltip="Transition in">
            <Icon class="icon-[material-symbols--video-camera-back-rounded] size-5" />
            <span class="sr-only">Transition in</span>
          </Label>
          <TransitionOptions
            id="settings-txn-in"
            bind:transition={project.current.settings.transitionIn}
            class="col-span-3"
          />
          <Label for="settings-txn-out" tooltip="Transition out" class="justify-self-center">
            <Icon class="icon-[material-symbols--video-camera-front-off-rounded] size-5" />
            <span class="sr-only">Transition out</span>
          </Label>
          <TransitionOptions
            id="settings-txn-out"
            bind:transition={project.current.settings.transitionOut}
            class="col-span-3"
          />
        </div>
      </div>
    </Collapsible.Content>
  </div>
</Collapsible.Root>
