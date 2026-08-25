import React, { useState } from 'react';
import Checkbox from '../../components/Checkbox/Checkbox';
import CheckboxGroup from '../../components/CheckboxGroup/CheckboxGroup';
import { mount } from './mount';

const preferencesItems = [
  { id: 'weekly-digest', label: 'Weekly digest' },
  { id: 'product-updates', label: 'Product updates' },
];

/**
 * Checkbox demo: a standalone two-state checkbox plus a tri-state checkbox
 * group.
 *
 * The standalone checkbox is externally controlled, so the demo owns its
 * `checked` state the same way the accordion demo owns `openIndex`.
 * CheckboxGroup is internally stateful and manages its own parent/child
 * tri-state coordination, so it is rendered here with no extra wiring.
 */
function CheckboxDemo(): React.ReactElement {
  const [agreed, setAgreed] = useState<boolean | null>(false);

  return (
    <main className="demo-page">
      <h1>Checkbox</h1>
      <Checkbox label="I agree to the terms" checked={agreed} onChange={setAgreed} />
      <CheckboxGroup label="Newsletter Preferences" items={preferencesItems} />
    </main>
  );
}

mount(<CheckboxDemo />);
