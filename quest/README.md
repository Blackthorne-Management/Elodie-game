# Bloodlines: Echoes of Zetwal (quest)

A single-player pixel RPG set in the world of the Bloodlines board game. The design lives in
`../docs/quest/QUEST-BUILD-GUIDE.md`. This folder is a self-contained project: its own
`package.json`, `node_modules`, TypeScript, Vite, Vitest and oxlint configs. It does not touch the
board game app; the site's build runs `npm ci && npm test && npm run build` here and serves the result
at `/quest/`.

**Status:** Phase 1 (skeleton) and Phase 2 (the Echo, puzzles, and Act I in Zetwal) are done, plus a
playability pass from the owner's phone test: an 8-direction analog stick, a 320 x 180 (16:9) screen,
readable drawings for every story object, interaction markers, name labels and Echo-change feedback.

## Run

```sh
cd quest
npm install
npm run dev            # http://localhost:5180 (add -- --host to open it on a phone on the same Wi-Fi)
```

URL options: `?map=test-village` starts a new game (when there is no save) on another map;
`?hintms=3000` makes Anissa's first hint come after 3 s instead of 3 minutes; `?touch=1` forces the
touch overlay.

**Phones play from the home screen.** On a phone or tablet in the browser the quest shows how to add it to
the home screen instead of starting (owner decision, Oct 16; `src/engine/install.ts`). Computers play in the
browser. The dev server (`npm run dev`) skips the screen so a phone on the same Wi-Fi can test in the
browser; `?install=1` shows it anyway, `?install=0` skips it.

**Jump to a chapter (dev server only).** `?chapter=2` starts a new game at the Yucayeque pier (`?chapter=3` on Pòdlimyè's long pier before the voyage to Ardencia, `?chapter=4` at the Free Brasador camp on Ardencia's strand at first light, where Chapter 4 begins with the trader's ready check, `?chapter=5` at Eightgate's Gold Gate as the Dorini caravan comes in, `?chapter=6` on the Winter Plateau road into Ordvik after Chapter 5's card, `?chapter=7` on Kirinoura's Lantern Pier after the longship's voyage, `?chapter=8` on the same pier after Chapter 7's card) with the party, bag,
gear, gold and story the scripted route leaves at the end of Chapter 1 (`src/data/starts/chapters.json`, written by
`npx tsx tools/chapter-starts.ts`; a test keeps it in step with the route). Use a private window: the game autosaves
over your usual save.

Controls:

| Action  | Keyboard                        | Gamepad (standard)       | Touch                          |
|---------|---------------------------------|--------------------------|--------------------------------|
| move    | arrows / WASD (two = diagonal)  | left stick / D-pad       | analog stick (left third)      |
| confirm | Z / Enter / Space               | A                        | A                              |
| cancel  | X / Backspace                   | B                        | B                              |
| run     | hold Shift (or X)               | hold B (or R)            | push the stick all the way, or hold B |
| echo    | E                               | X                        | Echo                           |
| menu    | Escape / M                      | Start                    | Menu                           |

The touch overlay appears on touch devices (force it with `?touch=1`).

**Moving in eight directions.** Movement is still tile by tile, but a step can be diagonal. A diagonal
step needs the target tile and both straight tiles it passes between to be open (no cutting a wall's
corner, no squeezing between two blocked tiles, no slipping past a person), so diagonals only shorten
walks straight steps could already make: they never open a way around a puzzle
(`tests/diagonal.test.ts` checks every map in both eras, and the puzzles' cheat lists include diagonal
cheats). A diagonal step takes 1.41 times as long. When held input asks for a refused diagonal, the
player slides along the wall (the horizontal part, else the vertical part). Diagonal steps onto a door
or a trigger work like straight ones. Sprites have four facings, so a diagonal shows its horizontal
side; A (and the name label) looks at the diagonal tile first, then the tile the sprite faces.

**Smooth walking.** The logic still moves one tile at a time, but the picture glides
(`src/engine/motion.ts`, `tests/motion.test.ts`): a constant speed in pixels (walk 4.5 tiles a second,
run 8, the same on diagonals, in `src/config.ts`), driven by the frame's delta time. While a direction
is held, the next step starts in the very frame the last one ends and carries that frame's leftover
distance, so there is no pause at tile edges at any frame rate; a direction tapped in the last 90 ms of
a step is kept for the next one. A tap always walks one tile (taps are how puzzles are solved, so
there is no turn-in-place delay). The walk frame comes from the distance walked (step A, stand, step
B, stand every two tiles), so the cycle carries on across tiles and Anissa walks in step. The camera
is placed by hand each frame on the same whole pixel as Gianna, so nothing shimmers.

**The touch stick** floats: it rests at the bottom left, and wherever a thumb lands in the left third
of the screen the ring jumps there (kept on screen) and the knob follows the thumb inside it. A 25%
dead zone, eight 45 degree sectors, and leaning past 85% runs (B still runs too). The gamepad's left
stick uses the same eight sectors (`stickDirection` in `src/input/actions.ts`); its D-pad and the
keyboard make diagonals by pressing two directions together.

