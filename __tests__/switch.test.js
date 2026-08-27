import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Switch from '../components/Switch/Switch';

/**
 * APG pattern: Switch
 * https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 *
 * Contract:
 *   - role=switch
 *   - aria-checked reflects state
 *   - Space and Enter toggle
 *   - Click toggles
 *   - Keyboard focusable
 */
describe('Switch Component (APG switch pattern)', () => {
  const label = 'Enable notifications';

  test('has role=switch', () => {
    render(<Switch label={label} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  test('exposes visible label text', () => {
    render(<Switch label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  test('defaults to aria-checked=false', () => {
    render(<Switch label={label} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  test('respects initialChecked prop', () => {
    render(<Switch label={label} initialChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  test('is keyboard focusable via tabindex=0', () => {
    render(<Switch label={label} />);
    expect(screen.getByRole('switch')).toHaveAttribute('tabindex', '0');
  });

  test('Space key toggles the state', () => {
    render(<Switch label={label} />);
    const sw = screen.getByRole('switch');
    fireEvent.keyDown(sw, { key: ' ' });
    expect(sw).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(sw, { key: ' ' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  test('Enter key toggles the state', () => {
    render(<Switch label={label} />);
    const sw = screen.getByRole('switch');
    fireEvent.keyDown(sw, { key: 'Enter' });
    expect(sw).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(sw, { key: 'Enter' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  test('click toggles the state', () => {
    render(<Switch label={label} />);
    const sw = screen.getByRole('switch');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  test('forwards ariaLabelledby / ariaDescribedby', () => {
    render(<Switch label={label} ariaLabelledby="ext-label" ariaDescribedby="ext-desc" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-labelledby', 'ext-label');
    expect(sw).toHaveAttribute('aria-describedby', 'ext-desc');
  });

  test('non-space/enter keys do not toggle', () => {
    render(<Switch label={label} />);
    const sw = screen.getByRole('switch');
    fireEvent.keyDown(sw, { key: 'ArrowRight' });
    fireEvent.keyDown(sw, { key: 'a' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  test('matches the snapshot', () => {
    const { asFragment } = render(<Switch label={label} />);
    expect(asFragment()).toMatchSnapshot();
  });
  // --- Regression coverage -------------------------------------------------

  describe('controlled value and onChange (#147)', () => {
    test('onChange reports the next state when uncontrolled', () => {
      const onChange = jest.fn();
      render(<Switch label="Notifications" onChange={onChange} />);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledWith(true);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenLastCalledWith(false);
    });

    test('uncontrolled still owns its own state', () => {
      render(<Switch label="Notifications" />);
      const control = screen.getByRole('switch');

      expect(control).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(control);
      expect(control).toHaveAttribute('aria-checked', 'true');
    });

    test('a controlled switch reflects the prop, not its own state', () => {
      const { rerender } = render(<Switch label="Notifications" checked={false} />);
      const control = screen.getByRole('switch');

      fireEvent.click(control);
      // The consumer did not accept the change, so nothing moved.
      expect(control).toHaveAttribute('aria-checked', 'false');

      rerender(<Switch label="Notifications" checked />);
      expect(control).toHaveAttribute('aria-checked', 'true');
    });

    test('a controlled switch still reports requested changes', () => {
      const onChange = jest.fn();
      render(<Switch label="Notifications" checked={false} onChange={onChange} />);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    test('the state is observable, so a page can render it', () => {
      const Harness = () => {
        const [on, setOn] = React.useState(false);
        return (
          <>
            <Switch label="Notifications" checked={on} onChange={setOn} />
            <span data-testid="readout">{on ? 'On' : 'Off'}</span>
          </>
        );
      };
      render(<Harness />);

      expect(screen.getByTestId('readout')).toHaveTextContent('Off');
      fireEvent.click(screen.getByRole('switch'));
      expect(screen.getByTestId('readout')).toHaveTextContent('On');
    });

    test('keyboard activation reports through onChange too', () => {
      const onChange = jest.fn();
      render(<Switch label="Notifications" onChange={onChange} />);

      fireEvent.keyDown(screen.getByRole('switch'), { key: ' ' });
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('disabled support (#147)', () => {
    test('nothing is exposed when isDisabled is omitted', () => {
      render(<Switch label="Notifications" />);
      expect(screen.getByRole('switch')).not.toHaveAttribute('aria-disabled');
    });

    test('isDisabled exposes aria-disabled', () => {
      render(<Switch label="Notifications" isDisabled />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
    });

    test('a disabled switch stays focusable', () => {
      render(<Switch label="Notifications" isDisabled />);
      const control = screen.getByRole('switch');

      // aria-disabled, not native disabled: the control must remain
      // discoverable so a keyboard user can find out why it is unavailable.
      expect(control).toHaveAttribute('tabindex', '0');
      control.focus();
      expect(document.activeElement).toBe(control);
    });

    test('clicking a disabled switch does not flip aria-checked', () => {
      const onChange = jest.fn();
      render(<Switch label="Notifications" isDisabled onChange={onChange} />);
      const control = screen.getByRole('switch');

      fireEvent.click(control);

      expect(control).toHaveAttribute('aria-checked', 'false');
      expect(onChange).not.toHaveBeenCalled();
    });

    test('Enter and Space on a disabled switch do nothing', () => {
      const onChange = jest.fn();
      render(<Switch label="Notifications" isDisabled onChange={onChange} />);
      const control = screen.getByRole('switch');

      fireEvent.keyDown(control, { key: ' ' });
      fireEvent.keyDown(control, { key: 'Enter' });

      expect(control).toHaveAttribute('aria-checked', 'false');
      expect(onChange).not.toHaveBeenCalled();
    });

    test('clicking the label of a disabled switch does nothing either', () => {
      render(<Switch label="Notifications" isDisabled />);

      fireEvent.click(screen.getByText('Notifications'));

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });
  });
});
