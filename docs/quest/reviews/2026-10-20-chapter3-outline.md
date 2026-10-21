# Chapter 3, The Trial of Blades (Cenizal, Ardencia): build outline (Oct 20)

*Design outline only, for the second review and the owner's two decisions before anything is built. No code has
changed. Written under the Oct 20 rules: only decisions that drastically change the story's flow go to the owner;
the rest are Claude's calls, recorded in section 11. Sources: `docs/quest/PLAN-ALL-CHAPTERS.md` (what every chapter gets), `design/STORY.md` Chapter 3 and the
owner direction of Oct 19 (Rael wins; he carries a legendary item; Azzy makes the distraction), `CAPITALS.md` 4,
`SIDE-QUESTS.md` Ar-1 to Ar-5, `PUZZLES.md` SIG-ARD, `COMBAT.md` (Bound, Rael's phases, Yield), `SECRET-ITEMS.md` 5,
`QUEST-BUILD-GUIDE.md` 5.3, 5.6, 5.8, the Game Over outline and its review, and the built game in `quest/src`
(Chapter 2's end in `data/dialogue/zetwal.ts`, `data/quests.ts`, `data/battles.ts`, `engine/battle.ts`,
`data/starts/chapters.json`, `data/voyages.ts`). Levels below were computed from `chapters.json` with the game's
own `level()`.*

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17); no jokes in the
Rael or Anissa scenes; recommendations only where they are just and genuinely help; placeholders wherever art has
not arrived; the whole quest ships Nov 22, so this chapter gets the main story, the boss, the chapter's fights, the
Echo puzzle, the debate as a required quest, **two** required side quests, mystery quests and arrows, and Game Over
where it applies. The other side quests and the secret item follow after the release.

---

## 1. Where the chapter starts (measured)

- **Chapter 2 ends** on Pòdlimyè's long pier (`zetwal-harbor`, spawn `harbor_return`), after `zetwal_return`: the
  grandparents meet the trader, Patricio asks Gianna to go to Ardencia ("Go to Ardencia. Ask him to stand with
  Xaraguá, as his grandfather did. Take Yari. Take your papers." / "Then ask him why his grandfather said yes.") and
  sets `story.ardencia_asked` and `act2.complete`. The card *Chapter 2 complete* plays. `?chapter=3` starts here.
- **The party on the route** (`chapters.json`, chapter 3): Gianna, Yari and Anissa, all **level 8** (1,315 XP;
  level 9 needs 1,393), 402 gold, Patricio and Caona in the Echo party at level 8. When Chapter 2's five side
  quests land this week (being built now), the start moves to about **level 9**. Chapter 3's target is 8 to 11.
- **The XP curve in the game** is `xpBase 50, exponent 1.6` (`config.ts`), not COMBAT.md's 40 / 1.8: level 10 at
  1,682, 11 at 1,991, 12 at 2,318. Rewards below are sized to this curve.
- **One line to fix.** Patricio's waiting line says "Ardencia is east, past the Cane Road", but the realm map
  (`data/realmMap.ts`, traced from the board) puts Ardencia **west and north of Pòdlimyè**, sharing a land
  border, and both built voyages sail "north, around the cliffs of Ardencia". Overland travel on the realm map is
  not built (the plan lists it for later chapters); the voyage system is. So the chapter opens with a **voyage**
  from the Old Harbor to Ardencia's sea road, and that one line becomes "Ardencia is across the strait. The trader
  that brought you home sails again at noon." (A builder's fix, reported here so nobody is surprised.)

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 outline. Flags are proposals in the built naming style.

### Beat 0: The pier at Pòdlimyè (zetwal-harbor)

- The party stands on the pier where the card closed. Patricio and Anicette stand with them (already on the map
  after the return scene). The **trader captain** (new NPC, placeholder look `ferryman`) waits at his gangway.
- The city is open: shops, the smith, the charm stand (the player can spend Chapter 2's gold on gear before the
  hardest chapter so far). Nothing is required here; Chapter 2's quests live in Xaraguá.
- Talk to the captain: "Sail for Ardencia?" (the usual ready check). On yes, staged: Anicette walks up and presses
  kasav into Anissa's hands (one line), Patricio: "Ask him why his grandfather said yes." The party boards (Yari and
  Anissa walk up the gangway), and the voyage **`zetwal_ardencia`** plays (new `VoyageDef`, by day: out past the
  reefs, north, "the black cliffs of Ardencia", a landing on a strand of black sand under the highlands; music:
  the farewell track until Ardencia has its own). Lands at `ardencia-flats`, spawn `landing`.
- Journal: **Sail for Ardencia** (done `story.ardencia_arrived`, set on landing).

### Beat 1: The sea road up the Cinder Flats (ardencia-flats, wild)

- Black lava fields, hot springs steaming, the road climbing to a red-stone gate. The Cinder Flats' table switches
  on (`story.ardencia_arrived`): one or two ambushes on the way up, at levels 8 to 10 (section 5).
- **Unrest shown, not told** (owner shape, Oct 15: every capital from Chapter 3 on): a family with a handcart going
  *down* to the strand (a mother, a boy, placeholder `villager` looks): "The Crown took Yucayeque and the Lord said
  nothing. We are going to my sister's in Al-Doria before the ships come here." A courier rider passes at a run.
- **The gate of Cenizal:** two Brasador halberdiers bar the road. The envoy's papers (the built key item) are
  read; "No outsider speaks to the Lord. The Law of the Blade." One guard walks off up the street and comes back
  with **Azzy** (acted out: he walks down the whole street, stops in front of Gianna, reads the papers, looks at
  Anissa, then at Gianna). "Zetwal's envoy. My father expected you a week ago. I am to walk you up." He is assigned
  as the escort (`story.azzy_met`). He does not joke; he is formal and curious. The gate opens.
- Journal: **The gate of Cenizal** (done `story.azzy_met`).

### Beat 2: The Upper Town and the Alcázar (ardencia-town, ardencia-alcazar)

- Azzy leads them up the red-stone streets to the plaza (staged: he walks ahead and stops at the Alcázar steps;
  the party follows at its own pace; the duel court is the ring of sand beside the Alcázar, under a wooden
  gallery). The shops, the contract board, the Old Library door and the gate down to the Lower Town are all here.
- Inside the Alcázar, the long hall of audience: the **chamberlain** meets them below the empty seat. The Lord will
  see the envoy "when she has proven herself. Tomorrow at noon, in the court." While he speaks, **Envoy Cresswell**
  of the Crown crosses the hall from the elders' door to the Lord's door (shown: he walks the length of the hall,
  slows at Anissa, goes in). Azzy: "The Crown's envoy. He has been here a month." (`story.trial_set`).
- Azzy, on the steps outside: "Until noon you are my guest. See the city. I would not have you fight my father
  without having eaten in his town." He stays at the **court gate** from here on (the chapter's "are you ready"
  NPC), and walks off to it (shown).
- Journal: **An audience with the Lord** (done `story.trial_set`), then **Until noon** (section 6, the gate).

### Beat 3: The day in the city (the required quests, any order; the arrow follows the ground)

