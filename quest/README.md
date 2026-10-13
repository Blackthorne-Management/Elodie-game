# Bloodlines: Echoes of Zetwal (quest)

A single-player pixel RPG set in the world of the Bloodlines board game. The design lives in
`../docs/quest/QUEST-BUILD-GUIDE.md`. This folder is a self-contained project: its own
`package.json`, `node_modules`, TypeScript, Vite, Vitest and oxlint configs. It does not touch the
board game app; the site's build runs `npm ci && npm test && npm run build` here and serves the result
at `/quest/`.

**Status:** Phase 1 (skeleton) and Phase 2 (the Echo, puzzles, and Act I in Zetwal) are done.

## Run

```sh
cd quest
npm install
npm run dev            # http://localhost:5180 (add -- --host to open it on a phone on the same Wi-Fi)
```

URL options: `?map=test-village` starts a new game (when there is no save) on another map;
`?hintms=3000` makes Anissa's first hint come after 3 s instead of 3 minutes; `?touch=1` forces the
touch overlay.

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
npm test               # unit tests, the map validator over every map, the puzzle solution replayer,
                       # and the whole of Act I played headlessly
npm run validate:maps  # map validator on its own
npm run build          # production build into quest/dist (relative paths, so it can live under any route)
npm run preview        # serve the build
npm run smoke          # build, serve, and drive it in headless Chromium (Playwright); SKIP_BUILD=1 to reuse dist
npm run maps:build     # regenerate the Zetwal .tmj files from tools/maps/*.ts
npm run audit:lang     # list phrasebook words not yet checked by a fluent speaker
npm run route:expand -- <puzzle> '["goto 3,4","confirm"]'   # turn a goto route into plain inputs
```

`npm run smoke` keeps the Phase 1 checks (on the test village), checks Anissa's hints and the
Journal, then plays the whole of Act I in the browser from a new game by the route in
`routes/zetwal-act1.json`. The headless simulator replays the same route alongside, so after every
key the browser must show exactly the map, tile, facing, era, mode and dialogue line the engine
predicts. It writes `quest-*.png` (Phase 1) and `quest2-<moment>-desktop.png` /
`quest2-<moment>-phone.png` (844 x 390) at the route's `@markers` to `SHOT_DIR` (default: the OS temp
directory): the plaza, the study in the present and in the Echo, the bridge before / in the Echo /
after, the lit lamp, the end card, and Anissa's first line. It uses a local `playwright` if there is
one, else the global install, and runs Node with `--experimental-strip-types` to load the engine.

## What Phase 1 contains

- **Phaser 3** (`pixelArt`, 240 x 160 logical resolution, whole-number scaling, letterboxed, landscape),
  16 x 16 tiles, 16 x 24 characters. All art is placeholder colours drawn at boot from
  `src/assets.config.ts`; there are no image files.
- **Tiled maps** (`maps/*.tmj`). Every map has both eras on one grid: `ground_present`, `deco_present`,
  `ground_echo`, `deco_echo`, `above`, `collide_present`, `collide_echo`, and object layers `npcs`,
  `doors`, `triggers`, `spawns`, `echo_zones`, `anchors`, `puzzle_objects`. `maps/test-village.tmj`
  is the hand-made Phase 1 test map. Tiled shows the tileset image as missing (it is drawn at boot).
- **Grid movement** with collision and hold-to-run; **dialogue** (portrait, name, typewriter text,
  choices, translation line, flag conditions); one **flag store**; **save** (localStorage plus Export
  and Import save code `BQ<version>.<base64url>.<checksum>`); **input** (keyboard, Gamepad API, touch).

## What Phase 2 adds

- **The Echo swap** (`src/engine/world.ts`, `src/engine/game.ts`, guide 6.1). Press Echo inside an
  Echo Zone (shimmering tiles; a zone's `if` can gate it, e.g. on the Sun Locket). Refused outside a
  zone ("Nothing echoes here."), while gated, or when the tile is closed in the other era ("The memory
  will not hold here"). The layer sets flip (ground, deco, collision), the player becomes young
  Patricio (palette and headgear swap), the position is kept, and a warm sepia, dithered filter covers
  the world. Echo NPCs and objects differ from present ones (`era` on any object). Doors do not work in
  the memory. Anissa cannot enter: she stays behind as a glowing figure holding the door.
- **Anchors.** Flags named `echo.*` belong to the memory and are wiped on the way back; only an
  anchor (an `anchors` object naming an Echo-era puzzle object) may set an `anchor.*` flag, which
  present-era objects read (the Chain Bridge is down in the present once Patricio pins it).
- **Puzzle objects** (`puzzle_objects` layer): examine/use dialogue, optional tile drawn while active,
  `walkable` (opens tiles, e.g. a lowered bridge) or `solid`, `era`, and an `if` condition. Condition
  text in Tiled: `a, !b` (and), `a|b` (or).
- **Map validator** (Section 9 check 1), extended: every Echo Zone tile walkable in both eras and free
  of NPCs, doors and solid objects; doors paired; spawns valid; NPC, dialogue and tile ids exist;
  condition text parses; anchors name a real Echo-era object whose dialogue sets the anchor flag, the
  flag is read in the present, and no other Echo object sets anchor flags; present content never reads
  `echo.*` flags; on-enter triggers are once-only.
- **Solution replayer** (Section 9 check 2). `src/engine/sim.ts` plays input lists through the same
  game logic the scene uses. Every puzzle in `src/data/puzzles.ts` ships `puzzles/<id>/solution.json`
  and `cheats.json`; `tests/puzzles.test.ts` loads a fresh save at the puzzle, asserts the solution
  solves it and that no cheat does. Puzzles: `warroom_orders` (tutorial: leave the night orders under
  the board in the memory, read them in the present) and `zetwal_bridge` (signature puzzle: lower the
  Chain Bridge with the winch, pin the pawl, cross in the present).
- **Act I, Zetwal** (about 25 to 35 minutes; content in `src/data/dialogue/zetwal.ts`, objectives in
  `src/data/quests.ts`, maps `zetwal-town`, `zetwal-house`, `zetwal-temple` from `tools/maps/*.ts`):
  the festival of Elodie's Gaze, Elodie leaves for the Throne, Anicette gives Gianna the Sun Locket,
  the first Echo in Patricio's war room the night before the signing, the Chain Bridge, Anissa's light
  waking at the Gaze lamp, Quiet Crown recruiters in the plaza, and Yari's warning, ending on a
  "To be continued: Xaraguá" card (autosaved). Flags drive everything; `tests/act.test.ts` plays the
  act from a new game.
- **Anissa's hints** (`src/engine/hints.ts`): after 3 minutes stuck on an objective she offers a
  hint, then clearer ones every 90 s up to the answer; Ask Anissa in the menu; turn them off in the
  menu (saved; save codes are now version 2 and still read version 1).
- **Journal** (menu): the current objective, the ones done, and notes (the Locket, the night orders).
- **Phrasebook**: `src/data/lang/kreyol.json` (every entry `verified: false` until a fluent speaker
  checks it); `npm run audit:lang` lists them.

Not yet (later phases): battles and Surge, pillars, debates, shops, other places.

## Layout

```
src/
  config.ts            tunable numbers
  assets.config.ts     every visual (placeholder colours for now)
  engine/              pure TypeScript, no Phaser or DOM: grid, tiledMap, mapValidation, flags,
                       conditions, dialogue, save, state, rng, scaling, world (era rules), game
                       (the rules the scene animates), sim (headless play), quests, hints, content
  data/                maps registry, NPCs, speakers, dialogue (+ dialogue/zetwal.ts), quests,
                       puzzles, cards, messages, lang glossary, content (everything, Node-safe)
  input/               input manager + keyboard, gamepad, touch sources
  scenes/              Phaser scenes (Boot, Field) and placeholder texture drawing
  ui/                  dialogue box, menu, toast, hint bubble, text panel (Journal, cards), save dialogs
maps/                  Tiled .tmj files (zetwal-*.tmj are generated by npm run maps:build)
puzzles/<id>/          solution.json and cheats.json for each puzzle
routes/                zetwal-act1.json, the scripted route through the act (tests and smoke)
tools/                 validate-maps, build-maps (+ maps/ sources), sim-setup, expand-route, audit-lang
tests/                 unit tests (Vitest) and smoke.mjs (Playwright)
```

Rules: engine code never imports Phaser and never calls `Math.random` (use `engine/rng.ts`); content
lives in `src/data`; tunable numbers in `src/config.ts`; every visual through `src/assets.config.ts`;
`import type` for types.
