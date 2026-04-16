import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Disclosure.css";

const Disclosure = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleVisibility = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleVisibility();
        }
    };

    return (
        <div className="disclosure-widget">
            <button
                className="disclosure-control"
                onClick={toggleVisibility}
                onKeyDown={handleKeyPress}
                aria-expanded={isOpen}
                aria-controls="disclosure-content"
            >
                {title}
                <span className="indicator">{isOpen ? "▲" : "▼"}</span>
            </button>
            <div className={`disclosure-content ${!isOpen ? 'hidden' : ''}`} id="disclosure-content">
                {children}
            </div>
        </div>
    );
};

Disclosure.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Disclosure;
