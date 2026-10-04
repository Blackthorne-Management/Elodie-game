# Throne of Bloodlines: Art Guide

Everything the game needs, as paintings only. **No text in any image.** Names, numbers, card text and
frames are added by the app later, so every screen stays uniform.

When a piece is done, send it to me in chat. I resize it, compress it, cut out backgrounds if needed and
plug it into `src/assets.config.ts`; nothing else in the game changes.

**Order of work:** 1. the board (§3) → 2. sea (§4) → 3. Elodie's Throne (§5) → 4. crests (§7) →
5. portraits (§8) → 6. icons (§9) → 7. card backs (§10) → 8. Elodie, app icon and title art (§11) →
9. seats, duel background and card pictures (§6, §12, §10).

---

## 1. Tools and workflow

| Job | Best tool | Why |
|---|---|---|
| Board, throne, icons, anything that must follow a layout | **ChatGPT image generation** | Follows reference images and placement instructions; can make transparent backgrounds; lets you select an area and repaint just that part. |
| Portraits, crests, card art | **Midjourney (v7)** or ChatGPT | Midjourney has the richest painting quality and keeps a look consistent with a style reference. |
| Making images bigger | Midjourney's Upscale (Subtle), or the free app **Upscayl** | To reach 4096 px for the board. |

**Keep one look across 70+ images:**
1. **Make the style anchor first.** That's the board (§3). Once you love it, it becomes the reference for
   everything else.
2. **Always attach the anchor.**
   - ChatGPT: attach the board and write *"match the painting style, palette and brushwork of this image."*
   - Midjourney: add `--sref <board image URL> --sw 150` to the end of the prompt.
3. **Always paste the same style block and avoid list** (§2) into every prompt.
4. **Generate 4–8, keep the best, then repair** small problems by selecting the area and repainting it
   (ChatGPT: select the area; Midjourney: *Editor → Vary Region*). Don't re-roll a nearly perfect image.

**Transparent backgrounds:** in ChatGPT, say *"transparent background, PNG"*. If your tool can't, ask for
a *"plain flat light-grey background"* instead and I'll cut it out.

---

## 2. Style bible: "The Gilded Atlas"

**The idea:** the realm as a goddess would keep it, a hand-painted atlas of eight proud lands around her
empty throne. It feels mythic, warm and old, a little melancholy (she watches dynasties rise and fall),
never cartoonish and never grimdark.

**Painting:** gouache and oil glazes over fine ink lines, visible brushwork, a faint warm paper grain,
small touches of real-looking gold leaf. Detailed up close but calm from a distance.

**Light, the same in every image:** soft warm light from the **upper left**, cool soft shadows, gentle
dusk glow. No harsh contrast or blown-out highlights.

**Value:** mostly mid-dark and rich. The app's highlights, gold buttons and pawns sit on top, so the art
should never be brighter than them. Avoid pure white and pure black.

