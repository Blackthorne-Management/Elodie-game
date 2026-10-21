# Chapter 4, The Ledger: second review of the build outline (Oct 21)

*An independent, skeptical review of `docs/quest/reviews/2026-10-20-chapter4-outline.md` (cited as "outline:line").
Checked against the built Chapter 3 on the `chapter3` branch (worktree `wt-ch3`: `quest/src/data/dialogue/ardencia.ts`,
`quest/src/data/quests.ts` ACT3, `quest/tools/maps/ardencia.ts`, the "Built (Oct 21)" section of the Chapter 3 outline),
the foundations on that branch (`data/rpg.ts` MEMBERS, `data/battles.ts`, `engine/battle.ts`, `config.ts`,
`tools/level-curve.ts`, `data/starts/chapters.json`), and the settled owner decisions (`design/FAMILY.md`, `CLAUDE.md`,
`PLAN-ALL-CHAPTERS.md`). Nothing in the game was changed. Two throwaway scripts in the session scratchpad ran the
level-curve tool, a Qasim battle simulation on the real engine, and a check of the voyage line over the realm map.*

---

## 1. Verdict

**Build it, after a short list of fixes.** The outline covers everything the plan's minimum asks of Chapter 4
(Samira's arrival and invoice, the vault in both eras, Yusuf's ledger, Qasim, Samira joins, the coin clue, the debate,
two required side quests, mystery quests, Game Over), the story choices are sound, and Chapter 4 does start where
Chapter 3 actually ends. But it was written before Chapter 3 and the foundations were built, and it shows:

