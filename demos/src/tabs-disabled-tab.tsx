import React from 'react';
import Tabs from '../../components/Tabs/Tabs';
import { mount } from './mount';

const tabs = [
  { id: '1', label: 'Tab 1', content: <p>Panel 1 content</p> },
  { id: '2', label: 'Tab 2', content: <p>Panel 2 content</p> },
  { id: '3', label: 'Tab 3', content: <p>Panel 3 content</p>, disabled: true },
];

/**
 * Tabs demo, disabled-tab state.
 *
 * Tab 3 is aria-disabled: arrow keys still reach it -- APG keeps a disabled tab
 * in the tablist and in the roving tabindex so it stays discoverable -- but it
 * never becomes selected, by Enter, Space or click.
 *
 * This cannot be a fourth tab on the default page: `tabs-keyboard-nav` arrows
 * onto Tab 3, wraps past it and activates it, and a fourth tab breaks the wrap.
 *
 * Note the QA case activates Tab 3 by keyboard rather than by click, because
 * Playwright treats an aria-disabled element as not enabled and a click times
 * out on any conformant page.
 *
 * Addressed by `apg-qa` as `tabs_disabled_tab_url`.
 */
function TabsDisabledTabDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Tabs — disabled tab</h1>
      <Tabs tabs={tabs} idPrefix="tabs" label="Sample Tabs" />
    </main>
  );
}

mount(<TabsDisabledTabDemo />);
