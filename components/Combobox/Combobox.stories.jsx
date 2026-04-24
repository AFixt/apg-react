import { expect, userEvent, within } from '@storybook/test';
import React, { useState } from 'react';
import Combobox from './Combobox';

export default {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
};

const options = [
  { value: 'af', label: 'Afghanistan' },
  { value: 'al', label: 'Albania' },
  { value: 'dz', label: 'Algeria' },
  { value: 'ad', label: 'Andorra' },
  { value: 'ao', label: 'Angola' },
  { value: 'ar', label: 'Argentina' },
  { value: 'au', label: 'Australia' },
  { value: 'at', label: 'Austria' },
];

const Template = (args) => {
  const [value, setValue] = useState(args.value ?? '');
  return <Combobox {...args} options={options} value={value} onChange={setValue} />;
};

export const AutocompleteList = {
  render: Template,
  args: {
    label: 'Country (filters as you type)',
    autocomplete: 'list',
    placeholder: 'Type to search…',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await step('Input has role=combobox with aria-autocomplete=list', async () => {
      await expect(input).toHaveAttribute('aria-autocomplete', 'list');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    await step('Typing opens popup and filters options', async () => {
      await userEvent.type(input, 'a');
      await expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    await step('ArrowDown sets aria-activedescendant', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(input).toHaveAttribute('aria-activedescendant');
    });

    await step('Escape closes the popup', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

export const AutocompleteNone = {
  render: Template,
  args: { label: 'Country (choose from list)', autocomplete: 'none' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await step('aria-autocomplete=none', async () => {
      await expect(input).toHaveAttribute('aria-autocomplete', 'none');
    });
    await step('Focusing opens full popup', async () => {
      input.focus();
      await expect(input).toHaveAttribute('aria-expanded', 'true');
    });
  },
};

export const AutocompleteBoth = {
  render: Template,
  args: { label: 'Country (inline completion)', autocomplete: 'both' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await step('aria-autocomplete=both', async () => {
      await expect(input).toHaveAttribute('aria-autocomplete', 'both');
    });
  },
};
