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
import {MenuItemPattern} from './menuitem';


/**
 * Abstract stub for base `menu`. End developer must provide the abstract methods in order to
 * apply further behaviors.
 */
declare abstract class MenuStub extends PatternBase implements HasItems<MenuItemPattern>,
    HasKeySchemes, CanBeFocused {

  // Defer `getItems()` to the end-developer because different
  // frameworks have their own ways of getting children.
  abstract getItems(): MenuItemPattern[];

  // TODO: why? Also why any.
  // Defer `getKeySchemes()` because ???
  abstract getKeySchemes(): KeyScheme<any>[];

  // Defer focus behaviors because DOM access should be done at the framework level.
  abstract isFocused: boolean;
  abstract tabIndex: number;
  abstract focus(): void;
  abstract blur(): void;
}

/** Union of all behaviors that compose into a `menu`. */
export interface MenuPattern extends MenuStub, CanBeDisabled, HasId, HasOrientation,
    AffectedByRtl, HasActiveDescendant<MenuItemPattern>, HasSelectedDescendant<MenuItemPattern> { }

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
    constructor(...args: any[]) { super(...args); }
  } as Constructor<MenuPattern> & T;
}
