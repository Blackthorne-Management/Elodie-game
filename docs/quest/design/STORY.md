# Bloodlines: Echoes of Zetwal: the storyline

*Design pack, written Oct 14 (owner approved the work that day). Source of truth: `docs/quest/QUEST-BUILD-GUIDE.md`
(the guide). Everything the guide marks locked, settled or as an owner decision is kept exactly. Anything new in this
file is marked **(proposal)** and needs the owner's yes. Companion files: `CAPITALS.md`, `SIDE-QUESTS.md`,
`PUZZLES.md`, `COMBAT.md`, `SECRET-ITEMS.md`.*

---

## 1. How the story is cut

The guide splits the game into six Acts (5.5). The owner's new rule (Oct 14) is that **Chapter 1 is Pòdlimyè only**,
ending when Gigi leaves the city with Yari. So Acts stay as the big shape and Chapters are the playable units, one
per place (proposal for the numbering):

| Act (guide 5.5) | Chapter | Place (capital) | Minutes (guide) | Party level |
|---|---|---|---|---|
| I: The Mark | 1. The Festival of the Gaze | Zetwal (Pòdlimyè) | 35 | 1 to 3 |
| I: The Mark | 2. The Charter | Xaraguá (Yucayeque, proposal) | 40 | 3 to 8 |
| II: The Alliance Road | 3. The Ledger | Al-Doria (Bab al-Dhahab, proposal) | 30 | 8 to 11 |
| II: The Alliance Road | 4. The Trial of Blades | Ardencia (Cenizal, proposal) | 45 | 11 to 14 |
| Midpoint | 5. The Parley | Elodie's Seat | 20 | 14 to 15 |
| III: The Debt Revealed | 6. The Stolen Standard (any order) | Skarragol (Ordvik, proposal) | 30 | 15 to 21 |
| III: The Debt Revealed | 7. The Fog Files (any order) | Kuroshi (Kirinoura, proposal) | 30 | 15 to 21 |
| III: The Debt Revealed | 8. The Dying Flame (any order) | Jwaladesh (Agnipur, proposal) | 30 | 15 to 21 |
| III: The Debt Revealed | 9. The Regent's Keep | Aldermoor (Kingsmere, proposal) | 35 | 21 to 24 |
| IV: The Muster | 10. The Muster | Zetwal again (Pòdlimyè) | 10 (+ side content) | 24 to 25 |
| V: The War of the Harbor | 11. The War of the Harbor | Xaraguá again | 30 | 25 to 28 |
| VI: The Claim | 12. The Claim | Elodie's Seat again | 20 | 28 to 30 |
| Epilogue | The Hearing | Elodie's Seat | 10 | 30 |

**The three roads (Chapters 6 to 8) in any order (proposal for levels):** the first of the three the player enters
is set to levels 15 to 17, the second 17 to 19, the third 19 to 21. The region's level is fixed the first time the
party steps into it, so a region never re-scales under the player's feet. See `COMBAT.md` 6.

**Slice note:** the guide's slice is Zetwal + Xaraguá + Ardencia (about 2 hours), which skips Chapter 3. If the
slice ships first, Chapter 4 must not depend on anything from Chapter 3 (Samira, the Dorini ledger). This pack keeps
every Chapter 4 beat self-contained; Samira's Chapter 4 lines are optional extras. See the open questions in Section 6.

**The two eras** (guide 1.2, 6.1): the **Present** (Gen IV, Gianna's party) and the **Echo** (Gen II, the Alliance
War, about fifty years ago). In the Echo Gianna *is* young Patricio; Caona joins the Echo party when Yari is in the
Present party, and Benny joins it once Azzy has joined. Anissa never enters the Echo: she holds the door.

---

## 2. The game intro (animated) (proposal)

The owner wants Zetwal finished first and opened by an **animated game intro**. Proposal: a 75 to 90 second pixel
sequence, skippable after the first viewing, in the 320 x 180 frame, built from the three Gen I flashback stills the
guide already budgets (10.2) plus simple pans, fades and sprite moves. No dialogue boxes; a few lines of narration
over chiptune.

