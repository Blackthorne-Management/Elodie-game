# Art left: every prompt still to use, filled in
Expressions for the characters who already have a portrait: ART-EXPRESSIONS.md

Written Nov 10. You asked for the prompts for the art you have left. This is the one list: every picture still to make, in the order that changes the most screens first (the same order as `ART-DROP-2.md`), with every prompt written out in full. Nothing is left to fill in: copy the grey box, paste it, and send.

## Main cast expressions (Claude's call, Nov 10)

Two expressions each for the main cast, tagged on the story's real turns (the plain portrait stays for everything else). Registered in `PORTRAIT_MOODS` (`quest/src/assets.config.ts`); file name `<portrait>_<mood>.png`.

| Character | Expression | Use | Art | Lines tagged |
| --- | --- | --- | --- | --- |
| Haru | `caught` | spotted, flustered ("definitely not a spy") | exists | 7 |
| Haru | `set` | resolved, defying his mother, quiet steel | exists | 4 |
| Bayarmaa | `fierce` | defiant: the Moot, battle resolve | exists | 9 |
| Bayarmaa | `soft` | only for her horse Salkhi, rare tenderness | exists | 3 |
| Gianna | `determined` | resolve, a decision made | to make | 21 |
| Gianna | `shaken` | grief, shock, a hard truth landing | to make | 14 |
| Anissa | `warm` | affection, comfort, a smile for Gianna | to make | 15 |
| Anissa | `grave` | serious, worried, a hard warning | to make | 16 |
| Yari | `grin` | cocky humour, teasing | to make | 15 |
| Yari | `grief` | her father Anaco, loss, sorrow | to make | 10 |
| Azzy | `grim` | battle-hard, bleak, stern | to make | 15 |
| Azzy | `wry` | dry humour | to make | 11 |

A missing picture shows the plain portrait, so the tags are safe before the art lands.

## How to use

1. **One chat per character.** For a character, do the prompts in order, all in that one chat, so the face stays the same: the reference sheet, then the portrait, then the extra expressions (one line each), then the walking sprite sheet. A foe, a beast or a battle stance is its own chat.
2. **Before each prompt this file says what to attach** and whether it is a **new chat** or the **same chat**. The two pictures you attach again and again are Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`, for the style) and Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`, so the pixels match).
3. **Work in the order of the groups below (1 to 7).** Groups 1 to 3 change the most screens (every fight, every chapter from 3 on). Anything you have not drawn yet keeps its stand-in, so the game is always complete.
4. **Send me the pictures as they come, in any format and on any background** (even if the tool gave you a different colour than the prompt asked). I remove the background, set the size, and check each one in the game. You do not need to rename or resize anything.
5. If the tool adds text, a frame, or a second person, ask it to remove it. If skin looks dull or olive, ask for it brighter and warmer.
6. The extra expressions are one line each: paste them one at a time in the same chat, after the portrait. A missing expression just shows the plain portrait, so they can wait.
7. People who are real members of the family are not repeated here: their prompts are already complete in `ART-PROMPTS-REAL-PEOPLE.md`, and they need a photo. They are marked "real family" and point to their section.
8. A background colour is stated in each prompt. Some outfits are violet or grey-violet, so those use bright green instead of magenta (magenta would eat the violet). That is deliberate; I handle both.

## Checklist

Tick a box when the picture is made. A reference sheet is only a working picture for the same chat (send it if you like, but the game uses the portrait and the walking sheet).

### Group 1: the Crown's soldiers in battle

| Picture | Becomes | Done |
|---|---|---|
| Crown Marine | `enemies/crown_marine.png` | [x] Nov 10 |
| Crown Musketeer | `enemies/crown_musketeer.png` | [x] Nov 10 |
| Crown Officer | `enemies/crown_officer.png` | [x] Nov 10 |

### Group 2: the companions' walking sheets and portraits (Azzy is already done)

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Samira Dorini | `samira` | - | [x] Nov 10 | [x] earnest, dismayed | [x] Nov 10 |
| Bayarmaa Ironvow | `bayarmaa` | - | [x] Nov 10 | [x] fierce, soft | [x] Nov 10 |
| Haru Suzumori | `haru` | - | [x] Nov 10 | [x] caught, set | [x] Nov 10 |
| Vikram of the Agnivansh | `vikram` | - | [x] Nov 13 | [x] out_of_breath, set | [x] Nov 13 |
| Edmund Stillwater | `edmund` | [ ] | [ ] | [ ] steady, gentle | [ ] |

### Group 3: the six companions' battle stances

| Picture | Becomes | Done |
|---|---|---|
| Azzy (blade-knight) | `battle/azzy.png` | [ ] |
| Samira (alchemist) | `battle/samira.png` | [x] Nov 10 |
| Bayarmaa (raider) | `battle/bayarmaa.png` | [ ] |
| Haru (shadow agent) | `battle/haru.png` | [x] Nov 10 |
| Vikram (fire duelist) | `battle/vikram.png` | [ ] (prompt: no flame in his hand, Nov 13: the effects drawn into art read as a weapon) |
| Edmund (guardian) | `battle/edmund.png` | [ ] |

### Group 4: the other common foes

| Picture | Becomes | Done |
|---|---|---|
| Oil Enforcer | `enemies/oil_enforcer.png` | [ ] |
| Caravan Raider | `enemies/caravan_raider.png` | [ ] |
| Fog Cutpurse | `enemies/fog_cutpurse.png` | [ ] |
| Steppe Reaver | `enemies/steppe_reaver.png` | [ ] |
| Husher | `enemies/husher.png` | [ ] |
| Road Bandit | `enemies/road_bandit.png` | [ ] |
| Sealbearer | `enemies/sealbearer.png` | [ ] |
| Lookout | `enemies/lookout.png` | [ ] |

### Group 5: the bosses

| Picture | Becomes | Done |
|---|---|---|
| Governor Thorne | `enemies/thorne.png` | [ ] |
| Captain-General Hale | `enemies/hale.png` | [ ] |

### Group 6: the beasts

| Picture | Becomes | Done |
|---|---|---|
| Ember Jackal | `enemies/ember_jackal.png` | [ ] |
| Steppe Wolf | `enemies/steppe_wolf.png` | [ ] |
| Lantern Moth | `enemies/lantern_moth.png` | [ ] |
| Cave Bat | `enemies/cave_bat.png` | [ ] |

### Group 7: the named characters, chapter by chapter

Samira, Bayarmaa, Haru, Vikram and Edmund are in group 2, not repeated here. The file name is the look's name; walking sheets go in `characters/` and portraits in `portraits/`.

**Chapter 2 (Xaraguá)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Cacique Anaco | `anaco` | [ ] | [ ] | [ ] stern, tender | [ ] |
| The behique, healer of Xaraguá | `behique` | [ ] | [ ] | [ ] grave | [ ] |

**Chapter 3 (Ardencia)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Captain Azriel Rivera | `rivera` | [ ] | [ ] | [ ] grim | [ ] |
| Jaime | `jaime` | [ ] | [ ] | [ ] casting | [ ] |
| Envoy Cresswell | `cresswell` | [ ] | [ ] | [ ] thoughtful | [ ] |
| Nancy (real family, photo) | `nancy` | [ ] | [ ] | [ ] tender, firm | [ ] |
| Zelia (real family, photo) | `zelia` | [ ] | [ ] | [ ] protective, softened | [ ] |
| Amanda (real family, photo) | `amanda` | [ ] | [ ] | [ ] conspiratorial, fierce | [ ] |
| Young Benny (the Echo) (real family, photo) | `benny_young` | [ ] | [ ] | [ ] wry, recognising | [ ] |

**Chapter 4 (Al-Doria)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Guildmaster Qasim | `qasim` | [ ] | [ ] | [ ] cold, defeated | [ ] |
| Layla Dorini, the Merchant-Prince | `layla` | [ ] | [ ] | [ ] softened | [ ] |
| Joaquin (real family, photo) | `joaquin` | [ ] | [ ] | [ ] torn, handing_over | [ ] |
| Coralie, "Tati Coco" (real family, photo) | `coralie` | [ ] | [ ] | [ ] fierce, tender | [ ] |

**Chapter 5 (Eightgate)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| The Lord Regent Aldric Vane | `regent` | [ ] | [ ] | [ ] patient, one_breath_too_long | [ ] |
| Keeper Hollis | `hollis` | [ ] | [ ] | [ ] unimpressed, moved | [ ] |

**Chapter 6 (Ordvik)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Salkhi (a horse) | `horse_grey` | [ ] | [ ] | [ ] vindicated | [ ] |
| Torvald | `torvald` | [ ] | [ ] | [ ] exact | [ ] |
| Hrafn | `hrafn` | [ ] | [ ] | [ ] bought | [ ] |
| Noyan Grimvald | `grimvald` | [ ] | [ ] | - | [ ] |
| Sarnai Ironvow | `echo_sarnai` | [ ] | [ ] | - | [ ] |

**Chapter 7 (Kirinoura)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Lady Kaede Suzumori | `kaede` | [ ] | [ ] | [ ] final, warm | [ ] |
| The Paper Fox | `paper_fox` | [ ] | [ ] | [ ] yielding | [ ] |
| Lady Sayo Suzumori | `echo_sayo` | [ ] | [ ] | - | [ ] |
| Kayla (real family, photo) | `kayla` | [ ] | [ ] | [ ] listening | [ ] |

**Chapter 8 (Agnipur)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Meera | `meera` | [ ] | [ ] | [ ] tired, giving | [ ] |
| Seth Dhanraj | `seth_dhanraj` | [ ] | [ ] | [ ] withdrawing | [ ] |
| Arjun of the Agnivansh | `echo_arjun` | [ ] | [ ] | - | [ ] |
| Aiyana (real family, photo) | `aiyana` | [ ] | [ ] | [ ] dry | [ ] |

**Chapter 9 (Kingsmere)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| The Almoner | `almoner` | [ ] | [ ] | [ ] unveiled | [ ] |
| Lady Rosalind Stillwater | `rosalind` | [ ] | [ ] | [ ] standing | [ ] |
| Jordyn (real family, photo) | `jordyn` | [ ] | [ ] | [ ] mothers_jaw, resigning | [ ] |
| Sebastian (real family, photo) | `sebastian` | [ ] | [ ] | [ ] listening, tender | [ ] |

**Chapter 10 (Pòdlimyè)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| The Dorini admiral | `dorini_admiral` | [ ] | [ ] | [ ] bought | [ ] |
| The Agnivansh steward | `agnivansh_steward` | [ ] | [ ] | [ ] bought | [ ] |
| Ti Jak | `ti_jak` | [ ] | [ ] | [ ] odile, going | [ ] |
| The powder-master | `powder_master` | [ ] | [ ] | - | [ ] |
| The crew chief | `crew_chief` | [ ] | [ ] | [ ] sitting_on_the_sand | [ ] |
| Rahel (real family, photo) | `rahel` | [ ] | [ ] | [ ] warm, closed | [ ] |
| Patricia (real family, photo) | `patricia` | [ ] | [ ] | [ ] blessing, listening | [ ] |

**Chapter 11 (Yucayeque)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| Captain-General Hale | `hale` | [ ] | [ ] | [ ] you_just_you, going | [ ] |
| An old Crown marine | `old_crown_marine` | [ ] | - | - | [ ] |
| An old Crown musketeer | `old_crown_musketeer` | [ ] | - | - | [ ] |

