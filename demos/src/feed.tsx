import React from 'react';
import Feed from '../../components/Feed/Feed';
import { mount } from './mount';

let nextId = 0;

const paragraphs = [
  'The APG feed pattern lets assistive technology users read one article at a time while more content loads in the background.',
  'Scrolling toward the end of the loaded articles triggers the next batch automatically, without a full page reload.',
  'Each article exposes aria-posinset and aria-setsize so screen reader users hear their position within the feed as it grows.',
];

/**
 * Produces a batch of demo articles. The first call returns five articles so
 * the page loads with a full initial page; every call after that returns one
 * more, mirroring how an infinite-scroll feed keeps extending.
 * @param count How many articles to generate in this batch.
 */
function makeArticles(count: number) {
  return Array.from({ length: count }, () => {
    nextId += 1;
    const id = nextId;
    return {
      id: String(id),
      title: `Article ${id}`,
      content: paragraphs[(id - 1) % paragraphs.length],
    };
  });
}

const fetchArticles = () =>
  new Promise<ReturnType<typeof makeArticles>>((resolve) => {
    setTimeout(() => resolve(makeArticles(nextId === 0 ? 5 : 1)), 400);
  });

/**
 * Scrolls the feed's end-of-content sentinel into view, which is what its
 * IntersectionObserver actually watches. This gives keyboard users a way to
 * trigger the next batch without depending on a continuous scroll gesture.
 */
function requestMoreArticles(): void {
  const sentinel = document.querySelector('.feed > div:last-child');
  sentinel?.scrollIntoView({ block: 'end' });
}

/**
 * Feed demo: an infinite-scroll list of articles.
 *
 * Feed owns its article list and loading state internally and only accepts a
 * `fetchArticles` callback, so this demo cannot add a "load failed" alert or
 * clear a stuck `aria-busy` on a rejected fetch — `loadMoreArticles` in the
 * component never catches a rejection, so both are left as component gaps
 * rather than papered over here.
 */
function FeedDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Feed</h1>
      <Feed fetchArticles={fetchArticles} ariaLabel="News" />
      <p>
        <button type="button" onClick={requestMoreArticles}>
          Load more
        </button>
      </p>
    </main>
  );
}

mount(<FeedDemo />);
