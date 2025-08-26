<script module lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { WithElementRef } from '$lib/utils';
  import type { Oklch } from './utils';

  export type ColorPickerProps = WithElementRef<
    Omit<HTMLInputAttributes, 'type' | 'files' | 'value' | 'onchange' | 'onchangecapture'>
  > & { value: Oklch };
</script>

<script lang="ts">
  import { convert, OKLCH, sRGB } from '@texel/color';
  import * as Popover from '$lib/components/popover';
  import { cn } from '$lib/utils';
  import Canvas from './canvas.svelte';
  import { oklch } from './utils';

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...rest
  }: ColorPickerProps = $props();
  let open = $state(false);

  function drawCH(img: ImageData, size: number): void {
    for (let y = 0; y < size; ++y) {
      for (let x = 0; x < size; ++x) {
        drawPx(img, y * size * 4 + x * 4, x / (size - 1), 0.4 * (y / (size - 1)), value.hue);
      }
    }
  }

  function updateCH(x: number, y: number): void {
    value = { ...value, lightness: 100 * x, chroma: 0.4 * y };
  }

  function drawHue(img: ImageData, size: number): void {
    for (let x = 0; x < size; ++x) {
      drawPx(img, x * 4, 1, 0.4, 360 * (x / (size - 1)));
    }
  }

  function updateHue(x: number): void {
    value = { ...value, hue: 360 * x };
  }

  function drawPx(img: ImageData, px: number, l: number, c: number, h: number): void {
    const [r, g, b] = convert([l, c, h], OKLCH, sRGB).map((v) =>
      Math.round(255 * Math.max(0, Math.min(1, v))),
    );

    img.data[px] = r;
    img.data[px + 1] = g;
    img.data[px + 2] = b;
    img.data[px + 3] = 255;
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger
    class={cn(
      'selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-9 w-16 min-w-0 rounded-md border bg-transparent p-1 font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'flex cursor-pointer items-stretch',
      className,
    )}
    {...rest as any}
  >
    {#snippet child({ props })}
      <button {...props}>
        <span class="grow rounded" style:background={oklch.toCSS(value)}></span>
      </button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="flex w-3xs flex-col gap-2">
    <Canvas draw={drawCH} deps={() => value.hue} onpointer={updateCH} class="aspect-square">
      <button
        type="button"
        class="absolute top-[calc(100%*var(--y))] left-[calc(100%*var(--x))] size-3 -translate-1/2 rounded-full border-2 border-black outline-1 outline-white/70"
        style:--x={value.lightness / 100}
        style:--y={value.chroma / 0.4}
        aria-label="Drag to select color"
      >
      </button>
    </Canvas>

    <Canvas draw={drawHue} height={1} onpointer={updateHue} class="h-4">
      <button
        type="button"
        class="absolute top-0 left-[calc(100%*var(--x))] h-full w-0 -translate-x-px border-x border-black"
        style:--x={value.hue / 360}
        aria-label="Drag to select hue"
      >
      </button>
    </Canvas>
  </Popover.Content>
</Popover.Root>
