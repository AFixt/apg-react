/**
 * Button component.
 *  This implementation assumes that the action function passed
 *  as a prop handles the specific action to be performed by the button.
 *  For a complete, production-ready component, additional logic for
 *  handling focus after dialog interactions and more sophisticated
 *  state management would be necessary.
 *  This is just a foundational implementation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.action - The action to be performed when the button is clicked.
 * @param {string} props.label - The label text of the button.
 * @param {string} [props.shortcutKey] - The shortcut key for the button.
 * @param {string} [props.ariaDescribedby] - The ID of the element that describes the button.
 * @param {boolean} [props.isDisabled=false] - Determines if the button is disabled.
 * @param {string} [props.disabledStyle='native'] - How a disabled button is
 *   disabled. 'native' removes it from the tab order; 'aria' keeps it focusable
 *   and exposes aria-disabled, for buttons whose disabled reason a user needs to
 *   be able to discover.
 * @param {boolean} [props.isToggleButton=false] - Determines if the button is a toggle button.
 * @param {boolean} [props.toggleState=false] - The initial state of the toggle button.
 * @returns {JSX.Element} The rendered Button component.
 */
import React, { useEffect, useRef, useState } from 'react';
import './Button.css';

/** Props for the Button component. */
interface ButtonProps {
  action: () => void;
  label: string;
  shortcutKey?: string;
  ariaDescribedby?: string;
  ariaHaspopup?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true';
  isDisabled?: boolean;
  /**
   * How `isDisabled` is expressed. 'native' (the default, and today's
   * behaviour) sets the disabled attribute, which removes the button from the
   * tab order and from the accessibility tree's interactive surface. 'aria'
   * keeps it focusable and sets aria-disabled="true" instead, which APG
   * recommends whenever a user needs to be able to reach the control to
   * discover why it is unavailable.
   */
  disabledStyle?: 'native' | 'aria';
  isToggleButton?: boolean;
  toggleState?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  action,
  label,
  shortcutKey,
  ariaDescribedby,
  ariaHaspopup,
  isDisabled,
  disabledStyle = 'native',
  isToggleButton,
  toggleState,
}) => {
  const isAriaDisabled = Boolean(isDisabled) && disabledStyle === 'aria';
  const [pressed, setPressed] = useState(toggleState);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle keydown events for Enter, Space, and shortcut keys
  const handleKeyDown = (event: KeyboardEvent | React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      buttonAction();
    }
    if (shortcutKey && event.key === shortcutKey) {
      event.preventDefault();
      buttonAction();
    }
  };

  // Toggle button action
  const toggleButtonAction = () => {
    setPressed(!pressed);
    action();
  };

  // Button action
  const buttonAction = () => {
    // A natively disabled button never fires; an aria-disabled one is still
    // focusable and clickable, so the action has to be suppressed here.
    if (isAriaDisabled) return;
    if (isToggleButton) {
      toggleButtonAction();
    } else {
      action();
    }
    // Focus management after activation can be handled here
  };

  useEffect(() => {
    if (shortcutKey) {
      window.addEventListener('keydown', handleKeyDown as EventListener);
      return () => {
        window.removeEventListener('keydown', handleKeyDown as EventListener);
      };
    }
    return undefined;
  }, [shortcutKey]);

  return (
    <button
      ref={buttonRef}
      className={`button${isToggleButton ? ' button-toggle' : ''}${isToggleButton && pressed ? ' is-pressed' : ''}`}
      aria-pressed={isToggleButton ? pressed : undefined}
      aria-haspopup={ariaHaspopup || undefined}
      aria-describedby={ariaDescribedby || undefined}
      disabled={(isDisabled && disabledStyle === 'native') || undefined}
      aria-disabled={isAriaDisabled || undefined}
      onClick={buttonAction}
      onKeyDown={handleKeyDown}
    >
      {isToggleButton && pressed && (
        <span className="button-toggle-indicator" aria-hidden="true">
          {'\u2713'}
        </span>
      )}
      {label}
    </button>
  );
};

/** Accessible implementation of the WAI-ARIA APG Button pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Button;
