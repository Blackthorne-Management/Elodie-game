# Batch D outline: the back third of Chapter 1, and the choices (Oct 19)

*Design outline only, for the owner's approval before anything is built. It answers findings 5 and 11 of the
demo review (`2026-10-17-demo-review.md`) and one small wording fix. No code has changed. Numbers below come
from replaying `quest/routes/zetwal-act1.json` through the simulator today, with the four side quests now
required before sailing (owner decision, Oct 18).*

---

## 1. Where we are (measured)

The scripted route, objective by objective. **Steps** are walking presses, **transitions** are map changes,
**lines** are dialogue boxes shown (book pages and debate rounds count too).

| Objective | Steps | Transitions | Lines | Choices |
|---|---|---|---|---|
| Mother's address | 13 | 0 | 18 | 0 |
| See Mother off | 44 | 0 | 9 | 1 |
| Grandmother is waiting | 60 | 1 | 16 | 0 |
| What the Locket remembers | 7 | 0 | 7 | 0 |
| Leave word for later | 6 | 0 | 16 | 1 |
| Fifty years under the floor | 13 | 0 | 16 | 0 |
| Cross to the Temple island | 62 | 1 | 19 | 2 |
| Find Grandfather | 26 | 1 | 7 | 0 |
| The reading of the names (lamp) | 2 | 0 | 31 | 0 |
| A canoe at the dock | 8 | 0 | 21 | 1 |
| **The envoy's papers** | **211** | **9** | 24 | 0 |
| **The boar on the Cane Road** | **99** | **3** | 5 | 0 |
| **Unfinished business (side quests)** | **457** | **14** | 96 | 14 |
| **Before the tide** | **61** | **2** | 6 | 1 |
| Whole chapter | 1,069 | 32 | 292 | 20 |

**After the lamp: 828 of 1,069 steps (77%) and 28 of 32 map transitions.** The reviewer measured 372 of 618
steps; since then the four side quests became required, so the back third more than doubled.

Why it is long, in plain terms:

- **The papers** are a loop: island > plaza > Accord Square > Hall (clerk) > Square > plaza > Iron Market
  (engraver) > plaza > Square > Hall (clerk, then the Chancellor). Nine map changes for 24 lines.
- **The boar** is a separate trip: Hall > Square > plaza > east gate > Cane Road.
- **A Name in the Cane** is the worst offender on its own: accept on the Cane Road, read the stones on the
  island, use the Echo back on the Cane Road, write the name in the island archive, tell the cutter on the Cane
  Road. That is four crossings of the whole city for one quest.
- **The Overdue Shelf** needs two archive visits (accept and read the temple record; return the books).
- The Charter of Protection is talked about (Yari, the protester, the consul) but never happens in front of the
  party, and the chapter ends on "Let's go" with no farewell.

---

## 2. The proposed new flow for the back third

The story beats of `STORY.md` (beats 9, 9a, 10 and 11) all stay. Three things move, each flagged below as a
decision for the owner. The gold arrow, Anissa's hints and Yari's "are you ready?" checks follow the same path.

### Step 1. The island, straight after Yari (Temple island, then the Archive)

- Yari has just joined at the dock. Gianna said "I have work at the archive." So the work is right here.
- **The cane cutter is at the name stones** (decision A). He crossed the Chain Bridge the moment it came down,
  to say his grandmother's name at the reading, and found her on no stone. Gianna meets him there, accepts
  *A Name in the Cane*, and reads the stones beside him: step 1 of the quest is done on the spot.
- The Archive: accept *The Overdue Shelf*, read the temple's Ash Wars record (so Grandmother's question can be
  answered later).
- Staged: the cutter stands at the stones with his hat in his hands; when Gianna comes up he turns to her.
  Nothing else to stage.

### Step 2. Across the bridge: the plaza, home, the lawn (zetwal-town, zetwal-house)

- Soup vendor: her book back, then the soup errand (one conversation, see Section 4).
- The old neighbor (soup), then **home**: Grandmother's question and Volume Two.
- The town guard (soup), the ferryman (book and soup), the soup vendor again (quest done).
- The debate on the lawn below the plaza (*A Question of Faith*), which is right beside the road to the gate.

### Step 3. Accord Square and the Hall: the papers in one visit, and the Charter (zetwal-square, zetwal-hall)

