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
    const contentId = `article-content-${uid}-${article.id}`;

    // `article` is not a name-from-content role, so the heading names this
    // element only if aria-labelledby points at it; without the reference every
    // article in a feed announces unlabelled. aria-describedby points at the
    // body, which the APG Feed pattern lists as the (optional) description.
    //
    // Styles hang off the `article` class, not the element name, so the
    // stylesheet has to be given something to match. Without this class every
    // rule in Article.css was inert — as was every `.feed .article` rule in
    // Feed.css, which has always been written against it.
    //
    // tabIndex={0}, not -1: the APG Feed pattern requires each article to be
    // "focusable and included in the page Tab sequence". At -1 an article could
    // only be reached programmatically or by clicking, so Tab skipped the feed
    // entirely and the whole Page Down / Page Up contract was dead for
    // keyboard-only users — the keys worked, but nothing could reach the
    // elements they act on.
    return (
      <article
        ref={ref}
        className="article"
        tabIndex={0}
        aria-labelledby={titleId}
        aria-describedby={contentId}
        aria-posinset={ariaPosinset}
        aria-setsize={ariaSetsize}
      >
        <h2 id={titleId}>{article.title}</h2>
        <div id={contentId}>{article.content}</div>
      </article>
    );
  },
);
Article.displayName = 'Article';

export default Article;
