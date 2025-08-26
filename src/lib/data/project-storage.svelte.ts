import { del, get, set } from 'idb-keyval';
import { SvelteMap } from 'svelte/reactivity';
import { defaultSettings, Project, type ProjectData } from './types';

export type ProjectMetadata = {
  title: string;
  ts: number;
};

export class ProjectStorage {
  readonly #projects: Map<string, ProjectMetadata> = loadProjectList();

  get projects(): ReadonlyMap<string, ProjectMetadata> {
    return this.#projects;
  }

  async openLast(): Promise<Project> {
    for (const id of this.#projects.keys()) {
      return this.open(id, false);
    }

    return this.create();
  }

  async open(id: string, touch: boolean = true): Promise<Project> {
    const meta = this.#projects.get(id);

    if (!meta) {
      throw new Error(`Project doesn't exist`);
    }

    const data = await this.#load(id);

    if (touch) {
      meta.ts = Date.now();
      saveProjectList(this.#projects);
    }

    return new Project(data);
  }

  create(): Project {
    return createEmptyProject();
  }

  async save(project: Project): Promise<void> {
    await this.#store($state.snapshot(project.save()));
  }

  async remove(id: string): Promise<void> {
    await del(`project:${id}`);
    this.#projects.delete(id);
    saveProjectList(this.#projects);
  }

  async import(data: ProjectData): Promise<void> {
    await this.#store(data);
  }

  async export(id: string): Promise<ProjectData> {
    return this.#load(id);
  }

  async #load(id: string): Promise<ProjectData> {
    const projectData = await get(`project:${id}`);

    if (projectData === undefined) {
      throw new Error(`Project doesn't exist`);
    }

    return projectData;
  }

  async #store(data: ProjectData): Promise<void> {
    await set(`project:${data.id}`, data);

    this.#projects.set(data.id, {
      title: data.title,
      ts: Date.now(),
    });

    saveProjectList(this.#projects);
  }
}

function loadProjectList(): Map<string, ProjectMetadata> {
  const data = window.localStorage.getItem('project-list');

  if (data === null) {
    return new SvelteMap();
  }

  const list = Object.entries(JSON.parse(data) as Record<string, ProjectMetadata>);
  return new SvelteMap(list.sort(([, a], [, b]) => b.ts - a.ts));
}

function saveProjectList(list: Map<string, ProjectMetadata>): void {
  if (!list.size) {
    window.localStorage.removeItem('project-list');
    return;
  }

  window.localStorage.setItem('project-list', JSON.stringify(Object.fromEntries(list)));
}

function createEmptyProject(): Project {
  return new Project({
    title: 'New project',
    acts: [],
    settings: defaultSettings,
  });
}
