# Echoes of Zetwal: art style guide

A short guide for the real art that will replace the quest's placeholders. The placeholders already
follow it (they are drawn from `quest/src/assets.pixels.ts` and `quest/src/scenes/pixels.ts`), so a
new file should sit next to them without looking out of place.

## 1. The screen and the sizes

| Thing | Size | Notes |
|---|---|---|
| Screen | 320 x 180 (16:9) | 20 x 11.25 tiles. Scaled up by whole numbers (x2 on a phone, x4 on a laptop, x6 on a TV). |
| Tiles | 16 x 16 | Ground, walls, props. One file per tile. |
| Characters | 24 x 32 | 4 directions x 3 walk frames (a 72 x 128 sheet). Chibi proportions: the head about 40 % of the figure. Feet on the bottom row of the cell, the figure centred on its torso. Children and Anissa are drawn smaller inside the same cell. Grown men who must stand taller than Gianna (Azzy) use a 28 x 36 cell (an 84 x 144 sheet); the game reads the cell size from the file and stands everyone on their feet. |
| Large objects | any multiple of 16 wide; as tall as needed | Drawn standing on the bottom edge of the object's tiles (the Gaze lamp is 32 x 32 on a 2 x 1 tile plinth). |
| Dialogue portraits | 48 x 48 | Bust, facing the viewer. Draw masters at 64 x 64 if you like, but export 48 x 48: the box shows them at 48. |
| Interface text | 8 game px (9.5 in Large) | Atkinson Hyperlegible, drawn by the game at the screen's sharpness (`quest/src/ui/text.ts`); never drawn into art. |

Pixel rules: hard pixel edges, no anti-aliasing, no gradients, no semi-transparent pixels in sprites
(transparent or opaque only), light from the top left, no dithering inside sprites (the Echo filter
adds its own).

## 2. Outlines

- **Characters**: a 1 px outline in `#1a1420` (palette `k`) around the whole silhouette, including
  what they carry (Yari's bow, her hutia, Patricio's cane). Inner lines may use a darker shade of the
  part they sit on.
- **Standalone props** (lamp, winch, signs, barrels, crates, the bridge): the same 1 px dark outline,
  so they read as things you can use.
- **Ground** (grass, paths, plaza stone, water, floors, rugs): no outline. Walls and roofs: no outer
  outline, only their own mortar or tile lines.
- A soft shadow (black at 30%) under characters is drawn by the game; do not paint one into the sheet.

## 3. Palette (33 colours)

Keep to these; a land's accent (section 4) may add up to four shades of its own colour.

| Key | Hex | Use |
|---|---|---|
| k | `#1a1420` | outline, near black, deepest shadow |
| K | `#3a3440` | dark grey, iron shadow, dark cloth |
| g | `#6e6a78` | grey, stone shadow |
| G | `#a8a6b4` | light grey, stone |
| h | `#d8d0c0` | pale stone, white hair |
| w | `#f4ecd8` | cream: paper, linen, text |
| W | `#fff8e0` | near white: highlights, flame core |
| b | `#3e2614` | dark brown: wood shadow, hair |
| B | `#6b4426` | brown: wood, leather |
| n | `#9c7446` | wood |
| N | `#c8a46b` | light wood, rope |
| s | `#4a2a18` | skin, deep |
| S | `#7a4a2a` | skin, mid |
| T | `#b07850` | skin, light |
| r | `#7a2a26` | dark red: the marshal's coat |
| R | `#b8403a` | red: revolutionary coat, banners, gems |
| o | `#e0782a` | orange: lanterns, flame edge |
| y | `#f2d04b` | gold: Kay Soley, trim, the Sun Locket |
| Y | `#fff2a0` | pale yellow: glow, Anissa's light |
| l | `#2a5e2f` | dark green: foliage shadow |
| L | `#4f9a4a` | green: grass, leaves, Yari's tunic |
| v | `#8cc860` | light green: leaf highlights |
| u | `#2a3a78` | navy: trousers, deep water |
| U | `#3b4fa8` | blue: Gianna's archivist robe |
| c | `#3a6fb8` | water |
| C | `#9ad8ff` | sky, shimmer, Echo Zones |
| p | `#5a3a78` | purple: Anicette's dress |
| P | `#e8a8c0` | pink: Anissa's dress |
| m | `#8a3050` | wine: cushions, Anicette's head wrap |
| e | `#8a4a2a` | rust |
| E | `#b86a3a` | light rust |
| i | `#4a4a52` | iron |
| I | `#c8c8d0` | steel, silver (the Quiet Crown's emblem) |

**The Echo** (fifty years ago) uses the same art: the game lays a warm sepia filter and a light dither
over it. Echo-only tiles (tents, barricades, the oiled winch) use the same palette, a little more
saturated and less worn than their present-day versions.

## 4. Each land's accent

The accent colours match the board game's house colours (`src/assets.config.ts` `HOUSE_ART` in the
repository root). Use the accent on banners, roofs, trims, uniforms and the land's light; keep the
rest of a tileset in the shared palette so the lands belong to one world.

