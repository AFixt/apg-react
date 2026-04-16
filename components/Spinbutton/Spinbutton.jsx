/**
 * A customizable spin button component.
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Spinbutton.css";

const Spinbutton = ({ min, max, step, ariaLabel, ariaLabelledby, initialValue }) => {
    const [value, setValue] = useState(initialValue ?? min ?? 0);
    const [isInvalid, setIsInvalid] = useState(false);

    const changeValue = (newValue) => {
        if (newValue >= min && newValue <= max) {
            setValue(newValue);
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
    };

    const handleKeyDown = (e) => {
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

    const handleInputChange = (e) => {
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
                aria-label="Increase value"
                tabIndex={-1}
                onClick={() => changeValue(value + step)}
            >
                <span aria-hidden="true">&#x25B2;</span>
            </button>
            <button
                type="button"
                className="spinbutton-arrow spinbutton-arrow-down"
                aria-label="Decrease value"
                tabIndex={-1}
                onClick={() => changeValue(value - step)}
            >
                <span aria-hidden="true">&#x25BC;</span>
            </button>
        </div>
    );
};

Spinbutton.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number,
    ariaLabel: PropTypes.string,
    ariaLabelledby: PropTypes.string,
    initialValue: PropTypes.number,
};

Spinbutton.defaultProps = {
    step: 1,
};

export default Spinbutton;
