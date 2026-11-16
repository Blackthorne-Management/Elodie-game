# Reviewer prompt: Caona's Conch (X-4 Where the Canoes Sleep), built Nov 16

Paste this to the objective reviewer.

> You are the objective reviewer for the Bloodlines quest, a single-player story RPG in `quest/` (Phaser + TypeScript;
> Chapters 1 to 12 and the epilogue are built; the release is Nov 22). Read `CLAUDE.md` first, above all "shown, not
> told". Then read the build outline, `docs/quest/reviews/2026-11-16-conch-outline.md`, and the "Built" note it became
> in `docs/quest/design/SECRET-ITEMS.md` section 3 (every design call there is marked "Claude's call (Nov 16)"). You
> are reviewing the branch `quest-caona-conch` against `223d4c4`.
>
> **What landed:**
> 1. **The quest** (`quest/src/data/sideQuests.ts` `CONCH_SIDE_QUESTS`, places in `quest/src/data/war.ts` `SEACAVE` and
>    `WEIR`, lines in `quest/src/data/dialogue/xaraguaConch.ts`): Chapter 11, secret; the shell diver at the hill camp
>    by day; the weed over the crack in the sea cave; a new map, the sleeping pool (`xaraguaWeir()` in
>    `quest/tools/maps/xaragua.ts`), now and on a storm night fifty years ago; the tide moved only in the memory, by
>    sitting at the scouts' fire; the net floats through the top hole of the tide post shut the gate at the top of the
>    tide (the anchor); the low hole leaves half a pool, lifted again by the haul line; the conch in the canoe's bow.
> 2. **The reward, redesigned** ("the canoes answer"): Yari carries Caona's Conch (`quest/src/data/secretItems.ts`);
>    in `customs_thorne` and `flagship_hale` Yucayeque's canoes fire one volley of their own, over the whistle's three
>    and free of the fleet's pool (`BattleBoons.fleetVolley` in `quest/src/engine/rpg.ts`, `withFleetVolley` in
>    `quest/src/engine/war.ts`, applied in `quest/src/scenes/BattleScene.ts`). Conditional lines at the tide call, the
>    whistle (fire and hold) and the caney (`quest/src/data/dialogue/xaraguaWar.ts`, `if: item.caona_conch`).
> 3. **Found in passing:** Chapter 2's escape canoe is gone from the sea cave once the party has escaped; by day in
>    Chapter 11 two canoes wait in the inlet with a scout, and a line plays on entering.
> 4. **Tests:** `quest/tests/canoesSleep.test.ts`, new cases in `tests/war.test.ts` and `tests/secretItems.test.ts`, the
>    puzzle `quest/puzzles/xaragua_weir/` (solution and four wrong ways).
>
> **Play it yourself** (`npm ci`, `npx vite --port 5311`, Playwright at 1280x720 and 844x390). The jumps are in
> `docs/quest/JUMP-POINTS.md` under Chapter 11 ("X-4 Where the Canoes Sleep"). Automated checks: `npm test`,
> `npm run level-curve`, `node --experimental-strip-types tools/battle-sim.ts customs_thorne fight 20
> item.caona_conch=true` (and without the last argument; the same for `flagship_hale`), and
> `SMOKE_FROM=chapter10-end npm run smoke`.
>
> **Check, skeptically, with file and line references and screenshots:**
> 1. Is the puzzle fair and readable from the screen alone? Can a player get stuck (any state the haul line and the
>    tide cannot undo)? Do Anissa's three hints come in place and in order, the answer last?
> 2. Shown, not told: the scouts carrying the canoe down, Caona's walk, the scouts and Caona moving to the lip when the
>    gate falls, Yari at the lip and on the rock at the tide call. Anyone in a wall, on a person, or speaking off screen?
> 3. Does the quest stay off the route (no dot, nudge or arrow before it is taken; `src/data/starts/chapters.json`
>    unchanged; the route's flags never carry it)?
> 4. The canoes' volley: modest and felt, never making Thorne or Hale free? Is "the fleet" really an effect none of the
>    other eight secret items has?
> 5. The writing: the shell diver's sea sayings, Caona short and dry, Anissa earnest and never joking, Yari proud.
>    Does Anaco's line keep the carved paddle (the seat token) and the conch apart?
> 6. The two owner questions the outline asks (section 9): would you answer them the same way?
>
> Save your review in full to `docs/quest/reviews/` (dated), with a "Fixed" line slot under each finding.
