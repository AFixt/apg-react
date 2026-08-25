import React from 'react';
import LayoutGrid from '../../components/LayoutGrid/LayoutGrid';
import { mount } from './mount';

const items = [
  { label: 'Accordion', href: '/demos/accordion.html' },
  { label: 'Breadcrumb', href: '/demos/breadcrumb.html' },
  { label: 'Carousel', href: '/demos/carousel.html' },
  { label: 'Combobox', href: '/demos/combobox.html' },
  { label: 'Disclosure', href: '/demos/disclosure.html' },
  { label: 'Feed', href: '/demos/feed.html' },
  { label: 'Listbox', href: '/demos/listbox.html' },
  { label: 'Menubar', href: '/demos/menubar.html' },
  { label: 'Slider', href: '/demos/slider.html' },
];

/**
 * Layout Grid demo: nine pattern links in a 3x3 grid.
 *
 * Deliberately a *layout* grid, not a data grid — the cells hold a "single,
 * logically homogenous set of elements" (links) with no column titles, which
 * is how the APG separates the two variants. `demos/grid.html` covers the data
 * grid; the keyboard contracts differ, most sharply in that Control+Home and
 * Control+End are required there and optional here.
 *
 * Three rows and three columns is the smallest shape that exercises every
 * direction plus wrapping at all four edges, and gives Page Up / Page Down
 * somewhere to land.
 */
function LayoutGridDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Layout Grid</h1>
      <p id="layout-grid-caption">Browse the pattern demos</p>
      <LayoutGrid labelledBy="layout-grid-caption" items={items} columns={3} pageSize={2} />
    </main>
  );
}

mount(<LayoutGridDemo />);
