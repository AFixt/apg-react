import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Tabs from '../components/Tabs/Tabs';

/**
 * APG pattern: Tabs
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
const tabs = [
  { id: 'one', label: 'One', content: <p>Panel one</p> },
  { id: 'two', label: 'Two', content: <p>Panel two</p> },
  { id: 'three', label: 'Three', content: <p>Panel three</p> },
];

describe('Tabs Component (APG tabs pattern)', () => {
  test('renders a tablist with role=tab buttons', () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  test('first tab is selected and focusable by default', () => {
    render(<Tabs tabs={tabs} />);
    const allTabs = screen.getAllByRole('tab');
    expect(allTabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(allTabs[0]).toHaveAttribute('tabindex', '0');
    expect(allTabs[1]).toHaveAttribute('tabindex', '-1');
  });

  test('each tab controls a panel labelled by the tab', () => {
    render(<Tabs tabs={tabs} idPrefix="t" />);
    const allTabs = screen.getAllByRole('tab');
    allTabs.forEach((t, i) => {
      expect(t).toHaveAttribute('aria-controls', `t-panel-${tabs[i].id}`);
    });
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    panels.forEach((p, i) => {
      expect(p).toHaveAttribute('aria-labelledby', `t-tab-${tabs[i].id}`);
    });
  });

  test('ArrowRight moves focus and activates (automatic)', () => {
    render(<Tabs tabs={tabs} />);
    const allTabs = screen.getAllByRole('tab');
    allTabs[0].focus();
    fireEvent.keyDown(allTabs[0], { key: 'ArrowRight' });
    expect(allTabs[1]).toHaveFocus();
    expect(allTabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  test('ArrowLeft wraps from first to last', () => {
    render(<Tabs tabs={tabs} />);
    const allTabs = screen.getAllByRole('tab');
    allTabs[0].focus();
    fireEvent.keyDown(allTabs[0], { key: 'ArrowLeft' });
    expect(allTabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  test('Home / End jump to first / last tab', () => {
    render(<Tabs tabs={tabs} />);
    const allTabs = screen.getAllByRole('tab');
    allTabs[0].focus();
    fireEvent.keyDown(allTabs[0], { key: 'End' });
    expect(allTabs[2]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(allTabs[2], { key: 'Home' });
    expect(allTabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  test('manual activation: arrow moves focus only, Enter selects', () => {
    render(<Tabs tabs={tabs} activation="manual" />);
    const allTabs = screen.getAllByRole('tab');
    allTabs[0].focus();
    fireEvent.keyDown(allTabs[0], { key: 'ArrowRight' });
    expect(allTabs[1]).toHaveFocus();
    expect(allTabs[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(allTabs[1], { key: 'Enter' });
    expect(allTabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  test('vertical orientation sets aria-orientation and uses Arrow Up/Down', () => {
    render(<Tabs tabs={tabs} orientation="vertical" />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    const allTabs = screen.getAllByRole('tab');
    allTabs[0].focus();
    fireEvent.keyDown(allTabs[0], { key: 'ArrowDown' });
    expect(allTabs[1]).toHaveAttribute('aria-selected', 'true');
  });
  // --- Regression coverage -------------------------------------------------

  describe('the tablist can be named (#139)', () => {
    const tabs = [
      { id: 'one', label: 'One', content: 'First' },
      { id: 'two', label: 'Two', content: 'Second' },
    ];

    test('label names the tablist', () => {
      render(<Tabs tabs={tabs} label="Sample Tabs" />);
      expect(screen.getByRole('tablist')).toHaveAccessibleName('Sample Tabs');
    });

    test('labelledBy names it from an existing element', () => {
      render(
        <>
          <h2 id="heading">Account settings</h2>
          <Tabs tabs={tabs} labelledBy="heading" />
        </>,
      );

      expect(screen.getByRole('tablist')).toHaveAccessibleName('Account settings');
    });

    test('labelledBy takes precedence over label', () => {
      render(
        <>
          <h2 id="heading">Account settings</h2>
          <Tabs tabs={tabs} label="Ignored" labelledBy="heading" />
        </>,
      );
      const tablist = screen.getByRole('tablist');

      expect(tablist).toHaveAccessibleName('Account settings');
      expect(tablist).not.toHaveAttribute('aria-label');
    });

    test('an unnamed tablist renders neither attribute', () => {
      render(<Tabs tabs={tabs} />);
      const tablist = screen.getByRole('tablist');

      expect(tablist).not.toHaveAttribute('aria-label');
      expect(tablist).not.toHaveAttribute('aria-labelledby');
    });

    test('two tablists on one page can be told apart', () => {
      render(
        <>
          <Tabs tabs={tabs} label="Billing" idPrefix="billing" />
          <Tabs tabs={tabs} label="Profile" idPrefix="profile" />
        </>,
      );

      expect(screen.getByRole('tablist', { name: 'Billing' })).toBeInTheDocument();
      expect(screen.getByRole('tablist', { name: 'Profile' })).toBeInTheDocument();
    });

    test('naming does not disturb tab selection', () => {
      render(<Tabs tabs={tabs} label="Sample Tabs" />);

      fireEvent.click(screen.getByRole('tab', { name: 'Two' }));

      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
    });
  });
});
