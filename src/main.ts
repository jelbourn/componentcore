import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {LitListbox, LitOption} from '../projects/lit-demo/listbox/listbox';


customElements.define('ccl-option', LitOption);
customElements.define('ccl-listbox', LitListbox);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
