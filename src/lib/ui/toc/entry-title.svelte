<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { AnyScene } from '$lib/data';

  export type EntryTitleProps = {
    icon: string;
    select?: () => AnyScene | undefined;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { Icon } from '$lib/components/icon';
  import { SortableGrip, SortableHandle } from '$lib/components/sortable';
  import { useUiContext } from '$lib/state';

  const ui = useUiContext();

  let { icon, select, children }: EntryTitleProps = $props();

  function onclick(): void {
    ui.selectScene(select?.());
  }
</script>

<SortableHandle>
  {#snippet child(props)}
    <button
      class={[
        'group relative grow cursor-pointer p-1 text-start outline-0',
        'grid grid-cols-[min-content_1fr] items-center gap-1',
      ]}
      {onclick}
      {...props}
    >
      <SortableGrip class="group-hover:opacity-100" />
      <Icon class={icon} />
      <span class="overflow-hidden text-ellipsis whitespace-nowrap">
        {@render children?.()}
      </span>
    </button>
  {/snippet}
</SortableHandle>
