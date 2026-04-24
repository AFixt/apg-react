import { expect, userEvent, within } from '@storybook/test';
import TreeView from './TreeView';

export default {
  title: 'Components/TreeView',
  component: TreeView,
  tags: ['autodocs'],
};

const nodes = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.jsx' },
          { id: 'modal', label: 'ModalDialog.jsx' },
        ],
      },
      { id: 'index', label: 'index.js' },
    ],
  },
  {
    id: 'tests',
    label: '__tests__',
    children: [
      { id: 'button-test', label: 'button.test.js' },
      { id: 'modal-test', label: 'modalDialog.test.js' },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

export const Default = {
  args: { label: 'Project files', nodes, defaultExpanded: ['src'] },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole('tree');
    await expect(tree).toHaveAttribute('aria-label', 'Project files');

    await step('First treeitem is focusable', async () => {
      const items = canvas.getAllByRole('treeitem');
      items[0].focus();
      await expect(items[0]).toHaveFocus();
    });

    await step('ArrowRight on expanded parent moves focus to first child', async () => {
      await userEvent.keyboard('{ArrowRight}');
      const items = canvas.getAllByRole('treeitem');
      await expect(items[1]).toHaveFocus();
    });

    await step('ArrowLeft on child focuses parent', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      const items = canvas.getAllByRole('treeitem');
      await expect(items[0]).toHaveFocus();
    });
  },
};
