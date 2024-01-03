/**
 * A customizable slider component for React.
 *
 * @component
 * @param {number} min - The minimum value of the slider.
 * @param {number} max - The maximum value of the slider.
 * @param {number} [step=1] - The increment value for each step of the slider.
 * @param {number} [initialValue=min] - The initial value of the slider.
 * @param {string} [ariaLabelledby] - The ID of the element that labels the slider.
 * @param {boolean} [isVertical=false] - Determines whether the slider is vertical or horizontal.
 * @param {Function} [getUserFriendlyValue] - A function that returns a user-friendly value for the slider.
 * @returns {JSX.Element} The Slider component.
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Slider.css";

const Slider = ({
    min,
    max,
    step,
    initialValue,
    ariaLabelledby,
    isVertical,
    getUserFriendlyValue,
}) => {
    const [value, setValue] = useState(initialValue || min);

    const handleChange = (newValue) => {
        if (newValue >= min && newValue <= max) {
            setValue(newValue);
        }
    };

    const handleKeyPress = (e) => {
        switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
                handleChange(value + step);
                break;
            case "ArrowLeft":
            case "ArrowDown":
                handleChange(value - step);
                break;
            case "Home":
                handleChange(min);
                break;
            case "End":
                handleChange(max);
                break;
            case "PageUp":
                handleChange(value + step * 10); // Larger increment
                break;
            case "PageDown":
                handleChange(value - step * 10); // Larger decrement
                break;
            default:
                break;
        }
    };

    const ariaValuetext = getUserFriendlyValue
        ? getUserFriendlyValue(value)
        : `${value}`;

    return (
        <div
            role="slider"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={ariaValuetext}
            aria-labelledby={ariaLabelledby}
            aria-orientation={isVertical ? "vertical" : "horizontal"}
            tabIndex={0}
            onKeyDown={handleKeyPress}
            style={{
                ...sliderStyle,
                ...(isVertical ? verticalStyle : horizontalStyle),
            }}
        >
            {/* Slider visual representation (e.g., thumb, track) goes here */}
        </div>
    );
};

Slider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number,
    initialValue: PropTypes.number,
    ariaLabelledby: PropTypes.string,
    isVertical: PropTypes.bool,
    getUserFriendlyValue: PropTypes.func,
};

Slider.defaultProps = {
    step: 1,
    isVertical: false,
};

export default Slider;

// Example styles (to be placed in Slider.css)
const sliderStyle = {
    // Common styles for the slider
};

const horizontalStyle = {
    // Specific styles for horizontal orientation
};

const verticalStyle = {
    // Specific styles for vertical orientation
};
