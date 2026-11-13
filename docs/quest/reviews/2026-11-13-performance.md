# Performance on an older phone (Nov 13)

The goal: the quest should run well on an older phone (think a four-year-old mid-range Android) for the owner's
playthrough on Nov 16 and for the release. The method was to measure first, then fix only what measurably helped.
Every rule and every picture stays the same. Each fix below was checked pixel for pixel against the old build.

## How it was measured

- The built game (`npm run build`), served with `vite preview` (gzip on, HTTP/1.1), driven by Playwright's Chromium.
- The test phone was landscape 844 x 390 with device scale 2, touch on and an Android user agent. The processor was
  slowed **4x** (CDP `Emulation.setCPUThrottlingRate`), which is about a 2021 mid-range Android against a desktop.
  The first loads also ran on Chrome's **"Fast 3G"** preset (562 ms latency, about 180 KB/s down) with an empty cache.
- Places in the story: saves made by the simulator along the scripted route (`routes/zetwal-act1.json`), loaded into
  the browser the way the smoke test's `SMOKE_FROM` does. (`?at=` only works on the dev server.) The markers used:
  `plaza-present` (the festival, 18 walkers in the crowd), `samira` (Al-Doria's bazaar), `ordvik-saga` (the Skarragol
  fair), `jwaladesh-court` (Jwaladesh's bazaar) and `muster-camp` (the Muster camp in Zetwal, 96 things on the map,
  the busiest).
- Frame rate: requestAnimationFrame was counted in the page for 5 s standing still, then 10 s walking in a square
  with the arrow keys. The battle was `mangrove_crew` (four foes: lookout, smuggler, chief, lookout) with the
  Chapter 10 party of four. It was measured for 5 s idle on the menu, then 10 s with confirm pressed every 250 ms.
- Memory: from the Muster camp, 11 maps visited in turn (Zetwal's market, harbour, square, hall, temple and road,
  Al-Doria's bazaar, Jwaladesh's bazaar, the Skarragol fair, Yucayeque and the town), four times over. Textures and
  the JS heap were read after each round, with garbage collection forced.
- Two test hooks were added for this (`window.__quest.goTo(map, spawn)` and `window.__quest.stats()`). The "before"
  build is the old code plus these hooks only.

**A caveat on the frame rates.** The test machine has no GPU, so Chromium draws WebGL in software (SwiftShader) on
the processor. Most of each frame there is that software drawing, which a real phone's GPU does on its own. Frame
rates also varied a lot between runs on this machine: the same build gave 14 to 29 fps on the same map in two runs.
So the field frame rates below are the same before and after within noise. The figures that matter for a phone are
**the share of time spent in the game's own code** ("script %"), the battle (which changed far beyond the noise) and
the load times.

## What the build weighs

| Part | Files | Bytes | Fetched when |
|---|---|---|---|
| JavaScript (Phaser, all 77 maps, all dialogue and data) | 1 | 5.17 MB (1.10 MB gzip) | before anything shows |
| CSS | 1 | 19 KB (4.5 KB gzip) | before anything shows |
| Font (Atkinson Hyperlegible, 2 weights) | 2 | 35 KB | before anything shows |
| Art PNGs (`quest/art`) | 54 files, plus 30 small ones inlined in the JS | 415 KB | **before: all at boot; after: 123 KB at boot, the battle stances (287 KB) behind the field** |
| Music (15 MP3s, 128 kbps) | 15 | 16.1 MB | one song at a time, the first time it plays (already lazy) |
| Intro film (MP4 6.2 MB, WebM 7.3 MB; a browser takes one) | 2 | 13.5 MB | streamed while it plays; the title loop needs about 200 KB |
| Realm map, end-card art | 2 | 180 KB | when first opened (already lazy) |
| Icons, manifest | 4 | 5 KB | |
| **Total** | | **35.4 MB** | |

