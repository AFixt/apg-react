import React, { useState } from 'react';
import Listbox from '../../components/Listbox/Listbox';
import { mount } from './mount';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

/**
 * Listbox demo: a single-select "Fruits" listbox with none of its five
 * options selected on load.
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
      />
    </main>
  );
}

mount(<ListboxDemo />);
