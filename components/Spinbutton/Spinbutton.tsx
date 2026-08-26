/**
 * A customizable spin button component.
 */
import React, { useId, useState } from 'react';
import './Spinbutton.css';

/** Translatable labels for the Spinbutton component. English defaults are used when a key is omitted. */
interface SpinbuttonLabels {
  increaseValue?: string;
  decreaseValue?: string;
  /** Wording of the default out-of-range message. */
  rangeError?: (min: number, max: number) => string;
}

/** Props for the Spinbutton component. */
interface SpinbuttonProps {
  min: number;
  max: number;
  step?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  initialValue?: number;
  labels?: SpinbuttonLabels;
  /** Overrides the default out-of-range message shown when the value is invalid. */
  errorMessage?: string;
  /** Id of a consumer-owned description. Combined with the error message, not replaced by it. */
  ariaDescribedby?: string;
}

const defaultLabels: Required<SpinbuttonLabels> = {
  increaseValue: 'Increase value',
  decreaseValue: 'Decrease value',
  rangeError: (min, max) => `Value must be between ${min} and ${max}`,
};

const Spinbutton: React.FC<SpinbuttonProps> = ({
  min,
  max,
  step = 1,
  ariaLabel,
  ariaLabelledby,
  initialValue,
  labels,
  errorMessage,
  ariaDescribedby,
}) => {
  const l = { ...defaultLabels, ...labels };
  const uid = useId();
  const errorId = `spinbutton-error-${uid}`;
  const [value, setValue] = useState(initialValue ?? min ?? 0);
  const [isInvalid, setIsInvalid] = useState(false);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  /**
   * Stepping can never produce an invalid value: reaching the end of the range
   * is normal operation, and the APG specifies clamping as the behaviour, so a
   * refused step is a no-op rather than an error. aria-invalid therefore
   * describes whether the *committed* value is out of range -- which only typed
   * input can make it -- and not whether the last step request was honoured.
   */
  const stepTo = (newValue: number) => {
    setValue(clamp(newValue));
    setIsInvalid(false);
  };

  const commitTyped = (newValue: number) => {
    if (newValue >= min && newValue <= max) {
      setValue(newValue);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        stepTo(value + step);
        break;
      case 'ArrowDown':
        e.preventDefault();
        stepTo(value - step);
        break;
      case 'PageUp':
        e.preventDefault();
        stepTo(value + step * 10);
        break;
      case 'PageDown':
        e.preventDefault();
        stepTo(value - step * 10);
        break;
      case 'Home':
        e.preventDefault();
        stepTo(min);
        break;
      case 'End':
        e.preventDefault();
        stepTo(max);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      commitTyped(newValue);
    } else {
      setIsInvalid(true);
    }
  };

  const message = errorMessage ?? l.rangeError(min, max);
  const describedBy =
    [ariaDescribedby, isInvalid ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div className="spinbutton">
      <div className="spinbutton-container">
        <input
          type="text"
          role="spinbutton"
          className={isInvalid ? 'is-invalid' : ''}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={String(value)}
          aria-label={ariaLabelledby ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-invalid={isInvalid}
          aria-describedby={describedBy}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="spinbutton-arrow spinbutton-arrow-up"
          aria-label={l.increaseValue}
          tabIndex={-1}
          onClick={() => stepTo(value + step)}
        >
          <span aria-hidden="true">&#x25B2;</span>
        </button>
        <button
          type="button"
          className="spinbutton-arrow spinbutton-arrow-down"
          aria-label={l.decreaseValue}
          tabIndex={-1}
          onClick={() => stepTo(value - step)}
        >
          <span aria-hidden="true">&#x25BC;</span>
        </button>
      </div>
      {isInvalid && (
        <div id={errorId} role="alert" className="spinbutton-error">
          {message}
        </div>
      )}
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Spinbutton pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Spinbutton;
