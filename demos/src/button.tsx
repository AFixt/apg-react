import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import { mount } from './mount';

/**
 * Button demo: a standard action button, a toggle button, and a disabled button.
 *
 * The Print button owns a local dialog-open flag so click and keyboard
 * activation (Enter, Space) both have an observable, reversible effect: the
 * "Print dialog opened" text and a Close button that clears the flag again.
 * The Mute button demonstrates the toggle variant — the component owns
 * `aria-pressed` internally, so the demo only supplies the initial state and
 * mirrors it in a status line for sighted users.
 *
 * Submit is permanently unavailable, and demonstrates `disabledStyle="aria"`
 * rather than the `'native'` default. The APG's reasoning is that a natively
 * disabled button leaves the tab order and the accessibility tree's interactive
 * surface, so a keyboard or screen-reader user never discovers the control
 * exists — let alone why it is unavailable. The aria variant keeps it focusable
 * and reports `aria-disabled="true"`, while the component still suppresses the
 * action.
 *
 * Keeping it reachable is only useful if the reason is reachable too, so the
 * explanation is associated with the button through `ariaDescribedby` rather
 * than left as nearby text a screen-reader user would have to go hunting for.
 */
function ButtonDemo(): React.ReactElement {
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <main className="demo-page">
      <h1>Button</h1>
      <div className="demo-section">
        <Button label="Print" action={() => setPrintDialogOpen(true)} />
        {printDialogOpen && (
          <div className="demo-section">
            <p>Print dialog opened</p>
            <Button label="Close" action={() => setPrintDialogOpen(false)} />
          </div>
        )}
      </div>
      <div className="demo-section">
        <Button
          label="Mute"
          isToggleButton
          toggleState={muted}
          action={() => setMuted((previous) => !previous)}
        />
        <p>{muted ? 'Muted' : 'Unmuted'}</p>
      </div>
      <div className="demo-section">
        <Button
          label="Submit"
          isDisabled
          disabledStyle="aria"
          ariaDescribedby="submit-unavailable"
          action={() => setFormSubmitted(true)}
        />
        <p id="submit-unavailable">Complete every required field before submitting.</p>
        {formSubmitted && <p>Form submitted</p>}
      </div>
    </main>
  );
}

mount(<ButtonDemo />);
