/**
 * A carousel component that displays a slideshow of slides.
 *  This implementation assumes a simple carousel structure.
 *  For a production environment, additional features like animation,
 *  better focus management, and responsive design may be necessary.
 *  This is just a foundational implementation.
 *
 * @component
 * @param {Object[]} slides - An array of slide objects.
 * @param {string} slides[].id - The unique identifier of the slide.
 * @param {string} slides[].label - The label or title of the slide.
 * @param {ReactNode} slides[].content - The content to be displayed in the slide.
 * @returns {JSX.Element} The Carousel component.
 */
import React, { useState, useEffect, useRef } from "react";
import "./Carousel.css";

interface CarouselSlide {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface CarouselLabels {
    previousSlide?: string;
    nextSlide?: string;
    pauseRotation?: string;
    startRotation?: string;
    selectSlide?: (i: number) => string;
}

interface CarouselProps {
    slides: CarouselSlide[];
    labels?: CarouselLabels;
}

const Carousel: React.FC<CarouselProps> = ({ slides, labels }) => {
    const defaultLabels: CarouselLabels = {
        previousSlide: "Previous slide",
        nextSlide: "Next slide",
        pauseRotation: "Pause rotation",
        startRotation: "Start rotation",
        selectSlide: (i: number) => `Select slide ${i}`,
    };
    const l = { ...defaultLabels, ...labels };
    const [activeIndex, setActiveIndex] = useState(0);
    const [isRotating, setIsRotating] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    const nextSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
        stopRotation();
    };

    const prevSlide = () => {
        setActiveIndex(
            (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
        );
        stopRotation();
    };

    const selectSlide = (index: number) => {
        setActiveIndex(index);
        stopRotation();
    };

    const toggleRotation = () => {
        setIsRotating(!isRotating);
    };

    const stopRotation = () => {
        if (isRotating) setIsRotating(false);
    };

    useEffect(() => {
        if (isRotating) {
            const rotation = setInterval(nextSlide, 3000);
            return () => clearInterval(rotation);
        }
    }, [isRotating, activeIndex]);

    return (
        <div
            className="carousel"
            role="region"
            aria-roledescription="carousel"
            ref={carouselRef}
            onMouseEnter={stopRotation}
            onFocus={stopRotation}
            tabIndex={0}
        >
            <button
                className="carousel-control carousel-control-prev"
                onClick={prevSlide}
                aria-label={l.previousSlide}
            >
                <span aria-hidden="true">&#x2039;</span>
            </button>
            <button
                className="carousel-control carousel-control-next"
                onClick={nextSlide}
                aria-label={l.nextSlide}
            >
                <span aria-hidden="true">&#x203A;</span>
            </button>
            <button
                className="carousel-control carousel-control-play"
                onClick={toggleRotation}
                aria-label={isRotating ? l.pauseRotation : l.startRotation}
            >
                {isRotating ? "\u2016" : "\u25B6"}
            </button>
            <div className="slides">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={slide.label}
                        hidden={index !== activeIndex}
                    >
                        {slide.content}
                    </div>
                ))}
            </div>
            <div className="slide-selectors">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => selectSlide(index)}
                        aria-label={l.selectSlide!(index + 1)}
                        disabled={index === activeIndex}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
