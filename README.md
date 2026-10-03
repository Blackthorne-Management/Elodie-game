# Throne of Bloodlines

Eight houses. One throne. A digital version of the board game, playable solo against bots
(Phase 1) and later online with friends via join codes and QR (Phase 2).

```sh
npm install
npm run dev     # dev server
npm test        # rules engine tests
```

- `docs/` holds the build guide and (once added) the rulebook, card list and houses.
- `src/engine/` is the pure, tested rules engine; `src/data/` the cards and houses.
- Hosted on Netlify; every push tests, builds and publishes. Installing to the home screen is optional.
