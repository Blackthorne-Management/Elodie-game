# Elodie, Keeper of Skies

A turn-based sky-pet battler, built as a web app and installed on a phone as a home-screen app (PWA).

```sh
npm install
npm run dev      # dev server (add -- --host to open it on a phone on the same Wi-Fi)
npm test         # engine tests
```

## Putting it on an iPhone

The app is a PWA: open it in Safari, tap **Share → Add to Home Screen**, and it runs
full screen and offline, with the save kept on the phone. Opened in a normal browser tab it
only shows install instructions; add `?play` to the URL (or use `npm run dev`) to test in a browser.

Hosting is GitHub Pages via `.github/workflows/deploy.yml`:

1. In the repo on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions** (one time).
2. Push to `main` (or run the workflow from the Actions tab). It tests, builds and publishes to
   `https://blackthorne-management.github.io/Elodie-game/`.

Netlify also works: connect the repo and it uses `netlify.toml`.

Icons are drawn in `scripts/icon.svg`; run `node scripts/make-icons.cjs` to re-render the PNGs.

Hidden debug menu: tap the title on the Climb screen 5 times to jump floors or add Sparks.

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
| 3 | First content: 5 Commons, their moves, Galebeak | Done (placeholder numbers) |
| 4 | Battle screen | Done (practice battle on launch) |
| 5 | First region (floors 1–25) | Draft: climb, replays, Sparks, leveling, Galebeak |
| 6 | Hatchery and Journal | |
| 7 | Full roster and evolution | |
| 8 | Buff items | |
| 9 | Whole Act I | |
| 10 | Keepers: save, settings, daily | Partly: save, backup code, settings |
| 11 | Install as PWA and host | Done (GitHub Pages) |
| 12 | Acts II–VIII | |
| 13 | Live features | |