- **The Treasurer's Daughter (Ar-2, required):** at the elders' hall gate inside the Alcázar; the records room; the
  Echo of Benny's office; the hidden copy; the fresh note. Section 7.1.
- **The debate, required:** in the Lower Town, by the soup line: *Is a thief who feeds the hungry a thief?* (Rael
  clue 7). Section 7.3.
- **Bread at Night (Ar-1, required):** Azzy's own question, by night, through the Lower Town to the soup line and
  the grey thumbprint. Section 7.2. It is the last of the three by nature (the night before the trial), so the
  Journal lists it last and the arrow turns to it when the other two are done.
- The Old Library (nine books, +1 Influence each; five read teach *Ember Ward*) and the three vendors are open all
  day. Nothing in the library is required; Mediate in the debate needs Influence 5 in Ardencia, which two quests
  and three books reach.

### Beat 4: The Trial of Blades (ardencia-town, the duel court; the fight `rael_trial`)

- At the court gate Azzy checks what is left (the refusal in person, section 6). When all is done: "Noon." Staged:
  Azzy walks into the ring and takes his place at its edge; the party walks to the centre; the **three elders** are
  seated under the gallery (placed); **Cresswell** stands in the gallery above; the **captain of the guard** by the
  Alcázar door. **Rael walks in** from the Alcázar door, slowly, hands behind his back, across the sand, and stops
  two tiles from Gianna. Anissa steps behind Gianna (the follower is directed there).
- Rael: "Zetwal's envoy. Patricio's granddaughter." / "The law is older than I am. No outsider is heard here until
  she has stood in this ring. Stand, then." Gianna: "I came to ask you to stand with Xaraguá." Rael: "Ask me after."
  Cresswell, from the gallery, to no one: "The younger one. She lit a city, I am told." Rael, without looking up:
  "Children light candles, envoy." (His signet does not glow: that is not a lie in his mouth.)
- The fight. **Rael wins, whatever the player does.** Section 4 has the whole design: Bound instead of Down, the
  three phases, the HP floor held by the legendary item he wears, the scripted end, what the screen shows, and why
  no Game Over, no count and no Grudge ever appear here.
- Journal: **The Trial of Blades** (done `story.trial_fought`, set by the scene after).

### Beat 5: The loser's question (the reveal; `rael_after`, then the hall)

Proposal, and **owner decision 1** (section 11): the guide's "the loser answers one question" was Gianna's way to
make Rael talk. Now she is the loser, so the law runs the other way, and the reveal comes from **his question, her
answer, and the token**, shown.

- On the sand: the party on their knees, cords on their wrists (placed sprites with a cord object until a kneeling
  frame exists); Anissa untouched, crouched by Gianna. Rael has not raised his voice once. The elders rise to
  leave; Rael: "The question is asked between the blades. Clear the court." Cresswell goes last and slowest (shown:
  he walks down the gallery stair and out through the Alcázar door; a guard shuts it). Azzy stays at the edge of
  the ring; Rael does not send him away.
- Rael: "The law gives the winner one question, and the loser answers it. Mine: who gave you that locket?"
  Gianna: "My grandmother. My grandfather made it, the year of the Accord." Rael: "He made two." He takes the Sun
  Locket from her neck, holds it against the iron signet on his left hand, and **both halves glow** (a dialogue
  effect `fx: 'token'` on the two sprites, like the built `shake`; Anissa, who sees light: "It's the same light,
  Gigi. His ring and your locket. They're one thing."). Rael: "One half for Patricio's daughter. One half for the
  man she married. Look at me, Gianna Elise." Gianna: "...No." Rael: "Elodie Limyè is my wife. You and your sister
  are my daughters. Azriel is your brother." Azzy, at the edge, does not move (one line: "Father.").
- Gianna: "Why did she never say?" Rael: "Because of men like the one I just sent out of this court." He puts the
  Locket back in her hand, not around her neck. "It changes nothing. You lost."
- **The envoy re-enters** (shown: the door opens, Cresswell walks back to the gallery stair). Rael, to the court:
  "Ardencia stands with the Crown. The envoy of Zetwal broke no law and will be treated as a guest, under guard,
  until His Majesty's ship takes her and her companions to Eightgate." **The signet glows** (the lie; the player
  sees it; Gianna is looking at the floor). Cresswell: "And the younger one?" Rael: "Goes with her sister. Ardencia
  does not separate children." (No glow.)
- "Captain. The forge fortress. Bind nothing; they are guests." The captain and two halberdiers walk the party out
  (staged: the three walk them off the sand and through the lower arch; the map changes to the forge fortress).
  Azzy watches his father give the order and **walks out after them** (shown).
- Gianna believes it from here: her father sold Xaraguá and sold them (`clue.father_rael`, `belief.rael_traitor`),
  and the game keeps her there until Chapter 11 (guide 5.6: she cannot learn otherwise until near the end).
- Journal note: *The loser's question* (what he said, and that Mother's name hides a Rodriguez). Second note, for
  the player only: the Journal never records the glow (Gianna did not see it).

### Beat 6: The Lord's guests (ardencia-forge, the present, night)

- The armory hall of the forge fortress: the party inside a barred gate on the east side; two guards at the gate
  (the captain leaves); across the hall, **three lava channels** crossing the floor from the forge to the furnace
  mouths, lit red; beyond them the far wall, blank. The air shimmers over the whole hall (an Echo Zone: Benny's
  armory fifty years ago). Weapons were not taken ("a mage without her sister is no danger to Brasador": Rael's
  order was "bind nothing").
- Journal: **The Lord's guests** (done `story.forge_held`), then **The fire has to go somewhere** and **Benny's way
  out** (the puzzle, section 8).

### Beat 7: Azzy's distraction (the escape begins)

Owner direction: Azzy makes a distraction so the party can escape. Proposal, all acted out:

1. **The wine.** Azzy walks into the hall with a jug (shown: through the yard door, up to the gate). To the guards:
   "My father's men drink what my father's son pours. The gatehouse; it's warmer." The two guards walk off with him
   through the yard door (shown). As he passes the gate he sets the jug down, and the **gate key** stays on the bar
   ("I am a clumsy host"). Gianna takes it: the gate opens. Anissa: "He left it on purpose, Gigi." Gianna says
   nothing (she has not decided what Azzy is).
2. **The channels.** The hall is open but the lava blocks the way to the far wall. The Echo puzzle, parts 1 and 2
   (section 8): set the gates in the memory so the fire runs along the walls, and pull Benny's lever behind the
   bellows so the blank wall opens.
3. **The bell.** As the wall grinds open, the **alarm bell** rings across the fortress and the screen shakes (the
   guards have sobered up): shouting from the yard. Azzy runs back in through the yard door, alone (shown: a run
   to the open wall): "They are ringing it for me now. The tunnel comes out on the sea road. Go." Gianna: "Come
   with us." Azzy looks at the yard door, then at her. "Behind you." **Azzy joins** here (`party.azzy`), at the
   tunnel mouth, before the first shot, so his choice is made in the dark where nobody is watching, and the escape
   is fought with him.
4. The party goes into the tunnel; the wall closes behind them (the lever's second pull, from inside: a one-way
   door, so nobody follows).

