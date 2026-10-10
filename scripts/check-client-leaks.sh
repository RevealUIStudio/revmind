#!/usr/bin/env bash
# check-client-leaks.sh
#
# Scans the repo for client, prospect, and contact names. The literal
# pattern list belongs in the CLIENT_LEAK_PATTERNS org secret, never in
# this public repo.
#
# Exit 0 on a clean scan.
# Exit 1 when a pattern matches.
# Exit 2 on tool or configuration errors, including a missing pattern source.
#
# Usage:
#   bash scripts/check-client-leaks.sh                     # scan repo root
#   bash scripts/check-client-leaks.sh <path> [<path>...]  # scan specific paths
#   LEAK_JSON=1 bash scripts/check-client-leaks.sh         # machine-readable
#
# Pattern source, one tag|literal|reason entry per line:
#   1. CLIENT_LEAK_PATTERNS (required in CI; the workflow passes the org secret)
#   2. Outside CI only: gitignored .client-name-watchlist.local
#
# CI (CI=true or GITHUB_ACTIONS=true) fails closed when CLIENT_LEAK_PATTERNS
# is missing or empty. A local run with neither source prints a warning and
# exits 2 so a missing list is not reported as a pass.
#
# Adding a client, prospect, or contact:
#   Add the line to the CLIENT_LEAK_PATTERNS org secret. Never add it to a
#   committed file. There is no .leakignore for this scanner.
#
# CI wiring: .github/workflows/check-client-leaks.yml
# REQUIRED status check on test and main branch protection.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCAN_PATHS=("$@")
[[ ${#SCAN_PATHS[@]} -eq 0 ]] && SCAN_PATHS=("$REPO_ROOT")

for _path in "${SCAN_PATHS[@]}"; do
  if [[ ! -e "$_path" ]]; then
    echo "[client-leak] error: scan path not found: $_path" >&2
    exit 2
  fi
done
unset _path

in_ci() {
  [[ "${CI:-}" == "true" || "${GITHUB_ACTIONS:-}" == "true" ]]
}

# Patterns are fixed strings for grep -F. Lines are tag|literal|reason.
# Blank lines and comments are ignored. The list is never committed.
PATTERNS=()

append_pattern_lines() {
  local text="$1"
  local line tag rest literal
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    if [[ "$line" != *"|"*"|"* ]]; then
      echo "[client-leak] error: pattern line must be tag|literal|reason" >&2
      exit 2
    fi
    tag="${line%%|*}"
    rest="${line#*|}"
    literal="${rest%%|*}"
    if [[ -z "$tag" || -z "$literal" ]]; then
      echo "[client-leak] error: pattern line has an empty tag or literal" >&2
      exit 2
    fi
    PATTERNS+=("$line")
  done < <(printf '%s\n' "$text")
}

if [[ -n "${CLIENT_LEAK_PATTERNS:-}" ]]; then
  append_pattern_lines "$CLIENT_LEAK_PATTERNS"
fi

if [[ ${#PATTERNS[@]} -eq 0 ]]; then
  if in_ci; then
    echo "[client-leak] error: CLIENT_LEAK_PATTERNS is empty or unset. This scan fails closed until the org Actions secret CLIENT_LEAK_PATTERNS is set." >&2
    exit 2
  fi
  watchlist="$REPO_ROOT/.client-name-watchlist.local"
  if [[ -f "$watchlist" ]]; then
    append_pattern_lines "$(<"$watchlist")"
  fi
  unset watchlist
fi

if [[ ${#PATTERNS[@]} -eq 0 ]]; then
  echo "[client-leak] warning: CLIENT_LEAK_PATTERNS is unset and .client-name-watchlist.local has no patterns. Refusing to report a clean scan." >&2
  exit 2
fi

# Directories / file globs to skip.
# The local watchlist is gitignored and holds the same literals the scan
# is looking for, so it must not be treated as a leak of itself.
EXCLUDE_DIRS=(node_modules .git dist build .next .turbo .pnpm coverage target .direnv .nyc_output playwright-report test-results)
EXCLUDE_FILES=(
  pnpm-lock.yaml package-lock.json yarn.lock Cargo.lock
  .client-name-watchlist.local
  CHANGELOG.md
  '*.png' '*.jpg' '*.jpeg' '*.gif' '*.webp' '*.pdf' '*.zip' '*.tar.gz' '*.tgz'
  '*.ico' '*.woff' '*.woff2' '*.ttf' '*.otf'
  '*.har' '*.snap'
)

if ! command -v grep >/dev/null 2>&1; then
  echo "[client-leak] error: grep not found on PATH" >&2
  exit 2
fi

grep_excludes=()
for d in "${EXCLUDE_DIRS[@]}"; do
  grep_excludes+=(--exclude-dir="$d")
done
for f in "${EXCLUDE_FILES[@]}"; do
  grep_excludes+=(--exclude="$f")
done

violations=0
json_entries=()

for entry in "${PATTERNS[@]}"; do
  tag="${entry%%|*}"
  rest="${entry#*|}"
  pattern="${rest%%|*}"
  reason="${rest#*|}"

  while IFS= read -r hit; do
    [[ -z "$hit" ]] && continue
    file="${hit%%:*}"
    rest_="${hit#*:}"
    line="${rest_%%:*}"
    content="${rest_#*:}"

    if [[ -n "${LEAK_JSON:-}" ]]; then
      if command -v jq >/dev/null 2>&1; then
        json_entries+=("$(jq -cn --arg tag "$tag" --arg file "$file" --arg line "$line" --arg reason "$reason" --arg content "$content" \
          '{tag:$tag, file:$file, line:($line|tonumber), reason:$reason, content:$content}')")
      else
        safe="${content//\\/\\\\}"
        safe="${safe//\"/\\\"}"
        safe="${safe//$'\n'/\\n}"
        safe="${safe//$'\t'/\\t}"
        sreason="${reason//\\/\\\\}"
        sreason="${sreason//\"/\\\"}"
        json_entries+=("{\"tag\":\"$tag\",\"file\":\"$file\",\"line\":$line,\"reason\":\"$sreason\",\"content\":\"$safe\"}")
      fi
    else
      printf '[CLIENT-LEAK:%s] %s:%s - %s\n  > %s\n' "$tag" "$file" "$line" "$reason" "$content"
    fi
    violations=$((violations+1))
  done < <(grep -rFIn "${grep_excludes[@]}" -- "$pattern" "${SCAN_PATHS[@]}" 2>/dev/null || true)
done

if [[ -n "${LEAK_JSON:-}" ]]; then
  printf '{"violations":%d,"entries":[%s]}\n' "$violations" "$(IFS=,; echo "${json_entries[*]:-}")"
fi

if (( violations > 0 )); then
  if [[ -z "${LEAK_JSON:-}" ]]; then
    echo "" >&2
    echo "[client-leak] FAIL - $violations violation(s)." >&2
    echo "" >&2
    echo "Customer and prospect names must not appear in this public repo." >&2
    echo "Genericize the content." >&2
    echo "" >&2
    echo "To cover a new name, add a tag|literal|reason line to the" >&2
    echo "CLIENT_LEAK_PATTERNS org secret. Never commit the literal pattern list." >&2
  fi
  exit 1
fi

[[ -z "${LEAK_JSON:-}" ]] && echo "[client-leak] OK - no client/prospect names detected across: ${SCAN_PATHS[*]}"
exit 0