| Beat | Picture | Narration (draft) |
|---|---|---|
| 1 | Black. A single sun glyph glows and becomes the Gaze lamp. | "The goddess Elodie wove the realm. She does not rule it. She remembers." |
| 2 | Gen I still: cane fields, Crown ships, Mother Solange writing names by lamplight; the first archive burns. | "When the Crown called her people property, the temple wrote down their names." |
| 3 | Pan across Zetwal fifty years ago: barricades in the plaza, red revolutionary coats, Brasador banners arriving by sea, Yaguana canoes on the shore. | "Fifty years ago Zetwal rose. Marshal Patricio led it. Lord Benny of Ardencia came to fight beside him. Caona's scouts found every road." |
| 4 | Close shot: two hands press together a gold sun Locket and an iron signet; the halves glow. | "They sealed the alliance with a token made in two halves." |
| 5 | The Sun Accord on a table, bound with seven silk ribbons. A hand cuts the seventh ribbon's page away and slides it under the others. The camera does not show whose hand. | "The Crown sailed home. The Accord was signed. Six clauses were read aloud." |
| 6 | Dissolve to the present: the festival plaza at dawn, lanterns, a thousand people. A small girl with two hair puffs hides behind a young woman in a blue robe. | "Fifty years later, the city still remembers its dead aloud." |
| 7 | Title card: the painted Kay Soley crest downscaled to 32 x 32, then **BLOODLINES: ECHOES OF ZETWAL**. | (music swells; "Press A") |

Beat 5 is the only new illustration. Beat 6 reuses the plaza map. Music: the main theme, with Rael's low-brass
ostinato hidden under beat 4 (the guide's theme note, 5.8).

---

## 3. The chapters

Each chapter lists: where, the beats, who joins, the Echo scenes, the boss, the level range, and what the player
learns. **Built** means the beat already exists in `quest/src/data` (dialogue, quests, books). Details not in the
guide are marked **(proposal)**.

### Chapter 1: The Festival of the Gaze (Pòdlimyè, Zetwal)

- **Where:** Pòdlimyè, the capital of Zetwal (owner, Oct 14). Sections: the Festival Plaza and harbor, the Limyè
  house, the Hall of the Accord, the Temple Island, the Temple Archive and the Cane Road. See `CAPITALS.md`.
- **Level range:** 1 to 3. **No fights in Chapter 1** (owner decision): XP comes from story beats, lore books and
  side quests. The Cane Road is peaceful.
- **Beats:**
  1. The animated intro (proposal, Section 2).
  2. The Festival of Elodie's Gaze. Anissa joins as the follower; Gianna sets out with soup and akasan. **Built.**
  3. Elodie's address from the stage; she will leave for the Throne as Zetwal's envoy. **Built.**
  4. Gigi and Anissa walk her to the east gate. "The Gaze sees you both. So do I." **Built.**
  5. Anicette, in Patricio's study, gives Gianna the **Sun Locket**: "Two halves of a promise. This half is ours." **Built.**
  6. **First Echo** (tutorial): Gianna becomes young Patricio in his war room the night before the signing. The Crown's
     clerks have sent six clauses; the seventh is "still being copied". Benny will not sign pages he has not read.
     Patricio hides his night orders under the window seat (anchor). **Built.**
  7. The rope bridge to the Temple Island has fallen. **Signature puzzle: the Chain Bridge** (the Echo winch and the
     iron pin). **Built.**
  8. Old Patricio at the Gaze lamp: it will not take a flame. Anissa's light wakes and lights every lantern in the
     city. "Are you scared of me?" "Never." **Built.**
  9. A canoe at the island dock: **Yari** brings the warning. Crown ships in Xaraguá's harbor, a Charter of
     Protection, a clause no one in Xaraguá was shown. "We sail with the morning tide." **Built** (sets `act1.complete`).
  10. **The Last Evening (proposal).** Free roam with Yari in the party. The city reacts to the lights (built lines).
      Side quests can be finished. A Quiet Crown watcher on the Cane Road notices Anissa (built). Elodie's absence is
      felt: the Hall clerk shows Gianna the blank seventh line on the Marshal's stone and the seven-ribbon note.
  11. **Departure at dawn (proposal).** At the harbor: Anicette packs food and says "Ask them what we promised. Ask
      them, not the Crown" (echoing old Patricio's built line). Old Patricio gives Gianna his old Marshal's whistle
      (a key item, no stats; it matters again in Chapter 10). Papa Wout's ferry coach takes them, Yari's canoe towed
      behind. The city shrinks. Card: **Chapter 1 complete.** Chapter 1 ends here (owner rule).
- **Who joins:** Anissa (support, from the start), Yari (at the dock).
- **Echo scenes:** the war room (built), the Echo plaza camp (built: the cook, scout, drummer, soldier), the Chain
  Bridge bridgehead (built), the Temple under scaffolding (built: the lampwright, the builder). Proposal: one more,
  **the Name Stones** (side quest *The Seventh Stone*, `SIDE-QUESTS.md` Z-4), which leads to the Pòdlimyè secret item.
- **Boss:** none (no fights).
- **What the player learns:** the Echo and anchors; Anissa is far more than shy; the Accord has seven ribbons and six
  clauses, and the Marshal's stone has a blank seventh line; the Ash Wars records disagree (Cendre ford: forty dead,
  not four hundred); Elodie took the name Limyè "for the goddess"; the Quiet Crown wants quiet people, and noticed
  Anissa; the Crown is moving on Xaraguá.

