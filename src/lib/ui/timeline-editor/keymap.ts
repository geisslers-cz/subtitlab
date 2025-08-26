import type { AudioPlayerContext } from '$lib/components/audio-player';
import { Keymap } from '$lib/components/keymap';
import type { UiContext } from '$lib/state';
import type { LaydownContext } from './laydown';
import { zoomMultiplier } from './utils';

export class EditorKeymap extends Keymap {
  #ui?: UiContext;
  #player?: AudioPlayerContext;
  #laydown?: LaydownContext;

  constructor() {
    super({
      ' ': () => {
        if (this.#player?.duration) {
          this.#player.playing = !this.#player.playing;
        }
      },
      ArrowLeft: () => {
        if (this.#player?.duration) {
          this.#player.currentTime = Math.max(
            0,
            this.#player.currentTime - 2.5 / this.#player.zoom,
          );
        }
      },
      ArrowRight: () => {
        if (this.#player?.duration) {
          this.#player.currentTime = Math.min(
            this.#player.duration,
            this.#player.currentTime + 2.5 / this.#player.zoom,
          );
        }
      },
      '[': () => {
        this.#laydown?.startNext();
      },
      ']': () => {
        this.#laydown?.end();
      },
      f: () => {
        this.#player?.cycleFollow();
      },
      'Ctrl+z': () => this.#ui?.undo(),
      'Ctrl+Shift+z': () => this.#ui?.redo(),
      'Shift++': () => {
        if (this.#player) {
          this.#player.zoom *= zoomMultiplier;
        }
      },
      '-': () => {
        if (this.#player) {
          this.#player.zoom /= zoomMultiplier;
        }
      },
    });
  }

  useContext(ui: UiContext, player: AudioPlayerContext, laydown: LaydownContext): () => void {
    this.#ui = ui;
    this.#player = player;
    this.#laydown = laydown;

    return () => {
      this.#ui = undefined;
      this.#player = undefined;
      this.#laydown = undefined;
    };
  }
}
