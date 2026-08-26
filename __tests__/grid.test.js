import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Grid from '../components/Grid/Grid';

/**
 * APG pattern: Grid
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
];
const rows = [
  { id: 1, name: 'Ada', role: 'Mathematician' },
  { id: 2, name: 'Alan', role: 'Cryptanalyst' },
  { id: 3, name: 'Grace', role: 'Scientist' },
];

describe('Grid Component (APG grid pattern)', () => {
  test('container has role=grid and aria-row/colcount', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-rowcount', '4');
    expect(grid).toHaveAttribute('aria-colcount', '2');
    expect(grid).toHaveAttribute('aria-label', 'People');
  });

  test('renders columnheader cells in the header row', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(columns.length);
  });

  test('renders gridcell cells for data rows', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    expect(screen.getAllByRole('gridcell')).toHaveLength(columns.length * rows.length);
  });

  test('only one cell is in the tab order', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const allCells = [...screen.getAllByRole('columnheader'), ...screen.getAllByRole('gridcell')];
    const tabbable = allCells.filter((c) => c.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
  });

  test('ArrowRight moves focus to next cell in row', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const headers = screen.getAllByRole('columnheader');
    headers[0].focus();
    fireEvent.keyDown(headers[0], { key: 'ArrowRight' });
    expect(headers[1]).toHaveFocus();
  });

  test('ArrowDown moves focus into data row', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const headers = screen.getAllByRole('columnheader');
    headers[0].focus();
    fireEvent.keyDown(headers[0], { key: 'ArrowDown' });
    const cells = screen.getAllByRole('gridcell');
    expect(cells[0]).toHaveFocus();
  });

  test('End moves to last cell in current row', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const headers = screen.getAllByRole('columnheader');
    headers[0].focus();
    fireEvent.keyDown(headers[0], { key: 'End' });
    expect(headers[headers.length - 1]).toHaveFocus();
  });

  test('Ctrl+Home jumps to first header cell', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const cells = screen.getAllByRole('gridcell');
    cells[cells.length - 1].focus();
    fireEvent.keyDown(cells[cells.length - 1], { key: 'Home', ctrlKey: true });
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveFocus();
  });

  test('Ctrl+End jumps to last gridcell', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const headers = screen.getAllByRole('columnheader');
    headers[0].focus();
    fireEvent.keyDown(headers[0], { key: 'End', ctrlKey: true });
    const cells = screen.getAllByRole('gridcell');
    expect(cells[cells.length - 1]).toHaveFocus();
  });

  test('each cell has aria-colindex and rows have aria-rowindex', () => {
    render(<Grid label="People" columns={columns} rows={rows} />);
    const firstCell = screen.getAllByRole('columnheader')[0];
    expect(firstCell).toHaveAttribute('aria-colindex', '1');
    const allRows = screen.getAllByRole('row');
    expect(allRows[0]).toHaveAttribute('aria-rowindex', '1');
  });
  // --- Regression coverage -------------------------------------------------

  describe('row headers (#169)', () => {
    const metrics = [
      { key: 'metric', label: 'Metric' },
      { key: 'q1', label: 'Q1' },
      { key: 'q2', label: 'Q2' },
    ];
    const data = [
      { id: 'revenue', metric: 'Revenue', q1: 100, q2: 200 },
      { id: 'costs', metric: 'Costs', q1: 60, q2: 70 },
    ];

    test('no rowheader is rendered when rowHeaderKey is omitted', () => {
      render(<Grid label="Quarterly Report" columns={metrics} rows={data} />);
      expect(screen.queryAllByRole('rowheader')).toHaveLength(0);
    });

    test('the named column renders role=rowheader', () => {
      render(<Grid label="Quarterly Report" columns={metrics} rows={data} rowHeaderKey="metric" />);

      const headers = screen.getAllByRole('rowheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Revenue');
      expect(headers[1]).toHaveTextContent('Costs');
    });

    test('a rowheader is locatable by role and name', () => {
      render(<Grid label="Quarterly Report" columns={metrics} rows={data} rowHeaderKey="metric" />);
      expect(screen.getByRole('rowheader', { name: 'Revenue' })).toBeInTheDocument();
    });

    test('column headers are unaffected', () => {
      render(<Grid label="Quarterly Report" columns={metrics} rows={data} rowHeaderKey="metric" />);
      expect(screen.getByRole('columnheader', { name: 'Q1' })).toBeInTheDocument();
    });

    test('the other cells stay gridcells', () => {
      render(<Grid label="Quarterly Report" columns={metrics} rows={data} rowHeaderKey="metric" />);

      const cells = screen.getAllByRole('gridcell');
      expect(cells).toHaveLength(4);
      cells.forEach((cell) => expect(cell).not.toHaveTextContent('Revenue'));
    });

    test('the rowheader stays in the roving tabindex', () => {
      render(<Grid label="Quarterly Report" columns={metrics} rows={data} rowHeaderKey="metric" />);
      const header = screen.getByRole('rowheader', { name: 'Revenue' });

      fireEvent.focus(header);
      expect(header).toHaveAttribute('tabindex', '0');
    });
  });

  describe('editable cells (#170)', () => {
    const cell = (name) => screen.getByRole('gridcell', { name });

    const renderEditable = (props = {}) =>
      render(<Grid label="People" columns={columns} rows={rows} editable {...props} />);

    test('cells are not editable by default', () => {
      render(<Grid label="People" columns={columns} rows={rows} />);
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('F2 puts an editable cell into edit mode', () => {
      renderEditable();
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Ada');
    });

    test('Enter also enters edit mode', () => {
      renderEditable();
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'Enter' });

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('Enter commits and returns to navigation mode', () => {
      renderEditable();
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Ada L' } });
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByRole('gridcell', { name: 'Ada L' })).toBeInTheDocument();
    });

    test('Escape cancels and restores the previous value', () => {
      renderEditable();
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'discarded' } });
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByRole('gridcell', { name: 'Ada' })).toBeInTheDocument();
      expect(screen.queryByRole('gridcell', { name: 'discarded' })).not.toBeInTheDocument();
    });

    test('arrow keys move the caret rather than the focused cell', () => {
      renderEditable();
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });
      const input = screen.getByRole('textbox');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      // Still editing the same cell: the grid's navigation handler must not
      // have seen either key. This is the part implementations most often miss.
      expect(screen.getByRole('textbox')).toBe(input);
      expect(input).toHaveValue('Ada');
    });

    test('onCellChange reports the committed value', () => {
      const onCellChange = jest.fn();
      renderEditable({ onCellChange });
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Ada L' } });
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

      expect(onCellChange).toHaveBeenCalledWith(0, 'name', 'Ada L');
    });

    test('onCellChange is not called when the edit is cancelled', () => {
      const onCellChange = jest.fn();
      renderEditable({ onCellChange });
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });

      expect(onCellChange).not.toHaveBeenCalled();
    });

    test('a column can opt in on its own', () => {
      const mixed = [
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role', editable: true },
      ];
      render(<Grid label="People" columns={mixed} rows={rows} />);

      fireEvent.keyDown(cell('Ada'), { key: 'F2' });
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

      fireEvent.keyDown(cell('Mathematician'), { key: 'F2' });
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('a column can opt out of a grid-wide editable', () => {
      const mixed = [
        { key: 'name', label: 'Name', editable: false },
        { key: 'role', label: 'Role' },
      ];
      render(<Grid label="People" columns={mixed} rows={rows} editable />);

      fireEvent.keyDown(cell('Ada'), { key: 'F2' });
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('a row header is never editable', () => {
      const metrics = [
        { key: 'metric', label: 'Metric' },
        { key: 'q1', label: 'Q1' },
      ];
      const data = [{ id: 'revenue', metric: 'Revenue', q1: 100 }];
      render(<Grid label="Report" columns={metrics} rows={data} rowHeaderKey="metric" editable />);

      fireEvent.keyDown(screen.getByRole('rowheader', { name: 'Revenue' }), { key: 'F2' });

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('navigation still works after an edit', () => {
      renderEditable();
      const target = cell('Ada');

      fireEvent.focus(target);
      fireEvent.keyDown(target, { key: 'F2' });
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
      fireEvent.keyDown(target, { key: 'ArrowRight' });

      expect(screen.getByRole('gridcell', { name: 'Mathematician' })).toHaveAttribute(
        'tabindex',
        '0',
      );
    });

    test('the edit field is named after its column and row', () => {
      const metrics = [
        { key: 'metric', label: 'Metric' },
        { key: 'q1', label: 'Q1' },
      ];
      const data = [{ id: 'revenue', metric: 'Revenue', q1: 100 }];
      render(<Grid label="Report" columns={metrics} rows={data} rowHeaderKey="metric" editable />);

      fireEvent.keyDown(screen.getByRole('gridcell', { name: '100' }), { key: 'F2' });

      expect(screen.getByRole('textbox')).toHaveAccessibleName('Q1 Revenue');
    });
  });
});
