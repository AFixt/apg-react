const { openStory } = require('./helpers');

/**
 * Reduced-motion opt-outs, in a real engine.
 *
 * Every `@media (prefers-reduced-motion: reduce)` block in the library used to
 * sit above the rule it overrides. A media query adds no specificity, so at
 * equal specificity the later rule won on source order and the opt-out did
 * nothing — users who asked for reduced motion still got every transition and
 * the infinite progressbar animation.
 *
 * Only a real engine settles it. jsdom neither resolves stylesheets nor
 * evaluates media queries, and stylelint checks that a reduced-motion block
 * exists, never that it can win — its autofix creates the broken shape, so it
 * was the source of the bug rather than a check against it.
 * `__tests__/reducedMotion.test.js` enforces the ordering structurally; this
 * proves the opt-out actually resolves to no motion.
 *
 * Unlike `forced-colors`, Puppeteer supports this media feature directly, so
 * these use `emulateMediaFeatures` rather than reaching through to CDP.
 */

/**
 * One case per element whose motion a reduced-motion block has to suppress.
 *
 * `pseudo` targets a pseudo-element, where several of the state transforms live
 * — the switch knob and the radio dot are both `::before`/`::after`.
 */
const CASES = [
  {
    component: 'Accordion',
    element: 'header',
    story: 'components-accordion--default-bare',
    selector: '.accordion-header',
  },
  {
    component: 'Alert',
    element: 'dismiss button',
    story: 'components-alert--info',
    selector: '.alert-close',
  },
  {
    component: 'AlertDialog',
    element: 'action button',
    story: 'components-alertdialog--open-by-default-bare',
    selector: '.dialog-content button',
  },
  {
    component: 'Breadcrumb',
    element: 'link',
    story: 'components-breadcrumb--default',
    selector: '.breadcrumb-item a',
  },
  {
    component: 'Button',
    element: 'button',
    story: 'components-button--default',
    selector: '.button',
  },
  {
    component: 'Carousel',
    element: 'slide track',
    story: 'components-carousel--default-bare',
    selector: '.carousel .slides',
    // No keepsTransform: the component switches slides with the `hidden`
    // attribute and never sets a transform at all, so the `transition:
    // transform` this suppresses has nothing to act on either way.
  },
  {
    component: 'Carousel',
    element: 'control',
    story: 'components-carousel--default-bare',
    selector: '.carousel-control',
  },
  {
    component: 'Carousel',
    element: 'slide selector',
    story: 'components-carousel--default-bare',
    selector: '.carousel .slide-selectors button',
  },
  {
    component: 'Checkbox',
    element: 'input',
    story: 'components-checkbox--unchecked-bare',
    selector: '.checkbox-input',
  },
  {
    component: 'Combobox',
    element: 'input',
    story: 'components-combobox--autocomplete-list-bare',
    selector: '.combobox-input',
  },
  {
    component: 'Disclosure',
    element: 'control',
    story: 'components-disclosure--default',
    selector: '.disclosure-control',
  },
  {
    component: 'Disclosure',
    element: 'indicator',
    story: 'components-disclosure--default',
    selector: '.disclosure-control .indicator',
    // The rotation lives on the expanded state, so the disclosure has to be
    // opened before there is a transform to assert on at all.
    setup: (page) => page.click('.disclosure-control'),
    keepsTransform: true,
  },
  {
    component: 'Grid',
    element: 'cell',
    story: 'components-grid--default-bare',
    selector: '.grid-cell',
  },
  {
    component: 'Link',
    element: 'link',
    story: 'components-link--activation-count-plain-anchor',
    selector: '.link',
  },
  {
    component: 'MenuButton',
    element: 'trigger',
    story: 'components-menubutton--default',
    selector: '.menu-button',
  },
  {
    component: 'Menubar',
    element: 'bar item',
    story: 'components-menubar--default',
    selector: '.menubar-item',
  },
  {
    component: 'Meter',
    element: 'fill',
    story: 'components-meter--default',
    selector: '.meter-fill',
  },
  {
    component: 'ModalDialog',
    element: 'backdrop',
    story: 'components-modaldialog--open-by-default-bare',
    selector: '.modal-dialog-backdrop',
  },
  {
    component: 'ModalDialog',
    element: 'dialog',
    story: 'components-modaldialog--open-by-default-bare',
    selector: '.modal-dialog',
    // The entry offset is a transform that `.open` cancels; it still applies.
    keepsTransform: true,
  },
  {
    component: 'ModalDialog',
    element: 'close button',
    story: 'components-modaldialog--open-by-default-bare',
    selector: '.modal-dialog-close',
  },
  {
    component: 'Progressbar',
    element: 'fill',
    story: 'components-progressbar--determinate',
    selector: '.progressbar-fill',
  },
  {
    component: 'RadioGroup',
    element: 'indicator',
    story: 'components-radiogroup--default-bare',
    selector: '.radio-indicator',
  },
  {
    component: 'RadioGroup',
    element: 'indicator dot',
    story: 'components-radiogroup--default-bare',
    selector: '.radio-indicator',
    pseudo: '::after',
    keepsTransform: true,
  },
  {
    component: 'Slider',
    element: 'thumb',
    story: 'components-slider--horizontal-bare',
    selector: ".slider-container [role='slider']",
  },
  {
    component: 'SliderMultiThumb',
    element: 'thumb',
    story: 'components-slidermultithumb--price-range-bare',
    selector: '.multi-slider-thumb',
  },
  {
    component: 'Spinbutton',
    element: 'input',
    story: 'components-spinbutton--default-bare',
    selector: ".spinbutton-container input[type='text']",
  },
  {
    component: 'Spinbutton',
    element: 'arrow',
    story: 'components-spinbutton--default-bare',
    selector: '.spinbutton-container .spinbutton-arrow',
  },
  {
    component: 'Switch',
    element: 'track',
    story: 'components-switch--off-bare',
    selector: '.switch',
  },
  {
    component: 'Switch',
    element: 'knob',
    story: 'components-switch--off-bare',
    selector: '.switch',
    pseudo: '::before',
    keepsTransform: true,
  },
  {
    component: 'Tabs',
    element: 'tab',
    story: 'components-tabs--horizontal-bare',
    selector: '.tab',
  },
  {
    component: 'Textbox',
    element: 'input',
    story: 'components-textbox--single-line',
    selector: '.textbox-input',
  },
  {
    component: 'Toolbar',
    element: 'button',
    story: 'components-toolbar--default',
    selector: '.toolbar > button',
  },
];

