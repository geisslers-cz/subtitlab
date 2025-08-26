<script module lang="ts">
  import { parse as parseSrt } from '@plussub/srt-vtt-parser';
  import type { ClassValue } from '$lib/utils';

  export type ImportSceneProps = {
    cues?: ImportedCue[];
    type?: 'manual' | 'timed';
    class?: ClassValue;
  };

  export type ImportedCue = {
    content: string;
    from?: number;
    to?: number;
  };

  type ImportResult = {
    cues: ImportedCue[];
    type: 'manual' | 'timed';
  };

  async function parseFile(file: File): Promise<ImportResult | undefined> {
    if (file.type === 'application/x-subrip' || /\.srt$/i.test(file.name)) {
      const { entries } = parseSrt(await file.text());

      return {
        type: 'timed',
        cues: entries.map(({ text, from, to }) => ({
          content: text.trim(),
          from: from / 1000,
          to: to / 1000,
        })),
      };
    }

    if (file.type.startsWith('text/')) {
      const text = await file.text();

      return {
        type: 'manual',
        cues: text
          .trim()
          .split(/\s*\n\s*\n\s*/g)
          .map((content) => ({ content })),
      };
    }

    return undefined;
  }
</script>

<script lang="ts">
  import { buttonVariants } from '$lib/components/button';
  import { cn } from '$lib/utils';

  let { cues = $bindable(), type = $bindable(), class: className }: ImportSceneProps = $props();
  let result: string | undefined = $state();

  function get(): FileList {
    return new DataTransfer().files;
  }

  async function set(files?: FileList): Promise<void> {
    const file = files?.item(0);
    cues = result = undefined;

    if (!file) {
      return;
    }

    const imported = await parseFile(file);

    if (imported) {
      cues = imported.cues;
      type = imported.type;
      result = `${cues.length} cues`;
    } else {
      cues = undefined;
      result = 'Unsupported file type';
    }
  }
</script>

<label class={cn(buttonVariants({ variant: 'secondary' }), className)}>
  {result ?? 'Import cues...'}
  <input
    type="file"
    class="sr-only"
    accept="application/x-subrip,text/*,.srt,.txt"
    bind:files={get, set}
  />
</label>
