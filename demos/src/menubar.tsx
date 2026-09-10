import React from 'react';
import Menubar from '../../components/Menubar/Menubar';
import { mount } from './mount';

const menus = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New' },
      { id: 'open', label: 'Open' },
      { id: 'save', label: 'Save' },
      { id: 'save-as', label: 'Save As', disabled: true },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo' },
      { id: 'redo', label: 'Redo' },
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'zoom-in', label: 'Zoom in' },
      { id: 'zoom-out', label: 'Zoom out' },
    ],
  },
];

/**
 * Menubar demo: File/Edit/View menus with item labels matching apg-qa's
 * menubar use cases.
 *
 * File > Save As is aria-disabled: arrow keys, Home/End and type-ahead still
 * reach it -- APG keeps a disabled menuitem in the menu and in the roving
 * tabindex so it stays discoverable -- but activating it does nothing, by
 * Enter, Space or click, and the submenu stays open.
 *
 * It goes on this page rather than a per-state page of its own because it is
 * the last File item and disabled items stay focusable, so every existing
 * menubar case that walks or wraps through the File submenu is unaffected.
 *
 * Addressed by `apg-qa` as `menubar-error`.
 */
function MenubarDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Menubar</h1>
      <Menubar label="Main" menus={menus} />
    </main>
  );
}

mount(<MenubarDemo />);
