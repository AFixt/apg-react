/**
 * Checkbox component that allows users to select or deselect an option.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label text for the checkbox.
 * @param {boolean|null} props.checked - The checked state of the checkbox. Can be true, false, or null for tri-state checkboxes.
 * @param {function} props.onChange - The callback function to be called when the checkbox state changes.
 * @param {string} [props.ariaLabelledby] - The ID of the element that labels the checkbox.
 * @param {string} [props.ariaDescribedby] - The ID of the element that describes the checkbox.
 * @param {boolean} [props.isTriState] - Specifies whether the checkbox is a tri-state checkbox.
 * @returns {JSX.Element} The rendered Checkbox component.
 */
import React from "react";
import PropTypes from "prop-types";
import "./Checkbox.css";

const Checkbox = ({
    label,
    checked,
    onChange,
    ariaLabelledby,
    ariaDescribedby,
    isTriState,
}) => {
    const handleKeyPress = (e) => {
        if (e.key === " ") {
            e.preventDefault();
            onChange(!checked);
        }
    };

    return (
        <div className="checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(!checked)}
                onKeyDown={handleKeyPress}
                aria-checked={
                    isTriState && checked === null ? "mixed" : checked
                }
                aria-labelledby={ariaLabelledby}
                aria-describedby={ariaDescribedby}
            />
            <label>{label}</label>
        </div>
    );
};

Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    checked: PropTypes.oneOf([true, false, null]),
    onChange: PropTypes.func.isRequired,
    ariaLabelledby: PropTypes.string,
    ariaDescribedby: PropTypes.string,
    isTriState: PropTypes.bool,
};

export default Checkbox;
