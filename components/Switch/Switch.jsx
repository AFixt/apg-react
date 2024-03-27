/**
 * A custom switch component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the switch.
 * @param {string} props.ariaLabelledby - The ID of the element that labels the switch.
 * @param {string} props.ariaDescribedby - The ID of the element that describes the switch.
 * @param {boolean} props.initialChecked - The initial checked state of the switch.
 * @returns {JSX.Element} The switch component.
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Switch.css"; // Assume appropriate CSS for styling

const Switch = ({ label, ariaLabelledby, ariaDescribedby, initialChecked }) => {
    const [isChecked, setIsChecked] = useState(initialChecked);

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 32 || e.key === "Enter") {
            e.preventDefault();
            toggleSwitch();
        }
    };

    return (
        <div className="switch-container">
            <label>
                {label}
                <span
                    role="switch"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyPress={handleKeyPress}
                    onClick={toggleSwitch}
                    aria-labelledby={ariaLabelledby}
                    aria-describedby={ariaDescribedby}
                >
                    <span
                        className={`switch ${
                            isChecked ? "switch-on" : "switch-off"
                        }`}
                    ></span>
                </span>
            </label>
        </div>
    );
};

Switch.propTypes = {
    label: PropTypes.string,
    ariaLabelledby: PropTypes.string,
    ariaDescribedby: PropTypes.string,
    initialChecked: PropTypes.bool,
};

Switch.defaultProps = {
    initialChecked: false,
};

export default Switch;
