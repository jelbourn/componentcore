import {
  CanBeFocused,
  Constructor,
  HasKeySchemes, HasLifecycle,
} from '../behaviors/behavior-interfaces';


/** A DOM-based UI control */
export interface HasHostElement {
  hostElement: HTMLElement;
  render(): void;
}

/** Abstract stub for a DOM-based UI control */
export declare abstract class DomComponentStub {
  abstract hostElement: HTMLElement;
  protected abstract render(): void;
}

/** Mixes in the implementation of CanBeFocused for a DOM-based control. */
export function mixinDomFocus<T extends Constructor<HasLifecycle>>(base: T):
    Constructor<CanBeFocused> & Constructor<DomComponentStub> & T {
  return class extends (base as unknown as Constructor<HasHostElement & HasLifecycle>) {
    isFocused = false;
    tabIndex = 0;

    focus() {
      this.hostElement.focus();
    }

    blur() {
      this.hostElement.blur();
    }

    private focusHandler = () => { this.isFocused = true; };
    private blurHandler = () => { this.isFocused = false; };

    setup() {
      super.setup();
      this.hostElement.addEventListener('focus', this.focusHandler);
      this.hostElement.addEventListener('blur', this.blurHandler);
      this.hostElement.setAttribute('tabindex', `${this.tabIndex}`);
    }

    teardown() {
      super.teardown();
      this.hostElement.removeEventListener('focus', this.focusHandler);
      this.hostElement.removeEventListener('blur', this.blurHandler);
    }

    constructor(...args: any[]) { super(...args); }
  } as unknown as Constructor<CanBeFocused> & Constructor<DomComponentStub> & T
}

/** Mixes in keyboard handling for a DOM-based control. */
export function mixinDomKeyHandling<
    T extends Constructor<HasLifecycle & HasKeySchemes<any>>>(base: T):
    Constructor<DomComponentStub> & T {
  return class extends
      (base as unknown as Constructor<HasHostElement & HasLifecycle & HasKeySchemes<any>>) {
      private keydownListener = (e: KeyboardEvent) => {
      for (const scheme of this.getKeySchemes()) {
        const handled = scheme.handleKey(this, e);
        if (handled) {
          break;
        }
      }

      // After the keydown has been handled, update the DOM.
      this.render();
    };

    setup() {
      super.setup();
      this.hostElement.addEventListener('keydown', this.keydownListener);
    }

    teardown() {
      super.teardown();
      this.hostElement.removeEventListener('keydown', this.keydownListener);
    }

    constructor(...args: any[]) { super(...args); }
  } as unknown as Constructor<DomComponentStub> & T
}
