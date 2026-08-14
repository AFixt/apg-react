import React from 'react';
import Meter from '../../components/Meter/Meter';
import { mount } from './mount';

/**
 * Meter demo: a disk-usage meter with a qualitative value description.
 *
 * The value is fixed rather than driven by any interaction, matching the
 * APG's description of the meter pattern as a non-interactive scalar
 * measurement with no keyboard interaction model.
 */
function MeterDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Meter</h1>
      <Meter
        value={75}
        minValue={0}
        maxValue={100}
        label="Disk usage"
        userFriendlyText={(value) => (value >= 70 ? 'High' : value >= 30 ? 'Medium' : 'Low')}
      />
    </main>
  );
}

mount(<MeterDemo />);
