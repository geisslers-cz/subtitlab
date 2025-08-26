<script module lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import type { Keymap } from '$lib/components/keymap';

  export type RootProps = SelectPrimitive.RootProps & {
    keymap?: Keymap | 'none';
  };
</script>

<script lang="ts">
  import { useKeymapContext } from '$lib/components/keymap';

  let {
    open = $bindable(false),
    value = $bindable(),
    keymap = 'none',
    children,
    ...rest
  }: RootProps = $props();

  const ctx = useKeymapContext();

  $effect(() => {
    if (open) {
      return ctx.use(keymap);
    }
  });
</script>

<SelectPrimitive.Root bind:open bind:value={value as any} {...rest}>
  {@render children?.()}
</SelectPrimitive.Root>
