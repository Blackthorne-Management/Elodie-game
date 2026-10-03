# Elodie, Keeper of Skies

A turn-based sky-pet battler, built as a web app and installed on a phone as a home-screen app (PWA).

```sh
npm install
npm run dev      # dev server
npm test         # engine tests
```

## Layout

```
src/
  config.ts   every tunable number
  engine/     pure TypeScript game logic (no React)
  data/       content: pets, moves, items, bosses, acts
  state/      Zustand store, save/load, daily rewards
  screens/    one file per screen
  components/ shared UI pieces
tests/        Vitest specs for the engine
```

## Progress

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Engine core: types, rng, typeChart, stats, damage | Done |
| 2 | Battle engine: status, battle, ai | Done |
| 3 | First content: 5 Commons, their moves, Galebeak | |
| 4 | Battle screen | |
| 5 | First region (floors 1–25) | |
| 6 | Hatchery and Journal | |
| 7 | Full roster and evolution | |
| 8 | Buff items | |
| 9 | Whole Act I | |
| 10 | Keepers: save, settings, daily | |
| 11 | Install as PWA and host | |
| 12 | Acts II–VIII | |
| 13 | Live features | |
