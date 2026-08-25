import React from 'react';
import Link from '../../components/Link/Link';
import { mount } from './mount';

const logoSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' rx='6' fill='%234f46e5'/%3E%3C/svg%3E";

/**
 * Link demo: a text link, a plain navigational link, and an image-only link.
 *
 * No `LinkComponentProvider` wraps this page, so every link renders the
 * component's dependency-free default: a real `<a href>` (see the top-of-file
 * comment on `components/Link/Link.tsx`). Activating one changes the browser's
 * URL exactly as any anchor does, even though `/docs` is not a route this demo
 * server serves — the page that loads after activation 404s, but the URL
 * change itself is genuine platform behaviour, not something the demo fakes.
 */
function LinkDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Link</h1>
      <div className="demo-section">
        <Link to="/docs">Documentation</Link>
      </div>
      <div className="demo-section">
        <Link to="/">Home</Link>
      </div>
      <div className="demo-section">
        <Link to="/">
          <img src={logoSrc} alt="Company logo" width={32} height={32} />
        </Link>
      </div>
    </main>
  );
}

mount(<LinkDemo />);
