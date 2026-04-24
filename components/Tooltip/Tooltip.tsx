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
import React, { cloneElement, isValidElement, useRef, useState } from 'react';
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

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') hideTooltip();
  };

  const enhanceChild = (child: React.ReactNode) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        'onMouseEnter': showTooltip,
        'onMouseLeave': hideTooltip,
        'onFocus': showTooltip,
        'onBlur': hideTooltip,
        'onKeyDown': handleKeyPress,
        'tabIndex': 0,
        'aria-describedby': isVisible ? 'tooltip-text' : undefined,
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
          id="tooltip-text"
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
