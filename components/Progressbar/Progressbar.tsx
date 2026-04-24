/**
 * Progressbar — role=progressbar (https://w3c.github.io/aria/#progressbar)
 *
 *   - Determinate: value, min, max.
 *   - Indeterminate: omit `value`; aria-valuenow is unset.
 */
import React from 'react';
import './Progressbar.css';

interface ProgressbarProps {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  labelId?: string;
  valueText?: string;
}

const Progressbar: React.FC<ProgressbarProps> = ({
  value,
  min = 0,
  max = 100,
  label,
  labelId,
  valueText,
}) => {
  const isIndeterminate = value === null || value === undefined;
  const pct = isIndeterminate ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className="progressbar-container">
      {label && (
        <div id={labelId || 'progressbar-label'} className="progressbar-label">
          {label}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuetext={valueText}
        aria-labelledby={label ? labelId || 'progressbar-label' : undefined}
        className={`progressbar${isIndeterminate ? ' is-indeterminate' : ''}`}
      >
        <div
          className="progressbar-fill"
          style={isIndeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default Progressbar;
