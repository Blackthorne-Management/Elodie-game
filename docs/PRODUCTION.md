# Production: one complete, boxed copy of Bloodlines (and every reorder after it)

Everything is made by **BoardGamesMaker** (boardgamesmaker.com): box, board, cards, rulebook, dice, pawns and tokens,
with no minimum order. Each piece is saved there as a project, so a second copy is just "reorder" on each project.
All print files are built by scripts in this repo from the art in `art/`, so they can always be rebuilt.

**Target:** in hand by **Sunday, November 22**. BoardGamesMaker prints in China and ships from there: allow 2–3 days
of production plus 1–2+ weeks of shipping, and pay for expedited shipping on anything ordered after October 20.

## Open items (the one checklist; keep it current)

Claude brings this list up at every milestone of any work in this repo (the quest included), most urgent first,
and ticks items off here as they land. Last updated **Oct 27** (the remaining print files).

**Physical game (BoardGamesMaker)**
- [ ] **Board (order A, Mon Oct 20):** the 4096 map (`art/board/board-dark-4k.jpg`) and the 8 seat buildings
  (`art/seats/`, each its house's quest capital building, approved Oct 15) are in. Proof `print/board-24in.jpg`
  (`npm run print:board`) rendered Oct 15: **approved by the owner Oct 19**; order Mon Oct 20.
- [x] Xaraguá on the board: checked Oct 16. The proof reads XARAGUÁ, House Yaguana (seat Y), and the labelled guide
  (`docs/art/board-guide-labelled.png`) now says Xaraguá too (it said Moa'olani).
- [x] 8 crests.
- [ ] Card art: 20 of 126 in `art/cards/` (anything missing on Oct 31 prints in the no-picture design).
- [ ] Card back.
- [ ] 32 character portraits (none yet in `art/characters/`; prompts in `docs/art/CHARACTER-PROMPTS.md`).
- [x] Box and card boxes: `print/box-12.5x12.5x2.pdf`, `print/card-box-action.pdf`, `print/card-box-tarot.pdf` (Oct 15).
- [x] Print files built Oct 27 (all rebuildable, text from `src/data`): player boards (`npm run print:mats`),
  standees (`print:standees`), tokens (`print:tokens`), Legacy cards (`print:legacy`), reference cards
  (`print:reference`), score pad (`print:scorepad`), rulebook (`print:rulebook`, 16 pages). Proof sheets:
  `print/preview-{mats,standees,tokens,legacy,reference,rulebook}.jpg`. Rebuild the rulebook, reference and Legacy
  cards after the Oct 31 text freeze.
- [ ] **Before order B (Mon Nov 3), confirm on BoardGamesMaker's product pages** (assumed sizes, flagged in "Print
  file specs" below): player-board size and material, standee size and stand, 1" round tokens, rulebook US Letter,
  Legacy cards at tarot size. Standees switch from crests to the Gen I portraits with one line in
  `src/assets.config.ts` (`PRINT_ART.standeeFace`) once the portraits are in.
- [ ] **Fri Oct 31:** rules and card text freeze. **Mon Nov 3:** approve proofs, order B (expedited).

**Digital game**
- [ ] Balance watch (not retuned): Dorini at 3 players about 1.20x; Ironvow and Agnivansh at 6 about 1.13x;
  Suzumori at 6 about 0.86x; Kay Soley at 2 to 4 slightly low. Decide before the Oct 31 freeze.
- [ ] Owner to decide: hide the Hand Card discard pile online (it is face down at the table).
- [ ] Owner to decide: a "Story mode" link from the board game menu to `/quest/`.

**Quest art (updated Oct 27):** art drop 1 is in (Oct 16): Gianna, Yari, Azzy, Anissa, Elodie Limyè, Patricio young
and old, Anicette young and old, Mother Solange, the Quiet Crown, the Sun Locket, Solange's Quill, the battle stances
and the boar. Still missing from drop 1: Cacique Anaco (section 12) and the gaze emblem (1b). Art drop 2, the named
characters of Chapters 1 to 12 still drawn as placeholders (prompts in `docs/quest/ART-PROMPTS.md` sections 11 to 20):
Caona, young and old Benny, Thorne, the marine lieutenant, the Crown captain (Ch 1 and 2); Rael, Rivera, Jaime (Ch 3);
the Regent, Hollis, Coralie (Ch 5); Bayarmaa, Grimvald, Hrafn (Ch 6); Haru, the Paper Fox (Ch 7); Vikram, Aiyana, Seth
Dhanraj (Ch 8); Edmund, Jordyn, Sebastian, the Almoner veiled and unveiled, Rosalind (Ch 9); Rahel, Patricia, Joaquin,
Ti Jak (Ch 10); Hale (Ch 11). No prompts yet for: the behique, Cresswell, Amanda, Nancy, Zelia, Samira, Qasim, Layla,
the herald. Townsfolk, soldiers and creatures stay as drawn placeholders.

**The quest** (dated schedule: `docs/quest/SCHEDULE.md`): Milestone 1, Pòdlimyè and Chapter 1 finished with
the animated intro, **Sun Nov 1**; Milestone 2, battles and Xaraguá, **Sun Nov 15**; release of Chapters 1
and 2, **Sun Nov 22**. The animated intro is **in the game (Oct 16)**: it opens a new game, a saved game opens on its title,
and "Watch the intro" is in the System menu. Music and sound effects are **in the game (Oct 16)**. Your next quest asks: art drop 1 (the character sets) by **Fri Oct 24**.

**Quest, Chapter 3 (Oct 21):** The Trial of Blades is built on branch `chapter3` (Cenizal's eight maps, the trial as a
scripted loss with La Promesa de Benny, the forge Echo, Benny's tunnel, the camp; Rael's family in their settled roles).
Waiting on the owner: confirm Rivera stays silent at the door for the reveal and Jaime leaves (it decides who knows);
art drop 2 for Rael, Rivera and Jaime (`docs/quest/ART-PROMPTS.md` 13); the Spanish words for the phrasebook check
(`quest/src/data/lang/spanish.json`).

**Quest, Chapter 5 (Oct 22):** The Parley is built on branch `chapter3` (Eightgate's seven maps, the Regent's
welcome, Tati Coco and the seamstresses, the sealing Echo and the drawer puzzle, the clause read aloud in the Parley,
the fitting, the Iron Gate; Deserters' Road, the petition round and the four voices as the required quests). Waiting
on the owner: whether Coralie knows the family secret (built as Chapter 4 has it: she knows and deflects; one object
to change); art drop 2 for the Regent, Hollis and Coco (`docs/quest/ART-PROMPTS.md` 14). Noted: Chapter 2's required
side quests (merged Oct 22) put the party one level higher from Chapter 3 on (Chapter 2 ends at 10, target 8).

**Quest, Chapter 6 (Oct 22):** The Stolen Standard is built on branch `chapter6` (Ordvik's six maps, the fair in
uproar, the Moot and Bayarmaa's bond, the day's three required things (Grandson of the Steppe, The Winter Stores, the
oath debate), the fjord's five swaps and Sarnai's raid, the herd, Grimvald, the horn and the price, the longship).
Waiting on the owner: the proposal names (the lawspeaker Ketil, the trading jarl Sigrún, the Crown's envoy Pelham, the
envoy in white Chuluun, the herder Oyuun; built by role until approved); art for Bayarmaa, Salkhi, Torvald, Grimvald
and Sarnai (`docs/quest/ART-PROMPTS.md` 15); the Mongolian and Old Norse words (`quest/src/data/lang/`) for the Nov 18
check. Noted: Chapter 6's story steps pay 65 XP (the line without side quests was at its limit).

**Quest, Chapter 7 (Oct 22):** The Fog Files is built on branch `chapter7` (Kirinoura's seven maps, the longship's
voyage, Haru's three sightings, the Hall's gate until the lantern hour, the day's required things (The Spy Ledger with
Kayla and the sealed stacks, the silence debate on the middle bridge), Haru joining at the lantern hour, the fog maze
with Sayo's lantern code, the marsh posts and the boats home (Lanterns for the Lost), the file house's screens with the
pegged anchor, Sayo's spy map read with Kayla's glyph card, the Paper Fox in disguise, the files read, the petition and
the price). Waiting on the owner: the proposal names (Kaede is used as the outline settled her; the signal master, the
keeper of files, the Crown's observer and the broker are built by role until approved); art for Haru, Kayla, Kaede,
the Paper Fox and Sayo (`docs/quest/ART-PROMPTS.md` 16); the Japanese words (`quest/src/data/lang/japanese.json`, all
unverified) for the Nov 18 check. Noted: Chapter 7's story steps pay 44 XP; the route ends at 19, the line without
side quests at 17. Not built yet: K-1, K-4 (the Nightingale Key), K-5 (the voyage on to Jwaladesh is built with Chapter 8).

**Quest, Chapter 8 (Oct 22):** The Dying Flame is built on branch `chapter8` (Agnipur's six maps, the voyage from
Kirinoura, Aiyana on the dyers' roof, the Court at noon and Vikram's duel, the day's three required things (The Lamp
Relay, The Anonymous Oil on the salt road, the hesitation debate), the night lamp's hour, Arjun's charge in the Echo
with Patricio's hand on the taper, the roof mirrors and Anissa's disc, the flame caught in the beam and Vikram joining,
Seth Dhanraj in the oil store, the price at dawn). Waiting on the owner: the names by role (the senior Keeper, the
chamberlain, the Crown's oil factor, the chief runner, the carter; Meera, Aiyana and Seth Dhanraj as the outline has
them); a read of Aiyana's lines (`docs/quest/design/FAMILY.md`, Chapter 8); art for Vikram, Aiyana, Meera, Arjun and
Seth Dhanraj (`docs/quest/ART-PROMPTS.md` 17); the Hindi words (`quest/src/data/lang/hindi.json`, all unverified) for
the Nov 18 check. Noted: Chapter 8's steps pay 60 XP; the route ends at 21, the line without side quests at 19;
Jwaladesh's price can be as low as 4 of 8, so Agnivansh can be the betrayer. Not built yet: J-1, J-4 (the Unbroken
Wick), J-5 (the voyage on to Aldermoor is built with Chapter 9).

**Quest, Chapter 9 (Oct 22):** The Regent's Keep is built on branch `chapter9` (Kingsmere's six maps, the voyage from
Agnipur and the Mere Stair in the rain, Sebastian's bill, the press-gang and Edmund joining, the Regent's refusal, the
day's four (The Purge List with the bog chapel and one door too late, the One Hand debate, Jordyn's offer in the close,
Sebastian at the organ), the eve, the Toccata and the postern, Thomas's record in the Echo, the mirrored drawer and the
panel behind the shelf (The Crown Chronicle), caught and arrested, the cells, the Assize and the Hushed unmasked as
Chapter 1's veiled woman by the mill, the three defiances, the price at dawn, the voyage home). This meets the **Nov 8
decision date** for Chapter 9 (on its branch, not merged). Waiting on the owner: a human read of every Jordyn,
Sebastian and Almoner line, and the archive scene against the locked rule (reviewer prompt
`docs/quest/reviews/reviewer-prompts/2026-10-22-review-chapter9-build.md`); the names by role (the printer, the
clockmaker, the keep's steward, the assize clerk, the Crown magistrate, the witness bishop, the sorry constable);
art for Edmund, Jordyn, Sebastian, the Almoner and Lady Rosalind (`docs/quest/ART-PROMPTS.md` 18). Noted: Chapter 9's
steps pay 70 XP; the route ends at 24, the line without side quests at 22; the dissidents' Fear can be short (5 or 6
of 8). Chapter 9 settles two of the Dec 1 questions as Claude's calls, still the owner's to overrule: the Aldermoor
ledger (coded accounts on the Ash Road; Haru needs the key) and Patricio in Aldermoor (under a flag of truce, in
the archive while the war council sits). Not built yet: Al-1, Al-4 (the Clock That Waits), Al-5, Calm and Comfort.

