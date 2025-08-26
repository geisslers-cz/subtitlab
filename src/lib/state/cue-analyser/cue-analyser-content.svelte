<script module lang="ts">
  import type { AnyCue, CueSize, FontStorage, Settings } from '$lib/data';

  export type CueAnalyserJob = {
    mode: 'measure' | 'format';
    cue: AnyCue;
  };

  export type CueAnalyserContentProps = {
    win: Window;
    doc: Document;
    fonts: FontStorage;
    settings?: Settings;
    job?: CueAnalyserJob;
    onanalysed: (id: string, size: CueSize) => void;
    onformatted: (id: string, content: string) => void;
  };

  function getJobText(job?: CueAnalyserJob): string {
    if (!job) {
      return '';
    }

    return job.mode === 'format' ? job.cue.content.trim().replace(/\s+/g, ' ') : job.cue.content;
  }

  function getRangeLines(range: Range): number {
    const rects = [...range.getClientRects()];
    const distinctByTopCoord = new Set(rects.map((rect) => rect.top));
    return distinctByTopCoord.size;
  }

  function measureCueWidth(doc: Document, elem: HTMLParagraphElement): number {
    const { width } = elem.getBoundingClientRect();
    return width / doc.body.offsetWidth;
  }

  function measureCueHeight(
    doc: Document,
    elem: HTMLParagraphElement,
    content: string,
  ): [height: number, wrapped: boolean] {
    const range = doc.createRange();
    range.selectNodeContents(elem);

    const actualLines = getRangeLines(range);
    const expectedLines = content.split(/\n/g).length;
    const { height } = elem.getBoundingClientRect();

    range.collapse(true);

    return [height / doc.body.offsetWidth, actualLines > expectedLines];
  }

  type TextInfo = { node: Text; offset: number };

  function isTextNode(node: Node): node is Text {
    return node.nodeType === 3;
  }

  function createTextMap(elem: HTMLParagraphElement): [TextInfo[], string] {
    const textNodes: TextInfo[] = [];
    let content = '';
    let offset = 0;

    for (const node of elem.childNodes) {
      if (isTextNode(node) && node.nodeValue?.length) {
        textNodes.push(...new Array(node.nodeValue.length).fill({ node, offset }));
        content += node.nodeValue;
        offset += node.nodeValue.length;
      }
    }

    return [textNodes, content];
  }

  function formatCue(doc: Document, elem: HTMLParagraphElement): string {
    const range = doc.createRange();
    const [text, content] = createTextMap(elem);
    const lines: string[] = [];
    let start = 0;

    range.setStart(text[0].node, 0);

    for (let end = 1; end < text.length; ++end) {
      range.setEnd(text[end].node, end - text[end].offset);

      if (range.getClientRects().length - lines.length > 1) {
        lines.push(content.slice(start, end - 1).trim());
        start = end - 1;
        range.setStart(text[start].node, start - text[start].offset);
      }
    }

    range.collapse(true);
    lines.push(content.slice(start));
    return lines.join('\n');
  }
</script>

<script lang="ts">
  import { FontLoader } from '$lib/components/font-loader';
  import { ProjectorMain } from '$lib/components/projector';
  import { getProjectFonts } from '$lib/data';

  let { win, doc, fonts, settings, job, onanalysed, onformatted }: CueAnalyserContentProps =
    $props();
  let elem: HTMLParagraphElement | null = $state(null);
  let width: number | undefined = $state();
  let content = $derived(getJobText(job));

  $effect(() => {
    if (!job || !elem) {
      return;
    }

    if (job.mode === 'measure') {
      if (width === undefined) {
        width = measureCueWidth(doc, elem);
      } else {
        const [height, wrapped] = measureCueHeight(doc, elem, content);
        onanalysed(job.cue.id, { width, height, wrapped });
        width = undefined;
      }

      return;
    }

    if (!content.length) {
      onformatted(job.cue.id, content);
      return;
    }

    onformatted(job.cue.id, formatCue(doc, elem));
  });
</script>

<FontLoader window={win} document={doc} storage={fonts} fonts={getProjectFonts(settings)}>
  {#if settings}
    <ProjectorMain
      {settings}
      wrap={job?.mode !== 'measure' || width !== undefined}
      transitions={false}
    >
      <p bind:this={elem}>
        {content}
      </p>
    </ProjectorMain>
  {/if}
</FontLoader>
