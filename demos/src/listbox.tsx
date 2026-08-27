import React, { useState } from 'react';
import Listbox from '../../components/Listbox/Listbox';
import { mount } from './mount';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  // Deliberately between Date and Elderberry, where alphabetical order puts it.
  // Position is load-bearing, not cosmetic: listbox-keyboard-nav presses End and
  // asserts Elderberry ends up selected. Appended last, Durian takes End and --
  // being aria-disabled -- nothing selects at all.
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
];

/**
 * Listbox demo: a single-select "Fruits" listbox with none of its six
 * options selected on load. One of them, Durian, is aria-disabled: the APG
 * keeps a disabled option in the list and reachable, so a keyboard user can
 * arrow onto it and find out it exists rather than having it vanish.
 *
 * `value` is an empty string rather than `undefined` (never a real option
 * value) so the component's controlled `value` prop stays satisfied under
 * `exactOptionalPropertyTypes` while no option matches it, leaving every
 * option's `aria-selected` false until one is chosen.
 *
 * A second, multi-select instance was deliberately left out: apg-qa's
 * counts and locators for "option" run unscoped against the whole page
 * rather than the located listbox, so a second listbox's options would
 * inflate the option count this page's own use cases assert against.
 *
 * `focusModel="activedescendant"` is the model the APG's own listbox examples
 * use, and the one a caller that focuses the listbox itself needs in order to
 * drive it -- under roving tabindex, focus lands on the <ul>, no option handler
 * fires, and nothing responds. See #213.
 */
function ListboxDemo(): React.ReactElement {
  const [value, setValue] = useState('');

  return (
    <main className="demo-page">
      <h1>Listbox</h1>
      <Listbox
        label="Fruits"
        options={fruits}
        value={value}
        onChange={(next) => setValue(next as string)}
        focusModel="activedescendant"
      />
    </main>
  );
}

mount(<ListboxDemo />);
