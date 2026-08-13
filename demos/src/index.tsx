import React from 'react';
import { mount } from './mount';

// Enumerated from disk rather than hand-listed so the index cannot drift out of
// step with the pages that actually exist: adding demos/<slug>.html is enough.
const pages = Object.keys(import.meta.glob('../*.html'))
  .map((path) => path.replace('../', '').replace('.html', ''))
  .filter((slug) => slug !== 'index')
  .sort();

/**
 * Converts a demo slug into a human-readable page name.
 * @param slug The demo's file-name slug, e.g. `modal-dialog`.
 * @returns The slug in title case, e.g. `Modal dialog`.
 */
function titleOf(slug: string): string {
  const spaced = slug.split('-').join(' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Index of the demo server: one link per pattern demo page.
 *
 * The `apg-qa` use-case suite and the six APG test-runner repos address these
 * pages by URL, so this page exists for humans checking what is available.
 */
function IndexDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>APG-React pattern demos</h1>
      <p>
        {pages.length} demo pages, each rendering the library&rsquo;s own component for one WAI-ARIA
        APG pattern.
      </p>
      <ul>
        {pages.map((slug) => (
          <li key={slug}>
            <a href={`./${slug}.html`}>{titleOf(slug)}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

mount(<IndexDemo />);
