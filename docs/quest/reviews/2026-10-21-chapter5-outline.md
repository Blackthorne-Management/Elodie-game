# Chapter 5, The Parley (Eightgate, the midpoint): build outline (Oct 21)

*Design outline only, for the second review and the owner's decision before anything is built. No code has changed.
Written under the Oct 20 rules: only a decision that drastically changes the story's flow goes to the owner;
everything else is Claude's call, recorded in section 12 with its reason. Sources: `PLAN-ALL-CHAPTERS.md` (Oct 26 to
28, 20 minutes, levels 14 to 15, no companion), the Opus plan review section 6 (the minimum for Chapter 5: the
Regent's welcome, reading the Accord, the sealing Echo, the Seventh Clause read aloud, Elodie's two lines, the roads
open; Volume One and the Ribbon after the release) and its owner decisions (the three roads in a fixed order:
Skarragol, Kuroshi, Jwaladesh), `design/STORY.md` Chapter 5, 6.2 (the Accord was signed in Pòdlimyè; Eightgate's
Echo is the sealing), 6.3 (the Hushed is the Regent's agent) and "the families are bigger", `design/FAMILY.md`
(Coralie, "Tati Coco", settled: in Eightgate she dresses the royals for the Parley and smuggles Gigi and Anissa into
the sealed Archive as her seamstresses), `CAPITALS.md` 5, `SIDE-QUESTS.md` Se-1 to Se-5, `PUZZLES.md` SIG-SEA and
S-SEA, `COMBAT.md` 6, 7, 11, 13, `SECRET-ITEMS.md` 9, `QUEST-BUILD-GUIDE.md` 5.3 (the Regent, Elodie), 5.6 (the
midpoint), 5.8 (Rael's clue 2: Elodie's two lines), 6.6 (Eightgate and the contested Throne), 7.2 (the Eightgate
debate: all four faiths), the Chapter 3 outline's "Built (Oct 21)" section and `quest/src/data/dialogue/ardencia.ts`
(the staging pattern), the Chapter 4 outline (its section 13, continuity into Chapter 5, is this chapter's start
state; its review was not yet written when this was), and the built game in `quest/src` on branch `chapter3`
(`data/quests.ts` ACT3, `data/battles.ts` `rael_trial`, `engine/stage.ts`, `tools/maps/ardencia.ts`,
`tools/chapter-starts.ts`, `tools/level-curve.ts`). Levels use the game's own curve (`xpBase 50, exponent 1.6`:
level 14 at 3,029, 15 at 3,410, 16 at 3,805, 17 at 4,220).*

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17); Anissa is never
hit, never a target and never jokes; no jokes in any scene with the Regent; Elodie is a head of state under Crown
eyes and never breaks character in public; the comedy (Samira pricing the Throne, Coco and Azzy's veil) stays away
from Anissa and the Hall; recommendations only where they genuinely help; placeholders wherever art has not arrived;
the release is Nov 22, so this chapter gets the main story, the Echo puzzle, the debate as a required quest, **two**
required side quests, mystery quests and arrows, Game Over, and nothing else until after the release. **Eightgate is
built once and reused in Chapter 12 and the Hearing**, so every map below says what Chapter 12 does with it.

---

## 1. Where the chapter starts (measured against the Chapter 4 outline)

- **Chapter 4 ends** at Bab al-Dhahab's caravan gate at first light: the party walks out with the Dorini caravan
  (`act4.complete`; the card *Chapter 4 complete, The Ledger. Next: Chapter 5, The Parley*). `?chapter=5` starts at
  Eightgate's gate with the caravan master's last line ("The Dorini flag got you through the gate. It will not get you
  through a door."). The caravan journey over the realm map is the Chapter 4 outline's first Chapter 5 build item,
  with a card as the fallback (section 10).
- **The party on the route:** Gianna, Yari, Azzy (front row), Samira (back row), Anissa; **level 14** (about 3,280
  XP; 15 with Al-Doria's whole library and a second desert ambush). Echo party: Patricio, Caona, Benny. Gold about
  900 after Al-Doria (Samira's purse is hers). Key items: the Locket, the envoy's papers, *Benny's Refusal* (the Ar-2
  copy), **Benny's note** in his own hand (`item.benny_note`, "I will not put my name to this page"), the Dorini
  pass (`item.dorini_pass`), the Brasador coin (`item.brasador_coin`). Flags that matter here: `belief.rael_traitor`
  (Gianna believes her father sold Xaraguá and them), `clue.sealed_seventh` (the vault copy's seventh page is sealed
  with the Throne's wax), `clue.harbor_price` (Yusuf's ledger: what the Dorini were paid), `clue.brasador_coin` (Rael
  clue 4), `party.samira`, `party.azzy`, `story.benny_joined`, `ally.free_brasador`, `side.sweet_water.done` (three
  ash thumbprints so far), Al-Doria's Influence toward its price.
- **What Gianna knows going in:** the Accord has six pages and seven ribbons (Chapter 1's Hall copy); Xaraguá was
  never shown a seventh clause (Chapter 2); her father is Rael, who told her so with the court cleared, and she took
  it as a traitor's confession (Chapter 3); the allies were paid, Benny refused in writing, and the Throne's wax seals
  the page (Chapter 4). She has not seen her mother since the east gate in Chapter 1 ("A few weeks. Maybe longer. The
  Regent likes to keep envoys waiting.").
- **What the player may know that she does not:** the signet glowed at Rael's one lie (Chapter 3); Joaquin's shots
  all landed wide; the coin "has been somewhere else". Elodie's two lines land on exactly this gap.
- **Chapter 5's target** is 14 to 15 (the plan). Eightgate's Outfitter stocks tier 16 gear. No boss: a flag of truce,
  and by the old courtesy no steel is drawn inside the walls (guide 6.6, "allegedly; the story tests it": it tests it
  in Chapter 12, not here).
- **Two stale lines in the design.** `STORY.md` Chapter 5 proposes "one Echo skirmish in the Archive"; this outline
  drops it (section 12, Claude's call: no Echo battle). `CAPITALS.md` 5 gives the Throne Hall two sizes (28 x 20 in
  the table, 44 x 32 in the seat paragraph); the larger one is used, since the Hall is the Claim's arena in Chapter 12.

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 4 outlines. Flags are proposals in the built naming style
(`story.*`, `side.*`, `clue.*`, `echo.*`, `anchor.*`, `choice.*`). "Shown" means walked and acted on the map.

### Beat 0: The caravan road (the realm map, then seat-gateyard)

- **The land journey `aldoria_seat`**: the Dorini caravan crosses the realm map from the Gate of Gold (about 106, 66)
  west along the Al-Doria road to Eightgate (68, 64): a `VoyageDef` over land if the realm-travel foundation gives
  voyages a land mode (a caravan sprite instead of a sail; the same plotter), else the built voyage with the caption
  text and a brown road line, else a card. Captions: "West, out of the dunes of Al-Doria..." / "...along the Gold
  Road, with the Throne's spire a day ahead." One line on the road, shown as the caravan halts at the last camp:
  Samira, counting the tolls: "Eight gates and one toll-keeper. Whoever holds this city taxes the whole realm for
  walking." Anissa: "Mama's there, Gigi." Gianna: "Yes." (The same shape as Chapter 4's reef line: she does not stop.)
- **Lands** at `seat-gateyard`, spawn `gold_gate`, the caravan drawn up inside the Gold Gate (Al-Doria's gate, one of
  the eight). `story.seat_arrived` is set on landing: the Crossroads Fields' table switches on (`crossroads`).
- Journal: **The Gold Road** (done `story.seat_arrived`).

### Beat 1: The Gold Gate and the caravan yard (seat-gateyard, outdoor)

- The yard inside the gate: the caravan unloading, the **Pilgrims' stall** (faith tokens), the **contract board**, two
  **Regent's Sealbearers** at the inner arch (grey and violet, the Throne's seal on a chain: the first time the
  player sees the Regent's colour), the **gate clerk**, and a knot of **pilgrims** of the four faiths by the wall
  (one of them bandaged: Se-3's hook, "The road in is not the road out. The deserters hold the crossroads.").
- The **caravan master** walks up to Gianna (shown) and says the Chapter 4 line: "The Dorini flag got you through the
  gate. It will not get you through a door. Everything inside the walls is the Throne's, and the Throne is the
  Regent's, for now." He goes back to his mules.
- At the inner arch the Sealbearer reads the envoy's papers and does not return them at once; he looks at Anissa a
  beat too long, then at the papers again, then hands them back: "Zetwal's envoy's household. The Lord Regent is
  informed of every arrival. Wait here." (He never speaks to Anissa; the Oct 20 rule: she is looked at, never
  touched.) A **Crown herald** in Aldermoor violet comes through the arch from the concourse (shown), bows exactly
  as low as the papers require: "Gianna Elise Limyè. The Lord Regent receives Zetwal's envoy's party at the Hall,
  under the truce of the Parley. Now, if it please you; it pleases him." He turns and walks; the party follows (a
  walker the party must keep up with, as the herald's beat in Chapter 1's Hall).
- Journal: **The herald** (done `story.herald_met`; this and beat 0 pay as one objective, section 5).

### Beat 2: The Eight Gates Concourse (seat-concourse, the hub)

- The herald leads them round the ring road: the eight gates in their house colours seen in passing (Zetwal's gold
  gate shut "for the Parley"; Xaraguá's teal gate bricked up: Yari stops in front of it, one step out of the line, and
  comes back without a word; the Ardencia gate with a Brasador banner and two halberdiers who salute Azzy, who does
  not salute back), the centre **fountain** with the **debate corner** (four speakers already at it: the party hears
  one passing line each; the quest opens later), the Concourse market, the Envoys' Outfitter, the **Throne Hall's
  forecourt and steps** at the ring's north, the lane to the **Envoys' Quarter** east, the **Archive's** sealed door
  on the Hall's west flank with two Sealbearers and a chain across it (seen now, so the sealing is a fact before the
  Regent says it).
- Samira, as the Hall comes into view: "Twelve thousand dinar in that roof. Not one lamp lit." (The companions'
  comedy; it stops at the steps. Nothing is said about Anissa.)
- Journal: **The Hall** (done `story.regent_met`).

### Beat 3: The Regent's welcome (seat-hall, the seat of government)

- **The Hall:** a long nave of banners to the **Throne tile** at the far end (the board game's Throne, drawn as the
  carved sun-and-eight-rays tile from the board; roped off, two Sealbearers at the rope), the **eight council
  chairs** in an arc before it (empty; Se-5), the eight **embassy chambers** off the nave (four a side, each door with
  a house sigil; some shut), the heralds' stair, the Regent's offices behind the Throne. People standing for the
  Parley's recess: the envoys of Al-Doria, Skarragol, Kuroshi and Jwaladesh at their chamber doors, the **Crown's
  legate**, the **chamberlain** (the Master of the Chairs), the **Crown's clerk** with his writing board, two
  heralds, and **Elodie** at Zetwal's chamber door, in the envoy's gold, standing exactly where protocol puts her and
  not one step nearer.
- **The Lord Regent Aldric Vane** stands at the Throne's foot with one hand on its arm, never sitting (the Claim's
  visual: he holds it "for now", and the player will see Gianna stand on that tile in Chapter 12). Thin, grey, a chain
  of office, no crown. Placeholder look until drop 2 (the Opus review names him for it).
- Staged: the herald announces them; the party walks the nave (shown; Anissa last, close to Gianna); the Regent does
  not come down. He names them before anyone introduces them, in order, calmly: "Gianna Elise Limyè, junior archivist
  of the Temple of Elodie. Yari of the cacique's house; your father is well, I am told, under guard in his own house.
  Azriel Rodriguez of Ardencia; your father's compliments reached me before you did. And a Dorini, lately expelled,
  whose mother holds a contract with my treasury." He looks at Anissa for the length of one breath and says nothing to
  her, and that is the scene's coldest moment (no line; Anissa's sprite steps half a tile behind Gianna). Azzy's hand
  goes to his sword and Gianna's hand goes to Azzy's wrist (shown).
