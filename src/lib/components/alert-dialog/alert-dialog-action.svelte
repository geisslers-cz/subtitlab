<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import { buttonVariants } from '$lib/components/button';
  import { cn } from '$lib/utils';

  let {
    ref = $bindable(null),
    class: className,
    destructive,
    ...restProps
  }: AlertDialogPrimitive.ActionProps & { destructive?: boolean } = $props();
</script>

<AlertDialogPrimitive.Action
  bind:ref
  data-slot="alert-dialog-action"
  class={cn(buttonVariants({ variant: destructive ? 'destructive' : 'default' }), className)}
  {...restProps}
/>
