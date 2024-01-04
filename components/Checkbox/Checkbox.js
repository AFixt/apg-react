import React from "react";
import PropTypes from "prop-types";
import "./Checkbox.css";

const Checkbox = ({ label, checked, onChange, ariaLabelledby, ariaDescribedby, isTriState }) => {
    const checkboxId = `checkbox-${label.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const handleKeyPress = (e) => {
        if (e.key === " ") {
            e.preventDefault();
            const newChecked = isTriState ? (checked === true ? false : checked === false ? null : true) : !checked;
            onChange(newChecked);
        }
    };

    return (
        <div className="checkbox">
            <input
                id={checkboxId}
                type="checkbox"
                checked={checked === true}
                onChange={() => onChange(isTriState ? (checked === true ? false : checked === false ? null : true) : !checked)}
                onKeyDown={handleKeyPress}
                aria-checked={isTriState ? (checked === null ? "mixed" : checked) : checked}
                aria-describedby={ariaDescribedby}
            />
            <label htmlFor={checkboxId}>{label}</label>
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
