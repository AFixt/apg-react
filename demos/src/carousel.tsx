import React from 'react';
import Carousel from '../../components/Carousel/Carousel';
import { mount } from './mount';

const parks = [
  { id: 'grand-canyon', name: 'Grand Canyon', color: '#d1ecf1' },
  { id: 'yellowstone', name: 'Yellowstone', color: '#fff3cd' },
  { id: 'yosemite', name: 'Yosemite', color: '#f8d7da' },
  { id: 'zion', name: 'Zion', color: '#d4edda' },
  { id: 'glacier', name: 'Glacier', color: '#e2d9f3' },
];

const slides = parks.map((park) => ({
  id: park.id,
  label: `${park.name} National Park`,
  content: (
    <div
      style={{
        height: 240,
        backgroundColor: park.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
      }}
    >
      {park.name} National Park
    </div>
  ),
}));

/**
 * Carousel demo: five auto-rotating slides with previous/next, a play/pause
 * rotation control, and slide-picker buttons.
 *
 * This is the **looping** variant, and stays that way on purpose: apg-playwright
 * and apg-cypress both assert against this page that "Next from the last slide
 * wraps forward and Previous from the first wraps back". The disabled control it
 * does expose is the current slide's picker, which is `aria-disabled` while its
 * slide is on screen.
 *
 * The bounded variant — `loop={false}`, so Previous at the first slide and Next
 * at the last are `aria-disabled` no-ops — plus the "Slide N of M" status lives
 * on `carousel-non-looping.html`. The two states contradict each other, so they
 * cannot share a URL. Both are options the component now takes as props rather
 * than behaviour a demo reimplements.
 */
function CarouselDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Carousel</h1>
      <Carousel
        slides={slides}
        ariaLabel="Featured Products"
        labels={{
          pauseRotation: 'Pause auto-rotation',
          startRotation: 'Resume auto-rotation',
        }}
      />
    </main>
  );
}

mount(<CarouselDemo />);
