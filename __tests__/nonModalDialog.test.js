import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import NonModalDialog from '../components/NonModalDialog/NonModalDialog';

/**
 * Non-modal dialog.
 *
 * The APG publishes no non-modal dialog example; the normative statements live
 * in the About section of the Dialog (Modal) pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Key requirements:
 *   - Dialog has role="dialog".
 *   - Dialog sets aria-modal="false" explicitly (not merely omitted).
 *   - Dialog is labelled via aria-labelledby (or aria-label).
 *   - Dialog receives focus when opened.
 *   - Focus may leave the dialog without closing it — the defining difference
 *     from a modal dialog.
 *   - The rest of the page stays interactive (no blocking backdrop).
 *   - Escape closes the dialog and focus returns to the invoking element.
 */

const DialogHarness = ({ initialOpen = false, ...rest }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open preferences
      </button>
      <label htmlFor="page-search">Search</label>
      <input id="page-search" type="text" />
      <NonModalDialog {...rest} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 id="prefs-title">Preferences</h2>
        <p id="prefs-desc">Preferences description</p>
        <button type="button">Reset to defaults</button>
      </NonModalDialog>
    </>
  );
};

describe('NonModalDialog', () => {
  it('is not rendered while closed', () => {
    render(<DialogHarness ariaLabelledby="prefs-title" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('sets aria-modal="false" explicitly rather than omitting it', () => {
    render(<DialogHarness initialOpen ariaLabelledby="prefs-title" />);
    const dialog = screen.getByRole('dialog');
    // Omitting the attribute would also read as "not modal", but leaves nothing
    // for a checker to assert on. The explicit value is the contract.
    expect(dialog).toHaveAttribute('aria-modal', 'false');
  });

  it('is labelled and described by the referenced elements', () => {
    render(<DialogHarness initialOpen ariaLabelledby="prefs-title" ariaDescribedby="prefs-desc" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'prefs-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'prefs-desc');
    expect(dialog).toHaveAccessibleName('Preferences');
  });

  it('moves focus into the dialog when opened', () => {
    render(<DialogHarness ariaLabelledby="prefs-title" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open preferences' }));
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('lets focus leave without closing — the defining non-modal behaviour', () => {
    render(<DialogHarness initialOpen ariaLabelledby="prefs-title" />);
    const outside = screen.getByLabelText('Search');

    outside.focus();

    // A modal dialog traps focus and would have pulled it straight back.
    expect(outside).toHaveFocus();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on Escape and restores focus to the invoking element', () => {
    render(<DialogHarness ariaLabelledby="prefs-title" />);
    const trigger = screen.getByRole('button', { name: 'Open preferences' });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes via the close button and restores focus to the invoking element', () => {
    render(<DialogHarness ariaLabelledby="prefs-title" />);
    const trigger = screen.getByRole('button', { name: 'Open preferences' });

    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('does not close when Escape is pressed outside it', () => {
    render(<DialogHarness initialOpen ariaLabelledby="prefs-title" />);
    const outside = screen.getByLabelText('Search');

    outside.focus();
    fireEvent.keyDown(outside, { key: 'Escape' });

    // A document-level Escape handler would close the dialog from an unrelated
    // context. A non-modal dialog does not own the page's key events.
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders no blocking backdrop', () => {
    const { container } = render(<DialogHarness initialOpen ariaLabelledby="prefs-title" />);
    expect(container.querySelector('.modal-dialog-backdrop')).toBeNull();
    expect(container.querySelector('[class*="backdrop"]')).toBeNull();
  });

  it('supports two dialogs open at once, each with its own name', () => {
    render(
      <>
        <NonModalDialog isOpen onClose={() => {}} ariaLabelledby="a-title">
          <h2 id="a-title">Preferences</h2>
        </NonModalDialog>
        <NonModalDialog isOpen onClose={() => {}} ariaLabelledby="b-title">
          <h2 id="b-title">Filter options</h2>
        </NonModalDialog>
      </>,
    );

    expect(screen.getAllByRole('dialog')).toHaveLength(2);
    expect(screen.getByRole('dialog', { name: 'Preferences' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Filter options' })).toBeInTheDocument();
  });
});