The JavaScript is about a quarter Phaser (1.2 MB minified), a third map text (about 1.8 MB) and the rest dialogue,
quests, books and the art tables. The music and the film are already loaded only when needed, so nothing large waits
at the start that should not, apart from what is listed under "Left for later".

**First load (what the browser fetches before the title):**

| | Before | After |
|---|---|---|
| Bytes | 1.56 MB | 1.27 MB |
| Requests (in Chromium's count, which includes the blob and inline images) | 139 | 75 |

## Before and after

### Load times (Fast 3G and the processor slowed 4x, empty cache; two runs each)

| | Before | After |
|---|---|---|
| Page to game canvas (download and run the JS) | 10.2 to 10.5 s | 9.7 to 11.0 s (unchanged: the same JS) |
| Title on the **first visit** (the film's first frame, "Tap to start") | **31.6 s, 30.3 s** | **15.5 s, 15.5 s** |
| Title for a **returning player** (straight to the title loop) | **33.3 s, 35.3 s** | **16.7 s, 16.7 s** |
| **First walkable map** (`?intro=0`, a new game) | **29.5 s, 28.4 s** | **15.3 s, 15.2 s** |

### Boot alone (the processor slowed 4x, no network limit: the part a phone's processor decides)

| | Before | After |
|---|---|---|
| Canvas to title | 14.4 s, 14.2 s | 1.6 s, 1.2 s (title at 4.1 to 5.1 s from the start) |
| Page to first walkable map | 17.1 s, 16.1 s | 5.2 to 5.8 s |
| Saved game to the field (the loads behind the frame-rate runs) | 16 to 20 s | 4.1 to 6.9 s |

### Frame rate in the field (the processor slowed 4x; frames per second, script % = time in the game's own code)

Before: runs 1 and 2. After: the final build. The field numbers are within the noise described above. The exception
is the bazaar's script share, which fell by half.

| Map | Before idle | Before walking | After idle | After walking | Script % before then after (idle) |
|---|---|---|---|---|---|
| Festival (`plaza-present`) | 15.7, 27.5 | 14.3, 26.5 | 28.1 | 26.5 | 18 to 21, then 20 |
| Al-Doria bazaar (`samira`) | 14.0, 20.2 | 16.3, 24.5 | 29.3 | 27.7 | **36 to 45, then 21** |
| Skarragol fair (`ordvik-saga`) | 19.9, 28.9 | 19.7, 28.4 | 29.9 | 27.5 | 19 to 21, then 19 |
| Jwaladesh bazaar (`jwaladesh-court`) | 25.9, 28.6 | 26.4, 29.8 | 30.2 | 28.6 | 22, then 20 |
| Muster camp (`muster-camp`) | 16.8, 27.4 | 17.5, 26.7 | 27.0 | 26.2 | 21 to 22, then 21 |

The 95th-percentile frame while walking is 50 ms in every final run. The one long frame on the Jwaladesh bazaar
(450 to 680 ms, the same before and after) is the walk going through a door: the next map being built.

### Frame rate in battle (`mangrove_crew`, four foes against four)

| | Before (two runs) | After (three runs) |
|---|---|---|
| Idle on the menu | 11.4, 15.6 fps | 17.4, 21.0, 23.9 fps |
| Fighting (confirm every 250 ms) | 9.3, 12.7 fps | 18.5, 21.1, 20.5 fps |
| Script % idle | 18.6, 18.1 | 8.3, 11.2, 6.4 |

### Memory (11 maps visited four times over, from the Muster camp)

| | Before | After |
|---|---|---|
| Textures held at the first map | 1,129 (6.7 Mpx, about **25.5 MB** of graphics memory, and the same again in canvases) | 229 (1.4 Mpx, about **5.3 MB**) |
| After round 1 (11 maps seen) | 1,129 | 303 (7.9 MB): drawn as new people appear |
| After rounds 2, 3 and 4 | 1,129, 1,129, 1,129 | 303, 303, 303: **nothing piles up** |
| JS heap | 22.1, then 22.4, 22.6, 22.7, 22.9 MB | 18.7, then 19.9, 20.1, 20.3, 20.3 MB |
| Page objects (DOM nodes, which include texture canvases) | 1,235 throughout | 317, then 392 |
| Game event listeners | 74 throughout | 74 throughout |
| Map change (median, longest) | 228 ms, 392 ms | 201 ms, 733 ms (the first visit to a map draws its people; later visits are as before) |

Textures do not pile up between maps, before or after. The heap grows by about 0.1 to 0.2 MB per eleven map changes
in both builds, which is small (about 2 MB over a 200-door evening). It is listed under "Left for later".

## What was found, and what changed

1. **Boot drew every walk sheet and portrait in the game (12 of the 15 s of boot at 4x).** `makeAllTextures` drew all
   439 walk sheets, 455 portraits and every expression at start-up, pixel by pixel. Each one then went to the GPU
   (`texImage2D`, 3 s of it). A map shows perhaps 20 of them.
   *Change (`src/scenes/textures.ts`):* the sheets, portraits, expressions and battle stances are now each drawn the
   first time anything asks for them. The texture manager's `exists`, `get` and `getFrame` draw a waiting texture
   first, so every caller (sprites, `setTexture`, the dialogue box's and the menu's `exists` checks, the voyage) finds
   it as if it had been made at boot. The drawing code is the same.
   *Checked:* all 935 such textures were drawn by the old build (at boot) and the new one (on first use). Their
   pixels and frames were hashed: **935 of 935 identical**.
   *Gain:* about 12 s off the boot at 4x. About 20 MB less graphics memory, and as much again in canvases.

2. **The battle stances held the title on a slow connection.** They are 32 PNGs, 287 KB and more than half of the
   art's bytes, and the boot waited for all of them.
   *Change:* they load in the background once the field is up (`loadBattleArtBehind`, from the Field scene). A
   battle that opens before they are all in loads the rest in its own `preload` first (`preloadBattleArt`, which
   takes over any file still loading, so none is added twice).
   *Gain:* about 300 KB and 64 requests off the first load. Every fight shows the same stances.

3. **The field was drawn under every battle.** `scene.pause()` stops a scene's updates but not its drawing, so the
   whole map (its tile layers and sprites) was drawn every frame under the battle, which covers it completely.
   *Change (`src/scenes/FieldScene.ts`):* the field is hidden while the battle runs and shown again on `battle-done`
   or `battle-lost` (Phaser shows a scene again on its own when it restarts).

4. **The battle's painted backdrop was rebuilt every frame.** It is one Graphics object of several hundred shapes
   (sky bands, dithered seams, cobbles, clouds, ellipses), and it was re-tessellated each frame.
   *Change (`src/scenes/BattleScene.ts`):* it is drawn once, at the screen's render scale, into a render texture,
   which is shown as one picture.
   *Checked (3 and 4 together):* for all 24 backdrops, the old build and the new one were screenshotted with the
   battle paused and only its drawn layers showing (backdrop and strip). This was done at device scale 2 (render
   scale 4) and at scale 1 (render scale 2): **24 of 24 identical, pixel for pixel, at both scales**. That also
   proves the battle covers the field completely.
   *Gain:* battle 9 to 16 fps became 17 to 24 fps, and the battle's own script time halved.

5. **The guide's pointer replayed the map's conversations every frame.** When the story's stop was on screen,
   `tickPointer` asked `logic.markers()` whether the stop already had a "!" over it. `markers()` dry-runs every
   conversation on the map (`hasNews`) to see who has news. On Al-Doria's bazaar, that was 24% of the slowed
   processor's time, about 15 ms a frame.
   *Change:* the field keeps the marker tiles and works them out again only when the flags, the era or the map
   change. `FlagStore` gained a `version` that counts every change, unit tested in `tests/flags.test.ts`. The answer
   is the same as working it out every frame, because `markers()` depends only on those.
   *Gain:* the bazaar's script share fell from 36 to 45% to 21%, the same as every other map.

6. **The minimap was repainted tile by tile every frame** (`SideMap.follow`, 768 rectangles a frame).
   *Change (`src/ui/SideMap.ts`):* it is drawn again only when Gianna's tile, the blink, the map or the targets
   change. The picture is the same.

Not changed, because the measurements did not call for it: music loading (already one song at a time, decoded only
while it plays), the intro film (streamed), the realm map and the card art (already on demand), and the render
scale. The canvas is 1280 x 720 at this phone's size. Lowering it would make the software renderer here faster, but
it would change the picture, and a real phone's GPU draws that size easily.

## Checks run

- `npx vitest run`: 86 files, 1,398 tests passed (one new: the flag store's version).
- `npm run typecheck` and `npm run lint`: clean.
- `npm run build`: built.
- The smoke test, twice. First `SMOKE_FROM=cane-road SMOKE_TO=side-quests-done`: the route from the cane road to the
  end of Chapter 1's side quests, including the boar fight, matched the simulator after every key, with no page
  errors. Then `SMOKE_TO=boar-won`: phases 1, 2 and 4 (walking, dialogue, saves, the touch overlay at several phone
  sizes, the hints, Game Over on purpose twice with Rise and the rematch) and the route to the boar won. 214 checks
  passed, with no page errors.
- The two pixel comparisons above (935 textures, 24 backdrops at two scales).

## Left for later (recommended, not done)

1. **Split the JavaScript by chapter.** About 9 to 10 s of the slow-connection load is the 1.1 MB of gzipped JS,
   most of it maps and dialogue for chapters the player has not reached. Loading a chapter's maps and dialogue when
   it starts would roughly halve that wait on 3G. It is not easy: `CONTENT` and the map table are built as one piece
   at boot, and every map is parsed there. It is a few days' careful work, so it is better after Nov 16 than before.
   Brotli on the host (Netlify does it on its own) already trims about 15%.
2. **Parse maps when entered, not all at boot.** `main.ts` parses all 77 maps up front. It is cheap next to the old
   texture drawing (well under a second at 4x), but it is the next thing on the boot's list once the JS is split.
3. **The Anissa hints and the side-quest nudges** (`tickHints`: `anissaLines`, `mysteryQuests`, `sideNudges`) and
   `tickCrowd` evaluate conditions every frame, about 2 to 4% of the slowed processor. They could be cached on the
   flag store's new `version` the way the markers are. It is a small gain, so it was left alone to keep the rules
   untouched.
4. **`markers()` on entering a map** costs about 260 ms at 4x on the busiest maps (it replays every conversation).
   It is hidden in the door's transition today. A cheaper "has news" test would shorten every door.
5. **A small heap growth per map change** (about 15 KB a door, the same before and after). It is harmless for an
   evening's play but worth a look with a heap snapshot later.
6. **A first-use hitch:** a person who walks on in the middle of a scene is drawn the moment they appear (about
   20 ms at 4x, one frame). A map's people could be drawn as the map opens instead.
7. **The intro film** is 6 to 7 MB. A first-visit player on 3G sees the title quickly (the film streams), but a
   lower-bitrate 480p copy for small screens would play more smoothly on a weak connection.
8. **A real-phone check:** these numbers come from emulation. One run on an actual older Android before Nov 16 (the
   title time, a walk on the bazaar, one fight) would confirm them; `chrome://inspect` shows the same frame meter.

## How to repeat this

The scripts are in the session's scratch folder, not in the repository. They are short:

1. Make the saves: play the route with `tools/sim-setup.ts`, as `tests/smoke.mjs` does for `SMOKE_FROM`.
2. Load each save with `?intro=0&install=0&seed=<dice>`, throttle with CDP and count frames.
3. Read `window.__quest.stats()` after `window.__quest.goTo(map)` for memory.

The two hooks are in `FieldScene.ts` next to the smoke test's other hooks.
