<script module lang="ts">
  import type { Snippet } from 'svelte';

  export type ConfirmCloseCurrentProps = Record<string, unknown> & {
    execute: () => void;
    child: Snippet<[props: Record<string, unknown>]>;
  };
</script>

<script lang="ts">
  import { Confirm } from '$lib/components/alert-dialog';
  import { useProjectContext } from '$lib/state';

  const ctx = useProjectContext();

  let { execute, child: trigger, ...rest }: ConfirmCloseCurrentProps = $props();
</script>

{#if !ctx.loading && !ctx.current.history.atSavePoint}
  <Confirm
    destructive
    title="Are you sure you want to close the current project?"
    description="Any unsaved changes will be lost."
    {execute}
    {...rest}
  >
    {#snippet child({ props })}
      {@render trigger(props)}
    {/snippet}
  </Confirm>
{:else}
  {@render trigger({ ...rest, onclick: execute })}
{/if}