- The clerk at his desk: "I write them; the seal goes on them; the Chancellor signs. The seal is the trouble."
- **The engraver walks in** (decision B): through the Hall's front door, up to the desk beside Gianna, the seal
  wrapped in a cloth. He keeps his best line: "I don't hand it to just anyone. Let me see you... Her eyes. Your
  grandfather's ink on your fingers. Here." The clerk writes and seals the papers while they stand there. The
  engraver walks out. No trip to the Iron Market; the Market stays as the city's shop street.
- Up the gallery to the Chancellor's office. She reads every line twice. **The Crown's consul walks in** with
  the Charter (Section 3). She signs Gianna's papers in front of him. He walks out.
- Papers done: `story.envoy_papers`, as now.

### Step 4. The east gate and the Cane Road: the Echo and the boar (zetwal-road)

- The shimmer by the gate is three tiles from the road's entrance: Gianna becomes Patricio and meets
  Rose-Aimée (step 2 of *A Name in the Cane*).
- Walk east into the cane: the boar, with Yari and Anissa. Unchanged.

### Step 5. Back to the island: the archive, the stones, the canoe (zetwal-temple, zetwal-archive)

- The Archive: return the three books; write Rose-Aimée into Mother Solange's list.
- The stones: tell the cane cutter (quest done; he gives the charm). He says her name to the lamp.
- The dock: Yari's "Ready?" and "Let's go."
- **A farewell at the dock** (decision C, small): Grandfather walks down the path from the temple to the dock as
  they board, and says the line the design already gives him and the game never reaches: "In Xaraguá, ask them
  what we promised. Ask them, not the Crown." Anissa: "Goodbye, Zetwal." Yari pushes off. Then the card (the
  plaza at dawn, from Batch B).

### Expected numbers after

Estimated from tile distances on the maps (the exact figures come from the route replay once built):

| | Now | After |
|---|---|---|
| Back third, steps | 828 | about 500 |
| Back third, map transitions | 28 | 14 |
| Whole chapter, steps | 1,069 | about 740 |
| Whole chapter, map transitions | 32 | 18 |
| Staged scenes after the lamp | 1 (Yari's canoe) | 5 (the cutter, the engraver, the consul, the cutter at the lamp, Grandfather's farewell) |

The Journal keeps its objective order (papers, boar, side quests, sail). The route simply does the island's
side-quest work on the way out and the rest on the way back; nothing forces the player to.

---

## 3. The Charter threat, shown not told

Where: the Chancellor's office in the Hall, while she is reading Gianna's papers (Step 3). Everyone in the
scene already exists: the Chancellor (at her desk), the Crown's consul (built, in the Envoys' Reception Room,
"I bring nothing but goodwill and a few papers to sign"), Yari and Anissa behind Gianna.

How it plays on the map:

1. The Chancellor reads. "Envoy papers. Xaraguá." She looks up over the page.
2. The consul walks in through the office doorway and up to the desk (the camera follows him), a rolled paper
   in his hand. He lays it on the desk, over Gianna's papers.
3. Draft lines (every line under 128 characters, the dialogue box limit):
   - Consul: "Chancellor. The same paper as every morning. A Charter of Protection for Xaraguá, under the seventh clause of the Accord."
   - Consul: "His Majesty asks only that Zetwal, as a party to the Accord, acknowledge it. One signature. Then the ships go home."
   - Chancellor: "Nobody sits in that chair while she is away, consul. Nobody signs in it either."
   - Chancellor: "Show me the clause."
   - Consul: "It is at the Throne, under seal. Your Head of State may read it there. She has, I believe, just arrived."
   - Yari: "That is the paper. Word for word. They nailed it to our customs house."
   - Anissa (quietly): "Gigi... he's looking at me."
   - A choice for Gianna (new, see Section 4): "Show us the clause." or "Say nothing."
   - The Chancellor picks up Gianna's papers from under the Charter and signs them in front of him.
   - Chancellor: "Your mother went to the Throne to speak for us. You go to Xaraguá to listen for us. Listen well."
   - Consul (to Gianna): "An envoy. To Xaraguá. How very timely. Do give your mother my regards." He walks out.
4. The consul is gone from the Envoys' room afterwards (the map's people "sync" to the story); the petitioner
   outside already says "The Crown man went in ahead of me. He had no fence at all. Only papers."

What this gives the chapter: the Crown is seen working on Zetwal the same polite way it worked on Xaraguá;
the seventh clause is named by the Crown's own man in Pòdlimyè; Elodie's trip to the Throne and the sealed page
(Chapter 5) are set up; Yari's warning becomes a thing on a desk. **This is a new story fact** (the Crown asks
Zetwal to acknowledge the Charter): decision D below. It adds no map.

