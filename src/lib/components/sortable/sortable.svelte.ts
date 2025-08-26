import Sortable from 'sortablejs';
import { type Attachment } from 'svelte/attachments';

export type SortableItem = { id: string };

export type SortableOptions<T extends SortableItem> = {
  key: string;
  getItem: (id: string) => T;
  removeFromGroup: (item: T) => void;
  insertIntoGroup: (item: T, index?: number) => void;
  isDisabled?: () => boolean;
};

type OperationData<T extends SortableItem> = {
  key: string;
  item: T;
  removeFromGroup: (item: T) => void;
  restoreDOM(): void;
};

const groups: Map<string, Set<Sortable>> = new Map();
let currentOperation: OperationData<any> | undefined = undefined;

export function sortable<T extends SortableItem>({
  key,
  getItem,
  removeFromGroup,
  insertIntoGroup,
  isDisabled,
}: SortableOptions<T>): Attachment<HTMLElement> {
  return (container) => {
    const group = getGroup(key);

    const zone = new Sortable(container, {
      group: key,
      animation: 150,
      easing: 'ease-in-out',
      handle: `[data-drag-handle="${key}"]`,
      direction: 'vertical',
      swapThreshold: 0.5,
      onStart({ item: elem }): void {
        const item = getItem(elem.dataset.id!);
        const nextSibling = elem.nextSibling;

        currentOperation = {
          key,
          item,
          removeFromGroup,
          restoreDOM() {
            this.restoreDOM = () => {};
            zone.el.insertBefore(elem, nextSibling);
          },
        };

        for (const zone of group) {
          if (!zone.option('disabled')) {
            zone.el.dataset.sortableActive = 'true';
          }
        }
      },
      onEnd(): void {
        currentOperation = undefined;

        for (const zone of group) {
          delete zone.el.dataset.sortableActive;
        }
      },
      onUpdate({ item: elem, oldIndex, newIndex }): void {
        // changed order within same group
        if (currentOperation?.key !== key || elem.dataset.id !== currentOperation.item.id) {
          return;
        }

        currentOperation.restoreDOM();

        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
          return;
        }

        removeFromGroup(currentOperation.item);
        insertIntoGroup(currentOperation.item, newIndex);
      },
      onAdd({ item: elem, newIndex }): void {
        // item moved between groups - this happens in receiving group
        if (currentOperation?.key !== key || elem.dataset.id !== currentOperation.item.id) {
          return;
        }

        currentOperation.restoreDOM();

        currentOperation.removeFromGroup(currentOperation.item);
        insertIntoGroup(currentOperation.item, newIndex);
      },
    });

    group.add(zone);

    $effect(() => {
      const disabled = isDisabled?.() ?? false;
      zone.option('disabled', disabled);

      if (disabled) {
        zone.el.dataset.sortableDisabled = 'true';
      } else {
        delete zone.el.dataset.sortableDisabled;
      }
    });

    return () => {
      group.delete(zone);

      if (!group.size) {
        groups.delete(key);
      }

      zone.destroy();
    };
  };
}

function getGroup(key: string): Set<Sortable> {
  const existing = groups.get(key);

  if (existing) {
    return existing;
  }

  const group: Set<Sortable> = new Set();
  groups.set(key, group);
  return group;
}
