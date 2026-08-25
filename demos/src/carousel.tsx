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
 * The component owns rotation and active-slide state internally and exposes
 * neither to the parent, so this demo cannot surface a "slide X of Y" status
 * or disable "Previous" at the first slide without reimplementing state the
 * component already tracks privately — both are left to the component as-is.
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
