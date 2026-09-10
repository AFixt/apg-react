/**
 * LayoutGrid — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * The *layout* grid variant, as distinct from `Grid`, which is a data grid.
 * The APG separates them by content: a data grid "presents tabular information
 * that has column titles, row titles, or both", while a layout grid holds "a
 * single, logically homogenous set of elements" and "does not necessarily have
 * header cells for labelling rows or columns". This one arranges links.
 *
 * The distinction is not cosmetic — the two variants have different keyboard
 * contracts, and this component exists so the difference is testable:
 *
 *   Required here   Arrow keys, Home, End
 *   Optional here   Page Up, Page Down, Control+Home, Control+End, and
 *                   arrow-key wrapping at row and column edges
 *
 * `Control+Home` / `Control+End` are *required* for a data grid and *optional*
 * for a layout grid, which is the sharpest example of why the variant matters.
 * All the optional behaviours are implemented, so a conformance suite can
 * exercise them — and skip them when pointed at an implementation that offers
 * only the required set.
 *
 * ARIA model:
 *   - role="grid" on the container, named via aria-label or aria-labelledby.
 *   - role="row" per row; role="gridcell" per cell.
 *   - No columnheader: a layout grid has no column titles to expose.
 *   - Roving tabindex on the *link inside* each cell, not the cell. The APG
 *     allows this where a cell holds a single widget, and it keeps the link
 *     operable by Enter without the grid intercepting it.
 */
import React, { useRef, useState } from 'react';
import './LayoutGrid.css';

/** A single navigable item in a LayoutGrid. */
interface LayoutGridItem {
  /** Link text, and the item's accessible name. */
  label: string;
  /** Link target. */
  href: string;
}

/** Props for the LayoutGrid component. */
interface LayoutGridProps {
  /** Accessible name for the grid. Used as `aria-label` unless `labelledBy` is given. */
  label?: string;
  /** Id of an existing visible element that names the grid. Takes precedence over `label`. */
  labelledBy?: string;
  /** Items laid out in row-major order. */
  items: LayoutGridItem[];
  /** Cells per row. Default: 3. */
  columns?: number;
  /** Rows moved by Page Up / Page Down. Default: 2. */
  pageSize?: number;
  /** Prefix for generated ids. Default: 'layout-grid'. */
  idPrefix?: string;
}

const LayoutGrid: React.FC<LayoutGridProps> = ({
  label,
  labelledBy,
  items,
  columns = 3,
  pageSize = 2,
  idPrefix = 'layout-grid',
}) => {
  const rows: LayoutGridItem[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  const rowCount = rows.length;

  const [pos, setPos] = useState({ row: 0, col: 0 });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const cellsIn = (r: number) => (rows[r] ? rows[r].length : 0);

  const focusCell = (row: number, col: number) => {
    setPos({ row, col });
    linkRefs.current[`${row}:${col}`]?.focus();
  };

  /**
   * Move by one cell, wrapping at the edges.
   *
   * Wrapping is the APG's optional half — "Optionally, if focus is on the
   * right-most cell in the row, focus may move to the first cell in the
   * following row". Implemented so the behaviour can be asserted; an
   * implementation that stops at the edge conforms just as well.
   */
  const step = (row: number, col: number, dRow: number, dCol: number) => {
    if (dCol === 1) {
      if (col + 1 < cellsIn(row)) return focusCell(row, col + 1);
      const nextRow = (row + 1) % rowCount;
      return focusCell(nextRow, 0);
    }
    if (dCol === -1) {
      if (col - 1 >= 0) return focusCell(row, col - 1);
      const prevRow = (row - 1 + rowCount) % rowCount;
      return focusCell(prevRow, cellsIn(prevRow) - 1);
    }
    if (dRow === 1) {
      const nextRow = row + 1;
      if (nextRow < rowCount && col < cellsIn(nextRow)) return focusCell(nextRow, col);
      const wrapCol = (col + 1) % columns;
      return focusCell(0, Math.min(wrapCol, cellsIn(0) - 1));
    }
    const prevRow = row - 1;
    if (prevRow >= 0 && col < cellsIn(prevRow)) return focusCell(prevRow, col);
    const lastRow = rowCount - 1;
    const wrapCol = (col - 1 + columns) % columns;
    return focusCell(lastRow, Math.min(wrapCol, cellsIn(lastRow) - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, r: number, c: number) => {
    const ctrl = e.ctrlKey || e.metaKey;
    let handled = true;
    switch (e.key) {
      case 'ArrowRight':
        step(r, c, 0, 1);
        break;
      case 'ArrowLeft':
        step(r, c, 0, -1);
        break;
      case 'ArrowDown':
        step(r, c, 1, 0);
        break;
      case 'ArrowUp':
        step(r, c, -1, 0);
        break;
      case 'Home':
        // Ctrl+Home is the optional whole-grid jump; bare Home is required and
        // stays within the row.
        if (ctrl) focusCell(0, 0);
        else focusCell(r, 0);
        break;
      case 'End':
        if (ctrl) focusCell(rowCount - 1, cellsIn(rowCount - 1) - 1);
        else focusCell(r, cellsIn(r) - 1);
        break;
      case 'PageDown': {
        const target = Math.min(r + pageSize, rowCount - 1);
        focusCell(target, Math.min(c, cellsIn(target) - 1));
        break;
      }
      case 'PageUp': {
        const target = Math.max(r - pageSize, 0);
        focusCell(target, Math.min(c, cellsIn(target) - 1));
        break;
      }
      default:
        handled = false;
    }
    // Enter is deliberately not handled: the cell holds a real link, and
    // swallowing Enter would break activating it.
    if (handled) e.preventDefault();
  };

  return (
    <div
      role="grid"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      aria-rowcount={rowCount}
      aria-colcount={columns}
      className="layout-grid"
    >
      {rows.map((row, r) => (
        <div
          key={row[0]?.href ?? `row-${r + 1}`}
          role="row"
          aria-rowindex={r + 1}
          className="layout-grid-row"
        >
          {row.map((item, c) => (
            <div key={item.href} role="gridcell" aria-colindex={c + 1} className="layout-grid-cell">
              <a
                ref={(el) => {
                  linkRefs.current[`${r}:${c}`] = el;
                }}
                id={`${idPrefix}-link-${r}-${c}`}
                href={item.href}
                className="layout-grid-link"
                tabIndex={r === pos.row && c === pos.col ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                onFocus={() => setPos({ row: r, col: c })}
              >
                {item.label}
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Grid pattern, layout variant. See the top-of-file comment for keyboard and ARIA details. */
export default LayoutGrid;
