/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {devMode} from '../dev-mode';
import {
  AffectedByRtl,
  CanBeDisabled,
  CanBeSelected,
  Constructor,
  HasActiveDescendant,
  HasId,
  HasItems, HasKeySchemes, HasLifecycle,
  HasOrientation,
  HasSelectedDescendant,
} from './behavior-interfaces';
import {KeyScheme} from '../key_schemes/keyscheme';


/** Mixin that augments a given class with a `disabled` property. */
export function mixinDisabled<T extends Constructor>(base: T): Constructor<CanBeDisabled> & T {
  return class extends base implements CanBeDisabled {
    disabled = false;
    constructor(...args: any[]) { super(...args); }
  };
}

/** Mixin that augments a given class with `setup` and `teardown` methods. */
export function mixinLifecycle<T extends Constructor>(base: T): Constructor<HasLifecycle> & T {
  return class extends base implements HasLifecycle {
    setup() {}
    teardown() {}
    constructor(...args: any[]) { super(...args); }
  };
}

/** Mixin that augments a given class with a `selected` property. */
export function mixinSelected<T extends Constructor>(base: T): Constructor<CanBeSelected> & T {
  return class extends base implements CanBeSelected {
    selected = false;
    constructor(...args: any[]) { super(...args); }
  };
}

/** ID counter for `mixinUniqueId`. */
let nextId = 0;

/** Mixin that augments a given class with an `id` property initialized to a unique value. */
export function mixinUniqueId<T extends Constructor<HasLifecycle>>(base: T): Constructor<HasId> & T {
  return class extends base implements HasId {
    // Can't just plain set `id` here since it would break a custom element using this mixin.
    // Custom elements aren't allowed to set attributes during the constructor, and setting the ID
    // property will reflect back into an attribute.
    // TODO: eliminate `!` assertion
    id!: string;
    setup() {
      this.id = `cc${nextId++}`;
      super.setup();
    }
    constructor(...args: any[]) { super(...args); }
  };
}

/** Mixin that augments a given class with an `orientation` property. */
export function mixinOrientation<T extends Constructor>(base: T): Constructor<HasOrientation> & T {
  return class extends base implements HasOrientation {
    // Default to vertical because the most common controls (menu, listbox) default to vertical.
    isHorizontal: boolean = false;

    constructor(...args: any[]) { super(...args); }
  }
}

/** Mixin that augments a given class with an `isRtl` property. */
export function mixinBidi<T extends Constructor>(base: T): Constructor<AffectedByRtl> & T {
  return class extends base implements AffectedByRtl {
    isRtl = false;
    constructor(...args: any[]) { super(...args); }
  }
}

/** Stub that gets applied via mixin so that this part of `HasKeySchemes` is abstract. */
declare abstract class HasKeySchemeStub<C> {
  abstract getKeySchemes(): KeyScheme<C>[];
}

/** Partial sub-interface of `HasKeySchemes` so that `handleKey` is concrete. */
interface HasHandleKey<C> extends HasKeySchemeStub<C> {
  handleKey(event: KeyboardEvent): void;
}

/** Adds a concrete `handleKey` and an abstract `getKeySchemes` for `HasKeySchemes`. */
export function mixinHandleKey<T extends Constructor<C>, C>(base: T): Constructor<HasHandleKey<C>> & T {
  // TODO: this cast should be Constructor<C & HasKeySchemes<C>>, but TS won't accept this and
  // I don't understand why. This would eliminate the second cast in the call to `handleKey`.
  return class extends (base as unknown as (Constructor<HasKeySchemes<C>>)) {
    handleKey(event: KeyboardEvent): void {
      for (const scheme of this.getKeySchemes()) {
        const handled = scheme.handleKey(this as unknown as C, event);
        if (handled) {
          return;
        }
      }
    }

    constructor(...args: any[]) { super(...args); }
  } as Constructor<HasHandleKey<C>> & T
}


/** Mixin that augments a given class with behavior for having an active descendant item. */
export function mixinActiveDescendant<T extends Constructor<HasItems<D>>,
    D extends HasId & CanBeDisabled>(base: T):
        Constructor<HasActiveDescendant<T extends Constructor<HasItems<infer I>> ? I : never>> & T {
  return class extends base implements HasActiveDescendant<D> {
    activeDescendantId = '';

    // TODO: make wrapping optional

    // Note: It's important *not* to keep a reference to the collection of items in case that
    // collection changes to a different reference. Any time we need to get the items, we
    // go through the `getItems` method.

    // Note: It's important to not remember the active descendant index (or the item reference)
    // because the list of items might change, leading to the index being out of date. Thus the
    // items are always identified by ID.

    activeDescendantIndex(): number {
      return this.getItems().findIndex(i => i.id === this.activeDescendantId);
    }

    activeDescendant(): D {
      // TODO(mmalerba): Is it safe to assume this is always defined?
      return this.getItems().find(i => i.id === this.activeDescendantId)!;
    }

    activateItem(item: D) {
      // No-op if the given item is disabled.
      if (!item.disabled) {
        this.activeDescendantId = item.id;
      }
    }

    activateItemByIndex(index: number) {
      const item = this.getItems()[index];
      if (devMode && !item) {
        throw Error(`Attempting to activateItemByIndex with an out-of-bounds index: ${index}.`);
      }
      this.activateItem(this.getItems()[index]);
    }

    activateNextItem() {
      this.activateClosestItem(this.activeDescendantIndex(), 1);
    }

    activatePreviousItem() {
      this.activateClosestItem(this.activeDescendantIndex(), -1);
    }

    activateFirstItem() {
      // Pass the last item as the starting point so that the first item is next.
      this.activateClosestItem(this.getItems().length - 1, 1);
    }

    activateLastItem() {
      // Pass the first item as the starting point so that the last item is next.
      this.activateClosestItem(0, -1);
    }

    /**
     * Activates the closest non-disabled item in the given direction.
     * @param start The index from which to start attempting to enable.
     * @param delta The direction through which to iterate the items.
     */
    private activateClosestItem(start: number, delta: -1 | 1) {
      const items = this.getItems();
      const length = items.length;

      for (let next = (start + delta + length) % length; next !== start; next += delta) {
        if (!items[next].disabled) {
          this.activateItemByIndex(next);
          return;
        }
      }
    }

    constructor(...args: any[]) { super(...args); }
  } as Constructor<HasActiveDescendant<any>> & T;
}

/** Mixin that augments a given class with behavior for descendant items than can be selected. */
export function mixinSelectedDescendant<T extends Constructor<HasItems<D> & HasActiveDescendant<D>>,
    D extends HasId & CanBeDisabled & CanBeSelected>(base: T):
    Constructor<HasSelectedDescendant<T extends Constructor<HasItems<infer I>> ? I : never>> & T {
  return class extends base implements HasSelectedDescendant<D> {
    multiple = false;

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
