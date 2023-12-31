/**
 * Represents an alert component that displays a message with a dismiss button.
 *  This is a basic implementation. Depending on the specific requirements and
 *  styles of your application, you might need to further customize the component,
 *  especially its styling and the way it integrates into your application's overall user interface.
 *
 * @component
 * @param {Object} props - The properties of the Alert component.
 * @param {string} props.message - The message to be displayed in the alert.
 * @param {('info'|'warning'|'error')} props.type - The type of the alert.
 * @returns {JSX.Element|null} The rendered Alert component.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Alert.css';


const Alert = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`alert alert-${type}`}
    >
      <span>{message}</span>
      <button onClick={handleClose}>Dismiss</button>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'warning', 'error']).isRequired,
};

export default Alert;
