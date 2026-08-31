import React from 'react';
import Switch from '../../components/Switch/Switch';
import { mount } from './mount';

/**
 * Switch demo: a single on/off switch, off by default.
 *
 * Switch is internally stateful — it owns its own checked state, and its
 * optional `checked`/`onChange` pair is for a consumer that wants to drive it —
 * so the demo renders it directly with no state of its own to wire up.
 *
 * Keep this page to **exactly one** switch. The six APG runner repos address it
 * with unscoped selectors (`[role=switch]`, `.switch-label-text`,
 * `.switch-control .switch`) rather than by accessible name, so a second switch
 * of any name breaks them. The disabled state lives on `switch-disabled.html`
 * for that reason. See `demos/README.md`.
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
