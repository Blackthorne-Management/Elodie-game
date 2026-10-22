# Chapter 5 outline (The Parley, Eightgate): second review (Oct 21)

*An independent, skeptical review of `docs/quest/reviews/2026-10-21-chapter5-outline.md` (cited below as
"outline:line"). I checked it against the settled design (`design/STORY.md`, `design/FAMILY.md`, `CAPITALS.md` 5,
`PUZZLES.md` SIG-SEA and S-SEA, `SIDE-QUESTS.md` Se-1 to Se-5, `SECRET-ITEMS.md` 9, `QUEST-BUILD-GUIDE.md` 5.3, 5.6,
5.8 and 13 "Settled", `PLAN-ALL-CHAPTERS.md` and the Opus plan review's minimum), the Chapter 4 outline and its
review, and the built game on branch `chapter3` (worktree `wt-ch3/quest`: `src/engine/battle.ts`, `debate.ts`,
`game.ts`, `stage.ts`, `mapValidation.ts`, `src/scenes/FieldScene.ts`, `src/data/rpg.ts`, `battles.ts`,
`realmMap.ts`, `chapterLevels.ts`, `config.ts`, the built dialogue in `data/dialogue/zetwal.ts`, `xaragua.ts` and
`ardencia.ts`, and `tools/level-curve.ts`, which I ran). Chapter 4 is not built yet, so "where Chapter 4 ends" is
measured against its outline plus its review. Nothing was changed except this file.*

---

## 1. Verdict

**Build it, after a round of fixes. None of them changes the chapter's shape.** The beat order (arrival, the
Regent's welcome, Coco, the day gate, the seamstresses, the sealing, the reading, the terms, the fitting, the Iron
Gate) is right. It delivers every item on the plan review's minimum for Chapter 5. It keeps the show-don't-tell rule
on every beat, and it builds Eightgate once with Chapter 12 in mind. "No boss" is the right call for the midpoint. The
one owner question is the right one to ask.

Four things must change before the build. The first two would do real damage to the story:

