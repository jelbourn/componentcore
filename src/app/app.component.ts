import { Component } from '@angular/core';
import {SPACE} from '../../projects/componentcore/key_schemes/keycodes';


@Component({
  selector: 'cc-root',
  template: `
    {{x}}
    
  `,
  styles: []
})
export class AppComponent {
  x = SPACE;
}
