import {mixinMenu} from '../patterns/menu';
import {mixinMenuItem, MenuItemPattern} from '../patterns/menuitem';

// TODO: figure out a way to get rid of menuitemMap. Usually this mapping is something inherent
// to the framework level, so I'm not sure what the best vanilla DOM analog would be.

/** Map of menuitem DOM elements to the corresponding behavior class. */
const menuitemMap = new WeakMap<Element, MenuItemDom>();

/**
 * Vanilla DOM implementation of the `menu` pattern.
 *
 * By extending `mixinMenu()`, we only need to implement the abstract members from
 * `MenuStub`, which represent the bits that are framework-specific.
 */
export class MenuDom extends mixinMenu() {
  isFocused = false;
  tabIndex = 0;

  private readonly menuitemObserver: MutationObserver =
      new MutationObserver(() => this.updateMenuItems());

  private menuitems: MenuItemPattern[] = [];

  private keydownListener = (e: KeyboardEvent) => {
    for (const scheme of this.getKeySchemes()) {
      const handled = scheme.handleKey(this, e);
      if (handled) {
        break;
      }
    }

    // After the keydown has been handled, update the DOM.
    this.renderMenuItemState();
  };

  private focusHandler = () => { this.isFocused = true; };
  private blurHandler = () => { this.isFocused = false; };

  constructor(public hostElement: HTMLElement) {
    super();
  }

  setup() {
    this.hostElement.addEventListener('keydown', this.keydownListener);
    this.hostElement.setAttribute('role', 'menu');
    this.hostElement.setAttribute('tabindex', `${this.tabIndex}`);

    this.hostElement.addEventListener('focus', this.focusHandler);
    this.hostElement.addEventListener('blur', this.blurHandler);

    this.updateMenuItems();

    // Use `subtree` because the menuitems cold be inside of an optgroup
    // (which we don't actually need to know about).
    const mutationObserverConfig = {childList: true, subtree: true};
    this.menuitemObserver.observe(this.hostElement, mutationObserverConfig);
  }

  teardown() {
    this.hostElement.removeEventListener('keydown', this.keydownListener);

    this.hostElement.removeEventListener('focus', this.focusHandler);
    this.hostElement.removeEventListener('blur', this.blurHandler);

    this.menuitemObserver.disconnect();
  }

  getItems(): MenuItemPattern[] {
    return this.menuitems;
  }

  focus() {
    this.hostElement.focus();
  }

  blur() {
    this.hostElement.blur();
  }

  private getMenuItemElements(): Element[] {
    return Array.from(this.hostElement.querySelectorAll('[role="menuitem"]'));
  }

  private updateMenuItems(): void {
    // TODO: remove this cast and handle the possible `undefined`
    this.menuitems = this.getMenuItemElements().map(o => menuitemMap.get(o) as MenuItemDom);
  }

  private renderMenuItemState(): void {
    this.hostElement.setAttribute('aria-activedescendant', this.activeDescendantId);

    for (const itemElement of this.getMenuItemElements()) {
      const item = menuitemMap.get(itemElement);
      if (item) {
        itemElement.classList.toggle('cc-item-active', item.id === this.activeDescendantId);
      }
    }
  }
}

/** Vanilla DOM implementation of the `menuitem` pattern. */
export class MenuItemDom extends mixinMenuItem() {
  constructor(public hostElement: HTMLElement) {
    super();
    menuitemMap.set(hostElement, this);
  }

  setup() {
    this.hostElement.id = this.id;
    this.hostElement.setAttribute('role', 'menuitem');
  }
}