1. **Gianna says "Lord Rael told me he is our father" aloud in the Hall, in front of the Crown's clerk**
   (outline:141-143). The marriage is hidden *from the Crown* (guide 5.6.4: Rael tells her "with the envoy behind a
   screen"; built `ardencia.ts:662-690`, where Cresswell is sent out first). As written, the Regent's own pen hears
   the secret the whole game turns on.
2. **Hollis's reading spends the Ribbon's secret quest and contradicts its legal basis** (outline:256-260): "Signed
   by the Marshal", "Witnessed by the Dorini bank", "Refused aloud". Separately, the Regent's "a clause read aloud is
   a clause in force" (outline:253-255) is a new law that turns the midpoint into the party's legal defeat. That is a
   story-flow decision made silently.
3. **The deserters' fight cannot end as specified.** The engine's `floor` stops HP at the floor permanently, and a
   foe with no finale never goes down (`battle.ts:1039-1048`). "Floor at 50% and `withdraws`" (outline:482-484) would
   make the Sergeant unkillable, and that soft-locks a required quest.
4. **The puzzle's one trick does not work.** With the carved numbers "3, 1, 6, 4, 2, 7, 5" (outline:590), drawer 4
   is fourth from the left in both eras, not "third from the right" (outline:602). The relabelling is meant to be the
   puzzle, and as written it disguises nothing.

Beyond those: the level table starts low and pays objectives at 45 XP where the game pays 25. The geography says
"north" for a road that runs south-east. Two Archive books are placed in the Hall. Mediate is set to 12 where the
owner-approved number is 5. Several claims about what the engine lacks are wrong in ways that cut the chapter's
engine cost (section 4).

---

## 2. What I agree with

- **No boss, no steel inside the walls** (outline:366-385). The story backs it (STORY.md Chapter 5: "Boss: none"),
  and so does the plan (a flag of truce). Keeping the old courtesy true until the Challenge makes Chapter 12's first
  drawn blade mean something. The Regent's menace is carried by staging: the hand on the Throne's arm, the three
  steps down, the hand back, the one look at Anissa (outline:124-133, 270-280). For this antagonist at this point in
  the story, that is stronger than a fight. The reason given for it needs correcting (4.1), but the decision stands.
- **The Parley conducted twice**: the player's own small Parley with the deserters the day before the Regent's
  large one (outline:485-494). It is good structure, and it uses the built `withdraws` and dialogue choices once the
  floor is removed (3.3).
- **Coco's part follows FAMILY.md:33 exactly**: she dresses the royals for the Parley and smuggles the sisters in as
  seamstresses, and her chain scene is shown (outline:192-196). Her comedy is pointed at Azzy and Samira, never at
  Anissa. She has no Rael lines. She is kept out of the Hall.
- **Elodie's two lines are word for word** with guide 5.6 and STORY beat 5, one public and one private, and the
  private one is set in a room with no Crown pen in it (outline:143, 299). Gianna's misreading of both is preserved,
  so `belief.rael_traitor` survives into Chapter 6.
- **Yari gets the line after the clause** (outline:261-264), as the Chapter 4 outline asked (Ch4 outline:646-649).
  Her hand on the empty eighth chair is the chapter's best image.
- **The fixed road order given in Elodie's mouth** (outline:304-308): a diplomat's reading of the realm turns the
  Oct 20 menu decision into story at the cost of four lines.
- **Se-5 stage 1 as a playable petition round** (outline:496-529). The envoys of Chapters 6 to 8 are heard in their
  own voices before the roads open. Placing each later token "in the price scene, not a chest" (outline:812-814) is
  the right instruction for Chapters 6 to 11.
- **Building for Chapter 12 now**: the rope by flag, the chairs as objects with a token state, the nave kept clear
  as an arena, the Archive zone reused (outline:342-358, 842-845).
- **The cut order** (outline:894-897) protects the right things.

---

## 3. Disagreements and risks, most serious first

### 3.1 The secret is spoken in front of the Crown's clerk (story-breaking)

Beat 3 (outline:140-143): Elodie stops "at a courtier's distance". The clerk is writing. Gianna says, "low",
"Mother. Lord Rael told me he is our father", and "a pause the clerk's pen fills" follows.

- The whole reason for the hidden marriage is that the Crown must not know (guide 5.3, Elodie's row: "She hid the
  marriage to protect their children and their children's claim"). In built Chapter 3, Rael clears the court and
  sends the Crown's envoy out before he says it (`ardencia.ts:662-690`).
- If the clerk hears it, the Regent knows in Chapter 5 that Gianna carries two claimant bloodlines. That changes
  Chapter 9's courtroom, Chapter 12's Claim, and Elodie's own "so no one would count you" (outline:297-298), which
  becomes false the moment it is said.
- The outline also says Elodie "can say only one true thing" in that room. Gianna then says the most dangerous true
  thing in the game, out loud.

**Fix (Claude's call, staging only):** Gianna starts the sentence ("Mother. In Ardencia, Lord Rael—"). Elodie cuts
her off as the envoy, loud enough for the clerk ("The envoy's household will report to the envoy's rooms"), then
gives the Locket line, low, while the clerk is writing the first sentence. The player sees that Elodie *stopped her*.
That shows the rule Elodie lives under, which is what Gianna's later "She looked at the man writing down what she
said" (outline:149) is for. Add a content test that no line in a scene where the clerk or a Sealbearer is staged
contains "father" next to "Rael".

### 3.2 Hollis's reading spends S-SEA, contradicts Se-4's law, and silently makes the clause "in force"

Three problems in beat 8:

1. **"Witnessed by the Dorini bank"** (outline:259-260) is read *from the sealed page*. The Seventh Ribbon's whole
   legal case is that "a clause whose ribbon was never knotted can be struck if the record of its sealing shows no
   witness agreed" (`SECRET-ITEMS.md`:254-256). Reading a witness off the page, before every envoy, hands the Regent
   his answer to the Claim's strike in Chapter 12.
2. **"Signed by the Marshal under protest... Refused aloud by the Lord of Ardencia... Xaraguá was not sent for"** are
   the *minute's* contents, which is S-SEA's anchor and hearing (`SECRET-ITEMS.md`:259-276, difficulty 10,
   finishable only after Chapter 9). They belong in the clerk's register, not on a page sealed before Patricio
   spoke. In the Echo the clerk seals the page *before* or *as* Patricio answers (outline:226-229), so the page cannot
   record the protest. Reading them aloud in Chapter 5 gives away the answers to the game's hardest secret puzzle.
   It also has Hollis say Patricio *signed* the seventh page (see 3.6).
3. **"I have waited some years for someone to ask... a clause read aloud is a clause in force"** (outline:253-255).
   This is a new rule of the realm. Its effect is that Gianna's midpoint victory ratifies the Charter, which is a
   reversal of what the scene means. That is the kind of story-flow decision the Oct 20 rule sends to the owner, and
   the outline neither lists it as a Claude's call nor puts it in the question (outline:707-718). It also undercuts
   Hollis's own Reason argument: the breach was that the page was never read to every signatory, so reading it now
   *cures* the breach.

**Fix:** Hollis reads **the clause only**, then the physical facts that set up Se-4 without solving it: "No
signature. The clerk's seal alone. And the seventh ribbon carries no witness knot." The Regent stays three moves
ahead without new law: "Read it. The Charter has stood on it for fifty years; it will stand on it tomorrow." The
player still feels the trap, because the Regent is unafraid, and the Ribbon keeps its Chapter 12 payoff. If the
owner wants the "read aloud ratifies" twist, it goes into question 1 as a stated consequence. It should not arrive
by default.

### 3.3 The Sergeant's fight would never end (soft-lock in a required quest)

The outline gives the Sergeant "a **floor at 50%** and a `withdraws` line (Chapter 3's mechanism, no new system)"
(outline:482-484). It costs this at "data only, 0" (outline:671) and promises "the Sergeant withdraws at 50%"
(outline:455-456). The engine does something different:

- `floor` is an absolute HP value. Every blow stops there, permanently (`battle.ts:228-229, 1039-1048`). The only
  exit is a `BattleDef.finale`, which sets `finalePending` and plays Rael's scripted loss, binding every fighter
  (`battle.ts:253-266, 826`). A floor without a finale is a foe who cannot fall.
- `withdraws` fires at **0 HP**, not at a share (`battle.ts:231, 1063-1067`).

So a Sergeant built as written is a battle that cannot be won, on the only required road out of Coco's day gate.

**Fix (data only, as the outline intended):** drop `floor`. Give the Sergeant `withdraws: { line: "Enough. Enough.
We're hungry, not dead.", speaker: 'deserter_sergeant' }` and the two Marines `withdraws` as well, so nobody falls.
That is the "nobody dies" pattern at no cost. If he must stop early, use a `BattlePhase` with `below: 0.5` for the
line and keep the withdrawal at 0. Add a battle test that `deserters_road` is winnable in N bot actions at level 14.

Other facts in the same fight to correct:

- There is no "Crown Officer" (outline:396-397). The built options are `marine_sergeant` (`battles.ts:370`, level
  4, brute) and `marine_lieutenant` (`battles.ts:255`).
- There is no `support` role. `ENEMY_ROLE` has skirmisher, brute, tank and caster (`config.ts:253-258`).
- *Rally* can be built as an `EnemyMove` with `ally` plus `statuses: ['inspired']` (`battle.ts:193-194`). *Order*
  ("gives one a turn") has no engine support, so cut it or build it.

### 3.4 The cabinet's relabelling disguises nothing

`PUZZLES.md`:225-231 says the trick is that the sigils changed while the carved numbers did not, so the player must
note the *number*. The outline places the carved numbers "3, 1, 6, 4, 2, 7, 5 left to right" (outline:590). In that
order, number 4 is in the **fourth** slot. In the Echo the drawers run 1 to 7, so the clerk also walks to "the fourth
from the left" (outline:595). The drawer is in the same physical place in both eras. The outline's own "now third
from the right, under the **Suzumori fan** plate" (outline:602) is wrong twice: the fourth of seven is fourth from
either end, and the third from the right carries the Ironvow plate in the outline's plate order (outline:588-589).

There are two further softeners:

- Any wrong drawer in the Echo returns the thread at no cost (outline:599-600), so seven presses brute-force it.
- The present thread marks the drawer anyway. That is the design's fail-safe and it is fine on its own, but
  combined with the brute force it leaves the observation with no work to do.

The honest difficulty is 1 to 2, not 3.

**Fix:** use an order where 4 sits somewhere else, for example "6, 2, 7, 5, 1, 4, 3" (drawer 4 sixth from the
left, second from the right). Pick the plate above it on purpose, and make it something other than a house the
player will visit next, or say why it is Suzumori. Make a wrong drawer cost a re-watch: "Nothing is in this one. The
clerk looks up." The scene restarts and the thread goes back to the table. Update `PUZZLES.md` SIG-SEA, its hints,
`solution.json` and `cheats.json` together.

The Parley half also differs from the design. `PUZZLES.md`:232-233 says "Influence or the Witness faith's argument";
the outline uses Reason, the Gaze and Compassion (outline:605-613). The Witness, the contract faith, is the natural
voice for "a page never read was never agreed". Make the Reason option the Witness argument, or record the swap as
a Claude's call.

### 3.5 The level table starts too low and overpays objectives

- **Start.** The outline starts at ~3,280 XP (outline:39-40, 403). Built Chapter 3 ends at **2,290** XP, not the
  2,115 the Chapter 4 outline assumed. I ran `node --experimental-strip-types tools/level-curve.ts`: "Ardencia 8-11,
  11 (2290)". The Chapter 4 review recomputed Chapter 4's end as **~3,260 (14)** by the tool, **~3,500 (15)** with
  one desert ambush, and **~3,870 (16)** with the library and two ambushes
  (`2026-10-21-chapter4-outline-review.md`:184-198). A real player who fights once therefore **enters Eightgate at
  15**, not 14.
- **Objectives.** The game pays `XP_PER_OBJECTIVE = 25` (`config.ts:68`; `rpg.ts:374-375`), not 45 (outline:409,
  413). The welcome block is 75, not 135. The six late objectives are 150, plus the puzzle's 60, so 210, not 330.
- **Books.** Twelve books at `XP_PER_BOOK = 10` (`config.ts:69`) add 120, and the outline leaves them out of the main
  line.
- **Level 16** is 3,808, not 3,805 (`50 x 15^1.6`).

My recount: the tool sees about 3,260 plus ~815, which is **~4,075, level 16**, if Chapter 4 adopts its review's
fixes. A player who fights the one ambush the route walks past in Chapter 4 and one in the Fields here lands at
**~4,600, level 17** (4,222), close to 18 (4,653). Chapter 6's band is 15 to 17 and its first fights are at 15
(`chapterLevels.ts`). Arriving at 17 makes Chapter 6's opening trivial.

The outline's second dial, "Se-3's ambush is random... which takes 280 off the counted line" (outline:419-420), is
not a dial. It only stops the tool from seeing XP that every real player earns.

**Fix:** rebase the table on the Chapter 4 review's numbers. Mark the watched scenes `noXp` as proposed (the welcome,
read aloud, the fitting). Pay the Archive's books for Influence but not XP, or cut them to five (the cut list already
names five). Make `deserters_road` pay by the encounter rule (10 x 43 = 430) or the flat 150, but not both. Aim for
the tool at 15 and the played line at 16. Keep `CHAPTER_LEVELS` 5 at `to: 15`, as the outline says.

### 3.6 Old Patricio said "I would remember"; the sealing makes that a half-truth, so make it a deliberate one

In built Chapter 2, Yari asks old Patricio about the clause. He answers: "Because there was no seventh clause when
we swore. I would remember. I signed under Caona's name" (`zetwal.ts:967-968`). In built Chapter 1's Echo, young
Patricio says "Then we will both read every page in the morning" (`zetwal.ts:845`).

In this outline's sealing, young Patricio stands at the table while a seventh page is read to the clerk alone. He
then seals the binding with a choice: "Under protest of time" or "Write that I did not read it" (outline:222-229).
The player, *as Patricio*, now knows he knew a seventh page existed. Hollis then reads "Signed by the Marshal"
(outline:259) in public.

This can be a strength. Rael already said "Patricio knows what Patricio chooses to know" (`ardencia.ts:696`), and
STORY open question 13 ("Does old Patricio know?") is still open. The outline neither notices the conflict nor
records a call on it.

**Fix (Claude's call, recorded):** Patricio *sealed the binding*. He signed nothing on the seventh page, and old
Patricio's "when we swore" is literally true and morally evasive. Drop "Signed by the Marshal" from Hollis's reading
(3.2). Add one line to the Journal note: Grandfather said he would remember. Leave the payoff to Chapter 10 at
Pòdlimyè, where Patricio is met again. Put it on the owner's confirmation list next to open question 13. It is not a
new pop-up.

### 3.7 Gianna is already "envoy of Zetwal" in the built game

Built Chapter 3 has Gianna say "Gianna Limyè, envoy of Zetwal. These are my papers" (`ardencia.ts:151`), and Azzy
says "The papers say 'envoy'" (`ardencia.ts:170`). The outline calls her "Zetwal's envoy's household" (outline:92,
95). Hollis's law needs "a signatory's envoy" to demand the reading, and Gianna answers "Zetwal's envoy is my mother"
(outline:237-238). The player will ask why Gianna, holding envoy's papers, cannot demand it herself.

**Fix (one line):** the Sealbearer or the Regent rules on it in beat 1 or 3: "Your papers say envoy. A house has one
voice at a Parley, and Zetwal's is already seated." That keeps Elodie's one step in beat 8 earned. It also makes
option (c) of the owner question coherent: Gianna cannot read it into the Parley herself, so (c) should become
"Gianna demands; Elodie stays silent; the Regent refuses her standing; Hollis reads it anyway, in the Archive".

### 3.8 Elodie's third line gives away too much

After "He should never have tested you", the outline adds: Anissa: "Mama. He didn't let them hit me." Elodie: "No.
He wouldn't." (outline:302-303). Elodie is saying, in front of Gianna, that Rael would never let harm come to
Anissa. That is a third true line, and it is the plainest one in the chapter. It weakens "Elodie can say only one
true thing" and pushes against "Gianna cannot learn he is good until near the end" (guide 13). The outline's own
risk note (outline:835-838) says neither line may be glossed, and this is a gloss spoken by Elodie herself.

**Fix:** keep Anissa's line. Elodie answers with the hand on Anissa's head and no words, and takes it away before the
curtain opens. The player reads it; Gianna does not.

### 3.9 Wrong compass: Skarragol is south-east of Eightgate

"If someone were going, they would go north first" (outline:306-307), "the north road" and "North! Furs!"
(outline:317-320), and "the Seat's north road" (outline:791-792) all put Skarragol north. The realm map, whose rows
run top to bottom (`realmMap.ts:8-9`), has the seat at (68, 64) and Skarragol at (91, 91), which is south-east.
Ardencia (62, 22) is the north. The outline itself plots the journey "from (68, 64) to Ordvik at (91, 91)"
(outline:792). Change "north" to "east and south, to the plateau", or "the winter road". Skarragol's cold reads as
altitude, not latitude.

### 3.10 The debate's books and numbers contradict the built game and the outline

- **Reason books:** "*The Founding Compact*, *The Rules of Claim* or *The Regent's Commission*... the Hall's four are
  the day's reading" (outline:545-546). Two of those three are Archive books (outline:559-560; `CAPITALS.md`:458-460),
  and the Archive is sealed all day. In the day only *The Regent's Commission* is open, because the fourth Hall book,
  *The Seventh Clause*, appears after beat 8. That is one Reason book, which is thin but not a soft-lock. Either move
  *The Founding Compact* to the Hall or name the Hall books in `reasonNeeds`.
- **Mediate at Influence 12** (outline:547) is "the design's number", but the owner approved
  `DEBATE_MEDIATE_INFLUENCE = 5` (`config.ts:282`, "owner approved the numbers Oct 16"), and `DebateDef` has no
  per-debate override. It cannot be reached in the day anyway: Seat Influence before the bell is at most listen +1,
  three Hall books, Se-5 +1 and Se-3 +1. Use the built 5.
- **"+5 Concord on a mediation"** (outline:551): the built reward is +10 (`config.ts:288`).

### 3.11 Tone: a joke inside the Rael and Anissa scene

Samira pricing the robe "through the curtain" while Elodie explains the marriage, Rael and Anissa (outline:292-293)
breaks guide 13.9: "no jokes in the Rael, Anissa or Hearing scenes". The outline's own rule says the comedy "stops at
... the curtain" (outline:848). Move the exchange to before Elodie arrives, or cut it.

### 3.12 Coco's welcome ignores that they met days ago

Coco was met in Al-Doria's cloth row in Chapter 4 (settled, FAMILY.md:33). The Chapter 4 review asks her to leave
with "That is your mother's to tell, chérie. She'll be at Eightgate. Make her tell you."
(`2026-10-21-chapter4-outline-review.md`:304-310). The outline's welcome reads like a first meeting in years: "Gold.
I said gold when you were four" (outline:161-166). Section 9 knows about the bazaar (outline:639-641), but beat 4
does not.

**Fix:** "You found her, then. Did she tell you?" Gianna: "Not yet." Coco: "She will. Not in that Hall." That ties
Chapter 4's hook to beat 10, keeps the reveal Elodie's, and costs nothing. The "Did you know?" deflection goes on the
family list, as the Chapter 4 review asked.

### 3.13 "Coralie Limyè" and *The Claimant Families* listing Limyè

- Elodie's birth name is **Jean-Philippe**. She *took* Limyè (guide 13.3, `QUEST-BUILD-GUIDE.md`:760; guide 5.3,
  line 167). Her sister is therefore Coralie **Jean-Philippe** (outline:634), unless the owner says Coco took the name
  too.
- *The Claimant Families* listing "Limyè" as a claimant family (outline:562-563, following `CAPITALS.md`:462) clashes
  with Elodie's "I took it so no one would count you" (outline:297-298). If Limyè is on the claimants' list, someone
  counted. Suggested Claude's call: the book lists Jean-Philippe and Rodriguez, and a margin note asks, "Limyè? A
  temple name, not a house." That makes the jolt the outline wants without the contradiction.

### 3.14 Smaller continuity and soft-lock points

- **Anaco "under guard in his own house"** (outline:130). Built: "The cacique's house is the Governor's house now"
  (`xaragua.ts:582`) and "You are holding Cacique Anaco in your cellar" (`xaragua.ts:239`). Change it to "under guard
  in the customs house".
- **"Samira. Pay them." for 120 gold** (outline:488) needs `if` gold ≥ 120, or the choice drives gold negative.
- **The Sealbearer looks at Anissa** while "the Oct 20 rule: she is looked at, never touched" (outline:93, 728) is
  cited. I found no such rule in the docs. The settled rules are "never hit" and "never a target" (`COMBAT.md`:218,
  343; guide 6.4). The outline itself has Coco and Elodie touch her (outline:163, 303), which is fine: family warmth
  is not a blow. Cite the real rule and drop the invented one.
- **Hollis and "the Regent's archivist"** are two people in `CAPITALS.md`:485, and the design's Se-5 giver is Hollis
  (`SIDE-QUESTS.md`:392). The outline merges the archivists and gives Se-5 to the chamberlain. Both are reasonable;
  record them as Claude's calls.
- **The Throne tile "at its centre"** (`CAPITALS.md`:441) versus "at the far end" (outline:116). Pick one now. The
  Claim's arena and the step trigger depend on it.
- **The veiled glow.** In the Echo, Anissa's sprite is swapped to `ANISSA_GLOW.look` (`FieldScene.ts:1607-1613`). The
  "goddess's light in a servant's apron" shot (outline:214-215, 887) needs a glow variant of the seamstress look,
  which section 10 does not cost.
- **Rael's promise to the Crown.** In Chapter 3 Rael said Gianna would be held "until His Majesty's ship takes her to
  Eightgate" (`ardencia.ts:710`). The Regent knows they escaped that custody. One line from him ("Lord Rael
  promised you to me by ship. You came by caravan.") would show the Regent three moves ahead using a fact the player
  owns. It is optional, but cheap and strong.

---

## 4. Claims checked

| Claim (outline) | Finding |
|---|---|
| Chapter 4 ends at the caravan gate; `?chapter=5` starts at Eightgate's gate with the caravan master's line (34-38) | **True to the Chapter 4 outline** (Ch4 outline:220-240, 632-638). Not built yet; `MARKS` has only `'4'` (`tools/chapter-starts.ts:26`). |
| The party enters at level 14, ~3,280 XP (39-40) | **XP wrong:** about 3,260 by the tool and 3,500 (level **15**) as played (3.5). |
| Levels 14 / 15 / 16 / 17 at 3,029 / 3,410 / 3,805 / 4,220 (19-20) | 16 is **3,808** and 17 is **4,222**. The rest is true (`config.ts:62`, `rpg.ts:296-297`). |
| Objectives pay 45 (409, 413) | **False:** 25 (`config.ts:68`). |
| "Echo battles do not exist: no Echo party fighters as data" (372-373) | **Mostly false.** `BattleDef.era: 'echo'` exists (`battle.ts:302-303`). `BattleScene.ts:241` builds the Echo party from it. Patricio, Benny and Caona are data (`rpg.ts:208, 236-249`), and `fighters.test.ts:73` tests the Echo party. Memories and old-uniform looks are what is missing. "No Echo battle" still stands on story grounds. |
| The engine has "Parley by realm Influence (`PARLEY_CHANCE`)" (371) | **False:** designed only (`COMBAT.md`:211). Not in `quest/src`. Harmless, since the outline uses a dialogue Parley. |
| `floor` and `withdraws` give a 50% withdrawal "data only" (482-484, 671) | **False as specified** (3.3). |
| An Echo party override (`echoParty` on a zone) is needed, else "Benny and Caona stand as followers" (668) | **Not needed.** The field never draws Echo party members as followers; in the Echo only Anissa's glow is drawn and Yari and Azzy are hidden (`FieldScene.ts:1601-1604`). Young Benny as an NPC is pure staging. That saves 0.25 day; build it with Chapter 12 if an Echo battle needs it. |
| The party split needs a new `party.away` system (667) | **A precedent exists:** Yari's `joins` already reads `notFlag: 'story.yari_hidden'` (`rpg.ts:203`), and the field drops her when she leaves (`FieldScene.ts:1546-1556`). The same shape for Azzy and Samira is about 0.1 day. |
| Stage cues cover the staging (walk, enter, exit, face, look, wait, sync) | **True** (`stage.ts:23-39`). "The party line parting" (163) is several `walk` cues on borrowed followers; the `follower` actor is supported (`stage.ts:14`). |
| An Echo choice (`choice.patricio_protest`) persists | **True:** only `echo.*` flags are wiped on return (`game.ts:416-421`), and Chapter 1's Echo sets `story.warroom_echo` the same way (`zetwal.ts:839`). |
| Anchor validation: one Echo-era anchor object whose dialogue sets the flag, read in the present | **Feasible as staged** (`mapValidation.ts:241-266, 293-300`). |
| The debate holds four voices with a per-round override; fallback is two debates (539-544) | **True:** `DebateDef` has one `ally` and one `opponent` (`debate.ts:40-42`). The override is new. |
| Mediate needs 12 (547) | **Conflicts** with the owner-approved 5 (`config.ts:282`). |
| A provoked debate blocks the gate (implied by 446) | **No soft-lock:** provoking does not resolve the debate, so Join stays open (`debate.ts:76-78, 117, 142-143`). |
| Crown Officer / `support` role (394-397) | **Neither exists** (3.3). |
| Chapter 2's enemies exist: Marine, Bandit, Zealot (396) | **True** (`battles.ts:179, 200, 223`). |
| Skarragol is north (306, 317, 791) | **False** (3.9). |
| Coco settled for Chapters 4 and 5 (11-12, 632-645) | **True** (FAMILY.md:33). Beat 4 does not pick up the Chapter 4 meeting (3.12). |
| Rael is Benny's son; Jaime and Rivera know | **Consistent:** the outline says nothing that contradicts it. Its "who told her so with the court cleared" (50) should read "with only Jaime and Rivera present" (`ardencia.ts:646-647`). |
| Elodie knows Rael's plan and disapproves of the test (guide 13 "Settled") | **Kept** in "He should never have tested you"; overplayed by "No. He wouldn't." (3.8). |
| The Hushed stays hidden until Chapter 9 | **Kept:** the Regent never names Anissa, and the Zealots speak for the Quiet Crown (outline:839-841). |
| Eightgate is reused in Chapter 12 and the Hearing with states only | **Plausible.** One gap: the Throne tile's position (3.14). |
| Plan minimum for Chapter 5 (plan review opus:240) | **All present.** Volume One and the Ribbon are deferred, as the plan allows. |
| The Opus review lists "Chapter 5's Archive" as an Echo battle (plan review opus:228) | **True.** The outline drops it as a Claude's call. That is allowed (it is a fight, not story flow), but the call's reason must change (see "Echo battles" above). |
| Length ~740 steps, ~25 minutes (765-783) | **Probably 28 to 30.** Chapter 2's 1,020 steps took ~40 minutes, so 740 steps is ~29 minutes before eight extra Se-5 scenes and the debate's three rounds. That is still acceptable for a midpoint. |
| Anissa never jokes | **Kept.** Every Anissa line is earnest. |

---

## 5. What is missing

1. **Elodie and Azzy.** Elodie meets her husband's son for the first time, in public and in the fitting room, and
   the outline gives them nothing. One shown beat is enough: in the front room she stops at the curtain, looks at
   him, and says "Azriel", or only nods, and he does not know what to do with it. Without it the scene rings false.
2. **Elodie and Samira.** The Chapter 4 outline promised "Elodie's reaction to her (a Dorini in her daughter's
   party) is a Chapter 5 line" (Ch4 outline:651-652). The Regent mentions Samira's mother; Elodie never addresses
   Samira at all.
