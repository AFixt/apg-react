/**
 * Breadcrumb component for displaying a breadcrumb navigation.
 *  It should be styled appropriately with CSS to ensure the correct
 *  visual representation. Additionally, you may need to customize this
 *  component further based on the specific routing and styling requirements of your application.
 *
 *  Rendering is router-agnostic: trail items are plain `<a href>` elements by
 *  default, so the library carries no router dependency. Supply React Router's
 *  `Link` (or any equivalent) via the `linkComponent` prop or a surrounding
 *  `LinkComponentProvider` to get client-side navigation.
 *
 * @component
 * @param {Object[]} items - An array of breadcrumb items.
 * @param {string} items[].path - The path of the breadcrumb item.
 * @param {string} items[].label - The label of the breadcrumb item.
 * @param {React.ComponentType} [linkComponent] - Link component to render with; defaults to the provider value, then to a plain anchor.
 * @returns {JSX.Element} The rendered Breadcrumb component.
 */
import React from 'react';
import type { LinkComponent } from '../internal/link-component';
import { toHref, useLinkComponent } from '../internal/link-component';
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
  linkComponent?: LinkComponent | null;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, navLabel, labels, linkComponent }) => {
  const defaultLabels: BreadcrumbLabels = {
    nav: 'Breadcrumb',
  };
  const l = { ...defaultLabels, ...labels };
  const isLast = (index: number) => index === items.length - 1;
  const Link = useLinkComponent(linkComponent);

  const renderLink = (item: BreadcrumbItem) =>
    Link ? <Link to={item.path}>{item.label}</Link> : <a href={toHref(item.path)}>{item.label}</a>;

  return (
    <nav aria-label={navLabel || l.nav} className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={item.path} className="breadcrumb-item">
            {!isLast(index) ? renderLink(item) : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/** Accessible implementation of the WAI-ARIA APG Breadcrumb pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Breadcrumb;
