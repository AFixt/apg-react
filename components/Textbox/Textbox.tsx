/**
 * Textbox — role=textbox (https://w3c.github.io/aria/#textbox)
 *
 * Wraps native <input> / <textarea> with labelling and ARIA state:
 *   - aria-multiline for multi-line
 *   - aria-readonly, aria-required, aria-invalid
 *   - Describes errors via aria-errormessage / aria-describedby
 */
import React, { useId } from 'react';
import './Textbox.css';

/** Props for the Textbox component. */
interface TextboxProps {
  label?: string;
  value?: string;
  onChange?: (
    next: string,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  helperText?: string;
  id?: string;
  name?: string;
  type?: string;
}

const Textbox: React.FC<TextboxProps> = ({
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

  const describedBy =
    [invalid && errorMessage ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const commonProps = {
    'id': textboxId,
    name,
    value,
    'onChange': (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange?.(e.target.value, e),
    placeholder,
    'required': required || undefined,
    'readOnly': readOnly || undefined,
    'aria-invalid': invalid || undefined,
    'aria-required': required || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-describedby': describedBy,
    'aria-errormessage': invalid && errorMessage ? errorId : undefined,
    'className': `textbox-input${invalid ? ' is-invalid' : ''}`,
  };

  return (
    <div className="textbox-container">
      {label && (
        <label htmlFor={textboxId} className="textbox-label">
          {label}
          {required && (
            <span aria-hidden="true" className="textbox-required">
              *
            </span>
          )}
        </label>
      )}
      {multiline ? (
        <textarea rows={rows || 4} aria-multiline="true" {...commonProps} />
      ) : (
        <input type={type || 'text'} {...commonProps} />
      )}
      {helperText && !invalid && (
        <div id={helperId} className="textbox-helper">
          {helperText}
        </div>
      )}
      {invalid && errorMessage && (
        <div id={errorId} role="alert" className="textbox-error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Textbox pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Textbox;
