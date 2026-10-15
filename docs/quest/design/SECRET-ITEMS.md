# Secret items: one per capital

*Design pack, Oct 14. **All nine items approved by the owner (Oct 14).** Details below the summary that are
marked (proposal) can still change while each one is built. Each is unlocked by finding a side
quest AND solving a difficult puzzle, and every one uses the Echo. They differ in how the puzzle plays (dynamic), in
what the item does (effect) and in difficulty (2 = moderate to 10 = very hard). Hints: Anissa gives her usual three
hints (nudge, pointer, answer) for every puzzle here too (guide 6.2 rule 4), but for secret items her third hint only
comes after 8 minutes stuck instead of 3, and the player can always walk away: nothing here blocks the story.*

## Summary

| # | Item | Capital | Side quest (`SIDE-QUESTS.md`) | Dynamic | Effect type | Effect in one line | Difficulty |
|---|---|---|---|---|---|---|---|
| 1 | **Solange's Quill** | Pòdlimyè (Zetwal) | Z-4 The Seventh Stone | Sequence memory (names spoken in order) | New skill | Gianna's *Say Their Names*: every Bound or fallen ally rises at 30% HP, Anissa calms | 2 Moderate |
| 2 | **The Sakk of Yusuf** | Bab al-Dhahab (Al-Doria) | A-4 The Uncashed Note | Trade chain across eras (buy low in the past) | Economy | 15% off in every shop, sell for 60%, Samira cashes 300 gold once per chapter | 3 Moderate |
| 3 | **Caona's Conch** | Yucayeque (Xaraguá) | X-4 Where the Canoes Sleep | Tides (four tide states, a weir) | Map ability | *Conch Call*: summon a canoe at any shore; hidden coves; free sea travel | 4 Moderate-hard |
| 4 | **The Unbroken Wick** | Agnipur (Jwaladesh) | J-4 Oil for the Little Lamps | Measures (pouring oil between jars) | Surge upgrade | Surge costs 4 Spark, Dawn Surge cleanses, Anissa's Calm never drops below 1 | 5 Moderate-hard |
| 5 | **La Promesa de Benny** | Cenizal (Ardencia) | Ar-4 The Old Lord's Errand | Stealth in two eras at once (era-hopping past guards) | Passive charm | *Last Stand*: survive one knockout or Bind per battle at 1 HP; Azzy ignores War Cry | 6 Hard |
| 6 | **Sarnai's Bridle Bell** | Ordvik (Skarragol) | S-4 The Cairn of Nine Riders | Star positions (a moving night sky) | Summon | *Call the Herd*: wild steppe horses stampede through every enemy, once per battle | 7 Hard |
| 7 | **The Patient Hour** | Kingsmere (Aldermoor) | Al-4 The Clock That Waits | Clockwork (gear arithmetic, then a timed stop) | Battle tempo | Once per battle, stop the clock: the whole party acts again before any enemy | 8 Very hard |
| 8 | **The Nightingale Key** | Kirinoura (Kuroshi) | K-4 The Letter in the Floor | Sound (a melody walked on a singing floor) | Information | Every enemy's next move shown each round; Quiet Crown members glow on maps | 9 Very hard |
| 9 | **The Seventh Ribbon** | Eightgate | Se-4 The Unknotted Ribbon | A conversation across eras (testimony and evidence) | Story change | Strike the Seventh Clause at the Claim: +15 Stability, +10 Concord, a new epilogue scene | 10 Very hard |

Ordered by difficulty, which is also roughly the order the player can reach them. Effects never overlap: one skill,
one economy perk, one map ability, one Surge upgrade, one passive, one summon, one tempo effect, one information
effect, one story change.

