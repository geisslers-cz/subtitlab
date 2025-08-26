import { getContext, setContext } from 'svelte';
import { type Project, type ProjectData, type ProjectMetadata, ProjectStorage } from '$lib/data';

export interface ProjectContext {
  readonly projects: ReadonlyMap<string, ProjectMetadata>;
  readonly current: Project;
  readonly loading: boolean;
  create(): void;
  open(id: string): void;
  save(): void;
  remove(id: string): void;
  export(id: string): Promise<ProjectData>;
  import(data: ProjectData): Promise<void>;
}

const ctxKey = Symbol('project context');

export function createProjectContext(): ProjectContext {
  const ctx = new DefaultProjectContext();
  setContext(ctxKey, ctx);
  return ctx;
}

export function useProjectContext(): ProjectContext {
  return getContext(ctxKey);
}

export class DefaultProjectContext implements ProjectContext {
  readonly #storage: ProjectStorage = new ProjectStorage();
  #current?: Project = $state.raw();

  constructor() {
    this.#storage.openLast().then((project) => {
      this.#current = project;
    });
  }

  get projects(): ReadonlyMap<string, ProjectMetadata> {
    return this.#storage.projects;
  }

  get current(): Project {
    if (!this.#current) {
      throw new Error(`Project not loaded`);
    }

    return this.#current;
  }

  get loading(): boolean {
    return !this.#current;
  }

  create(): void {
    this.#current = this.#storage.create();
  }

  async open(id: string): Promise<void> {
    this.#current = undefined;
    this.#current = await this.#storage.open(id);
  }

  async save(): Promise<void> {
    if (this.#current) {
      await this.#storage.save(this.#current);
    }
  }

  async remove(id: string): Promise<void> {
    await this.#storage.remove(id);
  }

  async import(data: ProjectData): Promise<void> {
    await this.#storage.import(data);
  }

  export(id: string): Promise<ProjectData> {
    return this.#storage.export(id);
  }
}
