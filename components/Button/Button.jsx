/**
 * Button component.
 *  This implementation assumes that the action function passed
 *  as a prop handles the specific action to be performed by the button.
 *  For a complete, production-ready component, additional logic for
 *  handling focus after dialog interactions and more sophisticated
 *  state management would be necessary.
 *  This is just a foundational implementation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.action - The action to be performed when the button is clicked.
 * @param {string} props.label - The label text of the button.
 * @param {string} [props.shortcutKey] - The shortcut key for the button.
 * @param {string} [props.ariaDescribedby] - The ID of the element that describes the button.
 * @param {boolean} [props.isDisabled=false] - Determines if the button is disabled.
 * @param {boolean} [props.isToggleButton=false] - Determines if the button is a toggle button.
 * @param {boolean} [props.toggleState=false] - The initial state of the toggle button.
 * @returns {JSX.Element} The rendered Button component.
 */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Button.css";

const Button = ({
    action,
    label,
    shortcutKey,
    ariaDescribedby,
    isDisabled,
    isToggleButton,
    toggleState,
}) => {
    const [pressed, setPressed] = useState(toggleState);
    const buttonRef = useRef(null);

    // Handle keydown events for Enter, Space, and shortcut keys
    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            buttonAction();
        }
        if (shortcutKey && event.key === shortcutKey) {
            event.preventDefault();
            buttonAction();
        }
    };

    // Toggle button action
    const toggleButtonAction = () => {
        setPressed(!pressed);
        action();
    };

    // Button action
    const buttonAction = () => {
        if (isToggleButton) {
            toggleButtonAction();
        } else {
            action();
        }
        // Focus management after activation can be handled here
    };

    useEffect(() => {
        if (shortcutKey) {
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [shortcutKey]);

    return (
        <button
            ref={buttonRef}
            role="button"
            aria-pressed={isToggleButton ? pressed : undefined}
            aria-haspopup={label === "Menu" ? "menu" : undefined}
            aria-disabled={isDisabled || undefined}
            aria-describedby={ariaDescribedby || undefined}
            disabled={isDisabled}
            onClick={buttonAction}
            onKeyDown={handleKeyDown}
        >
            {label}
        </button>
    );
};

Button.propTypes = {
    action: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    shortcutKey: PropTypes.string,
    ariaDescribedby: PropTypes.string,
    isDisabled: PropTypes.bool,
    isToggleButton: PropTypes.bool,
    toggleState: PropTypes.bool,
};

export default Button;
