import React, { useState } from 'react';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import { mount } from './mount';

const options = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
];

/**
 * RadioGroup demo: a shipping-method chooser with no option selected on load.
 *
 * The component defaults an uncontrolled group to its first option, so the
 * demo controls `value` itself and starts it as an empty string to match the
 * APG's "nothing checked until the user acts" starting state.
 */
function RadioGroupDemo(): React.ReactElement {
  const [value, setValue] = useState('');

  return (
    <main className="demo-page">
      <h1>Radio Group</h1>
      <RadioGroup
        name="shipping"
        label="Shipping Method"
        options={options}
        value={value}
        onChange={setValue}
      />
    </main>
  );
}

mount(<RadioGroupDemo />);
