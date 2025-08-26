<script module lang="ts">
  import type { FontMetadata, FontStorage } from '$lib/data';
  import type { ClassValue } from '$lib/utils';

  export type FontPickerProps = {
    value: FontMetadata | string;
    id?: string;
    class?: ClassValue;
    'aria-label'?: string;
  };

  type FontInfo = FontMetadata & {
    missing?: boolean;
  };

  function resolveFont(storage: FontStorage, font: FontMetadata | string): FontInfo {
    if (typeof font === 'string') {
      return systemFonts.find((f) => f.id === font)!;
    } else {
      const meta = storage.available.get(font.id);
      return meta ?? { ...font, missing: true };
    }
  }

  const systemFonts: FontMetadata[] = [
    { id: 'Arial', family: 'Arial' },
    { id: 'Verdana', family: 'Verdana' },
    { id: 'Tahoma', family: 'Tahoma' },
    { id: 'Trebuchet MS', family: 'Trebuchet MS' },
    { id: 'Times New Roman', family: 'Times New Roman' },
    { id: 'Georgia', family: 'Georgia' },
    { id: 'Garamond', family: 'Garamond' },
    { id: 'Courier New', family: 'Courier New' },
    { id: 'Brush Script MT', family: 'Brush Script MT' },
  ];
</script>

<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import { FontLoader } from '$lib/components/font-loader';
  import { Icon } from '$lib/components/icon';
  import * as Select from '$lib/components/select';
  import { tooltip } from '$lib/components/tooltip';
  import { useFontStorage } from '$lib/data';
  import { FontManager } from '$lib/ui/font-manager';
  import { cn } from '$lib/utils';

  const fontStorage = useFontStorage();

  let { value = $bindable(), class: className, ...rest }: FontPickerProps = $props();
  let info = $derived(resolveFont(fontStorage, value));
  let managerVisible = $state(false);

  const proxy = box.with(
    () => info.id,
    (v) => {
      if (v === '#manage') {
        managerVisible = true;
      } else if (systemFonts.some((f) => f.id === v)) {
        value = v;
      } else {
        value = fontStorage.available.get(v)!;
      }
    },
  );
</script>

<Select.Root type="single" bind:value={proxy.current}>
  <Select.Trigger {...rest} class={cn('cursor-pointer', className)} aria-invalid={info?.missing}>
    {#if info}
      {@render option(info)}
    {/if}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupHeading class="sr-only">System fonts</Select.GroupHeading>
      {#each systemFonts as font (font)}
        <Select.Item value={font.id}>
          {@render option(font)}
        </Select.Item>
      {/each}
    </Select.Group>
    <FontLoader storage={fontStorage} fonts={[...fontStorage.available.values()]}>
      <Select.Group>
        <Select.GroupHeading>Custom fonts</Select.GroupHeading>
        {#if info?.missing}
          <Select.Item value={info.id} disabled>
            {@render option(info)}
          </Select.Item>
        {/if}
        {#each fontStorage.available.values() as meta (meta.id)}
          <Select.Item value={meta.id}>
            {@render option(meta)}
          </Select.Item>
        {/each}
        <Select.Item class="text-muted-foreground cursor-pointer text-xs" value="#manage">
          Manage...
        </Select.Item>
      </Select.Group>
    </FontLoader>
  </Select.Content>
</Select.Root>

<FontManager bind:open={managerVisible} />

{#snippet option(info: FontInfo)}
  <span
    style:font-family={info.family}
    style:font-weight={info.weight}
    style:font-style={info.style}
  >
    {info.family}
  </span>
  {#if info.missing}
    <span use:tooltip={'Font is missing'} class="ml-auto">
      <Icon class="icon-[lucide--triangle-alert] text-destructive size-3" />
    </span>
  {/if}
{/snippet}
