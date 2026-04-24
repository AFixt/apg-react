# ADR 0005: Accessibility assertion strategy

- Status: accepted
- Date: 2026-04-23
- Deciders: @karlgroves

## Context

Issue #61 proposes `@afixt/a11y-assert` integrated at four layers:

1. Component tests (Vitest / Jest)
2. E2E flows (Playwright / Puppeteer)
3. CI preview scan
4. Stylelint a11y rules (CSS-level)

This project has a hard rule — documented in `CLAUDE.md` and the README —
forbidding axe-core and any wrapper (`jest-axe`, `cypress-axe`, `@axe-core/*`,
`addon-a11y`). The project ships its own in-repo assertion helper at
`__tests__/helpers/a11y.js` that validates accessible names, ARIA id references,
boolean-state grammar, roving tabindex, and label association — all without
external libraries.

`@afixt/a11y-assert` is an Anthropic/AFixt-authored library not based on
axe-core; it is compatible with this project's accessibility policy.

## Decision

- Keep `__tests__/helpers/a11y.js` as the active a11y assertion layer for this
  PR series. The 37 existing accessibility contract tests continue unchanged.
- Adopt `@afixt/a11y-assert` in a **follow-up PR** once it is released and
  stable. At that point, evaluate whether to replace or augment the in-repo
  helper.
- Keep the axe-core ban in force. All axe-based packages remain disallowed.

## Consequences

- No new runtime a11y dependency in this PR series.
- A later PR will introduce `@afixt/a11y-assert` and may supersede this ADR.

## Alternatives considered

- **Adopt `@afixt/a11y-assert` now** — deferred. Integration design is out of
  scope for the foundations/lint/hooks PRs and deserves its own focused change.
- **Use jest-axe or similar** — rejected. Violates the project's explicit
  axe-core prohibition.
