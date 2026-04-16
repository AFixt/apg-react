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
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Grid.css";

const Grid = ({ caption, columns, rows, label, idPrefix }) => {
    const totalRows = rows.length;
    const totalCols = columns.length;
    const [focusPos, setFocusPos] = useState({ row: 0, col: 0 });
    const cellRefs = useRef({});
    const prefix = idPrefix || "grid";

    const moveTo = (row, col) => {
        const r = Math.max(0, Math.min(totalRows, row));
        const c = Math.max(0, Math.min(totalCols - 1, col));
        setFocusPos({ row: r, col: c });
        cellRefs.current[`${r}:${c}`]?.focus();
    };

    const handleKeyDown = (e, r, c) => {
        let handled = true;
        switch (e.key) {
            case "ArrowRight":
                moveTo(r, c + 1);
                break;
            case "ArrowLeft":
                moveTo(r, c - 1);
                break;
            case "ArrowDown":
                moveTo(r + 1, c);
                break;
            case "ArrowUp":
                moveTo(r - 1, c);
                break;
            case "Home":
                if (e.ctrlKey || e.metaKey) moveTo(0, 0);
                else moveTo(r, 0);
                break;
            case "End":
                if (e.ctrlKey || e.metaKey) moveTo(totalRows, totalCols - 1);
                else moveTo(r, totalCols - 1);
                break;
            case "PageDown":
                moveTo(r + 5, c);
                break;
            case "PageUp":
                moveTo(r - 5, c);
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    const cellTabIndex = (r, c) =>
        r === focusPos.row && c === focusPos.col ? 0 : -1;

    return (
        <div className="grid-wrapper">
            {caption && <div className="grid-caption">{caption}</div>}
            <div
                role="grid"
                aria-label={label}
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
                        key={row.id ?? rIdx}
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

Grid.propTypes = {
    caption: PropTypes.node,
    label: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.node.isRequired,
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    idPrefix: PropTypes.string,
};

export default Grid;
