/**
 * Lightweight accessibility assertion helpers.
 *
 * NO external a11y libraries are used (no axe-core, no jest-axe, etc.).
 * Every check here is implemented from first principles against the DOM.
 *
 * Intended for use in Jest + jsdom environments with @testing-library/dom.
 */

/**
 * Compute a best-effort accessible name for an element following the ARIA
 * Accessible Name and Description Computation, simplified:
 *
 *   1. aria-labelledby (concatenated text of referenced elements)
 *   2. aria-label
 *   3. Native <label for> association (for form controls)
 *   4. Text content (for buttons, links, headings, etc.)
 *   5. title attribute (fallback)
 *
 * Returns trimmed string, or "" if no name can be derived.
 */
export function getAccessibleName(el) {
  if (!el) return '';

  const labelledby = el.getAttribute('aria-labelledby');
  if (labelledby) {
    const text = labelledby
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
    if (text) return text;
  }

  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

  // Native label association
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`);
    if (label && label.textContent?.trim()) return label.textContent.trim();
  }

  // Wrapped by <label>
  const closestLabel = el.closest?.('label');
  if (closestLabel && closestLabel.textContent?.trim()) return closestLabel.textContent.trim();

  // For buttons / links / headings / menuitem-like roles, use text content
  const textRoles = ['button', 'link', 'menuitem', 'option', 'tab', 'treeitem', 'heading'];
  const role = el.getAttribute('role') || implicitRole(el);
  const tag = el.tagName?.toLowerCase();
  if (textRoles.includes(role) || tag === 'button' || tag === 'a' || /^h[1-6]$/.test(tag || '')) {
    const text = el.textContent?.trim();
    if (text) return text;
  }

  // Fallback: title attribute
  const title = el.getAttribute('title');
  if (title && title.trim()) return title.trim();

  return '';
}

/**
 * Return an approximate implicit role for common HTML elements, when no
 * explicit role attribute is present. Not exhaustive.
 */
export function implicitRole(el) {
  const tag = el.tagName?.toLowerCase();
  const type = el.getAttribute?.('type');
  switch (tag) {
    case 'a':
      return el.hasAttribute('href') ? 'link' : '';
    case 'button':
      return 'button';
    case 'input':
      if (type === 'checkbox') return 'checkbox';
      if (type === 'radio') return 'radio';
      if (type === 'range') return 'slider';
      if (type === 'button' || type === 'submit' || type === 'reset') return 'button';
      if (!type || type === 'text' || type === 'search' || type === 'email') return 'textbox';
      return '';
    case 'textarea':
      return 'textbox';
    case 'select':
      return 'combobox';
    case 'nav':
      return 'navigation';
    case 'main':
      return 'main';
    case 'article':
      return 'article';
    case 'header':
      return 'banner';
    case 'footer':
      return 'contentinfo';
    case 'section':
      return el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby') ? 'region' : '';
    case 'ul':
    case 'ol':
      return 'list';
    case 'li':
      return 'listitem';
    case 'meter':
      return 'meter';
    case 'progress':
      return 'progressbar';
    default:
      return /^h[1-6]$/.test(tag || '') ? 'heading' : '';
  }
}

/**
 * Is the element focusable by the keyboard?
 * Heuristic:
 *   - Native focusables (a[href], button, input, select, textarea, iframe) with no disabled/tabindex=-1
 *   - Any element with tabindex="0" or positive tabindex
 */
export function isKeyboardFocusable(el) {
  if (!el) return false;
  if (el.hasAttribute('disabled')) return false;
  const ti = el.getAttribute('tabindex');
  if (ti !== null) {
    return parseInt(ti, 10) >= 0;
  }
  const tag = el.tagName?.toLowerCase();
  if (['a'].includes(tag) && el.hasAttribute('href')) return true;
  if (['button', 'select', 'textarea', 'iframe'].includes(tag)) return true;
  if (tag === 'input') return el.getAttribute('type') !== 'hidden';
  return false;
}

/**
 * Is the element effectively hidden from the accessibility tree?
 *   - aria-hidden="true" on self or ancestor
 *   - hidden attribute
 *   - display:none / visibility:hidden (via inline style; jsdom doesn't do
 *     full cascade, so this only catches the common cases)
 */
export function isInAccessibilityTree(el) {
  let node = el;
  while (node && node !== document.body) {
    if (node.getAttribute?.('aria-hidden') === 'true') return false;
    if (node.hasAttribute?.('hidden')) return false;
    const style = node.style;
    if (style?.display === 'none') return false;
    if (style?.visibility === 'hidden') return false;
    node = node.parentElement;
  }
  return true;
}

/**
 * Asserts that the element has a non-empty accessible name.
 */
export function assertHasAccessibleName(el, context = '') {
  const name = getAccessibleName(el);
  if (!name) {
    throw new Error(
      `Expected element to have an accessible name${context ? ` (${context})` : ''}, ` +
        `but got "". Outer HTML: ${el.outerHTML?.slice(0, 200)}`,
    );
  }
  return name;
}

/**
 * Asserts the element has a given role (explicit role attribute, or implicit).
 */
export function assertRole(el, expected) {
  const role = el.getAttribute('role') || implicitRole(el);
  if (role !== expected) {
    throw new Error(`Expected role="${expected}" but got role="${role}" on ${el.tagName}`);
  }
}

/**
 * For components whose ARIA contract includes a boolean state attribute
 * (e.g. aria-expanded, aria-checked), verify the attribute is present and
 * has a valid value.
 */
export function assertAriaBooleanState(el, attr) {
  const val = el.getAttribute(attr);
  if (val !== 'true' && val !== 'false') {
    throw new Error(`Expected ${attr} to be "true" or "false" on ${el.tagName}, got "${val}"`);
  }
}

/**
 * For a group of elements with roving tabindex: exactly one should have
 * tabindex="0", the rest should have tabindex="-1".
 */
export function assertRovingTabindex(elements) {
  const tabbable = elements.filter((e) => e.getAttribute('tabindex') === '0');
  const untabbable = elements.filter((e) => e.getAttribute('tabindex') === '-1');
  if (tabbable.length !== 1) {
    throw new Error(
      `Expected exactly one element with tabindex="0" in roving group, got ${tabbable.length}`,
    );
  }
  if (tabbable.length + untabbable.length !== elements.length) {
    throw new Error(`All elements in roving group should have tabindex="0" or "-1"`);
  }
}

/**
 * For composite widgets that reference other elements by id
 * (aria-controls, aria-labelledby, aria-describedby, aria-errormessage,
 * aria-activedescendant), verify that the referenced ids resolve to real
 * elements in the document.
 */
export function assertAriaReferencesResolve(el, attrs) {
  const missing = [];
  for (const attr of attrs) {
    const value = el.getAttribute(attr);
    if (!value) continue;
    value.split(/\s+/).forEach((id) => {
      if (!document.getElementById(id)) {
        missing.push(`${attr}="${id}"`);
      }
    });
  }
  if (missing.length) {
    throw new Error(`Dangling ARIA references on ${el.tagName}: ${missing.join(', ')}`);
  }
}

/**
 * Ensure a labelled control's label points to an actual input.
 */
export function assertLabelAssociated(labelEl) {
  const htmlFor = labelEl.getAttribute('for');
  if (htmlFor) {
    const target = document.getElementById(htmlFor);
    if (!target) {
      throw new Error(`label[for="${htmlFor}"] has no matching control`);
    }
    return target;
  }
  const nested = labelEl.querySelector('input, textarea, select');
  if (!nested) {
    throw new Error(
      `<label> has no htmlFor and no nested control: ${labelEl.outerHTML?.slice(0, 100)}`,
    );
  }
  return nested;
}
