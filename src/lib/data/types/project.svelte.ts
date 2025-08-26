import { Act } from './act.svelte';
import { Collection } from './collection.svelte';
import { MidiSettings } from './midi.svelte';
import { Node } from './node.svelte';
import { Settings } from './settings.svelte';
import { type ActData, defaultSettings, type ProjectData } from './types';
import { UndoManager } from './undo.svelte';

export class Project extends Node {
  readonly created: Date;
  readonly settings: Settings;
  readonly midi: MidiSettings;
  readonly acts: Collection<Act, ActData>;
  readonly history: UndoManager = new UndoManager();
  #title: string;
  #lastModified?: Date;

  constructor({
    id,
    created,
    lastModified,
    title = '',
    acts = [],
    settings = defaultSettings,
    midi = {},
  }: Partial<ProjectData> = {}) {
    super(id);
    this.created = created ? new Date(created) : new Date();
    this.#lastModified = $state.raw(lastModified ? new Date(lastModified) : undefined);
    this.#title = $state(title);
    this.settings = new Settings(this.history, settings);
    this.midi = new MidiSettings(this, midi);
    this.acts = new Collection(this, this.history, acts, (data) => new Act(this.history, data));
  }

  get lastModified(): Date | undefined {
    return this.#lastModified;
  }

  get dirty(): boolean {
    return !this.history.atSavePoint;
  }

  get title(): string {
    return this.#title;
  }

  set title(value: string) {
    const previous = this.#title;

    if (value !== previous) {
      this.history.add(
        () => (this.#title = value),
        () => (this.#title = previous),
      );
    }
  }

  save(): ProjectData {
    this.history.setSavePoint();
    this.#lastModified = new Date();

    return {
      id: this.id,
      created: this.created.toJSON(),
      lastModified: this.#lastModified.toJSON(),
      title: this.#title,
      acts: this.acts.map((act) => act.toJSON()),
      settings: this.settings.toJSON(),
      midi: this.midi.toJSON(),
    };
  }
}
