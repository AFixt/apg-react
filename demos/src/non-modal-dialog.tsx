import React, { useState } from 'react';
import NonModalDialog from '../../components/NonModalDialog/NonModalDialog';
import { mount } from './mount';

/**
 * Non-modal dialog demo: a preferences panel and a filter panel over a page
 * that stays usable while either is open.
 *
 * The page-level Search field is the point of the demo, not furniture. Every
 * behaviour that distinguishes a non-modal dialog from a modal one is only
 * observable against something outside the dialog: that Tab reaches the page
 * behind, that focus can land there without the dialog closing, and that the
 * rest of the page stays operable by pointer and keyboard.
 *
 * Two dialogs are offered because non-modal dialogs may legitimately coexist —
 * a modal one may not. Opening both is the demonstration.
 *
 * This page is the target for `patterns/dialog-non-modal/` in
 * AFixt/apg-usecases, which previously had to aim at the modal datepicker
 * example for want of a non-modal fixture (AFixt/apg-usecases#69).
 */
/**
 * `?open=all` starts both dialogs open.
 *
 * The multiple-dialogs use case in apg-usecases asserts that two non-modal
 * dialogs coexist, and does it by locating both — it has no steps that open
 * anything, so the fixture has to arrive in that state. Opening both on a plain
 * page load would make a worse demo for everyone else, so it is opt-in.
 */
function initiallyOpen(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('open') === 'all';
}

function NonModalDialogDemo(): React.ReactElement {
  const [prefsOpen, setPrefsOpen] = useState(initiallyOpen);
  const [filtersOpen, setFiltersOpen] = useState(initiallyOpen);

  // No focus-restore effect here, unlike the modal demo. There is no focus trap
  // to fight, and the dialog restores focus to its invoker itself on Escape and
  // on its close button.
  return (
    <main className="demo-page">
      <h1>Non-Modal Dialog</h1>

      <p>
        Both dialogs below are non-modal: the page stays interactive while they are open, Tab moves
        out of a dialog to the rest of the page without closing it, and both can be open at once.
      </p>

      <p>
        <label htmlFor="page-search">Search</label> <input id="page-search" type="text" />
      </p>

      <p>
        <button type="button" onClick={() => setPrefsOpen(true)}>
          Open preferences
        </button>{' '}
        <button type="button" onClick={() => setFiltersOpen(true)}>
          Open filters
        </button>
      </p>

      <NonModalDialog
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        ariaLabelledby="prefs-title"
        ariaDescribedby="prefs-desc"
      >
        <h2 id="prefs-title">Preferences</h2>
        <p id="prefs-desc">
          Adjust how results are displayed. Tab past the last control and focus moves to the page
          behind, without closing this dialog.
        </p>
        <p>
          <label htmlFor="prefs-per-page">Results per page</label>{' '}
          <input id="prefs-per-page" type="number" defaultValue={25} />
        </p>
        <button type="button">Reset to defaults</button>
      </NonModalDialog>

      <NonModalDialog
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        ariaLabelledby="filters-title"
      >
        <h2 id="filters-title">Filter options</h2>
        <p>
          A second non-modal dialog. Open both to see that they coexist, each with its own
          accessible name.
        </p>
        <button type="button">Clear filters</button>
      </NonModalDialog>
    </main>
  );
}

mount(<NonModalDialogDemo />);
