import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import Listbox from '../components/Listbox/Listbox';

/**
 * APG pattern: Listbox
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
const opts = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
];

const Single = (props) => {
  const [value, setValue] = useState(props.initial ?? 'a');
  return <Listbox options={opts} value={value} onChange={setValue} label="X" />;
};

const Multi = (props) => {
  const [value, setValue] = useState(props.initial ?? []);
  return <Listbox options={opts} multiple value={value} onChange={setValue} label="X" />;
};

describe('Listbox Component (APG listbox pattern)', () => {
  test('container has role=listbox and is labelled', () => {
    render(<Single />);
    const list = screen.getByRole('listbox');
    expect(list).toHaveAttribute('aria-labelledby');
  });

  test('single-select: ArrowDown moves focus and selection', () => {
    render(<Single />);
    const options = screen.getAllByRole('option');
    options[0].focus();
    fireEvent.keyDown(options[0], { key: 'ArrowDown' });
    expect(options[1]).toHaveFocus();
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  test('single-select: only one option is aria-selected', () => {
    render(<Single />);
    const options = screen.getAllByRole('option');
    fireEvent.keyDown(options[0], { key: 'End' });
    const selected = options.filter((o) => o.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(1);
  });

  test('multi-select: listbox has aria-multiselectable=true', () => {
    render(<Multi />);
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  });

  test('multi-select: ArrowDown does NOT change selection (focus only)', () => {
    render(<Multi />);
    const options = screen.getAllByRole('option');
    options[0].focus();
    fireEvent.keyDown(options[0], { key: 'ArrowDown' });
    expect(options[1]).toHaveFocus();
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  test('multi-select: Space toggles selection of focused option', () => {
    render(<Multi />);
    const options = screen.getAllByRole('option');
    options[1].focus();
    fireEvent.keyDown(options[1], { key: ' ' });
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(options[1], { key: ' ' });
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  test('multi-select: Shift+ArrowDown extends selection', () => {
    render(<Multi />);
    const options = screen.getAllByRole('option');
    options[0].focus();
    fireEvent.keyDown(options[0], { key: 'ArrowDown', shiftKey: true });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  test('click selects in single mode', () => {
    render(<Single />);
    const options = screen.getAllByRole('option');
    fireEvent.click(options[2]);
    expect(options[2]).toHaveAttribute('aria-selected', 'true');
  });
  // --- Regression coverage -------------------------------------------------

  describe('type-ahead (#155)', () => {
    const fruit = [
      { value: 'ap', label: 'Apple' },
      { value: 'apr', label: 'Apricot' },
      { value: 'b', label: 'Banana' },
      { value: 'c', label: 'Cherry' },
    ];

    const renderFruit = () => {
      const onChange = jest.fn();
      render(<Listbox options={fruit} value="ap" onChange={onChange} label="Fruit" />);
      return { onChange, options: screen.getAllByRole('option') };
    };

    test('typing a character moves focus to the next matching option', () => {
      const { options } = renderFruit();
      options[0].focus();

      fireEvent.keyDown(options[0], { key: 'b' });

      expect(document.activeElement).toBe(options[2]);
    });

    test('selection follows focus, as it does for the arrow keys', () => {
      const { onChange, options } = renderFruit();
      options[0].focus();

      fireEvent.keyDown(options[0], { key: 'c' });

      expect(onChange).toHaveBeenCalledWith('c');
    });

    test('a non-matching character moves nothing', () => {
      const { options } = renderFruit();
      options[0].focus();

      fireEvent.keyDown(options[0], { key: 'z' });

      expect(document.activeElement).toBe(options[0]);
    });

    test('the search wraps to the start of the list', () => {
      const { options } = renderFruit();
      options[3].focus();

      fireEvent.keyDown(options[3], { key: 'a' });

      expect(document.activeElement).toBe(options[0]);
    });

    test('Ctrl+A still selects all rather than typing ahead', () => {
      const onChange = jest.fn();
      render(<Listbox options={fruit} value={[]} onChange={onChange} label="Fruit" multiple />);
      const options = screen.getAllByRole('option');
      options[0].focus();

      fireEvent.keyDown(options[0], { key: 'a', ctrlKey: true });

      expect(onChange).toHaveBeenCalledWith(['ap', 'apr', 'b', 'c']);
    });

    test('an unmodified "a" types ahead instead of selecting all', () => {
      const { options } = renderFruit();
      options[0].focus();

      fireEvent.keyDown(options[0], { key: 'a' });

      expect(document.activeElement).toBe(options[1]);
    });

    test('Space still toggles in multi-select rather than typing ahead', () => {
      const onChange = jest.fn();
      render(<Listbox options={fruit} value={[]} onChange={onChange} label="Fruit" multiple />);
      const options = screen.getAllByRole('option');
      options[0].focus();

      fireEvent.keyDown(options[0], { key: ' ' });

      expect(onChange).toHaveBeenCalledWith(['ap']);
    });
  });
  describe('aria-activedescendant focus model (#213)', () => {
    const fruits = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ];

    const Harness = (props) => {
      const [value, setValue] = useState(props.multiple ? [] : 'apple');
      return (
        <Listbox
          options={fruits}
          value={value}
          onChange={setValue}
          label="Fruits"
          focusModel="activedescendant"
          {...props}
        />
      );
    };

    test('the listbox itself is the tab stop', () => {
      render(<Harness />);
      expect(screen.getByRole('listbox')).toHaveAttribute('tabindex', '0');
    });

    test('options are not in the tab order', () => {
      render(<Harness />);
      screen.getAllByRole('option').forEach((o) => {
        expect(o).not.toHaveAttribute('tabindex');
      });
    });

    test('aria-activedescendant resolves to a real option', () => {
      render(<Harness />);
      const list = screen.getByRole('listbox');

      const active = list.getAttribute('aria-activedescendant');
      expect(active).toBeTruthy();
      expect(document.getElementById(active)).toHaveTextContent('Apple');
    });

    test('focusing the listbox and pressing a key drives it', () => {
      render(<Harness />);
      const list = screen.getByRole('listbox');

      // This is the exact shape the QA runner uses: focus the element it
      // located -- the listbox -- and then press a key. Under roving tabindex
      // focus stays on the <ul>, no option handler fires, and nothing happens.
      list.focus();
      expect(document.activeElement).toBe(list);

      fireEvent.keyDown(list, { key: 'ArrowDown' });

      expect(document.getElementById(list.getAttribute('aria-activedescendant'))).toHaveTextContent(
        'Banana',
      );
    });

    test('focus stays on the listbox as the active option moves', () => {
      render(<Harness />);
      const list = screen.getByRole('listbox');
      list.focus();

      fireEvent.keyDown(list, { key: 'ArrowDown' });
      fireEvent.keyDown(list, { key: 'ArrowDown' });

      expect(document.activeElement).toBe(list);
    });

    test('selection still follows focus in single-select', () => {
      render(<Harness />);
      const list = screen.getByRole('listbox');
      list.focus();

      fireEvent.keyDown(list, { key: 'ArrowDown' });

      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    test('Home and End move the active option', () => {
      render(<Harness />);
      const list = screen.getByRole('listbox');
      list.focus();

      fireEvent.keyDown(list, { key: 'End' });
      expect(document.getElementById(list.getAttribute('aria-activedescendant'))).toHaveTextContent(
        'Cherry',
      );

      fireEvent.keyDown(list, { key: 'Home' });
      expect(document.getElementById(list.getAttribute('aria-activedescendant'))).toHaveTextContent(
        'Apple',
      );
    });

    test('Space toggles and Shift+Arrow extends in multi-select', () => {
      render(<Harness multiple />);
      const list = screen.getByRole('listbox');
      list.focus();

      fireEvent.keyDown(list, { key: ' ' });
      fireEvent.keyDown(list, { key: 'ArrowDown', shiftKey: true });
      fireEvent.keyDown(list, { key: 'ArrowDown', shiftKey: true });

      ['Apple', 'Banana', 'Cherry'].forEach((name) => {
        expect(screen.getByRole('option', { name })).toHaveAttribute('aria-selected', 'true');
      });
    });

    test('type-ahead works from the listbox too', () => {
      render(<Harness />);
      const list = screen.getByRole('listbox');
      list.focus();

      fireEvent.keyDown(list, { key: 'c' });

      expect(document.getElementById(list.getAttribute('aria-activedescendant'))).toHaveTextContent(
        'Cherry',
      );
    });

    test('clicking an option leaves focus on the listbox', () => {
      render(<Harness />);
      const list = screen.getByRole('listbox');

      fireEvent.click(screen.getByRole('option', { name: 'Cherry' }));

      // Focus has to land where the keys are handled, or the widget stops
      // being drivable after a click.
      expect(document.activeElement).toBe(list);
      expect(document.getElementById(list.getAttribute('aria-activedescendant'))).toHaveTextContent(
        'Cherry',
      );
    });

    test('the roving model is untouched and remains the default', () => {
      render(<Listbox options={fruits} value="apple" onChange={() => {}} label="Fruits" />);
      const list = screen.getByRole('listbox');

      expect(list).toHaveAttribute('tabindex', '-1');
      expect(list).not.toHaveAttribute('aria-activedescendant');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('tabindex', '0');
    });
  });
});
