/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/pwa-assets" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface NavigatorKeyboard {
    lock?(keys?: string[]): Promise<void>;
    unlock?(): void;
  }

  interface Navigator {
    readonly keyboard?: NavigatorKeyboard;
  }

  interface ScreenDetailed extends Screen {
    readonly availLeft: number;
    readonly availTop: number;
    readonly devicePixelRatio: number;
    readonly isInternal: boolean;
    readonly isPrimary: boolean;
    readonly label: string;
    readonly left: number;
    readonly top: number;
  }

  interface ScreenDetails extends EventTarget {
    readonly currentScreen: ScreenDetailed;
    readonly screens: readonly ScreenDetailed[];
  }

  interface Window {
    getScreenDetails?(): Promise<ScreenDetails>;
  }

  interface FullscreenOptions {
    screen?: ScreenDetailed;
  }
}

export {};