| House | Land | Accent | Board terrain (base / ink) | Feel |
|---|---|---|---|---|
| Kay Soley | Zetwal | `#d4ac0d` gold | `#4f4a26` / `#a89842`, rays | Kreyol/Haitian-inspired; sunlit plaza, lanterns, the Temple of Elodie |
| Brasador | Ardencia | `#b03a2e` red | `#4a2a24` / `#a5523c`, peaks | Spanish-inspired; fire-cracked highlands, iron and red stone |
| Yaguana | Xaraguá | `#17a5a5` teal | `#1f4446` / `#3f9490`, waves | Taíno-inspired; island coast, canoes, the areíto |
| Dorini | Al-Doria | `#1e8449` green | `#5a4a2c` / `#a88d4c`, dunes | harbour bankers, ledgers, domes |
| Ironvow | Skarragol | `#5d6d7e` slate | `#33403e` / `#6f8a84`, tufts | steppe and cold stone |
| Suzumori | Kuroshi | `#7d3c98` violet | `#2f3442` / `#6a7390`, mist | misted hills, lacquer, paper screens |
| Agnivansh | Jwaladesh | `#e67e22` saffron | `#4d3220` / `#b0703a`, embers | temples of flame, the harbour chain |
| Stillwater | Aldermoor | `#2e86c1` blue | `#3a3044` / `#7d6490`, heather | the Crown's grey-blue court and records |

## 5. The cast

Hair textures and skin tones should be drawn with care and respect; the people of Zetwal are
Haitian-inspired, Yari is Taíno-inspired, the Rodriguez line Spanish-inspired.

- **Gianna Elise Limyè** (Gigi), early twenties, the heroine. Mage-healer and junior archivist at the
  Temple of Elodie. Deep brown skin, long dark curly hair, a blue archivist's robe with gold trim, a
  leather satchel of notes across her body, and the **Sun Locket** (gold) on a chain once Anicette
  gives it to her. A faint sun-shaped birthmark (portrait only). Calm, precise; a healer's hands.
- **Anissa** Limyè, two years younger. Small and very shy, two round hair puffs, a pink dress with a
  cream collar. She carries the goddess's light: in the Echo she is drawn as a glowing figure
  (the game tints her). Portrait expressions: shy, worried, brave, glowing, smiling.
- **Yari**, Gianna's best friend, House Yaguana, heir of the cacique line, an archer. Light-brown
  skin, long straight black hair with a red headband, a green tunic with orange trim, a bow across her
  back, and her **hutia** (a small brown Caribbean rodent with round ears) at her feet or on her
  shoulder, who steals shiny things.
- **Azriel "Azzy" Rodriguez**, older half-brother, a Blade-Knight. Rael's son by a Skarragol royal:
  Spanish and steppe features, dark hair tied back, a red and iron Brasador half-cape over dark
  leather, a long sword. Proud, then shaken.
