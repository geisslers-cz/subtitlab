<script module lang="ts">
  import type { Snippet } from 'svelte';

  export type ConfirmProps = Record<string, unknown> & {
    execute: () => void;
    title?: Snippet | string;
    description?: Snippet | string;
    confirm?: string;
    destructive?: boolean;
    open?: boolean;
    child?: Snippet<[{ props: Record<string, unknown> }]>;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '$lib/components/alert-dialog';

  let {
    execute,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirm = 'Confirm',
    destructive,
    open = $bindable(false),
    ...rest
  }: ConfirmProps = $props();
</script>

<AlertDialog bind:open>
  <AlertDialogTrigger {...rest} />
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        {#if typeof title === 'string'}
          {title}
        {:else}
          {@render title()}
        {/if}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {#if typeof description === 'string'}
          {description}
        {:else}
          {@render description()}
        {/if}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction
        {destructive}
        onclick={() => {
          open = false;
          execute();
        }}
      >
        {confirm}
      </AlertDialogAction>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
