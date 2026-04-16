import React, { useState } from 'react';
import { within, userEvent, expect, screen } from '@storybook/test';
import ModalDialog from './ModalDialog';

export default {
  title: 'Components/ModalDialog',
  component: ModalDialog,
  tags: ['autodocs'],
};

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open modal</button>
      <ModalDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 id="modal-title">Modal title</h2>
        <p id="modal-desc">
          This is a modal dialog. Press Escape or the Close button to dismiss it.
        </p>
      </ModalDialog>
    </>
  );
};

export const Default = {
  render: Template,
  args: {
    ariaLabelledby: 'modal-title',
    ariaDescribedby: 'modal-desc',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Trigger opens the modal', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
      const dialog = await screen.findByRole('dialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveFocus();
    });

    await step('Escape closes the modal', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  },
};

export const OpenByDefault = {
  render: Template,
  args: {
    isOpen: true,
    ariaLabelledby: 'modal-title',
    ariaDescribedby: 'modal-desc',
  },
  play: async ({ step }) => {
    await step('Dialog is present and labelled', async () => {
      const dialog = screen.getByRole('dialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });
    await step('Close button dismisses it', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  },
};
