# Production: one complete, boxed copy of Bloodlines (and every reorder after it)

Everything is made by **BoardGamesMaker** (boardgamesmaker.com): box, board, cards, rulebook, dice, pawns and tokens,
with no minimum order. Each piece is saved there as a project, so a second copy is just "reorder" on each project.
All print files are built by scripts in this repo from the art in `art/`, so they can always be rebuilt.

**Target:** in hand by **Sunday, November 22**. BoardGamesMaker prints in China and ships from there: allow 2–3 days
of production plus 1–2+ weeks of shipping, and pay for expedited shipping on anything ordered after October 20.

## Open items (the one checklist; keep it current)

Claude brings this list up at every milestone of any work in this repo (the quest included), most urgent first,
and ticks items off here as they land. Last updated **Tue Oct 14**.

**Physical game (BoardGamesMaker)**
- [ ] **Board (order A, Mon Oct 20):** the 4096 px map (only the 2000 px upscale is in `art/board/`), the 8 seat
  buildings (`art/seats/`, prompts in `docs/art/MAP-AND-SEATS.md`; none yet), then a proof of `print/board-24in.png`
  to approve, then order.
- [x] 8 crests.
- [ ] Card art: 20 of 126 in `art/cards/` (anything missing on Oct 31 prints in the no-picture design).
- [ ] Card back.
- [ ] 32 character portraits (none yet in `art/characters/`; prompts in `docs/art/CHARACTER-PROMPTS.md`).
- [ ] Print files still to build: box, player boards, standees, tokens (Heart, Grudge, resource, reminder),
  Legacy cards, score pad, rulebook PDF, reference cards.
- [ ] **Fri Oct 31:** rules and card text freeze. **Mon Nov 3:** approve proofs, order B (expedited).

**Digital game**
- [ ] Balance watch (not retuned): Dorini at 3 players about 1.20x; Ironvow and Agnivansh at 6 about 1.13x;
  Suzumori at 6 about 0.86x; Kay Soley at 2 to 4 slightly low. Decide before the Oct 31 freeze.
- [ ] Owner to decide: hide the Hand Card discard pile online (it is face down at the table).
- [ ] Owner to decide: a "Story mode" link from the board game menu to `/quest/`.

**Quest art waiting on the owner:** young Patricio and Anicette (prompts given Oct 14). Still to write prompts for:
Elodie the goddess, Elodie Limyè (the mother), Anicette young (the Echo) and old, Patricio young and old; later Benny,
Caona, Rael.

**The quest** (dated schedule: `docs/quest/SCHEDULE.md`): Milestone 1, Pòt Limyè and Chapter 1 finished with
the animated intro, **Sun Nov 1**; Milestone 2, battles and Xaraguá, **Sun Nov 15**; release of Chapters 1
and 2, **Sun Nov 22**. Your next quest asks: approve the secret items and the intro storyboard (side quests approved and built Oct 14) by
**Fri Oct 17**; art drop 1 (six character sets and three intro illustrations) by **Fri Oct 24**.

## What's in the box

| # | Component | Spec | Print file (built by) | Art needed |
|---|---|---|---|---|
| 1 | **Game box** | Telescoping (lid + base) about 12.5" × 12.5" × 3", fits the folded board flat on top. Side panel: **2–8 players · 60–150 min · best with 3–6** | `print/box-*.png` (to build) | Logo ✔, board map ✔ |
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

## Resource tokens: how many
Showing a total uses (total ÷ 5) tokens on the ×5 side plus (the remainder) on the 1 side, so any total up to 24 takes
at most 8 tokens and up to 29 takes 9. Players make change with the supply at any time. 60 of each kind lets all eight players hold 7 tokens of every kind
at once (a typical holding is 3–5) with a few to spare for tokens that go missing.

## Two orders

Splitting it lets the board go early while the card art is still being painted. For a reorder, put both
saved projects in one cart.

| Order | What | Order by | Shipping |
|---|---|---|---|
| **A** | Board (2) | **Mon Oct 20** | Standard |
| **B** | Box (1), cards (3, 4, 10b, 13), player boards (5), standees (6), tokens (7, 8, 9, 10), round marker (9b), score pad (10c), dice (11), rulebook (12) | **Mon Nov 3** | Expedited |

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
