<script module lang="ts">
  export type RemoveFontProps = {
    id: string;
    title: string;
  };
</script>

<script lang="ts">
  import { Confirm } from '$lib/components/alert-dialog';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useProjectContext } from '$lib/state';

  const ctx = useProjectContext();

  let { id, title }: RemoveFontProps = $props();

  function execute() {
    ctx.remove(id);
  }
</script>

<Confirm {execute} destructive title={`Are you sure you want to remove project "${title}"?`}>
  {#snippet child({ props })}
    <Button variant="ghost" size="xs" tooltip="Remove" {...props}>
      <Icon class="icon-[lucide--trash]" />
      <span class="sr-only">Remove</span>
    </Button>
  {/snippet}
</Confirm>
