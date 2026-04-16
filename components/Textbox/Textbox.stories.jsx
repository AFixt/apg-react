import React, { useState } from 'react';
import { within, userEvent, expect } from '@storybook/test';
import Textbox from './Textbox';

export default {
  title: 'Components/Textbox',
  component: Textbox,
  tags: ['autodocs'],
};

const Template = (args) => {
  const [value, setValue] = useState(args.value ?? '');
  return <Textbox {...args} value={value} onChange={setValue} />;
};

export const SingleLine = {
  render: Template,
  args: { label: 'Full name', placeholder: 'Jane Doe' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await step('Typing updates the value', async () => {
      await userEvent.type(input, 'Jane');
      await expect(input).toHaveValue('Jane');
    });
  },
};

export const MultiLine = {
  render: Template,
  args: { label: 'Bio', multiline: true, rows: 4, helperText: 'Tell us about yourself.' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('textbox');
    await step('Multi-line textbox has aria-multiline=true', async () => {
      await expect(area).toHaveAttribute('aria-multiline', 'true');
    });
  },
};

export const Invalid = {
  render: Template,
  args: {
    label: 'Email',
    value: 'not-an-email',
    invalid: true,
    errorMessage: 'Enter a valid email address.',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await step('Invalid textbox has aria-invalid=true and error referenced', async () => {
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toHaveAttribute('aria-errormessage');
    });
  },
};

export const ReadOnly = {
  render: Template,
  args: { label: 'Account ID', value: 'ACCT-12345', readOnly: true },
};

export const Required = {
  render: Template,
  args: { label: 'Username', required: true, placeholder: 'Required' },
};
