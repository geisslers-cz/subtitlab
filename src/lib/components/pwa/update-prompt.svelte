<script module lang="ts">
  export type UpdatePromptProps = {
    update?: () => void;
    dismiss?: () => void;
  };
</script>

<script lang="ts">
  import { Button } from '$lib/components/button';

  let { update, dismiss }: UpdatePromptProps = $props();
</script>

<div
  class="bg-popover text-popover-foreground fixed right-4 bottom-4 flex flex-col gap-2 rounded border p-4 shadow"
>
  <p>A new version of the app is available!</p>
  <div class="flex items-center justify-end gap-2">
    <Button onclick={() => update?.()}>Update</Button>
    <Button variant="secondary" onclick={() => dismiss?.()}>Dismiss</Button>
  </div>
</div>