- **Rael the Ruthless**, Lord of Ardencia. Tall, dark beard going grey, a heavy black and red coat with
  iron clasps, a fur-lined collar, a sword he rarely draws. Reads as a warlord; the eyes are tired, not
  cruel.
- **Marshal Patricio Jean-Philippe, young** (the player in the Echo, a Warden): deep brown skin, short
  black hair, a broad, solid build, a short beard, a deep red officer's coat with gold buttons and epaulettes,
  a sky-blue sash, a black bicorne with a gold sun cockade, white breeches, tall black boots, a cutlass.
  Determined, warm. Taller than Gianna (28 x 36 cell).
- **Marshal Patricio Jean-Philippe, old** (the present): bald with white hair at the sides, a white
  beard, the same red coat now darker and worn, gold epaulettes, a cane.
- **Elodie Limyè** (born Jean-Philippe), head of the Zetwal state: tall, deep brown skin, dark hair in
  a high bun, a gold gown with a cream sash, a gold circlet with a red stone. Composed; a diplomat.
- **Anicette**, the grandmother and keeper of the Temple, about 72: short grey hair under a purple
  and gold madras head wrap (a tignon), a long plum robe with gold trim, a white shawl, a gold sash, a
  sun pendant, a wooden staff topped with a gold sun. Shrewd, kind, gossips about the Ash Wars.
- **The Quiet Crown** (the cult; the hooded recruiters in Zetwal, and later enemies): a deep charcoal
  cowl and robe with a faint violet cast, the face visible under the cowl, a **bone-white veil** over
  the mouth and chin (they "steal voices"), a small **silver crown sigil** over closed lips on the
  chest, a silver cord belt. Men taller and broader (28 x 36 cell, like Azzy); women with a long braid
  falling from the cowl down the back (24 x 32). Polite and unsettling. **One sheet per sex serves
  every member:** the game recolours the skin per person (`SKIN_TONES` in `quest/src/assets.config.ts`:
  light, tan, medium, brown, deep; looks `quiet_crown_<m|f>_<tone>`). For that to work, skin must be
  the only warm colour on the figure: no gold, brown, orange, red or tan anywhere on the outfit, and
  dark hair that is near-black rather than brown. Files: `characters/quiet_crown_m.png`,
  `characters/quiet_crown_f.png`, `portraits/quiet_crown_m.png`, `portraits/quiet_crown_f.png`.

## 6. Prompts for a pixel-art generator

