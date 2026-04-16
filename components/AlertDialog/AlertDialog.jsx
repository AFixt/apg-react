/**
 * Represents an alert dialog component.
 *  The actual CSS and further JavaScript logic for handling keyboard navigation,
 *  focus trapping within the dialog, and more sophisticated state management
 *  (like handling multiple dialogs or integrating with application state) would
 *  be necessary for a complete, production-ready component.
 *  This is just a foundational implementation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the dialog is open or not.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.message - The message content of the dialog.
 * @param {function} props.onClose - The callback function to be called when the dialog is closed.
 * @returns {JSX.Element|null} The JSX element representing the alert dialog.
 */
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./AlertDialog.css";

const AlertDialog = ({ isOpen, title, message, onClose }) => {
    const dialogRef = useRef(null);

    // Focus management
    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }
    }, [isOpen]);

    // Document-level Escape handler so the key works regardless of focus target.
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="dialog-overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dialogTitle"
            aria-describedby="dialogDesc"
            tabIndex="-1"
            ref={dialogRef}
        >
            <div className="dialog-content">
                <h2 id="dialogTitle">{title}</h2>
                <p id="dialogDesc">{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

AlertDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AlertDialog;
