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
import "./Switch.css"; // Assume appropriate CSS for styling

interface SwitchProps {
    label?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    initialChecked?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ label, ariaLabelledby, ariaDescribedby, initialChecked = false }) => {
    const [isChecked, setIsChecked] = useState(initialChecked);

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggleSwitch();
        }
    };

    return (
        <div className="switch-container">
            <label>
                <span className="switch-label-text">{label}</span>
                <span
                    role="switch"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onClick={toggleSwitch}
                    aria-labelledby={ariaLabelledby}
                    aria-describedby={ariaDescribedby}
                    className="switch-control"
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

export default Switch;
