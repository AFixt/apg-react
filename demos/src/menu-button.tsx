import React from 'react';
import MenuButton from '../../components/MenuButton/MenuButton';
import { mount } from './mount';

const items = [
  { id: 'new', label: 'New' },
  { id: 'open', label: 'Open' },
  { id: 'save', label: 'Save' },
  { id: 'exit', label: 'Exit' },
];

/**
 * MenuButton demo: a single "Actions" menu button with four items, matching
 * the labels apg-qa's menu-button use cases expect.
 */
function MenuButtonDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Menu Button</h1>
      <MenuButton label="Actions" items={items} />
    </main>
  );
}

mount(<MenuButtonDemo />);
