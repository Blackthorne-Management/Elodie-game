# Chapter 4, The Ledger (Bab al-Dhahab, Al-Doria): build outline (Oct 21)

*Design outline only, for the second review and the owner's decision before anything is built. No code has
changed. Written under the Oct 20 rules: only a decision that drastically changes the story's flow goes to the owner;
everything else is Claude's call, recorded in section 11 with its reason. Sources: `PLAN-ALL-CHAPTERS.md` (Oct 23 to
27, 30 minutes, levels 11 to 14, Samira joins), the Opus plan review section 6 (the minimum for Chapter 4: Samira's
arrival and invoice, the vault in both eras, Yusuf's ledger, Qasim, Samira joins, the coin clue, the debate, two side
quests; the Sakk of Yusuf and the other quests after the release), the Chapter 3 outline and its owner decisions
(Rael wins; the winner's question; La Promesa on Rael's wrist; Azzy's distraction; Azzy joins in the dark; Benny's
Refusal names the Dorini), `design/STORY.md` Chapter 4, `CAPITALS.md` 3, `SIDE-QUESTS.md` A-1 to A-5, `PUZZLES.md`
SIG-ALD, M-ALD-1, M-ALD-2, `COMBAT.md` 7, 9.6 (Daftar spends gold, approved Oct 20), 13.3 (Qasim),
`SECRET-ITEMS.md` 2, `QUEST-BUILD-GUIDE.md` 5.3a, 5.4, 6.3, and the built game in `quest/src` (`data/quests.ts`,
`data/rpg.ts` MEMBERS, `data/battles.ts`, `data/voyages.ts`, `data/encounters.ts`, `tools/chapter-starts.ts`,
`tools/maps/*.ts`, `engine/stage.ts`). Levels use the game's own curve (`xpBase 50, exponent 1.6`: level 12 at
2,318, 13 at 2,665, 14 at 3,029, 15 at 3,410).*

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17); Anissa is never
hit and never jokes; Samira's invoices are the chapter's comedy and stay out of every Anissa line; recommendations
only where they genuinely help; placeholders wherever art has not arrived; the release is Nov 22, so this chapter
gets the main story, the boss, the chapter's fights, the Echo puzzle, the debate as a required quest, **two** required
side quests, mystery quests and arrows, and Game Over where it applies. The three other side quests and the Sakk of
Yusuf follow after the release.

---

## 1. Where the chapter starts (measured against the Chapter 3 outline)

- **Chapter 3 ends** at the Free Brasador camp on Ardencia's strand (`ardencia-camp`), on the trader's boat, after
  Azzy reads *Benny's Refusal*: "the bankers of Al-Doria, who witnessed and hold the signed copy". `act3.complete`;
  the card *Chapter 3 complete, The Trial of Blades. Next: Chapter 4, The Ledger*. `?chapter=4` starts here.
- **The party on the route:** Gianna, Yari, Azzy (front row), Anissa; **level 11** (about 2,115 XP; 12 with the
  whole library and a second ambush). Echo party: Patricio, Caona, **Benny** (`story.benny_joined`). Gold about 750
  (402 from Chapter 2 plus Ar-1, Ar-2 and the ambushes). Key items: the envoy's papers, the Locket, *Benny's Refusal*
  (a copy), the Marshal's whistle. Flags that matter here: `story.ardencia_escaped`, `belief.rael_traitor`,
  `ally.free_brasador`, `party.azzy`.
- **Chapter 4's target** is 11 to 14 (the plan). Al-Doria's shops stock tiers 8 and 12; Qasim is level 14.
- **Two stale numbers.** `CAPITALS.md` 3 still says "Chapter 3" and levels the Desert Edge at 8 to 11, and
  `PUZZLES.md` lists SIG-ALD under Chapter 3: both are re-levelled below (11 to 13) and corrected with the owner's
  decision, not before.
- **The way in** (`STORY.md` open question 12, now closed by Chapter 3): the Dorini are the witnesses who hold the
  signed copy, and the trader that waited a week for Patricio's granddaughter sails again. **The way out** (section
  13): the seventh page in the vault is sealed with the Throne's own wax, and a Dorini caravan is the one thing that
  passes Eightgate's gates unquestioned.

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 and 3 outlines. Flags are proposals in the built naming style.

### Beat 0: The strand at dawn (ardencia-camp)

- The party stands by the fire where the card closed. The three Free Brasador soldiers, the **trader captain** at
  his boat. Shops: only the Free Brasador quartermaster, if the Chapter 3 review's camp vendor (Azzy's long sword)
  lands; otherwise none, and the player who wants to buy before Al-Doria buys in the bazaar.
- Talk to the captain: "Sail for Al-Doria?" (the ready check). On yes, staged: the **sergeant** walks up to Azzy,
  not to Gianna: "We hold the strand, captain. Come back with an army, or do not come back." Azzy: "With an army."
  (The pledge is the Journal note *Free Brasador holds the strand* and the flag `ally.free_brasador`; its price,
  Fear 6, is the economy foundation's to score.) **Yari** stops at the gangway and takes a coin from her pouch:
  "The camp leader gave me this for the fare, out of the oil money. The captain would not take it. 'Not Crown, not
  ours.'" She keeps it (`item.brasador_coin`, set here **unless Chapter 2's oil quest already set it**: the Chapter 3
  outline flagged that addition for the helper building X-2; this line is skipped when the flag exists). The party
  boards (shown: up the gangway, Azzy last, looking back at the wall once).
