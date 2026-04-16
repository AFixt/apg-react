# Changelog

All notable changes to this project are documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- **TypeScript declarations** (`dist/index.d.ts`) for every component and its prop shape.
- **295 unit tests** across 32 suites (~92% statement coverage).
- **37 accessibility-contract tests** built on a hand-rolled, zero-dependency ARIA DOM assertion helper.
- **End-to-end tests** driving real Chromium via Puppeteer against a built Storybook, covering
  accessible-name resolution, `aria-*` id resolution, boolean-attribute grammar, and Tab reachability.
- **Storybook** with `play` functions on every story (populates the Interactions panel).

### Notes

- No external accessibility libraries are used (no `axe-core`, no `jest-axe`, no `addon-a11y`). Every
  accessibility assertion in this codebase is implemented from first principles against the DOM.
- Peer dependency on `react-router-dom` is optional and only required for `Link` and `Breadcrumb`.
