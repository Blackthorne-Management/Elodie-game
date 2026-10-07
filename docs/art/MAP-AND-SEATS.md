# The dark map and the seats of power (Gemini)

Two pieces of art that work together:
1. **A new board map**, darker and edgier, with a bright, glowing centre and no buildings at the seats. It is painted flat (top-down); the app tilts it.
2. **Eight seats of power**: one 3D-rendered building per house, made separately. The app stands each one upright at
   the far edge of its home tile, so they rise off the paper map like painted game pieces on a table (decided: they
   stay 3D on the period map), and pawns can still stand on the tile in front of them.

Painting the buildings separately keeps them exactly on their tiles (an AI map never puts them in the right square)
and lets them stand up in the tilted view instead of lying flat.

---

## 1. The map

**Lesson from the first tries:** Gemini can't put eight plazas on exact spots, and every edit pass re-compresses the
image and loses detail. So the map no longer paints the seats at all: the 3D seat buildings mark them, placed by the
game exactly on their tiles. Since every square is walkable (sea too), the coastline only has to look right, so it can be as wild as Gemini likes; each homeland just needs to sit roughly where the guide puts it. The one
thing that must be exact is the Throne: perfectly centred and small.

Generate it **in one go, with no follow-up edits** (pick the best of a few tries). Use Gemini's highest-quality image
model if you have a choice. Attach **two images, in this order: `docs/art/board-guide.png`** (where the homelands go)
**and `docs/art/style-reference-map.png`** (the map from your mockup, for the style).

