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
| Edmund | 66 / 8 | 14 / 2 | 10 / 2 | 14 / 3 | 5 / 1 | 6 / 1 | proposal (+10% max HP from *Aldermoor's Vigil*) |

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
| Story beat (a Journal objective done) | 10 in Ch. 1, then 20 + 5 x chapter | shared (everyone, Echo members too) | `XP_STORY` |
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
Ardencia 3, Al-Doria 4, the roads in fixed order). Tolerances are `LEVEL_CURVE` in config. First run: Chapter 1 ends
at level 6 (4 without side quests) against 3, because every Journal step pays a flat 25 (`XP_PER_OBJECTIVE`)
instead of this section's 10 in Chapter 1; Chapter 2 ends at 9 (8 without side quests) against 8. Random ambushes are
not counted.

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
  at her (**Seize**, **Hush the Light**) need a new design: open question for the owner.
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

### 9.5 Haru (Shadow agent, Suzumori)

| Skill | SP | Effect | Board |
|---|---|---|---|
| Kagemimi | 3 | Show one enemy's next action for 3 turns | Kagemimi |
| Sasayaki Ha | 6 | Strip one buff from an enemy, or cancel a charging skill | Sasayaki Ha |
| Paper Smoke | 5 | Party evasion +15% for 2 turns | |
| Ayatsuri | 14 | Once per battle: one enemy's next action targets another enemy instead | Ayatsuri |

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

### 9.8 Edmund (Guardian, Stillwater)

