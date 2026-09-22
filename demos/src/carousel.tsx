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
 *
 * ## The two audit rules this page still reports, and why (#234)
 *
 * #234 recorded 18 findings when it was filed. The page now reports **6**, from
 * two rules, and both rules are understood rather than outstanding.
 *
 * The counts, severities and types below are measured — engine 6.1.0 against
 * this demo served locally, not transcribed from the issue. The 18 is the
 * issue's own figure and is not re-measurable from here.
 *
 * - **NAVIGATION-08 (High, auto_assisted) x1** — "No search facility or
 *   sitemap link was detected on this page." That is WCAG 2.4.5 Multiple Ways,
 *   which requires more than one way to locate a page *"within a set of Web
 *   pages"*. Each demo here is a standalone page, not a member of a set, so a
 *   search facility or sitemap would be meaningless on it — it is a page-set
 *   criterion, not a carousel defect. The rule is also `auto_assisted`, so it
 *   flags a candidate for a human to judge and cannot establish a failure by
 *   itself. apg-cypress, apg-jest, apg-jasmine, apg-mocha and apg-nightwatch
 *   all carry this rule in their own out-of-scope lists for the same reason.
 *
 * - **STRUCTURE-23 (High, automatic) x5** — "Multiple labeling strategies" on
 *   the slide pickers. Deliberate, and argued at the call site in
 *   `components/Carousel/Carousel.tsx`: the digit is real visible text and
 *   cannot be hidden, "1" alone is not a name, and the label ends with the
 *   digit so the visible label is contained in the accessible name (WCAG
 *   2.5.3).
 *
 *   Note the severity, because it changes what the argument has to carry. This
 *   is High and `automatic` — automation says it CAN decide this one, and a
 *   consumer gating on severity would be blocked by it. So it is not being
 *   waved through as minor; the WCAG 2.5.3 reasoning above is the whole of the
 *   defence, and if that reasoning is wrong the finding is real. It is kept
 *   rather than suppressed for that reason: a reader can check the argument.
 *
 * Re-measure rather than trusting these counts if the demo changes. A
 * transcribed finding list is exactly the thing that rots.
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
