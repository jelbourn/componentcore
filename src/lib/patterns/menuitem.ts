/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {CanBeDisabled, Constructor, HasId, PatternBase} from '../behaviors/behavior-interfaces';
import {mixinDisabled, mixinUniqueId} from '../behaviors/behavior-mixins';


/** Abstract stub for base `menuitem` behavior that must be implemented by the end-developer. */
declare abstract class MenuItemStub extends PatternBase { }

/** Union of all behaviors that compose into an `menuitem`. */
export interface MenuItemPattern extends PatternBase, CanBeDisabled, HasId { }

// Note: the `as Constructor<MenuItemStub>` cast below exists to enforce that downstream classes
// that apply this mixin are still required to implement any abstract members on the stub class.
// The casts for `as Constructor<MenuItemPattern> & T` and `as any` exist because the precense of
// the abstract stub class prevents TypeScript from recognizing that the mixins applied satisfy the
// structure of `MenuItemPattern`.

/** Mixin that augments the given class with the behaviors for an `menuitem`. */
export function mixinMenuItem<T extends Constructor<object>>(base?: T): Constructor<MenuItemPattern> & T {
  return class extends (
    mixinUniqueId(
    mixinDisabled((base || class { } as Constructor<MenuItemStub>))) as any) {
    constructor(...args: any[]) { super(...args); }
  } as Constructor<MenuItemPattern> & T;
}
