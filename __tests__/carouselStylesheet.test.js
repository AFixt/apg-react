/**
 * Stylesheet contract for the Carousel, pinned after the demo page's audit
 * (#234) reported two classes of finding that come straight from the CSS:
 *
 * - Every focusable control removed the UA focus outline in favour of a
 *   translucent box-shadow ring. On controls overlaid on arbitrary slide
 *   content that ring has no guaranteed contrast, so `Carousel.css` now draws a
 *   real outline instead and removes nothing (2.4.7 Focus Visible, 1.4.11
 *   Non-text Contrast).
 * - `:hover`/`:focus` rules toggled `opacity`. Nothing was being revealed, but
 *   a rule that toggles `display`, `visibility` or `opacity` on hover or focus
 *   is exactly what an audit reads as content on hover (1.4.13), and the fade
 *   also dimmed the picker digits at rest for no reason.
 *
 * Both are cascade facts that neither jsdom nor stylelint can see, so they are
 * read from the stylesheet as text, the same way the forced-colors and
 * reduced-motion contracts are.
 */
const path = require('path');
const { readStylesheets, declares } = require('./helpers/css');

const COMPONENTS_DIR = path.join(__dirname, '..', 'components');

/** Values of `outline` that leave no indicator behind. */
const OUTLINE_REMOVED = /^(none|0)$/;

/** Properties whose toggling on hover or focus reads as revealed content. */
const REVEAL_PROPS = ['display', 'visibility', 'opacity'];

const sheet = readStylesheets(COMPONENTS_DIR).find((s) => s.name === 'Carousel/Carousel.css');

const targetsState = (rule, state) => rule.selectors.some((selector) => selector.includes(state));

describe('Carousel stylesheet contract (#234)', () => {
  test('the stylesheet is found and parsed', () => {
    expect(sheet).toBeDefined();
    expect(sheet.rules.length).toBeGreaterThan(5);
  });

  test('never removes a focus outline', () => {
    const removals = sheet.rules
      .filter((rule) => declares(rule, 'outline').some((d) => OUTLINE_REMOVED.test(d.value)))
      .flatMap((rule) => rule.selectors);
    expect(removals).toEqual([]);
  });

  test('draws a real outline on every focus-state rule that styles focus', () => {
    const focusRules = sheet.rules.filter((rule) => targetsState(rule, ':focus'));
    expect(focusRules.length).toBeGreaterThan(0);

    // A focus rule that sets only a background swap is fine on its own, but the
    // rule that carries the indicator for each focusable element must be an
    // outline, not a box-shadow: forced colors keeps the former and drops the
    // latter, and a translucent shadow has no guaranteed contrast on a slide.
    const indicatorRules = focusRules.filter(
      (rule) => declares(rule, 'outline').length > 0 || declares(rule, 'box-shadow').length > 0,
    );
    expect(indicatorRules.length).toBeGreaterThan(0);
    indicatorRules.forEach((rule) => {
      expect(declares(rule, 'box-shadow')).toEqual([]);
      expect(declares(rule, 'outline').some((d) => !OUTLINE_REMOVED.test(d.value))).toBe(true);
    });
  });

  test('no hover or focus rule toggles display, visibility or opacity', () => {
    const offenders = sheet.rules
      .filter((rule) => targetsState(rule, ':hover') || targetsState(rule, ':focus'))
      .flatMap((rule) =>
        REVEAL_PROPS.filter((prop) => declares(rule, prop).length > 0).map(
          (prop) => `${rule.selectors.join(', ')} -> ${prop}`,
        ),
      );
    expect(offenders).toEqual([]);
  });

  test('does not fade the pickers at rest', () => {
    const faded = sheet.rules
      .filter((rule) =>
        declares(rule, 'opacity').some((d) => d.value !== '100%' && d.value !== '1'),
      )
      .flatMap((rule) => rule.selectors);
    expect(faded).toEqual([]);
  });
});
