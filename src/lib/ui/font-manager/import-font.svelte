<script module lang="ts">
  import { fontWeights } from '$lib/utils';

  function guessName(fileName: string): string {
    return fileName
      .replace(/^.*\/|\.[^.]+$/g, '')
      .replace(/(thin|light|regular|medium|bold|black|semi|extra|ultra|italics?)/i, ' ')
      .replace(/[-_\s]+/g, ' ')
      .trim();
  }

  function guessWeight(fileName: string): number | undefined {
    const match = fileName
      .toLowerCase()
      .replace(/narrow/, 'light')
      .match(/(?:(semi|extra|ultra)-)?(thin|light|regular|medium|bold|black)/);

    if (!match) {
      return undefined;
    }

    for (const idx of [0, 2]) {
      for (const [value, weight] of fontWeights) {
        if (match[idx] === weight) {
          return value;
        }
      }
    }

    return undefined;
  }

  function guessStyle(fileName: string): string | undefined {
    return /italic/i.test(fileName) ? 'italic' : undefined;
  }
</script>

<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import { Button, buttonVariants } from '$lib/components/button';
  import * as Dialog from '$lib/components/dialog';
  import { Icon } from '$lib/components/icon';
  import { Input } from '$lib/components/input';
  import { Label } from '$lib/components/label';
  import * as Select from '$lib/components/select';
  import { tooltip } from '$lib/components/tooltip';
  import { useFontStorage } from '$lib/data';

  const fonts = useFontStorage();

  let files: FileList | undefined = $state();
  let file = $derived(files?.item(0) ?? undefined);
  let family = $derived((file && guessName(file.name)) ?? '');
  let weight = $derived(file && guessWeight(file.name));
  let style = $derived(file && guessStyle(file.name));
  let open = $derived(!!file);

  const values = box.flatten({
    weight: box.with(
      () => weight?.toString() ?? 'any',
      (v) => (weight = v !== 'any' ? parseInt(v, 10) : undefined),
    ),
    style: box.with(
      () => style ?? 'any',
      (v) => (style = v !== 'any' ? v : undefined),
    ),
  });

  function onsubmit(evt: SubmitEvent): void {
    evt.preventDefault();

    if (file && family.length) {
      fonts.import(file, { family, weight, style });
      reset();
    }
  }

  function reset(): void {
    files = new DataTransfer().files;
    family = '';
    weight = style = undefined;
  }
</script>

<label class={buttonVariants({ variant: 'ghost', size: 'xs' })} use:tooltip={'Import'}>
  <input
    type="file"
    class="sr-only"
    accept="font/woff2,font/woff,font/ttf,font/otf,.woff,.woff2,.ttf,.otf"
    bind:files
  />
  <Icon class="icon-[lucide--cloud-upload]" />
  <span class="sr-only">Import font</span>
</label>

<Dialog.Root bind:open>
  <Dialog.Content class="gap-2">
    <form {onsubmit}>
      <Dialog.Header>
        <Dialog.Title>Import font '{file?.name}'</Dialog.Title>
      </Dialog.Header>
      <div
        class="grid grid-cols-[max-content_1fr_max-content_1fr] items-center gap-x-4 gap-y-2 py-6"
      >
        <Label for="import-font-family">Family:</Label>
        <Input
          id="import-font-family"
          bind:value={family}
          aria-invalid={!family.length}
          class="col-span-3"
        />

        <Label for="import-font-weight">Weight:</Label>
        <Select.Root type="single" bind:value={values.weight}>
          <Select.Trigger id="import-font-weight" class="w-full">
            {weight !== undefined ? fontWeights.get(weight) : 'any'}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="any">any</Select.Item>
            {#each fontWeights as [weight, label] (weight)}
              <Select.Item value={weight.toString()}>{label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>

        <Label for="import-font-style">Style:</Label>
        <Select.Root type="single" bind:value={values.style}>
          <Select.Trigger id="import-font-style" class="w-full">
            {style ?? 'any'}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="any">any</Select.Item>
            <Select.Item value="normal">normal</Select.Item>
            <Select.Item value="italic">italic</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <Dialog.Footer>
        <Button type="submit" disabled={!family.length}>Save</Button>
        <Button variant="secondary" onclick={reset}>Cancel</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
