import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import RadioGroup from '../components/RadioGroup/RadioGroup';

/**
 * APG pattern: Radio Group
 * https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */
const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('RadioGroup Component (APG radio pattern)', () => {
  test('container has role=radiogroup and is labelled', () => {
    render(<RadioGroup name="g" label="Pick one" options={options} />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-labelledby');
  });

  test('renders a radio for each option', () => {
    render(<RadioGroup name="g" label="Pick one" options={options} />);
    expect(screen.getAllByRole('radio')).toHaveLength(options.length);
  });

  test('only the checked radio is in the tab order', () => {
    render(<RadioGroup name="g" label="Pick one" options={options} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('tabindex', '0');
    expect(radios[1]).toHaveAttribute('tabindex', '-1');
    expect(radios[2]).toHaveAttribute('tabindex', '-1');
  });

  test('ArrowDown moves focus & selection to next radio', () => {
    render(<RadioGroup name="g" label="Pick one" options={options} />);
    const radios = screen.getAllByRole('radio');
    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: 'ArrowDown' });
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveFocus();
  });

  test('ArrowUp wraps to last radio from first', () => {
    render(<RadioGroup name="g" label="Pick one" options={options} />);
    const radios = screen.getAllByRole('radio');
    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: 'ArrowUp' });
    expect(radios[radios.length - 1]).toHaveAttribute('aria-checked', 'true');
  });

  test('Home / End jump to first / last', () => {
    render(<RadioGroup name="g" label="Pick one" options={options} />);
    const radios = screen.getAllByRole('radio');
    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: 'End' });
    expect(radios[2]).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(radios[2], { key: 'Home' });
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
  });

  test('Space selects the focused radio', () => {
    const onChange = jest.fn();
    render(<RadioGroup name="g" label="Pick one" options={options} onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    radios[1].focus();
    fireEvent.keyDown(radios[1], { key: ' ' });
    expect(onChange).toHaveBeenCalledWith('b');
  });

  test('click selects a radio and invokes onChange', () => {
    const onChange = jest.fn();
    render(<RadioGroup name="g" label="Pick one" options={options} onChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[2]);
    expect(onChange).toHaveBeenCalledWith('c');
  });
});
