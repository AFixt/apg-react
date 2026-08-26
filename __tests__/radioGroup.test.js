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
  // --- Regression coverage -------------------------------------------------

  describe('an unselected group is still reachable by Tab (#138)', () => {
    // The unselected state is only expressible through the controlled prop:
    // uncontrolled RadioGroup seeds internalValue from options[0], so it always
    // has a selection. A controlled group whose value matches no option -- the
    // ordinary "nothing chosen yet" state for a required question -- is the
    // case that was unreachable.
    const Unselected = (props) => (
      <RadioGroup name="g" label="Pick one" options={options} value="" {...props} />
    );

    test('exactly one radio is in the tab order when nothing is checked', () => {
      render(<Unselected />);
      const radios = screen.getAllByRole('radio');

      const tabbable = radios.filter((r) => r.getAttribute('tabindex') === '0');
      expect(tabbable).toHaveLength(1);
    });

    test('the tab stop is the first radio when nothing is checked', () => {
      render(<Unselected />);
      const radios = screen.getAllByRole('radio');

      expect(radios[0]).toHaveAttribute('tabindex', '0');
      expect(radios[1]).toHaveAttribute('tabindex', '-1');
      expect(radios[2]).toHaveAttribute('tabindex', '-1');
    });

    test('no radio is checked in that state', () => {
      render(<Unselected />);

      screen.getAllByRole('radio').forEach((radio) => {
        expect(radio).toHaveAttribute('aria-checked', 'false');
      });
    });

    test('the group can actually be focused from the keyboard', () => {
      render(
        <>
          <button>before</button>
          <Unselected />
        </>,
      );

      const radios = screen.getAllByRole('radio');
      const tabbable = radios.find((r) => r.getAttribute('tabindex') === '0');

      expect(tabbable).toBeDefined();
      tabbable.focus();
      expect(document.activeElement).toBe(radios[0]);
    });

    test('arrowing from the fallback tab stop selects, as the APG requires', () => {
      const onChange = jest.fn();
      render(<Unselected onChange={onChange} />);
      const radios = screen.getAllByRole('radio');

      radios[0].focus();
      fireEvent.keyDown(radios[0], { key: 'ArrowDown' });

      expect(onChange).toHaveBeenCalledWith('b');
    });

    test('Space on the fallback tab stop selects it', () => {
      const onChange = jest.fn();
      render(<Unselected onChange={onChange} />);
      const radios = screen.getAllByRole('radio');

      radios[0].focus();
      fireEvent.keyDown(radios[0], { key: ' ' });

      expect(onChange).toHaveBeenCalledWith('a');
    });

    test('the tab stop moves to the checked radio once one is chosen', () => {
      const { rerender } = render(<Unselected />);
      expect(screen.getAllByRole('radio')[0]).toHaveAttribute('tabindex', '0');

      rerender(<RadioGroup name="g" label="Pick one" options={options} value="c" />);

      const radios = screen.getAllByRole('radio');
      expect(radios[2]).toHaveAttribute('tabindex', '0');
      expect(radios[0]).toHaveAttribute('tabindex', '-1');
    });

    test('a value matching no option still leaves the group reachable', () => {
      render(<RadioGroup name="g" label="Pick one" options={options} value="nonexistent" />);
      const radios = screen.getAllByRole('radio');

      expect(radios.filter((r) => r.getAttribute('tabindex') === '0')).toHaveLength(1);
      expect(radios[0]).toHaveAttribute('tabindex', '0');
    });
  });
});
