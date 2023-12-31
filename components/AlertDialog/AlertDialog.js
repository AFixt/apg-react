/**
 * Represents an alert dialog component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the dialog is open or not.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.message - The message content of the dialog.
 * @param {function} props.onClose - The callback function to be called when the dialog is closed.
 * @returns {JSX.Element|null} The JSX element representing the alert dialog.
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './AlertDialog.css';

const AlertDialog = ({ isOpen, title, message, onClose }) => {
  const dialogRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

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
