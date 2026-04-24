# apg-react

[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/@afixt/apg-react)](https://www.npmjs.com/package/@afixt/apg-react)
[![Storybook](https://img.shields.io/badge/storybook-live%20demo-ff4785)](https://afixt.github.io/apg-react/)

**Accessible React components implementing every pattern in the
[W3C ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/).**

Each component ships with the full APG keyboard-interaction model, correct ARIA
roles and state, focus management, and a Bootstrap-flavored visual default you
can restyle via CSS custom properties. Written in TypeScript with full type
declarations. All user-facing strings are translatable via an optional `labels`
prop.

## Why

Most component libraries treat accessibility as a checklist. This library treats
the APG as the specification. Every component is tested against the APG's
keyboard model, ARIA contract, and focus-management requirements — with **295
unit tests**, **37 dedicated accessibility-contract tests**, and **E2E tests
driving a real browser**. Every assertion is implemented from first principles
against the DOM.

## Install

```sh
npm install @afixt/apg-react
```

Peer dependencies:

- `react` ≥ 18
- `react-dom` ≥ 18
- `react-router-dom` ≥ 6 _(optional — only required if you use `<Link>` or
  `<Breadcrumb>`)_

## Quick start

```tsx
import { Button, Accordion, ModalDialog } from '@afixt/apg-react';
import '@afixt/@afixt/apg-react/styles.css'; // full baseline styles
// or, to cherry-pick tokens only:
// import '@afixt/@afixt/apg-react/variables.css';

function App() {
  return <Button label="Save" action={() => save()} />;
}
```

Components are tree-shakeable; only what you import will land in your bundle.

## Components

Components are organized by the APG pattern they implement. Follow each link for
the official APG documentation.

### Widgets

| Component          | APG pattern                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| `Accordion`        | [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)                                                |
| `Alert`            | [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                                                        |
| `AlertDialog`      | [Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)                                           |
| `Breadcrumb`       | [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)                                              |
| `Button`           | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)                                                      |
| `Carousel`         | [Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)                                                  |
| `Checkbox`         | [Checkbox (dual & tri-state)](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)                               |
| `CheckboxGroup`    | [Checkbox — parent/child mixed state](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)                       |
| `Combobox`         | [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) — supports `none`, `list`, `both`                |
| `Disclosure`       | [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)                                              |
| `Feed`             | [Feed](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)                                                          |
| `Grid`             | [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)                                                          |
| `Link`             | [Link pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/) _(requires `react-router-dom`)_                  |
| `Listbox`          | [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) — single & multi-select                            |
| `MenuButton`       | [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)                                            |
| `Menubar`          | [Menu / Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)                                             |
| `Meter`            | [`role=meter`](https://w3c.github.io/aria/#meter)                                                               |
| `ModalDialog`      | [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                        |
| `Progressbar`      | [`role=progressbar`](https://w3c.github.io/aria/#progressbar)                                                   |
| `RadioGroup`       | [Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)                                                  |
| `Slider`           | [Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)                                                      |
| `SliderMultiThumb` | [Slider (Multi-Thumb)](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/)                             |
| `Spinbutton`       | [Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)                                              |
| `Switch`           | [Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)                                                      |
| `Tabs`             | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — automatic or manual activation, horizontal or vertical |
| `Textbox`          | [`role=textbox`](https://w3c.github.io/aria/#textbox) — single- and multi-line                                  |
| `Toolbar`          | [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)                                                    |
| `Tooltip`          | [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)                                                    |
| `TreeGrid`         | [Tree Grid](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/)                                                 |
| `TreeView`         | [Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)                                                 |

### Structural

| Component | Purpose                                                                     |
| --------- | --------------------------------------------------------------------------- |
| `Article` | Semantic `<article>` with heading + posinset/setsize for use inside `Feed`. |

## Keyboard reference

Every component implements the full keyboard model specified by its APG pattern.
Highlights:

- **Roving tabindex** where the pattern calls for it: `RadioGroup`, `Toolbar`,
  `Tabs`, `Grid`, `TreeView`, `TreeGrid`, `Menubar`, `Listbox`.
- **`aria-activedescendant`** for virtual focus: `Combobox`.
- **Focus return** on dialog dismiss: `ModalDialog`, `AlertDialog`,
  `MenuButton`, `Menubar`.
- **Escape** closes popups: `ModalDialog`, `AlertDialog`, `MenuButton`,
  `Menubar`, `Combobox`, `Tooltip`.

Explore the [live Storybook demo](https://afixt.github.io/apg-react/) or run
`npm run storybook` locally to see every keyboard path with step-by-step `play`
interactions.

## Styling

The package ships two CSS files:

- `@afixt/apg-react/styles.css` — full baseline styles for every component.
- `@afixt/apg-react/variables.css` — only the design tokens, if you want to
  write your own styles.

All visual choices are driven by CSS custom properties defined in
`variables.css`. Override them at `:root` or at a container scope:

```css
:root {
  --apg-color-primary: #7c3aed;
  --apg-radius-md: 0.25rem;
  --apg-font-family: 'Inter', system-ui, sans-serif;
}
```

Key token groups: colors (`--apg-color-*`), spacing (`--apg-space-*`), radii
(`--apg-radius-*`), typography (`--apg-font-*`), focus ring
(`--apg-focus-ring-*`), shadows (`--apg-shadow-*`), z-index (`--apg-z-*`).

## Internationalization (i18n)

Components that render hardcoded user-facing strings (aria-labels, button text)
accept an optional `labels` prop — an object whose keys map to English defaults.
Pass your own translations without forking:

```tsx
<Alert message="Saved" type="info" labels={{ dismiss: "Fermer" }} />
<Carousel slides={slides} labels={{ previousSlide: "Anterior", nextSlide: "Siguiente" }} />
<ModalDialog isOpen onClose={close} labels={{ closeDialog: "Cerrar" }}>…</ModalDialog>
<Spinbutton min={0} max={10} labels={{ increaseValue: "Erhöhen", decreaseValue: "Verringern" }} />
<Breadcrumb items={items} navLabel="Fil d'Ariane" />
```

When `labels` is omitted, the English defaults are used. Only the keys you
override are affected; the rest keep their defaults.

## Implementer responsibilities

A handful of concerns must be satisfied by you — they cannot be handled at the
library level:

- **Visible focus indicators.** The default focus ring uses a soft box-shadow;
  ensure your brand palette preserves ≥3:1 contrast against the background.
- **Color contrast.** If you override tokens, verify WCAG 1.4.3 (4.5:1 for text)
  and 1.4.11 (3:1 for UI).
- **External labels.** Where a component exposes `ariaLabelledby`, make sure the
  referenced element exists and carries a meaningful name.
- **Focus restoration on unmount.** Dialog components return focus to the
  invoking element when dismissed, but if you unmount them imperatively,
  re-establish focus yourself.
- **Live regions for dynamic content.** Components that produce their own
  `role=alert` / `role=status` fire announcements; adjacent dynamic content you
  write still needs its own live region.

## Testing

```sh
npm test               # unit + a11y contract suite (jsdom)
npm run test:e2e:build # builds Storybook, runs Puppeteer E2E tests
npm run test:all       # both
```

- **295 unit tests** across 32 suites; 92%+ statement coverage.
- **37 accessibility-contract tests** built on a hand-rolled ARIA-aware DOM
  assertion library — no external a11y libraries of any kind.
- **E2E tests** drive a real Chromium against a built Storybook: accessible-name
  presence, `aria-*` id resolution, ARIA boolean grammar, Tab reachability.

## Development

```sh
# First-time setup: installs optional binaries (gitleaks, lychee, etc.)
# used by git hooks. Safe to re-run.
bash scripts/bootstrap.sh

npm install
npm run storybook     # http://localhost:6006
npm test
npm run build         # produces dist/
```

### Quality gates

Every PR runs the same gates locally and in CI. Run them all with one command:

```sh
npm run check:all
```

which runs, in order: `typecheck` → `lint` → `stylelint` → `format:check` →
`markdownlint` → `test` → `dupes` → `license:check` → `build` → `size` →
`security:audit`.

Individual gates:

```sh
npm run typecheck     # tsc --noEmit with strict + noUncheckedIndexedAccess
npm run lint          # ESLint flat config (components + tests + stories)
npm run stylelint     # Stylelint on all CSS (incl. a11y rules)
npm run format        # Prettier --write
npm run format:check  # Prettier --check (CI gate)
npm run markdownlint  # markdownlint-cli2 on all Markdown
npm run dupes         # jscpd duplicate detection
npm run license:check # production-dep license allowlist
npm run size          # size-limit bundle budgets
npm run security      # npm audit + OSV-Scanner + gitleaks
```

Git hooks (installed automatically via Husky's `prepare` script):

- **pre-commit** — lint-staged (ESLint, Prettier, Stylelint, markdownlint on
  staged files only) + typecheck of staged TS + gitleaks.
- **commit-msg** — commitlint with `@commitlint/config-conventional`.
- **pre-push** — runs the full `check` suite + tests + `dupes` +
  `license:check` + optional link check.
- **post-merge** — reinstall + `npm audit` when `package-lock.json` changes
  after a pull.

Bypass a hook with `--no-verify` (use sparingly).

Scheduled workflows:

- **`.github/workflows/security.yml`** (Mondays 06:00 UTC) — CodeQL,
  OSV-Scanner, Semgrep OWASP Top 10, npm audit.
- **`.github/workflows/docs.yml`** (Mondays 07:00 UTC) — lychee link check
  across Markdown.

See `docs/adr/` for tooling decisions (why Jest not Vitest, why Rollup not Vite,
etc.).

## Contributing

Issues and PRs are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Versioning

This library follows [Semantic Versioning](https://semver.org). Breaking changes
land in major releases; new components and opt-in features in minor; fixes in
patch. See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT © [AFixt, Inc.](https://www.afixt.com) — see [LICENSE](./LICENSE).
