import type { Oklch } from '$lib/components/color-picker';
import type { FontMetadata, SettingsData, Transition } from './types';
import type { UndoManager } from './undo.svelte';

export class Settings {
  readonly #undo: UndoManager;
  #fontFamily: FontMetadata | string;
  #fontSize: number;
  #lineHeight: number;
  #letterSpacing: number;
  #fontWeight: number;
  #fontStyle: string;
  #color: Oklch;
  #cueGap: number;
  #transitionIn?: Transition;
  #transitionOut?: Transition;

  constructor(undo: UndoManager, data: SettingsData) {
    this.#undo = undo;
    this.#fontFamily = $state.raw(data.fontFamily);
    this.#fontSize = $state(data.fontSize);
    this.#lineHeight = $state(data.lineHeight);
    this.#letterSpacing = $state(data.letterSpacing);
    this.#fontWeight = $state(data.fontWeight);
    this.#fontStyle = $state(data.fontStyle);
    this.#color = $state.raw(data.color);
    this.#cueGap = $state(data.cueGap);
    this.#transitionIn = $state(data.transitionIn);
    this.#transitionOut = $state(data.transitionOut);
  }

  get fontFamily(): FontMetadata | string {
    return this.#fontFamily;
  }

  set fontFamily(value: FontMetadata | string) {
    const previous = this.#fontFamily;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#fontFamily = value),
      () => (this.#fontFamily = previous),
    );
  }

  get fontSize(): number {
    return this.#fontSize;
  }

  set fontSize(value: number) {
    const previous = this.#fontSize;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#fontSize = value),
      () => (this.#fontSize = previous),
    );
  }

  get lineHeight(): number {
    return this.#lineHeight;
  }

  set lineHeight(value: number) {
    const previous = this.#lineHeight;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#lineHeight = value),
      () => (this.#lineHeight = previous),
    );
  }

  get letterSpacing(): number {
    return this.#letterSpacing;
  }

  set letterSpacing(value: number) {
    const previous = this.#letterSpacing;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#letterSpacing = value),
      () => (this.#letterSpacing = previous),
    );
  }

  get fontWeight(): number {
    return this.#fontWeight;
  }

  set fontWeight(value: number) {
    const previous = this.#fontWeight;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#fontWeight = value),
      () => (this.#fontWeight = previous),
    );
  }

  get fontStyle(): string {
    return this.#fontStyle;
  }

  set fontStyle(value: string) {
    const previous = this.#fontStyle;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#fontStyle = value),
      () => (this.#fontStyle = previous),
    );
  }

  get color(): Oklch {
    return this.#color;
  }

  set color(value: Oklch) {
    const previous = this.#color;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#color = value),
      () => (this.#color = previous),
    );
  }

  get cueGap(): number {
    return this.#cueGap;
  }

  set cueGap(value: number) {
    const previous = this.#cueGap;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#cueGap = value),
      () => (this.#cueGap = previous),
    );
  }

  get transitionIn(): Transition | undefined {
    return this.#transitionIn;
  }

  set transitionIn(value: Transition | undefined) {
    const previous = this.#transitionIn;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#transitionIn = value),
      () => (this.#transitionIn = previous),
    );
  }

  get transitionOut(): Transition | undefined {
    return this.#transitionOut;
  }

  set transitionOut(value: Transition | undefined) {
    const previous = this.#transitionOut;

    if (value === previous) {
      return;
    }

    this.#undo.add(
      () => (this.#transitionOut = value),
      () => (this.#transitionOut = previous),
    );
  }

  toJSON(): SettingsData {
    return {
      fontFamily: this.#fontFamily,
      fontSize: this.#fontSize,
      lineHeight: this.#lineHeight,
      letterSpacing: this.#letterSpacing,
      fontWeight: this.#fontWeight,
      fontStyle: this.#fontStyle,
      color: this.#color,
      cueGap: this.#cueGap,
      transitionIn: this.#transitionIn,
      transitionOut: this.#transitionOut,
    };
  }
}
