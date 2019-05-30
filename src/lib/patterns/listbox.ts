/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  ConcreteOrAbstractConstructor,
  AffectedByRtl,
  CanBeDisabled,
  CanBeFocused,
  Constructor,
  HasActiveDescendant,
  HasId,
  HasItems,
  HasKeySchemes, HasLifecycle,
  HasOrientation,
  HasSelectedDescendant,
} from '../behaviors/behavior-interfaces';
import {
  createMixinBase,
  mixinActiveDescendant,
  mixinBidi,
  mixinDisabled, mixinLifecycle,
  mixinOrientation,
  mixinSelectedDescendant,
  mixinUniqueId,
} from '../behaviors/behavior-mixins';
import {KeyScheme} from '../key_schemes/keyscheme';
import {ListNavigationKeyScheme} from '../key_schemes/list-navigation';
import {ListSelectionKeyScheme} from '../key_schemes/list-selection';
import {OptionPattern} from './option';


/**
 * Abstract stub for base `listbox`. End developer must provide the abstract methods in order to
 * apply further behaviors.
 */
declare abstract class ListboxStub implements HasItems<OptionPattern>, CanBeFocused {
  // Defer `getItems()` to the end-developer because different
  // frameworks have their own ways of getting children.
  abstract getItems(): OptionPattern[];

  // Defer focus behaviors because DOM access should be done at the framework level.
  abstract isFocused: boolean;
  abstract tabIndex: number;
  abstract focus(): void;
  abstract blur(): void;
}

export const listboxKeySchemes: KeyScheme<ListboxPattern>[] = [
  new ListNavigationKeyScheme(),
  new ListSelectionKeyScheme(),
];

/** Union of all behaviors that compose into a `listbox`. */
export interface ListboxPattern extends
    ListboxStub,
    HasLifecycle,
    CanBeDisabled,
    HasId,
    HasOrientation,
    AffectedByRtl,
    HasKeySchemes<ListboxPattern>,
    HasActiveDescendant<OptionPattern>,
    HasSelectedDescendant<OptionPattern> { }

function mixinListboxKeyScheme<T extends Constructor>(base: T):
    Constructor<HasKeySchemes<ListboxPattern>> & T {
  return class extends base implements HasKeySchemes<ListboxPattern> {
    getKeySchemes(): KeyScheme<ListboxPattern>[] {
      return listboxKeySchemes;
    }

    constructor(...args: any[]) { super(...args); }
  };
}

/** Mixes the common behaviors of a ListBox onto a class */
export function mixinListbox<T extends ConcreteOrAbstractConstructor>(base?: T):
    Constructor<ListboxPattern> & T {
  return mixinListboxKeyScheme(
    mixinSelectedDescendant(
    mixinActiveDescendant(
    mixinBidi(
    mixinOrientation(
    mixinLifecycle(
    mixinDisabled(
    mixinUniqueId(
    createMixinBase<T, ListboxStub>(base)))))))));
}
