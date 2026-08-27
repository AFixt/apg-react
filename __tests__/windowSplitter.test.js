import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import WindowSplitter from '../components/WindowSplitter/WindowSplitter';

/**
 * APG pattern: Window Splitter
 * https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 */
const panes = { primary: 'Primary', secondary: 'Secondary' };

const setup = (props = {}) => {
  const utils = render(<WindowSplitter label="Resize panes" {...panes} {...props} />);
  return { separator: screen.getByRole('separator'), ...utils };
};

describe('WindowSplitter Component (APG window splitter pattern)', () => {
  describe('roles, states and properties', () => {
    test('the splitter is a separator', () => {
      const { separator } = setup();
      expect(separator).toBeInTheDocument();
    });

    test('it is a tab stop', () => {
      const { separator } = setup();
      expect(separator).toHaveAttribute('tabindex', '0');
    });

    test('it is named', () => {
      const { separator } = setup();
      expect(separator).toHaveAccessibleName('Resize panes');
    });

    test('labelledBy names it from an existing element', () => {
      render(
        <>
          <h2 id="heading">Panes</h2>
          <WindowSplitter labelledBy="heading" {...panes} />
        </>,
      );
      expect(screen.getByRole('separator')).toHaveAccessibleName('Panes');
    });

    test('it carries the value triple', () => {
      const { separator } = setup({ min: 10, max: 90, defaultValue: 40 });
      expect(separator).toHaveAttribute('aria-valuenow', '40');
      expect(separator).toHaveAttribute('aria-valuemin', '10');
      expect(separator).toHaveAttribute('aria-valuemax', '90');
    });

    test('aria-controls resolves to the primary pane', () => {
      const { separator } = setup();
      const controlled = document.getElementById(separator.getAttribute('aria-controls'));

      expect(controlled).toBeInTheDocument();
      expect(controlled).toHaveTextContent('Primary');
    });

    test('aria-orientation reports the separator axis', () => {
      const { separator } = setup();
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');

      render(<WindowSplitter label="x" orientation="horizontal" {...panes} />);
      expect(screen.getAllByRole('separator')[1]).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('keyboard interaction', () => {
    test('Right Arrow grows the primary pane', () => {
      const { separator } = setup({ defaultValue: 50, step: 5 });
      fireEvent.keyDown(separator, { key: 'ArrowRight' });
      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });

    test('Left Arrow shrinks it', () => {
      const { separator } = setup({ defaultValue: 50, step: 5 });
      fireEvent.keyDown(separator, { key: 'ArrowLeft' });
      expect(separator).toHaveAttribute('aria-valuenow', '45');
    });

    test('Up and Down work too, whatever the orientation', () => {
      const { separator } = setup({ defaultValue: 50, step: 5 });

      fireEvent.keyDown(separator, { key: 'ArrowDown' });
      expect(separator).toHaveAttribute('aria-valuenow', '55');

      fireEvent.keyDown(separator, { key: 'ArrowUp' });
      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    test('Home moves to the minimum', () => {
      const { separator } = setup({ min: 10, defaultValue: 50 });
      fireEvent.keyDown(separator, { key: 'Home' });
      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    test('End moves to the maximum', () => {
      const { separator } = setup({ max: 90, defaultValue: 50 });
      fireEvent.keyDown(separator, { key: 'End' });
      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });

    test('the value is clamped at both ends', () => {
      const { separator } = setup({ min: 10, max: 90, defaultValue: 88, step: 5 });

      fireEvent.keyDown(separator, { key: 'ArrowRight' });
      expect(separator).toHaveAttribute('aria-valuenow', '90');

      fireEvent.keyDown(separator, { key: 'ArrowRight' });
      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });

    test('an unhandled key is left alone', () => {
      const { separator } = setup({ defaultValue: 50 });
      fireEvent.keyDown(separator, { key: 'a' });
      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });
  });

  describe('Enter collapses and restores', () => {
    test('Enter collapses the primary pane to the minimum', () => {
      const { separator } = setup({ min: 10, defaultValue: 50 });

      fireEvent.keyDown(separator, { key: 'Enter' });

      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    test('Enter again restores the previous size, not a default', () => {
      const { separator } = setup({ min: 10, defaultValue: 50, step: 5 });

      fireEvent.keyDown(separator, { key: 'ArrowRight' });
      expect(separator).toHaveAttribute('aria-valuenow', '55');

      fireEvent.keyDown(separator, { key: 'Enter' });
      expect(separator).toHaveAttribute('aria-valuenow', '10');

      fireEvent.keyDown(separator, { key: 'Enter' });
      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });

    test('restoring from a pane collapsed on load falls back to the maximum', () => {
      const { separator } = setup({ min: 10, max: 90, defaultValue: 10 });

      fireEvent.keyDown(separator, { key: 'Enter' });

      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });
  });

  describe('controlled value', () => {
    test('onChange reports every move', () => {
      const onChange = jest.fn();
      const { separator } = setup({ defaultValue: 50, step: 5, onChange });

      fireEvent.keyDown(separator, { key: 'ArrowRight' });

      expect(onChange).toHaveBeenCalledWith(55);
    });

    test('a controlled splitter reflects the prop, not its own state', () => {
      const { rerender } = render(<WindowSplitter label="x" value={30} {...panes} />);
      const separator = screen.getByRole('separator');

      fireEvent.keyDown(separator, { key: 'ArrowRight' });
      expect(separator).toHaveAttribute('aria-valuenow', '30');

      rerender(<WindowSplitter label="x" value={70} {...panes} />);
      expect(separator).toHaveAttribute('aria-valuenow', '70');
    });

    test('a consumer can drive it end to end', () => {
      const Harness = () => {
        const [size, setSize] = useState(50);
        return (
          <>
            <WindowSplitter label="x" value={size} onChange={setSize} {...panes} />
            <span data-testid="readout">{size}</span>
          </>
        );
      };
      render(<Harness />);

      fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });

      expect(screen.getByTestId('readout')).toHaveTextContent('55');
    });
  });

  test('the primary pane is sized from the value', () => {
    const { separator } = setup({ defaultValue: 40 });
    const primary = document.getElementById(separator.getAttribute('aria-controls'));

    expect(primary).toHaveStyle({ width: '40%' });
  });
});
