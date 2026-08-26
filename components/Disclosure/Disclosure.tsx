import React, { useId, useState } from 'react';
import './Disclosure.css';

/** Props for the Disclosure component. */
interface DisclosureProps {
  title: React.ReactNode;
  children: React.ReactNode;
  /** Renders expanded on first paint. The disclosure still owns its state after that. */
  defaultOpen?: boolean;
  /**
   * Keeps the content out of the DOM entirely until first expanded, rather than
   * rendering it hidden. Use for content that is expensive to build or that
   * should not be in the document until asked for -- with the default, the
   * content is always present and merely hidden.
   */
  unmountWhenClosed?: boolean;
}

const Disclosure: React.FC<DisclosureProps> = ({
  title,
  children,
  defaultOpen = false,
  unmountWhenClosed = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const uid = useId();
  const contentId = `disclosure-content-${uid}`;

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleVisibility();
    }
  };

  return (
    <div className="disclosure-widget">
      <button
        className="disclosure-control"
        onClick={toggleVisibility}
        onKeyDown={handleKeyPress}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        {title}
        <span className="indicator" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      <div className={`disclosure-content ${!isOpen ? 'hidden' : ''}`} id={contentId}>
        {unmountWhenClosed && !isOpen ? null : children}
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Disclosure pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Disclosure;
