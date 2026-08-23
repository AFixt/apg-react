/**
 * Shared definition of "keyboard focusable".
 *
 * The selector lives here rather than in any one component because more than
 * one pattern needs the same answer to "what can take focus?", and two copies
 * of this string would drift.
 */

/** Elements that can receive keyboard focus. Excludes `tabindex="-1"`, which is programmatic-only. */
export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
