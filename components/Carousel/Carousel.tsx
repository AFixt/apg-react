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
import React, { useEffect, useRef, useState } from 'react';
import './Carousel.css';

/** A slide in a Carousel. */
interface CarouselSlide {
  id: string;
  label: string;
  content: React.ReactNode;
}

/** Translatable labels for the Carousel component. English defaults are used when a key is omitted. */
interface CarouselLabels {
  previousSlide?: string;
  nextSlide?: string;
  pauseRotation?: string;
  startRotation?: string;
  selectSlide?: (i: number) => string;
}

/** Props for the Carousel component. */
interface CarouselProps {
  slides: CarouselSlide[];
  /** Accessible name for the carousel region. Required for ARIA compliance. */
  ariaLabel: string;
  /** Whether auto-rotation is on at first render. Defaults to true. */
  initiallyRotating?: boolean;
  labels?: CarouselLabels;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  ariaLabel,
  initiallyRotating = true,
  labels,
}) => {
  const defaultLabels: CarouselLabels = {
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    pauseRotation: 'Pause rotation',
    startRotation: 'Start rotation',
    selectSlide: (i: number) => `Select slide ${i}`,
  };
  const l = { ...defaultLabels, ...labels };
  const [activeIndex, setActiveIndex] = useState(0);
  // `isRotating` is the user's explicit preference and is the only thing the
  // rotation control's label reflects. A hover pause is tracked separately so
  // that drifting a pointer over the carousel cannot silently relabel the
  // control from Pause to Start before the user has clicked anything.
  const [isRotating, setIsRotating] = useState(initiallyRotating);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const rotationBtnRef = useRef<HTMLButtonElement>(null);

  /** Advance one slide without touching rotation state. Used by the timer. */
  const advance = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const nextSlide = () => {
    advance();
    stopRotation();
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    stopRotation();
  };

  const selectSlide = (index: number) => {
    // The picker for the slide already on screen is aria-disabled; activating
    // it does nothing at all, including to rotation state.
    if (index === activeIndex) return;
    setActiveIndex(index);
    stopRotation();
  };

  const toggleRotation = () => {
    const next = !isRotating;
    setIsRotating(next);
    // An explicit request to start clears any lingering hover pause, so the
    // control never reports rotating while a pointer silently holds it still.
    if (next) setIsHoverPaused(false);
  };

  const stopRotation = () => {
    if (isRotating) setIsRotating(false);
  };

  /**
   * APG: rotation stops when keyboard focus enters the carousel and does not
   * resume unless the user explicitly asks for it. The rotation control is
   * exempt -- focusing it is how the user reaches the button that turns
   * rotation back on, so letting focus pre-empt the click would invert it.
   */
  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (rotationBtnRef.current?.contains(e.target as Node)) return;
    stopRotation();
  };

  useEffect(() => {
    // A single-slide carousel has nowhere to advance to, so an interval would
    // just wake up forever to compute the index it is already on.
    if (!isRotating || isHoverPaused || slides.length < 2) return undefined;
    const rotation = setInterval(advance, 3000);
    return () => clearInterval(rotation);
    // `activeIndex` is deliberately absent: including it tore down and rebuilt
    // the interval on every advance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRotating, isHoverPaused, slides.length]);

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      ref={carouselRef}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      onFocus={handleFocus}
      tabIndex={0}
    >
      <button
        ref={rotationBtnRef}
        className="carousel-control carousel-control-play"
        onClick={toggleRotation}
        aria-label={isRotating ? l.pauseRotation : l.startRotation}
      >
        {/* The glyph is decoration for the aria-label, like the chevrons below; exposing it as text alongside the label would make it a second, conflicting name. */}
        <span aria-hidden="true">{isRotating ? '\u2016' : '\u25B6'}</span>
      </button>
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
            aria-current={index === activeIndex ? 'true' : undefined}
            aria-disabled={index === activeIndex ? 'true' : undefined}
          >
            {/*
              Deliberately both an aria-label and visible text (#234). The digit
              is real visible text, so it cannot be aria-hidden without hiding
              visible content from assistive technology; the aria-label stays
              because "1" alone is no name, and because the downstream APG
              runner suites address these pickers by `[aria-label="Select slide
              N"]`. The label ends with the digit, so the visible label is in
              the name (WCAG 2.5.3).
            */}
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Carousel pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Carousel;