---

## 4. The choices: what each one does now, and what it will remember

Every choice the route meets, in order. "Real" means the two answers already lead somewhere different.

| Where | The choice | Now | Proposed |
|---|---|---|---|
| Mother at the gate | "Why do you have to go now?" / "We'll be fine." | Different reply, then forgotten | Remembered: `choice.farewell_why` or `choice.farewell_fine`. Pays off at Grandmother's and at the dock (below). |
| The study (Echo) | "Leave the night orders here." / "Not yet." | Real (the anchor) | Unchanged |
| The bridgehead (Echo) | "Turn the winch..." / "Leave it raised.", "Drive the pin..." / "Not yet." | Real (the puzzle) | Unchanged |
| Yari at the dock | "Of course I'll come." / "Tell me everything on the way." | Both go to the same `yes` | Two replies, remembered: `choice.yari_sure` / `choice.yari_everything`. Pays off at the canoe and in Xaraguá. |
| The soup vendor | "It smells wonderful." / "Save me a bowl." (+ "You look busy.") | Both go to the same `thanks`; the quest needs a second talk | Two replies, remembered: `choice.soup_smell` / `choice.soup_bowl`; the talk then flows into the errand without a second tap. Pays off when the soup is delivered. |
| The Chancellor's office (new) | "Show us the clause." / "Say nothing." | — | `choice.consul_asked`. Pays off in Chapter 2's council (optional, below). |
| The cane cutter | "You seem far away today." / "Enjoy the rest."; "I'll look for her name." / "I'm sorry." | Real (opens the quest) | Unchanged in substance; his first line moves to the stones. |
| The archivist | "I'll get them back." / "Not today." | Real | Unchanged |
| The shelves, the debate | Books and the three debate rounds | Real | Unchanged |
| Grandmother | "About your overdue book..." / "Never mind."; "Four hundred." / "Forty." | Real | Unchanged |
| Yari, ready | "Let's go." / "Not yet." | Real | Unchanged (plus the farewell) |

Off the route, two cosmetic pairs stay as they are for now (the hooded stranger on the plaza, the veiled woman
on the Cane Road); one small callback is listed as optional at the end of this section.

### Draft payoff lines (existing voice; Anissa never jokes)

**Mother's farewell, at Grandmother's** (the `locket` node already asks "Did your mother get away?"):
- If "Why do you have to go now?": Gianna: "Her carriage just left. She said the Crown is talking about Xaraguá again." Grandmother: "Is it. Then she told you more than she told me. Good. You are old enough to be told things."
- If "We'll be fine.": Gianna: "Her carriage just left. I told her we'd be fine." Grandmother: "And did she believe you?" Gianna: "No." Grandmother: "Neither do I. That is why you get this."

**Mother's farewell, at the dock** (after Yari's "A clause nobody in Xaraguá was ever shown"):
- If "why": Gianna: "Mother said the Crown was talking about Xaraguá again. She didn't say it had already sailed."
- Otherwise Gianna's current line stays: "The Sun Accord. The seventh clause..."

**Yari's two answers** (then both continue into the current `yes` node):
- "Of course I'll come." Yari: "I told my father you'd say that. He said I was a fool to paddle this far on a guess. I like being right."
- "Tell me everything on the way." Yari: "On the way? Gigi, it's two days of water. I'll start with the ships. Stop me when you've heard enough."

**At the canoe** (the `depart` node, before "Xaraguá, then"):
- If "of course": Yari: "'Of course,' you said. Hold on to that when you see the harbor."
- If "everything": Yari: "Everything, on the way. I hope you like ships. Out there, there is nothing else to talk about."
- Chapter 2, the ferry lands (optional, one line): if "everything", Yari's "There were two ships when I left. Now there are three." becomes "I told you about the two ships. Count them."

**The soup vendor's two answers** (then, once the war room is done, straight into her nephew and the three bowls):
- "It smells wonderful." Vendor: "Wonderful? It is my grandmother's. Wonderful is the least it is allowed to be."
- "Save me a bowl." Vendor: "Saved. Cousin's bowl, on the shelf, with your name on it. Do not make me eat it myself."

**When the soup is delivered** (the `finish` node, with the three pots she gives):
- If "save me a bowl": "All three, and not one broken? Then here is yours. I said I'd save it. Nobody ever made me keep that promise before."
- If "smells wonderful": "All three, and not one broken? You said it smelled wonderful before you'd tasted a spoon. Now you can say it knowing."

