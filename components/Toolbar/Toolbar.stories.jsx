import { expect, userEvent, within } from '@storybook/test';
import React from 'react';
import Toolbar from './Toolbar';

export default {
  title: 'Components/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    label: 'Formatting',
    children: [
      <button key="b">Bold</button>,
      <button key="i">Italic</button>,
      <button key="u">Underline</button>,
      <button key="l">Link</button>,
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');

    await step('Only first item is in the tab order', async () => {
      await expect(buttons[0]).toHaveAttribute('tabindex', '0');
      await expect(buttons[1]).toHaveAttribute('tabindex', '-1');
    });

    await step('ArrowRight moves focus to next item', async () => {
      buttons[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(buttons[1]).toHaveFocus();
    });

    await step('End jumps to last item', async () => {
      await userEvent.keyboard('{End}');
      await expect(buttons[buttons.length - 1]).toHaveFocus();
    });
  },
};
