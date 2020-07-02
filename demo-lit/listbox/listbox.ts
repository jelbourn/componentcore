import {css, html, LitElement, PropertyValues} from 'lit-element';
import {mixinListbox, mixinOption, OptionPattern} from 'componentcore';

export class LitOption extends mixinOption(LitElement) {
  static get properties() {
    return {
      disabled: {attribute: 'aria-disabled', type: String, reflect: true},
      selected: {attribute: 'aria-selected', type: String, reflect: true},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      :host([aria-selected="true"]) {
        color: peru;
      }
      
      :host(.cc-option-active) {
        outline: 1px solid rebeccapurple;
      }    
    `;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.setAttribute('role', 'option');
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setup();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.teardown();
  }

  render() {
    return html`<slot></slot>`;
  }
}

export class LitListbox extends mixinListbox(LitElement) {
  static get properties() {
    return {
      disabled: {attribute: 'aria-disabled', type: String, reflect: true},
      activeDescendantId: {attribute: 'aria-activedescendant', type: String, reflect: true},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid black;
      } 
    `;
  }

  get isFocused(): boolean {
    return this === document.activeElement;
  }

  get activeDescendantId(): string { return this._activeDescendantId; }

  set activeDescendantId(value: string) {
    if (this.activeDescendantId) {
      const option = document.getElementById(this.activeDescendantId);
      if (option) {
        option.classList.remove('cc-option-active');
      }
    }

    if (value) {
      const option = document.getElementById(value);
      if (option) {
        option.classList.add('cc-option-active');
      }
    }

    this._activeDescendantId = value;
  }
  private _activeDescendantId: string = '';

  connectedCallback(): void {
    super.connectedCallback();
    this.setup();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.teardown();
  }

  getItems(): OptionPattern[] {
    return Array.from(this.querySelectorAll('ccl-option')) as LitOption[];
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.tabIndex = 0;
    this.setAttribute('role', 'listbox');
    this.addEventListener('keydown', e => this.handleKey(e));
  }

  render() {
    return html`<slot></slot>`;
  }
}
