/**
 * Represents an alert component that displays a message with a dismiss button.
 *  This is a basic implementation. Depending on the specific requirements and
 *  styles of your application, you might need to further customize the component,
 *  especially its styling and the way it integrates into your application's overall user interface.
 *
 * @component
 * @param {Object} props - The properties of the Alert component.
 * @param {string} props.message - The message to be displayed in the alert.
 * @param {('info'|'warning'|'error')} props.type - The type of the alert.
 * @returns {JSX.Element|null} The rendered Alert component.
 */
import React, { useState } from "react";
import "./Alert.css";

interface AlertLabels {
    dismiss?: string;
}

interface AlertProps {
    message: string;
    type: "info" | "warning" | "error";
    labels?: AlertLabels;
}

const Alert: React.FC<AlertProps> = ({ message, type, labels }) => {
    const defaultLabels: AlertLabels = {
        dismiss: "Dismiss",
    };
    const l = { ...defaultLabels, ...labels };
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={`alert alert-${type}`}
        >
            <span className="alert-message">{message}</span>
            <button
                type="button"
                className="alert-close"
                onClick={handleClose}
                aria-label={l.dismiss}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

export default Alert;