**Palette:**
- **Ink brown** `#2a1a10` (lines and shadows)
- **Parchment** `#e9dcc0` (paper highlights)
- **Elodie gold** `#d9a441` (the throne, Elodie, anything divine)
- **Wine dark** `#3a1d24` (the app's background)

**House colours** (crests, portrait backdrops, pawn rings):

| House | Colour | Hex | Accent |
|---|---|---|---|
| Brasador | Crimson | `#b03a2e` | Black, ember orange |
| Agnivansh | Saffron orange | `#e67e22` | Crimson, gold |
| Kay Soley | Sun gold | `#d4ac0d` | White, sky blue |
| Dorini | **Emerald** (was gold) | `#1e8449` | Gold |
| Vai'tama | Lagoon turquoise | `#17a5a5` | Bone, coral |
| Stillwater | Slate blue | `#2e86c1` | Pewter grey |
| Suzumori | Violet | `#7d3c98` | Charcoal, silver |
| Ironvow | Steel grey | `#5d6d7e` | Black, white |

> Dorini was gold like Kay Soley, impossible to tell apart on a small pawn, so Dorini is now emerald and
> Vai'tama a slightly bluer turquoise. The game uses these colours.

**Respecting real cultures.** Each house is *inspired by* a real culture: draw on it with care and research,
never as costume or caricature.
- Skin tones, features and dress should be true to the inspiration.
- Don't copy sacred or personal symbols. Invent original motifs instead:
  - no real Māori tā moko or other real tattoo lineages (Vai'tama);
  - no real Vodou vèvè (Kay Soley);
  - no Hindu deities, Om or tilak (Agnivansh);
  - no real Japanese family crests or Shinto shrine gates (Suzumori);
  - no runes that have become hate symbols, such as Othala or the double Sowilo (Ironvow). Use invented
    runes.
- Architecture, textiles, food, landscape and everyday objects are welcome.

### The style block (paste at the end of every prompt)
```
Style: hand-painted fantasy atlas illustration, gouache and oil glazes over fine ink linework, subtle real gold-leaf accents, visible brushwork on warm paper grain, rich muted jewel tones, soft warm light from the upper left with cool soft shadows, gentle dusk glow, mythic and dignified, detailed up close but calm and readable from a distance.
```

### The avoid list (paste after it)
```
Avoid: any text, letters, numbers, labels, map legends or compass roses; watermarks or signatures; frames or borders; user-interface elements; photorealism; 3D render or CGI look; plastic shine; anime or cartoon style; oversaturated neon colour; heavy black outlines.
```
In Midjourney, put the avoid list in `--no text, letters, numbers, watermark, signature, frame, border, 3d render, photo, anime`.

---

## 3. The board (start here)

### How the game uses it
- The painting is laid flat as the ground of the 2.5D view, tilted like a tabletop. On a phone you see
  about 6×6 squares at a time; the overhead map shows all of it.
- The app draws the 18×18 grid, the glowing squares, the pawns and the tile markers **on top**, so the
  painting has **no grid and no markers**.
- Because the app tilts it, the painting must be a **straight top-down view**: no perspective, no horizon,
  no sides of buildings leaning outward.
- **The painting is a continent in the ocean.** The 18×18 playable squares fill the **middle 69%** of the
  image, with a band 4 squares wide on every side for coast and sea. The coastline is wild and natural:
  headlands, peninsulas, capes, bays and offshore islands all push **outward** into that band, but it never
  cuts inward into the playable squares. The game lines the continent up with the grid and lets the painted
  ocean fade into its own sea, so nothing at the edge of the board gets cut off.

| File | Size | Format | Background |
|---|---|---|---|
| `board.png` | **4096 × 4096** (2048 × 2048 at the very least) | PNG | Opaque: a continent in the middle, with ocean around it. |

### The layout (must match the rules)
Attach **`docs/art/board-guide.png`** to the prompt.
- **Blue:** open ocean. The guide's coastline is the shape to follow: it wanders well outside the playable
  squares in places and comes close in others, but every playable square is land.
- **Coloured areas:** each is one homeland. Their sizes and soft borders match the game's own map.
- **The ring in the middle:** Elodie's Throne. It covers the centre 2×2 squares, about the middle 8% of
  the image.
- **The 8 white dots:** each house's **seat**, its owned tile. These positions are rules, so the painting
  has to put each seat on its dot. **`docs/art/board-guide-labelled.png`** shows which is which, for you,
  not for the AI.

| Seat | House (tile) | Where | Across, down |
|---|---|---|---|
| Ardencia | Brasador (War) | North coast, middle | 48%, 17% |
| Zetwal | Kay Soley (Court) | Upper right | 71%, 29% |
| Al-Doria | Dorini (Trade) | East coast, middle | 83%, 52% |
| Skarragol | Ironvow (War) | Lower right | 71%, 71% |
| Kuroshi | Suzumori (Court) | South side, middle | 52%, 83% |
| Jwaladesh | Agnivansh (War) | Lower left | 29%, 71% |
| Aldermoor | Stillwater (Court) | West coast, middle | 17%, 48% |
| Moa'olani | Vai'tama (Trade) | Upper left | 29%, 29% |

The four middle-of-the-edge seats sit near the coast, which suits them: Ardencia's fortress on its cliffs,
Al-Doria's harbour, Kuroshi's castle above its bays and Aldermoor's keep above the shore.

If a seat lands within about half a square of its dot, I can nudge the image to fit. Further off than that,
repaint that spot.

### What each land looks like
- **The Heartland (centre):** Elodie's Throne plaza, a round dais of pale marble inlaid with gold
  filigree rings. Eight old paved roads run out from it toward each homeland, through ancient ruins,
  olive and cypress scrub and wildflower fields. Neutral warm stone colours.
- **Ardencia, Brasador (top):** scorched volcanic highlands. Black basalt and rust-red rock, cracked
  seams of faintly glowing lava, dry scrub and cork oaks. At the seat, a walled hilltop fortress with
  terracotta roofs (Spanish frontier).
- **Zetwal, Kay Soley (upper right):** a sun-bright coast. Golden fields, palm and mango groves,
  colourful painted roofs with lacy carved trim (Haitian gingerbread houses). At the seat, a white-and-gold
  temple court to Elodie with sun-ray paving.
- **Al-Doria, Dorini (right):** where sea trade meets the desert. Golden dunes inland, a white-domed
  harbour city on the east coast, striped bazaar awnings, date palms, caravan tracks. At the seat, the
  courtyard of a grand caravanserai.
- **Skarragol, Ironvow (lower right):** cold fjords cutting into grassy steppe. Turf-roofed longhouses
  beside round felt yurts, herds of horses, grey-green grass. At the seat, a timber-and-stone hall with a
  ring-shaped horse paddock.
- **Kuroshi, Suzumori (bottom):** a fog-veiled island coast. Dark cedar forest, moss, terraced paddies,
  ribbons of mist. At the seat, a castle compound with tiered curved roofs on a rocky point.
- **Jwaladesh, Agnivansh (lower left):** the land of flame. Ochre and saffron plains, red-sandstone
  fort-palaces and a stepwell, banyan trees, trees in flame-orange bloom. At the seat, a palace courtyard
  ringed with braziers.
- **Aldermoor, Stillwater (left):** fog-wrapped moorland. Purple heather, dry-stone walls, hedgerows and
  alder trees. At the seat, an old grey stone keep beside a dark, perfectly still tarn.
- **Moa'olani, Vai'tama (upper left):** a reef archipelago. Small green islands linked by white-sand
  shallows and turquoise lagoons, outrigger canoes, coral. At the seat, a thatched meeting house on
  stilts.

### Rules that make it play well
1. **Each land must be recognisable at a glance**, by colour *and* texture, even on the small overhead map.
2. **Borders are natural and soft:** rivers, ridges, forest edges and changes of grass. Never painted
   lines.
3. **Every square inside the coastline is land:** water there stays small and shallow (lagoons, the tarn,
   rivers). Open sea, fjords and harbours belong in the outer ocean band.
4. **Calm, medium detail:** lots of quiet ground for pawns to stand on. No busy high-contrast clutter
   across the whole map.
5. **Keep the centre throne ring and each seat spot open:** a plaza or courtyard, so the markers sit
   cleanly.
6. **A coastline with character:** headlands, peninsulas, bays and a few islands, like a real continent,
   never a smooth or straight edge. Ocean, deep and calm, runs all the way to the image edges so it blends
   into the game's sea.
7. **Nothing else on the map:** no people, animals larger than tiny herds, clouds over the land, text or
   compass rose.

### Prompt for ChatGPT (recommended): attach `board-guide.png`
```
Paint a square, straight top-down (orthographic, no perspective, no horizon) fantasy game-board map: one continent made of eight homelands around a central plaza, set in the middle of open ocean.

Use the attached guide image ONLY for layout. The blue is open ocean: paint deep, calm sea all the way to the image edges. Follow the guide's coastline shape: a wild, natural, irregular coast with headlands, peninsulas, capes, bays, coves, beaches, cliffs and the small offshore islands shown — never a straight or smooth edge. The land must cover everything the guide shows as land; the sea may never cut inward into it. Each flat coloured area is one homeland — keep every homeland in the same place and about the same size and shape, with soft, natural, wandering borders (rivers, ridges, forest edges), never drawn lines. Do not copy the guide's flat colours; repaint each area as real terrain. The pale ring in the centre is Elodie's Throne: paint a round plaza of pale marble inlaid with gold filigree rings, with eight old paved roads leading out toward each homeland. Each white dot marks a house's seat: paint an open courtyard or plaza exactly on each dot, on dry land, with that land's signature building right beside it. The four dots on the north, east, south and west sides sit near the coast.

Homelands (positions as on the guide):
- North (deep red area): Ardencia — scorched volcanic highlands, black basalt and rust-red rock, faint glowing lava seams, dry scrub and cork oaks; a walled fortress with terracotta roofs on the north coast cliffs at its seat.
- North-east (yellow area): Zetwal — sun-bright land, golden fields, palm and mango groves, colourful roofs with lacy carved trim; a white-and-gold sun temple court at its seat.
- East (tan area): Al-Doria — golden dunes running down to a white-domed harbour city on the east coast, striped bazaar awnings, date palms, caravan tracks, ships in the harbour out at sea; a grand caravanserai courtyard on the shore at its seat.
- South-east (grey-green area): Skarragol — grassy steppe with turf-roofed longhouses beside round felt yurts and tiny horse herds; fjords cut into the coast from the ocean but stay outside the guide's land; a timber-and-stone hall with a round horse paddock at its seat.
- South (slate-blue area): Kuroshi — dark cedar forest, moss, terraced paddies, ribbons of mist, a rugged coast of rocky points and small bays; a castle compound with tiered curved roofs at its seat.
- South-west (orange area): Jwaladesh — ochre and saffron plains, red-sandstone fort-palaces, a stepwell, banyan trees and flame-orange flowering trees; a palace courtyard ringed with braziers at its seat.
- West (purple area): Aldermoor — fog-wrapped moorland, purple heather, dry-stone walls, hedgerows, alder trees, a dark, perfectly still tarn; an old grey stone keep above the west shore at its seat.
- North-west (turquoise area): Moa'olani — small green hills joined by white-sand flats and shallow turquoise lagoons, coral, outrigger canoes; a thatched meeting house on stilts at its seat.
- Centre (grey-brown area): the Heartland — ancient ruins, olive and cypress scrub, wildflower meadows, in warm neutral stone colours.

Inside the coastline, water stays small and shallow (rivers, the tarn, lagoons). Keep the ground calm with medium detail and plenty of open space, so game pieces placed on top stay readable. Each homeland must be recognisable at a glance by its colour and texture. No people, no clouds over the land, no grid, no markers.

Style: hand-painted fantasy atlas illustration, gouache and oil glazes over fine ink linework, subtle real gold-leaf accents, visible brushwork on warm paper grain, rich muted jewel tones, soft warm light from the upper left with cool soft shadows, gentle dusk glow, mythic and dignified, detailed up close but calm and readable from a distance. Overall value mid-dark and rich, never washed out.

Avoid: any text, letters, numbers, labels, map legends or compass roses; watermarks or signatures; frames or borders; user-interface elements; photorealism; 3D render or CGI look; plastic shine; anime or cartoon style; oversaturated neon colour; heavy black outlines.
```

### Prompt for Midjourney (alternative): upload `board-guide.png` as an image prompt
```
<guide image URL> top-down orthographic fantasy atlas map of a continent in the middle of the image with a wild irregular coastline of headlands, peninsulas, bays and small offshore islands, surrounded on all sides by deep calm ocean to the edges; eight homelands around a central round marble-and-gold throne plaza with eight paved roads radiating out; north: volcanic basalt highlands with glowing lava seams and a terracotta fortress on the coast cliffs; north-east: sun-bright fields, palm groves, colourful carved roofs and a white-gold sun temple; east: golden dunes and a white-domed harbour city on the coast; south-east: grassy steppe with longhouses and felt yurts; south: cedar forest and mist with a tiered-roof castle on a rocky point; south-west: ochre plains, red sandstone fort-palace and stepwell; west: purple heather moorland, stone walls, a grey keep by a still tarn above the shore; north-west: turquoise lagoons and green hills with a stilted thatched hall; soft natural borders, calm medium detail, hand-painted gouache and oil glaze over ink linework, gold-leaf accents, warm paper grain, rich muted jewel tones, soft light from upper left --ar 1:1 --v 7 --style raw --iw 1.5 --no text, letters, labels, compass, grid, border, frame, people, perspective, horizon, 3d render, photo
```
Midjourney follows the layout loosely. Check the seats against the guide and fix misplaced ones with
*Vary Region*.

### Refining it
- **Something in the wrong place?** Select it and ask: *"Move the Al-Doria caravanserai courtyard onto the
  shore in the middle of the east coast, as on the guide."*
- **Too busy?** Ask: *"Simplify the ground texture in this area into calmer open fields; keep the style."*
- **Too dark or bright overall?** Ask: *"Same image, overall slightly brighter/darker, keep everything
  else."*
- **Finally,** upscale to 4096 × 4096.

### Check before sending
- [ ] Seen from straight above, with no perspective.
- [ ] The throne plaza is centred, about 8% of the width across.
- [ ] Each of the 8 seats sits on its dot, within half a square.
- [ ] All 8 lands are easy to tell apart on a thumbnail.
- [ ] There's no text, grid, frame or people.
- [ ] The continent fills the middle with a wild coastline like the guide's (headlands, bays, islands),
  every playable square on land, and ocean all the way to every edge.

### Plan B, if one painting won't follow the layout
Paint each land as a separate **seamless top-down texture** and I'll blend them into the game's exact
region shapes in code. That fits the layout every time, though the result looks a little less like one
painting.
- **Files:** `land-<name>.png` at 2048 × 2048, seamless, with no buildings, plus `land-heartland.png`.
- **Template:** *"Seamless tileable top-down ground texture of {land}, straight overhead view, no
  buildings, no horizon, …"* followed by the style block and the avoid list.
- **Subjects:** volcanic basalt and rust rock with faint lava seams; golden fields and palm groves;
  golden dunes and date palms; grassy steppe with fjord inlets; dark cedar forest, moss and mist; ochre
  plains and banyan trees; purple heather moor with stone walls; turquoise lagoons and sand shallows;
  warm stone ruins and wildflower meadow.

---

## 4. The sea around the board

| File | Size | Notes |
|---|---|---|
| `sea.png` | 1024 × 1024 | Must tile seamlessly; dark. |

```
Seamless tileable top-down painted ocean texture, deep night blue-green water with soft painterly swells, faint drifting foam lines and tiny gold glints, very dark and calm (about 20% brightness), straight overhead view, no horizon, no land, no boats. [style block] [avoid list]
```

---

## 5. Elodie's Throne (standing piece)

In the 2.5D view the throne stands upright on its plaza, like the pawns.

| File | Size | Notes |
|---|---|---|
| `throne.png` | 1024 × 1280 | Transparent background. The throne sits at bottom centre and fills about 85% of the height. |

```
An empty divine throne standing alone, seen from the front at a slight three-quarter angle and slightly above, tall and elegant, carved from pale veined marble with gold-leaf inlay, eight small carved medallions around its high back (each a different simple emblem: flame, sun, wave, bell, heron, horse, coin, brand), a thin halo of concentric gold rings floating behind it, soft warm glow on the seat as if someone just left, standing on a small round marble dais, transparent background, centred, full object visible. [style block] [avoid list]
```

---

## 6. Seats of power (8 standing landmarks, optional)

These are small upright buildings that stand on each seat in the 2.5D view. They're a nice extra, not
needed for launch.

| File | Size | Notes |
|---|---|---|
| `seat-<house>.png` ×8 | 1024 × 1024 | Transparent background. A small diorama: the building on a round patch of its own ground, seen from three-quarters above, standing at bottom centre. |

Template: *"A small diorama of {building} on a round patch of {ground}, three-quarter view from slightly
above, centred, transparent background, …"* followed by the style block and the avoid list.

| House | Building | Ground |
|---|---|---|
| Brasador | Walled hilltop fortress with terracotta roofs and a crimson banner | Black basalt with glowing cracks |
| Kay Soley | White-and-gold sun temple with lacy carved trim | Sunlit golden grass |
| Dorini | Grand caravanserai with a striped awning and a fountain | Golden sand and palms |
| Ironvow | Turf-roofed timber hall with a round felt yurt beside it | Steppe grass with a fjord inlet |
| Suzumori | Small castle with tiered curved roofs | Rocky moss and cedar, wrapped in mist |
| Agnivansh | Red-sandstone palace gate ringed with braziers | Ochre earth |
| Stillwater | Old grey stone keep | Heather beside a still tarn |
| Vai'tama | Thatched meeting house on stilts | White-sand islet with lagoon water |

---

## 7. House crests (8)

The overhead map shows each house as a round emblem, so the crests are **round medallions**.

| File | Size | Notes |
|---|---|---|
| `crest-<house>.png` ×8 | 1024 × 1024 | Transparent background. The medallion fills about 90% of the image. A bold silhouette in at most 3 colours plus gold, readable at 32 px. |

Template:
```
A round heraldic medallion emblem: {motif}, bold clear silhouette, {colours}, thin gold rim, painted enamel-and-gold-leaf look, centred, flat front view, transparent background, readable when tiny. [style block] [avoid list]
```

| House | Motif | Colours |
|---|---|---|
| Brasador | A bull's skull crowned with flame above a branding-iron mark | Crimson, black, gold |
| Dorini | A balance scale whose pans are two coins, over a lateen sail | Emerald, gold |
| Ironvow | A rearing horse inside an iron oath-ring, with an oar and a lance crossed behind | Steel grey, black, white |
| Suzumori | A round bell hanging from a cedar sprig, with a half-closed eye on the bell | Violet, charcoal, silver |
| Vai'tama | A spiral wave forming the profile of an ancestor's face, original pattern | Turquoise, bone white |
| Kay Soley | A rayed sun rising between two open temple doors | Sun gold, white, sky blue |
| Agnivansh | A spearhead made of flame | Saffron, crimson, gold |
| Stillwater | A heron standing still in a ring of calm water | Slate blue, pewter |

---

## 8. Character portraits (32: 8 houses × 4 generations)

These show on the character card, in the duel screen and, cropped to a circle, on pawns.

| File | Size | Notes |
|---|---|---|
| `portrait-<house>-<gen>.png`, e.g. `portrait-brasador-1.png` | **1024 × 1280** (4:5) | Opaque. |

### Framing (identical for all 32)
- Head and shoulders, the body turned three-quarters, **looking at the viewer**.
- Face centred left to right, **eyes about 38% from the top**, with the head about 45% of the height.
- Everything important inside a **centred circle 70% of the width** (the pawn crop).
- **Backdrop:** a soft painted gradient in the house colour with a faint hint of the homeland, never
  busy.
- The same light from the upper left as the board.
- Specters need no separate art; the app greys out and tints the portrait.

### Keeping each family consistent
- Paint **Gen I of every house first**, then use it as the reference for that house's other three:
  - **ChatGPT:** attach it and write *"a blood relative of this person: same family features, eye colour
    and colouring, different age and gender as described"*.
  - **Midjourney v7:** add `--oref <Gen I URL> --ow 60`. Keep the weight low so you get a relative, not
    a clone.
- **Every character is an adult.** Each generation is the next heir after the previous one dies.

### Template
```
Head-and-shoulders portrait of {character}. {house look}. Body turned three-quarters, looking directly at the viewer, face centred, eyes about 38% from the top of the frame, head filling about 45% of the height. Background: a soft painted gradient of {house colour} with a faint hint of {homeland}. [style block] [avoid list]
```

### House looks (paste as {house look})
- **Brasador:** Spanish-inspired frontier nobility; blackened steel gorget and pauldron over a
  crimson-and-black doublet, crimson sash, a gold brand-mark brooch, faint ember sparks in the air.
  *Backdrop:* crimson, volcanic haze.
- **Dorini:** Mediterranean and Levantine merchant princes; layered silk robes in emerald and gold,
  embroidered sashes, rings and a gold chain of office, kohl-lined eyes, an optional head wrap.
  *Backdrop:* emerald, a harbour at dusk.
- **Ironvow:** a fusion of Nordic and Mongolian; a fur-trimmed wrap coat over mail, braided hair, an iron
  oath-ring arm ring or torc, wind-burned skin. *Backdrop:* steel grey, a wide steppe sky.
- **Suzumori:** Japanese-inspired court intrigue; layered robes in violet and charcoal with silver
  thread, a small round bell charm, a composed and unreadable expression. *Backdrop:* violet, fog through
  cedars.
- **Vai'tama:** Pacific-islander-inspired; garments with original bark-cloth-style patterns, shell and
  bone ornaments, fern and flower adornments, sea-weathered skin. *Backdrop:* turquoise, a lagoon.
- **Kay Soley:** Haitian-inspired Caribbean court; elegant coats and gowns in white, gold and sky blue,
  madras head wraps, and **a faint sun-shaped birthmark** on the temple or cheek (their signature).
  *Backdrop:* gold, a sunlit temple.
- **Agnivansh:** Indian-subcontinent-inspired warrior lineage; saffron and crimson coats with lamellar
  armour, gold jewellery, ember motes in the air. *Backdrop:* saffron, firelight on red sandstone.
- **Stillwater:** English-inspired old country gentry; wool and velvet in slate blue and pewter grey, a
  heron brooch, a weathered and patient calm. *Backdrop:* slate blue, moorland fog.

### The 32 characters (paste as {character})
The arc follows each house's curve: early-strong houses peak at Gen I and grow desperate, while
late-strong houses grow grander with every generation.

**Brasador** (strongest early)
1. A scarred, iron-haired conquistador lord in his fifties, the family legend, cold and certain.
2. His daughter, early thirties, ambitious, an old burn scar along her jaw, a branding-iron pendant.
3. Her younger brother, mid twenties, a reckless and hungry stare, singed sleeves.
4. The last heir, a gaunt woman in her twenties, ash on her cheek, defiant in armour too large for her.

**Dorini** (strongest late)
1. A shrewd, heavy-set merchant in his sixties with a knowing half-smile and many rings.
2. His son, thirties, ink-stained fingers, a small ledger on a gold chain.
3. A sharp-eyed woman in her forties, harbour banker, gold coins stitched along her veil.
4. The golden heir, a magnificent woman in her thirties in cloth-of-gold over emerald, a circlet of
   coins, the richest person in the realm.

**Ironvow** (strongest early)
1. A broad, grey-bearded warlord in his fifties, wolf-fur collar, an oath scar across his brow.
2. A young horse-archer woman, mid twenties, braids threaded with iron rings, wind-burned cheeks.
3. A raider in his thirties, shaved sides and a salt-crusted beard, a sea-axe over his shoulder.
4. The last oath-keeper, a lean, weary woman in her thirties wearing a broken iron ring on a cord.

**Suzumori** (strongest mid-game)
1. An elderly spymaster in his seventies, a gentle smile and cold eyes, a white topknot.
2. A soft-spoken woman in her thirties, half her face in shadow, a closed fan near her lips.
3. A courtier in their forties at the height of their power, eyes visible above a sheer violet veil.
4. The puppeteer, a young woman in her twenties, fine silver threads glinting between her fingers.

**Vai'tama** (swingy; the dead live on in them)
1. A chieftain-navigator in his fifties, an ancestral shell necklace and a carved wooden staff.
2. A young woman in her twenties with an original carved ancestor mask pushed up on her head.
3. A broad-shouldered man in his thirties, faint ghostly ancestor faces forming in the sea spray behind
   him.
4. An elder woman in her sixties whose eyes reflect many faces, wreathed in faint blue-green spirit light.

**Kay Soley** (strongest late)
1. A dignified high priestess in her sixties, white head wrap, the sun birthmark at her temple.
2. A charismatic diplomat in his thirties, a gold-buttoned coat, the birthmark on his cheek.
3. A radiant young orator, a woman in her twenties in a sky-blue madras head wrap.
4. The sun-crowned heir, in her thirties in white and gold, her birthmark glowing faintly, serene power.

**Agnivansh** (strongest early)
1. A fierce warrior queen in her forties in flame-red lamellar, a commanding glare.
2. A swordsman in his twenties, twin blades crossed behind his back, an ember-lit stare.
3. A war-band captain, a woman in her thirties, a burn-scarred shoulder, a gold nose ring.
4. The last flame, a young man in his twenties, soot-dark face and cracked armour, eyes like coals.

**Stillwater** (strongest late)
1. A quiet old matriarch in her seventies, a walking staff, a heron brooch, unhurried eyes.
2. A plainly dressed steward in his thirties, watchful and patient.
3. A woman in her forties in a slate-blue cloak, a calm, knowing half-smile.
4. The Vigil, a towering knight in her forties in old plate armour with a heron crest, mist around her,
   unbreakable calm.

---

## 9. Icons

| File | Size | Notes |
|---|---|---|
| `icon-<name>.png` | 512 × 512 | Transparent background. 10% padding. One bold silhouette, readable at 24 px. |

Template:
```
A single game icon: {subject}, bold simple silhouette, painted gold leaf and enamel look with a thin dark ink outline, centred, flat front view, transparent background, readable when tiny. [style block] [avoid list]
```

| Name | Subject | Used for |
|---|---|---|
| `influence` | A royal crown with three points | Court tiles and the Influence total |
| `fear` | Two crossed blades over a small flame | War tiles and the Fear total |
| `wealth` | A short stack of gold coins with one gem | Trade tiles and the Wealth total |
| `heart` | A heart made of red enamel with a gold rim | Heart Tokens |
| `specter` | A pale ghostly wisp curling into a crescent moon | Specters |
| `grudge` | A knotted red cord tied around a broken link | Grudges |
| `dice` | A six-sided die in carved bone | Rolls |
| `throne` | A simple tall throne silhouette with a gold halo | The Throne and claims |
| `elodie` | A sun-eye: an open eye inside a ring of sun rays | Elodie cards |

---

## 10. Cards

**Card backs** (3):

| File | Size | Notes |
|---|---|---|
| `card-back-hand.png`, `card-back-instant.png`, `card-back-elodie.png` | 750 × 1050 (5:7) | Opaque, symmetrical, important detail kept 6% in from every edge. |

- **Hand cards:**
  ```
  An ornate symmetrical card back: deep wine-red field with a fine gold filigree border and a central medallion of eight small emblems circling an empty throne. [style block] [avoid list]
  ```
- **Instant / event cards:**
  ```
  An ornate symmetrical card back: deep ink-brown field with swirling storm clouds and a central medallion of a cracked hourglass, fine bronze filigree border. [style block] [avoid list]
  ```
- **Elodie cards:**
  ```
  An ornate symmetrical card back: midnight-blue field scattered with tiny gold stars, a central sun-eye (an open eye ringed by sun rays) in radiant gold leaf, rich gold filigree border, sacred and luminous. [style block] [avoid list]
  ```

**Card pictures (later; 120 in all).** Each card shows a picture window and the app adds the frame and
text.
- **Size:** `card-<number>.png` at 1024 × 768 (4:3), opaque.
- **Do the 10 Elodie cards first.** They're special, and they show the goddess acting.

Template:
```
A scene illustration for a card called "{name}": {scene}. No text. [style block] [avoid list]
```

| # | Card | Scene |
|---|---|---|
| 81 | Elodie's Sorrow | The goddess's tears falling as gold rain over the eight lands |
| 83 | Elodie's Blessing | Soft gold light falling evenly on eight distant banners |
| 84 | Elodie's Wrath | Her shadow across a stormy sky, armies looking up in dread |
| 89 | Elodie's Exile | A lone traveller far from home on a darkening road, her eye in the clouds |
| 90 | Elodie's Gaze | A vast luminous eye opening in the night sky over the throne |
| 94 | Elodie's Judgment | A golden beam striking the tallest tower in a rich city |
| 95 | Elodie's Mercy | Her hand lifting a small fallen banner from the mud |
| 96 | Elodie's Memory | Glowing threads linking rival houses across a map |
| 98 | Elodie's Trial | A lone wounded warrior in a ring of watching rivals, light from above |
| 102 | Elodie's Reckoning | A gold scale tipping, a crown on one pan, a blade on the other |

The other 110 can be done later, category by category; I'll write those scenes when we get there.

---

## 11. Elodie, the app icon and the title art

**Elodie herself.** In ChatGPT, attach a clear, front-lit photo of your wife and use this as the base:
```
Portrait of the goddess Elodie, creator and silent watcher of the realm, with the likeness of the woman in the attached photo: serene, ageless, a faint knowing smile; hair drifting as if underwater, threaded with tiny gold stars; a halo of thin concentric gold rings; robes of midnight blue fading into starfield; soft gold light on her face from the upper left. [style block] [avoid list]
```

| File | Size | Notes |
|---|---|---|
| `elodie.png` | 1024 × 1280 | Her portrait, framed like the characters (§8). |
| `app-icon.png` | 1024 × 1024 | Opaque. Elodie's face, or her face over the throne. Everything important stays inside the central 80% circle, because phones crop icons. No text. |
| `title-portrait.png` | 1290 × 2796 | Opening screen in portrait. Elodie seated on, or rising behind, her throne with the eight lands far below. Keep the top 25% calm for the logo, added later. |
| `title-landscape.png` | 2796 × 1290 | The same scene, wide. Keep the left third calm for the logo. |

---

## 12. Duel background

| File | Size | Notes |
|---|---|---|
| `duel-bg.png` | 1290 × 2796 | Opaque. Dark. The app places one portrait at the top and one at the bottom, so keep both areas simple. |

```
A ruined ancient arena of pale stone at dusk seen from above, cracked marble floor with a faint gold ring inlaid, scattered embers and drifting mist, dark vignette at the edges, two empty pools of soft light at the top and bottom of the frame, nobody present. [style block] [avoid list]
```

---

## 13. Checklist

| # | Asset | Files | Size | Background | Priority |
|---|---|---|---|---|---|
| 1 | Board | `board.png` | 4096² | Opaque | **First** |
| 2 | Sea | `sea.png` | 1024², seamless | Opaque | High |
| 3 | Throne | `throne.png` | 1024 × 1280 | Transparent | High |
| 4 | Crests | `crest-<house>.png` ×8 | 1024² | Transparent | High |
| 5 | Portraits | `portrait-<house>-<1-4>.png` ×32 | 1024 × 1280 | Opaque | High |
| 6 | Icons | `icon-<name>.png` ×9 | 512² | Transparent | Medium |
| 7 | Card backs | `card-back-*.png` ×3 | 750 × 1050 | Opaque | Medium |
| 8 | Elodie, icon and title | `elodie.png`, `app-icon.png`, `title-*.png` | as in §11 | Opaque | Medium |
| 9 | Seats | `seat-<house>.png` ×8 | 1024² | Transparent | Optional |
| 10 | Duel background | `duel-bg.png` | 1290 × 2796 | Opaque | Optional |
| 11 | Card pictures | `card-<number>.png` | 1024 × 768 | Opaque | Later (10 Elodie cards first) |

House file names: `brasador`, `dorini`, `ironvow`, `suzumori`, `vaitama`, `kaysoley`, `agnivansh`,
`stillwater`.
