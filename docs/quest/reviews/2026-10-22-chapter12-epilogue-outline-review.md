# Second review: Chapter 12 (The Claim) and the Epilogue (The Hearing) outline (Oct 22)

*The independent second review of `2026-10-22-chapter12-epilogue-outline.md`, saved in full. Read against `CLAUDE.md`
(the owner rules: shown not told, Anissa never hit and never joking, keep building, one question at a time),
`PLAN-ALL-CHAPTERS.md`, `QUEST-BUILD-GUIDE.md` 5.6 to 5.8 and section 13 (the settled answers, Azzy's mother among
them), `design/STORY.md` (Chapters 1, 3, 5, 9 to 12, the Epilogue, threads, tone, open questions 3 and 13),
`design/FAMILY.md`, `design/COMBAT.md` (6, 13.3 #10, 15, 16), `design/CAPITALS.md`, `design/SIDE-QUESTS.md`,
`design/SECRET-ITEMS.md` 9, `docs/bloodline-rulebook-draft.md` section 8 and **`docs/rules-decisions.md` "Winning"
(which overrides the rulebook)**, the Chapter 9, 10 and 11 outlines with their reviews and decisions (the Almoner is
Chapter 1's veiled woman; Anissa's Muster line, both; on Strike Azzy stays, furious), and the built game at HEAD
(`0f653af`, Chapters 1 to 9): `tools/maps/seat.ts`, `data/dialogue/seat.ts`, `data/dialogue/ardencia.ts`,
`data/dialogue/zetwal.ts`, `data/dialogue/skarragol.ts`, `data/dialogue/jwaladesh.ts`, `data/dialogue/aldermoor.ts`,
`data/books.ts` (the nine Seat books, read in full), `data/rpg.ts`, `data/sideQuests.ts`, `data/quests.ts`,
`data/battles.ts`, `data/gameOver.ts`, `data/credits.ts`, `data/cards.ts`, `engine/battle.ts`, `engine/gameOver.ts`,
`engine/debate.ts`, `engine/rpg.ts`, `scenes/FieldScene.ts` (the stage runner, the Credits screen), `config.ts`. No
repo file other than this one was changed; no git state was touched.*

*The sim: HEAD's `quest/` taken with `git archive` into
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch12rev/snap/quest/`, with one scratch script,
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch12rev/snap/quest/tools/ch12-sim.ts`. Full
outputs: `/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch12rev/regent.txt`,
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch12rev/tune.txt`,
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch12rev/azzy.txt` and
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch12rev/fields.txt`. Section 5 has the method.*

---

## 1. Verdict

The outline is the right shape for the last chapter and most of its parts are good: the mother's chapter at last,
the chairs set by hand and filled by people, Rael kneeling with the signet on the step, the token glowing at the pardon
("It's the same light, Gigi."), "Never." from the other parent, the Iron Throne told by who leaves the Hall, the
Hearing turned the right way up from the Assize. It respects Anissa (never a target, never a joke) and keeps open
question 13 open. Build it, **after** these changes, which are about payoff more than mechanics:

1. **The Seventh Clause, the thread that starts on Chapter 1's blank stone, is never resolved on screen in the
   release** (3.1). The petition "will be heard today" and never is; the clause is struck only by the post-release
   Seventh Ribbon; the Just card's "Xaraguá's harbor by law" is told. The Hall already has the built machinery to hear
   it (the Petitions of Breach book's blank answers, the Founding Compact's Clause Six). Hear it at the Claim.
2. **The climax runs in the wrong order** (3.2). The guide ("The Regent declares a Challenge and they fight. Azzy ...
   chooses on the spot") and COMBAT 13.3 #10 ("On defeat: Azzy's choice") put Azzy's choice after the Regent; the
   outline's rulebook reading has the claimant's left backwards (facing the Hall, her left is the Regent's side), and
   it ignores `rules-decisions.md` [42] (the claimant strikes first; damage carries between Challenges) and [45] (the
   threshold is no longer "ten, or six in one").
3. **The Claim ignores what the Hall built for it** (3.3): "Limyè? A temple name, not a house." (*The Claimant
   Families*), the Regent's Commission that "runs until a claimant stands on the Throne tile with the houses behind
   her. It does not say how many houses.", Clause Twelve ("no steel is drawn inside the eight gates"), the council that
   *did* sit until the Ash Wars, and the chamberlain's own promise to set the tokens. Used, they give the Claim its
   public reveal of Gianna's names, a legal reason for the Regent's Challenge and a reason for the party to fight.
4. **The last boss is a 30-action fight in which nobody falls** (3.4): 0 falls in 240 runs at tier 24 across the
   three variants, which are indistinguishable; the tier-28 shop changes one action; Azzy's Challenge is 8 to 9 of
   Gianna's actions and is almost never lost. A tuning that measures well is in 3.4.
5. **Accord Stability, as dialed, does not do what section 4.2 says** (3.5): every pardon save I can build reaches
   Just except the darkest Strike-and-betrayed-and-Challenged one; Strike-and-pardon is about 100, not 62; the
   Influence-over-Fear test is a no-op (the route reads Influence 73, Fear 2).
6. **The families' endings are thin where the game made promises** (3.7): Benny and Rael (the oath and the goal) never
   meet; Azzy and Rael end on "he does not turn"; Elodie and Rael have no moment; two of Elodie's new lines
   contradict the built Chapter 5 and the guide's settled answer about Azzy's mother; the Regent, who hunted Anissa,
   is walked off and forgotten (3.6).

None of these needs the owner except as listed in section 8; two questions stand, with the recommendations adjusted.
The estimate holds at about 4 days with the fixes (section 7).

---

## 2. What I agree with

- **Elodie's chapter.** The arch, the clerk who writes it down a second time, "Anissa." / "Mama.", the rooms with the
  clerk outside "for once", the walk to the rope and no further. The two registers are the right tool.
- **The chairs set by hand and filled by people**, a bare chair for a betrayed house that the camera looks at once.
  It is the cheapest rich picture the ending could have, and it pays every token since Chapter 6.
- **Rael's surrender**: walking up the nave as he walked up the pier, the signet off and on the lowest step, "Make it.",
  Jordyn behind him "not touching him". The pardon's glow (`fx: 'token'`, halves together, a true thing) and "It's
  the same light, Gigi." in the right room; the signet put **in his hand, not on it** (Chapter 3's gesture returned).
- **The question to Anissa** and "Never." from the other parent, in front of the realm. This is the best line in the
  outline; section 3.10 only asks for a clearer first half.
- **The Iron Throne shown by who leaves**: Elodie before the bell, Yari from the eighth chair, Anissa in the empty
  chair with her back to the dais, the execution off-screen behind a stair with one bell. Right for the owner's rule
  and the guide's "A tragedy."
- **No army in the Hall**, the companies as placed pairs at their gates (the Chapter 10 and 11 reviews' finding).
- **Stability as one pure function from a config table, shown once, after the verdict**, never as a meter.
- **The ending staged on the Hall, cards for the houses' fates, the built Credits screen opened by the story, the save
  kept open after the end.** No scroll engine. (The Credits screen itself needs work: 3.13.)
- **Open question 13 kept open**: Patricio and Rael exchange one look; nothing in the Hearing leans on it.
- **The two required quests** are threads' ends, not errands (Se-5 stage 2, Volume One), and the post-Turn debate is
  the right last corner: the Quiet Crown's sincere follower heard before the man who made her confesses.
- **The honest sim note**: the outline says it ran no sim and why. The day-1 sim plan (tier-24 gear, both orders,
  falls party-wide, Break Free in the bot) is the Chapter 11 review's method.

---

## 3. Findings, most serious first

### 3.1 The Seventh Clause is never resolved on screen in the release (high: the game's spine)

**Evidence.**
- STORY 4, threads: the Seventh Clause runs Ch. 1 (six clauses, seven ribbons, **the blank seventh line on the
  Marshal's stone**), 2, 4, 5, 9, and "Pays off: **Ch. 12 and the Hearing** (Rael as Warden of Oaths enforces it)".
- `SECRET-ITEMS.md` 9: the Seventh Ribbon (Se-4, "10 Very hard", **after the release**) is what lets Gianna "strike the
  Seventh Clause at the Claim ... Xaraguá's harbor is returned by law before the Hearing begins."
- The outline: Hollis sets the original petition on the eighth chair, "It will be heard today. A Claim hears
  everything in the Hall." (beat 3). Nothing hears it after that. The Ribbon's hook is one optional line (beat 4). The
  Just card says "Xaraguá's harbor by law"; "Zetwal's seventh line cut into the Marshal's stone at last, in Patricio's
  hand" is a card line.
- Built, waiting for exactly this scene (`data/books.ts`):
  - *Petitions of Breach*: "The petition is carried to every chamber, and **every envoy answers it in the record**. A
    petition no one carries is not refused. It is simply never heard ... One, from the cacique's house of Yucayeque ...
    is marked 'received' and nothing else ... **The space for the chambers' answers is blank. Someone has drawn a small
    circle round the blank, in ink that is not old.**"
  - *The Founding Compact*, Clause Six: "every clause of a treaty made at the Seat is read aloud to every signatory
    before it is sealed. **A clause not read is not agreed.**" ("The Archive's copy is worn thin at Clause Six.")
  - Se-5 stage 1 (built) carried the petition to every door; stage 2 fills the chairs.

**What the player sees.** Twelve chapters about a clause, a harbor and a blank line; at the end, the clause is
mentioned on a chair, the harbor is a card's sentence, and the blank line is filled off-screen in another country.
Without the post-release item (every release player), the Unpaid Debt is never paid in front of them.

**Fix (Claude's call; it uses built rules and adds one short scene, no system).**
- **The petition heard at the Claim, after the chairs fill** (they are its chambers): the chamberlain reads the
  register's line ("Received, forty-nine years ago. Answers: none."), and each house's person, from their chair,
  answers it **in one word or one short line** for the record, in the chairs' order: "Breach." (Elodie for Zetwal,
  Rosalind for Aldermoor: "Breach. The Crown's own record says so.", and so on; a betrayed house's bare chair answers
  nothing and the chamberlain records "no answer"). Hollis writes them into the blank (an object look: the register
  open on the clerk's table). This is the shape the built book describes and the shape Se-5 stage 1 taught.
- **Clause Six read by Hollis**: "A clause not read is not agreed. The seventh was read to a clerk alone. **It was
  never agreed.**" Old Patricio (if the owner keeps him: question 2) speaks here, the sealing only: "I sealed six pages
  under protest. Nobody read me the seventh. I remembered the wrong thing." This is the Seventh Clause's last witness in
  the room where it is heard, which is the guide's proposal for him, in the right scene.
- **The remedy follows the verdict**, which makes the ending a consequence and keeps the Ribbon's reward distinct:
  - Pardon: the Warden of Oaths' first oath is the seventh clause's remedy (the outline's "The first oath on the ledger
    is the seventh clause", kept), and the Just card's harbor line is earned by what the player watched.
  - Exile or execution: the clause is unagreed but nobody is charged with the remedy; the Hollow and Iron cards say so
    ("Xaraguá's petition is heard. Its harbor is not yet returned.").
  - **The Seventh Ribbon (after the release)** still does what its design says: struck *before* the Hearing, by law,
    on every verdict, Yari receives the ribbon, +15 Stability, +10 Concord.
- Journal note *Heard*: "Forty-nine years late, every chair answered Xaraguá's petition. The seventh clause was never
  agreed."
- Cost: about 12 lines and one object look; 0.05 days.

### 3.2 The climax runs in the wrong order, and the rulebook is misread (high: the climax's shape; rules fidelity)

**Evidence.**
- The guide 5.6: "Gianna, standing on the Throne tile, declares her **Claim**. The Regent declares a **Challenge** and
  they fight. Azzy, who also has a claim, chooses on the spot: renounce it in her favor, share it, or (in the dark
  route) Challenge her **too**." COMBAT 13.3 #10: "**On defeat: Azzy's choice.**" STORY 12 the same order.
- The outline puts Azzy first because "the rulebook's order: challengers from the claimant's left, and Ardencia's
  chair is left of the Throne as the Hall faces it". The rule is the **claimant's** left. Gianna on the tile "turns to
  the Hall (a `face` down)": facing south, her left hand is **east**, the side of the Regent's placement (23, 3) and the
  Aldermoor to Jwaladesh chairs; Ardencia's chair (18, 8) is on her right. By the outline's own reading, the Regent
  answers first.
- `docs/rules-decisions.md` overrides the rulebook (CLAUDE.md), "Winning": [42] "the **claimant strikes first** ...
  Several challengers are fought one at a time in seat order from the claimant's left, and **the claimant's damage
  carries between fights**." [45] "What you need to claim ... a combined total **and** a minimum in every pillar.
  There is no one-pillar route any more ... 4-8 players: **9 total, with at least 2 in each**." The outline's
  chamberlain reads the superseded "ten ... or six in one".

**What the player sees.** Azzy's choice comes before anyone has fought, so a Share or Renounce is a speech with no
cost, and the dark-route duel happens with the boss still on the dais (and the last boss then plays after a family
duel, which flattens the climax). The table's players who know the board game hear a threshold that is no longer the
rule.

**Fix (Claude's call: it follows the guide, COMBAT and rules-decisions; record it in STORY 12).**
- Order: the count, the tile, the declaration, **the Regent's Challenge and the fight**, the Regent on one knee;
  then **Azzy's choice on the spot**, in front of a beaten Regent and a Hall that has just watched her win. Share and
  Renounce become a brother's decision about a Throne that is already hers to lose; the dark-route Challenge becomes
  the guide's "Challenge her **too**", and the chairs fill after Azzy's answer.
- **On the dark route, Gianna's HP carries from the Regent's fight into the duel** ([42]); she does not heal in between.
  If that is judged too harsh, record "damage does not carry" as a Claude's call with its reason; do not leave it
  silent. Either way, make her **strike first** in both Challenges (a `BattleDef` flag such as `partyFirst`, about 5
  lines, or order the turn bar) and say so in a tip.
- The chamberlain's count in the realm's words of [45]: "By the Founding Compact a claimant stands on the tile with
  nine of the realm's regard across the three pillars, and two in each." (Read the three numbers in, as written.)

### 3.3 The Claim ignores what the Hall built for it (high: payoff and story logic)

**Evidence** (`data/books.ts`, `data/dialogue/seat.ts`, `tools/maps/seat.ts`):
- *The Claimant Families*: "Rodriguez of Ardencia ... Jean-Philippe of Zetwal ... **Stillwater of Aldermoor, through
  the Crown** ... A claimant must be of a claimant family and must stand with the houses behind her ... Someone has
  written in the margin, in a clerk's small hand: **'Limyè? A temple name, not a house.'**" Chapter 5's curtain scene
  (built): "I took Limyè to honor the goddess, I said. **I took it so no one would count you.**"
- *The Regent's Commission*: "The Regent holds the Throne for the realm. He does not sit it ... **The Commission runs
  until a claimant stands on the Throne tile with the houses behind her. It does not say how many houses.** ...
  'Renewed. Renewed. Renewed.' The last renewal is signed by the Regent himself."
- *The Founding Compact*, Clause Twelve: "**no steel is drawn inside the eight gates.**" (Chapter 5 built no fight
  inside the walls for this reason.)
- *The Council of Eight*: the council **sat** "in full in the year the war began. Its chairs have stood empty since ...
  whoever stood on the Throne tile spoke for all of them, **and only while they let her** ... The Master of the Chairs
  ... keeps the tokens the houses give." The outline (7.4, 14.2) calls it "The old plan, never used."
- The chamberlain, Chapter 5 (built, `seat.ts:358`): "**I will put each on its chair the day someone stands on that
  tile.**" Every built token says "For the chamberlain's chair" (`skarragol.ts:587`, `kuroshi.ts:1070`,
  `jwaladesh.ts:1024`). The outline has the companions set them by night through a new records-room door.
- The outline's count reads "for Gianna Elise Limyè of Zetwal ... and for Azriel Rodriguez of Ardencia"; the formal
  sentence is "by Zetwal and by Ardencia". **Nowhere is it staged that the realm learns she is Rael's daughter**, though
  the Ardencia claim cannot exist without it; Elodie's marriage, hidden for twenty-five years, becomes public by
  implication.

**What the player sees.** A Claim that never says her real names, in the Hall where her mother hid them; a Regent who
challenges because the plot needs a boss; a party drawing steel in the one city where steel is forbidden, without a
word; a council described as "never used" by a book on the shelf that says otherwise.

**Fix (Claude's calls; each is a line or two; the reveal is the owner's dual claim made audible, not a new decision).**
- **The count says the names.** The chamberlain: "The register reads Gianna Elise Limyè of Zetwal. Limyè is a temple
  name, not a house. **Under what name does the claimant stand?**" Elodie, from the rope, in the envoy's voice for the
  last time: "**Jean-Philippe, by her mother. Rodriguez, by her father, Rael of Ardencia.** Count her." (Her Chapter 5
  line answered by her own mouth, in the Hall: the secret ends where it was kept. The clerk writes it.) The chamberlain:
  "...And Anissa Jean-Philippe Rodriguez, of both, below the count." (One line; the thing Elodie feared, said aloud and
  harmless now; it pays `choice.claim_why` "So nobody counts Anissa again" either way.) Then Azzy, by his father's
  house; then **Stillwater**: Rosalind, from Aldermoor's chair, "Stillwater does not stand." (Edmund silent beside her.)
- **The Regent's Challenge has a legal ground**: "The Commission runs until a claimant stands with the houses behind
  her. It does not say how many. **I say these are not enough.**" (On a betrayed save, the camera looks at the bare
  chair here, not later.) It is his register (patient, three moves ahead) and it makes the chairs the stakes.
- **Clause Twelve, read once by the chamberlain** before the fight: "No steel inside the eight gates. Save one: a
  Challenge, met on the floor of this Hall." It is also why the Regent fights with his **chain of office**, not a
  sword (keep the outline's move name; give it a line).
- **Why the party fights a one-to-one Challenge**: the Regent calls "Sealbearers"; the chamberlain: "The Compact says
  the claimant and the challenger. He has brought his seals. **Then she brings her houses.**" The four fighters walk
  from their doors to the dais's foot (shown, `walk` x4): "everyone present" made a picture, and the rulebook's duel is
  kept for Azzy.
- **The tokens**: keep the night scene's lines (they are good), but the companions **hand** each token to the Master of
  the Chairs on the Hall's steps by night, and at the bell **he sets each on its chair** as the party walks the nave
  (shown: one `walk` along the row, eight object looks). It keeps the built promise, and it cuts the records-room door
  and the night route through the Hall (one less map change, one less condition).
- Fix 7.4 and 14.2's "never used" to the book's truth: "The council of eight chairs. Last sat in the year the war
  began." / Just Throne: "The Council of Eight sits. She speaks for it while it lets her." (The book's line, paid.)

### 3.4 The last boss is a long fight in which nobody falls; the Challenge is trivial (high: difficulty)

**Evidence (section 5's sim; the built engine, the outline's numbers as data).** 40 seeds each; Story difficulty;
"falls" are Down or Bound events across the whole party; the built `skills` bot plus Break Free.

| Fight (outline's numbers) | Gear | Order | At 28 | At 29 | At 30 |
|---|---|---|---|---|---|
| Regent x7, Influence | tier 24 | roster | 31.7 actions, **0/40 with a fall** | 30.7, 0/40 | 30.2, 0/40 |
| | tier 24 | glass | 26.6, 0/40 | 25.9, 0/40 | 25.1, 0/40 |
| | tier 28 | roster | 30.9, 0/40 | 30.6, 0/40 | 29.8, 0/40 |
| | start | roster | **53.1**, 5/40 | 51.9, 5/40 | 50.1, 2/40 |
| | start | glass | 31.8, 2/40 | 31.0, 2/40 | 29.1, 0/40 |
| Regent x7, Fear / Wealth | tier 24 | roster | 31.5 / 31.6, 0/40 | 30.7 / 30.7, 0 | 30.2 / 30.2, 0 |
| Regent x10 (COMBAT's) | tier 24 | roster | 46.7, 0/40 | 45.5, 2/40 | 42.2, 1/40 |
| Regent x6 | tier 24 | roster | 28.2, 0/40 | 27.4, 0/40 | 26.7, 0/40 |
| Regent x7 at the boss Grudge +50% | start | roster / glass | 35.1 / 22.0, 0/40 | | |
| Azzy x3 / x1.1, L29 (outline) | tier 24 | Gianna alone | 8.7, **0 losses** | 8.2, 0 | 7.8, 0 |
| | start | Gianna alone | 10.4, 2/40 lost | 10.4, 1/40 | 10.3, 0/40 |
| Fields trios (three) | tier 24 / start | roster | 3.9 to 4.9 / 5.2 to 8.8, 0 falls | | |

Every fight won every seed except the Challenge's two and one losses at start gear.

- The outline's targets ("30 to 38 actions, a fall in one in four at 28 with tier-24 gear"; "with tier-28 gear 24 to
  30"; the Challenge "12 to 16 ... a loss in one in five") are all missed: the Regent never touches the party at tier
  24, the tier-28 stock changes about one action, the Challenge is 8 to 9 of Gianna's actions.
- **The three pillar variants are the same fight** (31.7 / 31.5 / 31.6 actions, 0 falls each), and on the route the
  realm's pillars at `@chapter9-end` read **Influence 73, Fear 2, Wealth 14** (`globalPillar`; the headless route may
  under-pay debates, so treat the numbers as a floor, but Influence leads by a mile): nearly every save gets the
  Influence variant. Three battle variants and a dialogue branch buy nothing.
- Why the Regent is harmless: as a `tank` his ATK is 92 (x0.7 on Story) and his MAG is 39, so *The Charter, read*
  (a `magic` move) barely lands; *Patience* is power 0; the One Hand phase's only special is the Seize, which takes
  Spark and does no damage. Stat checks: x7 is 2,961 HP (2,369 Story), ATK 92, **DEF 74** (the outline says 69);
  Azzy as a foe at 29 x3 / x1.1 is 1,147 HP (917 Story), **ATK 105** (the outline says 124).
- The tier-28 stock: COMBAT 15's formula gives a weapon "+24 at level 28", which the built tier 24 already gives
  (`flame_talwar`, `kingsmere_blade`: ATK 24); the outline's "weapon about +24" is no upgrade.

**What the player sees.** The game's last boss is a three-minute grind in which nobody is in danger; the brother's
Challenge is over in eight blows. Neither feels like the end of a war.

**Fix (measured in the scratch sim; the day-1 sim confirms on the built data).**
- **The Regent: HP x6, ATK x1.6, MAG x2.0 (`magScale`, built for Chapter 9's caster boss), *The Chain of Office* 120,
  *Patience* 60 `area` `weakened` every 3; phase two *The Charter, read* 140 `magic` `area` `hushed` 50% every 2;
  phase three *One Hand* 160 `area` `weakened` every 2 alternating with *Hush the Light* (`seize` 3) every 3**, the
  Sealbearers as written (`protects`, one more at 66%, two at 33%). Measured:

  | Tuned Regent (x6 / 1.6 / 2.0 / 140) | At 28 | At 30 |
  |---|---|---|
  | tier 24, roster | 33.6 actions, a fall in 20/40 | 30.3, a fall in 9/40 |
  | tier 24, glass | 25.3, 1/40 | 23.8, 0/40 |
  | tier 28, roster | 32.5, 20/40 | 30.7, 9/40 |
  | start gear, roster | 49.0, 39/40 (won 40/40) | 46.3, 34/40 |
  | start gear, roster, boss Grudge +30% / +50% (x6 / 1.8 / 2.5 / 160) | 39.3 / 35.4, won 40/40 | |

  It meets the Chapter 11 review's gates (no boss over 40 at the plan's gear; a fall in about one in four at the
  band's top, about half at its floor; every seed won at start gear with the Grudge) and it never loses a seed.
- **One battle, not three**: keep the Influence shape, or choose the phase-two move by the Harbor Turn (`war.trust`:
  *The Charter, read*; `war.strike`: *The Writ*, stunned), which the player can feel; cut `globalPillar` from the
  dialogue (saves the condition shape and two data copies).
- **Azzy's Challenge: x4 HP, ATK x1.2** (measured: 10.4 to 11.1 actions; a loss in 2 to 3 of 40 at tier 24; in 10 to
  15 of 40 at start gear, which the non-boss Grudge then carries). Not `boss`. If the owner's answer to question 1
  keeps the Challenge, this is the size of a brother who means it.
- **The tier-28 Outfitter**: cut it (it is already second on the cut list and changes no fight), or make it the
  *Claimant's coat* only, a look and +4 DEF, for the picture on the tile. Gold then has nothing to buy in the last
  chapter, which is honest: the Regent's 800 gold can stay as a number on the end card.
- **Anissa's tip must be true** (the Chapter 11 review's 3.10 made the same fix for Hale): "He hates the light" is
  true of nobody here (`al_sealbearer` has no `weak`). Use: "The grey ones stand in front of him, Gigi. Hit them all at
  once." / at 33%: "He's looking at me. Stay in front, Gigi."

### 3.5 Accord Stability, as dialed, does not do what section 4.2 says (high: the ending's fairness)

**Evidence.** Section 4.2's table, summed on canonical saves (Concord at a realistic 90 to 100: by Chapter 12 a
player has settled about fifteen debates at +5 won / +10 mediated from 50, plus the four accounts' +3, so the Concord
term is +8 to +10 for nearly everyone):

| Save | Sum before clamp | Ending (pardon) |
|---|---|---|
| Trust, every house kept, every chair set, renounce, kind yields | 50 +16 +12 +15 +15 +10 +5 +7 = **130** | Just |
| **Strike**, every house kept, every chair set, renounce, kind yields | 50 +16 +12 -15 +15 +10 +5 +7 = **100** (the outline says "about 62") | Just |
| Strike, one house turned, Concord 90 | about **92** | Just |
| Strike, one house betrayed, its flank bound, Azzy's Challenge, Thorne and the Hushed broken, Concord 80 | 50 +12 +12 -15 +15 +6 -10 -3 -2 -2 -2 = **59** | Hollow |

So every pardon is Just except the darkest Strike save; every exile is Hollow; every execution is Iron. The score is
decorative, and the Journal's "The Accord's Stability: N" will read 100 for most players. The outline's other test,
"the realm's Influence at least its Fear", is a no-op (Influence 73, Fear 2 on the route; 3.4).

**What the player sees.** The verdict alone decides the ending, which is not what the guide asked ("only if the player
has earned the Stability"); and a Hollow ending, when it comes, does not say why.

**Fix.**
- **Recalibrate on paper now, test with five canonical saves, set from real runs in the whole-game pass.** A starting
  table that hits the outline's own intent (Trust and pardon about 95; Strike and pardon about 75, so Just needs Share,
  every chair and kind yields): start **40**; houses kept +4 each (turned +2); the Unpaid Debt +5 / +5 / +2; Trust +10
  and fleet struck +5, **Strike -15 and fleet escaped -5**; pardon **+10**, exile 0, execution -15; Concord
  **(Concord - 75) / 5**, clamped -5 to +5; Share +5, Renounce 0, Challenge -10; every chair set +5, a bare chair -5;
  yields as written; **Just at 80**. Sums: Trust row about 100; Strike row 40 +16 +12 -20 +10 +5 +5 +7 = **75**
  (Hollow), Strike with Share **80** (Just), the dark save about **33** (Hollow).
- **Drop "Influence at least Fear"** or replace it with something the player moves (for example, no house betrayed
  *and* not turned to Fear by a broken Yield). Record the guide's "strong Influence" as met by the Seat Influence the
  chairs pay.
- **The Hollow card names what strained**, from the inputs that cost the most, so the ending is legible as a
  consequence: "The Crown's fleet sails still." (`stability.fleet_escaped`), "Skarragol's chair stays bare."
  (betrayed), "Azriel holds you to it. Every day." (Challenge), "The Ash Ledger goes on, unaccountable." (exile). Two
  or three lines, chosen by weight. This is the guide's "debts unsettled" made specific to the save.
- Tests: `stability.test.ts` with the five saves above and the ending each gets.

### 3.6 The antagonist has no reckoning (medium-high: the ending's justice)

**Evidence.** The Regent's phase three, outline: "One hand. One Hall. Hush, and give her to me." with *Hush the Light*
(Chapter 9's built move name for the Almoner, "She is looking at the little one") and the Quiet Crown's own slogan
("One hand on the Throne", `zetwal.ts:350`, `debates.ts:350, 664`). Chapter 9 built the Almoner's commission "under the
Throne's seal, no hand" and "the Crown disowns any almoner"; its outline: "Nothing in this chapter is provable against
him, which is why Chapter 12 is a Challenge and not a trial." After the fight the outline has Jordyn walk him up the
heralds' stair ("Under the Compact, my lord. Not under me.") and he is never mentioned again: not at the Hearing, not
in any ending card. The Almoner's fate (`choice.hushed_tried | broken`) is a Stability input only.

**What the player sees.** The man who said, in public, "give her to me" about a child walks out of the story; the
Hearing then tries the father who protected her. Players will ask what happened to him.

**Fix (Claude's call; three lines and a card line each).**
- Make his line in phase three the confession it already is, and pay it: after the win, **Hollis lays the Almoner's
  commission beside the Regent's Commission** (both key items or objects: Chapter 9's commission, "Under the Throne's
  seal. No hand.", and the Commission's "last renewal is signed by the Regent himself"): "The same seal. This one has a
  hand." Jordyn: "Under the Compact, my lord." He is walked up the stair **under arrest** for the almoner's commission.
- His fate on each ending card, one line: Just: "The Lord Regent was heard in this Hall a month later. Every witness
  spoke. He answered none." Hollow: "The Lord Regent went home to Kingsmere. Nobody renewed him." Iron: "The Lord Regent
  was not heard. The Iron Throne does not hear anyone twice."
- The Almoner by her Chapter 9 fate, one line on the Just and Hollow cards.

### 3.7 The families' payoffs (medium-high: the story's heart)

**Evidence and fixes, person by person.**

- **Benny and Rael: the oath and the goal never meet.** Rael's line (guide, Chapter 11): "My father kept his oath and
  it cost him everything. I wanted to know what would happen if someone kept the goal instead." The pardon's first
  term is "serves in a way that **honors his father Benny**". The party has carried *Benny's Refusal* (Chapter 4's note:
  "I will not put my name to this page") and Benny's half-sheet since the middle of the game. The outline gives Benny a
  witness line and, in the Iron ending, a count; Benny and Rael exchange nothing, as in Chapter 11.
  **Fix:** at the pardon, after the signet, **Benny walks to the clerk's table and puts *Benny's Refusal* in front of
  his son** (an item object; shown), says nothing, and goes back to his place. Rael looks at it for a `wait`. The Warden
  of Oaths' first oath (3.1) is then filed on his father's refusal. One walk, no line: the two halves of the family's
  argument on one table. On exile or execution the note stays in Gianna's bag.
  Benny's witness line also needs its fact fixed (3.8): "I kept an oath and it cost Brasador everything. He kept a goal
  and it cost him his name. Ask him which he would do again." Give Rael the answer, one sentence: "Yours. I would
  keep yours, and do the work of mine."
- **Azzy and Rael: the father-son thread ends on "he does not turn."** On Trust Azzy fought beside him; on Strike
  he did not speak to him. The outline's witness line for Strike or Challenge is "I disobeyed him. **That was the point
  of raising me.**", the line the Chapter 11 review (3.10) flagged because it frames Azzy's defection as Rael's plan
  ("redeemed in the moment"). **Fix:** replace it: Strike or Challenge: "I disobeyed him. I'd do it again. I am still
  angry. Write that." Trust: as written. Then one beat in the Just ending, shown: the Marshal and the Warden at the
  clerk's table, Azzy hands his father the boarding axe (Trust) or nothing (Strike); Rael: "Marshal." Azzy: "Warden."
  Nothing more. On the Hollow ending they do not look at each other.
- **Elodie and Rael: no moment.** The secret marriage is the game's central secret; at the end they are "Chief Envoy"
  and "Warden of Oaths" standing apart. **Fix:** in the Just ending, after Rael's line, **Elodie walks from Zetwal's
  chair to the clerk's table and stands beside him** (one `walk`, a `face` each, no line). In the Hollow on a pardon
  she stays in her chair; on exile she watches him to the door. The owner's register for the couple is not yet written;
  a walk and no words commits to nothing.
- **Elodie's new lines contradict the built game and the guide.**
  - "I have known you since you were four and would not take your boots off in my kitchen. Azriel. Your mother and I
    wrote to each other. We stopped when it became dangerous to be two women who wrote to each other." Chapter 5 built
    their first meeting as "Azriel." and "He does not know what to do with it, and nobody tells him." (`seat.ts:940`);
    her own built reason for the secret is "A Rodriguez child in Zetwal is a Brasador hostage" (`seat.ts:968`), so a
    Rodriguez child in her Zetwal kitchen contradicts her; and the guide's settled answer 7 says Azzy's mother "is
    unimportant to the story and does not appear (at most a line of dialogue)", while the line invents a correspondence
    between Rael's two wives (and quietly decides when each marriage was). Azzy's "You've known me since the wedding
    coat" also misreads Coco's built line ("I made **his** wedding coat": Rael's). **Fix:** Azzy: "At Coco's you said
    my name and nothing else." Elodie: "I had not earned the rest. He wrote to me about you, every year. Your temper.
    Your hands. **I know you the way one knows a letter.** Azriel." No kitchen, no mother.
  - To Anissa's "Mama. In Ardencia, he didn't let them hit me.": "No. **He let them hit your sister instead.** That is
    the part I will not forgive him for." Said to the younger, shy child, it puts the weight of her sister's beating on
    her. **Fix:** "No. He tested which of you would stand in front of the other. I told him never to. That is the part I
    will not forgive, and he knows it." (Chapter 5's "He should never have tested you", finished, and Chapter 11's "I
    needed to know you would stand in front of her.")
- **Elodie and the girls: Chapter 1 unpaid.** Her farewell (`zetwal.ts:130-134`): "Anissa. Stay close to your sister."
  / "...I will." and the remembered `choice.farewell_why | farewell_fine`. **Fix:** in the rooms, one line after the
  hand on Anissa's head: "You stayed close." Anissa: "I did." And one by the remembered choice: *why*: "You asked me why
  I had to go. This is why. It took a year." / *fine*: "You told me you'd be fine. You were not. And you were."
- **Old Patricio at the chair his young self cut.** The Echo has young Patricio cut the oath into the eighth chair; the
  present turns the chair. Patricio arrives the same morning (or the Hearing's: 3.9). **Fix:** at the petition's
  hearing (3.1) he stands by the eighth chair and touches the cut line (a `face`, a `wait`): "I remembered the wrong
  thing." (His Chapter 10 phrase.) It settles nothing about question 13.
- **Patricia, Rahel, Amanda, Coralie, Sebastian, Anicette:** fine as written, with the fixes in 3.8 (Rahel's count,
  Amanda's knowledge) and 3.10 (the quips). Coralie absent with a note is acceptable for scope; say in the Just card's
  last line that she dressed the council ("Gold. She said gold.") so the family's last picture includes her.

### 3.8 Line-level continuity errors (medium: each is one line or one placement)

| Outline | Built or settled | Fix |
|---|---|---|
| Xaraguá's token: "the conch token" `item.token_xaragua`; Yari: "Mine to carry. Mine to set down, after all." with "the conch" | Chapter 11's decisions take the review's 3.10 "as written": **a carved paddle** (Se-5); *Caona's Conch* is the X-4 secret item | The carved paddle everywhere; Yari's line stands |
| Hale on the dais **on Trust**, "lays his axe down" | On Trust the party beat Hale on the pier and took **Hale's boarding axe** (Chapter 11, the flagship's reward); on Strike he was never fought and sailed home on the *Patience* | Hale on the dais **on Strike** (he lays his axe down); on Trust he is absent (the *Patience* left him on the pier), or Jordyn's prisoner in the gallery |
| Rahel: "**Six** children, three countries." | Rahel's children: Rael, Amanda (with Benny), Kayla, Aiyana, Jordyn: **five** (STORY's family table; Zelia and Joaquin are Benny and Nancy's) | "Five children, three countries." |
| Benny: "I kept an oath and it cost **Ardencia a harbor**." | Xaraguá lost the harbor; the guide: Benny's "honor cost Brasador everything" | "...cost Brasador everything." |
| Amanda: "I baked for twenty years on his money and **never knew whose**." | FAMILY: Amanda runs the kitchen "secretly part of Rael's shadow network"; Chapter 11: Rael, "Ask your Titi Amanda who pays for the flour." Built Ar-1: "The pot pays." | "I baked for twenty years on his money. I knew whose. I said 'the pot'. Write that he paid for the flour and I paid for the nights." (She is his full sister: one `face` to him before she speaks.) |
| Rael: "To a Throne. Not to a watch." and "The Hearing, envoy. **You said** this Hall would have one or you would make one." on both routes | "To a Throne. Not to a watch." is Strike's only (Chapter 11 review 3.5); on Trust Rael said "The Throne has a Hearing for men like me, or it will have one." Gianna said neither | Strike: "To a Throne. Not to a watch. There is a Throne now." / "You said: at Eightgate. Here I am." Trust: "I said the Throne would have a Hearing for men like me. It has a Throne. Make it." |
| The treasurer "freed on the Ash Road **the night Rael surrendered**" | Rael surrenders the same morning, in the Hall; the Ash Road is three days | Rael, at his surrender: "Rivera. The treasurer." Rivera goes out the door and comes back with him on his daughter's arm before noon (or on the Hearing's day: 3.9). The pardon's term becomes "every *other* captive" |
| Exile: "leaves **the realm** by the Ardencia Gate" | Ardencia is in the realm; that gate is his road home | "...leaves the realm by sea, from Ardencia's strand, before the new moon, and does not return. Ardencia's chair passes to its elders' account." |
| "The Council of Eight. The old plan, never used." | The book: the council sat until the Ash Wars (3.3) | As 3.3 |
| The Regent's stats (x7: DEF 69); Azzy as a foe (ATK 124) | `enemyStats`: DEF **74**; Azzy ATK **105** | Fix the numbers (3.4) |
| "Keeper Hollis comes down the nave from **the Archive's side door**" | The Hall has one door, (21, 31); the Archive is its own map | He comes in by the Hall's door and walks the nave (the same picture) |
| The step trigger "on the tile's two tiles" | `throne_tile` is `solid: true` (2 x 2) | A second tile object, not solid, on `story.claim_begun` (the built one gains `!story.claim_begun`) |
| The Echo zone "3 x 2 at (15 to 17, **8** to 9)" | (16, 8) is the solid eighth chair | (15 to 17, 9 to 10), south of the chair |
| The chairs "each house's person walks to their chair and **sits**" | No seated look exists; chairs are solid | They stand **behind** their chairs (row 9) for the Claim; a seated look only for Gianna on the Throne if art arrives |
| The Echo's "Crown's clerk" speaks: "Matters touching a clause are filed with the clause." | *The Throne's Clerks*: the clerk who sealed the Accord "**never spoke again after that day**", and his register for that year "could not be found" | Make the Echo's clerk the Throne's, **silent**: he takes the petition and writes the filing note (shown as a written line, an object look); Benny reads it aloud. Optional: Hollis finds the lost register with the petition (a book look), which closes that book's mystery |
| The chamberlain sets nothing; the companions set the tokens by night | Built promise (3.3) | As 3.3 |
| The tier-28 weapon "about +24" | Tier 24 already gives +24 | As 3.4 |
| `choice.refusal` (asked / protest), `choice.yari_sure | everything`, `choice.envoy_waters`, `choice.farewell_*` listed as "flags that matter" | None is read by any beat | Regent at the Challenge: *asked*: "You said Xaraguá was not asked. Ask it now." / *protest*: "You said you were the protest. Protest, then." Yari in the Just ending: *sure*: "You said 'of course'." / *everything*: "You said 'tell me everything'. I have." Elodie's farewell lines (3.7) |
| "Chapter 12 complete. The Claim." as the last card, after the epilogue | The epilogue follows Chapter 12 | "The End." (3.13) |

### 3.9 The Hearing at noon the same day cannot have its witnesses (medium: logic and staging)

**Evidence.** The card after the surrender: "The Claim stands. The Hearing sits at noon." The witnesses include the
lamp-oil seller of **Yucayeque**, the printer of **Kingsmere** (who stayed in Pòdlimyè: "I've a press to set"), the
treasurer held "where the ash falls" in Ardencia, Amanda from Cenizal, Rahel and Patricia, Zetwal's ship. Nobody sent
for them before Rael surrendered that morning; if Rael brought them, the Hearing is his production, not the realm's
(the guide: "The pardon is earned at the Hearing, not given by the plot").

**Fix (Claude's call; it moves nothing the player chooses).** The card: *The Claim stands. The Hearing sits in nine
days. The witnesses are sent for.* The epilogue opens on the Concourse on the Hearing's morning with the arrivals
shown at their gates (the outline already stages Zetwal's ship this way: move it here, and close *Volume One* in the
same arrival scene automatically when the book is held, so it can never be left open). The Hall at the Hearing is the
same layer. This also removes "Zetwal's ship at dawn" from the Claim's morning, which was crowding the bell.

### 3.10 Anissa's lines and the no-joke rule (medium: owner rules)

**Anissa.** Her lines are earnest and on the thread. Three changes:
- The rooms: see 3.7 (Elodie's answer, not Anissa's line).
- **"Scared. Of me. Gigi said never. I'd like you to say it too."** The compression reads as "I was scared of myself"
  or as "you were scared of me". Clearer, same length class: "**Scared. They were scared of me, so I was scared of me.
  Gigi says never. I'd like you to say it too.**" Rael: "Never." Keep the `wait`.
- **Her last line in the Just Throne**: "You can get down now, Gigi. I'll hold it." with Gianna stepping off the tile.
  The guide's Just Throne is "Gianna **sits** the Throne as arbiter"; the guide's pushback asked that "just" be earned,
  not that she leave the seat; and "I'll hold it" (the Throne?) reads as Anissa taking it. **Fix:** Gianna stays seated
  with the council turned to her; Anissa walks to the Hall's doors (21, 31) and opens them on the Concourse, and its
  people walk in to the gallery (shown, placed pairs walking): "**I'll hold the door, Gigi.**" Her Muster line, her
  Chapter 9 door, the Hall that "hears everything", the council open to the realm, and it is not a joke. The Hollow's
  "I'll hold it a while longer, Gigi." becomes "I'll hold the door a while longer, Gigi." The Iron's "Gigi. The lamp's
  gone out." stands.
- In Azzy's duel, Gianna has `anissaBond`, so Surge works and the engine prints "Anissa's light gathers around Gianna."
  against her brother. Give the battle **no Anissa tips** (`tips: {}`) and an Anissa line *before* it instead, earnest:
  "Don't hurt him, Gigi." (Gianna: "I won't.") It names the stakes and keeps her out of the fight's voice.

**The no-joke rule** (STORY 5: "No jokes in the Rael, Anissa or Hearing scenes"; the outline's own "nothing in the
rooms, the Hall, the Claim or the Hearing is a joke"):

| Line | Where | Fix |
|---|---|---|
| Lamp-oil seller: "...my oil's price in his own hand, **so I can frame it**." | The Hearing | "...in his own hand, so my children know whose it was." |
| Kayla's letter: "Three lines, **which for Kayla is a lot**." | The Hearing (read by Haru) | Move both letters to the Concourse, or read only their content: "She writes: Keep the law." |
| Elodie: "Chief Envoy. **I will keep the Regent's guests waiting.**" | The Just ending | "Chief Envoy. Zetwal's envoy, still. I will keep both." |
| Azzy: "Marshal of the realm. **Mother will say I got the temper.**" | The Just ending | "Marshal of the realm. I'll hold you to it." (Also keeps Azzy's mother to Chapter 6's lines: 3.7) |
| Edmund: "Terribly sorry, Mother. I've sat." | The Hall at dawn (the outline says "at the door") | Keep only on the Concourse, before the Hall; in the Hall he says nothing |
| Sebastian: "I was somewhere being famous. It was here." | Zetwal's ship on the Concourse, Anissa on the map | Fine on the Concourse **if no Anissa line is in that node**; test it |
| Benny, Iron: "**Forty-one. I count.**" | The execution | Not a joke, but it turns a father's grief into his habit's punchline. Cut: Benny sits down on the step where the signet was, and says nothing |

### 3.11 Staging on a phone, scope of the Hearing, and the cut order (medium: owner rule and readability)

- **One screen is 20 x 11.25 tiles.** The witnesses' bench "along the west wall" (x 2) and the gallery "along the east
  wall" (x 41) never share a screen with the dais (x 16 to 27) or each other. Put the bench on rows 11 to 12 at x 12
  to 15 (west of the nave, below the chairs) and the gallery on rows 13 to 15 at x 26 to 31: the dais, the chairs, the
  clerk's table at (24, 10), Rael at (21, 10), the bench and the gallery then fit in about 20 x 12 tiles. Each witness
  walk is then 4 to 8 tiles, not 20.
- **Fourteen witnesses** with Rael's one-sentence answers are 30-plus exchanges; the outline writes only one of Rael's
  answers. Plan the **guide's six** (the treasurer and his daughter, Amanda, the lamp-oil seller, Elodie, Azzy,
  Anissa) **plus Benny and the follower** as the build, each with Rael's answer written now; the printer, the sergeant,
  Rahel, Anicette's four accounts and Patricia are the stretch, placed and silent if cut. Patricio's line moves to the
  petition (3.1).
- **The cut order cuts shown endings before told witnesses.** "The Hollow and Iron endings' staged scenes (their cards
  stand)" is fifth; the witnesses past six are sixth. Two of three endings told by a card breaks "shown, not told" at
  the very end. Reverse them: the witnesses past the guide's six go first; the endings' scenes are never cut (they
  are ten lines each and reuse the Hall's layer).
- Where the party stands during the Claim: Gianna alone on the tile; the fighters at their doors until the Regent
  calls his seals (3.3's walk). After the fight they walk back. Without this, four fighters appear in the battle from
  nowhere and Anissa (placed at the rope with Elodie) is in the battle's support slot from across the Hall: say in the
  scene that she walks to the dais's foot behind the four (a follower `walk`), which is also where the Seize finds her.

### 3.12 The last Echo puzzle is the game's easiest, and a repeat (medium: the plan's "Echo puzzle")

**Evidence.** Section 8: "one object, one verb", "Honest difficulty 1", ending on "Patricio: 'Fifty years from now
somebody will turn this chair round.' Caona: 'Good.' (Chapter 11's exchange at the capstan, returned.)" Chapter 11's
Echo ended on "Fifty years from now somebody will wonder why their chain won't hold." / "Good." two chapters ago.

**Fix (cheap, difficulty 2, same files).** In the Echo the chairs are being set out for the first Parley after the
sealing, **not yet in their order**: the chamberlain's desk has the seating plan ("Xaraguá: the eighth, by the wall it
has no chamber in"), eight chairs stand in a cluster, and the masons are bricking a chamber door. Caona: "They will not
write it. Write it where they sit." The player must find **which chair will still be Xaraguá's in fifty years** (the
one the plan puts by the bricked door; the cheat is cutting any other: "The clerk moves that one to Aldermoor's place.
Nothing is cut into Xaraguá's."), then cut it. Change Patricio's last line so it is not Chapter 11's again: "Somebody
will sit here who was asked." Caona: "Then cut it deep."

### 3.13 The ending screens: the Credits, the last card, the goddess (medium: the game's last minute)

**Evidence.** The built Credits screen (`FieldScene.ts:2044`, `data/credits.ts`) is a licence list: "CREDITS",
"Bloodlines: Echoes of Zetwal", two lines about the owner's art and score, "Atkinson Hyperlegible by Braille Institute
of America (SIL Open Font License 1.1)", "(B to close)". The outline opens it from the story, then the title. The last
card is "Chapter 12 complete. The Claim." The goddess has spoken only on Game Over screens; the intro opens on her:
"The goddess Elodie wove the realm. She does not rule it. She remembers." (STORY 2, beat 1).

**What the player sees.** Six hours end on a font licence.

**Fix (0.15 days; no new system: cards and the built panel).**
- **The End**: one card in the intro's frame, the sun glyph, and the intro's first line answered by the ending:
  Just: "She does not rule it. She remembers. **Now, so does the Hall.**" Hollow: "...**The Hall is still learning
  to.**" Iron: "...**She remembers this too.**" Then the outline's "The Gaze sees you both. So does she." (Keep it.)
- **End credits as a short card sequence before the licence panel**: the title; "Story and characters" (the owner's
  name, if the owner wants it there: a question for the reviewer prompt, as the outline does with the dedication);
  "The cast", one card per house with its people's names (no new art: the names only, or the built looks placed in a
  row on the Concourse if a curtain call is wanted, which is one stage scene); the music and art; then the built
  licence panel; then the title.
- **Optionally, the goddess once without a fall**: on the Just ending, before The End, her screen with one line and no
  Rise button: "You stood without me." It costs one `GameOverScene` mode and is the only payoff her twelve chapters of
  "I remember every fall" can get. Not required; a recommendation that genuinely helps the last minute.

### 3.14 Soft-locks and confirmations at the very end (medium-low)

- **The verdict is irreversible.** One pop-up with Pardon / Exile / Execution, and the save follows. Add a confirm on
  Exile and Execution ("The Throne decides once. Execution?" Yes / Not yet) and **save before the verdict** (the bench
  save the outline tests): a mis-tap on a phone must not end the game in the Iron Throne.
- **The credits hook** (`ui.credits`) must be cleared when the panel closes and must not be in the save, or the panel
  reopens on every load; test a save made at the credits.
- **Volume One must close automatically** (3.9); as written "a save with Se-1 open finishes it at the gate on the way
  to the Hearing", but the gate is not on the way to the Hall.
- **The debate's mediate gate** (the Seat's local Influence 5): the outline asserts "5 or more on every save"; the
  headless route at `@chapter9-end` reads **2** at the Seat (`localPillar`; the route may under-pay listen and quest
  Influence, so this is a floor, not a verdict). Measure it on the Chapter 11 route before relying on it; the debate
  settles on a loss, so it is not a lock, but the follower's Hearing line and +10 Concord depend on it.
- **The Regent lost:** "Nobody leaves the Hall while it does" (the Assize's shape). With the 3.4 tuning nobody loses at
  start gear in 40 seeds, so keeping the door shut is fair; if the day-1 sim finds losses, let the party leave to the
  Fields and come back (the Claim waits on the tile trigger).
- **The Challenge lost (dark route):** the goddess for losing a `binds` duel to a brother is acceptable (Chapter 11's
  Strike set the precedent); the way back in must be after the Regent's defeat (3.2), with `story.regent_beaten` kept.
- **The Hall after the end** is open with the witnesses gone and Rael at the clerk's table on a pardon: good. Make
  sure no Chapter 12 trigger re-fires on the tile (`story.claim_declared` guard) and that the Fields' table runs.

### 3.15 Small (low)

- **The Throne: tile or chair?** Built: "a tile of carved stone" (`seat.ts:493`) and "one hand on **its arm**"
  (`seat.ts:260`); the outline has her "sit on the tile". Settle it in CAPITALS: a stone chair on the sun tile; one
  stands on the tile to claim and sits the chair to rule.
- **The Chancellor** on Zetwal's ship leaves Zetwal with nobody in "that chair" ("Nobody signs in that chair while she
  is away"); cut her from the ship.
- **Jordyn's "I keep the law where I stand. Tonight I stand in the Crown's own city."**: Eightgate is the Throne's
  city, not the Crown's (the Crown is Aldermoor); "in the Throne's own city".
- **The rope** vanishes on a flag; show it: the two rope Sealbearers unhook it and carry it to the wall (two walks).
- **The Fields' war table** at 28 to 30 is 4 to 9 actions per fight, nobody down: fine as XP for a floor player; say so
  and do not tune it.
- The headless `battle-sim` route reads level **22 (6,771 XP)** at `@chapter9-end`, against the Chapter 9 Built
  section's **24 (8,028)** from `tools/level-curve.ts`; the difference is the sim's unsettled rewards, not the route,
  but the Chapter 12 day-1 sim should lift from level-curve's numbers, as this review did.

---

## 4. The outline's claims, checked

| Claim | Checked | Result |
|---|---|---|
| Throne tile (21, 2), 2 x 2; rope (16, 5) 12 wide `if: '!story.claim_begun'`; rope Sealbearers (15, 6), (28, 6) | `tools/maps/seat.ts:245-246, 251-252` | Exact; the tile is `solid: true` (3.8) |
| Chairs west to east zetwal 14 ... jwaladesh 29 on row 8; chambers' doors | `seat.ts:186-208, 247` | Exact |
| Envoys placed with no condition; the Regent `if: '!story.elodie_hall|story.hollis_agreed'` | `seat.ts:254-262` | Exact |
| `story.claim_begun` in `LATER_STORY_FLAGS` | `encounters.ts:10-13` | Exact |
| The chamberlain's "The chairs fill at a Claim..." | `seat.ts:357` | Exact; **the next line, "I will put each on its chair the day someone stands on that tile", is ignored** (3.3) |
| `chair_xaragua`, `throne_tile` lines | `seat.ts:492-493` | Exact |
| The petition "received forty-nine years ago and never heard" | `rpg.ts:198-203` | Exact |
| The Regent's refused node; Hollis's "No signature..."; Yari at the eighth chair | `seat.ts:862-900` | Exact |
| Elodie's lines, "Azriel." | `seat.ts:58-61, 940, 967-974` | Exact; **"He does not know what to do with it, and nobody tells him." contradicts the new kitchen line** (3.7) |
| The seat test (Rael + father) | `tests/seat.test.ts:143-146` | Exact |
| Three tokens built | `rpg.ts:221, 272, 295`; given at `skarragol.ts:587`, `kuroshi.ts:1070`, `jwaladesh.ts:1024` | Exact; each says "For the chamberlain's chair" |
| Nine Seat books; no *Rules of Claim*, no *Four Faiths* | `books.ts:571-688` | Exact; **four of them are unused hooks** (3.1, 3.3) |
| The reveal, the glow `fx: 'token'` / `fx: 'signet'`; old Benny; the treasurer; Azzy's claim line | `ardencia.ts:271, 335, 399, 416, 1033` | Exact |
| S-5: `choice.azzy_ordu` influence / fear / share; "Then it is not for one of us." | `skarragol.ts:737-770` | Exact; the S-5 envoy also says Azzy's mother "does not ask after you" (3.7) |
| Chapter 1's lines | `zetwal.ts:130-134, 716, 1077-1078` | Exact; "Anissa. Stay close to your sister." unpaid (3.7) |
| The goddess's lines | `gameOver.ts:11-16` | Exact |
| Caona's oath | `xaragua.ts:277, 931, 959` | Exact |
| `fighters`, `binds`, `protects` at 0.75, `seize` via `anissaBond`, phases with `enter`, `withdraws`, `endsWithBoss`, `magScale` | `battle.ts:229-381, 671-672, 1129-1162, 1491-1492` | Exact; Surge works in a Gianna-only duel (`canSurge` reads `anissaBond`) |
| Curve 50 / 1.6; 28 at 9,753, 29 at 10,338, 30 at 10,936; nine XP rows, last 70 | `config.ts:62-79` | Exact |
| Regent x7: 2,961 HP, ATK 92, DEF 69 | `enemyStats` | **DEF 74** |
| Azzy foe x3: 1,146 HP, ATK 124 | `enemyStats` | 1,147; **ATK 105** |
| "Ardencia's chair is left of the Throne as the Hall faces it" (so Azzy first) | the rule is the claimant's left; she faces south | **Backwards** (3.2) |
| "Ten across the three pillars, or six in one" | `rules-decisions.md` [45] | **Superseded: 9 total, 2 in each** (3.2) |
| The Regent 30 to 38 actions, a fall in one in four at 28; tier 28 24 to 30; the Challenge 12 to 16, a loss in one in five | the sim | **30 to 32, no falls; tier 28 one action less; the Challenge 8 to 9, almost never lost** (3.4) |
| Stability: Trust-and-pardon about 85; Strike-and-pardon about 62 | the table summed | **About 130 and 100 before the clamp** (3.5) |
| "The Seat's Influence is 5 or more on every save" | `localPillar` at `@chapter9-end` | **2** on the headless route (a floor; 3.14) |
| Xaraguá's token, the conch | Chapter 11 decisions (review 3.10 as written) | **The carved paddle** (3.8) |
| Hale on the dais on Trust | Chapter 11: the party takes his axe on Trust | **Strike only** (3.8) |
| Credits screen "exists on the System tab" | `FieldScene.ts:2044-2054`, `credits.ts` | Exact; it is a licence list (3.13) |
| Voyage shores are the seven capitals; the Seat inland at (68, 64) | `voyage.ts:23`, `realmMap.ts:25` | Exact |
| `chapters.json` ends at "10"; Chapters 10 and 11 not built | `src/data/starts/chapters.json` | Exact |

---

## 5. The sim

**Method.** HEAD's `quest/` copied with `git archive` (the merge in progress was not touched). The party: the
scripted route's flags at `@chapter9-end` (Gianna, Anissa, Yari, Azzy, Samira, Bayarmaa, Haru, Vikram, Edmund), lifted
to 28, 29 or 30 by shared XP (30 percent into the level; 30 exactly at the cap). Gear: **start** (as the route leaves
it), **tier 24** (the best built weapon, armour and charm each member can wear: weapons and armour 24, charms 24 where
the Almoner's brooch fits), **tier 28** (every level-24 piece cloned at level 28 with its stats x28/24, standing in for
the Outfitter). Orders: **roster** (Gianna, Yari, Azzy, Samira) and **glass** (Gianna, Yari, Vikram, Haru). Bot: the
built `skillsAction` plus Break Free when Bound. Story difficulty. Falls are Down or Bound events on any party fighter.
The outline's fights as data: the Regent level 30 tank `boss` x7 (and x6, x10) / x1.25, *The Chain of Office* 100,
*Patience* 0 `area` `weakened` every 3; two `al_sealbearer` at 29 with `protects: 'regent'`; at 66% the pillar move
(Influence *The Charter, read* 120 `magic` `area` `hushed` 50%; Fear *The Writ* 120 `area` `stunned` 40%; Wealth
*Requisition* 120 `area` `weakened`; every 3) and one more Sealbearer; at 33% *Hush the Light* (`seize` 3, `marked`)
every 2 and two more Sealbearers with `protects`; `endsWithBoss`. Azzy as a foe: brute 29 x3 / x1.1, Blade 110,
*La Marca* 100 `marked` every 3, *Grito* 0 `stunned` 60% every 4; `binds`; `fighters: ['gianna']`. The Fields: Husher +
Sealbearer 29; Marine x2 + Officer 28; Sealbearer x2 + Marine 30. Not modelled: tips, items, the Grudge except where
shown, Gianna striking first.

**Results** (party actions; "fall" = fights with at least one fall, of 40):

| Fight | Gear | Order | 28 | 29 | 30 |
|---|---|---|---|---|---|
| Regent x7, Influence | tier 24 | roster | 31.7, 0 | 30.7, 0 | 30.2, 0 |
| | tier 24 | glass | 26.6, 0 | 25.9, 0 | 25.1, 0 |
| | tier 28 | roster | 30.9, 0 | 30.6, 0 | 29.8, 0 |
| | tier 28 | glass | 25.9, 0 | 24.7, 0 | 24.7, 0 |
| | start | roster | 53.1, 5 | 51.9, 5 | 50.1, 2 |
| | start | glass | 31.8, 2 | 31.0, 2 | 29.1, 0 |
| Regent x7, Fear | tier 24 | roster | 31.5, 0 | 30.7, 0 | 30.2, 0 |
| Regent x7, Wealth | tier 24 | roster | 31.6, 0 | 30.7, 0 | 30.2, 0 |
| Regent x10, Influence | tier 24 | roster | 46.7, 0 | 45.5, 2 | 42.2, 1 |
| | start | roster | 68.9, 2 | 67.3, 2 | 65.3, 1 |
| Regent x6, Influence | tier 24 | roster | 28.2, 0 | 27.4, 0 | 26.7, 0 |
| Regent x7 at Grudge +50% | start | roster / glass | 35.1, 0 / 22.0, 0 | | |
| **Tuned: x6, ATK 1.6, MAG 2.0, area 140 every 2** | tier 24 | roster | **33.6, 20** | | **30.3, 9** |
| | tier 24 | glass | 25.3, 1 | | 23.8, 0 |
| | tier 28 | roster | 32.5, 20 | | 30.7, 9 |
| | start | roster | 49.0, 39 | | 46.3, 34 |
| | start | glass | 31.2, 6 | | 28.0, 8 |
| Tuned harder: x6, 1.8, 2.5, 160 | tier 24 | roster | 33.0, 28 | | 30.1, 18 |
| | start, Grudge +30% / +50% | roster | 39.3, 38 / 35.4, 35 | | |
| Tuned: x5, 2.0, 2.5, 160 | tier 24 | roster | 28.7, 31 | | 26.7, 16 |
| Azzy x3 / x1.1 L29 (outline) | tier 24 | alone | 8.7, 0 lost | 8.2, 0 | 7.8, 0 |
| | start | alone | 10.4, 2 lost | 10.4, 1 | 10.3, 0 |
| | start, Grudge +30% | alone | 8.0, 0 lost | | |
| Azzy x4 / x1.2 L29 | tier 24 | alone | 11.1, 2 lost | 10.4, 3 | 10.4, 2 |
| | start | alone | 12.2, 15 lost | 13.1, 10 | 13.0, 2 |
| Azzy x3 / x1.4 L29 | tier 24 | alone | 6.1, 22 lost | 7.3, 10 | 7.4, 5 |
| Fields: Husher + Sealbearer 29 | tier 24 / start | roster | 4.9 / 5.6, 0 | | 4.9 / 5.2, 0 |
| Fields: Marine x2 + Officer 28 | tier 24 / start | roster | 4.5 / 8.8, 0 | | 4.4 / 8.6, 0 |
| Fields: Sealbearer x2 + Marine 30 | tier 24 / start | roster | 3.9 / 7.9, 0 | | 3.4 / 7.6, 0 |

Every Regent row won 40 of 40, tuned or not. The tuned row at x6 / 1.6 / 2.0 is the recommendation (3.4).

---

## 6. The endings: tone and fairness

- **The verdicts** are the guide's, settled by the owner (pardon with conditions, exile, execution), and the outline's
  staging is the right register for each: the pardon's terms read by the chamberlain as the chapter's one speech; the
  exile as a walk down the nave; the execution off-screen behind a stair with one bell, Elodie leaving before it,
  Anissa in the empty chair. With 3.10's cut of Benny's count and 3.14's confirm, the Iron Throne is a tragedy, not
  a shock. Its last line, "Gigi. The lamp's gone out.", is the hardest line in the game; the reviewer prompt should
  ask for a human read of it, as the outline says.
- **Fair to the player's choices** only with 3.5's recalibration and the Hollow card naming the costs. As dialed, the
  player's twelve chapters of choices feed a score that almost never changes the ending; the verdict alone does.
- **The three endings and the guide.** Just: the council turned to her, Cacica Yari, Marshal, Chief Envoy, Warden of
  Oaths, the houses' fates: right, with 3.3 (the council's book), 3.7 (the family beats) and 3.10 (Anissa at the
  door). Hollow: "Keep working." from Elodie is right. Iron: right.
- **The Seventh Ribbon** stays meaningful after 3.1: it changes *when* (before the Hearing, on every verdict) and adds
  the Stability, rather than being the only way the clause dies.

---

## 7. The 3.5-day estimate against Nov 13 to 16, and the polish pass

The outline's 1.5 days of engine, wiring and sim are honestly costed, and its content is mostly data and dialogue.
Against the Chapter 11 review's yardstick (about 365 lines and 20 transitions for 4 days), Chapter 12 and the epilogue
are about 365 written lines and 10 transitions, but carry the game's two largest stage scenes, three endings and a
score function.

The fixes add about **0.6 days**: the petition heard and Clause Six (0.05), the climax reordered and the damage carry
or its record (0.1), the count's names, the Commission and Clause Twelve lines and the houses' walk (0.05), the
Regent's tuning and one variant (0.05; saves 0.05 on the two cut variants), Stability recalibrated with five save
tests and the Hollow card's lines (0.1), the Regent's arrest and fate lines (0.05), the family beats (0.1), the line
fixes (0.05), the Hearing nine days later with arrivals (0.05), the End card and credits sequence (0.15), the verdict
confirm and credits flag tests (0.05). The cuts save about **0.25**: the tier-28 stock (0.05), two Regent variants
(0.05), the night records-room door and route (0.05), the Hearing at eight witnesses planned instead of fourteen (0.1).

**Judgement: about 4 days.** It fits Nov 13 to 16 only if Chapter 11 is merged by Nov 13. The project is about two
weeks ahead of the plan's dates (Chapter 9 built Oct 22 against Nov 5 to 8), so the better use of the slack is to
**build Chapter 12 as soon as Chapter 11 is merged** and give the whole-game pass more than five days. That pass is the
real risk: a six-hour game, two Turn routes, three verdicts and the Stability dials set "from real runs" cannot be
played by hand in Nov 16 to 21. Before it starts, have **headless routes to all three endings on both Turn routes**
(six, as the outline's step 9 plans) running in `npm test`, and the five Stability saves as unit tests, so the polish
pass plays for feel, not for coverage.

---

## 8. Questions for the owner (only what could change the story's flow; one at a time, recommendation first)

**Question 1 (the outline's own): Who can get Azzy's Challenge (the dark route)?**
*Why it reaches the owner:* how many Strike players see their brother Challenge them changes the climax and the
Hearing's register for them.
1. **(Recommended) Only a Strike player who tells him "the realm had to see him beaten"**, and the Challenge comes
   **after the Regent is beaten** (the guide's "Challenge her too" and COMBAT's "On defeat: Azzy's choice"), with
   Gianna's wounds carried from the Regent's fight (`rules-decisions.md` [42]). Every other Strike save gets the
   furious renunciation, the Share save gets him on the tile beside her, angry. *Reason:* I share the outline's: one
   spoken answer makes it the player's own, and Strike already costs the fleet and (after 3.5) the Just Throne unless
   the rest is earned. The order follows the sources.
2. Every Strike save gets the Challenge.
3. No Challenge in the release (renounce or share only; the duel after the release).

**Question 2 (the outline's own, adjusted): Does old Patricio testify, and where?**
*Why it reaches the owner:* STORY's open question 13 (does he know about the marriage?) is still open, and the last
scenes are where a word from him could settle it by accident.
1. **(Recommended) He comes, and speaks at the Claim, when the petition is heard** (3.1): the sealing only ("I sealed
   six pages under protest. Nobody read me the seventh. I remembered the wrong thing."), standing at the chair his
   young self cut; **at Rael's Hearing he is present and silent**, and he and Rael exchange one look. *Reason:* his
   testimony is about the Seventh Clause, which is not one of Rael's charges; at the petition it is the clause's last
   witness in the room where it is heard, and it is the grandfather's payoff for the Echo. It settles nothing about
   the marriage; when the owner answers 13, one line goes in at the look.
2. As the outline: he testifies at Rael's Hearing about the sealing only.
3. He stays in Zetwal; the Chancellor reads his letter.

**Not owner questions (Claude's calls that follow the sources; record them in STORY 12 and the Epilogue):** the
Regent's Challenge before Azzy's choice (3.2); the count saying her names in the Hall, said by Elodie (3.3: it is the
owner's dual claim made audible; if the owner would rather Gianna say them, it is one speaker change); the Regent
arrested for the almoner's commission and his fate on each card (3.6); the Hearing nine days later (3.9).

---

## 9. The fixes, in build order

1. **Docs:** STORY 12 and the Epilogue (the order: count with names, tile, the Regent's Challenge, the fight, Azzy's
   choice, the chairs, the petition heard with Clause Six, Rael's surrender; the Hearing nine days later; the endings
   with the family beats); COMBAT 13.3 #10 (as tuned: x6, ATK 1.6, MAG 2.0, one battle, no Dawn Surge); a Stability
   section with the recalibrated table and its five saves; CAPITALS 5 (the tokens kept by the chamberlain; the bench
   and gallery positions; the Throne as a chair on the tile); SIDE-QUESTS Se-5 (the paddle; the chamberlain sets the
   tokens; the petition heard) and Se-1 (closed in the arrival scene); PUZZLES (the chair, difficulty 2); FAMILY
   (Benny's note, Azzy and Rael, Elodie beside Rael, Patricio at the chair).
2. **The day-1 sim** from `tools/level-curve.ts`'s numbers at Chapter 11's end, tier-24 gear and both orders, Break Free
   in the bot; the gates in 3.4; the tuned Regent and Azzy at x4 / x1.2; the dark route with HP carried.
3. **Engine:** `stability.ts` and its five tests; the credits hook with its flag cleared; a `partyFirst` flag for the
   Challenges (or the record that it is not done); nothing else.
4. **Maps:** the tile as a non-solid second object; the Echo zone south of the chair; the bench and gallery near the
   nave; the chairs' people standing behind; Hale's placement on Strike; no records-room door; the arrivals on the
   Concourse for the Hearing's morning; the Hall's doors as Anissa's last picture.
5. **Dialogue:** 3.1's petition scene; 3.2's order; 3.3's count, Commission, Clause Twelve and the houses' walk; 3.6's
   arrest; 3.7's family beats and Elodie's corrected lines; 3.8's line table; 3.10's Anissa and no-joke fixes; Rael's
   one-sentence answers to the eight planned witnesses; the remembered choices (`choice.refusal`, `choice.yari_*`,
   `choice.farewell_*`).
6. **The ending:** The End card per ending, the credits sequence, the licence panel last, then the title; the verdict
   confirm; the save before the verdict.
7. **Tests:** the five Stability saves; the six routes to the endings in `npm test`; a lost Challenge returns after
   the Regent's defeat with flags clean; the credits flag not in a save; no `fx: 'signet'` in the surrender or the
   Hearing; no Anissa tip in the duel; the no-joke content test over the Hall, the Claim, the Hearing and the endings;
   no line of the Regent's addressed to Anissa; `party.rael` false everywhere.

Every step ends, as the outline says, with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first
(art drop 1 on Fri Oct 24; card art, portraits and the card back before the Oct 31 rules and card text freeze; order B
on Nov 3; the Nov 8 decision date; the story questions; the Nov 18 fluent check).
