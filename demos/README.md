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
