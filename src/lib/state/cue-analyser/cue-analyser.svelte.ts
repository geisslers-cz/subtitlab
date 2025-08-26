import { mount, unmount } from 'svelte';
import { box, type ReadableBox } from 'svelte-toolbelt';
import type { AnyCue, CueSize, FontStorage, Settings } from '$lib/data';
import { touch } from '$lib/utils';
import CueAnalyserContainer from './cue-analyser-container.svelte';

export type CueAnalyserProps = {
  aspectRatio: ReadableBox<number>;
  settings: ReadableBox<Settings | undefined>;
  fonts: FontStorage;
};

type AnalyserJob = {
  cue: AnyCue;
  mode: 'measure' | 'format';
};

export class CueAnalyser {
  readonly #settings: ReadableBox<Settings | undefined>;
  readonly #queue: AnalyserJob[] = $state([]);
  readonly #enqueued: WeakMap<AnyCue, 'measure' | 'format'> = new WeakMap();
  #currentJob?: AnalyserJob = $state.raw();
  #tmr?: number;

  constructor(props: CueAnalyserProps) {
    this.#settings = props.settings;

    $effect(() => {
      const analyser = mount(CueAnalyserContainer, {
        target: document.body,
        props: box.flatten({
          ...props,
          job: box.with(() => this.#currentJob),
          onanalysed: this.#onAnalysed,
          onformatted: this.#onFormatted,
        }),
      });

      return () => {
        unmount(analyser);
      };
    });
  }

  analyse(cue: AnyCue): void {
    touch(
      cue.content,
      this.#settings.current?.fontFamily,
      this.#settings.current?.fontSize,
      this.#settings.current?.lineHeight,
      this.#settings.current?.letterSpacing,
      this.#settings.current?.fontWeight,
      this.#settings.current?.fontStyle,
    );

    if (this.#enqueued.get(cue) === 'measure') {
      return;
    }

    this.#enqueued.set(cue, 'measure');
    this.#queue.push({ cue, mode: 'measure' });
    this.#scheduleNextJob();
  }

  format(cue: AnyCue): void {
    if (this.#enqueued.get(cue) === 'format') {
      return;
    }

    this.#enqueued.set(cue, 'format');
    this.#queue.push({ cue, mode: 'format' });
    this.#scheduleNextJob();
  }

  #processNextJob = (): void => {
    this.#tmr = undefined;
    this.#currentJob = this.#queue.shift();

    if (!this.#currentJob) {
      return;
    }

    this.#enqueued.delete(this.#currentJob.cue);

    if (!this.#currentJob.cue.attached) {
      this.#currentJob = undefined;
      this.#scheduleNextJob();
    }
  };

  #onAnalysed = (id: string, size: CueSize): void => {
    const cue = this.#finishJob('measure', id);

    if (cue) {
      cue.size = size;
    }

    this.#scheduleNextJob();
  };

  #onFormatted = (id: string, content: string): void => {
    const cue = this.#finishJob('format', id);

    if (cue) {
      cue.content = content;
    }

    this.#scheduleNextJob();
  };

  #finishJob(mode: 'measure' | 'format', id: string): AnyCue | undefined {
    const job = this.#currentJob;

    if (job && job.mode === mode && job.cue.id === id) {
      this.#currentJob = undefined;
      return job.cue;
    }

    return undefined;
  }

  #scheduleNextJob(): void {
    if (!this.#tmr && !this.#currentJob && this.#queue.length) {
      this.#tmr = requestAnimationFrame(this.#processNextJob);
    }
  }
}
