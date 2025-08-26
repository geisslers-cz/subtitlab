<script module lang="ts">
  import type { ParsedTarFileItem } from 'nanotar';

  type TarMap = {
    project?: ParsedTarFileItem;
    fontsManifest?: ParsedTarFileItem;
    fonts: Record<string, ParsedTarFileItem>;
  };

  function mapTarEntries(entries: ParsedTarFileItem[]): TarMap {
    const map: TarMap = { fonts: {} };

    for (const entry of entries) {
      if (entry.name === 'project.json') {
        map.project = entry;
      } else if (entry.name === 'fonts/manifest.json') {
        map.fontsManifest = entry;
      } else {
        const match = entry.name.match(/^fonts\/([-a-z0-9]+)$/);

        if (match) {
          map.fonts[match[1]] = entry;
        } else {
          console.log(`Warning: unknown project archive entry: '${entry.name}'`);
        }
      }
    }

    return map;
  }
</script>

<script lang="ts">
  import { parseTarGzip } from 'nanotar';
  import { buttonVariants } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { tooltip } from '$lib/components/tooltip';
  import { getProjectFonts, type ProjectData, useFontStorage } from '$lib/data';
  import { useProjectContext } from '$lib/state';

  const projectCtx = useProjectContext();
  const fontsCtx = useFontStorage();

  async function importProject(file: File): Promise<void> {
    const entries = await parseTarGzip(await file.arrayBuffer());
    const map = mapTarEntries(entries);

    if (!map.project) {
      return;
    }

    const projectData = JSON.parse(map.project.text) as ProjectData;
    await projectCtx.import(projectData);

    if (!map.fontsManifest) {
      return;
    }

    const manifest = JSON.parse(map.fontsManifest.text) as Record<
      string,
      { name: string; type: string }
    >;

    for (const font of getProjectFonts(projectData.settings)) {
      const blob = map.fonts[font.id]?.data;
      const info = manifest[font.id];

      if (!blob || !info) {
        continue;
      }

      const file = new File([map.fonts[font.id].data!], manifest[font.id].name, {
        type: manifest[font.id].type,
      });

      await fontsCtx.import(file, font);
    }
  }

  function get(): FileList {
    return new DataTransfer().files;
  }

  function set(files: FileList): void {
    const file = files.item(0);

    if (file) {
      importProject(file);
    }
  }
</script>

<label class={buttonVariants({ variant: 'ghost', size: 'xs' })} use:tooltip={'Import'}>
  <input type="file" class="sr-only" accept=".subtitlab" bind:files={get, set} />
  <Icon class="icon-[lucide--cloud-upload]" />
  <span class="sr-only">Import project</span>
</label>
