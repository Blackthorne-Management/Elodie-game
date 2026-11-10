Every prompt still to use, filled in: ART-LEFT.md

# Art drop 2: the shortest path to a finished look (Nov 10)

The game is complete with stand-in art; every picture below replaces one stand-in the day it arrives, with no other
change (`quest/src/assets.config.ts`). This list is in the order that changes the most screens per picture. The
prompts for the characters are already written in `ART-PROMPTS.md` (and `ART-PROMPTS-REAL-PEOPLE.md`); this file adds
the two things that had no prompt yet: **the six companions' battle stances** and **the enemies**.

Work the same way as drop 1: one chat per character, the walking sheet first, then the stance from that sheet. Send me
the pictures as they come (any format, any background); I convert, size and check each in the game.

## The order

| # | What | Pictures | Where the prompt is | Becomes |
|---|---|---|---|---|
| 1 | **The Crown's soldiers in battle** (in 25 fights) | Crown Marine, Crown Musketeer, Crown Officer | Section B below | `quest/art/enemies/<look>.png` |
| 2 | **The six companions' walking sheets and portraits** (on screen in every chapter from 3 on) | Samira, Bayarmaa, Haru, Vikram, Edmund (Azzy is done) | `ART-PROMPTS.md` 15 to 18 and 21 | `characters/<name>.png`, `portraits/<name>.png` |
| 3 | **The six companions' battle stances** (in every fight from Chapter 3 on) | Azzy, Samira, Bayarmaa, Haru, Vikram, Edmund | Section A below | `quest/art/battle/<name>.png` |
| 4 | **The other enemies fought most** | Oil Enforcer, Caravan Raider, Fog Cutpurse, Steppe Reaver, Husher, Road Bandit, Sealbearer, Lookout | Section B | `quest/art/enemies/<look>.png` |
| 5 | **The bosses** | Governor Thorne, Captain-General Hale | Section B | `quest/art/enemies/<look>.png` |
| 6 | **The beasts** | Ember Jackal, Steppe Wolf, Lantern Moth, Cave Bat | Section C | `quest/art/enemies/<look>.png` |
| 7 | The named characters of each chapter | as listed | `ART-PROMPTS.md` 12 to 21 | `characters/`, `portraits/` |

After 1 to 3, every fight in the game shows real art for the whole party and its most common foes. The ~420 minor
townsfolk can keep their stand-ins for the release.

---

## A. The six companions' battle stances

Use the prompt in `ART-PROMPTS.md` section 9 exactly as written (attach **only** that character's walking sheet, in a
new chat), and fill in `[NAME]` and `[STANCE]` from this table. The game draws their equipped weapon into the closed
front hand, so the hand stays empty.

| Character | [STANCE] |
|---|---|
| **Azzy** (blade-knight) | broad and grounded, knees bent, his front arm low and forward as if holding a sword, his back hand raised beside his shoulder, his crimson cloak swinging behind him |
| **Samira** (alchemist) | quick and light on her feet, leaning forward, her back hand raised at shoulder height holding a small stoppered glass vial that glows green, her front hand forward as if holding a short staff |
| **Bayarmaa** (raider) | low and wide like a wrestler, weight on the front foot, her front arm forward as if holding a curved sabre, her back hand open and ready, her braid swinging |
| **Haru** (shadow agent) | crouched and narrow, nearly side-on, his front arm low and forward as if holding a short blade reversed along the forearm, his back hand near his hip |
| **Vikram** (fire duelist) | upright and elegant like a fencer, side-on, his front arm extended as if holding a slim blade, his back hand raised behind him with a small flame in the palm |
| **Edmund** (guardian) | square and immovable, feet planted, his front arm forward as if holding a heavy blade or mace, his back arm raised as if bracing a shield (draw no shield) |

Down pose: the same as section 9 (on one knee, head bowed, hurt, empty-handed). Name the file after the character
(`quest/art/battle/azzy.png` and so on).

---

## B. The people the party fights

One prompt for every human foe; fill in `[WHO]`, `[LOOK]` and `[STANCE]` from the table. They face **left** (the party
is on the left). A new chat for each; no attachment is needed, but for a soldier whose officer is already done,
attaching the finished soldier keeps the uniforms the same.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: [WHO]. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. [LOOK]. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: [STANCE]. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

