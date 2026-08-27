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
 * The tablist is named "Sample Tabs" -- APG requires a name once a page has
 * more than one tablist, and the QA case locates it by that name.
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
