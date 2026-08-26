import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import Checkbox from '../components/Checkbox/Checkbox';

/**
 * APG pattern: Checkbox (dual & tri-state)
 * https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */

const Harness = ({ initial = false, isTriState = false, ...rest }) => {
  const [checked, setChecked] = useState(initial);
  return (
    <Checkbox
      label="Accept"
      checked={checked}
      onChange={setChecked}
      isTriState={isTriState}
      {...rest}
    />
  );
};

describe('Checkbox Component (APG checkbox pattern)', () => {
  describe('Dual-state', () => {
    test('role=checkbox and initial unchecked state', () => {
      render(<Harness />);
      const cb = screen.getByRole('checkbox');
      expect(cb).toBeInTheDocument();
      expect(cb).not.toBeChecked();
    });

    test('click toggles state', () => {
      render(<Harness />);
      const cb = screen.getByRole('checkbox');
      fireEvent.click(cb);
      expect(cb).toBeChecked();
      fireEvent.click(cb);
      expect(cb).not.toBeChecked();
    });

    test('Space key toggles state', () => {
      render(<Harness />);
      const cb = screen.getByRole('checkbox');
      fireEvent.keyDown(cb, { key: ' ' });
      expect(cb).toBeChecked();
    });

    test('invokes onChange with new boolean value', () => {
      const onChange = jest.fn();
      render(<Checkbox label="X" checked={false} onChange={onChange} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    test('associates its label via htmlFor', () => {
      render(<Harness />);
      const cb = screen.getByRole('checkbox');
      const label = screen.getByText('Accept');
      expect(label).toHaveAttribute('for', cb.id);
    });
  });

  describe('Tri-state (mixed)', () => {
    test('checked=null renders aria-checked=mixed and indeterminate DOM prop', () => {
      render(<Harness isTriState initial={null} />);
      const cb = screen.getByRole('checkbox');
      expect(cb).toHaveAttribute('aria-checked', 'mixed');
      expect(cb.indeterminate).toBe(true);
    });

    test('click from mixed advances to true', () => {
      const onChange = jest.fn();
      render(<Checkbox label="All" checked={null} onChange={onChange} isTriState />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    test('Space from mixed advances to true', () => {
      const onChange = jest.fn();
      render(<Checkbox label="All" checked={null} onChange={onChange} isTriState />);
      fireEvent.keyDown(screen.getByRole('checkbox'), { key: ' ' });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    test('true → false → null cycle via tri-state logic', () => {
      const onChange = jest.fn();
      const { rerender } = render(
        <Checkbox label="All" checked={true} onChange={onChange} isTriState />,
      );
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenLastCalledWith(false);

      rerender(<Checkbox label="All" checked={false} onChange={onChange} isTriState />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenLastCalledWith(null);
    });

    test('updating checked prop to null turns indeterminate back on', () => {
      const { rerender } = render(
        <Checkbox label="Accept" checked={true} onChange={() => {}} isTriState />,
      );
      expect(screen.getByRole('checkbox').indeterminate).toBe(false);

      rerender(<Checkbox label="Accept" checked={null} onChange={() => {}} isTriState />);
      expect(screen.getByRole('checkbox').indeterminate).toBe(true);
    });
  });

  test('matches the snapshot', () => {
    const { asFragment } = render(<Harness />);
    expect(asFragment()).toMatchSnapshot();
  });
  // --- Regression coverage -------------------------------------------------

  describe('validation surface (#146)', () => {
    const noop = () => {};

    test('nothing is exposed when the props are omitted', () => {
      render(<Checkbox label="Accept terms" checked={false} onChange={noop} />);
      const box = screen.getByRole('checkbox');

      expect(box).not.toHaveAttribute('aria-required');
      expect(box).not.toHaveAttribute('aria-invalid');
      expect(box).not.toHaveAttribute('aria-errormessage');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('required exposes aria-required', () => {
      render(<Checkbox label="Accept terms" checked={false} onChange={noop} required />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true');
    });

    test('invalid exposes aria-invalid', () => {
      render(<Checkbox label="Accept terms" checked={false} onChange={noop} invalid />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    test('the error message is announced and associated', () => {
      render(
        <Checkbox
          label="Accept terms"
          checked={false}
          onChange={noop}
          required
          invalid
          errorMessage="You must accept the terms to continue"
        />,
      );
      const box = screen.getByRole('checkbox');
      const alert = screen.getByRole('alert');

      expect(alert).toHaveTextContent('You must accept the terms to continue');
      expect(box.getAttribute('aria-errormessage')).toBe(alert.id);
      expect(box.getAttribute('aria-describedby')).toContain(alert.id);
    });

    test('no message renders while valid, even if errorMessage is supplied', () => {
      render(
        <Checkbox
          label="Accept terms"
          checked
          onChange={noop}
          required
          errorMessage="You must accept the terms to continue"
        />,
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-errormessage');
    });

    test('a consumer-owned description is kept alongside the error', () => {
      render(
        <Checkbox
          label="Accept terms"
          checked={false}
          onChange={noop}
          invalid
          errorMessage="Required"
          ariaDescribedby="hint-id"
        />,
      );

      const describedBy = screen.getByRole('checkbox').getAttribute('aria-describedby').split(' ');
      expect(describedBy).toContain('hint-id');
      expect(describedBy).toHaveLength(2);
    });

    test('a consumer-owned description survives on its own', () => {
      render(
        <Checkbox label="Accept terms" checked={false} onChange={noop} ariaDescribedby="hint-id" />,
      );

      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'hint-id');
    });

    test('two invalid checkboxes do not share an error id', () => {
      render(
        <>
          <Checkbox
            label="Accept terms"
            checked={false}
            onChange={noop}
            invalid
            errorMessage="Required"
          />
          <Checkbox
            label="Accept privacy"
            checked={false}
            onChange={noop}
            invalid
            errorMessage="Also required"
          />
        </>,
      );

      const ids = screen.getAllByRole('alert').map((el) => el.id);
      expect(new Set(ids).size).toBe(2);
    });

    test('validation props do not disturb the tri-state model', () => {
      render(
        <Checkbox
          label="Accept terms"
          checked={null}
          onChange={noop}
          isTriState
          required
          invalid
        />,
      );
      const box = screen.getByRole('checkbox');

      expect(box).toHaveAttribute('aria-checked', 'mixed');
      expect(box).toHaveAttribute('aria-required', 'true');
    });
  });
});
