import React from 'react';
import Carousel from '../../components/Carousel/Carousel';
import { slides } from './carousel-slides';
import { mount } from './mount';

/**
 * Carousel demo: five auto-rotating slides with previous/next, a play/pause
 * rotation control, slide-picker buttons and a "Slide N of 5" status.
 *
 * This is the **looping** variant, and stays that way on purpose: apg-playwright
 * and apg-cypress both assert against this page that "Next from the last slide
 * wraps forward and Previous from the first wraps back". The disabled control it
 * does expose is the current slide's picker, which is `aria-disabled` while its
 * slide is on screen.
 *
 * The bounded variant — `loop={false}`, so Previous at the first slide and Next
 * at the last are `aria-disabled` no-ops — lives on
 * `carousel-non-looping.html`. The two states contradict each other, so they
 * cannot share a URL. Both are options the component takes as props rather than
 * behaviour a demo reimplements.
 *
 * The status is safe on a page that rotates by itself because its politeness
 * follows the rotation state: `aria-live="off"` while the timer is driving,
 * `polite` the moment the user is.
 */
function CarouselDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Carousel</h1>
      <Carousel
        slides={slides}
        ariaLabel="Featured Products"
        showSlideStatus
        labels={{
          pauseRotation: 'Pause auto-rotation',
          startRotation: 'Resume auto-rotation',
        }}
      />
    </main>
  );
}

mount(<CarouselDemo />);
