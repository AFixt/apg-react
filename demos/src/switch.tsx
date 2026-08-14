import React from 'react';
import Switch from '../../components/Switch/Switch';
import { mount } from './mount';

/**
 * Switch demo: a single on/off switch, off by default.
 *
 * Switch is internally stateful — it owns its own `isChecked` and exposes no
 * `onChange` or controlled-value prop — so the demo renders it directly with
 * no state of its own to wire up.
 */
function SwitchDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Switch</h1>
      <Switch label="Notifications" initialChecked={false} />
    </main>
  );
}

mount(<SwitchDemo />);
