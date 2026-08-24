import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Feed from '../components/Feed/Feed';

/**
 * APG pattern: Feed
 * https://www.w3.org/WAI/ARIA/apg/patterns/feed/
 *
 * Key requirements:
 *   - Container has role="feed".
 *   - Container has aria-busy while loading new content.
 *   - Each child element has role="article" (native <article>).
 *   - Articles should expose aria-posinset and aria-setsize (via Article component).
 *   - Page Down / Page Up move between articles.
 *   - Ctrl + Home / Ctrl + End move focus out of the feed, to the focusable
 *     element before / after it. These are the pattern's documented escape
 *     hatch, and are the only Home/End bindings the APG's table actually lists.
 *   - Bare Home / End are a deliberate extension (first / last article) and
 *     must not swallow the Control variants.
 */

// jsdom lacks IntersectionObserver; stub fires callback on observe
// so Feed's "load more on sentinel intersection" effect triggers.
class IOStub {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ isIntersecting: true }]);
  }
  disconnect() {}
  unobserve() {}
}
global.IntersectionObserver = IOStub;

describe('Feed Component (APG feed pattern)', () => {
  const sampleArticles = [
    { id: 'a1', title: 'Article 1', content: 'Body 1' },
    { id: 'a2', title: 'Article 2', content: 'Body 2' },
    { id: 'a3', title: 'Article 3', content: 'Body 3' },
  ];

  const makeFetcher = (batches) => {
    let i = 0;
    return jest.fn(() => Promise.resolve(batches[i++] ?? []));
  };

  test('exposes role=feed on the container', async () => {
    const fetcher = makeFetcher([sampleArticles]);
    render(<Feed fetchArticles={fetcher} />);
    const feed = await screen.findByRole('feed');
    expect(feed).toBeInTheDocument();
  });

  test('sets aria-busy to false after articles load', async () => {
    const fetcher = makeFetcher([sampleArticles]);
    render(<Feed fetchArticles={fetcher} />);
    const feed = await screen.findByRole('feed');
    await waitFor(() => {
      expect(feed).toHaveAttribute('aria-busy', 'false');
    });
  });

  test('renders each article as a child article element', async () => {
    const fetcher = makeFetcher([sampleArticles]);
    const { container } = render(<Feed fetchArticles={fetcher} />);
    await waitFor(() => {
      expect(container.querySelectorAll('article').length).toBe(sampleArticles.length);
    });
  });

  test('fetcher is invoked to populate the feed', async () => {
    const fetcher = makeFetcher([sampleArticles]);
    render(<Feed fetchArticles={fetcher} />);
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalled();
    });
  });

  describe('keyboard interaction', () => {
    /**
     * Renders the feed between two focusable elements, which is what
     * Ctrl+Home / Ctrl+End are defined against: without something focusable on
     * each side the pattern's escape hatch has no destination and the test
     * would pass for the wrong reason.
     */
    const renderFeedInPage = async () => {
      const fetcher = makeFetcher([sampleArticles]);
      const utils = render(
        <div>
          <button type="button">before</button>
          <Feed fetchArticles={fetcher} ariaLabel="Test feed" />
          <button type="button">after</button>
        </div>,
      );
      const feed = await screen.findByRole('feed');
      await waitFor(() => {
        expect(utils.container.querySelectorAll('article').length).toBe(sampleArticles.length);
      });
      return { ...utils, feed, articles: [...utils.container.querySelectorAll('article')] };
    };

    test('Ctrl+End moves focus to the focusable element after the feed', async () => {
      const { feed } = await renderFeedInPage();
      fireEvent.keyDown(feed, { key: 'End', ctrlKey: true });
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));
    });

    test('Ctrl+Home moves focus to the focusable element before the feed', async () => {
      const { feed } = await renderFeedInPage();
      fireEvent.keyDown(feed, { key: 'Home', ctrlKey: true });
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'before' }));
    });

    test('Ctrl+Home is not treated as a bare Home (does not focus the first article)', async () => {
      const { feed, articles } = await renderFeedInPage();
      fireEvent.keyDown(feed, { key: 'Home', ctrlKey: true });
      expect(document.activeElement).not.toBe(articles[0]);
    });

    test('Ctrl+End is not treated as a bare End (does not focus the last article)', async () => {
      const { feed, articles } = await renderFeedInPage();
      fireEvent.keyDown(feed, { key: 'End', ctrlKey: true });
      expect(document.activeElement).not.toBe(articles[articles.length - 1]);
    });

    test('Ctrl+End does not consume the key when nothing is focusable after the feed', async () => {
      const fetcher = makeFetcher([sampleArticles]);
      render(
        <div>
          <button type="button">before</button>
          <Feed fetchArticles={fetcher} ariaLabel="Test feed" />
        </div>,
      );
      const feed = await screen.findByRole('feed');
      // Not cancelled, so the browser's own Ctrl+End (scroll to bottom) still
      // runs — declining to act beats doing the wrong thing.
      const notCancelled = fireEvent.keyDown(feed, { key: 'End', ctrlKey: true });
      expect(notCancelled).toBe(true);
    });

    test('bare Home and End still jump to the first and last article', async () => {
      const { feed, articles } = await renderFeedInPage();

      fireEvent.keyDown(feed, { key: 'End' });
      expect(document.activeElement).toBe(articles[articles.length - 1]);

      fireEvent.keyDown(feed, { key: 'Home' });
      expect(document.activeElement).toBe(articles[0]);
    });

    test('Page Down and Page Up move between adjacent articles', async () => {
      const { feed, articles } = await renderFeedInPage();

      articles[0].focus();
      fireEvent.keyDown(feed, { key: 'PageDown' });
      expect(document.activeElement).toBe(articles[1]);

      fireEvent.keyDown(feed, { key: 'PageUp' });
      expect(document.activeElement).toBe(articles[0]);
    });

    test('Ctrl+End skips focusable content inside the feed', async () => {
      // compareDocumentPosition reports a descendant as FOLLOWING, so without
      // an explicit "not inside the feed" filter this link would be picked as
      // "the element after the feed" and Ctrl+End would never leave.
      const fetcher = makeFetcher([
        [{ id: 'a1', title: 'Article 1', content: <a href="/inside">inside link</a> }],
      ]);
      render(
        <div>
          <Feed fetchArticles={fetcher} ariaLabel="Test feed" />
          <button type="button">after</button>
        </div>,
      );
      const feed = await screen.findByRole('feed');
      await screen.findByRole('link', { name: 'inside link' });

      fireEvent.keyDown(feed, { key: 'End', ctrlKey: true });
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));
    });

    test('Alt and Meta combinations are left to the browser', async () => {
      const { feed, articles } = await renderFeedInPage();
      articles[1].focus();

      expect(fireEvent.keyDown(feed, { key: 'Home', altKey: true })).toBe(true);
      expect(fireEvent.keyDown(feed, { key: 'End', metaKey: true })).toBe(true);
      expect(document.activeElement).toBe(articles[1]);
    });

    // The APG binds plain Ctrl+Home / Ctrl+End. Richer combinations mean
    // something else to the browser or the OS — Ctrl+Shift+Home extends the
    // selection to the start of the document, Ctrl+Alt is AltGr on Windows and
    // Linux — so claiming them is the same class of bug as a bare Home
    // swallowing Ctrl+Home.
    test.each([
      ['Ctrl+Shift+Home', { key: 'Home', ctrlKey: true, shiftKey: true }],
      ['Ctrl+Shift+End', { key: 'End', ctrlKey: true, shiftKey: true }],
      ['Ctrl+Alt+Home', { key: 'Home', ctrlKey: true, altKey: true }],
      ['Ctrl+Alt+End', { key: 'End', ctrlKey: true, altKey: true }],
      ['Ctrl+Meta+End', { key: 'End', ctrlKey: true, metaKey: true }],
    ])('%s is left to the browser', async (_label, init) => {
      const { feed, articles } = await renderFeedInPage();
      articles[1].focus();

      expect(fireEvent.keyDown(feed, init)).toBe(true);
      expect(document.activeElement).toBe(articles[1]);
    });
  });
});
