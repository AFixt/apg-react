/**
 * Stylesheet contract: an author who removes the focus outline must put one
 * back under forced colors.
 *
 * Forced colors (Windows High Contrast Mode) suppresses `box-shadow` and
 * overrides `background-color`, which between them are the only focus
 * indicators the component stylesheets use. Wherever a rule also sets
 * `outline: none`, the UA outline that would have covered for the suppressed
 * indicator is gone too, and the focused element renders with no visible focus
 * indicator at all — WCAG 2.2 2.4.7 Focus Visible (A).
 *
 * Nothing in the existing toolchain catches this. stylelint's
 * `a11y/no-outline-none` accepts a `box-shadow` as a sufficient alternative to
 * the removed outline, which is true everywhere except forced colors — so the
 * rule stays silent on exactly the case that fails. jsdom does not resolve
 * stylesheets or evaluate media queries, so the component unit suites cannot
 * see it either.
 *
 * This test reads the CSS as text and enforces the pairing structurally, so a
 * new component cannot reintroduce the gap. The E2E suite proves the rules
 * actually render an indicator in a real engine; this proves they exist at all,
 * in every stylesheet, without needing a browser.
 */
const path = require('path');
const { readStylesheets, declares } = require('./helpers/css');

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

/** Values of `outline` that leave no indicator behind. */
const OUTLINE_REMOVED = /^(none|0)$/;

/** Pseudo-classes stripped when reducing a selector to the element it targets. */
const STATE_PSEUDOS = /:(?:focus-visible|focus|hover|active)\b/g;

/** Reduce a selector to the element it targets, dropping interaction state. */
const targetOf = (selector) => selector.replace(STATE_PSEUDOS, '').trim();

const isForcedColors = (rule) => /forced-colors\s*:\s*active/.test(rule.atRule);

/**
 * Rules that strip the outline, outside a forced-colors block.
 *
 * A base rule counts as much as a `:focus` rule: `outline: none` on `.button`
 * applies in every state, so it removes the indicator from the focused button
 * just the same.
 */
const outlineRemovals = (rules) =>
  rules.filter(
    (rule) =>
      !isForcedColors(rule) &&
      declares(rule, 'outline').some((decl) => OUTLINE_REMOVED.test(decl.value)),
  );

/** Rules that draw a real outline inside a forced-colors block. */
const forcedColorsGuards = (rules) =>
  rules.filter(
    (rule) =>
      isForcedColors(rule) &&
      declares(rule, 'outline').some((decl) => !OUTLINE_REMOVED.test(decl.value)),
  );

const stylesheets = readStylesheets(COMPONENTS_DIR);

const affected = stylesheets.filter((sheet) => outlineRemovals(sheet.rules).length > 0);

describe('Forced-colors focus indicators', () => {
  /*
   * Canaries. Every assertion below is of the form "for each removal found,
   * there is a guard" — which passes trivially if the parser finds nothing. If
   * the parser breaks, or the CSS moves somewhere this does not look, these
   * fail first and say so, rather than the suite going quietly green.
   */
  describe('the scan itself', () => {
    test('reads every component stylesheet', () => {
      expect(stylesheets.length).toBeGreaterThan(25);
      expect(stylesheets.map((sheet) => sheet.name)).toContain('variables.css');
    });

    test('parses rules out of them', () => {
      const link = stylesheets.find((sheet) => sheet.name === 'Link/Link.css');
      expect(link).toBeDefined();
      expect(link.rules.length).toBeGreaterThan(0);
    });

    test('finds the outline removals it exists to check', () => {
      // Every removal in the library lives in a component stylesheet, and there
      // are dozens of them; a count near zero means the parser stopped working.
      const total = stylesheets.reduce(
        (sum, sheet) => sum + outlineRemovals(sheet.rules).length,
        0,
      );
      expect(total).toBeGreaterThan(25);
      expect(affected.length).toBeGreaterThan(20);
    });

    test('distinguishes a forced-colors guard from an ordinary rule', () => {
      const link = stylesheets.find((sheet) => sheet.name === 'Link/Link.css');
      const guards = forcedColorsGuards(link.rules);
      expect(guards).toHaveLength(1);
      expect(guards[0].selectors).toEqual(['.link:focus', '.link:focus-visible']);
    });
  });

  describe.each(affected.map((sheet) => [sheet.name, sheet]))('%s', (_name, sheet) => {
    const guardTargets = forcedColorsGuards(sheet.rules).flatMap((rule) =>
      rule.selectors
        // A guard has to be scoped to the focused state. An unconditional
        // outline would satisfy a naive check while ringing the element at all
        // times, which is not what any of these rules mean.
        .filter((selector) => /:focus(-visible)?\b/.test(selector))
        .map(targetOf),
    );

    test('restores a focus outline for every element whose outline it removes', () => {
      const unguarded = outlineRemovals(sheet.rules)
        .flatMap((rule) => rule.selectors)
        .map(targetOf)
        .filter((target) => !guardTargets.includes(target));

      // Reported as the list of selectors so a failure names the elements that
      // would go indicator-less, not just the file.
      expect(unguarded).toEqual([]);
    });
  });
});
