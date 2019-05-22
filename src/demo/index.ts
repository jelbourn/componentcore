import {ListboxDom, OptionDom} from '../lib/dom_impl/listbox';
import {MenuDom, MenuItemDom} from '../lib/dom_impl/menu';


// Create listbox DOM instance
const listboxHost = document.querySelector('ul#listbox') as HTMLElement;
const listbox = new ListboxDom(listboxHost);

const optionHosts = Array.from(listboxHost.querySelectorAll('li'));
const options = optionHosts.map(e => new OptionDom(e));

options.forEach(o => o.setup());
listbox.setup();

// Create menu DOM nistance
const menuHost = document.querySelector('ul#menu') as HTMLElement;
const menu = new MenuDom(menuHost);

const menuItemHosts = Array.from(menuHost.querySelectorAll('li'));
const menuItems = menuItemHosts.map(e => new MenuItemDom(e));

menuItems.forEach(o => o.setup());
menu.setup();
