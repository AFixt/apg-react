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
  // `useId` returns something like ":r0:", and the colons are not incidental --
  // React picks them precisely because they cannot appear in an author-written
  // id. They also make the id unusable in a selector: `querySelector('#tooltip-:r0:')`
  // throws. Anything that resolves `aria-describedby` by building a selector
  // from it therefore fails to find this tooltip and reports it as missing.
  // Stripping them keeps the per-instance uniqueness and costs nothing.
  const tooltipId = `tooltip-${uid.replace(/:/g, '')}`;

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
        // Showing from the trigger as well as from the container costs nothing
        // -- the state is already true by the time the container sees the
        // pointer -- and it keeps the tooltip working for a trigger that
        // overflows its container.
        'onMouseEnter': showTooltip,
        'onFocus': showTooltip,
        'onBlur': hideTooltip,
        'tabIndex': 0,
        'aria-describedby': isVisible ? tooltipId : undefined,
      });
    }
    return child;
  };

  return (
    /*
     * WCAG 1.4.13 requires content shown on hover to stay put while the pointer
     * moves onto it. Hiding on the trigger's own mouseleave breaks that: the
     * tooltip sits beside the trigger, so reaching it means leaving the trigger
     * and the tooltip vanishes on the way. The container wraps both, so leaving
     * it is the real "pointer has gone" signal.
     */
    <div className="tooltip-container" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
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
