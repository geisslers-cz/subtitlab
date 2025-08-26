<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { Settings } from '$lib/data';

  export type ProjectorMainProps = {
    settings: Settings;
    wrap?: boolean;
    transitions?: boolean;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { oklch } from '$lib/components/color-picker';
  import { projectorArea } from '$lib/data';

  let { settings, wrap = true, transitions = true, children }: ProjectorMainProps = $props();
</script>

<main
  style:font-family={typeof settings.fontFamily !== 'string'
    ? settings.fontFamily.family
    : settings.fontFamily}
  style:font-size={`${settings.fontSize * 100}vw`}
  style:line-height={`${settings.lineHeight * 100}vw`}
  style:font-weight={settings.fontWeight}
  style:font-style={settings.fontStyle}
  style:letter-spacing={`${settings.letterSpacing * 100}vw`}
  style:color={oklch.toCSS(settings.color)}
  style:gap={`${settings.cueGap * 100}vw`}
  style:max-width={wrap ? `${projectorArea * 100}vw` : undefined}
  style:--transition-in-duration={transitions ? settings.transitionIn?.duration : undefined}
  style:--transition-out-duration={transitions ? settings.transitionOut?.duration : undefined}
  data-transition-in={transitions ? settings.transitionIn?.type : undefined}
  data-transition-out={transitions ? settings.transitionOut?.type : undefined}
>
  {@render children?.()}
</main>
