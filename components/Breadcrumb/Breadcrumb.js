/**
 * Breadcrumb component for displaying a breadcrumb navigation.
 *
 * @component
 * @param {Object[]} items - An array of breadcrumb items.
 * @param {string} items[].path - The path of the breadcrumb item.
 * @param {string} items[].label - The label of the breadcrumb item.
 * @returns {JSX.Element} The rendered Breadcrumb component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Breadcrumb.css'; // Assume appropriate CSS for styling

const Breadcrumb = ({ items }) => {
  const isLast = (index) => index === items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={item.path} className="breadcrumb-item">
            {!isLast(index) ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Breadcrumb;
