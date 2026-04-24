const { openStory } = require('./helpers');

const OPEN_BTN = '#storybook-root button';
const DIALOG = "#storybook-root [role='dialog']";

describe('ModalDialog (E2E)', () => {
  test('Escape key closes the dialog (real browser keydown)', async () => {
    // Use the "default" story and open manually — the "open-by-default"
    // story's play function may close the dialog before we get here.
    const { page, close } = await openStory('components-modaldialog--default');
    await page.click(OPEN_BTN);
    await page.waitForSelector(DIALOG, { timeout: 5000 });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector("#storybook-root [role='dialog']"), {
      timeout: 5000,
    });
    await close();
  });

  test('opening dialog moves focus into it', async () => {
    const { page, close } = await openStory('components-modaldialog--default');
    await page.click(OPEN_BTN);
    await page.waitForSelector(DIALOG, { timeout: 5000 });
    const activeInside = await page.evaluate(() => {
      const dlg = document.querySelector("#storybook-root [role='dialog']");
      return dlg && dlg.contains(document.activeElement);
    });
    expect(activeInside).toBe(true);
    await close();
  });

  test("close button has accessible name 'Close dialog'", async () => {
    const { page, close } = await openStory('components-modaldialog--default');
    await page.click(OPEN_BTN);
    await page.waitForSelector(DIALOG, { timeout: 5000 });
    const name = await page.$eval(
      '#storybook-root .modal-dialog-close',
      (el) => el.getAttribute('aria-label') || el.textContent,
    );
    expect(name.trim()).toBe('Close dialog');
    await close();
  });
});
