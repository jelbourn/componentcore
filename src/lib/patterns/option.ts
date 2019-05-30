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


/** Abstract stub for base `option` behavior that must be implemented by the end-developer. */
declare abstract class OptionStub { }

/** Union of all behaviors that compose into an `option`. */
export interface OptionPattern extends HasLifecycle, CanBeDisabled, HasId, CanBeSelected { }

/** Mixin that augments the given class with the behaviors for an `option`. */
export function mixinOption<T extends ConcreteOrAbstractConstructor>(base?: T): Constructor<OptionPattern> & T {
  return mixinSelected(
    mixinUniqueId(
    mixinLifecycle(
    mixinDisabled(
    createMixinBase<T, OptionStub>(base)))));
}
