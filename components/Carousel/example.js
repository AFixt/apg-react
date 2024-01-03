/**
 * To use the Carousel component in a React application,
 * you need to import it into the component where you
 * intend to display a carousel of slides.
 *
 * The Carousel component expects an array of slides,
 * where each slide is an object containing an id, label, and content.
 *
 * In this example, MyComponent renders a Carousel with three slides.
 * Each slide is defined in the carouselSlides array with
 * a unique id, a label, and the content that will be displayed inside that slide.
 *
 * The Carousel component manages the navigation between these slides,
 * allowing users to move to the next or previous slide and to select
 * specific slides using the buttons. The carousel also rotates the
 * slides automatically, with the option to pause or play this rotation.
 */

import React from "react";
import Carousel from "./Carousel"; // Adjust the import path based on your project structure

function MyComponent() {
    // Define the slides for the carousel
    const carouselSlides = [
        {
            id: "slide1",
            label: "Slide 1",
            content: <div>This is the content for Slide 1</div>,
        },
        {
            id: "slide2",
            label: "Slide 2",
            content: <div>This is the content for Slide 2</div>,
        },
        {
            id: "slide3",
            label: "Slide 3",
            content: <div>This is the content for Slide 3</div>,
        },
        // Add more slides as needed
    ];

    return (
        <div>
            <h1>My Carousel Component</h1>
            <Carousel slides={carouselSlides} />
        </div>
    );
}

export default MyComponent;
