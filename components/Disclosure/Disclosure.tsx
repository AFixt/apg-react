import React, { useId, useState } from 'react';
import './Disclosure.css';

/** Props for the Disclosure component. */
interface DisclosureProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const Disclosure: React.FC<DisclosureProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
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
        {children}
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Disclosure pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Disclosure;