The full Gemini prompts for art drop 1 (the goddess, Elodie, Patricio young and old, Anicette young and old, the
Sun Locket and Solange's Quill) are in `docs/quest/ART-PROMPTS.md`. The templates below are the short versions.

For PixelLab or Retro Diffusion style tools. Generate on a flat magenta background (`#FF00FF`), then
remove the background, snap to the grid with nearest-neighbour downscaling, and quantize to the
palette above (guide 10.1). Fix drifting frames by hand.

**Walk sheet template.** "Pixel art sprite sheet, top-down JRPG, Game Boy Advance era. [CHARACTER].
4 rows (facing down, left, right, up), 3 columns (standing, left foot forward, right foot forward),
each cell 24 x 32 pixels, chibi proportions (big head), character's feet on the bottom row of each cell. 1 pixel dark outline
#1a1420, flat colours from a 32 colour palette, hard pixel edges, no anti-aliasing, no gradients, no
text, no shadow. Solid magenta background #FF00FF."

**Portrait template.** "48 x 48 pixel art dialogue portrait, bust facing the viewer, [CHARACTER],
expression: [EXPRESSION]. 1 pixel dark outline, flat colours, 32 colour palette, hard pixel edges, no
anti-aliasing, no text. Plain magenta background #FF00FF."

Ready to paste ([CHARACTER] filled in):

| Who | Walk sheet: [CHARACTER] | Portrait: [CHARACTER] (expressions) |
|---|---|---|
| Gianna | young woman, early twenties, deep brown skin, long dark curly hair, blue archivist robe with gold trim, leather satchel strap across the body, small gold sun locket | young woman healer-scholar, deep brown skin, long dark curly hair, blue robe with gold trim, gold sun locket, faint sun-shaped birthmark on the cheek (neutral, determined, worried) |
| Anissa | small shy girl, about twenty but small, brown skin, two round hair puffs, pink dress with cream collar | shy young woman, brown skin, two round hair puffs, pink dress, soft golden light around her (shy, worried, brave, glowing, smiling) |
| Yari | young archer woman, light brown skin, long straight black hair, red headband, green tunic with orange trim, brown boots, bow on her back, a small brown hutia rodent at her feet | young Taíno-inspired archer, light brown skin, long black hair, red headband, green tunic, a small hutia on her shoulder (neutral, grinning, fierce) |
| Azzy | young swordsman, olive skin, dark hair tied back, red and iron half-cape over dark leather, long sword at the hip | young knight, olive skin, dark hair tied back, red and iron half-cape (proud, neutral, shaken) |
| Rael | tall lord, dark beard going grey, heavy black and red coat with iron clasps, fur collar, sword | stern lord, dark beard going grey, black and red coat, fur collar, tired eyes (cold, neutral, regretful) |
| Patricio (young) | young revolutionary marshal, deep brown skin, short black hair, red coat with gold epaulettes and gold sash, black bicorne hat, navy trousers | young marshal, deep brown skin, black bicorne, red coat with gold epaulettes (neutral, determined, laughing) |
| Patricio (old) | old marshal, deep brown skin, bald with white hair at the sides, white beard, worn dark red coat with gold epaulettes, walking cane | old marshal, deep brown skin, white beard, worn red coat with gold epaulettes (neutral, proud, sad) |
| Elodie | tall woman, deep brown skin, dark hair in a high bun, gold gown with cream sash, gold circlet with a red stone | stateswoman, deep brown skin, dark hair in a high bun, gold circlet with a red stone, gold gown (composed, warm, guarded) |
| Anicette | grandmother, deep brown skin, grey hair under a wine red head wrap, purple dress with gold sash and shawl | grandmother, deep brown skin, wine red head wrap, purple dress, knowing smile (neutral, amused, grave) |
| Quiet Crown recruiter | hooded figure in a grey hood and dark robe, face in shadow, small silver crown on the chest | hooded figure, face mostly in shadow, silver crown pin (neutral) |

Tiles and objects use the tile template in guide 10.3 with "16 x 16 pixel tiles" and this palette.
Story objects need before and after states drawn to the same footprint: the Gaze lamp unlit and lit;
the winch and pawl oiled (Echo), rusted and pinned (present); the Chain Bridge raised (16 x 32,
standing against its pier) and lowered (16 x 16 planks with chain rails, worn in the present); the
collapsed rope bridge; the map table under a dust sheet and as the war map; the window seat and its
loose floorboard.

## 7. File names: where to drop them

Put PNGs in `quest/art/`, rebuild, and each replaces its placeholder (a missing file keeps the
placeholder). The names come from `quest/src/assets.config.ts` (`ART_FILES`, `NPC_SPRITES`,
`PORTRAITS`, `TILESET`, `OBJECT_ART`).

| File | What |
|---|---|
| `quest/art/characters/<look>.png` | walk sheet, 72 x 128 (24 x 32 cells); rows down, left, right, up; columns standing, step A, step B |
| `quest/art/portraits/<portrait>.png` | 48 x 48 portrait (neutral) |
| `quest/art/tiles/<tile name>.png` | 16 x 16 tile |
| `quest/art/objects/<kind>.png` | large object drawing |

Looks (character files): `gianna`, `patricio_young`, `anissa`, `elodie`, `anicette`, `patricio_old`,
`yari`, `recruiter`, then the townsfolk (`gaze_keeper`, `soup_vendor`, `town_guard`, `festival_kid`,
`elder`, `ferryman`, `pilgrim`, `acolyte`, `mourner`) and the Echo's people (`echo_soldier`,
`echo_cook`, `echo_aide`, `echo_messenger`, `echo_builder`, `echo_drummer`). Azzy and Rael get
`azzy.png` and `rael.png` when they join the story (add the look to `NPC_SPRITES` first).

