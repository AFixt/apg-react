/**
 * Shared type-ahead behaviour for the list-like APG patterns.
 *
 * The APG describes the same interaction for Listbox, Tree View and Menubar:
 * typing a printable character moves focus to the next item whose label starts
 * with it, wrapping; repeated presses of the same character cycle through the
 * items starting with it; and characters typed in quick succession match a
 * prefix instead.
 *
 * It is graded differently per pattern -- Recommended for Listbox and Tree
 * View, Optional for Menubar -- but the behaviour itself is identical, so it
 * lives here rather than three times over.
 */
import React, { useCallback, useEffect, useRef } from 'react';

/** How long a typed sequence stays open before the next key starts a new one. */
const TYPEAHEAD_TIMEOUT_MS = 500;

/**
 * Whether a keydown is a printable character that should drive type-ahead.
 *
 * Space is excluded: every one of these patterns already binds it to
 * selection or activation, and the APG gives that binding precedence.
 *
 * @param {Pick<React.KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>} e - The keydown.
 * @returns {boolean} True when the key should be treated as type-ahead input.
 */
export const isTypeaheadKey = (
  e: Pick<React.KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>,
): boolean => e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;

/**
 * Flatten a ReactNode label to the text a user would read, for matching.
 *
 * Menubar labels are ReactNodes rather than strings, so an element wrapping
 * text still has to be matchable. Anything with no text contributes nothing and
 * simply never matches.
 *
 * @param {React.ReactNode} node - The label to flatten.
 * @returns {string} Concatenated text, or an empty string.
 */
export const nodeText = (node: React.ReactNode): string => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map((child) => nodeText(child as React.ReactNode)).join('');
  if (React.isValidElement(node)) {
    return nodeText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
};

/**
 * Find the item a typed sequence should move focus to.
 *
 * A single character, or the same character repeated, searches from the item
 * *after* `from` so that pressing it again cycles onward. A sequence of
 * different characters searches from `from` itself, because the first character
 * of that sequence has usually already moved focus onto a candidate and
 * skipping it would make the prefix unreachable.
 *
 * @param {string[]} labels - Item labels, in the order focus moves through them.
 * @param {string} search - The accumulated typed sequence.
 * @param {number} from - Index focus is currently on.
 * @returns {number} Index to move to, or -1 when nothing matches.
 */
export const findTypeaheadMatch = (labels: string[], search: string, from: number): number => {
  const query = search.toLowerCase();
  const count = labels.length;
  if (count === 0 || query === '') return -1;

  const isRepeat = query.length > 1 && [...query].every((char) => char === query[0]);
  const needle = isRepeat ? query[0]! : query;
  const offset = query.length === 1 || isRepeat ? 1 : 0;
  const start = Math.max(0, from);

  for (let i = 0; i < count; i += 1) {
    const index = (start + offset + i) % count;
    if (labels[index]?.toLowerCase().startsWith(needle)) return index;
  }
  return -1;
};

/**
 * Accumulate typed characters and resolve them to a target index.
 *
 * The returned function is stable, and the pending reset timer is cleared on
 * unmount so a keystroke cannot fire into a torn-down component.
 *
 * @returns {(key: string, labels: string[], from: number) => number} Resolver
 *   taking the typed character, the current labels and the focused index, and
 *   returning the index to move to or -1.
 */
export const useTypeahead = () => {
  const bufferRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return useCallback((key: string, labels: string[], from: number): number => {
    bufferRef.current += key;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      bufferRef.current = '';
    }, TYPEAHEAD_TIMEOUT_MS);

    return findTypeaheadMatch(labels, bufferRef.current, from);
  }, []);
};
