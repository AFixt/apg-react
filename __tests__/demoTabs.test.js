/**
 * Demo contract: every tabs demo page names its tablist "Sample Tabs".
 *
 * The demo pages under `demos/` are the target the `AFixt/apg-qa` suite runs
 * against, and `tabs-aria-state` locates the tablist by that name. APG's Tabs
 * pattern asks for a labelled tablist, and the `Tabs` component has taken a
 * `label` since #202 -- but nothing in this repo checked that the demo pages
 * passed one, which is how `tabs.html` shipped unnamed and the case timed out
 * (#229). The unit suite pins that `label` works; this pins that the demos use
 * it.
 *
 * The name is asserted identically on all three tabs pages on purpose: a case
 * tightened to locate the tablist by name has to hold against whichever page
 * it is pointed at, so a page that drifts to a different name is the same
 * regression as one with no name at all.
 *
 * Each demo module calls `mount()` at import time, so the page is rendered by
 * requiring the module into a fresh `#demo-root` rather than by rendering a
 * component -- the demo module *is* the unit under test here. The require is
 * deliberately not isolated: each page is a distinct module, so it is only ever
 * required once, and an isolated registry would hand the demo its own copy of
 * React, which `act()` from this registry could not flush.
 */
import { act, screen } from '@testing-library/react';

const TABLIST_NAME = 'Sample Tabs';
const TABS_PAGES = ['tabs', 'tabs-manual', 'tabs-disabled-tab'];

describe('demo contract: the tabs pages name their tablist', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="demo-root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test.each(TABS_PAGES)('demos/src/%s.tsx names the tablist "Sample Tabs"', async (page) => {
    await act(async () => {
      require(`../demos/src/${page}.tsx`);
    });

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAccessibleName(TABLIST_NAME);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });
});
