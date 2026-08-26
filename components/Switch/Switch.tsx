/**
 * A custom switch component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - Visible label text. Rendered as a <span> and
 *   referenced by the switch via aria-labelledby.
 * @param {string} props.ariaLabelledby - ID of an external element that labels
 *   the switch. When provided, `label` is still rendered visually but the
 *   external reference takes precedence.
 * @param {string} props.ariaDescribedby - ID of an element that describes the switch.
 * @param {boolean} props.initialChecked - The initial checked state when uncontrolled.
 * @param {boolean} props.checked - Controlled checked state. When supplied, the
 *   consumer owns the value and `onChange` reports every requested change.
 * @param {Function} props.onChange - Called with the next checked state.
 * @param {boolean} props.isDisabled - Exposes aria-disabled and suppresses activation.
 * @returns {JSX.Element} The switch component.
 */
import React, { useId, useState } from 'react';
import './Switch.css';

/** Props for the Switch component. */
interface SwitchProps {
  label?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  initialChecked?: boolean;
  /** Controlled checked state. Omit to let the switch own its own. */
  checked?: boolean;
  /** Reports the next checked state on every activation. */
  onChange?: (checked: boolean) => void;
  /**
   * Exposes aria-disabled and suppresses activation. Deliberately not the
   * native disabled attribute: per APG guidance the control stays focusable so
   * a keyboard user can still discover it and find out why it is unavailable.
   */
  isDisabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  label,
  ariaLabelledby,
  ariaDescribedby,
  initialChecked = false,
  checked,
  onChange,
  isDisabled,
}) => {
  const [internalChecked, setInternalChecked] = useState(initialChecked);
  // Internally stateful and optionally controlled, matching Tabs, RadioGroup,
  // Combobox and TreeView. Previously the switch had only the first half, so a
  // consuming page could never read the state it was displaying.
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const generatedId = useId();
  const labelId = `switch-label-${generatedId}`;

  const toggleSwitch = () => {
    if (isDisabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleSwitch();
    }
  };

  return (
    <div className="switch-container">
      {label && (
        <span id={labelId} className="switch-label-text" onClick={toggleSwitch}>
          {label}
        </span>
      )}
      <span
        role="switch"
        aria-checked={isChecked}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={toggleSwitch}
        aria-labelledby={ariaLabelledby || (label ? labelId : undefined)}
        aria-describedby={ariaDescribedby}
        aria-disabled={isDisabled || undefined}
        className={`switch-control${isDisabled ? ' is-disabled' : ''}`}
      >
        <span className={`switch ${isChecked ? 'switch-on' : 'switch-off'}`} />
      </span>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Switch pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Switch;
