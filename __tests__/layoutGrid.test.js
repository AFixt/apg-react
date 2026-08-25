import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import LayoutGrid from '../components/LayoutGrid/LayoutGrid';

/**
 * APG pattern: Grid — layout variant
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * The layout grid's keyboard contract differs from the data grid's, and the
 * differences are what these tests pin. Arrow keys, Home and End are required.
 * Page Up / Page Down, Control+Home / Control+End, and arrow-key wrapping are
 * marked optional by the APG for this variant — Control+Home / Control+End are
 * *required* for a data grid, which is the sharpest difference between them.
 */
const items = [
  { label: 'One', href: '#one' },
  { label: 'Two', href: '#two' },
  { label: 'Three', href: '#three' },
  { label: 'Four', href: '#four' },
  { label: 'Five', href: '#five' },
  { label: 'Six', href: '#six' },
  { label: 'Seven', href: '#seven' },
  { label: 'Eight', href: '#eight' },
  { label: 'Nine', href: '#nine' },
];

const link = (name) => screen.getByRole('link', { name });

describe('LayoutGrid Component (APG grid pattern, layout variant)', () => {
  test('container has role=grid with row and column counts', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-rowcount', '3');
    expect(grid).toHaveAttribute('aria-colcount', '3');
    expect(grid).toHaveAccessibleName('Patterns');
  });

  test('exposes rows and gridcells, and no columnheader', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getAllByRole('gridcell')).toHaveLength(9);
    // A layout grid has no column titles to expose — that is what separates it
    // from the data grid in components/Grid.
    expect(screen.queryAllByRole('columnheader')).toHaveLength(0);
  });

  test('roving tabindex makes the grid a single tab stop', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    expect(link('One')).toHaveAttribute('tabindex', '0');
    items.slice(1).forEach(({ label }) => {
      expect(link(label)).toHaveAttribute('tabindex', '-1');
    });
  });

  test('arrow keys move focus in all four directions', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    link('One').focus();
    fireEvent.keyDown(link('One'), { key: 'ArrowRight' });
    expect(link('Two')).toHaveFocus();
    fireEvent.keyDown(link('Two'), { key: 'ArrowDown' });
    expect(link('Five')).toHaveFocus();
    fireEvent.keyDown(link('Five'), { key: 'ArrowLeft' });
    expect(link('Four')).toHaveFocus();
    fireEvent.keyDown(link('Four'), { key: 'ArrowUp' });
    expect(link('One')).toHaveFocus();
  });

  test('Home and End move within the row, not the grid', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    link('Five').focus();
    fireEvent.keyDown(link('Five'), { key: 'End' });
    expect(link('Six')).toHaveFocus();
    fireEvent.keyDown(link('Six'), { key: 'Home' });
    expect(link('Four')).toHaveFocus();
  });

  test('Control+Home and Control+End span the whole grid (APG-optional here)', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    link('Five').focus();
    fireEvent.keyDown(link('Five'), { key: 'End', ctrlKey: true });
    expect(link('Nine')).toHaveFocus();
    fireEvent.keyDown(link('Nine'), { key: 'Home', ctrlKey: true });
    expect(link('One')).toHaveFocus();
  });

  test('Page Down and Page Up move by pageSize rows (APG-optional here)', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} pageSize={2} />);
    link('One').focus();
    fireEvent.keyDown(link('One'), { key: 'PageDown' });
    expect(link('Seven')).toHaveFocus();
    fireEvent.keyDown(link('Seven'), { key: 'PageUp' });
    expect(link('One')).toHaveFocus();
  });

  test('arrow keys wrap at row and column edges (APG-optional here)', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    link('Three').focus();
    fireEvent.keyDown(link('Three'), { key: 'ArrowRight' });
    expect(link('Four')).toHaveFocus();
    fireEvent.keyDown(link('Four'), { key: 'ArrowLeft' });
    expect(link('Three')).toHaveFocus();
    link('Seven').focus();
    fireEvent.keyDown(link('Seven'), { key: 'ArrowDown' });
    expect(link('Two')).toHaveFocus();
    // ...and the same at the top edge, in the other direction.
    link('Two').focus();
    fireEvent.keyDown(link('Two'), { key: 'ArrowUp' });
    expect(link('Seven')).toHaveFocus();
  });

  test('Enter is left to the link, not swallowed by the grid', () => {
    render(<LayoutGrid label="Patterns" items={items} columns={3} />);
    link('One').focus();
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    link('One').dispatchEvent(event);
    // The grid must not preventDefault on Enter, or the link stops working.
    expect(event.defaultPrevented).toBe(false);
  });

  test('labelledBy takes precedence over label', () => {
    render(
      <>
        <p id="grid-caption">Browse the demos</p>
        <LayoutGrid labelledBy="grid-caption" label="ignored" items={items} columns={3} />
      </>,
    );
    expect(screen.getByRole('grid')).toHaveAccessibleName('Browse the demos');
  });
});
