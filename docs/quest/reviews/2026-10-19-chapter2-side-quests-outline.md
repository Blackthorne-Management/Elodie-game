# Chapter 2 side quests: design outline (Oct 19)

*Design outline only, for the owner's approval before anything is built. No code has changed. The numbers come
from replaying `quest/routes/zetwal-act1.json` through the simulator today (the same tool `tests/act.test.ts`
uses). Sources: `docs/quest/design/SIDE-QUESTS.md` (X-1 to X-5), `PUZZLES.md` (M-XAR-1, M-XAR-2, S-XAR),
`SECRET-ITEMS.md` 3, `STORY.md` and `CAPITALS.md` for Chapter 2, and the built Chapter 2 in
`quest/src/data/quests.ts`, `quest/src/data/dialogue/xaragua.ts`, `quest/tools/maps/xaragua.ts`.*

**The ask:** give Chapter 2 what Chapter 1 now has. Side quests that show as "??? <place>" until started, with
the silver arrow, the minimap dots and Anissa's nudges; every one of them required before the story moves on;
and the city's street debate as one of those required quests.

**The one hard fact that shapes everything:** halfway through Chapter 2 the Crown takes the city. From that
night, every townsperson, vendor, elder, the healer, the camp leader and both debaters are gone from the maps
(the maps hide them on `story.crown_attack`), the Mountain Path ambushes stop, and Yari and Anissa hide. So
**every side quest lives in the free city, before the attack**, and the gate that requires them sits at the
one moment the player chooses to start the attack: bringing the oath to the elders.

---

## 1. Chapter 2 today (measured)

The scripted route, objective by objective. **Steps** are walking presses, **transitions** map changes,
**lines** dialogue boxes, **choices** menus answered.

| Objective | Steps | Transitions | Lines | Choices |
|---|---|---|---|---|
| Trouble on the pier | 0 | 0 | 20 | 0 |
| Yari's father | 77 | 2 | 3 | 0 |
| The elders' council | 24 | 0 | 28 | 0 |
| The Governor's eye | 71 | 3 | 0 | 0 |
| A light for the cave | 17 | 1 | 9 | 0 |
| What the stones remember (the cave) | 133 | 2 | 25 | 1 |
| The last bar (the areíto Echo) | 100 | 3 | 8 | 0 |
| The record house (rhythm lock) | 21 | 1 | 25 | 1 |
| Proof for the elders (the attack) | 50 | 3 | 40 | 0 |
| The night the Crown came | 89 | 3 | 22 | 0 |
| Where is Anaco held? | 147 | 6 | 24 | 1 |
| The envoy's visit | 65 | 4 | 6 | 0 |
| Word to the cave | 90 | 4 | 9 | 0 |
| Through the blockade (Thorne, home) | 139 | 5 | 42 | 1 |
| **Whole chapter** | **1,023** | **37** | **261** | **4** |

For comparison, Chapter 1 is 1,069 steps and 32 transitions with its four required quests in.

**The party on the route** (no side quests, no ambushes, no books): lands at **level 5**, is level 6 at the
oath stone, **level 7 at the attack** (the caney fight is level 6), level 7 at the sea cave, **level 8 after
Thorne** (he is level 9: "hard", by design). Chapter 2's target is 8 at the end. Influence in Xaraguá on the
route: 0 (Mediate in a debate needs 5).

