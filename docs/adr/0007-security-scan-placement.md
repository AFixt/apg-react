# ADR 0007: Security scan placement (pre-push vs CI vs scheduled)

- Status: accepted
- Date: 2026-04-24
- Deciders: @karlgroves

## Context

Issue #61's template places Semgrep at the pre-push gate (via
`.lintstagedrc.json`) and OWASP Dependency-Check on a weekly scheduled workflow.
Applied literally to apg-react, both choices have issues:

- **Semgrep at pre-push** — Semgrep's full ruleset (`p/javascript` +
  `p/typescript` + `p/react` + `p/owasp-top-ten` + `p/security-audit`
  - `p/secrets`) takes 15–45 seconds cold and requires a Python installation on
    every contributor's machine. Blocking every `git push` on it — especially
    for small doc or style-only pushes — creates real friction without
    proportionate signal. Most findings are in transitive dependency code
    Semgrep cannot fix anyway.
- **OWASP Dependency-Check** — Java-based NVD scanner that duplicates coverage
  of OSV-Scanner and `npm audit`. For a pure-JS library with no native
  dependencies, it rarely surfaces anything the other two miss. Operationally it
  needs a JDK in CI, a large NVD data feed download, and regular
  suppression-file maintenance.

Both are real tools with real value — the question is _where_ they fire.

## Decision

- **Semgrep** runs in CI only, in the scheduled `.github/workflows/security.yml`
  job on Mondays 06:00 UTC. It also runs on-demand via `workflow_dispatch`.
  Contributors can run it locally via `npm run security:semgrep` when Semgrep is
  installed (via `scripts/bootstrap.sh`). It is **not** in the pre-push hook and
  **not** in `lint-staged`.
- **OWASP Dependency-Check** is skipped in favor of the existing combination of
  OSV-Scanner + `npm audit` + CodeQL, all of which run in the same scheduled
  `security.yml`. If a concrete gap is observed later, this ADR can be
  superseded by one that adds Dependency-Check.

## Consequences

- Fast pre-push: running `check + test + dupes + license:check` on a clean repo
  takes ~15s total. Adding Semgrep would triple that.
- Weekly security workflow still catches Semgrep's OWASP Top 10 findings — just
  not per-commit.
- Supply-chain coverage remains layered:
  - `gitleaks` on every commit (pre-commit)
  - `npm audit` on every PR (CI)
  - `OSV-Scanner` + `CodeQL` + `Semgrep` + `npm audit` every Monday (scheduled)
  - Dependabot weekly dependency updates (opens PRs)

## Alternatives considered

- **Semgrep in pre-push anyway** — rejected per analysis above.
- **OWASP Dependency-Check in scheduled** — rejected. Existing scanners cover
  the space with less operational overhead.
- **Semgrep in pre-commit via lint-staged** — rejected. Same latency issues as
  pre-push, and staged files are often too narrow a scope for whole-program
  Semgrep rulesets.
