import React, { useEffect, useId, useRef } from 'react';
import './Checkbox.css';

/** Props for the Checkbox component. */
interface CheckboxProps {
  label: string;
  checked: boolean | null;
  onChange: (next: boolean | null) => void;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  isTriState?: boolean;
  /** Marks the checkbox as required, exposing aria-required. */
  required?: boolean;
  /** Marks the checkbox as failing validation, exposing aria-invalid. */
  invalid?: boolean;
  /** Error text announced and associated when `invalid`. */
  errorMessage?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  ariaLabelledby,
  ariaDescribedby,
  isTriState,
  required,
  invalid,
  errorMessage,
}) => {
  const checkboxId = `checkbox-${label.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const uid = useId();
  const errorId = `checkbox-error-${uid}`;
  const inputRef = useRef<HTMLInputElement>(null);

  // Naming follows Textbox, which already solves this in-tree: `required`,
  // `invalid`, `errorMessage`, with the message associated through
  // aria-describedby and aria-errormessage. A consumer-supplied
  // ariaDescribedby is kept alongside the error rather than replaced by it.
  const describedBy =
    [ariaDescribedby, invalid && errorMessage ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isTriState === true && checked === null;
    }
  }, [checked, isTriState]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      const newChecked = isTriState
        ? checked === true
          ? false
          : checked === false
            ? null
            : true
        : !checked;
      onChange(newChecked);
    }
  };

  return (
    <div className="checkbox">
      <input
        ref={inputRef}
        id={checkboxId}
        type="checkbox"
        className="checkbox-input"
        checked={checked === true}
        onChange={() =>
          onChange(
            isTriState ? (checked === true ? false : checked === false ? null : true) : !checked,
          )
        }
        onKeyDown={handleKeyPress}
        aria-checked={isTriState ? (checked === null ? 'mixed' : checked) : checked || false}
        aria-labelledby={ariaLabelledby}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-errormessage={invalid && errorMessage ? errorId : undefined}
      />
      <label htmlFor={checkboxId}>{label}</label>
      {invalid && errorMessage && (
        <div id={errorId} role="alert" className="checkbox-error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Checkbox pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Checkbox;