Portraits: `gianna`, `patricio` (young), `patricio_old`, `anissa`, `elodie`, `anicette`, `yari`,
`recruiter`, and the other keys of `PORTRAITS`. Expressions are named `<portrait>_<expression>.png`
(for example `anissa_glowing.png`); the dialogue box shows the neutral one until dialogue lines choose
expressions.

Third-party art (CC0, CC-BY or OGA-BY only) is also listed in `quest/assets/CREDITS.md` and
`quest/src/data/credits.ts` (the in-game Credits screen). Downloaded sprites are never used for the
named cast.

## 8. Converting Gemini sheets (`scripts/quest-sprite.py`)

Gemini draws a walk sheet as a grid of frames on magenta, but its frames differ in size, head height
and pose, so a sheet used as it is jitters when the character walks. The converter (Python + Pillow)
builds a stable sheet instead (its default `--mode stable`; every option is described at the top of
the script):

1. It finds the source's own pixel grid (Gemini's "pixels" are blocks of about 5 to 8 screen pixels)
   and samples one colour per block, so nothing is doubled or dropped (`--pixel auto`). Dark grid
   lines between the cells are found and dropped (`--grid-lines auto`); bits of neighbouring frames
   and stray specks are dropped too.
2. Per direction it takes one clean standing frame: column 0 where the direction has one, else the
   frame with the feet closest together. Side frames are sorted by the way the face looks
   (`--sides`); a missing side is the other one mirrored.
3. All four are scaled by one factor, never up (`--fill` makes a character smaller), centred on the
   torso, feet on the bottom row.
4. Step A and step B are made from that same standing frame, so the upper body is identical in all
   three: only the feet band moves (front and back: one foot lifts 1 px; sides: the feet spread 1 px
   each way), and on the step frames the body sits 1 px lower (`--bob`).
5. One palette per character (`--colors 32`, nearest-pixel sampling) and a 1 px `#1a1420` outline
   over the silhouette's edge (the soles keep their colour).

`--preview DIR` writes the old and new sheets side by side (8x) and a GIF of each direction walking
(step A, stand, step B, stand). The sheets in `quest/art/characters` were made with:

