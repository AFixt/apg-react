import React from 'react';
import Alert from '../../components/Alert/Alert';
import { mount } from './mount';

/**
 * Alert demo, all three severities at once.
 *
 * The point is that severity is a purely visual concern: all three expose
 * identical semantics, and nothing in the accessibility tree distinguishes an
 * error alert from an info one. An implementer who needs the severity conveyed
 * non-visually has to put it in the message.
 *
 * A separate page rather than extra alerts on `alert.html`, because the default
 * page must keep exactly one alert on load — its dismissal cases rely on
 * `locate: role "alert"` resolving to a single element.
 *
 * Addressed by `apg-qa` as `alert_severities_url`.
 */
function AlertSeveritiesDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Alert — severities</h1>
      <Alert type="info" message="This is an info alert!" />
      <Alert type="warning" message="Warning! Something might go wrong!" />
      <Alert type="error" message="Error! Something went wrong!" />
    </main>
  );
}

mount(<AlertSeveritiesDemo />);
