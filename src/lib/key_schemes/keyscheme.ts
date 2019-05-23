/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {Inferred} from '../behaviors/behavior-interfaces';

/**
 * Represents a set of keyboard controls that map to actions. One or more KeySchemes can
 * be applied to a control.
 *
 * @template T Control type for which this key scheme applies. Typically a union of one or
 *     more behaviors.
 */
export interface KeyScheme<T> {
  /**
   * Handles a key press, returning whether the given key mapped to an action.
   * @param control The control instance for which some action may be taken.
   * @param keyEvent The keyboard event being handled.
   * @returns Whether the key event has handled by this scheme.
   */
  handleKey(control: Inferred<T>, keyEvent: KeyboardEvent): boolean;
}
