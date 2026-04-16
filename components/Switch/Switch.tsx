/**
 * A custom switch component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - Visible label text. Rendered as a <span> and
 *   referenced by the switch via aria-labelledby.
 * @param {string} props.ariaLabelledby - ID of an external element that labels
 *   the switch. When provided, `label` is still rendered visually but the
 *   external reference takes precedence.
 * @param {string} props.ariaDescribedby - ID of an element that describes the switch.
 * @param {boolean} props.initialChecked - The initial checked state of the switch.
 * @returns {JSX.Element} The switch component.
 */
import React, { useId, useState } from "react";
import "./Switch.css";

interface SwitchProps {
    label?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    initialChecked?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ label, ariaLabelledby, ariaDescribedby, initialChecked = false }) => {
    const [isChecked, setIsChecked] = useState(initialChecked);
    const generatedId = useId();
    const labelId = `switch-label-${generatedId}`;

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
            {label && (
                <span
                    id={labelId}
                    className="switch-label-text"
                    onClick={toggleSwitch}
                >
                    {label}
                </span>
            )}
            <span
                role="switch"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onClick={toggleSwitch}
                aria-labelledby={ariaLabelledby || (label ? labelId : undefined)}
                aria-describedby={ariaDescribedby}
                className="switch-control"
            >
                <span
                    className={`switch ${isChecked ? "switch-on" : "switch-off"}`}
                ></span>
            </span>
        </div>
    );
};

export default Switch;
