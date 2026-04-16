import React from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Switch from './Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export const Off = {
  args: {
    label: 'Enable dark mode',
    initialChecked: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch');

    await step('Starts unchecked', async () => {
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });

    await step('Click toggles to checked', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });

    await step('Space toggles back to unchecked', async () => {
      sw.focus();
      await userEvent.keyboard(' ');
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });
  },
};

export const On = {
  args: {
    label: 'Enable notifications',
    initialChecked: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch');
    await step('Starts checked', async () => {
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });
    await step('Click toggles to unchecked', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });
    await step('Click again restores checked state (matches story name)', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });
  },
};
