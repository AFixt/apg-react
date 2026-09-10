import React from 'react';
import Tabs from '../../components/Tabs/Tabs';
import { mount } from './mount';

const tabs = [
  { id: '1', label: 'Tab 1', content: <p>Panel 1 content</p> },
  { id: '2', label: 'Tab 2', content: <p>Panel 2 content</p> },
  { id: '3', label: 'Tab 3', content: <p>Panel 3 content</p> },
];

/**
 * Tabs demo: three tabs using the component's default automatic-activation
 * mode, with labels and panel text matching apg-qa's tabs use cases.
 *
 * The tablist is named "Sample Tabs" -- APG's Tabs pattern asks for a labelled
 * tablist, and it is the name `tabs-aria-state` locates it by. The two
 * per-state tabs pages carry the same name, so a case tightened to locate the
 * tablist by name works against every tabs page rather than only one.
 */
function TabsDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Tabs</h1>
      <Tabs tabs={tabs} idPrefix="tabs" label="Sample Tabs" />
    </main>
  );
}

mount(<TabsDemo />);
