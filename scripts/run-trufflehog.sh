#!/usr/bin/env bash
# Run trufflehog if available. Skip with a warning otherwise so the script
# can sit in pre-commit without breaking contributors who haven't installed
# the binary yet.
#
#   TRUFFLEHOG_MODE=staged   scan exactly what is staged for the next commit
#                            (the pre-commit hook uses this)
#   TRUFFLEHOG_MODE=full     scan the full git history (the default)
#
#   TRUFFLEHOG_RESULTS       optional trufflehog --results filter, e.g.
#                            "verified,unknown,unverified". Unset means
#                            --only-verified, which is what the hooks use.
#
# Ported from AFixt/shareable#191 (issue #260 here).
set -euo pipefail

if ! command -v trufflehog >/dev/null 2>&1; then
  echo "warning: trufflehog not installed — skipping secret scan."
  echo "         install with 'brew install trufflehog' or 'bash scripts/bootstrap.sh'"
  exit 0
fi

if [ -n "${TRUFFLEHOG_RESULTS:-}" ]; then
  RESULTS_FLAG="--results=${TRUFFLEHOG_RESULTS}"
else
  RESULTS_FLAG="--only-verified"
fi

if [ "${TRUFFLEHOG_MODE:-full}" = "staged" ]; then
  # Why not `trufflehog git file://. --since-commit HEAD`, which the
  # pre-commit hook used to run (#260):
  #
  #   1. It never saw staged content. trufflehog's git source scans commits,
  #      and a staged change is not a commit yet, so the range was empty and
  #      the scan passed whatever was about to be committed.
  #   2. It failed outright in a git worktree, where .git is a pointer file
  #      rather than a directory: trufflehog tries to open .git/index and
  #      errors with "not a directory", blocking every commit made there.
  #
  # Instead, write the staged version of every added, copied, modified,
  # renamed or type-changed file into a private temporary directory and scan
  # that as a filesystem. `git checkout-index` reads the index, not the working
  # tree, so this is exactly what the commit will contain (partially staged
  # files included), and plain git plumbing resolves the pointer file in a
  # worktree the same way it does everywhere else.
  WORK="$(mktemp -d "${TMPDIR:-/tmp}/staged-secrets.XXXXXXXX")"
  cleanup() { rm -rf "$WORK"; }
  trap cleanup EXIT
  trap 'exit 1' INT TERM HUP

  # Deletions are excluded: they add nothing to scan. A gitlink (submodule
  # pointer) has no content of its own, and checkout-index writes none for it.
  git diff --cached --name-only --diff-filter=ACMRT -z \
    | git checkout-index --prefix="$WORK/files/" -z --stdin

  if [ ! -d "$WORK/files" ] || [ -z "$(ls -A "$WORK/files")" ]; then
    echo "trufflehog: nothing staged with content to scan."
    exit 0
  fi

  trufflehog filesystem "$WORK/files" "$RESULTS_FLAG" --fail --fail-on-scan-errors --no-update
else
  # Scan the repository's object store directly rather than file://., for the
  # same worktree reason: trufflehog's non-bare git source insists on reading
  # <path>/.git/index, which is a file in a worktree. The common git dir holds
  # every ref and commit whichever checkout this runs from, and --bare tells
  # trufflehog not to look for a working tree there.
  #
  # Named so it cannot shadow git's own GIT_COMMON_DIR if that is exported.
  COMMON_DIR_PATH="$(git rev-parse --path-format=absolute --git-common-dir)"

  # trufflehog's git source shells out to `git clone`. If this runs under a
  # git hook, that clone would inherit GIT_INDEX_FILE / GIT_DIR / GIT_WORK_TREE
  # and could write its index over the one git staged, so scrub them.
  env -u GIT_INDEX_FILE -u GIT_DIR -u GIT_WORK_TREE -u GIT_COMMON_DIR \
    trufflehog git "file://${COMMON_DIR_PATH}" --bare "$RESULTS_FLAG" --fail --no-update
fi
