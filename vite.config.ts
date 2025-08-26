import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    SvelteKitPWA({
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      strategies: 'generateSW',
      registerType: 'prompt',
      srcDir: 'src',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'Goldcraft Subtitlab',
        short_name: 'Goldcraft Subtitlab',
        description: 'Subtitle editor and renderer for theatre use',
        theme_color: '#161618',
        background_color: '#161618',
        display: 'fullscreen',
      },
      pwaAssets: {
        image: 'static/favicon.svg',
      },
    }),
    devtoolsJson(),
  ],
});
