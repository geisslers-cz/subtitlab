import { getContext, setContext, untrack } from 'svelte';
import { on } from 'svelte/events';
import { SvelteMap } from 'svelte/reactivity';
import { box } from 'svelte-toolbelt';
import { useKeymap } from '$lib/components/keymap';
import { PopupProjector, type ProjectorProps } from '$lib/components/projector';
import {
  Act,
  type AnyCue,
  type AnyScene,
  type Cursor,
  type EditContext,
  firstInChain,
  type FontStorage,
  lastInChain,
  lastShown,
  ManualCue,
  type Playhead,
  resolveChain,
  Scene,
  TimedCue,
  TimedScene,
} from '$lib/data';
import { CueAnalyser } from './cue-analyser';
import { MidiController } from './midi-controller.svelte';
import type { ProjectContext } from './project-context.svelte';
import { TimelineDispatcher } from './timeline-dispatcher';
import { UiKeymap } from './ui-keymap';

export interface UiContext {
  readonly aspectRatio: number;
  readonly projectorProps: ProjectorProps;
  readonly cursor?: Cursor;
  readonly playhead?: Playhead;
  readonly editing?: EditContext;
  readonly midi: MidiController;
  readonly keymap: UiKeymap;
  openProjector(): void;
  selectScene(scene?: AnyScene, deselect?: boolean): void;
  selectCue(cue?: AnyCue | string, deselect?: boolean): void;
  selectPrevious(): void;
  selectNext(): void;
  addCue(within?: AnyScene, after?: AnyCue): void;
  editCue(cue?: AnyCue): void;
  removeCue(cue: AnyCue): void;
  go(to?: AnyCue): void;
  panic(): void;
  reformat(cue: AnyCue): void;
  undo(): void;
  redo(): void;
}

const ctxKey = Symbol('ui context');

export function createUiContext(project: ProjectContext, fonts: FontStorage): UiContext {
  const ctx = new DefaultUiContext(project, fonts);
  setContext(ctxKey, ctx);
  return ctx;
}

export function useUiContext(): UiContext {
  return getContext(ctxKey);
}

export class DefaultUiContext implements UiContext {
  aspectRatio: number;

  readonly #project: ProjectContext;
  readonly #keymap: UiKeymap;
  readonly #projectors: Map<string, PopupProjector> = new SvelteMap();
  readonly #projectorProps: ProjectorProps;
  readonly #analyser: CueAnalyser;
  readonly midi: MidiController;
  #screenDetails?: ScreenDetails;
  #cueMap: Map<string, AnyCue> = new Map();
  #rootEffects: WeakMap<object, () => void> = new WeakMap();
  #cursor?: Cursor = $state.raw();
  #playhead?: Playhead = $state.raw();
  #timeline?: TimelineDispatcher;
  #editing?: EditContext = $state();

