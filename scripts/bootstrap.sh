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

# Used by npm run security:osv
install_via_brew_or_warn osv-scanner \
  "Install from https://github.com/google/osv-scanner/releases"

# Used by npm run security:semgrep.
# Note: semgrep isn't a Homebrew default on some systems; pip is the fallback.
if have semgrep; then
  echo "  semgrep: present"
elif have brew; then
  echo "  installing semgrep via brew..."
  brew install semgrep || warn "brew install semgrep failed; try 'pip install --user semgrep'"
elif have pip3; then
  echo "  installing semgrep via pip..."
  pip3 install --user semgrep
else
  warn "semgrep not installed; install via 'brew install semgrep' or 'pip install --user semgrep'"
fi

echo ""
echo "Installing npm dependencies..."
npm ci

echo ""
echo "Bootstrap complete. Run 'npm run check:all' to verify."
