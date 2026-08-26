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
  // --- Regression coverage -------------------------------------------------

  describe('nested nodes own their own events (#154)', () => {
    // Child treeitems render inside their parent treeitem, so every keystroke
    // and focus event on a nested node bubbles through each ancestor. These
    // tests dispatch on the *child* element deliberately: dispatching on the
    // tree root, or on a root-level node, never reproduces the defect -- which
    // is why root-level navigation looked fine while subtrees were unusable.
    const item = (id) => document.querySelector(`[data-itemid="${id}"]`);

    // A bare `.focus()` is not act-wrapped, so the resulting state update would
    // not be flushed before the assertion. `.focus()` rather than
    // `fireEvent.focus` is what fires focusin, which is the event that bubbles
    // and the one this defect rides on.
    const focusItem = (id) => act(() => item(id).focus());

    const renderOpen = (props = {}) =>
      render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a']} {...props} />);

    test('the roving tabindex follows focus into a child node', () => {
      renderOpen();

      focusItem('a1');

      expect(item('a1')).toHaveAttribute('tabindex', '0');
      expect(item('a')).toHaveAttribute('tabindex', '-1');
    });

    test('Down Arrow on a child moves to the next visible node', () => {
      renderOpen();

      focusItem('a1');
      fireEvent.keyDown(item('a1'), { key: 'ArrowDown' });

      expect(document.activeElement).toBe(item('a2'));
      expect(item('a2')).toHaveAttribute('tabindex', '0');
    });

    test('Up Arrow on a child moves to the previous visible node', () => {
      renderOpen();

      focusItem('a2');
      fireEvent.keyDown(item('a2'), { key: 'ArrowUp' });

      expect(document.activeElement).toBe(item('a1'));
    });

    test('Left Arrow on a child moves focus to its parent without closing it', () => {
      renderOpen();

      focusItem('a1');
      fireEvent.keyDown(item('a1'), { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(item('a'));
      // The APG is explicit that Left Arrow on a child moves to the parent
      // *without* closing it. The subtree must not be yanked out from under
      // the user.
      expect(item('a')).toHaveAttribute('aria-expanded', 'true');
    });

    test('End on a child reaches the last visible node', () => {
      renderOpen();

      focusItem('a1');
      fireEvent.keyDown(item('a1'), { key: 'End' });

      expect(document.activeElement).toBe(item('b'));
    });

    test('Enter on a child selects only that child', () => {
      const onSelect = jest.fn();
      renderOpen({ onSelect });

      focusItem('a1');
      fireEvent.keyDown(item('a1'), { key: 'Enter' });

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith('a1');
      expect(item('a')).toHaveAttribute('aria-expanded', 'true');
      expect(item('a1')).toHaveAttribute('aria-selected', 'true');
    });

    test('a grandchild is navigable too', () => {
      render(<TreeView label="Files" nodes={nodes} defaultExpanded={['a', 'a2']} />);

      focusItem('a2a');
      expect(item('a2a')).toHaveAttribute('tabindex', '0');

      fireEvent.keyDown(item('a2a'), { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(item('a2'));
      expect(item('a2')).toHaveAttribute('aria-expanded', 'true');
      expect(item('a')).toHaveAttribute('aria-expanded', 'true');
    });

    test('root-level navigation is unchanged', () => {
      renderOpen();

      focusItem('a');
      fireEvent.keyDown(item('a'), { key: 'ArrowDown' });
      expect(document.activeElement).toBe(item('a1'));

      fireEvent.keyDown(item('a1'), { key: 'ArrowUp' });
      expect(document.activeElement).toBe(item('a'));

      fireEvent.keyDown(item('a'), { key: 'ArrowLeft' });
      expect(item('a')).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
