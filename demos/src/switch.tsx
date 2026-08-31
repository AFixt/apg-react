import React from 'react';
import Switch from '../../components/Switch/Switch';
import { mount } from './mount';

/**
 * Switch demo: two on/off switches, both off by default.
 *
 * Switch is internally stateful — it owns its own checked state, and its
 * optional `checked`/`onChange` pair is for a consumer that wants to drive it —
 * so the demo renders both directly with no state of its own to wire up.
 *
 * "Airplane Mode" is aria-disabled: it stays focusable and keeps tabIndex 0 --
 * APG keeps a disabled control reachable so a keyboard user can discover why it
 * is unavailable -- but neither click nor Space/Enter changes its aria-checked.
 *
 * The two switches share this page rather than splitting into a per-state page
 * because apg-qa's switch cases address each by its accessible name, so a
 * second, differently named switch leaves them undisturbed.
 *
 * Addressed by `apg-qa` as `switch-error`.
 */
function SwitchDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Switch</h1>
      <div className="demo-section">
        <Switch label="Notifications" initialChecked={false} />
      </div>
      <div className="demo-section">
        <Switch label="Airplane Mode" initialChecked={false} isDisabled />
      </div>
    </main>
  );
}

mount(<SwitchDemo />);
