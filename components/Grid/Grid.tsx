/**
 * Grid — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * Implements a data grid with:
 *   - role="grid" on the container; aria-rowcount / aria-colcount.
 *   - role="row" for each row; aria-rowindex.
 *   - role="columnheader" / role="rowheader" / role="gridcell" for cells;
 *     aria-colindex.
 *   - Roving tabindex: one cell is 0, others -1.
 *
 * Keyboard model (navigation mode):
 *   - Arrow keys: move focus among cells.
 *   - Home / End: first / last cell in row.
 *   - Ctrl+Home / Ctrl+End: first / last cell in grid.
 *   - PageUp / PageDown: jump ±5 rows.
 *   - F2 / Enter: enter edit mode on an editable cell.
 *
 * Keyboard model (edit mode):
 *   - Arrow keys move the caret inside the field rather than between cells.
 *   - Enter commits and returns to navigation mode.
 *   - Escape cancels, restoring the previous value.
 */
import React, { useRef, useState } from 'react';
import './Grid.css';

/** A single column in a Grid. */
interface GridColumn {
  key: string;
  label: React.ReactNode;
  /** Overrides the grid-wide `editable` flag for this column. */
  editable?: boolean;
}

/** Props for the Grid component. */
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
  /**
   * Key of the column that labels each row. That column's cells render
   * role="rowheader" instead of role="gridcell", so a screen reader user
   * navigating the data cells is told which row they are in.
   */
  rowHeaderKey?: string;
  /** Makes every cell editable. A column's own `editable` takes precedence. */
  editable?: boolean;
  /**
   * Notified when an edit is committed. Row index is zero-based over `rows`.
   *
   * Supplying this makes the consumer the owner of the data: the grid reports
   * the new value and renders whatever `rows` says next, exactly as a
   * controlled input does. Omit it and the grid keeps the edit itself. The same
   * uncontrolled-unless-told split the rest of this library uses.
   */
  onCellChange?: (rowIndex: number, columnKey: string, value: string) => void;
}

