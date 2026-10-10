# RevMind

Architecture from your knowledge graph. A RevealFleet product at
[`revealui-studio/revmind`](https://github.com/revealui-studio/revmind).

RevMind is **not** a public Architecture SKU. Diagram export in RevealUI admin
(`/revmind`, `POST /api/kg/diagram`) is Launch / licensed. This repo is the
standalone fleet checkout — `rfg revmind` — so RevMind lives next to agency,
revdev, and the rest of the fleet, not only as an admin alias.

The graph engine and diagram helpers live in `@revealui/knowledge-graph`
(package in `RevealUIStudio/revealui`). This app consumes published
`@revealui/presentation` and `@revealui/router` today. The `./diagram` export
is on revealui `test`; this surface will import it after the next npm publish.

## Stack

- Vite + React 19 (TypeScript strict)
- Tailwind CSS v4 via `@tailwindcss/vite`
- `@revealui/router` (SPA routing)
- `@revealui/presentation` (primitives + Cobalt tokens)
- Vitest

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3002
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

Launch the product session with `rfg revmind` from the fleet root.

## Honesty

Copy and UI keep two lines: the on-page graph is an example that uses
demonstration data, and architecture from your knowledge graph is not a public
Architecture SKU.
