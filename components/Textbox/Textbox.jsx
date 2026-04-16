/**
 * Textbox — role=textbox (https://w3c.github.io/aria/#textbox)
 *
 * Wraps native <input> / <textarea> with labelling and ARIA state:
 *   - aria-multiline for multi-line
 *   - aria-readonly, aria-required, aria-invalid
 *   - Describes errors via aria-errormessage / aria-describedby
 */
import React, { useId } from "react";
import PropTypes from "prop-types";
import "./Textbox.css";

const Textbox = ({
    label,
    value,
    onChange,
    multiline,
    rows,
    placeholder,
    required,
    readOnly,
    invalid,
    errorMessage,
    helperText,
    id,
    name,
    type,
}) => {
    const generatedId = useId();
    const textboxId = id || `textbox-${generatedId}`;
    const errorId = `${textboxId}-error`;
    const helperId = `${textboxId}-helper`;

    const describedBy = [
        invalid && errorMessage ? errorId : null,
        helperText ? helperId : null,
    ]
        .filter(Boolean)
        .join(" ") || undefined;

    const commonProps = {
        id: textboxId,
        name,
        value,
        onChange: (e) => onChange?.(e.target.value, e),
        placeholder,
        required: required || undefined,
        readOnly: readOnly || undefined,
        "aria-invalid": invalid || undefined,
        "aria-required": required || undefined,
        "aria-readonly": readOnly || undefined,
        "aria-describedby": describedBy,
        "aria-errormessage": invalid && errorMessage ? errorId : undefined,
        className: `textbox-input${invalid ? " is-invalid" : ""}`,
    };

    return (
        <div className="textbox-container">
            {label && (
                <label htmlFor={textboxId} className="textbox-label">
                    {label}
                    {required && <span aria-hidden="true" className="textbox-required">*</span>}
                </label>
            )}
            {multiline ? (
                <textarea rows={rows || 4} aria-multiline="true" {...commonProps} />
            ) : (
                <input type={type || "text"} {...commonProps} />
            )}
            {helperText && !invalid && (
                <div id={helperId} className="textbox-helper">{helperText}</div>
            )}
            {invalid && errorMessage && (
                <div id={errorId} role="alert" className="textbox-error">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

Textbox.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    invalid: PropTypes.bool,
    errorMessage: PropTypes.string,
    helperText: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
};

export default Textbox;
