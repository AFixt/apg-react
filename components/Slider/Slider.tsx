/**
 * A customizable slider component for React.
 *
 * Supports keyboard (APG pattern), click-on-track, and pointer drag.
 */
import React, { useRef, useState } from 'react';
import './Slider.css';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  initialValue?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  isVertical?: boolean;
  getUserFriendlyValue?: (value: number) => string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  initialValue,
  ariaLabel,
  ariaLabelledby,
  isVertical = false,
  getUserFriendlyValue,
}) => {
  const [value, setValue] = useState(initialValue ?? min);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  const snapToStep = (raw: number) => {
    const steps = Math.round((raw - min) / step);
    return clamp(min + steps * step);
  };

  const handleChange = (newValue: number) => {
    setValue(clamp(newValue));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    let handled = true;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        handleChange(value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        handleChange(value - step);
        break;
      case 'Home':
        handleChange(min);
        break;
      case 'End':
        handleChange(max);
        break;
      case 'PageUp':
        handleChange(value + step * 10);
        break;
      case 'PageDown':
        handleChange(value - step * 10);
        break;
      default:
        handled = false;
        break;
    }
    if (handled) e.preventDefault();
  };

  const valueFromPointer = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const ratio = isVertical
      ? 1 - (clientY - rect.top) / rect.height
      : (clientX - rect.left) / rect.width;
    const raw = min + Math.max(0, Math.min(1, ratio)) * (max - min);
    return snapToStep(raw);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    thumbRef.current?.focus();
    const newValue = valueFromPointer(e.clientX, e.clientY);
    setValue(newValue);

    const handleMove = (ev: PointerEvent) => {
      setValue(valueFromPointer(ev.clientX, ev.clientY));
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const ariaValuetext = getUserFriendlyValue ? getUserFriendlyValue(value) : `${value}`;

  const percent = ((value - min) / (max - min)) * 100;
  const thumbStyle = isVertical ? { top: `${100 - percent}%` } : { left: `${percent}%` };

  return (
    <div
      ref={containerRef}
      className={`slider-container${isVertical ? ' vertical' : ''}`}
      onPointerDown={handlePointerDown}
    >
      <div
        ref={thumbRef}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={ariaValuetext}
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        tabIndex={0}
        onKeyDown={handleKeyPress}
        style={thumbStyle}
      />
    </div>
  );
};

export default Slider;
