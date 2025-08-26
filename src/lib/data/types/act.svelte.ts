import { Collection } from './collection.svelte';
import { ChildNode } from './node.svelte';
import { Project } from './project.svelte';
import { type AnyScene, ManualScene, TimedScene } from './scene.svelte';
import type { ActData, AnySceneData } from './types';
import type { UndoManager } from './undo.svelte';

export class Act extends ChildNode<Project, Act> {
  readonly #history: UndoManager;
  #title: string;
  readonly scenes: Collection<AnyScene, AnySceneData>;

  constructor(history: UndoManager, { id, title = '', scenes = [] }: Partial<ActData> = {}) {
    super(id);
    this.#history = history;
    this.#title = $state(title);
    this.scenes = new Collection(this, history, scenes, (data) => {
      switch (data.type) {
        case 'timed':
          return new TimedScene(history, data);
        case 'manual':
          return new ManualScene(history, data);
        default:
          throw new Error(`Invalid scene data: missing 'type'`);
      }
    });
  }

  get title(): string {
    return this.#title;
  }

  set title(value: string) {
    const previous = this.#title;

    if (value === previous) {
      return;
    }

    this.#history.add(
      () => (this.#title = value),
      () => (this.#title = previous),
    );
  }

  protected get siblings(): Collection<Act, ActData> {
    return this.parent.acts;
  }

  toJSON(): ActData {
    return {
      id: this.id,
      title: this.#title,
      scenes: this.scenes.map((scene) => scene.toJSON()),
    };
  }
}
