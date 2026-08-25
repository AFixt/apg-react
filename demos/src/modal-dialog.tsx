import React, { useEffect, useRef, useState } from 'react';
import ModalDialog from '../../components/ModalDialog/ModalDialog';
import { mount } from './mount';

/**
 * Modal dialog demo: an Edit Profile form behind an Open Dialog button.
 *
 * A form is the demo of record because the pattern's hard parts only show up
 * when the dialog has several focusable controls: initial focus on the first
 * field, Tab cycling inside the dialog and nowhere else, Escape closing it, and
 * focus returning to the invoking button afterwards.
 *
 * The dialog's own close affordances restore focus themselves; the Save and
 * Cancel buttons here are the demo's, so the demo restores focus for them. That
 * is the division of labour the README's "Implementer responsibilities" section
 * describes, and showing it is part of what this page demonstrates.
 */
function ModalDialogDemo(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);

  // Focus has to go back to the opener *after* the dialog has unmounted. Doing
  // it in the click handler restores focus while the dialog's focus trap is
  // still listening, and the trap pulls it straight back inside.
  useEffect(() => {
    if (!isOpen && wasOpen.current) {
      openerRef.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  return (
    <main className="demo-page">
      <h1>Modal Dialog</h1>
      <button type="button" ref={openerRef} onClick={() => setIsOpen(true)}>
        Open Dialog
      </button>
      <ModalDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabelledby="edit-profile-title"
        initialFocusRef={nameRef}
      >
        <h2 id="edit-profile-title">Edit Profile</h2>
        <p>
          <label htmlFor="profile-name">Name</label>{' '}
          <input id="profile-name" type="text" ref={nameRef} />
        </p>
        <p>
          <label htmlFor="profile-email">Email</label> <input id="profile-email" type="email" />
        </p>
        <button type="button" onClick={() => setIsOpen(false)}>
          Save
        </button>{' '}
        <button type="button" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
      </ModalDialog>
    </main>
  );
}

mount(<ModalDialogDemo />);