3. **Azzy and Skarragol.** Azzy's mother is a Skarragol royal (guide 13.7). Chapter 6 has him greeted as "a royal
   grandson of the steppe" (STORY Chapter 6). The Ironvow envoy at her chamber door (outline:506-507) should look at
   him once: one line, the thread Chapter 6 pulls.
4. **Where the party sleeps between the evening and the bell.** "Bed" (outline:184) implies Coco's workshop. Say
   so, and stage the morning wake there, since beat 6 opens in the fitting room.
5. **Tests:** a `deserters_road` winnability test (3.3); the puzzle's wrong-drawer and replay path; a content test
   that no line in a scene with the clerk or a Sealbearer staged names Rael as father (3.1); the two-lines
   assertion the outline already wants.
6. **The outline should cite its own review inputs.** It was written before the Chapter 4 review
   (outline:16-17). That review is now out and changes this chapter's start: the XP, the Coco hook and the Daftar
   facts. Fold it in.

---

## 6. Recommended changes (build order)

1. **Staging, story-critical (Claude's calls, recorded in STORY.md Chapter 5):** Elodie cuts Gianna off before
   "Rael" in the Hall (3.1). Hollis reads the clause and the missing knot only, and the Regent states no new law
   (3.2). Elodie's "No. He wouldn't." becomes a gesture (3.8).
2. **The owner question (keep it, one pop-up, recommendation first):** (a) read in the Parley, before the Hall
   (recommended); (b) read in the Archive, to the party; (c) Gianna demands it on her envoy's papers, the Regent
   refuses her standing, and Hollis reads it in the Archive. If the owner also wants "reading it aloud puts it in
   force", add that as a fourth option rather than building it by default. Nothing else here needs the owner. The
   Patricio half-truth (3.6) goes on the confirmation list beside STORY open question 13.
3. **Engine facts:** drop `floor` for the Sergeant and use `withdraws` on all three (3.3). Drop the `echoParty`
   override (section 4). Build the party split on the `story.yari_hidden` pattern. Use `marine_sergeant` or
   `marine_lieutenant`, not "Crown Officer". Remove `support` and *Order*, or cost them as new work.
4. **Puzzle:** re-order the carved numbers so drawer 4 moves. A wrong drawer restarts the clerk's walk. Use the
   Witness argument as Reason. Update `PUZZLES.md`, the hints and the puzzle files together (3.4).
5. **Levels:** rebase on the Chapter 4 review (about 3,260 by the tool, 3,500 played). Objectives pay 25. Watched
   scenes are `noXp`. Archive books pay Influence, not XP, or there are five. Target the tool at 15 and the played
   line at 16. Run `level-curve.ts` with the route (3.5).
6. **Continuity text:** "north" becomes the winter road east (3.9). Use Coralie Jean-Philippe and fix the *Claimant
   Families* entry (3.13). Coco's welcome remembers the bazaar (3.12). Anaco is in the customs house. One line about
   Gianna's envoy papers (3.7). Correct "court cleared" in section 1.
7. **Debate:** Mediate at the built 5, +10 Concord, and *The Founding Compact* moved into the Hall or the Hall's
   books named in `reasonNeeds` (3.10).
8. **Tone:** move Samira's curtain line out of the private scene (3.11).
9. **Additions:** Elodie and Azzy, Elodie and Samira, and the Ironvow envoy's look at Azzy (section 5, one or two
   lines each). The night at Coco's. The guard on the 120-gold choice. A veiled glow look.
10. **Section 10's effort, corrected:** about 0.6 builder-days of engine work: the split 0.1, the land journey 0.25
    or the card, the looks 0.15 with the glow, and the debate override 0.1. Not "about one".

**Release reminder** (CLAUDE.md, `docs/PRODUCTION.md` open items, most urgent first): art drop 1 on Fri Oct 24;
card art, portraits and the card back before the rules and card text freeze on Fri Oct 31; order B with proofs on
Mon Nov 3; the Dec 1 story questions, now needed by early November; the fluent-speaker check on Wed Nov 18.
