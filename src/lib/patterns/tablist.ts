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
  Constructor,
  HasActiveDescendant,
  HasId,
  HasItems,
  HasKeySchemes, HasLifecycle,
  HasOrientation,
  HasSelectedDescendant,
} from '../behaviors/behavior-interfaces';
import {
  mixinActiveDescendant,
  mixinBidi,
  mixinDisabled, mixinLifecycle,
  mixinOrientation,
  mixinSelectedDescendant,
  mixinUniqueId,
} from '../behaviors/behavior-mixins';
import {KeyScheme} from '../key_schemes/keyscheme';
import {ListNavigationKeyScheme} from '../key_schemes/list-navigation';
import {ListSelectionKeyScheme} from '../key_schemes/list-selection';
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

// Note: the `as Constructor<TabListStub>` cast below exists to enforce that downstream classes that
// apply this mixin are still required to implement any abstract members on the stub class.
// The casts for `as Constructor<TabListPattern> & T` and `as any` exist because the precense of the
// abstract stub class prevents TypeScript from recognizing that the mixins applied satisfy the
// structure of `TabListPattern`.

/** Mixes the common behaviors of a ListBox onto a class */
export function mixinTabList<T extends Constructor>(base?: T): Constructor<TabListPattern> & T {
  return class extends (
    mixinSelectedDescendant(
    mixinActiveDescendant(
    mixinBidi(
    mixinLifecycle(
    mixinDisabled(
    mixinUniqueId((base || class { }) as Constructor<TabListStub>)))))) as any) {

    // We don't use `mixinOrientation` because we want to default to horizontal
    isHorizontal: boolean = true;

    getKeySchemes(): KeyScheme<TabListPattern>[] {
      return tablistKeySchemes;
    }

    constructor(...args: any[]) { super(...args); }
  } as Constructor<TabListPattern> & T;
}
