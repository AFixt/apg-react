import React, { useEffect, useState } from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Checkbox from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

const Template = (args) => {
  // Preserve null as a legitimate tri-state value; only fall back to false
  // when args.checked is undefined.
  const initial = args.checked === undefined ? false : args.checked;
  const [checked, setChecked] = useState(initial);

  useEffect(() => {
    setChecked(args.checked === undefined ? false : args.checked);
  }, [args.checked]);

  return <Checkbox {...args} checked={checked} onChange={setChecked} />;
};

export const Unchecked = {
  render: Template,
  args: {
    label: 'Subscribe to newsletter',
    checked: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');

    await step('Starts unchecked', async () => {
      await expect(checkbox).not.toBeChecked();
    });

    await step('Click toggles to checked', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });
  },
};

export const Checked = {
  render: Template,
  args: {
    label: 'I accept the terms',
    checked: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await step('Starts checked', async () => {
      await expect(checkbox).toBeChecked();
    });
    await step('Click toggles to unchecked', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
    });
    await step('Click again restores checked state (matches story name)', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });
  },
};

export const TriState = {
  render: Template,
  args: {
    label: 'Select all',
    checked: null,
    isTriState: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await step('Starts in mixed state', async () => {
      await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      await expect(checkbox.indeterminate).toBe(true);
    });
    await step('Click advances tri-state', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  },
};
