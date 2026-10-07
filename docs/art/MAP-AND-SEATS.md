# The dark map and the seats of power (Gemini)

Two pieces of art that work together:
1. **A new board map**, darker and edgier, with a bright, glowing centre and no buildings at the seats. It is painted flat (top-down); the app tilts it.
2. **Eight seats of power**: one 3D-rendered building per house, made separately. The app stands each one upright at
   the far edge of its home tile, so they rise off the board like the castles in the mockup, and pawns can still
   stand on the tile in front of them.

Painting the buildings separately keeps them exactly on their tiles (an AI map never puts them in the right square)
and lets them stand up in the tilted view instead of lying flat.

---

## 1. The map

**Lesson from the first tries:** Gemini can't put eight plazas on exact spots, and every edit pass re-compresses the
image and loses detail. So the map no longer paints the seats at all: the 3D seat buildings mark them, placed by the
game exactly on their tiles. Since every square is walkable (sea too), the coastline only has to look right, so it can be as wild as Gemini likes; each homeland just needs to sit roughly where the guide puts it. The one
thing that must be exact is the Throne: perfectly centred and small.

Generate it **in one go, with no follow-up edits** (pick the best of a few tries). Use Gemini's highest-quality image
model if you have a choice. Attach **`docs/art/board-guide.png`** for the coastline and the homeland positions.

```
Using the attached guide image ONLY as a rough guide to where each homeland sits, create a square, flat, straight-on image of an authentic antique hand-coloured map of one fantasy continent in the ocean, in the style of a late 16th–17th-century engraved atlas plate (like the great Flemish and Dutch atlas makers), filling the whole image. Ignore the white dots on the guide.

AUTHENTIC PERIOD CRAFT: a copperplate engraving printed in dark brown-black ink on thick laid paper, then hand-coloured with watercolour washes. Mountains drawn as rows of small shaded molehill peaks with fine hatching; forests as clusters of tiny engraved trees; rivers as fine double lines with tributaries; marshes, dunes and fields in delicate engraved patterns; the sea filled with fine horizontal engraved wave lines and stippling; tiny towns drawn as little clusters of towers and roofs; dotted roads. Extremely fine, crisp linework and dense detail everywhere, like a museum original photographed in high resolution. Realistic, not cartoon: this should look like a real 400-year-old map.

DARK AND AGED: the parchment is old and darkened, toned deep umber and sepia, with tide stains, foxing spots, faint smoke and scorch marks, worn creases from folding, and darker, almost burnt-looking corners and edges, as if seen by candlelight. The hand colouring is faded and muted (dusky crimson, olive, ochre, slate blue, faded violet, verdigris), never bright. Overall dark, grim and moody.

THE CENTRE: Elodie's Throne, drawn as a small round illuminated emblem of concentric rings with a radiant sunburst, exactly in the centre of the image and only about 7% of the image width across, picked out in burnished real gold leaf that catches the light, the brightest thing on the map, with fine gold rays spreading out along the roads to each homeland.

COASTLINE: dramatic and irregular, like a real continent drawn by a period cartographer: deep jagged bays and fjords, long peninsulas and capes, narrow straits, rocky islets and many islands of different sizes, shaded coasts with fine engraved shoreline lines. It must NOT be round, oval or blob-shaped. A big gulf bites into the north, a long peninsula reaches out to the south-west with a gulf beside it, and the land bulges out in the north-east, east and south.

BORDERS: each homeland's border is clearly drawn the period way: a fine dotted or dashed engraved line, edged with a band of hand-painted watercolour in that homeland's colour that softens inward. Each homeland has its own faded wash colour, and the engraved terrain flows continuously across the borders, so the lands blend while the borders stay easy to see. The homelands are irregular, organic shapes of different sizes following ridges, rivers and the coast; NOT pie slices around a circle, and the centre is NOT a circular region. Roads wind naturally; they are not straight spokes.

NO SEATS OR CASTLES: no large castles, palaces, temples or plazas anywhere; settlements are only tiny engraved town symbols.

THE OCEAN: period decoration only in the open sea, well away from the land: a sea serpent and a whale engraved in the waves, two or three small galleons under sail, and engraved rhumb lines radiating faintly across the water. No compass rose on the land.

HOMELANDS (rough positions as on the guide; each with its own engraved terrain and faded wash):
- North: Ardencia: volcanic highlands with smoking peaks and lava streams, burnt woods; dusky crimson wash.
- North-east: Zetwal: fields, palm and mango groves, small towns; faded gold wash.
- East: Al-Doria: dunes, caravan tracks, oases with palms, a harbour town on the coast; pale ochre wash.
- South-east: Skarragol: open steppe with tiny yurts and horse herds, fjords on the coast; grey-green wash.
- South: Kuroshi: dense cedar forest, terraced paddies, mist; slate blue wash.
- South-west: Jwaladesh: plains, a stepwell, banyan trees, small sandstone towns; burnt orange wash.
- West: Aldermoor: moorland with stone walls and a dark still tarn; faded violet wash.
- North-west: Xaraguá: green hills, lagoons and sand flats, many small islands; verdigris turquoise wash.
- Centre: the Heartland: ruins and meadow around the gold emblem; unpainted parchment.

AVOID: any text, letters, numbers, place names, labels, cartouches with writing, scale bars or legends; a decorative border or frame around the map; grids or markers; a round, oval or symmetrical continent; pie-slice homelands; a circular central region; modern, satellite or 3D looks; cartoon, fantasy-game illustration, bright or saturated colour, clean new paper; blurry or smudged areas; watermarks or signatures.
```

