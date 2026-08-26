import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import renderer from 'react-test-renderer';
import Spinbutton from '../components/Spinbutton/Spinbutton'; // adjust the import path as necessary

const setup = (props = {}) => {
  const utils = render(<Spinbutton {...props} />);
  const input = utils.getByRole('spinbutton');
  return {
    input,
    ...utils,
  };
};

describe('Spinbutton - Snapshot Tests', () => {
  test('renders correctly with default props', () => {
    const component = renderer.create(<Spinbutton min={0} max={10} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly with all props', () => {
    const component = renderer.create(
      <Spinbutton min={0} max={10} step={1} initialValue={5} ariaLabelledby="label-id" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Spinbutton - Keyboard Interactions', () => {
  test('increments value on Up Arrow press', () => {
    const { input } = setup({ min: 0, max: 10, initialValue: 5 });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveValue('6');
  });

  test('decrements value on Down Arrow press', () => {
    const { input } = setup({ min: 0, max: 10, initialValue: 5 });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveValue('4');
  });
});

describe('Spinbutton - Direct Editing', () => {
  test('changes value on valid input', () => {
    const { input } = setup({ min: 0, max: 10 });
    fireEvent.change(input, { target: { value: '7' } });
    expect(input).toHaveValue('7');
  });

  test('ignores invalid characters', () => {
    const { input } = setup({ min: 0, max: 10 });
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input).toHaveValue('0'); // assuming the default behavior is to reset to min or 0
  });
});

describe('Spinbutton - Accessibility Features', () => {
  test('has appropriate ARIA attributes', () => {
    const { input } = setup({
      min: 0,
      max: 10,
      initialValue: 5,
      ariaLabelledby: 'label-id',
    });
    expect(input).toHaveAttribute('role', 'spinbutton');
    expect(input).toHaveAttribute('aria-valuenow', '5');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(input).toHaveAttribute('aria-labelledby', 'label-id');
  });

  test('sets aria-invalid to true for invalid values', () => {
    const { input } = setup({ min: 0, max: 10 });
    fireEvent.change(input, { target: { value: '11' } });
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Spinbutton - Invalid Input Handling', () => {
  test('indicates invalid value outside range', () => {
    const { input } = setup({ min: 0, max: 10 });
    fireEvent.change(input, { target: { value: '15' } });
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

// --- Regression coverage ---------------------------------------------------

describe('clamping at a bound is not an error (#158)', () => {
  const atMax = () => setup({ min: 0, max: 100, initialValue: 100, ariaLabel: 'Quantity' });
  const atMin = () => setup({ min: 0, max: 100, initialValue: 0, ariaLabel: 'Quantity' });

  test('ArrowUp at the maximum leaves the value valid', () => {
    const { input } = atMax();
    expect(input).toHaveAttribute('aria-invalid', 'false');

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(input).toHaveAttribute('aria-valuenow', '100');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('ArrowDown at the minimum leaves the value valid', () => {
    const { input } = atMin();

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(input).toHaveAttribute('aria-valuenow', '0');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('PageUp past the maximum clamps rather than refusing', () => {
    const { input } = setup({ min: 0, max: 100, initialValue: 95, ariaLabel: 'Quantity' });

    fireEvent.keyDown(input, { key: 'PageUp' });

    expect(input).toHaveAttribute('aria-valuenow', '100');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('PageDown past the minimum clamps rather than refusing', () => {
    const { input } = setup({ min: 0, max: 100, initialValue: 5, ariaLabel: 'Quantity' });

    fireEvent.keyDown(input, { key: 'PageDown' });

    expect(input).toHaveAttribute('aria-valuenow', '0');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('the same value is never reported valid and invalid in turn', () => {
    const { input } = atMax();

    fireEvent.keyDown(input, { key: 'End' });
    const afterEnd = input.getAttribute('aria-invalid');

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(input).toHaveAttribute('aria-valuenow', '100');
    expect(input.getAttribute('aria-invalid')).toBe(afterEnd);
  });

  test('the increment button at the maximum is also a no-op', () => {
    const { input, getByLabelText } = atMax();

    fireEvent.click(getByLabelText('Increase value'));

    expect(input).toHaveAttribute('aria-valuenow', '100');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  test('typed input outside the range is still invalid', () => {
    const { input } = setup({ min: 0, max: 100, initialValue: 10, ariaLabel: 'Quantity' });

    fireEvent.change(input, { target: { value: '150' } });

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('stepping clears an invalid state left by typed input', () => {
    const { input } = setup({ min: 0, max: 100, initialValue: 10, ariaLabel: 'Quantity' });

    fireEvent.change(input, { target: { value: '150' } });
    expect(input).toHaveAttribute('aria-invalid', 'true');

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});

describe('an invalid value says why (#148)', () => {
  const invalidate = (props = {}) => {
    const utils = setup({ min: 1, max: 10, initialValue: 5, ariaLabel: 'Quantity', ...props });
    fireEvent.change(utils.input, { target: { value: '50' } });
    return utils;
  };

  test('no message is present while the value is valid', () => {
    const { queryByRole } = setup({ min: 1, max: 10, initialValue: 5, ariaLabel: 'Quantity' });
    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  test('an out-of-range value announces the constraint', () => {
    const { getByRole } = invalidate();
    expect(getByRole('alert')).toHaveTextContent('Value must be between 1 and 10');
  });

  test('the message is associated with the spinbutton', () => {
    const { input, getByRole } = invalidate();

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy)).toBe(getByRole('alert'));
  });

  test('aria-describedby is not set while valid', () => {
    const { input } = setup({ min: 1, max: 10, initialValue: 5, ariaLabel: 'Quantity' });
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  test('the message clears when the value becomes valid again', () => {
    const { input, queryByRole } = invalidate();
    expect(queryByRole('alert')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '7' } });

    expect(queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  test('errorMessage overrides the default wording', () => {
    const { getByRole } = invalidate({ errorMessage: 'Pick a quantity from 1 to 10' });
    expect(getByRole('alert')).toHaveTextContent('Pick a quantity from 1 to 10');
  });

  test('labels.rangeError localises the default wording', () => {
    const { getByRole } = invalidate({
      labels: { rangeError: (min, max) => `Entre ${min} et ${max}` },
    });
    expect(getByRole('alert')).toHaveTextContent('Entre 1 et 10');
  });

  test('a consumer-owned description is kept alongside the error', () => {
    const { input } = invalidate({ ariaDescribedby: 'hint-id' });

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy.split(' ')).toContain('hint-id');
    expect(describedBy.split(' ').length).toBe(2);
  });

  test('a consumer-owned description survives on its own while valid', () => {
    const { input } = setup({
      min: 1,
      max: 10,
      initialValue: 5,
      ariaLabel: 'Quantity',
      ariaDescribedby: 'hint-id',
    });

    expect(input).toHaveAttribute('aria-describedby', 'hint-id');
  });

  test('clamping at a bound produces no message', () => {
    const { input, queryByRole } = setup({
      min: 1,
      max: 10,
      initialValue: 10,
      ariaLabel: 'Quantity',
    });

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });
});
