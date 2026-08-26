import React from 'react';

/** A single item in a Accordion. */
interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
  /**
   * Marks this header's toggle as unavailable, exposing aria-disabled="true".
   * The at-least-one-open variant uses it to say, before the user tries, that
   * collapsing the only open panel will do nothing.
   *
   * aria-disabled rather than the native disabled attribute: the header must
   * stay focusable so a keyboard user can still reach it and find out why.
   */
  disabled?: boolean;
}

/** Props for the Accordion component. */
interface AccordionProps {
  items: AccordionItem[];
  openIndex: number | null;
  toggleItem: (index: number) => void;
}

const Accordion: React.FC<AccordionProps> = ({ items, toggleItem, openIndex }) => {
  /**
   * Handles the keydown event for the accordion buttons.
   * @param {Event} event - The keydown event object.
   * @param {number} index - The index of the accordion button.
   */
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const totalItems = items.length;
    let newIndex = index;

    switch (event.key) {
      case 'ArrowDown':
        newIndex = (index + 1) % totalItems;
        break;
      case 'ArrowUp':
        newIndex = (index - 1 + totalItems) % totalItems;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = totalItems - 1;
        break;
      default:
        return;
    }

    // Set focus to the new accordion header
    document.getElementById(`accordion-header-${newIndex}`)?.focus();
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index}>
          <h2>
            <button
              id={`accordion-header-${index}`}
              className="accordion-header"
              onClick={() => toggleItem(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={openIndex === index}
              aria-controls={`panel-${index}`}
              aria-disabled={item.disabled || undefined}
            >
              <span className="accordion-title">{item.title}</span>
              <span className="accordion-chevron" aria-hidden="true" />
            </button>
          </h2>
          <div
            id={`panel-${index}`}
            className={`accordion-body ${openIndex === index ? 'open' : ''}`}
            role="region"
            aria-labelledby={`accordion-header-${index}`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Accordion pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Accordion;
