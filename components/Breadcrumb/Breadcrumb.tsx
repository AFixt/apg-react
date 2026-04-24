/**
 * Breadcrumb component for displaying a breadcrumb navigation.
 *  This implementation assumes the use of React Router for navigation,
 *  and it should be styled appropriately with CSS to ensure the correct
 *  visual representation. Additionally, you may need to customize this
 *  component further based on the specific routing and styling requirements of your application.
 *
 * @component
 * @param {Object[]} items - An array of breadcrumb items.
 * @param {string} items[].path - The path of the breadcrumb item.
 * @param {string} items[].label - The label of the breadcrumb item.
 * @returns {JSX.Element} The rendered Breadcrumb component.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

/** A single item in a Breadcrumb. */
interface BreadcrumbItem {
  path: string;
  label: string;
}

/** Translatable labels for the Breadcrumb component. English defaults are used when a key is omitted. */
interface BreadcrumbLabels {
  nav?: string;
}

/** Props for the Breadcrumb component. */
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  navLabel?: string;
  labels?: BreadcrumbLabels;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, navLabel, labels }) => {
  const defaultLabels: BreadcrumbLabels = {
    nav: 'Breadcrumb',
  };
  const l = { ...defaultLabels, ...labels };
  const isLast = (index: number) => index === items.length - 1;

  return (
    <nav aria-label={navLabel || l.nav} className="breadcrumb-nav">
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

/** Accessible implementation of the WAI-ARIA APG Breadcrumb pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Breadcrumb;
