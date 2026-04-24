import { expect, fn, userEvent, within } from '@storybook/test';
import React, { useState } from 'react';
import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    action: fn(),
  },
};

const ToggleTemplate = (args) => {
  const [pressed, setPressed] = useState(args.toggleState ?? false);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}
    >
      <Button
        {...args}
        action={() => setPressed((p) => !p)}
        toggleState={pressed}
        label={pressed ? 'Notifications: On' : 'Notifications: Off'}
      />
      <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
        Current state: <strong>{pressed ? 'pressed (on)' : 'released (off)'}</strong>
      </span>
    </div>
  );
};

export const Default = {
  args: {
    label: 'Click me',
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Click me' });
    await step('Click invokes the action', async () => {
      await userEvent.click(button);
      await expect(args.action).toHaveBeenCalled();
    });
  },
};

export const Disabled = {
  args: {
    label: 'Disabled',
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await step('Button is disabled', async () => {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute('aria-disabled', 'true');
    });
    await step('Clicking a disabled button does nothing', async () => {
      await userEvent.click(button);
      await expect(button).toBeDisabled();
    });
  },
};

export const Toggle = {
  render: ToggleTemplate,
  args: {
    isToggleButton: true,
    toggleState: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Starts unpressed', async () => {
      const btn = canvas.getByRole('button');
      await expect(btn).toHaveAttribute('aria-pressed', 'false');
    });

    await step('Click toggles to pressed', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    await step('Click again toggles to unpressed', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });
  },
};

export const TogglePressed = {
  render: ToggleTemplate,
  args: {
    isToggleButton: true,
    toggleState: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Starts pressed', async () => {
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
    await step('Click toggles to unpressed', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });
    await step('Click again restores pressed state (matches story name)', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
  },
};
