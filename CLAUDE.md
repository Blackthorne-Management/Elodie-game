# Bloodlines: The Race to Elodie's Grace

Digital version of the Bloodlines board game (formerly Throne of Bloodlines): solo against bots, later online with friends.
React + TypeScript + Vite + Zustand, installable as a PWA (installing is optional). Supabase arrives in Phase 2.

## Source of truth
- `docs/bloodline-rulebook-draft.md`, `docs/bloodline-card-list.md`, `docs/bloodline-houses.md` define every rule, card and ability.
- `docs/rules-decisions.md` settles every ambiguity and overrides the three documents where they differ. Board picture: `docs/board-layout.png`.
- `docs/app-build-guide.md` is the engineering spec.
- Implement rules exactly as written. If something is ambiguous or two sections conflict, stop and flag it; never pick an interpretation silently.

## Rules for the code
- `src/engine` is pure TypeScript: no React, no DOM, no Math.random (use the seeded Rng passed in). Every rule is unit tested.
- Card and house content lives in `src/data`; the engine never hard-codes a card or house.
- Tunable numbers (including the Sudden Death round cap and multi-challenger Throne resolution) live in `src/config.ts`.
- Every visual asset goes through `src/assets.config.ts`; components never reference art directly.
- Hidden info (hands, the draw pile) must stay out of other players' views so Phase 2's server-authoritative model drops in cleanly.
- Mobile-first: 390 px wide portrait, tap targets at least 44 px.

## Phases
Phase 1 (current): rules engine + local game vs bots, 2–8 players. No Supabase, multiplayer or QR until Phase 1 is verified.

## Commands
- `npm run dev` (add `-- --host` to open on a phone on the same Wi-Fi)
- `npm test` / `npm run typecheck` / `npm run lint` / `npm run build`
- Deploys to Netlify via `netlify.toml` on every push; CI in `.github/workflows/ci.yml`.

## Notes
- tsconfig uses `verbatimModuleSyntax`: import types with `import type`.
- The oxlint React hooks rule treats any `useX(...)` call as a hook, so don't name engine functions `use...`.
- Card effects and abilities are generators even when they never pause (the engine needs one shape), so the `require-yield` lint rule is off.
