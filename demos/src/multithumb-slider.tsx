import React from 'react';
import SliderMultiThumb from '../../components/SliderMultiThumb/SliderMultiThumb';
import { mount } from './mount';

/**
 * SliderMultiThumb demo: a price-range filter with independent low and high
 * thumbs that constrain each other so the range can never cross itself.
 */
function SliderMultiThumbDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Multi-Thumb Slider</h1>
      <SliderMultiThumb
        min={0}
        max={100}
        step={1}
        initialLow={20}
        initialHigh={80}
        labelLow="Minimum price"
        labelHigh="Maximum price"
      />
    </main>
  );
}

mount(<SliderMultiThumbDemo />);
