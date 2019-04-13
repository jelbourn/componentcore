import {ListboxDom, OptionDom} from '../lib/dom_impl/listbox';


const listboxHost = document.querySelector('ul')!;
const listbox = new ListboxDom(listboxHost);

const optionHosts = Array.from(document.querySelectorAll('li'));
const options = optionHosts.map(e => new OptionDom(e));

options.forEach(o => o.setup());
listbox.setup();
