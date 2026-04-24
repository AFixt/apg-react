# ADR 0008: Defer automated `release.yml` workflow

- Status: accepted
- Date: 2026-04-24
- Deciders: @karlgroves

## Context

Issue #61's acceptance criteria lists `release.yml` as an optional workflow ("if
applicable"). apg-react is published to npm as `@afixt/apg-react`, so in
principle a release workflow that automates version bump + changelog + npm
publish + GitHub release is applicable.

The current release process is manual:

- `npm version <level>` bumps `package.json` + creates a tag
- `npm publish` publishes to the public npm registry
- CI's `publish-storybook` job handles the Storybook → GitHub Pages deploy on
  merges to `main`
- `CHANGELOG.md` is hand-edited

## Decision

Do **not** add `release.yml` as part of the issue #61 tooling work. Release
automation is a separate concern with its own design space:

- **Changesets vs release-please vs semantic-release vs hand-bumped.** The
  project has released using hand bumps so far; adopting a full release tool
  changes the commit/PR workflow meaningfully. That discussion should happen in
  its own PR with its own ADR.
- **NPM provenance.** If automation is added, it should use OIDC-based trusted
  publishing (no long-lived NPM_TOKEN), which requires additional npm and GitHub
  settings.
- **Scope creep.** Shipping release automation alongside 4+ tooling PRs blurs
  the review surface.

## Consequences

- Manual release process continues. Adding 1–2 ADR-governed steps (e.g., "run
  `npm run check:all` before publish") is a future hardening exercise.
- This ADR serves as an explicit marker that `release.yml` was considered, not
  forgotten.

## Alternatives considered

- **Adopt `changesets`** — deferred. Requires a repo-wide convention change
  (every PR that ships user-visible changes needs a changeset file).
- **Adopt `release-please`** — deferred. Requires conventional-commit discipline
  beyond what commitlint enforces, and its auto-PR model wants its own review
  cycle.
- **Build a minimal `release.yml` that just publishes on tag push** — deferred.
  Even the minimal version needs npm provenance + NODE_AUTH_TOKEN setup, which
  is a separate trust decision.
