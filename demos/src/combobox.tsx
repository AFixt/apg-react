import React, { useState } from 'react';
import Combobox from '../../components/Combobox/Combobox';
import { mount } from './mount';

const countries = [
  { value: 'af', label: 'Afghanistan' },
  { value: 'al', label: 'Albania' },
  { value: 'dz', label: 'Algeria' },
  { value: 'ad', label: 'Andorra' },
  { value: 'ao', label: 'Angola' },
  { value: 'ar', label: 'Argentina' },
  { value: 'au', label: 'Australia' },
  { value: 'at', label: 'Austria' },
  { value: 'us', label: 'United States' },
];

/**
 * Combobox demo: a single "Country" combobox using the `autocomplete="both"`
 * variant (list filtering plus inline text completion), the richest of the
 * component's three modes and a superset of what "list" and "none" exercise.
 */
function ComboboxDemo(): React.ReactElement {
  const [value, setValue] = useState('');

  return (
    <main className="demo-page">
      <h1>Combobox</h1>
      <Combobox
        label="Country"
        options={countries}
        autocomplete="both"
        placeholder="Type to search…"
        value={value}
        onChange={setValue}
      />
    </main>
  );
}

mount(<ComboboxDemo />);