- **The voyage `ardencia_aldoria`** (new `VoyageDef`, by day; realm map: out from Ardencia's north coast near
  (62, 9), east along the open sea to (121, 9), **south past Zetwal** at (121, 40), to the Gate of Gold at about
  (108, 62); `end` on Al-Doria's coast nearest its capital (106, 66)). Captions: "Away from the black cliffs of
  Ardencia..." / "South, past the reefs of Zetwal..." / "...to the Gate of Gold." One line aboard as Zetwal passes:
  Anissa: "That's our reef, Gigi." Gianna: "Yes." Nothing more (she does not stop, and the player feels it). Music: the
  farewell track until Al-Doria has its own. Lands at `aldoria-quay`, spawn `landing`.
- Journal: **Sail for Al-Doria** (done `story.aldoria_arrived`, set on landing; the Desert Edge's table switches on).

### Beat 1: The quay of the Gate of Gold (aldoria-quay)

- Domes and the harbour wall, a Crown merchantman at the quay. **Unrest shown, not told** (owner shape, Oct 15):
  porters carry crates **stamped with the Charter's seal** from the Crown ship to the Dorini warehouse (a walker loop,
  four porters on a fixed path); the **Crown trade factor** stands at the gangway with a Dorini customs clerk stamping
  his manifests. Yari walks to the crates herself (staged: she leaves the party line, stops by a crate, comes back):
  "Cassava. Salt fish. Our marks under their seal. That is my father's harbour, sold by the crate." The **price-board
  crier** passes: "Indigo up! Zetwal indigo, twelve to the bolt! Dates down!" (the blockade's price, and A-4's hook
  left standing).
- The quay gate: a Dorini gate clerk reads the envoy's papers ("Zetwal. Ahlan wa sahlan. Mind the moneychangers.")
  and the factor, who has watched the whole time, turns away (one line to his clerk, not to them: "Zetwal's envoy
  sends her daughter. Note it.") The gate opens onto the bazaar.
- Journal: **Up from the quay** (done `story.samira_met`, the next beat).

### Beat 2: The Grand Bazaar, and Samira (aldoria-bazaar)

- Covered lanes under lanterns, the moneychangers' row, the price board, the three vendors, the contract board, the
  souk square with the Majlis at its head and the **dry fountain** in its middle (children sitting on its rim), the
  guild hall's green door on the square's west side, the House of Ledgers' dome north.
- **Samira's stall** is the last on the moneychangers' row, an appraising scale on the counter. Staged, as the party
  walks past: she comes out from behind the counter, walks up to Gianna and looks at the **Locket**, not at her face.
  "Half of something. Zetwal gold; the hinge is Brasador work. The other half is worth more." She writes on a slip and
  holds it out. "Opinion, one locket, two gold." Choice (remembered, `choice.samira_invoice`): **Pay her** (gold -2;
  "Prompt. I like prompt.") or **"I didn't ask."** ("Nobody asks. It's still owed." She adds a line: *late fee, one
  gold*). Either way she is the chapter's voice from here.
- She looks at Azzy ("Brasador. You stand in my light; that's not free either." He moves. That is the companions'
  comedy, and it never touches Anissa: when Samira's eye reaches Anissa she stops, and says, plainly, "I can't price
  that. I don't price what I can't price." One line, no joke.)
- Gianna asks after the witnessed copy of the Accord. Samira: "The signed copy. Everyone knows where it is: under the
  guild hall, behind a door that weighs you. Nobody knows how to get in; the man who does hires blades. And the
  Merchant-Prince will refuse you. My mother refuses everyone." (`story.samira_met`; her mother is said, not
  explained.) She points them up the square: "Ask her anyway. I'll be here, counting what you owe me."
- Journal: **The Merchant-Prince** (done `story.vault_refused`).

### Beat 3: The Majlis: Layla refuses (aldoria-majlis)

- The long hall of arches to the divan. Staged on entering: the **Crown trade factor** is leaving the divan (he walks
  the length of the hall past the party, as Cresswell did, and out); a **guild master who will not trade with the
  Crown** argues at the council door with the **treasurer** and is waved off (two placed speakers with passing lines).
- At the divan: **Layla Dorini**, the Merchant-Prince, with the guild council at her sides; **Guildmaster Qasim** at
  her right hand (he stands when the chief scribe reads the envoy's papers aloud, shown). Gianna asks for the
  witnessed copy. Layla: "The Dorini witnessed. The Dorini hold. A witness who hands over what she holds is no witness
  at all." Qasim: "And the guild has contracts in Crown ports worth more than a fifty-year-old page. The vault stays
  shut." Layla says nothing to that. She looks at Azzy: "Brasador's son, running from his father. Al-Doria does not
  take sides in family matters." At Yari, who has not spoken: "You are the Yaguana girl. We buy from whoever holds a
  harbour. That is what a harbour is for." (The Unpaid Debt's price, said to the face of the one it was paid with.)
  Refused (`story.vault_refused`).
- On the way out the **chief scribe** catches them under the arches (he walks after them, shown): "The House of
  Ledgers is open to envoys. Nothing in it is sealed." (The library's hook, and *The Vault Register*'s.)
- Outside, Samira is waiting on the Majlis steps (she walked up while they were inside; placed). "Refused. Good: now
  you're a customer. The doorman of the guild hall drinks at the tea house from dusk. I have my family's key. I will
  take you down at dusk, for a fee, if by then you have done three things for me." (The gate, section 6.) She walks
  back to her stall (shown) and stays there until dusk.
- Journal: **Until dusk** (section 6).

### Beat 4: The day in the city (the required quests, any order; the arrow follows the ground)

- **Appraise This (A-1, required):** Samira's bet at her stall, three stalls, three fakes. Section 7.1.
- **The debate, required:** on the souk square, by the contract-priest's bench beside the dry fountain: *Is a bad
  bargain still sacred?* Section 7.3.
- **Sweet Water (A-3, required, the safehouse):** the children at the fountain, the water-carrier's thumbprint door,
  the cistern head on the Desert Edge (the Echo), the fountain runs. Section 7.2. It is the one that leaves the walls
  and the one that ends at dusk by nature, so the Journal lists it last and the arrow turns to it when the other two
  are done.
- The House of Ledgers (nine books, +1 Influence each; five read teach Gianna *Baraka of the Scale*, a Warded spell
  for one ally) and the three vendors are open all day. Nothing in the library is required; Mediate in the debate
  needs Influence 5 in Al-Doria, which the two quests (+3) and two books reach.

### Beat 5: The guild hall by night (aldoria-bazaar at dusk, then aldoria-vault)

- At dusk Samira stands at the green door (the ready check; she refuses in person while anything is left). When all is
  done: "Dusk. He's at the tea house." Staged: she walks ahead to the door, unlocks it, looks both ways down the square
  (a turn left, a turn right), and goes in; the party follows; the doorman's stool is empty. A stair down. **Anissa
  stays at the top of the stair** ("I'll hold the door, Gigi. I always do." It is the only line she has on the stair,
  and it is not a joke). `story.vault_entered`.
- **The antechamber:** a stone room under the hall; the **outer door is a balance**: a pan on one side, five brass
  weights (1, 2, 4, 8, 16) on hooks; beside it, chained to a lectern, **the ledger page** that names "the price of the
  harbour" in the guild's letter-numbers, smudged past reading. The whole room shimmers (an Echo Zone: the vault being
  built, the week before the signing; Yusuf's desk carried down here "while the counting house is rebuilt around the
  vault").
- Journal: **The guild hall by night** (done `story.vault_entered`), then **The price of the harbour**, **The balance
  door**, **Cut to the sun**, **Seven ribbons** (the puzzle, section 8).

### Beat 6: The Echo: Yusuf's ledger (the vault being built, fifty years ago)

- Gianna is young Patricio, come to ask the Dorini to witness the Accord. Caona and Benny are with him (the Echo
  party; this is the first Echo Benny walks in as a member, and there is no Echo battle here: Claude's call, section
  11). The ditch for the inner door is open, the **locksmith** at it; **young Yusuf**, keeper of the ledger, at a desk
  by the balance door with two clerks and the open ledger.
- Staged, as the party walks up: Yusuf does not rise. "Marshal. We will witness. We will hold a copy. For our seal
  the Crown has promised us preference in its ports, and I am writing down what it costs." He writes as he speaks
  (the pen sound, three strokes): "The price of the harbour. **Twenty-five.**" Patricio: "Whose harbour?" Yusuf:
  "The one that is not ours to sell. That is why I am writing it down, Marshal. A debt unwritten is a debt unpaid; a
  debt written is at least a debt." Caona, behind Patricio: "They are selling my harbour in a room with no windows."
  Benny: "My name goes on no page I have not read." Yusuf, writing on: "Then write that down too. I'll keep it with the
  copy." (That is the note in Benny's hand the party finds in the vault.) `story.vault_echo`; the player has heard
  the number the smudged page hides.
- The **locksmith** at the inner door: "The inner lock. The guild wants a key no guildsman holds. What pattern do I
  cut?" Patricio shows the Locket's sun: "Cut it to this." (**anchor** `anchor.vault_sunlock`). The locksmith: "A sun.
  Fifty years from now someone will wonder why."
- Journal: *Twenty-five* (the Journal records the number and Yusuf's line about debts; it is the Unpaid Debt's price
  tag, `clue.harbor_price`).

### Beat 7: The balance, the sun, the vault (the present)

- Back on the shimmering tiles: hang **16, 8 and 1** (three objects toggled; the pan sinks level; the door grinds
  open, `story.vault_outer`). Wrong totals tilt the pan and say so ("Too heavy." / "Too light."): no harm.
- The inner door's **sun keyhole** now takes the Locket (the lock object swaps on the anchor; `story.vault_inner`).
- **The vault:** iron boxes numbered to twelve along the walls (**box 7** sealed, "the bearer of the sun": a line and
  a locked object, A-4's hook, after the release); in the middle, a chest. In it: **the Dorini copy of the Sun
  Accord**, bound with seven silk ribbons, six pages open, the **seventh sealed with the Throne's own wax** (shown as
  a page object with a red seal: "No guild, no house and no envoy may break the Throne's seal. The Throne Archive at
  Eightgate opens it, lawfully, or nobody does." `clue.sealed_seventh`); under it, a half sheet in Benny's hand:
  *"I will not put my name to this page. B. Rodriguez."* (key item `item.benny_note`). Yari reads the six pages'
  signatures: "Patricio. Yusuf. Sarnai. Sayo. Arjun. Not Caona. Not Benny." Gianna: "The seventh page is the one they
  would not sign, and the one we cannot read."
- Journal: **Seven ribbons** (done `clue.sealed_seventh`).

### Beat 8: The guild's blades: Qasim (the fight `qasim_vault`)

- As Gianna closes the chest, **Qasim** comes down the stair (shown: he walks in with two **Caravan Raiders** in the
  guild's green, "the guild's blades", and stops at the balance door; a third waits on the stair). "The guild's vault.
  The guild's page. And Zetwal's envoy with her hand in it." He sees Samira. "Samira Dorini. You opened this door.
  You are struck from the guild, tonight, by its master." Samira takes the slip-book out of her sash, writes, and
  holds the page out to him across the room (one step forward, shown): "Then I'll bill the guild." She steps into the
  party line beside Yari. **Samira joins here** (`story.samira_joined`, `party.samira`): in front of the man who
  expels her, before the fight, so Bribe and Daftar are hers in the fight that teaches them. (Claude's call, section
  11: `STORY.md` had her join after.)
- The fight. Section 4 has the design: Qasim at 14 with two raiders, *Hire Blades* bringing a third and a fourth in,
  *Seize Assets* and the *Golden Wall* that only a Surge breaks, and the scripted Yield. Game Over applies here as it
  does everywhere but the trial: the goddess, the count, the Grudge. **Way back in:** the stair; Qasim's blades hold
  it (talk to the raider at the stair foot: "The master's still down there." and the fight starts again).
- Journal: **The guild's blades** (done `encounter.aldoria_story.qasim.won`).

### Beat 9: The Merchant-Prince's word (the vault, then the stair)

- Staged: **Layla** comes down the stair with two Majlis guards and the chief scribe (shown: all four descend; she
  stops at the balance door; the guards lift Qasim). She looks at Qasim, at the open chest, at her daughter, in that
  order, and speaks only to the first two. "The guildmaster hired blades inside the guild's own vault. The council
  will hear it at dawn." To Gianna: "You have read what you came to read. The copy stays: a witness holds. The seal is
  the Throne's, and the Throne is at Eightgate. A Dorini caravan is not stopped at the eight gates; that is the only
  thing the guild's Crown contracts have ever been good for. The caravan master leaves at first light. Be on it."
  (key item `item.dorini_pass`, `story.layla_pass`). To Azzy, Yari, the room: nothing. To Samira: nothing, in public
  (the design's line), and she goes back up the stair without turning (shown).
- Samira, when her mother is gone: "She didn't say my name." Gianna: "No." Samira: "She never does when there's a
  scribe in the room." The party goes up.
- Journal: **The Merchant-Prince's word** (done `story.layla_pass`).

### Beat 10: The caravan gate at first light (aldoria-desert, the gate yard)

- The caravan forming inside the gate: the **caravan master**, camels or mules (placeholder sprites, `goat_herder`'s
  animal recoloured until art), guards. Staged, three things in a row:
  1. **The purse.** The chief scribe walks up from the square (shown), hands Samira a purse without a word, and
     walks off. Samira turns it over: "My mother's seal. My debts, to the dinar, and ten over." A beat. "She pays what
     she owes. She has never once said so." (`STORY.md` beat 8's private payment, shown in public without a word, so
     Layla keeps the design's silence and the player still sees it.)
  2. **The coin** (Rael clue 4). Yari: "Samira. Appraise this." The fare coin. Samira weighs it on the little scale
     she wears: "Brasador mint, Cenizal, three years old. Worn by a purse that was not Brasador: this has been in oil
     and salt." She looks at Yari. "This coin has been somewhere else. Someone in Ardencia pays someone in Xaraguá, and
     not through any bank I know." Gianna, flat: "My father pays the resistance so he can sell it." (She reads it
     wrong, as `belief.rael_traitor` requires; the player may not.) `clue.brasador_coin`; the Majlis book *A Brasador
     Coin Assay* appears from here. Anissa: "He left it on purpose, Gigi. Like the key." (She means Azzy's key; Gianna
     does not answer.)
  3. **Azzy and Samira**, one exchange, as the caravan master calls: Samira: "Brasador. You still owe me for the
     light." Azzy: "Bill my father." Samira: "I intend to."
- The party walks out through the gate with the caravan (shown: the caravan master ahead, the party, the guards; the
  gate closes behind). Card: *Chapter 4 complete, The Ledger. Next: Chapter 5, The Parley.* `act4.complete`.
  `?chapter=5` starts at Eightgate's gate (section 13).
- Journal: **The caravan gate** (done `act4.complete`).

### 2a. FAMILY SLOT (owner direction, Oct 21; nothing built here until the owner places someone)

**Where it fits naturally:** the **cloth merchants' row** of the Grand Bazaar (beat 2's map), between Samira's stall
and the three A-1 stalls, in the day beats (beat 4), where the party already walks past every stall and the crier
has just called Zetwal indigo at blockade prices. A placed NPC with one walk-up scene and one optional help in A-1
is the whole footprint: no map change, no story change, no gate.

**Who I would suggest: Coralie, "Tati Coco"** (Elodie's sister, the artist and clothing designer for royals abroad).
*Why:* Bab al-Dhahab is the realm's cloth and dye market, and she has a working reason to be there that the chapter
already stages: she buys Zetwal indigo for a foreign court, and the Crown's blockade has made it dear (the crier's
line). She is the one adult of Gianna's family who is *abroad by trade*, so she is met on the road rather than at home,
which is what "bumped into along the way" wants. She can help without a quest of her own: a designer's eye on A-1's
carpet (the knot count) is one line, and she is a natural second voice for the Gaze side of the square's debate
(*a bad bargain*: she is paid by royals and knows what a bargain costs). She would see Anissa and say nothing
clever (the Anissa rule): "Mama's eyes. Both of you." She leaves on a ship before the vault, so she is never in the
guild's trouble and never in Chapter 5's Eightgate scene unless the owner wants her there. Azzy does not know her
(she is Elodie's side; he calls Rael's siblings Titi and Tío, not her).

**Alternative, if the owner prefers a Rodriguez here:** one of Rael's sisters married into a Dorini banking family
(Aiyana or Zelia, the owner's choice) on the guild council, who abstains when Layla refuses and sends the party the
chief scribe's hint to the House of Ledgers; Azzy's "Titi" at the Majlis would make Layla's "family matters" line land
twice. It costs one council seat on the divan and one line; it makes the "no others recorded" clue in Ardencia's
archive bite earlier, which may be more than Chapter 4 should carry.

**Not here:** Sebastian (the touring organist) belongs where there is an organ and a court: Eightgate (Chapter 5) or
Kingsmere (Chapter 9), not a bazaar.

---

## 3. The maps

All new, drawn in code the way Yucayeque and Cenizal are (`tools/maps/aldoria.ts` through `painter.ts`, then
`npm run maps:build`), registered in `data/maps.ts` and `CITIES` (`data/rpg.ts`). Half port, half caravanserai:
domes, arcades, lanterns over covered lanes, tiled fountains, green and gold; nothing that looks like Cenizal's red
stone or Pòdlimyè's wood. Accent green `#1e8449`.

| Map | Size (tiles) | Section | Echo era | What is on it |
|---|---|---|---|---|
| `aldoria-quay` | 36 x 22 | The harbour quay (outdoor) | none | The landing (spawn), the Crown merchantman and its gangway (the factor, the customs clerk), the porters' loop with the sealed crates, the Dorini warehouse, the price-board crier's beat, the quay gate with its clerk. |
| `aldoria-bazaar` | 44 x 30 | The Grand Bazaar and the souk square (hub, outdoor) | the fountain house only, in A-3's second step: not an Echo, a line (the Echo is at the cistern head) | The covered lanes; the moneychangers' row with Samira's stall at its end; the three stalls with a fake each (A-1); the tea seller, amulet seller, armourer; the old moneychanger (A-4's hook line); the contract board; the souk square: the dry fountain with the children, the contract-priest's bench (the debate), the Majlis steps and door at its head, the guild hall's green door (west), the House of Ledgers' door (north), the water-carrier's door with the thumbprint (a lane off the square); a dusk variant by flag (`story.aldoria_dusk`: lanterns lit, the doorman's stool empty). |
| `aldoria-majlis` | 36 x 26 | The Merchant-Prince's Majlis (the seat of government) | none | The long hall of arches to the divan (Layla, the council, Qasim); the guild council chamber; the counting house; the envoys' courtyard with its fountain (outdoor, inside the walls); the archive of contracts (the four Majlis books); the couriers' post; the treasurer, the chief scribe, the Crown trade factor, two contract scribes, the guild master who will not trade with the Crown, the caravan master by day. |
| `aldoria-ledgers` | 24 x 14 | The House of Ledgers (the library) | none | A domed reading room; nine ledgers chained to lecterns; a keeper of ledgers. |
| `aldoria-vault` | 24 x 18 | The guild vault, under the guild hall | the antechamber: the vault being built, the week before the signing (Yusuf's desk, the locksmith) | The stair (Anissa waits at its head); the antechamber with the balance door, the five weights, the chained page; the inner door with the sun keyhole (anchor); the vault: twelve boxes (box 7 sealed), the chest with the copy; Qasim's arena. |
| `aldoria-desert` | 46 x 28 | The caravan gate and the Desert Edge (wild, outdoor) | the cistern head: the old sluice, the week the vault was built | The gate yard inside the walls (the caravan forming, the spice merchant's stall for A-2 later); the caravan road into the dunes with the ambush layer (`desert_edge`); the **cistern head** at the foot of the hills (the guild's new iron sluice and tanks, the old gate, the anchor); the ruined caravanserai on the far side (A-2, after the release). |

Six maps: `CAPITALS.md`'s six, with the **Old Counting House** folded into the vault's Echo (Yusuf's desk is in the
antechamber that week: one Echo zone carries the ledger scene and the puzzle's cipher, and the counting house map
comes back with A-4 after the release) and the **quay** added so the harbour's unrest is seen before the bazaar's
comfort. Five outdoor areas (the quay, the lanes, the souk square, the envoys' courtyard, the gate yard and desert).
The Echo validator's rule holds: every zone tile walkable in both eras; two anchors in the chapter (the sun lock, the
cistern pin).

---

## 4. Guildmaster Qasim: a boss who pays for his fight

### 4.1 What the engine has and what it lacks

- **Built:** bosses with heavy telegraphed moves (`EnemyMove.tell`), area moves, statuses (Weakened, Warded, Marked,
  Inspired, Fogged), a fixed level per battle, rewards, tips, the Foes page, Game Over with the goddess.
- **From Chapter 3's engine work (reused here):** reinforcements entering mid-fight, boss phases on HP thresholds.
  Both are on Chapter 3's list (section 9 there); Chapter 4 is the second user, not the first.
- **From the foundations (being built now):** the Yield step (Spare, Spoils, Break) and the realm economy's pillars.
- **New for this chapter:** skills that **cost gold** (Daftar, Bribe); an enemy that **leaves** a fight (Bribe); a
  status a Surge ends early (the Golden Wall); a summoned enemy flagged *hired* (Bribe refunds it). All small; section 9.

### 4.2 The design

| | |
|---|---|
| **Qasim** | Level **14**, support role, `BOSS_SCALE` x7 HP / x1.1 ATK (`COMBAT.md` 13.3). Moves: *Cane* (power 100), *Hire Blades* (every third turn: a Caravan Raider, level 13, walks in from the stair; at most two hired at once beyond the starting pair; "paid from the guild's strongbox": the tell names it), *Seize Assets* (phase 2, area, Weakened on everyone, telegraphed), *Golden Wall* (phase 2: Warded x1.6 DEF until a Surge-boosted hit lands, then it shatters; telegraphed: "He's stacking the gold in front of him!"). Weak to nothing; the wall is the puzzle. |
| **The blades** | Two Caravan Raiders at the start (skirmishers, *Sand Toss*: Fogged), level 13. Hired ones are flagged `hired`: Samira's **Bribe** on one (gold `25 x level`, 325) makes it leave **and refunds the gold** ("the guild paid him first"); on the starting pair Bribe costs the full price. Anissa's start tip says so in one line. |
| **Phase 1, Ledger** (100 to 40%) | *Cane*, *Hire Blades* on the third turn and every third after. The lesson: kill or bribe the blades, or they stack; Azzy's front row holds them off the mages. |
| **Phase 2, Foreclosure** (40% down) | *Seize Assets* once, telegraphed a turn early ("Guard, everyone!"); then *Golden Wall*; while it stands he hits harder (*Cane* x1.3) and stops hiring. A Surge breaks it (Anissa: "Gigi, Surge! The wall!"), and the fight ends quickly after. |
| **Yield** (scripted, when he is below 25%) | **Spare:** he is handed to Layla's council (+1 Influence in Al-Doria; he reappears at the Hearing's edge as "the guildmaster who paid for the war": a later chapter's one line). **Take spoils:** his purse (+1 Wealth, gold x2, the *appraising scale* charm). **Break him:** +1 Fear, the guild's blades are cowed on the desert road for 100 steps. If the Yield step has not landed by the build, the fight ends on the win as Thorne's does, with his yielding line ("Enough. Enough! Name your fee.") and the Spare outcome. |
| **Rewards** | 280 XP, 200 gold (x2 on Spoils), the Foes pages for Qasim and the Caravan Raider. |
| **Samira's teaching** | Her first turn offers Tonic, *Daftar: Mend*, *Daftar: Strike* and Bribe; Anissa's tips name Bribe on a hired blade once and Daftar once ("She heals with money, Gigi. You have money."). |
| **Tests** | The simulator wins on every roll with a party of 13 and loses without Guard on *Seize Assets* at 11 (not a pushover); the wall falls only to a Surge hit; Bribe on a hired blade refunds; Bribe on a starting blade does not; at most two hired on the field; the Yield's three outcomes set their pillars; `encounter.aldoria_story.qasim.won` is set on a win and nothing else; the stair's way back in. |

---

## 5. The chapter's fights and levels

| Fight | Where | Foes | Level | Party then | Band | Pays (engine rule: 10 XP and 4 gold per foe per level) |
|---|---|---|---|---|---|---|
| Ambushes (`desert_edge`, from `story.aldoria_arrived`) | the caravan road, the cistern head | Caravan Raider x2; Caravan Raider + Road Bandit x2; Smuggler x2; Quiet Crown Zealot x2 ("The little one glows, they say.") | 11 to 13 | 12 to 13 | even | 220 to 360 each; one on the way to the cistern head, likely one back |
| **Qasim** (`qasim_vault`) | the vault | Qasim + Caravan Raider x2, then hired blades | 14 (blades 13) | 13 | even to hard | 280 XP, 200 gold (section 4) |

`CAPITALS.md` 3 wrote the Desert Edge at 8 to 11 when Al-Doria was Chapter 3; it comes up to **11 to 13** here. New
enemy types: Caravan Raider (skirmisher, *Sand Toss*: Fogged) and Qasim, both with drawn placeholders in `ENEMY_ART`;
Smuggler, Road Bandit and the Zealot exist from Chapter 2. A-2's saffron fight and A-5's Crown guards come after the
release.

**Levels through the chapter** (from level 11 on the route; add one if Chapter 3's library and second ambush were done):

| Point | XP from | Running total | Level |
|---|---|---|---|
| Start (the strand) | | ~2,115 | 11 |
| The quay, Samira, the Majlis (three objectives) | 75 | ~2,190 | 11 |
| A-1 (110, its minor puzzle 25) | 135 | ~2,325 | 12 |
| The debate (15 to 25) | ~20 | ~2,345 | 12 |
| A-3 (130, the cistern pin 25) and one desert ambush (~240) | ~395 | ~2,740 | 13 |
| Dusk, the hall, the Echo, the balance, the sun, the ribbons (six objectives), the signature puzzle 60 | 210 | ~2,950 | 13 |
| Qasim | 280 | ~3,230 | **14** |
| Layla's word, the caravan gate (two objectives) | 50 | ~3,280 | 14 |
| With the whole library (13 books) and a second ambush | +130, +240 | ~3,650 | 15 |

So the party meets Qasim at 13 (he is 14 with level-13 blades and more arriving: even on the tag, hard in practice),
**leaves at 14**, and a player who reads everything and fights the desert twice leaves at 15, which is Chapter 5's
range (14 to 15). The simulator (the level-curve foundation) confirms these before the build; the boss's XP and the
objective count are the two dials.

**Gold:** about 750 in; A-1 net 100, A-3 120, ambushes about 100 each, Qasim 200 (400 on Spoils), Samira's Baraka
+10% on every fight from the vault on. Out: Samira's two gold, the tea seller, tier-12 gear (the curved blade for
Azzy, the merchant's robe for Samira, the light bow), and **Daftar** (20 gold per 10 HP healed; a 40 HP heal is 80
gold) and **Bribe** (325 at level 13). The point of the economy here is that Daftar is affordable a few times a
fight and never free: the config caps are section 9's.

---

## 6. The required-before gate: "Until dusk"

- **In the story:** Samira has the key and names the hour: the doorman drinks at the tea house from dusk. Until then
  she has three things for them to do (she does not say "three quests": she says "spot my fakes, settle the priest and
  the merchant so I can hear myself think, and get those children a drink").
- **In the Journal:** the objective **Until dusk**, done through the side quests (`followSide`, as Chapter 1's
  *Unfinished business*, Chapter 2's *Until the elders sit* and Chapter 3's *Until noon*), so the gold arrow leads to
  the next quest's stop. Done when A-1, the debate (joined or mediated) and A-3 are done, **or** when
  `story.vault_entered` is already set (a save made on the stair never sticks).
- **On the map:** the green door's trigger waits for the three (`if: 'side.appraise.done, side.sweet_water.done,
  debate.aldoria_bargain.joined|debate.aldoria_bargain.mediated'`); until then Samira, in person, worded from the
  flags: "Three stalls still have a fake on them. The priest and the merchant are still at it by the fountain. And
  the children at the fountain are still thirsty." Anissa: "Your Quests page, Gigi."
- **The dusk variant** (`story.aldoria_dusk`) is set when the third of the three completes: the lanterns light, the
  doorman's stool empties, the children sleep by the running fountain. It is a flag on the bazaar map, as Chapter 3's
  night Lower Town is, and clears on `story.vault_entered`.
- **Order the arrow follows:** A-1 (the row where the party stands after the Majlis), the debate (the square), A-3
  (the square, the lane, the desert, the square again). Then the green door.
- **No soft-locks:** A-3 is the only required step outside the walls; the Desert Edge's ambushes are at the party's
  level and Game Over brings the party back to the gate yard; the Echoes need only the Locket; the library is optional.

---

## 7. The two required side quests and the debate

Why these two, from A-1 to A-5: **A-1** is Samira's own quest, costs nothing to stage (three objects on the hub map),
and is how she and Gianna come to trust each other before she opens her family's door; without it her choice in the
vault is a stranger's. **A-3** is the hub's rebel safehouse (one per capital, guide 5.4), the third ash thumbprint
(after Yucayeque's oil and Cenizal's bread), the chapter's minor Echo with a water anchor, and the thing the player
sees that explains why Samira defies the guild (water sold by the cup, in front of children). It also walks the party
through the wild section once, so the chapter has its fights. **A-2** is the natural fight quest but its raiders are
already the desert's ambushes, and its Yield needs the foundation that may land late. **A-4** is the secret item (after
the release, by the plan). **A-5** is Samira's heart line and the Crown factor's comeuppance, and it belongs after she
joins, which is the chapter's last ten minutes; it is the first quest to add after the release, and the factor at the
quay keeps its hook (he notes her name).

### 7.1 Appraise This (A-1; puzzle M-ALD-1, present only)

- **Opens:** after the Majlis (`story.vault_refused`), when Samira names her three things. Shows as *??? Samira's
  stall*. Giver: Samira.
- **Steps:** 1) "Three stalls on this row each sell one fake among real goods. Spot all three and I pay you a
  hundred and fifty. Miss one and you pay me." 2) The coin stall (five coins on a cloth: one has a smooth edge; real
  ones are milled), the carpet stall (three carpets: one with loose knots), the weights stall (four weights: one
  without the guild's stamp). Each is an object with an Inspect choice; a wrong pick costs nothing but a line from
  the stallholder ("That one? Hm.") and the player can look again. No fight. 3) Report all three to Samira. She pays
  the bet, then writes: *Lesson in appraisal, fifty gold.* Net 100.
- **Anissa's hints:** "Samira looks at edges. Look at edges." / "One coin has a smooth edge; real ones are milled." /
  "The smooth coin, the carpet with loose knots, the weight with no stamp."
- **Reward:** 150 gold then -50 (net 100), 110 XP, +1 Influence (Al-Doria). Journal note: *How Samira looks at
  things* (edges, knots, stamps: the eye the coin clue needs later).

### 7.2 Sweet Water (A-3; the rebel safehouse; puzzle M-ALD-2, the cistern pin)

- **Opens:** with A-1 (`story.vault_refused`); the children are at the fountain from the first visit. Shows as
  *??? The dry fountain*. Giver: the children (two, `market_kid` and `festival_kid` looks): "The fountain stopped
  when the guild put in its pipes. Now water is a copper a cup. The water-lady gives it free but she's always out."
- **Steps:** 1) The **water-carrier's door** in the lane off the square, a grey **thumbprint** on it (the Journal's
  ash thumbprint, the third): she stands in her doorway with two jars (as the lamp-oil seller stood in Chapter 2).
  "The guild bent the cistern line into its own tanks at the cistern head, past the caravan gate. The old gate is
  still there. Nobody has moved it in fifty years. I carry what I can from the well behind me; it is not enough."
  (`side.sweet_water.carrier`; she does not say who pays for the well, and nobody asks: the thumbprint says it.)
  2) **The cistern head** on the Desert Edge (an ambush or two on the way: the fights the chapter wants): the guild's
  iron sluice sends the qanat's flow into the guild's tanks; the old gate to the city line is rusted shut. The air
  shimmers over the old gate. 3) **Echo** (the week the vault was built): the old gate is open and the water runs to
  the city, but its pin is loose and a Zetwal engineer with Patricio's company is about to take the gate off "for the
  iron". Patricio pins the gate open (**anchor** `anchor.cistern_pin`: "Leave the city its water."). 4) In the present
  the old gate stands pinned open; the flow splits (the floor redraws on the anchor, as the drained cave did), and
  back on the square **the fountain runs** (object swap on the anchor; staged: the two children run to it and drink;
  the water-carrier comes to her doorway and watches, one line: "Fifty years. Who pinned it?" Gianna: "My
  grandfather." She looks at the Locket. "Then you'll want to know who pays for my well. Not today."). 5) Tell the
  children (or the water-carrier): done.
- **Anissa's hints:** "Water used to come here. What stopped it?" / "In the memory the gate is open, but it won't stay
  open." / "Pin the cistern gate open in the memory, like the Chain Bridge."
- **Reward:** 120 gold, 130 XP, +2 Influence (Al-Doria), Journal: *The ash thumbprint, a third time* (Yucayeque's
  oil, Cenizal's bread, Bab al-Dhahab's water: the same grey mark; the guide's "someone is feeding the realm" note
  waits for the fifth).
- **Echo party here:** Patricio, Caona, Benny; the engineer is an NPC; no Echo battle.

### 7.3 The debate, required: *Is a bad bargain still sacred?*

- **Where:** the souk square, by the dry fountain. A **Witness contract-priest** (the faith of oaths: a promise written
  is a promise watched) against a **Gaze merchant** (the Gaze remembers who was cheated). Shows as *??? The souk
  square*. Opens with the city (`story.vault_refused`), so the Majlis's refusal is fresh when the priest defends it.
- **Rounds (draft):** 1) Priest: "A promise written is a promise watched. A bad bargain kept is still a kept
  promise." (Scripture: the Gaze remembers the bargain *and* who was cheated by it, and judges both; Reason, with
  *On Contracts* read: the Witness's own teaching binds the ones who consented, so a bargain over a third party's
  goods binds the third party to nothing; Compassion: ask the one who was sold.) 2) Merchant: "Then the Crown's charter
  on Xaraguá is sacred too?" Priest: "If it was signed, it is watched. *Sacred* and *just* are different words."
  (The strong answer takes him at his word: watched, then; let the Witness see it read aloud.) 3) "What do you owe a
  house that keeps a bad bargain?" (The Majlis's question, turned on the square.) Strong, fair and weak answers as the
  built debates have them; **Reason** needs one House of Ledgers book (*On Contracts*, *The Witness in the Market* or
  *The Dorini Promise*), and Anissa's nudge says so.