| Look | Source | Options |
|---|---|---|
| `gianna` | `docs/quest/art-source/gianna-sprites.webp` | `--grid 4x4 --rows down,_,_,up --sides 1,2 --cell 24x32 --colors 32` |
| `anissa` | `docs/quest/art-source/anissa-sprites.webp` | `--grid 5x4 --rows down,_,_,up --sides 1 --cell 24x32 --colors 32 --fill 0.84` |
| `azzy` | `docs/quest/art-source/azzy-sprites.webp` | `--grid 3x4 --rows down,_,_,up --sides 1,2 --cell 28x36 --colors 32 --pixel 6.2`, run on the source warmed (figure pixels r x1.12, g x1.04, contrast 1.12) and stretched 1.2x wide (nearest); taller than Gianna |
| `quiet_crown_f` | `docs/quest/art-source/quiet-crown-f-sprites.webp` | first `python3 scripts/quest-regrid.py <src> even.png --same-height` (the cells are uneven and the side views drawn smaller), then `--grid 3x4 --rows down,_,_,up --sides 1,2 --cell 24x32 --colors 32 --skin-colors 5 --pixel 7 --grid-lines off` |
| `quiet_crown_m` | `docs/quest/art-source/quiet-crown-m-sprites.webp` | the same, with `--cell 28x36` |
| `yari` | `docs/quest/art-source/yari-sprites.webp` | `--grid 3x4 --rows down,_,_,up --sides 1,2 --cell 24x32 --colors 32` (both side rows face right, so left is mirrored; grid lines found and dropped; her up frame is column 0, without the bow) |
| `elodie` | `docs/quest/art-source/elodie-sprites.webp` | `--grid 4x4 --rows down,_,_,up --sides 1,2 --cell 24x32 --colors 32` (Oct 16; the fourth column is ignored) |
| `patricio_young` | `docs/quest/art-source/patricio-sprites.webp` | `--grid 4x4 --rows down,_,_,up --sides 1,2 --cell 28x36 --colors 32` (Oct 16). Portrait cropped 720 x 720 from 130,40. Battle stances `battle/patricio_young-<blade>.png` by `scripts/quest-stance-patricio.py` (a fixed window, feet at the bottom centre, scale 0.20: a little larger than Gianna's) |
| `patricio_old` | `docs/quest/art-source/patricio-old-sprites-leftfixed.png` (the source with row 2 mirrored: Gemini drew both side rows facing right, and his bald head defeats `--sides`) | `--grid 5x4 --rows down,left,right,up --cell 28x36 --colors 32 --pixel 4` (Oct 16). Portrait: 500 x 500 from 300,15, the dark-pink background replaced; the sad and stern portraits are kept in art-source for later |
| `anicette` | `docs/quest/art-source/anicette-sprites.webp` (Oct 16 regeneration, green background), green swapped to magenta, then `python3 scripts/quest-cells.py <src> clean.png 3 4`; the sheet rebuilt from column 1 (down, right, up; left is right mirrored, since Gemini drew both side rows facing right) | `--grid 3x4 --rows down,left,right,up --cell 24x32 --colors 32 --fill 0.94 --grid-lines off --key strict --pixel 3.4`; green fringe pixels darkened to the outline. Portrait: 660 x 660 from 190,90 |
| `anicette_young` | `docs/quest/art-source/anicette-young-sprites.webp`, `quest-cells.py <src> clean.png 3 4`, then a sheet rebuilt from one good frame per direction (down row 1 col 1, left row 3 col 3, right row 2 col 3, up row 4 col 2) | `--grid 3x4 --rows down,left,right,up --cell 24x32 --colors 32 --grid-lines off --key strict` (Oct 16; not placed in the game yet: the Echo scenes with her come later). Portrait 660 x 660 from 200,40 |
| `solange` | `docs/quest/art-source/solange-sprites.webp` (green background, swapped to magenta), `quest-cells.py`, then rebuilt from column 1 (down, right, up; left mirrored: both side rows face right) | `--grid 3x4 --rows down,left,right,up --cell 24x32 --colors 32 --fill 0.92 --grid-lines off --key strict` (Oct 16; for the Echo scenes and the intro). Portrait 720 x 720 from 150,40. The writing pose is in `docs/quest/intro/art/solange-writing-1..3.png` |
| `rael` | walk sheet still to come (Oct 27: reference sheet `docs/quest/art-source/rael-reference.webp`) | Portrait from `rael-portrait.webp` (cold), 720 x 720 from 160,40; the lamplight portrait is kept in art-source for later |

Portraits: the source's magenta becomes `rgb(42,36,56)` (the dialogue box's backdrop), then one
high-quality (Lanczos) downscale to 48 x 48. Gianna's and Anissa's use the whole 1024 x 1024
picture; Yari's is first cropped to the square around her (800 x 800 from 150,110) so the hutia on
her shoulder stays readable. Elodie's is cropped to 700 x 700 from 190,80 (her face fills more of the square).

The game draws the shadow under every character (real art and placeholders alike), and moves them
smoothly between tiles at a constant speed (`quest/src/config.ts`: walk 4.5 tiles a second, run 8),
choosing the walk frame from the distance walked (step A, stand, step B, stand every two tiles).
