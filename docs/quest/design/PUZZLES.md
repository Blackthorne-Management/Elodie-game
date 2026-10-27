# Puzzles

*Design pack, Oct 14. The signature puzzle for each place is the guide's (6.2); how each plays, step by step, is a
**proposal** except the two built Zetwal puzzles. Every puzzle follows the guide's rules:*

1. *Solvable from what is in the room or already in the Journal.*
2. *Ships with `puzzles/<id>/solution.json` and `cheats.json`, replayed by tests (as the built ones are).*
3. *Takes at most 5 minutes the first time (secret-item puzzles are the stated exception: optional and harder, and
   Anissa's third hint for them waits 8 minutes, `SECRET-ITEMS.md`).*
4. *Never blocks the story forever: Anissa's three hints after 3 minutes stuck (Story / Normal) or 5 (Hard), from a
   nudge to the answer. She cannot enter the Echo, but her hints still reach Gianna there (guide 6.1).*

*The Echo rule throughout: the era swap works only in Echo Zones, every zone tile is walkable in both eras (the map
validator checks this), and only objects flagged `anchor` carry a change back to the present.*

*The gold arrow in Chapters 3 to 5 (Claude's call, Oct 22, merging Chapters 3 to 5 with review 1's fixes): the
gold-arrow walker (`quest/tools/gold-walk.ts`, `quest/tests/goldWalk.test.ts`) now finishes Chapter 5 too. To get
there, every goal names the person or thing to use (never the empty tile in front of it), the door to walk through,
or the shimmer; every Echo puzzle has `echoGoals` (the forge gates and Benny's lever, the treasurer's records room,
the cistern gate, Yusuf and the sun lock in the vault, the red thread and drawer four in the Archive); the sea road
starts at the barred tunnel mouth; and "Until dusk" in Al-Doria points at Samira on the Majlis steps until she has
handed out her three things (an objective done through the side quests may name its own goals, which come first;
"Appraise This" is offered from the steps). The balance door: once Yusuf has said the price, the arrow walks the
hooks still wrong for twenty-five (16, 8 and 1 on; 4 and 2 off), then the pan. The puzzle is reading the price in
the memory, and Anissa's third hint already names the weights.*

**Difficulty scale:** 1 (tutorial) to 10 (the hardest secret). Main-path puzzles stay at 6 or below.

## Index

| ID | Puzzle | Place | Chapter | Kind | Verbs (guide 6.2) | Difficulty |
|---|---|---|---|---|---|---|
| M-ZET-1 | The Marshal's night orders | Pòdlimyè, Limyè house | 1 | tutorial (built) | Door / Cipher | 1 |
| SIG-ZET | The Chain Bridge | Pòdlimyè, bridgehead | 1 | signature (built) | Bridge | 2 |
| SIG-XAR | The flooded cave, the sluice and the rhythm lock | Yucayeque | 2 | signature | Water, Cipher, rhythm | 3 |
| SIG-ALD | The guild vault | Bab al-Dhahab | 3 | signature | Weight, Cipher, Door | 4 |
| SIG-ARD | The forge channels and Benny's tunnel | Cenizal | 4 | signature | Terrain, Escape | 4 |
| SIG-SEA | Reading the Accord | Eightgate | 5 | signature | Cipher, Door | 3 |
| SIG-SKA | The frozen fjord and the herd | Ordvik | 6 | signature | Terrain, Stealth | 5 |
| SIG-KUR | The fog maze, the screens and the spy map | Kirinoura | 7 | signature | Fire / light, Stealth | 5 |
| SIG-JWA | The relay of lamps and mirrors | Agnipur | 8 | signature | Fire / light | 4 |
| SIG-ALM | The archive and the courtroom | Kingsmere | 9 | signature | Cipher, Social | 6 |
| M-ZET-2 | The powder cellar | Pòdlimyè, Cane Road | 10 | minor (Z-6) | Door | 2 |
| M-XAR-1 | The hutia's tree | Yucayeque | 2 | minor (X-3, built) | Growth | 2 |
| M-XAR-2 | The healer's grove | Yucayeque | 2 | minor (X-5, built) | Growth | 2 |
| M-XAR-3 | The chain post's pawl | Yucayeque | 11 | story (built Oct 22) | the war | 2 |
| M-ALD-1 | Spot the fakes | Bab al-Dhahab | 3 | minor (A-1) | observation (present only) | 1 |
| M-ALD-2 | The cistern pin | Bab al-Dhahab | 3 | minor (A-3) | Water | 2 |
| M-ARD-1 | The clerk's niche | Cenizal | 4 | minor (Ar-2) | Social | 2 |
| M-SKA-1 | The wolf run | Ordvik | 6 | minor (S-3) | Weight | 3 |
| M-KUR-1 | The cipher shelf mark | Kirinoura | 7 | minor (K-2) | Cipher | 3 |
| M-KUR-2 | The marsh lanterns | Kirinoura | 7 | minor (K-3) | Fire / light | 3 |
| M-JWA-1 | The lamp relay | Agnipur | 8 | minor (J-2) | timing | 3 |
| S-ZET | The Seventh Stone | Pòdlimyè | 1 | secret (built Oct 27) | sequence memory | 2 |
| S-ALD | The Uncashed Note | Bab al-Dhahab | 3 | secret | trade chain | 3 |
| S-XAR | Where the Canoes Sleep | Yucayeque | 2 | secret | tides | 4 |
| S-JWA | Oil for the Little Lamps | Agnipur | 8 | secret | measures | 5 |
| S-ARD | The Old Lord's Errand | Cenizal | 4+ | secret | two-era stealth | 6 |
| S-SKA | The Cairn of Nine Riders | Ordvik | 6 | secret | star positions | 7 |
| S-ALM | The Clock That Waits | Kingsmere | 9 | secret | clockwork | 8 |
| S-KUR | The Letter in the Floor | Kirinoura | 7 | secret | sound | 9 |
| S-SEA | The Unknotted Ribbon | Eightgate | 5 to 12 | secret | conversation | 10 |

---

## Pòdlimyè (Zetwal)

### M-ZET-1 The Marshal's night orders (built, tutorial)
- **Present:** Patricio's study; the shimmering tiles by the map table; a loose board under the window seat (empty).
- **Echo:** the war room the night before the signing. The aide hands Patricio his copy of the night orders: "Under the
  loose board by the window, as usual?"
- **Anchor:** the orders under the board (`anchor.night_orders`). Back in the present they are there, fifty years old,
  and they explain the Chain Bridge (turn the winch, then pin the pawl).
- **Hints (built):** "Grandfather hid things for later, didn't he? Grandmother always says so." / "The aide said where
  the copy goes: the loose board by the window." / "As Grandfather, take the orders to the window seat in the corner
  and leave them under the board."
- **Difficulty:** 1.

### SIG-ZET The Chain Bridge (built, signature)
- **Present:** the rope bridge to the Temple Island has fallen. The old Chain Bridge stands raised; its winch is rusted
  solid; the pawl's pin hole is empty.
- **Echo:** night, torches; the bridge is raised by Patricio's own order. The winch turns.
- **Logic:** lowering the bridge in the Echo is not enough: without the pin "she creeps back up by morning". Turn the
  winch, then drive the pin through the pawl.
- **Anchor:** the pin (`anchor.chain_bridge`).
- **Hints (built):** "Gigi, what if the old bridge could just... go back?" / "The air shimmers at the bridgehead, by the
  old winch. Grandfather was there that night." / "Use the Locket at the bridgehead. As Grandfather, turn the winch,
  pin the pawl, then come back and cross."
- **Difficulty:** 2.

### M-ZET-2 The powder cellar (Chapter 10, Z-6)
- **Present:** the smugglers' second cache is in the burned sugar mill's cellar; they are carrying muskets out of it.
- **Echo:** the mill was the Revolution's powder store; the cellar door has a heavy oak bar on the outside.
- **Logic:** bar the cellar in the Echo so that in the present the smugglers are shut out of their own cache (and the
  allied army can take it).
- **Anchor:** the cellar bar.
- **Built (Oct 22; the Chapter 10 outline 8.1 with its second review's 3.12; Claude's calls):** the bar is on the
  *inside*: the cache is behind the powder store's inner door, which hangs open on one hinge with empty brackets. In the
  memory (Anissa holds the door) the powder-master says "Marshal. Bar it and pin it when you go."; Patricio drops the
  bar and hammers the pin flat (`anchor.mill_bar`). In the present the door is shut with fifty years of rust, crowbar
  marks on it ("somebody tried, last night"), and the cache is the levy's at dawn. The way in is the smugglers'
  ledger ("Second cache under the mill"). Map `zetwal-mill` (14 x 10), puzzle `zetwal_mill`, three cheat files.
- **Hints:** "They keep going back to the mill, Gigi. What's under it?" / "The mill was a powder store in the war.
  Stores have doors that lock." / "In the memory, drop the bar across the cellar door. Then come back."
- **Difficulty:** 2.

### S-ZET The Seventh Stone (secret; full steps in `SECRET-ITEMS.md` 1)
- **Present:** seven Name Stones; six chime; the seventh is blank and dead. "Say them as they were first said, and
  the last shall answer."
- **Echo:** the first Reading of the Names; seven elders, seven stones, in one order; the seventh speaker is a Yaguana
  scout the stonecutter turns away.
- **Anchor:** the sun mark Patricio carves on the seventh stone.
- **Hints:** "The stones sound like voices, Gigi. Like someone saying names." / "Grandfather was here at the very
  first reading. Watch who goes where, in order. Someone was sent away." / "Carve the last stone in the memory, then
  touch them in the order they spoke: 3, 1, 5, 2, 6, 4, then the seventh."
- **Difficulty:** 2.
- **Built (Oct 27):** puzzle `zetwal_stones` (`quest/puzzles/zetwal_stones/`, four cheats: the order with the seventh
  never carved, the seventh touched without the chisel, the stones in number order, the plinth before the stones).
  The hints as written, the second shortened to "Grandfather was here at the very first reading, Gigi. The grove
  remembers it. Watch who goes where, in order."; they come at the plinth and after three and five wrong stones
  (`SECRET-ITEMS.md` 1, Claude's call).

## Yucayeque (Xaraguá)

### SIG-XAR The flooded cave, the sluice and the rhythm lock (signature)
**Built Oct 17** (`xaragua-cave`, the plaza's stones, `xaragua-record`; replay: `quest/puzzles/xaragua_cave/`; the
whole of it is on the scripted route). Three linked parts (guide: "flooded petroglyph cave; echo sluice; rhythm lock at the areíto plaza").

1. **The flooded cave.**
   - **Present:** the petroglyph chamber is under water. A landslide blocked the cave's sea outlet years ago.
   - **Echo:** the cave is dry. Two sluice gates lead out of the spring: the upper one to the sea (open), and a lower
     one to the river gorge (closed in the dry season by Caona's people).
   - **Logic:** the landslide only blocked the upper outlet. Open the **lower** sluice in the Echo and the water has
     drained for fifty years.
   - **Anchor:** the lower sluice, left open.
2. **The petroglyphs.** The present wall shows the areíto's drum pattern as long and short marks, but the last bar is
   worn away.
3. **The rhythm lock** at the areíto plaza: a ring of carved stones opens the council's record house when the full
   pattern is tapped (A on each beat; visual beat markers; a slower tempo option for accessibility).
   - **Echo:** at the areíto of the first oath (the main Echo scene), the musicians play the whole pattern, last bar
     included. Information, not an anchor.
- **Hints:** "The water came from somewhere, and it has to go somewhere." / "In the memory the cave was dry. Look at
  both gates; the high one is buried now, isn't it?" / "Open the lower sluice in the memory. Then learn the last bar
  of the drum song at the dance, and tap the whole song on the stones."
- **Difficulty:** 3.

### M-XAR-1 The hutia's tree (X-3; built Oct 21, `quest/puzzles/xaragua_hutia/`)
- **Present:** the hollow is too high to reach. **Echo:** the tree is a sapling. **Logic:** stake the sapling so it
  grows a low fork. **Anchor:** the stake.
- **Hints:** "Trees grow, Gigi. That's the whole trick of trees." / "In the memory it's tiny. You could bend it." /
  "Drive the stake beside the sapling in the memory, then climb the fork it grew."
- **Difficulty:** 2.

### M-XAR-2 The healer's grove (X-5; built Oct 21, `quest/puzzles/xaragua_grove/`)
- **Present:** the grove is stumps; the road crews cut it. **Echo:** Caona's healer gathers seed and points to the rocks
  "where no road will ever go". **Logic:** plant behind the rocks. **Anchor:** the planted row.
- **Hints:** "Roads go where it's flat. Where isn't flat?" / "The healer in the memory said something about the rocks."
  / "Plant the seeds behind the rocks she pointed to, in the memory."
- **Difficulty:** 2.


### M-XAR-3 The chain post's pawl (Chapter 11; built Oct 22, `quest/puzzles/xaragua_pier/`)
- **Place:** the Harbor Village's pier, by dusk. The Crown's chain runs from the *Patience* in the mouth along row 27 to
  the old chain post's capstan on its own pile at the pier's sea end (23, 26). The marines hold the sea end; the pier's
  landward boards shimmer (the Echo zone, 21 to 22, rows 19 to 20; it opens once Anaco is free).
- **Logic:** fifty years ago, after Caona's stand (the chapter's Echo battle: the pier assault folded into it), the
  post had a new capstan with an iron pin through its pawl. Caona: "They'll chain the mouth next time they come,
  Marshal. Everyone does. Make it so it won't hold." Pull the pin in the memory (`anchor.chain_post`); back in the
  present the capstan spins and the chain runs out into the harbor (`story.chain_dropped`).
- **Cheats:** into the memory and straight back; the pin looked at and left in; the pier walked in the present (the
  marines hold it).
- **Hints:** "The chain's tied to the old post, Gigi. It looks like the bridge's winch." / "Grandfather was on this
  pier with Caona. The boards shimmer." / "In the memory, pull the pin out of the capstan's pawl. Then come back and
  watch the chain."
- **Difficulty:** 2 (the bridge's rule, Chapter 1, turned round: a pin taken out instead of driven in).
### S-XAR Where the Canoes Sleep (secret; full steps in `SECRET-ITEMS.md` 3)
- **Present:** four tide states by resting; the water never reaches the canoe ledge. **Echo:** no rockfall; a weir at
  the cave mouth. **Anchor:** the weir gate dropped at High tide.
- **Hints:** "The sea goes up and down, but this cave can't keep any of it." / "In the memory there's a stone gate at the
  mouth. When would you want to shut it?" / "Drop the gate at High tide in the memory. Here, wait for High, then
  Falling, and push the raft."
- **Difficulty:** 4.

## Bab al-Dhahab (Al-Doria)

### SIG-ALD The guild vault (signature)
- **Outer door (weights and cipher):**
  - **Present:** the door is a balance. Five brass weights (1, 2, 4, 8, 16) hang on hooks. A ledger page by the door
    names "the price of the harbor" in the guild's letter-numbers (an abjad-style cipher where each letter is a
    number), smudged past reading.
  - **Echo:** young Yusuf writes the same entry in plain numbers and says it aloud as he writes: **25**.
  - **Logic:** hang 16, 8 and 1 on the pan. (Cipher verb: the ancestor's plain text.)
- **Inner door (anchor):**
  - **Present:** a sun-shaped keyhole that fits nothing on the guild's key ring.
  - **Echo:** the inner door is being fitted; the locksmith asks what pattern to cut. Patricio shows the Locket's sun:
    "Cut it to this."
  - **Anchor:** the lock, cut to the Locket. In the present the Locket opens it.
- **Hints:** "The door wants a weight. The page says how much, if you can read it." / "Yusuf wrote this page. In the
  memory, watch him write it." / "The price is 25: hang 16, 8 and 1. Then, in the memory, show the locksmith the Locket."
- **Difficulty:** 4.

### M-ALD-1 Spot the fakes (A-1, present only)
- No Echo: a short observation game to teach looking closely. **Hints:** "Samira looks at edges. Look at edges." /
  "One coin has a smooth edge; real ones are milled." / "The smooth coin, the carpet with loose knots, the weight with
  no stamp."
- **Difficulty:** 1.

### M-ALD-2 The cistern pin (A-3)
- **Present:** the fountain is dry; the guild diverted the cistern. **Echo:** the old cistern sluice is open but its
  gate pin is loose. **Logic:** pin it open. **Anchor:** the pin.
- **Hints:** "Water used to come here. What stopped it?" / "In the memory the gate is open, but it won't stay open." /
  "Pin the cistern gate open in the memory, like the Chain Bridge."
- **Difficulty:** 2.

### S-ALD The Uncashed Note (secret; `SECRET-ITEMS.md` 2)
- **Present:** the price board (indigo dear) and box 7. **Echo:** a four-stall barter chain and Yusuf's deposit.
  **Anchor:** the sakk in box 7.
- **Hints:** "Grandfather had almost nothing to trade. But he knew what would matter later, because you do." / "Look at
  the price board now. What is worth a fortune today?" / "Coins, dates, salt, peppers, indigo. Deposit the indigo."
- **Difficulty:** 3.

## Cenizal (Ardencia)

### SIG-ARD The forge channels and Benny's tunnel (signature, the Escape)
- **Part 1, the channels (terrain):**
  - **Present:** three lava channels cross the forge-fortress hall between the party and the tunnel door; each has a
    fused gate (A, B, C) that sends the flow left or right.
  - **Echo:** the hall is Benny's armory being built; the channels are dry ditches and the gates move. The forge-master
    sets them "as the Lord wishes".
  - **Logic:** set A right, B left, C right in the Echo so that in the present the lava runs along the walls and
    leaves the middle walkway clear (the present map shows the flows, so the player can test in the Echo and look).
  - **Anchor:** the three gates.
- **Part 2, the tunnel (escape):**
  - **Present:** the tunnel door is a blank wall in the forge.
  - **Echo:** young Benny shows Patricio a lever behind the bellows: "If ever my grandchildren need a way out."
  - **Anchor:** the lever, pulled (guide 5.6: "opened by an anchor Benny left").
- **Part 3, the run:** a short chase with guards firing; the shots land wide (staged, guide 5.8). Not failable on
  Story; on Normal and Hard a hit costs HP only.
- **Hints:** "The fire has to go somewhere. Can you choose where?" / "In the memory the ditches are dry and the gates
  turn. Look at where the lava runs now, then change it there." / "Set the gates right, left, right in the memory;
  then pull Benny's lever behind the bellows."
- **Difficulty:** 4.

### M-ARD-1 The clerk's niche (Ar-2)
- **Present:** the treasurer's ledger is gone. **Echo:** Benny's clerk shows where working copies were hidden (a wall
  niche behind a tapestry). **Logic:** information (the niche exists in both eras). **Anchor:** none needed.
- **Hints:** "Clerks always keep a second copy. Always." / "Benny's clerk, in the memory, knows where." / "Behind the
  tapestry on the east wall."
- **Difficulty:** 2.

### S-ARD The Old Lord's Errand (secret; `SECRET-ITEMS.md` 5)
- **Present:** four guard loops. **Echo:** three different guard loops; the cloister is all Echo Zone. **Anchor:** the
  horseshoe nail jamming the crypt bolt.
- **Hints:** "Some guards are only here now, and some were only there then." / "When a guard turns toward you, change
  eras. He might not exist in the other one." / "Swap at the well, under the arch, at the fountain, by the bell rope
  and at the crypt steps; jam the bolt in the memory."
- **Difficulty:** 6.

## Eightgate

### SIG-SEA Reading the Accord (signature)
- **Present:** the signed original lies under glass in the Throne Archive; six ribbon pages, and the seventh ribbon
  leads nowhere. The archive's seven drawers were relabelled long ago with house sigils; only the carved numbers on the
  cabinet are original.
- **Echo** (the sealing, owner decision Oct 14): the Throne's clerk reads the seventh page to himself, seals it, and files it in a
  drawer, not the binding.
- **Logic:** note the **number** carved on the drawer he uses (not the sigil, which has changed). In the Echo, tie a
  thread of the seventh ribbon round its handle.
- **Anchor:** the red thread (a faded thread in the present marks the drawer even if the player forgot the number).
- **Then:** the Regent's archivist must agree to the reading: a short Parley (Influence or the Witness faith's argument
  that a sealed clause is a breach of Clause Six).
- **Hints:** "Seven ribbons and six pages. Where's the seventh page?" / "In the memory, watch where the clerk puts it.
  The labels have changed since, but the cabinet hasn't." / "Drawer four. Tie the ribbon thread on it in the memory."
- **Difficulty:** 3.
- **Built (Oct 22; the Chapter 5 outline's second review, 3.4; Claude's call):** the carved numbers today run 6, 2, 7,
  5, 1, 4, 3 left to right (drawer 4 is sixth, second from the right); in the memory the drawers run 1 to 7, so the
  clerk files the page fourth from the left. The plates: Kay Soley, Brasador, Dorini, Ironvow, Suzumori, Stillwater,
  Agnivansh (drawer 4 under Stillwater, the Crown's own; Xaraguá has no drawer, never a signatory). A wrong drawer in
  the memory costs a re-watch: "Nothing is in this one. The clerk looks up.", the thread goes back to the table and the
  clerk files the page again. The Parley half: Reason is the Witness argument (a page never read was never agreed;
  needs *The Founding Compact* or *The Sun Accord, Sealed* read), Scripture works with one more exchange, Compassion
  sends Gianna to the shelf. Honest difficulty 2 to 3. Files: `quest/puzzles/seat_accord/`.

### S-SEA The Unknotted Ribbon (secret; `SECRET-ITEMS.md` 9)
- **Echo:** five questions from the clerk, each with a trap. **Present:** the keeper's cross-examination, each line
  backed by evidence. **Anchor:** the clerk's minute.
- **Hints:** "Tell him only what is true then, and only what we can prove now." / "Caona wasn't in that room. Benny said
  no out loud. The Dorini were paid." / "No one; he refused aloud; the Crown and paid allies; to you alone; leave it
  unknotted. Then show Caona's oath, Benny's note, Yusuf's ledger and Thomas's record."
- **Difficulty:** 10.

## Ordvik (Skarragol)

### SIG-SKA The frozen fjord and the herd (signature)
1. **The fjord (terrain):**
   - **Present:** summer; open water with drifting floes. **Echo:** winter; the fjord is frozen, but the ice has thin
     patches (black, cracking).
   - **Logic:** Echo Zones lie only on present floes that are also solid ice in the Echo. Walk the Echo ice from zone
     to zone; where the Echo ice ahead is thin, swap to the present on a floe whose next floe is close; swap back when
     the present runs out of floes. Five swaps cross it.
   - **Anchor:** none (pure two-era route).
2. **The herd (stealth):**
   - **Present:** the thief's camp is ringed by lookouts; a horse herd grazes between. **Echo:** Sarnai's raiders
     approach the Crown supply camp hidden in a herd, moving it with a three-note whistle.
   - **Logic:** learn the whistle in the Echo; in the present, whistle to move the herd and walk inside it past the
     lookouts.
- **Hints:** "The ice was solid once. And the floes are solid now. Use both." / "Swap only on the shimmer. When the dark
  ice is ahead, come back to now." / "Cross on five swaps; then learn Sarnai's whistle in the memory and walk inside the
  herd."
- **Difficulty:** 5.

- **Built (Oct 22; the Chapter 6 outline section 8 with its review's 3.2 and 3.7):** the present is the edge of the
  freeze (open water, first floes); six zones; stretches 1, 3 and 5 are ice only in the memory, 2 and 4 floes only now,
  with dead ends off zones 1 and 3 and off the first stretch. Five swaps cross; Sarnai's raid plays from a step trigger
  on the far shore's floe in the memory (and from its `onEcho`), and teaches the whistle (`clue.herd_whistle`). The herd
  is six horses (distinct NPCs, walked): whistle at the herd (the west lookout leaves the gap), then at the picket line
  inside the ring (the east lookout follows the horses), the approach unseen (`story.herd_unseen`, +1 Influence).
  Talking to a lookout is the fight (`camp_lookouts`), and after it the gaps are open: no soft-lock. The arrow walks
  the crossing zone by zone (flag triggers on each zone). Files: `quest/puzzles/skarragol_fjord/` and
  `quest/puzzles/skarragol_gully/` (M-SKA-1). Honest difficulty 4.

### M-SKA-1 The wolf run (S-3)
- **Present:** wolves get into the winter store through a gully. **Echo:** a loose boulder on the slope above the gully;
  Patricio is strong enough to roll it. **Anchor:** the boulder.
- **Hints:** "Wolves always use the same road." / "In the memory there's a boulder above their road." / "Roll the
  boulder into the gully as Grandfather."
- **Difficulty:** 3.

### S-SKA The Cairn of Nine Riders (secret; `SECRET-ITEMS.md` 6)
- **Present:** nine cairns, a summer sky without the Mare. **Echo:** the winter sky turning, three horns. **Anchor:** the
  bridle under the cairn.
- **Hints:** "The stars move, Gigi. In the memory they're still moving." / "Stand on the flat stone in the middle, find
  the Mare's eye, and wait for the third horn." / "At the third horn the eye is over the seventh cairn clockwise from
  the north path."
- **Difficulty:** 7.

## Kirinoura (Kuroshi)

### SIG-KUR The fog maze, the screens and the spy map (signature)
1. **The fog maze (lantern signals):**
   - **Present:** a fogbound quarter of identical lanes; lantern posts stand unlit.
   - **Echo:** Lady Sayo's agents light the posts in a code (two white, one red: turn left; one white, two red: turn
     right; three white: straight). The Journal records each signal seen.
   - **Logic:** read the route in the Echo; walk it in the present.
2. **The rotating screens:**
   - **Present:** the file house is a grid of paper screens on pivots; turning one turns its neighbours.
   - **Echo:** Sayo's wall map shows the house from above with the safe layout inked in; one screen in the Echo has a
     loose peg.
   - **Logic:** peg that screen in the Echo so it no longer turns; the present grid becomes solvable in four turns.
   - **Anchor:** the peg.
3. **The spy map:** the same wall map marks where the buyer's files are kept (story clue).
- **Hints:** "The fog is the same now as it was then. But someone was talking through it." / "Watch the lanterns in the
  memory. Two white and a red means left." / "Peg the screen by the map in the memory, then turn the screens north,
  east, east, south."
- **Difficulty:** 5.
- **Built (Oct 22; the Chapter 7 outline section 8 with its second review's 3.1, 3.7 and 3.8; Claude's calls):**
  `kuroshi-fogmaze` (30 x 30), `kuroshi-filehouse` and `engine/rotor.ts`; replays `quest/puzzles/kuroshi_fogmaze/` and
  `kuroshi_screens/`.
  - *The maze:* six plazas, each entered from the south with three ways on; the route is left, straight, right, right,
    left, straight. In the Echo (the gate yard, Anissa holds the door) Sayo's agents light **nine posts**, three for
    each code, so all three patterns are seen; the Journal keeps them. In the present each plaza's three posts show its
    way on once the party has the code. A wrong way turns the party back **to the plaza it left**, not to the gate;
    the far gap turns a party that walked it blind (no code) back to the gate, so the code is needed, not guessed.
  - *The screens:* a 3 x 3 grid, pushes turn a screen and its four neighbours. Unpegged, the loose centre slips back
    east after every push, so the grid never opens (the review's fix a: no long unpegged solution exists, the cheat
    test passes); pegged in Sayo's war room (the anchor `anchor.screen_peg`), it holds north and cannot be pushed,
    and four pushes (north, east, east, south: screens 1, 5, 5, 7) open the lanes.
  - *The spy map:* the pins read only with Kayla's glyph card (`item.kayla_glyphs`) and `clue.sayo_network`
    (`story.spy_map_read`).

### M-KUR-1 The cipher shelf mark (K-2)
- **Present:** the stacks are shelved by a cipher. **Echo:** Sayo's clerk files the ledger and says the mark aloud.
  **Anchor:** none.
- **Hints:** "Every shelf has a mark. Only one matters." / "Sayo's clerk said it out loud, in the memory." / "Shelf
  mark: crane, pine, third row."
- **Difficulty:** 3.
- **Built (Oct 22; the second review's 3.3, Claude's call):** the Echo at Kayla's desk shows Sayo's clerk filing a
  **Revolution** file and saying the rule aloud ("Crane for the Crown. Pine for the war. The row for the years.";
  `clue.shelf_mark`); the Ash Wars were twenty-five years ago, so the ledger is found in the present by applying the
  rule: crane and pine, the third row (nine shelves on the stacks' east wall, three of them crane-and-pine). A wrong
  shelf says what it holds. Replay: `quest/puzzles/kuroshi_stacks/`.

### M-KUR-2 The marsh lanterns (K-3)
- Uses the lantern code from SIG-KUR (learned in the Echo there) to light the marsh posts and guide the fishers home.
  Present only, but it needs the Echo knowledge.
- **Hints:** "Do you remember Sayo's lanterns?" / "The fishers need to turn left, then right." / "Two white and a red,
  then one white and two red."
- **Difficulty:** 3.
- **Built (Oct 22; Claude's calls):** six posts in two rows of three (the fork and the bend); each tap cycles white,
  red, dark. When all six are lit the check plays: left then right brings the moths up first (the fight), then the
  boats home and the causeway lit (`story.causeway_lit`); anything else is "wrong", with no reset. Replay:
  `quest/puzzles/kuroshi_posts/`.

### S-KUR The Letter in the Floor (secret; `SECRET-ITEMS.md` 8)
- **Present:** a 5 x 5 singing floor, relaid. **Echo:** the informant's melody, with one rest on a silent board.
  **Anchor:** the nail that silences one board.
- **Hints:** "The floor sings. The message is a song." / "The song has a quiet step in it. This floor has no quiet
  board yet." / "Plan the path here first, then nail the board where the rest falls, in the memory."
- **Difficulty:** 9.

## Agnipur (Jwaladesh)

### SIG-JWA The relay of lamps and mirrors (signature)
- **Present:** the temple's wick needs light from the harbor's chain lamp, carried by bronze mirrors on four rooftops.
  The chain lamp is dead, and a newer tower blocks the old line.
- **Echo:** the night of Arjun's charge, the chain lamp stands ready with oil but unlit, and the old watchtower (still
  standing in the present, but bare) has an empty mirror bracket and a spare mirror at its foot.
- **Logic:** light the chain lamp in the Echo (guide: "a lamp lit in the Echo stays lit"), and bolt a mirror on the
  watchtower facing the temple quarter. In the present, turn the four rooftop mirrors to carry the beam from the
  watchtower around the new tower to the temple.
- **Anchors:** the lit chain lamp; the watchtower mirror.
- **Hints:** "Light needs a road too, Gigi." / "The lamp was lit in Arjun's time. It can be again, and stay lit. And the
  old tower is missing its mirror." / "Light the chain lamp and bolt the tower mirror in the memory; then turn the
  roof mirrors: east, north, north, west."
- **Difficulty:** 4.
- **Built (Oct 22; the Chapter 8 outline section 8 with its second review's 3.11; Claude's calls):** the Echo is the
  chain tower on the night of Arjun's charge: Arjun stands outside the zone and puts a lit taper in Patricio's hand
  with his own hand over it; the lamp and the spare mirror (bolted in the bracket) are Echo objects whose anchors
  (`anchor.chain_lamp`, `anchor.tower_mirror`) the present's lamp, bracket and beam read. The rooftops (Aiyana's ladder)
  open only with both anchors. Three mirrors turn (a flag per facing, south none); the answer is **east, north,
  north**, and the fourth is the rusted bracket Anissa holds the disc in. The beam is drawn only when all are right;
  the old line lands on the Exchange's brick. Honest difficulty about 3 (the review's 3 to 4). Cheat file
  `jwaladesh_mirrors`.

### M-JWA-1 The lamp relay (J-2)
- **Present:** carry a lamp through gusty lanes before it gutters. **Echo:** Arjun's runners use sheltered alleys.
  **Logic:** learn the route; no anchor.
- **Hints:** "The wind comes off the sea." / "Arjun's runners never took the main street." / "Left at the dyers, through
  the arch, along the wall."
- **Difficulty:** 3.
- **Built (Oct 22):** the lamp goes out on the main street's two gust strips; the runners' way along the west wall
  lane keeps it lit. Honest difficulty 1 to 2 (the runner says the way aloud in the Echo). Cheat file
  `jwaladesh_relay`.

### S-JWA Oil for the Little Lamps (secret; `SECRET-ITEMS.md` 4)
- **Present:** a balance with a sooty weight. **Echo:** jars of 10, 7 and 3; the roll call (five came home). **Anchor:**
  the sealed reservoir.
- **Hints:** "The weight is a number. Someone in the memory says it." / "Five came home. Can you make exactly five with
  a 10, a 7 and a 3?" / "10 to 7, 7 to 3, 3 to 10, 7 to 3, 3 to 10, 7 to 3, 10 to 7, 7 to 3. The 7 holds five."
- **Difficulty:** 5.

## Kingsmere (Aldermoor)

### SIG-ALM The archive and the courtroom (signature)
1. **The archive (cipher):**
   - **Present:** the Regent's archive files by regnal year and seal colour, and the pact with Rael is filed under a
     false year. Guards pass on a loop (light stealth).
   - **Echo:** Thomas Stillwater, in the same room, explains the system to Patricio and, asked, hides a copy of his
     true record of the Seventh Clause behind a loose panel.
   - **Logic:** the false year is the year of the Accord read backwards in regnal numbering (Thomas's joke: "We file
     lies in the mirror"). **Anchor:** Thomas's hidden copy.
2. **The courtroom (who is lying):**
   - **Present:** three witnesses testify before the Regent. Gianna presses statements and presents evidence from the
     Journal.
   - **Echo:** the courtroom has an Echo Zone in the dock. Stepping into it shows the Crown ratifying the Seventh Clause
     fifty years ago, with no Yaguana present.
   - **Logic:** the second witness claims "Xaraguá's cacique agreed in this very court". Present the Echo minute and
     Thomas's copy.
- **Hints:** "Even archives lie, but they lie neatly." / "Thomas says lies are filed in the mirror. And the court
  remembers who was here." / "The pact is under the Accord's year reversed. In court, the second witness lies: show
  Thomas's copy."
- **Difficulty:** 6.
- **Built (Oct 22; the Chapter 9 outline with its second review's 3.6, 3.8 and 3.11; Claude's calls):**
  - **The archive:** six cabinets, a decade each of the Old King's reign; each is a dialogue with a year dial and a
    seal switch (flags with values) and a drawer that opens on `eq`. The rule is cut over the door ("Filed by the year
    of the reign and the seal of the house the matter concerns. Matters touching a clause are filed with the
    clause."). The filing floor's memory (Anissa holds the door) shows Thomas filing the pact in the mirror and
    Patricio leaning on the panel (the anchor, `anchor.thomas_record`). The pact is in **32 under the Brasador red**;
    23 under red holds a slip ("removed to the Lord Regent's keeping"); 32 under violet a tax roll. The panel is behind
    the Ash Wars shelf (Al-2). No guards' loop in the room (the night's Sealbearers are in the hall: lamp strips
    send the party back to the postern). Honest difficulty about 3.
  - **The courtroom:** the clerk's tree (press a witness: the steward, the Almoner, the captain; lay evidence: the
    roll, the record, the pact, the chronicle). The dock's memory is the roll read over an empty dock ("Xaraguá: not
    present. Not sent for."). The record alone is "a word against a word"; the Almoner must swear to the public edition
    first; the three together read "Xaraguá was never asked. T.S." into the roll. Honest difficulty about 3.
  - Cheat files `aldermoor_archive` and `aldermoor_assize`.

### S-ALM The Clock That Waits (secret; `SECRET-ITEMS.md` 7)
- **Present:** a rusted clock, a vault, "a quarter to three". **Echo:** 11:10, gears of 5, 7 and 12, a 12-turn spring,
  the watchman in 90 seconds. **Anchor:** the quill in the escapement.
- **Hints:** "Thomas wrote the hour down. The clock wants that hour." / "Waiting is too slow. Wind it. Rewinding the
  spring lets the clock run on for you." / "Twelve turns of twelve, rewind, five more of twelve, then wedge the quill
  on the next tick."
- **Difficulty:** 8.
