import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import TreeGrid from '../components/TreeGrid/TreeGrid';

/**
 * APG pattern: TreeGrid
 * https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 */
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
];

const rows = [
  {
    id: 'a',
    name: 'A',
    size: '1',
    children: [
      { id: 'a1', name: 'A1', size: '2' },
      { id: 'a2', name: 'A2', size: '3' },
    ],
  },
  { id: 'b', name: 'B', size: '4' },
];

describe('TreeGrid Component (APG treegrid pattern)', () => {
  test('container has role=treegrid', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} />);
    expect(screen.getByRole('treegrid')).toBeInTheDocument();
  });

  test('data rows expose aria-level / posinset / setsize', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);
    const dataRows = screen.getAllByRole('row').slice(1); // skip header
    expect(dataRows[0]).toHaveAttribute('aria-level', '1');
    expect(dataRows[0]).toHaveAttribute('aria-posinset', '1');
    expect(dataRows[0]).toHaveAttribute('aria-setsize', '2');
    expect(dataRows[0]).toHaveAttribute('aria-expanded', 'true');
    // Children inherit level 2
    expect(dataRows[1]).toHaveAttribute('aria-level', '2');
  });

  test('only one cell is in the tab order', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} />);
    const allCells = [...screen.getAllByRole('columnheader'), ...screen.getAllByRole('gridcell')];
    const tabbable = allCells.filter((c) => c.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
  });

  test('ArrowRight on first cell of collapsed row expands it', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} />);
    const cells = screen.getAllByRole('gridcell');
    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
    const dataRows = screen.getAllByRole('row').slice(1);
    expect(dataRows[0]).toHaveAttribute('aria-expanded', 'true');
  });

  test('ArrowLeft on first cell of expanded row collapses it', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);
    const cells = screen.getAllByRole('gridcell');
    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowLeft' });
    const dataRows = screen.getAllByRole('row').slice(1);
    expect(dataRows[0]).toHaveAttribute('aria-expanded', 'false');
  });

  test('ArrowDown moves focus to next row in same column', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);
    const cells = screen.getAllByRole('gridcell');
    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowDown' });
    // first cell of row B (or child) — just assert focus moved
    expect(cells[0]).not.toHaveFocus();
  });

  test("ArrowLeft on child row's first cell focuses parent row", () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);
    const cells = screen.getAllByRole('gridcell');
    // cell at index 2 is first cell of first child row (row a1)
    cells[2].focus();
    fireEvent.keyDown(cells[2], { key: 'ArrowLeft' });
    // Focus should move to first cell of row A (parent)
    expect(cells[0]).toHaveFocus();
  });

  test('End moves focus to last cell in current row', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} />);
    const cells = screen.getAllByRole('gridcell');
    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'End' });
    expect(cells[1]).toHaveFocus();
  });

  test('Ctrl+Home jumps to first cell of first row', () => {
    render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);
    const cells = screen.getAllByRole('gridcell');
    cells[cells.length - 1].focus();
    fireEvent.keyDown(cells[cells.length - 1], {
      key: 'Home',
      ctrlKey: true,
    });
    expect(cells[0]).toHaveFocus();
  });
  // --- Regression coverage -------------------------------------------------

  describe('Right Arrow moves one cell right (#163)', () => {
    const cell = (r, c) => document.querySelector(`[data-row="${r}"][data-col="${c}"]`);

    const focusCell = (r, c) => {
      const el = cell(r, c);
      fireEvent.focus(el);
      return el;
    };

    test('Right Arrow on the first cell of a collapsed parent row expands it', () => {
      render(<TreeGrid label="Files" columns={columns} rows={rows} />);
      const dataRows = () => screen.getAllByRole('row').slice(1);

      expect(dataRows()[0]).toHaveAttribute('aria-expanded', 'false');

      focusCell(0, 0);
      fireEvent.keyDown(cell(0, 0), { key: 'ArrowRight' });

      expect(dataRows()[0]).toHaveAttribute('aria-expanded', 'true');
    });

    test('Right Arrow on the first cell of an expanded parent row moves one cell right', () => {
      render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);

      focusCell(0, 0);
      fireEvent.keyDown(cell(0, 0), { key: 'ArrowRight' });

      // The second cell of the *same* row, not the first cell of the child row.
      expect(cell(0, 1)).toHaveAttribute('tabindex', '0');
      expect(cell(0, 1)).toHaveTextContent('1');
      expect(cell(1, 0)).toHaveAttribute('tabindex', '-1');
    });

    test('every cell of an expanded parent row is reachable by Right Arrow alone', () => {
      render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);

      focusCell(0, 0);
      const visited = [cell(0, 0).dataset.col];

      for (let i = 0; i < columns.length - 1; i += 1) {
        const from = document.querySelector('[data-row][data-col][tabindex="0"]');
        fireEvent.keyDown(from, { key: 'ArrowRight' });
        const landed = document.querySelector('[data-row][data-col][tabindex="0"]');
        // Right Arrow must never leave the row it started on.
        expect(landed.dataset.row).toBe('0');
        visited.push(landed.dataset.col);
      }

      // Every column of the parent row, reached from its first cell using
      // Right Arrow alone. Before the fix, column 1 ("Size") was unreachable.
      expect(visited).toEqual(['0', '1']);
      expect(cell(0, 1)).toHaveTextContent('1');
    });

    test('Right Arrow on the right-most cell does not move or wrap', () => {
      render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);

      focusCell(0, 1);
      fireEvent.keyDown(cell(0, 1), { key: 'ArrowRight' });

      expect(cell(0, 1)).toHaveAttribute('tabindex', '0');
      expect(cell(1, 0)).toHaveAttribute('tabindex', '-1');
      expect(cell(0, 0)).toHaveAttribute('tabindex', '-1');
    });

    test('child rows remain reachable by Down Arrow', () => {
      render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);

      focusCell(0, 0);
      fireEvent.keyDown(cell(0, 0), { key: 'ArrowDown' });

      expect(cell(1, 0)).toHaveAttribute('tabindex', '0');
      expect(cell(1, 0)).toHaveTextContent('A1');
    });

    test('Left Arrow still collapses an expanded row from its first cell', () => {
      render(<TreeGrid label="Files" columns={columns} rows={rows} defaultExpanded={['a']} />);
      const dataRows = () => screen.getAllByRole('row').slice(1);

      focusCell(0, 0);
      fireEvent.keyDown(cell(0, 0), { key: 'ArrowLeft' });

      expect(dataRows()[0]).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
