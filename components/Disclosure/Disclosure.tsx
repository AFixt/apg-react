import React, { useState } from "react";
import "./Disclosure.css";

interface DisclosureProps {
    title: React.ReactNode;
    children: React.ReactNode;
}

const Disclosure: React.FC<DisclosureProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleVisibility = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
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

export default Disclosure;
