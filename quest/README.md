# Bloodlines: Echoes of Zetwal (quest)

A single-player pixel RPG set in the world of the Bloodlines board game. The design lives in
`../docs/quest/QUEST-BUILD-GUIDE.md`. This folder is a self-contained project: its own
`package.json`, `node_modules`, TypeScript, Vite, Vitest and oxlint configs. It does not touch the
board game app, and it is not wired into the board game's site or build yet.

## Run

```sh
cd quest
npm install
npm run dev            # http://localhost:5180 (add -- --host to open it on a phone on the same Wi-Fi)
```

Controls:

| Action  | Keyboard               | Gamepad (standard) | Touch        |
|---------|------------------------|--------------------|--------------|
| move    | arrows / WASD          | D-pad / left stick | D-pad        |
| confirm | Z / Enter / Space      | A                  | A            |
| cancel  | X / Backspace          | B                  | B            |
| run     | hold Shift (or X)      | hold B (or R)      | hold B       |
| echo    | E                      | X                  | Echo         |
| menu    | Escape / M             | Start              | Menu         |

The touch overlay appears on touch devices (force it with `?touch=1`).

## Check

```sh
npm run typecheck
npm run lint
npm test               # unit tests (also runs the map validator over every map)
npm run validate:maps  # map validator on its own
npm run build          # production build into quest/dist (relative paths, so it can live under any route)
npm run preview        # serve the build
npm run smoke          # build, serve, and drive it in headless Chromium (Playwright); SKIP_BUILD=1 to reuse dist
```

`npm run smoke` writes `quest-desktop.png`, `quest-phone.png` and `quest-phone-portrait.png` to
`SHOT_DIR` (default: the OS temp directory). It uses a local `playwright` if there is one, else the
global install.

## What Phase 1 contains

- **Phaser 3** (`pixelArt`, 240 x 160 logical resolution, whole-number scaling, letterboxed, landscape),
  16 x 16 tiles, 16 x 24 characters. All art is placeholder colours drawn at boot from
  `src/assets.config.ts`; there are no image files.
- **Tiled maps** (`maps/*.tmj`). Every map has both eras on one grid: `ground_present`, `deco_present`,
  `ground_echo`, `deco_echo`, `above`, `collide_present`, `collide_echo`, and object layers `npcs`,
  `doors`, `triggers`, `spawns`, `echo_zones`, `anchors`. `maps/test-village.tmj` is a 30 x 20 test map
  with a house (door pair), a pond, a well, a plaza Echo Zone, a trigger, an anchor and three NPCs.
  It opens in Tiled; its tileset image is generated at boot, so Tiled will show it as missing.
- **Grid movement** with collision (the current era's collision layer; the era is always the present
  in Phase 1) and hold-to-run.
- **Dialogue**: portrait slot, speaker name, typewriter text (speed in the menu), choices, an optional
  translation line, and conditional lines, choices and branches driven by flags. Content is in
  `src/data/dialogue.ts` (placeholder lines and names only).
- **Global flag store** (`src/engine/flags.ts`).
- **Save** (`src/engine/save.ts`): localStorage plus Export and Import save code
  (`BQ<version>.<base64url>.<checksum>`). Autosaves on doors and triggers; Save in the menu.
- **Input** (`src/input`): one abstraction (move, confirm, cancel, echo, menu, run) fed by keyboard,
  the Gamepad API and the touch overlay.
- **Echo**: not built. The `echo` action only reports "not yet"; the rule for when a swap is allowed
  (`canSwapEra`) and the map validator's Echo Zone check are in place for Phase 2.

## Layout

```
src/
  config.ts            tunable numbers
  assets.config.ts     every visual (placeholder colours for now)
  engine/              pure TypeScript, no Phaser or DOM: grid, tiledMap, mapValidation, flags,
                       conditions, dialogue, save, state, rng, scaling
  data/                maps registry, NPCs, speakers, dialogue
  input/               input manager + keyboard, gamepad, touch sources
  scenes/              Phaser scenes (Boot, Field) and placeholder texture drawing
  ui/                  dialogue box, menu, toast, save code dialogs
maps/                  Tiled .tmj files
tools/validate-maps.ts map validator CLI
tests/                 unit tests (Vitest) and smoke.mjs (Playwright)
```

Rules: engine code never imports Phaser and never calls `Math.random` (use `engine/rng.ts`); content
lives in `src/data`; tunable numbers in `src/config.ts`; every visual through `src/assets.config.ts`;
`import type` for types.
