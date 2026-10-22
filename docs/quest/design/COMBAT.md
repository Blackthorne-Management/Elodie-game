# Combat spec

*Design pack, Oct 14. Built on the guide (6.4 battle system, 6.5 classes, 5.8 Rael) and the owner's levelling
decision of Oct 14. Kept from the guide: the four-member party with Anissa as a support system, the visible
speed-based initiative bar, the six commands, the Yield step, Echo Battles and Memories, Game Over with the goddess and the Grudge,
Anissa's Surge with Spark and Calm, Rael's Bound rule, Story / Normal / Hard with Story as the default, and minimal
animations. **Every number here is a proposal** and is tuned by the battle simulation (guide 9, check 3).*

**Where numbers live:** every tunable number in this file goes in `quest/src/config.ts` (named in `code` below).
Enemy stat lines, skills and drops are content and go in `quest/src/data/enemies.ts` and `skills.ts`. The engine is
`quest/src/engine/battle/` (pure TypeScript, seeded Rng, unit tested, no Phaser). Levels and XP already have an
engine shape in `quest/src/engine/rpg.ts` (`xpForLevel`, `levelForXp`, `levelBand`, `itemBonus`); this spec fills in
the numbers it reads from `rpg.levels`.

---

## 1. The battle at a glance

- **Party:** up to 4 active fighters, up to 8 on the roster (Gianna, Yari, Samira, Azzy, Bayarmaa, Haru, Vikram,
  Edmund). Anissa is not a fighter and does not take a slot; she runs the Surge meters. In the Echo the party is
  Patricio, plus Caona when Yari is in the present party, plus Benny once Azzy has joined.
- **Enemies:** 1 to 5 per battle (wild sections: 2 or 3; bosses: the boss plus 0 to 3 adds).
- **Field:** side view, party right, enemies left (proposal); the initiative bar runs across the top.
- **Win:** every enemy down, spared, bribed, parleyed or fled. **Lose:** every fighter down (or Bound): Game Over with
  the goddess (section 12).

## 2. Stats

