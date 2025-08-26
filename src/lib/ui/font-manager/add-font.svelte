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
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { Input } from '$lib/components/input';
  import { useFontStorage } from '$lib/data';

  const fonts = useFontStorage();

  let files: FileList | undefined = $state();
  let file = $derived(files?.item(0));
  let name = $derived((file && guessName(file.name)) ?? '');
  let weight = $derived((file && guessWeight(file.name)) ?? null);
  let style = $derived((file && guessStyle(file.name)) ?? null);

  function add(): void {
    if (file && name.length) {
      fonts.import(file, { family: name, weight: weight ?? undefined, style: style ?? undefined });
      reset();
    }
  }

  function reset(): void {
    files = new DataTransfer().files;
    name = '';
    weight = style = null;
  }
</script>

<div class="col-span-5 grid grid-cols-subgrid items-center gap-2">
  <div class="p-2">Add:</div>
  {#if !file}
    <Input
      type="file"
      accept="font/woff2,font/woff,font/ttf,font/otf,.woff,.woff2,.ttf,.otf"
      bind:files
      class="col-span-3"
    />
  {:else}
    <Input bind:value={name} />
    <Input type="number" min={100} max={900} step={100} bind:value={weight} />
    <Input bind:value={style} />
  {/if}
  <div class="flex flex-row items-center gap-1">
    {#if file}
      <Button size="xs" disabled={!name.length} tooltip="Add" onclick={add}>
        <Icon class="icon-[lucide--plus]" />
        <span class="sr-only">Add font</span>
      </Button>
      <Button size="xs" variant="outline" tooltip="Cancel" onclick={reset}>
        <Icon class="icon-[lucide--x]" />
        <span class="sr-only">Cancel</span>
      </Button>
    {/if}
  </div>
</div>
