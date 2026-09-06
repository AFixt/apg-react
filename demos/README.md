# Demo server

Static demo pages, one per WAI-ARIA APG pattern, rendered from this library's
own components.

```bash
npm run serve   # http://localhost:8080/demos/index.html
```

These pages are the target that the `AFixt/apg-qa` use-case suite and the six
APG test-runner repositories (`apg-nightwatch`, `apg-jasmine`, `apg-jest`,
`apg-cypress`, `apg-mocha`, `apg-playwright`) assert against.
`apg-qa/data/urls.yaml` addresses them as
`http://localhost:8080/demos/<pattern>.html`.

## The one rule

**A demo page renders the component. It never reimplements the pattern.**

A demo that hand-rolls the keyboard handling or the ARIA states would pass every
downstream spec regardless of whether the shipped component works, which makes
those specs unfalsifiable. Where a component is missing an APG behaviour, the
demo leaves it missing and the gap gets an issue.

The one exception is `table.html`: the APG's Table pattern is native `<table>`
markup and this library ships no Table component, so that page is plain semantic
HTML.

Demos may supply behaviour the library documents as the consumer's job — the
README's "Implementer responsibilities" section, e.g. returning focus to the
invoking element when the consumer's own button closes a dialog.

## Per-state pages

Within several patterns, use cases need mutually exclusive load states of what
would otherwise be one page — a disclosure that is collapsed on load and one
that is expanded cannot be the same URL. Those states get their own page rather
than a query parameter, so `apg-qa` can address each by a named URL variable and
a change here is a one-line edit in its `data/urls.yaml`.

| Page                         | `apg-qa` variable           | State                                                 |
| ---------------------------- | --------------------------- | ----------------------------------------------------- |
| `disclosure-expanded.html`   | `disclosure_expanded_url`   | expanded on load                                      |
| `disclosure-lazy.html`       | `disclosure_lazy_url`       | content absent from the DOM until first expanded      |
| `alert-severities.html`      | `alert_severities_url`      | one info, one warning and one error alert at once     |
| `accordion-always-open.html` | `accordion_always_open_url` | at-least-one-open; the open header is `aria-disabled` |
| `tabs-manual.html`           | `tabs_manual_url`           | manual activation; Enter/Space activates              |
| `tabs-disabled-tab.html`     | `tabs_disabled_tab_url`     | Tab 3 `aria-disabled`, reachable but never selected   |
| `toolbar-vertical.html`      | `toolbar_vertical_url`      | `orientation="vertical"`; Up/Down move roving focus   |
| `listbox-multiselect.html`   | `listbox_multiselect_url`   | `aria-multiselectable="true"`                         |
| `switch-disabled.html`       | `switch_disabled_url`       | `aria-disabled` switch, focusable but never toggles   |
| `carousel-non-looping.html`  | `carousel_non_looping_url`  | `loop={false}`; bounded ends, plus a slide status     |

The default page for each of these patterns keeps its existing behaviour on
purpose, because its own cases depend on it:

- `disclosure.html` stays **collapsed** on load — the only state from which both
  halves of the interaction can be exercised in one pass.
- `alert.html` keeps **exactly one** alert on load — its dismissal cases rely on
  `locate: role "alert"` resolving to a single element.
- `accordion.html` keeps collapsing the open panel **closing** it — the opposite
  of the always-open variant. These two genuinely cannot share a page.
- `tabs.html` stays on **automatic** activation — its cases assert selection
  follows focus, which is the opposite of the manual page — and keeps **three**
  tabs, because `tabs-keyboard-nav` arrows onto Tab 3, wraps past it and
  activates it, so a fourth tab breaks the wrap. All three tabs pages name the
  tablist **"Sample Tabs"**: APG asks for a labelled tablist, and keeping the
  name identical across them means a case that locates the tablist by name works
  against whichever page it is pointed at.
- `toolbar.html` stays **horizontal** for `toolbar-keyboard-nav`'s Left/Right
  roving; `Toolbar` binds one axis per orientation.
- `listbox.html` keeps a **single** listbox. apg-qa's option counts and locators
  run unscoped against the whole page, so a second listbox's options would
  inflate the count `listbox-aria-state` asserts.
- `switch.html` keeps a **single** switch, for the same reason and more sharply:
  the six runner repos address it by unscoped selector — `[role=switch]`,
  `.switch-label-text`, `.switch-control .switch` — not by accessible name. A
  second switch of _any_ name breaks them, so naming it distinctly does not
  help. Measured: adding one took apg-playwright from 8/8 to 2/8 (strict mode
  throws on the two matches) and apg-cypress to 6/8 (`.switch-label-text` reads
  as the concatenation `"NotificationsAirplane Mode"`). The disabled state is
  `switch-disabled.html` instead.
- `carousel.html` stays **looping**, and keeps its slide status **off**. The two
  are one decision: apg-playwright and apg-cypress both assert on this page that
  "Next from the last slide wraps forward and Previous from the first wraps
  back", which is the exact behaviour the non-looping page inverts, so those two
  states contradict each other and cannot share a URL. A second carousel on the
  page is no better than a second switch — the runner specs address this one by
  unscoped selector too (`[role="region"][aria-roledescription="carousel"]`,
  `[aria-label="Previous slide"]`, `[aria-label="Select slide N"]`), so a second
  carousel of any name gives each of them two matches. The status stays off
  because it is a live region and this page auto-rotates, which would make it
  announce slide changes nobody asked for.
- `menubar.html` keeps File > Save As **`aria-disabled`** — `menubar-error`
  depends on it. Unlike the switch case this one is safe to carry on the default
  page: a disabled menuitem stays focusable and in the roving tabindex, so every
  case that walks or wraps the File submenu is unaffected, and the runner repos'
  menubar specs activate "New" rather than the last item. Verified at 21/21.

## Page naming

Slugs follow `AFixt/apg-gherkin`, the canonical pattern list, which `apg-qa`
already matches: `radiogroup`, `treeview`, `treegrid`, `multithumb-slider`,
`menu-button`, `modal-dialog`, `alertdialog`. Note these differ from this repo's
`usecases/` directory names (`radio-group`, `tree-view`, `tree-grid`,
`slider-multi-thumb`), which address Storybook stories rather than these pages.

## Adding a demo

1. `demos/<slug>.html` — copy an existing shell; change only the `<title>` and
   the `<script src>`.
2. `demos/src/<slug>.tsx` — import the component, render it inside
   `<main className="demo-page">`, end with `mount(<XDemo />)`.

Both the Vite entry list and the index page are read from disk, so no
registration step is needed.

Content should use the accessible names the corresponding
`apg-qa/use-cases/<pattern>/*.uc.yaml` files expect, as long as doing so still
produces a faithful demo; otherwise mirror the component's Storybook story.

## Layout

```text
demos/
├── README.md
├── demos.css          layout only — never colour, so a demo cannot mask a
│                      component's own presentation
├── index.html         page index, enumerated from disk
├── <slug>.html        one HTML shell per pattern
└── src/
    ├── mount.tsx      shared bootstrap
    └── <slug>.tsx     one demo module per pattern
```

Demo modules are typechecked by `tsconfig.demos.json` (folded into
`npm run typecheck`) rather than `tsconfig.json`, which the Rollup library build
reads — demos must not end up in `dist/`.
