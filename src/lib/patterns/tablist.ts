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
  CanBeFocused,
  ConcreteOrAbstractConstructor,
  Constructor,
  HasActiveDescendant,
  HasId,
  HasItems,
  HasKeySchemes,
  HasLifecycle,
  HasOrientation,
  HasSelectedDescendant,
} from '../behaviors/behavior-interfaces';
import {
  createMixinBase,
  mixinActiveDescendant,
  mixinBidi,
  mixinDisabled,
  mixinLifecycle,
  mixinSelectedDescendant,
  mixinUniqueId,
} from '../behaviors/behavior-mixins';
import {KeyScheme} from '../key_schemes/keyscheme';
import {ListNavigationKeyScheme} from '../key_schemes/list-navigation';
import {ListSelectionKeyScheme} from '../key_schemes/list-selection';
import {listboxKeySchemes} from './listbox';
import {TabPattern} from './tab';


/**
 * Abstract stub for base `tablist`. End developer must provide the abstract methods in order to
 * apply further behaviors.
 */
declare abstract class TabListStub implements HasItems<TabPattern>, CanBeFocused {

  // Defer `getItems()` to the end-developer because different
  // frameworks have their own ways of getting children.
  abstract getItems(): TabPattern[];

  // Defer focus behaviors because DOM access should be done at the framework level.
  abstract isFocused: boolean;
  abstract tabIndex: number;
  abstract focus(): void;
  abstract blur(): void;
}

export const tablistKeySchemes: KeyScheme<TabListPattern>[] = [
  new ListNavigationKeyScheme(),
  new ListSelectionKeyScheme(),
];

/** Union of all behaviors that compose into a `tablist`. */
export interface TabListPattern extends
    TabListStub,
    HasLifecycle,
    CanBeDisabled,
    HasId,
    HasOrientation,
    AffectedByRtl,
    HasKeySchemes<TabListPattern>,
    HasActiveDescendant<TabPattern>,
    HasSelectedDescendant<TabPattern> { }

export function mixinTabListKeyScheme<T extends Constructor>(base: T): Constructor<HasKeySchemes<TabListPattern>> & T {
  return class extends base implements HasKeySchemes<TabListPattern> {
    getKeySchemes(): KeyScheme<TabListPattern>[] {
      return listboxKeySchemes;
    }

    constructor(...args: any[]) { super(...args); }
  };
}

// We don't use `mixinOrientation` because we want to default to horizontal
export function mixinTabListOrientation<T extends Constructor>(base: T): Constructor<HasOrientation> & T {
  return class extends base implements HasOrientation {
    isHorizontal: boolean = true;
    constructor(...args: any[]) { super(...args); }
  }
}

/** Mixes the common behaviors of a ListBox onto a class */
export function mixinTabList<T extends ConcreteOrAbstractConstructor>(base?: T): Constructor<TabListPattern> & T {
  return mixinTabListKeyScheme(
    mixinTabListOrientation(
    mixinSelectedDescendant(
    mixinActiveDescendant(
    mixinBidi(
    mixinLifecycle(
    mixinDisabled(
    mixinUniqueId(
    createMixinBase<T, TabListStub>(base)))))))));
}
