<script module lang="ts">
  import type { AriaAttributes } from 'svelte/elements';
  import type { ClassValue } from '$lib/utils';

  export type TimeInputProps = AriaAttributes & {
    ref?: HTMLInputElement;
    id?: string;
    value: number;
    min?: number;
    class?: ClassValue;
    onchange?: (time: number, previous: number) => void;
    onblur?: () => void;
  };

  const pattern = /^(?:(\d+(?:\.\d*)?|\.\d*)|(\d+):(\d*(?:\.\d*)?))$/;

  function parse(value: string, min: number): number | undefined {
    const match = value.match(pattern);

    if (!match) {
      return undefined;
    }

    const [m, s] = match[1]?.length ? ['0', match[1]] : [match[2], match[3]];
    const t = parseFloat(m) * 60 + parseFloat(s);
    return t < min ? undefined : t;
  }
</script>

<script lang="ts">
  import { cn, formatTime } from '$lib/utils';

  let {
    ref = $bindable(),
    value: current = $bindable(),
    min = 0,
    class: className,
    onchange,
    onblur: blur,
    ...rest
  }: TimeInputProps = $props();
  let value = $derived(formatTime(current));
  let invalid = $derived(parse(value, min) === undefined);

  function onkeydown(evt: KeyboardEvent): void {
    switch (evt.key) {
      case 'Escape':
        value = formatTime(current);
        blur?.();
        break;
      case 'Enter':
        if (!invalid) {
          onblur();
        }
        break;
      default:
        return;
    }

    evt.preventDefault();
  }

  function onblur(): void {
    const next = parse(value, min);

    if (next === undefined) {
      value = formatTime(current);
      blur?.();
      return;
    }

    const previous = current;
    current = next;
    onchange?.(current, previous);
    blur?.();
  }
</script>

<input
  bind:this={ref}
  bind:value
  {...rest}
  pattern={pattern.source.slice(1, -1)}
  class={cn('aria-[invalid=true]:text-destructive', className)}
  {onkeydown}
  {onblur}
  aria-invalid={invalid}
/>
