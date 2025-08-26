<script module lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
  import { Keymap } from '$lib/components/keymap';

  export type RootProps = DropdownMenuPrimitive.RootProps & {
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

<DropdownMenuPrimitive.Root bind:open {...rest}>
  {@render children?.()}
</DropdownMenuPrimitive.Root>
