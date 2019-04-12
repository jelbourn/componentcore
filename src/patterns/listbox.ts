/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  AffectedByRtl,
  CanBeDisabled,
  CanBeFocused,
  Constructor,
  HasActiveDescendant,
  HasId,
  HasItems,
  HasKeySchemes,
  HasOrientation,
  HasSelectedDescendant,
  PatternBase,
} from '../behaviors/behavior-interfaces';
import {
  mixinActiveDescendant,
  mixinBidi,
  mixinDisabled,
  mixinOrientation,
  mixinSelectedDescendant,
  mixinUniqueId,
} from '../behaviors/behavior-mixins';
import {KeyScheme} from '../key_schemes/keyscheme';
import {OptionPattern} from './option';


/**
 * Abstract stub for base `listbox`. End developer must provide the abstract methods in order to
 * apply further behaviors.
 */
declare abstract class ListboxStub extends PatternBase implements HasItems<OptionPattern>,
    HasKeySchemes, CanBeFocused {

  // Defer `getItems()` to the end-developer because different
  // frameworks have their own ways of getting children.
  abstract getItems(): OptionPattern[];

  // TODO: why? Also why any.
  // Defer `getKeySchemes()` because ???
  abstract getKeySchemes(): KeyScheme<any>[];

  // Defer focus behaviors because DOM access should be done at the framework level.
  abstract isFocused: boolean;
  abstract tabIndex: number;
  abstract focus(): void;
  abstract blur(): void;
}

/** Union of all behaviors that compose into a `listbox`. */
export interface ListboxPattern extends ListboxStub, CanBeDisabled, HasId, HasOrientation,
    AffectedByRtl, HasActiveDescendant<OptionPattern>, HasSelectedDescendant<OptionPattern> { }

/** Mixes the common behaviors of a ListBox onto a class */
function mixinListbox<T extends Constructor<object>>(base?: T): Constructor<ListboxPattern> & T {
  return class extends (
    mixinSelectedDescendant(
    mixinActiveDescendant(
    mixinBidi(
    mixinOrientation(
    mixinDisabled(
    mixinUniqueId((base || class { }) /**/ as Constructor<ListboxStub> /**/)))))) as any) {
    constructor(...args: any[]) { super(...args); }
  } /**/ as Constructor<ListboxPattern> & T /**/;
}
