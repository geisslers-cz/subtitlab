import { mount, unmount, untrack } from 'svelte';
import { EventDispatcher, merge, randomId } from '$lib/utils';
import ProjectorContent from './projector-content.svelte';
import projectorTemplate from './projector-template.html?raw';
import type { ProjectorProps } from './types';

export interface PopupProjectorEvents {
  destroy: PopupProjector;
  fullscreen: void;
  key: string;
}

export class PopupProjector extends EventDispatcher<PopupProjectorEvents> {
  readonly id = randomId();
  aspectRatio?: number = $state();
  readonly #win: Window;
  readonly #doc: Document;
  readonly #projector: Record<string, never>;
  #width: number;
  #height: number;
  #observer: ResizeObserver;

  constructor(props: ProjectorProps, aspectRatio: number, screen?: ScreenDetailed) {
    super();

    this.#win = openWindow(aspectRatio);

    this.#doc = this.#win.document;
    this.#doc.open();
    this.#doc.write(projectorTemplate);
    this.#doc.close();

    this.#win.addEventListener('unload', this.destroy);
    this.#doc.addEventListener('keydown', this.#handleKey);
    this.#doc.addEventListener('dblclick', this.#handleClick);
    this.#doc.addEventListener('fullscreenchange', this.#handleFullScreen);

    this.#projector = mount(ProjectorContent, {
      target: this.#doc.body,
      props: merge(props, {
        win: this.#win,
        doc: this.#doc,
      }),
    });

    if (screen) {
      this.#win.moveTo(screen.availLeft, screen.availTop);

      this.#doc.body
        .requestFullscreen({
          navigationUI: 'hide',
          screen,
        })
        .catch(() => {});
    } else {
      const w = this.#win.outerWidth;
      const h = this.#win.outerHeight - this.#win.innerHeight + this.#doc.body.offsetHeight;
      this.#win.resizeTo(w, h);
    }

    this.#width = $state(this.#doc.body.offsetWidth);
    this.#height = $state(this.#doc.body.offsetHeight);

    this.#observer = new ((this.#win as any).ResizeObserver as typeof ResizeObserver)((entries) => {
      for (const entry of entries) {
        for (const box of entry.borderBoxSize) {
          this.#width = box.inlineSize;
          this.#height = box.blockSize;
        }
      }
    });

    this.#observer.observe(this.#doc.body, {
      box: 'border-box',
    });
  }

  get width(): number {
    return this.#width;
  }

  get height(): number {
    return this.#height;
  }

  isWithin(screen: ScreenDetailed): boolean {
    return (
      this.#win.screenLeft >= screen.availLeft &&
      this.#win.screenLeft <= screen.availLeft + screen.availWidth &&
      this.#win.screenTop >= screen.availTop &&
      this.#win.screenTop <= screen.availTop + screen.availHeight
    );
  }

  destroy = (): void => {
    unmount(this.#projector);
    this.#win.removeEventListener('unload', this.destroy);
    this.#doc.removeEventListener('keydown', this.#handleKey);
    this.#doc.removeEventListener('dblclick', this.#handleClick);
    this.#doc.removeEventListener('fullscreenchange', this.#handleFullScreen);
    this.#observer.unobserve(this.#doc.body);
    this.#observer.disconnect();
    this.emit('destroy', this);
  };

  #handleKey = (evt: KeyboardEvent): void => {
    evt.preventDefault();
    this.emit('key', evt.key);
  };

  #handleClick = async (evt: MouseEvent): Promise<void> => {
    evt.preventDefault();

    if (this.#doc.fullscreenElement) {
      await this.#doc.exitFullscreen();
    } else {
      await this.#doc.body.requestFullscreen({
        navigationUI: 'hide',
      });
    }
  };

  #handleFullScreen = async (): Promise<void> => {
    if (!this.#doc.fullscreenElement) {
      this.aspectRatio = undefined;
      this.emit('fullscreen', undefined);

      if (this.#win.navigator.keyboard && this.#win.navigator.keyboard.unlock) {
        this.#win.navigator.keyboard.unlock();
      }

      return;
    }

    this.aspectRatio = untrack(() => this.width / this.height);
    this.emit('fullscreen', undefined);

    if (this.#win.navigator.keyboard && this.#win.navigator.keyboard.lock) {
      await this.#win.navigator.keyboard.lock(['Escape']);
    }
  };
}

function openWindow(aspectRatio: number): Window {
  const w = Math.floor(screen.availWidth / 4);
  const h = Math.round(w / aspectRatio);
  const left = screen.availWidth - w;

  const win = window.open(undefined, undefined, `popup,width=${w},height=${h},left=${left},top=0`);

  if (!win) {
    throw new Error('Failed to open window');
  }

  return win;
}
