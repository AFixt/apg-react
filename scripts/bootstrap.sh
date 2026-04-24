#!/usr/bin/env bash
set -euo pipefail

# Install optional binaries used by git hooks and pre-push gates.
# Safe to re-run; skips anything already installed.

have() { command -v "$1" >/dev/null 2>&1; }
warn() { echo "warning: $1" >&2; }

echo "Checking required tools..."

have node || { echo "error: install Node via nvm (see .nvmrc)"; exit 1; }
have git  || { echo "error: git is required"; exit 1; }

install_via_brew_or_warn() {
  local tool="$1"
  local hint="$2"
  if have "$tool"; then
    echo "  $tool: present"
    return 0
  fi
  if have brew; then
    echo "  installing $tool via brew..."
    brew install "$tool"
  else
    warn "$tool not installed and Homebrew unavailable. $hint"
  fi
}

# Used by .husky/pre-commit
install_via_brew_or_warn gitleaks \
  "Install from https://github.com/gitleaks/gitleaks/releases"

# Used by .husky/pre-push
install_via_brew_or_warn lychee \
  "Install from https://github.com/lycheeverse/lychee/releases or via 'cargo install lychee'"

# Reserved for PR4 — uncomment when those tools are wired into scripts:
# install_via_brew_or_warn osv-scanner \
#   "Install from https://github.com/google/osv-scanner/releases"
# install_via_brew_or_warn semgrep \
#   "Install via 'pip install --user semgrep'"

echo ""
echo "Installing npm dependencies..."
npm ci

echo ""
echo "Bootstrap complete. Run 'npm run check:all' to verify."
