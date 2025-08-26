<script module lang="ts">
  import type { ClassValue } from '$lib/utils';

  export type IconProps = {
    class: ClassValue;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils';

  let { class: className }: IconProps = $props();
</script>

<span class={cn('inline-block size-4', className)} data-slot="icon"></span>
