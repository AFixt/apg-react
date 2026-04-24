import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import SliderMultiThumb from '../components/SliderMultiThumb/SliderMultiThumb';

/**
 * APG pattern: Slider (Multi-Thumb)
 * https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
 */
describe('SliderMultiThumb Component', () => {
  const setup = (props = {}) =>
    render(
      <SliderMultiThumb
        min={0}
        max={100}
        step={1}
        initialLow={20}
        initialHigh={80}
        labelLow="Min"
        labelHigh="Max"
        {...props}
      />,
    );

  test('renders two sliders each with role=slider and distinct labels', () => {
    setup();
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-label', 'Min');
    expect(sliders[1]).toHaveAttribute('aria-label', 'Max');
  });

  test("low thumb's aria-valuemax equals high thumb's value", () => {
    setup();
    const [low, high] = screen.getAllByRole('slider');
    expect(low).toHaveAttribute('aria-valuemax', '80');
    expect(high).toHaveAttribute('aria-valuemin', '20');
  });

  test('ArrowRight on low thumb increments its value', () => {
    setup();
    const [low] = screen.getAllByRole('slider');
    low.focus();
    fireEvent.keyDown(low, { key: 'ArrowRight' });
    expect(low).toHaveAttribute('aria-valuenow', '21');
  });

  test('ArrowLeft on high thumb decrements its value', () => {
    setup();
    const [, high] = screen.getAllByRole('slider');
    high.focus();
    fireEvent.keyDown(high, { key: 'ArrowLeft' });
    expect(high).toHaveAttribute('aria-valuenow', '79');
  });

  test('low thumb cannot exceed high thumb value (End clamps)', () => {
    setup();
    const [low] = screen.getAllByRole('slider');
    low.focus();
    fireEvent.keyDown(low, { key: 'End' });
    expect(low).toHaveAttribute('aria-valuenow', '80');
  });

  test('high thumb cannot go below low thumb value (Home clamps)', () => {
    setup();
    const [, high] = screen.getAllByRole('slider');
    high.focus();
    fireEvent.keyDown(high, { key: 'Home' });
    expect(high).toHaveAttribute('aria-valuenow', '20');
  });

  test('PageUp increments by 10*step', () => {
    setup();
    const [low] = screen.getAllByRole('slider');
    low.focus();
    fireEvent.keyDown(low, { key: 'PageUp' });
    expect(low).toHaveAttribute('aria-valuenow', '30');
  });

  test('onChange fires with {low, high} on value change', () => {
    const onChange = jest.fn();
    setup({ onChange });
    const [low] = screen.getAllByRole('slider');
    low.focus();
    fireEvent.keyDown(low, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ low: 21, high: 80 });
  });

  test('aria-valuetext uses getValueText formatter when provided', () => {
    const fmt = (v) => `$${v}`;
    setup({ getValueText: fmt });
    const [low, high] = screen.getAllByRole('slider');
    expect(low).toHaveAttribute('aria-valuetext', '$20');
    expect(high).toHaveAttribute('aria-valuetext', '$80');
  });
});
