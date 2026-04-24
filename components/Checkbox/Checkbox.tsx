import React, { useEffect, useRef } from 'react';
import './Checkbox.css';

interface CheckboxProps {
  label: string;
  checked: boolean | null;
  onChange: (next: boolean | null) => void;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  isTriState?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  ariaLabelledby,
  ariaDescribedby,
  isTriState,
}) => {
  const checkboxId = `checkbox-${label.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const inputRef = useRef<HTMLInputElement>(null);

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
        aria-describedby={ariaDescribedby}
      />
      <label htmlFor={checkboxId}>{label}</label>
    </div>
  );
};

export default Checkbox;
