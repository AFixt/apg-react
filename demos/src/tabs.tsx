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
 */
function TabsDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Tabs</h1>
      <Tabs tabs={tabs} idPrefix="tabs" />
    </main>
  );
}

mount(<TabsDemo />);
