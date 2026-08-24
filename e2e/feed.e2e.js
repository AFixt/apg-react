const { openStory } = require('./helpers');

/**
 * Feed keyboard escape hatch, in a real engine.
 *
 * `Ctrl+Home` / `Ctrl+End` move focus to the focusable element before / after
 * the feed. The interesting half of that contract cannot be tested in jsdom:
 * jsdom happily focuses a `display: none` element, so a unit test cannot tell
 * a correct implementation from one that focuses a hidden element, reports
 * success, and swallows the key — leaving the keyboard user trapped in exactly
 * the widget this binding exists to escape.
 *
 * Chromium declines to focus hidden elements, so these assertions discriminate.
 *
 * The story renders the feed alone, so the surrounding landmarks are injected
 * here rather than baked into the story, which other suites also read.
 */
const FEED = '#storybook-root [role="feed"]';

/** Put focusable elements on both sides of the feed, one of them hidden. */
const surroundFeed = (page) =>
  page.evaluate((feedSelector) => {
    const feed = document.querySelector(feedSelector);
    const mk = (id, style) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.id = id;
      b.textContent = id;
      if (style) b.setAttribute('style', style);
      return b;
    };
    feed.parentElement.insertBefore(mk('before-feed'), feed);
    // A hidden element sits nearest the feed on the 'after' side. A correct
    // implementation skips it; a naive one focuses it and stops.
    feed.parentElement.insertBefore(mk('after-hidden', 'display:none'), feed.nextSibling);
    feed.parentElement.insertBefore(
      mk('after-visible'),
      document.getElementById('after-hidden').nextSibling,
    );
  }, FEED);

const activeId = (page) => page.evaluate(() => document.activeElement.id || null);

const pressCtrl = async (page, key) => {
  await page.keyboard.down('Control');
  await page.keyboard.press(key);
  await page.keyboard.up('Control');
};

/** Focus the first article, which is where a feed user actually is when they press these keys. */
const focusFirstArticle = (page) =>
  page.evaluate((feedSelector) => document.querySelector(`${feedSelector} article`).focus(), FEED);

/** Where focus is, described well enough to read in a failure message. */
const activeDescription = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return 'BODY';
    const heading = el.querySelector && el.querySelector('h2');
    return heading ? `ARTICLE ${heading.textContent}` : `${el.tagName} ${el.id || el.textContent}`;
  });

describe('Feed keyboard reachability (E2E)', () => {
  /**
   * The defect this pins is invisible to jsdom: it has no tab sequence, so a
   * unit test can assert tabindex="0" but never that Tab actually reaches the
   * articles. At tabindex="-1" the observed sequence skipped the feed entirely
   * and the Page Down / Page Up contract was unreachable for keyboard users.
   */
  test('Tab enters the feed instead of skipping past it', async () => {
    const { page, close } = await openStory('components-feed--in-page-context');
    try {
      await page.waitForSelector(`${FEED} article`, { timeout: 10000 });
      await surroundFeed(page);
      await page.evaluate(() => document.getElementById('before-feed').focus());

      await page.keyboard.press('Tab');

      expect(await activeDescription(page)).toMatch(/^ARTICLE /);
    } finally {
      await close();
    }
  });

  test('every article is a tab stop, in document order', async () => {
    const { page, close } = await openStory('components-feed--in-page-context');
    try {
      await page.waitForSelector(`${FEED} article`, { timeout: 10000 });
      const count = await page.evaluate(
        (s) => document.querySelectorAll(`${s} article`).length,
        FEED,
      );
      await page.evaluate((s) => document.querySelector(`${s} article`).focus(), FEED);

      const seen = [await activeDescription(page)];
      for (let i = 1; i < count; i += 1) {
        await page.keyboard.press('Tab');
        seen.push(await activeDescription(page));
      }

      expect(seen).toHaveLength(count);
      expect(seen.every((s) => s.startsWith('ARTICLE '))).toBe(true);
      expect(new Set(seen).size).toBe(count);
    } finally {
      await close();
    }
  });
});

describe('Feed keyboard escape hatch (E2E)', () => {
  test('Ctrl+End skips a hidden element and focuses the next one that will take focus', async () => {
    const { page, close } = await openStory('components-feed--default');
    try {
      await page.waitForSelector(`${FEED} article`, { timeout: 10000 });
      await surroundFeed(page);
      await focusFirstArticle(page);

      await pressCtrl(page, 'End');

      expect(await activeId(page)).toBe('after-visible');
    } finally {
      await close();
    }
  });

  test('Ctrl+Home focuses the element before the feed', async () => {
    const { page, close } = await openStory('components-feed--default');
    try {
      await page.waitForSelector(`${FEED} article`, { timeout: 10000 });
      await surroundFeed(page);
      await focusFirstArticle(page);

      await pressCtrl(page, 'Home');

      expect(await activeId(page)).toBe('before-feed');
    } finally {
      await close();
    }
  });

  test('Ctrl+Home does not fall through to the bare Home behaviour', async () => {
    const { page, close } = await openStory('components-feed--default');
    try {
      await page.waitForSelector(`${FEED} article`, { timeout: 10000 });
      await surroundFeed(page);
      // Start on the *last* article, so "focus moved to the first article"
      // (the old bug) is distinguishable from "focus did not move".
      await page.evaluate((feedSelector) => {
        const articles = document.querySelectorAll(`${feedSelector} article`);
        articles[articles.length - 1].focus();
      }, FEED);

      await pressCtrl(page, 'Home');

      const landedInsideFeed = await page.evaluate(
        (feedSelector) => document.querySelector(feedSelector).contains(document.activeElement),
        FEED,
      );
      expect(landedInsideFeed).toBe(false);
    } finally {
      await close();
    }
  });
});
