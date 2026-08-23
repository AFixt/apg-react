/**
 * Cycle keyboard focus among the focusable descendants of a dialog container.
 *
 * Why this exists: a `focus`-event-based focus trap can't catch the case
 * where Tab moves focus to `document.body` (the browser's fallback when no
 * further focusable element exists after the dialog), because no focus event
 * fires for that fallback. Handling Tab in `keydown` and explicitly cycling
 * focus inside the dialog covers that case.
 */
import { FOCUSABLE_SELECTOR } from './focusable';

export const cycleFocusInDialog = (container: HTMLElement, event: KeyboardEvent): void => {
  if (event.key !== 'Tab') return;
  const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};
