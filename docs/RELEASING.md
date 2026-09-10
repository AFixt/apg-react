# Releasing

The runbook for cutting a release of `@afixt/apg-react`.

Release automation is deliberately deferred — see
[ADR 0008](adr/0008-release-workflow-deferred.md). That ADR records the
_decision_; this file is the _procedure_. If you are cutting a release, you want
this file.

Every step below is a step that has gone wrong at least once. The notes explain
why each check exists rather than restating what the command does.

## Before you start

- The working tree is clean and you are on an up-to-date `develop`.
- No open PR is waiting to ship in this release.
- The tag baseline agrees with itself:

  ```bash
  git describe --tags --abbrev=0 --match 'v[0-9]*.[0-9]*.[0-9]*' origin/develop
  git tag --sort=-v:refname --list 'v[0-9]*.[0-9]*.[0-9]*' | head -1
  ```

  **Match semver tags explicitly.** A bare `git describe` returns the floating
  major pointer (`v2`), because step 6 puts it on the same commit as the release
  tag — so the unfiltered check disagrees with itself on every release after the
  pointer is first created. If the two commands disagree _with the filter
  applied_, a previous back-merge (step 8) was skipped and the commit range
  below reaches back past releases that already shipped.

## 1. Choose the bump

```bash
git log --oneline $(git describe --tags --abbrev=0 --match 'v[0-9]*.[0-9]*.[0-9]*' origin/develop)..origin/develop
```

- **patch** — docs, chore, refactor, tests, dependency bumps only
- **minor** — any `feat`
- **major** — any `feat!` / `fix!` or `BREAKING CHANGE:` footer

## 2. Bump and write the changelog

On a branch, never directly on `develop` — it is protected, and a bypass that
succeeds silently is worse than one that fails.

```bash
git checkout -b release/vX.Y.Z
npm version <patch|minor|major> --no-git-tag-version
```

Promote `## [Unreleased]` to `## [X.Y.Z] — YYYY-MM-DD` in `CHANGELOG.md`.

> **Write the entry; do not just promote the heading.** `[Unreleased]` is only
> as complete as whoever last edited it. Before v2.2.0 it contained one entry
> covering one component while 26 merged PRs went unmentioned — promoting it
> as-is would have shipped a changelog describing a different release. Read
> `git log --merges` for the range and write from that.

Stage explicitly and commit:

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): vX.Y.Z"
```

> **Never `git commit -am` here.** The lint-staged pre-commit hook stashes
> unstaged work, formats the staged files, then restores. `-a`'s auto-staging
> races that and can produce a commit with the right message and no file changes
> at all, leaving the bump in the working tree.

**Verify the commit, not the working tree.** Every tree-based check passes
either way, because the un-committed bump is still sitting there:

```bash
git show HEAD --stat                            # lists all three files
git show HEAD:package.json | grep '"version"'   # the NEW version
```

Push, open a PR into `develop`, and **squash-merge** it:

```bash
gh pr merge <num> --squash --delete-branch --subject "chore(release): vX.Y.Z"
```

## 3. Promote `develop` to `main`

```bash
gh pr create --base main --head develop --title "Release vX.Y.Z"
gh pr merge <num> --merge          # merge commit; never --delete-branch
```

The head branch is `develop`. Deleting it would be bad.

> Issues close here, not earlier. GitHub only acts on closing keywords when the
> commit reaches the **default branch**, and it reads them from **commit
> messages**. A `Closes #N` that lives only in a PR description merged into
> `develop` never fires — use `Fixes #N` in the commit body.

## 4. Tag

```bash
git checkout main && git pull --ff-only origin main
git status --short                              # must be empty
git show HEAD:package.json | grep '"version"'   # confirm from the commit
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

An uncommitted bump survives a branch switch, so a dirty tree here can make the
check pass while `main` still declares the old version — which is what gets
tagged.

## 5. Move the floating major pointer

```bash
git tag -fa vN -m "Major version pointer (currently tracks vX.Y.Z)" "vX.Y.Z^{}"
git push -f origin vN
```

The `^{}` makes the pointer reference the commit rather than the annotated tag.

**Do not skip this.** Consumers pinned to `@vN` silently stay behind while
believing they track the line, and nothing fails to tell them. Before v2.2.0 the
`v2` pointer was still on a commit that predated `v2.1.0`.

## 6. GitHub release

```bash
gh release create vX.Y.Z --target main --title "vX.Y.Z" --notes "..."
```

## 7. Publish to npm

**This is the step that gets missed.** `v2.0.0`, `v2.1.0` and `v2.2.0` were all
tagged and GitHub-released without ever reaching the registry, because nothing
in the process fails when publishing is skipped — see
[#224](https://github.com/AFixt/apg-react/issues/224).

```bash
npm whoami                # must succeed; E401 means no credentials
npm publish --dry-run     # inspect the tarball
npm publish
```

- `prepublishOnly` runs `npm run build`, which cleans `dist/` first, so the
  tarball no longer depends on the state of your working copy.
- `publishConfig.access` is `public`; the `@afixt` scope would otherwise default
  to restricted.
- The dry run writes to **stderr**. Redirect with `> file 2>&1`, in that order,
  or you will grep an empty file and conclude the tarball is empty.

Then confirm it actually landed:

```bash
npm view @afixt/apg-react version     # must equal X.Y.Z
```

## 8. Back-merge `main` into `develop`

Not optional. Tags are created on `main`, so without this **no release tag is
reachable from `develop`**, and the baseline check at the top of this file fails
on the _next_ release rather than this one.

```bash
git diff origin/develop origin/main          # must print nothing
gh pr create --base develop --head main --title "chore: merge main back into develop"
gh pr merge <num> --merge                    # never --squash, never --rebase
```

Squashing or rebasing replays `main`'s commits as new ones, so the tag never
becomes an ancestor of `develop` — which is the whole point of the step. The
damage is silent and shows up a release later.

## 9. Verify

```bash
git checkout develop && git pull --ff-only origin develop
git describe --tags --abbrev=0 --match 'v[0-9]*.[0-9]*.[0-9]*' origin/develop
```

Must return `vX.Y.Z`. This is the check that proves step 8 worked.

Also confirm `npm view @afixt/apg-react version` matches. A tagged release that
is not on the registry is the failure mode this runbook exists to prevent.