### Beat 8: Benny's tunnel and the run (ardencia-tunnel, present; then the sea road)

- A black lava tube with Benny's old lamp hooks. One fight, **the bats** (`tunnel_bats`: Cave Bat x3, level 10):
  Azzy's first fight, in the front row, shielding the mages and archer; Anissa's tip teaches *La Marca* and the
  rows. A bat object at the tunnel's narrow point is the way back in after a Game Over (talk to it: it screeches
  and the fight starts again).
- **The tunnel mouth, dawn, the sea road** below the walls. Shots: musket flashes on the wall above (sound, three
  dust puffs beside the party, no numbers; the design's "a hit costs HP on Normal" is left out: this is a story
  moment, not a test, and it would make the first run after the trial feel like a second loss). Yari: "Those were
  the walls' best shots. All wide." Azzy looks up at the wall: **Rael is on it** (placed, small, at the parapet) and
  gives the order with one hand, seeing his son below. Azzy: "He saw me." A beat. "He gave it anyway." That is the
  moment the guide calls "Azzy sees his father give the order and chooses Gianna"; he already chose in the dark, and
  this is where it costs him.
- The run: the party walks the sea road under the wall while the shots keep landing wide (a timed staged sequence
  over about 20 tiles; walking is the only input; not failable on any difficulty).
- **Azzy's company.** At the bend a patrol of four halberdiers bars the road (placed, facing up the road). Azzy
  walks ahead of the party to them. The sergeant lowers his halberd; the others follow (shown: the four turn, fall
  in behind him). "Not against you, captain." They walk on together to the camp.
- Journal: **The sea road** (done `story.ardencia_escaped`). From here the Cinder Flats' patrols hunt the party
  (section 5), and Cenizal's gate is shut to them (Ar-4 later is a sneak).

### Beat 9: Free Brasador (ardencia-camp)

