import { getContext, setContext, untrack } from 'svelte';
import type { AudioPlayerContext } from '$lib/components/audio-player';
import type { TimedCue, TimedScene } from '$lib/data';
import type { ProjectContext } from '$lib/state';
import { touch } from '$lib/utils';

export interface LaydownContext {
  active: boolean;
  next?: string;
  getCueEnd(cue: TimedCue): number;
  getChains(): Iterable<TimedCue[]>;
  startNext(): void;
  end(): void;
}

const ctxKey = Symbol('laydown');

export function createLaydownContext(
  scene: TimedScene,
  player: AudioPlayerContext,
  project: ProjectContext,
): LaydownContext {
  const ctx = new DefaultLaydownContext(scene, player, project);
  setContext(ctxKey, ctx);
  return ctx;
}

export function useLaydownContext(): LaydownContext {
  return getContext(ctxKey);
}

export class DefaultLaydownContext implements LaydownContext {
  active = $state(false);
  readonly #scene: TimedScene;
  readonly #player: AudioPlayerContext;
  readonly #project: ProjectContext;
  readonly #state?: LaydownState;

  constructor(scene: TimedScene, player: AudioPlayerContext, project: ProjectContext) {
    this.#scene = scene;
    this.#player = player;
    this.#project = project;
    this.#state = $derived(
      this.active && player.playing ? untrack(() => new LaydownState(scene, player)) : undefined,
    );

    $effect(() => {
      const current = this.#state;

      if (!current) {
        return;
      }

      project.current.history.begin();

      return () => {
        if (current.dirty) {
          this.#updateOrder();
        }

        project.current.history.commit();
      };
    });
  }

  get next(): string | undefined {
    return this.#state?.cursor?.content;
  }

  getCueEnd(cue: TimedCue): number {
    return this.#state?.chain.includes(cue) ? this.#player.currentTime : cue.to;
  }

  getChains(): Iterable<TimedCue[]> {
    return {
      [Symbol.iterator]: () => this.#getChains(),
    };
  }

  startNext(): void {
    if (!this.#state) {
      return;
    }

    this.#state.dirty = true;

    if (this.#state.cursor) {
      this.#state.cursor.from = this.#player.currentTime;
      this.#state.chain.push(this.#state.cursor);
      this.#state.cursor = this.#state.queue.shift();
    } else {
      const cue = this.#scene.cues.create({ from: this.#player.currentTime });
      this.#scene.cues.insert(cue);
      this.#state.chain.push(cue);
    }
  }

  end(): void {
    if (!this.#state || !this.#state.chain.length) {
      return;
    }

    this.#state.dirty = true;

    for (const cue of this.#state.chain) {
      cue.to = this.#player.currentTime;
    }

    this.#state.chains.push(this.#state.chain);
    this.#state.chain = [];
  }

  *#getChains(): IterableIterator<TimedCue[]> {
    if (!this.#state) {
      yield* this.#scene.getChains();
      return;
    }

    touch(this.#state.cursor);

    yield* this.#state.chains;

    if (this.#state.chain.length) {
      yield this.#state.chain;
    }
  }

  #updateOrder(): void {
    const order = new Map(this.#scene.cues.toArray().map((cue, i) => [cue, i]));

    this.#project.current.history.add(
      () => this.#scene.cues.sort((a, b) => a.from - b.from),
      () => this.#scene.cues.sort((a, b) => order.get(a)! - order.get(b)!),
    );
  }
}

class LaydownState {
  chains: TimedCue[][];
  queue: TimedCue[];
  chain: TimedCue[];
  cursor?: TimedCue;
  dirty: boolean = false;

  constructor(scene: TimedScene, player: AudioPlayerContext) {
    const chains: TimedCue[][] = [];
    const queue: TimedCue[] = [];
    let accept = false;

    for (const chain of scene.getChains()) {
      if (!accept) {
        if (chain.every((cue) => cue.from >= player.currentTime)) {
          accept = true;
          queue.push(...chain);
        } else {
          chains.push(chain);
        }
      } else {
        queue.push(...chain);
      }
    }

    this.chains = $state(chains);
    this.queue = $state(queue);
    this.chain = $state([]);
    this.cursor = $state(queue.shift());
  }
}
