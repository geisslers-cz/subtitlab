<script module lang="ts">
  import { Drawer as DrawerPrimitive } from 'vaul-svelte';
  import { Keymap } from '$lib/components/keymap';

  export type RootProps = DrawerPrimitive.RootProps & {
    keymap?: Keymap | 'none';
  };
</script>

<script lang="ts">
  import { useKeymapContext } from '$lib/components/keymap';

  let {
    shouldScaleBackground = true,
    open = $bindable(false),
    activeSnapPoint = $bindable(null),
    keymap = 'none',
    ...restProps
  }: RootProps = $props();

  const ctx = useKeymapContext();

  $effect(() => {
    if (open) {
      return ctx.use(keymap);
    }
  });
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps} />
