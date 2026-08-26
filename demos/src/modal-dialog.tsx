import React, { useEffect, useRef, useState } from 'react';
import ModalDialog from '../../components/ModalDialog/ModalDialog';
import { mount } from './mount';

const EMPTY_PROFILE = { name: '', email: '' };

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
 *
 * ## Unsaved changes
 *
 * Escape must close a modal dialog -- that is the pattern, and `ModalDialog`
 * still does it. But "Escape discards what the user typed, silently" is an
 * accessibility failure in its own right: it is far easier to hit by accident
 * for someone working keyboard-only, and re-entering the lost content is
 * expensive for anyone typing slowly or using speech input.
 *
 * So the demo declines the close while the form is dirty, announces why through
 * a `role="alert"`, and offers the choice explicitly. The dialog stays mounted
 * until the user makes it. This is consumer-side on purpose: whether a form is
 * dirty, and what to do about it, is not something the component can know.
 */
function ModalDialogDemo(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isWarning, setIsWarning] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const keepEditingRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const isDirty = profile.name !== EMPTY_PROFILE.name || profile.email !== EMPTY_PROFILE.email;

  // Focus has to go back to the opener *after* the dialog has unmounted. Doing
  // it in the click handler restores focus while the dialog's focus trap is
  // still listening, and the trap pulls it straight back inside.
  useEffect(() => {
    if (!isOpen && wasOpen.current) {
      openerRef.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  // The dialog moved focus to the opener on its way out. Since we are declining
  // to close, bring it back inside -- to the choice the user now has to make.
  useEffect(() => {
    if (isWarning) keepEditingRef.current?.focus();
  }, [isWarning]);

  const close = () => {
    setIsWarning(false);
    setProfile(EMPTY_PROFILE);
    setIsOpen(false);
  };

  /** Escape and Cancel both route through here, so both respect unsaved work. */
  const requestClose = () => {
    if (isDirty && !isWarning) {
      setIsWarning(true);
      return;
    }
    close();
  };

  return (
    <main className="demo-page">
      <h1>Modal Dialog</h1>
      <button type="button" ref={openerRef} onClick={() => setIsOpen(true)}>
        Open Dialog
      </button>
      <ModalDialog
        isOpen={isOpen}
        onClose={requestClose}
        ariaLabelledby="edit-profile-title"
        initialFocusRef={nameRef}
      >
        <h2 id="edit-profile-title">Edit Profile</h2>
        <p>
          <label htmlFor="profile-name">Name</label>{' '}
          <input
            id="profile-name"
            type="text"
            ref={nameRef}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </p>
        <p>
          <label htmlFor="profile-email">Email</label>{' '}
          <input
            id="profile-email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </p>
        {isWarning && (
          <div role="alert" className="demo-unsaved-warning">
            You have unsaved changes
          </div>
        )}
        {isWarning ? (
          <>
            <button type="button" onClick={close}>
              Discard changes
            </button>{' '}
            <button type="button" ref={keepEditingRef} onClick={() => setIsWarning(false)}>
              Keep editing
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={close}>
              Save
            </button>{' '}
            <button type="button" onClick={requestClose}>
              Cancel
            </button>
          </>
        )}
      </ModalDialog>
    </main>
  );
}

mount(<ModalDialogDemo />);
