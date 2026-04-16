/**
 * SliderMultiThumb — APG pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
 *
 * Renders two thumbs representing a [low, high] range. Each thumb has:
 *   - role="slider"
 *   - aria-valuemin / aria-valuemax / aria-valuenow / aria-valuetext
 *   - aria-label (required since thumbs share a control)
 *
 * Thumbs constrain each other: low cannot exceed high, high cannot precede low.
 *
 * Keyboard:
 *   - Arrow keys: ±step.
 *   - Home / End: min / max (within constraints).
 *   - PageUp / PageDown: ±10*step.
 */
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./SliderMultiThumb.css";

const SliderMultiThumb = ({
    min,
    max,
    step,
    initialLow,
    initialHigh,
    labelLow,
    labelHigh,
    getValueText,
    onChange,
}) => {
    const [low, setLow] = useState(initialLow ?? min);
    const [high, setHigh] = useState(initialHigh ?? max);
    const containerRef = useRef(null);
    const thumbRefs = { low: useRef(null), high: useRef(null) };

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const emit = (next) => {
        onChange?.(next);
    };

    const updateLow = (v) => {
        const nv = clamp(v, min, high);
        setLow(nv);
        emit({ low: nv, high });
    };

    const updateHigh = (v) => {
        const nv = clamp(v, low, max);
        setHigh(nv);
        emit({ low, high: nv });
    };

    const handleKey = (which, current) => (e) => {
        const update = which === "low" ? updateLow : updateHigh;
        let handled = true;
        switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
                update(current + step);
                break;
            case "ArrowLeft":
            case "ArrowDown":
                update(current - step);
                break;
            case "PageUp":
                update(current + step * 10);
                break;
            case "PageDown":
                update(current - step * 10);
                break;
            case "Home":
                update(which === "low" ? min : low);
                break;
            case "End":
                update(which === "low" ? high : max);
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    const pct = (v) => ((v - min) / (max - min)) * 100;
    const lowPct = pct(low);
    const highPct = pct(high);

    const valueText = (v) => (getValueText ? getValueText(v) : `${v}`);

    const pointerValueFrom = (clientX) => {
        const rect = containerRef.current.getBoundingClientRect();
        const ratio = (clientX - rect.left) / rect.width;
        const raw = min + Math.max(0, Math.min(1, ratio)) * (max - min);
        const steps = Math.round((raw - min) / step);
        return min + steps * step;
    };

    const startDrag = (which) => (e) => {
        e.preventDefault();
        thumbRefs[which].current?.focus();
        const move = (ev) => {
            const v = pointerValueFrom(ev.clientX);
            (which === "low" ? updateLow : updateHigh)(v);
        };
        const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    return (
        <div ref={containerRef} className="multi-slider">
            <div
                className="multi-slider-range"
                style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
            />
            <div
                ref={thumbRefs.low}
                role="slider"
                aria-label={labelLow || "Minimum"}
                aria-valuemin={min}
                aria-valuemax={high}
                aria-valuenow={low}
                aria-valuetext={valueText(low)}
                tabIndex={0}
                className="multi-slider-thumb multi-slider-thumb-low"
                style={{ left: `${lowPct}%` }}
                onKeyDown={handleKey("low", low)}
                onPointerDown={startDrag("low")}
            />
            <div
                ref={thumbRefs.high}
                role="slider"
                aria-label={labelHigh || "Maximum"}
                aria-valuemin={low}
                aria-valuemax={max}
                aria-valuenow={high}
                aria-valuetext={valueText(high)}
                tabIndex={0}
                className="multi-slider-thumb multi-slider-thumb-high"
                style={{ left: `${highPct}%` }}
                onKeyDown={handleKey("high", high)}
                onPointerDown={startDrag("high")}
            />
        </div>
    );
};

SliderMultiThumb.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number,
    initialLow: PropTypes.number,
    initialHigh: PropTypes.number,
    labelLow: PropTypes.string,
    labelHigh: PropTypes.string,
    getValueText: PropTypes.func,
    onChange: PropTypes.func,
};

SliderMultiThumb.defaultProps = {
    step: 1,
};

export default SliderMultiThumb;