**What the player sees.** Every story object has its own drawing (`src/assets.pixels.ts`), with
before and after states where the story changes it: the Gaze lamp (unlit, lit with a pulsing light),
the chain winch and the pawl (oiled in the Echo, rusted today, pinned once Patricio drives the pin),
the Chain Bridge (raised upright against the island, lowered across the chasm), the collapsed rope
bridge, the map table (dust sheet today, war map in the Echo), the loose floorboard, doors, signs, the
Marshal's Stone (and its cut stones in the Echo), name stones, shrines, wells, crates. A bobbing "!"
floats over people with something new to say (talking would change a flag; `GameLogic.markers` dry-runs
their dialogue), and a sparkle over things not used yet; both go away once used. Facing a person,
object or door shows a name label ("Gaze Lamp", "Chain Winch (rusted)", "Rope Bridge (collapsed)",
"Elodie Limyè, Mother"; names in `src/data/npcs.ts` and `src/data/objects.ts`). A on an object with no
dialogue of its own shows a one-line description. Coming back from the Echo after an anchor changed
something, the changed present-day objects glow for a few seconds, a toast says "Something changed:
...", and the Journal keeps a "Something changed" note. The cast differ at a glance: Gianna (curly hair,
blue archivist robe, satchel, the Locket), Anissa (small, two puffs, pink), Elodie (tall, gold gown and
circlet), Anicette (purple dress, wine head wrap), old Patricio (white beard, marshal's red coat, cane),
young Patricio (bicorne, red coat, sash), Yari (headband, bow, her hutia at her feet), and the Quiet
Crown's hooded recruiters (grey hood, a silver crown on the chest).

**Real art drops in file by file** (sizes, palette and prompts in `../docs/quest/ART-STYLE.md`). Put
PNGs in `quest/art/` and rebuild; each replaces its placeholder, and a missing file keeps the
placeholder (Vite lists the folder at build time, so nothing is requested that is not there):

| File | Size and layout |
|------|-----------------|
| `art/characters/<look>.png` | walk sheet, 3 columns x 4 rows of equal cells (24 x 32, so 72 x 128): rows down, left, right, up; columns standing, step A, step B. Looks: `gianna`, `patricio_young`, `anissa`, `elodie`, `anicette`, `patricio_old`, `yari`, `recruiter`, and the others in `NPC_SPRITES` |
| `art/portraits/<portrait>.png` | 48 x 48 dialogue portrait (the keys of `PORTRAITS`: `gianna`, `patricio`, `anissa`, ...) |
| `art/tiles/<tile>.png` | 16 x 16 tile, by `TILESET` name (`grass`, `winch`, `bridge_old`, ...) |
| `art/objects/<kind>.png` | a large object drawing by `OBJECT_ART` name (`gaze_lamp`, `gaze_lamp_lit`, `war_table`, `chain_bridge_up`) |

**Credits.** The menu has a Credits screen (`src/data/credits.ts`, mirrored in `assets/CREDITS.md`).
No third-party art is used yet: the build machine's network refused kenney.nl and opengameart.org, so
every picture is drawn by the game itself.

**Phones.** The picture is fitted to the *visible* viewport (`window.visualViewport`, without the
browser bars), whole-number zoom when at least 2x fits, otherwise the exact fit; centred and
letterboxed, refitted on resize, rotation and visual viewport changes (`src/ui/screen.ts`,
`fitZoom` / `fitRect` in `src/engine/scaling.ts`). The page never scrolls; pinch and double-tap zoom
are cancelled (iOS ignores `user-scalable=no`). The full-screen button (top right, and Full screen in
the menu) uses the Fullscreen API and locks landscape where allowed; Esc leaves. On iPhone, which has
no Fullscreen API for pages, it explains Add to Home Screen instead: `public/manifest.webmanifest`
opens the quest full screen and landscape from the home screen (no service worker). The button is
hidden when opened from the home screen. Icons: `npm run icons` regenerates `public/icons/*.png`.

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

`npm run smoke` keeps the Phase 1 checks (on the test village), drags the touch stick on a phone-size
screen (right, then up-right for a diagonal step; the ring floats to the thumb and returns to rest),
checks Anissa's hints and the Journal, then plays Chapters 1 to 7 in the browser from a new game by
the route in `routes/zetwal-act1.json` (which includes a diagonal step, pressed as two keys at once;
each chapter's end from Chapter 3 checks its story flags against the simulator's, its fights, the party and who walks
with it). `SMOKE_FROM=<marker>` (e.g. `chapter5-end`) runs only the route from that marker on: the simulator plays up
to it and the browser loads its save there, with the encounter dice where the whole route's stood (`?seed=`).
The headless simulator replays the same route alongside, so after every key the browser must show
exactly the map, tile, facing, era, mode and dialogue line the engine predicts; at the route's
`@markers` the name label and the markers must match the engine too, and after the bridge the changed
objects must glow and the Journal say "Something changed". It writes `quest-*.png` (Phase 1),
`quest3-stick-phone.png`, `quest3-<moment>-desktop.png` / `quest3-<moment>-phone.png` (844 x 390) at the
route's `@markers`, and `quest-fit-844x390.png` / `quest-fit-667x375.png` from the phone-fit checks
(canvas and controls inside the viewport at four landscape phone sizes, no scroll, full-screen toggle,
manifest), to `SHOT_DIR` (default: the OS temp directory): the plaza, a diagonal step, the name label,
the study in the present and in the Echo, the rope bridge, the winch and bridge before / in the Echo /
after, the lamp unlit and lit, the end card, and Anissa's first line. It uses a local `playwright` if there is
one, else the global install, and runs Node with `--experimental-strip-types` to load the engine.

## What Phase 1 contains

- **Phaser 3** (`pixelArt`, 320 x 180 logical resolution (16:9, 20 x 11.25 tiles; it was 240 x 160 in
  Phases 1 and 2), whole-number scaling (exact fit below 2x), letterboxed, landscape; a map smaller
  than the screen is centred, `cameraBounds` in `src/engine/scaling.ts`), 16 x 16 tiles, 24 x 32
  characters (chibi: a big head, about 40 % of the height; they were 16 x 24 until the art pass). All art is placeholder pixel art drawn at boot from `src/assets.config.ts`; real art
  files replace it one by one (above).
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
- **Music and sound** (`src/audio.config.ts`, `src/audio/`, `engine/audioPlan.ts`): the owner's ten
  Pòdlimyè songs (originals in `docs/quest/audio/`, 128 kbps copies in `public/audio/music/`), one per
  area, the Echo theme in a memory, the battle theme and victory fanfare in fights, and the farewell when
  seeing Mother off. Songs fade into each other and loop by fading each pass into the next. The sound
  effects and the wordless voices (a blip per syllable at each speaker's pitch) are made in code
  (`src/audio/sfx.ts`). Nothing plays until the first tap or key; Music and Sound volumes are in the
  System menu.
- **Street debates** (guide 7.2; `engine/debate.ts`, `data/debates.ts`): Pòdlimyè's corner on the lawn
  below the plaza (a Gaze keeper against a Quiet Crown speaker, "Is a goddess who only remembers any
  use?") opens with the city. Listen (+1 Influence once), Join (three rounds; answer each claim with
  Scripture, Reason when a lore book backs it, or Compassion; two strong answers win), Mediate (Influence 5
  in the city) or Provoke. Concord (0 to 100, starts at 50, shown in the menu) and the rewards are in
  `config.ts`; each outcome pays once.
- **Closed doors.** A door with an `if` condition is closed until it holds; walking into it plays its
  `closed` dialogue instead (the validator requires both). The opening uses it (owner decision, Oct 16):
  every way out of the Festival Plaza is closed until Mother has left, then only home opens, and the
  rest open when the war room memory is done; Anissa says why (`plaza_door_closed`). Side quests are
  not offered until then either.
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
  assets.config.ts     every visual (placeholders, the palette, the art file names)
  assets.pixels.ts     the placeholder pixel art (rows of palette keys) and the 33-colour palette
  engine/              pure TypeScript, no Phaser or DOM: grid, tiledMap, mapValidation, flags,
                       conditions, dialogue, save, state, rng, scaling, world (era rules), game
                       (the rules the scene animates), sim (headless play), quests, hints, content
  data/                maps registry, NPCs, speakers, dialogue (+ dialogue/zetwal.ts), quests,
                       puzzles, objects (names, inspect lines, door labels), credits, cards,
                       messages, lang glossary, content (everything, Node-safe)
  input/               input manager + keyboard, gamepad, touch sources
  scenes/              Phaser scenes (Boot, Field), texture drawing (textures.ts; pure pixel drawing in
                       pixels.ts) and the art files found in quest/art (artFiles.ts)
  ui/                  dialogue box, menu, toast, hint bubble, text panel (Journal, cards), save dialogs
art/                   drop real art here (characters/, portraits/, tiles/, objects/); see above
assets/CREDITS.md      third-party assets and their licences (none yet)
maps/                  Tiled .tmj files (zetwal-*.tmj are generated by npm run maps:build)
puzzles/<id>/          solution.json and cheats.json for each puzzle
routes/                zetwal-act1.json, the scripted route through the act (tests and smoke)
tools/                 validate-maps, build-maps (+ maps/ sources), sim-setup, expand-route, audit-lang
tests/                 unit tests (Vitest) and smoke.mjs (Playwright)
```

Rules: engine code never imports Phaser and never calls `Math.random` (use `engine/rng.ts`); content
lives in `src/data`; tunable numbers in `src/config.ts`; every visual through `src/assets.config.ts`;
`import type` for types.
