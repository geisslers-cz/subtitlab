<script module lang="ts">
  import type { Component } from 'svelte';
  import type { ClassValue } from '$lib/utils';

  export type ContentComponentProps = {
    win: Window;
    doc: Document;
  };

  export type EmbedRendererProps<Props extends ContentComponentProps> = {
    content: Component<Props>;
    props: Omit<Props, 'win' | 'doc'>;
    aspectRatio: number;
    class?: ClassValue;
  };
</script>

<script lang="ts" generics="Props extends ContentComponentProps">
  import { mount, unmount } from 'svelte';
  import { cn, merge } from '$lib/utils';
  import projectorTemplate from './projector-template.html?raw';

  let { content, props, aspectRatio, class: className }: EmbedRendererProps<Props> = $props();

  let frame: HTMLIFrameElement | null = $state(null);

  $effect(() => {
    if (!frame || !frame.contentDocument || !frame.contentWindow) {
      return;
    }

    frame.contentDocument.open();
    frame.contentDocument.write(projectorTemplate);
    frame.contentDocument.close();

    const projector = mount(content, {
      target: frame.contentDocument.body,
      props: merge(props, {
        win: frame.contentWindow,
        doc: frame.contentDocument,
      }) as Props,
    });

    return () => {
      unmount(projector);
    };
  });
</script>

<iframe
  bind:this={frame}
  src="data:text/plain;base64,IA=="
  title="Subtitle Projector"
  class={cn('block w-full', className)}
  style:aspect-ratio={aspectRatio}
></iframe>
