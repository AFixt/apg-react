# Changelog

All notable changes to this project are documented in this file.

This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-08-03

### Fixed

- **Package no longer requires `react-router-dom`.** `Link` and `Breadcrumb`
  imported it at the top level, so the built bundle did
  `require('react-router-dom')` unconditionally and importing `@afixt/apg-react`
  threw `Cannot find module 'react-router-dom'` for anyone who had not installed
  a router — despite the package declaring the dependency as optional. Both
  components now render a plain `<a href>` by default and the library has no
  router dependency at all. Affected 1.2.0 and 1.3.0.
- **`package.json` is now reachable via the `exports` map**
  (`"./package.json"`), which some tooling reads directly.
- **`Link` now invokes `onClick` for pointer activation.** The handler was only
  called from the keydown handler on Enter and was never attached to the
  rendered element, so keyboard users got the callback and mouse users did not.
  `onClick` is now attached to both the injected `linkComponent` and the
  plain-anchor fallback. The Enter special case was removed at the same time:
  native anchors already synthesise a click from Enter, so keeping both paths
  would have fired the callback twice in a real browser.
- **`Link` no longer intercepts Shift+F10.** The component cancelled the keydown
  without implementing anything, so the only possible effect was suppressing the
  browser's native context menu — the keyboard equivalent of right-click. `Link`
  now adds no keyboard handling at all; focus, Enter activation, and the context
  menu all come from the underlying anchor.
- **`Link` no longer discards a consumer's `onKeyDown`.** It was overwritten by
  the component's own handler, despite the documented contract that extra props
  are forwarded verbatim. With the internal handler gone, `onKeyDown` reaches
  the anchor like any other prop.
- **`linkComponent={null}` now forces a plain anchor.** The prop was typed to
  accept `null`, but the resolution used `??`, so an explicit `null` fell
  through to the provider and there was no way to opt a single link out of a
  router. Omitting the prop still defers to the provider.
- **`Link` and `Breadcrumb` no longer render `href=""`.** A `to` that flattens
  to an empty string now falls back to `'#'`; `href=""` resolves to the current
  page, which is a silently wrong link rather than an obviously inert one.
- **`Link`'s styles now actually apply.** Every rule in `Link.css` was scoped to
  `a[role='link']`, but the component renders a native `<a href>` whose `link`
  role is implicit, so the attribute selector never matched and the whole
  stylesheet was inert — in both the old react-router path and the current
  plain-anchor one. The component now adds a `link` class and the stylesheet
  targets that. There was no accessibility regression, because the unmatched
  `outline: none` left the browser's default focus ring standing, but the
  intended `--apg-focus-ring` never rendered. Restoring the match required a
  class rather than an explicit `role="link"`, which was removed as redundant
  ARIA in 1.2.0 and stays removed.
- **Focus indicators are visible again in forced-colors mode.** 25 of the 26
  component stylesheets removed the focus outline and drew a `box-shadow` ring
  instead. Forced colors (Windows High Contrast Mode) suppresses `box-shadow`
  outright, and the `outline: none` beside it had already removed the UA ring
  that would have covered for it — so focusing any of these components in WHCM
  showed no indicator at all. A WCAG 2.2 2.4.7 Focus Visible (A) failure.
  `MenuButton`'s menu items and `Menubar`'s were worse still: they carry no
  focus shadow at all and signalled focus purely by swapping background and text
  colour, which forced colors also overrides. Every one of the 33 outline
  removals now has a `@media (forced-colors: active)` rule restoring a real
  outline.
- **`Article`'s styles now actually apply.** Every rule in `Article.css` targets
  a `.article` class and the component rendered a bare `<article>` with no
  className, so the whole stylesheet was inert — as was the `.feed .article`
  half of `Feed.css`, meaning articles inside a `Feed` rendered with no border,
  padding, background or shadow. Same defect `Link` had, above. The component
  now renders the class.
- **Reduced-motion preferences are now honoured.** Every
  `@media (prefers-reduced-motion: reduce)` block in the library was written
  immediately above the rule it was meant to override. A media query adds no
  specificity, so at equal specificity the later rule won on source order and
  the opt-out did nothing: users who asked for reduced motion still got every
  transition, and the indeterminate `Progressbar` kept looping. All 33 blocks
  now follow the rules they override. Transitions on transforms that encode
  state — the `Carousel`'s slide position, the `Disclosure` chevron, the
  `ModalDialog` entry offset, the `RadioGroup` dot, the `Switch` knob — are
  suppressed without removing the transform itself, so those state changes
  become instant rather than breaking.

### Added

- **`LinkComponentProvider`** — supplies the component `Link` and `Breadcrumb`
  render links with, for client-side navigation. Both components also accept a
  `linkComponent` prop, which takes precedence over the provider. See the
  README's "Router integration" section.
- Regression test that packs the tarball and loads it in an isolated directory
  containing only `react` and `react-dom`, so the router dependency cannot creep
  back in unnoticed.

### Changed

