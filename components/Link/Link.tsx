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
import { Link as RouterLink } from 'react-router-dom';
import './Link.css';

interface LinkProps {
    to: string | object;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    [extra: string]: unknown;
}

const AccessibleLink: React.FC<LinkProps> = ({ to, children, onClick, ...props }) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
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
            to={to as string}
            {...props}
            role="link"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {children}
        </RouterLink>
    );
};

export default AccessibleLink;
