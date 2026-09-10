import React from 'react';
import Carousel from '../../components/Carousel/Carousel';
import { slides } from './carousel-slides';
import { mount } from './mount';

/**
 * Carousel demo, non-looping state.
 *
 * The APG's carousel pattern admits two variants and this library's component
 * now implements both. The default page is the looping one: Next from the last
 * slide wraps to the first and Previous from the first wraps to the last. This
 * page is the bounded one -- `loop={false}` -- where the sequence has a real
 * first and last slide. Previous at slide 1 is `aria-disabled="true"` and does
 * nothing when activated, and Next at slide 5 likewise -- as does the rotation
 * control once slide 5 is reached, there being no further slide to rotate to.
 * Both are conformant; they are just different carousels.
 *
 * It also turns on the "Slide N of M" status, as the looping page now does.
 * The status is a live region whose politeness follows the rotation state, so
 * it announces a slide change the user asked for and stays silent for one a
 * timer produced. This page starts with rotation stopped for a different
 * reason: it keeps the page deterministic for the QA suite rather than moving
 * under its assertions.
 *
 * This cannot be a second carousel on `carousel.html`. That page's downstream
 * specs address it with unscoped selectors -- `[role="region"]
 * [aria-roledescription="carousel"]`, `[aria-label="Previous slide"]`,
 * `[aria-label="Select slide N"]` -- rather than scoping by accessible name, so
 * a second carousel of any name gives every one of them two matches. More
 * pointedly, apg-playwright and apg-cypress both assert on that page that "Next
 * from the last slide wraps forward and Previous from the first wraps back",
 * which is precisely the behaviour this page inverts: the two states contradict
 * each other and genuinely cannot share a URL. See `demos/README.md`.
 *
 * Addressed by `apg-qa` as `carousel_non_looping_url`.
 */
function CarouselNonLoopingDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Carousel — non-looping</h1>
      <Carousel
        slides={slides}
        ariaLabel="Featured Products"
        loop={false}
        showSlideStatus
        initiallyRotating={false}
        labels={{
          pauseRotation: 'Pause auto-rotation',
          startRotation: 'Resume auto-rotation',
        }}
      />
    </main>
  );
}

mount(<CarouselNonLoopingDemo />);
