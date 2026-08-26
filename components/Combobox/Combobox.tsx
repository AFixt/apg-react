/**
 * Combobox — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * Supports three autocomplete variants per APG:
 *   - "none": popup shows full list; user must choose.
 *   - "list": popup shows suggestions filtered by user input.
 *   - "both": list filters AND input text is completed inline to first match.
 *
 * Uses `aria-activedescendant` (not roving tabindex) — keyboard focus stays
 * on the textbox while virtual focus moves through options.
 *
 * Keyboard model:
 *   - Down: open (if closed), move virtual focus down.
 *   - Up: open (if closed) and move to last option, otherwise move up.
 *   - Enter: select active option, close popup.
 *   - Escape: close popup; if closed, clear input.
 *   - Home / End: first / last option (when popup open).
 *   - Alt+Down: open popup.
 *   - Tab: close popup and move focus away.
 */
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import './Combobox.css';

/** A single option in a Combobox. */
interface ComboboxOption {
  value: string;
  label: string;
}

/** Props for the Combobox component. */
interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (next: string) => void;
  label?: string;
  autocomplete?: 'none' | 'list' | 'both';
  placeholder?: string;
}

const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  label,
  autocomplete = 'list',
  placeholder,
}) => {
  const [inputText, setInputText] = useState(value ?? '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();
  const listId = `combobox-list-${uid}`;
  const optionId = (i: number) => `combobox-opt-${uid}-${i}`;

  useEffect(() => {
    if (value !== undefined) setInputText(value);
  }, [value]);

  const filtered = useMemo(() => {
    if (autocomplete === 'none' || !inputText) return options;
    const q = inputText.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, inputText, autocomplete]);

  const commit = (text: string) => {
    setInputText(text);
    onChange?.(text);
  };

  const selectAt = (i: number) => {
    const opt = filtered[i];
    if (!opt) return;
    commit(opt.label);
    setOpen(false);
    setActiveIndex(-1);
  };

  const openPopup = (index = 0) => {
    setOpen(true);
    setActiveIndex(Math.min(index, filtered.length - 1));
  };

  const inlineComplete = (text: string) => {
    if (autocomplete !== 'both' || !text) return;
    const match = options.find((o) => o.label.toLowerCase().startsWith(text.toLowerCase()));
    if (match && match.label.toLowerCase() !== text.toLowerCase()) {
      requestAnimationFrame(() => {
        const input = inputRef.current;
        if (!input) return;
        const start = text.length;
        input.value = match.label;
        input.setSelectionRange(start, match.label.length);
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    // Inline completion must not run on a deletion, or Backspace re-expands the
    // value it just shortened and the field refills itself with a different
    // option. `inputType` is the reliable signal -- deleting a selected
    // completion leaves the text the same length as the state it came from, so
    // a length comparison alone cannot see it. The length fallback exists for
    // environments that do not populate `inputType`.
    const inputType = (e.nativeEvent as InputEvent).inputType;
    const isDeletion = inputType ? inputType.startsWith('delete') : next.length < inputText.length;

    setInputText(next);
    onChange?.(next);
    setOpen(true);
    setActiveIndex(0);
    if (!isDeletion) inlineComplete(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const last = filtered.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (e.altKey && !open) return openPopup(0);
        if (!open) return openPopup(0);
        setActiveIndex(activeIndex >= last ? 0 : activeIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) return openPopup(last);
        setActiveIndex(activeIndex <= 0 ? last : activeIndex - 1);
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setActiveIndex(last);
        }
        break;
      case 'Enter':
        if (open && activeIndex >= 0) {
          e.preventDefault();
          selectAt(activeIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (open) {
          setOpen(false);
          setActiveIndex(-1);
        } else {
          commit('');
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // The popup is only *shown* when there is something to show. `aria-expanded`,
  // `aria-activedescendant` and the rendered listbox are all derived from this
  // one value so they cannot contradict each other: a search that matches
  // nothing must not claim an open popup with a current option in it.
  const isPopupOpen = open && filtered.length > 0;
  const activeId =
    isPopupOpen && activeIndex >= 0 && activeIndex < filtered.length
      ? optionId(activeIndex)
      : undefined;

  return (
    <div className="combobox-container">
      {label && (
        <label htmlFor={`combobox-input-${uid}`} className="combobox-label">
          {label}
        </label>
      )}
      <div className="combobox-wrap">
        <input
          ref={inputRef}
          id={`combobox-input-${uid}`}
          type="text"
          role="combobox"
          className="combobox-input"
          value={inputText}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (autocomplete === 'none') openPopup(0);
          }}
          aria-autocomplete={autocomplete}
          aria-expanded={isPopupOpen}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-activedescendant={activeId}
          autoComplete="off"
        />
        <button
          type="button"
          className="combobox-toggle"
          tabIndex={-1}
          aria-label={isPopupOpen ? 'Close suggestions' : 'Open suggestions'}
          onClick={() => {
            if (isPopupOpen) {
              setOpen(false);
              setActiveIndex(-1);
            } else {
              openPopup(0);
              inputRef.current?.focus();
            }
          }}
        >
          <span aria-hidden="true">▾</span>
        </button>
        {isPopupOpen && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={label ? `combobox-input-${uid}` : undefined}
            className="combobox-list"
          >
            {filtered.map((opt, i) => (
              <li
                key={opt.value}
                id={optionId(i)}
                role="option"
                aria-selected={i === activeIndex}
                className={`combobox-option${i === activeIndex ? ' is-active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectAt(i);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Combobox pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Combobox;
