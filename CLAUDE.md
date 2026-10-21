# Bloodlines: The Race to Elodie's Grace

Digital version of the Bloodlines board game (formerly Throne of Bloodlines): solo against bots, later online with friends.
React + TypeScript + Vite + Zustand, installable as a PWA (installing is optional). Supabase arrives in Phase 2.

## Source of truth
- `docs/bloodline-rulebook-draft.md`, `docs/bloodline-card-list.md`, `docs/bloodline-houses.md` define every rule, card and ability.
- `docs/rules-decisions.md` settles every ambiguity and overrides the three documents where they differ. Board picture: `docs/board-layout.png`.
- `docs/app-build-guide.md` is the engineering spec.
- `src/data/rules.ts` is the in-app official rule guide (the rulebook with every decision folded in). Update it whenever a rule changes; the How to play slides are in `src/ui/HowToPlay.tsx`.
- Implement rules exactly as written. If something is ambiguous or two sections conflict, stop and flag it; never pick an interpretation silently.

## Rules for the code
- `src/engine` is pure TypeScript: no React, no DOM, no Math.random (use the seeded Rng passed in). Every rule is unit tested.
- Card and house content lives in `src/data`; the engine never hard-codes a card or house.
- Tunable numbers (including the Sudden Death round cap and multi-challenger Throne resolution) live in `src/config.ts`.
- Every visual asset goes through `src/assets.config.ts`; components never reference art directly.
- Hidden info (hands, the draw pile) must stay out of other players' views so Phase 2's server-authoritative model drops in cleanly.
- Mobile-first: 390 px wide portrait, tap targets at least 44 px.

## Phases
Phase 1: rules engine + local game vs bots, 2–8 players (done).
Phase 2 (started, at the owner's request): online play. Host a game (players and how many are people), join with a
6-letter code or link, share an invite message.
- `src/net/serverCore.ts` holds the server rules: sessions, masked views and bots stepped by the server.
- `src/state/onlineStore.ts` and `src/ui/OnlineScreens.tsx` are the client.
- The Edge Function `supabase/functions/bloodlines` runs in Supabase project `mawdkpwegsjmdqoagevi`, schema
  `bloodlines`; it shares that project with an RSVP app, so never touch its other tables.
- The function loads the rules from `public/server/core.js` (`npm run build:server`) on the website. Rebuild it
  whenever the engine changes.
- Test locally with `node scripts/dev-server.mjs` and `?server=http://localhost:8787`.
- Not yet: QR codes, AFK bot takeover.

## One build: keep the board game in view
The board game (physical and digital) and the quest are one build. At every milestone, whatever the task, remind the
owner of the open items in `docs/PRODUCTION.md` ("Open items"), most urgent deadline first, and keep that list current.

## Working with the owner
- Keep building (owner rule, Oct 20): ask the owner only about decisions that drastically change the story's flow;
  for everything else, go with Claude's recommendation, record it in the design docs (marked "Claude's call") and keep
  building. Questions that are asked come one at a time, each with its reason, as a pop-up with multiple-choice
  answers (the recommendation first). The build never pauses for an answer: go ahead with the recommendation and
  change course if the owner answers otherwise (owner rule, Oct 20).
- Recommend only what is just and genuinely helps the story or the gameplay; never recommend for its own sake
  (owner rule, Oct 19).
- After every command and run, end the reply with the exact commands to play the quest locally (owner request,
  Oct 17). The owner uses Windows PowerShell, where `npm` is blocked by the execution policy, so give them as:
  ```
  cd "D:\Blackthorne Management\Projects\elodie-game\quest"
  git pull
  npm.cmd run dev
  ```
  then http://localhost:5180 (`npm.cmd run dev -- --host` for a phone on the same Wi-Fi; `?chapter=2` jumps to
  Chapter 2, in a private window).
- Quest story moments are shown, not told (owner rule, Oct 17): when people arrive, fight, flee, are taken or leave,
  the characters physically walk in, walk up to whoever they speak to, act it out and walk off on the map, with their
  lines spoken there. Sounds and screen shake are fine for off-screen events (cannon fire); narration text alone is not
  enough for anything that happens in front of the party.
- Model split (owner decision, Oct 17): one central session plans, builds and checks everything, and hands
  subtasks to helpers on the model that fits:
  - Fable: the hardest design and review work (a chapter's story and puzzle outline, a bug that survives two
    fixes, a review before a deploy). Use it sparingly; it costs the most.
  - Opus: the main builder and coordinator (planning with the owner, engine work, cross-file changes, judging
    test runs).
  - Sonnet: routine content once a pattern exists (staged dialogue, map edits, tests, porting to the demo, docs).
  - Haiku: mechanical work (searches, scanning smoke logs, content checks, renames, data tables).
  For a big decision, have two models review the plan separately and bring the owner where they agree and differ.
  Save every review in full to a file the owner can read; never summarize one away.
- All chapters by Nov 22 (owner decision, Oct 20; replaces the Oct 19 chapter gate): the release is the whole quest,
  Chapters 1 to 12 and the epilogue. Chapters overlap (one outlined while another is built); Chapter 2 is finished
  alongside. The plan is `docs/quest/PLAN-ALL-CHAPTERS.md`.
- No deploys (owner decision, Oct 20): work goes to the repos only; the owner is taking the Netlify sites down. Every
  commit, merges included, carries `[skip netlify]` (a local commit-msg hook adds it), and nothing is deployed until
  the owner says so. Replies no longer link to the live site.

## Commands
- `npm run dev` (add `-- --host` to open on a phone on the same Wi-Fi)
- `npm test` / `npm run typecheck` / `npm run lint` / `npm run build` / `npm run build:server` (after engine changes)
- Deploys to Netlify via `netlify.toml` on a push without `[skip netlify]` in the commit message; CI in `.github/workflows/ci.yml`.

## Notes
- tsconfig uses `verbatimModuleSyntax`: import types with `import type`.
- The oxlint React hooks rule treats any `useX(...)` call as a hook, so don't name engine functions `use...`.
- Card effects and abilities are generators even when they never pause (the engine needs one shape), so the `require-yield` lint rule is off.
