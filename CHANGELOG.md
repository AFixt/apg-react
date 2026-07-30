# Changelog

All notable changes to this project are documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-07-30

### Fixed

- **Package no longer requires `react-router-dom`.** `Link` and `Breadcrumb` imported it at the
  top level, so the built bundle did `require('react-router-dom')` unconditionally and importing
  `@afixt/apg-react` threw `Cannot find module 'react-router-dom'` for anyone who had not
  installed a router — despite the package declaring the dependency as optional. Both components
  now render a plain `<a href>` by default and the library has no router dependency at all.
  Affected 1.2.0 and 1.3.0.
- **`package.json` is now reachable via the `exports` map** (`"./package.json"`), which some
  tooling reads directly.
- **`Link` now invokes `onClick` for pointer activation.** The handler was only called from the
  keydown handler on Enter and was never attached to the rendered element, so keyboard users got
  the callback and mouse users did not. `onClick` is now attached to both the injected
  `linkComponent` and the plain-anchor fallback. The Enter special case was removed at the same
  time: native anchors already synthesise a click from Enter, so keeping both paths would have
  fired the callback twice in a real browser.
- **`Link` no longer intercepts Shift+F10.** The component cancelled the keydown without
  implementing anything, so the only possible effect was suppressing the browser's native context
  menu — the keyboard equivalent of right-click. `Link` now adds no keyboard handling at all;
  focus, Enter activation, and the context menu all come from the underlying anchor.
- **`Link` no longer discards a consumer's `onKeyDown`.** It was overwritten by the component's
  own handler, despite the documented contract that extra props are forwarded verbatim. With the
  internal handler gone, `onKeyDown` reaches the anchor like any other prop.
- **`linkComponent={null}` now forces a plain anchor.** The prop was typed to accept `null`, but
  the resolution used `??`, so an explicit `null` fell through to the provider and there was no way
  to opt a single link out of a router. Omitting the prop still defers to the provider.
- **`Link` and `Breadcrumb` no longer render `href=""`.** A `to` that flattens to an empty string
  now falls back to `'#'`; `href=""` resolves to the current page, which is a silently wrong link
  rather than an obviously inert one.

### Added

- **`LinkComponentProvider`** — supplies the component `Link` and `Breadcrumb` render links with,
  for client-side navigation. Both components also accept a `linkComponent` prop, which takes
  precedence over the provider. See the README's "Router integration" section.
- Regression test that packs the tarball and loads it in an isolated directory containing only
  `react` and `react-dom`, so the router dependency cannot creep back in unnoticed.

### Changed

- **Breaking for router users**: `Link` and `Breadcrumb` no longer use React Router automatically.
  Wrap your app in `<LinkComponentProvider value={RouterLink}>` (or pass `linkComponent`) to keep
  client-side navigation; otherwise these components now trigger full page loads.
- Removed the `peerDependenciesMeta` entry for `react-router-dom`. It is no longer a peer
  dependency in any form.
- `Link`'s `to` prop is typed as `string | { pathname?, search?, hash? }` instead of
  `string | object`. This matches React Router's `Partial<Path>`; arbitrary objects are now a
  type error.
- `Link`'s `onClick` is typed `(e: React.MouseEvent) => void` instead of
  `(e: React.MouseEvent | React.KeyboardEvent) => void`. It now always receives a click event,
  including when activation came from Enter.
- The shared link-resolution module moved from `components/internal/` to `components/_internal/`,
  matching the directory the project already used for internal helpers. Import paths in the public
  API are unchanged — `LinkComponentProvider` and its types are still exported from the package
  root.

## [1.2.0] — 2026-04-16

### Fixed

- **AlertDialog**: Added focus trap, focus return to invoking element, initial focus on close
  button, unique IDs via `useId()`.
- **Button**: Removed redundant `role="button"` and `aria-disabled` on native `<button>`;
  replaced hardcoded `aria-haspopup` with configurable `ariaHaspopup` prop.
