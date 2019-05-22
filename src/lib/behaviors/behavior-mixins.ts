/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {
  AffectedByRtl,
  CanBeDisabled,
  CanBeSelected,
  Constructor,
  HasActiveDescendant,
  HasId,
  HasItems,
  HasOrientation,
  HasSelectedDescendant,
} from './behavior-interfaces';


/** Mixin that augments a given class with a `disabled` property. */
export function mixinDisabled<T extends Constructor<object>>(base: T): Constructor<CanBeDisabled> & T {
  return class extends base {
    disabled = false;
    constructor(...args: any[]) { super(...args); }
  };
}

/** Mixin that augments a given class with a `selected` property. */
export function mixinSelected<T extends Constructor<object>>(base: T): Constructor<CanBeSelected> & T {
  return class extends base {
    selected = false;
    constructor(...args: any[]) { super(...args); }
  };
}

/** ID counter for `mixinUniqueId`. */
let nextId = 0;

/** Mixin that augments a given class with an `id` property initialized to a unique value. */
export function mixinUniqueId<T extends Constructor<object>>(base: T): Constructor<HasId> & T {
  return class extends base {
    id = `cc${nextId++}`;
    constructor(...args: any[]) { super(...args); }
  };
}

/** Mixin that augments a given class with an `orientation` property. */
export function mixinOrientation<T extends Constructor<object>>(base: T): Constructor<HasOrientation> & T {
  return class extends base {
    // Default to vertical because the most common controls (menu, listbox) default to vertical.
    isHorizontal: boolean = false;

    constructor(...args: any[]) { super(...args); }
  }
}

/** Mixin that augments a given class with an `isRtl` property. */
export function mixinBidi<T extends Constructor<object>>(base: T): Constructor<AffectedByRtl> & T {
  return class extends base {
    isRtl = false;
    constructor(...args: any[]) { super(...args); }
  }
}


/** Mixin that augments a given class with behavior for having an active descendant item. */
export function mixinActiveDescendant<T extends Constructor<HasItems<D>>,
    D extends HasId & CanBeDisabled>(base: T):
        Constructor<HasActiveDescendant<T extends Constructor<HasItems<infer D>> ? D : D>> & T {
  return class extends base {
    activeDescendantId = '';

    // TODO: deal with disabled items
    // TODO: deal with wrapping either here in or in the keyscheme
    // NOTE: important to not keep a reference to the item list because it might change
    // NOTE: can't remember the active descendant index (or the item reference) because the
    // list of items might change, leading to the index being out of date. Will have to always
    // based on the ID at the moment.

    activeDescendantIndex(): number {
      return this.getItems().findIndex(i => i.id === this.activeDescendantId);
    }

    activeDescendant(): D {
      // TODO: handle the item being not found (`find` returns undefined)
      return this.getItems().find(i => i.id === this.activeDescendantId) as D;
    }

    activateItem(item: D) {
      // TODO: handle item == null
      this.activeDescendantId = item.id;
    }

    activateItemByIndex(index: number) {
      // TODO: handle array out of bounds
      this.activateItem(this.getItems()[index]);
    }

    activateNextItem() {
      const nextIndex = (this.activeDescendantIndex() + 1) % this.getItems().length;
      this.activateItemByIndex(nextIndex);
    }

    activatePreviousItem() {
      const length = this.getItems().length;
      const nextIndex = (this.activeDescendantIndex() - 1 + length) % length;
      this.activateItemByIndex(nextIndex);
    }

    activateFirstItem() {
      this.activateItemByIndex(0);
    }

    activateLastItem() {
      this.activateItemByIndex(this.getItems().length - 1);
    }

    constructor(...args: any[]) { super(...args); }
  } as Constructor<HasActiveDescendant<any>> & T;
}

/** Mixin that augments a given class with behavior for descendant items than can be selected. */
export function mixinSelectedDescendant<T extends Constructor<HasItems<D> & HasActiveDescendant<D>>,
    D extends HasId & CanBeDisabled & CanBeSelected>(base: T):
    Constructor<HasSelectedDescendant<T extends Constructor<HasItems<infer D>> ? D : D>> & T {
  return class extends base {
    multiple = false;
    selectedDescendantId = '';

    selectItem(item: D) {
      if (!this.multiple) {
        this.getItems().forEach(i => i.selected = false);
      }

      item.selected = true;
    }

    deselectItem(item: D) {
      item.selected = false;
    }

    toggleActiveItemSelection() {
      const item = this.activeDescendant();
      item.selected ? this.deselectItem(item) : this.selectItem(item);
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
