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
const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

/** Values of `outline` that leave no indicator behind. */
const OUTLINE_REMOVED = /^(none|0)$/;

/** Pseudo-classes stripped when reducing a selector to the element it targets. */
const STATE_PSEUDOS = /:(?:focus-visible|focus|hover|active)\b/g;

/**
 * Recursively collect every `.css` file under a directory.
 *
 * @param {string} dir - Directory to walk.
 * @returns {string[]} Absolute paths, sorted for stable test ordering.
 */
const findStylesheets = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return findStylesheets(full);
      return entry.isFile() && entry.name.endsWith('.css') ? [full] : [];
    })
    .sort();

/**
 * Split CSS into top-level `{ prelude, body }` blocks.
 *
 * Braces nested inside a block (an at-rule's contents) are accumulated into the
 * body rather than terminating it, so `@media` blocks come back whole and can
 * be parsed again for the rules they contain.
 *
 * @param {string} css - Stylesheet source, comments already stripped.
 * @returns {{prelude: string, body: string}[]} Blocks in source order.
 */
const splitBlocks = (css) => {
  const blocks = [];
  let prelude = '';
  let buffer = '';
  let depth = 0;

  for (const char of css) {
    if (char === '{') {
      depth += 1;
      if (depth === 1) {
        prelude = buffer.trim();
        buffer = '';
        continue;
      }
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        blocks.push({ prelude, body: buffer });
        buffer = '';
        continue;
      }
    }
    buffer += char;
  }

  return blocks;
};

/**
 * Parse a declaration body into `{ prop, value }` pairs.
 *
 * @param {string} body - The text between a rule's braces.
 * @returns {{prop: string, value: string}[]} Declarations, lowercased props.
 */
const parseDeclarations = (body) =>
  body
    .split(';')
    .map((decl) => decl.trim())
    .filter(Boolean)
    .flatMap((decl) => {
      const colon = decl.indexOf(':');
      if (colon === -1) return [];
      return [
        {
          prop: decl.slice(0, colon).trim().toLowerCase(),
          value: decl.slice(colon + 1).trim(),
        },
      ];
    });

/**
 * Flatten a stylesheet into rules, each tagged with the at-rule that wraps it.
 *
 * Only one level of nesting is walked, which is all these stylesheets use.
 *
 * @param {string} source - Raw stylesheet contents.
 * @returns {{selectors: string[], declarations: {prop: string, value: string}[], atRule: string}[]} Flattened rules.
 */
const parseRules = (source) => {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');

  const toRule = (block, atRule) => ({
    selectors: block.prelude
      .split(',')
      .map((sel) => sel.trim().replace(/\s+/g, ' '))
      .filter(Boolean),
    declarations: parseDeclarations(block.body),
    atRule,
  });

  return splitBlocks(css).flatMap((block) =>
    block.prelude.startsWith('@')
      ? splitBlocks(block.body).map((nested) => toRule(nested, block.prelude))
      : [toRule(block, '')],
  );
};

/** Reduce a selector to the element it targets, dropping interaction state. */
const targetOf = (selector) => selector.replace(STATE_PSEUDOS, '').trim();

const declares = (rule, prop) => rule.declarations.filter((decl) => decl.prop === prop);

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

const stylesheets = findStylesheets(COMPONENTS_DIR).map((file) => ({
  name: path.relative(COMPONENTS_DIR, file),
  rules: parseRules(fs.readFileSync(file, 'utf8')),
}));

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
