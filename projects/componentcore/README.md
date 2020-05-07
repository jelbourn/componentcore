# componentcore
Prototype low-level component foundation based on composing behaviors into interaction patterns

## Implementation notes

## Behaviors
A behavior is an atomic bit of functionality that can apply to a component, such as
"can be disabled" or "has items". Each behavior is defined as an interface. Behaviors can be
cumulative. For example, a component that "has an active item" must inherent "have items".

Behaviors can be added to an existing class via mixin, which here is a function that takes
in a `class` and augments it with some additional functionality.

Behaviors compose into patterns.

## Patterns
A pattern is a union of behaviors that corresponds to one of the canonnical "interaction pattern"
common to the web. For the most part, these align with the standard ARIA roles.

Each pattern defines an interface as a union of behaviors and a mixin that applies all of said
behaviors onto an existing class.

### Framework agnostic
The code here aims provide "behavioral primitives" that can be used in any framework or with
no framework at all.

### Behaviors and patterns don't know about the DOM
Different frameworks have their own systems for performing DOM manipulation, so we defer
all rendering to the framework level.

### Container elements know about their children and not the other way around
* All behaviors live at the _container_ level, while child items are simple state containers.
  * The container *must* know about the children because of patterns like `aria-activedescendant`
  * Having the child items _also_ know about the parent would introduce a circular data flow that
    would make the patterns more difficult to reason about.
  * This implies that either event listeners must live at the container level, or that the container
    must have some way of knowing when the child state changes via some implementation of the
    Observer pattern.
  * This also implies that the container, which cares about order, must either have some way to
    query for its child items or that child items must broadcast when they are added/remove/moved
    and that they must be aware of their own index.
  * Example: A `listbox` knows about its options, but the each option knows nothing of its listbox.
* From an API perspective, end-developers *want* to interact with the container for things that
  deal with the child items. For example, reading the selected value from a `listbox`, even though
  the selection state lives on the `option`.

### The pattern class state is the source of truth
* The DOM acts as the _output_ of the state rather than as the source of truth, which aligns with
most frameworks.
* For custom elements, the pattern class _is_ the custom `Element`.


## Interaction patterns targeted
* listbox
* option
* combobox
* dialog
* grid (row, gridcell, rowgroup, rowheader)
* tree
* slider
* menu
* menuitem, menuitemcheckbox, menuitemradio
* menubar
* tablist
* tab
* tabpanel
* radio-group

## Patterns that don't map exactly to an ARIA role
* Expansion panel
* Accordion
* Datepicker
