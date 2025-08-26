import type { Act } from './act.svelte';
import { Collection } from './collection.svelte';
import { ManualCue, TimedCue } from './cue.svelte';
import { ChildNode } from './node.svelte';
import type {
  AnySceneData,
  ManualCueData,
  ManualSceneData,
  MidiTrigger,
  SceneData,
  TimedCueData,
  TimedSceneData,
} from './types';
import type { UndoManager } from './undo.svelte';

export abstract class Scene extends ChildNode<Act, AnyScene> {
  protected readonly history: UndoManager;
  #title: string;

  constructor(history: UndoManager, { id, title = '' }: Partial<SceneData> = {}) {
    super(id);
    this.history = history;
    this.#title = $state(title);
  }

  get title(): string {
    return this.#title;
  }

  set title(value: string) {
    const previous = this.#title;

    if (value === previous) {
      return;
    }

    this.history.add(
      () => (this.#title = value),
      () => (this.#title = previous),
    );
  }

  protected get siblings(): Collection<AnyScene, AnySceneData> {
    return this.parent.scenes;
  }

  toJSON(): SceneData {
    return {
      id: this.id,
      title: this.#title,
    };
  }
}

export class ManualScene extends Scene {
  readonly cues: Collection<ManualCue, ManualCueData>;

  constructor(history: UndoManager, { type, cues = [], ...rest }: Partial<ManualSceneData> = {}) {
    super(history, rest);
    this.cues = new Collection(this, history, cues, (data) => new ManualCue(history, data));
  }

  toJSON(): ManualSceneData {
    return {
      ...super.toJSON(),
      type: 'manual',
      cues: this.cues.map((cue) => cue.toJSON()),
    };
  }
}

export class TimedScene extends Scene {
  readonly cues: Collection<TimedCue, TimedCueData>;
  #chains: Map<TimedCue, TimedCue[]>;
  #trigger?: MidiTrigger;

  constructor(
    history: UndoManager,
    { type, cues = [], trigger, ...rest }: Partial<TimedSceneData> = {},
  ) {
    super(history, rest);

    this.cues = new Collection(this, history, cues, ({ from, to, ...data }) => {
      from ??= this.cues.last?.to ?? 0;
      to ??= from + 1;

      return new TimedCue(history, { from, to, ...data });
    });

    this.#chains = $derived(resolveTimedChains(this.cues));
    this.#trigger = $state(trigger);
  }

  get trigger(): MidiTrigger | undefined {
    return this.#trigger;
  }

  set trigger(value: MidiTrigger | undefined) {
    const previous = this.#trigger;

    if (value === previous) {
      return;
    }

    this.history.add(
      () => (this.#trigger = value),
      () => (this.#trigger = previous),
    );
  }

  getChains(): Iterable<TimedCue[]> {
    return new Set(this.#chains.values());
  }

  getChain(cue: TimedCue): TimedCue[] {
    const chain = this.#chains.get(cue);

    if (!chain) {
      throw new Error(`Cue doesn't belong to this scene`);
    }

    return chain;
  }

  toJSON(): TimedSceneData {
    return {
      ...super.toJSON(),
      type: 'timed',
      cues: this.cues.map((cue) => cue.toJSON()),
      trigger: this.#trigger,
    };
  }
}

export type AnyScene = ManualScene | TimedScene;

function resolveTimedChains(cues: Collection<TimedCue, TimedCueData>): Map<TimedCue, TimedCue[]> {
  const map: Map<TimedCue, TimedCue[]> = new Map();
  let currentChain: TimedCue[] | undefined = undefined;
  let currentEnd: number = 0;

  for (const cue of cues) {
    if (!currentChain || cue.from >= currentEnd) {
      currentChain = [];
      currentEnd = cue.to;
    } else if (cue.to > currentEnd) {
      currentEnd = cue.to;
    }

    map.set(cue, currentChain);
    currentChain.push(cue);
  }

  return map;
}