**If a try isn't right, generate again rather than editing it.** I can fix in code: darkness, contrast, the vignette,
the centre glow, small shifts of the whole map, and the size of the Throne by up to about a quarter.

**Place names:** the prompt asks for no lettering, because Gemini garbles words. I'll letter the eight homeland names
on it in a matching engraved style, so they're always spelled right.

**Higher quality:** Gemini gives about 2048 px. Upscale the chosen map 4× with a free AI upscaler (Upscayl, on Mac and
Windows; the "Remacri" or "Ultrasharp" model suits painted art) to 4096 × 4096 or more, and save it as **PNG** (JPEG
adds blocky artifacts). Upload it as **`art/board/board-dark.png`** and I'll fit it to the grid and switch the game over.

---

## 2. The seats of power (8 buildings)

One image per house. Each prompt stands alone (no other images needed). Magenta is the background because several
buildings have green in them; I cut it out the same way as the frames. Save them as **`art/seats/seat-<house>.png`**
(the file name is given above each prompt) and upload them together or one at a time.

If a building comes out with the background in perspective (a floor or a sky), say: *"Same building, but on a
perfectly flat solid magenta background with no floor and no shadow."*

### Brasador — Ardencia (north) → `seat-brasador.png`
```
A single fantasy building, the seat of power of a noble house: A walled hilltop fortress of black basalt and rust-red stone with terracotta-tiled roofs, a square keep with crenellations, iron-studded gate and arrow slits, glowing lava seams cracked through the rock beneath it. It stands on a small round base of black basalt with faint glowing orange cracks and dry scrub, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in crimson and black showing a gold bull's skull crowned with flame. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Kay Soley — Zetwal (north-east) → `seat-kaysoley.png`
```
A single fantasy building, the seat of power of a noble house: A white-and-gold sun temple to the goddess Elodie: a raised hall with a pillared porch, lacy carved wooden trim along the eaves (like Haitian gingerbread houses), shutters painted deep blue and coral, a gilded sun disc above the doors, sun-ray paving in front. It stands on a small round base of sunlit golden grass with a mango tree, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in sun gold and sky blue showing a gold rayed sun rising between two open temple doors. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Dorini — Al-Doria (east) → `seat-dorini.png`
```
A single fantasy building, the seat of power of a noble house: A grand caravanserai: thick sand-coloured walls around a courtyard, a white dome, pointed arches, striped crimson-and-cream awnings, a tiled fountain, stacked trade crates and rugs by the gate. It stands on a small round base of golden sand with two date palms, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in emerald green and gold showing a gold balance scale whose pans are coins over a curved sail. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Ironvow — Skarragol (south-east) → `seat-ironvow.png`
```
A single fantasy building, the seat of power of a noble house: A long timber-and-stone mead hall with a steep turf roof and carved dragon-head gable ends, iron-banded doors, beside a large round felt yurt with a smoke hole, a ring-shaped wooden horse paddock in front. It stands on a small round base of grey-green steppe grass with a dark fjord inlet at the edge, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in steel grey, black and white showing a white rearing horse inside an iron ring. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Suzumori — Kuroshi (south) → `seat-suzumori.png`
```
A single fantasy building, the seat of power of a noble house: A small castle keep with three tiered, curved dark-tiled roofs and white plaster walls on a steep stone base, paper lanterns glowing, a red-lacquered gate in front. It stands on a small round base of dark mossy rock with cedar trees and drifting mist, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in violet and charcoal showing a silver bell hanging from a cedar sprig. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Agnivansh — Jwaladesh (south-west) → `seat-agnivansh.png`
```
A single fantasy building, the seat of power of a noble house: A red-sandstone palace gateway: a tall carved arch with domed corner pavilions and latticed stone screens, ringed by tall iron braziers burning with fire, a stepwell beside it. It stands on a small round base of ochre earth with a banyan tree in flame-orange bloom, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in saffron and crimson showing a gold spearhead made of flame. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Stillwater — Aldermoor (west) → `seat-stillwater.png`
```
A single fantasy building, the seat of power of a noble house: An old grey stone keep: a tall square tower with a slate roof, ivy and lichen on the walls, a single lit window high up, a low dry-stone wall around it. It stands on a small round base of purple heather moorland beside a small dark, perfectly still pool, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in slate blue and pewter grey showing a grey heron standing inside a ring of calm water. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Yaguana — Xaraguá (north-west) → `seat-yaguana.png`
```
A single fantasy building, the seat of power of a noble house: A large round Taíno bohío meeting house: woven cane walls, a tall conical thatched palm roof, carved wooden posts, beside a small plaza ringed with upright carved stones, a dugout canoe pulled up nearby. It stands on a small round base of white sand on a small green islet edged with turquoise lagoon water and a ceiba tree, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in sea turquoise, bone white and red ochre showing a red-ochre spiral sun face rising from a curling wave. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, a cold blue rim light from behind. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```
