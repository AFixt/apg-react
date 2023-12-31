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

import React from "react";
import PropTypes from "prop-types";
import "./Article.css";

const Article = ({ article, ariaPosinset, ariaSetsize }) => {
    return (
        <article
            aria-posinset={ariaPosinset}
            aria-setsize={ariaSetsize}
        >
            <h2 id={`article-title-${article.id}`}>{article.title}</h2>
            <div>{article.content}</div>
        </article>
    );
};

Article.propTypes = {
    article: PropTypes.object.isRequired,
    ariaPosinset: PropTypes.number.isRequired,
    ariaSetsize: PropTypes.number.isRequired,
};

export default Article;
