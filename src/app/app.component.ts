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
    
    <br><hr><br>
    
    <ccl-listbox>
      <ccl-option>Cheese</ccl-option>
      <ccl-option>Garlic</ccl-option>
      <ccl-option>Tomato</ccl-option>
      <ccl-option>Onion</ccl-option>
    </ccl-listbox>
  `,
})
export class AppComponent {

}
