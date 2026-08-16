import { expect, screen, userEvent, within } from '@storybook/test';
import React, { useState } from 'react';
import NonModalDialog from './NonModalDialog';

export default {
  title: 'Components/NonModalDialog',
  component: NonModalDialog,
  tags: ['autodocs'],
};

/*
 * The external "Search" field is part of the fixture, not decoration. Two of the
 * behaviours that define a non-modal dialog can only be observed against
 * something outside it: that focus can move out without the dialog closing, and
 * that the rest of the page stays interactive.
 */
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open preferences
      </button>
      <label htmlFor="page-search">Search</label>
      <input id="page-search" type="text" />
      <NonModalDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 id="prefs-title">Preferences</h2>
        <p id="prefs-desc">
          This dialog is non-modal. Tab past the last control and focus moves to the page behind it,
          without closing the dialog.
        </p>
        <button type="button">Reset to defaults</button>
      </NonModalDialog>
    </>
  );
};

const TwoDialogs = () => {
  const [aOpen, setAOpen] = useState(true);
  const [bOpen, setBOpen] = useState(true);
  return (
    <>
      <NonModalDialog isOpen={aOpen} onClose={() => setAOpen(false)} ariaLabelledby="prefs-a">
        <h2 id="prefs-a">Preferences</h2>
        <button type="button">Reset to defaults</button>
      </NonModalDialog>
      <NonModalDialog isOpen={bOpen} onClose={() => setBOpen(false)} ariaLabelledby="prefs-b">
        <h2 id="prefs-b">Filter options</h2>
        <button type="button">Clear filters</button>
      </NonModalDialog>
    </>
  );
};

export const Default = {
  render: Template,
  args: {
    ariaLabelledby: 'prefs-title',
    ariaDescribedby: 'prefs-desc',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Trigger opens the dialog and moves focus into it', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open preferences' }));
      const dialog = await screen.findByRole('dialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'false');
      await expect(dialog).toHaveFocus();
    });

    await step('Focus can leave the dialog without closing it', async () => {
      // The defining non-modal behaviour: a modal would pull focus straight back.
      const search = canvas.getByLabelText('Search');
      search.focus();
      await expect(search).toHaveFocus();
      await expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await step('Escape closes it and restores focus to the trigger', async () => {
      screen.getByRole('dialog').focus();
      await userEvent.keyboard('{Escape}');
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Open preferences' })).toHaveFocus();
    });
  },
};

export const OpenByDefault = {
  render: Template,
  args: {
    isOpen: true,
    ariaLabelledby: 'prefs-title',
    ariaDescribedby: 'prefs-desc',
  },
  play: async ({ step }) => {
    await step('Dialog is present, labelled, and explicitly non-modal', async () => {
      const dialog = screen.getByRole('dialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'false');
      await expect(dialog).toHaveAttribute('aria-labelledby', 'prefs-title');
    });
    await step('Close button dismisses it', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  },
};

// Render-only variants for use case automation. No play function so the story
// loads in its initial render state. `patterns/dialog-non-modal/` in
// AFixt/apg-usecases targets these.
export const DefaultBare = {
  render: Template,
  args: {
    ariaLabelledby: 'prefs-title',
    ariaDescribedby: 'prefs-desc',
  },
};

export const OpenByDefaultBare = {
  render: Template,
  args: {
    isOpen: true,
    ariaLabelledby: 'prefs-title',
    ariaDescribedby: 'prefs-desc',
  },
};

// Two non-modal dialogs open at once, each with its own accessible name.
// Non-modal dialogs can legitimately coexist; modal ones cannot.
export const MultipleOpenBare = {
  render: TwoDialogs,
};
