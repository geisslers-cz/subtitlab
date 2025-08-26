import { lastInChain, type Playhead, resolveChain, type Settings, TimedCue } from '$lib/data';

export class TimelineDispatcher {
  readonly #t0: number = Date.now();
  readonly #offset: number;
  readonly #settings: Settings;
  #update: (playhead?: Playhead<TimedCue>) => void;
  #playhead?: Playhead<TimedCue>;
  #tmr?: number;

  constructor(
    cue: TimedCue,
    offset: number,
    settings: Settings,
    update: (playhead?: Playhead<TimedCue>) => void,
  ) {
    this.#offset = offset;
    this.#update = update;
    this.#settings = settings;
    this.#playhead = this.#createPlayhead(cue);
    this.#update(this.#playhead);
  }

  dispatch = () => {
    if (!this.#playhead) {
      return;
    }

    this.#tmr = requestAnimationFrame(this.dispatch);

    const t = (Date.now() - this.#t0) / 1000;
    const tin = (this.#settings.transitionIn?.duration ?? 0) / 1000;
    const tout = (this.#settings.transitionOut?.duration ?? 0) / 1000;
    let waiting = false;
    let visible = 0;

    for (const cue of this.#playhead.chain.keys()) {
      if (cue.from - tin / 2 - this.#offset > t) {
        this.#playhead.chain.set(cue, 'waiting');
        waiting = true;
      } else if (cue.to - tout / 2 - this.#offset > t) {
        this.#playhead.chain.set(cue, 'show');
        ++visible;
      } else {
        this.#playhead.chain.set(cue, 'hide');
      }
    }

    if (!waiting && !visible) {
      const { next } = lastInChain(this.#playhead.chain)!;
      this.#playhead = next && this.#createPlayhead(next);
      this.#update(this.#playhead);
    }
  };

  destroy(): void {
    this.#playhead?.chain.clear();
    this.#playhead = undefined;
    this.#update = () => {};

    if (this.#tmr) {
      cancelAnimationFrame(this.#tmr);
      this.#tmr = undefined;
    }
  }

  #createPlayhead(cue: TimedCue): Playhead<TimedCue> {
    return {
      chain: resolveChain(cue),
      t0: this.#offset + (Date.now() - this.#t0) / 1000,
    };
  }
}
