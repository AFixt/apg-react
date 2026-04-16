import React from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Menubar from './Menubar';

export default {
  title: 'Components/Menubar',
  component: Menubar,
  tags: ['autodocs'],
};

const menus = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New', onSelect: () => {} },
      { id: 'open', label: 'Open…', onSelect: () => {} },
      { id: 'save', label: 'Save', onSelect: () => {} },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', onSelect: () => {} },
      { id: 'redo', label: 'Redo', onSelect: () => {} },
      { id: 'cut', label: 'Cut', onSelect: () => {} },
      { id: 'copy', label: 'Copy', onSelect: () => {} },
      { id: 'paste', label: 'Paste', onSelect: () => {} },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'zoom-in', label: 'Zoom in', onSelect: () => {} },
      { id: 'zoom-out', label: 'Zoom out', onSelect: () => {} },
    ],
  },
];

export const Default = {
  args: { label: 'Main menu', menus },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');

    await step('Menubar has role=menubar and aria-orientation=horizontal', async () => {
      await expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
    });

    await step('ArrowRight cycles among menubar items', async () => {
      items[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(items[1]).toHaveFocus();
    });

    await step('ArrowDown opens submenu and focuses first item', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(items[1]).toHaveAttribute('aria-expanded', 'true');
      const menu = canvas.getByRole('menu');
      const firstItem = within(menu).getAllByRole('menuitem')[0];
      await expect(firstItem).toHaveFocus();
    });

    await step('Escape closes submenu and restores focus to menubar item', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
      await expect(items[1]).toHaveFocus();
    });
  },
};