- A fishers' camp on the strand, a fire, the trader's boat at anchor (the same Zetwal trader, waiting: Patricio told
  the captain to wait a week). The soldiers who followed Azzy, now **Free Brasador**: three of them around the fire.
  One, to Gianna, not to Azzy: "Every shot wide, envoy. Those were the best shots in Ardencia." Azzy, from across the
  fire: "Then they missed." (Ar-5's clue, folded in here as one exchange; the full quest comes after the release.)
- Gianna, to Yari: "My father sold Xaraguá to the Crown. Then he sold us." Yari says nothing and sits by her.
  Anissa: "He gave the locket back, Gigi." Gianna: "He gave it back because it is worth nothing to him." (She is
  wrong; the player may know it.)
- Azzy: "You are a Rodriguez. There are two of us with a claim to that seat now, and I did not want it when it was
  one." (The dual claim opens: a Journal note.)
- **Where next.** Azzy takes out the copy of *Benny's Refusal* the treasurer's daughter gave them (Ar-2's reward
  includes it): his grandfather's public refusal to sign a seventh page names "the bankers of Al-Doria, who
  witnessed and hold the signed copy". Azzy: "Bab al-Dhahab. If there is a copy with seven pages, it is in the
  Dorini vault." Yari: "Then that is where my father's harbor is written down." The chapter ends on the boat
  (staged: they board; the sails fill). **Benny joins the Echo party** from here (`story.benny_joined`, the design's
  rule: once Azzy has joined).
- Card: *Chapter 3 complete, The Trial of Blades. Next: Chapter 4, The Ledger.* `act3.complete`. `?chapter=4`
  starts here, on the strand, with Azzy in the party.
- Journal: **Free Brasador** (done `act3.complete`).

### The Echo callback (guide 5.6, beat 9)

The guide's callback (young Benny recognizes the Locket; old Benny says the same in the keep) needs old Benny,
whose rooms are Ar-4's (after the release). What survives for the release is one line in the tunnel Echo, which the
player reaches only **after** the reveal: when young Benny gives Patricio the lever he says, "Your sun and my iron.
If a child of mine ever shows you the iron, Patricio, trust the child and not the hand." It could not have been said
before, and it pays off at the Harbor Turn. Old Benny's door in the Alcázar is locked with a guard: "The old lord
sees no one." (Ar-4's hook, left standing.)

---

## 3. The maps

All new, drawn in code the way Yucayeque was (`tools/maps/<city>.ts` through `painter.ts`, then
`npm run maps:build`), registered in `data/maps.ts` and `CITIES` (`data/rpg.ts`). Red stone, black lava, iron;
nothing that looks like Pòdlimyè or Yucayeque (Spanish-inspired: arcades, a plaza with a dry fountain, tiled roofs,
the duel court's sand ring). Accent red `#b03a2e`.

| Map | Size (tiles) | Section | Echo era | What is on it |
|---|---|---|---|---|
| `ardencia-flats` | 46 x 28 | The Cinder Flats and the sea road (wild) | none | The black-sand landing (spawn), the road up to the gate, hot springs, the family with the cart, the ambush layer (`cinder_flats`), the gate with its two halberdiers; the tunnel mouth and the patrol bend on its west side (reached only from the tunnel). |
| `ardencia-town` | 42 x 30 | The Upper Town and the duel court (hub) | none | Red-stone streets climbing to the plaza; the Alcázar at its head (door); the duel court beside it (the ring, the gallery, the court gate where Azzy waits); the smith, the ring-maker, the tavern; the contract board; the Old Library door; the gate down to the Lower Town; the lower arch to the forge fortress (opens only in the staged walk). |
| `ardencia-alcazar` | 40 x 30 | The Alcázar (the seat of government) | the records room only: Benny's office, the night before the march | The long hall of audience to Rael's seat; the elders' hall (three elders, the treasurer's daughter at its gate); the records room with its tapestry and an Echo zone; the messengers' stair; Benny's quiet rooms (locked, a guard); the chamberlain, couriers, a Witness oath-knight and a Gaze skeptic talking in the hall (their debate corner comes after the release). The four Alcázar books. |
| `ardencia-lower` | 34 x 24 | The Lower Town | none | The poor quarter; the soup line and its cook; the barrels with the thumbprint; the debate corner (the baker's widow and the oath-knight); the lane the cart comes down; a night variant by flag (`story.cart_night`), the way Yucayeque's occupation is a flag. |
| `ardencia-library` | 22 x 14 | La Biblioteca Vieja | none | Nine books on the Ash Wars shelves; a librarian. |
| `ardencia-forge` | 36 x 26 | The forge fortress (the armory hall) | the whole hall: Benny's armory the night before the march | The barred gate (east), the yard door, the three channels and their gates (anchors), the bellows and the lever (anchor), the blank wall that opens; in the Echo: dry ditches, the forge-master, young Benny, carts being loaded. |
| `ardencia-tunnel` | 30 x 12 | Benny's tunnel | none | The lava tube, the bats' narrow point, the mouth onto the sea road. |
| `ardencia-camp` | 24 x 16 | The Free Brasador camp (the strand) | none | The fire, the soldiers, the trader's boat, Chapter 4's departure. |

Seven maps (the design's seven, with the tunnel split from the forge so its Echo layer stays small). The Echo
validator's rule holds: every zone tile walkable in both eras; only the four anchors carry changes back.

---

## 4. The Trial of Blades: a fight the player is meant to lose

### 4.1 What the engine has and what it lacks

- **Built:** `meantToLose: { scene }` on a battle entry (`engine/battle.ts`, `engine/gameOver.ts`): falling shows no
  goddess, adds no count, gives no Grudge; the scene plays after a loss **or a win**; no won flag is ever set; tests
  in `tests/gameOver.test.ts`, with a test-only fight (`SCRIPTED_LOSS`) and the check that Chapters 1 and 2 have
  none. `battleOver(false, scene)` in `engine/game.ts` already plays the scene on the field.
- **Not built:** the Bound status (no `bound` anywhere in `engine/battle.ts`), boss phases, enemies joining a fight
  in progress, an HP floor, a scripted end, a round cap. These are the chapter's engine work (section 9).

### 4.2 The design

| | |
|---|---|
| **Rael** | Level **13**: three above a party of 10 at noon on day two ("hard", orange), as COMBAT.md wanted him three above. Tank line x9 HP / x1.2 ATK (`BOSS_SCALE`). Moves: *Sword* (power 110), *La Marca* (Marked, 3 turns), *Grito de Guerra* (one fighter Stunned, phase 2 on), *Reinado de Cenizas* (heavy, power 150 + 40 per Bound fighter, phase 3, once), passive *Sangre Ardiente* (+10% ATK per Bound fighter). Never a Yield. Never a Parley. Weak to nothing. He does not target Anissa (she cannot be hit anyway). |
| **The guards** | Phase 2 brings two **Brasador Halberdiers** (level 11, tank role, *Hook*: Stunned 25%) in from the ring's edge. |
| **Bound** | In this fight (`binds: true` on the battle entry) a fighter at 0 HP is **Bound**, not Down: still on the bar, their turn offers only **Break Free** (50% the first time, sure the second), and any heal on them frees them (Limyè Elodie "loosens the cords"; Comfort is not built, and this keeps the rule to one line). Bound fighters cannot be hit again. The screen shows cords and BOUND over the sprite instead of the fallen frame. |
| **Phase 1, Measured** (100 to 66%) | Single hits and Marks, at the front row first (Azzy is not there yet: Yari takes them). His tells are about Anissa: "He is looking at Anissa, not at you." The sisters' test, with Shield Anissa gone: the first **Surge** Gianna fires ends phase 1 early ("Good."): the player who uses her sister's light is the one he was waiting for. (A scripted phase change on an event, cheap.) |
| **Phase 2, Unleashed** (66 to 33%) | *Grito de Guerra* every other turn; the two guards walk in (a reinforcement event the battle screen plays as an entrance). The telegraphed moves and Guard carry the party through, as the design says. |
| **Phase 3, Cornered** (33% to the floor) | *Reinado de Cenizas* once, telegraphed a turn early ("Guard, everyone!"), then his sword with Sangre Ardiente growing as fighters are Bound. |
| **The floor** | **Rael cannot drop below 1 HP.** The blow that would take him to 0 stops at 1, and once per battle the legendary item on his wrist is named on screen: *La Promesa de Benny glows. Rael stands.* (the board game's *Last Stand*, card 65: survive one knockout at 1 HP; `SECRET-ITEMS.md` 5). That is the fair-play answer to "what if the party brings him to 0": the player sees exactly why he cannot be beaten today, and sees the item they will want. See owner decision 2. |
| **The scripted end** | The fight ends at the **first** of: (a) every fighter Bound (the natural loss); (b) **the floor**: the party has "won" in numbers, and Rael ends it himself; (c) a backup **round cap** (`RAEL_TRIAL_MAX_ROUNDS` in `config.ts`, about 14 of Rael's own turns, in case a player stalls with Guard and heals). In (b) and (c) the finale plays inside the battle: Rael's line in the tell box ("Enough."), then one unavoidable scripted move, *Cenizas*, that Binds every fighter still standing with no damage numbers. Then, in all three cases, the same picture: every fighter Bound on the sand. |
| **What the screen shows** | Anissa's line is not the Game Over cry; it is quiet: "Gigi..." (she goes to her sister: the follower sprite walks to Gianna's position on the field after the fade). No deep blue, no GAME OVER letters, no goddess, no count, no Rise: the battle fades straight to the court, and `rael_after` plays. On Story difficulty the numbers are softer but the end is the same. |
| **What the party keeps** | Nothing from the battle (no XP, no gold, no won flag): the scene after pays the objective's 25 XP. Items drunk in the fight **are spent** (the builder calls `settleBattle` on the scripted end; today it only runs on a win, which would make the trial a free fight). Grudge: none, ever. |
| **No way back in** | The trial happens once (`story.trial_fought`); the content test that every story fight has a way back in already skips meant-to-lose fights. |
| **Tests** | The simulator plays the fight with a party that cannot lose (it reaches the floor) and with one that cannot win (all Bound) and both land in `rael_after`; a run that stalls hits the cap; `encounter.ardencia_story.rael.won` can never be set; Bound fighters are never targeted; Break Free's odds; the phase change on the first Surge; the two guards enter once; the floor holds exactly once and names the item. |

### 4.3 Which legendary item Rael carries, and what it means later

Recommendation: **La Promesa de Benny**, Ardencia's own (charm, gear level 12, +4 DEF, *Last Stand*; worn by Azzy it
also makes Rael's War Cry fail). Reasons: it is the Ardencia item and no other legendary item has a reason to be on
his wrist; *Last Stand* is literally the rule the review asked for (the boss cannot be dropped below 1 HP), so the
item does the job rather than a hidden number; and it is Benny's private promise worn by the son who "kept the goal
instead of the oath", which is the chapter's whole argument in one object.

What it changes:
- **Ar-4 The Old Lord's Errand** (after the release) can no longer hand out La Promesa from the crypt. Its errand
  becomes the written promise itself (a key item, old Benny's letter), and the charm reaches the party from Rael:
  in Chapter 11 on the Trust route he takes it off and gives it to Azzy before the Regent's champion ("Your
  grandfather's. It was never mine to keep."); on the Strike route it is what he throws down when his army breaks;
  on both, the party has it for the Claim. Nothing built is affected; `SECRET-ITEMS.md` 5 and `SIDE-QUESTS.md` Ar-4
  change when the owner decides.
- In the engine, enemies wear no gear, so the floor is a boss property (`floor: { hp: 1, named: 'La Promesa de
  Benny' }`), not an item; the item itself is built when it reaches the party.

---

## 5. The chapter's fights and levels

| Fight | Where | Foes | Level | Party then | Band | Pays (engine rule: 10 XP and 4 gold per foe per level) |
|---|---|---|---|---|---|---|
| Ambushes, arriving (`cinder_flats`) | the sea road up | Cinder Salamander x2; Cave Bat x3; Road Bandit + Brasador Halberdier; Quiet Crown Zealot x2 ("Where is the little one?") | 8 to 10 | 8 to 9 | even | 160 to 300 each; one or two on the way up |
| **The Trial of Blades** (`rael_trial`, meant to be lost) | the duel court | Rael, then two Halberdiers | 13 (guards 11) | 10 | hard | nothing (section 4) |
| **The bats** (`tunnel_bats`) | Benny's tunnel | Cave Bat x3 | 10 | 10 | even | 120 XP, 40 gold (a scripted entry, so it teaches Azzy's row) |
| Ambushes, after the escape (`cinder_flats`, `story.ardencia_escaped`) | the strand and the flats | Halberdier patrols x2 who "capture, not kill" (their Hook Stuns; no Bound: that is Rael's rule only) | 11 to 12 | 11 | even to hard | optional; the route does not fight them |

CAPITALS.md wrote the Cinder Flats at levels 11 to 14 when Ardencia was Chapter 4; they come down to 8 to 11 here
(and 11 to 12 after the escape), as the plan's Oct 15 order requires. New enemy types: Cinder Salamander (caster,
*Ember Spit*: Burning), Brasador Halberdier (tank, *Hook*), Cave Bat (swarm, *Screech*: Fogged), all with drawn
placeholders in `ENEMY_ART` like the marines; Road Bandit and the Zealot exist from Chapter 2.

**Levels through the chapter** (from level 8 on the route; add one level if Chapter 2's quests are done):

| Point | XP from | Running total | Level |
|---|---|---|---|
| Start | | 1,315 | 8 |
| The gate (one ambush, two objectives) | 180 + 50 | 1,545 | 9 |
| Noon (Ar-2 90, debate 15 to 25, Ar-1 100, three books 30, two objectives 50) | ~300 | ~1,845 | 10 |
| After the trial and the hall (two objectives) | 50 | ~1,895 | 10 |
| After the puzzle and the tunnel (two objectives, the bats 120) | 170 | ~2,065 | **11** |
| The camp (two objectives) | 50 | ~2,115 | 11 |
| With the whole library and a second ambush | +60, +180 | ~2,355 | 12 |

So the party meets Rael at 10 (he is 13: hard, by design), leaves at **11**, and a player who reads everything and
fights every ambush leaves at 12 with Chapter 4's Qasim at 14 still a step above. Side quest XP is below the
design's band on purpose (the game's curve is flatter than the design's).

**Gold:** 150 (Ar-1) + 100 (Ar-2) + ambushes 70 to 130 each; the smith's blackened armour (DEF, level 12) and the
long sword for Azzy are the things to save for. Azzy arrives with his own blade and a Brasador coat at his level.

---

## 6. The required-before gate: "Until noon"

- **In the story:** the chamberlain names noon tomorrow; Azzy says "see the city". The gate is the day itself.
- **In the Journal:** the objective **Until noon**, done through the side quests (`followSide`, like Chapter 1's
  *Unfinished business* and Chapter 2's *Until the elders sit*), so the gold arrow leads to the next quest's stop.
  Done when Ar-2, the debate (joined or mediated) and Ar-1 are done, **or** when `story.trial_fought` is already set
  (a save made mid-trial never sticks).
- **On the map:** the court gate's trigger waits for the three (`if: 'side.treasurer.done, side.bread.done,
  debate.ardencia_bread.joined|debate.ardencia_bread.mediated'`); until then Azzy, in person: "Noon is hours off.
  The treasurer's daughter is still at the hall gate; the Lower Town is still arguing about bread; and you have not
  seen my father's poor by night." (worded from the flags, as Yari's check is). Anissa: "Your Quests page, Gigi."
- **Order the arrow follows:** Ar-2 (the Alcázar, where the party already stands), the debate (the Lower Town, by
  day), Ar-1 (the Lower Town, by night: it ends the day). Then the court.
- **No soft-locks:** everything is inside the walls before the trial; the night variant of the Lower Town is a flag
  that clears when Ar-1 ends; the two Echoes need only the Locket; the library is optional.

---

## 7. The two required side quests and the debate

Why these two, from Ar-1 to Ar-5: **Ar-1** is the hub's rebel safehouse (one per capital, guide 5.4), the clue the
player walks through rather than reads, and Azzy's own question, which is how he and Gianna come to trust each
other before the trial. **Ar-2** is the chapter's minor Echo puzzle, plants the only **real** harm on Rael's record
(the captive treasurer, whose family testifies at the Hearing: without it the Hearing has no witness), and hands the
party *Benny's Refusal*, the lead to Al-Doria. Neither adds a fight to a chapter that already has its hard one.
**Ar-3** (the banquet, a fight or a second debate) is the most expensive to stage and says what the books and the
debate already say; **Ar-4** is the secret item (after the release by the plan, and changed by decision 2); **Ar-5**
is folded into the camp scene as one exchange, its quest form after the release.

### 7.1 The Treasurer's Daughter (Ar-2; puzzle M-ARD-1)

- **Opens:** on entering the Alcázar (`story.trial_set`). Shows as *??? The Alcázar*. Giver: the treasurer's
  daughter at the elders' hall gate (placeholder look `petitioner`, young; named by role until the owner names her).
- **Steps:** 1) Her father, the city treasurer, "retired" eleven years ago and never came home; his last ledger
  should be in the records room. 2) The shelf is empty (the Alcázar book *The Treasurer's Last Report*, unsigned,
  is beside it). The air shimmers over the room. 3) **Echo:** Benny's office, the night before his march to the sea;
  his clerk packs papers by lamplight and tells Patricio where every treasurer since Don Alonso has hidden his
  working copies: the niche behind the tapestry on the east wall ("it exists in both eras, so no anchor"). 4) Back
  in the present, the tapestry: the hidden copy, and inside it a fresh note in the treasurer's own hand, dated
  this year: *I am alive. I am held where the ash falls. Tell her I am alive.* (`clue.treasurer_alive`). Gianna
  cannot find where. 5) Tell the daughter (staged: she sits down on the hall step; one line). She gives Gianna the
  copy of *Benny's Refusal* her father kept with the ledger ("he said it was the only honest page in the building").