- The Regent: "No steel inside the walls, by the old courtesy. Keep your sword, Brasador; you will find no one to use
  it on. You have come to read a page. Everyone who comes to Eightgate comes to read a page. The Archive is sealed for
  the Parley, by my order: the realm's memory rests while the realm talks. When the Parley closes, petition the keeper
  like anyone else." He turns to Elodie: "Envoy. Your household will want you. The Parley sits again at the bell."
  He goes up the heralds' stair with his two Sealbearers (shown). The envoys go into their chambers; the clerk stays,
  writing.
- **Elodie, under Crown eyes.** She walks to Gianna (shown) and stops at a courtier's distance, not a mother's. As the
  envoy: "The Regent is generous. Zetwal thanks him." Gianna, low: "Mother. Lord Rael told me he is our father." A
  pause the clerk's pen fills (a scratching sound, two seconds). Elodie, the one true thing she can say in that room,
  looking at the Locket and not at her daughter: **"Believe what your Locket tells you, not what his mouth does."**
  (Rael clue 2. Gianna hears: trust Grandfather's cause, not the traitor. The player who saw the signet glow at his
  one lie hears: the Locket told you he was telling the truth. `clue.elodie_locket_line`.) Then, louder, for the
  clerk: "Your aunt is in the city. She is dressing the court for the Parley and has asked for you both since the
  caravan was sighted. The Envoys' Quarter, the door with every colour on it. Go." She goes into Zetwal's chamber; the
  clerk follows her in. Anissa: "She didn't look at me, Gigi." Gianna: "She looked at the man writing down what she
  said." (The one line that tells the player the rules Elodie is under.)
- On the way out the **chamberlain** steps into their path (shown) with Se-5's hook: eight chairs, seven envoys,
  "and the eighth house sends its son, not an envoy" (Azzy). Section 7.2.
- Journal: **The Regent's welcome** (done `story.elodie_hall`), the note *Under Crown eyes* (Elodie's Locket line,
  word for word, in the Journal's clues).

### Beat 4: Tati Coco (seat-quarter, then seat-workshop)

- The Envoys' Quarter: a lane of embassy houses with the houses' colours on the lintels, the **Crown's guarded wing**
  (a Sealbearer at its gate; Elodie's rooms are inside it, the door the player cannot open in the release: "Zetwal's
  envoy's rooms. The Crown's clerk sits outside them." Se-1's door, after the release), and **Coco's workshop**, the
  one door painted in all eight colours, bolts of cloth drying on a line across the lane.
- Staged: before the party reaches the door it opens and **Coralie** comes out at speed, pins in her mouth, a tape
  measure round her neck, eight colours on one dress, and walks straight through Yari and Azzy to the sisters (the
  stage cue `walk` with the party line parting). She takes both their faces in her hands. "Gold. I said gold when you
  were four and I was right. And indigo. Don't argue; I dress queens, I don't ask them." Anissa says nothing and leans
  into it; Coco holds on a second longer for her than for Gianna, and says, plainly, "There you are." (No joke on
  Anissa; the warmth is the line.)
- Inside the workshop (the fitting room: a dais, a mirror, the court's robes on dummies in eight colours; a back room
  with a curtain). Coco: "Your mother sent you. Of course she did; she can't be seen to." Then business: she dresses
  the keeper of the Archive for the Parley, **Keeper Hollis**, who has not left the Archive in eleven years and will
  not for a Regent; her seamstresses carry his robes in past the Sealbearers each morning at the bell. "Two
  seamstresses. Two veils, two aprons, and neither of you is built like a Brasador." Azzy: "Absolutely not." Coco:
  "I wasn't offering. You'd tear the seams." (Comedy, two lines, nowhere near Anissa.) Yari, Azzy and Samira stay with
  her ("Three more pairs of hands and a Dorini to price the thread").
- The bell is tomorrow's: "Until the bell, be seen. The Regent counts who stands where. Stand in a lot of places."
  (`story.coco_plan`; the day gate, section 6, opens: Se-5, the debate, Se-3.)
- Journal: **Tati Coco** (done `story.coco_plan`), then **Until the bell** (done through the side quests).

### Beat 5: The day in the city (the required quests, any order; the arrow follows the ground)

- Se-5 *A Seat for Every House* (stage 1, the petition round the chambers: the Hall), the debate *Four Voices* (the
  fountain), Se-3 *Deserters' Road* (the gate yard's pilgrims, the Crossroads Fields). Section 7. The library
  (the Archive) is sealed, so the Hall's four books and the Outfitter are the day's other stops.
