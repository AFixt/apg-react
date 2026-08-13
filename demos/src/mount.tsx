import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../components/styles.css';
import '../demos.css';

/**
 * Mounts a demo into the page's `#demo-root` container.
 *
 * Every demo page is a plain HTML shell with a single `#demo-root` div; the
 * per-pattern module under `demos/src/` calls this with the element it wants
 * rendered. Keeping the boilerplate here means a demo module contains nothing
 * but the pattern it demonstrates.
 *
 * Deliberately not wrapped in `React.StrictMode`. These pages are automation
 * targets, and StrictMode's development-only double-invocation of effects
 * re-runs the focus management in ModalDialog, AlertDialog and friends, which
 * loses races against a test runner that asserts on focus immediately after an
 * activation. The demo should behave the way the component does in production.
 * @param node The demo element to render.
 */
export function mount(node: React.ReactNode): void {
  const container = document.getElementById('demo-root');

  if (!container) {
    throw new Error('Demo page is missing its #demo-root container.');
  }

  createRoot(container).render(node);
}
