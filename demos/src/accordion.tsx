import React, { useState } from 'react';
import Accordion from '../../components/Accordion/Accordion';
import { mount } from './mount';

const items = [
  { title: 'Section 1', content: 'Content 1' },
  { title: 'Section 2', content: 'Content 2' },
  { title: 'Section 3', content: 'Content 3' },
];

/**
 * Accordion demo: three sections, all collapsed on load, single-panel-open.
 *
 * The component is externally controlled, so the demo owns `openIndex` and
 * enforces the APG's single-open variant — expanding one header collapses
 * whichever was open.
 */
function AccordionDemo(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="demo-page">
      <h1>Accordion</h1>
      <Accordion
        items={items}
        openIndex={openIndex}
        toggleItem={(index) => setOpenIndex(openIndex === index ? null : index)}
      />
    </main>
  );
}

mount(<AccordionDemo />);
