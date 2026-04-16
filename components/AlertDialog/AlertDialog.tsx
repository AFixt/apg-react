/**
 * AlertDialog — APG: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 *
 * - role=alertdialog, aria-modal=true
 * - Focus trapped inside the dialog
 * - Escape closes and returns focus to the invoking element
 * - Initial focus placed on the close button
 */
import React, { useEffect, useId, useRef } from "react";
import "./AlertDialog.css";

interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, title, message, onClose }) => {
    const uid = useId();
    const titleId = `alertdialog-title-${uid}`;
    const descId = `alertdialog-desc-${uid}`;
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const invokingElementRef = useRef<Element | null>(null);

    // Save invoking element and set initial focus on open.
    useEffect(() => {
        if (isOpen) {
            invokingElementRef.current = document.activeElement;
            closeBtnRef.current?.focus();
        }
    }, [isOpen]);

    const closeAndRestoreFocus = () => {
        const invoker = invokingElementRef.current as HTMLElement | null;
        if (invoker && typeof invoker.focus === "function") {
            invoker.focus();
        }
        onClose();
    };

    // Document-level Escape handler.
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                closeAndRestoreFocus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    // Focus trap — keep focus inside the dialog.
    useEffect(() => {
        if (!isOpen) return;
        const handleFocusTrap = (e: FocusEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
                e.stopPropagation();
                closeBtnRef.current?.focus();
            }
        };
        document.addEventListener("focus", handleFocusTrap, true);
        return () => document.removeEventListener("focus", handleFocusTrap, true);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="dialog-overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            ref={dialogRef}
        >
            <div className="dialog-content">
                <h2 id={titleId}>{title}</h2>
                <p id={descId}>{message}</p>
                <button ref={closeBtnRef} onClick={closeAndRestoreFocus}>Close</button>
            </div>
        </div>
    );
};

export default AlertDialog;
