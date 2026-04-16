import React from 'react';
import Carousel from './Carousel';

export default {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

const slides = [
  {
    id: '1',
    label: 'First slide',
    content: (
      <div style={{ height: 240, background: '#d1ecf1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
        Slide 1 content
      </div>
    ),
  },
  {
    id: '2',
    label: 'Second slide',
    content: (
      <div style={{ height: 240, background: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
        Slide 2 content
      </div>
    ),
  },
  {
    id: '3',
    label: 'Third slide',
    content: (
      <div style={{ height: 240, background: '#f8d7da', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
        Slide 3 content
      </div>
    ),
  },
];

export const Default = {
  args: {
    slides,
  },
};
