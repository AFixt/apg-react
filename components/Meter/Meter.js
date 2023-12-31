/**
 * A meter component that displays a value within a specified range.
 *  The userFriendlyText function should be implemented to provide
 *  meaningful interpretations of the meter value if needed.
 *  This implementation provides a foundational structure for a meter component,
 *  and you may need to adjust it to fit the specific requirements and context of your application.
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
import React from "react";
import PropTypes from "prop-types";
import "./Meter.css";

const Meter = ({
    value,
    minValue,
    maxValue,
    label,
    labelId,
    userFriendlyText,
}) => {
    const getAriaValueText = () => {
        return userFriendlyText ? userFriendlyText(value) : `${value}`;
    };

    return (
        <div className="meter-container">
            {label && <label id={labelId}>{label}</label>}
            <meter
                role="meter"
                aria-valuenow={value}
                aria-valuemin={minValue}
                aria-valuemax={maxValue}
                aria-valuetext={getAriaValueText()}
                aria-labelledby={label ? labelId : undefined}
            />
        </div>
    );
};

Meter.propTypes = {
    value: PropTypes.number.isRequired,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    label: PropTypes.string,
    labelId: PropTypes.string,
    userFriendlyText: PropTypes.func,
};

Meter.defaultProps = {
    minValue: 0,
    maxValue: 100,
    labelId: "meter-label",
};

export default Meter;
