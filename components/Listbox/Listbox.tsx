/**
 * Listbox — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 *
 * Keyboard model (single-select):
 *   - Arrow Up/Down: move focus and selection.
 *   - Home / End: first / last option.
 *   - Enter / Space: no-op (focus already selects).
 *
 * Keyboard model (multi-select):
 *   - Arrow Up/Down: move focus only.
 *   - Space: toggle selection of focused option.
 *   - Shift + Arrow: extend range selection.
 *   - Home / End: move focus.
 *   - Ctrl/Cmd + A: select all.
 *
 * Focus model:
 *   - "roving" (default): DOM focus moves onto the active option.
 *   - "activedescendant": the listbox itself holds focus and names the active
 *     option with aria-activedescendant, which is the model the APG's own
 *     listbox examples use.
 */
import React, { useId, useMemo, useRef, useState } from 'react';
import { isTypeaheadKey, nodeText, useTypeahead } from '../_internal/typeahead';
import './Listbox.css';

/** A single option in a Listbox. */
interface ListboxOption {
  value: string;
  label: React.ReactNode;
  /**
   * Marks the option unavailable, exposing aria-disabled="true".
   *
   * aria-disabled rather than removing it: the APG keeps a disabled option in
   * the list and focusable, so a keyboard user can still arrow onto it and
   * discover that it exists and why it cannot be chosen. It simply never
   * becomes selected.
   */
  disabled?: boolean;
}

