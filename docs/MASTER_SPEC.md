---
type: master-spec
repo: revmind
last-updated: 2026-09-18
owner: RevealUI Studio
staleness-status: FRESH
---

# RevMind — Master Spec

**Repo:** [RevealUIStudio/revmind](https://github.com/RevealUIStudio/revmind)

## What it is

RevMind is the fleet product for architecture from a knowledge graph. It is a
first-class sibling at `~/revealfleet/revmind`, launched with `rfg revmind`.

## What it is not

- Not a public Architecture SKU
- Not an extraction of `@revealui/knowledge-graph` from the RevealUI monorepo
- Not an agency offering (do not list it on revealuistudio.com as a paid SKU)

## Surfaces

| Surface | Role |
|---|---|
| This repo (Vite app) | Standalone RevMind product |
| RevealUI admin `/revmind` | Cheap alias of `/knowledge-graph` |
| `@revealui/knowledge-graph` `./diagram` | Mermaid + 2D SVG job (package, not this repo) |

## Stack

Vite + React 19, Tailwind v4, `@revealui/router`, `@revealui/presentation`.
Default git branches: `test` (integration) and `main` (production). Promotion
is merge-commit only from `test` to `main`.
