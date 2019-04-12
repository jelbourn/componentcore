/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CanBeSelected, HasSelectedDescendant} from '../behaviors/behavior-interfaces';
import {SPACE} from './keycodes';
import {KeyScheme} from './keyscheme';


/** Key scheme for selecting items with a list-like control, such as a listbox. */
export class ListSelectionKeyScheme implements KeyScheme<HasSelectedDescendant<CanBeSelected>> {
  handleKey(control: HasSelectedDescendant<CanBeSelected>, event: KeyboardEvent) {
    const keyCode = event.keyCode;
    switch (keyCode) {
      case SPACE:
        control.toggleActiveItemSelection();
        return true;
    }

    return false;
  }
}
