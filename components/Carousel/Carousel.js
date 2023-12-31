/**
 * A carousel component that displays a slideshow of slides.
 *
 * @component
 * @param {Object[]} slides - An array of slide objects.
 * @param {string} slides[].id - The unique identifier of the slide.
 * @param {string} slides[].label - The label or title of the slide.
 * @param {ReactNode} slides[].content - The content to be displayed in the slide.
 * @returns {JSX.Element} The Carousel component.
 */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Carousel.css'; // Assume appropriate CSS for styling

const Carousel = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const carouselRef = useRef(null);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    stopRotation();
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    stopRotation();
  };

  const selectSlide = (index) => {
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
      <button onClick={prevSlide} aria-label="Previous slide">Prev</button>
      <button onClick={nextSlide} aria-label="Next slide">Next</button>
      <button onClick={toggleRotation} aria-label={isRotating ? "Pause rotation" : "Start rotation"}>
        {isRotating ? 'Pause' : 'Play'}
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
            aria-label={`Select slide ${index + 1}`}
            disabled={index === activeIndex}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default Carousel;
