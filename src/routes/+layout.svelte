<script lang="ts">
  import '../app.css';
  import { pwaAssetsHead } from 'virtual:pwa-assets/head';
  import { pwaInfo } from 'virtual:pwa-info';
  import { KeymapContextProvider } from '$lib/components/keymap';
  import { Pwa } from '$lib/components/pwa';
  import { ProjectContextProvider } from '$lib/state';

  let { children } = $props();
</script>

<svelte:head>
  <title>Goldcraft Subtitlab</title>

  {#if pwaInfo}
    <link rel="manifest" href={pwaInfo.webManifest.href} />
  {/if}
  {#if pwaAssetsHead.themeColor}
    <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
  {/if}
  {#each pwaAssetsHead.links as link (link.href)}
    <link {...link} />
  {/each}
</svelte:head>

<Pwa />

<KeymapContextProvider>
  <ProjectContextProvider>
    {@render children()}
  </ProjectContextProvider>
</KeymapContextProvider>
