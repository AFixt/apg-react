/**
 *
 * To use the Breadcrumb component in a React application,
 * you'll first import it into the file where you wish to
 * display breadcrumb navigation.
 *
 * The Breadcrumb component expects an array of items,
 * where each item is an object with a path and a label.
 * The path should correspond to the route path defined
 * in your React Router setup, and the label is the text
 * that will be displayed for each breadcrumb link.
 *
 * In this example, MyComponent wraps the Breadcrumb component
 * and some route definitions within a Router.
 *
 * The Breadcrumb component receives an array of breadcrumb items
 * that corresponds to the navigation path the user might follow.
 *
 * Each item in the breadcrumb trail is clickable, except for the last item,
 *  which represents the current page and is displayed as plain text.
 *
 * Make sure to adjust the paths and labels in breadcrumbItems to match your application's routes.
 */

import React from "react";
import Breadcrumb from "./Breadcrumb"; // Adjust the import path based on your project structure
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function MyComponent() {
    // Example breadcrumb items
    const breadcrumbItems = [
        { path: "/", label: "Home" },
        { path: "/category", label: "Category" },
        { path: "/category/item", label: "Item" },
    ];

    return (
        <Router>
            <div>
                {/* Breadcrumb component usage */}
                <Breadcrumb items={breadcrumbItems} />

                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/category" component={CategoryPage} />
                    <Route path="/category/item" component={ItemPage} />
                    {/* Define other routes as needed */}
                </Switch>
            </div>
        </Router>
    );
}

// Define your page components like HomePage, CategoryPage, ItemPage, etc.

export default MyComponent;
