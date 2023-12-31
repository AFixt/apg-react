/**
 * A customizable spin button component.
 *
 * @component
 * @param {object} props - The component props.
 * @param {number} props.min - The minimum value allowed.
 * @param {number} props.max - The maximum value allowed.
 * @param {number} [props.step=1] - The increment or decrement step.
 * @param {string} [props.ariaLabelledby] - The ID of the element that labels the spin button.
 * @param {number} [props.initialValue] - The initial value of the spin button.
 * @returns {JSX.Element} The spin button component.
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Spinbutton.css"; // Assume appropriate CSS for styling

const Spinbutton = ({ min, max, step, ariaLabelledby, initialValue }) => {
    const [value, setValue] = useState(initialValue || min || 0);
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
                changeValue(value + step);
                break;
            case "ArrowDown":
                changeValue(value - step);
                break;
            case "PageUp":
                changeValue(value + step * 10); // Optional: larger increment
                break;
            case "PageDown":
                changeValue(value - step * 10); // Optional: larger decrement
                break;
            case "Home":
                changeValue(min); // Optional: set to minimum
                break;
            case "End":
                changeValue(max); // Optional: set to maximum
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
                aria-valuenow={value}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuetext={value} // Adjust if a more user-friendly representation is needed
                aria-labelledby={ariaLabelledby}
                aria-invalid={isInvalid}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

Spinbutton.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number,
    ariaLabelledby: PropTypes.string,
    initialValue: PropTypes.number,
};

Spinbutton.defaultProps = {
    step: 1,
};

export default Spinbutton;