- **Anissa's hints:** "Clerks always keep a second copy. Always." / "Benny's clerk, in the memory, knows where." /
  "Behind the tapestry on the east wall."
- **Reward:** 100 gold, 90 XP, +1 Influence (Ardencia), the key item *Benny's Refusal* (a copy).
- **Echo party here:** Patricio and Caona (Yari is present). Young Benny is an NPC in the doorway, giving orders for
  the march; he does not join yet.

### 7.2 Bread at Night (Ar-1; the rebel safehouse)

- **Opens:** after Ar-2 and the debate are done, or at dusk if the player simply talks to Azzy at the court gate
  about the Lower Town ("My father's poor are not starving. I do not know why. Come tonight and see."). Shows as
  *??? The court gate*.
- **Steps:** 1) By day, the soup line in the Lower Town: the cook ("Coma, coma.") will not say who pays; the grey
  **thumbprint** on the barrels (the Journal's ash thumbprint, from Chapter 2's oil quest). 2) Meet Azzy at the
  lower gate at dusk: the Lower Town takes its night variant (`story.cart_night`: lamps, shutters, the lane). A
  covered cart comes down the lane with a driver and two hired guards (staged walkers on a fixed path); the party
  follows it (walking is the input; Azzy's lines keep them back: "Not closer." If the player walks into the guards
  they turn: "Move along, friend." and the cart goes on: no fail, no fight; the design's stealth-and-fight needs a
  sight system that does not exist, and the point here is what they see, not whether they are caught). 3) At the
  soup line the sacks come off (shown), the driver presses his thumb to the barrel, and the cart leaves. 4) Azzy:
  "This is not the elders' charity. The elders do not know this lane exists." Dawn (the flag clears).