**Quest, Chapter 10 (Oct 22):** The Muster is built on branch `chapter10` (from `chapter9`; the ten Zetwal maps on
conditions and the new mill cellar: the long pier and Joaquin handing Free Brasador to Azzy, the seven camps with each
house's share in the Journal, the Speaker's gate and the three feuds, Jordyn's watch with Rahel and Patricia, the
kitchen and the four accounts, the blessing at the lamp, Patricio's stone, Z-6 with the crew and the powder cellar,
Z-3 with Ti Jak, the vote and the chain, the whistle at dusk with Anissa's line, the night under the point (exposed and
turned, or sailed), the signal fire, the tide). Ahead of its **Nov 8 to 10** slot (on its branch, not merged). Waiting
on the owner: a human read of every Rahel, Patricia, Jordyn, Joaquin and Anissa line (reviewer prompt
`docs/quest/reviews/reviewer-prompts/2026-10-22-review-chapter10-build.md`); the captains named by role (the Suzumori
retainer, the Agnivansh steward, the Dorini admiral) and Ti Jak's mother's name (Odile); Rahel's and Patricia's ages and
looks (`docs/quest/ART-PROMPTS.md` 19). Still open (Dec 1 list): question 13, what old Patricio knows (staged so either
answer fits). Noted: Chapter 10's steps pay 40 XP; the route ends at 25, the line without side quests at 23; on the
headless route the Dorini are the least paid and sail. **Fixed (Oct 22, on the Chapter 11 branch):** the bookshelf id
`hall_records` was used twice (Zetwal's Hall and the Seat's), so the books `lore.zetwal_quiet_tract` and
`lore.zetwal_harbor_tolls` could never be read in Pòdlimyè; Zetwal's shelf is now `hall_harbor_records`, and
`tests/books.test.ts` checks every shelf id is unique. **Built Oct 27** (the three pieces listed as not built): the
board's dispatch (the Hall's chief courier gives the Speaker's dispatch, the acolyte at the Gaze lamp takes it, +1
Influence in Zetwal), the second look at the two books (*The Sun Accord (copy)* after Patricio's answer, *Ash Wars: A
Temple Record* after the four accounts: a line of Gianna's after the last page, or "(again)" on a book already read), and
the Quill bonus at the name stones (with Solange's Quill, Yari walks to the seventh stone and hears the scout's
brother's name from Solange's list, +2 Influence in Xaraguá; it waits on Z-4, which gives the Quill after the release);
`tests/dispatches.test.ts` and `tests/books.test.ts` hold them.

**Quest, Chapter 11 (Oct 22):** The War of the Harbor is built on branch `chapter11` (from `chapter10`; the war's
layers on nine Xaraguá maps, no new map: the landing in seven columns, the gun on the headland, the flank in four
houses or the house that stood, the gardens' road and the hill camp, the elders' debate, the Ninth Thumbprint and
Harbors Lie, the conch, the village by dusk, Thorne, Anaco in the cellar, Caona's stand and the chain post's pin in the
pier's memory, the Turn with the signet's public lie, Trust (Hale, Rael in the four) and Strike (Rael's vanguard, Azzy
furious and staying), the truth by lamplight, old Benny and Nancy and the Song House, the caney and the card;
`?chapter=12` at Eightgate's Ardencia Gate). Ahead of its **Nov 10 to 13** slot (on its branch, not merged). Waiting on
the owner: a human read of every Rael, Benny, Nancy, Anaco, Yari, Azzy and Anissa line in the war (reviewer prompt
`docs/quest/reviews/reviewer-prompts/2026-10-22-review-chapter11-build.md`); the Benny contradiction is settled (Claude's call: the
passive now reads "He kept the oath, whatever it cost", matching Rael's private line); Hale's look (`docs/quest/ART-PROMPTS.md`
20); the war's music track (`docs/quest/AUDIO-PROMPTS.md`, a slot plays the Mountain Path's until then). Noted: Chapter
11's steps pay 58 XP; the route ends at 28, the line without side quests at 26; the gardens' road is a long walk (a
step and a question on each side), not a door. **Built Oct 27** (the four pieces listed as not built): the market's
second stock once the harbor is taken (the baker, the carver and the bow-maker back at their burned stalls with a line
each, then new stock: snapper on casabe and soursop juice, a carved cannon charm (tier 26), harbor cotton (tier 24),
the old stock beside it, no tier-28 piece; Claude's call, `docs/quest/design/CAPITALS.md` 2); *The First Oath*'s second
look (after the harbor is taken) and *The Charter (seized copy)*'s (after Thorne is taken); the board's dispatch (salt
from the beach pans: the camp leader on the sand before the gun, the behique at the hill camp by day, +1 Influence in
Xaraguá; Claude's call); the voyage to Eightgate as a scene (after the card, the fleet sails north up the strait to
Ardencia's strand, `xaragua_ardencia` on Trust with Ardencia's sails leading, `xaragua_ardencia_strike` with the
trader leading; then the Ash Road narration at the Ardencia Gate). The smoke test walks Chapter
11 in a browser (Oct 22, after the merge onto Chapter 10): its fights won, the story flags, the Turn's route and the
volleys left agree with the simulator's. **Fixed (Oct 22, a game bug the smoke found):** a fighter whose Attack opens
their weapon moves had no working Attack while Hushed (Hale's Sealbearer hushed Rael and the fight stalled); Attack now
strikes plainly while the moves are blocked, as COMBAT.md's Hushed row says. **Fixed (Oct 22):** Chapter 11's lamp-oil
seller (`lamp_oil_war`) opened the cassava-bread stall's shop (`xaragua_food`) after the Ninth Thumbprint lines; no shop
sells lamp oil, so she now only speaks (Claude's call; `tests/war.test.ts` holds it).

**Quest, Chapter 12 and the Epilogue (Oct 22):** The Claim and the Hearing are built on branch `chapter12` (from
`chapter11`; the ash road and Azzy's question on Strike, the seven armies at the gates, Elodie in the arch and in her
rooms (the new map `seat-rooms`), Volume One, the corner's debate, the tokens on the steps, the night and the bell, old
Patricio at dawn, the chairs set, the Echo of the eighth chair (puzzle `seat_chair`), the count, the Regent's Challenge,
Azzy's share, renounce or (the dark route only) Challenge, the chairs filling, Clause Six, the Regent arrested, Rael's
signet; then the Hearing nine days later, the witnesses, the verdict, Accord Stability and the Just, Hollow or Iron
ending, The End and the cast). The whole quest now plays from the intro to the credits on the headless route. Ahead of
its **Nov 13 to 16** slot (merged Oct 22 onto Chapter 11's merge). Waiting on the owner: a human read of every Elodie, Rael, Azzy,
Benny, Patricio and Anissa line in the Claim and the Hearing (reviewer prompt
`docs/quest/reviews/reviewer-prompts/2026-10-22-review-chapter12-build.md`); the dedication line for the credits (the
cast is in; the dedication is a slot); the Stability dials if Strike should reach the Just Throne more often
(`quest/src/config.ts STABILITY`; built: Trust with a pardon 85, Just; Strike with a pardon 50 to 62, Hollow, unless Azzy
shares); looks for the Master of the Chairs, the treasurer's daughter and the corner's follower; the Hearing's music
(a slot plays the Hall's until then). Still open: question 13 (what old Patricio knows; the build fits either answer).
Noted: Chapter 12's steps pay 120 XP; the route ends on 30 (the cap), the line without side quests on 28; the Regent
was tuned down from the outline's adds (the owner's HP x6, ATK x1.6, MAG x2.0 stand) and runs 40 actions at 30, 41.6
at 28 with the roster four. **Built Oct 27** (the three pieces listed as not built): the books' second looks
(*Petitions of Breach* after the original is found, *The Council of Eight* after the Claim stands; the outline's line for
the second, "never used. Used.", contradicts the built book, which has the council sitting until the war, so it reads
"Fifty years of dust on eight chairs. Not this morning.": Claude's call), the voyage to Eightgate as a scene (Chapter
11's paragraph), the board's dispatch (the Concourse's contract board pins the Hall's roll of the eight houses for the
company at the north gate; Tío Joaquin reads it at the Ardencia Gate, +1 Influence in Eightgate; offered only while Free
Brasador stands there, until the Hearing is called; Claude's call). None of the dispatches or looks is on the arrow's
gate. The smoke test walks Chapter 12 and the Epilogue in a browser (Oct 22, after the merge; from
`chapter11-end`): the story flags agree with the simulator's, the Regent won, Accord Stability 95 before the verdict and
100 after the pardon, the Just Throne, The End, the cast and the credits, the title, and the save marking the quest
complete. No game bugs found; one test fix (a Challenge's `wounds.*` are the browser fight's HP, which the simulator does
not write, so they are not compared).

**Quest story questions for the owner** (from the design pack, `docs/quest/design/STORY.md` section 6; one at a time,
most urgent first; settled so far: the capital's name, where the Accord was signed, who the Hushed is, chapters):
- [x] **Approved Oct 20:** Samira's *Daftar* skill spends **gold** instead of the
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
| 1 | **Game box** | Telescoping (lid + base) 12.5" × 12.5" × 2" (BoardGamesMaker template, chosen Oct 15), fits the folded board flat on top; everything under it must stay within about 33 mm. Side panel: **2–8 players · 60–150 min · best with 3–6** | `print/box-12.5x12.5x2.pdf` (`npm run print:box`; proof Oct 15) | Logo ✔ (owner upscaling it), board map ✔ |
| 2 | **Game board** | 24" × 24" quad-fold, 7200 px | `print/board-24in.png` (`npm run print:board`) | Map ✔ (needs the 4096 file), seats or crests |
| 3 | **Action deck** | 126 cards, 63 × 88 mm, one shared back | `print/cards/card-*.png` (`npm run print`) | Card art 1–126, card back |
| 4 | **Character cards** (generation cards) | 32 tarot cards (8 houses × Gen I–IV), own back | `print/characters/*.png` (`npm run print`) | 32 portraits, crests |
| 5 | **Player boards** | 8, one per house: spaces for Influence, Fear and Wealth tokens, Heart Tokens and Grudges, the turn summary | `print/mats/mat-<house>.png`, `print/mats/mats.pdf` (`npm run print:mats`) | Crests ✔ |
| 6 | **Pawns** | 8 standees on plastic stands, the house's Gen I portrait (or crest) | `print/standees/standee-<house>-{front,back}.png`, `standees.pdf` (`npm run print:standees`; crests now) | Portraits or crests ✔ |
| 7 | **Heart Tokens** | 32 round chipboard tokens (3 per player + spares) | `print/tokens/heart-*.png` (`npm run print:tokens`) | — |
| 8 | **Grudge Tokens** | 40 round tokens, 5 per house, crest on the front, plain back (also used for the house lottery) | `print/tokens/grudge-<house>-front.png`, `grudge-back.png` | Crests ✔ |
| 9 | **Resource tokens** | 180 round double-sided chipboard tokens, 60 each of Influence (crown), Fear (crossed swords) and Wealth (coins): **1** on the front, **×5** on the back | `print/tokens/resource-*.png` | Icons ✔ |
| 9b | **Round marker** | 1 wooden cube or pawn for the board's round track | stock piece | — |
| 10 | **Reminder tokens** | 27: 8 new-heir shields, 1 La Marca brand, 2 Grito de Guerra markers, 8 Specter markers, 8 Used tokens (once-per-game powers). Lasting cards are their own reminder: they stay face up in front of the player until they end | `print/tokens/reminder-*.png`; counts and files in `print/tokens/tokens.json` | — |
| 10b | **Legacy cards** | 8 small cards, one per house, showing its Gen I passive, except Brasador's, which reads "+1 Fear on kill." (rules-decisions 87; `legacyPassive` in `src/data/houses.ts`). Yaguana's Ancestor's Voice draws one blind from the houses not at the table | `print/legacy/legacy-<house>.png`, `legacy-cards.pdf` (`npm run print:legacy`) | Crests ✔ |
| 10c | **Score pad** | 50-sheet pad, one column per player: kills and Reckonings (read by Sudden Death, Reinado de Cenizas and Elodie's Reckoning; the fallen-houses column was dropped in rules-decisions 87) | `print/scorepad.pdf` (`npm run print:scorepad`) | — |
| 11 | **Dice** | 2 six-sided dice (stock, or custom-printed faces) | stock / `print/dice/*.png` | — |
| 12 | **Rulebook** | Saddle-stitched booklet, about 20 pages, from the in-app rule guide (`src/data/rules.ts`): the **core rules** (about 1,600 words, what a first game needs) first, then the **appendix** (rules-decisions 87) | `print/rulebook.pdf` (`npm run print:rulebook`): 16 pages (cover, contents, core rules, appendix with The Eight Houses and Every Card, back cover) | Board ✔, cards ✔ (portraits when painted) |
| 13 | **Reference cards** | 8 turn-summary cards (tarot size, with the character cards), printed from the **Reference Card** section of `src/data/rules.ts`: the turn, the ◎ Target card list and the lasting-card durations (these live on the card, not in the booklet; rules-decisions 87). | `print/characters/reference-<house>.png`, `print/reference-cards.pdf` (`npm run print:reference`) | — |

## Print file specs (built Oct 27)

Every file is 300 dpi or more with BoardGamesMaker's 1/8" bleed and a further 1/8" safe margin, except the tarot
cards, which match the character cards. Where the docs give no BoardGamesMaker template size, Claude picked the
standard one (marked **assumed**); check each against the product page before ordering.

| Component | Cut size | File size | Product (assumed where marked) |
|---|---|---|---|
| Player boards | 10" × 7" landscape | 3075 × 2175 px (10.25" × 7.25" at 300 dpi) | **Assumed** "Custom Size Game Board", non-folding. **Material open:** 8 boards on 2 mm chipboard stack 16 mm, which with the board, rulebook and score pad leaves too little of the box's 2" for the containers (the Action card box alone is 24 mm). Safer: the thinnest board BoardGamesMaker offers, or a card-stock sheet. |
| Standees | 1" × 2" | 375 × 675 px per face, front and back | **Assumed** chipboard standee in the 23 × 19 × 12 mm plastic stand (one board square is about 23.4 mm). The bottom 1/2" sits in the stand. |
| Tokens (all 279) | 1" (25.4 mm) circle | 375 × 375 px per face | **Assumed** "Custom Circle Game Tiles 1\" Micro Size". Every token has two faces (Grudge Tokens share one plain back, so the lottery stays blind). |
| Legacy cards | Tarot 2.75" × 4.75" | 1050 × 1752 px (about 350 dpi) | Printed with the character cards (same deck, same back): Claude's call, see below. |
| Reference cards | Tarot 2.75" × 4.75" | 1050 × 1752 px | With the character cards, one per house (the same text, the house's crest). |
| Score pad | 8" × 5" landscape | 2475 × 1575 px, black only | "Custom Score Pad Large Size" (80 gsm, black print), 8 player columns. |
| Rulebook | US Letter 8.5" × 11" | PDF pages 8.75" × 11.25", vector text | **Assumed** size; saddle-stitched, 16 pages (a multiple of 4; the script adds Notes pages when needed). |

**Calls made (Claude's call, flagged for the owner):**
- **Legacy cards at tarot size**, not "small": they ride in the tarot box, and Yaguana's blind draw needs the same
  back as the cards it is drawn with. A separate mini-card deck would need its own back and product.
- **House Yaguana's own Legacy card** prints Ancestor's Voice, which no one can ever hold (Yaguana is at the table
  whenever it is used). It is printed because the spec says 8; leaving it out is an option.
- **Heart Tokens and reminder tokens** show the same face on both sides; resource tokens read "1" and "×5" (the rule
  guide says "1" and "5").
- **Player boards** show a spot for each once-per-game power (for its Used token; Dorini has none) and the Specter
  marker, and three Grudge spots (hold more beside the board).
- **The rulebook** includes Every Card, as the rule guide's appendix does; the reference card section stays off it.

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
3. If any art or rule changed since, rebuild the files here first (`npm run print`, `npm run print:board` and the
   other `print:*` scripts in `package.json`) and replace
   the images in the affected projects before ordering.
