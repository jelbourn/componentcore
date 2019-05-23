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
  Constructor,
  HasId,
  HasLifecycle,
} from '../behaviors/behavior-interfaces';
import {
  mixinDisabled,
  mixinLifecycle,
  mixinSelected,
  mixinUniqueId,
} from '../behaviors/behavior-mixins';


/** Abstract stub for base `option` behavior that must be implemented by the end-developer. */
declare abstract class OptionStub { }

/** Union of all behaviors that compose into an `option`. */
export interface OptionPattern extends HasLifecycle, CanBeDisabled, HasId, CanBeSelected { }

// Note: the `as Constructor<OptionStub>` cast below exists to enforce that downstream classes that
// apply this mixin are still required to implement any abstract members on the stub class.
// The casts for `as Constructor<OptionPattern> & T` and `as any` exist because the precense of the
// abstract stub class prevents TypeScript from recognizing that the mixins applied satisfy the
// structure of `OptionPattern`.

/** Mixin that augments the given class with the behaviors for an `option`. */
export function mixinOption<T extends Constructor>(base?: T): Constructor<OptionPattern> & T {
  return class extends (
    mixinSelected(
    mixinUniqueId(
    mixinLifecycle(
    mixinDisabled((base || class { } as Constructor<OptionStub>))))) as any) {
    constructor(...args: any[]) { super(...args); }
  } as Constructor<OptionPattern> & T;
}
