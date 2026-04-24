import { expect, userEvent, within } from '@storybook/test';
import TreeGrid from './TreeGrid';

export default {
  title: 'Components/TreeGrid',
  component: TreeGrid,
  tags: ['autodocs'],
};

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
  { key: 'modified', label: 'Modified' },
];

const rows = [
  {
    id: 'src',
    name: 'src',
    size: '—',
    modified: '2026-04-10',
    children: [
      { id: 'index', name: 'index.js', size: '1.2 KB', modified: '2026-04-11' },
      {
        id: 'components',
        name: 'components',
        size: '—',
        modified: '2026-04-12',
        children: [
          { id: 'button', name: 'Button.jsx', size: '3.4 KB', modified: '2026-04-13' },
          { id: 'modal', name: 'ModalDialog.jsx', size: '5.1 KB', modified: '2026-04-14' },
        ],
      },
    ],
  },
  { id: 'pkg', name: 'package.json', size: '2.0 KB', modified: '2026-04-09' },
];

export const Default = {
  args: {
    label: 'Project files',
    columns,
    rows,
    defaultExpanded: ['src'],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Container has role=treegrid', async () => {
      const grid = canvas.getByRole('treegrid');
      await expect(grid).toHaveAttribute('aria-label', 'Project files');
    });

    await step('Data rows expose aria-level / posinset / setsize', async () => {
      const allRows = canvas.getAllByRole('row');
      // allRows[0] is the header; allRows[1] is first data row (src)
      await expect(allRows[1]).toHaveAttribute('aria-level', '1');
      await expect(allRows[1]).toHaveAttribute('aria-expanded', 'true');
    });

    await step('ArrowDown moves focus to next row (same column)', async () => {
      const cells = canvas.getAllByRole('gridcell');
      cells[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      const updated = canvas.getAllByRole('gridcell');
      await expect(updated[3]).toHaveFocus();
    });

    await step('ArrowLeft on first cell of expanded row collapses it', async () => {
      const cells = canvas.getAllByRole('gridcell');
      cells[0].focus();
      await userEvent.keyboard('{ArrowLeft}');
      const allRows = canvas.getAllByRole('row');
      await expect(allRows[1]).toHaveAttribute('aria-expanded', 'false');
    });
  },
};
