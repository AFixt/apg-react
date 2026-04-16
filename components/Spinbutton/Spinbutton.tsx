/**
 * A customizable spin button component.
 */
import React, { useState } from "react";
import "./Spinbutton.css";

interface SpinbuttonLabels {
    increaseValue?: string;
    decreaseValue?: string;
}

interface SpinbuttonProps {
    min: number;
    max: number;
    step?: number;
    ariaLabel?: string;
    ariaLabelledby?: string;
    initialValue?: number;
    labels?: SpinbuttonLabels;
}

const defaultLabels = {
    increaseValue: "Increase value",
    decreaseValue: "Decrease value",
};

const Spinbutton: React.FC<SpinbuttonProps> = ({ min, max, step = 1, ariaLabel, ariaLabelledby, initialValue, labels }) => {
    const l = { ...defaultLabels, ...labels };
    const [value, setValue] = useState(initialValue ?? min ?? 0);
    const [isInvalid, setIsInvalid] = useState(false);

    const changeValue = (newValue: number) => {
        if (newValue >= min && newValue <= max) {
            setValue(newValue);
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                changeValue(value + step);
                break;
            case "ArrowDown":
                e.preventDefault();
                changeValue(value - step);
                break;
            case "PageUp":
                e.preventDefault();
                changeValue(value + step * 10);
                break;
            case "PageDown":
                e.preventDefault();
                changeValue(value - step * 10);
                break;
            case "Home":
                e.preventDefault();
                changeValue(min);
                break;
            case "End":
                e.preventDefault();
                changeValue(max);
                break;
            default:
                break;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            changeValue(newValue);
        } else {
            setIsInvalid(true);
        }
    };

    return (
        <div className="spinbutton-container">
            <input
                type="text"
                role="spinbutton"
                className={isInvalid ? "is-invalid" : ""}
                aria-valuenow={value}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuetext={String(value)}
                aria-label={ariaLabelledby ? undefined : ariaLabel}
                aria-labelledby={ariaLabelledby}
                aria-invalid={isInvalid}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                className="spinbutton-arrow spinbutton-arrow-up"
                aria-label={l.increaseValue}
                tabIndex={-1}
                onClick={() => changeValue(value + step)}
            >
                <span aria-hidden="true">&#x25B2;</span>
            </button>
            <button
                type="button"
                className="spinbutton-arrow spinbutton-arrow-down"
                aria-label={l.decreaseValue}
                tabIndex={-1}
                onClick={() => changeValue(value - step)}
            >
                <span aria-hidden="true">&#x25BC;</span>
            </button>
        </div>
    );
};

export default Spinbutton;
