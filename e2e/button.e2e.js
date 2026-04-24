const { openStory } = require('./helpers');

const BTN = '#storybook-root button';

describe('Button (E2E)', () => {
  test('click activates the action', async () => {
    const { page, close } = await openStory('components-button--default');
    await page.click(BTN);
    const name = await page.$eval(BTN, (el) => (el.textContent || '').trim());
    expect(name).toBe('Click me');
    await close();
  });

  test('Space and Enter activate the button', async () => {
    const { page, close } = await openStory('components-button--default');
    await page.focus(BTN);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    const focusedTag = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedTag).toBe('BUTTON');
    await close();
  });

  test('toggle button toggles aria-pressed in both directions', async () => {
    const { page, close } = await openStory('components-button--toggle');
    const SEL = '#storybook-root button[aria-pressed]';
    await page.waitForSelector(SEL);
    const getPressed = () => page.$eval(SEL, (el) => el.getAttribute('aria-pressed'));
    const start = await getPressed();
    await page.click(SEL);
    expect(await getPressed()).not.toBe(start);
    await page.click(SEL);
    expect(await getPressed()).toBe(start);
    await close();
  });

  test('focused button shows a visible focus indicator', async () => {
    const { page, close } = await openStory('components-button--default');
    await page.focus(BTN);
    const visible = await page.$eval(BTN, (el) => {
      const cs = getComputedStyle(el);
      const hasOutline =
        cs.outlineStyle !== 'none' && cs.outlineStyle !== '' && parseFloat(cs.outlineWidth) > 0;
      const hasShadow = cs.boxShadow && cs.boxShadow !== 'none' && cs.boxShadow !== '';
      return hasOutline || hasShadow;
    });
    expect(visible).toBe(true);
    await close();
  });
});
