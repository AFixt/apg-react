/**
 * TreeGrid — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 *
 * A grid whose rows can be expanded/collapsed like a tree. Each row has
 * aria-level, aria-expanded (when it has children), aria-posinset, aria-setsize.
 * Cells live in a roving-tabindex model.
 *
 * Keyboard:
 *   - Arrow Up/Down: move focus among visible rows (stays in same column).
 *   - Arrow Right: on a collapsed row's first cell -> expand.
 *                 on an expanded row's first cell -> move focus to first child row.
 *                 elsewhere -> next cell in row.
 *   - Arrow Left: on an expanded row's first cell -> collapse.
 *                on a collapsed first cell -> focus parent row.
 *                elsewhere -> previous cell in row.
 *   - Home / End: first / last cell in row.
 *   - Ctrl+Home / Ctrl+End: first / last row (first column).
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./TreeGrid.css";

const flatten = (rows, expanded, level = 1, parentId = null, acc = []) => {
    rows.forEach((r, i) => {
        acc.push({
            ...r,
            level,
            parentId,
            posinset: i + 1,
            setsize: rows.length,
            hasChildren: !!r.children?.length,
        });
        if (r.children?.length && expanded.has(r.id)) {
            flatten(r.children, expanded, level + 1, r.id, acc);
        }
    });
    return acc;
};

const TreeGrid = ({ label, columns, rows, defaultExpanded }) => {
    const [expanded, setExpanded] = useState(
        () => new Set(defaultExpanded ?? [])
    );
    const [focus, setFocus] = useState({ row: 0, col: 0 });
    const shouldFocusRef = useRef(false);
    const cellRefs = useRef({});

    useEffect(() => {
        if (shouldFocusRef.current) {
            shouldFocusRef.current = false;
            cellRefs.current[`${focus.row}:${focus.col}`]?.focus();
        }
    }, [focus]);

    const visible = useMemo(() => flatten(rows, expanded), [rows, expanded]);
    const totalCols = columns.length;

    const focusCell = (r, c) => {
        const rr = Math.max(0, Math.min(visible.length - 1, r));
        const cc = Math.max(0, Math.min(totalCols - 1, c));
        shouldFocusRef.current = true;
        setFocus({ row: rr, col: cc });
    };

    const toggle = (id, open) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (open === true) next.add(id);
            else if (open === false) next.delete(id);
            else next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleKeyDown = (e) => {
        // Read position from the event target so we don't depend on a
        // possibly-stale `focus` state (especially when the cell gained focus
        // via a raw DOM .focus() call outside of React's event system).
        const ds = e.currentTarget.dataset;
        const curR = Number(ds.row);
        const curC = Number(ds.col);
        const row = visible[curR];
        if (!row) return;
        const isFirstCol = curC === 0;
        let handled = true;
        switch (e.key) {
            case "ArrowDown":
                focusCell(curR + 1, curC);
                break;
            case "ArrowUp":
                focusCell(curR - 1, curC);
                break;
            case "ArrowRight":
                if (isFirstCol && row.hasChildren && !expanded.has(row.id)) {
                    toggle(row.id, true);
                } else if (
                    isFirstCol &&
                    row.hasChildren &&
                    expanded.has(row.id)
                ) {
                    focusCell(curR + 1, 0);
                } else {
                    focusCell(curR, curC + 1);
                }
                break;
            case "ArrowLeft":
                if (isFirstCol && row.hasChildren && expanded.has(row.id)) {
                    toggle(row.id, false);
                } else if (isFirstCol && row.parentId) {
                    const parentIdx = visible.findIndex(
                        (v) => v.id === row.parentId
                    );
                    if (parentIdx >= 0) focusCell(parentIdx, 0);
                } else {
                    focusCell(curR, curC - 1);
                }
                break;
            case "Home":
                if (e.ctrlKey || e.metaKey) focusCell(0, 0);
                else focusCell(curR, 0);
                break;
            case "End":
                if (e.ctrlKey || e.metaKey)
                    focusCell(visible.length - 1, totalCols - 1);
                else focusCell(curR, totalCols - 1);
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    return (
        <div
            role="treegrid"
            aria-label={label}
            aria-rowcount={visible.length + 1}
            aria-colcount={totalCols}
            className="treegrid"
        >
            <div role="row" aria-rowindex={1} className="treegrid-row treegrid-header-row">
                {columns.map((col, c) => (
                    <div
                        key={col.key}
                        role="columnheader"
                        aria-colindex={c + 1}
                        className="treegrid-cell treegrid-columnheader"
                    >
                        {col.label}
                    </div>
                ))}
            </div>
            {visible.map((row, r) => {
                const isExpanded = expanded.has(row.id);
                return (
                    <div
                        key={row.id}
                        role="row"
                        aria-level={row.level}
                        aria-posinset={row.posinset}
                        aria-setsize={row.setsize}
                        aria-expanded={row.hasChildren ? isExpanded : undefined}
                        aria-rowindex={r + 2}
                        className="treegrid-row"
                    >
                        {columns.map((col, c) => {
                            const tabIndex =
                                r === focus.row && c === focus.col ? 0 : -1;
                            const isFirst = c === 0;
                            return (
                                <div
                                    key={col.key}
                                    ref={(el) =>
                                        (cellRefs.current[`${r}:${c}`] = el)
                                    }
                                    role="gridcell"
                                    aria-colindex={c + 1}
                                    data-row={r}
                                    data-col={c}
                                    tabIndex={tabIndex}
                                    className="treegrid-cell"
                                    style={
                                        isFirst
                                            ? {
                                                  paddingLeft: `calc(${row.level - 1} * 1.25rem + ${row.hasChildren ? "0.25rem" : "1.25rem"})`,
                                              }
                                            : undefined
                                    }
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setFocus({ row: r, col: c })}
                                    onClick={() => {
                                        setFocus({ row: r, col: c });
                                        if (isFirst && row.hasChildren) toggle(row.id);
                                    }}
                                >
                                    {isFirst && row.hasChildren && (
                                        <span
                                            aria-hidden="true"
                                            className="treegrid-chevron"
                                        >
                                            {isExpanded ? "▾" : "▸"}
                                        </span>
                                    )}
                                    {row[col.key]}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

const rowShape = {
    id: PropTypes.string.isRequired,
};

TreeGrid.propTypes = {
    label: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.node.isRequired,
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape(rowShape)).isRequired,
    defaultExpanded: PropTypes.arrayOf(PropTypes.string),
};

export default TreeGrid;