**The consul** (new choice in Section 3):
- "Show us the clause." Consul: "Clauses are for the Throne to show, Miss Limyè. I only carry them." Sets `choice.consul_asked`.
- "Say nothing." Consul: "Wise. Your mother also knows when to say nothing. It is a family gift."
- Chapter 2 payoff (optional, touches `xaragua.ts`): in the elders' council, when the Governor's liaison names "the seventh clause of the Accord, as signed", if `choice.consul_asked`, Gianna: "Your consul in Pòdlimyè could not show it either."

**Optional, off the route:** on the Cane Road, "Stay away from her." to the veiled woman sets `choice.warned_watcher`; the hooded stranger on the plaza, after the lamp, adds: "The woman by the mill says you told her to stay away. We always do. We only ever listen."

---

## 5. One wording fix: "two nights" and "tonight"

Found in Chapter 2, in the petroglyph cave (`quest/src/data/dialogue/xaragua.ts`, `yari_hidden_talk`): when Gianna
brings word from Anaco, the camp leader says "The next low tide is in two nights" and Yari repeats "Two nights"
(twice). The very next time Gianna talks to her, in the same spot, it is "It is tonight, or a month from now."
Nothing passes between the two conversations (the game has no clock), and `STORY.md` says Yari says "tonight".

Proposed: make it **tonight** throughout.
- Camp leader: "The lowest tide of the month is tonight, before midnight. Every boat Thorne has will watch the harbor mouth, not the cliffs."
- Yari: "Tonight. Then I go, and I come back with help. Zetwal's help. Gianna's grandfather owes us an oath."
- Yari, if asked again: "Tonight. The sea cave, at the lowest tide. Then Zetwal."
- Camp leader, when she is ready: "The water is going out. It is now, or a month from now."

This is Chapter 2 only, so it does not touch the demo.

---

## 6. Risks and what this touches

**Story and design docs.** Decisions A to D below. `STORY.md` beats 9a, 10 and 11 and `SIDE-QUESTS.md` (A Name in
the Cane) get a line each once approved.

**Tests that will need updating** (all in `quest/tests`):
- `act.test.ts`: the route no longer visits the Iron Market, so either the Market leaves `ACT1.maps` (the Journal
  then treats it like the harbor and the heights) or the test's "visits every Zetwal map" check excuses it.
  The speakers check should gain the consul and the engraver.
- `sideQuests.test.ts` (lines 227 to 250): the papers chain (clerk, engraver, clerk, Chancellor) becomes clerk,
  then Chancellor; `item.elodie_seal` and `story.papers_asked` can go (nothing in Chapter 2 reads them).
- `guide.test.ts`: every goal is checked against the route; the papers objective loses its Market goal, and the
  cane quest's goals move to the island.
- `chapterStarts.test.ts`: `src/data/starts/chapters.json` is regenerated from the route (`npx tsx
  tools/chapter-starts.ts`), so `?chapter=2` and `?chapter=3` pick up the new `choice.*` flags and lose the seal
  flags automatically.
- `content.test.ts`: lines at most 128 characters (100 with a translation), choices at most 36; every flag read
  must be set somewhere. The drafts above fit.
- `stage.test.ts`: the engraver "enters" as a fresh actor with the `engraver` look; the consul, the cutter and
  Grandfather are the map's own people ("walk", never "enter").
- `tests/smoke.mjs`: the browser run takes screenshots at the route's markers (`@market`, `@hall-papers`,
  `@side-quests`, `@side-quests-done`); markers move with the route and the Market screenshot goes.

**Route.** `routes/zetwal-act1.json` is rewritten from the dock onward. The three Chapter 2 sections of the
route are untouched but replayed by every test, so they must still pass.

**Chapter starts.** Chapter 2 starts from Chapter 1's end state. Chapter 2 reads only two Chapter 1 flags:
`item.envoy_papers` (the checkpoints in the occupied city) and `story.yari_asked` (Yari in the party). Both
are unchanged. The optional Chapter 2 payoffs read `choice.yari_everything` and `choice.consul_asked`, which the
regenerated starts carry (the route picks the first answer of each choice, so `?chapter=2` starts as a player
who said "Of course I'll come" and "Show us the clause").

**Chapter 2 continuity.** The consul's "She has, I believe, just arrived" and Yari's "They nailed it to our
customs house" agree with what Chapter 2 shows (the Charter posted over the customs notice; the liaison citing
"the seventh clause, as signed"). The "tonight" fix is in Chapter 2 itself.

