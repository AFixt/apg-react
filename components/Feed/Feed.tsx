/**
 * A component that displays a feed of articles.
 *  This implementation assumes the presence of a
 *  fetchArticles function that asynchronously
 *  retrieves more articles. Additionally, the CSS files
 *  (Feed.css, Article.css) need to be created to style
 *  the components according to your design.
 *  Focus management around nested feeds, and restoring focus
 *  after new content loads, are left to the implementer.
 *
 * Keyboard interface (APG Feed pattern):
 *
 * | Key           | Action                                              |
 * | ------------- | --------------------------------------------------- |
 * | `Page Down`   | Move focus to the next article.                      |
 * | `Page Up`     | Move focus to the previous article.                  |
 * | `Ctrl + End`  | Move focus to the focusable element after the feed.  |
 * | `Ctrl + Home` | Move focus to the focusable element before the feed. |
 * | `End`         | Move focus to the last article. *(extension)*        |
 * | `Home`        | Move focus to the first article. *(extension)*       |
 *
 * The Control combinations are the pattern's escape hatch: a long feed is
 * otherwise a place keyboard users get stuck. Bare `Home`/`End` are not in the
 * APG's table — they are an extension, kept because the APG says the feed role
 * has no well-established keyboard convention and recommends "the following,
 * or a similar, interface".
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.fetchArticles - A function to fetch articles.
 * @param {string} [props.ariaLabel] - Accessible name for the feed region.
 * @returns {JSX.Element} The rendered Feed component.
 */

import React, { useEffect, useRef, useState } from 'react';
import Article from '../Article/Article';
import { focusAdjacentTo } from '../_internal/focusable';
import './Feed.css';

/** Article Data used by the Feed component. */
interface ArticleData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

/** Props for the Feed component. */
interface FeedProps {
  fetchArticles: () => Promise<ArticleData[]>;
  /** Accessible name for the feed region. */
  ariaLabel?: string;
}

const Feed: React.FC<FeedProps> = ({ fetchArticles, ariaLabel }) => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

  // Function to load more articles
  const loadMoreArticles = async () => {
    setLoading(true);
    const newArticles = await fetchArticles();
    setArticles((prevArticles) => [...prevArticles, ...newArticles]);
    setLoading(false);
  };

  // Handle scrolling to load more articles
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreArticles();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(feedEndRef.current!);
    return () => observer.disconnect();
  }, []);

  // Focus management for articles
  const focusArticle = (index: number) => {
    if (index >= 0 && index < articles.length) {
      articleRefs.current[index]?.focus();
    }
  };

  // Keyboard navigation handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ctrl+Home / Ctrl+End are the APG's documented way *out* of a feed, which
    // matters because a long feed is otherwise a place keyboard users get
    // stuck. They have to be settled before the bare Home/End branch below:
    // switching on `e.key` alone made Ctrl+Home behave as a bare Home, moving
    // focus to the first article and calling preventDefault() — actively doing
    // the wrong thing rather than declining to act.
    if (e.ctrlKey) {
      if (e.key !== 'Home' && e.key !== 'End') return;
      // Only swallow the key if focus actually moved. With nothing focusable
      // outside the feed there is no escape hatch to offer, and suppressing
      // the browser's own Ctrl+Home/End would leave the user worse off.
      if (focusAdjacentTo(feedRef.current, e.key === 'Home' ? 'before' : 'after')) {
        e.preventDefault();
      }
      return;
    }

    // Alt and Meta combinations belong to the browser and the OS (Alt+Home is
    // "go to homepage"; Cmd+Home is scroll-to-top on macOS). Claiming them
    // would be the same bug as swallowing Ctrl+Home.
    if (e.altKey || e.metaKey) return;

    const focusedIndex = articleRefs.current.findIndex((ref) => ref === document.activeElement);
    switch (e.key) {
      case 'PageDown':
        focusArticle(focusedIndex + 1);
        break;
      case 'PageUp':
        focusArticle(focusedIndex - 1);
        break;
      // Bare Home/End are not in the APG's table for this pattern. They are a
      // deliberate extension — the APG says the feed role has no
      // well-established keyboard convention and recommends "the following, or
      // a similar, interface" — kept because jumping to the ends of a feed is
      // useful. They must not swallow the Control variants, which is what the
      // early return above guarantees.
      case 'End':
        focusArticle(articles.length - 1);
        break;
      case 'Home':
        focusArticle(0);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  return (
    <div
      ref={feedRef}
      className="feed"
      role="feed"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      aria-busy={loading}
    >
      {articles.map((article, index) => (
        <Article
          key={article.id}
          article={article}
          ariaPosinset={index + 1}
          ariaSetsize={articles.length}
          ref={(el: HTMLElement | null) => (articleRefs.current[index] = el)}
        />
      ))}
      <div ref={feedEndRef} />
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Feed pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Feed;