### Chapter 2: The Charter (Xaraguá)

- **Where:** Yucayeque (proposal name), the capital of Xaraguá, House Yaguana. Green mountains, a harbor full of Crown
  ships, the areíto plaza, the petroglyph caves.
- **Level range:** 3 to 8. First battles in the game.
- **Beats:**
  1. Arrival by sea. Crown marines harass fishers on the pier: **the first battle** and the battle tutorial
     (proposal): Attack, Guard, then **Shield Anissa** first (guide 6.4: the first thing taught about Anissa), then
     Surge, then the Yield step on the marine sergeant.
  2. Cacique Anaco, Yari's father, is ailing. The elders' council is ready to accept the Charter "to keep the peace".
     Yari defies them in front of everyone. **Governor Thorne** watches from the customs house.
  3. A lamp-oil seller has supplied the resistance for years and has never met her supplier (Rael clue 6).
  4. The Charter's legal claim rests on the Seventh Clause. The cave of petroglyphs holds the Yaguana's own record of
     the oath their warriors swore to the alliance. **Signature puzzle:** the flooded petroglyph cave, the Echo sluice,
     and the rhythm lock at the areíto plaza.
  5. **Echo: the first oath.** At the areíto fifty years ago, Caona, Patricio and Benny swear the first oath. Caona's
     words promise the harbor stays Yaguana. Caona joins the Echo party from here (Yari is in the party).
  6. With the cave record, Gianna speaks for Xaraguá at the elders' council (a debate using the Concord system).
  7. Thorne moves to seize the record. **Boss: Governor Thorne** in the customs house.
  8. Thorne falls but the Crown's ships stay: the Charter is suspended, not torn up (proposal). The elders will wait
     if Gianna brings proof that the Seventh Clause was never agreed by Xaraguá. Anaco blesses Yari's road.
  9. Clue to the next step: the elders say the Dorini bankers of Al-Doria witnessed and held a signed copy of the
     Accord.
- **Who joins:** Yari formally (she was in the party since the dock); Caona in the Echo party.
- **Echo scenes:** the areíto first oath; the sluice at the cave mouth during the Revolution; Caona's scouts' camp.
- **Boss:** Governor Thorne (level 8).
- **What the player learns:** Xaraguá was never shown the Seventh Clause; Caona fought for a promise; the Crown's
  "protection" is a land grab in a legal coat; someone unknown has armed the resistance for years.

### Chapter 3: The Ledger (Al-Doria)

