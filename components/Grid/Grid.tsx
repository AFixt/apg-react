/**
 * Grid — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * Implements a data grid with:
 *   - role="grid" on the container; aria-rowcount / aria-colcount.
 *   - role="row" for each row; aria-rowindex.
 *   - role="columnheader" / role="gridcell" for cells; aria-colindex.
 *   - Roving tabindex: one cell is 0, others -1.
 *
 * Keyboard model:
 *   - Arrow keys: move focus among cells.
 *   - Home / End: first / last cell in row.
 *   - Ctrl+Home / Ctrl+End: first / last cell in grid.
 *   - PageUp / PageDown: jump ±5 rows.
 */
import React, { useRef, useState } from 'react';
import './Grid.css';

interface GridColumn {
  key: string;
  label: React.ReactNode;
}

interface GridProps {
  /** The accessible name for the grid. When `showCaption` is true this also
   *  renders as a visible caption above the grid and is referenced via
   *  `aria-labelledby` (preferred). Otherwise it's applied as `aria-label`. */
  label: string;
  /** When true, `label` is rendered as a visible caption element above the
   *  grid and the grid references it via `aria-labelledby`. Default: false. */
  showCaption?: boolean;
  columns: GridColumn[];
  rows: Record<string, React.ReactNode | string | number>[];
  idPrefix?: string;
}

const Grid: React.FC<GridProps> = ({ label, showCaption = false, columns, rows, idPrefix }) => {
  const totalRows = rows.length;
  const totalCols = columns.length;
  const [focusPos, setFocusPos] = useState({ row: 0, col: 0 });
  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prefix = idPrefix || 'grid';
  const captionId = `${prefix}-caption`;

  const moveTo = (row: number, col: number) => {
    const r = Math.max(0, Math.min(totalRows, row));
    const c = Math.max(0, Math.min(totalCols - 1, col));
    setFocusPos({ row: r, col: c });
    cellRefs.current[`${r}:${c}`]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, r: number, c: number) => {
    let handled = true;
    switch (e.key) {
      case 'ArrowRight':
        moveTo(r, c + 1);
        break;
      case 'ArrowLeft':
        moveTo(r, c - 1);
        break;
      case 'ArrowDown':
        moveTo(r + 1, c);
        break;
      case 'ArrowUp':
        moveTo(r - 1, c);
        break;
      case 'Home':
        if (e.ctrlKey || e.metaKey) moveTo(0, 0);
        else moveTo(r, 0);
        break;
      case 'End':
        if (e.ctrlKey || e.metaKey) moveTo(totalRows, totalCols - 1);
        else moveTo(r, totalCols - 1);
        break;
      case 'PageDown':
        moveTo(r + 5, c);
        break;
      case 'PageUp':
        moveTo(r - 5, c);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  };

  const cellTabIndex = (r: number, c: number) =>
    r === focusPos.row && c === focusPos.col ? 0 : -1;

  return (
    <div className="grid-wrapper">
      {showCaption && (
        <div id={captionId} className="grid-caption">
          {label}
        </div>
      )}
      <div
        role="grid"
        aria-label={showCaption ? undefined : label}
        aria-labelledby={showCaption ? captionId : undefined}
        aria-rowcount={totalRows + 1}
        aria-colcount={totalCols}
        className="grid"
      >
        <div role="row" aria-rowindex={1} className="grid-row grid-header-row">
          {columns.map((col, c) => (
            <div
              key={col.key}
              ref={(el) => (cellRefs.current[`0:${c}`] = el)}
              id={`${prefix}-head-${c}`}
              role="columnheader"
              aria-colindex={c + 1}
              className="grid-cell grid-columnheader"
              tabIndex={cellTabIndex(0, c)}
              onKeyDown={(e) => handleKeyDown(e, 0, c)}
              onFocus={() => setFocusPos({ row: 0, col: c })}
            >
              {col.label}
            </div>
          ))}
        </div>
        {rows.map((row, rIdx) => {
          const r = rIdx + 1;
          return (
            <div
              key={(row.id as string) ?? rIdx}
              role="row"
              aria-rowindex={r + 1}
              className="grid-row"
            >
              {columns.map((col, c) => (
                <div
                  key={col.key}
                  ref={(el) => (cellRefs.current[`${r}:${c}`] = el)}
                  role="gridcell"
                  aria-colindex={c + 1}
                  className="grid-cell"
                  tabIndex={cellTabIndex(r, c)}
                  onKeyDown={(e) => handleKeyDown(e, r, c)}
                  onFocus={() => setFocusPos({ row: r, col: c })}
                >
                  {row[col.key]}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