- **Mediate** needs Influence 5 in Al-Doria (A-1 +1, A-3 +2, two books +2: reachable on purpose).
- **Reward:** the debate's own (15 or 25 XP, +1 Influence, Concord), as in Chapters 1 to 3.
- The priest's and the merchant's lines after the vault change (`clue.sealed_seventh`): the priest: "Sealed by the
  Throne. Then the Throne is the witness it must answer to." One line each, no second debate.

### Anissa's nudges (mystery quests, under 128 characters)

- A-1: "Samira bet you can't spot a fake, Gigi. She was smiling when she said it. I think she wants you to win."
- The debate: "A priest and a merchant are arguing by the fountain about bad bargains. The ledger house would know."
- A-3: "The children on the fountain rim have cups and nothing in them, Gigi. Ask them."

---

## 8. The Echo puzzle: the guild vault (SIG-ALD, difficulty 4)

- **The antechamber in the present:** the balance door (a pan, five brass weights on hooks: 1, 2, 4, 8, 16, each an
  object that toggles on or off the pan with a click and a visible swing), the chained ledger page beside it ("the
  price of the harbour" in the guild's letter-numbers, smudged past reading). The whole antechamber is an Echo Zone;
  Anissa waits at the stair head.
- **The Echo** (beat 6): young Yusuf writes the same entry in plain numbers and says it aloud: **25**. The locksmith is
  fitting the inner door and asks for the pattern.
- **Part 1, the weights:** back in the present, hang **16, 8 and 1** (`puzzle.vault.w16`, `w8`, `w1` on; `w4`, `w2`
  off: the door's `if` lists the exact five flags, no sum needed). Wrong totals tilt the pan and say "Too heavy" or
  "Too light": visible and harmless. The door opens (`story.vault_outer`).
- **Part 2, the sun:** the inner door's keyhole fits nothing until the Echo's locksmith has cut it (**anchor**
  `anchor.vault_sunlock`, from Patricio showing the Locket). Back in the present the lock object swaps and the Locket
  opens it (`story.vault_inner`).
- **Hints (from PUZZLES.md):** "The door wants a weight. The page says how much, if you can read it." / "Yusuf wrote
  this page. In the memory, watch him write it." / "The price is 25: hang 16, 8 and 1. Then, in the memory, show the
  locksmith the Locket."
- **The book *The Letter-Numbers*** (the library) is colour: it explains the cipher the page uses, and a player who has
  read it gets one extra line at the lectern ("Kaf, he... the ink has run. Yusuf would have written it plain
  somewhere.") It never replaces the Echo.
- **Files:** `puzzles/aldoria_vault/solution.json` and `cheats.json`, replayed by `tests/puzzles.test.ts` like the
  bridge, the sluice and the forge. Shared XP: the signature puzzle's 60.
- **Echo party here:** Patricio, Caona, Benny (Benny's first Echo as a member; he fights nowhere in this chapter).

---

## 9. New systems the chapter needs (honest effort, in Opus builder-days)

| System | What | Effort | Notes |
|---|---|---|---|
| **Samira as data** | A `MemberDef` (section 10's entry), her skills, two looks (walk, battle stance), a portrait placeholder | 0.25 | The "fighters as data" foundation makes this a table entry; if it has not landed, she is added the way Caona was. |
| **Skills that cost gold** | `gold?: number` on a skill beside `sp`; the battle reads and spends the party's gold; the command list greys a skill the purse cannot pay; `DAFTAR` costs in `config.ts` (20 gold per 10 HP, 20 per 10 damage; +1% per realm Wealth point, capped at +30%) | 0.5 | `engine/battle.ts`, `scenes/BattleScene.ts`, tests. Daftar is two skills for the release (*Mend*, *Strike*); *Retainer* (Inspired for 60 gold) and *Bazaar al-Dhahab* (an extra action for 200) follow (section 11). |
| **Bribe** | A skill that removes one human enemy from the fight (no XP, no gold, no Fear for it); `hired` enemies refund the price | 0.25 | Animals and bosses refuse ("He is not for sale."). |
| **The Golden Wall** | A status with `breaksOn: 'surge'`, else Warded's duration | 0.1 | |
| **Qasim's hiring** | Reuses Chapter 3's reinforcement event (a foe entering mid-fight) and phases; adds a cap on hired foes | 0.25 | If Chapter 3's piece slips, Qasim starts with three blades and *Hire Blades* becomes *Pay Off* (Inspired on his blades, steals 30 gold): a plainer fight, same length. |
| **The scripted Yield** | Qasim's three outcomes | 0.25 | On the Yield foundation; the fallback is the Thorne ending (section 4.2). |
| **The voyage** | `ardencia_aldoria` | 0.1 | Data only. |
| **The caravan departure** | A land journey drawn over the realm map (a dotted caravan line, the voyage scene with `land: true`), from the caravan gate to Eightgate | 0.5 | **Chapter 5's problem, listed here because the card says "Next".** Fallback for Chapter 4: the card closes on the gate, and Chapter 5 opens at Eightgate; the caravan scene is built with Chapter 5's start. |
| **Maps** | Six, drawn in code; the vault's and cistern head's Echo layers; the dusk variant | 1.5 | Sonnet with Opus checking; `tools/validate-maps.ts` on each. Smaller than Chapter 3's seven. |
| **Dialogue, staged** | About 230 lines: the strand, the quay's porters and factor, Samira's walk-up and invoice, the Majlis's hall, the water-carrier, the fountain running, the dusk door, the Echo at Yusuf's desk, Qasim's entrance and the expulsion, Layla's descent, the purse, the coin, the caravan | 1 | Sonnet from this outline once the maps' tiles are known. |
| **Books, debate, quests, encounters, NPCs, looks, audio entries** | Nine library books, four Majlis books, the debate, two side quests, one encounter table, about 18 new looks (section 10), two enemy drawings, a placeholder Al-Doria track and the bazaar's lantern loop in `audio.config.ts` | 0.75 | Sonnet and Haiku. Samira's prompt goes to `ART-PROMPTS.md` the day the outline is approved (the Opus review's drop-2 list has her). |
| **Route, chapter starts, tests, smoke** | The chapter's route (its own file if the test foundation's one-route-per-chapter has landed, else `@chapter4-end` on the shared route); `tools/chapter-starts.ts` gains chapter 5; `CHAPTERS` gains `ACT4`; `cards.ts` gains `act4_end`; the act test's objective list; the smoke test's Chapter 4 section | 0.75 | |
| **Total** | | **about 6 builder-days** | Oct 23 to 27 is five calendar days with Sonnet and Haiku in parallel and Chapter 3 finishing alongside: it fits if the maps and the gold-cost skills start on day one and the dialogue is written from this outline before the maps are final (section 15). |

**Not needed for the release:** the Old Counting House map (A-4), the ruined caravanserai's interior (A-2), the Crown
factor's office (A-5), *Retainer* and *Bazaar al-Dhahab*, Samira's "cash a coupon" (the Sakk), Al-Doria's ally pledge
(the price, Influence 10, is the economy foundation's; this chapter earns Influence toward it and records nothing
else), a stealth system (A-3 has none), Echo battles.

---

## 10. People, with placeholder looks (drawn in code, `assets.config.ts` NPC looks, art drops in through the config)

### Samira Dorini, as a data entry (the "fighters as data" foundation; proposal)

```
{
  id: 'samira', name: 'Samira', role: 'Alchemist', house: 'Dorini', portrait: 'samira', era: 'present', class: 'mage',
  passives: [
    { name: 'Baraka Dorini', text: 'Gold from battles is a tenth higher while she is in the party.' },
    { name: 'Everything has a price', text: 'Her Daftar skills spend gold, not SP, and grow with the realm\'s Wealth.' },
  ],
  joins: { flag: 'story.samira_joined' },
  base: { hp: 46, sp: 24, atk: 7, def: 7, mag: 12, spd: 11 }, growth: { hp: 5, sp: 3, atk: 1, def: 1, mag: 2, spd: 1 },
  start: { weapon: 'weighing_rod', armor: 'merchant_robe' },
}
```

Back row (`class: 'mage'`: she holds a brass **weighing rod**, a staff-type weapon drawn as a balance beam; robes suit
her). Skills at join: **Tonic** (SP 6, heal power 110 + cleanse one status), **Daftar: Mend** (gold, heal), **Daftar:
Strike** (gold, damage), **Bribe** (gold, one human leaves). Learns *Retainer* and *Bazaar al-Dhahab* after the
release. She arrives at the party's level by the shared-XP rule, with her rod and robe at tier 12. Her level-up line:
"Noted." Her Surge line does not exist: she is not Gianna; Anissa's Spark reaches only Gianna, as the pairing rule says.

| Person | Role | Placeholder look | Where |
|---|---|---|---|
| **Samira Dorini** | the appraiser, then the companion | New drawn look: small, quick, green sash over a cream robe, a slip-book in the sash, a tiny scale on a cord; a battle stance (the rod held like a balance); a portrait placeholder. Prompt to `ART-PROMPTS.md` | the row, the Majlis steps, the green door, the vault, the gate |
| **Layla Dorini** | the Merchant-Prince | `chancellor` recoloured green and gold with a ledger chain; a portrait placeholder | the divan, the vault stair |
| **Guildmaster Qasim** | the boss | New drawn look: broad, gold rings, a cane, the guild's green; a drawn enemy sprite | the divan, the vault |
| The Crown trade factor | the Crown's hand in the port | `crown_consul` under his own NPC id (A-5's hook) | the quay, the Majlis |
| The chief scribe | Layla's voice when she will not speak | `scribe` in green | the Majlis, the vault, the gate |
| The treasurer, two contract scribes, the guild master who will not trade with the Crown, the caravan master | the seat's people | `treasurer`, `clerk` x2, `council_speaker`, `porter` with a staff | the Majlis, the gate yard |
| Two Majlis guards, the guild doorman | | `honor_guard` and `town_guard` in green | the Majlis, the green door |
| The gate clerk, the customs clerk, four porters | the quay | `clerk`, `clerk`, `porter` x4 | the quay |
| The price-board crier | the prices (A-4's hook) | `gazette_crier` | the quay, the square |
| The old moneychanger | A-4's hook, one line only ("The sun. Hm. Come back when you have time for an old man's story.") | `elder` with a purse | the row |
| Tea seller, amulet seller, armourer | vendors; greetings "Ahlan wa sahlan", "Tfaddal", "Ahlan", flagged `verified: false` for the fluent-reader pass (Opus review 6.9: Arabic is on the list) | `spice_seller`, `charm_seller`, `ironmonger` recoloured | the lanes |
| Three stallholders (coins, carpets, weights) | A-1 | `cloth_merchant`, `produce_seller`, `engraver` | the row |
| The water-carrier | A-3, the safehouse | `nursemaid` recoloured with two jars | her doorway |
| Two children | A-3 | `market_kid`, `festival_kid` | the fountain |
| The Witness contract-priest, the Gaze merchant | the debate | `acolyte` in white and green; `cloth_merchant` with a sun pin | the square |
| The keeper of ledgers | the library | `archivist` in green | the House of Ledgers |
| **Young Yusuf** (Echo) | the ledger | New drawn look in sepia: `clerk` base, a reed pen, a ledger chain | the antechamber, Echo |
| The locksmith, two clerks, the Zetwal engineer (Echo) | the sun lock; the cistern | `engraver`, `clerk` x2, `echo_builder`, all sepia | the antechamber; the cistern head, Echo |
| **Caona, young Benny, young Patricio** (Echo) | the Echo party | Built | the Echo |
| Caravan Raider (enemy), Qasim (enemy) | the fights | Drawn placeholders in `ENEMY_ART`: a sand-coloured wrap with a curved blade; the guildmaster with his cane | the desert, the vault |
| The trader captain, the sergeant, two soldiers | the strand | Built in Chapter 3 | the strand |

Nobody is named beyond Samira, Layla, Qasim and Yusuf until the owner names them (the CAPITALS rule). Qasim's name is
still the design's proposal; it ships as the placeholder unless the owner changes it.

---

## 11. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

1. **Layla Dorini is the Merchant-Prince, and the mother Samira defies.** Recommendation: yes, built now. *Reason:*
   this is one of the four Gen III questions dated Dec 1 in `docs/PRODUCTION.md` (the Opus review moved them to early
   November); Chapter 4 puts her on the divan this week, and her scenes (the refusal, the descent into the vault, the
   purse sent without a word) are written as a mother's, so if the ruler is someone else the Majlis and the vault's
   last scene are rewritten, not retouched. The alternative is a Merchant-Prince from another guild family, with
   Layla as the harbour banker on the council who pays Samira's debts: the same beats, a different speaker, and
   Samira's defiance aimed at the guild rather than her mother.

No second question. The rest are Claude's calls, none of which changes the story's flow:

- **Samira joins in the vault, before Qasim, expelled on the spot** (beat 8), not after the fight as `STORY.md` beat 8
  had it. *Reason:* Qasim is the guildmaster, so he can strike her off in front of the party, and joining before the
  fight lets the fight teach Bribe and Daftar; her choice is made in front of the man who punishes it, which is the
  companions' pattern (Azzy in the dark, Yari before the elders).
- **The copy stays in Al-Doria; the party leaves with Benny's note, the sealed seventh page seen, and Layla's caravan
  pass.** *Reason:* a witness holds (Layla's line is also the rule); the seal is the Throne's, so Eightgate is the only
  lawful reader, which is `STORY.md` beat 5's proposal; and the pass is the way to Chapter 5 that question 12 left open.
- **Layla pays Samira's debts in public silence** (the purse by the scribe's hand, beat 10) rather than in a private
  scene. *Reason:* the owner's rule is show, don't tell; a private scene with Layla would have to be played by Gianna,
  who is not in it. The design's "says nothing in public" is kept to the letter.
- **The coin is Yari's fare coin from the resistance's oil money**, set at the strand unless Chapter 2's oil quest
  already set it. *Reason:* the clue must not depend on a line in another helper's build landing; the double-grant
  guard is one condition.
- **The two required side quests are A-1 and A-3** (section 7); A-2, A-4 and A-5 after the release, A-5 first.
- **The Old Counting House is folded into the vault's Echo** for the release (section 3). *Reason:* one Echo zone
  carries Yusuf's ledger and the puzzle's cipher; the separate map returns with A-4.
- **No Echo battle in this chapter.** *Reason:* the Opus review's rule (Echo battles only where the story has them:
  Chapter 3's march, Chapter 5's Archive, Chapter 11's harbour); Benny's first Echo as a member is a walk, and his line
  about the page is the point.
- **The family slot** (owner direction, Oct 21: Rael's six siblings and Elodie's two are each bumped into along the
  way; where each appears is being settled now) is section 2a: one marked place, one suggestion, nothing built
  around it.
- **Qasim is level 14** (the design's number) with level-13 blades and more arriving, rather than +3 like Rael. *Reason:*
  he is a profiteer who pays others to fight; the hiring is the difficulty, and the simulator tunes it.
- **Daftar ships as two skills** (*Mend*, *Strike*), Bribe as one; *Retainer* and *Bazaar al-Dhahab* after the release.
  *Reason:* a gold cost on a skill and an enemy that leaves are small; "one ally acts again now" is a turn-order change
  that the Patient Hour (Chapter 9's secret) needs too, so it is built once, later.

---

## 12. Length

Estimated from Chapter 2's measured route (1,020 steps, 37 transitions, 261 lines, about 40 minutes) and these maps:

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The strand, the voyage, the quay | ~90 | 3 | ~25 | |
| The bazaar, Samira, the Majlis | ~160 | 3 | ~45 | |
| A-1, the debate | ~140 | 1 | ~45 | |
| A-3 (the lane, the desert, the Echo, the fountain) | ~260 | 5 | ~35 | 1 to 2 ambushes |
| Dusk, the stair, the Echo, the balance, the sun, the vault | ~180 | 3 | ~40 | |
| Qasim, Layla, the stair | ~40 | 1 | ~30 | Qasim |
| The gate, the card | ~40 | 1 | ~20 | |
| **Chapter 4** | **~910** | **17** | **~240** | 2 to 3 |

About 35 minutes, a little over the plan's 30: the safehouse's walk to the cistern head is the extra, and it is the
chapter's only time outside the walls. The library and a second ambush are on top for players who want them.

---

## 13. Continuity into Chapter 5 (Eightgate, The Parley)

- **The lead:** the seventh page is sealed with the Throne's wax; only the Throne Archive opens it lawfully; Layla's
  pass puts the party on a Dorini caravan that the eight gates do not stop. `?chapter=5` starts at Eightgate's gate
  with the caravan master's last line ("The Dorini flag got you through the gate. It will not get you through a
  door."). The caravan journey itself (a land voyage over the realm map) is Chapter 5's first build item, with a card
  as the fallback (section 9).
- **The party leaves with:** Samira (`party.samira`, level 14, back row, the rod and the robe), Azzy, Yari, Anissa;
  Benny, Caona and Patricio in the Echo party; key items `item.benny_note` (Benny's refusal in his own hand: a
  witness for the Hearing, with Ar-2's *Benny's Refusal* copy), `item.dorini_pass`; flags `clue.sealed_seventh`,
  `clue.harbor_price` (Yusuf's 25), `clue.brasador_coin` (Rael clue 4), `side.sweet_water.done` (the third
  thumbprint), `choice.samira_invoice`; Qasim's Yield outcome (`encounter.aldoria_story.qasim.spared|spoils|broken`)
  for the Hearing's one line about him; Al-Doria's Influence (3 from the quests, 1 from the debate, up to 13 from the
  books) toward its price of 10.
- **What Gianna believes:** unchanged (`belief.rael_traitor`); the coin makes it worse in her mouth ("he pays the
  resistance so he can sell it") and better in the player's. Elodie's two lines at Eightgate land on this.
- **Yari's harbour:** she has now seen it sold twice (the Charter in Chapter 2, the crates at the quay); Chapter 5's
  reading of the seventh clause is the third time, aloud, and the Chapter 5 outline should give her the line after
  it, not Gianna.
- **Samira and Eightgate:** she has never been inside the Throne's walls and prices everything in it; Elodie's
  reaction to her (a Dorini in her daughter's party) is a Chapter 5 line. Her A-5 invoice for the Crown factor is the
  first Al-Doria quest added after the release, reachable by the caravan road back (the realm travel foundation).
- **The Chapter 3 outline's numbers hold:** Azzy's sprites, Rael's theme slot, the Cinder Flats' patrols; nothing
  built in Chapter 3 is touched except `CHAPTERS`, `chapters.json`, the route and `encounters.ts`.

---

## 14. Risks

- **Three systems from other builds.** Qasim's hiring stands on Chapter 3's reinforcements and phases; the Yield on
  the economy foundation; the route on the test foundation. Each has a fallback above (a plainer fight; the Thorne
  ending; the shared route), so none blocks the chapter, but each fallback is a thing to replace in the Nov 16 to 21
  balance week, and the list should be written down on day one rather than discovered on day five.
- **Gold as a resource.** Daftar and Bribe make gold matter in a fight for the first time; a player who has spent
  everything on tier-12 gear arrives at Qasim with an empty purse and Samira has Tonic only. That is fair (Tonic is
  free), and the simulator should play Qasim with 0 gold and with 1,000 to see both. `DAFTAR` costs are config.
- **Influence from books vs. ally prices.** Thirteen books in Al-Doria give +13 Influence there, above the house's
  price of 10, before any diplomacy. That is the economy foundation's to settle (price against the realm score, or cap
  the book share per city); flagged here because this chapter is the first to earn toward a price.
- **Samira is the chapter's face and has no art.** A drawn placeholder; her prompt should go in on the day the outline
  is approved, since the Opus review names her for drop 2 (Nov 7).
- **Arabic greetings** and the names (Bab al-Dhahab, the Majlis, *sakk*, *baraka*, *daftar*) need the fluent-reader
  check the Opus review asked for per chapter, not on Nov 18 alone; every line is flagged `verified: false`.
- **The coin's double source.** If the X-2 helper adds the coin to Chapter 2, the strand's line must be conditioned
  off (`!item.brasador_coin`); if not, the strand grants it. A content test should assert the coin exists at the
  gate scene either way.
- **The debate's third round borrows the Majlis's question**; if the owner's answer to question 1 moves Layla off the
  divan, the round's wording changes with her.
- **Tone.** Samira's invoices are the companions' comedy (guide 13.9) and never touch Anissa or the vault's Echo;
  Layla never raises her voice; the Witness faith is fictional and nothing real is called a cult (guide 7.3). No
  camel joke; the animals are placeholders, not characters.
- **Chapter 3 is finishing in parallel, and late.** Its second review expects it to land about Oct 29 to 31, on top
  of this chapter's Oct 23 to 27 slot. Everything here except beat 0 can be built from the Chapter 3 outline's end
  state (the flags, the party, the camp map's spawn) before Chapter 3 is done; the strand scene edits `ardencia-camp`
  and the Chapter 3 end dialogue's last node (the captain's ready check), so it is written last and merged with
  Chapter 3's builder. `?chapter=4` needs Chapter 3's route to exist; until then the chapter is tested from a
  hand-written start save with the section 1 state.

---

## 15. Build plan (small steps, each checked before the next; sized to Oct 23 to 27, about 2 to 3 builder-days of Opus plus helpers)

1. **Decision and docs (day 1, morning).** The second review; the owner's answer to question 1; then `STORY.md`
   Chapter 4 rewritten to this outline (beat 9 closed), `CAPITALS.md` 3 re-chaptered and re-levelled, `PUZZLES.md`'s
   SIG-ALD chapter fixed, `SIDE-QUESTS.md` A-1 and A-3 marked for the release, `COMBAT.md` 9.6 and 13.3 (Qasim's
   hiring cap and Yield) updated, Samira's prompt into `ART-PROMPTS.md`.
2. **Engine, from day 1 (Opus, about 1 day):** gold-cost skills and the purse in battle; Bribe and `hired`; the Golden
   Wall's break; Qasim's hiring cap on Chapter 3's reinforcement event; the scripted Yield on the foundation's step (or
   the fallback); Samira's `MemberDef`, rod and robe; unit tests with a test-only fight. The sim plays Qasim at 11, 13
   and 15 with 0 and 1,000 gold.
3. **Maps (days 1 to 2, Sonnet):** the six maps from section 3 with doors, spawns, the vault's and cistern head's Echo
   zones and anchors, the dusk variant, the ambush layer; validated; the city entry in `CITIES`.
4. **Content (day 2, Sonnet and Haiku):** thirteen books, the Caravan Raider and Qasim, the debate, A-1 and A-3 with
   their objects, the `desert_edge` table, the voyage, audio entries, the looks, the speakers.
5. **Dialogue and the story wiring (days 2 to 3, Opus with Sonnet):** `data/dialogue/aldoria.ts` staged from the beats;
   `ACT4` in `quests.ts` with hints and goals; the gate; the Echo at Yusuf's desk; the vault; Qasim's entrance and the
   expulsion; Layla's descent; the purse, the coin, the caravan; the card.
6. **The puzzle files and tests (day 3):** `puzzles/aldoria_vault/`; quests, guide, debate, side-quest, maps and stage
   tests green; the coin's either-way assertion.
7. **The route (day 3):** Chapter 4's route from its chapter start; `chapter-starts.ts` with chapter 5;
   `act.test.ts`; the smoke test's Chapter 4 section with screenshots of the balance door, the Echo at the desk,
   Samira's join, the Golden Wall and the fountain running, at 844 x 390 and 390 x 844.
8. **Full browser test (day 4 at the latest):** the chapter end to end on a phone; Game Over on a desert ambush and on
   Qasim (the stair's way back in); `npm test`, typecheck, lint, build; then the owner's playthrough and the Chapters 3
   to 5 review batch (about Nov 1).

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24), card art, portraits and the card back before the Oct 31 freeze, order B with proofs Mon Nov 3, the Dec 1 story
questions now needed by early November (question 1 above is one of them), the fluent-speaker check Nov 18.

---

## Built (Oct 22, branch `chapter3`): what is in the game, and Claude's calls

Built in order of authority: the owner's decisions (`design/FAMILY.md`: Coralie; the Layla question, being asked,
built on the recommendation (a)), the second review (`2026-10-21-chapter4-outline-review.md`, every fix in its section
6), then this outline. Code: `quest/tools/maps/aldoria.ts` (six maps), `quest/src/data/dialogue/aldoria.ts` (every
scene; beat 0 is `camp_trader_talk` in `dialogue/ardencia.ts`), `ACT4` in `quest/src/data/quests.ts`, `battles.ts`
(Qasim, the Caravan Raider, `qasim_vault`, Bribe, Baraka of the Scale), `encounters.ts` (`desert_edge`),
`sideQuests.ts` (`appraise`, `bargain`, `sweet_water`), `debates.ts` (`aldoria_bargain`), `books.ts` (six plus two),
`voyages.ts` (`ardencia_aldoria`), the route (`@strand` to `@chapter4-end`), `?chapter=5`. Engine: Bribe and hired
blades, the Golden Wall (`gilded`), a boss who yields (`endsWithBoss`), `debate.<id>.settled`, `gold.pay`, Samira as a
map follower, a map two chapters share (`questForMap`). Tests: `tests/aldoria.test.ts`, `tests/qasim.test.ts`
(simulator), `puzzles/aldoria_vault/`, the act, guide, level-curve and chapter-start tests.

**Level curve** (`tools/level-curve.ts`): Chapter 4 ends at **level 14 (3,255 XP)**, 12 without its side quests; the
party meets Qasim at 13 (about 2,980 XP). On target.

**Claude's calls** (non-drastic, under the Oct 20 rule; the owner can overturn any):

1. **Layla's lines in one place** (`LAYLA` in `dialogue/aldoria.ts`): if the owner picks (b), only that object and its
   speaker change. A test checks every line she speaks comes from it.
2. **Qasim** (review 3.1, tuned with a 60-seed bot on the real engine): level 14, brute, HP x4, ATK x1.4; phase 1 *Cane*
   120 and *Hire Blades* every other turn (a Caravan Raider walks in, at most `HIRE_CAP` = 2 hired standing); phase 2 at
   60% (*Then I foreclose.*): *Cane* 160, *Seize Assets* once (area 230, Weakened, telegraphed "Guard, everyone!"),
   *Golden Wall* every third turn (damage taken x0.5 for its turns; a Surge-powered blow shatters it). At 0 HP he
   yields ("Enough. Enough! Name your fee.") and his blades walk out: the Yield step's fallback, the Spare outcome.
   200 XP, 200 gold. Bot results: level 14 guarding, 60 of 60 won; level 12 without Guard, about 1 in 5 lost; level 13
   about 32 actions; an empty purse at 13 still wins. The Yield's three outcomes wait for the economy foundation.
3. **Bribe** costs 25 gold a Samira level (325 at 13), refunded on a blade Qasim hired; Qasim, beasts and zealots
   refuse it (the gold stays). Who takes a purse is `bribable` on the enemy. A bribed foe pays no less XP (fights pay
   a fixed reward). *Daftar: Hired Blade* is renamed *Daftar: Debt Collected* (its id kept for saves).
4. **The camp is both chapters' map** (review 3.5): `questForMap` picks the latest chapter that has begun, so the camp
   shows Chapter 3 until its end and then Chapter 4, whose first objective (the lead, no XP) is done by `act3.complete`.
5. **Beat 0**: the trader's ready check on a fade; the sergeant placed again (he is no map NPC) pledges the strand to
   Azzy; Yari's coin from "the resistance in the caves", granted only if Chapter 2 did not; no second Free Brasador
   flag or note. Anissa's "That's our reef" moved to the quay's arrival (the voyage scene has captions only).
6. **The voyage** (review 3.12): from Ardencia's north coast east, then down the open sea past Zetwal (124,50) to
   Al-Doria's east coast (117,66). The opening picture has an Ardencia shore (black sand).
7. **The quay gate** is a closed door whose clerk reads the papers (walking into it asks him). The factor watches.
8. **Samira's invoice** really costs two gold (`gold.pay`); refusing adds a late fee on the slip, nothing more.
   After the Majlis she waits on its steps (outline beat 3) and names the three things; her stall says what is left.
9. **Dusk** (review 3.9) is the door's own condition (A-1, A-3 and the debate settled), not a flag: the debate now sets
   `debate.<id>.settled` itself, so a map's text condition can read it. Night stays until the caravan's first light.
10. **A-1**: the bet without the threat (review 3.13: "Then I'll know what you're worth."). Coralie is met by the
    stalls once the bet is taken, counts the knots at the carpet stall, and leaves when A-1 is reported. Reward 100
    gold (150 paid, 50 billed), 110 XP, +1 Influence.
11. **A-3**: the cistern's Echo opens only after the water-carrier (the third ash thumbprint); the pin is an anchor;
    the fountain runs when the party comes back to it (the children drink, the carrier watches). 120 gold, 130 XP,
    +2 Influence.
12. **The vault split** (review 3.4): the strongroom with its twelve boxes is behind the balance door (the guild's
    price); the sun lock guards only the witness's niche. The balance door needs the Echo (review 3.6): the right
    weights before Yusuf has spoken "do not hold"; `cheats.json` includes the binary search.
13. **Anissa** (review 3.2) walks to the edge of the antechamber's Echo with her "I'll hold the door" line, and steps
    behind Gianna before Qasim's blades come in. Her fight tip is plain (review 3.11). She never jokes.
14. **Yari's line** (review 3.3): "Patricio. Yusuf. Benny. Sarnai. Sayo. Arjun. Not Caona. She was never asked."
    Gianna, with Benny's half-sheet: "Six pages he signed. The seventh, he would not."
15. **The night after the vault**: Samira sends the party up the stair and east to the gate yard to sleep; the
    caravan scene opens on a fade to first light (purse, coin, a sibling beat between Azzy and Gianna, Azzy and
    Samira, the card). The party is not walked out of the gate (the stage cannot move the player): the caravan
    leaves, and the card closes the chapter in the yard. `?chapter=5` starts there until Eightgate's map exists.
16. **Books**: six in the House of Ledgers (five teach *Baraka of the Scale*: Warded and Inspired on one ally), two in
    the Majlis's archive of contracts (*The Vault Register*, *The Crown's Preference*, whose margin says Layla never
    sealed it). Reason in the debate needs *On Contracts*, *The Witness in the Market* or *The Dorini Promise*.
17. **Placeholders**: Samira (existing look), Layla, Qasim, the Caravan Raider, Coralie, Yusuf and the locksmith are
    drawn looks; new tiles are pattern placeholders; music slots reuse the city, hall, Echo and cane-road tracks.
    Arabic and Coralie's French are in new glossaries, all unverified.

**Not built (after the release, or waiting on other work):** A-2, A-4 (box 7 is its hook), A-5 (the factor's hook),
the Yield's three outcomes, the caravan's land journey (Chapter 5), Samira's battle stance and portrait art, prompts
for the new looks in `ART-PROMPTS.md`, TILE_ART drawings for the new tiles, the smoke test's Chapter 4 section (the
smoke test was not run).
