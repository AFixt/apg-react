/**
 * Demo contract: which toolbar demo page carries the disabled control.
 *
 * The pages under `demos/` are what `AFixt/apg-qa` and the six APG runner
 * repositories assert against, and the two toolbar pages have to stay on
 * opposite sides of one line:
 *
 * - `toolbar.html` keeps all four controls **enabled**. `toolbar-keyboard-nav`
 *   presses `End` and expects focus on Strikethrough, and all six runner repos
 *   assert that page's roving tabindex as a four-element array — two of them
 *   (`apg-cypress`, `apg-nightwatch`) also address its buttons by
 *   `:nth-child`. Measured against `apg-playwright`: marking Strikethrough
 *   `aria-disabled` there fails 3 of its 12 toolbar tests, and appending a
 *   fifth disabled control fails 4.
 * - `toolbar-disabled.html` marks Strikethrough `aria-disabled` and relies on
 *   `Toolbar` skipping it, which is what `toolbar-error` asserts.
 *
 * Neither invariant was pinned by anything in this repo. That matters here
 * more than it looks: `toolbar-error` reported green for months only because
 * the demo never marked Strikethrough disabled at all, so its first assertion
 * failed silently rather than the case failing loudly (AFixt/apg-qa#13). A
 * demo that quietly drifts out of the state a downstream case requires is the
 * exact failure this pins, and the same gap `__tests__/demoTabs.test.js` was
 * added for.
 *
 * Each demo module calls `mount()` at import time, so a page is rendered by
 * requiring the module into a fresh `#demo-root` rather than by rendering a
 * component — the demo module *is* the unit under test. The require is
 * deliberately not isolated: each page is a distinct module required exactly
 * once, and an isolated registry would hand the demo its own copy of React,
 * which `act()` from this registry could not flush.
 */
import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';

const CONTROLS = ['Bold', 'Italic', 'Underline', 'Strikethrough'];

const buttons = () => screen.getAllByRole('button');

describe('demo contract: the toolbar pages', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="demo-root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('demos/src/toolbar.tsx keeps all four controls enabled', async () => {
    await act(async () => {
      require('../demos/src/toolbar.tsx');
    });

    const controls = buttons();
    expect(controls.map((button) => button.textContent)).toEqual(CONTROLS);
    controls.forEach((button) => {
      expect(button).not.toHaveAttribute('aria-disabled');
      expect(button).toBeEnabled();
    });
  });

  test('demos/src/toolbar-disabled.tsx disables Strikethrough and skips it', async () => {
    await act(async () => {
      require('../demos/src/toolbar-disabled.tsx');
    });

    const controls = buttons();
    expect(controls.map((button) => button.textContent)).toEqual(CONTROLS);

    // Only the last control is disabled, and by `aria-disabled` rather than the
    // native attribute: APG keeps a disabled toolbar control discoverable, and
    // `toolbar-error` locates it before asserting the state.
    expect(controls[3]).toHaveAttribute('aria-disabled', 'true');
    controls.slice(0, 3).forEach((button) => {
      expect(button).not.toHaveAttribute('aria-disabled');
    });
    controls.forEach((button) => expect(button).toBeEnabled());

    // The step `toolbar-error` actually runs.
    controls[2].focus();
    fireEvent.keyDown(controls[2], { key: 'ArrowRight' });
    expect(controls[0]).toHaveFocus();

    // ...and the consequence that keeps it off the default page: `End` can no
    // longer reach Strikethrough.
    fireEvent.keyDown(controls[0], { key: 'End' });
    expect(controls[2]).toHaveFocus();

    // Activating the disabled control is a genuine no-op.
    fireEvent.click(controls[3]);
    expect(controls[3]).toHaveAttribute('aria-pressed', 'false');
  });
});
