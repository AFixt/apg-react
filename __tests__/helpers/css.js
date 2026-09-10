/**
 * A small CSS reader for stylesheet contract tests.
 *
 * Some of what the component stylesheets have to guarantee cannot be seen from
 * either end of the existing toolchain. jsdom does not resolve stylesheets or
 * evaluate media queries, so the unit suites are blind to it; stylelint checks
 * declarations but not the cascade relationships between rules. Both of the
 * defects these helpers guard against — a focus outline removed with no
 * forced-colors replacement, and a reduced-motion block that loses to the rule
 * it means to override — are properties of how rules sit relative to each
 * other, which is exactly what neither layer looks at.
 *
 * Deliberately not a real CSS parser. It handles the shapes these stylesheets
 * actually use — top-level rules and one level of at-rule nesting — and would
 * need extending for anything deeper.
 */
const fs = require('fs');
const path = require('path');

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
 * body rather than terminating it, so at-rule blocks come back whole and can be
 * parsed again for the rules they contain.
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

/** Collapse a selector's whitespace so the same selector compares equal. */
const normaliseSelector = (selector) => selector.trim().replace(/\s+/g, ' ');

/**
 * Flatten a stylesheet into rules, each tagged with the at-rule wrapping it and
 * its position in source order.
 *
 * `order` is what makes cascade questions answerable: at equal specificity the
 * later rule wins, so "does this block come after the rule it overrides" is a
 * comparison of these numbers. A rule nested in an at-rule takes the position
 * of the at-rule itself, which is where the cascade sees it.
 *
 * @param {string} source - Raw stylesheet contents.
 * @returns {{selectors: string[], declarations: {prop: string, value: string}[], atRule: string, order: number}[]} Flattened rules.
 */
const parseRules = (source) => {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');

  const toRule = (block, atRule, order) => ({
    selectors: block.prelude.split(',').map(normaliseSelector).filter(Boolean),
    declarations: parseDeclarations(block.body),
    atRule,
    order,
  });

  return splitBlocks(css).flatMap((block, order) =>
    block.prelude.startsWith('@')
      ? splitBlocks(block.body).map((nested) => toRule(nested, block.prelude, order))
      : [toRule(block, '', order)],
  );
};

/** All declarations in `rule` for the given property. */
const declares = (rule, prop) => rule.declarations.filter((decl) => decl.prop === prop);

/**
 * Read and parse every component stylesheet once.
 *
 * @param {string} dir - Directory to scan.
 * @returns {{name: string, rules: ReturnType<typeof parseRules>}[]} Parsed stylesheets.
 */
const readStylesheets = (dir) =>
  findStylesheets(dir).map((file) => ({
    name: path.relative(dir, file),
    rules: parseRules(fs.readFileSync(file, 'utf8')),
  }));

module.exports = {
  declares,
  readStylesheets,
};
