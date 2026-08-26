import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import TreeView from '../components/TreeView/TreeView';

/**
 * APG pattern: Tree View
 * https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
const nodes = [
  {
    id: 'a',
    label: 'A',
    children: [
      { id: 'a1', label: 'A1' },
      {
        id: 'a2',
        label: 'A2',
        children: [{ id: 'a2a', label: 'A2a' }],
      },
    ],
  },
  { id: 'b', label: 'B' },
];

describe('TreeView Component (APG tree pattern)', () => {
  test('container has role=tree and aria-label', () => {
    render(<TreeView label="Files" nodes={nodes} />);
    const tree = screen.getByRole('tree');
    expect(tree).toHaveAttribute('aria-label', 'Files');
  });

  test('treeitems expose aria-level / posinset / setsize / expanded', () => {
    render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} />);
    const items = screen.getAllByRole('treeitem');
    const first = items[0];
    expect(first).toHaveAttribute('aria-level', '1');
    expect(first).toHaveAttribute('aria-posinset', '1');
    expect(first).toHaveAttribute('aria-setsize', '2');
    expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  test('only the current treeitem is in the tab order', () => {
    render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} />);
    const items = screen.getAllByRole('treeitem');
    const tabbable = items.filter((i) => i.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
  });

  test('ArrowDown moves focus to next visible item', () => {
    render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} />);
    const items = screen.getAllByRole('treeitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    expect(items[1]).toHaveFocus();
  });

  test('ArrowRight on closed parent expands it', () => {
    render(<TreeView label="Files" nodes={nodes} />);
    const items = screen.getAllByRole('treeitem');
    items[0].focus();
    expect(items[0]).toHaveAttribute('aria-expanded', 'false');
    fireEvent.keyDown(items[0], { key: 'ArrowRight' });
    // After expansion, first item should now be expanded
    const updated = screen.getAllByRole('treeitem');
    expect(updated[0]).toHaveAttribute('aria-expanded', 'true');
  });

  test('ArrowRight on open parent focuses first child', () => {
    render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} />);
    const items = screen.getAllByRole('treeitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'ArrowRight' });
    const updated = screen.getAllByRole('treeitem');
    expect(updated[1]).toHaveFocus();
  });

  test('ArrowLeft on open parent collapses it', () => {
    render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} />);
    const items = screen.getAllByRole('treeitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'ArrowLeft' });
    const updated = screen.getAllByRole('treeitem');
    expect(updated[0]).toHaveAttribute('aria-expanded', 'false');
  });

  test('ArrowLeft on child focuses parent', () => {
    render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} />);
    const items = screen.getAllByRole('treeitem');
    items[1].focus();
    fireEvent.keyDown(items[1], { key: 'ArrowLeft' });
    const updated = screen.getAllByRole('treeitem');
    expect(updated[0]).toHaveFocus();
  });

  test('Home / End jump to first / last visible item', () => {
    render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} />);
    const items = screen.getAllByRole('treeitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'End' });
    let updated = screen.getAllByRole('treeitem');
    expect(updated[updated.length - 1]).toHaveFocus();
    fireEvent.keyDown(updated[updated.length - 1], { key: 'Home' });
    updated = screen.getAllByRole('treeitem');
    expect(updated[0]).toHaveFocus();
  });

  test('Enter selects the focused treeitem', () => {
    const onSelect = jest.fn();
    render(<TreeView label="Files" nodes={nodes} onSelect={onSelect} />);
    const items = screen.getAllByRole('treeitem');
    items[0].focus();
    fireEvent.keyDown(items[0], { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('a');
  });
  describe('type-ahead (#155)', () => {
    const files = [
      { id: 'docs', label: 'Documents', children: [{ id: 'cv', label: 'CV.pdf' }] },
      { id: 'music', label: 'Music' },
      { id: 'pics', label: 'Pictures' },
    ];
    const node = (id) => document.querySelector(`[data-itemid="${id}"]`);

    test('typing a character moves focus to the next matching node', () => {
      render(<TreeView label="Files" nodes={files} />);
      act(() => node('docs').focus());

      fireEvent.keyDown(node('docs'), { key: 'm' });

      expect(document.activeElement).toBe(node('music'));
    });

    test('the search wraps', () => {
      render(<TreeView label="Files" nodes={files} />);
      act(() => node('pics').focus());

      fireEvent.keyDown(node('pics'), { key: 'd' });

      expect(document.activeElement).toBe(node('docs'));
    });

    test('only visible nodes are targets', () => {
      render(<TreeView label="Files" nodes={files} />);
      act(() => node('docs').focus());

      // CV.pdf is inside a collapsed subtree, so "c" must find nothing.
      fireEvent.keyDown(node('docs'), { key: 'c' });

      expect(document.activeElement).toBe(node('docs'));
    });

    test('nodes in an expanded subtree become targets', () => {
      render(<TreeView label="Files" nodes={files} defaultExpanded={['docs']} />);
      act(() => node('docs').focus());

      fireEvent.keyDown(node('docs'), { key: 'c' });

      expect(document.activeElement).toBe(node('cv'));
    });

    test('Enter and Space still select rather than typing ahead', () => {
      const onSelect = jest.fn();
      render(<TreeView label="Files" nodes={files} onSelect={onSelect} />);
      act(() => node('music').focus());

      fireEvent.keyDown(node('music'), { key: ' ' });

      expect(onSelect).toHaveBeenCalledWith('music');
    });
  });
});
