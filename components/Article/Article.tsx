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

import React, { forwardRef, useId } from 'react';
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
    // `article.id` is only unique within one feed. Two Feed instances on a
    // page — or a feed whose backend numbers articles from 1 — would emit
    // duplicate heading ids, and aria-labelledby resolves a duplicate id to
    // the first match in document order, silently naming this article after
    // somebody else's. useId() scopes the id to this instance, matching what
    // Disclosure, Switch, MenuButton, CheckboxGroup and Combobox already do.
    const uid = useId();
    const titleId = `article-title-${uid}-${article.id}`;

    // Styles hang off the `article` class, not the element name, so the
    // stylesheet has to be given something to match. Without this class every
    // rule in Article.css was inert — as was every `.feed .article` rule in
    // Feed.css, which has always been written against it.
    return (
      <article
        ref={ref}
        className="article"
        tabIndex={-1}
        aria-labelledby={titleId}
        aria-posinset={ariaPosinset}
        aria-setsize={ariaSetsize}
      >
        <h2 id={titleId}>{article.title}</h2>
        <div>{article.content}</div>
      </article>
    );
  },
);
Article.displayName = 'Article';

export default Article;
