import React from 'react';
import Switch from '../../components/Switch/Switch';
import { mount } from './mount';

/**
 * Switch demo, disabled state.
 *
 * "Airplane Mode" is aria-disabled: it stays focusable and keeps tabIndex 0 --
 * APG keeps a disabled control reachable so a keyboard user can discover why it
 * is unavailable -- but neither click nor Space/Enter changes its aria-checked.
 *
 * This cannot be a second switch on `switch.html`. That page's downstream specs
 * address the switch with unscoped selectors -- `[role=switch]`,
 * `.switch-label-text`, `.switch-control .switch` -- rather than by accessible
 * name, so a second switch of any name breaks them: Playwright's strict mode
 * throws on the two matches, and Cypress reads `.switch-label-text` as the
 * concatenation "NotificationsAirplane Mode". Measured on the six runner repos,
 * apg-playwright went 8/8 to 2/8 and apg-cypress to 6/8 before this page split
 * the state out. See `demos/README.md`.
 *
 * Addressed by `apg-qa` as `switch_disabled_url`.
 */
function SwitchDisabledDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Switch — disabled switch</h1>
      <Switch label="Airplane Mode" initialChecked={false} isDisabled />
    </main>
  );
}

mount(<SwitchDisabledDemo />);
