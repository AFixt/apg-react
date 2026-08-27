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
 * Listbox demo, multi-select state.
 *
 * Exposes aria-multiselectable="true": Space toggles the active option, and
 * Shift+Arrow extends the selection.
 *
 * A separate page rather than a second listbox on the default one, because
 * apg-qa's option counts and locators run unscoped against the whole page --
 * a second listbox's options would inflate the count `listbox-aria-state`
 * asserts.
 *
 * `focusModel="activedescendant"` is required, not decorative: the QA case
 * opens by focusing the listbox itself, and under roving tabindex focus lands
 * on the <ul>, no option handler fires, and the case fails before a key is
 * pressed. See #213.
 *
 * Durian is deliberately absent here -- the disabled option belongs to the
 * default page's `listbox-error` case, and this page's selection assertions
 * name Apple, Banana and Cherry.
 *
 * Addressed by `apg-qa` as `listbox_multiselect_url`.
 */
function ListboxMultiselectDemo(): React.ReactElement {
  const [value, setValue] = useState<string[]>([]);

  return (
    <main className="demo-page">
      <h1>Listbox — multi-select</h1>
      <Listbox
        label="Fruits"
        options={fruits}
        value={value}
        onChange={(next) => setValue(next as string[])}
        multiple
        focusModel="activedescendant"
      />
    </main>
  );
}

mount(<ListboxMultiselectDemo />);
