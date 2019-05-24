import {mixinListbox} from '../patterns/listbox';
import {mixinOption, OptionPattern} from '../patterns/option';
import {mixinDomFocus, mixinDomKeyHandling} from './dom_common';


// TODO: figure out a way to get rid of optionMap. Usually this mapping is something inherent
// to the framework level, so I'm not sure what the best vanilla DOM analog would be.

/** Map of option DOM elements to the corresponding behavior class. */
const optionMap = new WeakMap<Element, OptionDom>();


/**
 * Vanilla DOM implementation of the `listbox` pattern.
 *
 * By extending `mixinListbox()`, we only need to implement the abstract members from
 * `ListboxStub`, which represent the bits that are framework-specific.
 */
export class ListboxDom extends mixinDomKeyHandling(mixinDomFocus(mixinListbox())) {
  private readonly optionObserver: MutationObserver =
      new MutationObserver(() => this.updateOptions());

  private options: OptionPattern[] = [];

  constructor(public hostElement: HTMLElement) {
    super();
  }

  setup() {
    super.setup();
    this.hostElement.setAttribute('role', 'listbox');
    this.updateOptions();

    // Use `subtree` because the options cold be inside of an optgroup
    // (which we don't actually need to know about).
    const mutationObserverConfig = {childList: true, subtree: true};
    this.optionObserver.observe(this.hostElement, mutationObserverConfig);
  }

  teardown() {
    super.teardown();
    this.optionObserver.disconnect();
  }

  getItems(): OptionPattern[] {
    return this.options;
  }

  private getOptionElements(): Element[] {
    return Array.from(this.hostElement.querySelectorAll('[role="option"]'));
  }

  private updateOptions(): void {
    // TODO: remove this cast and handle the possible `undefined`
    this.options = this.getOptionElements().map(o => optionMap.get(o) as OptionDom);
  }

  protected render(): void {
    this.hostElement.setAttribute('aria-activedescendant', this.activeDescendantId);

    for (const optionElement of this.getOptionElements()) {
      const option = optionMap.get(optionElement);
      if (option) {
        option.selected ?
            optionElement.setAttribute('aria-selected', 'true') :
            optionElement.removeAttribute('aria-selected');
        optionElement.classList.toggle('cc-item-active', option.id === this.activeDescendantId);
      }
    }
  }
}

/** Vanilla DOM implementation of the `option` pattern. */
export class OptionDom extends mixinOption() {
  constructor(public hostElement: HTMLElement) {
    super();
    optionMap.set(hostElement, this);
  }

  setup() {
    super.setup();
    this.hostElement.id = this.id;
    this.hostElement.setAttribute('role', 'option');
  }
}


abstract class AbstractDummy {
  abstract dumb(): void;
}

abstract class AbstractDummyListbox extends mixinDomKeyHandling(mixinDomFocus(mixinListbox(AbstractDummy))) {
  constructor(public hostElement: HTMLElement) {super();}
  getItems(): OptionPattern[] {return [];}
  render() {this.dumb();}
}

class ConcreteAbstractDummyListbox extends AbstractDummyListbox {
  dumb() {}
}

class ConcreteDummy {
  dumb() {}
}

class ConcreteDummyListbox extends mixinDomKeyHandling(mixinDomFocus(mixinListbox(ConcreteDummy))) {
  constructor(public hostElement: HTMLElement) {super();}
  getItems(): OptionPattern[] {return [];}
  render() {this.dumb();}
}