/** Props for the Listbox component. */
interface ListboxProps {
  options: ListboxOption[];
  value?: string | string[];
  onChange?: (next: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  labelId?: string;
  /**
   * Where DOM focus lives.
   *
   * "roving" keeps today's behaviour: focus moves onto the active option and
   * the option handles the keys. "activedescendant" keeps focus on the listbox
   * and points aria-activedescendant at the active option, which is what the
   * APG's listbox examples do and what a caller that focuses the listbox itself
   * needs in order to drive it.
   *
   * Defaults to "roving" so this is non-breaking; "activedescendant" is the
   * more faithful of the two and is what the demo pages use.
   */
  focusModel?: 'roving' | 'activedescendant';
}

const Listbox: React.FC<ListboxProps> = ({
  options,
  value,
  onChange,
  multiple,
  label,
  labelId,
  focusModel = 'roving',
}) => {
  const uid = useId();
  const usesActiveDescendant = focusModel === 'activedescendant';
  const optionId = (i: number) => `listbox-opt-${uid}-${i}`;
  const [focusIndex, setFocusIndex] = useState(() => {
    if (multiple) return 0;
    const i = options.findIndex((o) => o.value === value);
    return i >= 0 ? i : 0;
  });
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const groupLabelId = labelId || 'listbox-label';

  const selectedSet = useMemo(() => {
    if (multiple) return new Set(Array.isArray(value) ? value : []);
    return new Set(value !== undefined && value !== null ? [value as string] : []);
  }, [value, multiple]);

  const commitSingle = (i: number) => {
    const opt = options[i];
    if (!opt || opt.disabled) return;
    onChange?.(opt.value);
  };

  const toggleMulti = (i: number) => {
    const opt = options[i];
    if (!opt || opt.disabled) return;
    const next = new Set(selectedSet);
    const v = opt.value;
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange?.(Array.from(next));
  };

  const selectRange = (from: number, to: number) => {
    const [a, b] = from <= to ? [from, to] : [to, from];
    const next = new Set(selectedSet);
    for (let i = a; i <= b; i++) {
      const opt = options[i];
      if (opt && !opt.disabled) next.add(opt.value);
    }
    onChange?.(Array.from(next));
  };

  const resolveTypeahead = useTypeahead();

  const moveFocus = (i: number, { extend }: { extend?: boolean } = {}) => {
    const clamped = Math.max(0, Math.min(options.length - 1, i));
    const prev = focusIndex;
    setFocusIndex(clamped);
    if (usesActiveDescendant) {
      // ARIA requires the element aria-activedescendant points at to be
      // visible. Roving tabindex gets that for free from .focus(); this model
      // has to ask for it. Optional-called because jsdom does not implement it.
      optionRefs.current[clamped]?.scrollIntoView?.({ block: 'nearest' });
    } else {
      optionRefs.current[clamped]?.focus();
    }
    if (!multiple) {
      commitSingle(clamped);
    } else if (extend) {
      selectRange(prev, clamped);
    }
  };

  /**
   * APG grades type-ahead Recommended for a listbox. Focus moves to the next
   * option whose label starts with what was typed; selection follows focus in
   * single-select mode, exactly as it does for the arrow keys.
   */
  const tryTypeahead = (e: React.KeyboardEvent<HTMLElement>, i: number) => {
    if (!isTypeaheadKey(e)) return false;
    const match = resolveTypeahead(
      e.key,
      options.map((o) => nodeText(o.label)),
      i,
    );
    if (match < 0) return false;
    moveFocus(match);
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, i: number) => {
    let handled = true;
    switch (e.key) {
      case 'ArrowDown':
        moveFocus(i + 1, { extend: Boolean(multiple && e.shiftKey) });
        break;
      case 'ArrowUp':
        moveFocus(i - 1, { extend: Boolean(multiple && e.shiftKey) });
        break;
      case 'Home':
        moveFocus(0, { extend: Boolean(multiple && e.shiftKey) });
        break;
      case 'End':
        moveFocus(options.length - 1, { extend: Boolean(multiple && e.shiftKey) });
        break;
      case ' ':
        if (multiple) toggleMulti(i);
        break;
      case 'a':
      case 'A':
        if (multiple && (e.ctrlKey || e.metaKey)) {
          onChange?.(options.filter((o) => !o.disabled).map((o) => o.value));
        } else {
          handled = tryTypeahead(e, i);
        }
        break;
      default:
        handled = tryTypeahead(e, i);
    }
    if (handled) e.preventDefault();
  };

  return (
    <div className="listbox-container">
      {label && (
        <div id={groupLabelId} className="listbox-label">
          {label}
        </div>
      )}
      <ul
        ref={listRef}
        role="listbox"
        aria-labelledby={label ? groupLabelId : undefined}
        aria-multiselectable={multiple || undefined}
        className="listbox"
        tabIndex={usesActiveDescendant ? 0 : -1}
        aria-activedescendant={
          usesActiveDescendant && options.length > 0 ? optionId(focusIndex) : undefined
        }
        onKeyDown={usesActiveDescendant ? (e) => handleKeyDown(e, focusIndex) : undefined}
      >
        {options.map((opt, i) => {
          const selected = selectedSet.has(opt.value);
          const isDisabled = opt.disabled === true;
          return (
            <li
              key={opt.value}
              ref={(el) => (optionRefs.current[i] = el)}
              id={optionId(i)}
              role="option"
              aria-selected={selected}
              aria-disabled={isDisabled || undefined}
              className={`listbox-option${selected ? ' is-selected' : ''}${
                i === focusIndex ? ' is-focused' : ''
              }${isDisabled ? ' is-disabled' : ''}`}
              tabIndex={usesActiveDescendant ? undefined : i === focusIndex ? 0 : -1}
              onClick={(e) => {
                setFocusIndex(i);
                // Focus belongs on whichever element owns the keys, so that a
                // click leaves the widget drivable from the keyboard.
                if (usesActiveDescendant) listRef.current?.focus();
                else optionRefs.current[i]?.focus();
                if (multiple) {
                  if (e.shiftKey) selectRange(focusIndex, i);
                  else toggleMulti(i);
                } else {
                  commitSingle(i);
                }
              }}
              onKeyDown={usesActiveDescendant ? undefined : (e) => handleKeyDown(e, i)}
            >
              {opt.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Listbox pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Listbox;
