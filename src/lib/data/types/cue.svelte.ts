import { ChildNode, Node } from './node.svelte';
import { ManualScene, TimedScene } from './scene.svelte';
import type { CueData, CueSize, ManualCueData, MidiTrigger, TimedCueData } from './types';
import type { UndoManager } from './undo.svelte';

export abstract class Cue<Parent extends Node, Siblings extends AnyCue> extends ChildNode<
  Parent,
  Siblings
> {
  protected readonly history: UndoManager;
  #content: string;
  #size?: CueSize = $state.raw();

  constructor(history: UndoManager, { id, content = '' }: Partial<CueData> = {}) {
    super(id);
    this.history = history;
    this.#content = $state(content);
  }

  get content(): string {
    return this.#content;
  }

  set content(value: string) {
    const previous = this.#content;

    if (value === previous) {
      return;
    }

    this.history.add(
      () => {
        this.#content = value;
        this.#size = undefined;
      },
      () => {
        this.#content = previous;
        this.#size = undefined;
      },
    );
  }

  get size(): CueSize | undefined {
    return this.#size;
  }

  set size(size: CueSize | undefined) {
    this.#size = size;
  }

  toJSON(): CueData {
    return {
      id: this.id,
      content: this.#content,
    };
  }
}

export class ManualCue extends Cue<ManualScene, ManualCue> {
  #chain: boolean;
  #trigger?: MidiTrigger;

  constructor(
    history: UndoManager,
    { chain = false, trigger, ...rest }: Partial<ManualCueData> = {},
  ) {
    super(history, rest);
    this.#chain = $state(chain);
    this.#trigger = $state(trigger);
  }

  get chain(): boolean {
    return this.#chain;
  }

  set chain(value: boolean) {
    const previous = this.#chain;

    if (value === previous) {
      return;
    }

    this.history.add(
      () => (this.#chain = value),
      () => (this.#chain = previous),
    );
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

  protected get siblings() {
    return this.parent.cues;
  }

  toJSON(): ManualCueData {
    return {
      ...super.toJSON(),
      chain: this.#chain ? true : undefined,
      trigger: this.#trigger,
    };
  }
}

export class TimedCue extends Cue<TimedScene, TimedCue> {
  #from: number;
  #to: number;

  constructor(history: UndoManager, { from = 0, to = 1, ...rest }: Partial<TimedCueData> = {}) {
    super(history, rest);
    this.#from = $state(from);
    this.#to = $state(to);
  }

  get from(): number {
    return this.#from;
  }

  set from(value: number) {
    const previous = this.#from;

    if (value === previous) {
      return;
    }

    this.history.add(
      () => (this.#from = value),
      () => (this.#from = previous),
    );
  }

  get to(): number {
    return this.#to;
  }

  set to(value: number) {
    const previous = this.#to;

    if (value === previous) {
      return;
    }

    this.history.add(
      () => (this.#to = value),
      () => (this.#to = previous),
    );
  }

  get chain(): boolean {
    return !!this.next && this.parent.getChain(this).includes(this.next);
  }

  protected get siblings() {
    return this.parent.cues;
  }

  toJSON(): TimedCueData {
    return {
      ...super.toJSON(),
      from: this.#from,
      to: this.#to,
    };
  }
}

export type AnyCue = ManualCue | TimedCue;
