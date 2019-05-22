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
  HasKeySchemes,
  HasOrientation,
  HasSelectedDescendant,
  PatternBase,
} from '../behaviors/behavior-interfaces';
import {
  mixinActiveDescendant,
  mixinBidi,
  mixinDisabled,
  mixinOrientation,
  mixinUniqueId,
} from '../behaviors/behavior-mixins';
import {KeyScheme} from '../key_schemes/keyscheme';
import {ListNavigationKeyScheme} from '../key_schemes/list-navigation';
import {MenuItemPattern} from './menuitem';


// TODO: a menu *can* have a a selection via `menuitemcheckbox` and `menuitemradio`
// TODO: menu and listbox share a lot, potentially refactor out a common thing like "ListLike"


/**
 * Abstract stub for base `menu`. End developer must provide the abstract methods in order to
 * apply further behaviors.
 */
declare abstract class MenuStub extends PatternBase implements HasItems<MenuItemPattern>, CanBeFocused {

  // Defer `getItems()` to the end-developer because different
  // frameworks have their own ways of getting children.
  abstract getItems(): MenuItemPattern[];

  // Defer focus behaviors because DOM access should be done at the framework level.
  abstract isFocused: boolean;
  abstract tabIndex: number;
  abstract focus(): void;
  abstract blur(): void;
}

export const menuKeySchemes: KeyScheme<MenuPattern>[] = [new ListNavigationKeyScheme()];

/** Union of all behaviors that compose into a `menu`. */
export interface MenuPattern extends MenuStub,
    CanBeDisabled,
    HasId,
    HasOrientation,
    AffectedByRtl,
    HasKeySchemes<MenuPattern>,
    HasActiveDescendant<MenuItemPattern>,
    HasSelectedDescendant<MenuItemPattern> { }

// Note: the `as Constructor<MenuStub>` cast below exists to enforce that downstream classes that
// apply this mixin are still required to implement any abstract members on the stub class.
// The casts for `as Constructor<MenuPattern> & T` and `as any` exist because the precense of the
// abstract stub class prevents TypeScript from recognizing that the mixins applied satisfy the
// structure of `MenuPattern`.

/** Mixes the common behaviors of a menu onto a class */
export function mixinMenu<T extends Constructor<object>>(base?: T): Constructor<MenuPattern> & T {
  return class extends (
    mixinActiveDescendant(
    mixinBidi(
    mixinOrientation(
    mixinDisabled(
    mixinUniqueId((base || class { }) as Constructor<MenuStub>))))) as any) {

    getKeySchemes(): KeyScheme<MenuPattern>[] {
      return menuKeySchemes;
    }

    constructor(...args: any[]) { super(...args); }
  } as Constructor<MenuPattern> & T;
}
