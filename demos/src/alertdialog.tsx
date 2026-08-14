import React, { useState } from 'react';
import AlertDialog from '../../components/AlertDialog/AlertDialog';
import { mount } from './mount';

/**
 * Alert dialog demo: a destructive-action confirmation behind a single
 * dismissal control.
 *
 * The component renders one hardcoded "Close" button and accepts no
 * children, so it cannot present the Cancel/OK choice the APG alertdialog
 * pattern describes for confirming a destructive action. That gap is left
 * missing here and reported rather than papered over — see the build
 * report. AlertDialog restores focus to its invoking element itself via the
 * element it captured on open, so the demo does not need the
 * useEffect-based focus-restoration idiom ModalDialog requires.
 */
function AlertDialogDemo(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="demo-page">
      <h1>Alert Dialog</h1>
      <button type="button" onClick={() => setIsOpen(true)}>
        Delete Account
      </button>
      <AlertDialog
        isOpen={isOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete your account? This action cannot be undone."
        onClose={() => setIsOpen(false)}
      />
    </main>
  );
}

mount(<AlertDialogDemo />);
