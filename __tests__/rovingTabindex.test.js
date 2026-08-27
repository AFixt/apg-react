import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Grid from '../components/Grid/Grid';
import Listbox from '../components/Listbox/Listbox';
import Menubar from '../components/Menubar/Menubar';
import Tabs from '../components/Tabs/Tabs';
import Toolbar from '../components/Toolbar/Toolbar';
import TreeGrid from '../components/TreeGrid/TreeGrid';
import TreeView from '../components/TreeView/TreeView';

/**
 * Contract: a roving-tabindex widget always keeps exactly one tab stop (#218).
 *
 * Every one of these remembers its position in state. That state survives a
 * change to the collection, so when the collection shrinks below the remembered
 * index nothing matches, no element gets tabIndex 0, and the widget drops out
 * of the tab order entirely -- unreachable by keyboard, with nothing on screen
 * to say so. The same failure as #138.
 *
 * Written as one table rather than seven separate tests so a new roving widget
 * has an obvious place to be added, and so this cannot regress one component at
 * a time.
 *
 * Each case renders a large collection, moves focus to the far end, then
 * re-renders with a smaller one. `control` renders the same small collection
 * without ever moving focus, and exists to prove the assertion can pass at all
 * -- a probe that reports zero in both arms would be measuring nothing.
 */
const cols = [{ key: 'a', label: 'A' }];
const countTabbable = (selector) => document.querySelectorAll(`${selector}[tabindex="0"]`).length;

const cases = [
  {
    name: 'Listbox',
    selector: '[role="option"]',
    big: (n) => (
      <Listbox
        options={Array.from({ length: n }, (_, i) => ({ value: `v${i}`, label: `O${i}` }))}
        value=""
        onChange={() => {}}
        label="L"
      />
    ),
    toEnd: () => {
      const os = screen.getAllByRole('option');
      os[0].focus();
      fireEvent.keyDown(os[0], { key: 'End' });
    },
  },
  {
    name: 'Tabs',
    selector: '[role="tab"]',
    big: (n) => (
      <Tabs
        tabs={Array.from({ length: n }, (_, i) => ({
          id: `${i}`,
          label: `T${i}`,
          content: `P${i}`,
        }))}
        label="T"
      />
    ),
    toEnd: () => {
      const ts = screen.getAllByRole('tab');
      ts[0].focus();
      fireEvent.keyDown(ts[0], { key: 'End' });
    },
  },
  {
    name: 'Toolbar',
    selector: '[role="toolbar"] button',
    big: (n) => (
      <Toolbar label="TB">
        {Array.from({ length: n }, (_, i) => (
          <button key={i}>B{i}</button>
        ))}
      </Toolbar>
    ),
    toEnd: () => {
      const bs = screen.getAllByRole('button');
      bs[0].focus();
      fireEvent.keyDown(bs[0], { key: 'End' });
    },
  },
  {
    name: 'Menubar',
    selector: '.menubar-item',
    big: (n) => (
      <Menubar
        label="MB"
        menus={Array.from({ length: n }, (_, i) => ({
          id: `m${i}`,
          label: `M${i}`,
          items: [{ id: `i${i}`, label: `I${i}` }],
        }))}
      />
    ),
    toEnd: () => {
      const ms = screen.getAllByRole('menuitem');
      ms[0].focus();
      fireEvent.keyDown(ms[0], { key: 'End' });
    },
  },
  {
    name: 'TreeView',
    selector: '[role="treeitem"]',
    big: (n) => (
      <TreeView
        label="TV"
        nodes={Array.from({ length: n }, (_, i) => ({ id: `n${i}`, label: `N${i}` }))}
      />
    ),
    toEnd: () => {
      const items = document.querySelectorAll('[data-itemid]');
      act(() => items[items.length - 1].focus());
    },
  },
  {
    name: 'Grid',
    selector: '.grid-cell',
    big: (n) => (
      <Grid
        label="G"
        columns={cols}
        rows={Array.from({ length: n }, (_, i) => ({ id: i, a: `r${i}` }))}
      />
    ),
    toEnd: () => {
      const cells = screen.getAllByRole('gridcell');
      fireEvent.focus(cells[cells.length - 1]);
    },
  },
  {
    name: 'TreeGrid',
    selector: '[data-row][data-col]',
    big: (n) => (
      <TreeGrid
        label="TG"
        columns={cols}
        rows={Array.from({ length: n }, (_, i) => ({ id: `t${i}`, a: `r${i}` }))}
      />
    ),
    toEnd: () => {
      const cells = document.querySelectorAll('[data-row][data-col]');
      fireEvent.focus(cells[cells.length - 1]);
    },
  },
];

describe('roving tabindex survives the collection shrinking (#218)', () => {
  describe.each(cases.map((c) => [c.name, c]))('%s', (_name, testCase) => {
    test('control: a freshly rendered small widget has exactly one tab stop', () => {
      render(testCase.big(2));
      expect(countTabbable(testCase.selector)).toBe(1);
    });

    test('still has exactly one tab stop after shrinking below the focused index', () => {
      const { rerender } = render(testCase.big(5));
      testCase.toEnd();

      rerender(testCase.big(2));

      // Zero here means the widget cannot be reached by Tab at all, with
      // nothing on screen to indicate it.
      expect(countTabbable(testCase.selector)).toBe(1);
    });

    test('shrinking with focus still in range is unaffected', () => {
      const { rerender } = render(testCase.big(5));
      rerender(testCase.big(2));
      expect(countTabbable(testCase.selector)).toBe(1);
    });
  });
});
