import React from 'react';
import Disclosure from '../../components/Disclosure/Disclosure';
import { mount } from './mount';

/**
 * Disclosure demo, expanded-on-load state.
 *
 * A separate page rather than a query parameter on `disclosure.html`, because
 * `disclosure.html` must stay collapsed on load: that is the only state from
 * which both halves of the interaction can be exercised in one pass, and the
 * default page's cases depend on it.
 *
 * Addressed by `apg-qa` as `disclosure_expanded_url`.
 */
function DisclosureExpandedDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Disclosure — expanded on load</h1>
      <Disclosure title="Click Me" defaultOpen>
        This is the content to be displayed when the disclosure is open.
      </Disclosure>
    </main>
  );
}

mount(<DisclosureExpandedDemo />);
