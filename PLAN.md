# apg-react — Backlog plan

As of 2026-11-28. Tier 5 (product registry: Honu/Revenant ecosystem). Tracker: GitHub AFixt/apg-react.
Sources read: 1 open issue, 0 open PRs, `claude-memory/memory/backlog/github/AFixt__apg-react.md`,
README, CLAUDE.md, package.json scripts, docs/ titles, local `origin/main`@a988298 (2026-09-09) and
`origin/develop`@af75aeb (2026-11-22), not fetched.
Not checked: whether the `security.yml` patch file still exists; live GitHub state after the bundle.

## Goal

Item #282 closes: the glob advisory is cleared on `develop` and the one dropped `security.yml` comment
fix lands.

## Definition of Done

- [ ] The `security.yml` comment fix from #282 is merged into `develop` (Decision 1).
- [ ] `npm run security:osv` on `develop` reports no GHSA-3g3m-2fjr-6pw4.
- [ ] `npm run check:all` passes on `develop`.
- [ ] #282 is closed on that merge (close-on-develop-merge, Karl 2026-11-23).

Nothing outside this list is required for Done.

## Current state

- measured (memory 2026-11-22): PR #288 forced glob 14.0.6 with an override and merged into
  `develop`. It said "Part of #282".
- measured (memory 2026-11-22): the `security.yml` comment fix was dropped from #288. The session
  token has no `workflow` scope. A patch was saved as `apg-react-282-security-yml.patch`.
  Its location is not recorded.
- measured (memory 2026-11-22/23): #287, #289, #290, #291 also merged into `develop`.
- measured (local refs): `main` is 2026-09-09 (v2.3.0). `develop` is far ahead. apg-playwright#67
  waits on a `develop` -> `main` release that carries #250.
- Local branch `fix/280-vite-ghsa` tracks a remote. hypothesis: spent. Not deleted.

## Finish first: existing work

No open PRs. WIP rule: at most 1 open PR.

## Work items (in order)

### Milestone 1: finish #282

| Ref | Done when | Verify | Size | Depends on |
|---|---|---|---|---|
| #282 (remainder) | The `security.yml` comment fix is merged into `develop`. | `npm run security:osv`; `npm run check:all` | S | Decision 1 |

## Close or defer (not in this plan)

None beyond #282.

## Decisions needed from Karl

1. Who pushes the `security.yml` edit? **Recommended: Karl pushes it, or grants a token with
   `workflow` scope for this one PR.** A session token cannot push workflow files. Blocks #282.
2. Release `develop` -> `main` now? **Recommended: yes.** It unblocks apg-playwright#67 and moves
   `main` off the unpublished runner 3.0.0 pin (memory 2026-11-21). Not needed for this plan's Done.

## Guardrails against drift

- New issues filed after 2026-11-28 do not enter this plan unless they block a Done line.
  They go to the tracker, not here.
- No refactors, upgrades or "while I'm here" changes beyond the listed items.
- Each PR maps to one listed item and says "Closes #N" or "Part of #N".
- Change this plan only by editing it with a dated Change log line stating why.
- Stop condition: when every Done line is checked, stop and report. Do not keep polishing.
- Re-resolve a `package-lock.json` conflict with `npm install --package-lock-only`. Never hand-merge
  it (memory 2026-11-22).
- Do not add an OSV ignore for glob. The override already clears it.

## Risks

- hypothesis: the patch file is lost. Mitigation: re-derive the comment edit from #282's body.
- measured (memory): "Validate use cases" fails in CI with E404 on `@afixt/usecase-runner`. That is
  expected, not a work item. Mitigation: run `npm run validate:usecases` locally.

## Change log

- 2026-11-28: Created from the backlog (1 issue, 0 PRs, no Jira).
