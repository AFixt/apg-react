import React from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Grid from './Grid';

export default {
  title: 'Components/Grid',
  component: Grid,
  tags: ['autodocs'],
};

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'city', label: 'City' },
];

const rows = [
  { id: 1, name: 'Ada Lovelace', role: 'Mathematician', city: 'London' },
  { id: 2, name: 'Alan Turing', role: 'Cryptanalyst', city: 'Manchester' },
  { id: 3, name: 'Grace Hopper', role: 'Computer Scientist', city: 'New York' },
  { id: 4, name: 'Margaret Hamilton', role: 'Software Engineer', city: 'Boston' },
];

export const Default = {
  args: {
    label: 'Notable engineers',
    showCaption: true,
    columns,
    rows,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Container has role=grid with row/col counts', async () => {
      const grid = canvas.getByRole('grid');
      await expect(grid).toHaveAttribute('aria-rowcount', String(rows.length + 1));
      await expect(grid).toHaveAttribute('aria-colcount', String(columns.length));
    });

    await step('First header cell is focusable', async () => {
      const headers = canvas.getAllByRole('columnheader');
      headers[0].focus();
      await expect(headers[0]).toHaveFocus();
    });

    await step('ArrowRight moves focus to next cell', async () => {
      await userEvent.keyboard('{ArrowRight}');
      const headers = canvas.getAllByRole('columnheader');
      await expect(headers[1]).toHaveFocus();
    });

    await step('ArrowDown moves into data rows', async () => {
      await userEvent.keyboard('{ArrowDown}');
      const cells = canvas.getAllByRole('gridcell');
      // focus is now in first data row, second column
      await expect(cells.some((c) => c === document.activeElement)).toBe(true);
    });
  },
};
