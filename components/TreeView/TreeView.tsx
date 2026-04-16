/**
 * TreeView — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * Structure:
 *   <ul role="tree">
 *     <li role="treeitem" aria-expanded="false" aria-level="1" aria-setsize aria-posinset>
 *       <span>Label</span>
 *       <ul role="group"> ...nested treeitems... </ul>
 *     </li>
 *   </ul>
 *
 * Keyboard (single-select):
 *   - ArrowDown / ArrowUp: next/prev visible treeitem.
 *   - ArrowRight: closed parent -> opens; open parent -> focus first child; leaf -> no-op.
 *   - ArrowLeft: open parent -> closes; closed/leaf -> focus parent.
 *   - Home / End: first / last visible.
 *   - Enter / Space: select / toggle.
 */
import React, { useMemo, useRef, useState } from "react";
import "./TreeView.css";

interface TreeNode {
    id: string;
    label: React.ReactNode;
    children?: TreeNode[];
}

interface TreeViewProps {
    label: string;
    nodes: TreeNode[];
    onSelect?: (id: string) => void;
    defaultExpanded?: string[];
}

interface FlatEntry {
    id: string;
    label: React.ReactNode;
    level: number;
    parentId: string | null;
    hasChildren: boolean;
    posinset: number;
    setsize: number;
    node: TreeNode;
}

/**
 * Nodes: [{ id, label, children?: nodes[] }]
 */
const flattenVisible = (nodes: TreeNode[], expanded: Set<string>, level = 1, parentId: string | null = null, acc: FlatEntry[] = []): FlatEntry[] => {
    nodes.forEach((n, i) => {
        const entry: FlatEntry = {
            id: n.id,
            label: n.label,
            level,
            parentId,
            hasChildren: !!n.children?.length,
            posinset: i + 1,
            setsize: nodes.length,
            node: n,
        };
        acc.push(entry);
        if (n.children?.length && expanded.has(n.id)) {
            flattenVisible(n.children, expanded, level + 1, n.id, acc);
        }
    });
    return acc;
};

const TreeView: React.FC<TreeViewProps> = ({ label, nodes, onSelect, defaultExpanded }) => {
    const [expanded, setExpanded] = useState(
        () => new Set(defaultExpanded ?? [])
    );
    const [selected, setSelected] = useState<string | null>(null);
    const [focusId, setFocusId] = useState<string | undefined>(() => nodes[0]?.id);
    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

    const visible = useMemo(
        () => flattenVisible(nodes, expanded),
        [nodes, expanded]
    );

    const focusIndex = visible.findIndex((v) => v.id === focusId);
    const currentEntry = visible[focusIndex];

    const focusAt = (i: number) => {
        const target = visible[i];
        if (!target) return;
        setFocusId(target.id);
        itemRefs.current[target.id]?.focus();
    };

    const toggleExpand = (id: string, open?: boolean) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (open === true) next.add(id);
            else if (open === false) next.delete(id);
            else next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const select = (id: string) => {
        setSelected(id);
        onSelect?.(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Resolve the current node from the event target's data attribute so
        // we aren't dependent on React state catching up to native focus events.
        const itemId = (e.currentTarget as HTMLElement).dataset.itemid;
        const entry = visible.find((v) => v.id === itemId);
        if (!entry) return;
        const idx = visible.indexOf(entry);
        const { id, hasChildren, parentId, level } = entry;
        const isOpen = expanded.has(id);
        let handled = true;
        switch (e.key) {
            case "ArrowDown":
                focusAt(idx + 1);
                break;
            case "ArrowUp":
                focusAt(idx - 1);
                break;
            case "ArrowRight":
                if (hasChildren && !isOpen) toggleExpand(id, true);
                else if (hasChildren && isOpen) focusAt(idx + 1);
                break;
            case "ArrowLeft":
                if (hasChildren && isOpen) toggleExpand(id, false);
                else if (level > 1 && parentId !== null) {
                    const parentIdx = visible.findIndex((v) => v.id === parentId);
                    if (parentIdx >= 0) focusAt(parentIdx);
                }
                break;
            case "Home":
                focusAt(0);
                break;
            case "End":
                focusAt(visible.length - 1);
                break;
            case "Enter":
            case " ":
                if (hasChildren) toggleExpand(id);
                select(id);
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    const renderNodes = (ns: TreeNode[], level = 1): React.ReactNode => (
        <ul role={level === 1 ? "tree" : "group"} aria-label={level === 1 ? label : undefined} className={level === 1 ? "tree" : "tree-group"}>
            {ns.map((n, i) => {
                const hasChildren = !!n.children?.length;
                const isOpen = expanded.has(n.id);
                const isFocused = focusId === n.id;
                const isSelected = selected === n.id;
                return (
                    <li
                        key={n.id}
                        ref={(el) => (itemRefs.current[n.id] = el)}
                        role="treeitem"
                        data-itemid={n.id}
                        aria-level={level}
                        aria-posinset={i + 1}
                        aria-setsize={ns.length}
                        aria-expanded={hasChildren ? isOpen : undefined}
                        aria-selected={isSelected}
                        tabIndex={isFocused ? 0 : -1}
                        className={`treeitem${isSelected ? " is-selected" : ""}`}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setFocusId(n.id)}
                    >
                        <span
                            className="treeitem-label"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFocusId(n.id);
                                itemRefs.current[n.id]?.focus();
                                select(n.id);
                                if (hasChildren) toggleExpand(n.id);
                            }}
                        >
                            {hasChildren && (
                                <span className="treeitem-chevron" aria-hidden="true">
                                    {isOpen ? "\u25BE" : "\u25B8"}
                                </span>
                            )}
                            {!hasChildren && <span className="treeitem-bullet" aria-hidden="true" />}
                            {n.label}
                        </span>
                        {hasChildren && isOpen && renderNodes(n.children!, level + 1)}
                    </li>
                );
            })}
        </ul>
    );

    return renderNodes(nodes);
};

export default TreeView;
