<script module lang="ts">
  export type RemoveFontProps = {
    id: string;
    family: string;
    weight?: number;
    style?: string;
  };
</script>

<script lang="ts">
  import { Confirm } from '$lib/components/alert-dialog';
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/icon';
  import { useFontStorage } from '$lib/data';
  import { fontWeights } from '$lib/utils';

  let { id, family, weight, style }: RemoveFontProps = $props();
  let name = $derived(
    [family, weight && fontWeights.get(weight), style].filter((v) => !!v).join(' '),
  );

  const fonts = useFontStorage();

  async function execute() {
    await fonts.remove(id);
  }
</script>

<Confirm {execute} destructive title={`Are you sure you want to remove font ${name}?`}>
  {#snippet child({ props })}
    <Button variant="ghost" size="xs" tooltip="Remove" {...props}>
      <Icon class="icon-[lucide--trash]" />
      <span class="sr-only">Remove</span>
    </Button>
  {/snippet}
</Confirm>
