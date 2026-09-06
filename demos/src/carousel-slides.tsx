import React from 'react';

/**
 * Slide content shared by the carousel demo pages.
 *
 * `carousel.html` (looping) and `carousel-non-looping.html` (bounded) differ
 * only in which variant of the pattern they configure, so the slides themselves
 * live here rather than being copied into both. Keeping them identical is also
 * the point: a case pointed at either page finds the same five slides with the
 * same accessible names, so what differs between the pages is the behaviour
 * under test and nothing else.
 */
const parks = [
  { id: 'grand-canyon', name: 'Grand Canyon', color: '#d1ecf1' },
  { id: 'yellowstone', name: 'Yellowstone', color: '#fff3cd' },
  { id: 'yosemite', name: 'Yosemite', color: '#f8d7da' },
  { id: 'zion', name: 'Zion', color: '#d4edda' },
  { id: 'glacier', name: 'Glacier', color: '#e2d9f3' },
];

export const slides = parks.map((park) => ({
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
