# Production: one complete, boxed copy of Bloodlines (and every reorder after it)

Everything is made by **BoardGamesMaker** (boardgamesmaker.com): box, board, cards, rulebook, dice, pawns and tokens,
with no minimum order. Each piece is saved there as a project, so a second copy is just "reorder" on each project.
All print files are built by scripts in this repo from the art in `art/`, so they can always be rebuilt.

**Target:** in hand by **Sunday, November 22**. BoardGamesMaker prints in China and ships from there: allow 2–3 days
of production plus 1–2+ weeks of shipping, and pay for expedited shipping on anything ordered after October 20.

## Open items (the one checklist; keep it current)

Claude brings this list up at every milestone of any work in this repo (the quest included), most urgent first,
and ticks items off here as they land. Last updated **Tue Oct 20**.

**Order A (Mon Oct 20), BoardGamesMaker, matte laminated (smooth) on everything (owner, Oct 20)**
- [x] Board approved: `print/board-24in.jpg` (`npm run print:board`), the 4096 map, the 8 seats, bolder grid, each
  homeland name touching its capital (Aldermoor's last letter reaching into Xaraguá is accepted). **Re-rendered Oct 20:
  the round track is 1 to 18 with no Sudden Death mark** (rules-decisions 91); replace the image already uploaded.
- [x] Game box approved: `print/box-12.5x12.5x2.pdf` (`npm run print:box`), 12.5" × 12.5" × 2".
- [x] Action card box approved: `print/card-box-action.pdf` (`npm run print:card-boxes`), Easy Flip 140 × 96 × 24 mm,
  custom (finger open & snap close), all 126 Action cards in two stacks; the Reference Card inside the lid.
- [x] Tarot box approved: `print/card-box-tarot.pdf`, Double Flip magnetic 130 × 80 × 40 mm, beside the game box;
  the houses inside the flaps.
- [ ] Before uploading the Action box: if the finger-open option's template differs from the plain one, send it so
  the notch doesn't cut "ACTION CARDS".
- [ ] Upscaled logo (owner, Upscayl 4×, to `art/ui/`): the boxes print slightly soft until then; re-run
  `npm run print:box` and `npm run print:card-boxes` when it lands. The game box can wait for it; the rest needn't.
- [ ] With order A, ask BoardGamesMaker two numbers (observer, Oct 20): the Easy Flip box's **inner** height, and
  the thickness of their 63 × 88 card stock in matte lamination (63 cards must fit in 24 mm).
- [ ] Place order A.
- **Order A locks the board today:** the round track (1 to 18, unmarked), the tile positions and the Throne squares
  are frozen Oct 20, not Oct 31. The Sudden Death round itself (16 for now) can still move between 12 and 18.

**Rules freeze (Fri Oct 31)**
- [x] Third design review done (rules-decisions 88 to 90): Rakt Ki Pyaas is a 1-space move; Kay Soley's claim
  numbers, a Forced March example, Grito markers and Guaíza's limits are on the reference card and in the appendix;
  Ayatsuri reaches every card, never a house ability (`tests/ayatsuri.test.ts`); Dorini tested and kept as is.
- [x] One source of truth (Oct 19): `src/data` + `src/config.ts` + the engine; `src/data/rules.ts` is the rulebook;
  the three draft documents are retired.
- [ ] **Three human playtests, at 4 and 6 players; the first by Sat Oct 24** (so a rules question it finds can still
  be reworded by Oct 31). Three games can't judge a house's win share (don't tune a house on them). Log per game:
  - the round of the claim, and whether Sudden Death fired (bots: claims in rounds 8 to 10);
  - minutes from "I claim" to the end with 2+ challengers at 6 players, and whether the room stayed engaged;
  - Agnivansh at 4: "did the 1-space move after a kill ever change what you did?" (no in both: note for a reprint);
  - Suzumori at 6: how often Kagemimi was used, and whether a peek changed an attack or a Block;
  - Dorini, Yaguana, Brasador: resource totals at the end, and whether Guaíza was used (reprint data);
  - **every rules question asked at the table, verbatim** (feeds the appendix before the freeze).
- [x] Component sizes (accepted Oct 20; confirm the player boards and rulebook total under 9 mm once BoardGamesMaker
  gives the stock thickness): the 24 mm card boxes leave about 9 mm under the board for the
  player boards, rulebook and score pad, so **player boards in thin card** (300 to 350 gsm, 1 mm at most, about
  150 × 100 mm; 2 mm chipboard won't fit), and **drop the score pad** (print the score grid on the back of the
  reference card: kills and Reckonings per player, about 8 columns by 6 rows, pale and pencil-friendly). Legacy cards tarot size in the tarot box (48 cards, plenty of room); tokens
  about 25 mm; **dice: stock**.
- [x] Token containers (accepted Oct 20): **zip bags, ordered with B**. No tray holding 60 tokens flat fits in 24 mm, so
  bags are the only fit: three for the resource tokens, one each for Heart/Grudge/reminder tokens, the standees, and
  the dice and round marker.
- [ ] **Art, cut by what the table sees most** (observer, Oct 20; 20 of 126 cards, none since Oct 13; 0 of 32
  portraits): 1. the card back; 2. the 8 Gen I portraits (they are the standees too; Gen II to IV print with crest
  plates); 3. the 10 Elodie Instants and the 8 Block cards; 4. everything else prints in the no-picture design.
  **Fri Oct 24:** card back and 8 Gen I portraits in `art/`, then `npm run print` the same day.
- [ ] Card art: 20 of 126 in `art/cards/` (anything missing on Oct 31 prints in the no-picture design).
- [ ] Card back.
- [ ] 32 character portraits (none yet in `art/characters/`; prompts in `docs/art/CHARACTER-PROMPTS.md`).
- [ ] **Check this week, before building more:** `scripts/print-cards.cjs` makes MakePlayingCards sizes (game cards
  1000 × 1360, characters 1050 × 1752). The order goes to BoardGamesMaker: compare with their 63 × 88 and tarot
  templates (pixel size and bleed) and switch the card output if they differ.
- [ ] Print files still to build (seven layouts, no script yet): player boards, standees, tokens (Heart, Grudge,
  resource, reminder), Legacy cards, score pad, rulebook PDF, reference cards. None waits on the freeze except the
  rulebook and reference card text. **Oct 22:** the BoardGamesMaker templates for tokens, player boards, standees,
  tarot (Legacy), booklet and reference card, committed to `docs/art/templates/`. **Oct 24:** tokens, Legacy cards,
  standees. **Oct 27:** player boards, reference card draft. **Oct 31:** rulebook PDF and reference card final.
  **Nov 1 to 3:** proof only.
- [ ] **Proofread by someone other than the author:** every card front from the `print/preview-*.jpg` sheets, the 32
  character cards and the rulebook, between Oct 31 and Nov 2.
- [ ] **Print-at-home test:** one card front, one reference card and one rulebook spread on paper at true size, to
  check the text sizes are readable at 63 × 88 mm.
- [ ] **Language check before Oct 31** for the printed words (Limyè Elodie, Sèman Lapè, Rit Solèy, Kay Soley, and the
  Taíno names on the board and boxes); the Nov 18 check stays for the quest.
- [ ] **Slack:** order B on Nov 3 lands about Nov 8 to 20 against Nov 22. Decide now what ships without it if a part
  slips (standees and Legacy cards are the easiest to replace: crest tokens and a printed sheet).
- [ ] Optional box extras (owner to say): a "What's in the box" list on the game box underside, the card category key
  inside the Action lid's side panels, the Legacy rule on the tarot box's inner liners.
- [ ] **Mon Nov 3:** approve proofs, order B (expedited).

**Digital game**
- [ ] **Nov 5** (after order B), owner to decide: hide the Hand Card discard pile online (it is face down at the
  table; recommended, for consistency).
- [ ] Owner to decide: a "Story mode" link from the board game menu to `/quest/`.
- [ ] Owner to decide: show the 8 seat buildings in the app (`SEAT_ART` in `src/assets.config.ts`; a separate build).
- Balance record (bot games): every house within about 0.81 to 1.22 of its fair share at every count; details in
  `docs/rules-decisions.md` [87] to [90].

**Quest art waiting on the owner (art drop 1, Fri Oct 24):** every prompt is in `docs/quest/ART-PROMPTS.md`: Elodie
the goddess, Elodie Limyè, Patricio young and old, Anicette young and old, the Sun Locket and Solange's Quill, and
(added Oct 15) the battle stances for Gianna, Yari and young Patricio (one empty-handed stance each; the game draws
the weapons), Anissa's two battle poses, and the cane-field boar. Still to
write: the three intro illustrations (with the storyboard, Fri Oct 17); later Benny, Caona, Rael.

**The quest** (dated schedule: `docs/quest/SCHEDULE.md`): Milestone 1, Pòdlimyè and Chapter 1 finished with
the animated intro, **Sun Nov 1**; Milestone 2, battles and Xaraguá, **Sun Nov 15**; release of Chapters 1
and 2, **Sun Nov 22**. Your next quest asks: approve the intro storyboard (secret items and side quests approved Oct 14) by
**Fri Oct 17**; art drop 1 (six character sets and three intro illustrations) by **Fri Oct 24**.

**Quest story questions for the owner** (from the design pack, `docs/quest/design/STORY.md` section 6; one at a time,
most urgent first; settled so far: the capital's name, where the Accord was signed, who the Hushed is, chapters):
- [ ] **By Mon Nov 3** (the battle system is built that week): Samira's *Daftar* skill spends **gold** instead of the
  Wealth score (Wealth is never spent), and grows with the realm's Wealth. Proposal in `COMBAT.md`.
- [x] The story slice: **settled Oct 15**. Ardencia is Chapter 3 and Al-Doria Chapter 4, so the slice (Zetwal,
  Xaraguá, Ardencia) is the first three chapters.
- [ ] **By Mon Dec 1** (before the later capitals): Patricio in Aldermoor during the war (proposal: under a flag of
  truce to negotiate the peace, where Thomas Stillwater met him).
- [ ] **By Mon Dec 1:** the Aldermoor ledger (proposal: it shows the gold vanishing into coded accounts, so Gianna
  does not learn Rael is good in Chapter 9; Haru reads the code after the Harbor Turn).
- [ ] **By Mon Dec 1:** the betrayer's companion (proposal: they stay, defy their house a second time, and get a scene
  and a stat boost in Chapter 11).
- [ ] **By Mon Dec 1:** the Gen III rulers each companion defies: Layla (Al-Doria), Torvald (Skarragol), Kaede
  (Kuroshi), Meera (Jwaladesh), Rosalind (Aldermoor).
- [ ] **Wed Nov 18:** a fluent speaker checks the Kreyol and Taino words, starting with **Pòdlimyè**.

## What's in the box

| # | Component | Spec | Print file (built by) | Art needed |
|---|---|---|---|---|
| 1 | **Game box** | Telescoping (lid + base) 12.5" × 12.5" × 2" (BoardGamesMaker template, chosen Oct 15), fits the folded board flat on top; everything under it must stay within about 33 mm. Side panel: **2–8 players · 60–150 min · best with 3–6** | `print/box-12.5x12.5x2.pdf` (`npm run print:box`); **approved Oct 20, matte laminated (smooth) like everything** | Logo ✔ (owner upscaling it), board map ✔ |
| 2 | **Game board** | 24" × 24" quad-fold, 7200 px | `print/board-24in.png` (`npm run print:board`) | Map ✔ (needs the 4096 file), seats or crests |
| 3 | **Action deck** | 126 cards, 63 × 88 mm, one shared back | `print/cards/card-*.png` (`npm run print`) | Card art 1–126, card back |
| 4 | **Character cards** (generation cards) | 32 tarot cards (8 houses × Gen I–IV), own back | `print/characters/*.png` (`npm run print`) | 32 portraits, crests |
| 5 | **Player boards** | 8, one per house: spaces for Influence, Fear and Wealth tokens, Heart Tokens and Grudges, the turn summary | `print/mats/*.png` (to build) | Crests |
| 6 | **Pawns** | 8 standees on plastic stands, the house's Gen I portrait (or crest) | `print/standees/*.png` (to build) | Portraits or crests |
| 7 | **Heart Tokens** | 32 round chipboard tokens (3 per player + spares) | `print/tokens/*.png` (to build) | — |
| 8 | **Grudge Tokens** | 40 round tokens, 5 per house, crest on the front, plain back (also used for the house lottery) | `print/tokens/*.png` (to build) | Crests |
| 9 | **Resource tokens** | 180 round double-sided chipboard tokens, 60 each of Influence (crown), Fear (crossed swords) and Wealth (coins): **1** on the front, **×5** on the back | `print/tokens/*.png` (to build) | Icons ✔ |
| 9b | **Round marker** | 1 wooden cube or pawn for the board's round track | stock piece | — |
| 10 | **Reminder tokens** | 27: 8 new-heir shields, 1 La Marca brand, 2 Grito de Guerra markers, 8 Specter markers, 8 Used tokens (once-per-game powers). Lasting cards are their own reminder: they stay face up in front of the player until they end | `print/tokens/*.png` (to build) | — |
| 10b | **Legacy cards** | 8 small cards, one per house, showing its Gen I passive, except Brasador's, which reads "+1 Fear on kill." (rules-decisions 87; `legacyPassive` in `src/data/houses.ts`). Yaguana's Ancestor's Voice draws one blind from the houses not at the table | `print/legacy/*.png` (to build) | Crests |
| 10c | **Score pad** | 50-sheet pad, one column per player: kills and Reckonings (read by Sudden Death, Reinado de Cenizas and Elodie's Reckoning; the fallen-houses column was dropped in rules-decisions 87) | `print/scorepad.pdf` (to build) | — |
| 11 | **Dice** | 2 six-sided dice (stock, or custom-printed faces) | stock / `print/dice/*.png` | — |
| 12 | **Rulebook** | Saddle-stitched booklet, about 20 pages, from the in-app rule guide (`src/data/rules.ts`): the **core rules** (about 1,600 words, what a first game needs) first, then the **appendix** (rules-decisions 87) | `print/rulebook.pdf` (to build) | Board, card and portrait art for pictures |
| 13 | **Reference cards** | 8 turn-summary cards (tarot size, with the character cards), printed from the **Reference Card** section of `src/data/rules.ts`: the turn, the ◎ Target card list and the lasting-card durations (these live on the card, not in the booklet; rules-decisions 87). | `print/characters/reference-*.png` (to build) | — |

## Containers (what holds what)

Everything rides in the game box; the board, player boards, rulebook and score pad lie flat on top, and every loose
piece goes in its own container underneath. Owner asked Oct 15 to order the containers from BoardGamesMaker too.

| Container | Holds | Size, or the print file |
|---|---|---|
| **Game box** (telescoping lid + base) | everything | 12.5" × 12.5" × 2" (the board folds to 12" × 12"); about 33 mm free under the board, rulebook and score pad |
| Thin card divider (optional) | keeps the containers below from sliding | no taller than about 33 mm; no deep tray |
| **Action card box**: Easy Flip Game Box 140 × 96 × 24 mm, custom (decided Oct 15) | all 126 Action cards, two stacks of 63 side by side | `print/card-box-action.pdf` (`npm run print:card-boxes`) |
| **Tarot card box**: Double Flip Game Box, tarot, magnetic, 130 × 80 × 40 mm, custom (decided Oct 15) | 32 Character, 8 Reference and 8 Legacy cards | `print/card-box-tarot.pdf`; too tall for the game box, so it travels beside it |
| Bag or 3-part tray | 180 resource tokens (60 Influence, 60 Fear, 60 Wealth) | one bag per kind, or one tray with 3 wells |
| Bag | 32 Heart Tokens | small zip bag |
| Bag (or 8 small bags, one per house) | 40 Grudge Tokens | small zip bag |
| Bag | 27 reminder tokens | small zip bag |
| Bag | 8 standees and their 8 plastic stands | small zip bag |
| Bag | round marker and 2 dice | small zip bag |
| none (flat in the box) | game board, 8 player boards, rulebook, score pad | |

## Resource tokens: how many
Showing a total uses (total ÷ 5) tokens on the ×5 side plus (the remainder) on the 1 side, so any total up to 24 takes
at most 8 tokens and up to 29 takes 9. Players make change with the supply at any time. 60 of each kind lets all eight players hold 7 tokens of every kind
at once (a typical holding is 3–5) with a few to spare for tokens that go missing.

## Two orders

**Finish for every part: matte laminated, smooth (owner, Oct 20).** The board, game box and both card boxes are approved.

Splitting it lets the board go early while the card art is still being painted. For a reorder, put both
saved projects in one cart.

| Order | What | Order by | Shipping |
|---|---|---|---|
| **A** | Board (2), game box (1), Action card box, tarot box | **Mon Oct 20** | Standard |
| **B** | Cards (3, 4, 10b, 13), player boards (5), standees (6), tokens (7, 8, 9, 10) and their zip bags, round marker (9b), score pad (10c), dice (11), rulebook (12) | **Mon Nov 3** | Expedited |

## Schedule

| Dates | Art (you) | Files (Claude) |
|---|---|---|
| Oct 12–17 | Upload the 4096 map. 8 seat buildings, 8 crests. Playtest. | Final board with seats, proof. |
| Oct 18–20 | Approve the proof. **Order A.** | |
| Oct 13–31 | Card art (15, then 16–126). 32 portraits. Card back. Playtest. | Cards as each batch arrives. Box, player boards, tokens, standees, reference cards, rulebook. |
| Fri Oct 31 | **Rules and card text freeze.** | Final rulebook. |
| Nov 1–3 | Approve proofs. **Order B.** | Final checks on every file. |
| Nov 18–22 | Everything arrives. | |

**Safety net:** any card still without art on October 31 prints in the no-picture design (symbol, frame and text), so
the deck is complete either way.

## Reordering a copy
1. Sign in to BoardGamesMaker, open **My Projects** (saved designs).
2. Add the saved board project and the saved order-B projects to the cart; set the quantity.
3. If any art or rule changed since, rebuild the files here first (`npm run print`, `npm run print:board`) and replace
   the images in the affected projects before ordering.
