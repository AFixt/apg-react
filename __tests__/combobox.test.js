import '@testing-library/jest-dom';
import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import Combobox from '../components/Combobox/Combobox';

/**
 * APG pattern: Combobox
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
  { value: 'd', label: 'Date' },
];

const Harness = (props) => {
  const [value, setValue] = useState(props.initial ?? '');
  return <Combobox options={options} value={value} onChange={setValue} label="Fruit" {...props} />;
};

describe('Combobox Component (APG combobox pattern)', () => {
  test('input has role=combobox and aria-autocomplete', () => {
    render(<Harness autocomplete="list" />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('aria-controls references the listbox id', () => {
    render(<Harness autocomplete="list" />);
    const input = screen.getByRole('combobox');
    const listId = input.getAttribute('aria-controls');
    expect(listId).toBeTruthy();
  });

  test('typing opens the popup and filters options (autocomplete=list)', () => {
    render(<Harness autocomplete="list" />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'a' } });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const opts = screen.getAllByRole('option');
    opts.forEach((o) => expect(o.textContent.toLowerCase()).toMatch(/a/));
  });

  test('ArrowDown opens popup when closed and sets aria-activedescendant', () => {
    render(<Harness autocomplete="list" />);
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-activedescendant');
  });

  test('Enter on active option selects it and closes popup', () => {
    render(<Harness autocomplete="list" />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('Banana');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes the popup', () => {
    render(<Harness autocomplete="list" />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('autocomplete=none: focusing opens the full popup', () => {
    render(<Harness autocomplete="none" />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option')).toHaveLength(options.length);
  });

  test('autocomplete value reflects the variant prop', () => {
    const { rerender } = render(<Harness autocomplete="none" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    rerender(<Harness autocomplete="both" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'both');
  });
  // --- Regression coverage -------------------------------------------------

  describe('no-match search (#152)', () => {
    const typeNoMatch = () => {
      render(<Harness autocomplete="list" />);
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'zzzz' } });
      return input;
    };

    test('does not claim an open popup when nothing matched', () => {
      const input = typeNoMatch();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    test('leaves no dangling aria-activedescendant', () => {
      const input = typeNoMatch();
      const active = input.getAttribute('aria-activedescendant');
      expect(active).toBeNull();
    });

    test('every aria-activedescendant resolves while options exist', () => {
      render(<Harness autocomplete="list" />);
      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const active = input.getAttribute('aria-activedescendant');
      expect(active).not.toBeNull();
      expect(document.getElementById(active)).toBeInTheDocument();
    });

    test('recovers when the search is narrowed back to a match', () => {
      render(<Harness autocomplete="list" />);
      const input = screen.getByRole('combobox');

      fireEvent.change(input, { target: { value: 'zzzz' } });
      expect(input).toHaveAttribute('aria-expanded', 'false');

      fireEvent.change(input, { target: { value: 'Ap' } });
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('deletion is not re-expanded by inline autocomplete (#153)', () => {
    // The inline completion is applied inside a requestAnimationFrame callback,
    // which jsdom never flushes on its own -- so without this these assertions
    // pass against the unfixed component, which is worse than no test. The
    // callbacks are queued and flushed *after* React commits, mirroring the
    // browser: flushing them synchronously inside the change handler lets the
    // controlled `value` overwrite the completion and hides the behaviour.
    let rafSpy;
    let rafQueue = [];

    beforeEach(() => {
      rafQueue = [];
      rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rafQueue.push(cb);
        return rafQueue.length;
      });
    });

    afterEach(() => {
      rafSpy.mockRestore();
    });

    const flushRaf = () => {
      const queued = rafQueue;
      rafQueue = [];
      act(() => {
        queued.forEach((cb) => cb(0));
      });
    };

    // `fireEvent.change(el, { nativeEvent: { inputType } })` silently drops the
    // inputType -- it is not a DOM event init key -- so the component would
    // always fall through to the length comparison and these tests would not
    // be testing the branch they name. Build the InputEvent for real instead.
    const change = (input, value, inputType) => {
      const event = createEvent.input(input, { target: { value }, inputType });
      fireEvent(input, event);
      flushRaf();
    };

    test('insertion still completes inline', () => {
      render(<Harness autocomplete="both" />);
      const input = screen.getByRole('combobox');

      change(input, 'Ap', 'insertText');

      expect(input.value).toBe('Apple');
      expect(input.selectionStart).toBe(2);
      expect(input.selectionEnd).toBe(5);
    });

    test('Backspace over a completion does not re-expand it', () => {
      render(<Harness autocomplete="both" />);
      const input = screen.getByRole('combobox');

      change(input, 'Ap', 'insertText');
      expect(input.value).toBe('Apple');

      // Backspace with "ple" selected deletes the selection, leaving "Ap".
      change(input, 'Ap', 'deleteContentBackward');
      expect(input.value).toBe('Ap');

      change(input, 'A', 'deleteContentBackward');
      expect(input.value).toBe('A');
    });

    test('deleting to empty does not refill the field', () => {
      render(<Harness autocomplete="both" />);
      const input = screen.getByRole('combobox');

      change(input, 'A', 'deleteContentBackward');
      expect(input.value).toBe('A');

      change(input, '', 'deleteContentBackward');
      expect(input.value).toBe('');
    });

    test('a deletion never lengthens the value', () => {
      render(<Harness autocomplete="both" />);
      const input = screen.getByRole('combobox');

      change(input, 'Ban', 'insertText');
      const beforeLength = input.value.length;

      change(input, 'Ba', 'deleteContentBackward');
      expect(input.value.length).toBeLessThan(beforeLength);
    });

    test('falls back to a length comparison when inputType is absent', () => {
      render(<Harness autocomplete="both" />);
      const input = screen.getByRole('combobox');

      change(input, 'Ap');
      change(input, 'A');

      expect(input.value).toBe('A');
    });
  });

  describe('aria-haspopup (#142)', () => {
    test('names the popup role', () => {
      render(<Harness autocomplete="list" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
    });

    test('is present whether or not the popup is showing', () => {
      render(<Harness autocomplete="list" />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    });
  });
});
