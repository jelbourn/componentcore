import {mixinListbox} from '../patterns/listbox';
import {mixinOption} from '../patterns/option';


export class OptionElement extends mixinOption(HTMLElement) {
  private _selected: boolean = false;

  get selected() { return this._selected }
  set selected(s: boolean) {
    this._selected = s;
    s ? this.setAttribute('aria-selected', 'true') : this.removeAttribute('aria-selected');
  }

  connectedCallback(): void {
    this.setup();
  }

  disconnectedCallback(): void {
    this.teardown();
  }
}


export class ListboxElement extends mixinListbox(HTMLElement) {
  // Initialize tabIndex to zero because the listbox should be focusable.
  tabIndex = 0;

  _activeDescendantId: string = '';

  get activeDescendantId() { return this._activeDescendantId; }
  set activeDescendantId(id: string) {
    this._activeDescendantId = id;
    this._updateActiveDescendant();
  }

  private keydownListener = (e: KeyboardEvent) => {
    for (const scheme of this.getKeySchemes()) {
      const handled = scheme.handleKey(this, e);
      if (handled) {
        break;
      }
    }
  };

  get isFocused() {
    return document.activeElement === this;
  }

  connectedCallback(): void {
    this.setup();
    this.addEventListener('keydown', this.keydownListener);
  }

  disconnectedCallback(): void {
    this.teardown();
    this.removeEventListener('keydown', this.keydownListener);
  }

  getItems(): OptionElement[] {
    return Array.from(this.querySelectorAll('cc-option')) as OptionElement[];
  }

  private _updateActiveDescendant() {
    this.activeDescendantId ?
        this.setAttribute('aria-activedescendant', this.activeDescendantId) :
        this.removeAttribute('aria-activedescendant');

    for (const option of this.getItems()) {
      option.classList.toggle('cc-item-active',
          !!option.id && option.id === this.activeDescendantId);
    }
  }
}