- **Reward:** 150 gold, 100 XP, +1 Influence (Ardencia), Journal: *The ash thumbprint, again* (Yucayeque's oil,
  Cenizal's bread: the same mark).
- **Why Azzy gives it:** by the time he stands in the ring he has shown Gianna the one thing in his father's city he
  does not understand. The player has seen Azzy doubt before the trial, so his choice in the forge is earned.

### 7.3 The debate, required: *Is a thief who feeds the hungry a thief?*

- **Where:** the Lower Town, by the soup line, by day. A **baker's widow** (Gaze) against a **Witness oath-knight**
  (the Witness faith among soldiers, `CAPITALS.md`: oaths and what breaking one costs). Shows as *??? The Lower
  Town*. Opens with the city (`story.trial_set`).
- **Rounds (draft):** 1) "A thief is a thief. The oath against stealing has no clause for soup." (Scripture: the
  Gaze remembers who was fed and who took, and judges both; Reason, with *Oaths of the Ash Road* read: the Witness
  oath binds the swearer, not the hungry; Compassion: ask the child in the line.) 2) "If the lord's gold feeds them,
  the lord is the thief." 3) "Then what do you owe a lord who feeds you with stolen bread?" (the Upper Town's
  question, borrowed, since that corner waits). Strong, fair and weak answers as the built debates have them;
  **Reason** needs one Old Library book (*Oaths of the Ash Road*, *The Iron Trade* or *What the Kitchen Maids Say*),
  and Anissa's nudge says so.
- **Mediate** needs Influence 5 in Ardencia (Ar-2 +1, Ar-1 +1, three books +3: reachable on purpose).
- **Reward:** the debate's own (15 or 25 XP, +1 Influence, Concord), as in Chapters 1 and 2.
- The Upper Town corner (*What do you owe a lord who has broken his oath?*, which rewrites itself after the duel)
  comes after the release; its two speakers stand in the Alcázar hall with passing lines so the city is not empty.

### Anissa's nudges (mystery quests, under 128 characters)

- Ar-2: "The young woman at the hall gate has been standing there a long time, Gigi. Ask her."
- The debate: "They're arguing by the soup line about whether stealing bread is stealing. The old library would
  give you an answer."
- Ar-1: "Azzy said his father's poor are not starving and he doesn't know why. He wants to show you tonight."

---

## 8. The Echo puzzle: the forge channels and Benny's tunnel (SIG-ARD, difficulty 4)

- **The hall in the present:** three lava channels (A, B, C) cross the floor between the gate side and the far
  wall; each has a fused iron gate that sends its flow left or right; the flows are drawn on the floor, so the player
  can see where the fire runs now.
- **The Echo** (the whole hall is a zone; Anissa holds the door at the gate): Benny's armory the night before the
  march. The ditches are dry; the gates move; the **forge-master** sets them "as the Lord wishes" and says what each
  does. Young **Benny** walks the hall with Patricio (shown: he meets him at the ditches, walks him to the bellows).
- **Part 1, the channels:** set A right, B left, C right in the Echo (three anchors, `anchor.forge_gate_a/b/c`):
  back in the present the lava runs along the walls and the middle walkway is clear (the floor redraws on the
  anchors, as the drained cave did). Wrong settings are visible and harmless: the walkway stays blocked, nothing
  burns.
