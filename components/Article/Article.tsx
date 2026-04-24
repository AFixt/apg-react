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

interface ArticleData {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

interface ArticleProps {
  article: ArticleData;
  ariaPosinset: number;
  ariaSetsize: number;
}

const Article = forwardRef<HTMLElement, ArticleProps>(
  ({ article, ariaPosinset, ariaSetsize }, ref) => {
    return (
      <article ref={ref} tabIndex={-1} aria-posinset={ariaPosinset} aria-setsize={ariaSetsize}>
        <h2 id={`article-title-${article.id}`}>{article.title}</h2>
        <div>{article.content}</div>
      </article>
    );
  },
);
Article.displayName = 'Article';

export default Article;