**What the free city has that the main story never touches:** the Canoe Beach and its three shops, the Song
House and its nine books, the Mountain Path (the whole wild section, with its ambushes), the hill camp, the
debate by the village fire, the fisher's boy, the weaver, the farmers, the small girl whose bead a hutia stole.
The side quests are how the player meets all of it, which is the point of placing them before the attack: the
city must be seen whole before it is lost (the owner's own shape for the chapter, Oct 15).

---

## 2. Where each designed quest fits

| Quest (design) | Verdict | Where | Giver | Fight? | Echo? |
|---|---|---|---|---|---|
| X-1 Cut Nets | **Keep, reshaped** (no second brawl with marines in the city, see below) | Free city: village shore and Canoe Beach | The pier fisher | no | no |
| X-2 Oil From a Stranger | **Keep as designed** | Free city: village to the hill camp | The lamp-oil seller | the Mountain Path's own ambushes | no |
| X-3 The Hutia's Hoard | **Keep as designed** | Free city: beach and cassava gardens | The small girl in the gardens | no | yes (stake the sapling) |
| X-5 Medicine for the Cacique | **Keep, moved** (the Echo plays at the hill camp, where Caona's scouts camped) | Free city: caney, hill camp | The healer in the caney | the Mountain Path's own ambushes | yes (plant the grove) |
| X-4 Where the Canoes Sleep (secret, Caona's Conch) | **Does not fit the built chapter now; defer** (open question 1) | | | | |
| Street debate *Is the land owned or remembered?* | **Required quest**, like Chapter 1's | Free city: the village fire | Elder of the springs | no | no |

**Why X-4 no longer fits.** The story has already used its hook: the sea cave is now the escape route, Anaco
himself tells Gianna "where the canoes slept", and the cave opens only on the night of the lowest tide, with
Thorne waiting at its mouth. The designed puzzle needs things that do not exist yet: a tide that moves when you
rest, a raft that floats, a weir, and a Conch whose reward (summon a canoe on any shore, hidden coves, free sea
travel) needs a water layer the game has no use for until later chapters. It is also, by the owner's own
secret-item rule, optional ("nothing here blocks the story"), which clashes with "every side quest required".
Recommendation: leave the Conch for Chapter 11 (the return to Xaraguá, when the sea cave is a known place and the
party has a reason to sail), and say so in `SECRET-ITEMS.md`. Nothing built today prevents it.

---

## 3. The quests, one by one

Every quest below follows the Chapter 1 pattern exactly: a `SideQuestDef` with `available`, `start`, `nudge`,
`steps` with goals, `done`, `reward`; every step is a flag set by a conversation; accepted by a choice ("Quests
page" line in brackets); the reward paid once. Map tiles are the builder's starting points; the map validator
and the route decide the final ones.

### 3.1 Cut Nets (X-1, reshaped)

- **Opens:** after the pier fight (`encounter.xaragua_story.pier.won`). Shows as *??? Harbor Village*.
- **Giver:** the pier fisher (`canoe_fisher`, village 18,20), the man the marines were robbing. He already
  thanks Yari on the pier; now he asks: last night someone cut three of the village's nets where they were drying,
  "for the harbor's safety", the marines said.
- **Steps (any order, like Soup for the Cousins):**
  1. The net by the drawn-up canoes on the village shore (about 13,23).
  2. The net by the canoes on the Canoe Beach (about 8,12).
  3. The net at the salt pans (about 26,13). The shell diver (30,10) saw the longboat's crew do it: "Nets foul
     their oars, they say. Nets have dried on that sand since Guanín."
  4. Bring the three back to the fisher. He and Yari mend them on the spot (staged: Yari walks to the nets and
     sits; a short exchange about her father teaching her knots).
- **Why it is worth having:** it is the first thing the Crown does to this village that is petty rather than
  grand, it takes the player to the Canoe Beach (which the story never visits until the escape), and it keeps
  the pier fisher in the story (he is the one who runs out on the night of the attack).
- **The fight the design had.** The design gave X-1 a fight with two marines and a Yield step. The Yield
  mechanic is not built, and a second brawl with marines in the free city muddies the story: Thorne has just
  warned Gianna off, and the attack must come because of the oath, not because of a net. The Mountain Path (X-2,
  X-5) already gives this half of the chapter its fights. See open question 2.
- **Reward:** 70 gold, 60 XP, +1 Influence (Xaraguá), and a *Net-float charm* (charm, level 4, SPD +2, HP +3),
  the "woven net charm" of the design under a plainer name.

### 3.2 Oil From a Stranger (X-2, as designed)

- **Opens:** once Thorne has seen Gianna (`story.thorne_met`): the same moment the lamp-oil seller lends the
  lamp. Shows as *??? Harbor Village*.
- **Giver:** the lamp-oil seller (village 23,10). After the lamp: two jars are due up the mountain tonight and
  the marines have started following her. "You are the envoy's daughter. Nobody follows you."
- **Steps:**
  1. Carry two jars (a key item, *Oil jars*, no bag space) up the Mountain Path to the hill camp (camp leader,
     camp 15,11). The path's ambushes are on (marines, musketeers, crabs, bandits, zealots, levels 4 to 6); the
     party is level 5 or 6 here, so they are even fights, and the two zealots who ask "Where is the little one?"
     land exactly where Thorne's warning about Anissa has just been heard.
  2. The camp leader takes the jars and shows how the oil arrives: jars left at the cave mouth on new-moon
     nights, each sealed with a grey thumbprint (the ash-marked post at 17,10 is already on the map). "Someone
     who hates the Crown more than we do. Or loves us more." (Rael clue 6, guide 5.8.)
  3. Tell the lamp-oil seller.
- **Staging:** at the camp the scout (19,8) runs to the palisade and back ("Nobody behind her"); the leader walks
  up, takes the jars, walks to the post and taps the thumbprint.
- **Reward:** 80 gold, 70 XP, +1 Influence, and the Journal note *The ash thumbprint* (the first sighting; the
  design's "2 of 9" numbering waits until Chapter 1's safehouse quest exists).
- **Why:** it gives the hill camp and the Mountain Path a reason to exist in Chapter 2, and plants the game's
  longest clue in the player's hands rather than in a book.

### 3.3 The Hutia's Hoard (X-3, as designed; puzzle M-XAR-1)

- **Opens:** after the pier fight. Shows as *??? Cassava gardens*.
- **Giver:** the small girl in the gardens (`conuco_kid`, 16,14), who already says a hutia took her bead. Yari:
  "...That might be mine." (Her hutia is a passive on her character sheet; this is where the player meets it.)
  The carver on the beach (16,3) adds the comic complaint: a brass button and a fish hook gone from his mat.
- **Steps:**
  1. Follow the trail of dropped shiny things across the gardens: a sea-glass bead by the pond, a fish hook on
     the trail, a brass button at the foot of the old ceiba on the west edge of the gardens (about 3,9).
  2. The hollow is too high to reach. The air shimmers at the tree's foot (an Echo Zone there, open with the
     Locket).
  3. **Echo:** the tree is a sapling; two of Caona's scouts tease a hutia that keeps hiding things at its roots
     ("the great-great-grandparent", Yari insists). A stake leans on a basket. As Patricio, drive the stake beside
     the sapling (**anchor** `anchor.hutia_stake`: a growth puzzle, the first of its kind).
  4. Return: the ceiba has a low fork (the present tree object swaps on the anchor flag and glows on the way
     back, as the sluice did). Climb to the hollow: the bead, the hook, the button, and a few things nobody
     claims.
  5. Give the girl her bead. Keep the button.
- **Anissa's three hints (from `PUZZLES.md`):** "Trees grow, Gigi. That's the whole trick of trees." / "In the
  memory it's tiny. You could bend it." / "Drive the stake beside the sapling in the memory, then climb the fork
  it grew."
- **Echo engine check:** the gardens already have an Echo map (the same ground fifty years ago), so a zone there
  only needs its tiles walkable in both eras (the validator checks this) and an `anchors` layer entry (object +
  flag), exactly like `cave_sluice_gate`. No engine work.
- **Reward:** 80 gold, 70 XP, +1 Influence, and the *Brass button charm* (charm, level 3, rare, HP +4,
  crit +3). The design's "+5% gold from battles" would need a new special; crit already exists.
- **Why:** comic relief in the chapter's only light half, the first growth puzzle, and the hutia made real.

### 3.4 Medicine for the Cacique (X-5, moved to the hill camp; puzzle M-XAR-2)

- **Opens:** after meeting Anaco (`story.anaco_met`). Shows as *??? Caney of Anaco*.
- **Giver:** the healer (`behique`, caney 30,5). The pond tree's bark only holds the fever; the old cure is the
  bark of a grove "above the cave, where Caona's scouts used to camp", cut by the Crown's road crews years ago
  (this is what the built book *A Healer's Notes* already says; the quest pays it off).
- **Steps:**
  1. Climb to the hill camp. Behind the rocks at the camp's north end: stumps.
  2. **Echo** at the camp fire (a zone at 12 to 14, 9 to 10; the camp already has an Echo map): Caona's scouts'
     camp fifty years ago. Caona herself is "out on the roads"; her healer is gathering seed and points to the
     rocks "where no road will ever go". As Patricio, plant the row behind the rocks (**anchor**
     `anchor.healer_grove`).
  3. Return: a young grove stands behind the rocks. Take the bark (*Grove bark*, key item).
  4. Bring it to the healer. Staged: he boils it; Anaco sits up and speaks ("Patricio's blood. Tell the elders I
     will stand when they sit."). The built attack scene already has Anaco walk out to meet the captain on his
     own feet; nothing there changes.
- **Anissa's three hints:** "Roads go where it's flat. Where isn't flat?" / "The healer in the memory said
  something about the rocks." / "Plant the seeds behind the rocks she pointed to, in the memory."
- **The duplicate to avoid.** The occupied city already has a bark errand: the healer in the cave asks for
  fever bark from the pond tree before the cellar visit. Keep it (it is the envoy's pretext for seeing Anaco), and
  change one line of the healer's so the two fit: "The grove bark went with the caney. The pond tree's will hold
  him till I can brew more." Then Anaco "steadier for the bark" in the cellar reads as both.
- **Caona and the order of Echoes.** Caona joins the Echo party at the areíto. The camp Echo must not show her
  in person before that, so her healer speaks for her. Done after the areíto, Caona simply stands with Patricio
  in the memory, as she does everywhere.
- **Reward:** 100 gold, 80 XP, +2 Influence. (The design's "+1 round advantage in the council debate" belonged
  to a council debate that was dropped when the attack replaced it.)
- **Why:** the healer and his notes finally matter, the camp Echo (a designed scene, never built) exists, and
  Anaco's recovery is shown, not told.

### 3.5 Owned or Remembered (the debate, required)

- **Opens:** after the pier fight. Shows as *??? Harbor Village*.
- **Giver:** the elder of the springs (village 9,7), arguing with the Gaze pilgrim (13,7) across the yard fire.
  The debate `xaragua_springs` is built; nothing in it changes.
- **Steps:** 1) Listen. 2) Join and argue all three rounds (won or lost), or Mediate (needs Influence 5 in
  Xaraguá: four Song House books, or two quests and two books).
- **Reason** needs one of three Song House books read (*The First Oath*, *The Charter of Protection*, *The Roots
  and Tides*): Anissa's nudge says so, so the player who wants to win knows where to go.
- **Reward:** 30 XP (as in Chapter 1; the debate pays its own Influence and Concord).

---

## 4. The gate: "Until the elders sit"

**In the story:** when the party reads the oath stone, Yari says the elders will sit at dusk, as the council
always has, and not before. The day is theirs. On the night of the attack the guns fire during the council, so
dusk was always when this scene happened; the gate only says so out loud.

**In the Journal:** a new objective between *The record house* and *Proof for the elders*:

> **Until the elders sit.** The elders will hear the oath at dusk, not before. Until then Yucayeque needs you:
> finish every quest on your Quests page.

It is done through the side quests (`followSide: true`, like Chapter 1's *Unfinished business*), so the gold
arrow leads to the next quest's stop. Done when all five are done, **or** when `story.proof_shown` is already set
(so a save from before this build, already past the attack, does not get stuck on an objective it can never
finish).

**On the map:** the proof scene's trigger at the council doorway (caney 9,6) waits for the five quests
(`if: 'story.oath_found, side.nets.done, side.oil.done, side.hutia.done, side.medicine.done,
debate.xaragua_springs.joined|debate.xaragua_springs.mediated'`; the map's condition strings already allow
`|`). Until then a second trigger on the same tile plays the refusal, in person:

> *(The undecided elder rises from the circle and comes to the doorway.)*
> **Elder:** At dusk, child. The council sits when the lamp is lit. It has for a hundred years, and it will not
> change for good news.
> **Yari:** Then we use the day. Half the village asked me for something on the way up here.
> **Anissa:** Your Quests page, Gigi. The arrow knows what is left.

The same check, worded for each case, when some quests are done ("The nets are mended; the healer is still
waiting", built from the flags the way Chapter 1's Yari lists what is left).

**Anissa's hints for the objective:** "We cannot go to the elders yet, Gigi. Dusk is a long way off and the
Quests page is full." / "Follow the arrow. It knows what is left better than I do." / "The nets, the oil, the
hutia, the healer's bark, and the argument by the fire. All of it, before the lamp is lit."

**No soft-locks:** every giver, every step and the debate are in the free city, and the free city cannot end
until the gate is passed. The Mountain Path is reachable at any time; its ambushes stop with the attack, which
cannot come first. The two Echoes need only the Locket.

---

## 5. Anissa's nudges (mystery quests, under 128 characters each)

- **Cut Nets:** "The fisher from the pier keeps looking at his empty drying posts, Gigi. Ask him."
- **Oil From a Stranger:** "The lamp-oil seller said the marines follow her now. She has jars to send somewhere, I think."
- **The Hutia's Hoard:** "That little girl in the gardens lost her bead to a hutia. Yari went very quiet when she said it."
- **Medicine for the Cacique:** "The healer in the caney wants a bark nobody can find any more. Maybe we can, Gigi."
- **Owned or Remembered:** "The elder by the village fire is still arguing with that pilgrim. The Song House would give you an answer."

---

## 6. How the arrow leads (Journal order)

The arrow follows the Quests page order: a quest in progress first, else the first not started. So the list
order is the walking order, and it should follow the ground:

1. **Cut Nets** (village shore, then the beach: the first thing after the pier, before the caney).
2. **The Hutia's Hoard** (the beach's carver, then the gardens: next door to the cave the story sends you to).
3. **Oil From a Stranger** and 4. **Medicine for the Cacique** (one trip up the mountain does both; the healer's
   quest opens at Anaco's bedside, the oil after Thorne, so by the time the arrow turns to them both are open).
5. **Owned or Remembered** last: by then the player has Influence from books and quests, so Mediate is a real
   option, not a locked line.

Before the gate the quests are optional in order; the player who does them as they come will have most done by
the oath stone, and the gate turns into a short "what is left" rather than a wall.

---

## 7. Expected added length

Estimated from Chapter 1's measured quests (457 steps, 14 transitions for four) and these maps' sizes:

| Quest | Steps | Transitions | Lines |
|---|---|---|---|
| Cut Nets | ~120 | 4 | ~25 |
| The Hutia's Hoard | ~110 | 3 | ~30 |
| Oil From a Stranger + Medicine (one mountain trip) | ~280 | 6 | ~45 |
| Owned or Remembered (with one Song House book) | ~70 | 2 | ~30 |
| The gate (one refusal, the "what is left" check) | ~20 | 1 | ~8 |
| **Added** | **~600** | **~16** | **~140** |

Chapter 2 goes from about 1,020 steps and 37 transitions to about 1,620 and 53, which is a little above Chapter
1's size with its quests in; about 20 to 30 minutes more play, plus the Mountain Path's two or three ambushes.

**Levels and rewards against the fights.** Rewards above total 310 XP, 330 gold and +6 Influence (the design's
Chapter 2 band is 60 to 100 XP, 60 to 150 gold each; these sit at its low end on purpose). With two or three
Mountain Path ambushes (about 80 to 120 XP each), the party reaches the attack at **level 8** instead of 7 (the
caney fight, level 6, stays an even fight; "trivial" starts at 3 below) and meets Thorne at **level 8 or 9**
(he is 9: even to hard, no longer a step above). Chapter 2 ends at level 9, one above target and right where
Chapter 3 wants the party (8 to 11). If that reads as too easy a Thorne, the fix is 10 XP less per quest, not a
harder boss.

---

## 8. Risks

- **Tests that must change:** `tests/act.test.ts` (the Chapter 2 objective list gains the gate objective; the
  route must play the five quests, so `@side-quests` markers in Chapter 2); `tests/guide.test.ts` (every goal
  must be real and reachable, and the arrow must point where each quest is done); `tests/sideQuests.test.ts`
  (five new quests played through their dialogues; every step flag set by some conversation; every giver on a
  map); `tests/puzzles.test.ts` (two new puzzles with `solution.json` and `cheats.json`:
  `puzzles/xaragua_hutia/`, `puzzles/xaragua_grove/`); `tests/chapterStarts.test.ts` (`chapters.json` is
  regenerated from the route, so `?chapter=3` starts with the quests done).
- **The route:** the new NPCs and objects must not stand on the route's walking lines (NPCs block the path
  finder); the Mountain Path ambushes are random, and the simulator wins any fight, so the route is safe, but the
  smoke test in the browser fights them for real: keep the route's mountain walk short.
- **Saves:** flags only, nothing new in the save shape. A save from before this build that is already past the
  attack sees the gate objective as done (section 4). A save before the oath stone simply gets the quests.
- **Chapter starts:** `?chapter=3` gains the five quests' flags and about 400 more XP; Chapter 3's balance, when
  it comes, starts from level 9, not 8.
- **The demo is Chapter 1 only:** unaffected.
- **Echo scenes with new people:** the scouts, the healer and the sapling need sprites: all can reuse the built
  Yaguana Echo looks (`echo_yaguana`) and the ceiba and sluice drawing styles. No art drop needed.
- **Taíno words:** none new; the hutia and the ceiba are already in the glossary pass.

---

## 9. Open questions for the owner

1. **Caona's Conch (X-4): defer to Chapter 11?** Reason: the built escape has used the sea cave and the "where
   the canoes slept" clue, and the puzzle needs a tide system and a water layer that nothing else uses yet. It is
   an owner-approved secret item (Oct 14), so moving it is the owner's call, not mine. If "build it now" is the
   answer, it cannot be required (the secret-item rule) and it is a separate, larger outline.
2. **Cut Nets: with or without a fight?** The design had two marines and a Yield step; I recommend no fight (the
   Yield step is not built, and a second brawl before the attack weakens the reason the Crown attacks). If the
   owner wants Chapter 2's quests to carry a fight, the marines' longboat crew on the beach at level 4 is the
   place, and the fight becomes step 3.
3. **"The elders sit at dusk" as the gate.** It changes nothing already built except one line at the oath stone
   and a refusal at the council doorway, and it makes the night attack follow naturally. The alternative is
   Chapter 1's shape (Yari refuses), which is weaker here because Yari is the one most desperate to get to the
   elders. Approve the dusk gate, or prefer Yari?
4. **Anaco's line when the cure works.** "Tell the elders I will stand when they sit" is a promise the attack
   breaks in front of the player. Is that the tone wanted (the design's "Anaco is well enough to speak at the
   council"), or should the reward be quieter (he sleeps without shaking; the healer thanks Gianna)?

---

## 10. Build plan (small steps, each tested before the next)

1. **Data (Haiku/Sonnet):** the five `SideQuestDef`s in `sideQuests.ts`; the gate objective in `quests.ts`;
   four items in `rpg.ts` (*Oil jars*, *Grove bark*, *Net-float charm*, *Brass button charm*); three Journal
   notes (the thumbprint, "Something changed" for the stake and the grove).
2. **Maps (Sonnet):** `tools/maps/xaragua.ts`: three net objects, the hutia trail and the two states of the
   ceiba with its Echo Zone, scouts, sapling and anchor (gardens); the stumps, rocks, young grove, Echo Zone,
   healer, seed row and anchor (camp); the dusk refusal trigger and the gate on the proof trigger (caney).
   `npm run maps:build`, `npm run validate:maps`.
3. **Dialogue (Sonnet, staged per the owner's rule):** fisher, shell diver, lamp-oil seller, camp leader and
   scout, girl, carver, scouts and sapling, tree, healer and Anaco, Caona's healer and the grove, the elder at the
   doorway; the one-line edits at the oath stone and the cave healer.
4. **Puzzles (Sonnet):** `puzzles.ts` entries, `solution.json` and `cheats.json` for the stake and the grove
   (cheats: climbing without the stake; planting in front of the rocks).
5. **Route and tests (Opus):** extend `routes/zetwal-act1.json` between `@oath` and `@attack`; regenerate
   `chapters.json`; update `act.test.ts`, `sideQuests.test.ts`, `guide.test.ts`; `npm test`, `npm run
   typecheck`, `npm run lint`, `npm run smoke`.
6. **Docs (Haiku):** mark the five as built in `SIDE-QUESTS.md` and `STORY.md`; note the Conch's deferral in
   `SECRET-ITEMS.md`; no change to the in-app rule guide (no rule changes).
7. **Review before deploy (Fable, once):** a play-through of Chapter 2 start to finish on the dev server by the
   owner and the owner's reviewer, per the Oct 19 chapter gate.

*Open items reminder (`docs/PRODUCTION.md`): the board order (A) is due Mon Oct 20, the owner still has to
approve `print/board-24in.jpg`; art drop 1 Fri Oct 24; rules and card text freeze Fri Oct 31.*
