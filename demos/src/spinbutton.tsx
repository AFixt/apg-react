import React from 'react';
import Spinbutton from '../../components/Spinbutton/Spinbutton';
import { mount } from './mount';

/**
 * Spinbutton demo: a quantity field with increment/decrement buttons and
 * direct text entry.
 *
 * The increment/decrement button labels are passed via the component's
 * `labels` prop rather than left as the English defaults, since the buttons
 * are a legitimate, supported customization point and not a workaround.
 */
function SpinbuttonDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Spinbutton</h1>
      <Spinbutton
        min={0}
        max={100}
        step={1}
        initialValue={10}
        ariaLabel="Quantity"
        labels={{ increaseValue: 'Increase', decreaseValue: 'Decrease' }}
      />
    </main>
  );
}

mount(<SpinbuttonDemo />);
