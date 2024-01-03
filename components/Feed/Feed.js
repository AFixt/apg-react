/**
 * A component that displays a feed of articles.
 *  This implementation assumes the presence of a
 *  fetchArticles function that asynchronously
 *  retrieves more articles. Additionally, the CSS files
 *  (Feed.css, Article.css) need to be created to style
 *  the components according to your design.
 *  For real-world applications, further development is
 *  needed for complete keyboard navigation and management
 *  of focus, especially when navigating between nested
 *  feeds or managing focus after loading new content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.fetchArticles - A function to fetch articles.
 * @returns {JSX.Element} The rendered Feed component.
 */

import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Article from "./Article"; // Assume Article is a separate component
import "./Feed.css";

const Feed = ({ fetchArticles }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const feedEndRef = useRef(null);
    const articleRefs = useRef([]);

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
                if (entries[0].isIntersecting) {
                    loadMoreArticles();
                }
            },
            { threshold: 1.0 }
        );
        observer.observe(feedEndRef.current);
        return () => observer.disconnect();
    }, []);

    // Focus management for articles
    const focusArticle = (index) => {
        if (index >= 0 && index < articles.length) {
            articleRefs.current[index]?.focus();
        }
    };

    // Keyboard navigation handling
    const handleKeyDown = (e) => {
        const focusedIndex = articleRefs.current.findIndex(
            (ref) => ref === document.activeElement
        );
        switch (e.key) {
            case "PageDown":
                focusArticle(focusedIndex + 1);
                break;
            case "PageUp":
                focusArticle(focusedIndex - 1);
                break;
            case "End":
                focusArticle(articles.length - 1);
                break;
            case "Home":
                focusArticle(0);
                break;
            default:
                return;
        }
        e.preventDefault();
    };

    return (
        <div
            className="feed"
            role="feed"
            onKeyDown={handleKeyDown}
            aria-busy={loading}
        >
            {articles.map((article, index) => (
                <Article
                    key={article.id}
                    article={article}
                    ref={(el) => (articleRefs.current[index] = el)}
                />
            ))}
            <div ref={feedEndRef} />
        </div>
    );
};

Feed.propTypes = {
    fetchArticles: PropTypes.func.isRequired,
};

export default Feed;
