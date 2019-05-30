/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  CanBeDisabled,
  CanBeSelected,
  ConcreteOrAbstractConstructor,
  Constructor,
  HasId,
  HasLifecycle,
} from '../behaviors/behavior-interfaces';
import {
  createMixinBase,
  mixinDisabled,
  mixinLifecycle,
  mixinSelected,
  mixinUniqueId,
} from '../behaviors/behavior-mixins';


/** Abstract stub for base `tab` behavior that must be implemented by the end-developer. */
declare abstract class TabStub { }

/** Union of all behaviors that compose into an `tab`. */
export interface TabPattern extends HasLifecycle, CanBeDisabled, HasId, CanBeSelected { }

/** Mixin that augments the given class with the behaviors for an `tab`. */
export function mixinTab<T extends ConcreteOrAbstractConstructor>(base?: T): Constructor<TabPattern> & T {
  return mixinSelected(
    mixinUniqueId(
    mixinLifecycle(
    mixinDisabled(
    createMixinBase<T, TabStub>(base)))));
}
