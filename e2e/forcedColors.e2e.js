const { openStory, injectA11yHelpers, emulateForcedColors, tabTo } = require('./helpers');

/**
 * Forced-colors focus indicators, across the component library.
 *
 * Nearly every component stylesheet removes the focus outline and draws a
 * `box-shadow` ring instead — and a few signal focus with nothing but a
 * `background-color` swap. Forced colors (Windows High Contrast Mode)
 * suppresses `box-shadow` outright and overrides `background-color`, while the
 * `outline: none` that accompanies them has already removed the UA ring that
 * would otherwise have covered for it. The result, before this was fixed, was
 * no visible focus indicator at all: WCAG 2.2 2.4.7 Focus Visible (A).
 *
 * Only a real engine can prove the fix. jsdom does not resolve stylesheets or
 * evaluate media queries, and stylelint's `a11y/no-outline-none` accepts a
 * `box-shadow` as a sufficient alternative to the removed outline — true
 * everywhere except forced colors, which is why the gap shipped unflagged.
 * `__tests__/forcedColors.test.js` enforces the pairing structurally; this
 * suite proves the rules actually render an indicator.
 *
 * Some elements are deliberately absent, because a test asserting on them would
 * be fiction. Their stylesheet guards are covered by the structural test.
 *
 * - `.listbox` (the container) and `.spinbutton-arrow` both carry
 *   `tabindex="-1"`, so no keyboard can reach them; they take focus only
 *   programmatically, if at all.
 *
 * `Link` has its own forced-colors test in `link.e2e.js`, covering both of its
 * render branches.
 */

/**
 * Opens a menu from its trigger and waits for the roving-tabindex item to take
 * focus, since menu items are reached by opening the menu rather than by Tab.
 *
 * @param {string} trigger - Selector for the element that opens the menu.
 * @param {string} item - Selector for the item that should end up focused.
 * @returns {(page: import('puppeteer').Page) => Promise<void>} A reach function.
 */
const openMenuThen = (trigger, item) => async (page) => {
  await tabTo(page, trigger);
  await page.keyboard.press('Enter');
  await page.waitForFunction(
    (sel) => document.activeElement?.matches(sel),
    { timeout: 5000 },
    item,
  );
};

/**
 * One case per element a keyboard user can focus whose indicator forced colors
 * could plausibly take away: every element whose stylesheet removes the
 * outline, plus the few that once did and now draw a real one, which still
 * have to be seen rendering it. `shadowInNormalMode` records whether the
 * component's ordinary indicator is a box-shadow — where it is, the suppressed
 * shadow is asserted on as corroboration that emulation is really in effect.
 */
