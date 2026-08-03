const { openStory, injectA11yHelpers, tabTo } = require('./helpers');

/**
 * Article styling, in a real engine.
 *
 * Article.css is written entirely against a `.article` class, and the component
 * used to render a bare `<article>` with no className at all — so every rule in
 * the file was inert, as was every `.feed .article` rule in Feed.css. Only a
 * real browser catches that: jsdom does not resolve stylesheets, so the unit
 * suite can assert the class is present but never that a rule applied.
 *
 * These assertions read computed style, so a selector that stops matching fails
 * here rather than shipping silently. This is the same shape as the "the
 * component stylesheet applies to the rendered anchor" test in link.e2e.js,
 * which exists because Link had this exact defect (89427e1).
 */
const ARTICLE = '#storybook-root article';
const ARTICLE_LINK = '#storybook-root article a';

/** Resolve a design token off the document root, so assertions track the theme. */
const token = (page, name) =>
  page.evaluate(
    (prop) => getComputedStyle(document.documentElement).getPropertyValue(prop).trim(),
    name,
  );

/** Convert a `#rrggbb` token to the `rgb(r, g, b)` notation computed style returns. */
const toRgb = (hex) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;

describe('Article (E2E)', () => {
  test('the component stylesheet applies to the rendered article', async () => {
    const { page, close } = await openStory('components-article--default');
    try {
      const { display, flexDirection, boxShadow, padding } = await page.$eval(ARTICLE, (el) => {
        const cs = getComputedStyle(el);
        return {
          display: cs.display,
          flexDirection: cs.flexDirection,
          boxShadow: cs.boxShadow,
          padding: cs.paddingTop,
        };
      });

      // A bare <article> is `display: block` with no padding and no shadow, so
      // each of these is something only the stylesheet can have produced.
      expect(display).toBe('flex');
      expect(flexDirection).toBe('column');
      expect(boxShadow).not.toBe('none');
      expect(parseFloat(padding)).toBeGreaterThan(0);
    } finally {
      await close();
    }
  });

  test('the heading rule applies', async () => {
    const { page, close } = await openStory('components-article--default');
    try {
      const { marginTop, fontWeight } = await page.$eval(`${ARTICLE} h2`, (el) => {
        const cs = getComputedStyle(el);
        return { marginTop: cs.marginTop, fontWeight: cs.fontWeight };
      });

      // Deliberately not font-size. `--apg-font-size-xl` is 1.5rem and the UA
      // default for h2 is 1.5em — both 24px here, so that assertion would hold
      // whether or not the rule applied. These two do not: the UA gives h2 a
      // 0.83em top margin and `bold` (700), and the stylesheet overrides both.
      expect(parseFloat(marginTop)).toBe(0);
      expect(fontWeight).toBe(await token(page, '--apg-font-weight-medium'));
    } finally {
      await close();
    }
  });

  test('links inside the content take the stylesheet colour', async () => {
    const { page, close } = await openStory('components-article--with-link');
    try {
      const color = await page.$eval(ARTICLE_LINK, (el) => getComputedStyle(el).color);
      const expected = await token(page, '--apg-color-primary');
      expect(color).toBe(toRgb(expected));
    } finally {
      await close();
    }
  });

  test('focusing a link in the content renders the intended focus ring', async () => {
    const { page, close } = await openStory('components-article--with-link');
    try {
      await injectA11yHelpers(page);
      // Real Tab presses: the ring is written against :focus-visible, which
      // programmatic focus deliberately does not match.
      await tabTo(page, ARTICLE_LINK);

      const { hasRing, boxShadow } = await page.$eval(ARTICLE_LINK, (el) => ({
        hasRing: window.__a11y.isVisibleFocusRing(el),
        boxShadow: getComputedStyle(el).boxShadow,
      }));

      // The box-shadow assertion is what pins the component's own ring. Without
      // it this would have passed while the stylesheet was inert, because the
      // `outline: none` in the same unmatched rule left the UA outline standing.
      expect(hasRing).toBe(true);
      expect(boxShadow).not.toBe('none');
    } finally {
      await close();
    }
  });

  test('reduced motion actually suppresses the transition', async () => {
    const { page, close } = await openStory('components-article--default');
    try {
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

      const { matches, duration } = await page.$eval(ARTICLE, (el) => ({
        matches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        duration: getComputedStyle(el).transitionDuration,
      }));

      // Emulation first, so this cannot pass by the media feature silently
      // failing to apply.
      expect(matches).toBe(true);

      // The opt-out only works because its @media block sits *after* the rule
      // it overrides. Written above it — as it was, and as it still is in the
      // other component stylesheets — it loses on source order at equal
      // specificity and the transition survives at 0.3s.
      expect(parseFloat(duration)).toBe(0);
    } finally {
      await close();
    }
  });
});