- **Where:** Bab al-Dhahab (proposal name), the port and caravan city of House Dorini.
- **Level range:** 8 to 11.
- **Beats:**
  1. The bazaar. Samira Dorini appraises the Sun Locket on sight ("half of something; the other half is worth more")
     and invoices Gianna for the opinion.
  2. The guild vault hides the signed Accord copy. The Merchant-Prince (proposal: the title rotates among guild
     families and is now held by Layla Dorini, Samira's mother) refuses: the guild profits from Crown trade.
  3. **Echo: the Dorini ledger.** Young Yusuf Dorini, keeper of the ledger, records what the Dorini were promised for
     signing: trade preference in Crown ports, paid for with Xaraguá's harbor. The Unpaid Debt has a price tag.
  4. **Signature puzzle:** the guild vault (weights and the ledger cipher), solved in both eras.
  5. The vault copy has seven ribbons; the seventh page is sealed with the Throne's own wax (proposal): only the Throne
     Archive can open it lawfully. Also in the vault: a note in Benny's hand, "I will not put my name to this page."
  6. Samira appraises a Brasador coin found in the Xaraguá resistance's oil money: "This coin has been somewhere else"
     (Rael clue 4).
  7. **Boss: Guildmaster Qasim** (proposal name), the war-profiteer who runs the vault, hiring blades mid-fight.
  8. Samira is expelled from the guild for helping; she joins. Layla says nothing in public; in private she pays
     Samira's debts (proposal).
  9. Next step: under Clause Six, the Throne hears any house that claims a breach. Brasador, whose lord refused to sign
     the Seventh Clause, is the one signatory with clean hands. Gianna goes to ask the Lord of Ardencia.
- **Who joins:** Samira Dorini (Alchemist).
- **Echo scenes:** Yusuf's counting room the week before the signing; the vault being built.
- **Boss:** Guildmaster Qasim (level 11).
- **What the player learns:** the allies were paid; the Accord had a price; Benny refused in writing; Brasador money
  is turning up where it should not be.

### Chapter 4: The Trial of Blades (Ardencia)

All of this chapter's key beats are the guide's (5.6, 5.8) and are kept exactly.

- **Where:** Cenizal (proposal name), Ardencia's fortress city in the fire-cracked highlands.
- **Level range:** 11 to 14. Rael is level 14 (orange: a hard fight by design, see `COMBAT.md`).
- **Beats:**
  1. Ardencia's law: no outsider gets an audience with the Lord unless she proves herself in a duel. **Envoy
     Cresswell** of the Crown watches from the gallery.
  2. **Azzy** is assigned as Gianna's escort. They bond. He believes in his father's honor and in Benny's legend.
  3. The elders are fat and corrupt; the poor seem neglected. Rebel groups quietly feed them (a safehouse side quest
     shows it to players who look).
  4. Concord debate in Ardencia: is a thief who feeds the hungry a thief? (Rael clue 7.)
  5. **Boss: Rael the Ruthless, the Trial of Blades**, three phases: Measured (he leaves Anissa an opening: Shield
     Anissa), Unleashed (War Cry and guards: Surge through), Cornered (Reign of Ashes: a clean Surge plus Comfort).
     Party members are **Bound**, never knocked out. He is defeated and survives.
  6. Under Brasador law the loser answers one question. Gianna asks why her mother never spoke of her father. Behind a
     screen from the envoy, Rael says coldly that **Gianna and Anissa are his daughters**, Elodie is his wife, and it
     changes nothing. The Locket and his signet are two halves of one token. **His signet glows.**
  7. The envoy re-enters. Rael declares for the Crown and orders the party seized. The signet glows again.
  8. **The Escape** (Echo puzzle sequence, signature): through **Benny's smuggler tunnel**, opened by an anchor Benny
     left; the forge-fortress lava channels on the way. Guards fire; the shots land **wide**. Azzy sees his father
     give the order and chooses Gianna. **Azzy joins.** The soldiers who follow him become **Free Brasador**.
  9. Gianna now believes her father is a traitor who sold Xaraguá. She cannot learn otherwise until near the end.
  10. **Echo callback** (after the escape, optional but strongly signposted): young Benny recognizes the Locket on
      Gianna's neck and says something he could not have said before; in the Present, old Benny in the keep (guards
      looking away) says the same.
  11. The dual claim opens: Gianna through Zetwal and Ardencia; Azzy through Ardencia.
- **Who joins:** Azzy (Blade-Knight); Benny in the Echo party; Free Brasador as an allied group (Fear, price 6).
- **Echo scenes:** Benny's smuggler tunnel; the Brasador march to the sea; young Benny's callback.
- **Boss:** Rael the Ruthless, Fight 1 (level 14).
- **What the player learns:** Rael is her father; the token is one token in two halves; the signet glows (the player
  sees it, Gianna does not understand); the shots missed; nobody died.

### Chapter 5: The Parley (Elodie's Seat, the midpoint)

