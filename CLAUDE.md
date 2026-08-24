# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

APG-React is a React component library implementing the
[WAI-ARIA Authoring Practices Guide (APG) patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).
Each component faithfully reproduces the keyboard interaction, ARIA attributes,
and roles specified by the APG.

The library ships **32 components** with full TypeScript declarations, Storybook
demos, and four test layers (unit, accessibility, stylesheet, E2E).

## Commands

- **Run all tests:** `npm test`
- **Run all tests and update snapshots:** `npm test -- -u`
- **Run a single test file:** `npm test -- __tests__/accordion.test.js`
- **Run tests matching a name:** `npm test -- -t "Accordion Component"`
- **Run E2E tests:** `npm run test:e2e` (requires a pre-built
  `storybook-static/`)
- **Run E2E tests (with build):** `npm run test:e2e:build`
- **Run all test layers:** `npm run test:all`
- **Start Storybook:** `npm run storybook` (<http://localhost:6006>)
- **Build Storybook:** `npm run build-storybook`
- **Build library:** `npm run build` (produces `dist/` with CJS, ESM, CSS, and
  `.d.ts`)
- **Lint markdown:** `npm run markdownlint`

## Architecture

### Component structure

Each component lives in `components/<Name>/` with up to three files:

- `<Name>.tsx` — React functional component (TypeScript)
- `<Name>.css` — Component styles (consumed via CSS custom properties from
  `variables.css`)
- `<Name>.stories.jsx` — Storybook stories with `play` functions for the
  Interactions panel

All component CSS files are aggregated in `components/styles.css`.

### State management

Components fall into two patterns:

- **Externally controlled** — receive all state and callbacks as props (e.g.,
  `Accordion` takes `openIndex` + `toggleItem`; the parent owns the state).
- **Internally stateful** — manage their own interaction state via React hooks
  (`useState`, `useRef`, `useEffect`). Most newer components (Tabs, RadioGroup,
  Combobox, TreeView, Grid, etc.) follow this pattern and accept optional
  controlled-value props.

No external state libraries are used. CSS is imported directly into TSX files.

### Entry point and packaging

- `index.ts` — barrel file that re-exports all 32 components by name.
- `rollup.config.mjs` — uses `@rollup/plugin-typescript` to compile TSX and
  auto-generate `.d.ts` declarations into `dist/`.
- Produces `dist/index.cjs.js`, `dist/index.esm.js`, `dist/styles.css`, and
  per-component `.d.ts` files.
- Package `exports` map exposes `"."` (component JS + types), `"./styles.css"`,
  and `"./variables.css"`.
- `tsconfig.json` — TypeScript configuration (strict mode, ES2018 target, JSX
  react).

### Testing

Four layers run under Jest, plus a use-case suite driven by an external runner:

1. **Unit tests** (`__tests__/<name>.test.js`) — Jest + React Testing Library +
   jest-dom matchers. Cover ARIA attributes, keyboard interaction, and snapshot
   matching. 295 tests across 32 suites.
2. **Accessibility contract tests** (`__tests__/accessibility.test.js`) — 37
   tests using a custom assertion helper (`__tests__/helpers/a11y.js`) that
   validates accessible names, ARIA id references, boolean state grammar, roving
   tabindex, and label association. Zero external a11y libraries.
3. **Stylesheet contract tests** (`__tests__/forcedColors.test.js`,
   `__tests__/reducedMotion.test.js`) — 35 tests that read the component CSS as
   text via `__tests__/helpers/css.js` and enforce cascade relationships neither
   jsdom nor stylelint can see: a removed focus outline must have a
   `forced-colors` replacement, and a `prefers-reduced-motion` block must sit
   after the rule it overrides or it loses on source order.
4. **E2E tests** (`e2e/*.e2e.js`) — Puppeteer drives a real Chromium against a
   built Storybook. 165 tests across 10 suites. Separate Jest config at
   `e2e/jest.config.js`.
5. **Use cases** (`usecases/<component>/*.uc.yaml`) — one discrete user
   interaction per file in the DSL of `@afixt/usecase-runner`. Targets each
   component's Storybook story and is meant to be run via the runner (which
   generates Playwright specs) rather than Jest. Validate without running:
   `npx --yes @afixt/usecase-runner validate usecases/`.

Configuration:

- Jest is configured in `jest.config.js` with `jsdom` test environment. The
  `jest-puppeteer` preset is NOT used for unit tests; E2E uses its own config.
- CSS imports are mocked via `__mocks__/styleMock.js`.
- Babel transpiles TSX via `@babel/preset-env` + `@babel/preset-react` +
  `@babel/preset-typescript`.
- Test file pattern: `**/__tests__/**/*.test.[jt]s?(x)` (helper files in
  `__tests__/helpers/` are excluded).

### CI

GitHub Actions workflow at `.github/workflows/ci.yml`:

