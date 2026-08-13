import React from 'react';
import Tooltip from '../../components/Tooltip/Tooltip';
import { mount } from './mount';

const placements = ['top', 'right', 'bottom', 'left'] as const;

/**
 * Tooltip demo: one trigger per placement.
 *
 * Every trigger uses the same ARIA contract — `role="tooltip"` on the bubble and
 * `aria-describedby` on the trigger while it is shown — so the four placements
 * exist to prove that positioning is presentation only and changes nothing about
 * what a screen reader is told.
 */
function TooltipDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Tooltip</h1>
      {placements.map((placement) => (
        <div className="demo-section" key={placement}>
          <Tooltip text={`Tooltip on the ${placement}`} position={placement}>
            <button type="button">{`Hover over me (${placement})!`}</button>
          </Tooltip>
        </div>
      ))}
    </main>
  );
}

mount(<TooltipDemo />);
