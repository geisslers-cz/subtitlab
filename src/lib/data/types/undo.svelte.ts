export type UndoAction = {
  apply(): void;
  revert(): void;
};

export class UndoManager {
  readonly #undoStack: UndoTransaction[] = $state([]);
  readonly #redoStack: UndoTransaction[] = $state([]);
  #currentEntry?: UndoTransaction;
  #savePoint: number = $state(0);
  #busy: boolean = false;

  begin(): void {
    this.commit();
    this.#currentEntry = new UndoTransaction();
  }

  add(apply: () => void, revert: () => void): void {
    if (this.#busy) {
      return;
    }

    if (!this.#currentEntry) {
      this.#currentEntry = new UndoTransaction();
      queueMicrotask(this.commit);
    }

    this.#currentEntry.add(apply, revert);
    apply();
  }

  setSavePoint(): void {
    this.commit();
    this.#savePoint = this.#undoStack.length;
  }

  get atSavePoint(): boolean {
    return this.#savePoint === this.#undoStack.length;
  }

  get canUndo(): boolean {
    return this.#undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.#redoStack.length > 0;
  }

  undo(): void {
    this.commit();

    const entry = this.#undoStack.pop();

    if (!entry) {
      return;
    }

    try {
      this.#busy = true;
      entry.revert();
      this.#redoStack.push(entry);
    } finally {
      this.#busy = false;
    }
  }

  redo(): void {
    this.commit();

    const entry = this.#redoStack.pop();

    if (!entry) {
      return;
    }

    try {
      this.#busy = true;
      entry.apply();
      this.#undoStack.push(entry);
    } finally {
      this.#busy = false;
    }
  }

  commit = (): void => {
    if (!this.#currentEntry || this.#currentEntry.empty) {
      this.#currentEntry = undefined;
      return;
    }

    if (this.#undoStack.length > 100) {
      this.#undoStack.shift();
      --this.#savePoint;
    }

    if (this.#savePoint > this.#undoStack.length) {
      this.#savePoint = -1;
    }

    this.#undoStack.push(this.#currentEntry);
    this.#redoStack.splice(0, this.#redoStack.length);
    this.#currentEntry = undefined;
  };
}

class UndoTransaction {
  readonly #actions: UndoAction[] = [];

  get empty(): boolean {
    return !this.#actions.length;
  }

  add(apply: () => void, revert: () => void): void {
    this.#actions.push({ apply, revert });
  }

  apply(): void {
    for (const action of this.#actions) {
      action.apply();
    }
  }

  revert(): void {
    for (const action of this.#actions.toReversed()) {
      action.revert();
    }
  }
}
