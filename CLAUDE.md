# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

APG-React is a React component library implementing the [WAI-ARIA Authoring Practices Guide (APG) patterns](https://www.w3.org/WAI/ARIA/apg/patterns/). Each component faithfully reproduces the keyboard interaction, ARIA attributes, and roles specified by the APG.

The library ships **31 components** with full TypeScript declarations, Storybook demos, and three test layers (unit, accessibility, E2E).

## Commands

- **Run all tests:** `npm test`
- **Run all tests and update snapshots:** `npm test -- -u`
- **Run a single test file:** `npm test -- __tests__/accordion.test.js`
- **Run tests matching a name:** `npm test -- -t "Accordion Component"`
- **Run E2E tests:** `npm run test:e2e` (requires a pre-built `storybook-static/`)
- **Run E2E tests (with build):** `npm run test:e2e:build`
- **Run all test layers:** `npm run test:all`
- **Start Storybook:** `npm run storybook` (http://localhost:6006)
- **Build Storybook:** `npm run build-storybook`
- **Build library:** `npm run build` (produces `dist/` with CJS, ESM, CSS, and `.d.ts`)
- **Lint markdown:** `npm run markdownlint`

## Architecture

### Component structure
Each component lives in `components/<Name>/` with up to three files:
- `<Name>.jsx` — React functional component
- `<Name>.css` — Component styles (consumed via CSS custom properties from `variables.css`)
- `<Name>.stories.jsx` — Storybook stories with `play` functions for the Interactions panel

All component CSS files are aggregated in `components/styles.css`.

### State management
Components fall into two patterns:
- **Externally controlled** — receive all state and callbacks as props (e.g., `Accordion` takes `openIndex` + `toggleItem`; the parent owns the state).
- **Internally stateful** — manage their own interaction state via React hooks (`useState`, `useRef`, `useEffect`). Most newer components (Tabs, RadioGroup, Combobox, TreeView, Grid, etc.) follow this pattern and accept optional controlled-value props.

No external state libraries are used. CSS is imported directly into JSX files.

### Entry point and packaging
- `index.js` — barrel file that re-exports all 31 components by name.
- `index.d.ts` — hand-written TypeScript declarations for every component and prop interface.
- `rollup.config.js` — produces `dist/index.cjs.js`, `dist/index.esm.js`, `dist/styles.css`, and copies `index.d.ts` into `dist/`.
- Package `exports` map exposes `"."` (component JS + types), `"./styles.css"`, and `"./variables.css"`.

### Testing
Three layers, all runnable locally:

1. **Unit tests** (`__tests__/<name>.test.js`) — Jest + React Testing Library + jest-dom matchers. Cover ARIA attributes, keyboard interaction, and snapshot matching. 295 tests across 32 suites.
2. **Accessibility contract tests** (`__tests__/accessibility.test.js`) — 37 tests using a custom assertion helper (`__tests__/helpers/a11y.js`) that validates accessible names, ARIA id references, boolean state grammar, roving tabindex, and label association. Zero external a11y libraries.
3. **E2E tests** (`e2e/*.e2e.js`) — Puppeteer drives a real Chromium against a built Storybook. Separate Jest config at `e2e/jest.config.js`.

Configuration:
- Jest is configured in `jest.config.js` with `jsdom` test environment. The `jest-puppeteer` preset is NOT used for unit tests; E2E uses its own config.
- CSS imports are mocked via `__mocks__/styleMock.js`.
- Babel transpiles JSX via `@babel/preset-env` + `@babel/preset-react`.
- Test file pattern: `**/__tests__/**/*.test.[jt]s?(x)` (helper files in `__tests__/helpers/` are excluded).

### CI
GitHub Actions workflow at `.github/workflows/ci.yml`:
- Runs on push/PR to `main` and `develop`.
- Matrix: Node 18 + 20.
- Steps: install, lint markdown, unit + a11y tests, build library, build Storybook, E2E tests.
- Auto-deploys Storybook to GitHub Pages on merges to `main`.

### Git workflow
- `develop` is the integration branch; PRs target `develop`.
- `main` is the release branch.

## Key Conventions

- Every component must implement its corresponding APG pattern's keyboard interaction model (Arrow keys, Home, End, Enter, Space, Escape, Tab as applicable).
- Every component must have correct ARIA roles, states, and properties (`aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"`, etc.).
- Components use index-based or id-based IDs for ARIA relationships (e.g., `accordion-header-${index}`, `panel-${index}`).
- Some accessibility requirements (contrast, labeling, focus restoration on dialog close) are left to implementers — documented in the README "Implementer responsibilities" section.
- No external accessibility testing libraries (axe-core, jest-axe, cypress-axe, addon-a11y, @axe-core/*) are permitted in this project.