| Skill | SP | Effect | Board |
|---|---|---|---|
| Aldermoor's Vigil | passive | +10% max HP | Aldermoor's Vigil |
| The Long Watch | passive | On any turn he takes no aggressive action, he gains +5% DEF (stacks to +25%) | The Long Watch |
| Shield Wall | 8 | Protect every ally from the next hit each takes (x0.5) | Shield Wall card |
| Tea Break | 10 | The party heals 15% of max HP and Anissa +1 Calm ("Terribly sorry, one moment") | |
| Stillwater's Patience | passive | Once per battle, cancel an enemy enrage or a Grudge-like buff | Stillwater's Patience |

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
| **Bound** | Rael's fights only: at 0 HP a member is Bound, not Down. Out of the fight but recoverable | until freed | **Break Free** (the member's own action on their next turn, 50% chance, 100% on the second try) or Gianna's Comfort on them |
| **Down** | 0 HP, out of the fight | until revived | revive items, Say Their Names, Rit Solèy, end of battle (revives at 1 HP) |
| **Marked** | Takes x1.25 damage | 3 turns | |
| **Stunned** | Skips the next action | 1 action | |
| **Hushed** | Cannot use skills (Attack, Guard, Item still work) | 2 turns | Tidewash, Tonic |
| **Frightened** | Anissa only: see Calm (Section 8) | until Comfort | Comfort |
| **Burning** | Loses 6% max HP each turn | 3 turns | Tidewash, water items |
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
  adds soldiers (guide 6.3).

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
| 1 | Road Bandit | yes | Skirmisher | Cutpurse (steals 10 gold) | Xaraguá 3 to 6; Al-Doria 8 to 10; Zetwal Cane Road (return) 22 to 24; Seat fields 28 to 30 |
| 2 | Smuggler | yes | Brute | Crate Throw (power 140) | Al-Doria 9 to 11; Zetwal Cane Road 22 to 25 |
| 3 | Lookout | yes | Support | Whistle (calls one Road Bandit, once); Spotter (ally SPD +20%) | Zetwal Cane Road 22 to 24; Skarragol road tier |
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
| 2 | **Guildmaster Qasim** (proposal) | Al-Doria guild vault (Ch. 4) | 14 | 7 / 1.1 | **1 Ledger:** *Hire Blades*: pays gold to summon a Caravan Raider each 3 turns (Samira's Bribe on a summoned blade refunds it). **2 (40%) Foreclosure:** *Seize Assets* (Weakened on all), *Golden Wall* (DEF up until hit by a Surge). |
| 3 | **Rael the Ruthless, the Trial of Blades** | Ardencia duel court (Ch. 3) | 11 | 9 / 1.2 | Exactly the guide's (5.8). **1 Measured:** single-target pressure, La Marca; (*Seize* on Anissa: to redesign, Shield Anissa dropped Oct 15). **2 (66%) Unleashed:** Grito de Guerra, two Brasador guards; Surge to break through. **3 (33%) Cornered:** Reinado de Cenizas (scaled by how many are Bound); a clean Surge plus Comfort wins. Sangre Ardiente: +10% ATK per member Bound. Members are **Bound**, never Down. He is defeated, not killed. |
| 3b | **Rael, the Harbor Strike** (same boss, Strike route only) | Harbor flank (Ch. 11) | 28 | 9 / 1.2 | Four phases: Measured, Unleashed, Cornered, then **Broken Army** (his guards leave; he only Binds and will not strike Gianna; the fight ends when his army breaks, at 10% HP). |
| 4 | **Noyan Grimvald** (proposal) | Skarragol frozen fjord (Ch. 6) | tier top (17, 19 or 21) | 8 / 1.2 | **1 Mounted:** *Trample* (all), fast. **2 (50%) Unhorsed:** slower, *Stolen Standard* (Inspired on all his raiders); returning the standard to Bayarmaa (an Item use) breaks it. |
| 5 | **The Paper Fox** (proposal) | Kuroshi file house (Ch. 7) | tier top | 7 / 1.0 | **1 Screens:** hides among three paper decoys (Haru's Kagemimi or *Lantern* shows the real one). **2 (40%) Sold Secrets:** reads a member's "file": copies their best skill and uses it on them. |
| 6 | **Seth Dhanraj** (proposal) | Jwaladesh oil store (Ch. 8) | tier top | 8 / 1.1 | **1 Hoard:** *Oil Wall* (fire immunity), Oil Enforcers. **2 (50%) Price Spike:** each turn the party's next item costs 1 extra turn of delay; lighting his oil (any fire skill after the wall falls) Burns him. |
| 7 | **The Hushed** | Aldermoor Regent's keep (Ch. 9) | 24 | 9 / 1.1 | **1 Silence:** Hush on two members a turn, Hushers. **2 (60%) Hush the Light:** aims at Anissa every other turn (to redesign, Shield Anissa dropped Oct 15; Comfort). **3 (25%) Unmasked:** the voice behind the veil; *Quiet Crown* (Weakened all, Calm -1). |
| 8 | **The Betrayer** (four variants by house) | Harbor flank (Ch. 11) | 26 | 8 / 1.2 | Shared frame, house moves: Dorini *Paid Off* (Bribes your benched members' turns away), Ironvow *Warpath* (two turns in a row), Suzumori *Marionette* (redirects your action), Agnivansh *Endless War* (no SP costs for a round). Proposal names: Admiral Rashid, Chief Hrafn, Councillor Mibu, Steward Prakash. Skipped if turned at the Muster. |
| 9 | **The Regent's Champion** (proposal: Captain-General Hale) | Regent's flagship (Ch. 11, Trust route) | 28 | 9 / 1.25 | Rael fights beside the party as a guest. **1 Boarding:** marines and musketeers. **2 (50%) Champion's Duel:** challenges one member; others are Stunned 1 turn when he does. |
| 10 | **Lord Regent Aldric Vane** | Throne Hall (Ch. 12) | 30 | 10 / 1.25 | The Claim and Challenge. **1 The Patient Court:** two Sealbearers shield him (he cannot be hurt while both stand). **2 (66%) The Charter:** binds the realm: each turn he copies the pillar the party has most of as a shield (Wealth: gold drain; Fear: Stunned; Influence: Hushed). **3 (33%) One Hand:** Quiet Crown power; aims at Anissa each turn; Dawn Surge breaks his last shield. On defeat: Azzy's choice. |

**The War of the Harbor stages** (Ch. 11) are standard fights at 25 to 28 between these boss fights.

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

`LEVELS` (cap, xpBase, xpExponent, bands, gearUnderlevelShare), `XP_STORY`, `XP_BOOK`, `XP_PUZZLE`, `XP_DEBATE`,
`XP_ENEMY`, `XP_BOSS`, `XP_ROLE`, `XP_BAND`, `XP_BENCH_SHARE`, `SKIP_TRIVIAL_AMBUSH`, `ROAD_TIERS`, `TURN_DELAY_K`,
`TURN_DELAY_OFFSET`, `ACTION_WEIGHT`, `DAMAGE_VARIANCE`, `HIT_BASE`, `HIT_MIN`, `HIT_MAX`, `CRIT_BASE`, `CRIT_MULT`,
`MIN_DAMAGE_SHARE`, `GUARD_MULT`, `YIELD_THRESHOLD`, `YIELD_REWARDS`, `PARLEY_CHANCE`, `FEAR_PER_WINS`, `SPARK_ON_ACT`,
`SPARK_ON_GUARD`, `SURGE_COST`, `DAWN_SURGE_COST`, `SURGE_MULT`, `SURGE_SPLASH`, `DAWN_HEAL`, `GIANNA_SP_DISCOUNT`,
`COMFORT_CALM`, `RESOLVE_*`, `STATUS_DURATION`, `GRUDGE_STEP`, `GRUDGE_MAX`, `GAME_OVER`, `ENEMY_STAT_LINE`,
`ENEMY_ROLE`, `BOSS_SCALE`, `GOLD_ENEMY`, `GEAR_TIERS`, `DIFFICULTY`, `ARMY_VOLLEY_PER`, `SP_AFTER_BATTLE`,
`SECRET_ITEMS`. The existing `ENCOUNTER_CHANCE_PER_STEP` and `ENCOUNTER_GRACE_STEPS` stay as built.

**Content, not config:** enemy types, skills, boss phases, drop tables and Yield scripts go in `quest/src/data`.
