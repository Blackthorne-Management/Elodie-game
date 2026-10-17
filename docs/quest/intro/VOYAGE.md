# The voyage: Pòdlimyè to Yucayeque (for the animator)

Owner request (Oct 17): between Chapter 1 and Chapter 2 the party does not jump; they sail. The game draws a
version itself (`quest/src/scenes/VoyageScene.ts`, about 15 seconds, skippable). If the animator makes a
painted version, it replaces the game's drawing: send an MP4 and it plays in the same place, skippable the
same way.

**Format:** 16:9, 1920 x 1080 (it is shown at 1280 x 720), 12 to 16 seconds, no burned-in text (the game adds
the captions in its own font so they can be translated), no audio needed (the game plays `farewell.mp3`), end
on black. File: `docs/quest/intro/voyage-zetwal-xaragua.mp4`.

## Shot 1: the harbor at dawn (about 5 seconds)

- Looking down at Pòdlimyè's harbor at dawn: warm orange-pink sky, turquoise shallows, the city's red roofs and
  the pier on the left (west).
- Yari's canoe, a dugout hollowed from one trunk, paddles east out of the harbor. In it: **Yari** (paddling, at
  the stern), **Gianna** (blue robe, curly hair) and **Anissa** (small, in pink, with a soft golden glow around
  her). Yari's hutia sits at the bow.
- Beyond the reef waits a **Zetwal merchant ship** with **golden sails** and an orange band (the sun's colours),
  two masts. The canoe comes alongside; they climb aboard; the sails fill.
- Game caption (added by the game): "Yari paddles out to a Zetwal ship waiting beyond the reef." then "All aboard.
  The golden sails fill."

## Shot 2: the route on the realm map (about 9 seconds)

- The board game's painted realm map (`docs/art/board-layout.png`, the same picture as the menu's realm map),
  seen from above.
- A small golden-sailed ship leaves **Zetwal's east coast**, sails **north** up that coast, **west across the
  top of the map, north of Ardencia**, then **south down the strait between Ardencia and Xaraguá** and into
  Xaraguá's bay. A dotted golden wake trails behind it.
- The exact route the game uses is plotted over the board's sea in `quest/src/data/voyages.ts` (cells of a
  128 x 128 grid over the board: start 119,37; north to 121,9; west to 62,9; then 47,14; landing 46,32).
- Game captions: "Out past the reefs of Zetwal..." / "North, around the cliffs of Ardencia..." / "...and down
  the strait to Xaraguá."

## Shot 3: arrival (under a second)

- Fade to black. The game opens on Yucayeque's pier, where the Crown's marines are waiting.

## Reference pictures

- The game's own version, frame by frame: run the quest (`npm run dev`), finish Chapter 1, or ask Claude for
  the two screenshots (`quest3-voyage-harbor`, `quest3-voyage-map`).
- Characters: `docs/quest/ART-PROMPTS.md` (Gianna, Anissa) and the character sheets in `quest/art/characters/`
  (Yari is `yari.png`).
