import React from 'react';
import Slider from '../../components/Slider/Slider';
import { mount } from './mount';

const temperatureLabels = ['Cold', 'Cool', 'Warm', 'Hot'];

/**
 * Slider demo: a numeric volume control alongside a temperature control that
 * reports its value through `aria-valuetext` instead of a raw number, per the
 * APG's guidance for ranges whose numbers aren't meaningful to users.
 */
function SliderDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Slider</h1>
      <section className="demo-section">
        <h2>Volume</h2>
        <Slider min={0} max={100} step={1} initialValue={50} ariaLabel="Volume" />
      </section>
      <section className="demo-section">
        <h2>Temperature</h2>
        <Slider
          min={0}
          max={3}
          step={1}
          initialValue={2}
          ariaLabel="Temperature"
          getUserFriendlyValue={(value) => temperatureLabels[value] ?? ''}
        />
      </section>
    </main>
  );
}

mount(<SliderDemo />);
