/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {KeyScheme} from '../key_schemes/keyscheme';


/** Constructor for a type T */
export type Constructor<T = object> = new(...args: any[]) => T;

export interface HasLifecycle {
  setup(): void;
  teardown(): void;
}

/** A control that has a unique ID. */
export interface HasId {
  id: string;
}

/** A control that has some number of items, such as a listbox or menu. */
export interface HasItems<T> {
  getItems(): T[];
}

/** A control that can be oriented either veritcally or horizontally. */
export interface HasOrientation {
  isHorizontal: boolean;
}

/** A control that has some keyboard interaction. */
export interface HasKeySchemes<C> {
  getKeySchemes(): KeyScheme<C>[];
  handleKey(event: KeyboardEvent): void;
}

/** A control whose interaction is affected by the locale text direction. */
export interface AffectedByRtl {
  isRtl: boolean;
}

/** A control that can be disabled. */
export interface CanBeDisabled {
  disabled: boolean;
}

/** A control that can be focused */
export interface CanBeFocused {
  isFocused: boolean;
  tabIndex: number;

  focus(): void;
  blur(): void;
}

/** A control that can be selected. */
export interface CanBeSelected {
  selected: boolean;
}

/** A control that has an active descendant, such as a listbox or menu. */
export interface HasActiveDescendant<D> {
  activeDescendantId: string;

  activeDescendantIndex(): number;
  activeDescendant(): D;

  activateNextItem(): void;
  activatePreviousItem(): void;
  activateFirstItem(): void;
  activateLastItem(): void;
}

/** A control that has one or more selected descendants, such as a listbox. */
export interface HasSelectedDescendant<D extends CanBeSelected> {
  multiple: boolean;

  selectItem(item: D): void;
  deselectItem(item: D): void;
  toggleActiveItemSelection(): void;
}
