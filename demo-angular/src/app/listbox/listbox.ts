import {Component, ContentChildren, ElementRef, OnDestroy, OnInit, QueryList} from '@angular/core';
import {mixinListbox, mixinOption, OptionPattern} from 'componentcore';

@Component({
  selector: 'cc-option',
  template: '<ng-content></ng-content>',
  styleUrls: ['./option.css'],
  host: {
    'role': 'option',
    '[attr.aria-selected]': 'selected',
    '[attr.aria-disabled]': 'disabled || null',
    '[class.cc-option-active]': 'id === parent.activeDescendantId',
  },
})
export class Option extends mixinOption() {
  // TODO(jelbourn): ideally I want to avoid the options knowing about their parent container.
  // However, this is the absolute simplest way of knowing whether this option is "active" in
  // an `aria-activedescendant` model.
  constructor(private parent: Listbox) {
    super();
    this.setup();
  }

  ngOnDestroy() { this.teardown(); }
}

@Component({
  selector: 'cc-listbox',
  templateUrl: './listbox.html',
  styleUrls: ['./listbox.css'],
  host: {
    'role': 'listbox',
    '[attr.aria-activedescendant]': 'this.activeDescendantId || null',
    '[attr.aria-disabled]': 'this.disabled || null',
    'tabindex': '0',
    '(keydown)': 'handleKey($event)', // TODO: WebStorm doesn't like this, but tsc compiles.
  },
})
export class Listbox extends mixinListbox() implements OnInit, OnDestroy {
  @ContentChildren(Option) options!: QueryList<Option>;

  get isFocused(): boolean { return this.elementRef.nativeElement === document.activeElement; }
  get tabIndex(): number { return this.elementRef.nativeElement.tabIndex; }

  constructor(private elementRef: ElementRef<HTMLElement>) { super(); }

  ngOnInit() { this.setup(); }
  ngOnDestroy() { this.teardown(); }

  focus(): void { this.elementRef.nativeElement.focus(); }
  blur(): void { this.elementRef.nativeElement.blur(); }

  getItems(): OptionPattern[] {
    return this.options?.toArray() || [];
  }
}
