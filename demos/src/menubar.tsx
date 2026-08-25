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
      { id: 'save-as', label: 'Save As' },
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
