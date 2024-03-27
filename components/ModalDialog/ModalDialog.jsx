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
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./ModalDialog.css"; // Assume appropriate CSS for styling

const ModalDialog = ({
    isOpen,
    onClose,
    ariaLabel,
    ariaDescribedby,
    children,
    initialFocusRef,
}) => {
    const dialogRef = useRef(null);
    const invokingElementRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Save a reference to the element that invoked the dialog
            invokingElementRef.current = document.activeElement;
            // Focus the initial element inside the dialog
            (initialFocusRef?.current || dialogRef.current)?.focus();
        }
    }, [isOpen, initialFocusRef]);

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    const handleFocusTrap = (e) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target)) {
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
                invokingElementRef.current.focus();
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-dialog-backdrop">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={ariaLabel}
                aria-describedby={ariaDescribedby}
                ref={dialogRef}
                className="modal-dialog"
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

ModalDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string,
    ariaDescribedby: PropTypes.string,
    children: PropTypes.node.isRequired,
    initialFocusRef: PropTypes.object,
};

export default ModalDialog;
