const { openStory, injectA11yHelpers, emulateForcedColors, tabTo } = require('./helpers');

const LINK = '#storybook-root a';
const COUNT = '#storybook-root [data-testid="activation-count"]';

/**
 * Activation parity for Link.
 *
 * Only a real browser exercises the native anchor behaviour that makes this
 * worth asserting: pressing Enter on a focused anchor synthesises a click. A
 * component that both attached onClick and invoked it from its keydown handler
 * would fire the callback twice here, while jsdom would show only one call.
 *
 * Both render branches are covered. Storybook's global decorator supplies a
 * router link through LinkComponentProvider, so the plain-anchor branch — what
 * consumers get with no router — needs its own story that opts out with
 * `linkComponent={null}`.
 */
const BRANCHES = [
  { name: 'injected router link', story: 'components-link--activation-count', routerLink: true },
  {
    name: 'plain anchor fallback',
    story: 'components-link--activation-count-plain-anchor',
    routerLink: false,
  },
];

describe('Link (E2E)', () => {
  const readCount = (page) => page.$eval(COUNT, (el) => (el.textContent || '').trim());

  /**
   * Waits for React to commit any pending render. Two animation frames is a
   * deterministic settle point: the first runs after the current task's
   * microtasks, the second after React has painted the resulting update.
   */
  const settle = (page) =>
    page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        }),
    );

  /**
   * Activates the link, then reads the counter once rendering has settled.
   * Reading after a fixed settle rather than on first change matters: a
   * double-fire arrives as two separate events, and stopping at the first
   * change could observe 1 and miss the second increment.
   */
  const activate = async (page, how) => {
    if (how === 'keyboard') {
      await page.focus(LINK);
      await page.keyboard.press('Enter');
    } else {
      await page.click(LINK);
    }

    await settle(page);
    return readCount(page);
  };

  describe.each(BRANCHES)('$name', ({ story, routerLink }) => {
    test('the story renders the branch it claims to', async () => {
      const { page, close } = await openStory(story);
      // react-router stamps data-discover on the anchors it renders, which is
      // how each story proves which branch it is actually exercising. Without
      // this guard both stories could silently test the same code path.
      const isRouterLink = await page.$eval(LINK, (el) => el.hasAttribute('data-discover'));
      expect(isRouterLink).toBe(routerLink);
      await close();
    });

    test('mouse click invokes onClick exactly once', async () => {
      const { page, close } = await openStory(story);
      expect(await activate(page, 'mouse')).toBe('1');
      await close();
    });

    test('Enter on the focused link invokes onClick exactly once', async () => {
      const { page, close } = await openStory(story);
      expect(await activate(page, 'keyboard')).toBe('1');
      await close();
    });

    test('repeated activation increments once per activation, in either modality', async () => {
      const { page, close } = await openStory(story);
      await activate(page, 'mouse');
      await activate(page, 'keyboard');
      expect(await activate(page, 'mouse')).toBe('3');
      await close();
    });
  });

  /**
   * The component's stylesheet only lands if its selector matches the element
   * actually rendered. It previously keyed off `a[role='link']`, which never
   * matched the native anchor the component emits — the `link` role on an
   * anchor is implicit, and an attribute selector cannot see it. Every rule in
   * the file was inert as a result, in both render branches.
   *
   * Only a real browser catches this: jsdom does not resolve stylesheets, so
   * the unit suite can assert the class is present but never that a rule
   * applied. These assertions read computed style, so a selector that stops
   * matching fails here rather than shipping silently.
   */
  describe.each(BRANCHES)('$name styling', ({ story }) => {
    test('the component stylesheet applies to the rendered anchor', async () => {
      const { page, close } = await openStory(story);
      const { color, expected } = await page.$eval(LINK, (el) => ({
        color: getComputedStyle(el).color,
        // Resolve the token the rule is written against, so the assertion
        // tracks the theme instead of hardcoding a colour.
        expected: getComputedStyle(document.documentElement)
          .getPropertyValue('--apg-color-primary')
          .trim(),
      }));

      // Computed colour is rgb(); the token is a hex literal. Compare on the
      // channel values so the two notations meet.
      const toRgb = (hex) =>
        `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
      expect(color).toBe(toRgb(expected));
      await close();
    });

    test('focusing the link renders the intended focus ring', async () => {
      const { page, close } = await openStory(story);
      await injectA11yHelpers(page);
      await page.focus(LINK);

      const { hasRing, boxShadow } = await page.$eval(LINK, (el) => ({
        hasRing: window.__a11y.isVisibleFocusRing(el),
        boxShadow: getComputedStyle(el).boxShadow,
      }));

      // The focus indicator must be visible at all — but that alone would have
      // passed while the stylesheet was inert, because the `outline: none` in
      // the same unmatched rule left the browser default outline standing. The
      // box-shadow assertion is what pins the component's own ring.
      expect(hasRing).toBe(true);
      expect(boxShadow).not.toBe('none');
      await close();
    });

    test('the focus indicator survives forced-colors mode', async () => {
      const { page, close } = await openStory(story);
      await emulateForcedColors(page);
      await injectA11yHelpers(page);
      // Real Tab presses, not page.focus(): the indicator asserted on here is
      // :focus-visible, which programmatic focus deliberately does not match.
      await tabTo(page, LINK);

      const { hasRing, outlineStyle, outlineWidth, boxShadow } = await page.$eval(LINK, (el) => {
        const cs = getComputedStyle(el);
        return {
          hasRing: window.__a11y.isVisibleFocusRing(el),
          outlineStyle: cs.outlineStyle,
          outlineWidth: cs.outlineWidth,
          boxShadow: cs.boxShadow,
        };
      });

      // Forced colors suppresses box-shadow, so the ring the previous test
      // asserts on is gone here by definition — and `outline: none` in the same
      // rule means nothing replaces it unless the forced-colors block applies.
      // Asserting the shadow is absent keeps this test honest: without it, the
      // whole thing would pass on the normal-mode ring if emulation silently
      // stopped working.
      expect(boxShadow).toBe('none');
      expect(outlineStyle).not.toBe('none');
      expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
      expect(hasRing).toBe(true);
      await close();
    });
  });

  test('Shift+F10 is not intercepted, so the native context menu survives', async () => {
    const { page, close } = await openStory(BRANCHES[1].story);
    // dispatchEvent is synchronous, so every handler — including React's, which
    // is delegated to the root container — has run by the time it returns.
    // Reading defaultPrevented from a listener on the link itself would race
    // React's and report false regardless.
    const defaultPrevented = await page.evaluate(() => {
      const link = document.querySelector('#storybook-root a');
      const event = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      link.focus();
      link.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(defaultPrevented).toBe(false);
    await close();
  });
});