- When the third of the three completes: the light turns to evening on the concourse (a flag variant,
  `story.seat_eve`, as Chapter 4's dusk), and Coco stands in her doorway: "Bed. The bell is early and I am not."

### Beat 6: The seamstresses (seat-workshop, then seat-concourse, then seat-archive)

- Morning (the flag variant clears). The dressing is staged in the fitting room: Coco pins the veils; the sisters'
  sprites change to the **seamstress look** (a veil and apron recolour of each sprite: two placeholder looks); the
  party **splits**: Yari, Azzy and Samira stay (they are not drawn behind Gianna from here until beat 9; section 10).
  Samira, as the door closes: "If they take the robes, I've invoiced them." Nothing more.
- Coco leads (a walker) across the concourse to the Archive's sealed door, carrying a robe; the sisters carry the
  rest. The Sealbearer at the chain: "Two yesterday. Two today. Names." Coco, fearless, over him: "Count them, then.
  Two. Shall I tell the Lord Regent his keeper went to the Parley in his nightshirt because the door could count to
  two but not to three? Chain." He lifts the chain (shown). Anissa walks under it last, and the Sealbearer watches her
  go, and that is all he does.
- Inside: the **Throne Archive**: the realm's memory, shelves to the roof, the **Accord under glass** on its table at
  the centre, the **seven-drawer cabinet** against the wall, the gallery above, and **Keeper Hollis**: old, dry, in
  slippers, the only person in the city who is not afraid of the Regent because he is not afraid of anything that
  happened less than fifty years ago. Coco fits him on a stool, talking the whole time (her patter is the scene's
  cover; the clerk is at the Parley). Hollis looks at Gianna's hands as she holds the pins: "Those are not a
  seamstress's hands. That is ink, under the nail, there. Temple Archive?" Gianna: "Junior archivist." Hollis: "Then
  you came to read a page, like everyone. Read it, then. It is under glass. Six pages. Everyone reads six pages and
  goes away."
- Coco, to the sisters, low: "I have about as long as a sleeve takes. Go and look at your page." She keeps Hollis on
  the stool (the scene runs on a timer in the fiction, not in the engine: nothing fails).
- Journal: **The seamstresses** (done `story.archive_entered`).

### Beat 7: The sealing (the Echo; SIG-SEA, section 8)

- The Accord under glass: six pages, seven ribbons, the seventh ribbon trailing to nothing, **unknotted**. The
  cabinet: seven drawers, each relabelled with a house sigil on a brass plate; carved numbers under the plates,
  worn. The **Echo zone** covers the Archive's floor; the **Echo site** is the Accord's table. Anissa stands at the
  site and holds the door, glowing, in a seamstress's veil (the chapter's picture: the goddess's light in a servant's
  apron, in the Crown's own Archive).
- **The Echo: the sealing of the Accord, fifty years ago.** The Archive, newer, fewer shelves. The signed original
  arrives in a Crown courier's case; the **Throne's clerk** (the one "who sealed the seventh page and never spoke
  again", `CAPITALS.md`'s *The Throne's Clerks*) takes it; **young Patricio** (the player) stands at the table with
  the alliance's seal; **young Benny** (an NPC here, not the Echo follower: section 10) at his shoulder; the Crown's
  envoy of the day; and in the gallery a boy clerk at a side desk copying: **young Thomas Stillwater** (Chapter 9's
  setup). Caona is not in the room, and the game says why it matters: Patricio looks for her and the clerk says
  "Xaraguá's scout was not sent for. Xaraguá is not a signatory." Staged in order: the clerk reads the seventh page
  **to himself**, lips moving; Benny: "Read it aloud." The clerk: "It is read to the Throne's clerk. That is the
  form." Benny: "Then the form is a lie, and I will not put my name to it. Aloud, so the boy writes it: Ardencia
  refuses the seventh page." (He walks out: shown, down the nave, the door.) The Crown's envoy to Patricio: "The
  ships sail at the tide, Marshal, with the peace or without it. Six pages are read. Seal the binding." Patricio
  (choice, both remembered, neither changes the outcome, `choice.patricio_protest`): "Under protest of time." /
  "Write that I did not read it." The clerk seals the page with the Throne's wax and puts it **in a drawer, not the
  binding** (shown: he walks to the cabinet, opens a drawer, the number carved on it visible, closes it, pockets the
  key). The player, as Patricio, speaks to Thomas in the gallery (optional): "Was Xaraguá asked?" Thomas, not looking
  up: "I am writing that they were not. Someone will read it one day." (Chapter 9's record.) The puzzle's anchor: a
  thread from the unknotted seventh ribbon, tied on that drawer's handle (section 8).
- **Back in the present:** the drawer with the faded red thread, under a Suzumori fan plate, carved "4". Locked. Hollis
  has the key and will not use it for a seamstress; he will for an archivist with an argument (section 8's Parley,
  the keeper's law). He opens it. The sealed page, the Throne's wax unbroken. Hollis: "I have kept a ribbon with no
  page for eleven years. I will not break the Throne's wax; that is not keeping. But the Throne's own law says a
  sealed page may be opened and heard in the Hall when a signatory's envoy demands it in Parley." Gianna: "Zetwal's
  envoy is my mother." Hollis: "Then your mother will have to say so out loud, in front of him. Take off the veil,
  child. You are about to be an archivist in public."
- Journal: **The sealing** (the Echo and the thread; done `anchor.ribbon_thread`), **The keeper's law** (done
  `story.hollis_agreed`). The signature puzzle pays 60 XP.

### Beat 8: Read aloud (seat-hall, the Parley)

- The party walks from the Archive to the Hall with Hollis carrying the page in both hands (shown: Hollis, then the
  sisters, Coco behind with the robe over her arm; the Sealbearers at the chain let the keeper pass because he is the
  keeper). Yari, Azzy and Samira join at the Hall's steps (the split ends; `party.rejoined`).
- The Parley in session: the Regent at the Throne's foot, the seven envoys at their chairs' backs (the chairs stay
  empty; the envoys stand), the legate, the clerk. Hollis walks the nave with the page (shown) and the Hall goes
  quiet. The Regent: "Keeper. The Archive is sealed." Hollis: "The Archive is. I am not. A sealed page is in the
  Hall; by the law of the Founding Compact an envoy of a signatory house may demand its reading. I am asking whether
  one does." Silence. Elodie steps forward from Zetwal's door, one step, which is the step she did not take in beat 3
  (shown), and says the envoy's words: "Zetwal demands the reading." The Regent, after a moment, and this is why he
  is three moves ahead: "Read it. I have waited some years for someone to ask." (He wanted it read: the Charter
  stands on it; a clause read aloud is a clause in force. The player feels the trap close; Gianna does not, yet.)
- Hollis breaks the wax (sound: a dry crack) and **reads the Seventh Clause aloud for the first time in fifty
  years**, the `CAPITALS.md` wording: **"The harbor of Xaraguá and its waters are given into the keeping of the Crown
  of Aldermoor, at the Crown's pleasure, to be revisited."** Then, because he is a keeper: "Signed by the Marshal
  under protest of time" (or "with a note that he did not read it", by the Echo choice). "Refused aloud by the Lord
  of Ardencia. Witnessed by the Dorini bank. Xaraguá was not sent for."
- **Yari's line** (the Chapter 4 outline asked that she, not Gianna, have the line after the clause: she has seen
  the harbor sold three times now): "'To be revisited.'" She walks to the empty eighth chair, Xaraguá's, and puts
  her hand on its back (shown). "Fifty years. Nobody revisited it. We fought beside you and you wrote us down as
  waters." The Regent: "We are revisiting it now, Yari of Xaraguá. That is what a Parley is for." `clue.seventh_clause_read`;
  the Hall book *The Seventh Clause* appears; the Journal note *The seventh clause* is rewritten with the wording.
- Journal: **Read aloud** (done `clue.seventh_clause_read`).

### Beat 9: The Regent's terms (seat-hall)

- The Regent comes down three steps, the first time he has moved toward anyone (shown), and makes his offer to
  Gianna in front of the Hall, calmly, as a kindness: "Terms. The Charter of Protection stands; the clause you just
  heard is its law, and you heard it read by the Throne's own keeper at your mother's demand. In return: the harbor
  is revisited, in ten years, by this Hall. Xaraguá's cacique goes home to his house without a guard. Zetwal's envoy
  keeps her seat and her... household goes home to Zetwal, untroubled, and stays there. Say yes and the war your
  grandfather fought stays won." Nothing is said of Anissa; he does not look at her this time, which the player
  notices because he did in beat 3 (the Regent's hand stays hidden; the Hushed is unmasked in Chapter 9, not here).
- Gianna's refusal is a choice with one outcome (both remembered, `choice.refusal`): "Xaraguá was not asked. I am
  asking them." / "My grandfather signed under protest. I am the protest." The Regent, unbothered: "Then win the
  houses, if you can. Eight gates; the roads are open. They always were. I will be here. I am always here." He goes
  up to the Throne's foot and puts his hand back on its arm (shown). The envoys withdraw; three of them (Skarragol,
  Kuroshi, Jwaladesh) look at Gianna on the way out, which is the roads opening, shown (and Se-5's petition round has
  already told the player what each house needs).
- Elodie, for the clerk: "Zetwal's envoy records that her household declined the Regent's terms." Then, in the same
  voice: "Coralie. The fitting. I am expected at the Parley's close." (Her exit from the public scene is her way to the
  private one.)
- Journal: **The Regent's terms** (done `story.terms_refused`).

### Beat 10: The fitting (seat-workshop, the back room: the private line)

- Coco's fitting room, the curtain drawn (shown: Coco pulls it; the Crown's clerk waits in the lane outside the
  painted door, visible through the window as a sprite that never moves). Elodie on the dais, Coco pinning her, the
  sisters; Yari, Azzy and Samira in the front room (Samira pricing the Parley robe aloud, once, through the curtain:
  "Two hundred, the thread alone." Coco: "Three. Quiet.").
- **Elodie explains why she hid the marriage** (STORY beat 5), in the one room in Eightgate with no Crown pen in it:
  the children's safety (a Rodriguez child in Zetwal is a Brasador hostage; a Limyè child is nobody's); the claim
  (two bloodlines of claimants in one cradle would have had the Regent's attention from birth, and "he looked at your
  sister today the way he looks at a page"); and her name ("I took Limyè to honor the goddess, I said. I took it so no
  one would count you.") Gianna: "He sold Xaraguá. He sold us." Elodie does not answer that. She says the second true
  thing, privately, looking at Coco's pins and not at her daughter: **"He should never have tested you."** Gianna
  takes it as the duel law: the Trial of Blades, a father putting his daughter on the sand. (The player may take it
  as a mother who knows the test was his idea and his plan, and that it was a test, not a trial. Rael clue 2 complete;
  `clue.elodie_tested_line`.) Anissa, after: "Mama. He didn't let them hit me." Elodie, the only crack in her: "No.
  He wouldn't." (Shown: she puts her hand on Anissa's head and takes it away before the curtain opens. No more.)
- The roads, in her mouth as the envoy, because she cannot say "go": "Ironvow's envoy came to my door last night. Their
  sacred standard is stolen and their council is selling the fleet to the Crown for blockade money. Kuroshi will not
  speak to anyone until Skarragol has. Jwaladesh cannot afford to speak at all. If someone were going, they would go
  north first." (The fixed order, Skarragol then Kuroshi then Jwaladesh, as a diplomat's reading of the realm, so
  the owner's Oct 20 decision is the story's and not the menu's.) The curtain opens; the clerk is at the door; Elodie
  is the envoy again: "Coralie. Thank you. The hem is perfect." She goes.
- Coco, to the sisters, after: "She'll be at that Parley till the Crown lets her go, and it won't. I'm here till the
  robes are done, and they're never done. Come back through this door whenever the road brings you past, and bring
  me every colour you find." (She stays: Chapter 12 finds her here.)
- Journal: **The fitting** (done `story.fitting_done`).

### Beat 11: The Iron Gate (seat-concourse, then the card)

- The party walks the ring road to **Skarragol's gate** (grey iron, a horse-tail standard with no standard on it: the
  gate's own clue), Coco walking them there (shown; she waves with both arms, which is the one flamboyant thing she
  does in the open: "North! Furs! Bring me a colour I haven't got!"). The pilgrims Se-3 saved, if saved, are at the
  gate with their deserter escort (a callback sprite group). The gate opens on the north road.
- Card: *Chapter 5 complete, The Parley. Next: Chapter 6, The Stolen Standard.* `act5.complete`. `?chapter=6` starts
  on the Winter Plateau road outside Ordvik (section 14).
- Journal: **The Iron Gate** (done `act5.complete`; pays no XP: a card).

**Chapter 12 on these same beats:** the Claim replays beats 3, 8 and 9 in the same Hall with the ropes gone and the
chairs filled or not (Se-5): the Regent stands where he stood, Gianna walks the nave she walked, and stands on the
tile he only ever touched. The Archive's Echo (Patricio, Benny and Caona one last time) uses the beat 7 zone with a
different scene. The Hearing sits in the Hall. Coco dresses Gianna for the Claim (one line). Nothing in Chapter 12
needs a new Eightgate map: only states (section 3).

---

## 3. The maps (built once; the Chapter 12 column says what changes then)

