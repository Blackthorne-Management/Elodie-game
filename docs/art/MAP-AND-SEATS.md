# The dark map and the seats of power (Gemini)

Two pieces of art that work together:
1. **A new board map**, darker and edgier, with a bright, glowing centre. It is painted flat (top-down); the app tilts it.
2. **Eight seats of power**: one 3D-rendered building per house, made separately. The app stands each one upright at
   the far edge of its home tile, so they rise off the board like the castles in the mockup, and pawns can still
   stand on the tile in front of them.

Painting the buildings separately keeps them exactly on their tiles (an AI map never puts them in the right square)
and lets them stand up in the tilted view instead of lying flat.

---

## 1. The map

Attach **`docs/art/board-guide.png`** (the layout guide: blue sea, coloured homelands, the centre ring and the
eight white dots) and paste the prompt below. Gemini is weak at following a layout; if a homeland or a seat lands in
the wrong place, ask it to move that one thing (see "Fixes" below) rather than starting over.

```
Using the attached guide image ONLY for layout, paint a square, straight top-down (orthographic, no perspective, no horizon) dark-fantasy game-board map: one continent of eight homelands around a central plaza, set in a dark ocean.

LAYOUT (follow the guide closely): the blue is open ocean all the way to the image edges. Keep the continent's coastline where the guide puts it — a gulf in the north, a long peninsula in the south-west with a gulf beside it, coasts bulging out in the north-east, east and south, small islands offshore — painted as a wild, natural coast of cliffs, coves and rocky points, never a smooth or straight edge. Each flat coloured area is one homeland: keep each in the same place and about the same size and shape, with soft natural borders (ridges, rivers, forest edges, changes of ground), never drawn lines. Do not copy the guide's flat colours; repaint each area as real terrain. The pale ring in the centre is Elodie's Throne. Each white dot is a house's seat.

MOOD: dark, edgy and dramatic. A stormy dusk over a war-torn realm: deep shadows, cold desaturated land, ink-black and deep teal ocean with white storm-caps, crimson and ember accents, smoke drifting from distant fires, scorched fields and old battle scars, broken walls, dead trees at the borders. The ONLY bright place is the centre: Elodie's Throne is a round plaza of pale marble inlaid with glowing gold rings, radiating warm golden-white light like a beacon, its glow spilling out along eight old paved roads that lead to each homeland and fading into darkness toward the coasts and the edges of the image. Strong vignette: the corners and the outer ocean are nearly black.

SEATS: on each white dot, paint a small, flat, EMPTY stone plaza (about one fortieth of the image wide), lit by two or three torches, with nothing tall standing on it — the buildings are added separately. Low ruins, walls or roads may lead up to it.

HOMELANDS (positions as on the guide):
- North (deep red): Ardencia — scorched black basalt highlands and rust-red rock, glowing lava seams, burnt cork oaks, smoke.
- North-east (yellow): Zetwal — golden fields gone amber in the dusk, palm and mango groves, small villages with lamplit painted roofs.
- East (tan): Al-Doria — dark golden dunes running to a harbour city on the east coast, caravan tracks, date palms, ships with lanterns at sea.
- South-east (grey-green): Skarragol — cold windswept steppe, turf-roofed longhouses and felt yurts with smoke, dark fjords cutting in from the ocean.
- South (slate-blue): Kuroshi — black cedar forest, moss, terraced paddies, thick ribbons of mist, a rugged coast of rocky points.
- South-west (orange): Jwaladesh — ochre and saffron plains, red-sandstone ruins, a stepwell, banyan trees, braziers burning.
- West (purple): Aldermoor — fog-drowned moorland, dark purple heather, dry-stone walls, crooked alder trees, a black, perfectly still tarn.
- North-west (turquoise): Xaraguá — dark green hills linked by pale sand flats and moonlit turquoise lagoons, ceiba trees, dugout canoes.
- Centre (grey-brown): the Heartland — ancient ruins and overgrown meadow, lit gold by the Throne's glow.
Inside the coastline, water stays small and shallow (rivers, the tarn, lagoons).

READABILITY: keep the ground itself calm, with plenty of open space, so game pieces placed on top stay readable. Each homeland must still be recognisable at a glance by its colour and texture, even in the dark.

STYLE: premium dark-fantasy board-game art, highly detailed, sharp fine detail, painterly with realistic lighting, rich deep colour, high resolution.

AVOID: any text, letters, numbers, place names, labels, map legends or compass roses; grids or markers; people or large animals; clouds covering the land; frames or borders; watermarks or signatures; cartoon or anime style; washed-out or flat lighting.
```

**Fixes (send one at a time, with the map attached):**
- *"Move the Al-Doria seat plaza onto the shore in the middle of the east coast, as on the guide. Change nothing else."*
- *"The centre is not bright enough: make Elodie's Throne glow brighter gold-white and let the light spill further along the eight roads. Change nothing else."*
- *"Too dark to read the ground in the south-west: lift that area slightly. Keep the mood."*

**Place names:** the prompt asks for no lettering, because Gemini garbles words. Once the map is in, I'll letter the
eight homeland names on it in a matching engraved style (as I did for Xaraguá), so they're always spelled right.

**Higher quality:** Gemini gives about 1024–2048 px. Upscale the final map 4× with a free AI upscaler (Upscayl, on
Mac and Windows; the "Remacri" or "Ultrasharp" model suits painted art) to 4096 × 4096 before uploading. Save it as
**`art/board/board-dark.png`** (or .jpg) and I'll fit it to the grid, check every seat lines up and switch the game over.

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
