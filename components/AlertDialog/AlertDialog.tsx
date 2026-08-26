/**
 * AlertDialog — APG: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 *
 * - role=alertdialog, aria-modal=true
 * - Focus trapped inside the dialog
 * - Escape closes and returns focus to the invoking element
 * - Initial focus placed on the least destructive action (see `actions`)
 */
import React, { useEffect, useId, useRef } from 'react';
import { cycleFocusInDialog } from '../_internal/dialog-focus';
import './AlertDialog.css';

/** One choice offered by an AlertDialog. */
interface AlertDialogAction {
  label: string;
  /** Called when the action is activated, before the dialog closes. */
  onSelect?: () => void;
  /** Places initial focus here, overriding the least-destructive default. */
  initialFocus?: boolean;
  /** Marks a destructive choice, so it is styled as one and not focused first. */
  destructive?: boolean;
}

/** Translatable labels for the AlertDialog component. English defaults are used when a key is omitted. */
interface AlertDialogLabels {
  /** Label of the acknowledge button used when no `actions` are supplied. */
  close?: string;
}

/** Props for the AlertDialog component. */
interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  /**
   * The choices the dialog offers. Omit for an acknowledge-only dialog with a
   * single Close button, which is the previous behaviour.
   *
   * Initial focus goes to the action marked `initialFocus`; failing that, to
   * the first action that is not `destructive`; failing that, to the first.
   * That ordering is what APG's guidance about focusing the least destructive
   * choice needs, without making the consumer restate it every time.
   */
  actions?: AlertDialogAction[];
  labels?: AlertDialogLabels;
}

const defaultLabels: Required<AlertDialogLabels> = {
  close: 'Close',
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  onClose,
  actions,
  labels,
}) => {
  const l = { ...defaultLabels, ...labels };
  const uid = useId();
  const titleId = `alertdialog-title-${uid}`;
  const descId = `alertdialog-desc-${uid}`;
  const dialogRef = useRef<HTMLDivElement>(null);
  /** The element that takes initial focus, and that the focus trap returns to. */
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const invokingElementRef = useRef<Element | null>(null);
  // Tracks whether the dialog is in the process of closing so the focus trap
  // doesn't yank focus back to the dialog while we're restoring it to the
  // invoking element.
  const closingRef = useRef(false);

  // Save invoking element and set initial focus on open.
  useEffect(() => {
    if (isOpen) {
      closingRef.current = false;
      invokingElementRef.current = document.activeElement;
      initialFocusRef.current?.focus();
    }
  }, [isOpen]);

  const closeAndRestoreFocus = () => {
    closingRef.current = true;
    const invoker = invokingElementRef.current as HTMLElement | null;
    if (invoker && typeof invoker.focus === 'function') {
      invoker.focus();
    }
    onClose();
  };

  // Document-level Escape handler.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeAndRestoreFocus();
      } else if (e.key === 'Tab' && dialogRef.current) {
        cycleFocusInDialog(dialogRef.current, e);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Focus trap — keep focus inside the dialog. Inactive while closing so we
  // can hand focus back to the invoking element.
  useEffect(() => {
    if (!isOpen) return;
    const handleFocusTrap = (e: FocusEvent) => {
      if (closingRef.current) return;
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        e.stopPropagation();
        initialFocusRef.current?.focus();
      }
    };
    document.addEventListener('focus', handleFocusTrap, true);
    return () => document.removeEventListener('focus', handleFocusTrap, true);
  }, [isOpen]);

  const resolvedActions: AlertDialogAction[] =
    actions && actions.length > 0 ? actions : [{ label: l.close }];

  const explicit = resolvedActions.findIndex((a) => a.initialFocus);
  const leastDestructive = resolvedActions.findIndex((a) => !a.destructive);
  const focusIndex = explicit >= 0 ? explicit : leastDestructive >= 0 ? leastDestructive : 0;

  const runAction = (action: AlertDialogAction) => {
    closingRef.current = true;
    const invoker = invokingElementRef.current as HTMLElement | null;
    if (invoker && typeof invoker.focus === 'function') {
      invoker.focus();
    }
    action.onSelect?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="dialog-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={-1}
      ref={dialogRef}
    >
      <div className="dialog-content">
        <h2 id={titleId}>{title}</h2>
        <p id={descId}>{message}</p>
        <div className="dialog-actions">
          {resolvedActions.map((action, i) => (
            <button
              // Index rather than label: two actions may legitimately share a
              // label, and a duplicate React key silently drops one of them.
              key={`${i}-${action.label}`}
              ref={i === focusIndex ? initialFocusRef : undefined}
              className={`dialog-action${action.destructive ? ' dialog-action-destructive' : ''}`}
              onClick={() => runAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Accessible implementation of the WAI-ARIA APG AlertDialog pattern. See the top-of-file comment for keyboard and ARIA details. */
export default AlertDialog;