**The demo.** Its Chapter 1 files are identical to the main game's today (checked: `quests.ts`, `zetwal.ts` and
the route differ only by Chapter 2 content). Everything in this batch except the "tonight" fix and the two
optional Chapter 2 payoffs is copied across file by file, then the demo's own tests and smoke run.

**Not touched.** The maps' tiles (no new map, no new door); the boar fight; the lamp scene; the Echo puzzles;
`src/engine` (every staging cue needed already exists).

---

## 7. Open questions for the owner

1. **Decision B: may the engraver bring the seal to the Hall himself?** The Oct 15 decision put the seal at the
   engraver's in the Iron Market and sent Gianna to fetch it. He would still have it there; he walks it over and
   hands it to Gianna at the clerk's desk, with his lines kept. Reason: this removes six of the nine map changes
   of the papers errand; without it the back third stays a loop.
2. **Decision A: may the cane cutter wait at the name stones on the island instead of on the Cane Road?** He
   crossed the Chain Bridge the moment it came down, to say "Grann" at the reading. The quest's steps stay the
   same (stones, the Echo by the gate, Mother Solange's list, tell him). Reason: on the road he forces four
   crossings of the city; at the stones the quest rides along the path the story already takes.
3. **Decision D: is it all right that the Crown's consul asks Zetwal's Chancellor to acknowledge the Xaraguá
   Charter, in front of Gianna?** It is the one new story fact in this batch. Reason: it is the only way to show
   the Charter threat in Pòdlimyè without a new map or a new character, and it sets up Chapters 2 and 5.
4. **Decision C: the farewell at the dock: Grandfather only, or the full dawn departure?** `STORY.md` beat 11
   proposes Grandmother packing food, Grandfather's Marshal's whistle and Papa Wout's ferry from the harbor.
   This outline proposes the small version (Grandfather walks down to the dock; "Ask them, not the Crown").
   Reason: the full version needs a harbor scene, a new key item and a new ferry start, and the Chapter 2
   homecoming on the long pier already gives both grandparents a staged scene.

---

## 8. Build plan, in small steps

Each step ends with `npm test`, and the route replay numbers are recorded after step 3.

1. **The papers in one visit** (Opus): the engraver's staged entrance at the clerk's desk; the clerk writes and
   seals in the same conversation; the papers objective loses its Market goal and gets new hints; the engraver's
   Market lines change ("Delivered it myself"); `sideQuests.test.ts` updated.
2. **The consul scene** (Opus for the staging, Sonnet for the lines): the consul walks into the Chancellor's
   office; the Charter on the desk; the new choice and its flag; he leaves the Envoys' room afterwards.
3. **The cane cutter at the stones and the new route** (Opus): the cutter's position and lines after the lamp;
   the quest's goals; the route rewritten from the dock; `act.test.ts`, `guide.test.ts` and the smoke markers;
   chapter starts regenerated; the numbers in Section 2 replaced by measured ones.
4. **The farewell at the dock** (Sonnet): Grandfather's staged walk and lines in the `depart` node.
5. **Choice callbacks** (Sonnet): the farewell, Yari and soup-vendor answers and their payoffs; the optional
   Chapter 2 lines if the owner wants them; the "tonight" fix in the cave.
6. **Docs** (Sonnet): `STORY.md` beats 9a, 10, 11; `SIDE-QUESTS.md`; `docs/PRODUCTION.md` open items.
7. **Review before the port** (Fable, once): the whole Chapter 1 route replayed and read end to end.
8. **Port to the demo** (Sonnet) and one smoke run there. No deploy until the owner asks.

---

## Owner decisions (recorded as they are made)

- **Decision B (Oct 19): yes.** The engraver brings the seal to the Hall himself and hands it to Gianna at the
  clerk's desk, keeping his lines.
- **Technical points, settled by Claude after the second review (Oct 19):** the Journal is reordered so the gold
  arrow leads the short way; old saves in the middle of the papers errand keep working; the build keeps the tests
  green step by step (or says when they are not); the demo port is merged by hand.
- **Decision A, with the review's gaps closed (Oct 19): yes.** Before the lamp the cane cutter stays on the Cane
  Road (the quest can still start early); after the lamp he waits at the name stones on the island, his lines
  rewritten for after the reading, keeping a pointer to the veiled woman by the mill; on the return at the end of
  Chapter 2 he is back on the Cane Road with his warning.
