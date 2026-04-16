/**
 * A custom accessible link component.
 * It ensures that the link is keyboard accessible and supports additional
 * functionality like executing an onClick event on 'Enter' key press
 * and opening a context menu on 'Shift + F10' key press.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string|object} props.to - The target URL or location object to navigate to.
 * @param {ReactNode} props.children - The content of the link.
 * @param {function} [props.onClick] - The function to be executed on link click.
 * @returns {ReactElement} The rendered AccessibleLink component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import './Link.css';

const AccessibleLink = ({ to, children, onClick, ...props }) => {
    const handleKeyDown = (event) => {
        const { key, shiftKey } = event;

        if (key === 'Enter' && onClick) {
            onClick(event);
        }

        if (key === 'F10' && shiftKey) {
            event.preventDefault();
        }
    };

    return (
        <RouterLink
            to={to}
            {...props}
            role="link"
            tabIndex="0"
            onKeyDown={handleKeyDown}
        >
            {children}
        </RouterLink>
    );
};

AccessibleLink.propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
};

export default AccessibleLink;
