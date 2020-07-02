import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {App} from './app';
import {ListboxModule} from './listbox/listbox-module';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    ListboxModule,
  ],
  bootstrap: [App]
})
export class AppModule { }
