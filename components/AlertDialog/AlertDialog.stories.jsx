import React, { useState } from 'react';
import { within, userEvent, expect, screen } from '@storybook/test';
import AlertDialog from './AlertDialog';

export default {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
};

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open alert dialog</button>
      <AlertDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const Default = {
  render: Template,
  args: {
    title: 'Confirm action',
    message: 'Are you sure you want to continue? This action cannot be undone.',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Trigger button opens the alert dialog', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open alert dialog' }));
      const dialog = await screen.findByRole('alertdialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-labelledby', 'dialogTitle');
    });

    await step('Close button dismisses the dialog', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  },
};

export const OpenByDefault = {
  render: Template,
  args: {
    isOpen: true,
    title: 'Session expired',
    message: 'Your session has expired. Please sign in again.',
  },
  play: async ({ step }) => {
    await step('Dialog is present with correct ARIA', async () => {
      const dialog = screen.getByRole('alertdialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-describedby', 'dialogDesc');
    });
    await step('Close button dismisses the dialog', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  },
};
