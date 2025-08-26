<script module lang="ts">
  import CueAnalyserContent, { type CueAnalyserContentProps } from './cue-analyser-content.svelte';

  export type CueAnalyserProps = Omit<CueAnalyserContentProps, 'win' | 'doc'> & {
    aspectRatio: number;
  };
</script>

<script lang="ts">
  import { EmbedRenderer } from '$lib/components/projector';

  let { aspectRatio, ...rest }: CueAnalyserProps = $props();
</script>

<div class="absolute top-0 left-[-1000px] w-lg opacity-0">
  <EmbedRenderer {aspectRatio} content={CueAnalyserContent} props={rest} />
</div>