| Stat | Does | Notes |
|---|---|---|
| HP | Damage you can take | 0 = Down (or Bound in Rael's fights) |
| SP | Pays for skills | Restored by items, resting, level up, and 10% at the end of each battle (`SP_AFTER_BATTLE = 0.1`) |
| ATK | Physical damage | |
| DEF | Cuts physical (by half its value) and magic (by a quarter) | |
| MAG | Spell damage and healing | |
| SPD | Turn frequency, hit and dodge, crits | |

Level 1 stats and growth per level (base / growth). The built members are unchanged; new ones are proposals.

| Member | HP | SP | ATK | DEF | MAG | SPD | Built? |
|---|---|---|---|---|---|---|---|
| Gianna | 42 / 5 | 30 / 4 | 6 / 1 | 6 / 1 | 14 / 2 | 9 / 1 | built |
| Yari | 50 / 6 | 16 / 2 | 12 / 2 | 7 / 1 | 6 / 1 | 13 / 2 | built |
| Patricio (Echo) | 70 / 8 | 10 / 1 | 13 / 2 | 12 / 2 | 3 / 0 | 7 / 1 | built |
| Caona (Echo) | 52 / 6 | 16 / 2 | 12 / 2 | 8 / 1 | 6 / 1 | 14 / 2 | proposal |
| Benny (Echo) | 60 / 7 | 12 / 1 | 14 / 2 | 10 / 2 | 3 / 0 | 11 / 1 | proposal |
| Samira | 44 / 5 | 28 / 3 | 7 / 1 | 6 / 1 | 12 / 2 | 11 / 1 | proposal |
| Azzy | 60 / 7 | 14 / 2 | 14 / 2 | 10 / 2 | 4 / 0 | 9 / 1 | proposal |
| Bayarmaa | 52 / 6 | 14 / 2 | 13 / 2 | 8 / 1 | 4 / 0 | 15 / 2 | proposal |
| Haru | 44 / 5 | 22 / 3 | 11 / 2 | 7 / 1 | 9 / 1 | 16 / 2 | proposal |
| Vikram | 38 / 4 | 18 / 2 | 15 / 3 | 6 / 1 | 6 / 1 | 15 / 2 | proposal (lowest HP, as Agnivansh's Gen IV) |
| Edmund | 66 / 8 | 14 / 2 | 10 / 2 | 14 / 3 | 5 / 1 | 6 / 1 | proposal (+10% max HP from *Aldermoor's Vigil*). **Built Oct 22 (Chapter 9):** 58 / 7, 18 / 2, 11 / 2, 12 / 2, 5 / 0, 8 / 1 (the Vigil folded into the base) |

## 3. Turn order and speed

A charge-time system shown on the initiative bar (the next 8 turns).

- Each fighter has a **next-turn time**. The lowest goes next. Ties: party before enemies, then higher SPD, then roster
  order (no randomness in ties).
- **Delay** after acting: `round(TURN_DELAY_K / (SPD + TURN_DELAY_OFFSET))`, with `TURN_DELAY_K = 1200` and
  `TURN_DELAY_OFFSET = 30`, times the action's weight:

  | Action | Weight (`ACTION_WEIGHT`) |
  |---|---|
  | Attack, most skills, Parley | 1.0 |
  | Heavy skills (Oathbreaker, Reign of Ashes, boss specials) | 1.3 |
  | Item | 0.8 |
  | Guard | 0.6 |
  | Swap Member | 0.5 (the incoming member acts at once) |

- **Opening times:** each fighter starts at `Delay x U(0.3, 1.0)` from the seeded Rng. An ambush (enemy first strike)
  gives the enemies 0.3 and the party 1.0; a party first strike (approaching from behind on the field) is the reverse.
- **The dice (built Oct 21):** every fight's seed comes from the save, not the clock: the fight's id and how many
  times it has been started on this save (`battle.tries.<table>.<group>`; `battleSeed` in `engine/battle.ts`). The
  same save replays the same fight (the browser test, the simulator); every new try, a retry after Game Over
  included, rolls new dice. *Claude's call:* the try is counted when the fight starts and saved with the next save, so
  closing the app mid-fight and loading again replays that fight exactly.
- Example: Gianna at level 1 (SPD 9) waits 31; Yari (SPD 13) waits 28, so Yari gets about 11% more turns.

## 4. Commands

| Command | Does |
|---|---|
| **Attack** | Weapon hit, power 100. |
| **Skill** | Costs SP. Each member's list is in Section 9. Gianna pays about 25% less (rounded down, minimum 1). |
| **Item** | Use a consumable from the bag. |
| **Guard** | Damage taken x0.5 until the member's next turn. For Gianna, Guard also gives Anissa +2 Spark. |
| **Swap Member** | Swap an active fighter with a benched one. |
| **Parley** | Only vs. human enemies. Ends the fight with no Fear gain (guide 6.4). See 7.2. |

Run is not a battle command; on the field, Run is offered in the encounter scene before the fight (as built), and
always works in wild sections, never in boss or story fights.

## 5. Damage and healing

All results are whole numbers, rounded at the end. `V` is the seeded variance `U(0.92, 1.08)` (`DAMAGE_VARIANCE`).

**Physical:**
`raw = ATK x Power / 100`
`damage = max(ceil(raw x 0.15), raw - DEF_target x 0.5) x V x Crit x Mods`

**Magic:**
`raw = MAG x Power / 100`
`damage = max(ceil(raw x 0.15), raw - DEF_target x 0.25) x V x Mods` (spells never crit, never miss)

**Healing:**
`heal = MAG x Power / 100 x U(0.95, 1.05)`, never above max HP. Items heal fixed amounts (as built: soup 40, mango
15), and the clay-pot soup heals over 3 turns (its built text).

**Hit and crit (physical only):**
- Hit chance: `95 + (SPD_attacker - SPD_target) / 2`, clamped to 75 to 99 percent (`HIT_BASE`, `HIT_MIN`, `HIT_MAX`).
- Crit chance: `5 + (SPD_attacker - SPD_target) / 4`, clamped to 2 to 25 percent; crit damage x1.5 (`CRIT_MULT`).

**Modifiers (multiply together):** Surge x1.5; Grudge x1.1 / 1.2 / 1.3; Marked x1.25 (taken); Inspired x1.25
(dealt); Weakened x0.75 (dealt); Guarding x0.5 (taken); elemental weakness x1.5, resistance x0.5; difficulty
(Section 14).

**Worked example (level 3, Chapter 2):** Yari (ATK 16 + bow 4 = 20) shoots a level 3 Crown Marine (a skirmisher:
HP 31, ATK 14, DEF 7): `20 - 3.5 = 16` damage, so 2 shots fell it. The marine hits Gianna (DEF 8 + robe 2 = 10) for
`14 - 5 = 9` of her 52 HP, about 6 hits. On Story difficulty that becomes 6 (x0.7).

## 6. Levels and XP

The owner's decision (Oct 14): each character has a level and XP; enemies show their level colour-coded against
yours; gear has a level and gives only part of its bonus below it.

**Curve** (`LEVELS.xpBase = 40`, `LEVELS.xpExponent = 1.8`, `LEVELS.cap = 30`), as the engine's
`xpForLevel(lv) = round(xpBase x (lv - 1) ^ xpExponent)`:

| Lv | Total XP | Lv | Total XP | Lv | Total XP |
|---|---|---|---|---|---|
| 2 | 40 | 12 | 2,996 | 22 | 9,595 |
| 3 | 139 | 13 | 3,504 | 23 | 10,433 |
| 4 | 289 | 14 | 4,047 | 24 | 11,302 |
| 5 | 485 | 15 | 4,625 | 25 | 12,202 |
| 6 | 725 | 16 | 5,236 | 26 | 13,133 |
| 7 | 1,006 | 17 | 5,881 | 27 | 14,093 |
| 8 | 1,328 | 18 | 6,559 | 28 | 15,084 |
| 9 | 1,689 | 19 | 7,270 | 29 | 16,104 |
| 10 | 2,088 | 20 | 8,013 | 30 | 17,154 |
| 11 | 2,524 | 21 | 8,788 | | |

**Where XP comes from:**

| Source | XP | Who gets it | Config |
|---|---|---|---|
| Story beat (a Journal objective done) | as built (levels pass, Oct 22): 15 in Ch. 1, then 15 + 5 x chapter (25, 30, 35, 40) | shared (everyone, Echo members too) | `XP_PER_OBJECTIVE_BY_CHAPTER` |
| Lore book read | 4 | shared | `XP_BOOK` |
| Puzzle solved (signature / minor / secret) | 60 / 25 / 150 x chapter tier | shared | `XP_PUZZLE` |
| Side quest | per quest (`SIDE-QUESTS.md`) | shared | data |
| Debate won / mediated | 15 / 25 | shared | `XP_DEBATE` |
| Enemy defeated | `6 + 4 x level` x role x band | each active fighter in full; benched members 50% | `XP_ENEMY`, `XP_BENCH_SHARE = 0.5` |
| Boss | `100 + 20 x level` | as above | `XP_BOSS` |

Shared XP uses the built `xp.shared` and `XP_RULES`; battle XP uses `xp.<member>`. Because story XP is shared, a
companion who joins late arrives near the party's level without grinding.

**Role multiplier** (`XP_ROLE`): swarm 0.5, skirmisher 1.0, caster 1.0, support 1.0, brute 1.25, tank 1.25.

**Level bands** (`LEVELS.bands = { trivial: 5, hard: 3, deadly: 6 }`; `levelBand` in the engine). The foe's level is
compared with the party level (the built `partyLevel`: the fighters' average, rounded down):

| Band | Foe level minus yours | Colour on the level tag | XP multiplier (`XP_BAND`) | On the field |
|---|---|---|---|---|
| Trivial | 5 or more below | grey | x0.2 | Story and Normal: grey ambushes back off ("They think better of it"), no battle (`SKIP_TRIVIAL_AMBUSH`) |
| Even | 4 below to 2 above | white | x1.0 | |
| Hard | 3 to 5 above | orange | x1.25 | |
| Deadly | 6 or more above | red | x1.5 | A warning line before a story fight |

The level tag shows on the encounter scene, over each enemy in battle, and in the bestiary. The colours also differ by
shape for colour-blind players (guide 9): grey hollow circle, white circle, orange triangle, red diamond.

**Levelling up:** stats grow by the member's growth line; HP and SP refill by the amount gained. A short fanfare and
a line from the member.

**Chapter targets** (from `STORY.md`): Ch. 1 ends at 3, Ch. 2 at 8, Ch. 3 (Ardencia) at 11, Ch. 4 (Al-Doria) at 14, Ch. 5 at 15, the three
roads 15 to 21, Ch. 9 at 24, Ch. 10 at 25, Ch. 11 at 28, Ch. 12 at 30. Roughly: about 3 to 4 standard battles per
level plus story, books and quests. The simulation checks that a player who skips all side quests is no more than 2
levels under the target.

**The level-curve check (built Oct 21):** `npm run level-curve` (`tools/level-curve.ts`, asserted in
`tests/levelCurve.test.ts`) replays the scripted route, pays what the field pays (fights, side quests, debates) and
prints each chapter's end level with and without side quests against `src/data/chapterLevels.ts` (STORY.md's table,
Ardencia 3, Al-Doria 4, the roads in fixed order). Tolerances are `LEVEL_CURVE` in config. First run: Chapter 1 ended
at level 6 (4 without side quests) against 3, because every Journal step paid a flat 25 instead of this section's 10
in Chapter 1; Chapter 2 at 9 against 8 (10 once its five side quests became required). The levels pass below fixed
both.

**The levels pass (Oct 22; Claude's calls, from the Chapter 6, 7 and 8 outline reviews' level findings):**

1. **One ambush rule, relative to the party's level (Claude's call).** A won random ambush paid `10 x group level x
   foes` (a level-20 trio: 600 XP, more than the whole 20-to-21 gap). It now pays a share of the party's own next
   level, sized by the foes and scaled by the group's level against the party's (`AMBUSH_XP` in config,
   `ambushXp` and `battleXp` in `engine/battle.ts`, paid by `settleBattle` at the party's level when the fight ends):
   `gap = xpForLevel(P + 1) - xpForLevel(P)`, `size = min(foes, 4) / 3`,
   `relative = clamp(1 + 0.25 x (group level - P), 0.25, 1.5)`, `XP = round(0.12 x gap x size x relative)`.
   A pair at the party's level pays 8% of a level; a party over its region's level gets less from each fight, one
   under it more (to x1.5). It applies at every level (the Ch8 review proposed it from 12; one rule everywhere is
   simpler, and Chapters 1 to 3 were being retuned anyway). Gold is unchanged (`ENCOUNTER_GOLD_PER_LEVEL`). The
   Chapter 8 review's worked cases hold (party 15, trio at 15: 48; party 20, trio at 20: 57; party 21, trio at 20:
   44; party 23, pair at 21: 21; `tests/levelCurve.test.ts`).
2. **The played line (Claude's call on the method, the review's design).** `tools/level-curve.ts` now also records the
   route's wild steps (each tile walked in an ambush zone, with its table; a map change restarts the grace count),
   replays them through the ambush process (`ENCOUNTER_GRACE_STEPS`, `ENCOUNTER_CHANCE_PER_STEP`, the table's
   weights) for seeds 1 to 200, pays each ambush by the rule at the running level in place of the route's own, and
   reports the median and 90th percentile, and a "wanderer" (150 more wild steps per chapter in that chapter's
   zones). `tests/levelCurve.test.ts` asserts every chapter is on target on the route line and on the played median,
   with the played 90th percentile and the wanderer's at most one over.
3. **Story steps pay by chapter (Claude's call).** `XP_PER_OBJECTIVE_BY_CHAPTER = [15, 25, 30, 35, 40]`: 15 in
   Chapter 1, then 15 + 5 x chapter (this section's shape, 5 lower than its formula; a later chapter pays the last
   entry until its own row is added). Chapter 1 pays 15, not 10: at 10 Gianna would meet the boar at level 2, and the
   boar is balanced on level 3 (`tests/battle.test.ts`); at 15 she still arrives at 3 (175 XP), so the boar fight is
   exactly as it was (battle-sim at `@cane-road`, unchanged: Attack alone 39 wins in 40, 61% of the party's HP lost;
   the spells 40 in 40, 25%). The rise from Chapter 3 keeps a player who skips every side quest within two levels
   (Chapters 4 and 5 were at the edge and fell to three under with the ambush rule).
4. **Side-quest XP (Claude's call).** Chapter 1: the Overdue Shelf 50 to 30, Soup for the Cousins 40 to 25, A Name in
   the Cane 50 to 30, A Question of Faith 30 to 20 (gold, items and pillars unchanged). Chapter 4: Appraise This 110
   to 70, Sweet Water 130 to 80 (what Chapter 4's steps gained, its side quests give back). Chapters 2, 3 and 5
   unchanged.
5. **Chapter 2's fights follow the party down a level (Claude's call, to keep review 1's balance).** The party now
   meets the Crown attack at 6 and Thorne at 7 (it was 7 and 8), so the caney breach and the village patrol fight
   at 5 (were 6) and Thorne at 7 (was 8) with his full HP (`hpScale` 1, was 0.9). Battle-sim (40 runs, plans as in
   `tools/battle-sim.ts`), before and after:

   | Fight (marker) | Plan | Before (Grudge 0 / +50%) | After (Grudge 0 / +50%) |
   |---|---|---|---|
   | Thorne (`@seacave`) | Attack | 9 / 37 won, 96% / 70% hurt | 8 / 36 won, 97% / 76% hurt |
   | Thorne | Spells | 40 / 40, 28% / 26% | 40 / 40, 31% / 28% |
   | Village patrol (`@patrol`) | Attack | 17 / 32 won, 96% / 84% | 20 / 35 won, 93% / 82% |
   | Village patrol | Spells | 40 / 40, 24% / 12% | 40 / 40, 20% / 12% |
   | Caney breach (`@attack`) | Attack | 37 / 39 won, 66% / 55% | 38 / 40 won, 64% / 52% |
   | Caney breach | Spells | 40 / 40, 26% / 13% | 40 / 40, 22% / 13% |
   | Pier (`@end-card`, unchanged, enemies at their own levels) | Attack | 40 / 40, 42% / 28% | 37 / 40, 63% / 40% |

   The pier, Chapter 2's first fight, is now met a level lower (4) and hurts more; it stays winnable by Attack alone
   37 times in 40, so it is left as it is.

**The curve after the levels pass** (`npm run level-curve`; seeds 1 to 200 for the played line):

| Ch | Target | Route: end level (XP) | No side quests | Wild steps | Played median (XP) | Played p90 | Wanderer p90 |
|---|---|---|---|---|---|---|---|
| 1 | 1-3 | 4 (425) | 3 (275) | 0 | 4 (425) | 4 | 4 |
| 2 | 3-8 | 8 (1,384) | 7 (1,099) | 71 | 8 (1,384) | 9 | 9 |
| 3 | 8-11 | 11 (2,249) | 10 (1,714) | 0 | 11 (2,249) | 11 | 11 |
| 4 | 11-14 | 14 (3,284) | 12 (2,489) | 14 | 14 (3,284) | 14 | 14 |
| 5 | 14-15 | 15 (3,699) | 13 (2,764) | 16 | 15 (3,699) | 15 | 16 |
| 6 | 15-17 | 17 (4,579) | 15 (3,474) | 38 | 17 (4,611) | 17 | 18 |
| 7 | 17-19 | 19 (5,493) | 17 (4,243) | 145 | 19 (5,525) | 19 | 20 |

Before it: 6, 10, 12, 15, 15 (the route line; ambushes then paid 10 x level x foes). The route walks few wild tiles
(none in Ardencia: the sea road skirts the Cinder Flats' fields), so the played median sits on the route line; the
wanderer is what a player who explores the wilds gets. **For the Chapter 6 to 8 outlines:** their level plans assumed
25 XP a step and an ambush taper; Chapter 6 now starts at 3,699 (level 15), its steps pay 40 until it gets its own
row, and ambushes follow the rule above, so re-run their sums with `level-curve.ts` when each is built.

**Chapter 6 (built Oct 22; Claude's calls):** its steps pay **65** (`XP_PER_OBJECTIVE_BY_CHAPTER[5]`), not the
formula's 45: the line without side quests reaches Chapter 6 two under (13 against 15) and the formula would leave it
three under; Ordvik's side quests and fights pay less than its outline planned (S-5 50, S-3 60 and its wolves 40, the
debate 20, Grimvald 120, the lookouts 40, the bout 0) so the route and the played line end on 17, not 18. Eleven books
at 10. Measured: route 17 (4,579), without side quests 15 (3,474), played median 17 (4,611), p90 17, wanderer 18.
Kuroshi (17 to 19) is met at 17. Chapter 8 gets its own row when built.

**Chapter 7 (built Oct 22; Claude's calls):** its steps pay **44** (`XP_PER_OBJECTIVE_BY_CHAPTER[6]`). At 42 the line
without side quests ended at 4,221, one XP short of 17; at 44 it ends on 17 (4,243). Four objectives pay nothing
(`noXp`: the mist, the lantern hour's follow-the-quest step, the lanterns, the west): they are travel or a side
quest's own payment. Kirinoura pays the Fox 140, K-2 50 (and the stacks' cutpurses 30), K-3 50 (and the moths 30),
the debate 15 (side XP 145 with the books' share); fourteen books. Measured (`tools/level-curve.ts`, seeds 1 to 200): route 19 (5,493), without side quests
17 (4,243), played median 19 (5,525), p90 19, wanderer p90 20. The second review's fear (3.5) that the played start
would already be 19 did not come true on the built curve: Chapter 6 ends at 17 (4,579 route, 4,611 played), so the
band holds without re-basing the road tiers. Jwaladesh (19 to 21) is met at 19.

**Chapter 8 (built Oct 22; Claude's calls):** its steps pay **60** (`XP_PER_OBJECTIVE_BY_CHAPTER[7]`): at 44 the line
without side quests ended three under 19. Three objectives pay nothing (`noXp`: the chain, the night lamp's
follow-the-quest step, the north). Agnipur pays Dhanraj 140, J-2 and J-3 25 each, the salt road's enforcers 20, the
quay watch 30, the debate 15, the duel 0; thirteen books. Measured (`tools/level-curve.ts`, seeds 1 to 200): route 21
(6,448), without side quests 19 (5,113), played median 21 (6,480), p90 21, wanderer p90 22; no wild steps on the
route. Aldermoor (21 to 24) is met at 21.

| Ch | Target | Route end (XP) | No side quests | Played median | Played p90 | Wanderer p90 |
|---|---|---|---|---|---|---|
| 6 | 15-17 | 17 (4,579) | 15 (3,474) | 17 (4,611) | 17 | 18 |
| 7 | 17-19 | 19 (5,493) | 17 (4,243) | 19 (5,525) | 19 | 20 |
| 8 | 19-21 | 21 (6,448) | 19 (5,113) | 21 (6,480) | 21 | 22 |

**The four betrayer houses' price ranges** (the Chapter 8 review's 3.4; the betrayer is the house paid least fully,
guide 6.3). From the built `pillarRules` and side quests, read by hand (Jwaladesh's is tested):

| House | Motive, price | Floor (least a finished chapter pays) | Ceiling | Notes |
|---|---|---|---|---|
| Al-Doria (Ch. 4) | Wealth | not computed yet | | to measure with a tool before the Muster is built |
| Skarragol (Ch. 6) | Wealth 10 | about 2 (The Winter Stores 1, Samira's letter 1) | about 8 | can never be paid in full by choices alone; gold gifted counts |
| Kuroshi (Ch. 7) | Influence 10 | about 7 (K-2 2, K-3 1, the debate's quest 1, listening 1, the receipts 2) | above 10 | the petition, Samira's names, the Fox spared and the books add |
| Jwaladesh (Ch. 8) | Wealth 8 | **4** (Dhanraj broken 1, J-2 1, J-3 2; the advances kept) | **10** (spared 3, given 4) | `tests/jwaladesh.test.ts` |
| Aldermoor dissidents (Ch. 9; not a betrayer house) | Fear 8 | **5** (Al-3 3, the Hushed beaten 1, Jordyn's defection 1; tried by their law) | **6** (broken before the city +1) | the second review's option (a): it can be short ("Not yet"); `tests/aldermoor.test.ts` |

Any of the four can be the least paid; a test that computes all four ranges from the data belongs with the Muster.

**The Muster's ledger (built Oct 22, Chapter 10; Claude's calls, the second review's 3.5; `ALLY_PRICES` and `MUSTER` in
`quest/src/config.ts`, `quest/src/engine/ally.ts`, `tests/ally.test.ts`):**

| House | Price | Army | Also counts | Tie |
|---|---|---|---|---|
| Al-Doria (Dorini) | Influence 10 | 40 | the merchants' mediation +2 | 1 |
| Skarragol (Ironvow) | Wealth 10 | 50 | gold at the camp, 100 a point, 5 at most | 2 |
| Jwaladesh (Agnivansh) | Wealth 8 | 30 | gold at the camp | 3 |
| Kuroshi (Suzumori) | Influence 10 | 20 | the temple mediation +2 | 4 |
| Free Brasador | Fear 6 (the realm's) | 30 | never the buyer | |
| Aldermoor dissidents | Fear 8 (the realm's) | 12 | never the buyer | |

The city's pillar in the price's currency counts in full and the other two at half; lore books count at most 3. Shares
are in the Journal from the landing. At the inspection the least share of the four road houses is the buyer; its army
waits for the night (turned: three quarters; sailed: none). Exposed needs a 60% share, Kayla's list and the smugglers'
ledger. Paying over the price adds a tenth of the army per point; a feud argued and not mediated brings nine tenths. The
city's levy is 60. Gifts close at the whistle.

**Chapter 9 (built Oct 22; Claude's calls):** its steps pay **70** (`XP_PER_OBJECTIVE_BY_CHAPTER[8]`; three pay nothing:
the Mere Stair, the Toccata's follow-the-quest step, home). Aldermoor pays the Hushed 260, the press-gang 50, the bog
chapel's cell 40, Al-3 60, Al-2 40, the debate 15; seven books. Measured: route 24 (8,028), without side quests 22
(6,538), played median 24 (8,060), p90 25, wanderer p90 25; four wild steps on the route. The Muster (24 to 25) is met at
24 (25 needs 8,082).

| Ch | Target | Route end (XP) | No side quests | Played median | Played p90 | Wanderer p90 |
|---|---|---|---|---|---|---|
| 8 | 19-21 | 21 (6,448) | 19 (5,113) | 21 (6,480) | 21 | 22 |
| 9 | 21-24 | 24 (8,028) | 22 (6,538) | 24 (8,060) | 25 | 25 |
| 10 | 24-25 | 25 (8,533) | 23 (7,033) | 25 (8,607) | 26 | 26 |
| 11 | 25-28 | 28 (10,260) | 26 (8,640) | 28 (10,318) | 29 | 29 |
| 12 | 28-30 | 30 (11,455) | 28 (9,795) | 30 (11,513) | 30 | 30 |

**Chapter 10 (built Oct 22; Claude's calls, the second review's 3.4):** set from Chapter 9's measured end (24, 8,028):
its steps pay **40** (`XP_PER_OBJECTIVE_BY_CHAPTER[9]`; the seated city and the tide pay nothing); the crew 50; Z-6 10
XP, Z-3 none (their XP moved into the steps); the feuds pay through the debates. 77 wild steps on the Cane Road (0.9
ambushes on average). Chapter 11 (25 to 28) starts at its floor.

**Chapter 11 (built Oct 22; Claude's calls, the second review's 3.9):** set from Chapter 10's measured end (25, 8,533):
its steps pay **58** (`XP_PER_OBJECTIVE_BY_CHAPTER[10]`; the gate and the caney pay nothing), because the war is three
levels wide and the line without side quests arrives two under; the named fights pay 80 (the headland), 160 (the
flank), 140 (Thorne), 60 (the stand), 180 (Hale or Rael); the Ninth Thumbprint, Harbors Lie and the picket 40 each.
282 wild steps on the war's table (3.3 ambushes on average). Chapter 12 (28 to 30) starts at its floor.

**Chapter 12 (built Oct 22; Claude's calls):** set from Chapter 11's measured end (28, 10,260): its steps pay **120**
(`XP_PER_OBJECTIVE_BY_CHAPTER[11]`; the ash road, the wait until the bell, the bell, Rael's surrender and the whole
Epilogue pay nothing); the Regent 420; *A Seat for Every House* 40 and *Volume One* 20. No wild steps on the route (the
Crossroads Fields' war table is for a player who walks out: veils, marines and Sealbearers at 28 to 30, four to nine
actions, nobody down). The route ends on 30, the cap; the line without side quests on 28.

**The three roads (any order):** the first of Skarragol, Kuroshi and Jwaladesh entered is set to levels 15 to 17, the
second 17 to 19, the third 19 to 21 (`ROAD_TIERS`). Fixed on first entry.

## 7. After the fight: Yield and Parley

### 7.1 The Yield step (guide 6.4)

When a **human** enemy group is beaten down (its leader, or every human left, below 25% HP: `YIELD_THRESHOLD = 0.25`),
the battle pauses once and offers (proposal: once per battle, for the whole group, so groups are not tedious):

| Choice | Pillar | Other effect (`YIELD_REWARDS`) |
|---|---|---|
| **Spare** | +1 Influence (in this city) | gold x0.5, XP x1.0, the enemy may reappear later as a friendly NPC |
| **Take spoils** | +1 Wealth (in this city) | gold x2, one extra item drop |
| **Break them** | +1 Fear (in this city) | XP x1.1; the enemies' faction in this city is cowed (fewer ambushes for 100 steps) |

Bosses have scripted Yields (Thorne, Qasim, Dhanraj, the Paper Fox, the Betrayer). Rael's fights never offer Yield
(5.8: special rules). Animals and the Quiet Crown's Hushers do not yield (they flee or fall).

### 7.2 Parley

Only against humans. Succeeds at once if the realm Influence score is at least the group's `parley` value (data);
otherwise `PARLEY_CHANCE = 0.35`. Failure costs the turn and the enemies gain Inspired for 2 turns (they are insulted).
Success ends the fight: no Fear, XP x0.5, gold x0.5. **Samira's Bribe** is the gold-paying cousin of Parley (9.6).

### 7.3 Pillars from fighting (proposal)

So Fear does not explode: **+1 Fear** per boss beaten and per Break; ordinary wins add +1 Fear for every 6 battles won
in that city (`FEAR_PER_WINS = 6`). Influence and Wealth from fights come only from Yield choices and Samira.

## 8. Anissa's Surge (guide 6.4, kept exactly)

- Anissa has **Spark** (0 to 10) and **Calm** (0 to 3). She is not targetable by normal attacks.
- Spark **+1** whenever Gianna acts, **+2** when Gianna uses Guard (shielding her) (`SPARK_ON_ACT`, `SPARK_ON_GUARD`).
- Spend **5** Spark: **Surge**. Gianna's next spell or attack deals +50% and splashes to all enemies (the main target
  takes the full +50%; the others take 60% of that hit: `SURGE_SPLASH = 0.6`, proposal).
- At **10** Spark, **Dawn Surge**: the same, and the party heals 30% of max HP (`DAWN_HEAL = 0.3`).
- **Pairing rule:** Gianna's skills cost about 25% less SP (`GIANNA_SP_DISCOUNT = 0.25`, rounded down, minimum 1), and
  Spark reaches her at full value. Anyone else channeling Spark would lose half (proposal: from Chapter 10 Anissa can
  choose to feed one Surge to another member at half power, so the player sees the rule).
- **Calm:** Hushers' **Frighten** lowers Calm by 1. At 0, Anissa goes quiet and Surge is unavailable until Gianna uses
  **Comfort** (SP 2, so 1 for her: Calm +2). No game over from this.
- **Anissa can never be hit** (owner, Oct 15). The Shield Anissa command is dropped (Oct 15). Enemy moves once aimed
  at her go after what she gives the party (Oct 20, Claude's call under the owner's rule): **Seize**: the enemy
  reaches for her, Gianna steps in the way, 3 Spark is torn away and Gianna is Marked for two turns; **Hush the
  Light**: a whisper at her, Calm -2 (at 0 she goes quiet and Surge waits for Comfort). Shown: the enemy turns toward
  her and Gianna moves in front.
- **She is a person, not a battery:** she hides behind Gianna when a fight opens, says one short line on Surge, and the
  Surge gesture grows more confident with each chapter (`SURGE_ANIM_STAGE` by chapter: 1 = hesitant to 4 = sure).

## 9. Skills by member

SP shown is the base; Gianna pays 25% less. "Board" names the board game ability each skill comes from
(`docs/bloodline-houses.md`).

### 9.1 Gianna (Archivist-Mage, Kay Soley)

| Skill | SP (hers) | Effect | Board |
|---|---|---|---|
| Limyè Elodie | 6 (4) | Heal one ally, power 150 | Limyè Elodie |
| Comfort | 2 (1) | Anissa's Calm +2 | |
| Sunthread | 5 (3) | Light damage to one enemy, power 120 | |
| Sèman Lapè | 12 (9) | Peace Oath: one enemy and the party cannot harm each other for 2 turns, and it skips them (bosses: 1 turn; once per battle) | Sèman Lapè |
| Rit Solèy | Resolve gauge full | Limit break: revive and heal the whole party 60%, light damage to all enemies, power 180 | Rit Solèy |
| Say Their Names | 16 (12) | Secret item (Solange's Quill) | |
| Limyè pou Tout | 10 (7) | **Built (Oct 15).** Light for all: heal every ally, power 80 | |
| Benediksyon | 4 (3) | **Built (Oct 15).** Inspired on one ally (3 turns) | |

**Spells from books (guide 6.5: she learns spells from lore books she reads), proposal:** reading 5 of a capital's
library books teaches its spell: Zetwal *Mend* (regen 8% for 3 turns), Xaraguá *Tidewash* (cleanse one ally), Al-Doria
*Appraise* (show an enemy's stats and weakness), Ardencia *Ember Ward* (fire resistance to all), Seat *Gaze*
(Marked on all enemies for 2 turns), Skarragol *Brisk Wind* (party SPD +20% for 3 turns), Kuroshi *Lantern* (Fogged
on all enemies), Jwaladesh *Dawnfire* (light damage to all, power 140), Aldermoor *Ward of Patience* (party DEF +25%
for 3 turns).

**Resolve gauge** (Gianna only, proposal): fills 1 per 2% of party max HP she heals and 5 per ally downed; 100 = full
(`RESOLVE_*`).

### 9.2 Yari (Archer, Yaguana)

| Skill | SP | Effect | Board |
|---|---|---|---|
| Voice of the Opía | passive | When any fighter falls, Yari gains a charge (max 3); each charge adds +20% to her next shot | Voice of the Opía |
| Guaíza | 8 | Once per battle: copy the last skill an enemy used and use it now | Guaíza |
| Volley | 6 | Three arrows at random enemies, power 60 each (**built**, ATK) | |
| Arrow Rain | 9 | **Built (Oct 15).** Wind arrows at every enemy, power 75 (ATK) | |
| Tracker's Mark | 4 | **Built (Oct 15).** Marked on one enemy (3 turns) | |
| Song of Coaybay | 14 | Once per battle: gain a second passive copied from an enemy type defeated in this battle, until the end of the battle | Song of Coaybay |

The hutia (proposal): a 1-in-8 chance after a win to steal one shiny extra drop.

### 9.3 Azzy (Blade-Knight, Brasador)

**Built (Oct 20, fighters as data):** an entry in `data/rpg.ts` (joins on `party.azzy`, which no story sets yet) and
his skills in `data/battles.ts`. Sangre Ardiente, La Marca, Grito de Guerra (the new Stunned status; on a boss 50%)
and Reinado de Cenizas (heavy, `ACTION_WEIGHT.heavy = 1.3`) all run. *Claude's call:* as an attacker he also has
weapon moves (Slash, Heavy Blow, Sweep, as Patricio's), and starts with the Steel Saber and the Officer's coat.

| Skill | SP | Effect | Board |
|---|---|---|---|
| Sangre Ardiente | passive | +5% ATK per enemy he fells this battle (max +25%) | Sangre Ardiente |
| La Marca | 4 | Mark one enemy: Marked for 3 turns (x1.25 damage taken, enemies of its group target it last) | La Marca |
| Grito de Guerra | 7 | One enemy skips its next action; 50% chance on bosses | Grito de Guerra |
| Reinado de Cenizas | 12 | Once per battle: a hit of power 120 + 40 per enemy felled this battle | Reinado de Cenizas |

### 9.4 Bayarmaa (Raider, Ironvow)

| Skill | SP | Effect | Board |
|---|---|---|---|
| Ironvow's Oath | passive | Her opening time is always the lowest in the party | Ironvow's Oath |
| Raider's Charge | 5 | Hit, power 130, and her delay this turn is halved | Raider's Charge |
| Hoofbeat | 6 | Salkhi kicks: power 90 to one enemy, Stunned 1 turn 25% | |
| The Great Raid | 16 | Once per battle: take two full turns in a row | The Great Raid |

**Built (Oct 22; Chapter 6):** base HP 56, SP 16, ATK 13, DEF 8, MAG 4, SPD 15; growth HP 6, SP 2, ATK 2, DEF 1, SPD 2
(the fastest in the party). Starts with a Steppe Sabre of Swiftness and a braided riding coat. Ironvow's Oath is real
(`opensFirst`: her opening time is the party's lowest); Raider's Charge 130 with weight 0.5; Hoofbeat 90, Stunned on a
boss a quarter of the time; The Great Raid 150, once, weight 0 (her next turn at once). Moves: Slash, Heavy Blow,
Horse-Tail Sweep (every foe). She fights second, after Gianna, from the Moot until the chapter ends (`MemberDef.leads`).
**Noyan Grimvald** (13.3), built: level 17 brute, hp x5, atk x1.3 (sim numbers in the Chapter 6 outline's Built
section); phases at half (unhorsed, two reavers ride in, the Stolen Standard inspires them) and at a quarter or a Surge
in that phase (the standard falls); he withdraws at 0 HP.

### 9.5 Haru (Shadow agent, Suzumori)

| Skill | SP | Effect | Board |
|---|---|---|---|
| Kagemimi | 3 | Show one enemy's next action for 3 turns | Kagemimi |
| Sasayaki Ha | 6 | Strip one buff from an enemy, or cancel a charging skill | Sasayaki Ha |
| Paper Smoke | 5 | Party evasion +15% for 2 turns | |
| Ayatsuri | 14 | Once per battle: one enemy's next action targets another enemy instead | Ayatsuri |

**Built (Oct 22; Chapter 7):** base HP 44, SP 22, ATK 11, DEF 7, MAG 9, SPD 16; growth HP 5, SP 3, ATK 2, DEF 1, MAG 1,
SPD 2. Starts with a Paper Knife of Swiftness and a grey kimono. He joins at the lantern hour (`party.haru`), walks as
the sixth follower and fights second, after Gianna, until the chapter ends (`MemberDef.leads`; Samira and Bayarmaa
step back). Kagemimi is real (`SkillDef.reveal`): the target's next move is told as text, a foe in disguise is found
out, and the real one is Marked (Claude's call: the next-move display above the target is not built; the line says
it). **Fallbacks (Claude's calls):** Sasayaki Ha is a 110 cut that Weakens (a boss half the time) in place of the
buff strip and the charge cancel, which need engine work no fight yet asks for; Paper Smoke is Warded on the party
(Fogged is the enemy-side evasion, and the engine has no evasion on allies); Ayatsuri Stuns one foe once a battle (a
boss half the time) in place of the redirect. Moves: Quick Cut 100, Twin Cut (two cuts at random foes, 75 each),
Throat Cut 150. The board names stay.

### 9.6 Samira (Alchemist, Dorini)

The owner decision of Oct 14 says Wealth is a score that is never spent, so **Daftar spends gold** (owner approved,
Oct 20).

**Built (Oct 20, fighters as data):** an entry in `data/rpg.ts` (joins on `party.samira`, which no story sets yet),
Baraka Dorini (+10% battle gold), Tonic, and Daftar as three skills paid in gold: *Remedy* (10 HP per 20 gold),
*Hired Blade* (10 damage per 20 gold, through any armour) and *Patronage* (Inspired, 60 gold); Wealth adds 1% a point
up to 30% (`DAFTAR_WEALTH_PER_POINT`, `DAFTAR_WEALTH_MAX`). Gold spent comes off the purse when the fight is won; a
lost fight gives the moment back, gold included. *Claude's call:* Remedy and Hired Blade cost 20 gold plus 10 per
Samira's level (a fixed amount per use, so there is no amount to pick on a phone; at level 11 that is 130 gold for
65 points). She is a mage by gear (staff, robe) without a spellbook: all her skills are always in hand. Not built
yet: Bribe and Bazaar al-Dhahab (they need human foes and extra turns; Chapter 4 work).

| Skill | SP | Effect | Board |
|---|---|---|---|
| Baraka Dorini | passive | Gold from battles +10% | Baraka Dorini |
| Daftar | gold | Spend gold for an effect: 20 gold per 10 HP healed, or 20 gold per 10 damage, or 60 gold for Inspired on an ally; the effect grows +1% per realm Wealth point (max +30%) | Daftar al-Dorini |
| Bribe | gold | Vs. one human: pay `25 x level` gold, they leave the fight (no XP, no Fear) | |
| Bazaar al-Dhahab | 200 gold | Once per battle: one ally takes a full extra action now | Bazaar al-Dhahab |
| Tonic | 6 | Heal one ally, power 110, and cleanse one status | |

### 9.7 Vikram (Fire duelist, Agnivansh)

| Skill | SP | Effect | Board |
|---|---|---|---|
| Agni ki Shakti | passive | His skills cost 1 SP less (minimum 1) | Agni ki Shakti |
| Ember Cut | 4 | Fire hit, power 130, Burning 30% | |
| Rakt Ki Pyaas | passive | After he fells an enemy, a free Attack at once | Rakt Ki Pyaas |
| Ananta Yuddha | 15 | Once per battle: for one round, every party skill costs 0 SP | Ananta Yuddha |

Running joke (no mechanics): he is out of breath after every battle.

**Built (Oct 22; Chapter 8; Claude's calls, the outline's fallbacks):** base HP 40, SP 20, ATK 15, DEF 5, MAG 8, SPD
15; growth HP 4, SP 3, ATK 3, DEF 1, MAG 1, SPD 2; he joins at the flame (before Dhanraj) with the Agnipur talwar of
Force and his saffron coat, and leads (fights second, after Gianna) until Chapter 8 ends. Agni ki Shakti as written
(`spLess` passive). Ember Cut as written (Burning on a boss a third of the time). **Rakt Ki Pyaas:** after a blow that
fells a foe, his next turn comes at once (not a free Attack; `turnOnFell`). **Ananta Yuddha:** once a battle, 15 SP,
Inspired on the whole party (not a free round). Weapon moves: Quick Thrust, Flame Lunge (fire, 160), Twin Flame (two
fire cuts at random). His breathing is never in a scene with Anissa's lines.

### 9.8 Edmund (Guardian, Stillwater)

| Skill | SP | Effect | Board |
|---|---|---|---|
| Aldermoor's Vigil | passive | +10% max HP | Aldermoor's Vigil |
| The Long Watch | passive | On any turn he takes no aggressive action, he gains +5% DEF (stacks to +25%) | The Long Watch |
| Shield Wall | 8 | Protect every ally from the next hit each takes (x0.5) | Shield Wall card |
| Tea Break | 10 | The party heals 15% of max HP and Anissa +1 Calm ("Terribly sorry, one moment") | |
| Stillwater's Patience | passive | Once per battle, cancel an enemy enrage or a Grudge-like buff | Stillwater's Patience |

**Built (Oct 22; Chapter 9; Claude's calls, the outline's cut list):** he joins at the pie shop on the Cross (the press-gang) with the pattern sword
of guarding and the Stillwater greatcoat, and leads (fights second, after Gianna) until Chapter 9 ends, then last.
Aldermoor's Vigil is folded into his base HP. **Shield Wall** wards the whole party (the built `warded`: a quarter less
for 3 turns). **Tea Break** heals each ally 15% of their own max HP (`healShare`, new: a tank's heal, whatever his MAG;
no Calm). The Long Watch and Stillwater's Patience are after the release (their text says so). Weapon moves: Shield
Bash (100, every turn), Measured Blow (150, every 3), Hold the Line (taunt and ward for 2 turns). "Terribly sorry":
he apologises before he hits (a passive's text, no effect).

### 9.9 The Echo party

| Member | Skills |
|---|---|
| Patricio (Warden) | Guard (as the command, plus allies behind him take x0.8), Taunt (all enemies target him 2 turns, SP 4), Oathbreaker (power 220, heavy, SP 8) |
| Benny (Swordsman) | Riposte (stance: counter the next physical hit, power 120, SP 4), Mark (as La Marca, SP 4) |
| Caona (Scout-commander, proposal) | Pathfinder (party SPD +20% for 3 turns, SP 6), Scout's Shot (power 110, never misses, SP 3) |

## 9.9 Rows and swapping (owner, Oct 15; built)

*Fighters as data (Oct 20):* a member's row (`row`, default by class), Anissa bond (`anissaBond`), spellbook
(`spellbook`, default for mages) and passive effects (`Passive.effect`) are fields of their entry in `data/rpg.ts`.
Who fights is the roster order: the first four present members fight, the rest wait to swap in. The Status and
Equip pages scroll their portrait lists, so all eight fit.

- Up to **8** in the party; **4** fight at once (`BATTLE_ACTIVE`); the rest wait.
- **Swap** (a command, takes the turn): the fighter trades places with someone waiting, who acts after half a turn
  (`SWAP_IN_DELAY`). A fighter who falls is replaced at once by the next one waiting. Lost only when all are down.
- **Rows:** fighters with blades (class warrior) stand in the **front row**; mages and archers in the **back row**. A
  foe's one-target attack reaches the back row only when no one stands in the front row. **Area** moves reach everyone.
- **Anissa is never a target.**

## 9.10 Skills that grow (owner, Oct 15; built)

- **Mages (Gianna) grow a spellbook.** Spells are learned by **level** or from **library books** (Mend: read 5 of
  Pòdlimyè's books). Each spell can **rank up** (II, III) at set levels, adding power and sometimes an effect
  (Sunthread II also Marks; Limyè Elodie II also clears bad statuses). Only a few can be **equipped**: 4 slots, 5 at
  level 10, 6 at level 20 (`SPELL_SLOTS`), chosen on Equip > Spells.
- **Rare and better gear brings a skill, free** (it never takes a slot): Lantern staff, Lantern Flare (fire);
  Thornwood staff, Briar Snare (earth, Slowed); Sun-glaive staff, Dawn Glaive (light, all foes); Gold-banded bow,
  Sun Arrow (a move); Sun-stitched charm, Warm Thread (Regen); Solange's Quill, Say Their Names (once per battle:
  every fallen ally rises at 30% HP, Anissa gains Spark).
- **Attackers have many weapon moves and few SP skills.** Attack opens the moves list. Moves cost no SP; each has a
  **cooldown** in the user's own turns. Yari: Quick Shot (any turn), Aimed Shot (power 160, wait 2), Pinning Shot
  (Slowed, wait 3, Lv 2), Volley (3 random arrows, wait 3, Lv 4); SP skills: Tracker's Mark, Arrow Rain (Lv 6).
  Patricio: Slash, Heavy Blow (wait 2), Sweep (all foes, wait 3), Hold the Line (Taunting and Warded, wait 4).
- **A mage's Attack is a bash** (power 70, `MAGE_BASH_POWER`) with a plain staff; a **spiked or bladed staff**
  (Thornwood, Sun-glaive) adds ATK and makes it a full blow (power 100).
- New statuses: **Slowed** (SPD x0.7) and **Taunting** (one-target attacks go to them first).

## 9.11 The battle tutorial (owner, Oct 15; built; split after the demo review, Oct 17)

The boar fight on the Cane Road opens with three pages over the battle (A or a tap turns a page, B skips the rest):
how turns and targets work, Attack and Skill (SP, Sunthread), and Guard and Item. The rest comes when it matters,
once per fight (not again after a loss): weapon moves and cooldowns on the first turn of a fighter who has them
(Yari), Anissa's Light the first time it gives SP back, Anissa's Spark and Surge when the Spark is full. After the
win: the spoils and the Boar-tusk charm, rows and Swap, and gear and spells (Menu > Equip, Equip > Spells). Text:
`BATTLES.intro_boar.tutorial` (`start`, `moments`, `after`) in `quest/src/data/battles.ts`.

The boar is a teaching foe (`hpScale: 4`, about 218 HP before Story difficulty) so the fight lasts long enough to
teach: with Gianna (level 3 by then) and Yari, Anissa's plan (Sunthread, Guard on the warning, Surge when it
appears) wins every time over about four of Gianna's turns, and its Charge warning, Anissa's Light and a Surge all
come up (tests/battle.test.ts). Attacking alone still wins with Yari but costs over half the party's HP.

## 10. Status effects

| Status | Effect | Lasts | Cleared by |
|---|---|---|---|
| **Bound** | Rael's fights only: at 0 HP a member is Bound, not Down. Out of the fight but recoverable | until freed | **Break Free** (the member's own action on their next turn, 50% chance, 100% on the second try) or Gianna's Comfort on them. **Built Oct 21 (Claude's call):** any heal or food frees them (Comfort is not built yet), with what it healed; Break Free frees with a quarter of their HP |
| **Down** | 0 HP, out of the fight | until revived | revive items, Say Their Names, Rit Solèy, end of battle (revives at 1 HP) |
| **Marked** | Takes x1.25 damage | 3 turns | |
| **Stunned** | Skips the next action | 1 action | |
| **Hushed** | Cannot use skills (Attack, Guard, Item still work). **Built Oct 22 (Chapter 7):** SP skills are blocked; weapon moves (no SP) still work (`STATUS.noSkills`). **Built Oct 22 (Chapter 9, the outline review's 3.1):** the weapon moves are blocked too: Attack, Guard and Item only. **Fixed Oct 22 (Chapter 11's smoke):** a fighter whose Attack opens their weapon moves (Rael, Azzy, Yari) had no working Attack while Hushed (every move greyed out); Attack now strikes plainly while the moves are blocked | 2 turns | Tidewash, Tonic |
| **Frightened** | Anissa only: see Calm (Section 8) | until Comfort | Comfort |
| **Burning** | Loses 6% max HP each turn. **Built Oct 22 (Chapter 8):** a boss loses only `BURNING_BOSS_SHARE` (2%); it never takes the last HP | 3 turns | Tidewash, water items |
| **Oiled** (the Oil Wall; built Oct 22, Chapter 8) | Damage taken x0.5; fire does nothing (`STATUS_IMMUNE`); a Surge shatters it | 3 turns | a Surge |
| **Poisoned** | Loses 4% max HP each turn | 5 turns | Tidewash, Tonic |
| **Chilled** | SPD x0.7 | 3 turns | fire skill hit, Ember Ward |
| **Fogged** | Physical hit chance -30 | 2 turns | |
| **Weakened** | Damage dealt x0.75 | 3 turns | |
| **Inspired** | Damage dealt x1.25 | 3 turns | |
| **Warded** | Damage taken x0.75 (proposal, Oct 15; built in the engine, no skill gives it yet) | 3 turns | |
| **Guarding** | Damage taken x0.5 | until own next turn | |
| **Truce** | Sèman Lapè: neither side can harm the other, the enemy skips | 2 turns (1 on bosses) | ends early if the party harms it (proposal: then it cannot be used again that battle) |
| **Regen** | Heals 8% max HP each turn | 3 turns | |

Durations count the affected fighter's own turns. Lengths are `STATUS_DURATION` in config.

## 11. Echo Battles and the War of the Harbor

- **Echo Battles** are fought by the Echo party in the Echo, against the Revolution-era Crown (the same enemy types in
  old uniforms). Winning one yields a **Memory**: a permanent +2 to one stat for a named present member, or a hidden
  present route (data per battle). No Surge in the Echo (Anissa holds the door), so Echo fights lean on Guard and Taunt
  as the guide intends (6.1).
- **The War of the Harbor** (Chapter 11) is three linked battles. Each allied group's **Armies** number buys
  reinforcements: between stages, the player calls in allies; each 10 soldiers pledged gives one round of an allied
  volley (power 150 to all enemies) in the next stage (`ARMY_VOLLEY_PER = 10`, proposal). Overpaying an ally's price
  adds soldiers (guide 6.3). **Built (Oct 22, Chapter 10):** `ARMY_VOLLEY_PER = 10` is in `config.ts`; the Muster
  writes `army.<house>` for the six allies and `army.zetwal` (the levy, 60), and `muster.turned` or `muster.betrayed`
  for Chapter 11's flank fight (the ledger above).
- **Built (Oct 22, Chapter 11; the second review's 3.4, Claude's calls):** the armies are **volleys**, not stages of one
  battle. The pool is one volley for every `ARMY_VOLLEY_PER` soldiers at sea, counted once as the fleet lands
  (`engine/war.ts`; 16 on the route). Before each named fight that has them (`BattleDef.volleys`: the headland, the
  flank, Thorne, Hale) Gianna lifts the Marshal's whistle and the player says how many (at most `VOLLEY.cap` = 3, at
  most what is left). The fight opens with them, each named for the company that fires it in turn: a blow of
  `VOLLEY.power` = 50 at the active fighters' mean ATK on every foe, DEF counting, a boss taking `VOLLEY.bossShare` =
  0.5, and **a volley never fells**. A won fight spends what it fired; a lost one gives them back. The Strike has none
  (the companies will not fire on the pier with the envoy in the line). The war's three stages are the headland
  battery, Thorne's customs house and Caona's stand in the pier's memory (the pier assault folded into it).

## 12. Game Over: the goddess's second chance (owner decisions, Oct 19; built)

Replaces The Heir Rises' instant restart. Design: `docs/quest/reviews/2026-10-19-game-over-outline.md` with its review
and the owner's decisions at its end; the screen: `docs/quest/intro/GAME-OVER-STORYBOARD.md`.

- **When every fighter is down** in a fight that is meant to be won (story fights, bosses, and random fights in the
  wild), Anissa cries "Gigi! Get up! Please!", the battle music cuts to one low note and the battle fades to
  near-black. Then the **goddess** catches the party: GAME OVER, the loom of gold threads, her half-closed eye, her
  words, the count ("Times fallen") and **Rise**. Every part is skippable (B or Skip goes straight to her last line,
  the count and Rise; the count is never skipped past). Lines move on only with a tap or A, at the player's text
  speed. Reduced motion: the still and plain fades.
- **Her words** (owner-approved, `quest/src/data/gameOver.ts`): the first time, she introduces herself as Elodie and
  Gianna asks "Like my mother?"; after that her first line says the count ("I have caught you {n} times now...", from
  10: "{n} times..."), then "Go. Walk, mend, make ready. The fight will wait for you." Her name is never a label: in
  code and files she is "the goddess" (Gianna's mother is also Elodie).
- **Rise: the moment before the fight.** The party is free on the map (walk, shop, change gear) and goes back to fight
  again when ready. A lost fight changes nothing (items used in it, gold and XP only change on a win), so the game in
  memory already is that moment. Where the party stands: where the fight began; if that tile starts the fight again
  (the boar's line), **one step back the way they came** (open, same map and era, not a door or another trigger),
  else they stay put. The return tile is saved as the fight starts (`fight.return`), so a reload in the middle of a
  fight or on the goddess's screen also lands there (this closed the old hole of reloading on the boar's line and
  walking past). The after-fight scene marker (`battle.after`) is cleared on a loss and on every load.
- **Order when the party falls:** count it, step back and clear the markers, save, then show the screen. Closing the
  app on her screen loses nothing.
- **The count** is per save, in the flags: `gameover.count`. A save code carries it.
- **The Grudge stays** (owner decision): each Game Over at one fight adds +10% damage at the next try of that fight,
  up to +30% (`GRUDGE_STEP = 0.1`, `GRUDGE_MAX = 0.3`), saved per fight (`gameover.<table>.<group>`) and cleared by a
  win. The battle shows it at the start ("Grudge +20%: every blow lands harder this time.") and in its top bar.
  **Random ambushes give no Grudge** (owner correction, Oct 19) but do show the goddess and count.
- **A chapter's boss climbs higher** (review 1, Oct 21, finding 1; Claude's call): a battle marked `boss: true`
  keeps adding +10% up to +50% (`GRUDGE_MAX_BOSS = 0.5`). Today only Thorne (`thorne_blockade`). Measured with the
  party as the route leaves it (Gianna and Yari 8, 40 seeds): Attack alone wins 9 of 40 the first time, 23 at +10%,
  29 at +20%, 30 at +30%, 35 at +40% and 37 at +50%; Sunthread and Aimed Shot win 40 of 40 at every step.
- **The battle tutorial** (the boar's pages) shows once per save: a later try skips the pages already seen.
- **Every story fight has a way back in** (a test): a foe waiting on the map whose talk starts it again, or a step
  trigger that fires again; no fight trigger fires on entering a map again; a fight trigger never covers a spawn or a
  door's arrival tile. Today: the boar (its line), the pier sergeant, the caney marine, the patrol sergeant, Thorne's
  longboat.
- **Fights meant to be lost** (`meantToLose: { scene }` on the battle entry, for the Chapter 3 Trial of Blades with
  Rael): falling never shows the goddess, never counts and gives no Grudge; the named scene plays after a loss or a
  win alike, and a win sets no won flag. Never on a random fight. Only the mark and its tests exist (no Chapter 3
  content until the Chapter gate opens); the Chapter 3 outline still has to settle how such a fight ends early
  (review: a story moment such as two members Bound, Rael never below 1 HP, a round cap only as a backup).
- **Not fights, never a Game Over:** street debates and rhythm locks (a test checks neither starts a battle).
- **Dropped:** the Hard-mode retry limit (`HARD_MAX_RETRIES`) and the Retreat button were never built; Game Over makes
  them unnecessary.
- **Numbers** in `GAME_OVER` (`quest/src/config.ts`): the battle fade, the fall (6 s, its shots), the loop (4 s), the
  rise (1.5 s), the reduced-motion fades, and the count where her first line changes (10).

## 12.5 Breastplates: the fight before the boss asks for the skills (review 1, Oct 21, finding 1; Claude's call)

Every fight from the boar to the night of the attack fell to the Attack button, so Thorne, the first that did not,
was a wall. An enemy can now be `armored` (`quest/src/data/battles.ts`): the plain **Attack** command does only
`ARMOR_PLAIN_SHARE` (0.25) of its damage to it, shown as *Resist*; skills (Sunthread, Aimed Shot and the rest) are not
slowed. The **Musketeer in a Breastplate** (`breastplate_musketeer`, the patrol's musketeer) is the only one so far:
the sergeant boasts of the steel before the fight, and Anissa's opening tip says "Plain blows bounce off that
breastplate, Gigi! Use your light. Yari, Aimed Shot!". Measured (party level 7, 40 seeds): Attack alone wins 17 of
40 the first time (was 38) and 32 at +30%; the skills win 40 of 40 with a quarter of the party's HP lost. At Thorne,
Anissa now opens with the answer ("He hates the light, Gigi. Sunthread. Yari, the musketeer."), the fight is at the
party's level (8, was 9) and Thorne has 90% of his HP (`hpScale: 0.9`): numbers in 12 above. `tools/battle-sim.ts`
replays any scripted fight under the three plans (attack, surge, spells) at each Grudge step.

**Qasim follows the party down (Oct 22; Claude's call).** The smoke test's bot lost Chapter 4's `qasim_vault` twice
before winning. The cause: the levels pass (section 6) brings the route's party to the vault at **level 11**
(Gianna, Yari, Azzy and Samira, who joins in the scene just before), where the fight was tuned for 13 (Qasim 14, his
blades 13; `tests/qasim.test.ts` played it at 12 to 14). As Chapter 2's fights did, the fight follows the party down:
**Qasim level 12 (was 14), the Caravan Raider 11 (was 13)**; his HP x4, ATK x1.4, Seize Assets 230 and the tips are
unchanged (the desert's raider ambushes set their own group level). `qasim.test.ts`'s balance cases move down two
levels with him (no loss at 12 guarding; a real threat at 10 without Guard; 20 to 36 actions at 11).
`tools/battle-sim.ts` gained two plans for it, **smoke** (the smoke bot: Surge, Gianna's Sunthread, everyone else
Attack) and **tips** (the skills plan with the party's gold, doing what Anissa's tips say: Guard after Seize Assets
is announced, Samira's Remedy on one below 40%, her Bribe on a blade), and the marker `fight` (the party the moment the
route starts the fight, Samira included; `@chest`, the marker before it, has no Samira). Measured
(`battle-sim.ts qasim_vault fight 200`, wins of 200 at Grudge 0 / +10% / +20% / +30%):

| Plan | Before (Qasim 14, blades 13) | After (Qasim 12, blades 11) |
|---|---|---|
| Attack, Surge | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| Spells | 0 / 3 / 20 / 47 | 50 / 86 / 120 / 153 |
| Smoke bot | 0 / 0 / 0 / 5 | 15 / 41 / 55 / 85 |
| Skills (no gold, no Guard) | 20 / 54 / 94 / 117 | 153 / 174 / 194 / 198 (68% of HP lost at 0) |
| Tips (Guard, Remedy, Bribe) | 160 / 187 / 192 / 193 | 200 / 200 / 200 / 200 (51% of HP lost, 23 turns) |

The player who follows Anissa now never loses (was 1 in 5 the first time); one who uses the whole kit but ignores the
Guard and the purse loses about 1 in 4 the first time and 1 in 8 at +10%, which is the threat the outline review
asked for. Attack alone still cannot win: the vault is a skills fight, and its opening tip says so. Anissa's tips
were already the answer (Bribe a blade, Guard on the ledger, Samira's Remedy), so they are unchanged.

## 13. Enemies

### 13.1 Stat lines by level

`HP = 12 + 9L`, `ATK = 7 + 2.5L`, `DEF = 4 + 1.5L`, `MAG = 6 + 2.4L`, `SPD = 8 + 0.8L` (`ENEMY_STAT_LINE`), then the
role multipliers (`ENEMY_ROLE`):

| Role | HP | ATK | DEF | MAG | SPD | XP |
|---|---|---|---|---|---|---|
| Skirmisher | 0.8 | 1.0 | 0.8 | 0.6 | 1.3 | 1.0 |
| Brute | 1.4 | 1.2 | 1.0 | 0.5 | 0.8 | 1.25 |
| Tank | 1.5 | 0.9 | 1.5 | 0.5 | 0.7 | 1.25 |
| Caster | 0.8 | 0.6 | 0.7 | 1.3 | 1.0 | 1.0 |
| Support | 0.9 | 0.8 | 0.9 | 1.1 | 1.0 | 1.0 |
| Swarm | 0.5 | 0.8 | 0.6 | 0.5 | 1.2 | 0.5 |

**Gold** per enemy: `4 + 3L` x role XP multiplier (`GOLD_ENEMY`). Bosses: `60 x L`.

### 13.2 The 22 standard enemies (guide 10.2)

Levels are where each type appears; one type is reused across regions with a palette swap.

| # | Enemy | Human? | Role | Signature move | Regions and levels |
|---|---|---|---|---|---|
| 1 | Road Bandit | yes | Skirmisher | Cutpurse (steals 10 gold) | Xaraguá 3 to 6; Al-Doria 8 to 10; Zetwal Cane Road (return) 22 to 24 (built Oct 22: 24); Seat fields 28 to 30 |
| 2 | Smuggler | yes | Brute | Crate Throw (power 140) | Al-Doria 9 to 11; Zetwal Cane Road 22 to 25 (built Oct 22: 25, and the crew at the smugglers' landing, the chief at 25) |
| 3 | Lookout | yes | Support | Whistle (calls one Road Bandit, once); Spotter (ally SPD +20%) | Zetwal Cane Road 22 to 24 (built Oct 22: 24 to 25, and the crew's lookouts); Skarragol road tier |
| 4 | Quiet Crown Zealot | yes | Support | Frighten (Calm -1), Charity (heals an ally) | every wild section from Ch. 2; Zetwal 22 to 25 |
| 5 | Husher | yes | Caster | Hush (Hushed), Steal Voice (drain 8 SP), Seize (aimed at Anissa) | Kuroshi and Aldermoor tiers; Seat 28 to 30; Zetwal 23 to 25 |
| 6 | Crown Marine | yes | Skirmisher | Bayonet (power 110) | Xaraguá 3 to 8; Harbor 25 to 28; Echo battles (old uniform) |
| 7 | Crown Musketeer | yes | Caster (ranged) | Reload / Volley (every other turn, power 180) | Xaraguá 5 to 8; Aldermoor 21 to 24; Harbor 25 to 28 |
| 8 | Crown Officer | yes | Support | Rally (allies Inspired), Order (an ally acts now) | Xaraguá 6 to 8; Aldermoor 22 to 24; Harbor 26 to 28 |
| 9 | Brasador Halberdier | yes | Tank | Hook (Stunned), La Marca | Ardencia 11 to 14 |
| 10 | Caravan Raider | yes | Skirmisher | Sand Toss (Fogged) | Al-Doria desert 8 to 11 |
| 11 | Steppe Reaver | yes | Skirmisher | Raider's Charge | Skarragol road tier |
| 12 | Fog Cutpurse | yes | Skirmisher | Smoke (evasion), Pickpocket (steals an item) | Kuroshi road tier |
| 13 | Oil Enforcer | yes | Brute | Oil Flask (Burning) | Jwaladesh road tier |
| 14 | Moor Constable | yes | Tank | Arrest (Stunned 1), Whistle | Aldermoor 21 to 24 |
| 15 | Regent's Sealbearer | yes | Caster | Writ (Weakened), Seal (Hushed) | Aldermoor 22 to 24; Seat 28 to 30 |
| 16 | Mangrove Crab | no | Tank | Shell Up (DEF x2 for 1 turn) | Xaraguá 3 to 7; Zetwal 22 to 24 |
| 17 | Cave Bat | no | Swarm | Screech (Fogged) | Xaraguá caves 4 to 7; Ardencia tunnel 12 to 14 |
| 18 | Cinder Salamander | no | Caster | Ember Spit (Burning) | Ardencia 11 to 14 |
| 19 | Steppe Wolf | no | Skirmisher | Pack Bite (+20% per other wolf), Frost Breath (Chilled) | Skarragol road tier |
| 20 | Lantern Moth | no | Swarm | Glare (Fogged) | Kuroshi road tier |
| 21 | Ember Jackal | no | Skirmisher | Scavenge (heals on a kill) | Jwaladesh road tier |
| 22 | Bog Hound | no | Brute | Track (always acts after the party's fastest) | Aldermoor heath 21 to 24 |

Animals never Yield or Parley; they flee at 15% HP if they are the last one (no Fear, normal XP).

### 13.3 The 10 bosses

Boss stats: the standard line x the multipliers in each row (`BOSS_SCALE`). Phases change at HP thresholds.

| # | Boss | Where | Level | HP x / ATK x | Phases |
|---|---|---|---|---|---|
| 1 | **Governor Thorne** | Xaraguá customs house (Ch. 2) | 8 | 7 / 1.1 | **1 Paperwork:** hides behind two Crown Marines; *Requisition* (steals an item). **2 (50%) The Charter:** reads the Charter aloud: Hushed on one member each turn, *Protection Fee* (power 150). Yield: Spare (he is sent home to Aldermoor), Spoils, Break. |
| 2 | **Guildmaster Qasim** (proposal) | Al-Doria guild vault (Ch. 4) | 14 (built: 12, Oct 22, section 12.5) | 7 / 1.1 | **1 Ledger:** *Hire Blades*: pays gold to summon a Caravan Raider each 3 turns (Samira's Bribe on a summoned blade refunds it). **2 (40%) Foreclosure:** *Seize Assets* (Weakened on all), *Golden Wall* (DEF up until hit by a Surge). |
| 3 | **Rael the Ruthless, the Trial of Blades** | Ardencia duel court (Ch. 3) | 11 | 9 / 1.2 | Exactly the guide's (5.8). **1 Measured:** single-target pressure, La Marca; (*Seize* on Anissa: to redesign, Shield Anissa dropped Oct 15). **2 (66%) Unleashed:** Grito de Guerra, two Brasador guards; Surge to break through. **3 (33%) Cornered:** Reinado de Cenizas (scaled by how many are Bound); a clean Surge plus Comfort wins. Sangre Ardiente: +10% ATK per member Bound. Members are **Bound**, never Down. He is defeated, not killed. **Built Oct 21** (owner decisions: he wins, wearing La Promesa de Benny): level 13, HP x3, ATK x1.2; Seize in phase 1; Captain Rivera and Jaime walk in at phase 2 and step back at 0 HP; the floor and his finale (`docs/quest/reviews/2026-10-20-chapter3-outline.md`, "Built"). |
| 3b | **Rael, the Harbor Strike** (same boss, Strike route only) | Harbor flank (Ch. 11) | 28 | 9 / 1.2 | Four phases: Measured, Unleashed, Cornered, then **Broken Army** (his guards leave; he only Binds and will not strike Gianna; the fight ends when his army breaks, at 10% HP). **Built Oct 22 (the second review's 3.3: the hard route on purpose):** level 28, HP x4.5, ATK x2.0, +10% ATK per member Bound; Rivera (protects him; *Hook* stuns, every 2) and Jaime (*Ash Storm* every 2) at his side; two halberdiers walk in at 66% (Unleashed: Grito de Guerra, La Marca with power per Bound); Cornered at 33% (Reinado de Cenizas, power per Bound); Broken Army at 15%: Rivera, Jaime and the halberdiers step back (`BattlePhase.leave`), he Cords and waits. `EnemyDef.avoid`: he never strikes Gianna, area moves included; no Seize. Members are Bound, never Down. Measured: a Bound in 47% of fights at 27 (tier 24), no loss. |
| 4 | **Noyan Grimvald** (proposal) | Skarragol frozen fjord (Ch. 6) | tier top (17, 19 or 21) | 8 / 1.2 | **1 Mounted:** *Trample* (all), fast. **2 (50%) Unhorsed:** slower, *Stolen Standard* (Inspired on all his raiders); returning the standard to Bayarmaa (an Item use) breaks it. |
| 5 | **The Paper Fox** (proposal) | Kuroshi file house (Ch. 7) | tier top | 7 / 1.0 | **1 Screens:** hides among three paper decoys (Haru's Kagemimi or *Lantern* shows the real one). **2 (40%) Sold Secrets:** reads a member's "file": copies their best skill and uses it on them. **Built Oct 22 (Claude's calls, the second review's 3.6):** level 19, HP x12, ATK x1.8 (x10 / x1.6 left the kit 14% hurt). He and three paper decoys all show as *Paper Fox? A* to *D*, letters and places dealt at random, HP bars hidden; the decoys step in front of him and rustle (a real move). Kagemimi (or the reveal) names and Marks him, and the decoys turn plain paper and stop stepping in front; area blows tear paper. Fold brings another decoy every 3 turns (every 5 in phase 2). Phase 2 at **40%**: *Sold Secrets* every other turn uses the power of a member's best damage skill (the move's own 120 as a floor) with the Fox's ATK, aimed at them ("reads from a file with X's name on it"). He yields at 0 HP and is bound. 140 XP, 300 gold. |
| 6 | **Seth Dhanraj** (proposal) | Jwaladesh oil store (Ch. 8) | tier top | 8 / 1.1 | **1 Hoard:** *Oil Wall* (fire immunity), Oil Enforcers. **2 (50%) Price Spike:** each turn the party's next item costs 1 extra turn of delay; lighting his oil (any fire skill after the wall falls) Burns him. **Built Oct 22 (Claude's calls, the second review's 3.1):** level 21, HP x5, ATK x1.2 (x5 / x1.5 put the kit at two falls a fight). Two store enforcers protect him; the Oil Wall every 3 turns (half damage, fire does nothing, a Surge shatters it). Phase 2 at 50%: two more enforcers, *Price Spike* a 100-power area blow every other turn (the item delay cut), the oil lit (a fire blow sets him Burning, capped at 2% a turn). He withdraws at 0 HP and the fight ends. 140 XP, 300 gold. Tip: "Fire runs off his oil, Gigi! Surge to break the wall. When it's down, Vikram's fire will catch." Skills plan 40/40, 33% lost, 0.9 falls; Attack alone 0/40. |
| 7 | **The Hushed** | Aldermoor Regent's keep (Ch. 9) | 24 | 9 / 1.1 | **1 Silence:** Hush on two members a turn, Hushers. **2 (60%) Hush the Light:** aims at Anissa every other turn (to redesign, Shield Anissa dropped Oct 15; Comfort). **3 (25%) Unmasked:** the voice behind the veil; *Quiet Crown* (Weakened all, Calm -1). **Built Oct 22 (Claude's calls, the second review's 3.1):** a caster, level 24, HP x7, **MAG x1.25** (`magScale`, new); two veils step in front of her (`protects`); Hush is an area spell every third turn (half the party, 2 turns); at 60% Hush the Light (aimed at Anissa: Gianna steps in, `seize`; Calm and Comfort are after the release); at 25% the veil comes off and two more veils come in. She resists light; Anissa's tip: "She takes your words, Gigi. Plain blows still land. My light still comes. Edmund, hold them." She withdraws at 0 HP. Measured in the Chapter 9 outline's Built section. |
| 8 | **The Betrayer** (four variants by house) | Harbor flank (Ch. 11) | 26 | 8 / 1.2 | Shared frame, house moves: Dorini *Paid Off* (Bribes your benched members' turns away), Ironvow *Warpath* (two turns in a row), Suzumori *Marionette* (redirects your action), Agnivansh *Endless War* (no SP costs for a round). Proposal names: Admiral Rashid, Chief Hrafn, Councillor Mibu, Steward Prakash. Skipped if turned at the Muster. **Built Oct 22 (Claude's calls; named by role as Chapter 10 built them: Hrafn, the Suzumori retainer, the Agnivansh steward, the Dorini admiral):** level 26, a Blade and the house's move every 2: *Warpath* (area 100, Hrafn HP x8.5 / ATK x1.2), *Marionette* (magic 100, Hushed; x7 / x1.3), *Endless War* (Inspired on himself every 3; x9 / x1.0), *Paid Off* (115, Stunned; x7 / x1.3); at 50% the house's move hardens (area) and one more of his house wades in. Two of his house (reavers, cutpurses, oil enforcers or caravan raiders) and a Husher (the chapter's only Seize) stand with him; the house's companion leads the party. He yields at 0 HP; spared or bound, the house leaves a charm. Measured: 28.7 to 29.4 actions at 25 (tier 24), a fall in 20% to 50% of fights, no loss. |
| 8b | **Governor Thorne at war** | Xaraguá customs house (Ch. 11) | 27 | 5 / 1.15 | **Built Oct 22 (the second review's 3.14):** a Crown Marine and a musketeer in a breastplate with him; *Pistol shot* and *The Charter, read aloud* every 3; at 50% *Protection Fee* (120, Weakened) every 2. Weak to light. Measured: 20.1 actions at 25 (tier 24), nobody down. |
| 9 | **The Regent's Champion** (proposal: Captain-General Hale) | Regent's flagship (Ch. 11, Trust route) | 28 | 9 / 1.25 | Rael fights beside the party as a guest. **1 Boarding:** marines and musketeers. **2 (50%) Champion's Duel:** challenges one member; others are Stunned 1 turn when he does. **Built Oct 22:** at the pier's end (the *Patience*'s boats), level 28, HP x7, ATK x1.45; *Boarders* (area 135) every 2; two boarders and a Sealbearer with him; at 50% *Champion's Duel* (*Challenge* 190 every 2, *Call to the rail* area with a Stun) and two more boarders. Rael fights in the four (`party.rael` for this fight only; a loss clears it: `BattleDef.onLoss`). Drops *Hale's Boarding Axe*. Measured: 29.9 actions at 25 (tier 24), a fall in 17%, no loss. |
| 10 | **Lord Regent Aldric Vane** | Throne Hall (Ch. 12) | 30 | 10 / 1.25 | The Claim and Challenge. **1 The Patient Court:** two Sealbearers shield him (he cannot be hurt while both stand). **2 (66%) The Charter:** binds the realm: each turn he copies the pillar the party has most of as a shield (Wealth: gold drain; Fear: Stunned; Influence: Hushed). **3 (33%) One Hand:** Quiet Crown power; aims at Anissa each turn; Dawn Surge breaks his last shield. On defeat: Azzy's choice. **Built Oct 22 (the Chapter 12 outline's second review, 3.4, and its Built section):** a tank, level 30, **HP x6, ATK x1.6, MAG x2.0**, one version; he fights with his chain of office (Clause Twelve: no steel inside the gates); two Sealbearers stand in front of him (`protects`), *Patience* (area 60, Weakened) every 2; at 66% *The Charter, read* (magic area 110, Hushed half the time) every 2; at 33% *One Hand* (area 130, Weakened) every 2, *Hush the Light* every 3 (the built Seize: Gianna steps in; he never strikes Anissa) and one more Sealbearer. Gianna strikes first (`opensFirst`); her wounds carry into Azzy's Challenge on the dark route (`keepsWounds`). He withdraws ("...It is a tile.") and is arrested. Drops the *Chain of Office*. Measured: 39.7 actions at 30 (roster, tier 24), a fall in 23%, no loss. **Azzy's Challenge** (the dark route only; owner decision, Oct 22): level 29 brute, HP x4, ATK x1.2, Gianna alone and wounded; *La Marca* every 3, *Grito* (Stun) every 4; it binds. |

**The War of the Harbor stages** (Ch. 11) are standard fights at 25 to 28 between these boss fights. **Built Oct 22:**
the headland battery (an officer who Rallies, a musketeer and one in a breastplate, 25 to 26), the picket on the
gardens' road (two marines and an officer, 26), Caona's stand in the memory (the Echo three against three marines and a
musketeer in the old uniform, 27), and the war's ambush table on the Mountain Path and in the gardens (`harbor_war`).

## 14. Difficulty

| Setting | Enemy damage | Enemy HP | Retries after a Game Over | Hints | XP and gold |
|---|---|---|---|---|---|
| **Story** (default, guide 6.4) | x0.7 | x0.8 | unlimited | Anissa after 3 min | x1.0 |
| Normal | x1.0 | x1.0 | unlimited | Anissa after 3 min | x1.0 |
| Hard | x1.25 | x1.2 | unlimited (the old limit of 2 was dropped with Game Over, section 12) | Anissa after 5 min | x1.1 |

`DIFFICULTY` in config. Difficulty can be changed from the System menu at any time outside battle.

## 15. Gear levels (owner decision, Oct 14)

Every gear item has a level. Worn below it, the item gives only **half** its bonus, rounded down
(`LEVELS.gearUnderlevelShare = 0.5`; the built `itemBonus` does this). The shop and Equip screens show the level in
the band colours (orange if above your level) and the reduced numbers.

**Tiers** (`GEAR_TIERS`, proposal): levels 1, 4, 8, 12, 16, 20, 24, 28. Roughly, a weapon gives ATK or MAG of
`3 + tier index x 3` (so +3 at level 1 up to +24 at level 28), armour DEF of `2 + index x 2`, charms one special
property. Each capital's shops stock the two tiers around its chapter's level (cultural variants, guide 8).

Proposed levels for the built items: archivist's staff 1, archivist's robe 1, Yaguana bow 1, woven tunic 1,
cutlass 1, officer's coat 1, cane machete 1, mango, soup and akasan (consumables have no level), sun-stitched charm 1,
sea-glass charm 4, padded vest 4, sunwood staff 8, ironwood bow 8. (They sell in Chapter 1, so the higher ones are
aspirational buys whose half bonus is shown honestly.)

## 16. Rewards

| Reward | Rule |
|---|---|
| XP | Section 6 |
| Gold | Section 13.1; x Yield choice; +10% with Samira |
| Drops | Each enemy has a drop table (data): 30% common (its region's food), 8% uncommon (a charm or tonic), bosses one fixed item at their tier |
| Pillars | Yield choices, bosses (+1 Fear), the 6-win rule (Section 7.3) |
| Memories | Echo Battles (Section 11) |
| Bestiary | First defeat of each type adds a page (guide 6.7) |

## 17. Config keys (all in `quest/src/config.ts`)

`LEVELS` (cap, xpBase, xpExponent, bands, gearUnderlevelShare), `XP_PER_OBJECTIVE_BY_CHAPTER` and `AMBUSH_XP`
(built, the levels pass), `XP_STORY`, `XP_BOOK`, `XP_PUZZLE`, `XP_DEBATE`,
`XP_ENEMY`, `XP_BOSS`, `XP_ROLE`, `XP_BAND`, `XP_BENCH_SHARE`, `SKIP_TRIVIAL_AMBUSH`, `ROAD_TIERS`, `TURN_DELAY_K`,
`TURN_DELAY_OFFSET`, `ACTION_WEIGHT`, `DAMAGE_VARIANCE`, `HIT_BASE`, `HIT_MIN`, `HIT_MAX`, `CRIT_BASE`, `CRIT_MULT`,
`MIN_DAMAGE_SHARE`, `GUARD_MULT`, `YIELD_THRESHOLD`, `YIELD_REWARDS`, `PARLEY_CHANCE`, `FEAR_PER_WINS`, `SPARK_ON_ACT`,
`SPARK_ON_GUARD`, `SURGE_COST`, `DAWN_SURGE_COST`, `SURGE_MULT`, `SURGE_SPLASH`, `DAWN_HEAL`, `GIANNA_SP_DISCOUNT`,
`COMFORT_CALM`, `RESOLVE_*`, `STATUS_DURATION`, `GRUDGE_STEP`, `GRUDGE_MAX`, `GAME_OVER`, `ENEMY_STAT_LINE`,
`ENEMY_ROLE`, `BOSS_SCALE`, `GOLD_ENEMY`, `GEAR_TIERS`, `DIFFICULTY`, `ARMY_VOLLEY_PER`, `SP_AFTER_BATTLE`,
`SECRET_ITEMS`. The existing `ENCOUNTER_CHANCE_PER_STEP` and `ENCOUNTER_GRACE_STEPS` stay as built.

**Content, not config:** enemy types, skills, boss phases, drop tables and Yield scripts go in `quest/src/data`.