- **`Link` renders with a `link` class.** This is a small public API addition:
  `.link` is the supported hook for overriding the component's styles. A
  `className` passed by a consumer is appended to it rather than replacing it,
  so passing one no longer needs to restate the component's own styles. Anyone
  whose stylesheet targets `a[role='link']` to override `Link` was overriding
  nothing — those rules never matched either — and should move to `.link`.
- **`Article` renders with an `article` class**, for the same reason and with
  the same consequence: `.article` is the supported hook for overriding its
  styles. Note that this makes `Article.css` and the `.feed .article` rules in
  `Feed.css` take effect for the first time, so articles will look different —
  they gain the border, padding, background and shadow those rules always
  intended. Anyone who styled `Article` by element selector to compensate for
  the missing styling should re-check their overrides.
- **Breaking for router users**: `Link` and `Breadcrumb` no longer use React
  Router automatically. Wrap your app in
  `<LinkComponentProvider value={RouterLink}>` (or pass `linkComponent`) to keep
  client-side navigation; otherwise these components now trigger full page
  loads.
- Removed the `peerDependenciesMeta` entry for `react-router-dom`. It is no
  longer a peer dependency in any form.
- `Link`'s `to` prop is typed as `string | { pathname?, search?, hash? }`
  instead of `string | object`. This matches React Router's `Partial<Path>`;
  arbitrary objects are now a type error.
- `Link`'s `onClick` is typed `(e: React.MouseEvent) => void` instead of
  `(e: React.MouseEvent | React.KeyboardEvent) => void`. It now always receives
  a click event, including when activation came from Enter.
- The shared link-resolution module moved from `components/internal/` to
  `components/_internal/`, matching the directory the project already used for
  internal helpers. Import paths in the public API are unchanged —
  `LinkComponentProvider` and its types are still exported from the package
  root.

## [1.3.0] — 2026-07-30

### Fixed

- **AlertDialog / ModalDialog**: Tab no longer escapes the dialog. The focus
  trap was driven by `focus` events, which never fire when Tab moves focus to
  `document.body` — the browser's fallback when there is nothing focusable after
  the dialog. Both dialogs now handle Tab in `keydown` and cycle focus through
  their focusable descendants via a shared `cycleFocusInDialog` helper
  (`components/_internal/dialog-focus.ts`).
- **AlertDialog / ModalDialog**: Closing now reliably returns focus to the
  invoking element. The focus trap was still active during close and pulled
  focus straight back into the dialog; it is now suppressed for the duration of
  the close.

### Added

- **Use-case suite**: 174 `.uc.yaml` files under `usecases/`, one discrete user
  interaction per file, written in the `@afixt/usecase-runner` DSL and targeting
  each component's Storybook story. Run via the runner (which generates
  Playwright specs) rather than Jest.
- **Lint, format, and typecheck infrastructure**: ESLint 9 flat config
  (`eslint.config.js`), Prettier, Stylelint, `markdownlint-cli2`, commitlint,
  Husky hooks, lint-staged, jscpd duplicate detection, size-limit budgets, and a
  production license allowlist. New scripts include `typecheck`, `lint`,
  `format`, `format:check`, `stylelint`, `dupes`, `size`, `license:check`,
  `check`, and `check:all`.
- **Security scanning**: TruffleHog (verified secrets only), OSV-Scanner,
  Semgrep, and `npm audit --omit=dev --audit-level=high`, wired into a new
  scheduled `security.yml` workflow and a TruffleHog job in CI. A scheduled
  `docs.yml` workflow runs a Lychee link check over the Markdown.
- **Architecture Decision Records**: `docs/adr/0001`–`0008` record the tooling
  decisions taken here (Jest over Vitest, Puppeteer over Playwright, Rollup for
  the library build, the accessibility assertion strategy, ESLint rule
  calibration, security scan placement, and the deferred release workflow),
  alongside `docs/templates/` and `scripts/bootstrap.sh`.
- **JSDoc on every component**, with `jsdoc/require-jsdoc` re-enabled to keep it
  that way.

### Changed

- **Node ≥ 22.13.0 is now required** (`engines.node`). The CI matrix moved from
  Node 18 + 20 to Node 22 + 24.
- **Stricter TypeScript**: `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride`,
  `noFallthroughCasesInSwitch`, `noImplicitReturns`, `noUnusedLocals`,
  `noUnusedParameters`, `isolatedModules`, `allowUnreachableCode: false`, and
  `allowUnusedLabels: false`. `components/**/*.ts` and `types/**/*.d.ts` are now
  included in the program.
- **axe-core removed and blocked.** `eslint-plugin-jsx-a11y` — the sole source
  of axe-core in the dependency tree — was removed and stripped from the ESLint
  config, and `package.json` now declares an override redirecting `axe-core` to
  an empty package so it cannot reappear transitively.
- Dependency upgrades (all dev-only): `react-router-dom` 6 → 7, Jest 29 → 30,
  `jest-environment-jsdom` 29 → 30, `@testing-library/react` 14 → 16, Puppeteer
  21 → 24, and `@rollup/plugin-commonjs` 26 → 29. Removed the unused
  `@rollup/plugin-babel` and `eslint-plugin-n`.