const Grid: React.FC<GridProps> = ({
  label,
  showCaption = false,
  columns,
  rows,
  idPrefix,
  rowHeaderKey,
  editable = false,
  onCellChange,
}) => {
  const totalRows = rows.length;
  const totalCols = columns.length;
  const [focusPos, setFocusPos] = useState({ row: 0, col: 0 });
  // Edit mode has to be a real state rather than "there is an input in the
  // cell": while editing, the grid's own arrow-key handling must stand down so
  // the caret moves inside the field instead of focus moving between cells.
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);
  const [draft, setDraft] = useState('');
  // Only used when the consumer has not taken ownership via onCellChange. Each
  // edit still remembers the `rows` value it was made against, so a later
  // change to that cell from outside wins rather than being shadowed forever.
  const [edits, setEdits] = useState<Record<string, { base: string; value: string }>>({});
  const isControlled = onCellChange !== undefined;
  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prefix = idPrefix || 'grid';
  const captionId = `${prefix}-caption`;

  /** A row-header cell labels its row; it is not itself editable. */
  const isRowHeader = (c: number) => rowHeaderKey !== undefined && columns[c]?.key === rowHeaderKey;

  const isEditable = (c: number) => !isRowHeader(c) && (columns[c]?.editable ?? editable) === true;

  /** The `rows` value for a cell, as a string, for comparison against an edit. */
  const sourceValue = (r: number, colKey: string) => {
    const value = rows[r - 1]?.[colKey];
    return value === undefined || value === null ? '' : String(value);
  };

  /**
   * The value a data cell currently shows. With `onCellChange` supplied the
   * consumer owns it and `rows` is the only source. Otherwise a local edit is
   * honoured, but only while the underlying `rows` value is unchanged -- once
   * it moves, the prop wins and the edit is discarded.
   */
  const cellValue = (r: number, c: number) => {
    const col = columns[c];
    if (!col) return undefined;
    if (!isControlled) {
      const edit = edits[`${r}:${col.key}`];
      if (edit && edit.base === sourceValue(r, col.key)) return edit.value;
    }
    return rows[r - 1]?.[col.key];
  };

  /**
   * Text of a row's header cell, used to name the edit field. Without it the
   * field is announced as a bare textbox, and the cell text it replaced -- the
   * only thing identifying which cell is being edited -- is gone from the
   * accessibility tree while the input is mounted.
   */
  const rowLabel = (r: number) => {
    if (rowHeaderKey === undefined) return '';
    const value = rows[r - 1]?.[rowHeaderKey];
    return value === undefined || value === null ? '' : String(value);
  };

  /** Column labels are ReactNodes; fall back to the key when one is not text. */
  const columnLabel = (c: number) => {
    const col = columns[c];
    if (!col) return '';
    return typeof col.label === 'string' ? col.label : col.key;
  };

  const startEdit = (r: number, c: number) => {
    const value = cellValue(r, c);
    setDraft(value === undefined || value === null ? '' : String(value));
    setEditing({ row: r, col: c });
  };

  // Escape unmounts the field, which fires its blur. Without this the blur
  // handler would commit the very draft Escape just discarded.
  const cancellingRef = useRef(false);

  const stopEdit = () => {
    const target = editing;
    setEditing(null);
    if (target) cellRefs.current[`${target.row}:${target.col}`]?.focus();
  };

  const cancelEdit = () => {
    cancellingRef.current = true;
    stopEdit();
  };

  const commitEdit = () => {
    if (!editing) return;
    const col = columns[editing.col];
    if (col) {
      if (isControlled) {
        onCellChange(editing.row - 1, col.key, draft);
      } else {
        const base = sourceValue(editing.row, col.key);
        setEdits((prev) => ({ ...prev, [`${editing.row}:${col.key}`]: { base, value: draft } }));
      }
    }
    stopEdit();
  };

  const moveTo = (row: number, col: number) => {
    const r = Math.max(0, Math.min(totalRows, row));
    const c = Math.max(0, Math.min(totalCols - 1, col));
    setFocusPos({ row: r, col: c });
    cellRefs.current[`${r}:${c}`]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, r: number, c: number) => {
    // While a cell is being edited the field owns every key, including the
    // arrows. Its own handler stops propagation, so this is belt and braces.
    if (editing) return;

    let handled = true;
    switch (e.key) {
      case 'F2':
      case 'Enter':
        if (isEditable(c)) startEdit(r, c);
        else handled = false;
        break;
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

  /**
   * Keys typed inside the edit field. Everything is stopped from bubbling so
   * the grid's navigation handler cannot see it -- that is what lets the arrow
   * keys move the caret rather than the focused cell.
   */
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  /** Committing on blur, unless the field is going away because of Escape. */
  const handleEditBlur = () => {
    if (cancellingRef.current) {
      cancellingRef.current = false;
      return;
    }
    commitEdit();
  };

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
              {columns.map((col, c) => {
                const isEditingCell = editing?.row === r && editing?.col === c;
                return (
                  <div
                    key={col.key}
                    ref={(el) => (cellRefs.current[`${r}:${c}`] = el)}
                    role={isRowHeader(c) ? 'rowheader' : 'gridcell'}
                    aria-colindex={c + 1}
                    className={`grid-cell${isRowHeader(c) ? ' grid-rowheader' : ''}`}
                    tabIndex={cellTabIndex(r, c)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    onFocus={() => setFocusPos({ row: r, col: c })}
                    onDoubleClick={() => isEditable(c) && startEdit(r, c)}
                  >
                    {isEditingCell ? (
                      <input
                        // Entering edit mode has to move focus into the field:
                        // the cell it replaced is gone, so leaving focus behind
                        // would strand a keyboard user on nothing.
                        autoFocus
                        type="text"
                        className="grid-cell-input"
                        aria-label={`${columnLabel(c)} ${rowLabel(r)}`.trim()}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={handleEditBlur}
                      />
                    ) : (
                      cellValue(r, c)
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG Grid pattern. See the top-of-file comment for keyboard and ARIA details. */
export default Grid;
