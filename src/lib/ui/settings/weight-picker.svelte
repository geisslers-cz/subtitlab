<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type WeightPickerProps = {
    value: number;
    id?: string;
    class?: ClassValue;
    'aria-label'?: string;
  };
</script>

<script lang="ts">
  import { box } from 'svelte-toolbelt';
  import * as Select from '$lib/components/select';
  import { cn, fontWeights } from '$lib/utils';

  let { value = $bindable(), class: className, ...rest }: WeightPickerProps = $props();

  const proxy = box.with(
    () => value.toString(),
    (v) => (value = parseInt(v, 10)),
  );
</script>

<Select.Root type="single" bind:value={proxy.current}>
  <Select.Trigger class={cn('w-32 shrink-0', className)} {...rest}>
    {fontWeights.get(value)}
  </Select.Trigger>
  <Select.Content>
    {#each fontWeights as [weight, label] (weight)}
      <Select.Item value={weight.toString()}>
        <span style:font-weight={weight}>{label}</span>
      </Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
