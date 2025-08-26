<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import UpdatePrompt from './update-prompt.svelte';

  const { needRefresh, updateServiceWorker } = useRegisterSW();
  let lastUpdate = Date.now();

  function checkUpdate(): void {
    if (document.visibilityState === 'visible' && Date.now() - lastUpdate > 300_000) {
      lastUpdate = Date.now();
      updateServiceWorker();
    }
  }
</script>

<svelte:document on:visibilitychange={checkUpdate} />

{#if $needRefresh}
  <UpdatePrompt dismiss={() => needRefresh.set(false)} update={() => updateServiceWorker(true)} />
{/if}
