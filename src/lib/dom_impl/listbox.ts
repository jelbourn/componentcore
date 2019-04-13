import {KeyScheme} from '../key_schemes/keyscheme';
import {ListNavigationKeyScheme} from '../key_schemes/list-navigation';
import {ListSelectionKeyScheme} from '../key_schemes/list-selection';
import {mixinListbox} from '../patterns/listbox';
import {mixinOption, OptionPattern} from '../patterns/option';


// TODO: this `any` should not be necessary, but TS doesn't seem to understand that
// `ListboxDom` satifies the `control` type for BOTH ListKeyScheme and SelectionListKeyScheme.

/** Key schemes that apply to a listbox. */
const listboxKeySchemes: KeyScheme<any>[] = [
  new ListNavigationKeyScheme(),
  new ListSelectionKeyScheme(),
];

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
export class ListboxDom extends mixinListbox() {
  isFocused = false;
  tabIndex = 0;

  private readonly optionObserver: MutationObserver =
      new MutationObserver(() => this.updateOptions());

  private options: OptionPattern[] = [];

  private keydownListener = (e: KeyboardEvent) => {
    for (const scheme of this.getKeySchemes()) {
      const handled = scheme.handleKey(this, e);
      if (handled) {
        break;
      }
    }

    // After the keydown has been handled, update the DOM.
    this.renderOptionState();
  };

  private focusHandler = () => { this.isFocused = true; }
  private blurHandler = () => { this.isFocused = false; }

  constructor(public hostElement: HTMLElement) {
    super();
  }

  setup() {
    this.hostElement.addEventListener('keydown', this.keydownListener);
    this.hostElement.setAttribute('role', 'listbox');
    this.hostElement.setAttribute('tabindex', `${this.tabIndex}`);

    this.hostElement.addEventListener('focus', this.focusHandler);
    this.hostElement.addEventListener('blur', this.blurHandler);

    this.updateOptions();

    // Use `subtree` because the options cold be inside of an optgroup
    // (which we don't actually need to know about).
    const mutationObserverConfig = {childList: true, subtree: true};
    this.optionObserver.observe(this.hostElement, mutationObserverConfig);
  }

  teardown() {
    this.hostElement.removeEventListener('keydown', this.keydownListener);

    this.hostElement.removeEventListener('focus', this.focusHandler);
    this.hostElement.removeEventListener('blur', this.blurHandler);

    this.optionObserver.disconnect();
  }

  getItems(): OptionPattern[] {
    return this.options;
  }

  focus() {
    this.hostElement.focus();
  }

  blur() {
    this.hostElement.blur();
  }

  getKeySchemes() {
    return listboxKeySchemes;
  }

  private getOptionElements(): Element[] {
    return Array.from(this.hostElement.querySelectorAll('[role="option"]'));
  }

  private updateOptions(): void {
    // TODO: remove this cast and handle the possible `undefined`
    this.options = this.getOptionElements().map(o => optionMap.get(o) as OptionDom);
  }

  private renderOptionState(): void {
    this.hostElement.setAttribute('aria-activedescendant', this.activeDescendantId);

    for (const optionElement of this.getOptionElements()) {
      const option = optionMap.get(optionElement);
      if (option && option.selected) {
        optionElement.setAttribute('aria-selected', 'true');
      } else {
        optionElement.removeAttribute('aria-selected');
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
    this.hostElement.id = this.id;
    this.hostElement.setAttribute('role', 'option');
  }
}
