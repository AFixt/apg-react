/**
 * To use the Feed component in a React application,
 * you should import it into a component where you
 * wish to display a list of articles.
 *
 * The Feed component takes a single prop,
 * fetchArticles, which is a function that asynchronously retrieves articles.
 * This function should return an array of article objects,
 * each ideally containing an id and other article-related properties.
 *
 * In this example, MyComponent renders a Feed component.
 * The fetchArticles function is passed as a prop to Feed.
 * It's a mock function that simulates an API call to fetch articles,
 * returning a promise that resolves to an array of article objects.
 *
 * Each article object has an id, title, and content.
 * The Feed component will use this function to load articles and render them using an Article component.
 *
 * Note: The Article component is a separate component in this repo that takes an
 * article object as a prop and renders its content.
 * You will need to implement this component and its corresponding CSS
 * (as well as the CSS for the Feed component) to match your application's design.
 */

import React from "react";
import Feed from "./Feed"; // Adjust the import path based on your project structure

// Mock function to simulate fetching articles
const fetchArticles = async () => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Return an array of mock articles
    return [
        { id: "1", title: "Article 1", content: "Content of Article 1..." },
        { id: "2", title: "Article 2", content: "Content of Article 2..." },
        // Add more articles as needed
    ];
};

function MyComponent() {
    return (
        <div>
            <h1>Article Feed</h1>
            <Feed fetchArticles={fetchArticles} />
        </div>
    );
}

export default MyComponent;
