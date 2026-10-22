# Second review: Chapter 11 outline, The War of the Harbor (Oct 22)

*The independent second review of `2026-10-22-chapter11-outline.md`, saved in full. Read against `CLAUDE.md`,
`PLAN-ALL-CHAPTERS.md`, `design/STORY.md` (Chapter 2, 3, 11, threads, tone, open questions 3, 6, 9, 13),
`design/FAMILY.md`, `design/COMBAT.md` (6, 11, 13.3 #3b, #8, #9), `design/CAPITALS.md` 2, `design/SIDE-QUESTS.md`
(Se-5, the safehouses), `design/SECRET-ITEMS.md`, `QUEST-BUILD-GUIDE.md` 5.6 to 5.8, the Chapter 9 and 10 outlines
with their reviews and decisions, and the built game at HEAD (`0a78f45`, Chapters 1 to 8 merged): `tools/maps/xaragua.ts`,
`data/dialogue/xaragua.ts`, `data/dialogue/ardencia.ts`, `data/battles.ts`, `data/rpg.ts`, `data/quests.ts`,
`data/sideQuests.ts`, `engine/battle.ts`, `engine/conditions.ts`, `engine/game.ts`, `engine/gameOver.ts`,
`engine/stage.ts`, `config.ts`. No repo file other than this one was changed.*

*The sim: a scratch copy of HEAD's `quest/` (taken with `git archive`, so the merge in progress was not touched) with
one scratch script, `/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch11rev/snap/quest/tools/ch11-sim.ts`
(full output in `/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch11rev/sim-30.txt` and
re-runs in this review). Section 5 has the method and the tables.*

---

## 1. Verdict

**Build it after the fixes in section 3.** The outline is the right chapter: the landing on the Canoe Beach is the
only honest landing the built Chapter 2 allows (Anaco's chain line, the escape's "the marines watch the harbor mouth,
not the cliffs"), the elders' debate comes back as STORY 2 promised, Yari's cellar stair is the chapter's quietest and
best beat, *Harbors Lie* is exactly the fairness device the Turn needs, Caona's stand finally uses the Echo battle the
engine has carried since Chapter 1, and the Ash Road Accounts are read with the two halves as the key (which the
Chapter 9 outline already set up: Haru, "I will need the key"). Most citations of the built game are exact (section
4).

**Nine problems would ship wrong, unfair or contradictory if built as written** (details in section 3):

1. **The Harbor Turn does not ask its question** (3.1). Rael walks up alone and asks the envoy "which way to face".
   A traitor does not ask for orders, so Strike reads as attacking an unarmed man who offered to obey, and the
   "dark" signet is an absence the player cannot see. The guide's clue (the signet *glows when he lies in public*) is
   the one thing that would make the choice fair, and the outline does not use it.
2. **The truth scene breaks the token's built rule** (3.2). In Chapter 3 the Locket held to the signet *glows*
   (`fx: 'token'`, `story.signet_glowed`) during a true sentence; the lie-glow is a separate effect. The outline has
   both halves "stay dark" when held together, and Anissa's hinge line ("It glowed when he lied") misdescribes what she
   saw in the hall.
3. **The fights are far easier than planned, and Strike is the easier route** (3.3). On the built engine with tier-24
   gear (the built shops' top tier, which a Chapter 11 player has), every named fight wins every seed with **no fall
   at any level from 25**: Thorne in 10 actions (planned 24 to 28), the Betrayer in 15 (planned 28 to 34 with a fall
   in one in five), Rael's Strike in 27 to 31 with **nobody Bound** (planned 32 to 38 with two Bound and a loss in one
   in ten). Even unequipped, the Strike fight costs fewer falls than the Trust fight.
4. **Four volleys wipe every standard foe before turn 1** (3.4). A volley at the active four's average ATK is 41 to 69
   percent of a Chapter 11 foe's HP on Story, not "a third"; two or three kill any non-boss. The pool and cap turn
   every stage into a boss solo.
5. **The Strike route never closes the war** (3.5). It sets `story.fleet_escaped` and never `story.harbor_won`, and
   the outline keys the night ambush layer, the free-city mood and the vendors' return on `!story.harbor_won` /
   `story.harbor_won`: on Strike the village keeps its night ambushes and its occupied look forever. Rael also walks
   off a pier he has just lost a fight on, past Jordyn (who arrests everyone else "by the book"), with no beat that
   says why.
6. **The chain does not fit the built map or Anaco's built line** (3.6). The capstan is at the pier's landward end,
   on the sand; the chain is "drawn along row 26 to the ship"; Ardencia's ships on row 27 from the west edge sit on
   top of the *Patience* (10 to 15, 27 to 29); Rael's longboat at (21, 27) is on the pier's own tiles. Haru's opening
   line ("a chain between the two nearest" hulls) and beat 5 (a chain from the *Patience* to a post) describe two
   different chains. The present-day capstan is "rusted solid", which would hold a chain, not drop it.
7. **The thumbprint ledger lists the wrong doors and contradicts itself** (3.7). Haru's nine omit Bab al-Dhahab's
   water (A-3, built) and Pòdlimyè's bread (Z-5, the sixth in the built count), and invent "the bog chapel" (Chapter
   9's cult cell, not the safehouse) and "the cane's mill" (Chapter 10's smugglers). Rael says "You have opened them
   all now"; Haru's reading says "and the two you have not opened".
8. **`party.rael` survives a lost flagship fight** (3.8). Game Over has no hook that clears flags (only
   `meantToLose.set`), so after a loss Rael is a roster member on the Status page and in any ambush until Hale is
   beaten. The outline's "a loss clears it in the Game Over path" names a path that does not exist.
9. **The levels are planned from the floor of 25, and Chapter 10 ends near the top of it** (3.9). Built chapters end
   in the top seventh of their target level (the Chapter 10 review's evidence); from about 8,550 the fixed total lands
   23 XP under 29 with two ambushes and on 29 with three.

The rest are medium or small (3.10 to 3.16). None needs a new engine system beyond what the outline already costs;
together the fixes add about **half a builder-day** (section 7).

**Owner questions:** one, the outline's own (Azzy on Strike), where I agree with the recommendation; listed in section
8 with the near-misses I would keep as Claude's calls.

---

## 2. What I agree with

- **The landing and the order of the island.** Beach, headland, camp, mountain, village, customs house, cellar,
  pier: the island walked the short way, every map a built one, no new map. The fleet cannot pass the chain, so it
  does the escape in reverse; that is earned by two built lines.
- **Yari's chapter.** The bow ("They've put a flag on it"), the camp ("Everything is the tide here": the built
  Chapter 2 hint, `quests.ts:525`), the mediation, the cellar stair ("You argued." pays the built "She will argue
  anyway"), the caney ("Mine to carry. Yours to set down."). Anaco's "Envoy's daughter. You used it." pays the built
  `xaragua.ts:391` exactly.
- **Harbors Lie.** A placed child, one dialogue, no fight, and it shows the black sails four hours before the Turn.
  The boy's "Forty-two marines" is the built `fisher_boy` count (`xaragua.ts:746`). Gianna's one line ("He came for
  the Regent's harbor. Of course he did.") puts `belief.rael_traitor` in her mouth at the right moment.
- **Caona's stand as the Echo battle.** `battleParty(..., 'echo')` and `BattleDef.era` are built and the battle scene
  already reads `def.era` (`scenes/BattleScene.ts:249`); the stand is the design's "the place where the debt began".
  On the sim the Echo three at 25 to 28 win every seed in about 11 actions (section 5), so the outline's gate holds.
- **Armies as stage actors and placed pairs, never crowds.** Correct reading of `engine/crowd.ts` and the Chapter 10
  review. Writing them once from a `company(house)` table is the right cost control.
- **Rael in the four as a `MemberDef` lifted by `leads`.** `battleParty` already puts a leading member second
  (`engine/battle.ts:1612`). His kit (La Marca, Grito de Guerra, Reinado de Cenizas) is the built Azzy kit
  (`slash, heavy_blow, sweep, la_marca, grito_de_guerra, reinado_de_cenizas`): father and son side by side with the
  same moves, which is good and costs nothing.
- **The stale lines it fixes** (the war table on `story.war_begun`, not `story.muster_done`; the built
  `mountain_path` layer already excludes it; the guards' leaving by `withdraws`; the side-quest reward scale). All
  checked and right.
- **The locked rule, both sides.** Nothing before `war.turn_made` says he is good; the carrier is a walk and a coat;
  the sails are a count. After the Turn the family speaks. That is STORY 4 and the guide's "near the end".
- **Benny and Nancy on Rael's ships.** FAMILY settles the role, not the road; this is the only road that needs no new
  scene. On Strike Benny staying as the Hearing's witness is good.

---

## 3. Findings, most serious first

### 3.1 The Harbor Turn does not ask its question (high: the game's most important choice)

**Evidence.**
- The guide (5.6): "Rael's army appears on the flank. The player **expects a second father-daughter fight** and is
  given a trust choice." STORY 11 the same. The guide 5.8, foreshadowing 1: "The signet **glows when he lies in
  public** and not in private." "The player sees it in cutscenes; Gianna does not understand it."
- Built Chapter 3 (`ardencia.ts:705-713`): the public lie ("Ardencia stands with the Crown ... She will be our guest")
  plays `fx: 'signet'`, and Anissa: "Gigi. His ring lit again." Gianna does not hear.
- The outline, beat 8: Rael comes up the pier **alone, hands behind his back**, and says "I have come to be told which
  way to face." The signet is "dark (the `fx: 'signet'` is not played ...) the player who has watched it since
  Chapter 3 sees that it is not glowing."

**What the player sees.** A man who has openly declared for the Crown since Chapter 3 sails in past the Crown's line
and asks the envoy for orders. Nobody expects a fight; the choice reads as "accept help" or "attack a man who offered
it". Strike becomes the obviously wrong answer for the story's own reasons, not for the clues the player has gathered,
so the choice tests nothing. And "the signet is not glowing" is a non-event: the built game shows the glow as an
effect over a line; with no line that would have made it glow, the player has nothing to notice.

**Fix (Claude's call; it changes the Turn's words, not the chapter's flow).**
- Make the threat legible first: as the black sails come round the point, **the Crown's line lets them through**
  (two of the built ship objects dip their flags on a `sync`; a marine on the pier: "Ardencia! The Lord of Ardencia,
  for the Crown!"). The Crown's ally has arrived: that is what makes the player expect the fight.
- Rael comes up the pier **with his vanguard** (Rivera, Jaime and two halberdiers placed behind him at the pier's
  end), not alone, and says one public sentence for the Crown's ears that is a lie, with `fx: 'signet'`:
  "Envoy. Ardencia stands with the Crown. Stand aside, and nobody on this pier is hurt." Anissa, behind Gianna, the
  Chapter 3 line turned forward: "Gigi. His ring." (Earnest; she says it and nothing else.)
- Then the choice, in the guide's words: ***Hold the pier.*** (Trust: do not strike first) / ***Strike first.***
  Azzy's one line before it stays ("Gianna. Whatever you say, I'm beside you.").
- On Trust, Rael turns (`face` to the water): "Rivera. Jaime. The *Patience*." The signet's lie is then answered by
  the deed, which is "shown, not told" at the exact moment the guide wanted.
- This gives the observant player the fair clue at the choice, keeps Gianna's belief honest (she sees a man declare
  for the Crown), and keeps Strike a real temptation. It also makes "hold" mean what the guide says ("the party
  holds"), where the outline's "Face the *Patience*." is Gianna giving Rael orders.

### 3.2 The truth scene breaks the token's built rule (high: continuity; Anissa's hinge line)

**Evidence.** Built Chapter 3 (`ardencia.ts:682-686`): "He takes the Sun Locket from her neck and holds it against
the half-sun signet on his hand. **Both halves glow.**" (`fx: 'token'`, `story.signet_glowed`), Anissa: "It's the same
light, Gigi. His ring and your locket. They're one thing." That happens during a true exchange (who made the Locket).
The lie-glow is a different effect (`fx: 'signet'`, `ardencia.ts:711`). The outline, beat 9: "holds it to the
signet: **both halves stay dark** (no `fx: 'signet'`)", Anissa: "It's dark, Gigi. It glowed when he lied. In the hall.
It's dark now." Beat 9 then uses the two halves together as the Ash Road's key.

**What the player sees.** The one rule the player has learned about the token (together, the halves light) silently
stops working at the hinge of the story, and Anissa, who said in the hall that the light meant "they're one thing",
now says it meant a lie.

**Fix.** Keep both effects distinct and use both:
- Rael does **not** take the Locket at the start of the truth. He speaks; the signet on his hand stays plain through
  every sentence (no `fx: 'signet'` on any line). After the first exchange, Anissa: "Gigi. It isn't lighting. In the
  hall it lit when he said we were guests. It isn't lighting now." (Her Chapter 3 observation, heard at last.)
- The halves together come at the Ash Road Accounts: Gianna sets the Locket on the page, he sets the signet beside it,
  and **they glow** (`fx: 'token'`, as built), and by that light the columns read. "The key is the thing you are
  wearing" then pays twice: the token reads the ledger.
- The content test asserts no line in the truth's nodes carries `fx: 'signet'`.

### 3.3 The fights are far easier than planned; Strike is the easier route (high: difficulty)

**Evidence.** Section 5 (the built engine, the route's flags at `@chapter8-end` lifted to the level, the outline's
fights written as data, 30 to 40 seeds, Story difficulty, falls counted party-wide, the built `skills` bot plus Break
Free when Bound):

| Fight (outline's numbers) | Planned | Tier-24 gear, 25 to 28 | Unequipped (start gear), 25 to 28 |
|---|---|---|---|
| Headland battery | 8 to 13 actions, nobody down | 4 to 5 actions, 0 falls | 6 to 9, 0 falls |
| The Betrayer (Hrafn, *Warpath* 200 area), Bayarmaa leading | 28 to 34, a fall in 1 of 5 at 25 | **14 to 16**, 0 falls (1 run in 30 at 26, glass line) | 15 to 19, a fall in 6 to 12 of 30 at 25 |
| Thorne at 27, x3 / x1.1, two foes | 24 to 28 | **9 to 11**, 0 falls | 11 to 16, 0 falls |
| Caona's stand (Echo three) | wins every seed | 11, 0 falls | 11 to 12, 1 run in 30 at 25 |
| Pier assault (four foes) | 14 to 18 | **5 to 6**, 0 falls | 8 to 12, a fall in 3 to 7 of 30 |
| Hale x6 with Rael in the four | about 30 | **18 to 21**, a fall in 0 to 4 of 40 | 23 to 36, a fall in 12 to 26 of 40 |
| **Rael's Strike** x6, guards, halberdiers at 66%, `binds` | 32 to 38, two Bound, a loss in 1 of 10 at 26 | **24 to 31, nobody Bound in 320 fights** | 28 to 51, a Bound in 0 to 16 of 40, no loss |

Tier 24 is the top of the built gear (`RPG.items`: weapons and armour to level 24, charms to 20); Chapter 10's forge
stocks it (the Chapter 10 review), so it is what a Chapter 11 player wears. The unequipped column is the floor (the
scripted route never equips), and is comparable to the Chapter 9 and 10 reviews' sims, which ran from route saves.

Raising Rael's ATK does not fix it: at HP x5 with ATK x1.6 or x2.0, the roster four still take **no** Bound at 25 to
28 (the front row soaks it); only the glass-cannon line takes one in 4 to 6 of 40.

**What the player sees.** The war's three bosses fall in two to four minutes without anyone going down; the Strike
route, which the guide calls "a hard fight" and the outline "meant to be won, at a price", is the gentler of the two
routes, so the price is only the lost fleet. With volleys on (3.4), the stages are not fights at all.

**Fix.**
- **Plan and gate from tier-24 gear and the roster order**, not from unequipped route saves. Write the day-1 sim's
  party with the best built gear at each level (the scratch script's `best`) and keep the start-gear run only as the
  floor that must still win.
- **Make Strike the hard route on purpose:** its tuning target "a Bound in at least half the fights at 27, a loss in
  no more than 1 in 8, every seed won at the boss Grudge"; levers that reach the front row through it: Rivera's Hook
  and Rael's Grito more often (stuns stop the healer and the tank), Jaime's Ash Storm every 3, Reinado de Cenizas
  without `once` in Cornered, and La Marca with `powerPerBound`. Keep x5 HP so it stays near 30 actions.
- **The Betrayer and Hale** to the outline's 28 to 34 actions: x6 to x7 HP and the house move every 2.
- **Thorne**: see 3.14.
- The built `skillsAction` never chooses Break Free (`tools/battle-sim.ts`): a Bound fighter's skill is refused and the
  sim stalls (it did, in this review, until the bot was patched). The day-1 sim needs `if (b.actor.bound) breakFree`.

### 3.4 Four volleys wipe every standard foe before turn 1 (high: the war's mechanic)

**Evidence.** The outline (4.2): `VOLLEY_POWER` 150, "a plain blow at the party's average ATK", cap 4 per fight, pool
14 to 24, "roughly a third of a musketeer's HP; four of them open the headland fight with the musketeers half gone".
On the built formulas (`engine/battle.ts` `hit`, `enemyStats`, `DIFFICULTY.story.enemyHp` 0.8):

| Foe | Story HP | One volley at ATK 57 (the roster four's mean) | at ATK 80 | Four volleys |
|---|---|---|---|---|
| Crown Musketeer 25 | 152 | 71 (0.47) | 106 (0.69) | 1.9 to 2.8 x its HP |
| Crown Marine 26 | 158 | 69 (0.43) | 103 (0.65) | 1.7 to 2.6 x |
| Officer (lieutenant shape) 26 | 275 | 64 (0.23) | 99 (0.36) | 0.9 to 1.4 x |
| Steppe Reaver 25 | 152 | 69 (0.45) | 104 (0.68) | 1.8 to 2.7 x |
| Thorne 27, x3 | 918 | 52 (0.06) | 87 (0.09) | 0.2 to 0.4 x |

**What the player sees.** "How many volleys?" has one right answer (the most), after which the headland, the pier and
the house foes in the flank are dead before anyone moves; the army wins the standard fights by deleting them, and the
only fights left are boss solos. The thin-fleet player is punished in the one place the chapter is already easy.

**Fix (keeps the outline's shape: the whistle, the shouts, the companies shown).**
- `VOLLEY_POWER` **50** (about 15 to 25 percent of a standard foe), `VOLLEY_CAP` **3**, a boss takes 0.5 as written.
  Three volleys then open a fight with the trio wounded, not dead.
- Or spend volleys on **effects**, not damage, which reads better as a company answering: one volley = the foes
  `weakened` for 2 turns; two = also the first foe `stunned`; three = also the party `inspired` for its first round.
  Every piece exists (`statuses`, `ally`), and nothing can delete a fight.
- Either way, **sim the stages with volleys on and tune on volleys on** (the outline says the opposite: "tuned on
  none"), because a full fleet is the common case after Chapter 10's fixes, and "fair with none" is then trivial with
  three.

### 3.5 The Strike route never closes the war (high: soft-lock-adjacent and logic)

**Evidence.** Beat 8b: "`story.harbor_won` is **not** set; `story.fleet_escaped`." The outline then conditions:
the village's night ambush layer on `story.tide_called, !story.harbor_won` (section 10); the free city's mood on
`story.harbor_won` (section 3); vendors "none until `story.harbor_won`" (7.4); *The First Oath*'s second look "after
`story.harbor_won`". Beat 9's truth and beat 10's caney run on both routes.

**What the player sees.** On Strike, after the caney's card the village still spawns night ambushes on its trails,
still wears the occupied dusk, and the market never comes back; any return trip in Chapter 12 or after the release
finds the war still on.

Separately, Rael on Strike: he "withdraws at 0 HP" in the fight, his ships turn away, and then in beat 9 he is on the
pier telling the truth, and by beat 10 "he went north". Jordyn's watch has just arrested the betrayer and Thorne "by
the book", and Gianna has just beaten the man she believes sold Xaraguá; nothing says why he is not taken.

**Fix.**
- One flag set on both routes when the pier is decided, **`story.harbor_taken`** (Yucayeque holds its harbor), and
  key every "the war is over" condition on it (ambush layers off, mood, vendors, books' second looks); keep
  `story.harbor_won` / `story.fleet_escaped` only for what differs (the struck fleet's white flags, Stability).
- On Strike, after the fight, a short shown beat before the truth: Jordyn steps forward with the cords; Rael, on one
  knee, to Gianna: "To a Throne. Not to a watch." Gianna (the player's line, no choice): "Then at Eightgate." Jordyn
  lowers the cords. That keeps the guide's Hearing ("Rael surrenders to Gianna's Throne") and makes the walk-off a
  decision the player watched, not an omission.

### 3.6 The chain does not fit the built map or the built line (medium-high: staging and puzzle logic)

**Evidence** (`tools/maps/xaragua.ts` `xaraguaVillage`): 44 x 30; sand from row 18, water from row 22; the pier is
`rect(21, 19, 2, 9)`: x 21 to 22, **rows 19 to 27**, its sea end at row 27 (the built ferry spawn at (21, 25) is "the
end of the pier"); `pier_sign` at (24, 19); the built ships at (2, 24), (29, 24), (36, 26), 5 x 3. The outline:
- "the old chain post at **the pier's head**" at (23, 19), the Echo zone at (21 to 22, 19 to 21): that is the
  **landward** end, on the sand, next to the built sign; "an `above` chain strip along row 26 to the ship" at
  (10, 27) cannot run from (23, 19) without crossing the pier.
- Ardencia's ships "in a line along row 27 from the map's west edge" overlap the *Patience* at x 10 to 15, rows 27
  to 29.
- Rael's longboat "at (21, 27)" is on the pier's last tile, and Rael "enters from (21, 27)": the boat blocks the
  walk.
- Haru, beat 0: "Eleven ... and a chain between the two nearest" (the built Anaco line, `xaragua.ts:792`); beat 5: the
  chain from the *Patience* to a capstan on shore. Two chains.
- The cheat file: the present capstan "Rusted solid. The pawl's pin hole is empty." A capstan rusted solid holds its
  load; the chain could not run out.
- After the chain drops, the outline brings in only Ardencia. The seven navies that landed the companies are never
  seen again at sea.

**What the player sees.** The chapter's mechanical payoff (the Echo makes the mouth unchainable) does not survive a
look at the map: the chain runs from the beach end of a pier, nothing explains why the party cannot knock the pin out
themselves, and the allied fleet the Muster built vanishes when the mouth opens.

**Fix.**
- Put the capstan at the pier's **sea end**, beside it at (23, 26), on its own pile (a 1 x 1 object on water); the
  chain strip runs along **row 27 from (16, 27) to (22, 27)** to the *Patience* moved to (10, 27). Keep the Echo zone
  at the landward boards, where Caona holds the pier so the companies can form on the shore; in the Echo, Patricio
  walks down the pier to the capstan (the whole map swaps era, `engine/game.ts` `swap`), which is the stand's purpose.
- Give the present a reason the party cannot do it now: the pier's sea end is held by the stage-three marines and
  the *Patience*'s deck guns (a cannon audio slot when the party steps past row 23). The Echo goes round them in time.
- Haru's opening line: "Eleven hulls across the mouth, and a chain from the big one to the old post at the pier.
  He's learned nothing." (Anaco's three-ship chain was Chapter 2's; eleven ships rig it differently. One line covers
  it.)
- The cheat text: "The pawl's pin hole is empty. Has been for a long time. The Crown made fast to it anyway."
- Ardencia's ships on **row 25 from the east edge** (x 36 to 43; the built `crown_ship_far` at (36, 26) moves west or
  is the one that dips its flag), the longboat at **(23, 27)** beside the pier's end.
- When the chain runs out, **the allied hulls come in round the headland** (boat objects re-placed on the village map's
  east edge on the next `sync`), so the Turn's picture is three fleets: the Crown's in the mouth, the allies' to the
  east, Ardencia's between, which is what Rael's "I hold the water between" (or the fix in 3.1) points at.

### 3.7 The thumbprint ledger lists the wrong doors and contradicts itself (medium-high: continuity)

**Evidence.** Built notes: the first (X-2, oil), "again" (Ar-1, bread), "a third time" (A-3, water: "Yucayeque's oil,
Cenizal's bread, Bab al-Dhahab's water"), the fourth (S-3, grain), the fifth (K-3, the press and the marsh lanterns),
the seventh (J-3: "Seven of nine", `quests.ts:1913`); the sixth is Pòdlimyè's Z-5 *Bread With No Debt* (the Chapter 9
outline's count: "Z-5, X-2, Ar-1, A-3, S-3, K-3 and J-3"; Z-5 is after the release); the eighth is Chapter 9's
**printing barn** on the heath (Al-3, the purge list); the **bog chapel** is that chapter's Quiet Crown cell. Chapter
10's mill is the smugglers' and the veiled woman's, with no thumbprint. The outline's reading: "the caves of Yucayeque,
the Lower Town's kitchen, the winter stores, the lanterns of the marsh, the anonymous oil, **the bog chapel, the cane's
mill**, and **the two you have not opened**", with the Journal note "9 of 9" and Rael's "Nine doors ... **You have
opened them all now**."

**What the player sees.** The thread's close names a cult chapel as one of Rael's doors (which would tie him to the
cell that hunted Anissa, the opposite of the Hearing's distinction), drops a door the player walked through in
Chapter 4, and counts nine and seven-plus-two in the same scene.

**Fix.** Haru reads exactly nine, in the order the built notes found them: "Oil at the cave mouth. Bread in the Lower
Town. Water in Bab al-Dhahab. Grain under the plateau. Paper and lanterns on the marsh. **A bakery in Pòdlimyè with no
debt book.** Oil for a wick in Agnipur. A list that warned them first. Powder for this harbor." Rael: "Eight you
opened. The bakery is at your mother's end of the plaza; you walked past it at the festival." (Z-5 is after the
release, so the player has not opened it; this is honest and points at it.) Drop "the two you have not opened"; the
note stays "9 of 9" because the thread's count, as built, already counts Z-5.

### 3.8 `party.rael` survives a lost flagship fight (medium-high: soft-lock risk and the "guest only" rule)

**Evidence.** `engine/gameOver.ts` `recordLoss`: only `meantToLose.set` writes flags on a loss; a fight meant to be
won writes the count and the Grudge. Game Over gives back "the moment before the fight" and leaves the player free on
the map (`engine/game.ts` `riseFromFight`). The outline: "`party.rael` is set in the line before `battle.next` and
cleared in `battle.after` ... a loss clears it in the Game Over path".

**What the player sees.** After a loss to Hale, Rael is a roster member: on the Status page, in the gear screen, and in
any ambush on the village's night layer, until Hale is beaten. STORY: "guest only, not a roster member".

**Fix (choose one; both are small).**
- Rael's `joins` is `war.trust, !story.harbor_taken` and the village's ambush layer is off from `war.turn_made`; his
  Status row is hidden by a `MemberDef.guest: true` that the menu skips (about 10 lines). He is then a member for the
  pier's last minutes either way, which is honest; or
- a `BattleDef.onLoss?: Record<string, boolean>` written by `recordLoss` beside the count (about 5 lines, one test),
  and `flagship_hale.onLoss = { 'party.rael': false }`; Hale's restart dialogue sets it again.

### 3.9 The levels are planned from the floor of 25 (medium: levels)

**Evidence.** The outline plans from 8,078 and shows 8,400 and 8,623. The Chapter 10 review (3.4) shows the built
chapters end in the top seventh of their target level because the dials are set to "end on the target" from below
(Chapter 6 at 74 under 18, Chapter 7 at 66 under 20). Chapter 10's dials follow the same rule, so its route ends near
8,550. From 8,550: the outline's fixed 1,765 plus two ambushes lands **10,315** (28, 23 under 29), plus a third
**10,380 (29)**. The outline's own table already gives 29 from a 26 start.

**What the player sees.** Most players enter Chapter 12 (28 to 30, twenty minutes) at 29, one level over its floor,
and reach the cap before the Regent.

**Fix.** Plan from Chapter 10's **measured** end (the outline says this in one sentence; make it the plan, as the
Chapter 10 review did for Chapter 9). As a first cut before the measurement: objectives at **40** (row 11 = 40, minus
120), the boss at **180** (minus 40): about 1,605 fixed, which lands 28 from 8,550 with three ambushes (10,220) and
leaves a wanderer from 26 at 29.

### 3.10 Line-level continuity errors (medium: continuity; each is one line)

| Outline | Built or settled | Fix |
|---|---|---|
| Anissa: "Gigi. Count them." "(Her **Chapter 1** line to Yari, 'I told you about the two ships. Count them.', turned round)" | That is **Yari's** Chapter 2 arrival line to Gianna (`xaragua.ts:74`, `speaker: Y`) | Keep Anissa's line; fix the citation, or give "Count them." to Yari, which pays her own line |
| "Vikram, who broke a chain once" | Arjun broke the chain, in the Echo, with Patricio's hand on the taper (STORY 8 built) | "Vikram, whose great-grandfather broke one" |
| Xaraguá's seat token: **the conch-shell token** | Se-5 (`SIDE-QUESTS.md`): Xaraguá's token is **a carved paddle**; *Caona's Conch* is the X-4 secret item (`SECRET-ITEMS.md` 3, after the release) | The carved paddle, given by Anaco to Yari to Gianna (the lines stay) |
| Benny: "I said I'd made the other half. **I did not say for whom.**" | Built: "I made the other half. A signet, **for a lord who did not deserve one yet.**" (`ardencia.ts:416`) | "I said for a lord who did not deserve one yet. I did not say which lord." |
| Thorne: "Three names, Governor. **You've met one of them.**" (Yari) | The oath's three names are Caona, Patricio and Benny; Thorne has met none of them, and Yari is not one | "Three names, Governor. Her great-grandmother's is the first." |
| Rael to Azzy: "You have your grandfather's hands ..." | Chapter 8 built Aiyana's "Azriel. You've got your grandfather's hands." (`FAMILY.md`, Chapter 8 built) | Keep the guide's line (it is the guide's); Azzy's answer: "Titi Aiyana said the hands." Or cut Rael's "That was the point of raising you", which frames Azzy's defection as Rael's plan (the "redeemed in the moment" risk the guide warns about) |
| Anissa's tip at Hale: "He hates the light, Gigi. They all do." | Hale has no `weak` in the outline's row; Thorne is the one weak to light | A tip that is true of Hale: "He wants one of you alone, Gigi. Stay together." |
| The content test: "no pre-Turn line with 'good'" | Caona's "Good." in the Echo (section 8) is pre-Turn; so is any ordinary "good" | Scope the test as Chapters 9 and 10 did: Rael-adjacent speakers (the family, Benny, Nancy, Rivera, Jaime) and the words as phrases ("he is good", "innocent", "feeds", "the arrows") |
| "cacica" and "¡Firmes!" "both in the realm's tongues already" | Neither is in `quest/src` yet (`grep`); "¡Firmes!" is Chapter 10's (outline and review), "Cacica Yari" is the guide's ending | Add both to the Nov 18 fluent check's list explicitly |
| "the three Seat tokens plus the Dorini token ... Se-5's fourth" | The count is then the fifth | Say "Xaraguá's" and let Se-5 count |

### 3.11 Staging on a phone-sized map (medium: owner rule and readability)

**Evidence.** `config.ts`: the view is **20 x 11.25 tiles** in every orientation (320 x 180, letterboxed in
portrait, so a character is about 29 px tall on a 390 px screen). The outline's landing file is seven companies of
three "along the sand at rows 12 to 13 across the beach's width" (21+ tiles), panned once. Rows 12 to 13 of the built
beach hold the salt pans (23 to 27, 12 to 13), canoes at (8, 13), (18, 12) and palms at (11, 13), (21, 13), (30, 12),
(33, 13). The headland crew exits "at (34, 3)", which is inside the headland's rock oval (31.5, 4.5, 4 x 4.5). A
betrayed house is shown as "a gap in the line", which is the only way the player sees which house is missing.

**What the player sees.** Half the file at a time; walkers stopping at palms; a gap they cannot find without the
pan; seven recoloured soldier sprites that are hard to tell apart at 29 px.

**Fix.**
- **Seven columns, not one row:** each company is a column of three (captain in front, two soldiers behind), the
  columns two tiles apart from x 3 to x 15 on rows 9 to 11 (sand and trail, clear of the market and the pans): 13
  tiles wide, one screen, no pan, and a missing house is a missing column. The same shape fits the camp's edge and the
  village yard.
- **A banner in every column:** the second soldier carries the house's banner look (Chapter 10's banner objects as a
  carried look), so houses read by colour and shape, not by recolour alone.
- The crew walks out down the rock's west foot to (26, 9) and off the north edge; the gun keeps its three looks.
- The 21-actor scene then needs no stage-runner check beyond Chapter 10's twelve: three cues per column.

### 3.12 Anissa's place in the flank, and one comedy line (medium: owner rules)

**Evidence.** Beat 2 gives Anissa "Gigi. Count them." on the sand as the hull grounds, then says she "is at the
headland's foot with the healer" twice (to keep Vikram's and Jordyn's lines away from her). She is a party member in
the fight (the Husher's Seize is "the fight's one aim at Anissa, answered as built"). Vikram's defiance line, the
companion's serious second defiance, is "I'm out of breath *already* and we haven't started."

**What the player sees.** Anissa in two places in one beat; a joke in the middle of a betrayal.

**Fix.** Anissa stays behind Gianna through the flank (she is in the fight). Keep Jordyn's "I only have the one set"
after the fight with Anissa walked to the healer by a cue first (a `walk` for the follower is built). Vikram's
defiance earnest: "Steward. You sold the flame for oil. I'll take it back the way Arjun did." His breath can come
after the win, away from her.

### 3.13 `leads` windows and the Strike's `avoid` (medium: rules)

- **The companion leads the headland too.** `leads` is a standing condition (`battleParty` evaluates it for every
  fight). With `muster.betrayer.<house>, !war.flank_done`, the companion is lifted into the headland battery as well,
  and Bayarmaa, Haru and Vikram already have `leads` for their own chapters (`rpg.ts:455, 467, 483`). Use
  `{ any: [<the chapter's>, { all: [{ flag: 'muster.betrayer.<house>' }, { flag: 'story.headland_won' }, { notFlag: 'war.flank_done' }] }] }`.
- **`avoid` must not be cut.** The outline's fallback for "he never strikes Gianna" is "else Rael strikes her like
  anyone", which contradicts COMBAT 13.3 #3b ("will not strike Gianna"). It is 15 lines; move it to the never-cut list.
  Area moves (Reinado de Cenizas, Stand down) then need the same rule (`avoid` skips the member in area targets too),
  or the Cornered phase strikes her anyway.
- **No Seize in the Strike.** The built `rael` has Seize; the outline's `rael_harbor` lists Blade and La Marca. Keep
  it out (the chapter's only Seize is the Husher's, as the outline says) and say so in the data comment.

### 3.14 Thorne at 27 is a ten-action fight (medium: pacing)

**Evidence.** Section 5: 9 to 11 actions at tier-24 gear with nobody down; the outline itself names him "the first
cut" if he reads as padding. He is also beaten in Chapter 2 at the sea cave (built `thorne_blockade`).

**Fix.** Keep him (the Charter's voice, the Yield finally offered, the cellar's keeper), but make the customs house a
**stage fight that matters**: Thorne x4 with *The Charter, read aloud* every 3 and a second phase at 50% (COMBAT 13.3
#1's *Protection Fee*: power 120, `weakened`), about 18 to 22 actions; or fold his marines into the pier assault and
make the customs house his Yield alone, after a short scuffle with two marines at the door. I prefer the first: the
war's stage two then has a shape.

### 3.15 Pacing (medium)

The outline's 40 to 45 minutes is about right on my count: about 300 heard lines (15 to 18 minutes), 900 steps and 20
transitions (5 minutes), 7 to 8 named fights and 1 to 4 ambushes at the geared lengths above (15 to 18 minutes with
the battle screen's turns), the debate (3), the stage walks (4 to 5). That is 50 percent over the plan's 30. The cuts
I would take first, because they are the ones the sim says are thin:
1. **Fold the pier assault into Caona's stand**: stage three *is* the stand (the present marines at the pier's sea
   end are the ones the Echo goes round, 3.6); the pier is the party's when the chain runs out. Saves a fight that
   lasts 5 actions and a transition.
2. *Harbors Lie*'s second step stays; its walk to the lookout can start from the camp's rock (the boy counts from the
   rock with the lookout's view as a dialogue), saving the mountain branch (about 40 steps).
3. The Song House's captains' count to two (Azzy and Joaquin, Jordyn).
That brings it to about 38 minutes, which I would state in the milestone note rather than cut further: the war is
the chapter.

### 3.16 Small (low)

- *The Ninth Thumbprint*'s carrier, "He walked like the ones on the strand, Gigi. The black coats." is the strongest
  pre-Turn clue in the game (Free Brasador were on the strand). It is a clue, not a statement, and it is the right
  last clue; keep Azzy's deflection. The content test's exception must cover the quest's nodes, not only its note.
- Nancy is present when Benny says "He is his mother's" (his mother is Rahel, not Nancy). Consider "He was always his
  own. He never explained himself to me either."
- A spared Thorne must be shown going to the *Patience* (a walker into a ship's boat at the pier's end before the Turn)
  or the "with Thorne aboard if spared" is told.
- Azzy's Strike line "and you chose him" reads two ways; "and you chose to fight him."
- On Strike, say where Nancy is (with Benny at the Song House).
- `story.war_begun` and the chapter's new map conditions must be set by some dialogue or listed in
  `LATER_STORY_FLAGS` for the map validator.
- The Chapter 10 outline says Rael's Quiet Crown founding "is the Hearing's". STORY Chapter 11 and the guide 5.6 put
  "he founded the Quiet Crown" in what Gianna learns here; the Hearing has the **public** confession. The outline's
  private telling with "I will answer for it where it can be written down" fits both; record that reading in STORY.

---

## 4. The outline's claims, checked

| Claim | Checked | Result |
|---|---|---|
| Village 44 x 30, pier (21, 19 to 27), customs house (26 to 33, 8 to 11), door (29, 11), three ships, east door (43, 15) | `xaragua.ts:103-194` | Exact |
| Beach 36 x 22, headland (31.5, 4.5), sea-cave door (31, 8) `if: story.escape_night` | `xaragua.ts:275-333` | Exact |
| Mountain 46 x 28, lookout clearing (39, 13), ambush layer `encounter.xaragua_story.pier.won, !story.crown_attack` | `xaragua.ts:405-442` | Exact |
| Customs cellar door `if: story.visit_granted`; `anaco_cell` `if: !story.escaped` | `xaragua.ts:611, 757` | Exact (note: `cellar_marine` and `customs_marine` have no condition: the outline's "gone" needs a `!story.war_begun` on built placements, which it says) |
| Anaco's chain line; "no use to me in chains"; "Remember that, and use it"; Yari's canoe line; Thorne over the side; Gianna's reply; "Conch from the point" | `xaragua.ts:390-391, 792, 1142-1145, 1325` | Exact |
| "Everything is the tide here" (Yari's Chapter 2 hint) | `quests.ts:525` | Exact |
| "Count them" as Anissa's Chapter 1 line | `xaragua.ts:74` | **Yari's, Chapter 2** (3.10) |
| `camp_leader`, `camp_scout` return on `story.war_begun` | built `if: '!story.refuge'` | Needs a second placement (OR is supported: `conditions.ts:62`) |
| `head_runner` at the camp | built in the caney, `if: PEACE` | A new placement (fine) |
| `BattleDef.era`, `battleParty(..., 'echo')` built and tested; no Echo battle started from a map | `battle.ts:357, 1608`; `BattleScene.ts:249` reads `def.era` | Exact; the scene side exists too |
| `leads` lifts a member | `battle.ts:1612` | Exact; it is a standing condition (3.13) |
| `withdraws`, `protects`, `binds`, phases with `enter`, `endsWithBoss` | `battle.ts:269-362` | Exact |
| A phase cannot send foes out | `phaseCheck` | Exact |
| Game Over clears `party.rael` | `gameOver.ts` `recordLoss` | **No such path** (3.8) |
| `XP_PER_OBJECTIVE_BY_CHAPTER = [15, 25, 30, 35, 40, 65, 44, 60]`; 25 at 8,078 ... 29 at 10,338 | `config.ts:94`; `50 (n-1)^1.6` | Exact |
| `LATER_STORY_FLAGS` holds only `story.claim_begun` | `encounters.ts:10` | Exact |
| `STAGE_PARTY` has no `edmund` | `stage.ts:22` | Exact |
| "a volley ... roughly a third of a musketeer's HP" | the built formulas | **0.41 to 0.69** (3.4) |
| Thorne at x3 "about 24 to 28 actions"; Betrayer "28 to 34"; Rael "32 to 38, two Bound" | section 5 | **9 to 11; 14 to 16; 24 to 31, none Bound** at tier 24 (3.3) |
| Xaraguá's seat token is a conch | Se-5 | **A carved paddle** (3.10) |
| The thumbprint doors | built notes, Chapter 9 outline | **Wrong list** (3.7) |
| The signet "dark" at the truth with the halves together | `ardencia.ts:682` | **Contradicts the built token glow** (3.2) |

---

## 5. The sim

**Method.** HEAD's `quest/` copied to the scratchpad. The party: the scripted route's flags at `@chapter8-end`
(Gianna, Anissa, Yari, Azzy, Samira, Bayarmaa, Haru, Vikram; Edmund is not built), lifted to the level with shared XP
(30 percent into it). Gear: **route** (as the route leaves it: nothing equipped, the start gear) and **best** (the
highest-level built weapon, armour and charm each member can wear at that level, via the engine's `canWear` and
`suits`: tier 24 for weapons and armour, 20 for charms). Orders: **roster** (Gianna, Yari, Azzy, Samira; the
companion lifted second where the outline says `leads`) and **glass** (Gianna, Yari, Vikram, Haru, the Chapter 10
review's line). Bot: the built `skillsAction` plus Break Free when Bound. Story difficulty. Falls are Down or Bound
events on any party fighter. The outline's fights as data: Thorne 27 x3 / x1.1 `boss` with a Crown Marine 26 and the
breastplate musketeer 26; `rael_harbor` 28 x6 / x1.2 `atkPerBound` 0.1, Blade 120, La Marca 100 every 3, Rivera 27
`protects`, Jaime 27, phases 66% (the built Unleashed moves, two Brasador Halberdiers 27 walk in), 33% (the built
Cornered), 15% (Cord 90, Stand down 0 area `weakened`), `binds`, `endsWithBoss`; Hrafn 26 brute x5 / x1.2 (Blade 110,
*Warpath* 200 area every 3) with two Steppe Reavers 25 and a Husher 26, a third reaver at 50%, Bayarmaa leading;
Caona's stand (Echo three vs three Crown Marines and a Musketeer at 27); the pier assault and the headland with the
Officer as the built lieutenant's shape and the Sealbearer in the Chapter 9 outline's shape; Hale 28 tank x6 / x1.25
with two Marines and a Sealbearer, *Champion's Duel* at 50% with two more Marines, and Rael in the four approximated as
Azzy's entry plus 5 percent HP and ATK (no Rael `MemberDef` exists). Not modelled: `avoid` (Rael may strike Gianna
here, so the real Strike fight is slightly easier still), volleys (section 3.4 computes them).

**Results** (actions are party actions; "fall" = runs with at least one fall; 30 seeds, 40 for Rael and Hale):

| Fight | Gear | Order | 25 | 26 | 27 | 28 |
|---|---|---|---|---|---|---|
| Thorne (customs house) | best | roster | 10.7 act., 0/30 fall | 10.2, 0 | 10.0, 0 | 9.6, 0 |
| | route | roster | 16.1, 0 | 15.2, 0 | 14.7, 0 | 13.6, 0 |
| | route | glass | 12.2, 1/30 | 11.7, 0 | 11.2, 0 | 10.9, 0 |
| Rael, Strike (x6) | best | roster | 30.9, **0/40** | 29.0, 0 | 27.6, 0 | 26.6, 0 |
| | best | glass | 26.8, 0 | 25.3, 0 | 24.2, 0 | 23.5, 0 |
| | route | roster | 51.1, 6/40 | 47.9, 2 | 44.9, 0 | 42.5, 3 |
| | route | glass | 34.3, 16/40 | 32.3, 8 | 30.0, 7 | 28.1, 7 |
| Rael, Strike, x5 ATK x2.0 | best | roster | 28.6, 0/40 | 27.0, 0 | 25.7, 0 | 24.4, 0 |
| | best | glass | 25.0, 6/40 | 24.1, 5 | 23.1, 4 | 22.1, 2 |
| Hale with Rael (Trust) | best | roster | 21.4, 0/40 | 20.4, 0 | 19.3, 0 | 18.4, 0 |
| | route | roster | 36.4, **20/40** | 32.9, 17 | 30.0, 15 | 27.4, 2 |
| Betrayer (Hrafn) | best | roster | 15.8, 0/30 | 15.3, 0 | 14.8, 0 | 14.0, 0 |
| | route | glass | 18.1, 12/30 | 16.5, 6 | 16.1, 1 | 15.3, 4 |
| Caona's stand (Echo three) | | | 11.9, 1/30 | 11.5, 0 | 11.1, 0 | 11.2, 0 |
| Pier assault | best | roster | 4.9, 0 | 4.8, 0 | 4.8, 0 | 4.7, 0 |
| | route | roster | 11.9, 7/30 | 11.5, 6 | 11.3, 3 | 10.7, 0 |
| Headland | best | roster | 4.7, 0 | 4.5, 0 | 4.4, 0 | 4.5, 0 |

Every fight won every seed in every row (one noadds variant at route 25 hit the 400-action cap once). No fight is
near the outline's "no boss over 40 actions" gate at tier 24; unequipped, the roster four take 42 to 51 actions on
Rael.

---

## 6. Soft-locks and Game Over

Walked on paper against the outline's conditions with the fixes above:

- **The gate (*Until the tide*):** the debate settles on a loss (`debate.ts:149`); the quests have no failable step;
  `followSide` with the save-mid-descent escape. **No lock.**
- **The Turn:** a re-firing trigger until `war.turn_made`. **No lock.**
- **Strike lost:** the goddess, Rise on the pier, `war.strike` kept, Grudge to `GRUDGE_MAX_BOSS`. Every seed wins
  even unequipped, so locking the choice is fair; keep it locked (the choice matters). If 3.3's retune makes Strike
  hard, re-check that the boss Grudge wins every seed with start gear.
- **Trust lost:** **`party.rael` leaks** (3.8) until fixed.
- **Strike won:** **the war's conditions never close** (3.5) until `story.harbor_taken`.
- **Caona's stand lost:** the save is taken in the Echo era; Rise must return to the present at the zone's edge with
  the `echo.` flags wiped and `anchor.chain_post` unset. The engine wipes `echo.` flags only in `swap()`; test that a
  Game Over in an Echo battle does not leave the player in the Echo with stale `echo.` flags (the outline lists the
  test; make it the first one written).
- **The flank lost:** restarts from the captain's placement. Note that his placement must be a map NPC, not a walker,
  so a reload on the sand finds him (the Chapter 10 review's 6, same class).
- **Eight Muster variants x two Turns:** the route test's sixteen forced variants as written.

---

## 7. The 3.5 to 4 day estimate against Nov 10 to 13

The outline's engine and wiring (about 1.5 days) is honestly costed; volleys (0.25), `avoid` (0.1) and the sim (0.25)
are the only non-data pieces. Against the Chapter 10 review's yardstick (about 395 lines, 25 transitions: 3 to 3.5
days), Chapter 11 is about 365 lines and 20 transitions, but adds four flank variants, two Turn routes with two
bosses and two truths, the first Echo battle from a map, a member who must not leak, and sixteen route variants.

The fixes here add about half a day: the Turn's restaging (0.05), the token and signet split (0.02), the volley
retune and re-sim on (0.1), `story.harbor_taken` (0.03), the chain re-siting and the allied hulls (0.1), the ledger
list (0.01), `party.rael`'s guard (0.05), the companies as columns with banners (0.05), Thorne's second phase (0.05),
the retune of the three bosses from tier-24 gear (0.1). Folding the pier assault into the stand saves about 0.1.

**Judgement: 4 days, not 3.5**, and it holds only if the companies, the flank's four variants and the truth's two
routes are each written once from a table (the outline says so for the first and the last; do it for the flank too).
With Chapter 12 and the Hearing from Nov 13 to 16 (the Claim, three verdicts, three endings and the Stability score,
the only chapter-sized piece of new *system* left), Chapter 11 must not take a fifth day. The project is ahead of the
plan's dates (Chapter 8 merged on Oct 22 against a planned Nov 6), which is real slack; the milestone note should say
what the slack is spent on before it is spent here.

---

## 8. Questions for the owner (only what could change the story's flow; one at a time, recommendation first)

**Question 1 (the outline's own): On the Strike route, does Azzy stay in the party, or leave until the Claim?**
*Why it reaches the owner:* a brother who walks off the pier with his father's broken army changes Chapter 12 (his
choice at the Claim is made "on the spot") and the Hearing's witnesses.
1. **(Recommended) He stays, furious.** One line on the pier, silence to his father, in the party to Eightgate; his
   anger weights the Claim's Challenge route on `war.strike` without removing him. *Reason, which I share:* the
   Strike route already costs the fleet and Stability; losing a companion in the war's last fight as well punishes a
   choice the guide offers as legitimate, and Free Brasador (his company, the Chapter 10 fix) would be leaderless at
   the Claim.
2. He leaves with Rael's ships and rejoins at Eightgate's gate.
3. He leaves and is met only at the Claim, where he Challenges.

Nothing else I found changes the story's flow. These I would keep as **Claude's calls** (recorded in the design docs;
if the owner disagrees, each becomes a pop-up with the recommendation first, and the build goes ahead on it):

- **The Turn restaged (3.1):** the Crown lets Ardencia through; Rael comes up the pier with his vanguard and lies in
  public with the signet's glow; Anissa sees it; the choice is *Hold the pier* / *Strike first*. *Reason:* it is the
  guide's own clue at the guide's own moment, and it restores "the player expects a second father-daughter fight".
- **On Strike, Rael is not arrested (3.5):** "To a Throne. Not to a watch." *Reason:* the Hearing's "Rael surrenders
  to Gianna's Throne".
- **The token and the signet kept distinct (3.2).**
- **The volleys as effects or at power 50, cap 3 (3.4).**
- **The pier assault folded into Caona's stand (3.15).**
- **Rael's Quiet Crown founding told privately here and confessed publicly at the Hearing (3.16).** *Reason:* STORY 11
  beat 4 and the guide 5.6 put it here; open question 3's "confession at the Hearing" is the public one.

---

## 9. The fixes, in build order

1. Docs: STORY 11 (the Turn as 3.1, the Strike's end as 3.5, the private/public founding), COMBAT 11 (the volley rule
   as 3.4), 13.3 #3b/#8/#9 (the retune targets of 3.3), SIDE-QUESTS (the ninth door's list as 3.7; the carved paddle),
   CAPITALS 2 (the capstan at the pier's sea end, the allied hulls).
2. The day-1 sim from **tier-24 gear** and the roster order, with Break Free in the bot, volleys **on**; gates: the
   Betrayer and Hale 28 to 34 actions with a fall in one in four at the band's floor; Strike with a Bound in half the
   fights at 27 and a loss in at most one in eight, every seed won at the boss Grudge with start gear; Thorne 18 to
   22; the stand as is.
3. Engine: volleys (as 3.4), `avoid` including area moves (never cut), `party.rael`'s guard (3.8).
4. Flags: `story.harbor_taken` on both routes; every "war over" condition on it.
5. Maps: the capstan at (23, 26), the chain strip on row 27, the *Patience* at (10, 27), Ardencia's ships on row 25
   from the east, the longboat at (23, 27), the allied hulls on the east edge after the chain; the companies as seven
   columns at x 3 to 15, rows 9 to 11, with banners; the crew's exit off the rock.
6. Dialogue: the Turn (3.1), the truth's signet and token (3.2), Haru's nine doors (3.7), the line fixes (3.10),
   Anissa in the flank and Vikram's defiance (3.12), Rael's "To a Throne" (3.5), Thorne's boat to the *Patience*.
7. `leads` for the companion with `story.headland_won` and `any` with the chapter's own (3.13).
8. Levels from Chapter 10's measured end (3.9).
9. Tests: a lost `flagship_hale` leaves no roster Rael; a lost `caona_stand` returns to the present with `echo.` flags
   wiped; no `fx: 'signet'` in the truth; the scoped content test (3.10); every "war over" condition true on both
   routes at the card.
