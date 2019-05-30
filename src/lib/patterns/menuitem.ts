/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  CanBeDisabled,
  ConcreteOrAbstractConstructor,
  Constructor,
  HasId,
  HasLifecycle
} from '../behaviors/behavior-interfaces';
import {createMixinBase, mixinDisabled, mixinLifecycle, mixinUniqueId} from '../behaviors/behavior-mixins';


/** Abstract stub for base `menuitem` behavior that must be implemented by the end-developer. */
declare abstract class MenuItemStub { }

/** Union of all behaviors that compose into an `menuitem`. */
export interface MenuItemPattern extends HasLifecycle, CanBeDisabled, HasId { }

/** Mixin that augments the given class with the behaviors for an `menuitem`. */
export function mixinMenuItem<T extends ConcreteOrAbstractConstructor>(base?: T): Constructor<MenuItemPattern> & T {
  return mixinUniqueId(
    mixinLifecycle(
    mixinDisabled(
    createMixinBase<T, MenuItemStub>(base))));
}
