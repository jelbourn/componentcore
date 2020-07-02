import {NgModule} from '@angular/core';
import {Listbox, Option} from './listbox';

@NgModule({
  declarations: [Listbox, Option],
  exports: [Listbox, Option],
})
export class ListboxModule {
}
