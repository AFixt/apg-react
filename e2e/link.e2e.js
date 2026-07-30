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
 */
describe('Link (E2E)', () => {
  const readCount = (page) => page.$eval(COUNT, (el) => (el.textContent || '').trim());

  /** Activates the link, then waits for the rendered count to settle. */
  const activate = async (page, how) => {
    const before = await readCount(page);

    if (how === 'keyboard') {
      await page.focus(LINK);
      await page.keyboard.press('Enter');
    } else {
      await page.click(LINK);
    }

    await page.waitForFunction(
      (selector, previous) => {
        const el = document.querySelector(selector);
        return el && (el.textContent || '').trim() !== previous;
      },
      {},
      COUNT,
      before,
    );

    return readCount(page);
  };

  test('mouse click invokes onClick exactly once', async () => {
    const { page, close } = await openStory('components-link--activation-count');
    expect(await activate(page, 'mouse')).toBe('1');
    await close();
  });

  test('Enter on the focused link invokes onClick exactly once', async () => {
    const { page, close } = await openStory('components-link--activation-count');
    expect(await activate(page, 'keyboard')).toBe('1');
    await close();
  });

  test('repeated activation increments once per activation, in either modality', async () => {
    const { page, close } = await openStory('components-link--activation-count');
    await activate(page, 'mouse');
    await activate(page, 'keyboard');
    expect(await activate(page, 'mouse')).toBe('3');
    await close();
  });
});
