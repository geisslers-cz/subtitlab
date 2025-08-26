<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import UpdatePrompt from './update-prompt.svelte';

  const { needRefresh, updateServiceWorker } = useRegisterSW();
</script>

{#if $needRefresh}
  <UpdatePrompt dismiss={() => needRefresh.set(false)} update={() => updateServiceWorker(true)} />
{/if}
