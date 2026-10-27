# Echoes of Zetwal: art prompts for the real family (Gemini, with a photo)

Ready-to-paste Gemini prompts for the characters based on real members of the family. Each one tells Gemini to base
the **face** on an attached photo of the real person. Same three prompts as `ART-PROMPTS.md` section 2 (Elodie Limyè),
with the likeness line **built in** instead of optional.

## How to use

1. **One new Gemini chat per person.** Do the three prompts in order, all in that chat, so the face stays the same.
2. **First message:** attach **Gianna's reference sheet** (`docs/quest/art-source/gianna-reference.webp`) for the style,
   and **one clear, well-lit, front-facing photo** of the real person. Attach the photo to the **first message only**;
   the later prompts say "the same face as on the reference sheet".
3. **Third prompt (sprites):** also attach **Gianna's sprite sheet** (`docs/quest/art-source/gianna-sprites.webp`).
4. Where the prompt gives a skin tone or hair in the description, **the photo wins** for face, skin and hair. The outfit
   and objects always come from the description.
5. Ask for the extra expressions **one at a time**, in the same chat, after the portrait.
6. If Gemini refuses because of the photo, or copies the photo's clothing or background, retry the first prompt with this
   added at the start: **"Use the photo only as a face reference."** If it still refuses, try a different photo (a plain
   background, no sunglasses or hats, the face large in the frame).
7. If Gemini adds text, frames or a second person, ask it to remove them. Keep skin bright and warm, not dull.

**Background colour:** magenta (`#FF00FF`) for portraits and sprites, as in section 2. Where the outfit has purple, violet or
pink in it (Coralie, Patricia, Jordyn), the prompts use bright **green** (`#00FF00`) instead, because magenta eats those
colours (`ART-PROMPTS.md` section 11). The converter handles both.

**Already drawn:** Gianna, Anissa, Azzy, Elodie Limyè, Patricio (young and old) and Anicette. They can be redone with a
real photo too: use their sections in `ART-PROMPTS.md` and **keep the OPTIONAL photo line**, attaching the photo.

**Tall men** (Rael, Sebastian, Rivera) are drawn "about 15% taller" and become **28 x 36** cells. Everyone else becomes
24 x 32.

**Photo ages:** every prompt says what age to show, so an older or younger photo of the person is fine. Young Benny is
asked for as a man of 20 to 25.

## Contents

