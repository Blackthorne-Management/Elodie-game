# Throne of Bloodlines

Eight houses. One throne. A digital version of the board game: Phase 1 is a complete local game
against up to 7 bots on one phone; Phase 2 adds online play with join codes and QR.

```sh
npm install
npm run dev       # dev server (add -- --host to open on a phone on the same Wi-Fi)
npm test          # rules engine, card, house, bot and fuzz tests
npm run balance   # plays 180 bot games and prints win rates per house
```

## Where things live

- `docs/` — the rulebook, card list and houses (source of truth), the build guide,
  `rules-decisions.md` (every ruling on gaps and conflicts) and the board picture.
- `src/engine/` — the pure rules engine. A game is a generator that pauses on a *Decision* whenever a
  player must choose; a game is fully described by its setup plus the list of answers, so it can be
  saved, replayed, and later run on a server.
- `src/data/` — the 120 cards and 8 houses, written against the engine's helpers.
- `src/ai/` — the heuristic bots and their house personalities.
- `src/ui/play/` — the play view: character card, the 2.5D stage (camera follows the action, step arrows,
  walking animation), the duel screen, the fanned hand, the overhead map. Portrait and landscape.
- `src/ui/`, `src/state/` — setup, sheets, past games and logs, and the store (saves after every move).
- `src/assets.config.ts` — every visual asset; the art pass only changes this file. Portraits: one per house per
  generation in `PORTRAITS` (3:4 images); crests in `HOUSE_ART[house].crest`.
- `src/config.ts` — every tunable number (thresholds, Sudden Death round, who strikes first in a Challenge).

Hosted on Netlify; every push runs the tests, builds and publishes. Installing to the home screen is optional.
