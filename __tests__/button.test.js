import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Button from '../components/Button/Button';

describe('Button Component', () => {
  const label = 'Test Button';
  const mockAction = jest.fn();

  beforeEach(() => {
    mockAction.mockReset();
  });

  afterEach(cleanup);

  test('Button Snapshot', () => {
    const { asFragment } = render(<Button action={mockAction} label={label} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Toggle Button Snapshot', () => {
    const { asFragment } = render(
      <Button action={mockAction} label={label} isToggleButton={true} toggleState={false} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('Activating a Button', () => {
    render(<Button action={mockAction} label={label} />);
    const button = screen.getByRole('button', { name: label });

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockAction).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: ' ' });
    expect(mockAction).toHaveBeenCalledTimes(2);
  });

  test('Using a Toggle Button', () => {
    render(<Button action={mockAction} label={label} isToggleButton={true} toggleState={false} />);
    const toggleButton = screen.getByRole('button', { name: label });

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('Using a Menu Button', () => {
    render(<Button action={mockAction} label="Menu" ariaHaspopup="menu" />);
    const menuButton = screen.getByRole('button', { name: 'Menu' });

    expect(menuButton).toHaveAttribute('aria-haspopup', 'menu');
  });

  test('Button Accessibility', () => {
    render(<Button action={mockAction} label={label} isDisabled={true} ariaDescribedby="descId" />);
    const button = screen.getByRole('button', { name: label });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-describedby', 'descId');
  });

  test('Activating a Button with Shortcut Key', () => {
    render(<Button action={mockAction} label={label} shortcutKey="k" />);
    screen.getByRole('button', { name: label });

    fireEvent.keyDown(window, { key: 'k' });
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
  // --- Regression coverage -------------------------------------------------

  describe('the pressed tick stays out of the accessible name (#151)', () => {
    // jsdom does not resolve stylesheets, so it cannot see CSS generated
    // content and an accessible-name assertion here would have passed against
    // the old code too. What these can prove is that the replacement is a real
    // element and that it is hidden from the accessibility tree; the structural
    // guarantee that no stylesheet reintroduces state-dependent generated
    // content lives in __tests__/generatedContent.test.js.
    const renderToggle = () =>
      render(<Button action={() => {}} label="Mute" isToggleButton toggleState={false} />);

    test('the indicator is not rendered while unpressed', () => {
      const { container } = renderToggle();
      expect(container.querySelector('.button-toggle-indicator')).toBeNull();
    });

    test('the indicator is rendered and aria-hidden once pressed', () => {
      const { container } = renderToggle();
      fireEvent.click(screen.getByRole('button', { name: 'Mute' }));

      const indicator = container.querySelector('.button-toggle-indicator');
      expect(indicator).not.toBeNull();
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
      expect(indicator).toHaveTextContent('\u2713');
    });

    test('the button is addressable by the same name pressed or not', () => {
      renderToggle();

      const before = screen.getByRole('button', { name: 'Mute' });
      expect(before).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(before);

      // Same query, same name -- this is what a voice-control user's
      // "click Mute" resolves through.
      const after = screen.getByRole('button', { name: 'Mute' });
      expect(after).toHaveAttribute('aria-pressed', 'true');
      expect(after).toBe(before);
    });

    test('the pressed state is still exposed, by aria-pressed alone', () => {
      renderToggle();
      const button = screen.getByRole('button', { name: 'Mute' });

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveClass('is-pressed');
    });
  });

  describe('aria-disabled variant (#139)', () => {
    const noop = () => {};

    test('native remains the default and is unchanged', () => {
      render(<Button action={noop} label="Save" isDisabled />);
      const button = screen.getByRole('button', { name: 'Save' });

      expect(button).toBeDisabled();
      expect(button).not.toHaveAttribute('aria-disabled');
    });

    test('disabledStyle="aria" exposes aria-disabled instead', () => {
      render(<Button action={noop} label="Save" isDisabled disabledStyle="aria" />);
      const button = screen.getByRole('button', { name: 'Save' });

      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).not.toBeDisabled();
    });

    test('an aria-disabled button stays focusable', () => {
      render(<Button action={noop} label="Save" isDisabled disabledStyle="aria" />);
      const button = screen.getByRole('button', { name: 'Save' });

      // The whole point: it must stay reachable so a user can discover why it
      // is unavailable. A natively disabled button cannot be focused at all.
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    test('an aria-disabled button suppresses its action on click', () => {
      const action = jest.fn();
      render(<Button action={action} label="Save" isDisabled disabledStyle="aria" />);

      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(action).not.toHaveBeenCalled();
    });

    test('an aria-disabled button suppresses Enter and Space', () => {
      const action = jest.fn();
      render(<Button action={action} label="Save" isDisabled disabledStyle="aria" />);
      const button = screen.getByRole('button', { name: 'Save' });

      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });

      expect(action).not.toHaveBeenCalled();
    });

    test('an aria-disabled toggle does not flip aria-pressed', () => {
      render(
        <Button
          action={() => {}}
          label="Mute"
          isToggleButton
          toggleState={false}
          isDisabled
          disabledStyle="aria"
        />,
      );
      const button = screen.getByRole('button', { name: 'Mute' });

      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    test('disabledStyle without isDisabled changes nothing', () => {
      const action = jest.fn();
      render(<Button action={action} label="Save" disabledStyle="aria" />);
      const button = screen.getByRole('button', { name: 'Save' });

      expect(button).not.toHaveAttribute('aria-disabled');
      fireEvent.click(button);
      expect(action).toHaveBeenCalled();
    });
  });
});
