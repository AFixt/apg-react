/**
 * Toolbar — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 *
 * Keyboard model:
 *   - Tab: into toolbar lands on the roving item; Tab out exits.
 *   - Arrow Left / Right (or Up / Down for vertical): move among items.
 *   - Home / End: first / last item.
 *   - Disabled items are skipped.
 */
import React, { Children, cloneElement, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Toolbar.css";

const Toolbar = ({ label, ariaLabelledby, orientation, children }) => {
    const items = Children.toArray(children).filter(Boolean);
    const itemRefs = useRef([]);
    const [focusIndex, setFocusIndex] = useState(() =>
        items.findIndex((c) => !c.props?.disabled) >= 0
            ? items.findIndex((c) => !c.props?.disabled)
            : 0
    );

    const focusable = (i) => {
        const el = itemRefs.current[i];
        return !!el && !el.disabled && !el.getAttribute?.("aria-disabled");
    };

    const findNext = (from, dir) => {
        const n = items.length;
        for (let i = 1; i <= n; i++) {
            const idx = (from + dir * i + n) % n;
            if (focusable(idx)) return idx;
        }
        return from;
    };

    const moveTo = (i) => {
        setFocusIndex(i);
        itemRefs.current[i]?.focus();
    };

    const handleKeyDown = (e, i) => {
        const isHorizontal = orientation !== "vertical";
        const next = isHorizontal ? "ArrowRight" : "ArrowDown";
        const prev = isHorizontal ? "ArrowLeft" : "ArrowUp";
        let handled = true;
        switch (e.key) {
            case next:
                moveTo(findNext(i, 1));
                break;
            case prev:
                moveTo(findNext(i, -1));
                break;
            case "Home":
                moveTo(findNext(-1, 1));
                break;
            case "End":
                moveTo(findNext(items.length, -1));
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    return (
        <div
            role="toolbar"
            aria-label={ariaLabelledby ? undefined : label}
            aria-labelledby={ariaLabelledby}
            aria-orientation={orientation || "horizontal"}
            className={`toolbar toolbar-${orientation || "horizontal"}`}
        >
            {items.map((child, i) =>
                cloneElement(child, {
                    key: child.key ?? i,
                    ref: (el) => (itemRefs.current[i] = el),
                    tabIndex: i === focusIndex ? 0 : -1,
                    onKeyDown: (e) => {
                        child.props.onKeyDown?.(e);
                        if (!e.defaultPrevented) handleKeyDown(e, i);
                    },
                    onFocus: (e) => {
                        child.props.onFocus?.(e);
                        setFocusIndex(i);
                    },
                })
            )}
        </div>
    );
};

Toolbar.propTypes = {
    label: PropTypes.string,
    ariaLabelledby: PropTypes.string,
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    children: PropTypes.node.isRequired,
};

export default Toolbar;
