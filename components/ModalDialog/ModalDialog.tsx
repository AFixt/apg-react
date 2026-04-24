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
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      invokingElementRef.current = document.activeElement;
      (initialFocusRef?.current || dialogRef.current)?.focus();
      const id = requestAnimationFrame(() => setIsAnimatingIn(true));
      return () => cancelAnimationFrame(id);
    }
    setIsAnimatingIn(false);
    return undefined;
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeAndRestoreFocus();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeAndRestoreFocus();
      }
    };
    document.addEventListener('keydown', onDocKeyDown);
    return () => document.removeEventListener('keydown', onDocKeyDown);
  }, [isOpen, onClose]);

  const handleFocusTrap = (e: FocusEvent) => {
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
        onKeyDown={handleKeyDown}
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
