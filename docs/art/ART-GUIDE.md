# Throne of Bloodlines: Art Guide

Everything the game needs, as paintings only. **No text in any image.** Names, numbers, card text and
frames are added by the app later, so every screen stays uniform.

When a piece is done, send it to me in chat. I resize it, compress it, cut out backgrounds if needed and
plug it into `src/assets.config.ts`; nothing else in the game changes.

**Order of work:** 1. the board (§3, done; a cleaned-up, larger version is still to come) → 2. characters
([CHARACTER-PROMPTS.md](CHARACTER-PROMPTS.md)) → 3. card pictures ([CARD-PROMPTS.md](CARD-PROMPTS.md)) → 4. icons and
card symbols (§9) → 5. crests (§7) → 6. Elodie, app icon and title art (§11) → 7. the rest: Throne piece, sea, card
backs, seats, duel background.

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

**The style anchor is your board painting** (`public/art/board.webp`): a hand-drawn storybook fantasy look with crisp
dark ink outlines, warm painterly colour and rich jewel tones. **Attach it to every prompt** as the style reference.
Everything else in the game should look like it belongs on that map.

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
Style: hand-drawn fantasy storybook illustration matching the attached map image — crisp dark ink outlines, warm painterly colour with soft shading, rich jewel tones, warm light from the upper left, clean readable shapes, detailed but uncluttered.
```

### The avoid list (paste after it)
```
Avoid: any text, letters, numbers, place names, labels, map legends or compass roses; watermarks or signatures; frames or borders; user-interface elements; photorealism; 3D render or CGI look; plastic shine; anime or cartoon style; oversaturated neon colour.
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
- **The painting is a continent in the ocean.** The 18×18 grid fills the **middle 69%** of the image, with
  a band 4 squares wide on every side of open sea. It's a realistic continent: a gulf in the north, a long
  peninsula in the south-west with a gulf beside it, coasts that bulge out past the grid in the north-east,
  east and south, and islands offshore. Sea inside the grid is real sea in the rules, so pawns walk around
  it. The game lines the continent up with the grid and lets the painted ocean fade into its own sea, so
  nothing at the edge of the board gets cut off.

| File | Size | Format | Background |
|---|---|---|---|
| `board.png` | **4096 × 4096** (2048 × 2048 at the very least) | PNG | Opaque: a continent in the middle, with ocean around it. |

### The layout (must match the rules)
Attach **`docs/art/board-guide.png`** to the prompt.
- **Blue:** open ocean. **Follow the guide's coastline closely,** within about half a square: land squares must
  look like land and sea squares like sea. The labelled copy shades the sea squares inside the grid.
- **Coloured areas:** each is one homeland. They're different sizes, following the coast; borders between
  them are on land (ridges, rivers, forest edges), never water.
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
   never a smooth or straight edge.
7. **A living ocean:** beaches and surf along the coasts; reefs, rocks and small islands; ships under sail,
   fishing boats, a lighthouse, a shipwreck, whales or a sea serpent far out. Deep water darkens toward the
   image edges so it blends into the game's sea.
8. **Nothing else on the map:** no people, animals larger than tiny herds, clouds over the land, text or
   compass rose.

