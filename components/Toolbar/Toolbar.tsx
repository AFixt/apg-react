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
import "./Toolbar.css";

interface ToolbarProps {
    label?: string;
    ariaLabelledby?: string;
    orientation?: "horizontal" | "vertical";
    children: React.ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({ label, ariaLabelledby, orientation, children }) => {
    const items = Children.toArray(children).filter(Boolean);
    const itemRefs = useRef<(HTMLElement | null)[]>([]);
    const [focusIndex, setFocusIndex] = useState(() =>
        items.findIndex((c) => !(c as React.ReactElement<any>).props?.disabled) >= 0
            ? items.findIndex((c) => !(c as React.ReactElement<any>).props?.disabled)
            : 0
    );

    const focusable = (i: number) => {
        const el = itemRefs.current[i];
        return !!el && !(el as HTMLButtonElement).disabled && !el.getAttribute?.("aria-disabled");
    };

    const findNext = (from: number, dir: number) => {
        const n = items.length;
        for (let i = 1; i <= n; i++) {
            const idx = (from + dir * i + n) % n;
            if (focusable(idx)) return idx;
        }
        return from;
    };

    const moveTo = (i: number) => {
        setFocusIndex(i);
        itemRefs.current[i]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
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
                cloneElement(child as React.ReactElement<any>, {
                    key: (child as React.ReactElement<any>).key ?? i,
                    ref: (el: HTMLElement | null) => (itemRefs.current[i] = el),
                    tabIndex: i === focusIndex ? 0 : -1,
                    onKeyDown: (e: React.KeyboardEvent) => {
                        (child as React.ReactElement<any>).props.onKeyDown?.(e);
                        if (!e.defaultPrevented) handleKeyDown(e, i);
                    },
                    onFocus: (e: React.FocusEvent) => {
                        (child as React.ReactElement<any>).props.onFocus?.(e);
                        setFocusIndex(i);
                    },
                })
            )}
        </div>
    );
};

export default Toolbar;
