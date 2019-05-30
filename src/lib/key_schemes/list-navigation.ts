/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AffectedByRtl, HasActiveDescendant, HasOrientation} from '../behaviors/behavior-interfaces';
import {DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW} from './keycodes';
import {KeyScheme} from './keyscheme';


/** A list-like control that has arrow-key navigation, such as listbox or menu. */
export type ListLike<D = unknown> = HasActiveDescendant<D> & AffectedByRtl & HasOrientation;

// TODO: KeySchemes can be singletons

/** Key scheme for navigating through a list-like control, such as a listbox or menu. */
export class ListNavigationKeyScheme implements KeyScheme<ListLike> {
  handleKey(control: ListLike, event: KeyboardEvent): boolean {
    const keyCode = event.keyCode;

    switch (keyCode) {
      case DOWN_ARROW:
        if (!control.isHorizontal) {
          control.activateNextItem();
          return true;
        }
        break;

      case UP_ARROW:
        if (!control.isHorizontal) {
          control.activatePreviousItem();
          return true;
        }
        break;


      case RIGHT_ARROW:
        if (control.isHorizontal && !control.isRtl) {
          control.activateNextItem();
          return true;
        } else if (control.isRtl) {
          control.activatePreviousItem();
          return true;
        }
        break;

      case LEFT_ARROW:
        if (control.isHorizontal && !control.isRtl) {
          control.activatePreviousItem();
          return true;
        } else if (control.isRtl) {
          control.activateNextItem();
          return true;
        }
        break;
    }

    // TODO: typeahead
    // TODO: home and end

    return false;
  }
}