### Prompt for ChatGPT (recommended): attach `board-guide.png`
```
Paint a square, straight top-down (orthographic, no perspective, no horizon) fantasy game-board map: one continent made of eight homelands around a central plaza, set in the middle of open ocean.

Use the attached guide image ONLY for layout. The blue is open ocean: paint deep, calm sea all the way to the image edges. Follow the guide's coastline closely — it is a realistic continent: a gulf in the north, a long peninsula in the south-west with a gulf beside it, coasts that bulge out in the north-east, east and south, and small islands offshore. Keep every gulf, peninsula and cape where the guide puts it — land where the guide shows land, sea where it shows sea — and paint the coast itself wild and natural (cliffs, beaches, coves, rocky points), never a straight or smooth edge. The continent must not look square. Make the ocean alive: sandy beaches and surf along the coasts, reefs and rocks, the small islands shown, ships under sail and fishing boats, a lighthouse on a headland, a shipwreck, whales or a sea serpent far out, with the deep water darkening toward the image edges. The borders between homelands are on land — ridges, rivers, forest edges, changes of ground — never water. Each flat coloured area is one homeland — keep every homeland in the same place and about the same size and shape, with soft, natural, wandering borders (rivers, ridges, forest edges), never drawn lines. Do not copy the guide's flat colours; repaint each area as real terrain. The pale ring in the centre is Elodie's Throne: paint a round plaza of pale marble inlaid with gold filigree rings, with eight old paved roads leading out toward each homeland. Each white dot marks a house's seat: paint an open courtyard or plaza exactly on each dot, on dry land, with that land's signature building right beside it. The four dots on the north, east, south and west sides sit near the coast.

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

Avoid: any text, letters, numbers, place names, labels, map legends or compass roses; watermarks or signatures; frames or borders; user-interface elements; photorealism; 3D render or CGI look; plastic shine; anime or cartoon style; oversaturated neon colour; heavy black outlines.
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
- [ ] The coastline follows the guide's within about half a square: the capes, lobes and bays in the same
  places, and ocean all the way to every edge.

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

## 8. Characters (32: 8 houses × 4 generations)

**All 32 prompts are in [`CHARACTER-PROMPTS.md`](CHARACTER-PROMPTS.md),** ready to paste.

- **One full-body picture per character, painted as a full tarot-size card** (70 × 120 mm, bigger than the game
  cards). The character card shows the whole figure under its own overlay (name plate and abilities panel); the pawn
  on the board shows a head-and-shoulders circle that the game cuts from the same picture, so a pawn always matches
  its card.
- **Size:** 1050 × 1800 (7:12), opaque, the homeland backdrop filling the card.
- **Layout:** top 10% calm for the name; the figure from the head (about 12% down) to the feet (about 68% down);
  the bottom 30% is ground and backdrop under the abilities panel.
- **Family likeness:** make Generation I of a house first, then attach it when making Generations II–IV.
- **Specters** need no art of their own: the game greys out and tints the portrait.

---

## 9. Icons and card symbols

| File | Size | Notes |
|---|---|---|
| `icon-<name>.png` | 512 × 512 | Transparent background. 10% padding. One bold silhouette, readable at 24 px. |

Make them all in **one chat**, so they come out as a matching set. Template:
```
A single game icon: {subject}, bold simple silhouette, gold and enamel look with a dark ink outline, centred, flat front view, transparent background, readable when tiny. Style: hand-drawn fantasy storybook illustration matching the attached map image — crisp dark ink outlines, warm painterly colour, rich jewel tones. Avoid: any text, letters or numbers; frames or borders; watermarks; photorealism; 3D render look.
```

**Game icons:**

| Name | Subject | Used for |
|---|---|---|
| `influence` | A royal crown with three points | Court tiles, the Influence total, Influence / Court cards |
| `fear` | Two crossed blades over a small flame | War tiles, the Fear total, Fear / War cards |
| `wealth` | A short stack of gold coins with one gem | Trade tiles, the Wealth total, both Wealth card groups |
| `heart` | A heart made of red enamel with a gold rim | Heart Tokens |
| `specter` | A pale ghostly wisp curling into a crescent moon | Specters |
| `grudge` | A knotted red cord tied around a broken link | Grudges |
| `throne` | A simple tall throne silhouette with a gold halo | The Throne and claims |
| `elodie` | A sun-eye: an open eye inside a ring of sun rays | Elodie cards |

**Card category symbols** (shown in each card's title bar):

| Name | Subject | Category |
|---|---|---|
| `cat-ranged` | A curved dagger trailing a wisp of green smoke | Ranged / Cursed |
| `cat-disruption` | A cracked mask | Disruption |
| `cat-movement` | A winged boot | Movement |
| `cat-barter` | Two hands passing a single coin | Barter |
| `cat-truce` | Two clasped hands under an olive sprig | Truce |
| `cat-block` | A round shield with an iron boss | Block / Deflect |
| `cat-dice` | A single carved bone die, three-quarter view, pips not important | Dice Chaos |
| `cat-global` | A sun and a crescent moon over eight small peaks | Global |
| `cat-targeted` | An eye inside a target ring | Targeted |
| `cat-hand` | Three fanned playing cards with a hand reaching for one | Hand Disruption |

Influence / Court, Fear / War and the two Wealth groups reuse the `influence`, `fear` and `wealth` icons. **Dice
faces** aren't art: the game draws them, so the numbers are always right.

---

## 10. Cards

**The game draws every card's frame, title bar, text box and category symbol,** so all 120 match exactly and the
text is always right. Each card type has its own look: Hand Cards dark slate, Instants storm bronze, Elodie's cards
gold with stars.

**Card art: all 120 prompts are in [`CARD-PROMPTS.md`](CARD-PROMPTS.md).**
- **Full trading-card artwork:** 1000 × 1400 (5:7), `card-<number>.png`, filling the whole card.
- **Room for the overlay:** the top 12% calm for the title; the subject between 15% and 60%; the bottom 40% kept
  simple under the text box. No frame, title or text in the art.
- **Do the 10 Elodie cards first** (marked ✦).

**Overlays (done, drawn in code):** one transparent PNG per card design, laid over every card of that type:

| File | Used for |
|---|---|
| `overlay-hand.png` | Hand Cards (silver) |
| `overlay-instant.png` | Instants (bronze) |
| `overlay-elodie.png` | Elodie's 10 cards (gold with stars) |
| `overlay-character.png` | Character cards (gold and wine): tarot print size 1050 × 1752, name plate with medallions for the generation and crest, abilities panel |

- **Size and shape:** print size with bleed: 1000 × 1360 for the game cards, 1050 × 1752 for characters, transparent centre.
- **Where they live:** masters in `docs/art/overlays/`, web copies in `public/art/overlays/`. Regenerate both with
  `node scripts/make-overlays.cjs docs/art/overlays public/art/overlays` (colours and geometry are at the top of the script).
- **What each overlay holds:** the border, a title plate across the top 12%, and the text box over the lower part.
- **Text:** the game writes the words into the plate and the box, so the overlays stay blank.
- **Tweaks:** once the art is in, adjust the colours in the script if a border fights the paintings.

**Card backs** (2; the game has a drawn back until then):

All 120 game cards are **one shuffled deck** (the Shared Action Deck), so they share **one back**. Different backs
would show whether the next card is an Instant. The character cards have their own back.

| File | Size | Notes |
|---|---|---|
| `card-back.png` | 1000 × 1400 (5:7) | Every game card. Opaque, symmetrical (it looks the same upside down), important detail kept 6% in from every edge. Printed with **spot gold foil** on the gold parts. |
| `card-back-character.png` | 1050 × 1800 (7:12) | Character cards. |

- **Game cards:** *"An ornate symmetrical card back: deep wine-red field, a fine gold filigree border, and at the
  centre Elodie's sun-eye (an open eye ringed by sun rays) inside a medallion of eight small house emblems circling an
  empty throne."*
- **Character cards:** *"An ornate symmetrical tarot card back: midnight-blue field scattered with tiny gold stars,
  eight house emblems around a central throne, rich gold filigree border."*

Add the style line and avoid list from §2 to each.

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

## 13. Printing (MakePlayingCards)

| Cards | Product | Art |
|---|---|---|
| 120 game cards | Custom Game Cards, 63 × 88 mm | 1000 × 1400 (5:7) |
| 32 character cards | Tarot size, 2.75" × 4.75" (70 × 121 mm) | 1050 × 1800 (7:12) |

- **Resolution:** both sizes print at about 360–380 dpi from that art, and anything over 300 is crisp.
- **Card backs:** all 120 game cards share one back (spot gold foil), because they're one shuffled deck. Characters
  get their own back.
- **MPC's rule for every card size:** at 300 dpi, the outer **36 px on each side is bleed** (trimmed off), and the
  **safe zone is a further 36 px inside** the cut line. Keep everything important within it.
- **Game-card print files (MPC's spec):** minimum 816 × 1110 px at 300 dpi, which is the 63 × 88 mm card plus bleed
  (the card itself is 744 × 1038, the safe area 672 × 966); max 32 MB each.
  - **What I'll make:** each finished front at **1000 × 1360 px**. It's the same shape, kept at the art's full
    resolution (about 370 dpi), with only 20 px trimmed from the top and bottom of each painting.
  - **Bleed:** about 44 px on every side, trimmed off. Art and overlay borders run into it.
  - **Safe zone:** about 88 px in from every edge. Titles, rules text and anything that must survive the cut stay
    inside it.
  - **Uploading:** fronts as "Different images" (`card-001` … `card-120` in order), back as "Same image", plus a
    foil mask for the gold on the back.
- **Character-card print files (tarot, 2.75" × 4.75"):** minimum 897 × 1497 px at 300 dpi.
  - **What I'll make:** each finished card at **1050 × 1752 px**: the same shape, about 350 dpi, with only 24 px
    trimmed from the top and bottom of the 1050 × 1800 painting.
  - **Bleed:** about 42 px on every side. **Safe zone:** about 84 px in from every edge.
- **Orientation:** every card is portrait, top edge up; the game-card back is symmetrical.
- **Layout guides for Photopea or Photoshop:** [`templates/card-template.png`](templates/card-template.png) (1000 × 1360)
  and [`templates/character-template.png`](templates/character-template.png) (1050 × 1752).
  - **What they show:** the bleed, the cut line, the safe zone, the title band and the text-box area.
  - **How to use them:** put one in a bottom layer, design or check on top, then hide it before exporting.
  - **New document settings:** 1000 × 1360 px at 368 DPI (or 1050 × 1752 at 375 DPI), transparent background,
    RGB 8-bit sRGB.

## 14. Checklist

| # | Asset | Files | Size | Background | Priority |
|---|---|---|---|---|---|
| 1 | Board | `board.png` | 4096² | Opaque | **First** |
| 2 | Sea | `sea.png` | 1024², seamless | Opaque | High |
| 3 | Throne | `throne.png` | 1024 × 1280 | Transparent | High |
| 4 | Crests | `crest-<house>.png` ×8 | 1024² | Transparent | High |
| 5 | Characters (full body, tarot) | `portrait-<house>-<1-4>.png` ×32 | 1050 × 1800 | Opaque | High |
| 6 | Icons and card symbols | `icon-<name>.png` ×8, `icon-cat-<name>.png` ×10 | 512² | Transparent | Medium |
| 7 | Card backs | `card-back.png`, `card-back-character.png` | 1000 × 1400, 1050 × 1800 | Opaque | Before printing |
| 8 | Elodie, icon and title | `elodie.png`, `app-icon.png`, `title-*.png` | as in §11 | Opaque | Medium |
| 9 | Seats | `seat-<house>.png` ×8 | 1024² | Transparent | Optional |
| 10 | Duel background | `duel-bg.png` | 1290 × 2796 | Opaque | Optional |
| 11 | Card art | `card-<number>.png` ×120 | 1000 × 1400 | Opaque | High (10 Elodie cards first) |
| 12 | Card overlays | `overlay-<type>.png` ×4 | 1000 × 1400 (character: 1050 × 1800) | Transparent | After the art |

House file names: `brasador`, `dorini`, `ironvow`, `suzumori`, `vaitama`, `kaysoley`, `agnivansh`,
`stillwater`.
