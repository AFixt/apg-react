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
import React, { useEffect, useRef, useState } from "react";
import "./ModalDialog.css"; // Assume appropriate CSS for styling

interface ModalDialogLabels {
    closeDialog?: string;
}

interface ModalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ariaLabel?: string;
    ariaDescribedby?: string;
    children: React.ReactNode;
    initialFocusRef?: React.RefObject<HTMLElement>;
    labels?: ModalDialogLabels;
}

const defaultLabels = {
    closeDialog: "Close dialog",
};

const ModalDialog: React.FC<ModalDialogProps> = ({
    isOpen,
    onClose,
    ariaLabel,
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
    }, [isOpen, initialFocusRef]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const onDocKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
            }
        };
        document.addEventListener("keydown", onDocKeyDown);
        return () => document.removeEventListener("keydown", onDocKeyDown);
    }, [isOpen, onClose]);

    const handleFocusTrap = (e: FocusEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
            e.stopPropagation();
            (initialFocusRef?.current || dialogRef.current)?.focus();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("focus", handleFocusTrap, true);
            return () =>
                document.removeEventListener("focus", handleFocusTrap, true);
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            // Return focus to the invoking element when the dialog closes
            if (!isOpen && invokingElementRef.current) {
                (invokingElementRef.current as HTMLElement).focus();
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`modal-dialog-backdrop${isAnimatingIn ? " open" : ""}`}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={ariaLabel}
                aria-describedby={ariaDescribedby}
                ref={dialogRef}
                className={`modal-dialog${isAnimatingIn ? " open" : ""}`}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
                {children}
                <button
                    type="button"
                    className="modal-dialog-close"
                    onClick={onClose}
                    aria-label={l.closeDialog}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    );
};

export default ModalDialog;
