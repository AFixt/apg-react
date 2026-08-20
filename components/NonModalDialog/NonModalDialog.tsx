/**
 * NonModalDialog component for displaying a non-modal dialog.
 *
 * The APG publishes no non-modal dialog example — the normative statements live
 * in the About section of the Dialog (Modal) pattern page. The behaviours that
 * distinguish this component from `ModalDialog` are:
 *
 *   - `aria-modal="false"` is set explicitly rather than omitted, so assistive
 *     technology and automated checks can tell "non-modal" from "unspecified".
 *   - Focus is **not** trapped. Tabbing past the last control inside the dialog
 *     moves to the next element on the page, and the dialog stays open. This is
 *     the defining difference from a modal dialog.
 *   - The rest of the page stays interactive: there is no blocking backdrop and
 *     no `inert`/`aria-hidden` applied to sibling content.
 *
 * Shared with the modal pattern: Escape closes the dialog, focus moves into the
 * dialog on open, and focus returns to the invoking element on close.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the dialog is open or not.
 * @param {function} props.onClose - The function to be called when the dialog is closed.
 * @param {string} [props.ariaLabelledby] - The ID of the element that labels the dialog.
 * @param {string} [props.ariaDescribedby] - The ID of the element that describes the dialog.
 * @param {ReactNode} props.children - The content to be rendered inside the dialog.
 * @param {Object} [props.initialFocusRef] - The ref to the initial focusable element inside the dialog.
 * @returns {JSX.Element|null} The rendered NonModalDialog component.
 */
import React, { useEffect, useRef } from 'react';
import './NonModalDialog.css';

/** Translatable labels for the NonModalDialog component. English defaults are used when a key is omitted. */
interface NonModalDialogLabels {
  closeDialog?: string;
}

/** Props for the NonModalDialog component. */
interface NonModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** ID of the element that labels the dialog (e.g., a heading inside children). */
  ariaLabelledby?: string;
  /** ID of the element that describes the dialog. */
  ariaDescribedby?: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  labels?: NonModalDialogLabels;
}

const defaultLabels = {
  closeDialog: 'Close dialog',
};

const NonModalDialog: React.FC<NonModalDialogProps> = ({
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

  useEffect(() => {
    if (isOpen) {
      invokingElementRef.current = document.activeElement;
      (initialFocusRef?.current || dialogRef.current)?.focus();
    }
  }, [isOpen, initialFocusRef]);

  // Restore focus to the element that opened the dialog, then call onClose.
  // If onClose moves focus somewhere else, that naturally takes precedence.
  const closeAndRestoreFocus = () => {
    const invoker = invokingElementRef.current as HTMLElement | null;
    if (invoker && typeof invoker.focus === 'function') {
      invoker.focus();
    }
    onClose();
  };

  // Escape is handled on the dialog itself rather than the document. A non-modal
  // dialog does not own the page's key events — focus may legitimately be
  // elsewhere while it stays open, and a document-level handler would then
  // close it from an unrelated context.
  // A child that already acted on Escape — a Combobox dismissing its listbox,
  // say — marks the event handled on its way up. Closing the dialog as well
  // would collapse two dismissals into one keypress, so defer to the child.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.stopPropagation();
      closeAndRestoreFocus();
    }
  };

  if (!isOpen) return null;

  // Deliberately no backdrop element and no focus-trap listener: both would
  // make this modal in all but name.
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      ref={dialogRef}
      className="non-modal-dialog"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {children}
      <button
        type="button"
        className="non-modal-dialog-close"
        onClick={closeAndRestoreFocus}
        aria-label={l.closeDialog}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

/** Accessible implementation of a non-modal dialog. See the top-of-file comment for keyboard and ARIA details. */
export default NonModalDialog;
