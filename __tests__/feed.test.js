import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
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
 *   - Page Down / Page Up / Home / End keys navigate between articles.
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
});
