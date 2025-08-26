import { analyseAudioFile } from './utils';

export type FollowMode = 'instant' | 'window';

export interface AudioPlayerContext {
  readonly loading: boolean;
  readonly fileName?: string;
  readonly duration?: number;
  currentTime: number;
  playing: boolean;
  zoom: number;
  follow?: FollowMode;
  load(file?: File): void;
  cycleFollow(): void;
}

export interface AudioPlayerInternalContext extends AudioPlayerContext {
  readonly peaks?: number[];
  readonly url?: string;
  paused: boolean;
  destroy(): void;
}

export class DefaultAudioContext implements AudioPlayerInternalContext {
  loading: boolean = $state(false);
  fileName?: string = $state();
  duration?: number = $state();
  currentTime: number = $state(0);
  playing: boolean = $state(false);
  zoom: number = $state(1);
  follow?: FollowMode = $state('window');
  peaks?: number[] = $state.raw();
  #url?: string = $state();
  #abort?: () => void;

  async load(file?: File): Promise<void> {
    this.destroy();

    if (!file) {
      return;
    }

    this.loading = true;
    let aborted = false;

    this.#abort = () => {
      this.loading = false;
      aborted = true;
    };

    const { duration, peaks } = await analyseAudioFile(file);

    if (aborted) {
      return;
    }

    this.loading = false;
    this.#abort = undefined;
    this.fileName = file.name;
    this.duration = duration;
    this.peaks = peaks;
    this.#url = URL.createObjectURL(file);
  }

  get paused(): boolean {
    return !this.playing;
  }

  set paused(paused: boolean) {
    this.playing = !paused;
  }

  get url(): string | undefined {
    return this.#url;
  }

  cycleFollow(): void {
    switch (this.follow) {
      case 'instant':
        this.follow = undefined;
        break;
      case 'window':
        this.follow = 'instant';
        break;
      default:
        this.follow = 'window';
        break;
    }
  }

  destroy(): void {
    if (this.#url) {
      URL.revokeObjectURL(this.#url);
    }

    this.#abort = void this.#abort?.();
    this.currentTime = 0;
    this.playing = false;
    this.zoom = 1;
    this.fileName = this.duration = this.peaks = this.#url = undefined;
  }
}