- **Carousel**: Added required `ariaLabel` prop; replaced `disabled` selector buttons with
  `aria-current="true"` (preserves focus); DOM order now matches visual order.
- **Disclosure**: Unique content IDs via `useId()` (was hardcoded, broke with multiple instances).
- **Feed**: Now passes `ariaPosinset`/`ariaSetsize` to Article children; added `ariaLabel` prop.
- **Link**: Removed redundant `role="link"` and `tabIndex={0}` on native `<a>`.

### Changed

- **ModalDialog**: Renamed `ariaLabel` prop to `ariaLabelledby` (it accepts an element ID, not a
  label string). **Breaking** for consumers who used `ariaLabel` — rename to `ariaLabelledby`.
- **Switch**: Replaced `<label>` wrapper with `<span id>` + `aria-labelledby` on the switch.
- **CheckboxGroup**: Unique group label IDs via `useId()`.
- **MenuButton**: Menu popup uses `aria-labelledby` referencing the trigger button.
- **Menubar**: Submenus use `aria-labelledby` referencing their parent bar item.
- **Combobox**: Popup listbox gets `aria-labelledby` referencing the input.
- **Tabs**: Bootstrap 5 nav-tabs styling.
- **TreeView / TreeGrid**: Larger chevron carets.

## [1.1.0] — 2026-04-16

### Changed

- **TypeScript conversion**: All 31 components rewritten from `.jsx` + PropTypes to `.tsx` with
  native TypeScript interfaces. Barrel file renamed `index.js` → `index.ts`. Rollup now generates
  `.d.ts` declarations from source via `@rollup/plugin-typescript` (replaces the hand-written
  `index.d.ts`). `prop-types` is no longer a runtime dependency.

### Added

- **i18n support**: Components with hardcoded user-facing strings now accept an optional `labels`
  prop to override any string for translation. Affected: Alert (`dismiss`), Breadcrumb (`nav` +
  standalone `navLabel` prop), Carousel (`previousSlide`, `nextSlide`, `pauseRotation`,
  `startRotation`, `selectSlide`), ModalDialog (`closeDialog`), Spinbutton (`increaseValue`,
  `decreaseValue`). English defaults preserved when `labels` is omitted.

## [1.0.0] — 2026-04-15

### Added

- **31 components** covering the full WAI-ARIA Authoring Practices Guide pattern catalog:
  Accordion, Alert, AlertDialog, Article, Breadcrumb, Button, Carousel, Checkbox, CheckboxGroup,
  Combobox (`none` / `list` / `both` variants), Disclosure, Feed, Grid, Link, Listbox (single + multi-select),
  MenuButton, Menubar, Meter, ModalDialog, Progressbar, RadioGroup, Slider, SliderMultiThumb,
  Spinbutton, Switch, Tabs (automatic + manual activation, horizontal + vertical), Textbox,
  Toolbar, Tooltip, TreeGrid, TreeView.
- **Bootstrap-inspired design tokens** in `variables.css` — colors, spacing, radii, typography, focus ring,
  shadows, z-index layers. Every visual choice is token-driven and overridable.
- **TypeScript declarations** (hand-written `index.d.ts`, later replaced by auto-generated declarations in v1.1.0).
- **295 unit tests** across 32 suites (~92% statement coverage).
- **37 accessibility-contract tests** built on a hand-rolled, zero-dependency ARIA DOM assertion helper.
- **End-to-end tests** driving real Chromium via Puppeteer against a built Storybook, covering
  accessible-name resolution, `aria-*` id resolution, boolean-attribute grammar, and Tab reachability.
- **Storybook** with `play` functions on every story (populates the Interactions panel).

### Notes

- No external accessibility libraries are used (no `axe-core`, no `jest-axe`, no `addon-a11y`). Every
  accessibility assertion in this codebase is implemented from first principles against the DOM.
- Peer dependency on `react-router-dom` is optional and only required for `Link` and `Breadcrumb`.
