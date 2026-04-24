import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import MenuButton from '../components/MenuButton/MenuButton';

/**
 * APG pattern: Menu Button
 * https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 */
const buildItems = (onSelect = jest.fn()) => [
  { id: 'one', label: 'One', onSelect },
  { id: 'two', label: 'Two', onSelect },
  { id: 'three', label: 'Three', onSelect },
];

describe('MenuButton Component (APG menu button pattern)', () => {
  test('button has aria-haspopup=menu and aria-expanded toggle', () => {
    render(<MenuButton label="Open" items={buildItems()} />);
    const button = screen.getByRole('button', { name: /open/i });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('Enter on the button opens the menu and focuses first item', () => {
    render(<MenuButton label="Open" items={buildItems()} />);
    const button = screen.getByRole('button', { name: /open/i });
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    const items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveFocus();
  });

  test('ArrowUp on the button opens menu with last item focused', () => {
    render(<MenuButton label="Open" items={buildItems()} />);
    const button = screen.getByRole('button', { name: /open/i });
    button.focus();
    fireEvent.keyDown(button, { key: 'ArrowUp' });
    const items = screen.getAllByRole('menuitem');
    expect(items[items.length - 1]).toHaveFocus();
  });

  test('ArrowDown in menu cycles items (wraps)', () => {
    render(<MenuButton label="Open" items={buildItems()} />);
    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    let items = screen.getAllByRole('menuitem');
    fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    items = screen.getAllByRole('menuitem');
    expect(items[1]).toHaveFocus();
    fireEvent.keyDown(items[1], { key: 'ArrowDown' });
    fireEvent.keyDown(items[2], { key: 'ArrowDown' });
    items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveFocus();
  });

  test('Home / End jump to first / last item', () => {
    render(<MenuButton label="Open" items={buildItems()} />);
    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    let items = screen.getAllByRole('menuitem');
    fireEvent.keyDown(items[0], { key: 'End' });
    items = screen.getAllByRole('menuitem');
    expect(items[items.length - 1]).toHaveFocus();
    fireEvent.keyDown(items[items.length - 1], { key: 'Home' });
    items = screen.getAllByRole('menuitem');
    expect(items[0]).toHaveFocus();
  });

  test('Enter activates item, invokes onSelect, closes menu, restores focus', () => {
    const onSelect = jest.fn();
    render(<MenuButton label="Open" items={buildItems(onSelect)} />);
    const button = screen.getByRole('button', { name: /open/i });
    fireEvent.click(button);
    const first = screen.getAllByRole('menuitem')[0];
    fireEvent.keyDown(first, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  test('Escape closes menu and returns focus to the button', () => {
    render(<MenuButton label="Open" items={buildItems()} />);
    const button = screen.getByRole('button', { name: /open/i });
    fireEvent.click(button);
    const first = screen.getAllByRole('menuitem')[0];
    fireEvent.keyDown(first, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });
});