const CASES = [
  {
    component: 'Accordion',
    element: 'header',
    story: 'components-accordion--default-bare',
    selector: '.accordion-header',
    shadowInNormalMode: true,
  },
  {
    component: 'Alert',
    element: 'dismiss button',
    story: 'components-alert--info',
    selector: '.alert-close',
    shadowInNormalMode: true,
  },
  {
    component: 'AlertDialog',
    element: 'action button',
    story: 'components-alertdialog--open-by-default-bare',
    selector: '.dialog-content button',
    shadowInNormalMode: true,
  },
  {
    component: 'Article',
    element: 'content link',
    // The only story whose content contains a link, which is what `.article a`
    // needs in order to match at all.
    story: 'components-article--with-link',
    selector: '.article a',
    shadowInNormalMode: true,
  },
  {
    component: 'Breadcrumb',
    element: 'link',
    story: 'components-breadcrumb--default',
    selector: '.breadcrumb-item a',
    shadowInNormalMode: true,
  },
  {
    component: 'Button',
    element: 'button',
    story: 'components-button--default',
    selector: '.button',
    shadowInNormalMode: true,
  },
  {
    component: 'Carousel',
    element: 'control',
    story: 'components-carousel--default-bare',
    selector: '.carousel-control-play',
    // Draws a real outline in every mode since #234, so there is no shadow to
    // see suppressed; the case stays because the outline still has to render.
    shadowInNormalMode: false,
  },
  {
    component: 'Carousel',
    element: 'slide selector',
    story: 'components-carousel--default-bare',
    selector: '.slide-selectors button',
    shadowInNormalMode: false,
  },
  {
    component: 'Checkbox',
    element: 'input',
    story: 'components-checkbox--unchecked-bare',
    selector: '.checkbox-input',
    shadowInNormalMode: true,
  },
  {
    component: 'Combobox',
    element: 'input',
    story: 'components-combobox--autocomplete-list-bare',
    selector: '.combobox-input',
    shadowInNormalMode: true,
  },
  {
    component: 'Disclosure',
    element: 'control',
    story: 'components-disclosure--default',
    selector: '.disclosure-control',
    shadowInNormalMode: true,
  },
  {
    component: 'Grid',
    element: 'cell',
    story: 'components-grid--default-bare',
    selector: '.grid-cell[tabindex="0"]',
    shadowInNormalMode: true,
  },
  {
    component: 'Listbox',
    element: 'option',
    story: 'components-listbox--single-select-bare',
    selector: '.listbox-option[tabindex="0"]',
    // The bare option signals focus with a background-color change alone; only
    // `.is-focused` adds a shadow.
    shadowInNormalMode: false,
  },
  {
    component: 'MenuButton',
    element: 'trigger',
    story: 'components-menubutton--default',
    selector: '.menu-button',
    shadowInNormalMode: true,
  },
  {
    component: 'MenuButton',
    element: 'menu item',
    story: 'components-menubutton--default',
    selector: '.menuitem[tabindex="0"]',
    reach: openMenuThen('.menu-button', '.menuitem[tabindex="0"]'),
    // This item has no focus shadow at all — it swaps background and text
    // colour, both of which forced colors overrides.
    shadowInNormalMode: false,
  },
  {
    component: 'Menubar',
    element: 'bar item',
    story: 'components-menubar--default',
    selector: '.menubar-item[tabindex="0"]',
    shadowInNormalMode: true,
  },
  {
    component: 'Menubar',
    element: 'menu item',
    story: 'components-menubar--default',
    selector: '.menubar-menuitem[tabindex="0"]',
    reach: openMenuThen('.menubar-item[tabindex="0"]', '.menubar-menuitem[tabindex="0"]'),
    shadowInNormalMode: false,
  },
  {
    component: 'ModalDialog',
    element: 'close button',
    story: 'components-modaldialog--open-by-default-bare',
    selector: '.modal-dialog-close',
    shadowInNormalMode: true,
  },
  {
    component: 'RadioGroup',
    element: 'radio',
    story: 'components-radiogroup--default-bare',
    selector: '.radio[tabindex="0"]',
    shadowInNormalMode: true,
  },
  {
    component: 'Slider',
    element: 'thumb',
    story: 'components-slider--horizontal-bare',
    selector: "[role='slider']",
    shadowInNormalMode: true,
  },
  {
    component: 'SliderMultiThumb',
    element: 'thumb',
    story: 'components-slidermultithumb--price-range-bare',
    selector: '.multi-slider-thumb',
    shadowInNormalMode: true,
  },
  {
    component: 'Spinbutton',
    element: 'input',
    story: 'components-spinbutton--default-bare',
    selector: ".spinbutton-container input[type='text']",
    shadowInNormalMode: true,
  },
  {
    component: 'Switch',
    element: 'control',
    story: 'components-switch--off-bare',
    selector: '.switch-control',
    shadowInNormalMode: true,
  },
  {
    component: 'Tabs',
    element: 'tab',
    story: 'components-tabs--horizontal-bare',
    selector: '.tab[tabindex="0"]',
    shadowInNormalMode: true,
  },
  {
    component: 'Tabs',
    element: 'panel',
    story: 'components-tabs--horizontal-bare',
    selector: '.tabpanel',
    shadowInNormalMode: true,
  },
  {
    component: 'Textbox',
    element: 'input',
    story: 'components-textbox--single-line',
    selector: '.textbox-input',
    shadowInNormalMode: true,
  },
  {
    component: 'Toolbar',
    element: 'button',
    story: 'components-toolbar--default',
    selector: '.toolbar > [tabindex="0"]',
    shadowInNormalMode: true,
  },
  {
    component: 'TreeGrid',
    element: 'cell',
    story: 'components-treegrid--default-bare',
    selector: '.treegrid-cell[tabindex="0"]',
    shadowInNormalMode: true,
  },
  {
    component: 'TreeView',
    element: 'item',
    story: 'components-treeview--default-bare',
    selector: '.treeitem[tabindex="0"]',
    shadowInNormalMode: true,
  },
];

describe('Forced-colors focus indicators (E2E)', () => {
  test.each(CASES)(
    '$component $element keeps a visible focus indicator in forced-colors mode',
    async ({ story, selector, reach, shadowInNormalMode }) => {
      const { page, close } = await openStory(story);
      try {
        await emulateForcedColors(page);
        await injectA11yHelpers(page);

        // Real key presses, not page.focus(): most of these indicators are
        // written against :focus-visible, which programmatic focus deliberately
        // does not match — the ring would be absent for a reason that has
        // nothing to do with the stylesheet.
        if (reach) {
          await reach(page);
        } else {
          await tabTo(page, selector, 30);
        }

        const { forcedColors, hasRing, outlineStyle, outlineWidth, boxShadow } = await page.$eval(
          selector,
          (el) => {
            const cs = getComputedStyle(el);
            return {
              forcedColors: window.matchMedia('(forced-colors: active)').matches,
              hasRing: window.__a11y.isVisibleFocusRing(el),
              outlineStyle: cs.outlineStyle,
              outlineWidth: cs.outlineWidth,
              boxShadow: cs.boxShadow,
            };
          },
        );

        // Assert emulation is genuinely in effect before anything else. Without
        // this the whole suite would pass on the ordinary ring the moment
        // `Emulation.setEmulatedMedia` stopped taking — which is not
        // hypothetical: Puppeteer's own `emulateMediaFeatures` already refuses
        // this feature, so the helper reaches past it to CDP.
        expect(forcedColors).toBe(true);

        // Where the component's ordinary indicator is a shadow, it must be gone
        // here: that is the failure this whole suite exists for, and seeing it
        // suppressed corroborates the check above.
        if (shadowInNormalMode) expect(boxShadow).toBe('none');

        // What must survive: a real outline, which is the only focus indicator
        // forced colors preserves.
        expect(outlineStyle).not.toBe('none');
        expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
        expect(hasRing).toBe(true);
      } finally {
        await close();
      }
    },
  );
});