| Look (file name) | [WHO] | [LOOK] | [STANCE] |
|---|---|---|---|
| `crown_marine` | a Crown marine, a soldier of an 18th-century colonial empire | red coat with white crossbelts and a white sash, white breeches, a navy blue round cap, light skin, short brown hair | holding a cutlass forward at waist height, the other hand in a fist |
| `crown_musketeer` | a Crown musketeer, a colonial soldier with a musket | red coat with white crossbelts, white breeches, a navy blue bicorne hat, deep brown skin, short dark hair | holding a long flintlock musket levelled forward with both hands, ready to fire |
| `crown_officer` | a Crown officer of the Regent's service | a violet coat with gold trim and gold epaulettes, a white sash, white breeches, a navy blue bicorne hat, deep brown skin | holding a slim sword raised forward, the other hand on his hip |
| `oil_enforcer` | an oil-store enforcer from a desert trade city | a tall bearded man with deep brown skin and black hair, a long pale stone-coloured tunic over grey trousers, a leather satchel | a heavy wooden club held in both hands, ready to swing |
| `caravan_raider` | a desert caravan raider | bronze skin, a sand-coloured head wrap with a tail, a tan robe with a green sash, brown trousers | a curved dagger held low and forward, crouching |
| `fog_cutpurse` | a cutpurse from a foggy harbor city of paper lanterns | a grey-violet hood over the head (face visible), a grey-violet jacket and dark trousers, East Asian features | crouched low, a short knife held reversed in the front hand |
| `steppe_reaver` | a steppe horse raider | a bronze-brown leather coat with a red sash, a rounded steel helmet, a black braid, weathered tan skin | a curved sabre raised over the head, mid-charge |
| `husher` | a "Husher", a veiled zealot of a secret cult | a dark grey-violet robe, a dark cowl, a sheer grey veil over the lower face, eyes visible | both hands raised, palms out, as if commanding silence |
| `road_bandit` | a road bandit | a red head wrap, a short black beard, a brown jerkin, dark trousers, mid-brown skin | a short machete held forward, grinning |
| `sealbearer` | a Regent's Sealbearer, a ceremonial guard | a grey-violet tabard over steel, a violet-plumed steel helmet, a white seal emblem on the chest, light skin | a tall halberd held upright in front, blade forward |
| `lookout` | a young camp lookout | small and wiry, a dark green hood (face visible) and green tunic, dark trousers | a sling whirling in the front hand |
| `thorne` | Governor Thorne, a colonial governor, the chapter's villain | **drawn larger: a 36 x 48 cell**. A tall, thin older man with white hair, a navy blue governor's coat heavy with gold braid and gold epaulettes, a red sash, white breeches and stockings, a black bicorne hat with a gold cockade, light tan skin, a cold look | standing straight, a silver-topped sword cane drawn and pointed forward |
| `hale` | Captain-General Hale, the Crown's commander | **drawn larger: a 36 x 48 cell**. A tall broad older man with a grey beard and grey hair, a violet general's coat with gold trim and gold epaulettes, black trousers, a dark bicorne hat, deep brown skin | a heavy boarding axe held forward in both hands, ready to swing (the axe he lays down at the Claim) |

---

## C. The beasts

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG in the style of classic Super Nintendo RPGs: [WHAT], seen from the side, facing LEFT, [POSE]. [SIZE] pixels, the animal filling the image, 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no other animals, no background.
```

| Look (file name) | [WHAT] | [POSE] | [SIZE] |
|---|---|---|---|
| `ember_jackal` | a desert jackal whose sandy coat glows with ember sparks along its back, as if smouldering | head low, lips drawn back, about to spring | 40 x 28 |
| `steppe_wolf` | a big grey steppe wolf with a thick winter coat and pale eyes | head low, hackles up, snarling | 44 x 30 |
| `lantern_moth` | a giant moth from a foggy marsh, its wings patterned like paper lanterns, glowing soft yellow | wings spread, hovering | 36 x 32 |
| `cave_bat` | a cave bat, dark brown with tan ears and wings | wings spread, mouth open, diving | 32 x 24 |

---

## How they arrive

Send the pictures as they are; I remove the background, size them to the cell, set each one's hand and feet, and check
them in a fight at desktop and phone size. Anything not yet done keeps its stand-in, so the game is always complete.
