import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import Menubar from '../components/Menubar/Menubar';

/**
 * APG pattern: Menubar
 * https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 */
const menus = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New', onSelect: jest.fn() },
      { id: 'open', label: 'Open', onSelect: jest.fn() },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', onSelect: jest.fn() },
      { id: 'redo', label: 'Redo', onSelect: jest.fn() },
    ],
  },
];

describe('Menubar Component (APG menubar pattern)', () => {
  test('container has role=menubar and aria-orientation=horizontal', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
    expect(bar).toHaveAttribute('aria-label', 'Main');
  });

  test('top-level items have aria-haspopup=menu and aria-expanded=false', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');
    items.forEach((item) => {
      expect(item).toHaveAttribute('aria-haspopup', 'menu');
      expect(item).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('only active top-level item is in the tab order', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');
    expect(items[0]).toHaveAttribute('tabindex', '0');
    expect(items[1]).toHaveAttribute('tabindex', '-1');
  });

  test('ArrowRight cycles through menubar items', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'ArrowRight' });
    expect(items[1]).toHaveFocus();
  });

  test('ArrowDown opens submenu and focuses first item', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    expect(items[0]).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menu');
    const menuItems = within(menu).getAllByRole('menuitem');
    expect(menuItems[0]).toHaveFocus();
  });

  test('ArrowUp opens submenu focused on last item', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'ArrowUp' });
    const menu = screen.getByRole('menu');
    const menuItems = within(menu).getAllByRole('menuitem');
    expect(menuItems[menuItems.length - 1]).toHaveFocus();
  });

  test('Escape closes submenu and returns focus to parent menubar item', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'Enter' });
    const menu = screen.getByRole('menu');
    const firstMenuItem = within(menu).getAllByRole('menuitem')[0];
    fireEvent.keyDown(firstMenuItem, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(items[0]).toHaveFocus();
  });

  test('Enter on menu item activates onSelect and closes menu', () => {
    const onSelect = jest.fn();
    const customMenus = [
      {
        id: 'x',
        label: 'X',
        items: [{ id: 'a', label: 'A', onSelect }],
      },
    ];
    render(<Menubar label="Main" menus={customMenus} />);
    const bar = screen.getByRole('menubar');
    const top = within(bar).getAllByRole('menuitem')[0];
    fireEvent.keyDown(top, { key: 'Enter' });
    const menu = screen.getByRole('menu');
    const first = within(menu).getAllByRole('menuitem')[0];
    fireEvent.keyDown(first, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('ArrowRight inside open submenu moves to next top menu and opens it', () => {
    render(<Menubar label="Main" menus={menus} />);
    const bar = screen.getByRole('menubar');
    const top = within(bar).getAllByRole('menuitem');
    fireEvent.keyDown(top[0], { key: 'Enter' });
    const menu = screen.getByRole('menu');
    const first = within(menu).getAllByRole('menuitem')[0];
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(top[1]).toHaveAttribute('aria-expanded', 'true');
  });
});