- **Part 2, the tunnel:** young Benny, behind the bellows: "A lever. If ever my grandchildren need a way out."
  (and the line in section 2's callback). Pull it in the Echo (`anchor.benny_lever`): in the present the blank wall
  opens (an object swap on the anchor, glowing on the way back, as the sluice gate does).
- **Part 3, the run:** staged on the sea road (beat 8), not a puzzle step: not failable.
- **Hints (from PUZZLES.md):** "The fire has to go somewhere. Can you choose where?" / "In the memory the ditches
  are dry and the gates turn. Look at where the lava runs now, then change it there." / "Set the gates right, left,
  right in the memory; then pull Benny's lever behind the bellows."
- **Files:** `puzzles/ardencia_forge/solution.json` and `cheats.json`, replayed by `tests/puzzles.test.ts` like the
  bridge and the sluice. Shared XP: the signature puzzle's 60.
- **Echo party here:** Patricio and Caona. Benny is an NPC in this Echo; he joins the Echo party only after the
  chapter (`story.benny_joined`), so the first Echo with him fighting is Chapter 4's.

---

## 9. New systems the chapter needs (honest effort, in Opus builder-days)

| System | What | Effort | Notes |
|---|---|---|---|
| **Bound** | A status that replaces Down in fights marked `binds`; Break Free (50%, then sure); any heal frees; Bound fighters untargetable; cords and BOUND on the battle screen; the loss condition "every fighter Bound" | 1 | `engine/battle.ts`, `scenes/BattleScene.ts`, tests. Pure engine first. |
| **Boss phases, reinforcements, the floor, the scripted end** | `phases` on an enemy (HP thresholds and an event trigger: the first Surge); two foes entering mid-fight (an event the screen plays); `floor` with a once-per-battle named hold; the finale (a line, a scripted move that Binds all, then the loss); the backup round cap in `config.ts` | 1.5 | The biggest piece; everything else in the chapter is content. Sim-tested both ways (section 4.2). |
| **Azzy joins** | A `MemberDef` (present, warrior, front row; the stats COMBAT.md proposes: 60/14/14/10/4/9, growth 7/2/2/2/0/1); blade moves (reuse Patricio's Slash, Heavy Blow, Sweep with his own names), SP skills *La Marca* (Marked exists) and *Grito de Guerra* (Stunned exists), passive *Sangre Ardiente* (new: a per-battle ATK stack on a fell), *Reinado de Cenizas* (once per battle: the "once" rule exists for Say Their Names' design but must be checked in the engine); his coat and blade as items at level 10; a drawn battle stance (his walk sprite and portrait exist: `quest/art/characters/azzy.png`, `portraits/azzy.png`) | 1 | Three fighters, so no bench yet (`BATTLE_ACTIVE` is 4). |
| **A third follower on the map** | Today the field has Anissa and a hard-coded Yari follower (`FieldScene.ts`); Azzy walking behind needs the followers made a list | 0.5 | Fallback if it slips: Azzy walks ahead and waits at each scene's door (already how beats 1 to 4 use him). |
| **Benny in the Echo party** | A `MemberDef` like Caona's (era echo, warrior, Riposte stance and Mark), `joins: story.benny_joined` | 0.25 | |
| **The Lower Town by night** | A map variant by flag, as Yucayeque's occupation is | 0.25 | Data only. |
| **A dialogue effect for the token** | `fx: 'token'` (a glow on two actors) beside the built `shake`; `fx: 'signet'` for the lies | 0.25 | |
| **The voyage** | `zetwal_ardencia` | 0.1 | Data only. |
| **Maps** | Seven, drawn in code; the forge's Echo layer | 2 | Sonnet with Opus checking; `tools/validate-maps.ts` on each. |
| **Dialogue, staged** | About 300 lines, every arrival, trial, hall, forge, tunnel and camp moment acted out | 1.5 | Sonnet from this outline once the maps' tiles are known. |
| **Books, debate, quests, encounters, NPCs, looks, audio entries** | Nine library books, four Alcázar books, the debate, two side quests, two tables, about 20 new looks (Rael, Cresswell, the chamberlain, three elders, the captain, halberdiers, the daughter, the cook, the widow, the oath-knight, the forge-master, the clerk, the trader captain, soldiers), three enemy drawings, a placeholder Ardencia track and Rael's low-brass theme slot in `audio.config.ts` | 1 | Sonnet and Haiku. Rael's portrait prompt goes to `ART-PROMPTS.md` the day the outline is approved (the chapter's face is a placeholder until then). |
| **Route, chapter starts, tests, smoke** | The route through Chapter 3 with `@` marks; `tools/chapter-starts.ts` gains chapter 4; `CHAPTERS` gains `ACT3`; `cards.ts` gains `act3_end`; the act test's objective list; the smoke test's Chapter 3 section with the scripted loss handled (the bot must not wait for a Game Over that never comes) | 1 | |
| **Total** | | **about 10 builder-days** | Oct 20 to 24 is five days with Sonnet and Haiku in parallel: it fits only if the engine work (Bound, phases, the floor) starts on day one alongside the maps, and the dialogue is written from this outline before the maps are final. |

**Not needed for the release:** allied groups and their prices (Free Brasador's "Fear 6"): the engine has armies as
a number and pillars per city but no ally ledger; the pledge is a flag and a Journal note until the Muster needs
the real thing. A stealth system (Ar-1 is reshaped without one). Comfort and Calm. Kneeling or bound frames (a cord
object until art).

---

## 10. People, with placeholder looks (drawn in code, `assets.config.ts` NPC looks, art drops in through the config)

| Person | Role | Placeholder look | Where |
|---|---|---|---|
| **Rael the Ruthless** | Lord of Ardencia | New drawn look: tall build, near-black coat with crimson trim, black legs, grey at the temples (grey hair, short), epaulettes and sash; hands behind his back is a facing, not a frame. A drawn enemy sprite for the battle and a portrait placeholder. Prompt to `ART-PROMPTS.md` (the guide's pixel design: black-and-crimson plate, scar over the left eye, signet). | the court, the wall, the Alcázar (not met there) |
| **Azzy** | the escort, then the companion | Built (`azzy` look and portrait); a drawn battle stance | everywhere from the gate |
| **Envoy Cresswell** | the Crown's envoy | The built `crown_consul` look (navy, white, bicorne) under his own NPC id | the hall, the gallery |
| The chamberlain | the Alcázar's voice | `hall_steward` recoloured red and gold | the hall |
| Three elders | the mask | `elder_dove` and `elder_hawk` in red robes, one with a cane | the elders' hall, the court |
| The captain of the guard | Rael's orders | `honor_guard` in black and crimson, helmet | the court, the forge |
| Brasador halberdiers | gate, court, patrols; enemies | `town_guard` in black and crimson; a drawn enemy with a halberd | the gate, the court, the tunnel mouth |
| The treasurer's daughter | Ar-2 | `petitioner`, young, in grey | the elders' hall gate |
| Benny's clerk (Echo) | Ar-2 | `clerk` in sepia | the records room, Echo |
| **Young Benny** (Echo) | the lever, the callback line | Built (`benny_young`) | the office door, the forge, Echo |
| The forge-master (Echo) | the gates | `smith` in sepia | the forge, Echo |
| The soup-line cook | Ar-1, a vendor after | `grocer`, apron | the Lower Town |
| The cart driver, two hired guards | Ar-1 | `porter`; `town_guard` plain | the lane, at night |
| The baker's widow, the Witness oath-knight | the debate | `charm_seller` in black; `honor_guard` with a sash | the Lower Town |
| The family on the road | unrest | `villager`, `festival_kid` | the sea road |
| The trader captain | the voyages | `ferryman` | the pier, the strand |
| Free Brasador soldiers (three) | the camp | the halberdier look with a torn sash | the camp |
| Smith, ring-maker, tavern cook, librarian | vendors, the library | Zetwal's vendor looks recoloured; greetings in Spanish, flagged `verified: false` for the phrasebook pass | the Upper Town |
| Old Benny | not met this chapter | | a locked door and a guard |

Nobody is named beyond Rael, Azzy, Benny and Cresswell until the owner names them (CAPITALS rule).

---

## 11. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

1. **The reveal, now that Gianna loses.** Proposal: the law's one question is the winner's ("who gave you that
   locket?"), asked with the court cleared, and the truth comes from the two halves glowing together in his hand
   and his four sentences; Cresswell re-enters for the lie and the order. *Reason:* the guide's reveal came from
   "the loser answers one question" with Gianna the winner; your direction reverses the fight, so how she learns it
   is yours to settle, not mine. The alternative is that he tells her in front of the envoy, which exposes the
   family to the Crown and goes against his whole reason for hiding them.
2. **Which legendary item he carries.** Recommendation: La Promesa de Benny (section 4.3), its *Last Stand* being
   the HP floor on screen. *Reason:* it changes Ar-4's reward and when the party gets the item (from Rael, in
   Chapter 11), and the nine items are owner-approved, so moving one changes two later chapters.

**Claude's calls (recorded here and in the design docs when the build starts; the owner can overturn any of them):**

- **The two required side quests are Ar-1 Bread at Night and Ar-2 The Treasurer's Daughter** (section 7), with
  Ar-5's clue folded into the camp scene and Ar-3, Ar-4 and Ar-5 after the release. The elders' banquet fight is
  cut for the release: it adds a fight the levels do not need and says what the books and the debate already say.
- **Whether old Patricio knows who Rael is to Gianna** (`STORY.md` open question 13) stays open on the Dec 1 list.
  The reveal gets one line that decides nothing: Gianna: "Grandfather sent me to him. Did he know?" Rael: "Patricio
  knows what Patricio chooses to know." Nothing in Chapter 3 depends on the answer.
- **The floor is reachable:** a strong, well-geared party at level 10 or 11 can bring Rael to the floor and see
  La Promesa hold; most players are Bound first; either way he ends it. His level (13) and the round cap are tuned
  in the simulator to keep it so.
- **Azzy joins in the dark, at the tunnel mouth** (beat 7), not at the camp, so the escape is fought with him and
  the shots from the wall cost him something he has already chosen.
- **The chapter opens with a voyage** (section 1), and Patricio's "east, past the Cane Road" line is corrected.

---

## 12. Length

Estimated from Chapter 2's measured route (1,020 steps, 37 transitions, 261 lines, about 40 minutes) and these maps:

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The pier, the voyage, the sea road, the gate | ~140 | 3 | ~30 | 1 ambush |
| The Alcázar, Ar-2 (with its Echo) | ~180 | 4 | ~45 | |
| The Lower Town, the debate, Ar-1 (by night) | ~260 | 5 | ~60 | |
| The trial, the question, the hall, the walk to the forge | ~60 | 2 | ~55 | Rael |
| The forge (the puzzle in both eras), the tunnel, the run | ~300 | 6 | ~50 | the bats |
| The camp, the card | ~40 | 1 | ~25 | |
| **Chapter 3** | **~980** | **21** | **~265** | 2 to 4 |

About 45 minutes, the plan's figure, with the library and a second ambush on top for players who want them.

---

## 13. Continuity into Chapter 4 (Al-Doria, The Ledger)

- **The lead:** *Benny's Refusal* names the Dorini as witnesses who hold the signed copy; Azzy reads it at the camp.
  That is `STORY.md`'s Chapter 4 beat 9 proposal, now built into this chapter's required quest, so Chapter 4 needs
  no new way in: the trader sails from the strand to Bab al-Dhahab (`?chapter=4` starts at the camp).
- **The party leaves with:** Azzy (`party.azzy`, level 11, in the front row); Benny in the Echo party
  (`story.benny_joined`); Yari; Anissa; `story.ardencia_escaped` (wanted in Cenizal: the gate shut, the patrols on);
  Free Brasador as a Journal note and a flag (`ally.free_brasador`), its soldiers at the camp.
- **What Gianna believes:** her father sold Xaraguá and sold them (`belief.rael_traitor`); every later line of hers
  about him is written from that until Chapter 11. The player holds two things she does not: the glow at the lie,
  and "every shot wide".
- **Samira's coin (clue 4):** Chapter 2's oil quest can leave a Brasador coin in the resistance's oil money; Samira
  appraises it in Chapter 4 ("this coin has been somewhere else"). A one-line addition to Chapter 2's build, flagged
  here for the helper building it.
- **Rael's theme:** the low-brass ostinato slot in `audio.config.ts` is the same melody that returns in Benny's Echo
  (major key) and at the Hearing; a placeholder track until the owner's audio.
- **Anissa's Surge gesture** moves to stage 3 of 4 (`SURGE_ANIM_STAGE`) from this chapter.

---

## 14. Risks

- **Time.** About ten builder-days against five calendar days. The engine work for one fight is the long pole; if
  Bound and the phases slip, the trial can ship as a plain fight with the floor and the scripted end (no phases, no
  guards), and the phases follow in the Nov 16 to 21 balance week. Say so now rather than discover it on Oct 24.
- **The scripted loss must never feel like a bug.** Everything in section 4.2 exists to make it read as Rael's
  choice: his line, the named item, the one scripted move, no Game Over dressing. The smoke test must screenshot the
  end on a phone both ways.
- **The route must play a lost fight.** The simulator wins every fight today; it needs to drive the trial to the
  floor (or be told the fight is scripted) and land in `rael_after`. `tests/act.test.ts` gains Chapter 3's objective
  list; `chapterStarts.test.ts` regenerates `chapters.json` with chapter 4.
- **Chapter 2 is being finished in parallel.** Its side quests change the chapter 3 start (level 8 to 9, more
  gold) and its `chapters.json` entry; this outline's numbers are for level 8 and only improve. The two builds touch
  different files except `quests.ts` `CHAPTERS`, `chapters.json`, the route and `encounters.ts`: merge last.
- **CAPITALS.md 4 is stale** (Chapter 4, levels 11 to 14): it is corrected with the owner's decisions, not before.
- **Art.** Rael is the chapter's face and has no prompt yet; the chapter ships with a drawn placeholder. Azzy's
  existing sprites are "dull olive" (ART-PROMPTS); a recolour pass or a redo in drop 2.
- **Spanish lines** (the vendors' greetings, "Coma, coma", the skill names from the board game) are flagged
  `verified: false` until the phrasebook check.
- **Tone.** No jokes in any Rael or Anissa scene; Rael never raises his voice; the Witness faith and the Quiet Crown
  are fictional and nothing real is called a cult (guide 7.3).
- **Chapter 1's line "Ardencia is east"** is fixed with the voyage; the demo port carries the fix.

---

## 15. Build plan (small steps, each checked before the next; sized to Oct 20 to 24)

1. **Decisions and docs (day 1, morning).** The second review; the owner's two answers; then `STORY.md` Chapter 3
   beats 5 to 8 rewritten to this outline, `CAPITALS.md` 4 re-levelled, `SECRET-ITEMS.md` 5 and `SIDE-QUESTS.md`
   Ar-4 and Ar-5 amended, `COMBAT.md` 12 and 13.3 (Rael) updated, Rael's prompt into `ART-PROMPTS.md`.
2. **Engine, in parallel from day 1 (Opus):** Bound; phases, reinforcements, the floor, the scripted end and the
   round cap; the `binds` and `floor` fields on the data shapes; unit tests with a test-only fight (as the Game Over
   build did). Then Azzy's and Benny's `MemberDef`s and skills, and the third follower.
3. **Maps (days 1 to 2, Sonnet):** the seven maps from section 3 with their doors, spawns, zones, anchors, the
   night variant and the ambush layer; validated; the city map entry.
4. **Content (days 2 to 3, Sonnet and Haiku):** books, enemies and looks, the debate, the two side quests, the
   encounter tables, the voyage, audio entries; NPCs and speakers.
5. **Dialogue and the story wiring (days 2 to 3, Opus with Sonnet):** `data/dialogue/ardencia.ts` staged from the
   beats; `ACT3` in `quests.ts` with hints and goals; the gate; the trial battle entry (`meantToLose`, `binds`,
   phases, the floor); `rael_after` and the hall; the forge Echo; the tunnel; the run; the camp; the card.
6. **The puzzle files and tests (day 3):** `puzzles/ardencia_forge/`; the sim plays the trial both ways; quests,
   guide, debate, side-quest, maps and stage tests green.
7. **The route (day 4):** Chapter 3 through `@chapter3-end`; `chapter-starts.ts` with chapter 4; `act.test.ts`;
   the smoke test's Chapter 3 section with screenshots of the trial's end at 844 x 390 and 390 x 844, the Bound
   screen, the token glow and the camp.
8. **Full browser test (day 5):** the chapter end to end on a phone, both ways round; the Game Over on the bats and
   an ambush (Rise, back in); `npm test`, typecheck, lint, build; then the owner's playthrough and the Chapters 3 to
   5 review batch (about Nov 1).

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, board order A first.

---

## Owner decisions (Oct 20, by pop-up)

1. **The reveal: the winner's question.** The law gives the winner one question. Rael clears the court and asks
   Gianna "Who gave you that locket?"; his signet and her Locket glow together in his hand, and he tells her in four
   cold sentences. Envoy Cresswell re-enters for the lie and the order to seize her.
2. **Rael carries La Promesa de Benny.** Its *Last Stand* is the HP floor that keeps him standing on screen. The
   party gets it from him in Chapter 11; Ar-4's secret quest gets a different reward (after the release).
