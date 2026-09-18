# RevMind

Standalone RevealFleet product. Architecture from your knowledge graph.
Not a public Architecture SKU.

## Stack

- Vite + React 19 (see `package.json`; Node engines `>=24.13.0`)
- `@revealui/{router, presentation}` via npm
- Tailwind v4 + `@revealui/presentation/tokens.css` + Geist fonts
- Dev server port `3002`

## Brand naming

- Product name is **RevMind** (not "Knowledge Graph" in the H1)
- `@revealui/router` (not "React Router")
- Do not sell RevMind as a public Architecture SKU

## Git identity

Commit as your GitHub noreply address. Sign with the fleet SSH key
(`gpg.format ssh`, `commit.gpgsign true`). See the fleet-identity skill.

## License

MIT. The `@revealui/*` packages this app consumes are MIT / FSL-1.1-MIT
under their own repositories.
