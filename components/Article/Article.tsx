/**
 * Article component, renders an article with title and content
 * for use in the Feed component.
 *
 * @component
 * @param {Object} article - The article object containing title and content.
 * @param {number} ariaPosinset - The position of the article in the set.
 * @param {number} ariaSetsize - The total number of articles in the set.
 * @returns {JSX.Element} The rendered article component.
 */

import React, { forwardRef } from 'react';
import './Article.css';

/** Data shape consumed by the Article component. */
interface ArticleData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

/** Props for the Article component. */
interface ArticleProps {
  article: ArticleData;
  ariaPosinset: number;
  ariaSetsize: number;
}

const Article = forwardRef<HTMLElement, ArticleProps>(
  ({ article, ariaPosinset, ariaSetsize }, ref) => {
    // Styles hang off the `article` class, not the element name, so the
    // stylesheet has to be given something to match. Without this class every
    // rule in Article.css was inert — as was every `.feed .article` rule in
    // Feed.css, which has always been written against it.
    //
    // aria-labelledby points at the <h2> below. `article` is not a
    // name-from-content role, so the heading does not name this element on its
    // own — without the reference every article is announced unlabelled, which
    // defeats the skim-reading the feed pattern exists to support. The APG's
    // Feed pattern requires it.
    return (
      <article
        ref={ref}
        className="article"
        tabIndex={-1}
        aria-labelledby={`article-title-${article.id}`}
        aria-posinset={ariaPosinset}
        aria-setsize={ariaSetsize}
      >
        <h2 id={`article-title-${article.id}`}>{article.title}</h2>
        <div>{article.content}</div>
      </article>
    );
  },
);
Article.displayName = 'Article';

export default Article;
