import React, { useState } from 'react';
import Accordion from '../../components/Accordion/Accordion';
import { mount } from './mount';

const items = [
  { title: 'Section 1', content: 'Content 1' },
  { title: 'Section 2', content: 'Content 2' },
  { title: 'Section 3', content: 'Content 3' },
];

/**
 * Accordion demo, at-least-one-open variant.
 *
 * One panel is open on load and collapsing it is a no-op, so the accordion can
 * never reach a fully-collapsed state. The open header carries
 * `aria-disabled="true"` to say so *before* the user tries, rather than letting
 * them activate a control that silently does nothing.
 *
 * The no-op itself belongs here rather than in the component: `Accordion` is
 * externally controlled and the demo already owns `openIndex`, so the variant
 * is a property of how the consumer drives it. Only the `aria-disabled`
 * pass-through needed a component change.
 *
 * A separate page rather than a mode on `accordion.html`, because the default
 * page asserts the opposite — that collapsing the open panel closes it. The two
 * genuinely cannot share a page.
 *
 * Addressed by `apg-qa` as `accordion_always_open_url`.
 */
function AccordionAlwaysOpenDemo(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <main className="demo-page">
      <h1>Accordion — at least one open</h1>
      <Accordion
        items={items.map((item, index) => ({ ...item, disabled: index === openIndex }))}
        openIndex={openIndex}
        toggleItem={(index) => {
          // Collapsing the only open panel is a no-op: this variant always
          // keeps one open.
          if (index === openIndex) return;
          setOpenIndex(index);
        }}
      />
    </main>
  );
}

mount(<AccordionAlwaysOpenDemo />);
