/**
 * A customizable slider component for React.
 *
 * Supports keyboard (APG pattern), click-on-track, and pointer drag.
 */
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Slider.css";

const Slider = ({
    min,
    max,
    step,
    initialValue,
    ariaLabel,
    ariaLabelledby,
    isVertical,
    getUserFriendlyValue,
}) => {
    const [value, setValue] = useState(initialValue ?? min);
    const containerRef = useRef(null);
    const thumbRef = useRef(null);

    const clamp = (v) => Math.max(min, Math.min(max, v));

    const snapToStep = (raw) => {
        const steps = Math.round((raw - min) / step);
        return clamp(min + steps * step);
    };

    const handleChange = (newValue) => {
        setValue(clamp(newValue));
    };

    const handleKeyPress = (e) => {
        let handled = true;
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
                handleChange(value + step * 10);
                break;
            case "PageDown":
                handleChange(value - step * 10);
                break;
            default:
                handled = false;
                break;
        }
        if (handled) e.preventDefault();
    };

    const valueFromPointer = (clientX, clientY) => {
        const rect = containerRef.current.getBoundingClientRect();
        const ratio = isVertical
            ? 1 - (clientY - rect.top) / rect.height
            : (clientX - rect.left) / rect.width;
        const raw = min + Math.max(0, Math.min(1, ratio)) * (max - min);
        return snapToStep(raw);
    };

    const handlePointerDown = (e) => {
        if (!containerRef.current) return;
        e.preventDefault();
        thumbRef.current?.focus();
        const newValue = valueFromPointer(e.clientX, e.clientY);
        setValue(newValue);

        const handleMove = (ev) => {
            setValue(valueFromPointer(ev.clientX, ev.clientY));
        };
        const handleUp = () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
    };

    const ariaValuetext = getUserFriendlyValue
        ? getUserFriendlyValue(value)
        : `${value}`;

    const percent = ((value - min) / (max - min)) * 100;
    const thumbStyle = isVertical
        ? { top: `${100 - percent}%` }
        : { left: `${percent}%` };

    return (
        <div
            ref={containerRef}
            className={`slider-container${isVertical ? " vertical" : ""}`}
            onPointerDown={handlePointerDown}
        >
            <div
                ref={thumbRef}
                role="slider"
                aria-valuenow={value}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuetext={ariaValuetext}
                aria-label={ariaLabelledby ? undefined : ariaLabel}
                aria-labelledby={ariaLabelledby}
                aria-orientation={isVertical ? "vertical" : "horizontal"}
                tabIndex={0}
                onKeyDown={handleKeyPress}
                style={thumbStyle}
            />
        </div>
    );
};

Slider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number,
    initialValue: PropTypes.number,
    ariaLabel: PropTypes.string,
    ariaLabelledby: PropTypes.string,
    isVertical: PropTypes.bool,
    getUserFriendlyValue: PropTypes.func,
};

Slider.defaultProps = {
    step: 1,
    isVertical: false,
};

export default Slider;
