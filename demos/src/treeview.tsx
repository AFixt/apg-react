import React from 'react';
import TreeView from '../../components/TreeView/TreeView';
import { mount } from './mount';

const nodes = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'resume', label: 'Resume.pdf' },
      { id: 'cover-letter', label: 'CoverLetter.pdf' },
    ],
  },
  {
    id: 'pictures',
    label: 'Pictures',
    children: [
      { id: 'holiday', label: 'Holiday.jpg' },
      {
        id: 'screenshots',
        label: 'Screenshots',
        children: [{ id: 'shot-1', label: 'Shot1.png' }],
      },
    ],
  },
  { id: 'notes', label: 'Notes.txt' },
];

/**
 * Tree view demo: a file browser, every node collapsed on load.
 *
 * Collapsed-on-load matters: it is the only starting state from which
 * `aria-expanded` can be observed changing in both directions, and it makes the
 * nested `aria-level` / `aria-posinset` values appear as a result of the user's
 * own keystrokes rather than being present from the start.
 */
function TreeViewDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Tree View</h1>
      <TreeView label="File Browser" nodes={nodes} />
    </main>
  );
}

mount(<TreeViewDemo />);