- The whole source tree was reformatted by Prettier (single quotes, 100-column
  wrap) and organised by `prettier-plugin-organize-imports`. Component behaviour
  is unchanged apart from the dialog fixes above; snapshots were updated to
  match.
- CI now runs typecheck, ESLint, Stylelint, Prettier, markdownlint, jscpd, the
  license allowlist, and `npm audit` before the test steps. Markdown linting is
  no longer `continue-on-error`. The obsolete `node.js.yml` workflow was
  removed.
- Dependabot version updates were disabled (`dependabot.yml` removed).

## [1.2.0] — 2026-04-16

### Fixed

- **AlertDialog**: Added focus trap, focus return to invoking element, initial
  focus on close button, unique IDs via `useId()`.
- **Button**: Removed redundant `role="button"` and `aria-disabled` on native
  `<button>`; replaced hardcoded `aria-haspopup` with configurable
  `ariaHaspopup` prop.
- **Carousel**: Added required `ariaLabel` prop; replaced `disabled` selector
  buttons with `aria-current="true"` (preserves focus); DOM order now matches
  visual order.
- **Disclosure**: Unique content IDs via `useId()` (was hardcoded, broke with
  multiple instances).
- **Feed**: Now passes `ariaPosinset`/`ariaSetsize` to Article children; added
  `ariaLabel` prop.
- **Link**: Removed redundant `role="link"` and `tabIndex={0}` on native `<a>`.

### Changed

- **ModalDialog**: Renamed `ariaLabel` prop to `ariaLabelledby` (it accepts an
  element ID, not a label string). **Breaking** for consumers who used
  `ariaLabel` — rename to `ariaLabelledby`.
- **Switch**: Replaced `<label>` wrapper with `<span id>` + `aria-labelledby` on
  the switch.
- **CheckboxGroup**: Unique group label IDs via `useId()`.
- **MenuButton**: Menu popup uses `aria-labelledby` referencing the trigger
  button.
- **Menubar**: Submenus use `aria-labelledby` referencing their parent bar item.
- **Combobox**: Popup listbox gets `aria-labelledby` referencing the input.
- **Tabs**: Bootstrap 5 nav-tabs styling.
- **TreeView / TreeGrid**: Larger chevron carets.

## [1.1.0] — 2026-04-16

### Changed

- **TypeScript conversion**: All 31 components rewritten from `.jsx` + PropTypes
  to `.tsx` with native TypeScript interfaces. Barrel file renamed `index.js` →
  `index.ts`. Rollup now generates `.d.ts` declarations from source via
  `@rollup/plugin-typescript` (replaces the hand-written `index.d.ts`).
  `prop-types` is no longer a runtime dependency.

### Added

- **i18n support**: Components with hardcoded user-facing strings now accept an
  optional `labels` prop to override any string for translation. Affected: Alert
  (`dismiss`), Breadcrumb (`nav` + standalone `navLabel` prop), Carousel
  (`previousSlide`, `nextSlide`, `pauseRotation`, `startRotation`,
  `selectSlide`), ModalDialog (`closeDialog`), Spinbutton (`increaseValue`,
  `decreaseValue`). English defaults preserved when `labels` is omitted.

## [1.0.0] — 2026-04-15

### Added

- **31 components** covering the full WAI-ARIA Authoring Practices Guide pattern
  catalog: Accordion, Alert, AlertDialog, Article, Breadcrumb, Button, Carousel,
  Checkbox, CheckboxGroup, Combobox (`none` / `list` / `both` variants),
  Disclosure, Feed, Grid, Link, Listbox (single + multi-select), MenuButton,
  Menubar, Meter, ModalDialog, Progressbar, RadioGroup, Slider,
  SliderMultiThumb, Spinbutton, Switch, Tabs (automatic + manual activation,
  horizontal + vertical), Textbox, Toolbar, Tooltip, TreeGrid, TreeView.
- **Bootstrap-inspired design tokens** in `variables.css` — colors, spacing,
  radii, typography, focus ring, shadows, z-index layers. Every visual choice is
  token-driven and overridable.
- **TypeScript declarations** (hand-written `index.d.ts`, later replaced by
  auto-generated declarations in v1.1.0).
- **295 unit tests** across 32 suites (~92% statement coverage).
- **37 accessibility-contract tests** built on a hand-rolled, zero-dependency
  ARIA DOM assertion helper.
- **End-to-end tests** driving real Chromium via Puppeteer against a built
  Storybook, covering accessible-name resolution, `aria-*` id resolution,
  boolean-attribute grammar, and Tab reachability.
- **Storybook** with `play` functions on every story (populates the Interactions
  panel).

### Notes

- No external accessibility libraries are used (no `axe-core`, no `jest-axe`, no
  `addon-a11y`). Every accessibility assertion in this codebase is implemented
  from first principles against the DOM.
- Peer dependency on `react-router-dom` is optional and only required for `Link`
  and `Breadcrumb`.
