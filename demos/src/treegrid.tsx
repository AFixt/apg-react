import React from 'react';
import TreeGrid from '../../components/TreeGrid/TreeGrid';
import { mount } from './mount';

const columns = [
  { key: 'task', label: 'Task' },
  { key: 'owner', label: 'Owner' },
  { key: 'status', label: 'Status' },
];

const rows = [
  {
    id: 'phase-1',
    task: 'Phase 1',
    owner: 'Team A',
    status: 'In progress',
    children: [
      { id: 'task-1-1', task: 'Task 1.1', owner: 'Alex', status: 'Done' },
      { id: 'task-1-2', task: 'Task 1.2', owner: 'Priya', status: 'In progress' },
    ],
  },
  {
    id: 'phase-2',
    task: 'Phase 2',
    owner: 'Team B',
    status: 'Not started',
    children: [{ id: 'task-2-1', task: 'Task 2.1', owner: 'Sam', status: 'Not started' }],
  },
];

/**
 * Tree grid demo: a project task list with two collapsible phases, each
 * expanding into its own tasks.
 *
 * Collapsed on load for the same reason the tree view demo is: it is the only
 * starting state from which `aria-expanded` and the child rows' `aria-level`
 * can be observed appearing as a result of the user's own keystrokes.
 */
function TreeGridDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Tree Grid</h1>
      <TreeGrid label="Project Tasks" columns={columns} rows={rows} />
    </main>
  );
}

mount(<TreeGridDemo />);