**Engine notes:** each item is a key item (`kind: 'key'`, no bag space) except La Promesa, which is a charm with a
gear level (`level: 12`). Every puzzle gets a `solution.json` and `cheats.json` like the built ones
(`quest/src/data/puzzles.ts`). Tunable numbers (percentages, the summon's power, the shop discount) go in
`quest/src/config.ts` under `SECRET_ITEMS`.

---

## 1. Solange's Quill (Pòdlimyè, Zetwal)

- **Side quest:** Z-4 *The Seventh Stone*. The widow on the Temple Island ("My husband's name is on the third stone")
  says the oldest stone has a blank seventh face, and the founder's riddle on its plinth has never been answered.
  Opens in Chapter 1 after the lamp lights. **No fighting.**
- **Dynamic:** sequence memory.
- **The present:** seven Name Stones ring the lamp court. Six chime when touched, each a different note. The seventh is
  blank and dead. Solange's plinth reads: *"Say them as they were first said, and the last shall answer."* Touching
  stones in the wrong order makes them fall silent for a moment and resets the sequence.
- **The Echo** (the first Reading of the Names, under the temple scaffolding, fifty years ago): seven elders walk out
  one at a time and speak a name over a stone. Each stone chimes as its name is said. The order is shown once per visit;
  two elders cross paths to muddle it. The seventh is a young Yaguana scout from Caona's company. She speaks her
  brother's name over the blank stone. The stonecutter refuses: "That is not a Zetwal name." His chisel lies on the
  plinth.
- **Steps:**
  1. In the Echo, watch the reading and note the order (the Journal draws a small ring of seven dots and fills one per
     name, but only once per visit).
  2. As Patricio, take the chisel and carve a sun mark into the blank seventh stone (**anchor**: "For whoever keeps
     this temple after me"). The scout bows.
  3. Return. The seventh stone now has a weathered sun mark and its own chime.
  4. Touch the stones in the first-reading order, ending on the seventh.
- **Solution:** carve the seventh stone in the Echo; then, in the present, stones 3, 1, 5, 2, 6, 4, 7 (the order is
  fixed in data, not random, so the solution script can replay it).
- **The item:** Solange's Quill, found in a niche under the plinth with her original list. Gianna learns ***Say Their
  Names*** (base SP 16, so 12 for Gianna): once per battle, every Bound or fallen ally rises with 30% HP, and Anissa
  gains +2 Calm and +3 Spark. Bonus: the Yaguana name on Zetwal's stones earns +2 Influence in Xaraguá when Yari sees
  it (Chapter 10, proposal).
- **Why it fits:** saying the names of the dead aloud is Zetwal's small rebellion (the built book *Why We Say Their
  Names*). The seventh stone answers the blank seventh line on the Marshal's stone: Zetwal's first act of making room
  for Xaraguá.

## 2. The Sakk of Yusuf (Bab al-Dhahab, Al-Doria)

- **Side quest:** A-4 *The Uncashed Note*. An old moneychanger in the bazaar swears the Dorini wrote a *sakk* (a
  written promise to pay; the word is the root of "cheque") for "the Marshal of Zetwal" during the war, and nobody ever
  cashed it. Box 7 of the old counting house is still sealed. Opens in Chapter 4.
- **Dynamic:** a trade chain across eras: buy low in the past, collect in the present.
- **The present:** the bazaar's price board shows what is dear today: Zetwal **indigo** costs a fortune since the
  Crown's blockade; salt and dates are cheap. Box 7 opens only to "the bearer of the sun" and only if something was
  deposited.
- **The Echo** (Yusuf's counting room and the war-time bazaar): Patricio has a soldier's pay of a few coins. Four
  stalls each want what they lack (their dialogue says so): a date seller, a salt trader, a Brasador camp cook with
  peppers, and a Zetwal dyer with one bolt of indigo. Young Yusuf will write a sakk for any deposit, its value set by
  what the deposit will be worth "when the war is over" (he does not know; the player does, from the present board).
- **Steps:**
  1. In the present, read the price board and the moneychanger's lines (box 7, "the bearer of the sun").
  2. In the Echo, trade coins for dates, dates for salt, salt for peppers, and peppers for the indigo bolt (each trade
     only works with the stall that lacks that good).
  3. Deposit the indigo with Yusuf. He writes the sakk to "the bearer of the sun" and seals it in box 7 (**anchor**).
  4. In the present, open box 7 with the Sun Locket.
- **Solution:** coins, dates, salt, peppers, indigo, deposit. Depositing anything else is a soft failure: the box pays
  a small sakk (50 gold), and the player can go back and ask Yusuf to amend the deposit.
- **The item:** the Sakk of Yusuf. Shops in every capital sell at **15% off** and buy at **60%** instead of half; and
  once per chapter Samira can cash a coupon for **300 gold**.
- **Why it fits:** House Dorini built its power on ledgers, not armies. The puzzle rewards an appraiser's eye across
  fifty years, and Yusuf, keeper of the ledger, finally pays a debt on time.

## 3. Caona's Conch (Yucayeque, Xaraguá)

- **Side quest:** X-4 *Where the Canoes Sleep*. An old net-mender says her grandmother saw Caona hide her war canoe in
  a sea cave "between two tides" after the Revolution. Opens in Chapter 2 (enemies in the cave are crabs and bats,
  levels 5 to 7).
- **Dynamic:** tides. Resting at the cave fire moves the tide through four states: Low, Rising, High, Falling.
- **The present:** the inner chamber where the canoe lies is high on the cave wall. A rockfall after the war closed
  the low passage. Even at High tide the water stops two tiles short of the ledge, and a driftwood raft sits uselessly
  on the sand.
- **The Echo** (a storm night in the Revolution, Caona's scouts' camp): no rockfall, but the inner basin is a dry pit.
  At the cave mouth stands a stone weir with a gate that can be dropped. Patricio can wait at the scouts' fire to move
  the tide too.
- **Steps:**
  1. Notice in the present that the water never reaches the ledge, and in the Echo that the weir can trap water.
  2. In the Echo, wait for **High** tide and drop the weir gate (**anchor**). Dropping it at any other tide traps too
     little water; lift and drop it again.
  3. Return. The weir has held for fifty years: the inner basin fills at High and **keeps** its water as the sea
     falls.
  4. In the present, rest until High, then until **Falling**: the outer cave drains, the inner basin stays full, and
     the raft floats level with the ledge. Push the raft (one push) and ride it to the chamber.
- **Solution:** Echo: rest to High, drop the gate. Present: rest to High, rest to Falling, push the raft, step on.
- **The item:** Caona's Conch (proposal name in Taino: *guamo*, flagged for verification). ***Conch Call***: on any
  shore tile, blow it to summon a canoe and paddle across water layers: hidden coves and islets with chests in
  Xaraguá, Zetwal, Al-Doria and Kuroshi, and free sea travel between the coastal capitals (no Guild fare).
- **Why it fits:** Caona was a scout-commander who knew every road; in Xaraguá the roads are the sea. The canoe she hid
  is the harbor's freedom in small.

## 4. The Unbroken Wick (Agnipur, Jwaladesh)

- **Side quest:** J-4 *Oil for the Little Lamps*. A child keeps a tiny street shrine whose lamp, her family says, has
  not gone out since Arjun's company came home. Now it is dark: the oil hoarder's men took the sealed reservoir under
  it. Opens in Chapter 8 after Seth Dhanraj falls (no fight in the quest itself).
- **Dynamic:** measures: pouring between jars to get an exact amount.
- **The present:** the shrine's door is a balance lock. One pan holds the empty sealed reservoir's cradle; the other
  holds a bronze weight caked in soot (the number cannot be read). The old jars here are cracked.
- **The Echo** (the oil store by the harbor chain, the night before Arjun's charge): three good jars of 10, 7 and 3
  measures (the 10 is full), and the lamp-maker's clay reservoir that takes **one pour** and then seals. The roll call
  at the door tells the rest: "Seven rode out with Arjun. Five came home." The lamp-maker says the weight will be "the
  measure of those who came home."
- **Steps:**
  1. In the Echo, hear the roll call (or read the Jwaladesh book *The Harbor Chain*): the target is **5**.
  2. Measure exactly 5: 10 into 7, 7 into 3, 3 into 10, 7 into 3, 3 into 10, 7 into 3, 10 into 7, 7 into 3 (the 7
     now holds 5).
  3. Pour the 7 jar into the reservoir. It seals (**anchor**).
  4. In the present, the reservoir sits in its cradle under the shrine, full and sealed for fifty years. The pans
     balance; the door opens.
- **Solution:** the eight pours above, then the reservoir. A wrong amount seals wrong; the lamp-maker makes a new
  reservoir if Patricio asks (the Echo resets that object).
- **The item:** the Unbroken Wick, which Anissa keeps. **Surge** costs 4 Spark instead of 5; **Dawn Surge** triggers
  at 9 and also clears every status from the party; Anissa's **Calm** cannot drop below 1.
- **Why it fits:** Jwaladesh's sacred flame is dying for want of oil; a lamp kept lit for fifty years by an exact,
  patient measure answers "hesitation is the only true death" with something steadier. It strengthens the light
  Anissa carries.

## 5. La Promesa de Benny (Cenizal, Ardencia)

- **Side quest:** Ar-4 *The Old Lord's Errand*. After the escape, old Benny (in the keep, guards looking away) asks
  Gianna to bring him the promise he left in the chapel crypt "before your father was born". The party is wanted in
  Ardencia, so this is a sneak. Opens after Chapter 3; best done in Chapter 5 or later (crypt guards, if seen, start a
  battle at level 14).
- **Dynamic:** stealth in two eras at once. The whole cloister is an Echo Zone, so the player can swap mid-route.
- **The present:** Rael's guards patrol the cloister (four sight cones). The inner crypt door is bolted from inside.
- **The Echo** (the night of Benny's march to the sea): Benny's honor guard patrols the same cloister on **different**
  routes (three sight cones). The crypt is open, but the inner bolt is loose.
- **Steps:**
  1. Learn both patrol loops (each loops in about 20 seconds).
  2. Cross the cloister by swapping eras whenever a guard who exists only in your current era is about to see you: the
     present guard at the well does not exist in the Echo; the Echo guard under the arch does not exist in the present.
  3. In the Echo, reach the crypt and jam the inner bolt with a horseshoe nail (**anchor**) so it can never lock.
  4. In the present, reach the crypt again (new swaps, since you start from the far side) and walk in.
  5. Getting seen in the Echo just resets you to the cloister gate; getting seen in the present starts a battle.
- **Solution:** a fixed route with five era swaps, written into `solution.json`.
- **The item:** La Promesa de Benny (charm, gear level 12, +4 DEF). ***Last Stand*** (the board game's card 65): once
  per battle, the wearer survives a blow that would knock them out or Bind them, at 1 HP. Worn by Azzy, it also makes
  Rael's *Grito de Guerra* fail against him.
- **Why it fits:** Benny's honor was public; this promise was private. A Brasador oath kept where no one could see,
  carried by the grandson who chose to keep the goal and the oath.

## 6. Sarnai's Bridle Bell (Ordvik, Skarragol)

- **Side quest:** S-4 *The Cairn of Nine Riders*. An old herder tells of nine cairns on the winter plateau and a bridle
  Sarnai's riders hid "where the Mare's eye stood at the third horn". Bayarmaa must be in the party (her horse moves
  the capstone). Opens in Chapter 6; the plateau has wolves at the region's level.
- **Dynamic:** star positions. The Echo sky turns in real time around the pole star.
- **The present:** a ring of nine cairns around a flat sighting stone. It is summer: the constellation called the Mare
  is below the horizon. Every cairn looks the same.
- **The Echo** (the winter night Sarnai's raid rode out): the Mare is up. Bayarmaa's Journal sketch (given in the
  quest) shows it: four hoof stars, a bright eye, a tail of three. Decoy shapes share the sky (the Ox, the Ship). A
  horn blows three times, about 40 seconds apart. Sarnai asks Patricio to hide her spare bridle "where only a rider who
  reads the sky can find it".
- **Steps:**
  1. Stand **on the sighting stone** (from anywhere else the sightline points at the wrong cairn).
  2. Find the Mare and its eye; at the **third** horn, press A to take a sighting. A line is drawn from the eye to the
     ground.
  3. Bury the bridle under that cairn (**anchor**). A wrong cairn can be fixed by going back (the bridle moves).
  4. In the present, Salkhi drags the capstone off that cairn.
- **Solution:** the seventh cairn clockwise from the north path (fixed in data).
- **The item:** Sarnai's Bridle Bell. ***Call the Herd*** (Bayarmaa's command, once per battle, no SP): wild steppe
  horses stampede through the battlefield, hitting every enemy for power 220 off Bayarmaa's ATK, and each enemy has a
  30% chance to lose its next turn.
- **Why it fits:** Skarragol's raiders strike before anyone can organize a response; the steppe's riders and the
  fjords' sailors both steer by stars. A real herd, not a spirit: the house's speed made visible.

## 7. The Patient Hour (Kingsmere, Aldermoor)

- **Side quest:** Al-4 *The Clock That Waits*. A dissident clockmaker says the keep's tower clock stopped the night the
  Crown's record of the Seventh Clause was written, and that Dame Agatha built a vault behind its face "for the long
  game". Opens in Chapter 9 after the courtroom.
- **Dynamic:** clockwork: gear arithmetic, then a timed stop.
- **The present:** the clock is rusted solid at an unknown time; the vault behind the face is shut. Thomas Stillwater's
  record in the Archive (Chapter 9) ends: *"Written at a quarter to three, by the tower bell."* (2:45.)
- **The Echo** (the night Thomas writes): the clock always reads **11:10** when Patricio arrives, and the night
  watchman climbs the tower **90 real seconds** later (caught: back to the stairs, the clock reset). The clock runs one
  clock minute per real second, except while the winding key is turning. The key has three gears: one turn (one
  second) moves the hands **5**, **7** or **12** minutes, forward only. The spring allows **12 turns**, then must be
  rewound: 10 real seconds, during which the clock runs on (10 minutes).
- **Steps:**
  1. Work out the distance: 11:10 to 2:45 is **215 minutes**. Simply waiting takes 215 seconds, far past the watchman.
  2. Plan the winds: 12 turns of 12 (144), rewind (+10 while it runs, 154), 5 turns of 12 (214). The planning is the
     puzzle, and the player can plan outside the Echo since the start time never changes.
  3. Pull the key; the clock ticks to 2:45 one second later. Wedge Thomas's spare quill in the escapement on that tick
     (**anchor**). Too early or late and the clock stops wrong; pull the quill and try again before the watchman.
  4. In the present the clock face shows 2:45, the hour Agatha's vault was keyed to. It opens.
- **Solution:** 12 x gear 12, rewind, 5 x gear 12, pull, wedge on the tick (other sums that reach 215 in time are also
  accepted; `cheats.json` checks that waiting alone fails).
- **The item:** the Patient Hour (Edmund's pocket watch, fitted with Agatha's movement). Once per battle, ***Stop the
  Clock***: the initiative bar freezes and every party member acts once more before any enemy.
- **Why it fits:** House Stillwater wins by outlasting everyone (*The Long Game*, *Aldermoor's Vigil*). A clock that
  waited fifty years for the right hour is their virtue in one object, and it shows that a Stillwater wrote down the
  truth.

## 8. The Nightingale Key (Kirinoura, Kuroshi)

- **Side quest:** K-4 *The Letter in the Floor*. An old floor-maker says Lady Sayo's last message to the Marshal is
  still locked in her listening room, and the lock is the floor itself. Haru must be in the party ("purely as a
  tourist"). Opens in Chapter 7 after the Paper Fox falls.
- **Dynamic:** sound. A nightingale floor: every board chirps when stepped on, five pitches in all. Each pitch also
  shows a small coloured ripple of its own shape (circle, square, triangle, diamond, star) so the puzzle works with the
  sound off.
- **The present:** a 5 x 5 floor and a lacquer box that opens when the right melody is walked, one board after
  another (eight directions allowed). The boards were relaid over fifty years: the pitches are in different places
  from the Echo.
- **The Echo** (Lady Sayo's house, the night her network warned Patricio): an informant crosses the floor; his steps
  play the message melody: eight notes with **one rest**, where he stops on a single silent board. Patricio carries a
  hammer and one nail: nailing a board silences it for good (**anchor**).
- **Steps:**
  1. In the Echo, listen to the melody (it can be replayed by asking the informant to cross again). Write it down.
  2. In the present, map the new pitches (step on each board).
  3. Plan a present path that plays the melody. It needs a silent board exactly where the rest falls, and the present
     floor has none.
  4. Go back to the Echo and nail the board at that grid position (the grids line up).
  5. Return and walk the melody, rest included. The box opens.
- **Solution:** one valid path and one nailed board, fixed in data (the cheats file checks that the melody without
  the rest, or a nail in the wrong place, fails).
- **The item:** the Nightingale Key. Party-wide **Kagemimi**: at the start of every round each enemy's next action is
  shown above it. On maps, members of Quiet Crown cells show a faint silver sigil, which opens one hidden conversation
  per capital (talking them out raises Concord).
- **Why it fits:** House Suzumori's power is listening (*Kagemimi*, the Shadow's Ear). Their real nightingale floors
  warned of intruders; here one carries a message across fifty years.

## 9. The Seventh Ribbon (Eightgate)

- **Side quest:** Se-4 *The Unknotted Ribbon*. A Throne Archive keeper (proposal name: **Keeper Hollis**) shows that
  each of the Accord's seven ribbons carries a witness knot, and the seventh has none. By Throne law a clause whose
  ribbon was never knotted can be struck if the record of its sealing shows no witness agreed. Opens in Chapter 5;
  can only be finished after Chapter 9 (it needs Thomas's record), before the Claim in Chapter 12.
- **Dynamic:** a conversation across eras. A dialogue puzzle where every answer is checked against evidence.
- **The Echo** (the sealing in the Throne Archive, owner decision Oct 14; see `STORY.md` open question 2): the Throne's clerk writes
  the minute of the sealing and asks Patricio five questions. He is in a hurry: three wrong answers and he shuts the
  register (leave and come back to retry). Each question has a trap:

  | Clerk asks | Trap answer | Right answer |
  |---|---|---|
  | Who stood for Xaraguá? | "Caona." (She was not in the room.) | "No one. Xaraguá was not asked." |
  | Did the Lord of Ardencia sign the seventh page? | "Yes, all lords signed." | "He refused, aloud." |
  | Who asked for the clause? | "The Crown alone." | "The Crown, and allies who were paid for it." |
  | Was the page read aloud? | "Yes." | "To you alone, clerk." |
  | Will the Marshal knot the seventh ribbon? | "Yes, for peace." | "No. Leave it unknotted." |

  The minute is sealed in the register (**anchor**).
- **The present:** Keeper Hollis reads the fifty-year-old minute aloud and cross-examines Gianna: for each line she
  must show evidence from the Journal. Caona's oath (Chapter 2), Benny's refusal note and Yusuf's ledger (Chapter 4),
  Thomas Stillwater's record (Chapter 9) and the sun mark on the seventh Name Stone (secret item 1, optional: it lets
  her skip one question). Any line without evidence fails the hearing; go back and gather it.
- **Solution:** the five right answers, then the four evidence items in the order the minute names them.
- **The item:** the Seventh Ribbon. At the **Claim** (Chapter 12) Gianna can strike the Seventh Clause before every
  house: **+15 Accord Stability**, **+10 Concord**, and a new epilogue scene where Cacica Yari receives the ribbon and
  Xaraguá's harbor is returned by law before the Hearing begins.
- **Why it fits:** Eightgate is where the realm keeps its oaths and memory. The hardest puzzle in the game is not
  a lock but the truth, told carefully in two eras: the Unpaid Debt paid in the place it was hidden.
