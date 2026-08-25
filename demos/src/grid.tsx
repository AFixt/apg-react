import React from 'react';
import Grid from '../../components/Grid/Grid';
import { mount } from './mount';

const columns = [
  { key: 'q1', label: 'Q1' },
  { key: 'q2', label: 'Q2' },
  { key: 'q3', label: 'Q3' },
  { key: 'q4', label: 'Q4' },
];

const rows = [
  { id: 'revenue', q1: 100, q2: 200, q3: 300, q4: 400 },
  { id: 'costs', q1: 60, q2: 70, q3: 80, q4: 90 },
  { id: 'profit', q1: 40, q2: 130, q3: 220, q4: 310 },
];

/**
 * Grid demo: a "Quarterly Report" data grid with a visible caption, four
 * quarter columns, and three metric rows, wide enough to exercise every
 * direction of cell-to-cell navigation.
 */
function GridDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Grid</h1>
      <Grid
        label="Quarterly Report"
        showCaption
        columns={columns}
        rows={rows}
        idPrefix="quarterly-report"
      />
    </main>
  );
}

mount(<GridDemo />);