All new, drawn in code the way Cenizal and Bab al-Dhahab are (`tools/maps/seat.ts` through `painter.ts`, then
`npm run maps:build`), registered in `data/maps.ts` and `CITIES` (`data/rpg.ts`, city id `seat`). Neutral, ancient,
worn stone with the eight house accents only on the gates and the chamber doors; Aldermoor's grey-violet on every
Sealbearer. Nothing wooden like Pòdlimyè, nothing red like Cenizal, nothing domed like Bab al-Dhahab. Accent
`#8f8578` (the realm map's `seat` stone). English, formal: no phrasebook entries, so this is the one capital with no
fluent-reader risk.

| Map | Size (tiles) | Section | Echo | Chapter 5 | Chapter 12 and the Hearing (state only) |
|---|---|---|---|---|---|
| `seat-gateyard` | 32 x 20 | The Gold Gate's caravan yard (outdoor) | none | The caravan, the Sealbearers' arch, the gate clerk, the Pilgrims' stall, the contract board, the pilgrims (Se-3), the door to the Crossroads Fields | The allied armies' camp outside the gate is a flag variant (banners, tents); the pilgrims are gone |
| `seat-concourse` | 48 x 34 | The Eight Gates Concourse (hub, outdoor) | none | The ring road and the eight gates (each a door: Skarragol's opens at the end of the chapter; the others say why they are shut), the fountain and debate corner, the market, the Outfitter, the Hall's forecourt and steps, the Archive's sealed door and chain, the lane to the quarter; an evening variant (`story.seat_eve`) | The chain is gone (`story.harbor_won`); Crown Marines and Sealbearers on the ring (the 28 to 30 table outside, section 5); the gates the player's allies hold carry their banners |
| `seat-hall` | 44 x 32 | The Throne Hall (the seat of government, interior) | none | The nave, the Throne tile roped off, the eight chairs, the eight embassy chambers (Zetwal, Xaraguá bricked, Ardencia empty, Al-Doria, Skarragol, Kuroshi, Jwaladesh, Aldermoor's legate), the heralds' stair, the Regent's offices (closed), the records room with the four Hall books, the chamberlain's desk | The ropes are gone and the tile is walkable (the Claim: a step trigger); the chairs fill by Se-5's tokens; the Regent's fight uses the nave as the arena; the Hearing seats the witnesses on the chairs |
| `seat-quarter` | 28 x 18 | The Envoys' Quarter (outdoor lane) | none | The embassy houses, the Crown's guarded wing (Elodie's rooms behind it: closed in the release, Se-1 after), Coco's painted door, the washing line | Coco's door still opens; the wing's Sealbearer is gone after the Harbor |
| `seat-workshop` | 20 x 12 | Coco's workshop: the front room and the fitting room behind a curtain (interior) | none | The dummies in eight colours, the dais, the mirror, the window on the lane (the clerk), the curtain (a door object that opens on `story.terms_refused`) | Coco dresses Gianna for the Claim (one scene, same room) |
| `seat-archive` | 28 x 20 | The Throne Archive (the library, interior) | **the whole floor** (the sealing, fifty years ago); site: the Accord's table; anchor: drawer 4 | The Accord under glass, the seven-drawer cabinet, the gallery (Thomas's desk in the Echo), Hollis's stool and desk, the shelves (the Archive's books, section 7.4), the sealed door inside the chain | The final Echo (Patricio, Benny and Caona) in the same zone with a different scene; the Ribbon's hearing (S-SEA, after the release) at Hollis's desk |
| `seat-fields` | 46 x 28 | The Crossroads Fields (wild, outdoor) | none | The roads meeting outside the walls, the pilgrims' camp, the deserters' camp at the crossroads (Se-3), the ambush layer (`crossroads`) | The same map with the 28 to 30 table (`story.harbor_won`) |

Seven maps: `CAPITALS.md`'s five, with the **gate yard** added (the arrival must be a place, not a fade, and it is the
one outdoor area the Sealbearers do not watch) and the **workshop** added for Coco (the private scene needs a room
with no Crown pen in it). Five outdoor areas (the gate yard, the concourse, the quarter, the Hall's forecourt on the
concourse map, the fields), the owner's rule. The Hall is central and large (44 x 32, the seat paragraph's size, not
the table's), staffed, and full of political people who disagree: the legate, the chamberlain, four envoys with four
different fears, the clerk, Elodie. The Echo validator's rule holds: the Archive's zone is the one Echo in the
chapter, every tile walkable in both eras, one anchor (the ribbon thread on drawer 4).

**Drawn placeholders** (code, through `assets.config.ts`): the eight gates are one arch recoloured eight times; the
Throne tile is the board's sun-and-rays glyph at 32 x 32; the chairs one sprite; the banners one sprite in eight
colours; the Accord under glass a 2 x 1 object; the cabinet a 3 x 1 object with seven drawer sub-objects.

---

## 4. The truce: a chapter with no boss, and what stands in for one

- **What the design asks:** no boss (a flag of truce); `STORY.md` proposes one Echo skirmish in the Archive; the Opus
  review lists "Chapter 5's Archive" among the three Echo battles the story has.
- **What the engine has:** present-era battles with phases, reinforcements, `withdraws` and `floor` (Chapter 3), the
  scripted loss, Parley by realm Influence (`PARLEY_CHANCE`), the Yield step only if the economy foundation lands it
  (Chapter 4's risk). **Echo battles do not exist**: no Echo party fighters as data, no Memories, no "old uniform"
  looks. Patricio alone in the Archive (Caona is not in the room; Benny refuses and walks out) would be a one-fighter
  Echo battle on top of that.
- **The design here (Claude's call, section 12):** no fight inside the walls in either era. The chapter's tension
  is the Parley itself: the Regent's naming of each of them, the sealed door, the disguise, the clerk's reading, the
  wax breaking, the terms. Its fights are outside the walls, in the Crossroads Fields, where the Crown's own deserters
  and the Quiet Crown's zealots are the realm's state shown (Se-3). The old courtesy ("no steel inside the walls,
  allegedly") is kept true in Chapter 5 and in the sealing, so the first steel drawn in Eightgate in the whole game is
  the Regent's Challenge in Chapter 12, which is what a Claim should feel like.
- **The Regent as an antagonist with no fight:** he is three moves ahead on the map. He names them before they are
  announced; he has sealed the Archive before they arrive; he lets the clause be read because the Charter stands on
  it; his terms are generous and a cage. Everything he does is shown by where he stands: the hand on the Throne's
  arm, the three steps down, the hand back. He never raises his voice and never addresses Anissa, and the one breath
  he looks at her is the scene's threat. His fight is Chapter 12's, with the three phases `COMBAT.md` 13.3 gives him.

---

## 5. The chapter's fights and levels

| Fight | Where | Foes | Level | Party then | Band | Pays (engine rule: 10 XP and 4 gold per foe per level) |
|---|---|---|---|---|---|---|
| Ambushes (`crossroads`, from `story.seat_arrived`) | the Crossroads Fields | Crown Marine x2, deserters (old coats, no officer); Road Bandit x3; Quiet Crown Zealot x2 ("The little one glows, they say.") | 14 to 15 | 14 | even | 280 to 420 each; the route meets one on the way to the deserters' camp |
| **The deserters' camp** (`deserters_road`, Se-3) | the crossroads camp | the **Deserter Sergeant** (Crown Officer frame, support, level 15; *Rally*, *Order*) + Crown Marine x2 (14) | 14 to 15 | 14 | even | 150 XP flat (data), 120 gold: section 7.1 (the fight ends by his withdrawal and a Parley, not a kill) |

All three enemy types exist from Chapter 2 (Marine, Bandit, Zealot); the Sergeant is a Crown Officer recolour (the
Officer is in `COMBAT.md` 13.2 for Xaraguá 6 to 8; if Chapter 2 did not build him, he is a Marine with *Rally*).
The **Husher** (the design's Seat pairing, Zealot and Husher at 15 to 16) is not built here: he is the Kuroshi tier's
enemy first and needs *Hush* and *Seize* on a standard enemy; he arrives with Chapter 7. After the War of the Harbor
(`story.harbor_won`) the same layer uses the 28 to 30 table (Husher and Sealbearer groups, Marine and Officer),
which Chapter 12 builds.

**Levels through the chapter** (from level 14 on the route, 3,280 XP; add Al-Doria's library and the second desert
ambush for a player who did them, about +370):

| Point | XP from | Running total | Level |
|---|---|---|---|
| Start (the Gold Gate) | | ~3,280 | 14 |
| The herald, the Regent's welcome, Tati Coco (three objectives at 45) | 135 | ~3,415 | **15** |
| Se-5 stage 1 (the petition round: 100) | 100 | ~3,515 | 15 |
| The debate *Four Voices* (joined 15, mediated 25; the quest 40) | ~60 | ~3,575 | 15 |
| Se-3 (one ambush ~280; the camp 150; the reward 120) | ~550 | ~4,125 | 16 |
| Until the bell, the seamstresses, the sealing (the puzzle 60), the keeper's law, read aloud, the terms, the fitting (six objectives) | 330 | ~4,455 | 17 |

That is two levels over the target (15) as played, and the no-side-quest line (3,280 + 135 + 330 = 3,745) lands at
**15**, on target. The over-run is the chapter's required content paying Chapter 5 rates on a 20-minute chapter, so
the dials are: (1) `noXp` on the watched scenes (the Regent's welcome, read aloud, the fitting are scenes the player
mostly watches: marking those three `noXp`, as Chapter 3 marked "The Lord's guests", takes 135 off), (2) Se-3's
ambush is random and not on the route (the route walks the road; the simulator does not count ambushes), which takes
280 off the counted line, (3) Se-3's reward at the band's floor (150 XP in `SIDE-QUESTS.md`; 120 here). With those
three: as played about **3,890 to 4,040, level 16**; without side quests about 3,610, level 15; a player who also
reads the Archive's and the Hall's books (+40) and fights twice in the fields reaches 17, which is Chapter 6's top.
**Recommendation: tune so the route ends at 16 and the skip line at 15** (`LEVEL_CURVE.slackOver = 1` calls 16 on
target), since Chapter 6 is 15 to 17 and its first fights are at 15. The simulator (`tools/level-curve.ts`, with
Chapter 5's route marker `chapter5-end`) confirms before the build; `CHAPTER_LEVELS` keeps `to: 15`.

**Gold:** about 900 in; Se-5 100, Se-3 120 plus the camp's 120, the ambush about 170, the debate nothing. Out: the
Pilgrims' stall (faith tokens at 150 each, section 7.4), the Outfitter's tier 16 (a warden's coat for Azzy about
700, a court bow for Yari about 650, a keeper's robe for Gianna about 600, a sealed satchel charm for Samira about
450: the player affords one or two, which is the point of a Throne city's prices), Samira's Daftar in the fields.
Nothing in the chapter requires spending.

---

## 6. The required-before gate: "Until the bell"

- **In the story:** Coco names the hour (the seamstresses go in at the morning bell) and tells them to be seen until
  then: "Stand in a lot of places." She does not say "three quests"; she says: "Your friend with the bow has a paper
  she wants every house to read; the fountain has four people shouting about your family's chair; and the pilgrims
  at the gate have been robbed by the Crown's own and nobody in this city will say so out loud."
- **In the Journal:** the objective **Until the bell**, done through the side quests (`followSide`, as Chapter 1's
  *Unfinished business*, Chapter 2's *Until the elders sit*, Chapter 3's *Until noon*, Chapter 4's *Until dusk*), so
  the gold arrow leads to the next quest's stop. Done when Se-5 stage 1, the debate (joined or mediated) and Se-3
  are done, **or** when `story.archive_entered` is already set (a save made at the chain never sticks).
- **On the map:** Coco's workshop door, from the evening on, is the morning's trigger: it waits for the three (`if:
  'side.seats.stage1, side.deserters.done, debate.seat_voices.joined|debate.seat_voices.mediated'`); until then Coco, in
  her doorway, worded from the flags: "Yari's paper is still in her hand." / "The fountain is still shouting." / "The
  pilgrims are still at the gate." Anissa: "Your Quests page, Gigi."
- **The evening variant** (`story.seat_eve`) is set when the third of the three completes: the lamps on the ring
  light, the envoys' windows glow, the Sealbearers double at the Archive's chain. It clears on `story.archive_entered`.
- **Order the arrow follows:** Se-5 (the Hall, where the party stands after Coco: back up the lane and the steps),
  the debate (the fountain, on the ring), Se-3 (the gate yard's pilgrims, the fields, the camp, back). Then Coco's
  door.
- **No soft-locks:** Se-3 is the only required step outside the walls; the fields' ambushes are at the party's level
  and Game Over returns the party to the gate yard; the camp fight cannot be lost in a way that blocks (the Sergeant
  withdraws at 50% and the Parley has no failing branch, section 7.1); the Archive needs only the Locket; the
  Hall's books are optional and the Archive's are readable only after the chain lifts (beat 6 on).

---

## 7. The two required side quests and the debate

Why these, from Se-1 to Se-5 and the Opus minimum: **Se-1 Volume One** and **Se-4 The Unknotted Ribbon** are named
for after the release (the plan; Se-4 cannot be finished before Chapter 9 anyway). **Se-2 Four Voices** is the
city's debate corner, so it is the required debate quest, not a side quest. That leaves **Se-3 Deserters' Road**, the
chapter's only fights and a quest whose answer is a Parley in a chapter called The Parley, and **Se-5 A Seat for
Every House**, whose Chapter 5 stage is made playable (the petition round the eight chambers) rather than a hook
line, because it is the cheapest way to meet the realm's envoys inside the seat of government and hear, from each,
why the three roads need walking, before the Regent says "the roads are open": the roads then open on things the
player has already heard, which is showing. No new quest is added: Coco's help is the main story, as settled.

### 7.1 Deserters' Road (Se-3; the chapter's fights)

- **Opens:** the bandaged pilgrim in the gate yard, from `story.coco_plan` (she is there from arrival; her quest
  waits for the day). Shows as *??? The pilgrims at the gate* until spoken to.
- **Steps:** 1) The pilgrims (a Gaze pilgrim, a Four Hands pilgrim, a Witness pilgrim, a fourth who says only that
  he is "nobody's") were robbed at the crossroads by Crown deserters: the Charter's garrison pay stopped reaching the
  road posts two months ago, and the men left the posts hungry. "The Regent's clerks say there are no deserters. The
  Regent's clerks have not walked the road." 2) The Crossroads Fields: the road to the camp (the ambush layer; the
  route meets one group), the deserters' camp at the crossroads: a Crown wagon on its side, a cook fire, three men
  in old coats. The Sergeant walks out (shown) and stops them: "Toll. Everything in the bags." Azzy: "Try." The
  fight `deserters_road`: the Sergeant (support: *Rally* Inspires the marines, *Order* gives one a turn), two
  Marines. The Sergeant has a **floor at 50%** and a `withdraws` line (Chapter 3's mechanism, no new system): he
  lowers the bayonet: "Enough. Enough. We're hungry, not dead." The marines step back with him. 3) **The Parley on the
  map** (a dialogue, not the battle command, so the economy foundation's Yield is not needed): three choices, all
  remembered: **"Escort the pilgrims instead. They pay in food."** (the design's answer: `side.deserters.spared`, +1
  Influence at the Seat, the deserters appear at the Iron Gate in beat 11 and as the Harbor's +5 soldiers) /
  **"Samira. Pay them."** (if `party.samira`; gold -120; `side.deserters.paid`, +1 Wealth; they leave the road and
  are not at the Harbor) / **"Leave the road, or the next ones through here are Brasador."** (Azzy's; `side.deserters.broken`,
  +1 Fear; fewer ambushes for 100 steps, nothing at the Harbor). The pilgrim's thanks on the return, by branch.
- **Reward:** 120 XP, 120 gold (the camp's 120 come from the fight), +1 pillar by the choice (Seat). The band's
  floor (150 XP in `SIDE-QUESTS.md`) comes down for the level curve (section 5).
- **Why it fits:** the Charter's cost shown on the Crown's own men; a Parley the player conducts the day before the
  Regent conducts his; the realm's roads unsafe before the party is sent down three of them.

### 7.2 A Seat for Every House (Se-5; stage 1 of 2: the petition)

- **Opens:** the chamberlain's hook in beat 3: eight chairs, seven envoys, "and the eighth house sends its son"; he
  will not carry Xaraguá's Petition of Breach to the chambers himself ("I am the Master of the Chairs, not of
  doors"). Yari has the petition (the Hall book *Petitions of Breach* says Xaraguá's was never heard; she carries a
  copy from her father's house: `item.petition`, given in the scene, set here unless Chapter 2 built it).
- **Steps (stage 1, Chapter 5):** carry the petition to each embassy chamber (seven doors; one scene each, Yari
  speaking, Gianna beside her), in any order, the arrow following the nearest:
  - **Al-Doria:** the guild's envoy (a cousin of the chief scribe) takes it and files it: "The bank witnessed. The
    bank does not sign." Samira, from the door: "The bank was paid." He does not look at her.
  - **Skarragol:** Ironvow's envoy, a big woman with no standard on her brooch: "I would swear to this on the
    standard. We have no standard this season. Ask me again when we do." (Chapter 6.)
  - **Kuroshi:** Suzumori's envoy, who reads it twice and hands it back unsigned: "Kirinoura is neutral. It is
    written down. Everything about us is written down." (Chapter 7.)
  - **Jwaladesh:** Agnivansh's envoy, in a coat too thin for the Hall: "The flame is low. We have come to the Parley
    to sell a sacred thing to the Crown, and I am the one who has to say so. Give me the paper. I will hold it, at
    least." (Chapter 8.)
  - **Aldermoor:** the legate refuses the door: "The Crown does not receive petitions against the Crown." Edmund's
    first mention: the legate's aide, "terribly sorry", opens it a crack and takes the paper anyway.
  - **Ardencia:** the chamber is empty, the banner hung, the chair's dust undisturbed. Azzy goes in alone (shown) and
    leaves the petition on the chair. "He sends his son." (`side.seats.ardencia`, Azzy's line is the scene.)
  - **Zetwal:** Elodie, with the clerk at her shoulder: she takes it as the envoy: "I will read it into the Parley.
    The record will show that Zetwal did." (This is why, in beat 8, she is the signatory's envoy who demands the
    reading: the player has watched her accept the paper.)
  - **Xaraguá:** the bricked door. Yari puts the last copy against it. No line.
- **Then** the chamberlain: "Seven answers, one empty chair and one wall. The chairs fill at a Claim, not a Parley.
  Bring me a token of goodwill from every house that will sit with you, and I will put each on its chair the day
  someone stands on that tile." (`side.seats.stage1`; stage 2 is the design's token collection, Chapters 6 to 12,
  paid at the Claim: 400 XP, +5 Stability, the standing council in the Just Throne ending.)
- **Reward (stage 1):** 100 XP, 100 gold, +1 Influence (Seat). No fight, no Echo, no map change: seven doors and
  eight short scenes on the Hall map.
- **Why it fits:** the seat of government is "where the story's diplomacy happens" (owner rule, Oct 15); the three
  roads' troubles are heard from their own envoys before the roads open; Se-5's long collection has a beginning the
  player did instead of a line the player was told.

### 7.3 The debate, required: *Who may sit the Throne?* (Se-2 Four Voices)

- **Where:** the fountain at the centre of the concourse. **Opens:** from `story.coco_plan`.
- **The four speakers** (guide 7.2: all four faiths; the guide's canon, 6.6, that the sources must contradict each
  other on whether Elodie blessed the Throne): a **Gaze keeper** (she blessed it; the sun-marked heirs are her sign),
  a **Four Hands pilgrim** (a Sky-Rider: the Throne is a prize of the founders' war, no god touched it; "the land is
  remembered, the chair is just a chair"), a **Witness contract-priest** (the Throne is a contract between eight
  houses; whoever keeps the Founding Compact may sit it, blessed or not), and a **Quiet Crown speaker** (one hand on
  the Throne brings the Quiet; the argument itself is the noise). The built debate shape (`engine/debate.ts`: listen,
  join, mediate, provoke; three rounds; scripture, reason, compassion) holds **four voices** by running three rounds
  each against a different opponent, the ally rotating: round 1 the keeper (ally) against the Sky-Rider, round 2
  the priest (ally) against the Quiet Crown speaker, round 3 the Quiet Crown speaker's claim against all three (the
  player answers for the three). If the engine's `ally`/`opponent` is one pair per debate, the fallback is two
  debates on the same corner (keeper and Sky-Rider; priest and the Quiet Crown), the quest done when both are.
- **Reason needs** one of the Hall's books (*The Founding Compact*, *The Rules of Claim* or *The Regent's
  Commission*; the Archive is sealed during the day, so the Hall's four are the day's reading).
- **Mediate** needs Influence 12 at the Seat (the design's number; the Seat's Influence comes from this chapter's
  quests and books, so Mediate is reachable by a player who reads, and Join by everyone). The Quiet Crown speaker is
  never shown as a cult: he is reasonable, tired of shouting, and the thing Anissa says after ("He wants everyone to
  stop talking, Gigi. Everyone.") is the only judgement.
- **The quest:** *Four Voices*, required, 40 XP, +2 Influence (Seat), +5 Concord on a mediation. After the Harbor Turn
  the corner rewrites itself (guide 7.2; Chapter 11's build).
- **Chapter 12:** the same corner, the post-Harbor question ("a faith that began as a political tool: is it still a
  faith?"), the Quiet Crown's own followers speaking for themselves.

### 7.4 Books, vendors and the board (the day's other stops)

- **The Hall (4):** *The Regent's Commission*, *The Seventh Clause* (appears after beat 8), *Petitions of Breach*,
  *The Council of Eight*. **The Archive (8 for the release, of the design's 10):** *The Weaving*, *The Founding
  Compact*, *The Rules of Claim*, *The Sun Accord, Sealed*, *The Throne's Clerks* (the clerk who sealed the page and
  never spoke again), *Ash Wars: The Envoys' Summary*, *The Four Faiths at the Seat*, *The Claimant Families*
  (Limyè, Jean-Philippe and Rodriguez all listed: a player who reads it before beat 10 gets Elodie's "so no one
  would count you" with a jolt). *The Envoy's Handbook* and *The Eight Gates* follow after the release. The Archive's
  shelves are readable from beat 6 on (the chain lifts for the seamstresses) and after the chapter (Hollis leaves
  the door open to "archivists"). Reading one gives +1 Influence (Seat).
- **Vendors (English, formal):** the Concourse market ("Good day to you, traveller": one healing item from each
  capital reached so far), the Envoys' Outfitter ("Madam. Do come in.": tier 16), the Pilgrims' stall ("Peace on your
  road.": the three faith tokens as charms, the Gaze's revive-once-per-area, the Witness's 10% off an ally's price,
  the Four Hands' elemental resistance; the Quiet Crown's forbidden boon is not sold here, the guide's "optional" is
  a later chapter's).
- **The contract board:** Se-3 is its escort job; "copy a damaged ledger for the Archive" and "deliver a petition of
  breach" are the design's other two; the petition is Se-5, and the ledger copy is a post-release job.
- **Anissa's nudges** (mystery quests, under 128 characters): "The pilgrims by the gate are hurt, Gigi. Nobody's
  helping them." / "The fountain's four people are all talking about our family's chair." / "Yari's paper. She wants
  every door to read it."

---

## 8. The Echo puzzle: reading the Accord (SIG-SEA, difficulty 3)

The design (`PUZZLES.md`): six pages and seven ribbons under glass; the cabinet's seven drawers relabelled with
sigils, only the carved numbers original; in the Echo the clerk files the seventh page in a drawer, not the binding;
note the number, tie a thread of the seventh ribbon round its handle (the anchor); then the archivist must agree to
the reading. Kept exactly; the staging:

1. **Present, look.** The Accord's table: six pages, seven ribbons; the seventh ribbon's end hangs over the edge of
   the glass, unknotted (the object's text: "Six pages. Seven ribbons. The seventh is tied to nothing."). The cabinet:
   seven drawers, brass sigil plates (Kay Soley, Yaguana, Dorini, Suzumori, Ironvow, Agnivansh, Brasador: a keeper's
   tidy order from a century that had forgotten what the drawers were for), all locked; under each plate a carved
   number, worn, in a **different order** from the plates (the carved numbers run 3, 1, 6, 4, 2, 7, 5 left to right:
   the drawers were moved when the cabinet was rebuilt). Looking at the cabinet in the present shows only the plates
   unless the player examines a drawer up close (a second press shows the number). The Journal notes *Seven drawers,
   seven ribbons*.
2. **Echo.** At the table (the site), the sealing (beat 7). The drawers in the Echo have **numbers only**, in their
   original 1 to 7 order; the clerk walks to the fourth from the left, number 4, and files the page (shown: the drawer
   object opens and closes; a sound). Then Patricio is free to act: the seventh ribbon on the table is a takeable
   object ("a loose thread from the seventh ribbon", `echo.thread`), and each drawer is an object; using the thread on
   drawer 4 ties it (the anchor `anchor.ribbon_thread` on the object `drawer_4`): "Patricio ties a red thread round the
   handle. The clerk does not see it. The boy in the gallery does." Tying it on any other drawer: "Nothing is in this
   one. Patricio takes the thread back." (no cost; the clerk's walk can be re-watched by leaving the Echo and
   returning: the scene replays from its trigger until the anchor is set, as Chapter 3's restartable scenes).
3. **Present, find.** Drawer 4 is now third from the right, under the **Suzumori fan** plate, and has a faded red thread
   on its handle (the anchor's present-era object, visible even if the player forgot the number: the design's
   fail-safe). Pressing it: "Locked. Keeper Hollis has the key on his belt." The faded thread is the Journal note.
4. **The keeper's law (the Parley).** Hollis, on his stool, with Coco still pinning: three ways to argue, a dialogue
   choice, none fatal: **Reason** (needs *The Sun Accord, Sealed* or *The Founding Compact* read: the Archive's shelves
   are a step away and readable now) "Clause Six says every clause is read to every signatory. A page read to the
   clerk alone was never read. The binding is in breach of itself." Hollis: "...That is the keeper's own argument. I
   have made it to the wall for eleven years." **Scripture** (the Gaze) "She remembers so no ruler can lie about what
   was done. A page nobody read is a lie she cannot remember." Hollis: "The Gaze is Zetwal's. The Throne's law is
   mine. But I take your point." (works, one more exchange). **Compassion** "You have kept a ribbon with no page for
   eleven years. Let it have one." Hollis: "Sentiment. Go and read the Compact; it is behind you. Then come back."
   (fails once, sends the player to the shelf, and the Reason answer is then open.) On any success: `story.hollis_agreed`;
   he takes the key off his belt and opens drawer 4 (shown); the sealed page; his lines in beat 7.
5. **Anissa's hints** (3 minutes stuck on Story and Normal, 5 on Hard; she is at the site, in the veil, and her hints
   reach the Echo): "Seven ribbons and six pages. Where's the seventh page?" / "In the memory, watch where the clerk
   puts it. The labels have changed since, but the cabinet hasn't." / "Drawer four. Tie the ribbon thread on it in the
   memory."

Files: `puzzles/seat_accord/solution.json` and `cheats.json`, replayed by `tests/puzzles.test.ts` like the built ones.
Difficulty 3: one observation (the clerk's drawer), one anchor, one argument; the relabelling is the only trick, and
the thread makes it fail-safe. XP: the signature puzzle's 60.

**The secret (S-SEA, after the release):** the clerk's five questions and Hollis's cross-examination use the same
Echo scene with a second trigger (the clerk's register on the side table, `echo.register`), the Echo's minute as its
anchor, and Hollis's desk for the hearing; it is finishable only after Chapter 9 (Thomas's record). Nothing in this
chapter's build should make that harder: the register object and the clerk's minute line ("Who stood for Xaraguá?",
unasked now) are placed but inert.

---

## 9. Tati Coco's part (settled, `FAMILY.md`; this is how it plays)

- **Who she is on the map:** Coralie Limyè, Elodie's sister, designer to royals abroad, in Eightgate to dress the court
  for the Parley: the Regent's household, the seven envoys, Keeper Hollis. Flamboyant (eight colours on one dress,
  a tape measure, pins; she talks in colours and never finishes a sentence quietly), generous (she gives the sisters
  her workshop as the one safe room in the city, and gives the party the thing nobody else in Eightgate will: a way
  past a Sealbearer), fearless (she talks over the Regent's own guard at the chain and wins by being more trouble
  than the chain is worth). She was bumped into in Al-Doria's cloth row in Chapter 4 (the owner's settled placement;
  Chapter 4's family slot) buying dyes: here she has the indigo she bought there on a dummy ("Zetwal indigo. Blockade
  prices. Your mother is wearing a fortune.").
- **Her help, in order:** (1) she is the reason the party has anywhere to go after the Regent's "sealed by my order"
  (beat 4); (2) the plan and the day gate (beat 4, section 6); (3) the disguise and the walk to the chain (beat 6:
  the smuggling, shown, her patter the cover); (4) the fitting room as the private scene's room (beat 10); (5) the
  walk to the Iron Gate (beat 11); (6) in Chapter 12, she dresses Gianna for the Claim.
- **The rules she keeps:** she never jokes at or about Anissa (her warmth to Anissa is a held look and "There you
  are"); her comedy is with Azzy (the veil) and Samira (the thread's price); she never says anything about Rael (she
  knows; she is Elodie's sister; she says "Your mother can't be seen to" and nothing else, so the reveal stays
  Elodie's); she is not in the Hall for the Regent's scenes (a dressmaker has no place there, and no jokes go near
  the Regent).
- **Azzy and Coco:** he does not know her (she is Elodie's side; he calls Rael's siblings Titi and Tío, not her). Coco
  to Azzy, once, measuring him with her eyes: "Rodriguez. You have his shoulders. I made his wedding coat." She says
  no more and Azzy does not ask, and the player who heard "wedding" has one more thing Gianna did not hear (she is
  being pinned and facing the mirror). Claude's call (section 12): one line, since it is true and shows what Coco
  knows without telling it.
- **Art:** a drawn placeholder (a riot of eight colours on one sprite, so she reads at a glance). Her prompt goes into
  `ART-PROMPTS.md` when the outline is approved; she is not on the Opus review's drop-2 list, so the placeholder may
  ship.

---

## 10. New systems the chapter needs (honest effort, in Opus builder-days)

| Need | What exists | What to build | Fallback | Effort |
|---|---|---|---|---|
| **The land journey** (Al-Doria to Eightgate) | sea voyages over the realm map (`engine/voyage.ts`) | a `land: true` mode: a caravan sprite instead of a sail, a road-coloured line, no "harbor" captions | the sea voyage shape with land captions; or a card | 0.25 (0 with the card) |
| **The party split** (Yari, Azzy, Samira stay at the workshop for beats 6 to 8) | followers drawn behind the player from `party.*` flags | a `party.away` flag the follower drawer and the battle builder read (no fights happen while it is set, so the battle side is a guard, not a feature) | the whole party goes in disguised (Coco: "Five aprons. Don't ask."), which costs the Oct 21 settled text its shape and puts Azzy in a veil; avoid | 0.25 |
| **The Echo party for one scene** (Patricio alone; young Benny is an NPC who refuses and walks out; Caona "not in the room") | the Echo party from flags (`party.yari` gives Caona, `story.benny_joined` gives Benny) | a zone property `echoParty` (a list) the Echo swap reads | Benny and Caona stand as followers behind Patricio while an NPC Benny speaks; wrong on its face; avoid | 0.25 |
| **The seamstress looks** | sprite recolours through `assets.config.ts` | two looks (veil and apron over Gianna's and Anissa's sprites), set by `story.disguised` and cleared in beat 8 | the sprites unchanged and the narration says the veils | 0.1 |
| **The debate with four voices** | one ally, one opponent, three rounds | a per-round `opponent` (and `ally`) override on `DebateDef` | two debates on one corner (7.3) | 0.1 |
| **The Sergeant's withdrawal and the map Parley** | `floor`, `withdraws` (Chapter 3), dialogue choices | data only | none needed | 0 |
| **The Throne tile and the ropes** (Chapter 12 reuse) | solid objects by flag (`if`) | a rope object with `if: '!story.claim_begun'` | none | 0 |
| **Chapter wiring** | `CHAPTERS`, `chapters.json`, the route, `CHAPTER_LEVELS` (has Chapter 5), `MARKS` in `chapter-starts.ts` | `ACT5` in `quests.ts`; `'6'` in `MARKS` (`seat-concourse`, spawn `iron_gate`, or the Winter Plateau road if Chapter 6's map exists by then); the route to `@chapter5-end` | none | 0.25 |

About one builder-day of engine work in the worst case, half of it the party split and the Echo party override,
both small and both needed in later chapters (Chapter 9's infiltration splits the party; Chapter 12's last Echo
names its party). No Yield, no Echo battle, no region levels, no economy ledger: the chapter stands on what Chapters
3 and 4 built.

---

## 11. People, with placeholder looks (drawn in code, `assets.config.ts` NPC looks; art drops in through the config)

| Person | Role | Look (placeholder) | Chapter 12 |
|---|---|---|---|
| **Lord Regent Aldric Vane** | the antagonist; never sits, never raises his voice, never addresses Anissa | thin, grey hair, grey-violet robe, a chain of office, no crown; a new `regent` look; on the drop-2 list | the boss (13.3) |
| **Elodie Limyè** | Zetwal's envoy under Crown eyes; two true lines | the built `elodie` look in the envoy's gold | the Claim's witness, the Hearing |
| **Coralie, "Tati Coco"** | Elodie's sister; the smuggler in silk | eight colours on one sprite, a tape measure; new `coralie` look | dresses Gianna for the Claim |
| **Keeper Hollis** | the Throne's archivist; the keeper's law; Se-4's and Se-5's keeper after the release | old, slippers, a grey robe, a key on his belt; new `hollis` look | the final Echo's present side; the Ribbon's hearing |
| **The Crown's clerk** | the pen Elodie speaks for; follows her everywhere | violet, a writing board; new `crown_clerk` look | the Hearing's recorder |
| **The herald** | the Regent's voice at the gate | violet tabard, a staff | the Claim's announcer |
| **Regent's Sealbearers** (x6 as NPCs) | the gate arch, the Archive's chain, the Throne's rope, the wing | grey-violet, a seal on a chain; one look | the boss's two shields (13.3) and the 28 to 30 table's enemy |
| **The chamberlain** (Master of the Chairs) | Se-5 | black, a staff of office | places the tokens |
| **The Crown's legate**, and his aide | Aldermoor's chamber; Edmund's "terribly sorry" first heard from the aide | violet; the aide in a plainer coat | the legate at the Hearing |
| **Four envoys** (Al-Doria, Skarragol, Kuroshi, Jwaladesh) | Se-5's answers; the roads' troubles | each in their house's colour; four looks that Chapters 6 to 8 reuse for their councils | the chairs, if their tokens are placed |
| **Pilgrims** (x4) and the **deserters** (the Sergeant, two Marines) | Se-3 | the pilgrims in four faith colours; the deserters in old Crown coats | the escort at the gate, the Harbor's +5 |
| **The four debaters** | 7.3 | the Gaze keeper (Chapter 1's look), a Sky-Rider in Ironvow felt, a Witness priest (Chapter 4's look), a Quiet Crown speaker in plain grey, unmasked | the post-Harbor corner |
| **Vendors** (3), the gate clerk, the caravan master (Chapter 4's) | | | |
| **Echo:** the Throne's clerk, the Crown's envoy of the day, young **Thomas Stillwater** (a boy at a desk), young **Benny** as an NPC (Chapter 3's Echo look), young **Patricio** (the player) | beat 7 | the Echo palette | the last Echo |

Elodie's voice follows the built Chapter 1 scene (`elodie_talk`): short, exact, warm only in the last word of a
sentence. The Regent's follows the guide: calm, patient, courteous, never cruel in words. Hollis is new: dry, old,
loyal to the law above the lawgiver. Coco: section 9.

---

## 12. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

1. **Where is the Seventh Clause read aloud: in the Parley, before the Regent and every house's envoy (recommended,
   beat 8), or in the Archive, to the party alone?** *Reason this is the owner's:* it changes who in the realm knows
   the clause from this point on. Read in the Hall, every envoy hears it, the Regent lets it happen because the
   Charter stands on it, Elodie demands it in public as the envoy (her one act in the open), and Chapters 6 to 9
   play in a realm that has heard the clause; the Petitions of Breach, Se-5 and the Ribbon's striking at the Claim
   all land harder. Read in the Archive, the design's "archivist agrees to the reading" is the whole beat, the Regent
   never has to answer for it, the clause stays the party's secret until the Claim, and the midpoint has no public
   scene at all. The pop-up: (a) in the Parley, before the Hall (recommended); (b) in the Archive, to the party; (c) in
   the Archive, then Gianna reads it into the Parley herself (Elodie stays silent in public). The build goes ahead
   with (a) and changes course on an answer.

No second question. The rest are Claude's calls, none of which changes the story's flow:

- **No Echo skirmish and no fight inside the walls** (section 4). *Reason:* Echo battles are an unbuilt system, the
  Archive's Echo would be a one-fighter battle, the chapter has two days, and the sealing's drama is the argument
  (Benny refusing aloud, the clerk's lips moving, the wax); keeping the old courtesy true until Chapter 12 makes the
  Challenge the first steel in Eightgate. The chapter's fights are Se-3's, outside the walls.
- **The Regent's welcome names each of them and does not speak to Anissa** (beat 3). *Reason:* the guide's "three
  moves ahead" shown, not told; the Crown's interest in Anissa is a look, not a line, so the Regent's hand stays hidden
  until the Hushed is unmasked in Chapter 9 (`STORY.md` 6.3), and the Oct 20 rule (she is looked at, never touched)
  holds.
- **The Regent's terms do not name Anissa** (beat 9). *Reason:* the same; "her household goes home and stays there"
  is the threat in a diplomat's words.
- **Elodie's public line is in the Hall with the clerk writing; the private line is in Coco's fitting room** (beats
  3 and 10). *Reason:* the design says "under Crown eyes" and "in private", and the game needs a room for each; the
  fitting room is the one place in Eightgate with no Crown pen, and it is Coco's, so her settled help and the sisters'
  private scene are one build.
- **Elodie's explanation of the hidden marriage is given in the private scene, not the public one.** *Reason:* STORY
  beat 5 lists both the explanation and "only one true thing under Crown eyes"; they cannot both be public.
- **The fixed road order is spoken by Elodie as a diplomat's reading** (beat 10) and the Iron Gate is the only gate
  that opens. *Reason:* the Oct 20 decision made the order fixed; a story reason costs four lines and no system.
- **Two required side quests: Se-3 and Se-5 stage 1** (section 7); Se-1 and Se-4 after the release, Se-1 first (its
  door and Elodie's rooms are on the quarter map, closed). Se-5's first stage is made a playable petition round
  rather than a hook. *Reason:* section 7's first paragraph.
- **The debate holds four voices by rotating the opponent per round**, with two debates as the fallback. *Reason:*
  the guide's corner is "all four"; one override on `DebateDef` is cheaper than four debates.
- **The Husher is not built here** (section 5). *Reason:* he needs two new moves and the Kuroshi tier is his first
  listed home; the Zealots carry the Quiet Crown's presence at the Seat.
- **Seven maps, the gate yard and the workshop added to the design's five** (section 3). *Reason:* the arrival needs
  a place, and the private scene needs a room.
- **The Hall is 44 x 32 with the Throne tile roped off and the chairs empty**, built for the Claim now. *Reason:*
  Eightgate is built once; the rope and the chairs are flag states.
- **Young Benny is an NPC in the sealing, not the Echo follower; Patricio is alone.** *Reason:* the design has Benny
  refuse aloud and leave, and Caona not in the room; the party split makes the engine agree with the story.
- **Coco's one line to Azzy about the wedding coat** (section 9). *Reason:* true, in character, and a fair-play clue
  for the player on the family thread the owner has opened; Gianna does not hear it.
- **Thomas Stillwater speaks one line in the gallery** (beat 7). *Reason:* Chapter 9's record is set up by a boy
  writing, which is showing; the guide's cast table has him writing the Crown's record.
- **The Regent is drawn as a placeholder** until drop 2 (the Opus review's list). *Reason:* the plan.
- **The level target stays 15 with 16 "on target" by slack** (section 5). *Reason:* Chapter 6 is 15 to 17; the
  simulator decides the three dials, not the outline.

---

## 13. Length

Estimated from Chapter 2's measured route (1,020 steps, 37 transitions, 261 lines, about 40 minutes) and these maps:

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The road, the gate yard, the herald, the concourse | ~110 | 3 | ~25 | |
| The Hall: the welcome, Elodie's line, the chamberlain | ~60 | 1 | ~35 | |
| The quarter, Coco | ~50 | 2 | ~25 | |
| Se-5 stage 1 (the Hall's chambers), the debate | ~150 | 3 | ~45 | |
| Se-3 (the gate yard, the fields, the camp, back) | ~180 | 4 | ~25 | 1 ambush, the camp |
| The bell, the chain, the Archive, the Echo, the keeper's law | ~90 | 3 | ~40 | |
| Read aloud, the terms | ~40 | 1 | ~30 | |
| The fitting, the Iron Gate, the card | ~60 | 3 | ~25 | |
| **Chapter 5** | **~740** | **20** | **~250** | 1 to 2 |

About 25 minutes, a little over the plan's 20: the Hall's seven chambers (Se-5) and the walk to the deserters' camp
are the extra, and both are the chapter's required quests. The Archive's eight books and the Outfitter are on top for
players who want them. Without the two side quests and the debate (a player who ignores the arrow cannot, the gate
holds), the main line alone is about 12 minutes, which is why the quests are required: a 12-minute midpoint would be
a cutscene.

---

## 14. Continuity into Chapter 6 (Skarragol, The Stolen Standard; fixed first)

- **The lead:** Ironvow's envoy in the Hall ("ask me again when we have a standard") and Elodie in the fitting room
  (the standard stolen, the council selling the fleet, "north first"). The Iron Gate is the one gate that opens;
  Chapter 6's first scene is the Winter Plateau road outside Ordvik, the party arriving on foot from the Seat's north
  road (a land journey `seat_skarragol`, the same mode as beat 0's; realm map from (68, 64) to Ordvik at (91, 91)).
  `?chapter=6` starts there.
- **The party leaves with:** Gianna, Yari, Azzy, Samira, Anissa; **level 15 to 16** (section 5); the Echo party
  unchanged (Patricio, Caona, Benny); gold about 900 to 1,100 less what the Outfitter took; key items unchanged plus
  `item.petition` (Yari's; the copies given out) and whatever faith token was bought; flags `story.seat_arrived`,
  `clue.seventh_clause_read` (the wording in the Journal), `clue.elodie_locket_line`, `clue.elodie_tested_line`
  (Rael clue 2 complete), `choice.patricio_protest`, `choice.refusal`, `story.terms_refused`, `side.seats.stage1`
  (and `side.seats.ardencia`: Azzy's petition on the empty chair), `side.deserters.spared|paid|broken` (the Harbor's
  +5 soldiers on spared), the debate's outcome, the Seat's Influence (about 4 to 15 by books), `act5.complete`.
- **What Gianna believes:** unchanged (`belief.rael_traitor`): she heard "believe your Locket" as "not him" and
  "tested" as the duel. The player now has Rael clues 1 (the signet), 2 (Elodie's two lines), 4 (the coin), and the
  "nobody dies" pattern (the deserters withdraw too; the Regent's men are not Rael's, but the player has not seen a
  death yet in this game at anyone's hand). Chapter 7's files give clue 3.
- **What the realm knows:** the Seventh Clause, read aloud before every envoy (question 1); so Skarragol's council,
  Kuroshi's spymaster and Jwaladesh's priests may each say "we heard what the Crown wrote us down as" in their own
  chapter, and the betrayal at the Muster (Chapter 10) is a house that heard it and sold anyway.
- **The Regent's patience:** he let them walk out; his next move is on the roads (Chapter 6's Crown-paid raider chief,
  Chapter 7's broker, Chapter 8's hoarder), and the Crown's agents in the Quiet Crown's cells hunt Anissa through
  Chapters 6 to 9 (the Hushers appear at the Kuroshi tier). Elodie stays at the Parley "till the Crown lets her go";
  she is seen again at the end (the guide). Coco stays in Eightgate (Chapter 12).
- **Se-5's tokens:** each of Chapters 6 to 9 and 10 to 11 gives one when an ally's price is paid in full (Skarragol's
  horse-hair braid is the first); the chamberlain waits. Each of those outlines should place its token in the price
  scene, not a chest.
- **Nothing built in Chapters 3 and 4 is touched** except `CHAPTERS`, `chapters.json`, the route, `encounters.ts`
  (`crossroads`) and the land-journey mode if Chapter 4 built the sea shape for the caravan.

---

## 15. Risks

- **Question 1 is the chapter's shape.** If the owner chooses (b), beats 8 and 9 move into the Archive and the Hall
  loses its second scene; the Regent's terms then come by the herald, which is weaker and should be said so. Build
  the Archive and the Hall first and the reading scene last, so the answer costs a scene, not a map.
- **The party split and the Echo party override** are the two engine pieces (section 10); each has a fallback that
  is wrong on its face (Azzy in a veil; a follower Benny watching an NPC Benny), so they should be built on day 1 and
  not left to the fallback. Chapter 9 needs both anyway.
- **The level curve** runs two levels over as played if nothing is dialled (section 5). The simulator must run on
  day 2 with the route, and the three dials are decided from its numbers, not guessed.
- **Chapter 4 may land late** (its slot is Oct 23 to 27, this chapter's Oct 26 to 28, and Chapter 3 is still being
  closed). Everything here except the land journey and the gate yard's caravan can be built from the Chapter 4
  outline's section 13 (the flags, the party, the items) before Chapter 4 is done; `?chapter=5` needs Chapter 4's
  route to exist; until then the chapter is tested from a hand-written start save with section 1's state, as the
  Chapter 4 outline planned for itself.
- **Elodie's two lines are the chapter's point and are easy to spoil.** Neither may be glossed by a companion, a
  Journal note or Anissa: the Journal records the words only; Anissa's lines after each ("She didn't look at me" /
  "He didn't let them hit me") point at the rules and at the trial, not at the truth. A content test should assert
  the exact wording of both lines and that no other line in the chapter contains "truth" near "father".
- **The Regent must stay hidden about Anissa.** No line in the chapter may have him, the clerk or a Sealbearer name
  her or her gift; the look is the whole threat. The Zealots' "the little one glows" is the Quiet Crown's, not the
  Crown's, and that distinction is Chapter 9's reveal.
- **Chapter 12 reuse** puts constraints on today's maps: the nave must be a fight arena (clear tiles, the Regent's
  position and two Sealbearer slots), the chairs must be objects with a `token` state, the Throne tile a step
  trigger, the Archive's zone big enough for three Echo followers. Each is a note in the map file now, not a
  rebuild in November.
- **Tone.** No jokes near Anissa (Coco's warmth is a look; the Sealbearer's look is a threat; the Regent's is the
  coldest beat), none in the Hall, none in the Archive's Echo; Samira's pricing stops at the Hall's steps and the
  curtain; the Quiet Crown speaker at the fountain is a tired man, not a cult; the Gaze's blessing of the Throne stays
  disputed in every book (guide 6.6).
- **Coco's flamboyance on a 16 px sprite** is a palette; her voice carries it, so her lines must be the chapter's
  longest and fastest. A helper writing her from this outline should read Amanda's built lines (Chapter 3's Ar-1)
  for the register the owner liked, then make Coco more polished than Amanda, not louder.
- **English only** here, which removes the fluent-reader risk but not the formal register: the Regent and Hollis must
  never sound modern; "household", "signatory", "at the Crown's pleasure" are the register.

---

## 16. Build plan (small steps, each checked before the next; sized to two builder-days, Oct 26 to 28)

**Day 1 (Opus with Sonnet on maps and content):**
1. **Docs and the decision (morning, 1 hour):** the second review; the owner's answer to question 1 (the build does not
   wait); `STORY.md` Chapter 5 rewritten to this outline (the Echo skirmish dropped), `CAPITALS.md` 5 re-sized (the
   Hall at 44 x 32; seven maps), `SIDE-QUESTS.md` Se-3 and Se-5 marked for the release with the new numbers,
   `PUZZLES.md` SIG-SEA's staging, the Regent's and Coco's prompts into `ART-PROMPTS.md`.
2. **Engine (Opus, half a day):** the party split (`party.away`), the Echo party override (`echoParty` on a zone), the
   land-journey mode (or the card), the seamstress looks, the debate's per-round opponent; unit tests for each.
3. **Maps (Sonnet, the rest of the day):** the seven maps from section 3 with doors, spawns, the Archive's Echo zone
   and anchor, the evening variant, the rope and chair objects with their Chapter 12 states noted, the ambush layer;
   validated; the city entry in `CITIES`.
4. **Content (Haiku and Sonnet, in parallel):** twelve books, the `crossroads` table, the Sergeant, the vendors and
   the faith tokens, the looks (Regent, Coco, Hollis, the clerk, the Sealbearer, the chamberlain, the legate, four
   envoys, four debaters, the pilgrims), the speakers, the audio slots (the Hall plays the Crown's march slot under
   the Regent; the concourse the farewell track until Eightgate has its own; the Archive silence and a clock).

**Day 2 (Opus with Sonnet on dialogue):**
5. **Dialogue and the story wiring (the morning):** `data/dialogue/seat.ts` staged from the beats, in this order so an
   interruption leaves a playable chapter: the gate and the herald; the Hall and Elodie's public line; Coco and the
   day gate; the chain, the Archive, the Echo and Hollis; the reading and the terms; the fitting; the Iron Gate and the
   card. `ACT5` in `quests.ts` with hints and goals; the Journal notes.
6. **The quests (early afternoon):** Se-3 (the pilgrims, the camp fight `deserters_road`, the map Parley, the gate
   callback), Se-5 stage 1 (the seven chambers, the chamberlain), the debate *Four Voices* (four speakers, three
   rounds, the Reason books).
7. **The puzzle files and tests (late afternoon):** `puzzles/seat_accord/`; quests, guide, debate, side-quest, maps,
   stage and content tests green; the two-lines assertion; the "no line names Anissa's gift" assertion.
8. **The route (evening):** Chapter 5's route from its chapter start to `@chapter5-end`; `chapter-starts.ts` with
   chapter 6; `act.test.ts`; `tools/level-curve.ts` run and the three dials set; the smoke test's Chapter 5 section
   with screenshots of the Regent at the Throne's foot, the chain lifting for Coco, Anissa holding the door in the
   veil, the wax breaking in the Hall, and the fitting room, at 844 x 390 and 390 x 844.
9. **Full browser test (day 3's morning at the latest):** the chapter end to end on a phone; Game Over on a fields
   ambush (back to the gate yard); a save at the chain and at the Hall's steps; `npm test`, typecheck, lint, build;
   then the owner's playthrough with Chapters 3 and 4 (the Chapters 3 to 5 review batch, about Nov 1) and the
   reviewer prompt in `reviews/reviewer-prompts/`.

**If day 2 runs over, cut in this order:** the evening variant (a line instead), the Archive's books from eight to
five (*The Weaving*, *The Sun Accord, Sealed*, *The Founding Compact*, *The Throne's Clerks*, *The Claimant
Families*), the Outfitter to two items, the debate's four voices to two debates, the land journey to the card. Never
cut: the two lines, the sealing, the reading, Coco's chain scene, the three required quests.

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24); card art, portraits and the card back before the rules and card text freeze (Fri Oct 31); order B with proofs
(Mon Nov 3); the Dec 1 story questions, now needed by early November; the fluent-speaker check (Wed Nov 18; nothing
in this chapter needs it).

---

## Owner decisions (Oct 21, by pop-up)

1. **The Seventh Clause is first read aloud in the Parley,** at Elodie's demand, before every house; the Regent cannot
   refuse in public.
