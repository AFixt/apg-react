import React from 'react';
import { within, userEvent, expect } from '@storybook/test';
import MenuButton from './MenuButton';

export default {
  title: 'Components/MenuButton',
  component: MenuButton,
  tags: ['autodocs'],
};

const items = [
  { id: 'new', label: 'New document', onSelect: () => {} },
  { id: 'open', label: 'Open…', onSelect: () => {} },
  { id: 'save', label: 'Save', onSelect: () => {} },
  { id: 'export', label: 'Export as PDF', onSelect: () => {} },
];

export const Default = {
  args: { label: 'Actions', items },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /actions/i });

    await step('Closed state: aria-expanded=false, aria-haspopup=menu', async () => {
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });

    await step('Click opens the menu and focuses first item', async () => {
      await userEvent.click(button);
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      const menu = canvas.getByRole('menu');
      const firstItem = within(menu).getAllByRole('menuitem')[0];
      await expect(firstItem).toHaveFocus();
    });

    await step('ArrowDown cycles to next menuitem', async () => {
      await userEvent.keyboard('{ArrowDown}');
      const menu = canvas.getByRole('menu');
      const secondItem = within(menu).getAllByRole('menuitem')[1];
      await expect(secondItem).toHaveFocus();
    });

    await step('Escape closes the menu and returns focus to button', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
      await expect(button).toHaveFocus();
    });
  },
};