**Chapter 12 (the Throne's Concourse)**

| Character | File name | Reference sheet | Portrait | Extra expressions | Walking sheet |
|---|---|---|---|---|---|
| The herald | `herald` | [ ] | [ ] | [ ] impassive | [ ] |

---

## Group 1: the Crown's soldiers in battle

They appear in 25 fights. They face **left** (the party is on the left). Each is a new chat. Do the marine first; then attach the finished marine to the musketeer and the officer so the uniforms stay the same.

### Crown Marine

**Becomes:** `quest/art/enemies/crown_marine.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a Crown marine, a soldier of an 18th-century colonial empire. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. red coat with white crossbelts and a white sash, white breeches, a navy blue round cap, light skin, short brown hair. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: holding a cutlass forward at waist height, the other hand in a fist. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Crown Musketeer

**Becomes:** `quest/art/enemies/crown_musketeer.png` (a 32 x 40 cell, facing left). A NEW chat. Attach the finished Crown Marine picture, so the uniforms match.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a Crown musketeer, a colonial soldier with a musket. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. red coat with white crossbelts, white breeches, a navy blue bicorne hat, deep brown skin, short dark hair. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: holding a long flintlock musket levelled forward with both hands, ready to fire. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Crown Officer

**Becomes:** `quest/art/enemies/crown_officer.png` (a 32 x 40 cell, facing left). A NEW chat. Attach the finished Crown Marine picture, so the uniforms match.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a Crown officer of the Regent's service. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. a violet coat with gold trim and gold epaulettes, a white sash, white breeches, a navy blue bicorne hat, deep brown skin. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: holding a slim sword raised forward, the other hand on his hip. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

---

## Group 2: the companions' walking sheets and portraits

On screen in every chapter from 3 on. Azzy is already done. For each one: a new chat, the three steps, all in that chat.

### Samira Dorini

Alchemist and Layla's daughter, about 24; joins the party in Chapter 4. Mediterranean and Middle-Eastern-inspired: no veil-and-harem tropes, no genie look. Her age is Claude's call.

**Becomes:** walking sheet `characters/samira.png` (24 x 32 cells), portrait `portraits/samira.png`, `portraits/samira_earnest.png`, `portraits/samira_dismayed.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Samira Dorini. The attached image shows the art style to match (it is a different character).
She is a young Middle-Eastern-inspired merchant and alchemist of about 24 from a rich trading house, quick, dry-humoured and sharp-eyed, a little shorter than the other young women in the party. Warm olive-brown skin, a lively face with big dark eyes and strong dark eyebrows, long, wavy black hair worn loose down her back under a gold-yellow head wrap tied at the temple. Outfit: a long, deep-teal tunic-robe with gold trim at the collar and cuffs, a gold-yellow sash at the waist with a small slip-book tucked into it, loose cream trousers under the robe, soft brown boots, a leather satchel on a strap across her chest, and a small brass appraising scale on a cord at her hip. Ink stains on her fingers. Standing with her weight on one hip, a small knowing smile. Show her full body three times on one sheet: front view, side view and back view, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours, well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Samira Dorini, about 24, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm olive-brown skin, big dark eyes and strong eyebrows, long wavy black hair under the gold-yellow head wrap, the deep-teal robe with gold trim, the gold-yellow sash, the leather satchel strap. Expression: sly and amused, one eyebrow raised, a merchant who has just spotted the flaw in what you are selling. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `samira_earnest`:
```
Same portrait, same framing, expression: **earnest**, the smirk gone, eyes open and a little shy, saying something true.
```

For `samira_dismayed`:
```
Same portrait, same framing, expression: **dismayed**, eyes wide and shining, lips pressed, trying not to show that she is hurt.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Samira Dorini, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm olive-brown skin, long wavy black hair under a gold-yellow head wrap, a deep-teal tunic-robe with gold trim reaching her calves, a gold-yellow sash with a slip-book in it, cream trousers, brown boots, a leather satchel strap across her chest, a small brass scale at her hip. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Bayarmaa Ironvow

The Raider, the Chapter 6 companion (Ordvik), about 19. Cultural care: steppe-inspired, dressed with respect and without costume clichés; the cultural reviewer checks Ordvik with the rest of the chapter.

**Becomes:** walking sheet `characters/bayarmaa.png` (24 x 32 cells), portrait `portraits/bayarmaa.png`, `portraits/bayarmaa_fierce.png`, `portraits/bayarmaa_soft.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Bayarmaa Ironvow. The attached image shows the art style to match (it is a different character). She is a young steppe raider of about 19, the chief's daughter of a horse people of cold open grasslands, lean and sharp-shouldered, flat-faced and watchful, a woman who says little. Warm tan skin, dark eyes that look past you at the horizon, a long black braid down her back. Outfit: a knee-length grey felt riding coat with a slate-blue collar and a braided hem, a wide sash at the waist, dark riding boots, and a curved steppe sabre at her hip with a horsehair grip. Show her full body three times on one sheet: front view, side view and back view, standing with weight on one leg, one hand resting on the sabre grip, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey felt, slate blue, black, warm tan skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Bayarmaa Ironvow, about 19, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm tan skin, dark eyes looking just past the viewer, a long black braid over one shoulder, the grey felt riding coat with its slate-blue collar. Expression: flat and unreadable, a level, watchful look, a young woman who says very little. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `bayarmaa_fierce`:
```
Same portrait, same framing, expression: **fierce**, jaw set, eyes blazing, a warrior defying her own council.
```

For `bayarmaa_soft`:
```
Same portrait, same framing, expression: **soft**, the eyes warm and a little wet, the guard down, as if looking at her horse.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Bayarmaa Ironvow, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm tan skin, a long black braid, a knee-length grey felt riding coat with a slate-blue collar and braided hem, a wide sash, dark riding boots, a curved sabre with a horsehair grip at her hip visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Haru Suzumori

The Shadow agent, the Chapter 7 companion (Kirinoura), about 18. Cultural care: Kirinoura is East Asian-inspired; dress him with respect, no costume clichés. Suzumori violet is #7d3c98.

**Becomes:** walking sheet `characters/haru.png` (24 x 32 cells), portrait `portraits/haru.png`, `portraits/haru_caught.png`, `portraits/haru_set.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Haru Suzumori. The attached image shows the art style to match (it is a different character). He is a young East Asian-inspired spy of about 18 from a harbor city of paper lanterns, slight and quick, with a watchful face that is always one beat too honest. Warm light skin, black hair tied back with a few strands loose, dark eyes. Outfit: a grey kimono jacket over dark trousers, a violet cord tied at one wrist, soft-soled shoes, a short paper knife in a lacquer sheath at the small of his back, and a folded paper lantern hanging at his belt. Show his full body three times on one sheet: front view, side view and back view, standing relaxed, trying very hard to look like nobody in particular, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey, dark charcoal, violet, warm light skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Haru Suzumori, about 18, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm light skin, black hair tied back with a few loose strands, the grey kimono jacket collar, the violet cord at his wrist. Expression: deadpan, a perfectly blank face that is trying much too hard to say "definitely not a spy". Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `haru_caught`:
```
Same portrait, same framing, expression: **caught**, eyes wide, a half-guilty, half-sheepish look, a boy spotted peeking from behind something.
```

For `haru_set`:
```
Same portrait, same framing, expression: **set**, jaw firm, eyes steady and a little afraid, a young man refusing an order from someone he loves.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Haru Suzumori, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly shorter and slimmer than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm light skin, black hair tied back with a few loose strands, a grey kimono jacket over dark trousers, a violet cord at the wrist, soft-soled shoes, a short paper knife in a sheath at the small of his back, a folded paper lantern at his belt. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Vikram of the Agnivansh

The Fire duelist, the Chapter 8 companion (Agnipur), about 20. Cultural care: Agnipur is South Asian-inspired; dress him with respect, no costume clichés. Agnivansh saffron is #e67e22 with brass.

**Becomes:** walking sheet `characters/vikram.png` (24 x 32 cells), portrait `portraits/vikram.png`, `portraits/vikram_out_of_breath.png`, `portraits/vikram_set.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Vikram of the Agnivansh. The attached image shows the art style to match (it is a different character). He is a young South Asian-inspired fire duelist of about 20 from a city of white domes and lamps, tall and lean, with a quick grin and a quicker temper. Warm brown skin, short black hair pushed back, bright dark eyes. Outfit: a saffron duelling coat with brass buttons over cream trousers, a red sash at the waist, dark boots, and a curved talwar sword at his hip. Show his full body three times on one sheet: front view, side view and back view, standing tall and a little cocky, one hand on the sword hilt, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (saffron, brass, cream, red, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Vikram of the Agnivansh, about 20, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm brown skin, short black hair pushed back, the saffron duelling coat with its brass buttons, the red sash. Expression: challenging, a quick cocky grin and raised chin, a duellist saying "Again". Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `vikram_out_of_breath`:
```
Same portrait, same framing, expression: **out of breath**, flushed, mouth open, hair a little loose, a young man bent over with his hands on his knees but still grinning.
```

For `vikram_set`:
```
Same portrait, same framing, expression: **set**, the grin gone, jaw tight, eyes steady and bright, a son about to defy his mother in front of everyone.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Vikram of the Agnivansh, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 10% taller and lean. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm brown skin, short black hair pushed back, a saffron duelling coat with brass buttons, cream trousers, a red sash, dark boots, a curved talwar at the hip visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Edmund Stillwater

The Guardian, the Chapter 9 companion (Kingsmere), about 22, Lady Rosalind's son.

**Becomes:** walking sheet `characters/edmund.png` (24 x 32 cells), portrait `portraits/edmund.png`, `portraits/edmund_steady.png`, `portraits/edmund_gentle.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Edmund Stillwater. The attached image shows the art style to match (it is a different character). He is a young, broad, tall, ridiculously polite guardian of about 22 from a grey, rainy country, strong and gentle, a man who apologises to doors. Fair skin with a flush, curly brown hair, kind brown eyes. Outfit: a grey brimmed hat, a long grey greatcoat over a waistcoat, a leather satchel with a small tea tin showing at the top, sturdy boots, and a plain pattern sword in a scabbard at his hip. Show his full body three times on one sheet: front view, side view and back view, standing square and upright, the satchel strap across his chest, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (Stillwater grey, cream, brown leather, fair skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Edmund Stillwater, about 22, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Fair skin with a flush, curly brown hair under the grey brimmed hat, kind brown eyes, the grey greatcoat collar over a waistcoat. Expression: apologetic, a wince and a small smile, brows lifted, a man saying "Terribly sorry". Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `edmund_steady`:
```
Same portrait, same framing, expression: **steady**, the apology gone, jaw set, eyes calm and level, a polite man who has decided and will not move.
```

For `edmund_gentle`:
```
Same portrait, same framing, expression: **gentle**, the eyes soft, head tilted down a little and smiling, as if crouched to talk to a small child.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Edmund Stillwater, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 10% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Fair skin, curly brown hair under a grey brimmed hat, a long grey greatcoat over a waistcoat, a satchel with a small tea tin showing, dark boots, a plain sword at the hip. Bright, saturated, warm colours with clearly lit skin; brown eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

## Group 3: the six companions' battle stances

In every fight from Chapter 3 on. Each is a **new chat** with **only that character's walking sprite sheet** attached (the one you made in group 2; do not attach the reference sheet). The prompt asks for two cells: the ready stance and the kneeling pose. The front hand is closed and empty, because the game draws the equipped weapon into it. If the weapon looks off in the game, I will set the hand position myself.

### Azzy (blade-knight)

**Becomes:** `quest/art/battle/azzy.png` (two cells: the stance and the kneeling pose; the game draws the weapon in).
A NEW chat. Attach **only** Azzy's walking sprite sheet (the one from step 3 of Azzy's character prompts in group 2, or the finished `quest/art/characters/azzy.png`). Do not attach the reference sheet or Gianna's sheet.

```
Pixel art battle sprites of the same character, Azzy, for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs. IMPORTANT: this must look exactly like the attached walking sprite sheet, just in a new pose: the same chunky low-resolution 8-bit style, the same chibi proportions (a big head about 40% of the figure's height, a small body), the same size of pixels, each pixel clearly visible and square. Do NOT make it more detailed, painterly or realistic, and do NOT use realistic body proportions. Match the attached sprite sheet's colours. Each figure fills a 32 x 40 pixel cell. One row of 2 cells, both the same size, with NO lines or borders between them. Cell 1: the character in a ready battle stance, seen from the side and slightly toward the viewer (three-quarter view), facing RIGHT, feet apart, weight forward, broad and grounded, knees bent, his front arm low and forward as if holding a sword, his back hand raised beside his shoulder, his crimson cloak swinging behind him. The front hand (the one nearer the viewer) is held out at waist height and closed in a fist as if gripping a handle, but it holds NOTHING: no weapon, no staff, no bow, no sword. Cell 2: the same character down on one knee, head bowed, hurt, empty-handed. Bright, saturated, warm colours with clearly lit skin; eyes visible. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Feet at the bottom of each cell, same size and position in both cells. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels, no effects, no weapons.
```


### Samira (alchemist)

**Becomes:** `quest/art/battle/samira.png` (two cells: the stance and the kneeling pose; the game draws the weapon in).
A NEW chat. Attach **only** Samira's walking sprite sheet (the one from step 3 of Samira's character prompts in group 2). Do not attach the reference sheet or Gianna's sheet.

```
Pixel art battle sprites of the same character, Samira, for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs. IMPORTANT: this must look exactly like the attached walking sprite sheet, just in a new pose: the same chunky low-resolution 8-bit style, the same chibi proportions (a big head about 40% of the figure's height, a small body), the same size of pixels, each pixel clearly visible and square. Do NOT make it more detailed, painterly or realistic, and do NOT use realistic body proportions. Match the attached sprite sheet's colours. Each figure fills a 32 x 40 pixel cell. One row of 2 cells, both the same size, with NO lines or borders between them. Cell 1: the character in a ready battle stance, seen from the side and slightly toward the viewer (three-quarter view), facing RIGHT, feet apart, weight forward, quick and light on her feet, leaning forward, her back hand raised at shoulder height holding a small stoppered glass vial that glows green, her front hand forward as if holding a short staff. The front hand (the one nearer the viewer) is held out at waist height and closed in a fist as if gripping a handle, but it holds NOTHING: no weapon, no staff, no bow, no sword. Cell 2: the same character down on one knee, head bowed, hurt, empty-handed. Bright, saturated, warm colours with clearly lit skin; eyes visible. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Feet at the bottom of each cell, same size and position in both cells. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels, no effects, no weapons.
```


### Bayarmaa (raider)

**Becomes:** `quest/art/battle/bayarmaa.png` (two cells: the stance and the kneeling pose; the game draws the weapon in).
A NEW chat. Attach **only** Bayarmaa's walking sprite sheet (the one from step 3 of Bayarmaa's character prompts in group 2). Do not attach the reference sheet or Gianna's sheet.

```
Pixel art battle sprites of the same character, Bayarmaa, for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs. IMPORTANT: this must look exactly like the attached walking sprite sheet, just in a new pose: the same chunky low-resolution 8-bit style, the same chibi proportions (a big head about 40% of the figure's height, a small body), the same size of pixels, each pixel clearly visible and square. Do NOT make it more detailed, painterly or realistic, and do NOT use realistic body proportions. Match the attached sprite sheet's colours. Each figure fills a 32 x 40 pixel cell. One row of 2 cells, both the same size, with NO lines or borders between them. Cell 1: the character in a ready battle stance, seen from the side and slightly toward the viewer (three-quarter view), facing RIGHT, feet apart, weight forward, low and wide like a wrestler, weight on the front foot, her front arm forward as if holding a curved sabre, her back hand open and ready, her braid swinging. The front hand (the one nearer the viewer) is held out at waist height and closed in a fist as if gripping a handle, but it holds NOTHING: no weapon, no staff, no bow, no sword. Cell 2: the same character down on one knee, head bowed, hurt, empty-handed. Bright, saturated, warm colours with clearly lit skin; eyes visible. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Feet at the bottom of each cell, same size and position in both cells. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels, no effects, no weapons.
```


### Haru (shadow agent)

**Becomes:** `quest/art/battle/haru.png` (two cells: the stance and the kneeling pose; the game draws the weapon in).
A NEW chat. Attach **only** Haru's walking sprite sheet (the one from step 3 of Haru's character prompts in group 2). Do not attach the reference sheet or Gianna's sheet.

```
Pixel art battle sprites of the same character, Haru, for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs. IMPORTANT: this must look exactly like the attached walking sprite sheet, just in a new pose: the same chunky low-resolution 8-bit style, the same chibi proportions (a big head about 40% of the figure's height, a small body), the same size of pixels, each pixel clearly visible and square. Do NOT make it more detailed, painterly or realistic, and do NOT use realistic body proportions. Match the attached sprite sheet's colours. Each figure fills a 32 x 40 pixel cell. One row of 2 cells, both the same size, with NO lines or borders between them. Cell 1: the character in a ready battle stance, seen from the side and slightly toward the viewer (three-quarter view), facing RIGHT, feet apart, weight forward, crouched and narrow, nearly side-on, his front arm low and forward as if holding a short blade reversed along the forearm, his back hand near his hip. The front hand (the one nearer the viewer) is held out at waist height and closed in a fist as if gripping a handle, but it holds NOTHING: no weapon, no staff, no bow, no sword. Cell 2: the same character down on one knee, head bowed, hurt, empty-handed. Bright, saturated, warm colours with clearly lit skin; eyes visible. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Feet at the bottom of each cell, same size and position in both cells. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels, no effects, no weapons.
```


### Vikram (fire duelist)

**Becomes:** `quest/art/battle/vikram.png` (two cells: the stance and the kneeling pose; the game draws the weapon in).
A NEW chat. Attach **only** Vikram's walking sprite sheet (the one from step 3 of Vikram's character prompts in group 2). Do not attach the reference sheet or Gianna's sheet.

```
Pixel art battle sprites of the same character, Vikram, for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs. IMPORTANT: this must look exactly like the attached walking sprite sheet, just in a new pose: the same chunky low-resolution 8-bit style, the same chibi proportions (a big head about 40% of the figure's height, a small body), the same size of pixels, each pixel clearly visible and square. Do NOT make it more detailed, painterly or realistic, and do NOT use realistic body proportions. Match the attached sprite sheet's colours. Each figure fills a 32 x 40 pixel cell. One row of 2 cells, both the same size, with NO lines or borders between them. Cell 1: the character in a ready battle stance, seen from the side and slightly toward the viewer (three-quarter view), facing RIGHT, feet apart, weight forward, upright and elegant like a fencer, side-on, his front arm extended as if holding a slim blade, his back hand raised behind him, open and empty. The front hand (the one nearer the viewer) is held out at waist height and closed in a fist as if gripping a handle, but it holds NOTHING: no weapon, no staff, no bow, no sword. Cell 2: the same character down on one knee, head bowed, hurt, empty-handed. Bright, saturated, warm colours with clearly lit skin; eyes visible. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Feet at the bottom of each cell, same size and position in both cells. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels, no effects, no weapons.
```


### Edmund (guardian)

**Becomes:** `quest/art/battle/edmund.png` (two cells: the stance and the kneeling pose; the game draws the weapon in).
A NEW chat. Attach **only** Edmund's walking sprite sheet (the one from step 3 of Edmund's character prompts in group 2). Do not attach the reference sheet or Gianna's sheet.

```
Pixel art battle sprites of the same character, Edmund, for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs. IMPORTANT: this must look exactly like the attached walking sprite sheet, just in a new pose: the same chunky low-resolution 8-bit style, the same chibi proportions (a big head about 40% of the figure's height, a small body), the same size of pixels, each pixel clearly visible and square. Do NOT make it more detailed, painterly or realistic, and do NOT use realistic body proportions. Match the attached sprite sheet's colours. Each figure fills a 32 x 40 pixel cell. One row of 2 cells, both the same size, with NO lines or borders between them. Cell 1: the character in a ready battle stance, seen from the side and slightly toward the viewer (three-quarter view), facing RIGHT, feet apart, weight forward, square and immovable, feet planted, his front arm forward as if holding a heavy blade or mace, his back arm raised as if bracing a shield (draw no shield). The front hand (the one nearer the viewer) is held out at waist height and closed in a fist as if gripping a handle, but it holds NOTHING: no weapon, no staff, no bow, no sword. Cell 2: the same character down on one knee, head bowed, hurt, empty-handed. Bright, saturated, warm colours with clearly lit skin; eyes visible. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Feet at the bottom of each cell, same size and position in both cells. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels, no effects, no weapons.
```


---

## Group 4: the other common foes

Each is a new chat; no attachment is needed. They face **left**.

### Oil Enforcer

**Becomes:** `quest/art/enemies/oil_enforcer.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: an oil-store enforcer from a desert trade city. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. a tall bearded man with deep brown skin and black hair, a long pale stone-coloured tunic over grey trousers, a leather satchel. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: a heavy wooden club held in both hands, ready to swing. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Caravan Raider

**Becomes:** `quest/art/enemies/caravan_raider.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a desert caravan raider. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. bronze skin, a sand-coloured head wrap with a tail, a tan robe with a green sash, brown trousers. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: a curved dagger held low and forward, crouching. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Fog Cutpurse

**Becomes:** `quest/art/enemies/fog_cutpurse.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a cutpurse from a foggy harbor city of paper lanterns. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. a grey-violet hood over the head (face visible), a grey-violet jacket and dark trousers, East Asian features. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: crouched low, a short knife held reversed in the front hand. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Steppe Reaver

**Becomes:** `quest/art/enemies/steppe_reaver.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a steppe horse raider. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. a bronze-brown leather coat with a red sash, a rounded steel helmet, a black braid, weathered tan skin. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: a curved sabre raised over the head, mid-charge. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Husher

**Becomes:** `quest/art/enemies/husher.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a "Husher", a veiled zealot of a secret cult. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. a dark grey-violet robe, a dark cowl, a sheer grey veil over the lower face, eyes visible. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: both hands raised, palms out, as if commanding silence. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Road Bandit

**Becomes:** `quest/art/enemies/road_bandit.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a road bandit. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. a red head wrap, a short black beard, a brown jerkin, dark trousers, mid-brown skin. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: a short machete held forward, grinning. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Sealbearer

**Becomes:** `quest/art/enemies/sealbearer.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a Regent's Sealbearer, a ceremonial guard. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. a grey-violet tabard over steel, a violet-plumed steel helmet, a white seal emblem on the chest, light skin. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: a tall halberd held upright in front, blade forward. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Lookout

**Becomes:** `quest/art/enemies/lookout.png` (a 32 x 40 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: a young camp lookout. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. small and wiry, a dark green hood (face visible) and green tunic, dark trousers. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: a sling whirling in the front hand. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 32 x 40 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

---

## Group 5: the bosses

Drawn larger than the others (a 36 x 48 cell). Each is a new chat; no attachment is needed. (Grimvald, the Paper Fox and Seth Dhanraj fight with their walking sheets from group 7 until you want painted battle sprites for them.)

### Governor Thorne

**Becomes:** `quest/art/enemies/thorne.png` (a 36 x 48 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: Governor Thorne, a colonial governor, the chapter's villain. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. A tall, thin older man with white hair, a navy blue governor's coat heavy with gold braid and gold epaulettes, a red sash, white breeches and stockings, a black bicorne hat with a gold cockade, light tan skin, a cold look. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: standing straight, a silver-topped sword cane drawn and pointed forward. Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 36 x 48 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

### Captain-General Hale

**Becomes:** `quest/art/enemies/hale.png` (a 36 x 48 cell, facing left). A NEW chat. Nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG battle screen in the style of classic Super Nintendo and Game Boy Advance RPGs: Captain-General Hale, the Crown's commander. The same chunky low-resolution 8-bit style as a classic SNES RPG party: chibi proportions (a big head about 40% of the figure's height, a small body), each pixel clearly visible and square. Do NOT make it detailed, painterly or realistic. A tall broad older man with a grey beard and grey hair, a violet general's coat with gold trim and gold epaulettes, black trousers, a dark bicorne hat, deep brown skin. Seen from the side and slightly toward the viewer (three-quarter view), facing LEFT, in a ready fighting stance: a heavy boarding axe held forward in both hands, ready to swing (the axe he lays down at the Claim). Bright, saturated colours with clearly lit skin; eyes visible. The figure fills a 36 x 48 pixel cell, feet at the bottom. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no labels, no effects.
```

---

## Group 6: the beasts

Each is a new chat; nothing to attach.

### Ember Jackal

**Becomes:** `quest/art/enemies/ember_jackal.png` (40 x 28 pixels, facing left). A NEW chat; nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG in the style of classic Super Nintendo RPGs: a desert jackal whose sandy coat glows with ember sparks along its back, as if smouldering, seen from the side, facing LEFT, head low, lips drawn back, about to spring. 40 x 28 pixels, the animal filling the image, 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no other animals, no background.
```

### Steppe Wolf

**Becomes:** `quest/art/enemies/steppe_wolf.png` (44 x 30 pixels, facing left). A NEW chat; nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG in the style of classic Super Nintendo RPGs: a big grey steppe wolf with a thick winter coat and pale eyes, seen from the side, facing LEFT, head low, hackles up, snarling. 44 x 30 pixels, the animal filling the image, 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no other animals, no background.
```

### Lantern Moth

**Becomes:** `quest/art/enemies/lantern_moth.png` (36 x 32 pixels, facing left). A NEW chat; nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG in the style of classic Super Nintendo RPGs: a giant moth from a foggy marsh, its wings patterned like paper lanterns, glowing soft yellow, seen from the side, facing LEFT, wings spread, hovering. 36 x 32 pixels, the animal filling the image, 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no other animals, no background.
```

### Cave Bat

**Becomes:** `quest/art/enemies/cave_bat.png` (32 x 24 pixels, facing left). A NEW chat; nothing to attach.

```
Pixel art battle sprite for a side-view 16-bit fantasy RPG in the style of classic Super Nintendo RPGs: a cave bat, dark brown with tan ears and wings, seen from the side, facing LEFT, wings spread, mouth open, diving. 32 x 24 pixels, the animal filling the image, 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no ground shadow. Solid flat magenta background (#FF00FF). No text, no other animals, no background.
```

---

## Group 7: the named characters, chapter by chapter

From `ART-PROMPTS.md` sections 12 to 21, skipping the ones already done and the five companions in group 2. For a character from the family, the prompts are in `ART-PROMPTS-REAL-PEOPLE.md`.

## Group 7, Chapter 2 (Xaraguá)

### Cacique Anaco

Yari's father, the ailing cacique of Xaraguá, about 68 (Chapter 2). Taíno-inspired: dressed with care, no feather headdress, no war paint; the cultural reviewer checks him with the rest of Xaraguá.

**Becomes:** walking sheet `characters/anaco.png` (28 x 36 cells), portrait `portraits/anaco.png`, `portraits/anaco_stern.png`, `portraits/anaco_tender.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Anaco. The attached image shows the art style to match (it is a different character). He is the elderly chief (cacique) of a green Caribbean island people, inspired by the Taíno of Hispaniola: about 68, tall but thinner than he once was, a little stooped from illness, still dignified and proud. Warm medium-brown skin, a lean, lined, kind face with high cheekbones and sharp dark eyes, long straight white hair tied back at the nape with a cotton cord, no beard. Outfit: a simple knee-length tunic of undyed white cotton with a woven band of teal and annatto red at the hem, a light cotton mantle over his shoulders edged in the same teal and red weave, and on his chest a round polished gold-copper disc pendant (a guanín) on a cord of small white shell beads. Barefoot or simple woven sandals. He leans on a dark carved wooden staff whose top is carved as a small face with round eyes. Show his full body three times on one sheet: front view, side view and back view, standing and leaning slightly on the staff, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (white cotton, teal, annatto red, gold, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No feather headdress, no face or body paint, no weapons. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Anaco, about 68, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm medium-brown skin, long white hair tied back, the cotton mantle with its teal and annatto-red edge, the round gold-copper guanín pendant on white shell beads. Expression: tired but sharp, a faint dry smile, a man who is ill and refuses to let it show. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `anaco_stern`:
```
Same portrait, same framing, expression: **stern**, jaw set, eyes hard, the chief speaking to his council.
```

For `anaco_tender`:
```
Same portrait, same framing, expression: **tender**, eyes soft, looking at his daughter, a father's proud, worried smile.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Anaco, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character: match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him a little taller and thinner. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm brown skin, long white hair tied back, white cotton tunic and mantle with teal and red edges, a gold disc pendant on the chest, the dark carved staff held in one hand and visible in every frame; he walks slowly, slightly stooped. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

---

### The behique, healer of Xaraguá

The healer of Xaraguá, about 55, who tends Anaco and sends Gianna for the fever bark (Chapter 2). Taíno-inspired: no feather headdress, no war paint. Her age and sex are Claude's call.

**Becomes:** walking sheet `characters/behique.png` (24 x 32 cells), portrait `portraits/behique.png`, `portraits/behique_grave.png`. Background: bright green.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the behique. The attached image shows the art style to match (it is a different character).
She is the healer of a green Caribbean island people, inspired by the Taíno of Hispaniola: about 55, of middle height, upright and unhurried, calm and exact. Warm medium-brown skin, a lined, thoughtful face with high cheekbones and steady dark eyes, long straight black hair with a few silver strands, worn loose down her back, held by a thin gold-copper circlet. Outfit: a long, plain cotton robe in deep plum with a woven band of cream and teal at the hem and cuffs, a light cream cotton mantle over her shoulders, a cord of small white shell beads at her neck, and a woven cotton pouch of herbs at her belt. Barefoot or simple woven sandals. In one hand a small carved wooden bowl with crushed leaves. Standing straight, the bowl held in front of her. Show her full body three times on one sheet: front view, side view and back view, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours, well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the behique, about 55, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm medium-brown skin, long black hair with a few silver strands held by a thin gold-copper circlet, the deep plum robe with its cream and teal band, the cream mantle, the white shell bead cord. Expression: calm and attentive, a faint patient half-smile, a healer who has seen every fever. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright green (#00FF00) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `behique_grave`:
```
Same portrait, same framing, expression: **grave**, brows drawn, lips pressed, eyes on someone off to the side, the fever worse than she will say.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the behique, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), draw her at the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm medium-brown skin, long black hair with silver strands and a thin gold-copper circlet, a deep plum robe reaching her ankles with a cream and teal hem, a cream mantle, a herb pouch at the belt. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright green (#00FF00) background. No text, no numbers, no grid lines, no labels.
```

---


## Group 7, Chapter 3 (Ardencia)

### Captain Azriel Rivera

Captain of Rael's royal guard, Azzy's namesake, about 50 (Chapter 3). Quiet and loyal; a very strong opponent in the Trial. Tall man: 28 x 36 cells.

**Becomes:** walking sheet `characters/rivera.png` (28 x 36 cells), portrait `portraits/rivera.png`, `portraits/rivera_grim.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Captain Azriel Rivera. The attached image shows the art style to match (it is a different character). He is a Spanish-inspired Caribbean soldier of about 50, captain of a royal guard: quiet, loyal, a soldier's build, a man who says almost nothing. Weathered brown skin, close-cropped black hair going grey, a short black beard, an old scar along the jaw. Outfit: a crimson coat under a dark iron breastplate, a dark iron helmet with a crimson crest and a dented, scarred brow, worn so the whole face stays visible, and a long halberd. Show his full body three times on one sheet: front view, side view and back view, standing at attention holding the halberd upright, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (crimson, dark iron, black, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Captain Azriel Rivera, about 50, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Close-cropped black hair going grey, the short black beard, the old scar along the jaw, the dented iron helmet with a crimson crest worn so the face shows, the iron breastplate. Expression: watchful, steady eyes that miss nothing. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `rivera_grim`:
```
Same portrait, same framing, expression: **grim**, jaw tight, a soldier about to do something he does not want to do.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Captain Azriel Rivera, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw he about 15% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Weathered brown skin, close-cropped grey-black hair, a short black beard, a dented dark iron helmet with a crimson crest, a crimson coat under a dark iron breastplate, a halberd held in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Jaime

A strong mage, Rael's advisor, about 45 (Chapter 3).

**Becomes:** walking sheet `characters/jaime.png` (24 x 32 cells), portrait `portraits/jaime.png`, `portraits/jaime_casting.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Jaime. The attached image shows the art style to match (it is a different character). He is a Spanish-inspired Caribbean mage of about 45, Rael's advisor: lean, measured, clever. Deep brown skin, long black hair tied back, a neat black beard, sharp clever eyes. Outfit: a long robe of Brasador red with a gold hem, a black over-mantle, and a staff of black iron crowned with a glowing ember. Show his full body three times on one sheet: front view, side view and back view, standing with the staff held upright in one hand, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (Brasador red, black, gold, ember orange, deep brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Jaime, about 45, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Long black hair tied back, the neat black beard, the red robe with a gold hem under the black over-mantle, the glowing ember at the top of the staff if it shows. Expression: measured, calm and exact, weighing every word. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `jaime_casting`:
```
Same portrait, same framing, expression: **casting**, eyes lit with ember light, a faint orange glow on his face.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Jaime, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly taller than her and lean. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Deep brown skin, long black hair tied back, a neat black beard, a long Brasador-red robe with a gold hem, a black over-mantle, a black iron staff with a glowing ember on top. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Envoy Cresswell

The Crown's envoy to Ardencia, about 45, who watches the duel from the gallery (Chapter 3). Dark ink-blue coat, not Aldermoor violet. His age is Claude's call.

**Becomes:** walking sheet `characters/cresswell.png` (28 x 36 cells), portrait `portraits/cresswell.png`, `portraits/cresswell_thoughtful.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Envoy Cresswell. The attached image shows the art style to match (it is a different character (a woman, a lord's daughter)).
He is a tall, lean, upright man of about 45, a diplomat of the Crown, polite, cool and watchful. Fair-to-light warm skin, short neat dark-brown hair with a little grey at the temples, clean-shaven, a long thoughtful face, grey-blue eyes, a patient half-smile. Outfit: a long, close-fitting dark ink-blue coat with white trim and silver buttons, white breeches and polished black boots, a white silk sash across the chest, a small silver emblem of a sun with eight rays pinned to the sash, and a black bicorne hat with a dark-blue band. He holds a rolled letter in one hand and keeps the other behind his back. Standing tall and still. Show his full body three times on one sheet: front view, side view and back view, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours, well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Envoy Cresswell, about 45, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Fair-to-light warm skin, short dark-brown hair greying at the temples, clean-shaven, the black bicorne with the dark-blue band, the ink-blue coat with white trim, the white sash with the small silver sun emblem. Expression: courteous and cool, a polite half-smile that gives nothing away. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `cresswell_thoughtful`:
```
Same portrait, same framing, expression: **thoughtful**, head tilted a little, eyes narrowed, weighing someone he has just heard about.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Envoy Cresswell, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 15% taller and slimmer than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Fair-to-light warm skin, short dark-brown hair, a black bicorne hat, a long ink-blue coat with white trim, a white sash with a small silver emblem, white breeches, black boots, a rolled letter in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Nancy (real family: use the photo prompts)

Benny's wife, about 66. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Nancy". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/nancy.png` (24 x 32 cells), `portraits/nancy.png`, `portraits/nancy_tender.png`, `portraits/nancy_firm.png`.

### Zelia (real family: use the photo prompts)

Rael's half-sister, about 38, steward of the Alcázar. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Zelia". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/zelia.png` (24 x 32 cells), `portraits/zelia.png`, `portraits/zelia_protective.png`, `portraits/zelia_softened.png`.

### Amanda (real family: use the photo prompts)

Rael's full sister, about 46. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Amanda". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/amanda.png` (24 x 32 cells), `portraits/amanda.png`, `portraits/amanda_conspiratorial.png`, `portraits/amanda_fierce.png`.

### Young Benny (the Echo) (real family: use the photo prompts)

Benny about fifty years ago, about 22. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Young Benny (the Echo)". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/benny_young.png` (24 x 32 cells), `portraits/benny_young.png`, `portraits/benny_young_wry.png`, `portraits/benny_young_recognising.png`.


## Group 7, Chapter 4 (Al-Doria)

### Guildmaster Qasim

Guildmaster of the Al-Doria merchants, the Chapter 4 boss, about 52. Dress him with respect: no cruel-merchant stereotype, no hooked features; his menace is in his manners and his ledger. His age is Claude's call.

**Becomes:** walking sheet `characters/qasim.png` (28 x 36 cells), portrait `portraits/qasim.png`, `portraits/qasim_cold.png`, `portraits/qasim_defeated.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Guildmaster Qasim. The attached image shows the art style to match (it is a different character (a young woman)).
He is a tall, broad, heavy-set Middle-Eastern-inspired guildmaster and merchant of about 52, smooth, courteous and shrewd, walking with a cane. Warm olive-brown skin, close-cropped black hair, a full, neatly trimmed black beard, heavy-lidded dark eyes, a calm, polite face. Outfit: a long, rich Dorini-green coat with gold trim and gold buttons over a cream shirt, deep-blue trousers, polished brown boots, a gold-yellow sash at the waist, and a white head wrap wound neatly around his head. A black cane with a gold handle in his right hand, a ring of gold keys at his belt. Standing upright, both hands resting on the cane. Show his full body three times on one sheet: front view, side view and back view, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours, well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Guildmaster Qasim, about 52, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm olive-brown skin, close-cropped black hair and a full trimmed black beard, the white head wrap, the Dorini-green coat with gold trim, the gold-yellow sash. Expression: suave and courteous, a small polite smile, hooded eyes, a man who is certain the contract is on his side. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `qasim_cold`:
```
Same portrait, same framing, expression: **cold**, the smile gone, eyes hard and flat, a man giving an order he considers a formality.
```

For `qasim_defeated`:
```
Same portrait, same framing, expression: **defeated**, jaw slack, eyes lowered, the confidence gone out of him.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Guildmaster Qasim, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 15% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm olive-brown skin, close-cropped black hair, a full black beard, a white head wrap, a long Dorini-green coat with gold trim, a gold-yellow sash, deep-blue trousers, brown boots, a black cane with a gold handle held in one hand and visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Layla Dorini, the Merchant-Prince

The Merchant-Prince of Al-Doria and Samira's mother, about 55 (Chapter 4). Dress her with dignity, no veil-and-harem tropes. Her age is Claude's call.

**Becomes:** walking sheet `characters/layla.png` (28 x 36 cells), portrait `portraits/layla.png`, `portraits/layla_softened.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Layla Dorini. The attached image shows the art style to match (it is a different character (a young woman)).
She is a tall, upright, Middle-Eastern-inspired stateswoman and merchant-prince of about 55, head of a great trading house, composed, formal and unreadable. Warm olive-brown skin, strong dark eyebrows, deep dark eyes, fine lines at the mouth, dark hair streaked with silver, pinned up in a neat bun and wrapped in a gold-yellow head wrap. Outfit: a long, rich Dorini-green robe with a gold-embroidered collar and wide gold-trimmed sleeves, a gold-yellow sash at the waist, and on the sash a small gold emblem of a balance scale (the house's seal), plus gold earrings and a heavy gold ring. Standing very straight, both hands folded in front of her, chin a little raised. Show her full body three times on one sheet: front view, side view and back view, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours, well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Layla Dorini, about 55, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm olive-brown skin, dark hair streaked with silver in a bun under the gold-yellow head wrap, gold earrings, the Dorini-green robe with its gold collar, the small gold scale emblem. Expression: imperious and composed, a level stare, a ruler who has already decided. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `layla_softened`:
```
Same portrait, same framing, expression: **softened**, the eyes warmer and a little tired, a mother's look held for one second too long.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Layla Dorini, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her about 10% taller. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm olive-brown skin, dark hair with silver in a bun under a gold-yellow head wrap, a long Dorini-green robe with gold trim reaching her ankles, a gold-yellow sash with a small gold scale emblem. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Joaquin (real family: use the photo prompts)

Rael's half-brother, about 32 (it also has an optional Chapter 10 'Free Brasador' outfit). The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Joaquin". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/joaquin.png` (24 x 32 cells), `portraits/joaquin.png`, `portraits/joaquin_torn.png`, `portraits/joaquin_handing_over.png`.

### Coralie, "Tati Coco" (real family: use the photo prompts)

Elodie's sister, about 45 (Chapters 4 and 5). The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Coralie, "Tati Coco"". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/coralie.png` (24 x 32 cells), `portraits/coralie.png`, `portraits/coralie_fierce.png`, `portraits/coralie_tender.png`.


## Group 7, Chapter 5 (Eightgate)

### The Lord Regent Aldric Vane

The antagonist, about 60, who never raises his voice (Chapter 5; seen again in Chapters 9 and 12). Violet in the outfit, so the green background is used for the portrait and sprites.

**Becomes:** walking sheet `characters/regent.png` (24 x 32 cells), portrait `portraits/regent.png`, `portraits/regent_patient.png`, `portraits/regent_one_breath_too_long.png`. Background: bright green.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the Lord Regent Aldric Vane. The attached image shows the art style to match (it is a different character). He is the Lord Regent, an antagonist who never raises his voice, about 60: thin and very upright, close-cut grey hair, clean-shaven, pale skin, pale grey eyes, a patient half-smile. Outfit: a long robe of grey-violet with a lighter lilac lining, and on his chest a heavy silver chain of office with the Throne's seal, a sun with eight rays. No crown. One hand rests slightly curled in front of him as if on the arm of a chair that is not there. Show his full body three times on one sheet: front view, side view and back view, standing very upright, one hand resting as if on the arm of a chair, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey-violet, lilac, silver, pale skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the Lord Regent Aldric Vane, about 60, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Close-cut grey hair, clean-shaven pale skin, pale grey eyes, the grey-violet robe with its lilac lining, the heavy silver chain with the sun-and-eight-rays seal. No crown. Expression: courteous, a patient half-smile, polite and perfectly at ease. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright green (#00FF00) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `regent_patient`:
```
Same portrait, same framing, expression: **patient**, the smile gone still, eyes calm, a man who will wait as long as it takes.
```

For `regent_one_breath_too_long`:
```
Same portrait, same framing, expression: **one breath too long**, completely still, the half-smile frozen, eyes fixed on someone a moment longer than is comfortable, unreadable.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the Lord Regent Aldric Vane, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 10% taller and thin. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Pale skin, close-cut grey hair, clean-shaven, a long grey-violet robe with lilac lining reaching his ankles, a silver chain with a seal on the chest, no crown. Bright, saturated, warm colours with clearly lit skin; pale grey eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright green (#00FF00) background. No text, no numbers, no grid lines, no labels.
```

---

### Keeper Hollis

The Throne's archivist, about 75 (Chapter 5).

**Becomes:** walking sheet `characters/hollis.png` (24 x 32 cells), portrait `portraits/hollis.png`, `portraits/hollis_unimpressed.png`, `portraits/hollis_moved.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Keeper Hollis. The attached image shows the art style to match (it is a different character). He is the Throne's old archivist, about 75: small, stooped, bald with a white fringe and a short white beard, warm brown skin, sharp eyes behind small round spectacles, ink on his fingers. Outfit: a plain grey wool robe, old leather slippers, and a single iron key on a cord at his belt. Show his full body three times on one sheet: front view, side view and back view, standing a little stooped, hands clasped in front of him, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey wool, white, iron, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Keeper Hollis, about 75, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. A bald head with a white fringe, a short white beard, warm brown skin, sharp eyes behind small round spectacles, the grey wool robe collar, the iron key cord. Expression: dry, one eyebrow lifted over the spectacles, an old scholar who has heard every excuse. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `hollis_unimpressed`:
```
Same portrait, same framing, expression: **unimpressed**, flat, heavy-lidded, a look that says he has seen better arguments from a first-year student.
```

For `hollis_moved`:
```
Same portrait, same framing, expression: **moved**, the dryness gone, eyes bright and a little wet behind the spectacles, an old man hearing his own life's argument from someone else.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Keeper Hollis, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him a little shorter than her and stooped. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm brown skin, a bald head with a white fringe, a short white beard, round spectacles, a plain grey wool robe, old leather slippers, a single iron key on a cord at the belt. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---


## Group 7, Chapter 6 (Ordvik)

### Salkhi, Bayarmaa's grey mare

Bayarmaa's dappled grey steppe mare, who talks (Chapter 6). Drawn on four legs; she is a horse, so the sheets show a horse and no rider.

**Becomes:** walking sheet `characters/horse_grey.png` (I set the cell size when converting), portrait `portraits/horse_grey.png`, `portraits/horse_grey_vindicated.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Salkhi. The attached image shows the art style to match (it is a different character, a person). Salkhi is a horse: a dappled grey steppe mare, short, sturdy and deep-chested, with a thick dark mane and tail, a dark muzzle, large clever dark eyes, and an expression of enormous dignity and mild contempt. She wears a plain brown leather saddle on a slate-blue saddle-cloth with a woven girth and a simple bridle. Show her whole body three times on one sheet: front view, side view and back view, standing, same scale, evenly spaced, plus one small close-up of her head. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (dappled grey, slate blue, dark brown leather), clear readable shapes. Plain flat light-grey background. No rider, no people, no text, no labels, no letters, no frames, no extra animals, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Salkhi, the dappled grey steppe mare, with the same face as on the reference sheet. Head-and-neck portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Dappled grey coat, a thick dark mane, a dark muzzle, large clever dark eyes, the slate-blue saddle-cloth edge showing at the shoulder. Expression: unimpressed, chin lifted, one ear back, heavy-lidded eyes, a horse of enormous dignity and mild contempt. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `horse_grey_vindicated`:
```
Same portrait, same framing, expression: **vindicated**, chin high and ears forward, a smug, satisfied look, a horse who was right all along.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Salkhi, a horse, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chunky chibi look (a big head for the body, each pixel clearly visible), but draw a horse on four legs, about as tall as Gianna at the head and a little longer than she is tall. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left (the horse seen in side profile), row 3 facing right (the horse seen in side profile), row 4 facing up (back view). In each row: column 1 standing still, column 2 the left legs forward, column 3 the right legs forward. Every frame in row 2 faces left and every frame in row 3 faces right. A dappled grey mare with a thick dark mane and tail, dark muzzle, a brown leather saddle on a slate-blue saddle-cloth. Bright, saturated, warm colours; dark eyes visible. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet (hooves) at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No rider, no text, no numbers, no grid lines, no labels.
```

---

### Torvald

Chieftain of the Ironvow and Bayarmaa's father, about 55 (Chapter 6). Skin tone is Claude's call (the design docs give none); change it if you see him differently.

**Becomes:** walking sheet `characters/torvald.png` (24 x 32 cells), portrait `portraits/torvald.png`, `portraits/torvald_exact.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Torvald. The attached image shows the art style to match (it is a different character). He is the chieftain of the Ironvow, about 55, a big, tired man of a cold northern country: broad, heavy-shouldered, weathered, with grey-blond hair and a grey-blond beard. Fair, weather-reddened skin, tired pale-blue eyes. Outfit: a bear-fur mantle over a long brown wool tunic, dark trousers and boots, a plain leather belt, and the Ironvow standard's slate-coloured disc as a brooch at his shoulder. No crown. Show his full body three times on one sheet: front view, side view and back view, standing heavily, arms at his sides, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (bear-fur brown, slate blue, grey-blond, weathered fair skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No crown, no horned helmet. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Torvald, about 55, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Grey-blond hair and beard, weather-reddened fair skin, tired pale-blue eyes, the bear-fur mantle, the slate-coloured disc brooch. No crown. Expression: tired, heavy-lidded, a big man who has carried too much for too long. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `torvald_exact`:
```
Same portrait, same framing, expression: **exact**, the tiredness gone, eyes sharp and precise, a chieftain stating exactly what he will and will not do.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Torvald, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw he about 15% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Fair weather-reddened skin, grey-blond hair and beard, a bear-fur mantle over brown wool, dark trousers and boots, a slate-coloured disc brooch at the shoulder, no crown. Bright, saturated, warm colours with clearly lit skin; pale-blue eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Hrafn

The raiding jarl, about 45 (Chapter 6; again in Chapter 10). The "bought" expression is from Chapter 10; ask for it in this same chat after the first expression.

**Becomes:** walking sheet `characters/hrafn.png` (24 x 32 cells), portrait `portraits/hrafn.png`, `portraits/hrafn_bought.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Hrafn. The attached image shows the art style to match (it is a different character). He is a raiding jarl of about 45 from a cold northern coast: lean and hard, blunt. Weathered tan skin, black hair and beard cut short, narrow dark eyes. Outfit: a black cloak with a raven stitched on it, a dark tunic and trousers, boots, a leather belt, and an axe hanging at his belt. Show his full body three times on one sheet: front view, side view and back view, standing with his thumbs in his belt beside the axe, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (black, grey, dark leather, weathered tan skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No horned helmet. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Hrafn, about 45, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Weathered tan skin, black hair and a black beard cut short, narrow dark eyes, the black cloak with the stitched raven. Expression: blunt, a flat, direct stare, a man who says exactly what he thinks. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `hrafn_bought`:
```
Same portrait, same framing, expression: **bought**, the stare turned a little away, jaw set, eyes shadowed, a man who has taken money and will not look at you (the night on the quay, Chapter 10).
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Hrafn, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly taller than her and lean. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Weathered tan skin, short black hair and beard, a black cloak with a raven stitched on it, dark tunic and trousers, boots, an axe at the belt visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Noyan Grimvald

The Chapter 6 boss, a raider chief the Crown paid, about 50. Boss. His battle sprite (mounted, then on foot) is not in this list; he fights with this walking sheet until you want one painted.

**Becomes:** walking sheet `characters/grimvald.png` (24 x 32 cells), portrait `portraits/grimvald.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Noyan Grimvald. The attached image shows the art style to match (it is a different character). He is a raider chief of about 50, a man the Crown paid: huge, heavy and unhurried, with a wide, confident face. Weathered tan skin, long dark-brown hair and a thick dark-brown beard. Outfit: a wolf-fur coat with gold coins (the Throne's coins) sewn into the hem, a red sash, dark boots, a rounded grey-brown hood or cap, and the Ironvow standard (nine horse-tails hanging under a slate-coloured disc on a pole) strapped across his back. Show his full body three times on one sheet: front view, side view and back view, standing with his arms folded and the standard visible over his shoulder, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (wolf-fur grey, gold, red, slate blue, weathered tan skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Noyan Grimvald, about 50, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Weathered tan skin, long dark-brown hair and a thick dark-brown beard, the wolf-fur collar, the gold coins sewn on it. Expression: paid, a wide, easy, shameless smile, a man who is entirely open about who bought him. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Noyan Grimvald, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw he about 15% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Weathered tan skin, long dark-brown hair and thick beard, a grey-brown hood, a wolf-fur coat with gold coins along the hem, a red sash, dark boots, a pole with horse-tails and a slate disc strapped across the back, visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Sarnai Ironvow

Bayarmaa's grandmother fifty years ago, in the Chapter 6 Echo. An Echo (fifty years ago). Draw her in normal colours; the game adds the sepia look itself. Also attach Bayarmaa's reference sheet (made earlier in group 2) to the first message so the family face matches. The grey horse beside her is not drawn here.

**Becomes:** walking sheet `characters/echo_sarnai.png` (24 x 32 cells), portrait `portraits/echo_sarnai.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) and, if you have it, Bayarmaa's reference sheet from group 2)
```
Character design reference sheet for a fantasy adventure game character named Sarnai Ironvow. The attached image shows the art style to match (it is a different character). She is Bayarmaa's grandmother as she was fifty years ago, about 35, a steppe rider: the same lean, sharp-shouldered build and the same face as Bayarmaa, only older and more certain. Warm tan skin, dark eyes, black hair in a long braid with a few grey strands. Outfit: a grey felt riding coat to the knee with a slate-blue collar, a grey hood, a wide sash, riding boots, and a bone whistle on a cord around her neck. Show her full body three times on one sheet: front view, side view and back view, standing straight, one hand resting on the bone whistle, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey felt, slate blue, bone white, warm tan skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Sarnai Ironvow, about 35, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm tan skin, dark eyes, a long black braid with a few grey strands, the grey hood, the bone whistle on its cord, the grey felt coat with its slate-blue collar. Expression: certain, calm and unshakeable, a woman who already knows what she is going to do. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Sarnai Ironvow, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm tan skin, a long black braid with a little grey, a grey hood, a grey felt riding coat with a slate-blue collar, a wide sash, riding boots, a bone whistle on a cord at the chest. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---


## Group 7, Chapter 7 (Kirinoura)

### Lady Kaede Suzumori

The spymaster, Haru's mother, about 50 (Chapter 7). Violet in the outfit, so the green background is used for the portrait and sprites. Suzumori violet is #7d3c98.

**Becomes:** walking sheet `characters/kaede.png` (24 x 32 cells), portrait `portraits/kaede.png`, `portraits/kaede_final.png`, `portraits/kaede_warm.png`. Background: bright green.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Lady Kaede Suzumori. The attached image shows the art style to match (it is a different character). She is a spymaster of about 50 from an East Asian-inspired harbor city of paper lanterns, Haru's mother: straight-backed, calm, exact, with silver at her temples. Warm light skin, black hair pinned up with silver at the temples, dark, watchful eyes. Outfit: a grey kimono with a violet underlayer showing at the collar and cuffs, a dark sash, and a writing brush held in one hand. Show her full body three times on one sheet: front view, side view and back view, standing very straight, the writing brush held in one hand, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey, violet, silver, warm light skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Lady Kaede Suzumori, about 50, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm light skin, black hair pinned up and silver at the temples, dark watchful eyes, the grey kimono collar with its violet underlayer. Expression: dry, a level look and a faint, unamused half-smile, a woman who is always three moves ahead. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright green (#00FF00) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `kaede_final`:
```
Same portrait, same framing, expression: **final**, the half-smile gone, eyes hard and level, a mother and spymaster whose decision is made.
```

For `kaede_warm`:
```
Same portrait, same framing, expression: **warm**, the eyes soft and the mouth gentle, just once, a mother's tenderness she rarely lets show.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Lady Kaede Suzumori, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm light skin, black hair pinned up with silver at the temples, a long grey kimono with a violet underlayer at the collar and cuffs, a dark sash, a writing brush in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright green (#00FF00) background. No text, no numbers, no grid lines, no labels.
```

---

### The Paper Fox

The broker and the Chapter 7 boss, about 40. Boss. His battle sprite (masked, among three paler paper copies of himself) is not in this list; he fights with this walking sheet until you want one painted.

**Becomes:** walking sheet `characters/paper_fox.png` (24 x 32 cells), portrait `portraits/paper_fox.png`, `portraits/paper_fox_yielding.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the Paper Fox. The attached image shows the art style to match (it is a different character). He is a broker of secrets of about 40 from an East Asian-inspired harbor city of paper lanterns, a man who could be anyone: an ordinary, pleasant, forgettable face, a little proud of his trade. Warm light skin, short black hair, calm dark eyes. Outfit: a plain grey kimono with a dark sash, a white paper fox mask hanging at his belt, a short paper knife, and a few folded paper sheets tucked into his sleeve. Show his full body three times on one sheet: front view, side view and back view, standing relaxed, the white fox mask at his belt, the folded sheets in his sleeve, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (plain grey, white, black, warm light skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the Paper Fox, about 40, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm light skin, short black hair, an ordinary pleasant forgettable face, the plain grey kimono collar, the white paper fox mask hanging at his shoulder on its cord. Expression: courteous, a polite, pleasant smile, a little proud of his trade. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `paper_fox_yielding`:
```
Same portrait, same framing, expression: **yielding**, the pleasantness easing, eyes lowered, a small gracious nod, a man giving way.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the Paper Fox, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm light skin, short black hair, a plain grey kimono with a dark sash, a white paper fox mask hanging at the belt, a folded paper sheet in the sleeve. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Lady Sayo Suzumori

Haru's grandmother fifty years ago, in the Chapter 7 Echo. An Echo (fifty years ago). Draw her in normal colours; the game adds the sepia look. Violet trim, so the green background is used for the portrait and sprites.

**Becomes:** walking sheet `characters/echo_sayo.png` (24 x 32 cells), portrait `portraits/echo_sayo.png`. Background: bright green.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Lady Sayo Suzumori. The attached image shows the art style to match (it is a different character). She is Haru's grandmother as she was fifty years ago, about 40, a tired, practical woman from an East Asian-inspired harbor city of paper lanterns who keeps the lantern codes. Warm light skin, black hair pinned up with a writing brush behind her ear, tired dark eyes. Outfit: a plain grey kimono with a thin violet trim, a dark sash, and a lantern code card held in one hand. Show her full body three times on one sheet: front view, side view and back view, standing, the code card held in one hand, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey, thin violet trim, warm light skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Lady Sayo Suzumori, about 40, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm light skin, black hair pinned up, a writing brush behind her ear, tired dark eyes, the plain grey kimono with its thin violet trim. Expression: practical, tired but alert, a woman getting on with the work that has to be done. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright green (#00FF00) background filling the whole square. No text, no frame, no border, no other people.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Lady Sayo Suzumori, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm light skin, black hair pinned up with a brush behind the ear, a plain grey kimono with thin violet trim, a dark sash, a small code card in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright green (#00FF00) background. No text, no numbers, no grid lines, no labels.
```

---

### Kayla (real family: use the photo prompts)

Rahel's daughter, about 25, the cipher clerk. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Kayla". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/kayla.png` (24 x 32 cells), `portraits/kayla.png`, `portraits/kayla_listening.png`.


## Group 7, Chapter 8 (Agnipur)

### Meera

The high priestess of the flame, Vikram's mother, about 50 (Chapter 8). Cultural care: Agnipur is South Asian-inspired; dress her with respect, no costume clichés.

**Becomes:** walking sheet `characters/meera.png` (24 x 32 cells), portrait `portraits/meera.png`, `portraits/meera_tired.png`, `portraits/meera_giving.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Meera. The attached image shows the art style to match (it is a different character). She is the high priestess of the flame in a South Asian-inspired city of white domes and lamps, Vikram's mother, about 50: straight-backed, formal and unbending. Warm brown skin, grey hair in a tight bun, strong dark eyes. Outfit: a long cream robe with a saffron border, a saffron sash, and a brass staff. Show her full body three times on one sheet: front view, side view and back view, standing very straight, the brass staff upright in one hand, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (cream, saffron, brass, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Meera, about 50, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm brown skin, grey hair in a tight bun, strong dark eyes, the cream robe with its saffron border. Expression: unbending, a level, formal stare, a high priestess who does not change her mind. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `meera_tired`:
```
Same portrait, same framing, expression: **tired**, the stare worn down, shadows under the eyes, lit by a low flame from below, a woman who has kept a vigil too long.
```

For `meera_giving`:
```
Same portrait, same framing, expression: **giving**, the face softened, eyes warm, a small gentle smile, a mother letting something precious go.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Meera, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm brown skin, grey hair in a bun, a long cream robe with a saffron border, a saffron sash, a brass staff held in one hand and visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Seth Dhanraj

The oil hoarder and the Chapter 8 boss, about 55. Boss. His battle sprite (among oil jars, a ring of spilled oil at his feet) is not in this list; he fights with this walking sheet until you want one painted. Dress him with respect; his menace is in his prices, not his looks.

**Becomes:** walking sheet `characters/seth_dhanraj.png` (24 x 32 cells), portrait `portraits/seth_dhanraj.png`, `portraits/seth_dhanraj_withdrawing.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Seth Dhanraj. The attached image shows the art style to match (it is a different character). He is a rich oil merchant of about 55 from a South Asian-inspired city of white domes and lamps, heavy and comfortable, a man who always sounds reasonable. Warm brown skin, dark eyes, a black beard trimmed close. Outfit: a cream turban and a long cream robe with brass buttons, rings on several fingers, and a tall staff with a ledger-book tied to it. Show his full body three times on one sheet: front view, side view and back view, standing comfortably, both hands on the ledger staff, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (cream, brass, black, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No caricature of a merchant. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Seth Dhanraj, about 55, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm brown skin, a black beard trimmed close, dark eyes, the cream turban, the cream robe with brass buttons, rings on his fingers. Expression: reasonable, a calm, pleasant, patient look, a man explaining a price he considers fair. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `seth_dhanraj_withdrawing`:
```
Same portrait, same framing, expression: **withdrawing**, the pleasantness cooling, eyes narrowed and sliding away, a man calculating how to leave.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Seth Dhanraj, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about the same height and clearly broader. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm brown skin, a close black beard, a cream turban, a long cream robe with brass buttons, rings, a tall staff with a ledger tied to it, held in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Arjun of the Agnivansh

Vikram's grandfather fifty years ago, in the Chapter 8 Echo. An Echo (fifty years ago). Draw him in normal colours; the game adds the sepia look. His age is Claude's call (the docs give none).

**Becomes:** walking sheet `characters/echo_arjun.png` (24 x 32 cells), portrait `portraits/echo_arjun.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Arjun of the Agnivansh. The attached image shows the art style to match (it is a different character). He is Vikram's grandfather as he was fifty years ago, about 45, a South Asian-inspired cavalry commander: tall, bearded and certain. Warm brown skin, long black hair tied back, a full black beard, bright dark eyes. Outfit: a brown riding coat with brass buttons and trim, dark trousers and boots, a saffron sash, and a long lance held upright. Show his full body three times on one sheet: front view, side view and back view, standing tall, the lance held upright in one hand, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (brown, brass, saffron, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Arjun of the Agnivansh, about 45, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm brown skin, long black hair, a full black beard, bright dark eyes, the brown riding coat with brass trim. Expression: certain, a bold, steady stare, a commander who believes "Hesitation is the only true death". Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Arjun of the Agnivansh, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 15% taller. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm brown skin, long black hair, a full black beard, a brown riding coat with brass trim, a saffron sash, dark boots, a long lance held upright in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Aiyana (real family: use the photo prompts)

Rahel's daughter, about 30, the engineer of the great flame. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Aiyana". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/aiyana.png` (24 x 32 cells), `portraits/aiyana.png`, `portraits/aiyana_dry.png`.


## Group 7, Chapter 9 (Kingsmere)

### The Almoner

The Regent's almoner, one of the Hushed (the veiled woman by the mill in Chapter 1, met again in Chapter 9), about 60. Attach the Quiet Crown woman's sheet too (`docs/quest/art-source/quiet-crown-f-reference.webp`), so her veiled look matches the road watcher of Chapter 1 on purpose.

**Becomes:** walking sheet `characters/almoner.png` (24 x 32 cells), portrait `portraits/almoner.png`, `portraits/almoner_unveiled.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) and the Quiet Crown woman's reference sheet (`docs/quest/art-source/quiet-crown-f-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the Almoner. The attached image shows the art style to match (it is a different character). She is the Lord Regent's almoner, one of the Hushed, about 60, a quiet woman who gives out charity with a veil over her face. She wears a plain grey hood, a sheer grey veil over her nose and mouth (her eyes stay visible), a long grey robe, and the Crown's charities' brooch, a small silver sun, at her chest. A basket hangs on her arm. In the small close-up, show her face unveiled: a plain woman of sixty, grey hair pinned up, an expression with almost nothing in it. Pale, plain skin. Standing still, the basket on her arm. Show her full body three times on one sheet: front view, side view and back view, standing still, the basket on her arm, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey, silver, pale skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the Almoner, about 60, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. A plain grey hood, a sheer grey veil over her nose and mouth, her eyes visible, the long grey robe collar, the small silver brooch. Expression: veiled and still, calm eyes above the veil, a face that gives nothing away. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `almoner_unveiled`:
```
Same portrait, same framing, expression: **unveiled**, the veil gone: a plain woman of sixty with her grey hair pinned up, no expression to speak of, as if saying "It is no one's".
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the Almoner, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. A grey hood, a sheer grey veil over the nose and mouth, a long grey robe, a small silver brooch on the chest, a basket on one arm visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

**3b. Unveiled walking sprites** (the SAME chat, after the walking sheet; nothing to attach). Becomes `characters/almoner_unveiled.png`.
```
Same sprite sheet, same layout, same size, same colours, but now unveiled, for the second look of the Almoner: the veil removed, a plain woman of sixty with her grey hair pinned up and no expression to speak of; keep the grey hood down around her shoulders, the long grey robe, the small silver brooch and the basket on her arm. Same grid of 4 rows and 3 columns, same cell size, 1-pixel dark outline, flat colours, at most 16 colours, solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Lady Rosalind Stillwater

On the Regent's council, Edmund's mother, about 55 (Chapter 9). Grey-violet outfit, so the green background is used for the portrait and sprites.

**Becomes:** walking sheet `characters/rosalind.png` (24 x 32 cells), portrait `portraits/rosalind.png`, `portraits/rosalind_standing.png`. Background: bright green.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Lady Rosalind Stillwater. The attached image shows the art style to match (it is a different character). She is a lady of the Regent's council and the ruler of a grey, rainy country, Edmund's mother, about 55: composed, upright and unhurried. Fair skin, grey hair in a bun, calm grey eyes. Outfit: a long robe of grey-violet with a small silver emblem on the chest, a high collar, and a plain silver ring. Show her full body three times on one sheet: front view, side view and back view, standing upright, hands folded in front of her, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (grey-violet, silver, fair skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Lady Rosalind Stillwater, about 55, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Fair skin, grey hair in a bun, calm grey eyes, the high collar of the grey-violet robe, the small silver emblem. Expression: seated, composed and attentive, a woman who has been listening for a long time and will speak when she chooses. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright green (#00FF00) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `rosalind_standing`:
```
Same portrait, same framing, expression: **standing**, chin raised and eyes level, a ruler on her feet, firm and unmoved, as if saying "Sat.".
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Lady Rosalind Stillwater, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Fair skin, grey hair in a bun, a long grey-violet robe with a high collar, a small silver emblem on the chest. Bright, saturated, warm colours with clearly lit skin; grey eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright green (#00FF00) background. No text, no numbers, no grid lines, no labels.
```

---

### Jordyn (real family: use the photo prompts)

Rahel's daughter, about 38, captain of the Regent's watch (it also has an optional Chapter 10 'Freed' outfit). The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Jordyn". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/jordyn.png` (24 x 32 cells), `portraits/jordyn.png`, `portraits/jordyn_mothers_jaw.png`, `portraits/jordyn_resigning.png`.

### Sebastian (real family: use the photo prompts)

Elodie's brother, about 60, the organist. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Sebastian". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/sebastian.png` (28 x 36 cells), `portraits/sebastian.png`, `portraits/sebastian_listening.png`, `portraits/sebastian_tender.png`.


## Group 7, Chapter 10 (Pòdlimyè)

### The Dorini admiral

The Dorini marines' commander, about 50 (Chapter 10). Cultural care: Al-Doria is Mediterranean and Middle-Eastern-inspired; dress him with respect, no cruel-merchant clichés.

**Becomes:** walking sheet `characters/dorini_admiral.png` (24 x 32 cells), portrait `portraits/dorini_admiral.png`, `portraits/dorini_admiral_bought.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the Dorini admiral. The attached image shows the art style to match (it is a different character). He is the commander of the Dorini marines, a sea captain of about 50 from a Mediterranean and Middle-Eastern-inspired trading city. Bronze skin, a black beard, black hair in a long braid, steady dark eyes. Outfit: a Dorini-green coat with gold trim and gold buttons, a black bicorne hat, dark trousers and boots, and a leather ledger satchel across his body. Show his full body three times on one sheet: front view, side view and back view, standing squarely with one hand on the satchel strap, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (Dorini green, gold, black, bronze skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the Dorini admiral, about 50, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Bronze skin, a black beard, a black braid over one shoulder, the black bicorne hat, the Dorini-green coat with gold trim. Expression: reckoning, a steady, calculating look, a captain adding up a cost. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `dorini_admiral_bought`:
```
Same portrait, same framing, expression: **bought**, eyes turned away, face closed, a man who has taken a payment and is not looking at you (on the quay at night).
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the Dorini admiral, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly taller than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Bronze skin, a black beard and a long black braid, a black bicorne hat, a Dorini-green coat with gold trim, dark trousers and boots, a leather satchel across the body. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### The Agnivansh steward

The Agnivansh steward, about 55 (Chapter 10). Cultural care: dress him with respect, no costume clichés.

**Becomes:** walking sheet `characters/agnivansh_steward.png` (24 x 32 cells), portrait `portraits/agnivansh_steward.png`, `portraits/agnivansh_steward_bought.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the Agnivansh steward. The attached image shows the art style to match (it is a different character). He is the steward of the great house of the Agnivansh, about 55, a South Asian-inspired household officer: dignified, careful and exact. Warm brown skin, short grey hair, a neat grey beard, calm dark eyes. Outfit: a long saffron robe with brass trim, the house emblem (a small brass flame) on the chest, a leather satchel across his body, and a small brass lamp held in one hand. Show his full body three times on one sheet: front view, side view and back view, standing upright, the brass lamp held in one hand, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (saffron, brass, grey, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Dressed with respect and accuracy, no costume clichés, no caricature. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the Agnivansh steward, about 55, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm brown skin, short grey hair and a neat grey beard, calm dark eyes, the saffron robe with brass trim, the small brass flame emblem. Expression: dignified, a straight back and a calm, composed look, a household officer at an inspection. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `agnivansh_steward_bought`:
```
Same portrait, same framing, expression: **bought**, eyes lowered and a little ashamed, a dignified man who has accepted a payment and cannot meet your look.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the Agnivansh steward, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm brown skin, short grey hair and a grey beard, a long saffron robe with brass trim and a small flame emblem, a leather satchel across the body, a small brass lamp in one hand, visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Ti Jak

A sixteen-year-old cane cutter (Chapter 10). Skin tone and age details are Claude's call where the docs give none; change them if you see him differently.

**Becomes:** walking sheet `characters/ti_jak.png` (24 x 32 cells), portrait `portraits/ti_jak.png`, `portraits/ti_jak_odile.png`, `portraits/ti_jak_going.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Ti Jak. The attached image shows the art style to match (it is a different character). He is a sixteen-year-old sugar cane cutter from a Caribbean island, slight and wiry, quiet and worn beyond his years. Warm medium-brown skin, cropped black hair, tired dark eyes. Outfit: a sun-faded cream work shirt with rolled sleeves, an orange sash tied at the waist, plain dark trousers, bare feet or worn sandals, and a long cane-cutter's blade (a cane knife). Show his full body three times on one sheet: front view, side view and back view, standing with the cane knife hanging low in one hand, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (faded cream, orange, dark brown, warm medium-brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Ti Jak, 16, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm medium-brown skin, cropped black hair, tired dark eyes, the sun-faded work shirt collar, the orange sash. Expression: alone, a lonely, stunned stillness, a boy sitting by a cold hearth with nobody to talk to. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `ti_jak_odile`:
```
Same portrait, same framing, expression: **...Odile**, eyes wide and wet, lips parted, a boy who has just heard his lost sister's name.
```

For `ti_jak_going`:
```
Same portrait, same framing, expression: **going**, a hard, resolved look, chin raised, the cane knife on his shoulder, a boy who has decided to go.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Ti Jak, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him clearly shorter and slighter than her, a boy. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm medium-brown skin, cropped black hair, a sun-faded cream work shirt, an orange sash, dark trousers, bare feet, a cane knife held in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### The powder-master

The powder-master in the Chapter 10 Echo, fifty years ago. An Echo (fifty years ago). Draw him in normal colours; the game adds the sepia look. His portrait expression is Claude's call (the docs give none).

**Becomes:** walking sheet `characters/powder_master.png` (24 x 32 cells), portrait `portraits/powder_master.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the powder-master. The attached image shows the art style to match (it is a different character). He is the powder-master of a smugglers' landing as he was fifty years ago, about 60: bald, grey-bearded, solid and careful. Weathered tan skin, a short grey beard, steady eyes. Outfit: a heavy leather apron with red trim over a brown shirt, brown trousers, boots, and leather gloves tucked in his belt. Show his full body three times on one sheet: front view, side view and back view, standing, hands on the apron, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (brown, red trim, leather, grey, weathered tan skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the powder-master, about 60, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. A bald head, a short grey beard, weathered tan skin, steady eyes, the leather apron with red trim over a brown shirt. Expression: practical and stern, a careful man who keeps the dangerous thing locked. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the powder-master, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Weathered tan skin, a bald head, a short grey beard, a heavy leather apron with red trim over a brown shirt, brown trousers, boots. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### The crew chief

A smuggler crew chief, 40s (Chapter 10).

**Becomes:** walking sheet `characters/crew_chief.png` (24 x 32 cells), portrait `portraits/crew_chief.png`, `portraits/crew_chief_sitting_on_the_sand.png`. Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the crew chief. The attached image shows the art style to match (it is a different character). He is a smuggler crew chief of about 45 on a Caribbean coast: broad, tough and no-nonsense. Dark brown skin, a bald head under a red cap, a short black beard, hard dark eyes. Outfit: a red cap, a dark coat with red trim, dark trousers and boots, and a leather satchel across his body. Show his full body three times on one sheet: front view, side view and back view, standing with his arms folded, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (dark charcoal, red, black, dark brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the crew chief, about 45, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Dark brown skin, a red cap on a bald head, a short black beard, hard dark eyes, the dark coat with red trim. Expression: say it, a hard stare and a set jaw, a man saying "You saw cane. Say it.". Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta (#FF00FF) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `crew_chief_sitting_on_the_sand`:
```
Same portrait, same framing, expression: **sitting on the sand**, beaten and tired, the cap held in his hands, eyes lowered, a man who has run out of options (after the fight).
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the crew chief, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly taller and broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Dark brown skin, a red cap on a bald head, a short black beard, a dark coat with red trim, dark trousers and boots, a leather satchel across the body. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### Rahel (real family: use the photo prompts)

Rael's mother, an old woman of about 72. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Rahel". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/rahel.png` (24 x 32 cells), `portraits/rahel.png`, `portraits/rahel_warm.png`, `portraits/rahel_closed.png`.

### Patricia (real family: use the photo prompts)

Rahel's mother, about 92, the eldest of the family. The three prompts are already complete in `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`, section "Patricia". Attach Gianna's reference sheet **and a clear, well-lit, front-facing photo** of the person to the first message of a new chat (the sprite prompt also takes Gianna's sprite sheet). Becomes: `characters/patricia.png` (24 x 32 cells), `portraits/patricia.png`, `portraits/patricia_blessing.png`, `portraits/patricia_listening.png`.


## Group 7, Chapter 11 (Yucayeque)

### Captain-General Hale

The Crown's commander and the Regent's Champion, about 50 (Chapter 11). Violet coat, so the green background is used for the portrait and sprites. Skin tone is taken from the battle-sprite table in ART-DROP-2.md (the character section gives none); the axe is section 20's (the battle sprite in group 5 holds a sabre and a baton, as ART-DROP-2.md says: both are written as given).

**Becomes:** walking sheet `characters/hale.png` (24 x 32 cells), portrait `portraits/hale.png`, `portraits/hale_you_just_you.png`, `portraits/hale_going.png`. Background: bright green.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named Captain-General Hale. The attached image shows the art style to match (it is a different character). He is the Crown's commander, the Regent's Champion, about 50: a big, patient soldier. Deep brown skin, cropped grey hair and a short grey beard, calm, heavy-lidded eyes. Outfit: a violet general's coat with gold trim and gold epaulettes, black trousers and boots, a black bicorne hat, and a boarding axe held in one hand. Show his full body three times on one sheet: front view, side view and back view, standing at ease, the boarding axe held in one hand at his side, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (violet, gold, black, deep brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: Captain-General Hale, about 50, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Deep brown skin, cropped grey hair and a short grey beard, the black bicorne hat, the violet coat with gold trim and epaulettes. Expression: compliments, a calm, courteous, immovable expression, a soldier delivering "The Lord Regent's compliments.". Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright green (#00FF00) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `hale_you_just_you`:
```
Same portrait, same framing, expression: **"You. Just you."**, eyes locked straight ahead, a dangerous calm, a champion naming his chosen opponent in a duel.
```

For `hale_going`:
```
Same portrait, same framing, expression: **going**, the courtesy gone, jaw set, turning away, a soldier leaving angry and promising "The Regent will hear of this.".
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, Captain-General Hale, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw he about 15% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Deep brown skin, cropped grey hair and a short grey beard, a black bicorne hat, a violet general's coat with gold trim and epaulettes, black trousers and boots, a boarding axe in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright green (#00FF00) background. No text, no numbers, no grid lines, no labels.
```

---

### An old Crown marine

A Crown marine of fifty years ago, in the Chapter 11 Echo. An Echo (fifty years ago). Draw in normal colours; the game adds the sepia. No portrait is needed: only the reference sheet and the walking sprites.

**Becomes:** walking sheet `characters/old_crown_marine.png` (24 x 32 cells). Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named an old Crown marine. The attached image shows the art style to match (it is a different character). He is a Crown marine of an empire's army fifty years ago, about 30, a plain soldier from a memory, not a known face. Weathered tan skin, short dark hair, an ordinary hard-working face. Outfit: a brick-red coat with white cross-belts crossing the chest, a white sash, white breeches, dark boots, and a brown leather helmet. He holds a cutlass at his side. Show his full body three times on one sheet: front view, side view and back view, standing at attention, the cutlass at his side, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (brick red, white, brown leather, tan skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Draw no named or recognisable person. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, an old Crown marine, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Weathered tan skin, short dark hair, a brown leather helmet, a brick-red coat with white cross-belts, a white sash, white breeches, dark boots, a cutlass at the side. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---

### An old Crown musketeer

A Crown musketeer of fifty years ago, in the Chapter 11 Echo. An Echo (fifty years ago). Draw in normal colours; the game adds the sepia. No portrait is needed: only the reference sheet and the walking sprites.

**Becomes:** walking sheet `characters/old_crown_musketeer.png` (24 x 32 cells). Background: magenta.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named an old Crown musketeer. The attached image shows the art style to match (it is a different character). He is a Crown musketeer of an empire's army fifty years ago, about 30, a plain soldier from a memory, not a known face. Deep umber-brown skin, short dark hair, an ordinary hard-working face. Outfit: a brick-red coat with white cross-belts crossing the chest, a white sash, white breeches, dark boots, and a brown leather brimmed hat. He holds a long flintlock musket, butt on the ground. Show his full body three times on one sheet: front view, side view and back view, standing at attention, the musket upright beside him, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours (brick red, white, brown leather, umber-brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. Draw no named or recognisable person. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, an old Crown musketeer, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Deep umber-brown skin, short dark hair, a brown leather brimmed hat, a brick-red coat with white cross-belts, a white sash, white breeches, dark boots, a long flintlock musket held upright in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta (#FF00FF) background. No text, no numbers, no grid lines, no labels.
```

---


## Group 7, Chapter 12 (the Throne's Concourse)

### The herald

The Lord Regent's herald at the Throne's Concourse, about 30 (Chapter 12). Violet and gold, so he gets a green background. His age is Claude's call.

**Becomes:** walking sheet `characters/herald.png` (24 x 32 cells), portrait `portraits/herald.png`, `portraits/herald_impassive.png`. Background: bright green.

**1. Reference sheet** (a NEW chat; attach Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`))
```
Character design reference sheet for a fantasy adventure game character named the herald. The attached image shows the art style to match (it is a different character (a young woman)).
He is a young court herald of about 30, slim and upright, dry, exact and entirely correct. Warm medium-brown skin, short neat black hair, a clean-shaven, composed face, dark eyes that look slightly past whoever he addresses. Outfit: a long, close-fitting violet coat (Aldermoor violet) with gold trim at the collar, cuffs and hem, a gold-yellow sash across the chest, black breeches and tall black boots, and a violet cap with a gold band. In one hand a tall white staff of office with a small gold sun on top, held upright beside him. Standing very straight, chin level. Show his full body three times on one sheet: front view, side view and back view, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the attached image, crisp clean outlines, bright warm saturated colours, well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (the SAME chat; nothing to attach)
```
Same character as the reference sheet: the herald, about 30, with the same face as on the reference sheet. Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Warm medium-brown skin, short neat black hair, the violet cap with the gold band, the violet coat with gold trim, the gold-yellow sash, the top of the white staff with its gold sun beside his shoulder. Expression: formal and composed, the polite blank face of a man announcing someone else's name. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright green (#00FF00) background filling the whole square. No text, no frame, no border, no other people.
```

**2b. Extra expressions** (the SAME chat, one at a time, after the portrait; nothing to attach)

For `herald_impassive`:
```
Same portrait, same framing, expression: **impassive**, completely blank, eyes fixed straight ahead, not a flicker of interest.
```

**3. Walking sprite sheet** (the SAME chat; attach Gianna's sprite sheet (`docs/quest/art-source/gianna-sprites.webp`))
```
Pixel art sprite sheet of the same character, the herald, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), the same height as Gianna. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm medium-brown skin, short black hair, a violet cap with a gold band, a long violet coat with gold trim, a gold-yellow sash, black breeches and boots, a tall white staff with a small gold sun on top held in one hand and visible in every frame. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright green (#00FF00) background. No text, no numbers, no grid lines, no labels.
```

---


---

## Can ship as stand-ins (no prompts needed)

The game already draws these from its own stand-in figures. They are minor or are not people, so they can ship as they are; ask me if you ever want one painted.

- **Ordvik (Chapter 6):** the lawspeaker, the trading jarl, the Crown's envoy, the envoy in white, the champion in white, the herder, the steppe reavers in a crowd, the steppe wolves in a crowd.
- **Kirinoura (Chapter 7):** the two retainers (including the "bought" look of the retainer), the signal master, the keeper of files, the Crown's observer, the fishers' family, the Suzumori elder, the balance-keeper, the whisperer, the Fog Cutpurses and Hushers in a crowd, the Lantern Moths in a crowd, Sayo's clerk and agents.
- **Agnipur (Chapter 8):** the senior Keeper, the junior priest, the chamberlain, the Crown's oil factor, the chief runner and the runners, the carter, the shrine child, the Flame Keeper, the pilgrim, Arjun's riders and runners, the Oil Enforcers and the Ember Jackals in a crowd.
- **Kingsmere (Chapter 9):** the keep's steward, the assize clerk, the Crown magistrate, the witness bishop, the sorry constable, the printer, the clockmaker, the pie seller and her boy, the tea-shop woman, the Quiet Crown hierarch, the Gaze exile, the almswomen, the Moor Constables, the bog hounds, the Crown officers and Sealbearers in a crowd, the old Sealbearer in the Echo.
- **Pòdlimyè (Chapter 10):** the Dorini marines, the Zetwal levy, the Suzumori retainer and the Zetwal crew in a crowd.
- **Yucayeque (Chapter 11):** the wounded soldiers in hamacas (the stand-in works lying down; no blood is shown).
- **Places and objects (backgrounds and tiles, no people):** every "Places" list in sections 15 to 20 of `ART-PROMPTS.md` (the Lantern Quarter, the file house, the fog maze, Agnipur's harbor and bazaar, the Mere Stair, the heath, the Assize, the seven allied ships, the field gun, the chain post, and so on). The game draws them itself.
- **Bosses' own battle sprites** (Grimvald mounted then on foot, the Paper Fox with his three decoys, Seth Dhanraj among his oil jars, the Almoner with the kneeling almswomen, the Dorini and Hale's boarders): they fight with their walking sheets for now.
- **Extra expressions for characters already done** (for example Rael's `lamplight`, Elodie's `guarded`, old Patricio's `sad` and `stern`, old Benny's `wry`): not in this file. Ask me and I will write the one-line follow-ups for the same chats.

