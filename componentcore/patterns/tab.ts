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


/** Abstract stub for base `tab` behavior that must be implemented by the end-developer. */
declare abstract class TabStub { }

/** Union of all behaviors that compose into an `tab`. */
export interface TabPattern extends HasLifecycle, CanBeDisabled, HasId, CanBeSelected { }

// Note: the `as Constructor<TabStub>` cast below exists to enforce that downstream classes that
// apply this mixin are still required to implement any abstract members on the stub class.
// The casts for `as Constructor<TabPattern> & T` and `as any` exist because the precense of the
// abstract stub class prevents TypeScript from recognizing that the mixins applied satisfy the
// structure of `TabPattern`.

/** Mixin that augments the given class with the behaviors for an `tab`. */
export function mixinTab<T extends Constructor<object>>(base?: T): Constructor<TabPattern> & T {
  return class extends (
    mixinSelected(
    mixinUniqueId(
    mixinLifecycle(
    mixinDisabled((base || class { } as Constructor<TabStub>))))) as any) {
    constructor(...args: any[]) { super(...args); }
  } as Constructor<TabPattern> & T;
}
