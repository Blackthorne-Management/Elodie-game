# Elodie, Keeper of Skies

Turn-based pet battler. React + TypeScript + Vite + Zustand, installed as a PWA.

## Rules
- src/engine is pure TypeScript: no React, no DOM, no Math.random (use the Rng passed in).
- Content lives only in src/data. Never hard-code a pet or move in the engine.
- Every tunable number lives in src/config.ts.
- Run `npx vitest` after engine changes; all tests must pass.
- Mobile-first: 390 px wide portrait, tap targets at least 44 px.
- Design reference: the Build Guide doc (types, roles, odds, bosses, story).

## Commands
- `npm run dev` (add `-- --host` to open it on a phone on the same Wi-Fi)
- `npm test` — Vitest, once
- `npm run typecheck` / `npm run lint` / `npm run build`
- Deploys to GitHub Pages from `.github/workflows/deploy.yml`; `BASE_PATH` sets the sub-path.

## Notes
- The game only runs as an installed home-screen app; a browser tab shows the install screen. `npm run dev` and any URL with `?play` bypass that for testing.
- tsconfig uses `verbatimModuleSyntax`: import types with `import type`.
- The oxlint React hooks rule treats any `useX(...)` call as a hook, so don't name engine functions `use...`.
