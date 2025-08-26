<script lang="ts">
  import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui';
  import { cn, type WithoutChild } from '$lib/utils';
  import Scrollbar from './scroll-area-scrollbar.svelte';

  let {
    ref = $bindable(null),
    class: className,
    type = 'scroll',
    orientation = 'vertical',
    viewport = $bindable(null),
    scrollbarXClasses = '',
    scrollbarYClasses = '',
    children,
    ...restProps
  }: WithoutChild<ScrollAreaPrimitive.RootProps> & {
    orientation?: 'vertical' | 'horizontal' | 'both' | undefined;
    viewport?: HTMLElement | null;
    scrollbarXClasses?: string | undefined;
    scrollbarYClasses?: string | undefined;
  } = $props();
</script>

<ScrollAreaPrimitive.Root
  bind:ref
  data-slot="scroll-area"
  class={cn('relative', className)}
  {type}
  {...restProps}
>
  <ScrollAreaPrimitive.Viewport
    bind:ref={viewport}
    data-slot="scroll-area-viewport"
    class="absolute top-0 left-0 size-full min-h-full w-full rounded-[inherit] transition-[color,box-shadow]"
  >
    {@render children?.()}
  </ScrollAreaPrimitive.Viewport>
  {#if orientation === 'vertical' || orientation === 'both'}
    <Scrollbar orientation="vertical" class={scrollbarYClasses} />
  {/if}
  {#if orientation === 'horizontal' || orientation === 'both'}
    <Scrollbar orientation="horizontal" class={scrollbarXClasses} />
  {/if}
  <ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
