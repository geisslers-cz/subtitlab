<script module lang="ts">
  import { getContext } from 'svelte';
  import type { AudioPlayerContext, AudioPlayerInternalContext } from './context.svelte';

  const key = Symbol('audio player');

  export function useAudioPlayer(): AudioPlayerContext {
    return getContext(key);
  }

  export function useAudioPlayerInternals(): AudioPlayerInternalContext {
    return getContext(key);
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { DefaultAudioContext } from './context.svelte';

  let { children } = $props();

  const context = new DefaultAudioContext();
  let player: HTMLAudioElement | undefined = $state();

  setContext(key, context);

  $effect(() => {
    if (player) {
      if (context.url !== undefined) {
        player.src = context.url;
      } else {
        player.src = '';
      }
    }

    return () => {
      if (player) {
        player.src = '';
      }
    };
  });

  $effect(() => () => context.destroy());
</script>

<audio bind:this={player} bind:paused={context.paused} bind:currentTime={context.currentTime}
></audio>

{@render children?.()}
