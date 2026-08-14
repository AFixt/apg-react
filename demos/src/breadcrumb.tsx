import React from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { mount } from './mount';

const items = [
  { path: '/', label: 'Home' },
  { path: '/library', label: 'Library' },
  { path: '/library/data', label: 'Data' },
  { path: '/library/data/current', label: 'Current Page' },
];

/**
 * Breadcrumb demo: a four-level trail ending on the current page.
 *
 * No `LinkComponentProvider` wraps this page, so every non-current item
 * renders the component's dependency-free default: a real `<a href>`.
 * Activating one changes the browser's URL exactly as any anchor does, even
 * though the target paths are not routes this demo server serves. The last
 * item is deliberately not a link — the APG pattern renders the current page
 * as a plain, non-interactive `aria-current="page"` element, because it is
 * pointless (and inaccessible-navigation-wise redundant) to link to the page
 * already showing.
 */
function BreadcrumbDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Breadcrumb</h1>
      <Breadcrumb items={items} />
    </main>
  );
}

mount(<BreadcrumbDemo />);
