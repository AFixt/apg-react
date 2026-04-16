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
import Article from "../Article/Article";
import "./Feed.css";

interface ArticleData {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
}

interface FeedProps {
    fetchArticles: () => Promise<ArticleData[]>;
    /** Accessible name for the feed region. */
    ariaLabel?: string;
}

const Feed: React.FC<FeedProps> = ({ fetchArticles, ariaLabel }) => {
    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [loading, setLoading] = useState(false);
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
                if (entries[0].isIntersecting) {
                    loadMoreArticles();
                }
            },
            { threshold: 1.0 }
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

export default Feed;
