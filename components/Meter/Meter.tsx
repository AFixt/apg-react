/**
 * A meter component that displays a value within a specified range.
 *
 * Uses a div-based visual (not a native <meter>) so CSS is fully
 * controllable and matches the Progressbar appearance exactly.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.value - The current value of the meter.
 * @param {number} [props.minValue=0] - The minimum value of the meter.
 * @param {number} [props.maxValue=100] - The maximum value of the meter.
 * @param {string} [props.label] - The label for the meter.
 * @param {string} [props.labelId='meter-label'] - The ID of the label element.
 * @param {Function} [props.userFriendlyText] - A function that returns a user-friendly text representation of the value.
 * @returns {JSX.Element} The rendered meter component.
 */
import React from 'react';
import './Meter.css';

/** Props for the Meter component. */
interface MeterProps {
  value: number;
  minValue?: number;
  maxValue?: number;
  label?: string;
  labelId?: string;
  userFriendlyText?: (value: number) => string;
}

const Meter: React.FC<MeterProps> = ({
  value,
  minValue = 0,
  maxValue = 100,
  label,
  labelId = 'meter-label',
  userFriendlyText,
}) => {
  const pct = Math.max(0, Math.min(100, ((value - minValue) / (maxValue - minValue)) * 100));
  const ariaValueText = userFriendlyText ? userFriendlyText(value) : `${value}`;
  const groupLabelId = labelId || 'meter-label';

  return (
    <div className="meter-container">
      {label && (
        <div id={groupLabelId} className="meter-label">
          {label}
        </div>
      )}
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-valuetext={ariaValueText}
        aria-labelledby={label ? groupLabelId : undefined}
        className="meter"
      >
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Meter pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Meter;
