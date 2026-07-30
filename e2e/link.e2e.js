const { openStory } = require('./helpers');

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
