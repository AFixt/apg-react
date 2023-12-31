/**
 * A disclosure component that allows toggling the visibility of its content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the disclosure.
 * @param {ReactNode} props.children - The content to be displayed when the disclosure is open.
 * @returns {JSX.Element} The rendered disclosure component.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Disclosure.css'; // Assume appropriate CSS for styling

const Disclosure = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
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
        role="button"
      >
        {title}
        <span className="indicator">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="disclosure-content" id="disclosure-content">
          {children}
        </div>
      )}
    </div>
  );
};

Disclosure.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Disclosure;