- several of its "built" claims are wrong (Fogged, a `support` role, `BOSS_SCALE`, Warded as a DEF multiplier), and
  several things it plans to build already exist in a different shape (Samira's entry, the gold skills);
- the starting XP is 175 low, so the level table is off by about a level at the end;
- **Qasim as specified is long but not dangerous**: the simulator wins every run, even at level 11, and the fight
  runs about 40 actions;
- three staging and logic holes need closing before Sonnet writes dialogue: Anissa alone at the top of the stair while
  Qasim's blades walk past her, Yari's signature line, which contradicts the canon (Benny signed six pages), and an
  anchor that would lock the guild out of its own vault for fifty years;
- **Coralie is now settled by the owner** (FAMILY.md:33), so section 2a's "nothing built until the owner places
  someone" is out of date and her scene has to be written into the chapter.

None of this needs a new owner question. The one question the outline asks (Layla) is a fair one to ask.

---

## 2. What I agree with

- **The shape of the chapter.** Arrival, refusal, a day in the city behind a required-before gate, the vault by night,
  the boss, then the way out, all in the same order as Chapter 3's built "Until noon" structure (quests.ts:547-557).
  This reuses a pattern players have already learned and that the arrow (`followSide`) already supports.
- **The way in and the way out.** Built Chapter 3 already names the Dorini vault (ardencia.ts:1033-1035, Azzy: "If
  there is a copy with seven pages, it is in the Dorini vault"). Layla's caravan pass is a clean, in-world reason for
  the Eightgate gates to open.
- **A-1 and A-3 as the two required side quests.** A-1 builds the trust between Samira and Gianna that the vault
  depends on; A-3 is the city's safehouse, the third ash thumbprint, and the chapter's only trip outside the walls.
  A-5 being the first quest added after the release is the right order.
- **Samira joins before the fight, expelled on the spot** (outline:192-199). It is the companions' pattern, it is
  better drama than joining afterwards, and it lets the fight teach her skills. It is correctly recorded as Claude's
  call (outline:582-585).
- **Layla's silence kept to the letter, with the purse delivered by the scribe in public** (outline:224-227). Shown,
  not told, and it keeps the design's "says nothing in public".
- **No Echo battle; Benny's first Echo is a walk.** This follows the plan review's rule. (A code comment says
  otherwise; see 3.10.)
- **Gianna misreads the coin** (outline:231), which `belief.rael_traitor` requires, while the player can read it
  correctly. Good.
- **The double-grant guard on the coin** (outline:61, 675-677). It is needed: no coin exists anywhere yet (a search of
  the `chapter3` worktree for `brasador_coin` finds only the docs), so the strand has to grant it.
- **The vault puzzle as PUZZLES.md SIG-ALD has it** (PUZZLES.md:148-160). It is feasible with flags and objects as
  the bridge, sluice and forge were, and replayable by `tests/puzzles.test.ts`. A fix is in 3.6.
- **Every NPC look the outline names exists** (`goat_herder`, `chancellor`, `crown_consul`, `scribe`, `treasurer`,
  `council_speaker`, `gazette_crier`, `nursemaid`, `echo_builder` and the rest are all present in `assets.config.ts`,
  `npcs.ts` or `speakers.ts`).
- **The owner question.** It is one of the Dec 1 Gen III questions (`docs/PRODUCTION.md`:61), it is a genuine
  story-flow decision (it decides whether the vault's last scene is a mother's), and it is asked with a recommendation
  and a usable alternative. Under the Oct 20 rule the build goes ahead on the recommendation meanwhile.

---

## 3. What I disagree with, and the risks (most serious first)

### 3.1 Qasim as specified is a long fight with no threat (balance)

The outline asks for level 14, x7 HP, x1.1 ATK, a `support` role, *Cane* at power 100, and a test that "loses
without Guard on *Seize Assets* at 11" (outline:312, 319).

**What the engine does with that.** I ran a 60-seed simulation on the real `Battle` class (chapter3 worktree), with
the Chapter 4 start party (`starts/chapters.json` '4': Gianna, Yari, Azzy and Anissa, plus `party.samira`) raised to
levels 11 to 14. Qasim was set up as specified (`support` does not exist, so I ran it as `tank` and as `brute`), with two level-13
raiders at the start. Hire Blades was approximated by one raider walking in at 75% HP and another at 55%, through the
built phase `enter`. Phase 2 at 40% had *Cane* 130, *Seize Assets* (area, Weakened) and a self-ward. The bot never
Guards and never uses gold.

| Qasim | Party level | Won | Mean party actions |
|---|---|---|---|
| tank, HP x7 (1,449 HP) | 11 / 13 / 14 | 60/60 each | 47 / 40 / 37 |
| brute, HP x7 | 11 / 13 | 60/60 each | 42 / 35 |
| tank, HP x5 | 11 / 13 | 60/60 each | 36 / 31 |
| tank, HP x3 (Rael's built scale) | 11 / 13 | 60/60 each | 27 / 24 |

So the outline's test "loses without Guard at 11" will fail as written. At x7 the fight runs about 40 actions, which
is 5 to 7 minutes on a phone at the Chapter 3 review's 8 to 10 seconds an action, and the danger is not in it. The x7
comes from `COMBAT.md` 13.3, but no built boss uses those multipliers: Thorne has none (battles.ts:267-279), and Rael
is built at x3 / x1.2 (battles.ts:324-341) against the table's 9 / 1.2. The real precedent is x3.

**Recommendation:** HP x3 to x4, role `brute` (the four built roles are skirmisher, brute, tank and caster:
config.ts:253-258). Make the pressure come from the hiring (a real every-third-turn summon) and a *Seize Assets*
strong enough that skipping Guard costs a fighter. Target 20 to 30 bot actions, a measurable loss rate at level 12
without Guard, and no losses at 14 with it. Put those as the simulator's assertions, the way `raelTrial.test.ts`
does for the trial.

### 3.2 Anissa alone at the top of the stair while Qasim's blades walk past her (staging, tone)

The outline has Anissa stay at the head of the stair (outline:144-146, 284). Qasim and three raiders then come *down
that stair* (outline:192-193), and so do Layla and two guards (outline:208). Nobody says what happened to the child
the Quiet Crown is hunting, alone at the door. In the fight her Spark and Surge are needed to break the Golden Wall
(outline:315: "Anissa: 'Gigi, Surge! The wall!'"), and her tips speak in it. So she is in the fight without ever
being seen to come down.

The built behaviour is simpler and already right: "in the Echo she stays put, glowing, holding the door"
(FieldScene.ts:1600; STORY.md:43). She holds the door **where Gianna steps into the Echo**, not at the top of a stair.

**Recommendation:** use the built behaviour. Anissa comes down with the party and waits at the edge of the
antechamber's Echo zone. Her line "I'll hold the door, Gigi. I always do." moves there. When Qasim comes in, stage
her stepping behind Gianna (a `walk` cue on `follower`) before the fight starts. This also removes an unbuilt
"follower parks elsewhere" behaviour from the build list.

### 3.3 Yari's signature line contradicts the canon (continuity)

Outline:186: Yari reads the six open pages: "Patricio. Yusuf. Sarnai. Sayo. Arjun. Not Caona. Not Benny." But Benny
refused **the seventh clause**, not the Accord. The guide says "Benny refused to sign the clause"
(QUEST-BUILD-GUIDE.md:132, 163), Benny's Refusal reads "the seventh page I will not sign" (ardencia.ts:1034), and his
note in the chest says "I will not put my name to *this page*". His name must be on the six open pages and missing only
from the sealed seventh. Gianna's next line, "The seventh page is the one they would not sign", also says more than
the party can know, since the page is sealed. What they know comes from Benny's Refusal and his note.

**Recommendation:** "Patricio. Yusuf. Benny. Sarnai. Sayo. Arjun. Not Caona: she was never asked." Then Gianna, with
Benny's note in her hand: "Six pages he signed. The seventh, he would not." (Whether Caona is absent or named as not
asked should match Chapter 5's sealing Echo, where "Caona is not in the room": STORY.md:365.)

### 3.4 The sun-lock anchor locks the guild out of its own vault for fifty years (puzzle logic)

The anchor makes the inner door's lock open only to the Locket, "a key no guildsman holds" (outline:169-171). Taken
as written, nobody in the guild has opened the vault since it was built. Yet it holds twelve numbered iron boxes
(outline:180), and Qasim calls it "the guild's vault. The guild's page." (outline:194). The design has the same gap
(PUZZLES.md:155-159), so this is not the outline's invention, but the build is where it gets fixed.

**Recommendation:** split the vault in two. The twelve boxes stand in an outer strongroom the guild uses every day,
behind the balance door. The sun lock is on **the witness's chest or a small inner niche** that holds only the
Accord's copy. That turns the locksmith's line into the point: a witness's copy that no guildsman can touch. It also
explains why nobody in Al-Doria knows the seventh page is sealed, and Qasim's "the guild's page" becomes a claim he
has never been able to check. No extra map or system is needed.

### 3.5 Chapter 4's first objective will not show on the strand (Journal and arrow)

`ardencia-camp` is in ACT3's map list (quests.ts:492), and the Journal follows "the one [chapter] this map belongs
to" (engine/quests.ts:53-54). After `act3.complete` the strand shows a finished Chapter 3, so ACT4's "Sail for
Al-Doria" (outline:70) never appears there, and neither does its arrow. Chapter 3 avoided this because the Zetwal
harbor is in no chapter's list.

**Recommendation:** make beat 0 the captain's ready check with no ACT4 objective, so ACT4's first objective is
"Up from the quay", set on landing. The alternative is to take `ardencia-camp` out of ACT3's maps and test both
chapters' Journals. Either way, add an act test for the Journal at the strand after `act3.complete`.

### 3.6 The balance door can be solved without the Echo

With "Too heavy" and "Too light" on every wrong total (outline:177-178, 475-477), the five binary weights become a
binary search: a player finds 25 in about five tries without ever seeing Yusuf. That defeats the signature puzzle's
reason to exist, and `cheats.json` (inputs that must NOT solve it) cannot be written honestly.

**Recommendation:** add `story.vault_echo` (or `clue.harbor_price`) to the door's condition, the way the forge's
Echo zone opens only after Azzy's key. Keep the heavy/light lines, which are good feedback. Before the Echo, a correct
total gets "The pan sinks level... and does not hold. The page says a price; you are guessing." The puzzle then
stays fair, and `cheats.json` can include the binary search.

### 3.7 Built facts the outline gets wrong (they will mislead the builders)

| Outline | Built (chapter3 worktree) |
|---|---|
| "statuses (Weakened, Warded, Marked, Inspired, Fogged)" are built; raiders' *Sand Toss* gives Fogged (outline:301, 313) | No Fogged. config.ts:177-191 has inspired, weakened, marked, warded, regen, slowed, taunting and stunned; battles.ts:302 says "COMBAT's Fogged is not built: Claude's call". Use Weakened (as the bats do) or Slowed. |
| Qasim is a `support` role (outline:312) | No such role (config.ts:253-258). |
| `BOSS_SCALE` x7 / x1.1 (outline:312) | No such constant; bosses carry `hpScale` / `atkScale` on `EnemyDef` (battle.ts:218-222). |
| Golden Wall is "Warded x1.6 DEF" (outline:312) | Warded is damage taken x0.75 (config.ts:182). |
| Golden Wall lasts "until a Surge-boosted hit lands" (outline:312, 315) vs. "`breaksOn: 'surge'`, else Warded's duration" (outline:500) | The two say different things. If it only ever ends on a Surge and Gianna is down with no revive, the wall never falls. Take the section 9 version: it lasts its turns, and a Surge ends it early. |
| Reinforcements "reuse Chapter 3's reinforcement event; adds a cap" (outline:501) | Built: guards walk in **once, at a phase start** (`BattlePhase.enter`, battle.ts:237-249, 1229-1241). A summon every third turn with a cap is a new enemy move, not a cap on an existing one. Size it as new work (still small). |
| Samira's entry is a proposal: `joins: story.samira_joined`, HP 46, SP 24, DEF 7, weighing rod and merchant robe (outline:520-538) | Built (rpg.ts:226-235): `joins: { flag: 'party.samira' }`, HP 44, SP 28, DEF 6 (COMBAT.md table), `driftwood_staff_of_focus`, `archivist_robe`, `spellbook: false`. |
| Daftar is two skills, *Mend* and *Strike*, costing "20 gold per 10 HP; a 40 HP heal is 80 gold", with costs in `config.ts`; *Retainer* comes after the release (outline:355-357, 498, 536-537, 606) | Built (battles.ts:77-94): three skills, *Remedy*, *Hired Blade* and *Patronage* (Inspired for 60 gold: that is Retainer, already done). Each use costs **20 + 10 x level** (150 gold for 75 HP at level 13, a fixed amount, no choosing; COMBAT.md 9.6 "Claude's call"); costs are in data, only the Wealth numbers are in config. The gold-cost system is **already built**; only Bribe and Bazaar al-Dhahab are not (COMBAT.md 9.6). |
| Chapter 3 "is finishing in parallel, and late" (outline:683-688) | Chapter 3 is built (Oct 21), `?chapter=4` exists and starts on the strand. Beat 0 can be written now against the real `camp_trader` and map. |

**Recommendations:** adopt the built Samira entry and skills. Add Bribe (and give her rod and robe as tier-12 shop or
reward gear if wanted). Rename the damage Daftar: **"Hired Blade" collides with Qasim's *Hire Blades* and the
`hired` flag in the very fight that teaches Bribe** ("Bribe the hired blade, not Hired Blade"). Use *Daftar: Debt
Collected* or similar. Correct section 9's effort: the gold skills (0.5) and Samira's entry (0.25) are mostly done,
and the periodic summon is new.

### 3.8 The level table starts 175 XP low, and the chapter overshoots once real ambushes are counted

The outline starts at "~2,115" (outline:31, 339). Built Chapter 3 leaves at **2,290 XP, level 11** (Chapter 3
"Built" call 14; `tools/level-curve.ts` today: "Ardencia 8-11, 11 (2290)"), 28 XP short of level 12 (2,318). Built
debates pay 40 XP as a required quest (Chapter 3 call 14), not "~20". "Until dusk" is an objective (+25) that the
table leaves out. Redone with the outline's own increments:

| | No random ambush (what the tool counts) | One desert ambush (the outline's assumption) | Library and a second ambush |
|---|---|---|---|
| Meets Qasim at | ~2,930: **13** | ~3,170: **14** (Qasim's own level) | 15 |
| Leaves at | ~3,260: **14** | ~3,500: **15** | ~3,870: **16** (16 is 3,809) |

Chapter 5's range is 14 to 15 (chapterLevels.ts). The tool will report "on target", because it does not count random
ambushes, while a real player who fights the desert once leaves at 15, and a thorough one at 16. Thirteen books (+130 XP,
+13 Influence) make it worse. Chapter 3 cut its own nine-plus-four to six-plus-two (Chapter 3 call 13).

**Recommendation:** Qasim's XP 200 rather than 280. Books **six in the House of Ledgers plus two in the Majlis**, as
Ardencia; *Baraka of the Scale* from five of the six. That also removes the "13 Influence over a price of 10" risk
(outline:668-670). Then run `level-curve.ts` once the Chapter 4 route exists, and run the Qasim simulation at the
level the route actually reaches.

### 3.9 The dusk variant as a flag set "when the third of the three completes" (soft-lock-adjacent)

Outline:375-377. Three different systems finish those three steps: A-1's and A-3's scripts, and `settleDebates` for
the debate (engine/debate.ts:160-177), which runs no story script. If the debate is finished last, nothing sets
`story.aldoria_dusk`. The door's own trigger still checks the three flags directly (outline:371-372), so the chapter
is not stuck. But Samira says "Dusk" under unlit lanterns, beside a doorman who never left.

**Recommendation:** make the dusk variant the **same condition** as the door (the three flags, and not
`story.vault_entered`), not a flag of its own. Also: after the vault it is night, but the bazaar's dusk state "clears
on `story.vault_entered`" (outline:377), which shows daylight on the way to a "first light" scene. Keep the bazaar at
night until `story.layla_pass`, and open beat 10 on the `fade` fx (which exists) to first light.

### 3.10 Smaller continuity points against the built Chapter 3

- **The people on the strand.** Beat 0 names a "trader captain" and a "sergeant" among the camp's people
  (outline:53-58, 563). Built: the speaker and NPC are `camp_trader` (ardencia.ts:1037, 1046-1049; ardencia.ts map
  :443). The sergeant is not a map NPC; he exists only as a `place` actor in `camp_arrive` (ardencia.ts:1019), so beat
  0 must place him again. The three soldiers and the quartermaster's shop (`ardencia_camp`, rpg.ts:273) are built, so
  outline:54-55's "if the camp vendor lands" is settled: it did.
- **`ally.free_brasador` and its Journal note already exist** (ardencia.ts:1039; Chapter 3 call 11). Beat 0 should
  not set the flag or add the note a second time; the sergeant's pledge line is enough.
- **Night to dawn.** Chapter 3 ends "That night..." (ardencia.ts:1038); beat 0 is "at dawn". Open the ready check on
  a `fade`.
- **Yari's fare coin** (outline:59-61): "The camp leader gave me this" reads, on the Free Brasador camp, as the
  sergeant. Name whoever ran the oil money in Chapter 2 ("the resistance in the caves" at the least).
- **Three Benny documents.** The party will carry *Benny's Refusal* (the copy, `bennys_refusal`, rpg.ts:127) and
  Benny's half-sheet from the vault (`item.benny_note`). Old Benny's letter (Ar-4's written promise, Chapter 3
  outline:293) comes after the release. Give the vault note a distinct name in the bag ("Benny's half-sheet").
- **Benny's first Echo fight.** rpg.ts:237 says "his first fight in the Echo is Chapter 4's"; the outline (correctly,
  under the plan review's rule) has none. Fix the comment when Chapter 4 is built.
- **Section 13 says nothing built in Chapter 3 is touched except `CHAPTERS`, `chapters.json`, the route and
  `encounters.ts`** (outline:654-655). Beat 0 also edits `camp_trader_talk` and the `ardencia-camp` map
  (outline:686-687 says so), and 3.5 may touch ACT3's map list. Say so in one place.
- **"Chapter 3 is late"** (outline:683-688) and the "2 to 3 builder-days" heading of section 15 (outline:692) against
  "about 6 builder-days" in section 9 (outline:509): update both. Chapter 3 is built, and the real figure is about 5
  days once the work already done (3.7) comes off.

### 3.11 An Anissa line that is a joke

"She heals with money, Gigi. You have money." (outline:318). That is a quip about Samira's money in Anissa's mouth,
which breaks both the outline's own rule (outline:18) and the built Chapter 3 rule (commit d8594c5 "Anissa never
jokes" replaced even "She talks like a firework, Gigi"). Make the tip plain: "Samira's Remedy costs gold, Gigi. It
heals a lot." The other Anissa lines in the outline are fine.

### 3.12 The voyage line crosses Al-Doria's land

The proposed path (outline:64-69) runs (62,9) to (121,9) to (121,40) to (108,62), ending at (106,66). On the realm map
(realmMap.ts), the third leg crosses Al-Doria's land from (115,50), and both (108,62) and the end (106,66), the
capital's dot, are inland. Al-Doria's only coast here is the east one (open sea from about x 116). The built voyages
end at sea next to the landing (Ardencia's at (62,14)).

**Recommendation:** add a point down the open sea (about (124,50)) and end at about (117,66), on the east coast
abreast of the capital.

### 3.13 A-1's bet wording

"Miss one and you pay me" (outline:403), but a wrong pick costs nothing and can be retried (outline:405-406). Either
drop the threat or make it Samira's bluff in a later line ("I never said when you'd miss.").

---

## 4. Claims checked

| Claim | Result |
|---|---|
| Chapter 3 ends at `ardencia-camp`, after Azzy reads Benny's Refusal naming the Al-Doria bankers; `act3.complete`; the card "Next: Chapter 4, The Ledger" | **True** (ardencia.ts:1016-1040; cards.ts:30-33). |
| The trader sails at first light | **True** (ardencia.ts:1037, 1048). |
| Azzy has joined; Benny is in the Echo party; `ally.free_brasador`, `belief.rael_traitor`, `story.ardencia_escaped` | **True** (`starts/chapters.json` '4'). |
| `?chapter=4` starts on the strand | **True** (`chapter-starts.ts`: `'4': ardencia-camp, strand`). |
| La Promesa de Benny is with Rael | **True** (battles.ts:337 floor; Chapter 3 outline 4.3). The outline does not contradict it. |
| Benny's letter | Not built (Ar-4, after the release; Chapter 3 "Not built"). The outline does not use it. See 3.10 on names. |
| Key items: envoy's papers, Locket, Benny's Refusal, Marshal's whistle | **True.** The Refusal arrives when the field settles Ar-2's reward: the start file has `side.treasurer.done` but no `side.*.rewarded` flags, so the 340 gold and Ar-2's item are paid on load. The real gold is 442 + 340 = about 782 (outline says about 750: fine). |
| Start at level 11, about 2,115 XP | **Level right, XP wrong:** 2,290 (3.8). |
| The level curve (level 12 at 2,318, 13 at 2,665, 14 at 3,029, 15 at 3,410) | **True** (config.ts `LEVELS` 50 x (n-1)^1.6). |
| Fighters as data, with a Samira entry | **True, but it differs from the outline's proposal** (3.7). |
| Daftar spends gold (approved Oct 20) | **True and built**, with different names and costs from the outline (3.7). |
| Bosses with phases and guards who walk in, from Chapter 3 | **True, at phase starts only**; no periodic summon (3.7). |
| Fogged, `support` role, `BOSS_SCALE`, Warded as DEF x1.6 | **False** (3.7). |
| `followSide` gate, as Chapter 3's "Until noon" | **True** (quests.ts:547-557). The `a|b` condition syntax in map `if` strings exists (e.g. zetwal-temple.ts:53). |
| Stage cues for the beats: walk up, enter, exit, face, look, place, wait, sync; fx flash, shake, fade, token, signet | **True** (stage.ts:23-39; FieldScene.ts:2081-2093). Not built: a sound cue on a line (Yusuf's "pen sound, three strokes", outline:162: write it as narration or add an `sfx` field), and "the guards lift Qasim" (outline:209: two guards `walk` to him and `exit` with him). Everything else stages with existing cues. |
| Anissa holds the door in the Echo | **True as a rule** (STORY.md:43); **built as "stays put where the Echo begins"** (FieldScene.ts:1600), not at a stair head (3.2). |
| CAPITALS 3 levels the Desert Edge at 8 to 11; PUZZLES lists SIG-ALD under Chapter 3 | **True** (CAPITALS.md:52; PUZZLES.md:25). |
| Layla is one of the Dec 1 Gen III questions | **True** (PRODUCTION.md:61; STORY.md open question 10). |
| Coralie | **Settled by the owner** (FAMILY.md:33: the Ch. 4 bazaar, the carpet knot count, sails before the vault; Ch. 5, Eightgate, the seamstress disguise). The outline still treats her as an unplaced suggestion (outline:242-258) and says she is not in Chapter 5 "unless the owner wants her there" (outline:256-257): out of date. |
| The voyage path | **Crosses land** (3.12). |
| Six maps, Echo validator holds | Plausible; the sizes are in line with Chapter 3's. Not checkable until drawn. |
| Length about 35 minutes | Plausible for the walking (910 steps against Chapter 2's 1,020 for 40 minutes), **but Qasim at x7 adds 5 to 7 minutes on his own** (3.1), and Coralie's scene is not in it. With 3.1 and 3.8 applied, about 35 minutes holds. |

---

## 5. What is missing

1. **Coralie, written in.** She is settled (FAMILY.md:33), personality "flamboyant, generous, fearless". Build her:
   - **Where:** the cloth row of the bazaar, from `story.vault_refused`.
   - **The meeting:** a staged walk-up (she sees the Locket before she sees the girls).
   - **The help:** at A-1's carpet stall she counts the knots and the loose ones give the fake away. That is an extra
     hint line and the stall's "Inspect" outcome, not a new quest.
   - **Leaving, shown:** she walks off toward the quay with her bolts of indigo once A-1 is done (or at dusk at the
     latest), so she "sails on before the vault".
   - **The Chapter 5 hook:** she says where she is going ("Eightgate. Someone has to dress the Regent's guests for
     this Parley."). That is what makes her Archive smuggling in Chapter 5 land.
   - **One thing the outline has not faced:** she is Elodie's sister, and two days earlier Gianna learned that Elodie
     secretly married Rael. Gianna would ask "Did you know?" Without that question the scene rings false; with a full
     answer it takes Chapter 5's confrontation with Elodie. **Claude's call, recommended:** she deflects with love
     ("That is your mother's to tell, chérie. She'll be at Eightgate. Make her tell you."). Record it in FAMILY.md, as
     Chapter 3 did for Rivera, because it decides who knows what.
2. **A sibling beat.** Chapter 3 ends with Azzy saying "There are two of us with a claim to that seat now"
   (ardencia.ts:1032), but in Chapter 4 Azzy and Gianna share only Layla's line and a joke with Samira. One quiet
   exchange would carry the thread (e.g. on the voyage, or at the dusk door). Optional, one or two lines.
3. **The night after the vault** (3.9): where the party sleeps and how beat 10 reaches first light.
4. **Bribe's teaching under real conditions.** At level 13, Bribe costs 325 and Remedy 150 a cast. A player who has
   bought tier-12 gear may arrive with almost nothing. The outline names the risk (outline:665-667); the simulator
   assertion is missing. Add a run with 0 gold and Tonic only.
5. **Act and Journal tests for the chapter seam** (3.5), and a content test that Coralie leaves before
   `story.vault_entered`.

---

## 6. Recommended changes (in build order)

1. **Correct the outline's built facts** (3.7): adopt Samira's built entry and skills; rename *Hired Blade*; replace
   Fogged with Weakened or Slowed; drop `support` and `BOSS_SCALE`; settle the Golden Wall as Warded for its turns,
   ended early by a Surge; size the periodic summon and Bribe as the real new engine work; re-cost section 9.
2. **Qasim:** HP x3 to x4, role `brute`, with the threat in the hires and *Seize Assets*. Simulator assertions as in
   3.1, plus a 0-gold run. XP 200.
3. **Levels:** start from 2,290; books six plus two; rerun `level-curve.ts` once the route exists (3.8).
4. **Staging:** Anissa holds the door at the Echo's edge and steps behind Gianna when Qasim enters (3.2). Beat 0 opens
   on a fade, re-places the sergeant, uses `camp_trader`, and adds no second Free Brasador note (3.10).
5. **Canon:** fix Yari's signature line (3.3). Split the vault so the sun lock guards only the witness's copy (3.4).
   Give Benny's half-sheet a distinct name.
6. **Puzzle:** gate the balance door on `story.vault_echo`, and put the binary search in `cheats.json` (3.6).
7. **Journal:** no ACT4 objective on the strand, or move the camp out of ACT3's maps, with an act test (3.5).
8. **Dusk:** derive the variant from the door's condition, and keep night until Layla's pass (3.9).
9. **Coralie:** write her into the cloth row and A-1, with the "Did you know?" deflection as a recorded Claude's
   call, her walk-off and the Eightgate hook (section 5.1).
10. **Small fixes:** Anissa's tip (3.11), the voyage via point and end (3.12), A-1's bet wording (3.13), the stale
    "Chapter 3 is late" and effort headings, and the rpg.ts:237 comment.

**On the owner question.** Keep it, and ask it now, since PRODUCTION.md wants the Gen III answers by early November.
Ask it as the pop-up the rule describes, recommendation first:

- (a) Layla is the Merchant-Prince and Samira's mother (recommended);
- (b) a Merchant-Prince from another guild family, with Layla as the harbour banker on the council who pays
  Samira's debts.

Build (a) meanwhile. Nothing else in the outline, or in this review's changes, needs the owner: each is a staging or
continuity fix, or a number, recorded as Claude's call. The one exception is Coralie's "did you know", which goes on
the family-confirmation list rather than becoming a separate question.
