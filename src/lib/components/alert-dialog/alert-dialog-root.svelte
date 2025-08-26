<script module lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import type { Keymap } from '$lib/components/keymap';

  export type RootProps = AlertDialogPrimitive.RootProps & {
    keymap?: Keymap | 'none';
  };
</script>

<script lang="ts">
  import { useKeymapContext } from '$lib/components/keymap';

  let { open = $bindable(false), keymap = 'none', children, ...rest }: RootProps = $props();

  const ctx = useKeymapContext();

  $effect(() => {
    if (open) {
      return ctx.use(keymap);
    }
  });
</script>

<AlertDialogPrimitive.Root bind:open {...rest}>
  {@render children?.()}
</AlertDialogPrimitive.Root>
