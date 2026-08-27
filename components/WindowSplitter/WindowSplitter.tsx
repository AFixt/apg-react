/**
 * WindowSplitter — APG pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 *
 * A moveable separator between two panes, operable from the keyboard.
 *
 *   - role="separator" on the splitter, with tabIndex 0 so it is a tab stop.
 *   - aria-valuenow / aria-valuemin / aria-valuemax describe the *primary*
 *     pane's size as a percentage of the container.
 *   - aria-controls points at the primary pane.
 *   - aria-orientation says which way the separator itself runs.
 *
 * Keyboard model (a vertical separator, i.e. side-by-side panes):
 *   - Left / Right Arrow: shrink / grow the primary pane by `step`.
 *   - Home / End: move to the minimum / maximum position.
 *   - Enter: collapse the primary pane, or restore it if already collapsed.
 *
 * A horizontal separator (stacked panes) uses Up / Down instead. Both are
 * accepted either way, since a user cannot always tell which orientation a
 * given splitter claims.
 */
import React, { useId, useRef, useState } from 'react';
import './WindowSplitter.css';

/** Props for the WindowSplitter component. */
interface WindowSplitterProps {
  /** Accessible name for the separator. APG requires one. */
  label?: string;
  /** Id of an element naming the separator. Takes precedence over `label`. */
  labelledBy?: string;
  /**
   * Orientation of the separator itself. "vertical" is a vertical bar between
   * side-by-side panes; "horizontal" is a bar between stacked panes.
   */
  orientation?: 'vertical' | 'horizontal';
  /** Smallest size, as a percentage, the primary pane can be dragged to. */
  min?: number;
  /** Largest size, as a percentage, the primary pane can be dragged to. */
  max?: number;
  /** Percentage points moved per arrow-key press. */
  step?: number;
  /** Initial size of the primary pane when uncontrolled. */
  defaultValue?: number;
  /** Controlled size of the primary pane. Omit to let the splitter own it. */
  value?: number;
  /** Reports the primary pane's new size. */
  onChange?: (value: number) => void;
  primary: React.ReactNode;
  secondary: React.ReactNode;
}

const WindowSplitter: React.FC<WindowSplitterProps> = ({
  label,
  labelledBy,
  orientation = 'vertical',
  min = 0,
  max = 100,
  step = 5,
  defaultValue = 50,
  value,
  onChange,
  primary,
  secondary,
}) => {
  const uid = useId();
  const primaryId = `splitter-primary-${uid}`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = isControlled ? value : internalValue;
  // Enter collapses to the minimum, and Enter again restores whatever size the
  // pane had before -- so the size has to survive the collapse.
  const restoreRef = useRef(defaultValue);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const commit = (next: number) => {
    const clamped = clamp(next);
    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);
  };

  const toggleCollapse = () => {
    if (current > min) {
      restoreRef.current = current;
      commit(min);
    } else {
      commit(restoreRef.current > min ? restoreRef.current : max);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let handled = true;
    switch (e.key) {
      // Both axes are accepted regardless of orientation: a keyboard user
      // cannot see which orientation the separator claims, and pressing the
      // "wrong" arrow doing nothing is a worse outcome than accepting both.
      case 'ArrowLeft':
      case 'ArrowUp':
        commit(current - step);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        commit(current + step);
        break;
      case 'Home':
        commit(min);
        break;
      case 'End':
        commit(max);
        break;
      case 'Enter':
        toggleCollapse();
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  };

  const isVertical = orientation === 'vertical';
  const primaryStyle = isVertical ? { width: `${current}%` } : { height: `${current}%` };

  return (
    <div className={`window-splitter window-splitter-${orientation}`}>
      <div id={primaryId} className="window-splitter-pane" style={primaryStyle}>
        {primary}
      </div>
      <div
        role="separator"
        tabIndex={0}
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        aria-orientation={orientation}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-controls={primaryId}
        className="window-splitter-separator"
        onKeyDown={handleKeyDown}
      />
      <div className="window-splitter-pane window-splitter-pane-secondary">{secondary}</div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Window Splitter pattern. See the top-of-file comment for keyboard and ARIA details. */
export default WindowSplitter;
