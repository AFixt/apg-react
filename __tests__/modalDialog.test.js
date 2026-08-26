import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import ModalDialog from '../components/ModalDialog/ModalDialog';

/**
 * APG pattern: Dialog (Modal)
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Key requirements:
 *   - Dialog has role="dialog".
 *   - Dialog has aria-modal="true".
 *   - Dialog is labelled via aria-labelledby (or aria-label).
 *   - Dialog is described via aria-describedby when supplementary content exists.
 *   - Dialog receives focus when opened.
 *   - Escape key closes the dialog.
 *   - Dialog is removed from the DOM when closed.
 */

const DialogHarness = ({ initialOpen = false, ...rest }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open modal
      </button>
      <ModalDialog {...rest} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 id="modal-title">Dialog title</h2>
        <p id="modal-desc">Dialog description</p>
      </ModalDialog>
    </>
  );
};

describe('ModalDialog Component (APG modal dialog pattern)', () => {
  test('is not rendered when closed', () => {
    render(<DialogHarness ariaLabelledby="modal-title" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders with role=dialog and aria-modal=true when open', () => {
    render(<DialogHarness initialOpen ariaLabelledby="modal-title" ariaDescribedby="modal-desc" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('is labelled via aria-labelledby', () => {
    render(<DialogHarness initialOpen ariaLabelledby="modal-title" ariaDescribedby="modal-desc" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(document.getElementById('modal-title')).toHaveTextContent('Dialog title');
  });

  test('is described via aria-describedby when supplied', () => {
    render(<DialogHarness initialOpen ariaLabelledby="modal-title" ariaDescribedby="modal-desc" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-desc');
  });

  test('receives focus when opened', () => {
    render(<DialogHarness initialOpen ariaLabelledby="modal-title" ariaDescribedby="modal-desc" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
  });

  test('Escape key closes the dialog', () => {
    render(<DialogHarness initialOpen ariaLabelledby="modal-title" ariaDescribedby="modal-desc" />);
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('clicking the close button closes the dialog', () => {
    render(<DialogHarness initialOpen ariaLabelledby="modal-title" ariaDescribedby="modal-desc" />);
    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('close button has an accessible name', () => {
    render(<DialogHarness initialOpen ariaLabelledby="modal-title" ariaDescribedby="modal-desc" />);
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });

  test('opening from a trigger places the dialog in the DOM', () => {
    render(<DialogHarness ariaLabelledby="modal-title" />);
    fireEvent.click(screen.getByText('Open modal'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  // --- Regression coverage -------------------------------------------------

  describe('Escape calls onClose exactly once (#172)', () => {
    // ModalDialog had both a document-level keydown listener and a React
    // onKeyDown on the dialog element, so one Escape ran the close path twice.
    // Invisible while onClose was idempotent -- setIsOpen(false) twice is
    // harmless -- but it silently broke any consumer whose onClose is a state
    // machine, which is what an unsaved-changes confirmation is.
    const Harness = ({ onClose }) => (
      <ModalDialog isOpen onClose={onClose} ariaLabelledby="t">
        <h2 id="t">Edit Profile</h2>
        <input aria-label="Name" />
      </ModalDialog>
    );

    // Dispatched from a control *inside* the dialog, which is where focus
    // actually is. Firing at `document` misses React's synthetic handler
    // entirely -- the event target is then outside the dialog subtree -- so it
    // sees only one of the two handlers and passes against the defect.
    const escapeFromInside = () =>
      fireEvent.keyDown(screen.getByLabelText('Name'), {
        key: 'Escape',
      });

    test('one Escape produces one onClose', () => {
      const onClose = jest.fn();
      render(<Harness onClose={onClose} />);

      escapeFromInside();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('two Escapes produce two', () => {
      const onClose = jest.fn();
      render(<Harness onClose={onClose} />);

      escapeFromInside();
      escapeFromInside();

      expect(onClose).toHaveBeenCalledTimes(2);
    });

    test('a consumer that declines to close keeps the dialog usable', () => {
      // The shape the demo uses, and the one the duplicate handler broke: warn
      // on the first request, close on the second. With onClose firing twice
      // for one Escape, the warning was raised and dismissed in the same
      // keypress and the user never saw it.
      const Declining = () => {
        const [isOpen, setIsOpen] = useState(true);
        const [warned, setWarned] = useState(false);
        return (
          <ModalDialog
            isOpen={isOpen}
            onClose={() => (warned ? setIsOpen(false) : setWarned(true))}
            ariaLabelledby="title"
          >
            <h2 id="title">Edit Profile</h2>
            <input aria-label="Name" />
            {warned && <div role="alert">You have unsaved changes</div>}
          </ModalDialog>
        );
      };
      render(<Declining />);

      fireEvent.keyDown(screen.getByLabelText('Name'), { key: 'Escape' });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('You have unsaved changes');
    });

    test('a second Escape then closes it', () => {
      const Declining = () => {
        const [isOpen, setIsOpen] = useState(true);
        const [warned, setWarned] = useState(false);
        return (
          <ModalDialog
            isOpen={isOpen}
            onClose={() => (warned ? setIsOpen(false) : setWarned(true))}
            ariaLabelledby="title"
          >
            <h2 id="title">Edit Profile</h2>
            <input aria-label="Name" />
            {warned && <div role="alert">You have unsaved changes</div>}
          </ModalDialog>
        );
      };
      render(<Declining />);

      fireEvent.keyDown(screen.getByLabelText('Name'), { key: 'Escape' });
      fireEvent.keyDown(screen.getByLabelText('Name'), { key: 'Escape' });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('the focus trap is re-armed when the consumer declines', () => {
      const Declining = () => {
        const [warned, setWarned] = useState(false);
        return (
          <ModalDialog isOpen onClose={() => setWarned(true)} ariaLabelledby="title">
            <h2 id="title">Edit Profile</h2>
            <input aria-label="Name" />
            <button>{warned ? 'Keep editing' : 'Save'}</button>
          </ModalDialog>
        );
      };
      render(<Declining />);
      const outside = document.createElement('button');
      document.body.appendChild(outside);

      fireEvent.keyDown(screen.getByLabelText('Name'), { key: 'Escape' });
      outside.focus();

      // closingRef was latched on the way out; since the dialog is still open
      // the trap must have been re-armed and pulled focus back inside.
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
      outside.remove();
    });
  });
});
