import React from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Disclosure from './Disclosure';

export default {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    title: 'Show more details',
    children: 'Here is additional content that was hidden until the user chose to disclose it.',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await step('Starts collapsed', async () => {
      await expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Click expands the content', async () => {
      await userEvent.click(button);
      await expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    await step('Click again collapses the content', async () => {
      await userEvent.click(button);
      await expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  },
};
