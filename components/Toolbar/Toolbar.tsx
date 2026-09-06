/**
 * Toolbar — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 *
 * Keyboard model:
 *   - Tab: into toolbar lands on the roving item; Tab out exits.
 *   - Arrow Left / Right (or Up / Down for vertical): move among items.
 *   - Home / End: first / last item.
 *   - Disabled items are skipped.
 */
import React, { Children, cloneElement, useRef, useState } from 'react';
import './Toolbar.css';

/** Props for the Toolbar component. */
interface ToolbarProps {
  label?: string;
  ariaLabelledby?: string;
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

// Toolbar accepts arbitrary interactive children (buttons, links, custom
// components) and enhances them via cloneElement. Typing this strictly would
// require every consumer to declare a matching prop shape, so we use a
// narrow any for the child-cloning surface.
/* eslint-disable @typescript-eslint/no-explicit-any */
/** Toolbar Child used by the Toolbar component. */
type ToolbarChild = React.ReactElement<any>;

const Toolbar: React.FC<ToolbarProps> = ({ label, ariaLabelledby, orientation, children }) => {
  const items = Children.toArray(children).filter(Boolean) as ToolbarChild[];
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  // The tab stop starts on the first item a keyboard can actually use. Both
  // forms of unavailable count: the native `disabled` prop, and
  // `aria-disabled`, which is how this library marks an item that stays
  // focusable and discoverable. Reading only the first would put the tab stop
  // on an `aria-disabled` item whenever it happened to be first.
  const isUnavailable = (c: ToolbarChild) =>
    !!c.props?.disabled || String(c.props?.['aria-disabled']) === 'true';
  const [focusIndex, setFocusIndex] = useState(() => {
    const first = items.findIndex((c) => !isUnavailable(c));
    return first >= 0 ? first : 0;
  });

  // Clamped at render rather than trusted: the stored index survives a change to
  // the collection, and if it now points past the end nothing gets tabIndex 0 --
  // the widget silently drops out of the tab order. See #218.
  const renderedFocus = Math.min(focusIndex, Math.max(0, items.length - 1));

  const focusable = (i: number) => {
    const el = itemRefs.current[i];
    if (!el || (el as HTMLButtonElement).disabled) return false;
    // Compare against "true" rather than testing the attribute for presence.
    // React renders `aria-disabled={false}` as the string "false", which is
    // truthy, so a presence test read a control the consumer had explicitly
    // marked available as unavailable and dropped it from arrow-key traversal.
    return el.getAttribute?.('aria-disabled') !== 'true';
  };

  const findNext = (from: number, dir: number) => {
    const n = items.length;
    for (let i = 1; i <= n; i++) {
      const idx = (from + dir * i + n) % n;
      if (focusable(idx)) return idx;
    }
    return from;
  };

  const moveTo = (i: number) => {
    setFocusIndex(i);
    itemRefs.current[i]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    const isHorizontal = orientation !== 'vertical';
    const next = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prev = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    let handled = true;
    switch (e.key) {
      case next:
        moveTo(findNext(i, 1));
        break;
      case prev:
        moveTo(findNext(i, -1));
        break;
      case 'Home':
        moveTo(findNext(-1, 1));
        break;
      case 'End':
        moveTo(findNext(items.length, -1));
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  };

  return (
    <div
      role="toolbar"
      aria-label={ariaLabelledby ? undefined : label}
      aria-labelledby={ariaLabelledby}
      aria-orientation={orientation || 'horizontal'}
      className={`toolbar toolbar-${orientation || 'horizontal'}`}
    >
      {items.map((child, i) =>
        cloneElement(child, {
          key: child.key ?? i,
          ref: (el: HTMLElement | null) => (itemRefs.current[i] = el),
          tabIndex: i === renderedFocus ? 0 : -1,
          onKeyDown: (e: React.KeyboardEvent) => {
            child.props.onKeyDown?.(e);
            if (!e.defaultPrevented) handleKeyDown(e, i);
          },
          onFocus: (e: React.FocusEvent) => {
            child.props.onFocus?.(e);
            // An unavailable item can still take focus -- that is the point of
            // `aria-disabled` -- but it must not take the tab stop with it, or
            // the next Tab into the toolbar lands on a control that does
            // nothing. The stop stays where the keyboard left it.
            if (focusable(i)) setFocusIndex(i);
          },
        }),
      )}
    </div>
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Accessible implementation of the WAI-ARIA APG Toolbar pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Toolbar;
