/**
 * Tooltip component that displays a tooltip when hovered or focused.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be wrapped by the tooltip.
 * @param {string} props.text - The text to be displayed in the tooltip.
 * @param {string} [props.position='top'] - The position of the tooltip relative to the content. Can be 'top', 'right', 'bottom', or 'left'.
 * @returns {JSX.Element} The rendered Tooltip component.
 */
import React, { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import './Tooltip.css';

/** Props for the Tooltip component. */
interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // One id per instance. A shared literal put two elements with the same id in
  // the document whenever one trigger was focused while another was hovered,
  // and IDREF resolution then described both controls with the first one's
  // text.
  const uid = useId();
  const tooltipId = `tooltip-${uid}`;

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  /**
   * WCAG 1.4.13 requires content shown on hover or focus to be dismissible
   * without moving the pointer or focus. A hover-triggered tooltip usually
   * means focus is somewhere else entirely, so a handler bound to the trigger
   * never sees the key -- this has to be listened for at the document level.
   */
  useEffect(() => {
    if (!isVisible) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideTooltip();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isVisible]);

  const enhanceChild = (child: React.ReactNode) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        'onMouseEnter': showTooltip,
        'onMouseLeave': hideTooltip,
        'onFocus': showTooltip,
        'onBlur': hideTooltip,
        'tabIndex': 0,
        'aria-describedby': isVisible ? tooltipId : undefined,
      });
    }
    return child;
  };

  return (
    <div className="tooltip-container">
      {enhanceChild(children)}
      {isVisible && (
        <div
          className="tooltip-text"
          role="tooltip"
          id={tooltipId}
          ref={tooltipRef}
          data-position={position}
        >
          {text}
        </div>
      )}
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Tooltip pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Tooltip;
