import React from 'react';
import Tabs from '../../components/Tabs/Tabs';
import { mount } from './mount';

const tabs = [
  { id: '1', label: 'Tab 1', content: <p>Panel 1 content</p> },
  { id: '2', label: 'Tab 2', content: <p>Panel 2 content</p> },
  { id: '3', label: 'Tab 3', content: <p>Panel 3 content</p> },
];

/**
 * Tabs demo, manual-activation state.
 *
 * Arrow keys move focus without changing selection; Enter or Space is what
 * activates. That is the opposite of the default page, whose cases assert
 * selection follows focus, so the two genuinely cannot share a URL.
 *
 * The tablist is named "Sample Tabs" -- APG's Tabs pattern asks for a labelled
 * tablist, and it is the name the QA cases locate it by. The default and
 * disabled-tab pages carry the same name, so a case that locates the tablist by
 * name holds against whichever tabs page it is pointed at.
 *
 * Addressed by `apg-qa` as `tabs_manual_url`.
 */
function TabsManualDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Tabs — manual activation</h1>
      <Tabs tabs={tabs} idPrefix="tabs" activation="manual" label="Sample Tabs" />
    </main>
  );
}

mount(<TabsManualDemo />);