  constructor(project: ProjectContext, fonts: FontStorage) {
    this.aspectRatio = $derived.by(this.#computeAspectRatio);

    this.#project = project;
    this.#keymap = new UiKeymap(this);

    this.#projectorProps = box.flatten({
      settings: box.with(() => project.current.settings),
      fonts,
      playhead: box.with(() => this.#playhead),
    });

    this.#analyser = new CueAnalyser({
      aspectRatio: box.with(() => this.aspectRatio),
      settings: box.with(() => (project.loading ? undefined : project.current.settings)),
      fonts,
    });

    this.midi = new MidiController();

    useKeymap(this.#keymap);

    $effect(() =>
      on(window, 'beforeunload', (evt) => {
        if (!project.loading && !project.current.history.atSavePoint) {
          evt.preventDefault();
        }
      }),
    );

    $effect(() => {
      if (!project.loading && project.current.midi.go) {
        return this.midi.map(project.current.midi.go, () => this.go());
      }
    });

    $effect(() => {
      if (!project.loading && project.current.midi.panic) {
        return this.midi.map(project.current.midi.panic, () => this.panic());
      }
    });

    $effect(() => {
      if (project.loading) {
        return;
      }

      untrack(() => {
        for (const act of project.current.acts) {
          this.#handleActAttached(act);
        }

        project.current.acts.addEventListener('attached', this.#handleActAttached);
        project.current.acts.addEventListener('detached', this.#handleActDetached);
      });

      return () => {
        project.current.acts.removeEventListener('attached', this.#handleActAttached);
        project.current.acts.removeEventListener('detached', this.#handleActDetached);
        this.#cueMap.clear();
      };
    });

    queryScreenDetails().then((details) => {
      if (!details) {
        return;
      }

      this.#screenDetails = details;

      const ar = resolveAspectRatio(details);

      if (ar) {
        this.aspectRatio = ar;
      }
    });
  }

  get projectorProps(): ProjectorProps {
    return this.#projectorProps;
  }

  get cursor(): Cursor | undefined {
    return this.#cursor;
  }

  get playhead(): Playhead | undefined {
    return this.#playhead;
  }

  get editing(): EditContext | undefined {
    return this.#editing;
  }

  get keymap(): UiKeymap {
    return this.#keymap;
  }

  async openProjector(): Promise<void> {
    const screen = await this.#findAvailableScreen();
    const projector = new PopupProjector(this.#projectorProps, this.aspectRatio, screen);
    this.#projectors.set(projector.id, projector);

    projector.addEventListener('destroy', this.#handleProjectorDestroyed);
    projector.addEventListener('key', this.#keymap.handle);
  }

  selectScene(scene?: AnyScene, deselect?: boolean) {
    this.#cursor =
      scene && deselect && scene === this.#cursor?.scene && !this.#cursor.cue
        ? undefined
        : cursorForScene(scene);
  }

  selectCue(cue?: AnyCue, deselect?: boolean): void {
    this.#cursor = deselect && cue === this.#cursor?.cue ? undefined : cursorForCue(cue);
  }

  selectPrevious(): void {
    this.#cursor = this.#navigate('previous');
  }

  selectNext(): void {
    this.#cursor = this.#navigate('next');
  }

  addCue(scene?: AnyScene, after?: AnyCue): void {
    scene ??= this.#project.current.acts.last?.scenes.last;

    if (!scene) {
      return;
    }

    const cue = scene.cues.create({ chain: after?.chain });
    const idx = after ? scene.cues.indexOf(after as any) + 1 : 0;
    scene.cues.insert(cue as any, idx);
    this.editCue(cue);
  }

  editCue(cue?: AnyCue): void {
    if (!cue) {
      this.#editing = undefined;
      return;
    }

    this.selectCue(cue);

    this.#editing = {
      chain: resolveChain(cue),
      target: cue,
      content: untrack(() => cue.content),
    };
  }

  removeCue(cue: AnyCue): void {
    const next = cue.next;
    const scene = cue.parent;
    scene.cues.remove(cue as any);

    if (next) {
      this.selectCue(next);
    } else {
      this.selectScene(scene.next ?? scene);
    }
  }

  reformat(cue: AnyCue): void {
    this.#analyser.format(cue);
  }

  undo(): void {
    if (!this.#project.loading) {
      this.#project.current.history.undo();
    }
  }

  redo(): void {
    if (!this.#project.loading) {
      this.#project.current.history.redo();
    }
  }

  go(to?: AnyCue | AnyScene): void {
    if (this.#timeline) {
      this.#timeline.destroy();
      this.#timeline = undefined;
    }

    const cursor = to instanceof Scene ? cursorForScene(to) : (cursorForCue(to) ?? this.#cursor);
    const cue = cursor?.cue ?? cursor?.scene.cues.first;

    if (!cue) {
      if (this.#playhead) {
        this.#cursor = this.#navigate('next', cursorForCue(lastInChain(this.#playhead.chain)));
        this.#playhead = undefined;
      } else {
        this.#cursor = this.#navigate('next', cursor);
      }

      return;
    }

    if (cue instanceof TimedCue) {
      const offset = cue === cursor?.cue ? cue.from : 0;

      this.#timeline = new TimelineDispatcher(
        cue,
        offset,
        this.#project.current.settings,
        (update) => {
          this.#playhead = update;

          if (!update && !this.#cursor) {
            this.#cursor = this.#navigate('next', cursorForCue(cue.parent.cues.last));
          }
        },
      );

      this.#timeline.dispatch();
      this.#cursor = undefined;
      return;
    }

    if (!this.#playhead?.chain.has(cue)) {
      this.#playhead = {
        chain: resolveChain(cue),
        t0: 0,
      };
    }

    this.#playhead.chain.set(cue, 'show');

    if (cue.chain) {
      this.selectCue(cue.next);
    } else {
      this.#cursor = undefined;
    }
  }

  panic(): void {
    this.#timeline?.destroy();
    this.#timeline = undefined;

    if (!this.#playhead) {
      return;
    }

    if (!this.#cursor) {
      this.selectCue(lastShown(this.#playhead.chain) ?? firstInChain(this.#playhead.chain));
    }

    this.#playhead = undefined;
  }

  async #findAvailableScreen(): Promise<ScreenDetailed | undefined> {
    this.#screenDetails ??= await queryScreenDetails();

    if (!this.#screenDetails) {
      return undefined;
    }

    const projectors = [...this.#projectors.values()];

    return this.#screenDetails.screens.find(
      (screen) =>
        screen !== this.#screenDetails?.currentScreen &&
        !projectors.some((p) => p.isWithin(screen)),
    );
  }

  #computeAspectRatio = (): number => {
    return [...this.#projectors.values()].reduce(
      (max, { aspectRatio: ar }) => (ar !== undefined && ar > max ? ar : max),
      16 / 9,
    );
  };

  #handleProjectorDestroyed = (projector: PopupProjector): void => {
    this.#projectors.delete(projector.id);

    projector.removeEventListener('destroy', this.#handleProjectorDestroyed);
    projector.removeEventListener('key', this.#keymap.handle);
  };

  #handleActAttached = (act: Act): void => {
    for (const scene of act.scenes) {
      this.#handleSceneAttached(scene);
    }

    act.scenes.addEventListener('attached', this.#handleSceneAttached);
    act.scenes.addEventListener('detached', this.#handleSceneDetached);
  };

  #handleActDetached = (act: Act): void => {
    if (act === this.#cursor?.act) {
      this.#cursor = undefined;
    }

    act.scenes.removeEventListener('attached', this.#handleSceneAttached);
    act.scenes.removeEventListener('detached', this.#handleSceneDetached);

    for (const scene of act.scenes) {
      this.#handleSceneDetached(scene);
    }
  };

  #handleSceneAttached = (scene: AnyScene): void => {
    for (const cue of scene.cues) {
      this.#handleCueAttached(cue);
    }

    scene.cues.addEventListener('attached', this.#handleCueAttached);
    scene.cues.addEventListener('detached', this.#handleCueDetached);

    if (scene instanceof TimedScene) {
      this.#rootEffects.set(
        scene,
        $effect.root(() => {
          $effect(() => {
            if (scene.trigger) {
              return this.midi.map(scene.trigger, () => this.go(scene));
            }
          });
        }),
      );
    }
  };

  #handleSceneDetached = (scene: AnyScene): void => {
    if (scene === this.#cursor?.scene) {
      this.#cursor = undefined;
    }

    this.#rootEffects.get(scene)?.();
    this.#rootEffects.delete(scene);

    scene.cues.removeEventListener('attached', this.#handleCueAttached);
    scene.cues.removeEventListener('detached', this.#handleCueDetached);

    for (const cue of scene.cues) {
      this.#handleCueDetached(cue);
    }
  };

  #handleCueAttached = (cue: AnyCue): void => {
    this.#cueMap.set(cue.id, cue);

    this.#rootEffects.set(
      cue,
      $effect.root(() => {
        $effect(() => {
          this.#analyser.analyse(cue);
        });

        if (cue instanceof ManualCue) {
          $effect(() => {
            if (cue.trigger) {
              return this.midi.map(cue.trigger, () => this.go(cue));
            }
          });
        }
      }),
    );
  };

  #handleCueDetached = (cue: AnyCue): void => {
    this.#cueMap.delete(cue.id);
    this.#rootEffects.get(cue)?.();
    this.#rootEffects.delete(cue);

    if (cue === this.#cursor?.cue) {
      this.#cursor = undefined;
    }

    if (this.#playhead?.chain.has(cue)) {
      this.#playhead = undefined;
    }

    if (cue instanceof ManualCue) {
      cue.chain = false;

      if (cue.previous && !cue.next) {
        cue.previous.chain = false;
      }
    }
  };

  #navigate(
    sibling: 'previous' | 'next',
    from: Cursor | undefined = this.#cursor,
  ): Cursor | undefined {
    if (this.#project.loading) {
      return undefined;
    }

    if (!from && this.#playhead) {
      from = cursorForCue(lastShown(this.#playhead.chain) ?? firstInChain(this.#playhead.chain));
    }

    if (!from) {
      return cursorForScene(this.#project.current.acts.first?.scenes.first);
    }

    return sibling === 'previous' ? getPreviousCueOrScene(from) : getNextCueOrScene(from);
  }
}

async function queryScreenDetails(): Promise<ScreenDetails | undefined> {
  if (!window.getScreenDetails) {
    return undefined;
  }

  try {
    return await window.getScreenDetails();
  } catch {
    return undefined;
  }
}

function resolveAspectRatio(details: ScreenDetails): number | undefined {
  let largest: ScreenDetailed | undefined;

  for (const screen of details.screens) {
    if (screen === details.currentScreen) {
      continue;
    }

    if (!largest || (screen.width > largest.width && screen.height > largest.height)) {
      largest = screen;
    }
  }

  largest ??= details.currentScreen;

  return largest ? largest.width / largest.height : undefined;
}

function cursorForScene(scene?: AnyScene): Cursor | undefined {
  if (!scene) {
    return undefined;
  }

  return { act: scene.parent, scene };
}

function cursorForCue(cue?: AnyCue): Cursor | undefined {
  if (!cue) {
    return undefined;
  }

  const scene = cue.parent;
  const act = scene.parent;
  return { act, scene, cue };
}

function getPreviousCueOrScene(from: Cursor): Cursor | undefined {
  if (from.cue) {
    if (from.cue.previous) {
      return cursorForCue(from.cue.previous);
    } else {
      return cursorForScene(from.scene);
    }
  }

  if (from.scene.previous) {
    return from.scene.previous.cues.length
      ? cursorForCue(from.scene.previous.cues.last)
      : cursorForScene(from.scene.previous);
  }

  for (let act = from.act.previous; act; act = act.previous) {
    const scene = act.scenes.last;

    if (!scene) {
      continue;
    }

    return scene.cues.length ? cursorForCue(scene.cues.last) : cursorForScene(scene);
  }

  return undefined;
}

function getNextCueOrScene(from: Cursor): Cursor | undefined {
  if (from.cue?.next) {
    return cursorForCue(from.cue.next);
  }

  if (!from.cue && from.scene.cues.length) {
    return cursorForCue(from.scene.cues.first);
  }

  if (from.scene.next) {
    return cursorForScene(from.scene.next);
  }

  for (let act = from.act.next; act; act = act.next) {
    if (act.scenes.length) {
      return cursorForScene(act.scenes.first);
    }
  }

  return undefined;
}
