# ADR 0006: ESLint rule calibration for apg-react

- Status: accepted
- Date: 2026-04-23
- Deciders: @karlgroves

## Context

Issue #61 ships an ESLint flat config calibrated for new projects starting from
a blank slate. Applied verbatim to apg-react — an established, published
component library with 31 components, 32 test suites, and external consumers —
several rules generate either a breaking API change or large amounts of
low-signal noise. This ADR records the deviations and the reasons.

## Decision

Adopt the issue #61 ESLint config with the following deviations:

### Rule severity changes (error → warn or off)

| Rule                                              | Issue #61    | Here                 | Why                                                                                                                                                                                                                                                                    |
| ------------------------------------------------- | ------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `import-x/no-default-export`                      | error        | **off** (components) | Every component exports via `export default MyComponent`. Consumers import as `import Accordion from '@afixt/apg-react/Accordion'` (conceptually). Changing to named exports is a breaking API change requiring a major version bump and coordinated consumer updates. |
| `jsdoc/require-jsdoc`                             | error        | **off**              | Enforcing JSDoc on all 31 exported components + their prop interfaces in a single PR would require ~200 doc blocks. This is tracked as a separate follow-up; writing JSDoc is not a tooling problem.                                                                   |
| `sonarjs/no-small-switch`                         | default      | **off**              | APG keyboard handlers routinely switch on 2–3 keys (Enter/Space) as a legitimate pattern; flagging every one adds noise.                                                                                                                                               |
| `sonarjs/cognitive-complexity`                    | error(15)    | **warn(20)**         | APG keyboard handlers legitimately hit 18–22 complexity; enforcing 15 would require extracting trivial helpers just to satisfy the rule.                                                                                                                               |
| `sonarjs/no-duplicate-string`                     | error        | **warn(5)**          | String literals like `"button"`, `"menu"`, `"ArrowDown"` are deliberately repeated across components (each component is self-contained). Downgrade + higher threshold.                                                                                                 |
| `@typescript-eslint/no-non-null-assertion`        | error        | **warn**             | A small number of legitimate non-null uses in DOM-intensive code (Feed, Slider, SliderMultiThumb, TreeView); will be audited separately.                                                                                                                               |
| `react-hooks/exhaustive-deps`                     | error        | **warn**             | Several effects deliberately omit dependencies (keydown handlers that capture current state by closure). Rechecked case-by-case rather than blanket-silenced.                                                                                                          |
| `react/no-array-index-key`                        | error        | **warn**             | Carousel selectors use index keys for positional dots — the list is static within a render.                                                                                                                                                                            |
| `jsx-a11y/click-events-have-key-events`           | error        | **warn**             | APG patterns like TreeView's `<span>` wrapper get clicks but the parent `<li role="treeitem">` is keyboard-focusable. The rule can't see this relationship.                                                                                                            |
| `jsx-a11y/no-static-element-interactions`         | error        | **warn**             | Same reason.                                                                                                                                                                                                                                                           |
| `jsx-a11y/no-noninteractive-element-interactions` | error        | **warn**             | Applies to `<article>`-level keyboard handlers in Feed and modal-dialog focus traps.                                                                                                                                                                                   |
| `unicorn/filename-case`                           | kebab+pascal | **pascal+kebab**     | Components are PascalCase (`Accordion.tsx`); configs/tests are kebab-case. Issue #61's order happens to work the same way, but ordered for clarity.                                                                                                                    |
| `unicorn/prefer-module`                           | default      | **off**              | Project has a mix of `.js` (CJS) and `.mjs`/`.tsx` (ESM). Existing CJS files stay.                                                                                                                                                                                     |

### File-scoped rule overrides

- **`**/\*.stories.{ts,tsx,js,jsx}`**: disable `no-empty-function`, `no-unused-vars`(for`React`imports still used for JSX),`no-undef`(for`document`, `setTimeout`);
  browser + node globals.
- **Tests + E2E**: disable `no-explicit-any`, `no-non-null-assertion`,
  `no-empty-function`, `no-require-imports` (e2e uses CommonJS),
  `no-var-requires`.
- **Config files / mocks**: allow default exports, CommonJS requires.

### Kept strict (no relaxation)

- All `jsx-a11y/aria-*` rules — this is an APG library; ARIA correctness is
  non-negotiable.
- `react-hooks/rules-of-hooks` — hard rule.
- `@typescript-eslint/no-explicit-any` — error for production code; overridden
  in tests and a single bounded `eslint-disable` block in `Toolbar.tsx` where
  the component accepts arbitrary interactive children via `cloneElement`.
- `no-secrets/no-secrets` — error everywhere except tests.
- `unicorn/no-array-for-each` — left off per issue #61 defaults.

## Consequences

- `npm run lint` passes cleanly: **0 errors, 23 warnings** across the whole repo
  as of this ADR.
- Warnings are tracked as follow-up work but do not fail CI.
- Bulk JSDoc adoption and the default-exports discussion are explicit
  follow-ups, not silent deferrals.

## Alternatives considered

- **Adopt the issue #61 config verbatim and fix every error** — rejected. 150+
  errors across components + tests + stories; the volume of changes would
  obscure the tooling adoption in review and create a single very-large PR
  that's hard to bisect if anything regresses.
- **Adopt the config with all rules as `warn`** — rejected. Warnings without a
  failing gate accumulate forever. Each rule is deliberately either error
  (enforced) or warn (tracked) or off (scoped out with a reason).
