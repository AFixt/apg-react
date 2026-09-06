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
 * @param {boolean} [loop=true] - Whether the ends of the sequence wrap around.
 * @param {boolean} [showSlideStatus=false] - Whether to render a "Slide N of M" status.
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
  slideStatus?: (current: number, total: number) => string;
}

/** Props for the Carousel component. */
interface CarouselProps {
  slides: CarouselSlide[];
  /** Accessible name for the carousel region. Required for ARIA compliance. */
  ariaLabel: string;
  /** Whether auto-rotation is on at first render. Defaults to true. */
  initiallyRotating?: boolean;
  /**
   * Whether Next past the last slide wraps to the first, and Previous past the
   * first wraps to the last. Defaults to true.
   *
   * With `loop={false}` the carousel is a bounded sequence rather than a ring:
   * Previous at the first slide and Next at the last are `aria-disabled="true"`
   * and do nothing when activated, and auto-rotation stops on arrival at the
   * last slide rather than starting over -- at which point the rotation control
   * is `aria-disabled` too, because there is no further slide to rotate to.
   * Both variants are APG-conformant.
   *
   * The controls are marked with `aria-disabled` rather than the native
   * `disabled` attribute on purpose: APG keeps an unavailable control focusable
   * so a keyboard user can reach it and discover why it is unavailable.
   */
  loop?: boolean;
  /**
   * Whether to render a "Slide N of M" status. Defaults to false.
   *
   * The status is a live region, so it announces every slide change. That is
   * useful when the user drives the carousel and noise when a timer does, which
   * is why it is opt-in rather than always present -- turn it on together with
   * `initiallyRotating={false}`, or on a carousel that does not rotate at all.
   */
  showSlideStatus?: boolean;
  labels?: CarouselLabels;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  ariaLabel,
  initiallyRotating = true,
  loop = true,
  showSlideStatus = false,
  labels,
}) => {
  const defaultLabels: CarouselLabels = {
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    pauseRotation: 'Pause rotation',
    startRotation: 'Start rotation',
    selectSlide: (i: number) => `Select slide ${i}`,
    slideStatus: (current: number, total: number) => `Slide ${current} of ${total}`,
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

  // Ends of the sequence. They only constrain anything when `loop` is false;
  // a looping carousel has no first or last slide in the operative sense.
  const atFirstSlide = activeIndex === 0;
  const atLastSlide = activeIndex === slides.length - 1;
  const previousDisabled = !loop && atFirstSlide;
  const nextDisabled = !loop && atLastSlide;
  // The last slide of a bounded sequence is also the end of rotation: there is
  // nothing left to advance to, and the effect below has already stopped the
  // timer by the time the user can act. So the rotation control is unavailable
  // rather than merely idle, and it says so the same way Previous and Next do
  // -- aria-disabled, still focusable -- instead of quietly doing nothing when
  // its label still offers to start. `isRotating` is in the condition so that
  // the single frame between arriving at the last slide and the effect firing
  // cannot present a "Pause rotation" control that refuses to pause.
  const rotationDisabled = !loop && atLastSlide && !isRotating;

  /** Advance one slide without touching rotation state. Used by the timer. */
  const advance = () => {
    setActiveIndex((prevIndex) => {
      const next = prevIndex + 1;
      if (next < slides.length) return next;
      // Non-looping: the last slide is the end of the sequence, so stay put.
      return loop ? 0 : prevIndex;
    });
  };

  const nextSlide = () => {
    // Activating an aria-disabled control does nothing at all, including to
    // rotation state -- the same contract the current slide's picker keeps.
    if (nextDisabled) return;
    advance();
    stopRotation();
  };

  const prevSlide = () => {
    if (previousDisabled) return;
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
    // Activating an aria-disabled control does nothing at all -- the same
    // contract Previous, Next and the current slide's picker keep.
    if (rotationDisabled) return;
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

  /**
   * A non-looping carousel has run out of slides once it reaches the last one,
   * so rotation ends there rather than leaving a timer waking up forever to
   * recompute the index it is already on. The control relabels itself to
   * "start", but there is no lap left to start, so it is aria-disabled too --
   * see `rotationDisabled`. Getting back to a slide the carousel can rotate
   * from is what Previous and the pickers are for.
   */
  useEffect(() => {
    if (!loop && isRotating && atLastSlide) setIsRotating(false);
  }, [loop, isRotating, atLastSlide]);

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
        aria-disabled={rotationDisabled ? 'true' : undefined}
      >
        {isRotating ? '\u2016' : '\u25B6'}
      </button>
      <button
        className="carousel-control carousel-control-prev"
        onClick={prevSlide}
        aria-label={l.previousSlide}
        aria-disabled={previousDisabled ? 'true' : undefined}
      >
        <span aria-hidden="true">&#x2039;</span>
      </button>
      <button
        className="carousel-control carousel-control-next"
        onClick={nextSlide}
        aria-label={l.nextSlide}
        aria-disabled={nextDisabled ? 'true' : undefined}
      >
        <span aria-hidden="true">&#x203A;</span>
      </button>
      {showSlideStatus && (
        <div className="carousel-status" role="status">
          {l.slideStatus!(activeIndex + 1, slides.length)}
        </div>
      )}
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
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Carousel pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Carousel;