```
I am attaching two images. Image 1 is a layout guide: use it ONLY as a rough guide to where each homeland sits, and ignore its flat colours and white dots. Image 2 is the STYLE reference: match its art style, colour, lighting, level of detail and mood as closely as possible, but seen from directly overhead.

Create a square, straight top-down (orthographic, no perspective, no horizon, no tilt) map of one fantasy continent in a dark ocean, for a dark-fantasy digital board game.

STYLE (as in image 2): semi-realistic, hand-painted 3D game art, like the campaign map of a AAA dark-fantasy strategy game, or a highly detailed miniature diorama photographed from above. Dense forests of individual dark pine and oak trees with deep shadows between them; jagged grey mountain ranges with sharp ridges, snow-dusted peaks and scree; winding rivers of clear blue water with small stone bridges; worn dirt roads and footpaths; mossy green and olive grassland; rocky outcrops; tiny walled villages and farmsteads whose windows and torches glow warm orange. Crisp, fine detail everywhere with rich surface texture (bark, rock, moss, gravel), slightly gritty, never smooth or plastic. Moody evening light: deep near-black shadows, desaturated greens and greys, with warm orange-gold highlights from fires and windows. High contrast and very sharp, like a high-resolution game screenshot.

THE CENTRE: Elodie's Throne, a small round dais of pale marble inlaid with gold rings, exactly in the centre of the image and only about 7% of the image width across, glowing with intense golden-white light like a beacon. It is the brightest thing on the map; its glow lights up the ruins around it and spills along the winding roads that lead to each homeland, fading with distance.

COASTLINE: dramatic and irregular, like a real continent: deep jagged bays and fjords, long rocky peninsulas and capes, cliffs and small beaches, sea stacks and many islands of different sizes. It must NOT be round, oval or blob-shaped. A big gulf bites into the north, a long peninsula reaches out to the south-west with a gulf beside it, and the land bulges out in the north-east, east and south. The ocean is very dark teal and navy with foam along the shores and a few small ships with lanterns, darkening to near-black at the image edges.

BORDERS: each homeland's border is clearly marked the way strategy games show territory: a thin, crisp line glowing faintly in that homeland's colour, continuous from coast to coast and easy to see at a glance. The terrain itself blends naturally across every border (forest thins into moor, dunes into steppe, lava rock into burnt scrub). The homelands are irregular, organic shapes of different sizes following ridges, rivers and coasts; NOT pie slices around a circle, and the centre is NOT a circular region. Roads wind naturally; no straight spokes.

NO SEATS: no large castles, palaces, temples or plazas anywhere (they are added separately); only tiny villages, farms and ruins.

HOMELANDS (rough positions as in image 1), each in the image 2 style:
- North: Ardencia: black volcanic highlands and rust-red rock with glowing lava seams, burnt trees, smoke.
- North-east: Zetwal: golden fields and orchards, palm and mango groves, small villages with lit windows.
- East: Al-Doria: dark golden dunes, caravan tracks, palm oases, a small harbour town with lantern-lit ships.
- South-east: Skarragol: cold windswept steppe with tiny yurts and horse herds, dark fjords on the coast.
- South: Kuroshi: dense black cedar forest, terraced paddies, ribbons of mist, rocky points.
- South-west: Jwaladesh: ochre and saffron plains, red-sandstone ruins, a stepwell, banyan trees, burning braziers.
- West: Aldermoor: misty moorland, dark purple heather, dry-stone walls, crooked trees, a black still tarn.
- North-west: Xaraguá: dark green hills, pale sand flats and turquoise lagoons, ceiba trees, many small islands.
- Centre: the Heartland: ancient ruins and overgrown meadow, lit gold by the Throne.

AVOID: any text, letters, numbers, place names, labels or compass roses; grids, squares or markers (no glowing squares like in image 2); game-interface elements, tokens or banners; perspective or a tilted view; a round, oval or symmetrical continent; pie-slice homelands; a circular central region; cartoon, flat illustration, ink outlines, watercolour or parchment looks; bright, saturated or pastel colour; blurry or smudged areas; watermarks or signatures.
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
A single fantasy building, the seat of power of a noble house: A walled hilltop fortress of black basalt and rust-red stone with terracotta-tiled roofs, a square keep with crenellations, iron-studded gate and arrow slits, glowing lava seams cracked through the rock beneath it. It stands on a small round base of black basalt with faint glowing orange cracks and dry scrub, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in crimson and black showing a gold bull's skull crowned with flame. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Kay Soley — Zetwal (north-east) → `seat-kaysoley.png`
```
A single fantasy building, the seat of power of a noble house: A white-and-gold sun temple to the goddess Elodie: a raised hall with a pillared porch, lacy carved wooden trim along the eaves (like Haitian gingerbread houses), shutters painted deep blue and coral, a gilded sun disc above the doors, sun-ray paving in front. It stands on a small round base of sunlit golden grass with a mango tree, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in sun gold and sky blue showing a gold rayed sun rising between two open temple doors. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Dorini — Al-Doria (east) → `seat-dorini.png`
```
A single fantasy building, the seat of power of a noble house: A grand caravanserai: thick sand-coloured walls around a courtyard, a white dome, pointed arches, striped crimson-and-cream awnings, a tiled fountain, stacked trade crates and rugs by the gate. It stands on a small round base of golden sand with two date palms, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in emerald green and gold showing a gold balance scale whose pans are coins over a curved sail. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Ironvow — Skarragol (south-east) → `seat-ironvow.png`
```
A single fantasy building, the seat of power of a noble house: A long timber-and-stone mead hall with a steep turf roof and carved dragon-head gable ends, iron-banded doors, beside a large round felt yurt with a smoke hole, a ring-shaped wooden horse paddock in front. It stands on a small round base of grey-green steppe grass with a dark fjord inlet at the edge, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in steel grey, black and white showing a white rearing horse inside an iron ring. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Suzumori — Kuroshi (south) → `seat-suzumori.png`
```
A single fantasy building, the seat of power of a noble house: A small castle keep with three tiered, curved dark-tiled roofs and white plaster walls on a steep stone base, paper lanterns glowing, a red-lacquered gate in front. It stands on a small round base of dark mossy rock with cedar trees and drifting mist, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in violet and charcoal showing a silver bell hanging from a cedar sprig. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Agnivansh — Jwaladesh (south-west) → `seat-agnivansh.png`
```
A single fantasy building, the seat of power of a noble house: A red-sandstone palace gateway: a tall carved arch with domed corner pavilions and latticed stone screens, ringed by tall iron braziers burning with fire, a stepwell beside it. It stands on a small round base of ochre earth with a banyan tree in flame-orange bloom, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in saffron and crimson showing a gold spearhead made of flame. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Stillwater — Aldermoor (west) → `seat-stillwater.png`
```
A single fantasy building, the seat of power of a noble house: An old grey stone keep: a tall square tower with a slate roof, ivy and lichen on the walls, a single lit window high up, a low dry-stone wall around it. It stands on a small round base of purple heather moorland beside a small dark, perfectly still pool, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in slate blue and pewter grey showing a grey heron standing inside a ring of calm water. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```

### Yaguana — Xaraguá (north-west) → `seat-yaguana.png`
```
A single fantasy building, the seat of power of a noble house: A large round Taíno bohío meeting house: woven cane walls, a tall conical thatched palm roof, carved wooden posts, beside a small plaza ringed with upright carved stones, a dugout canoe pulled up nearby. It stands on a small round base of white sand on a small green islet edged with turquoise lagoon water and a ceiba tree, about as wide as the building, like the base of a tabletop miniature. Beside it, a tall dark wooden banner pole flies a long hanging banner in sea turquoise, bone white and red ochre showing a red-ochre spiral sun face rising from a curling wave. Dark gothic fantasy mood: weathered, battle-worn materials, deep shadows, warm glowing windows and torchlight, lit by warm candlelight from the upper left, like a game piece standing on a candlelit table. Highly detailed 3D render with a hand-painted finish, like a premium painted resin game miniature, dramatic and moody. Seen from the front at a three-quarter angle from slightly above (about 30 degrees down). The whole piece is centred, fully visible with nothing cut off, filling about 85% of the image height, its base at the bottom centre. Background: a perfectly flat, solid pure magenta (#FF00FF) with no gradient, no floor, no cast shadow on the background and no scenery; no magenta or pink anywhere in the building, base or banner. Square image. No text, letters or numbers, no people or animals, no border or frame.
```
