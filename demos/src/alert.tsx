import React, { useState } from 'react';
import Alert from '../../components/Alert/Alert';
import { mount } from './mount';

/**
 * Alert demo: one live alert on load, plus a trigger that inserts another.
 *
 * The APG's alert pattern is about announcement, so the interesting case is the
 * alert that arrives after page load — an assistive technology must announce it
 * without the user moving focus. The trigger button is deliberately outside the
 * live region so activating it is not itself announced.
 */
function AlertDemo(): React.ReactElement {
  const [triggeredCount, setTriggeredCount] = useState(0);

  return (
    <main className="demo-page">
      <h1>Alert</h1>
      <Alert type="info" message="This is an info alert!" />
      <div className="demo-section">
        <button type="button" onClick={() => setTriggeredCount(triggeredCount + 1)}>
          Trigger Alert
        </button>
      </div>
      {triggeredCount > 0 && (
        <Alert key={triggeredCount} type="error" message="New alert inserted" />
      )}
    </main>
  );
}

mount(<AlertDemo />);