describe('Reduced-motion opt-outs (E2E)', () => {
  test.each(CASES)(
    '$component $element has no transition under reduced motion',
    async ({ story, selector, pseudo, keepsTransform, setup }) => {
      const { page, close } = await openStory(story);
      try {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        if (setup) await setup(page);

        const { matches, duration, transform } = await page.$eval(
          selector,
          (el, ps) => {
            const cs = getComputedStyle(el, ps || undefined);
            return {
              matches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
              duration: cs.transitionDuration,
              transform: cs.transform,
            };
          },
          pseudo,
        );

        // Emulation first: without this the suite would pass the moment the
        // media feature silently stopped applying, since a element with no
        // transition at all also reports 0s.
        expect(matches).toBe(true);

        // Every comma-separated part has to be zero — `transition: none`
        // collapses to a single 0s, but a surviving multi-property transition
        // reports one duration per property.
        const durations = duration.split(',').map((d) => parseFloat(d));
        expect(durations.every((d) => d === 0)).toBe(true);

        // Where the transform carries state rather than decoration, killing it
        // would break the component. Assert it survives, so a future "fix" that
        // adds `transform: none` here fails instead of silently collapsing the
        // carousel, the switch knob or the dialog's resting position.
        if (keepsTransform) expect(transform).not.toBe('none');
      } finally {
        await close();
      }
    },
  );

  test('the indeterminate progressbar animation is stopped outright', async () => {
    const { page, close } = await openStory('components-progressbar--indeterminate');
    try {
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

      const { matches, animationName, width } = await page.$eval('.progressbar-fill', (el) => {
        const cs = getComputedStyle(el);
        return {
          matches: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          animationName: cs.animationName,
          width: cs.width,
        };
      });

      expect(matches).toBe(true);
      // An indeterminate bar loops forever, which is the clearest case of what
      // reduced motion is asking to stop.
      expect(animationName).toBe('none');
      // And it has to come to rest somewhere visible rather than collapsing.
      expect(parseFloat(width)).toBeGreaterThan(0);
    } finally {
      await close();
    }
  });
});
