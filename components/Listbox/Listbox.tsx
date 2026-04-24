/**
 * Listbox — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 *
 * Keyboard model (single-select):
 *   - Arrow Up/Down: move focus and selection.
 *   - Home / End: first / last option.
 *   - Enter / Space: no-op (focus already selects).
 *
 * Keyboard model (multi-select):
 *   - Arrow Up/Down: move focus only.
 *   - Space: toggle selection of focused option.
 *   - Shift + Arrow: extend range selection.
 *   - Home / End: move focus.
 *   - Ctrl/Cmd + A: select all.
 */
import React, { useMemo, useRef, useState } from "react";
import "./Listbox.css";

interface ListboxOption {
    value: string;
    label: React.ReactNode;
}

interface ListboxProps {
    options: ListboxOption[];
    value?: string | string[];
    onChange?: (next: string | string[]) => void;
    multiple?: boolean;
    label?: string;
    labelId?: string;
}

const Listbox: React.FC<ListboxProps> = ({
    options,
    value,
    onChange,
    multiple,
    label,
    labelId,
}) => {
    const [focusIndex, setFocusIndex] = useState(() => {
        if (multiple) return 0;
        const i = options.findIndex((o) => o.value === value);
        return i >= 0 ? i : 0;
    });
    const listRef = useRef<HTMLUListElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
    const groupLabelId = labelId || "listbox-label";

    const selectedSet = useMemo(() => {
        if (multiple) return new Set(Array.isArray(value) ? value : []);
        return new Set(value !== undefined && value !== null ? [value as string] : []);
    }, [value, multiple]);

    const commitSingle = (i: number) => {
        const opt = options[i];
        if (!opt) return;
        onChange?.(opt.value);
    };

    const toggleMulti = (i: number) => {
        const opt = options[i];
        if (!opt) return;
        const next = new Set(selectedSet);
        const v = opt.value;
        if (next.has(v)) next.delete(v);
        else next.add(v);
        onChange?.(Array.from(next));
    };

    const selectRange = (from: number, to: number) => {
        const [a, b] = from <= to ? [from, to] : [to, from];
        const next = new Set(selectedSet);
        for (let i = a; i <= b; i++) {
            const opt = options[i];
            if (opt) next.add(opt.value);
        }
        onChange?.(Array.from(next));
    };

    const moveFocus = (i: number, { extend }: { extend?: boolean } = {}) => {
        const clamped = Math.max(0, Math.min(options.length - 1, i));
        const prev = focusIndex;
        setFocusIndex(clamped);
        optionRefs.current[clamped]?.focus();
        if (!multiple) {
            commitSingle(clamped);
        } else if (extend) {
            selectRange(prev, clamped);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, i: number) => {
        let handled = true;
        switch (e.key) {
            case "ArrowDown":
                moveFocus(i + 1, { extend: Boolean(multiple && e.shiftKey) });
                break;
            case "ArrowUp":
                moveFocus(i - 1, { extend: Boolean(multiple && e.shiftKey) });
                break;
            case "Home":
                moveFocus(0, { extend: Boolean(multiple && e.shiftKey) });
                break;
            case "End":
                moveFocus(options.length - 1, { extend: Boolean(multiple && e.shiftKey) });
                break;
            case " ":
                if (multiple) toggleMulti(i);
                break;
            case "a":
            case "A":
                if (multiple && (e.ctrlKey || e.metaKey)) {
                    onChange?.(options.map((o) => o.value));
                } else {
                    handled = false;
                }
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    return (
        <div className="listbox-container">
            {label && <div id={groupLabelId} className="listbox-label">{label}</div>}
            <ul
                ref={listRef}
                role="listbox"
                aria-labelledby={label ? groupLabelId : undefined}
                aria-multiselectable={multiple || undefined}
                className="listbox"
                tabIndex={-1}
            >
                {options.map((opt, i) => {
                    const selected = selectedSet.has(opt.value);
                    return (
                        <li
                            key={opt.value}
                            ref={(el) => (optionRefs.current[i] = el)}
                            role="option"
                            aria-selected={selected}
                            className={`listbox-option${selected ? " is-selected" : ""}${
                                i === focusIndex ? " is-focused" : ""
                            }`}
                            tabIndex={i === focusIndex ? 0 : -1}
                            onClick={(e) => {
                                setFocusIndex(i);
                                optionRefs.current[i]?.focus();
                                if (multiple) {
                                    if (e.shiftKey) selectRange(focusIndex, i);
                                    else toggleMulti(i);
                                } else {
                                    commitSingle(i);
                                }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                        >
                            {opt.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Listbox;
