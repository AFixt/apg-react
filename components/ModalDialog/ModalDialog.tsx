/**
 * ModalDialog component for displaying a modal dialog.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal dialog is open or not.
 * @param {function} props.onClose - The function to be called when the modal dialog is closed.
 * @param {string} [props.ariaLabel] - The ARIA label for the modal dialog.
 * @param {string} [props.ariaDescribedby] - The ID of the element that describes the modal dialog.
 * @param {ReactNode} props.children - The content to be rendered inside the modal dialog.
 * @param {Object} [props.initialFocusRef] - The ref to the initial focusable element inside the modal dialog.
 * @returns {JSX.Element|null} The rendered ModalDialog component.
 */
import React, { useEffect, useRef, useState } from 'react';
import { cycleFocusInDialog } from '../_internal/dialog-focus';
import './ModalDialog.css'; // Assume appropriate CSS for styling

/** Translatable labels for the ModalDialog component. English defaults are used when a key is omitted. */
interface ModalDialogLabels {
  closeDialog?: string;
}

/** Props for the ModalDialog component. */
interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** ID of the element that labels the dialog (e.g., a heading inside children). */
  ariaLabelledby?: string;
  /** ID of the element that describes the dialog. */
  ariaDescribedby?: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  labels?: ModalDialogLabels;
}

const defaultLabels = {
  closeDialog: 'Close dialog',
};

const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onClose,
  ariaLabelledby,
  ariaDescribedby,
  children,
  initialFocusRef,
  labels,
}) => {
  const l = { ...defaultLabels, ...labels };
  const dialogRef = useRef<HTMLDivElement>(null);
  const invokingElementRef = useRef<Element | null>(null);
  // Tracks whether the dialog is in the process of closing so the focus trap
  // doesn't yank focus back to the dialog while we're restoring it to the
  // invoking element.
  const closingRef = useRef(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      closingRef.current = false;
      invokingElementRef.current = document.activeElement;
      (initialFocusRef?.current || dialogRef.current)?.focus();
      const id = requestAnimationFrame(() => setIsAnimatingIn(true));
      return () => cancelAnimationFrame(id);
    }
    setIsAnimatingIn(false);
    return undefined;
  }, [isOpen, initialFocusRef]);

  // A consumer may decline to close -- an unsaved-changes confirmation is the
  // usual reason -- in which case `isOpen` never changes and the effect above,
  // which is keyed on it, never re-runs to clear `closingRef`. The focus trap
  // would then stay disarmed for the rest of the dialog's life. Running on
  // every render re-arms it as soon as we can see that the dialog is still
  // open, and leaves it latched once it really is closing.
  useEffect(() => {
    if (isOpen) closingRef.current = false;
  });

  // Restore focus to the element that opened the dialog, then call onClose.
  // If onClose moves focus somewhere else, that naturally takes precedence.
  const closeAndRestoreFocus = () => {
    closingRef.current = true;
    const invoker = invokingElementRef.current as HTMLElement | null;
    if (invoker && typeof invoker.focus === 'function') {
      invoker.focus();
    }
    onClose();
  };

  // The only Escape handler. There used to be a React onKeyDown on the dialog
  // element as well, which meant a single Escape ran the close path twice --
  // invisible while onClose was idempotent (`setIsOpen(false)` twice is
  // harmless), but it silently broke any consumer whose onClose is a state
  // machine, such as an unsaved-changes confirmation: the first call raised the
  // warning and the second immediately dismissed past it.
  //
  // Document level rather than element level is right for a *modal* dialog,
  // which owns the page's key events while it is open and must respond wherever
  // focus is. NonModalDialog deliberately does the opposite, and says so.
  useEffect(() => {
    if (!isOpen) return;
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeAndRestoreFocus();
      } else if (e.key === 'Tab' && dialogRef.current) {
        cycleFocusInDialog(dialogRef.current, e);
      }
    };
    document.addEventListener('keydown', onDocKeyDown);
    return () => document.removeEventListener('keydown', onDocKeyDown);
  }, [isOpen, onClose]);

  const handleFocusTrap = (e: FocusEvent) => {
    if (closingRef.current) return;
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      e.stopPropagation();
      (initialFocusRef?.current || dialogRef.current)?.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('focus', handleFocusTrap, true);
      return () => document.removeEventListener('focus', handleFocusTrap, true);
    }
    return undefined;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-dialog-backdrop${isAnimatingIn ? ' open' : ''}`}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        ref={dialogRef}
        className={`modal-dialog${isAnimatingIn ? ' open' : ''}`}
        tabIndex={-1}
      >
        {children}
        <button
          type="button"
          className="modal-dialog-close"
          onClick={closeAndRestoreFocus}
          aria-label={l.closeDialog}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG ModalDialog pattern. See the top-of-file comment for keyboard and ARIA details. */
export default ModalDialog;
