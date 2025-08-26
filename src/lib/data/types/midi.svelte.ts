import type { Project } from './project.svelte';
import type { MidiSettingsData, MidiTrigger } from './types';

export class MidiSettings {
  readonly #project: Project;
  #go?: MidiTrigger;
  #panic?: MidiTrigger;

  constructor(project: Project, settings: MidiSettingsData) {
    this.#project = project;
    this.#go = $state(settings.go);
    this.#panic = $state(settings.panic);
  }

  get go(): MidiTrigger | undefined {
    return this.#go;
  }

  set go(value: MidiTrigger | undefined) {
    const previous = this.#go;

    if (value === previous) {
      return;
    }

    this.#project.history.add(
      () => (this.#go = value),
      () => (this.#go = previous),
    );
  }

  get panic(): MidiTrigger | undefined {
    return this.#panic;
  }

  set panic(value: MidiTrigger | undefined) {
    const previous = this.#panic;

    if (value === previous) {
      return;
    }

    this.#project.history.add(
      () => (this.#panic = value),
      () => (this.#panic = previous),
    );
  }

  toJSON(): MidiSettingsData {
    return {
      go: this.#go,
      panic: this.#panic,
    };
  }
}
