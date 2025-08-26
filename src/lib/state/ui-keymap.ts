import { Keymap } from '$lib/components/keymap';
import { ManualCue } from '$lib/data';
import type { UiContext } from './ui-context.svelte';

export class UiKeymap extends Keymap {
  constructor(ui: UiContext) {
    super({
      'Ctrl+z': () => ui.undo(),
      'Ctrl+Shift+z': () => ui.redo(),
      ArrowUp: () => ui.selectPrevious(),
      ArrowDown: () => ui.selectNext(),
      ' ': () => ui.go(),
      Escape: () => ui.panic(),
      n: () => ui.addCue(ui.cursor?.scene, ui.cursor?.cue),
      e: () => ui.editCue(ui.cursor?.cue),
      c: () => {
        if (ui.cursor?.cue?.previous instanceof ManualCue) {
          ui.cursor.cue.previous.chain = !ui.cursor.cue.previous.chain;
        }
      },
      f: () => {
        if (ui.cursor?.cue) {
          ui.reformat(ui.cursor.cue);
        }
      },
      Delete: () => {
        if (ui.cursor?.cue) {
          ui.removeCue(ui.cursor.cue);
        }
      },
    });
  }
}
