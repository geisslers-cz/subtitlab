<script module lang="ts">
  import type { TarFileInput } from 'nanotar';
  import { type FontStorage, getProjectFonts, type ProjectData } from '$lib/data';

  export type ExportProjectProps = {
    id: string;
  };

  type FontFileInfo = {
    name: string;
    type: string;
  };

  async function exportProjectFonts(
    storage: FontStorage,
    project: ProjectData,
  ): Promise<TarFileInput[]> {
    const fonts = storage.loadAll(getProjectFonts(project.settings));
    const manifest: Record<string, FontFileInfo> = {};
    const files = await Promise.all(
      fonts.map(async (font) => {
        await font.loaded;

        if (!font.file) {
          return undefined;
        }

        const [fn, ext] = splitFn(font.file.name);

        manifest[font.id] = {
          name: `${sanitizeFilename(fn, font.id)}${ext}`,
          type: font.file.type,
        };

        const name = `fonts/${font.id}`;
        const data = await font.file.arrayBuffer();
        return { name, data };
      }),
    );

    const validFiles = files.filter((f) => !!f);

    return !validFiles.length
      ? []
      : [...validFiles, { name: 'fonts/manifest.json', data: JSON.stringify(manifest) }];
  }

  function sanitizeFilename(name: string, fallback: string): string {
    return name
      .replace(/[^-._ 0-9a-z]+/gi, '-')
      .replace(/^[^a-z0-9]+|[^a-z0-9]$/gi, '')
      .replace(/^$/, fallback);
  }

  function splitFn(filename: string): [basename: string, ext: string] {
    const match = filename.match(/^(.+)(\.[^.]+)$/);
    return match ? [match[1], match[2]] : [filename, ''];
  }
</script>

<script lang="ts">
  import { createTarGzip } from 'nanotar';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useFontStorage } from '$lib/data';
  import { useProjectContext } from '$lib/state';

  const projectCtx = useProjectContext();
  const fontsCtx = useFontStorage();

  let { id }: ExportProjectProps = $props();

  async function exportProject(): Promise<void> {
    const project = await projectCtx.export(id);
    const data = await createTarGzip([
      { name: 'project.json', data: JSON.stringify(project) },
      ...(await exportProjectFonts(fontsCtx, project)),
    ]);

    const archive = new File([data], `${sanitizeFilename(project.title, 'Project')}.subtitlab`, {
      type: 'application/octet-stream',
      lastModified: project.lastModified?.length ? Date.parse(project.lastModified) : Date.now(),
    });

    const url = URL.createObjectURL(archive);
    const link = document.createElement('a');
    link.href = url;
    link.download = archive.name;
    link.click();
    URL.revokeObjectURL(url);
  }
</script>

<Button size="xs" variant="ghost" tooltip="Export" onclick={exportProject}>
  <Icon class="icon-[lucide--cloud-download]" />
  <span class="sr-only">Export project</span>
</Button>
