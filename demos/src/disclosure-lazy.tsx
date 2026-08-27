import React from 'react';
import Disclosure from '../../components/Disclosure/Disclosure';
import { mount } from './mount';

/**
 * Disclosure demo, lazily-rendered content.
 *
 * The content is absent from the DOM until first expanded, rather than present
 * and hidden. The distinction matters to anything counting nodes — a
 * `count text "..." is 0` assertion cannot hold against the default page, where
 * the content is always rendered and merely class-hidden.
 *
 * Addressed by `apg-qa` as `disclosure_lazy_url`.
 */
function DisclosureLazyDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Disclosure — lazy content</h1>
      <Disclosure title="Click Me" unmountWhenClosed>
        This is the content to be displayed when the disclosure is open.
      </Disclosure>
    </main>
  );
}

mount(<DisclosureLazyDemo />);
