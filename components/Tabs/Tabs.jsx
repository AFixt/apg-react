/**
 * Tabs — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Keyboard model (horizontal):
 *   - Tab: moves into/out of the tablist, landing on the active tab.
 *   - Arrow Left/Right: move focus among tabs.
 *   - Home / End: first / last tab.
 *   - Enter / Space: activate (only needed for manual activation).
 *
 * `activation="automatic"` (default) selects on focus; "manual" requires Enter/Space.
 */
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Tabs.css";

const Tabs = ({ tabs, defaultIndex, activation, orientation, idPrefix }) => {
    const [activeIndex, setActiveIndex] = useState(defaultIndex ?? 0);
    const [focusIndex, setFocusIndex] = useState(defaultIndex ?? 0);
    const tabRefs = useRef([]);
    const prefix = idPrefix || "tabs";

    const focusTab = (i) => {
        setFocusIndex(i);
        tabRefs.current[i]?.focus();
        if (activation === "automatic") setActiveIndex(i);
    };

    const handleKeyDown = (e, i) => {
        const last = tabs.length - 1;
        const isHorizontal = orientation !== "vertical";
        const next = isHorizontal ? "ArrowRight" : "ArrowDown";
        const prev = isHorizontal ? "ArrowLeft" : "ArrowUp";
        let handled = true;
        switch (e.key) {
            case next:
                focusTab(i === last ? 0 : i + 1);
                break;
            case prev:
                focusTab(i === 0 ? last : i - 1);
                break;
            case "Home":
                focusTab(0);
                break;
            case "End":
                focusTab(last);
                break;
            case "Enter":
            case " ":
                setActiveIndex(i);
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    return (
        <div className={`tabs tabs-${orientation || "horizontal"}`}>
            <div
                role="tablist"
                aria-orientation={orientation || "horizontal"}
                className="tablist"
            >
                {tabs.map((tab, i) => {
                    const selected = i === activeIndex;
                    return (
                        <button
                            key={tab.id}
                            id={`${prefix}-tab-${tab.id}`}
                            ref={(el) => (tabRefs.current[i] = el)}
                            role="tab"
                            type="button"
                            className={`tab${selected ? " is-active" : ""}`}
                            aria-selected={selected}
                            aria-controls={`${prefix}-panel-${tab.id}`}
                            tabIndex={i === focusIndex ? 0 : -1}
                            onClick={() => {
                                setActiveIndex(i);
                                setFocusIndex(i);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            {tabs.map((tab, i) => (
                <div
                    key={tab.id}
                    id={`${prefix}-panel-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`${prefix}-tab-${tab.id}`}
                    className="tabpanel"
                    hidden={i !== activeIndex}
                    tabIndex={0}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.node.isRequired,
            content: PropTypes.node.isRequired,
        })
    ).isRequired,
    defaultIndex: PropTypes.number,
    activation: PropTypes.oneOf(["automatic", "manual"]),
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    idPrefix: PropTypes.string,
};

Tabs.defaultProps = {
    activation: "automatic",
    orientation: "horizontal",
};

export default Tabs;
