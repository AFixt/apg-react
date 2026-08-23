/**
 * Shared definition of "keyboard focusable", plus the document-order lookups
 * built on it.
 *
 * The selector lives here rather than in any one component because more than
 * one pattern needs the same answer to "what can take focus?", and two copies
 * of this string would drift.
 */

/** Elements that can receive keyboard focus. Excludes `tabindex="-1"`, which is programmatic-only. */
export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Which side of the container to look on. */
export type FocusDirection = 'before' | 'after';

/**
 * Move focus to the nearest focusable element outside `container`, on the
 * given side, in document order.
 *
 * Used to implement an APG "escape hatch" — a composite widget that traps
 * arrow/page keys needs a documented way out, or a keyboard user reaching a
 * long widget has no way past it.
 *
 * Descendants of `container` are excluded: `compareDocumentPosition` reports a
 * descendant as FOLLOWING (it sets CONTAINED_BY too), so without the
 * `contains` filter "the element after the feed" would resolve to an element
 * inside it.
 *
 * Candidates are tried nearest-first and the result is **verified** against
 * `document.activeElement` rather than assumed. A selector match is not a
 * promise of focusability: a `display: none` or `visibility: hidden` element
 * still matches, and a browser silently declines to focus it. Reporting
 * success there would let the caller consume the key while focus never moved
 * — turning the pattern's escape hatch into the trap it exists to prevent.
 *
 * Note jsdom does focus hidden elements, so this fallback is only exercised in
 * a real engine; the unit suite cannot distinguish the two.
 *
 * @param container - The widget to move focus out of.
 * @param direction - `'before'` for the nearest preceding element, `'after'` for the nearest following one.
 * @returns `true` if focus actually moved, `false` if nothing outside would take it.
 */
export const focusAdjacentTo = (
  container: HTMLElement | null,
  direction: FocusDirection,
): boolean => {
  if (!container) return false;

  const outside = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !container.contains(el),
  );

  const wanted =
    direction === 'before' ? Node.DOCUMENT_POSITION_PRECEDING : Node.DOCUMENT_POSITION_FOLLOWING;
  // compareDocumentPosition returns a bitmask, hence the bitwise test.
  const candidates = outside.filter((el) => (container.compareDocumentPosition(el) & wanted) !== 0);

  // querySelectorAll returns document order, so "nearest first" means walking
  // the preceding candidates backwards and the following ones forwards.
  const nearestFirst = direction === 'before' ? [...candidates].reverse() : candidates;

  for (const candidate of nearestFirst) {
    candidate.focus();
    if (document.activeElement === candidate) return true;
  }
  return false;
};
