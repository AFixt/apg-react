/**
 * Stylesheet contract: generated content must not be conditioned on widget
 * state.
 *
 * CSS `content` on `::before` / `::after` participates in accessible name
 * computation. That is harmless for a decorative separator that is always
 * there, but when the rule is keyed off a state selector — `[aria-pressed]`,
 * `[aria-expanded]`, `.is-pressed` — the control's accessible name changes
 * every time its state changes.
 *
 * The APG's Button Pattern is explicit that a toggle button's label must not
 * change when its state changes; the state is already carried by
 * `aria-pressed`. The consequences are concrete: a voice-control user who says
 * "click Mute" can no longer address the control once its name has become
 * "check-mark Mute", and a screen reader announces a rename on top of the state
 * change, so the control re-announces as if it were a different one.
 *
 * Nothing else in the toolchain sees this. jsdom does not resolve stylesheets,
 * so the unit suites compute accessible names without any generated content at
 * all and the defect is invisible to them. stylelint checks declarations, not
 * what a declaration does to the accessibility tree. Only a real engine catches
 * it — which is how #151 was found, in all three of them.
 *
 * The contract is deliberately narrower than "no generated content": an
 * unconditional decorative separator such as Breadcrumb's `/` is fine, because
 * it does not move. It is state-dependent content that renames things.
 */
const path = require('path');
const { readStylesheets, declares } = require('./helpers/css');

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

/** Selectors that target an element only while it is in a particular state. */
const STATE_SELECTOR =
  /\[aria-(?:pressed|expanded|checked|selected|current|disabled|invalid)[^\]]*\]|\.is-[a-z-]+|:checked|:disabled/i;

/** `content` values that render nothing and so cannot enter a name. */
const EMPTY_CONTENT = /^(?:none|''|""|normal)$/;

const isPseudoElement = (selector) => /::(?:before|after)\b/.test(selector);

const stylesheets = readStylesheets(COMPONENTS_DIR);

describe('stylesheet contract: generated content and accessible names', () => {
  test('there are stylesheets to check', () => {
    expect(stylesheets.length).toBeGreaterThan(0);
  });

  describe.each(stylesheets.map((sheet) => [sheet.name, sheet]))('%s', (_name, sheet) => {
    const offenders = sheet.rules.flatMap((rule) => {
      const contentDecls = declares(rule, 'content').filter(
        (decl) => !EMPTY_CONTENT.test(decl.value.trim()),
      );
      if (contentDecls.length === 0) return [];

      return rule.selectors
        .filter((selector) => isPseudoElement(selector) && STATE_SELECTOR.test(selector))
        .map((selector) => ({ selector, values: contentDecls.map((d) => d.value) }));
    });

    test('no ::before / ::after content is keyed off a widget state selector', () => {
      expect(offenders).toEqual([]);
    });
  });
});