- Runs on push/PR to `main` and `develop`.
- Matrix: Node 22 + 24.
- Steps: install, lint markdown, unit + a11y tests, build library, build
  Storybook, E2E tests.
- Auto-deploys Storybook to GitHub Pages on merges to `main`.

### Git workflow

- `develop` is the integration branch; PRs target `develop`.
- `main` is the release branch.

## Key Conventions

- Every component must implement its corresponding APG pattern's keyboard
  interaction model (Arrow keys, Home, End, Enter, Space, Escape, Tab as
  applicable).
- Every component must have correct ARIA roles, states, and properties
  (`aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"`, etc.).
- Components use index-based or id-based IDs for ARIA relationships (e.g.,
  `accordion-header-${index}`, `panel-${index}`).
- Some accessibility requirements (contrast, labeling, focus restoration on
  dialog close) are left to implementers — documented in the README "Implementer
  responsibilities" section.
- No external accessibility testing libraries (axe-core, jest-axe, cypress-axe,
  addon-a11y, @axe-core/\*) are permitted in this project.
- Components with hardcoded user-facing strings (aria-labels, button text)
  expose an optional `labels` prop so consumers can provide translations.
  English defaults are always provided.

## axe-core is banned

**`axe-core` must never be used in this project — directly or transitively.**

- Do not add `axe-core` or any `@axe-core/*` package.
- Do not add any dependency that pulls in `axe-core` transitively — this
  includes `eslint-plugin-jsx-a11y`, `lighthouse` / `@lhci/cli`, `pa11y`,
  `@storybook/addon-a11y`, `jest-axe`, `cypress-axe`, and similar.
- Before adding any new dependency, verify with `npm ls axe-core` that it does
  not introduce axe-core into the tree. If it does, do not add it.
- Use `@afixt/a11y-assert` for accessibility checks instead.

As a backstop, `package.json` declares an override that redirects `axe-core` to
an empty package:

```json
"overrides": {
  "axe-core": "npm:empty-npm-package@1.0.0"
}
```

Never remove this override. It means that even if a future transitive dependency
requests `axe-core`, no axe-core code is installed — `npm ls axe-core` will show
`axe-core@npm:empty-npm-package`. The override is a safety net, not a licence to
add axe-dependent tooling: the rules above still apply.

## @afixt scoped packages & NPM_TOKEN

If this project installs any `@afixt/*` scoped packages, npm authentication is
handled by an **organization-level GitHub Actions secret** named `NPM_TOKEN`.
The org-level secret is **always** the one to use.

- Installing `@afixt/*` scoped packages should **not** return `404`. A `404`
  here is an authentication/token problem, not a missing package.
- If you do hit a `404`, remove any **repo-level** `NPM_TOKEN` secret — a
  repo-level token is likely stale and conflicts with the org-level secret.
- Do not override `NPM_TOKEN` per repository; always rely on the org-level
  secret.

## CI policy: no scheduled GitHub Actions

**No GitHub Actions workflow in this repository may use a `schedule:` (cron)
trigger, and no scheduled workflow that has been removed may be added back.**
This is a standing constraint, not a default to be traded away for convenience.

A timer-triggered check reports a problem hours or days after it entered the
codebase, attributes it to no one, and gets ignored. The same check run against a
pull request blocks the defect at the point of introduction.

### Rules

- No `on: schedule:` and no `- cron:` in any file under `.github/workflows/`.
- No `.github/dependabot.yml` — Dependabot is a scheduled updater and is covered
  by this policy. GitHub **security alerts** are event-driven notifications, not
  scheduled jobs, and remain enabled.
- Every check a scheduled job would have performed runs as a step in the
  pull-request pipeline instead:
  - Dependency vulnerability and freshness checks (`npm audit`, `npm outdated`,
    OWASP Dependency-Check) run on `pull_request`.
  - Static analysis (CodeQL and equivalents) runs on `pull_request`.
  - Link checking, docs linting, and content checks run on `pull_request`,
    path-filtered to the files that can break them.
  - SBOM generation runs in the release/publish pipeline — an SBOM is a build
    output, not a periodic report.
  - DAST scans (ZAP and equivalents) run against the PR preview environment or
    as a post-deploy gate, not against a static URL on a timer.
  - End-to-end suites run as a smoke subset on `pull_request` and as the full
    matrix on merge to the default branch — never nightly.
- `workflow_dispatch` is allowed. A manual, on-demand run is not a scheduled run.
- Event-driven triggers (`push`, `pull_request`, `release`, `repository_dispatch`,
  `workflow_call`) are allowed and preferred.
- Genuinely periodic *product* work — batch jobs, data pipelines, report
  generation — does not belong in GitHub Actions at all. Run it on real
  infrastructure with its own scheduler, alerting, and retries.

### If you think you need an exception

You do not add the cron. Raise it with the repository owner first.
