/**
 *
 * To use the AccessibleLink component in a React application,
 * you need to import it into the file where you want to display an accessible link.
 *
 * This component extends the functionality of a standard link by
 * adding keyboard accessibility features, such as triggering an onClick
 * event when the 'Enter' key is pressed and potentially opening a context menu on 'Shift + F10'.
 *
 * In this example, NavBar is a component that renders a navigation bar
 * with several AccessibleLink components.
 *
 * Each AccessibleLink is provided
 * with a to prop, which is the URL or location object the link navigates to.
 *
 * The handleClick function is attached to the 'Home' link to demonstrate
 * how an onClick event handler can be used. This makes the AccessibleLink
 * not only navigable via a mouse click but also accessible through keyboard
 * navigation, enhancing the accessibility of your web application.
 */

import React from 'react';
import AccessibleLink from './AccessibleLink'; // Adjust the import path based on your project structure

function NavBar() {
  const handleClick = (event) => {
    // Handle the click event
    console.log('Link clicked', event);
  };

  return (
    <nav>
      <h1>My Website</h1>
      <ul>
        <li>
          <AccessibleLink to="/home" onClick={handleClick}>
            Home
          </AccessibleLink>
        </li>
        <li>
          <AccessibleLink to="/about">
            About
          </AccessibleLink>
        </li>
        <li>
          <AccessibleLink to="/contact">
            Contact
          </AccessibleLink>
        </li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
}

export default NavBar;
