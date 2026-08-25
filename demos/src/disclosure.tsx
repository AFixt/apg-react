import React from 'react';
import Disclosure from '../../components/Disclosure/Disclosure';
import { mount } from './mount';

/**
 * Disclosure demo: a single collapsed disclosure.
 *
 * Collapsed-on-load is the state the APG's disclosure pattern describes, and it
 * is the only state from which both the expand and the collapse halves of the
 * interaction can be exercised in one pass.
 */
function DisclosureDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Disclosure</h1>
      <Disclosure title="Click Me">
        This is the content to be displayed when the disclosure is open.
      </Disclosure>
    </main>
  );
}

mount(<DisclosureDemo />);
