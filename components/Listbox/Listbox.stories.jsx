import React, { useState } from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Listbox from './Listbox';

export default {
  title: 'Components/Listbox',
  component: Listbox,
  tags: ['autodocs'],
};

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const Single = (args) => {
  const [value, setValue] = useState(args.value ?? 'apple');
  return <Listbox {...args} value={value} onChange={setValue} />;
};

const Multi = (args) => {
  const [value, setValue] = useState(args.value ?? []);
  return <Listbox {...args} multiple value={value} onChange={setValue} />;
};

export const SingleSelect = {
  render: Single,
  args: { label: 'Pick a fruit', options: fruits },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole('option');

    await step('First option starts selected', async () => {
      await expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    await step('ArrowDown moves focus and selection', async () => {
      options[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      const updated = canvas.getAllByRole('option');
      await expect(updated[1]).toHaveAttribute('aria-selected', 'true');
    });

    await step('End jumps to last option', async () => {
      await userEvent.keyboard('{End}');
      const updated = canvas.getAllByRole('option');
      await expect(updated[updated.length - 1]).toHaveAttribute('aria-selected', 'true');
    });
  },
};

export const MultiSelect = {
  render: Multi,
  args: { label: 'Pick fruits', options: fruits },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('listbox');

    await step('Container is aria-multiselectable=true', async () => {
      await expect(list).toHaveAttribute('aria-multiselectable', 'true');
    });

    await step('Space toggles selection without moving focus', async () => {
      const options = canvas.getAllByRole('option');
      options[0].focus();
      await userEvent.keyboard(' ');
      await expect(canvas.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
    });

    await step('ArrowDown + Space selects multiple items', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard(' ');
      const options = canvas.getAllByRole('option');
      await expect(options[0]).toHaveAttribute('aria-selected', 'true');
      await expect(options[1]).toHaveAttribute('aria-selected', 'true');
    });
  },
};
