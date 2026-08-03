/**
 * Stylesheet contract: a reduced-motion opt-out has to be able to win.
 *
 * `@media (prefers-reduced-motion: reduce) { .thing { transition: none } }`
 * does nothing at all if it is written above `.thing { transition: ... }`. A
 * media query adds no specificity, so at equal specificity the later rule wins
 * on source order and the transition survives. Every one of these blocks in the
 * library was written that way, so users asking for reduced motion got the
 * animations regardless.
 *
 * Nothing else catches it. jsdom does not resolve stylesheets or evaluate media
 * queries. stylelint's `a11y/media-prefers-reduced-motion` checks only that a
 * reduced-motion block exists somewhere for an animated selector, never whether
 * it can take effect — and its autofix actively creates the broken shape,
 * duplicating the rule into a block placed above it (see the suppression and
 * note in Toolbar.css).
 *
 * `e2e/reducedMotion.e2e.js` proves the opt-out resolves to `0s` in a real
 * engine; this proves the ordering holds in every stylesheet, without a browser.
 */
const path = require('path');
const { readStylesheets, declares } = require('./helpers/css');

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

/** Properties whose animation a reduced-motion block is expected to suppress. */
const MOTION_PROPS = ['transition', 'animation'];

/** Values that switch the motion off rather than describing some. */
const SUPPRESSED = /^(none|0s?|initial)$/;

const isReducedMotion = (rule) => /prefers-reduced-motion\s*:\s*reduce/.test(rule.atRule);

/** Motion declarations in a rule, whether they turn motion on or off. */
const motionDeclarations = (rule) => MOTION_PROPS.flatMap((prop) => declares(rule, prop));

const stylesheets = readStylesheets(COMPONENTS_DIR);

/**
 * Every suppression, paired with the last ordinary rule it has to outrank.
 *
 * Only same-selector pairs are considered. That is what the cascade compares at
 * equal specificity, and it is the relationship the bug lived in.
 */
const suppressions = stylesheets.flatMap((sheet) =>
  sheet.rules.filter(isReducedMotion).flatMap((block) =>
    motionDeclarations(block)
      .filter((decl) => SUPPRESSED.test(decl.value))
      .flatMap((decl) =>
        block.selectors.map((selector) => {
          const animatedBy = sheet.rules.filter(
            (rule) =>
              !isReducedMotion(rule) &&
              rule.selectors.includes(selector) &&
              declares(rule, decl.prop).some((d) => !SUPPRESSED.test(d.value)),
          );
          return {
            sheet: sheet.name,
            selector,
            prop: decl.prop,
            blockOrder: block.order,
            lastAnimatedOrder: animatedBy.length
              ? Math.max(...animatedBy.map((rule) => rule.order))
              : null,
          };
        }),
      ),
  ),
);

describe('Reduced-motion opt-outs', () => {
  /*
   * Canaries. The assertions below iterate over what the parser found, so they
   * pass trivially if it finds nothing. These fail first, and say so, rather
   * than letting the suite go quietly green on a broken parser.
   */
  describe('the scan itself', () => {
    test('reads every component stylesheet', () => {
      expect(stylesheets.length).toBeGreaterThan(25);
    });

    test('finds the suppressions it exists to check', () => {
      expect(suppressions.length).toBeGreaterThan(30);
    });

    test('records source order, which is the whole question here', () => {
      const orders = suppressions.map((s) => s.blockOrder);
      expect(new Set(orders).size).toBeGreaterThan(1);
      expect(orders.every((order) => Number.isInteger(order))).toBe(true);
    });
  });

  test('every suppression targets a selector that is actually animated', () => {
    // A block with nothing to suppress is dead weight, and usually means a
    // selector was renamed on one side of the pair only.
    const orphaned = suppressions
      .filter((s) => s.lastAnimatedOrder === null)
      .map((s) => `${s.sheet}: ${s.selector} (${s.prop})`);

    expect(orphaned).toEqual([]);
  });

  test('every suppression is placed where it can win', () => {
    // The failure this exists for: written above the rule it overrides, at
    // equal specificity, the block loses on source order and does nothing.
    const ineffective = suppressions
      .filter((s) => s.lastAnimatedOrder !== null && s.blockOrder < s.lastAnimatedOrder)
      .map(
        (s) => `${s.sheet}: the ${s.prop} opt-out for ${s.selector} is above the rule it overrides`,
      );

    expect(ineffective).toEqual([]);
  });
});
