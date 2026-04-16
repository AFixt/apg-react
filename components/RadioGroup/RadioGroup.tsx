/**
 * RadioGroup — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 *
 * Keyboard model:
 *   - Tab: moves focus into the group at the checked radio (or first if none).
 *   - Arrow keys: move focus AND selection among radios (roving tabindex).
 *   - Space: selects focused radio (if not already selected).
 *   - Home / End: move to first / last radio.
 */
import React, { useRef, useState } from "react";
import "./RadioGroup.css";

interface RadioOption {
    value: string;
    label: string;
}

interface RadioGroupProps {
    name: string;
    label?: string;
    labelId?: string;
    options: RadioOption[];
    value?: string;
    onChange?: (next: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, labelId, options, value, onChange, name }) => {
    const [internalValue, setInternalValue] = useState(value ?? options[0]?.value);
    const current = value !== undefined ? value : internalValue;
    const radioRefs = useRef<(HTMLDivElement | null)[]>([]);

    const groupLabelId = labelId || `${name}-label`;

    const select = (newValue: string) => {
        if (value === undefined) setInternalValue(newValue);
        onChange?.(newValue);
    };

    const focusIndex = (i: number) => {
        const el = radioRefs.current[i];
        if (el) {
            el.focus();
            select(options[i].value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
        const last = options.length - 1;
        let handled = true;
        switch (e.key) {
            case "ArrowDown":
            case "ArrowRight":
                focusIndex(idx === last ? 0 : idx + 1);
                break;
            case "ArrowUp":
            case "ArrowLeft":
                focusIndex(idx === 0 ? last : idx - 1);
                break;
            case "Home":
                focusIndex(0);
                break;
            case "End":
                focusIndex(last);
                break;
            case " ":
                select(options[idx].value);
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    return (
        <div
            className="radiogroup"
            role="radiogroup"
            aria-labelledby={groupLabelId}
        >
            {label && <div id={groupLabelId} className="radiogroup-label">{label}</div>}
            <div className="radiogroup-items">
                {options.map((opt, idx) => {
                    const selected = current === opt.value;
                    return (
                        <div
                            key={opt.value}
                            ref={(el) => (radioRefs.current[idx] = el)}
                            role="radio"
                            className={`radio${selected ? " is-checked" : ""}`}
                            aria-checked={selected}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => {
                                radioRefs.current[idx]?.focus();
                                select(opt.value);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                        >
                            <span className="radio-indicator" aria-hidden="true" />
                            <span className="radio-label">{opt.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RadioGroup;
