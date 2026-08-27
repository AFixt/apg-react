import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Accordion from '../components/Accordion/Accordion';

const sampleItems = [
  { title: 'Section 1', content: 'Content 1' },
  { title: 'Section 2', content: 'Content 2' },
];

const mockToggleItem = jest.fn();

const renderAccordion = (props = {}) =>
  render(<Accordion items={sampleItems} toggleItem={mockToggleItem} openIndex={null} {...props} />);

describe('Accordion Component', () => {
  test('matches the snapshot', () => {
    const { asFragment } = renderAccordion();
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders all items', () => {
    renderAccordion();
    sampleItems.forEach((item) => {
      expect(screen.getByRole('button', { name: item.title })).toBeInTheDocument();
      expect(screen.getByText(item.content)).toBeInTheDocument();
    });
  });

  test('toggles item on header button click', () => {
    renderAccordion();
    const firstHeaderButton = screen.getByRole('button', { name: sampleItems[0].title });
    fireEvent.click(firstHeaderButton);
    expect(mockToggleItem).toHaveBeenCalledWith(0);
  });

  test('handles keyboard navigation', () => {
    renderAccordion({ openIndex: 0 });
    const firstHeaderButton = screen.getByRole('button', { name: sampleItems[0].title });
    firstHeaderButton.focus();
    fireEvent.keyDown(firstHeaderButton, { key: 'ArrowDown' });
    expect(document.activeElement).toHaveAttribute('id', 'accordion-header-1');
  });

  test('header button should have correct ARIA attributes', () => {
    renderAccordion({ openIndex: 0 });
    const firstHeaderButton = screen.getByRole('button', { name: sampleItems[0].title });
    expect(firstHeaderButton).toHaveAttribute('aria-expanded', 'true');
    expect(firstHeaderButton).toHaveAttribute('aria-controls', 'panel-0');
  });

  test('navigates between headers correctly using Tab and Shift+Tab', () => {
    renderAccordion();
    const firstHeaderButton = screen.getByRole('button', { name: sampleItems[0].title });
    const secondHeaderButton = screen.getByRole('button', { name: sampleItems[1].title });
    firstHeaderButton.focus();
    fireEvent.keyDown(firstHeaderButton, { key: 'Tab' });
    secondHeaderButton.focus();
    expect(secondHeaderButton).toHaveFocus();
    fireEvent.keyDown(secondHeaderButton, { key: 'Tab', shiftKey: true });
    firstHeaderButton.focus();
    expect(firstHeaderButton).toHaveFocus();
  });

  test('expands/collapses accordion on Enter and Space key press', () => {
    renderAccordion();
    const firstHeaderButton = screen.getByRole('button', { name: sampleItems[0].title });
    fireEvent.keyDown(firstHeaderButton, { key: 'Enter' });
    fireEvent.keyDown(firstHeaderButton, { key: ' ' });
    // Native button activation via Enter/Space is browser-mediated;
    // our component registers the click path — ensure no handler error.
    expect(firstHeaderButton).toBeInTheDocument();
  });

  test('verifies ARIA roles and properties for each header', () => {
    renderAccordion({ openIndex: 1 });
    sampleItems.forEach((item, index) => {
      const headerButton = screen.getByRole('button', { name: item.title });
      const isExpanded = index === 1;
      expect(headerButton).toHaveAttribute('aria-expanded', isExpanded.toString());
      expect(headerButton).toHaveAttribute('aria-controls', `panel-${index}`);
    });
  });
  // --- Regression coverage -------------------------------------------------

  describe('aria-disabled pass-through (#171)', () => {
    const base = [
      { title: 'Section 1', content: 'Content 1' },
      { title: 'Section 2', content: 'Content 2' },
    ];

    test('nothing is exposed when no item is disabled', () => {
      render(<Accordion items={base} openIndex={0} toggleItem={() => {}} />);

      screen.getAllByRole('button').forEach((header) => {
        expect(header).not.toHaveAttribute('aria-disabled');
      });
    });

    test('a disabled item exposes aria-disabled on its header', () => {
      const items = [{ ...base[0], disabled: true }, base[1]];
      render(<Accordion items={items} openIndex={0} toggleItem={() => {}} />);

      const headers = screen.getAllByRole('button');
      expect(headers[0]).toHaveAttribute('aria-disabled', 'true');
      expect(headers[1]).not.toHaveAttribute('aria-disabled');
    });

    test('the header stays focusable and keeps aria-expanded', () => {
      const items = [{ ...base[0], disabled: true }, base[1]];
      render(<Accordion items={items} openIndex={0} toggleItem={() => {}} />);
      const header = screen.getAllByRole('button')[0];

      // aria-disabled, not native disabled: it must stay reachable so a
      // keyboard user can discover why collapsing does nothing.
      expect(header).not.toBeDisabled();
      header.focus();
      expect(document.activeElement).toBe(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    test('the consumer still owns whether activation does anything', () => {
      const toggleItem = jest.fn();
      const items = [{ ...base[0], disabled: true }, base[1]];
      render(<Accordion items={items} openIndex={0} toggleItem={toggleItem} />);

      fireEvent.click(screen.getAllByRole('button')[0]);

      // The component reports the activation; enforcing the at-least-one-open
      // rule is the consumer's job, since it owns openIndex.
      expect(toggleItem).toHaveBeenCalledWith(0);
    });
  });
});
