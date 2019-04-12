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
  PatternBase,
} from '../behaviors/behavior-interfaces';
import {mixinDisabled, mixinSelected, mixinUniqueId} from '../behaviors/behavior-mixins';


/** Abstract stub for base `option` behavior that must be implemented by the end-developer. */
declare abstract class OptionStub extends PatternBase { }


/** Union of all behaviors that compose into an `option`. */
export interface OptionPattern extends PatternBase, CanBeDisabled, HasId, CanBeSelected { }

// TODO: the casts below shoudln't be necessary, see if we can replace

/** Mixin that augments the given class with the behaviors for an `option`. */
function mixinOption<T extends Constructor<object>>(base?: T): Constructor<OptionPattern> & T {
  return class extends (
    mixinSelected(
    mixinUniqueId(
    mixinDisabled((base || class { } /**/ as Constructor<OptionStub> /**/)))) as any) {
    constructor(...args: any[]) { super(...args); }
  } /**/ as Constructor<OptionPattern> & T /**/;
}
