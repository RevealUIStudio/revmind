#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCAN="$ROOT/scripts/check-no-private-leaks.sh"

# Structural path protection must survive fleet renames without matching variables.
PRIVATE_FIXTURE="$(mktemp -d)"
for fleet in '~/revealfleet' '~/revfleet' '~/suite' '/renamed-fleet_2' '/Fleet.v2' '/x'; do
  printf '%s/%s/docs\n' "$fleet" '.jv' > "$PRIVATE_FIXTURE/note.txt"
  if bash "$SCAN" "$PRIVATE_FIXTURE/note.txt" > "$PRIVATE_FIXTURE/output.txt" 2>&1; then
    echo "private planning checkout was not rejected: $fleet" >&2
    exit 1
  fi
  if ! grep -q 'private-jv-repo' "$PRIVATE_FIXTURE/output.txt"; then
    cat "$PRIVATE_FIXTURE/output.txt" >&2
    exit 1
  fi
done
for public_path in '~/revealfleet/revealui' '/renamed-fleet_2/docs' '$REVEALFLEET_ROOT/.jv' '$root/.jv' '${fleet}/.jv'; do
  printf '%s\n' "$public_path" > "$PRIVATE_FIXTURE/note.txt"
  if ! bash "$SCAN" "$PRIVATE_FIXTURE/note.txt" > "$PRIVATE_FIXTURE/output.txt" 2>&1; then
    echo "public or parameterized path was rejected: $public_path" >&2
    cat "$PRIVATE_FIXTURE/output.txt" >&2
    exit 1
  fi
done
rm -rf "$PRIVATE_FIXTURE"
echo "private planning path cases passed"
