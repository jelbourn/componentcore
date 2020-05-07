import {Component} from '@angular/core';


@Component({
  selector: 'cc-root',
  template: `
    <h2>Angular Listbox</h2>
    <cc-listbox>
      <cc-option>Cheese</cc-option>
      <cc-option>Garlic</cc-option>
      <cc-option>Tomato</cc-option>
      <cc-option>Onion</cc-option>
    </cc-listbox>
  `,
})
export class AppComponent {

}