- **Where:** Elodie's Seat, the Throne city at the centre of the realm.
- **Level range:** 14 to 15. Under a flag of truce: no boss (proposal: one Echo skirmish in the Archive).
- **Beats:**
  1. Elodie is Zetwal's envoy under Crown eyes. The **Lord Regent Aldric Vane** receives them under a flag of truce,
     calm and three moves ahead.
  2. **Signature puzzle:** the Throne Archive, reading the Accord in both eras.
  3. **Echo: the sealing of the Accord (owner decision, Oct 14; see open question 2).** The signed original arrives at the Throne
     Archive; the seventh page is read to the Throne's clerk alone and sealed. Patricio signs under protest of time;
     Benny refuses aloud; Caona is not in the room.
  4. **The Seventh Clause is read aloud** for the first time in fifty years: Xaraguá's harbor to the Crown, "to be
     revisited" (proposal wording in `CAPITALS.md`).
  5. Gianna confronts Elodie about Rael. Elodie explains why she hid the marriage (the children's safety, the claim).
     She can say only one true thing under Crown eyes: *"Believe what your Locket tells you, not what his mouth does."*
     In private: *"He should never have tested you."* Gianna takes it to mean the duel law.
  6. The Regent offers terms. Gianna refuses. The realm opens: three roads to allies (Skarragol, Kuroshi, Jwaladesh)
     and, after them, Aldermoor.
- **Who joins:** none.
- **Echo scenes:** the sealing; a young Thomas Stillwater copying the Crown's record in the gallery (setup for Ch. 9).
- **Boss:** none.
- **What the player learns:** the Seventh Clause; Elodie's two lines; the Regent's patience; allies must be won.

### Chapters 6 to 8: The three roads (any order)

The guide's Act III: Skarragol, Kuroshi and Jwaladesh, 30 minutes each, any order. Each wins an allied group by its
price (guide 6.3) and a companion. Levels by visit order (Section 1).

#### Chapter 6: The Stolen Standard (Skarragol)

- **Where:** Ordvik (proposal name), the fjord-and-steppe camp-city of House Ironvow.
- **Beats:** the great horse-fair; the clan's sacred standard is stolen and **Bayarmaa** is blamed; the council
  (proposal: led by **Torvald**, Bayarmaa's father) is ready to sell the fleet to the Crown for blockade compensation;
  **signature puzzle:** the frozen fjord crossing and the horse-herd stealth sequence; **Echo: Sarnai's raid** that
  broke the Crown's supply line; the thief is a Crown-paid raider chief; **boss: Noyan Grimvald** (proposal name);
  Bayarmaa clears her name and joins. Azzy is greeted as a royal grandson of the steppe (his mother's people) and
  hates it (comic, proposal).
- **Who joins:** Bayarmaa (Raider) and her horse (proposal name: **Salkhi**, "wind").
- **Price:** Wealth 10.
- **Learns:** Sarnai broke the Crown once by speed; the Crown buys whole councils; Azzy's mother's people are watching.

#### Chapter 7: The Fog Files (Kuroshi)

- **Where:** Kirinoura (proposal name), the misted harbor city of House Suzumori.
- **Beats:** a city of informants; **Haru Suzumori** introduces himself as "definitely not a spy" and tails them; the
  spymaster council (proposal: **Kaede Suzumori**, Haru's mother) orders neutrality; **signature puzzle:** the fog
  maze with lantern signals, rotating screens and the Echo spy map; **Echo: Lady Sayo's network** feeding Patricio the
  Crown's troop movements; the files name **the buyer's mark** but not the buyer (the betrayal foreshadow, guide 5.6)
  and show **a second trail: gold flowing out of Ardencia** to places no one should be funding (Rael clue 3); **boss:
  the Paper Fox** (proposal), a broker selling Kuroshi's files to the Crown; Haru refuses the neutrality order and joins.
- **Who joins:** Haru Suzumori (Shadow agent). **Price:** Influence 10.
- **Learns:** the Crown has bought (or will buy) one ally; Ardencia's gold goes somewhere secret.

#### Chapter 8: The Dying Flame (Jwaladesh)

- **Where:** Agnipur (proposal name), the fire-temple city of House Agnivansh.
- **Beats:** the sacred flame is running out of oil and the treasury is empty; the priests (proposal: led by **Meera**,
  Vikram's mother) want to hide the flame's failing; **Vikram** challenges Gianna to a duel over an argument (a
  sparring battle, he is out of breath at the end either way); **signature puzzle:** the relay of lamps and mirrors (a
  lamp lit in the Echo stays lit); **Echo: Arjun's charge at the Crown's harbor chain**; the oil was cornered by a
  Crown-backed hoarder; **boss: Seth Dhanraj** (proposal), the oil hoarder; Vikram defies the priests and joins.
- **Who joins:** Vikram (Fire duelist). **Price:** Wealth 8.
- **Learns:** a faith can be starved by a market; Arjun broke a chain; the Crown pays for shortages.

### Chapter 9: The Regent's Keep (Aldermoor)

- **Where:** Kingsmere (proposal name), the Crown's moorland capital, House Stillwater's homeland.
- **Level range:** 21 to 24.
- **Beats:**
  1. Ordinary Stillwater people are not villains (guide 1.2): the city is tired, polite and watched.
  2. **Edmund Stillwater**, ridiculously polite, apologizes before hitting a press-gang; a dissident faction wants
     protection from the Quiet Crown's purge (Fear, price 8). His mother, **Lady Rosalind Stillwater**, sits at court
     (proposal).
  3. **Signature puzzle, part one:** the archive in the Regent's keep (infiltration). The party finds the Crown's pact
     with Rael and a ledger of what he took. The ledger shows the gold leaving his hands into coded accounts on "the Ash
     Road" (proposal; see open question 6). Gianna reads it as greed.
  4. **Echo: the Crown's own record of the Seventh Clause**, written by young **Thomas Stillwater**, with a margin note
     that Xaraguá was never asked.
  5. The party is caught. **Signature puzzle, part two:** the courtroom "who is lying" trial before the Regent. Gianna
     wins by exposing a lying witness with Thomas's record.
  6. **Boss: the Hushed**, the hidden head of the Quiet Crown's hijacked cells, revealed inside the Regent's court
     (guide 5.3; see open question 3 for how this fits Rael's founding).
  7. Edmund defies the Regent and joins. The dissidents pledge.
- **Who joins:** Edmund Stillwater (Guardian).
- **Echo scenes:** Thomas copying the record; the Crown's war council hearing of Benny's refusal.
- **Boss:** the Hushed (level 24).
- **What the player learns:** the Crown always meant to keep the harbor; Rael took the Crown's gold; the Quiet Crown
  has been bent to hunt Anissa by the Regent's people.

### Chapter 10: The Muster (Pòdlimyè, return)

- **Where:** Pòdlimyè again. The Cane Road's ambushes switch on now: `story.zetwal_return` is set on arrival (built
  flag, listed in `LATER_STORY_FLAGS`).
- **Level range:** 24 to 25.
- **Beats:**
  1. The armies assemble on the plaza and the Cane Road. Old Patricio inspects them with his whistle (proposal: the
     whistle from Chapter 1 calls the Free Brasador to order).
  2. **Seat the feuds:** three mediations with Concord (guide 5.4): Dorini merchants against Ironvow raiders, Suzumori
     spies against Agnivansh priests (the burned temple), and the Stillwater dissidents against everyone.
  3. Anicette's *Ash Wars Gossip, Volume Two* (her own recollection: the fourth Ash Wars account) is now returned in
     Chapter 1 by the built side quest The Overdue Shelf (owner approved, Oct 14). This beat becomes Anicette
     talking it through with players who have read all four, who can tell which is false (proposal).
  4. **The Betrayal.** The Crown out-pays the least-paid of Al-Doria, Skarragol, Kuroshi and Jwaladesh (ties to
     Dorini). The betrayer is revealed as a secret member of the Quiet Crown. **Exposed route:** with the Kuroshi
     evidence and that house's price at least 60 percent paid, Gianna confronts them here and turns them into a late
     ally.
  5. The fleet sails for Xaraguá.
- **Who joins:** the allied armies.
- **Echo scenes:** the plaza camp on the morning of the signing (the same place, armies then and now).
- **Boss:** none (the Cane Road has random encounters at levels 22 to 25).
- **What the player learns:** who the Crown bought; that unity has to be built, not inherited.

### Chapter 11: The War of the Harbor (Xaraguá)

- **Where:** Xaraguá's harbor and the hills above it.
- **Level range:** 25 to 28.
- **Beats:**
  1. A multi-stage battle with the allied armies (army numbers decide reinforcements; `COMBAT.md` 11).
  2. **Flank fight against the betrayer** (unless turned at the Muster).
  3. **The Harbor Turn:** Rael's army appears on the flank. The player is given a **trust choice**:
     - **Trust:** the party holds; Rael's army turns on the Regent's flagship; Rael fights beside Gianna against the
       **Regent's champion**. Better rewards, stronger epilogue.
     - **Strike:** a hard four-phase fight against Rael's vanguard; he only binds, never kills; when his army breaks,
       his signet dark, he tells her the truth. The Regent's fleet escapes intact. Stability drops; Azzy is furious.
  4. Either way, **Gianna learns the truth here**: Rael is Elodie's secret husband, his Crown alliance was a farce, he
     runs a shadow government against corruption, and he founded the Quiet Crown, whose autonomy let it be bent
     against Anissa. Private line: "My father kept his oath and it cost him everything. I wanted to know what would
     happen if someone kept the goal instead."
  5. The Regent retreats to Elodie's Seat.
- **Who joins:** Rael fights as a guest in the Trust route (proposal: guest only, not a roster member).
- **Echo scenes:** Caona's last stand at the harbor in the Revolution (proposal), the place where the debt began.
- **Bosses:** the betrayer (level 26), then the Regent's champion (Trust, level 28) or Rael (Strike, level 28).
- **What the player learns:** the whole truth about Rael, and that she now has to decide what to do with it.

### Chapter 12: The Claim (Elodie's Seat)

- **Where:** the Throne Hall at Elodie's Seat.
- **Level range:** 28 to 30.
- **Beats** (rulebook Section 8, as the guide asks): Gianna, standing on the Throne tile, declares her **Claim**. The
  Regent declares a **Challenge**. **Boss: Lord Regent Aldric Vane.** Azzy, who also has a claim, chooses on the spot:
  renounce in her favor, share it, or (dark route) Challenge her too.
- **Who joins:** everyone present.
- **Echo scenes:** none in battle; after it, the Throne Archive's Echo shows young Patricio, Benny and Caona one last
  time (proposal), and Caona's oath is spoken aloud in both eras.
- **Boss:** the Lord Regent (level 30).
- **What the player learns:** the board game's Claim and Challenge, in story form.

### Epilogue: The Hearing

Kept exactly from the guide (5.6, 5.7). Rael surrenders to Gianna's Throne. Witnesses: the Ardencian rebel leaders he
fed and armed, the family of the treasurer he held captive for years without trial, the underground cells he funded,
Elodie, Azzy, Anissa (and old Benny and old Patricio may speak). Verdicts:

- **Pardon with conditions** (best; confirmed terms): Rael serves as **Warden of Oaths**, in a way that honors Benny,
  working in the light. The Ash Ledger becomes the Throne's **Office of Oaths**, used only to find and fight oppression.
  He publicly confesses he heads the Quiet Crown and dissolves its secret chain of command, frees every captive, makes
  restitution to the treasurer's family, and brings the corrupt elders to account.
- **Exile** (middling) or **Execution** (dark).

Endings (Accord Stability, guide 5.7): **The Just Throne** (canon), **The Hollow Throne**, **The Iron Throne**.
Rael at the Hearing: "I never asked the eggs how they felt. I am asking now."

---

## 4. Threads that run through every chapter

| Thread | Where it shows | Pays off |
|---|---|---|
| The Seventh Clause | Ch. 1 (six clauses, seven ribbons, blank stone line), Ch. 2 (Xaraguá never shown it), Ch. 3 (the sealed page, Benny's note), Ch. 5 (read aloud), Ch. 9 (Thomas's record) | Ch. 12 and the Hearing (Rael as Warden of Oaths enforces it) |
| Rael's eight clues (guide 5.8) | signet glow (Ch. 4), Elodie's two lines (Ch. 5), Kuroshi ledger trail (Ch. 7), Samira's coin (Ch. 3), Free Brasador "the arrows missed" (Ch. 4 onward), the lamp-oil seller (Ch. 2), the Ardencia debate (Ch. 4), nobody dies in his fights (all) | The Harbor Turn (Ch. 11) |
| The four Ash Wars accounts | Zetwal temple record (Ch. 1, built), Kuroshi spy ledger (Ch. 7), Crown chronicle (Ch. 9), Anicette's recollection (Ch. 1, The Overdue Shelf, built) | A Concord bonus and a Hearing line when all four are read (proposal) |
| The Overdue Books (proposal) | *Ash Wars Gossip* Volume Two (Anicette) and the missing Volume One (built hints) | Volume One turns up in Elodie's rooms at the Seat (Ch. 5 side quest) |
| Anissa finds her voice | shy lines (Ch. 1), first Surge (Ch. 2), Calm attacks by Hushers (Ch. 2 on), she speaks at the Muster (Ch. 10, proposal), she speaks at the Hearing | Her Surge animation grows more confident each chapter |
| The rebel safehouses | one per capital (guide 5.4) | lead to the Ash Ledger and Rael's real work |
| Secret items | one per capital, each a side quest plus an Echo puzzle (`SECRET-ITEMS.md`) | small story and power rewards; the Seat item changes the Claim |

## 5. Tone

Serious main story with comic companions (guide 13.9): Yari's hutia, Samira's invoices, Bayarmaa's horse who talks
more than she does, Haru's "definitely not a spy", Vikram out of breath, Edmund's apologies and tea. **No jokes in the
Rael, Anissa or Hearing scenes.** No real faith is ever shown as a cult; the Quiet Crown is fictional and tied to no
real people (guide 7.3).

## 6. Conflicts and open questions found while writing (for the owner)

1. **The capital's name.** **Settled (owner, Oct 14): Pòdlimyè**, "Port of Light". In Kreyol *pò* is "port"
   (*pòt* is "door"), and French port names fuse into one word (Port-de-Paix is Pòdepè). Replaces the earlier
   "Pòt Limyè". A fluent speaker confirms the spelling (Nov 18).
2. **Where was the Accord signed?** **Settled (owner, Oct 14):** in Pòdlimyè's plaza, as the built lore says (the
   *Alliance War* book, the Marshal's Stone, the war room). Elodie's Seat's Echo is **the sealing** of the signed
   original in the Throne Archive, where the seventh clause is hidden.
3. **Who is the Hushed?** **Settled (owner, Oct 14):** the Regent's agent, who has taken over the cells that hunt
   Anissa and whom the members *believe* to be the head of the Quiet Crown. Rael is the true founder above all
   cells, unknown to every member. Two reveals: the Hushed unmasked in the Regent's court (Chapter 9), Rael's
   confession at the Hearing (late). In Chapter 1 the recruiters and the veiled woman speak of "the Hushed" as their
   leader and never of Rael.
4. **Patricio in every land.** The Echo party is always Patricio's (guide 6.1), so he must have been in every capital
   during the war, including the Crown's own Aldermoor. Proposal: he went to Kingsmere under a flag of truce to
   negotiate the peace (that is when Thomas Stillwater met him). Owner to confirm.
5. **Samira's Daftar vs gold.** The guide's class table says Daftar "converts Wealth to heal, damage or buffs", but the
   owner decision of Oct 14 says Wealth is a score that is never spent. Proposal in `COMBAT.md`: Daftar spends
   **gold**, and scales with the realm Wealth score without lowering it.
6. **The Aldermoor ledger.** The guide says the party finds "a ledger of what he took and where it really went". If it
   shows where the gold really went, Gianna learns Rael is good in Chapter 9, which breaks the locked rule that she
   learns only near the end. Proposal: the ledger shows the gold vanishing into coded accounts; only after the Harbor
   Turn can Haru read the code.
7. **Chapter 1 vs Act I.** The guide's Act I is Zetwal plus Xaraguá. This pack treats Act I as two chapters. Owner to
   confirm the chapter numbering and the chapter titles (all proposals).
8. **The slice.** Zetwal + Xaraguá + Ardencia skips Chapter 3 (Al-Doria). Owner to choose: keep the slice as the guide
   says (Chapter 4 levels scale down by about 3 when Chapter 3 was skipped), or include Chapter 3 in the slice.
9. **The betrayer's companion.** If the Crown buys a house whose companion is in the party (Samira, Bayarmaa, Haru or
   Vikram), the guide does not say what the companion does. Proposal: the companion stays, defies their house a second
   time, and gets one scene (and a stat boost) in Chapter 11.
10. **Gen III rulers.** Layla (Al-Doria), Torvald (Skarragol), Kaede (Kuroshi), Meera (Jwaladesh) and Rosalind
    (Aldermoor) are proposed as the ruler or elder each companion defies, matching guide 5.3a ("Gen III is their
    parent, often the ruler or elder they defy"). Owner to confirm each.
11. **Section 14 of the guide** still says 240 x 160; Section 9 and the built game use 320 x 180. The opening prompt is
    stale (no action needed for the design, just a note).