1. [Rael, Lord of Ardencia](#rael-lord-of-ardencia)
2. [Old Benny](#old-benny)
3. [Young Benny (the Echo)](#young-benny-the-echo)
4. [Nancy](#nancy)
5. [Zelia](#zelia)
6. [Amanda](#amanda)
7. [Joaquin](#joaquin)
8. [Rahel](#rahel)
9. [Patricia](#patricia)
10. [Jordyn](#jordyn)
11. [Kayla](#kayla)
12. [Aiyana](#aiyana)
13. [Coralie, "Tati Coco"](#coralie-tati-coco)
14. [Sebastian](#sebastian)
15. [If they are real people too: Captain Azriel Rivera and Jaime](#if-they-are-real-people-too)
16. [File names](#file-names)

---

## Rael, Lord of Ardencia

Lord of Ardencia, about 50, Gianna's and Anissa's secret father and Azzy's father. Chapter 3 (the Trial of Blades, the escape), the Chapter 11 pier, Chapter 12. Source: ART-PROMPTS section 13.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Lord Rael.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Lord Rael. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Lord Rael is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a man of about 50. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
He is a Spanish-inspired Caribbean lord of about 50, ruler of an ash-and-iron land: tall, broad-shouldered, very still, a man who reads as a warlord but whose dark eyes are tired, not cruel. Short black hair going grey at the temples, a trimmed dark beard, a thin pale scar through the left eyebrow, dark watchful eyes (warm light-brown skin, but the photo wins for face, skin and hair). Outfit: a near-black long coat with crimson trim and crimson lining, black breeches and boots, a crimson sash, dark epaulettes. On his right hand a gold signet ring with a half-sun (it is the other half of a locket's design, so draw the sun as a clean half disc). On his left wrist a plain dark iron band with a small ember-red stone. Show him full body three times on one sheet: front view, side view and back view, standing tall with his hands behind his back, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (near-black, crimson, gold, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Lord Rael, about 50, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Short black hair grey at the temples, trimmed dark beard, the thin pale scar through the left eyebrow, the near-black coat with crimson trim and dark epaulettes, the gold half-sun signet ring on the hand if it shows. Expression: cold, level and closed, a warlord's still face with tired eyes. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for three more expressions, one at a time:
- *"Same portrait, same framing, expression: **stern**, brows lowered, jaw set, a ruler passing judgement."*
- *"... expression: **unreadable**, a perfectly still face that gives nothing either way (the one he wears at the lie)."*
- *"... expression: **by lamplight**, the mask gone, tired and honest, as if he is about to tell the truth on the pier and ask nothing."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 28 x 36 (tall man))
```
Pixel art sprite sheet of the same character, Lord Rael, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 15% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Warm light-brown skin, short black hair grey at the temples, a trimmed dark beard, a near-black long coat with crimson trim and dark epaulettes, a crimson sash, black breeches and boots, a small gold ring on the right hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/rael.png` (28 x 36 cells), `portraits/rael.png`, `portraits/rael_stern.png`, `portraits/rael_unreadable.png`, `portraits/rael_lamplight.png`.

---

## Old Benny

Rael's father, about 74, wry and sharp; hidden in the keep and met in Chapter 3, on the Chapter 11 pier, and at the Hearing. Source: FAMILY.md only (no description in ART-PROMPTS).

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of old Benny.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named old Benny (Lord Benny of Ardencia, retired). The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person old Benny is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a man of about 74. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
He is a Spanish-inspired Caribbean elder of about 74, the former Lord of Ardencia, Rael's father: once tall, now a little stooped and slow, wry, sharp-minded, a man who counts everything and will not sign a page he has not read. White hair thinning on top, a short white beard, deep lines at the eyes and a dry half-smile, bright watchful eyes (the photo wins for face, skin and hair). Outfit: a long dark-red house coat with a gold cuff over a cream shirt and a black waistcoat, a black sash, black trousers and soft leather boots, small round reading spectacles on a cord around his neck, a folded paper tucked in his coat. No weapon, no cane. Show him full body three times on one sheet: front view, side view and back view, standing slightly stooped with his hands clasped in front, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (dark red, cream, black, a touch of gold, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: old Benny (Lord Benny of Ardencia, retired), about 74, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Thinning white hair, short white beard, lined face, the reading spectacles on their cord, the dark-red coat with a gold cuff over a cream shirt. Expression: wry and kind, a dry half-smile, bright watchful eyes. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for three more expressions, one at a time:
- *"Same portrait, same framing, expression: **wry**, one eyebrow lifted, a dry half-smile."*
- *"... expression: **tender**, eyes soft and a little wet, looking at someone he is proud of."*
- *"... expression: **counting**, eyes lowered and still, the look of a man adding something up at the end of a thing."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, old Benny, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him a little shorter than Gianna and slightly stooped. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Thinning white hair, short white beard, small round spectacles on a cord, a long dark-red coat with a gold cuff over a cream shirt and black waistcoat, black trousers and boots. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/benny_old.png`, `portraits/benny_old.png`, `portraits/benny_old_wry.png`, `portraits/benny_old_tender.png`, `portraits/benny_old_counting.png`.

---

## Young Benny (the Echo)

Benny about fifty years ago, about 22: he sailed from Ardencia to fight beside Patricio. Chapter 3 callback (he recognises the Locket) and the Echo of the first oath. Source: FAMILY.md, STORYBOARD (his hand: light olive-brown, a dark red sleeve with a gold cuff, the iron half-signet).

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of young Lord Benny. For the Echo version of the face, a photo of the same real person as old Benny is fine; the prompt asks for a young man of 20 to 25.

Use the same photo as old Benny (or an old photo of him when young, if the family has one). The prompt asks for the face as a young man.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named young Lord Benny. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Benny is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a young man of about 20 to 25, as he looked fifty years ago. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
He is the same man as old Benny, fifty years earlier: now a young Spanish-inspired Caribbean nobleman-soldier of about 22, who came by sea to fight beside a revolution. Keep the face clearly recognisable as the same man as the real person, young: lean, quick, restless, with a wry edge already there. Short dark hair, clean-shaven or with light stubble, bright eyes (light olive-brown skin, but the photo wins for face, skin and hair). Outfit: a dark-red coat with a gold cuff and gold buttons over a white shirt, a black sash, black breeches and tall black boots, a sabre at his hip, and on his right hand an iron signet ring with a small red stone (half of a token: draw the ring as a clean half disc with a flat edge). Show him full body three times on one sheet: front view, side view and back view, standing easy and confident with one hand on the sabre hilt, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (dark red, gold, black, white, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: young Lord Benny, about 22, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Short dark hair, light stubble or none, the dark-red coat with gold buttons and a gold cuff, the black sash, the white shirt collar. Expression: steady, bright-eyed, a half-smile that says he has already decided. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for three more expressions, one at a time:
- *"Same portrait, same framing, expression: **steady**, bright-eyed, a half-smile that says he has already decided."*
- *"... expression: **wry**, a quick sideways grin, the old man's humour already there."*
- *"... expression: **recognising**, eyes wide and still, looking at a sun-shaped locket as if he has seen the other half of it before."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, young Lord Benny, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly taller than her and lean. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Light olive-brown skin, short dark hair, a dark-red coat with gold buttons and cuffs, a black sash, white breeches, tall black boots, a sabre at the hip, an iron ring with a red stone on the right hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/benny_young.png`, `portraits/benny_young.png`, `portraits/benny_young_wry.png`, `portraits/benny_young_recognising.png`.

---

## Nancy

Benny's wife, the "current mother of Ardencia" (Claude's call, to confirm), Zelia's and Joaquin's mother, about 66. Gracious. Chapter 3 (the quiet rooms) and Chapter 11 (she takes Anissa's hand and walks the wounded to the Song House). Source: FAMILY.md only.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Nancy.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Nancy. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Nancy is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 66. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a gracious Spanish-inspired Caribbean lady of about 66, wife of the old Lord of Ardencia and mother of its house: upright, calm and warm, a hostess who can also take charge in a crisis. Dark hair streaked with grey in a low neat bun, kind steady eyes, soft laugh lines (the photo wins for face, skin and hair). Outfit: a long deep-crimson gown with black trim and long sleeves, a black lace mantilla draped over her hair and shoulders, a small iron brooch at the collar, a plain gold wedding band, sleeves pushed up a little as if ready to help. Show her full body three times on one sheet: front view, side view and back view, standing with her hands lightly folded in front, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (deep crimson, black lace, a touch of gold, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Nancy, about 66, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Dark hair streaked with grey in a low bun, the black lace mantilla, soft laugh lines, the deep-crimson gown with black trim, the small iron brooch. Expression: gracious, a calm welcoming smile. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **tender**, eyes soft, reaching out a hand to a frightened child."*
- *"... expression: **firm**, chin lifted, a hostess who is giving orders in a crisis."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Nancy, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her about the same height as her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. A long deep-crimson gown with black trim and a black lace mantilla over her grey-streaked bun, a small iron brooch. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/nancy.png`, `portraits/nancy.png`, `portraits/nancy_tender.png`, `portraits/nancy_firm.png`.

---

## Zelia

Rael's half-sister (Benny's and Nancy's daughter), about 38, steward of the Alcázar; "Titi Zelia". Proper, protective, keeper of the house. Chapter 3 (the audience, the records room, the way to old Benny), Chapter 11 mention. Source: FAMILY.md only.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Zelia.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Zelia. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Zelia is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 38. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a proper, protective Spanish-inspired Caribbean woman of about 38, steward of a great keep: straight-backed, composed, keen-eyed, someone who knows where everything is and who is allowed to see it. Dark hair pinned up tightly, a precise, watchful face with a rare softening around the eyes (the photo wins for face, skin and hair). Outfit: a high-collared dark charcoal dress with crimson cuffs and a thin crimson belt, a heavy ring of iron keys at her hip, a small iron brooch, a slim ledger held against her side. Show her full body three times on one sheet: front view, side view and back view, standing very upright with the key ring at her hip, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (charcoal, crimson, iron grey, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Zelia, about 38, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Dark hair pinned up tightly, the high collar of the charcoal dress with crimson cuffs, the small iron brooch, the iron key ring at the edge of the frame. Expression: proper, composed, polite and a little guarded. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **protective**, eyes narrowed, standing between someone and danger."*
- *"... expression: **softened**, a small private smile, the steward off duty for one second."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Zelia, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her the same height as her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Dark hair pinned up, a high-collared charcoal dress with crimson cuffs and belt, a ring of iron keys at the hip. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/zelia.png`, `portraits/zelia.png`, `portraits/zelia_protective.png`, `portraits/zelia_softened.png`.

---

## Amanda

Rael's full sister (Benny's and Rahel's daughter), about 46; "Titi Amanda". Bubbly, excitable, outspoken, a little crazy (owner, Oct 21). Runs the bread-at-night kitchen in Cenizal's Lower Town and unbars Benny's tunnel (Chapter 3), and Rael sends Gianna to her about the flour (Chapter 11). Source: FAMILY.md only.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Amanda.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Amanda. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Amanda is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 46. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a bubbly, excitable, fun-loving Spanish-inspired Caribbean woman of about 46: independent, very outspoken, vibrant and a little crazy, who runs a night kitchen that feeds the poor and is secretly part of a rebel network. Wild dark curly hair escaping a bright yellow-and-teal headscarf, big hoop earrings, a huge laughing mouth, quick bright eyes (the photo wins for face, skin and hair). Outfit: a flour-dusted cream apron over an orange-red blouse with the sleeves rolled to the elbow, a teal skirt, sturdy shoes, a wooden spoon tucked into her apron string, flour on one cheek. Show her full body three times on one sheet: front view, side view and back view, standing with one hand on her hip and the other raised in a wave, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (orange-red, teal, yellow, cream, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Amanda, about 46, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Wild dark curls under the yellow-and-teal headscarf, big hoop earrings, flour on one cheek, the orange-red blouse, the cream apron. Expression: bubbly, a huge laugh, eyes wide with delight. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **conspiratorial**, leaning in, one finger raised to her lips, eyes sparkling with a plan."*
- *"... expression: **fierce**, chin up, a cook defending her kitchen."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Amanda, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her the same height as her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Wild dark curls under a yellow-and-teal headscarf, big hoop earrings, an orange-red blouse with rolled sleeves, a flour-dusted cream apron, a teal skirt, a wooden spoon at her waist. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/amanda.png`, `portraits/amanda.png`, `portraits/amanda_conspiratorial.png`, `portraits/amanda_fierce.png`.

---

## Joaquin

Rael's half-brother (Benny's and Nancy's son), about 32; "Tío Joaquin". Young, loyal, torn; captain of the garrison. His men's shots land wide during the escape (Chapter 3), and he brings Free Brasador to the Muster (Chapter 10) and counts its wounded (Chapter 11). Source: FAMILY.md and ART-PROMPTS section 19 (Chapter 10 look).

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Joaquin.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Joaquin. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Joaquin is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a man of about 32. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
He is a young, loyal Spanish-inspired Caribbean soldier of about 32, captain of a keep's garrison, a man torn between his orders and what he knows is right: strong, open-faced, honest, a little stubborn. Short dark hair, a clean jaw or light stubble, earnest eyes (the photo wins for face, skin and hair). Outfit: a Brasador-red military coat with iron buttons and a black collar over dark leather, captain's gold epaulettes, a black belt and tall black boots, a sabre at his hip, and a plain iron helmet carried under one arm. Show him full body three times on one sheet: front view, side view and back view, standing at attention with the helmet under his arm, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (Brasador red, iron grey, black, a touch of gold, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Joaquin, about 32, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Short dark hair, the red coat with iron buttons and a black collar, the gold captain's epaulettes. Expression: steady, earnest and loyal, ready for an order. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **torn**, jaw tight, eyes lowered, an honest man about to disobey an order."*
- *"... expression: **handing over**, a plain, proud, tired smile, as if giving something heavy to someone who will carry it better."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Joaquin, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly taller than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Short dark hair, a Brasador-red coat with iron buttons and a black collar, gold epaulettes, a black belt, a sabre at the hip, tall black boots. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Optional, later outfit: Free Brasador (Chapter 10)** (same chat, after the three above)
```
Same character, Joaquin, in a new outfit for later in the story: the same man in the company's black coat with white trim, a green helmet and green epaulettes, no gold. Keep the face exactly as on the reference sheet. Make a new reference sheet (front, side and back view plus a face close-up), then a head-and-shoulders portrait with the expression **handing over**, a plain, proud, tired smile, giving something heavy to someone who will carry it better, then a pixel walking sprite sheet with the same 4 x 3 grid rules as before. Solid flat magenta background (#FF00FF). No text, no frames.
```

**Files:** `characters/joaquin.png`, `portraits/joaquin.png`, `portraits/joaquin_torn.png`, `portraits/joaquin_handing_over.png`.

---

## Rahel

Rael's mother, an old woman of about 72 (age and skin tone left to the owner in ART-PROMPTS section 19), formidable and warm with grandchildren; Patricia's daughter. Chapter 10, the Muster. Source: ART-PROMPTS section 19.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Rahel.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Rahel. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Rahel is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 72. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a formidable old woman of about 72, Rael's mother: tall, straight-backed, a matriarch whose look can stop a room, and who is warm with her grandchildren. Grey hair in a tidy bun and NO braid, a strong, lined face, sharp dark eyes (the photo wins for face, skin and hair). Outfit: a long black robe with a deep red trim, a black shawl over her shoulders, and a Brasador brooch (a small gold bull's skull with three flames above it) at the collar. Show her full body three times on one sheet: front view, side view and back view, standing very upright with her hands folded in front, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (black, deep red, a touch of gold, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Rahel, about 72, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Grey hair in a bun with no braid, the black shawl over the black robe with deep red trim, the small gold Brasador brooch. Expression: formidable, a level look that ends arguments. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **warm**, the whole face softened, a real smile for a grandchild."*
- *"... expression: **closed**, a face that gives nothing either way, lips shut, eyes steady."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Rahel, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her about 5% taller than her and very upright. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Grey hair in a bun with no braid, a long black robe with deep red trim, a black shawl, a small gold brooch. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/rahel.png`, `portraits/rahel.png`, `portraits/rahel_warm.png`, `portraits/rahel_closed.png`.

---

## Patricia

Rahel's mother, the eldest of the family, about 92: Rael's grandmother and great-grandmother to Gianna, Anissa and Azzy. Sharp-eyed, unhurried, the family's memory. Chapter 10, the Muster (she blesses the three at the Gaze lamp). Source: ART-PROMPTS section 19.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Patricia.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Patricia. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Patricia is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 92. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is the eldest of the family, a very old woman of about 92: small, slight, unhurried, sharp-eyed, the one who remembers everything. White hair in a bun, a deeply lined face, bright dark eyes that miss nothing (the photo wins for face, skin and hair). Outfit: a plum-grey robe with a white trim, a white collar, and a slim wooden cane she carries in one hand but does not lean on. Show her full body three times on one sheet: front view, side view and back view, standing small and upright, the cane held at her side, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (plum-grey, white, a touch of gold, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Patricia, about 92, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. White hair in a bun, a deeply lined face, bright eyes, the plum-grey robe with a white collar and trim. Expression: looking, patient and sharp, one thing at a time. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright GREEN background (#00FF00) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **blessing**, one hand raised, eyes warm and certain."*
- *"... expression: **listening**, head tilted, a hand cupped behind her ear, a dry half-smile."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Patricia, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her about 10% shorter than her, upright. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. White hair in a bun, a plum-grey robe with a white collar and trim, a slim wooden cane held in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright GREEN background (#00FF00). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/patricia.png`, `portraits/patricia.png`, `portraits/patricia_blessing.png`, `portraits/patricia_listening.png`.

---

## Jordyn

Rahel's daughter (Azzy's Titi), about 38, captain of the Regent's watch in Kingsmere who defects. Disciplined, blunt, fair. Chapter 9 (Kingsmere), Chapter 10 (the Muster), Chapter 11 (the War of the Harbor). Source: ART-PROMPTS sections 18 and 19.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Jordyn.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Jordyn. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Jordyn is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 38. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a Black woman of about 38, captain of a city watch: tall, straight-backed, disciplined, blunt and fair, with her mother's jaw. Close-cropped black hair, a flat unreadable face, steady dark eyes (the photo wins for face, skin and hair). Outfit: a violet watch coat with gold epaulettes and a gold-edged sash, a captain's knot at the shoulder, dark trousers and polished black boots, a plain sword at her belt. Show her full body three times on one sheet: front view, side view and back view, standing at attention with her hand on the sword hilt, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (violet, gold, black, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Jordyn, about 38, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Close-cropped black hair, the violet watch coat with gold epaulettes and the captain's knot at the shoulder. Expression: by the book, flat and unreadable. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright GREEN background (#00FF00) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **Mother's jaw**, chin set, a look that would stop a charging horse (the arrest)."*
- *"... expression: **resigning**, steady and calm, laying a captain's knot down on a table."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Jordyn, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her about 10% taller than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Close-cropped black hair, a violet watch coat with gold epaulettes and a gold-edged sash, a captain's knot at the shoulder, dark trousers, black boots, a sword at the belt. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright GREEN background (#00FF00). No text, no numbers, no grid lines, no labels.
```

**Optional, later outfit: Freed (Chapter 10)** (same chat, after the three above)
```
Same character, Jordyn, in a new outfit for later in the story: the same woman with the coat turned inside out to its grey lining, the violet showing only at the seams, the gold epaulettes kept, no captain's knot. Keep the face exactly as on the reference sheet. Make a new reference sheet (front, side and back view plus a face close-up), then a head-and-shoulders portrait with the expression **arresting**, a flat, certain look, one hand raised to stop the room, then a pixel walking sprite sheet with the same 4 x 3 grid rules as before. Solid flat bright GREEN background (#00FF00). No text, no frames.
```

**Files:** `characters/jordyn.png`, `portraits/jordyn.png`, `portraits/jordyn_mothers_jaw.png`, `portraits/jordyn_resigning.png`.

---

## Kayla

Rahel's daughter (Azzy's Titi), about 25, a cipher clerk in the fog city's archive. Quiet, exact, a listener. Chapter 7, Kirinoura. Source: ART-PROMPTS section 16.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Kayla.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Kayla. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Kayla is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 25. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a quiet, exact cipher clerk of about 25: calm, precise, a listener who corrects you gently. Black hair pinned up with a writing brush pushed through it, calm dark eyes (the photo wins for face, skin and hair; her father was a man of the Asian continent). Outfit: a plain clerk's grey robe with one cuff stained with ink, a lacquer case of seals hanging at her belt, soft shoes. Show her full body three times on one sheet: front view, side view and back view, standing with her hands folded in front, a scroll under one arm, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (grey, ink black, a touch of lacquer red, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Kayla, about 25, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Black hair pinned up with a writing brush through it, the grey clerk's robe with an ink-stained cuff. Expression: exact, a small patient frown, as if she is about to correct you kindly. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for one more expression, one at a time:
- *"Same portrait, same framing, expression: **listening**, head slightly tilted, completely still and attentive."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Kayla, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her the same height as her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Black hair pinned up with a writing brush, a plain grey clerk's robe with an ink-stained cuff, a lacquer seal case at the belt, soft shoes. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/kayla.png`, `portraits/kayla.png`, `portraits/kayla_listening.png`.

---

## Aiyana

Rahel's daughter, Kayla's full sister (Azzy's Titi), about 30, the Court's engineer of the great flame. Bright, restless, hands-on. Chapter 8, Agnipur. Source: ART-PROMPTS section 17.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Aiyana.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Aiyana. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Aiyana is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 30. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a bright, restless, hands-on engineer of about 30: a woman who says only what she measures. She has her sister Kayla's features (their father was a man of the Asian continent). Black hair in a working bun under a cream headband, soot on one cheek, narrow concentrating eyes (the photo wins for face, skin and hair). Outfit: a worn leather apron over a saffron tunic, rolled sleeves, a satchel of tools across her body, and a big iron wrench in her hand. Show her full body three times on one sheet: front view, side view and back view, standing with the wrench resting on her shoulder, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (saffron, cream, leather brown, soft brass, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Aiyana, about 30, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Black hair in a working bun under a cream headband, soot on one cheek, the saffron tunic under the leather apron. Expression: measuring, squinting at something only she can see. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for one more expression, one at a time:
- *"Same portrait, same framing, expression: **dry**, flat humour, one eyebrow raised, a tiny smile at a joke she will not explain."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Aiyana, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her the same height as her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Black hair in a bun under a cream headband, soot on one cheek, a saffron tunic under a leather apron, a tool satchel, a big iron wrench in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/aiyana.png`, `portraits/aiyana.png`, `portraits/aiyana_dry.png`.

---

## Coralie, "Tati Coco"

Elodie's sister, about 45, an artist and designer for royals; Gigi's and Anissa's aunt. Flamboyant, generous, fearless. Chapter 4 (Al-Doria's cloth row) and Chapter 5 (Eightgate). Source: ART-PROMPTS section 14.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Coralie.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Coralie ("Tati Coco"). The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Coralie is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a woman of about 45. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
She is a Haitian-inspired Caribbean fashion designer of about 45, designer to royals: tall, flamboyant, generous and fearless, who reads at a glance. Deep brown skin (the photo wins for face, skin and hair), black hair in two high puffs wrapped in a violet silk scarf, big gold hoops, a warm laughing mouth with a few pins held in it. Outfit: one long dress made of eight bold panels of colour (gold, teal, crimson, green, grey, indigo, saffron, violet), a yellow tape measure round her neck, a pincushion on her wrist. Show her full body three times on one sheet: front view, side view and back view, standing with one hand on her hip, same scale, evenly spaced, plus one small close-up of her face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (eight bold colours (gold, teal, crimson, green, grey, indigo, saffron, violet), warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Coralie ("Tati Coco"), about 45, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Two high hair puffs in the violet silk scarf, gold hoops, a tape measure round her neck, the bold panels of the dress. Expression: delighted, a huge warm laugh, eyes shining. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat bright GREEN background (#00FF00) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **fierce**, eyes blazing, pins in her mouth, ready to fight for her people."*
- *"... expression: **tender**, eyes soft and a little wet, looking at a niece (Anissa), a hand lifted as if to touch her cheek."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Coralie, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw her about 10% taller than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Two high hair puffs in a violet scarf, gold hoops, a long dress of eight bold colour panels (gold, teal, crimson, green, grey, indigo, saffron, violet), a tape measure round the neck. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat bright GREEN background (#00FF00). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/coralie.png`, `portraits/coralie.png`, `portraits/coralie_fierce.png`, `portraits/coralie_tender.png`.

---

## Sebastian

Elodie's brother, about 60, a world-renowned organist to three courts. Proud, gentle, a showman. Chapter 9, Kingsmere's cathedral (and he leaves for Eightgate and Pòdlimyè). Source: ART-PROMPTS section 18.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Sebastian Jean-Philippe.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Sebastian Jean-Philippe. The first attached image shows the art style to match (it is a different character, a young woman). A second image is attached: a photo of the real person Sebastian Jean-Philippe is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a man of about 60. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.
He is a Haitian-inspired Caribbean organist of about 60, world-famous and a showman: tall, proud, gentle, theatrical and warm. Grey hair swept back, a neat grey beard, long expressive hands (the photo wins for face, skin and hair). Outfit: a burgundy velvet coat with gold trim over a cream shirt with a loose cravat, dark trousers and polished boots. Show him full body three times on one sheet: front view, side view and back view, standing tall, one arm swept out in a small bow, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (burgundy, gold, cream, grey, warm skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Sebastian Jean-Philippe, about 60, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Grey hair swept back, a neat grey beard, the burgundy velvet coat with gold trim and the loose cream cravat. Expression: showman, a grand delighted smile, chin lifted. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for two more expressions, one at a time:
- *"Same portrait, same framing, expression: **listening**, eyes closed, completely lost in music."*
- *"... expression: **tender**, eyes soft, a gentle smile, as if tucking a blanket round someone."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 28 x 36 (tall man))
```
Pixel art sprite sheet of the same character, Sebastian Jean-Philippe, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 15% taller than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Grey hair swept back, a neat grey beard, a burgundy velvet coat with gold trim, a cream shirt and loose cravat, dark trousers, polished boots. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/sebastian.png` (28 x 36 cells), `portraits/sebastian.png`, `portraits/sebastian_listening.png`, `portraits/sebastian_tender.png`.

---

## If they are real people too

Captain Azriel Rivera and Jaime (Rael's royal guard, Chapter 3) have no stated real-life model. If the owner wants a
family member or friend to be them, use these. The likeness line is in `[OPTIONAL ...]` brackets: **keep it and attach a
photo, or delete it** and use the description alone. Everything else works as above.

### Captain Azriel Rivera

Captain of Rael's royal guard, about 50, Azzy's namesake; fought beside Rael in the Ash Wars. Quiet, loyal, says almost nothing. A very strong opponent in the Trial (Chapter 3). Source: ART-PROMPTS section 13.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Captain Azriel Rivera. If there is no photo, delete the bracketed likeness line in prompt 1 and the words "(the likeness of the photographed person)" in prompt 2.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Captain Azriel Rivera. The first attached image shows the art style to match (it is a different character, a young woman). [OPTIONAL, delete this part if there is no photo: A second image is attached: a photo of the real person Captain Azriel Rivera is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a man of about 50. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.]
He is a Spanish-inspired Caribbean soldier of about 50, captain of a royal guard: quiet, loyal, a soldier's build, a man who says almost nothing. Weathered brown skin, close-cropped black hair going grey, a short black beard, an old scar along the jaw. Outfit: a crimson coat under a dark iron breastplate, a dark iron helmet with a crimson crest and a dented, scarred brow, worn so the whole face stays visible, and a long halberd. Show him full body three times on one sheet: front view, side view and back view, standing at attention holding the halberd upright, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (crimson, dark iron, black, warm brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Captain Azriel Rivera, about 50, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Close-cropped black hair going grey, the short black beard, the old scar along the jaw, the dented iron helmet with a crimson crest worn so the face shows, the iron breastplate. Expression: watchful, steady eyes that miss nothing. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for one more expression, one at a time:
- *"Same portrait, same framing, expression: **grim**, jaw tight, a soldier about to do something he does not want to do."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 28 x 36 (tall man))
```
Pixel art sprite sheet of the same character, Captain Azriel Rivera, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him about 15% taller and clearly broader than her. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Weathered brown skin, close-cropped grey-black hair, a short black beard, a dented dark iron helmet with a crimson crest, a crimson coat under a dark iron breastplate, a halberd held in one hand. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/rivera.png` (28 x 36 cells), `portraits/rivera.png`, `portraits/rivera_grim.png`.

---

### Jaime

A strong mage, Rael's advisor, about 45. Fights beside Rael in the Trial (Chapter 3), a very strong opponent. Source: ART-PROMPTS section 13.

Attach: Gianna's reference sheet (`docs/quest/art-source/gianna-reference.webp`) + a clear, well-lit, front-facing photo of Jaime. If there is no photo, delete the bracketed likeness line in prompt 1 and the words "(the likeness of the photographed person)" in prompt 2.

**1. Character reference sheet** (a new chat; attach Gianna's sheet and the photo)
```
Character design reference sheet for a fantasy adventure game character named Jaime. The first attached image shows the art style to match (it is a different character, a young woman). [OPTIONAL, delete this part if there is no photo: A second image is attached: a photo of the real person Jaime is based on. Use it as the likeness reference for the face (face shape, eyes, nose, smile, skin tone, hair), shown as a man of about 45. Do not copy the photo's clothing, background or pose. The photo wins for face, skin tone and hair; the outfit comes from this description.]
He is a Spanish-inspired Caribbean mage of about 45, Rael's advisor: lean, measured, clever. Deep brown skin, long black hair tied back, a neat black beard, sharp clever eyes. Outfit: a long robe of Brasador red with a gold hem, a black over-mantle, and a staff of black iron crowned with a glowing ember. Show him full body three times on one sheet: front view, side view and back view, standing with the staff held upright in one hand, same scale, evenly spaced, plus one small close-up of his face. Style: hand-painted fantasy storybook illustration matching the first attached image, crisp clean outlines, bright warm saturated colours (Brasador red, black, gold, ember orange, deep brown skin), well-lit faces, soft shading, clear readable shapes. Plain flat light-grey background. No text, no labels, no letters, no frames, no extra people, no anime or chibi style, not photorealistic.
```

**2. Dialogue portrait** (same chat)
```
Same character as the reference sheet: Jaime, about 45, with the same face as on the reference sheet (the likeness of the photographed person). Head-and-shoulders portrait for a game's dialogue box, facing three-quarters toward the viewer, centred, filling a square image. Long black hair tied back, the neat black beard, the red robe with a gold hem under the black over-mantle, the glowing ember at the top of the staff if it shows. Expression: measured, calm and exact, weighing every word. Style: the same hand-painted fantasy storybook look, crisp outlines, bright warm colours, the face well lit from the upper left, simple readable shapes that still read when shrunk very small. Solid flat magenta background (#FF00FF) filling the whole square. No text, no frame, no border, no other people.
```
Then, in the same chat, ask for one more expression, one at a time:
- *"Same portrait, same framing, expression: **casting**, eyes lit with ember light, a faint orange glow on his face."*

**3. Pixel walking sprite sheet** (same chat; also attach **Gianna's sprite sheet**, `docs/quest/art-source/gianna-sprites.webp`; cell size after conversion: 24 x 32)
```
Pixel art sprite sheet of the same character, Jaime, for a top-down 16-bit fantasy RPG in Game Boy Advance style. The attached sprite sheet is a different character (a young woman): match its art style, pixel size and chibi proportions (big head about 40% of the figure), but draw him slightly taller than her and lean. A strict grid of 4 rows and 3 columns, 12 cells, every cell the same size, with NO lines or borders between the cells. Row 1 facing down (toward the viewer), row 2 facing left, row 3 facing right, row 4 facing up (back view). In each row: column 1 standing still, column 2 left foot forward, column 3 right foot forward. Every frame in row 2 faces left and every frame in row 3 faces right. Deep brown skin, long black hair tied back, a neat black beard, a long Brasador-red robe with a gold hem, a black over-mantle, a black iron staff with a glowing ember on top. Bright, saturated, warm colours with clearly lit skin; dark eyes visible on the face. 1-pixel dark outline, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients, no shadows on the ground. Feet at the bottom of each cell, same size and position in every cell. Solid flat magenta background (#FF00FF). No text, no numbers, no grid lines, no labels.
```

**Files:** `characters/jaime.png`, `portraits/jaime.png`, `portraits/jaime_casting.png`.

---


---

## File names

Look keys: `rael`, `benny_old`, `benny_young`, `nancy`, `zelia`, `amanda`, `joaquin`, `rahel`, `patricia`, `jordyn`,
`kayla`, `aiyana`, `coralie`, `sebastian`, `rivera`, `jaime`. The neutral/default portrait is `portraits/<look>.png`;
the other expressions are `portraits/<look>_<expression>.png`. Some of these looks already have game placeholders
(`quest/src/assets.config.ts`); a PNG with the same name replaces the placeholder. The later outfits are
`joaquin_free` and `jordyn_free` (Chapter 10).

| Who | Walk sheet | Default portrait | Extra expressions |
|---|---|---|---|
| Rael, Lord of Ardencia | `characters/rael.png` (28 x 36 cells) | `portraits/rael.png` | `rael_stern`, `rael_unreadable`, `rael_lamplight` |
| Old Benny | `characters/benny_old.png` | `portraits/benny_old.png` | `benny_old_wry`, `benny_old_tender`, `benny_old_counting` |
| Young Benny (the Echo) | `characters/benny_young.png` | `portraits/benny_young.png` | `benny_young_wry`, `benny_young_recognising` |
| Nancy | `characters/nancy.png` | `portraits/nancy.png` | `nancy_tender`, `nancy_firm` |
| Zelia | `characters/zelia.png` | `portraits/zelia.png` | `zelia_protective`, `zelia_softened` |
| Amanda | `characters/amanda.png` | `portraits/amanda.png` | `amanda_conspiratorial`, `amanda_fierce` |
| Joaquin | `characters/joaquin.png` | `portraits/joaquin.png` | `joaquin_torn`, `joaquin_handing_over` |
| Rahel | `characters/rahel.png` | `portraits/rahel.png` | `rahel_warm`, `rahel_closed` |
| Patricia | `characters/patricia.png` | `portraits/patricia.png` | `patricia_blessing`, `patricia_listening` |
| Jordyn | `characters/jordyn.png` | `portraits/jordyn.png` | `jordyn_mothers_jaw`, `jordyn_resigning` |
| Kayla | `characters/kayla.png` | `portraits/kayla.png` | `kayla_listening` |
| Aiyana | `characters/aiyana.png` | `portraits/aiyana.png` | `aiyana_dry` |
| Coralie, "Tati Coco" | `characters/coralie.png` | `portraits/coralie.png` | `coralie_fierce`, `coralie_tender` |
| Sebastian | `characters/sebastian.png` (28 x 36 cells) | `portraits/sebastian.png` | `sebastian_listening`, `sebastian_tender` |
| Captain Azriel Rivera | `characters/rivera.png` (28 x 36 cells) | `portraits/rivera.png` | `rivera_grim` |
| Jaime | `characters/jaime.png` | `portraits/jaime.png` | `jaime_casting` |
