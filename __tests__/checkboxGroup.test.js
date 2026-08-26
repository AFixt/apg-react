import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import CheckboxGroup from '../components/CheckboxGroup/CheckboxGroup';

/**
 * APG pattern: Checkbox (Mixed-State / Tri-State)
 * https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 *
 * Key requirements:
 *   - Container has role="group" (or equivalent native) and is labelled.
 *   - Parent ("controller") checkbox reflects mixed state when some (not all)
 *     children are checked.
 *   - Toggling parent when none checked -> checks all.
 *   - Toggling parent when all checked -> unchecks all.
 *   - Toggling parent when mixed -> checks all (standard APG behavior).
 *   - Children support Space activation.
 */
describe('CheckboxGroup Component (APG tri-state checkbox pattern)', () => {
  const items = [
    { id: 'opt1', label: 'Option 1' },
    { id: 'opt2', label: 'Option 2' },
    { id: 'opt3', label: 'Option 3' },
  ];

  const getParent = () => screen.getByRole('checkbox', { name: 'All' });

  const getChild = (label) => screen.getByRole('checkbox', { name: label });

  test('exposes an accessible group with a label', () => {
    render(<CheckboxGroup items={items} label="Condiments" />);
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-labelledby');
    const labelId = group.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId)).toHaveTextContent('Condiments');
  });

  test('parent checkbox starts unchecked when no children are checked', () => {
    render(<CheckboxGroup items={items} label="Condiments" />);
    const parent = getParent();
    expect(parent).not.toBeChecked();
    expect(parent.indeterminate).toBe(false);
  });

  test('parent renders in mixed (indeterminate) state when only some children are checked', () => {
    render(<CheckboxGroup items={items} label="Condiments" />);
    fireEvent.click(getChild('Option 1'));
    const parent = getParent();
    expect(parent.indeterminate).toBe(true);
    expect(parent).toHaveAttribute('aria-checked', 'mixed');
  });

  test('parent becomes fully checked when every child is checked', () => {
    render(<CheckboxGroup items={items} label="Condiments" />);
    fireEvent.click(getChild('Option 1'));
    fireEvent.click(getChild('Option 2'));
    fireEvent.click(getChild('Option 3'));
    const parent = getParent();
    expect(parent).toBeChecked();
    expect(parent.indeterminate).toBe(false);
    expect(parent).toHaveAttribute('aria-checked', 'true');
  });

  test('clicking parent when all are unchecked checks all children', () => {
    render(<CheckboxGroup items={items} label="Condiments" />);
    fireEvent.click(getParent());
    items.forEach((item) => {
      expect(getChild(item.label)).toBeChecked();
    });
  });

  test('clicking parent when all are checked unchecks all children', () => {
    render(<CheckboxGroup items={items} label="Condiments" />);
    fireEvent.click(getParent());
    fireEvent.click(getParent());
    items.forEach((item) => {
      expect(getChild(item.label)).not.toBeChecked();
    });
  });

  test('Space key toggles a child checkbox', () => {
    render(<CheckboxGroup items={items} label="Condiments" />);
    const child = getChild('Option 1');
    fireEvent.keyDown(child, { key: ' ' });
    expect(child).toBeChecked();
  });
  // --- Regression coverage -------------------------------------------------

  describe('the parent control can be named (#145)', () => {
    const items = [
      { id: '1', label: 'Email' },
      { id: '2', label: 'SMS' },
    ];

    test('defaults to "All", so this stays non-breaking', () => {
      render(<CheckboxGroup label="Notify me by" items={items} />);
      expect(screen.getByRole('checkbox', { name: 'All' })).toBeInTheDocument();
    });

    test('labels.selectAll renames it', () => {
      render(
        <CheckboxGroup label="Notify me by" items={items} labels={{ selectAll: 'Select all' }} />,
      );

      expect(screen.getByRole('checkbox', { name: 'Select all' })).toBeInTheDocument();
      expect(screen.queryByRole('checkbox', { name: 'All' })).not.toBeInTheDocument();
    });

    test('the renamed control is still the tri-state parent', () => {
      render(
        <CheckboxGroup label="Notify me by" items={items} labels={{ selectAll: 'Select all' }} />,
      );
      const parent = screen.getByRole('checkbox', { name: 'Select all' });

      fireEvent.click(screen.getByRole('checkbox', { name: 'Email' }));
      expect(parent).toHaveAttribute('aria-checked', 'mixed');

      fireEvent.click(screen.getByRole('checkbox', { name: 'SMS' }));
      expect(parent).toHaveAttribute('aria-checked', 'true');
    });

    test('the renamed control still toggles every item', () => {
      render(
        <CheckboxGroup label="Notify me by" items={items} labels={{ selectAll: 'Select all' }} />,
      );

      fireEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));

      expect(screen.getByRole('checkbox', { name: 'Email' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toBeChecked();
    });

    test('an omitted labels key falls back to the default', () => {
      render(<CheckboxGroup label="Notify me by" items={items} labels={{}} />);
      expect(screen.getByRole('checkbox', { name: 'All' })).toBeInTheDocument();
    });
  });
});
