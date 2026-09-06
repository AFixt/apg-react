import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Toolbar from '../components/Toolbar/Toolbar';

/**
 * APG pattern: Toolbar
 * https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 */
describe('Toolbar Component (APG toolbar pattern)', () => {
  const render3 = () =>
    render(
      <Toolbar label="Formatting">
        <button>Bold</button>
        <button>Italic</button>
        <button>Underline</button>
      </Toolbar>,
    );

  test('container has role=toolbar and aria-label', () => {
    render3();
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toHaveAttribute('aria-label', 'Formatting');
  });

  test('only the active item is in the tab order', () => {
    render3();
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('tabindex', '0');
    expect(buttons[1]).toHaveAttribute('tabindex', '-1');
    expect(buttons[2]).toHaveAttribute('tabindex', '-1');
  });

  test('ArrowRight moves focus to next item', () => {
    render3();
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    expect(buttons[1]).toHaveFocus();
  });

  test('ArrowLeft wraps from first to last', () => {
    render3();
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowLeft' });
    expect(buttons[2]).toHaveFocus();
  });

  test('Home / End jump to first / last', () => {
    render3();
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'End' });
    expect(buttons[2]).toHaveFocus();
    fireEvent.keyDown(buttons[2], { key: 'Home' });
    expect(buttons[0]).toHaveFocus();
  });

  test('disabled items are skipped during arrow navigation', () => {
    render(
      <Toolbar label="Mixed">
        <button>A</button>
        <button disabled>B</button>
        <button>C</button>
      </Toolbar>,
    );
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    expect(buttons[2]).toHaveFocus();
  });

  test('vertical orientation exposes aria-orientation=vertical', () => {
    render(
      <Toolbar label="Vertical" orientation="vertical">
        <button>A</button>
        <button>B</button>
      </Toolbar>,
    );
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
  });

  describe('aria-disabled is read as a value, not a presence (#237 review)', () => {
    const tabIndexes = () => screen.getAllByRole('button').map((b) => b.getAttribute('tabindex'));

    test('aria-disabled={false} keeps an item in arrow-key traversal', () => {
      render(
        <Toolbar label="Formatting">
          <button>Bold</button>
          <button aria-disabled={false}>Italic</button>
          <button>Underline</button>
        </Toolbar>,
      );
      const [bold, italic] = screen.getAllByRole('button');

      // React renders aria-disabled={false} as the string "false". Testing the
      // attribute for presence read that as disabled and skipped the control.
      expect(italic).toHaveAttribute('aria-disabled', 'false');
      bold.focus();
      fireEvent.keyDown(bold, { key: 'ArrowRight' });

      expect(italic).toHaveFocus();
    });

    test('the tab stop starts past an aria-disabled first item', () => {
      render(
        <Toolbar label="Formatting">
          <button aria-disabled="true">Bold</button>
          <button>Italic</button>
        </Toolbar>,
      );

      expect(tabIndexes()).toEqual(['-1', '0']);
    });

    test('focusing an aria-disabled item does not move the tab stop onto it', () => {
      render(
        <Toolbar label="Formatting">
          <button>Bold</button>
          <button aria-disabled="true">Italic</button>
        </Toolbar>,
      );
      const [, italic] = screen.getAllByRole('button');

      // Reachable on purpose -- that is what aria-disabled buys -- but Tab must
      // not later land on it, so the roving stop stays where it was.
      fireEvent.focus(italic);

      expect(tabIndexes()).toEqual(['0', '-1']);
    });
  });
});
