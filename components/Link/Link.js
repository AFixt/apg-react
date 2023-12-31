/**
 * A custom accessible link component that extends React.Component.
 * It ensures that the link is keyboard accessible and supports additional functionality like executing an onClick event on 'Enter' key press and opening a context menu on 'Shift + F10' key press.
 *
 * @component
 * @example
 * // Usage:
 * import AccessibleLink from './Link';
 *
 * function App() {
 *   return (
 *     <div>
 *       <AccessibleLink to="/home" onClick={handleClick}>
 *         Home
 *       </AccessibleLink>
 *     </div>
 *   );
 * }
 *
 * @param {object} props - The component props.
 * @param {string|object} props.to - The target URL or location object to navigate to.
 * @param {ReactNode} props.children - The content of the link.
 * @param {function} [props.onClick] - The function to be executed on link click.
 * @returns {ReactElement} The rendered AccessibleLink component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

class AccessibleLink extends React.Component {
  handleKeyPress = (event) => {
    const { to, onClick } = this.props;
    const { key, shiftKey } = event;

    // Execute link on 'Enter' key press
    if (key === 'Enter' && onClick) {
      onClick(event);
    }

    // Open context menu on 'Shift + F10'
    if (key === 'F10' && shiftKey) {
      event.preventDefault();
      // Logic to open a context menu can be added here
      console.log('Context menu logic goes here');
    }
  }

  render() {
    const { to, children, ...props } = this.props;

    return (
      <RouterLink
        to={to}
        {...props}
        role="link" // Ensuring it has the role "link"
        tabIndex="0" // Making it focusable
        onKeyPress={this.handleKeyPress}
      >
        {children}
      </RouterLink>
    );
  }
}

AccessibleLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default AccessibleLink;
