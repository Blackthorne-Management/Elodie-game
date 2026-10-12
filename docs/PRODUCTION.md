# Production: one complete, boxed copy of Bloodlines (and every reorder after it)

Everything is made by **BoardGamesMaker** (boardgamesmaker.com): box, board, cards, rulebook, dice, pawns and tokens,
with no minimum order. Each piece is saved there as a project, so a second copy is just "reorder" on each project.
All print files are built by scripts in this repo from the art in `art/`, so they can always be rebuilt.

**Target:** in hand by **Sunday, November 22**. BoardGamesMaker prints in China and ships from there: allow 2–3 days
of production plus 1–2+ weeks of shipping, and pay for expedited shipping on anything ordered after October 20.

## What's in the box

| # | Component | Spec | Print file (built by) | Art needed |
|---|---|---|---|---|
| 1 | **Game box** | Telescoping (lid + base) about 12.5" × 12.5" × 3", fits the folded board flat on top | `print/box-*.png` (to build) | Logo ✔, board map ✔ |
| 2 | **Game board** | 24" × 24" quad-fold, 7200 px | `print/board-24in.png` (`npm run print:board`) | Map ✔ (needs the 4096 file), seats or crests |
| 3 | **Action deck** | 126 cards, 63 × 88 mm, one shared back | `print/cards/card-*.png` (`npm run print`) | Card art 1–126, card back |
| 4 | **Character cards** | 32 tarot cards (8 houses × Gen I–IV), own back | `print/characters/*.png` (`npm run print`) | 32 portraits, crests |
| 5 | **Player boards** | 8, one per house: Influence, Fear and Wealth tracks 0–15, Heart Token spaces, Grudge area, turn summary | `print/mats/*.png` (to build) | Crests |
| 6 | **Pawns** | 8 standees on plastic stands, the house's Gen I portrait (or crest) | `print/standees/*.png` (to build) | Portraits or crests |
| 7 | **Heart Tokens** | 32 round chipboard tokens (3 per player + spares) | `print/tokens/*.png` (to build) | — |
| 8 | **Grudge Tokens** | 40 round tokens, 5 per house, crest on the front, plain back (also used for the house lottery) | `print/tokens/*.png` (to build) | Crests |
| 9 | **Markers** | Wooden cubes: 8 blue (Influence), 8 red (Fear), 8 gold (Wealth), 1 white (round) | stock pieces | — |
| 10 | **Status tokens** | New-heir shields, truce, La Marca brand, Specter and similar reminders (about 30) | `print/tokens/*.png` (to build) | — |
| 11 | **Dice** | 2 six-sided dice (stock, or custom-printed faces) | stock / `print/dice/*.png` | — |
| 12 | **Rulebook** | Saddle-stitched booklet, about 20 pages, from the in-app rule guide (`src/data/rules.ts`) | `print/rulebook.pdf` (to build) | Board, card and portrait art for pictures |
| 13 | **Reference cards** | 8 turn-summary cards (tarot size, with the character cards) | `print/characters/reference-*.png` (to build) | — |

## Two orders

Splitting it lets the board go early while the card art is still being painted. For a reorder, put both
saved projects in one cart.

| Order | What | Order by | Shipping |
|---|---|---|---|
| **A** | Board (2) | **Mon Oct 20** | Standard |
| **B** | Box (1), cards (3, 4, 13), player boards (5), standees (6), tokens (7, 8, 10), cubes (9), dice (11), rulebook (12) | **Mon Nov 3** | Expedited |

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
