/**
 * Tabs — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Keyboard model (horizontal):
 *   - Tab: moves into/out of the tablist, landing on the active tab.
 *   - Arrow Left/Right: move focus among tabs.
 *   - Home / End: first / last tab.
 *   - Enter / Space: activate (only needed for manual activation).
 *
 * `activation="automatic"` (default) selects on focus; "manual" requires Enter/Space.
 */
import React, { useRef, useState } from 'react';
import './Tabs.css';

/** Tab Def used by the Tabs component. */
interface TabDef {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  /**
   * Marks the tab unavailable, exposing aria-disabled="true".
   *
   * aria-disabled rather than the native disabled attribute: APG keeps a
   * disabled tab in the tablist and in the roving tabindex, so arrow keys still
   * reach it and a keyboard user can discover it exists. It simply never
   * becomes the selected tab.
   */
  disabled?: boolean;
}

/** Props for the Tabs component. */
interface TabsProps {
  tabs: TabDef[];
  defaultIndex?: number;
  activation?: 'automatic' | 'manual';
  orientation?: 'horizontal' | 'vertical';
  idPrefix?: string;
  /** Accessible name for the tablist. APG requires one when a page has more than one. */
  label?: string;
  /** Id of an existing element naming the tablist. Takes precedence over `label`. */
  labelledBy?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultIndex,
  activation = 'automatic',
  orientation = 'horizontal',
  idPrefix,
  label,
  labelledBy,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex ?? 0);
  const [focusIndex, setFocusIndex] = useState(defaultIndex ?? 0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefix = idPrefix || 'tabs';

  const isDisabled = (i: number) => tabs[i]?.disabled === true;

  const focusTab = (i: number) => {
    setFocusIndex(i);
    tabRefs.current[i]?.focus();
    // Focus still lands on a disabled tab -- it stays in the roving tabindex so
    // it is discoverable -- but selection never follows onto it.
    if (activation === 'automatic' && !isDisabled(i)) setActiveIndex(i);
  };

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const isHorizontal = orientation !== 'vertical';
    const next = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prev = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    let handled = true;
    switch (e.key) {
      case next:
        focusTab(i === last ? 0 : i + 1);
        break;
      case prev:
        focusTab(i === 0 ? last : i - 1);
        break;
      case 'Home':
        focusTab(0);
        break;
      case 'End':
        focusTab(last);
        break;
      case 'Enter':
      case ' ':
        if (!isDisabled(i)) setActiveIndex(i);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  };

  return (
    <div className={`tabs tabs-${orientation || 'horizontal'}`}>
      <div
        role="tablist"
        aria-orientation={orientation || 'horizontal'}
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        className="tablist"
      >
        {tabs.map((tab, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={tab.id}
              id={`${prefix}-tab-${tab.id}`}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              type="button"
              className={`tab${selected ? ' is-active' : ''}${tab.disabled ? ' is-disabled' : ''}`}
              aria-selected={selected}
              aria-disabled={tab.disabled || undefined}
              aria-controls={`${prefix}-panel-${tab.id}`}
              tabIndex={i === focusIndex ? 0 : -1}
              onClick={() => {
                if (!tab.disabled) setActiveIndex(i);
                setFocusIndex(i);
              }}
              onKeyDown={(e) => handleKeyDown(e, i)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          id={`${prefix}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${prefix}-tab-${tab.id}`}
          className="tabpanel"
          hidden={i !== activeIndex}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Tabs pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Tabs;
