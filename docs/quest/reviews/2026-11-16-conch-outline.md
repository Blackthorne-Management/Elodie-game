# Caona's Conch (X-4 *Where the Canoes Sleep*): build outline

*Nov 16. Design outline only: no code was changed. A builder works from this next. Sources read: `SECRET-ITEMS.md` 3,
`PUZZLES.md` S-XAR, `SIDE-QUESTS.md` X-4, the Oct 19 Chapter 2 side-quests outline and its review (D5), review 1
(Oct 21, "the secret items"), the Chapter 11 outline and its review, `data/war.ts`, `data/dialogue/xaraguaWar.ts`,
`tools/maps/xaragua.ts`, and how the built secret items work (`data/secretItems.ts`, `engine/secrets.ts`,
`data/dialogue/jwaladeshQuests.ts`, `data/quietCells.ts`). Decisions I took are marked **Claude's call (Nov 16)** and
listed again in section 8. Two questions for the owner are in section 9; the build goes ahead on the recommendation.*

---

## 0. The short version

- **Where and when:** Chapter 11, at the hill camp by day (`story.camp_reached`, before `story.tide_called`). The
  **shell diver** (the built Chapter 2 woman who says "At high tide the sea keeps what it finds") tells Yari about
  Caona's own canoe. Secret and optional: no dot, no nudge, never on the gold arrow, nothing on the route reads it.
- **The puzzle, reduced:** the tide moves **in the memory only** (four states, stepped by sitting at the scouts'
  fire). Patricio can only stand at the weir gate when the pit is empty, but the gate has to fall when the pit is
  full. He ties the scouts' net floats to the gate's trip line through the **top** hole of the tide post, and the sea
  shuts its own gate at the top of the tide. In the present the pit is a brim-full pool and Caona's canoe has floated
  in it, whole, for fifty years, with her conch in the bow. No present-day tide, no raft, no new engine machine: flags,
  conditional map objects and dialogue choices.
- **The reward, redesigned:** *Conch Call* is no longer "a canoe on any shore" (the late game has no shore to use it
  on). Yari carries the conch, and **Yucayeque's canoes answer it**: in every fight where the whistle asks for
  volleys, the canoes add one volley of their own, over the whistle's three and free of the fleet's count. Shown: Yari
  blows it beside the head runner when the tide is called, and the old people know the sound. 150 gold, **60 XP**
  (not 120), +2 Influence (Xaraguá).
- **Effort:** one new small map (20 x 14), one door and three small objects in the built sea cave, one NPC at the
  camp, about twelve conversations, one side quest, one item, one small boon in the battle set-up, conditional lines
  in three built scenes. About three days for one builder; done by Nov 19 with a day in hand.

---

## 1. When and where it opens, and how it stays off the route

### 1.1 The window

| | Flag condition | What the player sees |
|---|---|---|
| Opens | `story.camp_reached, !story.tide_called` (the built "day on the hill") | The shell diver sits at the hill camp |
| Accepted | `side.canoes_sleep.accepted` (a choice in her conversation) | The quest is in the Quests page; the passage in the sea cave opens |
| Can be finished | any time after it is accepted, until `act11.complete` | The puzzle does not depend on the present-day tide, so dusk and the night after the harbor work too |
| Closes | `act11.complete` | "Closed: the fleet sailed for Eightgate. Caona's canoe is still behind the weed." |

A player who never speaks to her never sees the quest (a secret quest has no mystery entry). She leaves the camp
with everyone else when the tide is called (her placement is the built `WAR_DAY_TEXT`), so nothing dangles.

**Why this window (Claude's call, Nov 16).** It is the chapter's one calm stretch: the camp leader has just said "The
canoes come under the pier from the sea cave", the three required things ("Until the tide") send the player down to
the gardens anyway, and the gardens' road to the Canoe Beach is one conversation away from there
(`hill_road_south`). The sea cave's door on the beach is already open in Chapter 11 (`story.escape_night` stays set),
two tiles from the turned gun. The detour is: gardens, the road, about 25 tiles of sand, the cave, and back.

### 1.2 Who gives it

**The shell diver** (`shell_diver`, built: look, speaker and her Chapter 2 line exist). **Claude's call (Nov 16):**
she replaces the design's "old net-mender", because Yucayeque's Cut Nets giver was built as the pier fisher, the only
net-mender in the game is Zetwal's (`net_mender`, on the Pòdlimyè harbor), and the shell diver is the one person in
Yucayeque who already talks about the sea cave and its tides. Her grandmother dived the cave.

- New placement on `xaragua-camp`: `shell_diver_war` (NPC id `shell_diver_war`, look `shell_diver`), `if:
  WAR_DAY_TEXT`. Suggested tile **(6, 9)**, west of the healer's hamacas, sitting apart and facing away from the
  fire. The builder confirms the tile is free: taken tiles are the fire (13, 8), the elders (11, 8) (15, 8) (13, 11),
  the healer (9, 11), the hamacas (8, 12) (10, 12), the runner (16, 6), the boy (11, 6), the canoe fisher (12, 16),
  the jars (11, 16), the Quiet Crown baker (9, 16) and Anissa's spot for her (7, 16), the lamp-oil seller (20, 12),
  Jordyn (15, 17), the camp leader (15, 11), the companies (16 to 22, 18).

### 1.3 How it never touches the route

- Every new placement, door, trigger and Echo zone is behind a new flag (`side.canoes_sleep.*`, `anchor.weir_*`,
  `item.caona_conch`). The route file is not edited. `data/starts/chapters.json` must regenerate byte-identical.
- The three built scenes that gain lines (the tide call, the whistle, the caney) gain **only** lines with `if:
  { flag: 'item.caona_conch' }`. Without the item they play exactly as built.
- The sea cave map gains one door on a wall tile off the Chapter 2 path (the route crosses the cave with `goto 19,4`,
  which never passes it).
- No fight in the quest (the design's crabs and bats at levels 5 to 7 are dropped: **Claude's call (Nov 16)**, they
  would be pointless at level 26 and every extra fight moves Chapter 11's tight curve).

### 1.4 One stale thing this quest would walk every player into (fix with it)

In Chapter 11 the sea cave still shows Chapter 2's `escape_canoe` on its ledge, and touching it says "The longboat
still bars the sea mouth" (the `waiting` node, because `story.thorne_ambush` is still set). The party sailed out in
that canoe ten chapters ago. Since this quest sends the player through that cave:

- `escape_canoe`: add `if: '!story.escaped'`.
- In its place by day (`story.camp_reached, !story.tide_called`): two `dugout` objects in the inlet below the ledge
  and one scout on the ledge (`seacave_canoe_guard`, look `camp_scout`). These are the canoes the camp leader's plan
  speaks of. His lines: "The canoes go when the conch goes, cacica. Not before." and, once the quest is accepted,
  "The old people's pool? Behind the weed. We don't go in. There's a dead canoe in it." **Claude's call (Nov 16):**
  small, and it makes the cave match what the chapter already says about it. If time runs short, keep the `if` on
  `escape_canoe` and cut the guard and the two canoes.
- A new once-only line on entering by day (trigger `seacave_war` at (4, 11), `if: 'story.war_begun,
  !story.tide_called'`, flag `story.seacave_war_seen`): "By day the tide is half out. The tunnel is ankle-deep, and
  somewhere ahead paddles knock on wood."

---

## 2. The puzzle

### 2.1 What changed from the design, and why

The design: four tide states in **both** eras moved by resting, a weir dropped at High in the memory, then in the
present rest to High, then to Falling, and push a raft.

Three problems, found while reading the built game:

1. **The weir did not make sense as written.** A gate that is shut for fifty years keeps the sea *out* as well as in,
   so "the basin fills at High and keeps its water" needs the sea to pour over the top, and then it does not matter at
   which tide the gate was dropped. The puzzle's one rule ("drop it at High") had no reason behind it.
2. **Chapter 11 has its own tide clock.** "We go down at the lowest tide, at dusk." "Everything is the tide here." A
   player resting the present-day tide round and round in a cave on the same afternoon contradicts the chapter.
3. **The raft and the present-day tide are the expensive half** (four map states in the present, a pushed object, a
   ride) and they repeat the same idea a second time.

**The reduced puzzle keeps the core (trap the sea at the top of the tide in the past; find it kept in the present) and
gives it a reason.** A dugout canoe that dries out splits; that is why canoe makers keep a hull wet. Caona wants her
war canoe to sleep afloat in a sealed pool. The pit only connects to the sea through the gate's mouth, so a shut gate
holds whatever was in the pit when it fell. The catch that makes it a puzzle: **the gate is at the bottom of the pit.
Patricio can only reach it at low water, and it has to fall at high water.** So the sea must drop it for him.

**Claude's calls (Nov 16):** the tide moves in the memory only; the raft becomes the scouts' net floats; difficulty 3
(the design's 4). One elegant echo is kept on purpose: Patricio is the man who makes the Chain Bridge stay down
(Chapter 1) and the harbor chain not hold (this chapter's pier). Here Caona asks him to make water stay in.

### 2.2 A note on Chapter 2's two water puzzles

The petroglyph cave (the built signature puzzle) is also a gate left a certain way fifty years ago. That one **lets
water out** (the lower sluice left open drains the chamber). This one **keeps water in**, and its difficulty is
*when*, not *which*. Yari says so in one line ("We let the water out of one cave to read an oath. She shut it into
another to keep a canoe."), so the likeness reads as a pattern of her people and not as a repeat.

### 2.3 Maps

**A. `xaragua-seacave` (built, 26 x 14): three additions, nothing moved.**

| Addition | Where | Condition |
|---|---|---|
| Door `seacave_weir` to the new map (grid tile becomes cave floor) | (4, 6): the wall straight ahead where the tunnel from the beach turns east | `if: 'side.canoes_sleep.accepted'`, `closed: 'seacave_weed'` |
| Object `seacave_weed` (kind `weed_curtain`, drawn over the door tile, not solid) | (4, 6) | `if: '!side.canoes_sleep.accepted'` |
| Spawn `seacave_weir` (back from the new map) | (4, 7), facing down | |
| The fix of 1.4: `escape_canoe`'s `if`, the day's two canoes and the guard, the `seacave_war` line | ledge and inlet | as in 1.4 |

The closed door's line (`seacave_weed`), which a Chapter 2 player who walks into it on the escape night also gets:
"A curtain of weed hangs over a crack in the rock. Cold air breathes through it." Nothing else in Chapter 2 changes.

**B. `xaragua-weir` (new, interior, 20 x 14): "the sleeping pool".** Present and Echo grids differ.

```
     0         1
     01234567890123456789
 0   ####################
 1   ####################
 2   ####################
 3   ####pppppppp########      p  the pit (8 x 5): x 4..11, y 3..7
 4   ####pppppppT########      T  the tide post (11, 4)
 5   ####pppppppGcccccccc      G  the weir gate (12, 5); c the channel to the sea
 6   ####ppCCCppp########      C  the canoe on the pit floor (6..8, 6)
 7   ####pppppppp##sFf###      s  the scouts; F the fire (16, 7); f the net floats (17, 7)
 8   ####rSrrrrrrH#zzz.##      r  the rim; S the cut steps (5, 8); H the haul line (12, 8); z the Echo zone (14..16, 8)
 9   ##...............###      the lip, two tiles deep: x 2..16, y 9..10
10   ##...............###
11   ##...###############
12   ##...###############
13   ###D################      D  the door back to the sea cave (3, 13); spawn `weir` (3, 11)
```

| Thing | Present | Echo (a storm night, late in the war) |
|---|---|---|
| The pit (x 4..11, y 3..7) | Sea water in the bottom, solid (grid `cave_water`) | Dry sand, **walkable** (grid `cave_floor`), under the tide objects below |
| The cut steps (5, 8) | A rockfall, solid (`weir_rockfall`, the design's rockfall) | Walkable: the only way into the pit |
| The rim (4 and 6..11, 8) | Rock | Rock |
| The weir gate (12, 5) | Up, its trip line rotted (`weir_open`); or down (`weir_shut`) on either anchor | Up on its peg; or down on either anchor |
| The tide post (11, 4) | "bored through twice: once at half height, once near the top" | The same, new |
| The fire (16, 7) | A ring of fire-black stones; the air shimmers over the shelf | Lit; two scouts at (14, 7) and (15, 7); the net floats at (17, 7) |
| The haul line (12, 8), used from (12, 9) | Frayed | Lifts a fallen gate |
| The Echo zone | (14, 8), 3 x 1, `if: 'item.sun_locket, side.canoes_sleep.accepted'`, `onEcho: 'weir_echo_enter'`, `onReturn: 'weir_echo_return'` | |
| Caona | | (10, 9), facing up, at the lip (the lip is two deep so she does not block it) |

**The water, as conditional objects (no tile changes at run time):**

| Object | Era | Area | Solid | `if` |
|---|---|---|---|---|
| `echo_tide_half` (kind `tide_half`) | echo | (4, 3) 8 x 5 | yes | `echo.tide_in\|anchor.weir_half` |
| `echo_tide_full` (kind `pool_brim`) | echo | (4, 3) 8 x 6 (covers the rim and the steps) | yes | `echo.tide_high\|anchor.weir_high, !anchor.weir_half` |
| `pool_brim` | present | (4, 3) 8 x 6 | yes | `anchor.weir_high` |
| `canoe_floor_echo` (kind `dugout`) | echo | (6, 6) 3 x 1 | yes | `story.weir_echo_seen, !anchor.weir_high` |
| `canoe_wreck` (kind `dugout_wreck`) | present | (6, 6) 3 x 1 | yes | `!anchor.weir_high` |
| `sleeping_canoe` (kind `dugout`) | both | (7, 8) 3 x 1, on the rim under the brim, used from (7..9, 9) | yes | `anchor.weir_high` |
| `pit_look` (looking down from the lip) | present | (6, 8) 6 x 1 | (rock) | `!anchor.weir_high` |
| `weir_gate_up` / `weir_gate_down` | both | (12, 5) | yes | `!anchor.weir_high, !anchor.weir_half` / `anchor.weir_high\|anchor.weir_half` |

The tide never moves while Patricio is in the pit (it only moves when he sits at the fire, on the shelf), and the Echo
zone is on the shelf, so nobody is ever standing where water appears.

Optional, if there is time: at dusk the tide is at its lowest, so an unanchored pit should be dry. One present-day
object (`pit_dry`, kind `pit_sand`, the pit's area, `if: 'story.tide_called, !anchor.weir_high, !anchor.weir_half'`)
does it. Cut first.

### 2.4 Flags (exact)

| Flag | Set by | Meaning |
|---|---|---|
| `side.canoes_sleep.accepted` | the shell diver's choice | The quest is on; the weed door and the Echo zone open |
| `story.seacave_war_seen` | the `seacave_war` trigger | The day-tide line has played |
| `side.canoes_sleep.wreck_seen` | first look into the pit (`weir_enter` or `pit_look`) | Step 2 done; Anissa's first hint given |
| `story.weir_echo_seen` | the first memory scene | The scouts and the canoe are placed on later visits |
| `clue.sleep_wet` | Caona's ask | Step 3 done; the fire lets Patricio sit |
| `echo.floats` | taking the net floats | Patricio carries them (wiped on the way back) |
| `echo.rig_low` / `echo.rig_high` | the tide post's choice | The floats are tied through the low or the top hole (wiped on the way back) |
| `echo.tide_in`, `echo.tide_high`, `echo.tide_turned` | sitting at the fire | The memory's tide (table below; wiped on the way back, so every visit starts at Low) |
| `anchor.weir_half` | the gate falling at Rising | The wrong anchor: half a pool. **Reversible** (the haul line sets it `false`) |
| `anchor.weir_high` | the gate falling at High | The right anchor (it also sets `anchor.weir_half: false`) |
| `side.canoes_sleep.half_seen` | the present, on coming back to half a pool | The half-pool scene has played |
| `side.canoes_sleep.hint2`, `.hint3` | `weir_echo_return` | Anissa's second and third hints given |
| `item.caona_conch`, `side.canoes_sleep.done` | `sleeping_canoe` | The conch taken; the quest done (the engine pays the reward once) |
| `war.conch_called` | the tide call's new lines | The tide-call variant has played (for tests) |

**The memory's tide** (map `if` text reads truthy flags only, so the state is three booleans):

| State | `echo.tide_in` | `echo.tide_high` | `echo.tide_turned` | The pit |
|---|---|---|---|---|
| Low (every visit starts here) | | | | Dry: Patricio can walk down the steps to the post and the gate |
| Rising | set | | | Half full: the steps end in water |
| High | set | set | | Full to a hand under the lip |
| Falling | set | | set | Half full again, unless the gate is down |

Sitting at the fire steps Low, Rising, High, Falling, Low, as often as the player likes.

Both anchors go in the map's `anchors` layer the way the grove's two do (`grove_flat` and `healer_grove`):
`weir_half` on the tide post, `weir_high` on the gate. The builder checks that an anchor set back to `false` inside
the memory behaves on the way out (`GameLogic.swap` compares the anchors at entry); `engine/secrets.ts measure()`
already resets an anchor that way.

### 2.5 The solution, step by step

1. **The camp.** Talk to the shell diver; accept.
2. **The sea cave.** Canoe Beach, the cave under the headland at (31, 8), up the tunnel, through the weed at (4, 6).
3. **The present chamber.** Look into the pit: a war canoe at the bottom, split end to end. (Anissa's first hint.)
   The gate stands open, the post has two holes, the steps are under a rockfall, the air shimmers over the old fire.
4. **The memory.** Echo on the shelf. The first visit plays the scene (section 4.3): Caona sets the problem.
5. **At Low water:** take the net floats from beside the fire (17, 7); walk the lip to the steps (5, 8), down into
   the pit, to (11, 5); at the tide post choose **"Tie the floats through the top hole."**
6. Climb out. **Sit by the fire twice** (Rising, then High). At High the floats lift the last hand's width, the peg
   jumps and the gate falls on a full pool: `anchor.weir_high`. Caona puts her conch in the canoe's bow.
7. **Back in the present:** the pit is a brim-full pool and the canoe floats against the lip, whole. Yari takes the
   conch from the bow: `item.caona_conch`, `side.canoes_sleep.done`.

`solution.json` for `puzzles/xaragua_weir`: from the spawn `weir` to the Echo zone, `echo`, the floats, the post
(top hole), the fire twice, `echo`, the canoe. `cheats.json`: the four wrong ways below.

### 2.6 Wrong ways, and what resets

| The player does | What happens | Lasting? |
|---|---|---|
| Knocks the peg out by hand at Low | Caona stops him: "Shut it now and you shut the sea out, Marshal. She would be dry by morning." | Nothing changes |
| Ties the floats through the **low** hole and waits | At Rising the gate falls on half a pool (`anchor.weir_half`). Caona: "She is aground at the stern. Half a bed breaks her back." Waiting on to High shows the sea standing a man's height above the pool outside the shut gate | Yes, until hauled: in the present the pool is half full and the canoe is split above the waterline. In the memory the **haul line** at the lip lifts the gate (`anchor.weir_half: false`), the pool drains at the next Low, and he ties again |
| Sits by the fire with nothing tied | The tide comes and goes. Caona: "The sea came in and went out again, Marshal. It does that." | Nothing changes |
| Leaves the memory half-way (floats in hand or tied, any tide) | Every `echo.` flag is wiped by the engine on the way back: the next visit starts at Low with the floats by the fire | Nothing lasts but anchors |
| Tries to reach the post at Rising, High or Falling | The pit is water (solid). The fire's line says which way the tide is going | |

There is no state the player cannot get out of: the worst case is `anchor.weir_half`, and the haul line is on the lip,
reachable at every tide.

### 2.7 Anissa's three hints

Side quests have no hint timer, so they come in place, as Z-4's do (never at once, the answer last). She is earnest;
she never jokes.

| # | When | Line |
|---|---|---|
| 1 (nudge) | The first look into the pit (`side.canoes_sleep.wreck_seen`) | "It gets wet and then dry, Gigi. Twice every day, for fifty years. Nothing could sleep like that." |
| 2 (pointer) | The first time the party comes back from the memory without `anchor.weir_high` (sets `.hint2`) | "Grandfather can only stand at the gate when the pit is empty. But it has to shut when the pit is full. What goes up with the water, all by itself?" |
| 3 (answer) | The second time (sets `.hint3`; repeats after) | "In the memory, at low water, take the net floats from beside the fire. Go down the steps and tie them through the top hole of the post. Then sit by the fire twice, until the tide is all the way in. The floats pull the peg." |

If the party comes back to half a pool, the half-pool scene (4.5) plays first and the hint follows it.

`PUZZLES.md` S-XAR's three lines are replaced by these.

### 2.8 Sparkles (the built `controlSet` and `markAfter`)

- `CONTROL_SETS`: the memory's controls as one set `weir` (`weir_floats`, `weir_post`, `weir_gate`, `weir_fire`,
  `weir_haul`), so the chamber shows one sparkle, not five.
- `LATER_STEPS` on `xaragua-weir`: the post waits for `clue.sleep_wet`; the present's `sleeping_canoe` needs no entry
  (it only exists once the anchor holds).

---

## 3. The reward

### 3.1 Why the designed reward cannot be built now

*Conch Call* as designed (a canoe on any shore, hidden coves in four capitals, free sea travel) needs a water layer
on maps the story has left for good. From the camp onward the game is one harbor at dusk, one night, Eightgate and
the Hearing. Review 1 said it plainly: "a map ability with nothing to do is worse than a deferred one."

### 3.2 The reward: the canoes answer

**Yari carries Caona's Conch, and Yucayeque's canoes answer it.** One effect in battle, three moments shown.

**The effect (the item's one ability, *Conch Call*).** In every fight where the whistle asks for volleys, the canoes
fire **one volley of their own**: it is added to whatever the whistle asked (so four at most instead of three), it is
not taken from the fleet's count, and it fires even when the player holds the companies' fire. The battle names it:
"Yucayeque's canoes: a volley!"

- **Where it lands:** `customs_thorne` (both routes) and `flagship_hale` (Trust). The quest opens after the headland
  and the flank, so those two are past. The Strike's `pier_rael` has no volleys on purpose (the second review's
  3.3: the hard route) and keeps none.
- **Why this and not more volleys in the pool:** on the route the pool is 16 and the four volley fights can spend 12
  at most, so a bigger pool would be a reward nobody feels. One volley over the cap is felt by every player, and most
  by the player whose Muster went badly and whose pool is nearly empty.
- **Why it is modest:** a volley is a blow of `VOLLEY.power` 50 at the party's mean ATK, a boss takes half, and it
  wounds but never fells. One more of them shortens two fights a little.
- **Type:** the summary table's rule is that the nine effects never overlap. This one becomes **"the fleet"** (an
  army effect), which none of the other eight is.

**How it is built (small, data-driven; the engine names no item).**

- `engine/rpg.ts` `BattleBoons`: add `fleetVolley?: { count: number; name: string }`; `battleBoons()` keeps the
  largest count.
- `engine/war.ts`: a pure `withFleetVolley(volleys, battle, boon)` that appends `count` volleys named `name` when
  `battle.volleys` is set and the boon is held; unit tested. `settleBattle` already spends only what the whistle
  asked (`war.volleys.<id>`), so the canoes' volley costs the pool nothing with no further change.
- `scenes/BattleScene.ts` line 320: `volleysFor(...)` then `withFleetVolley(...)` with the boons it already reads.
- `config.ts` `SECRET_ITEMS.conch = { volleys: 1 }`; the name "Yucayeque's canoes" in `data/war.ts`.

**Balance check the builder runs:** `tools/battle-sim.ts` and `tests/war.test.ts` on `customs_thorne` and
`flagship_hale` with four volleys against three. If either fight stops costing the party anything (the tests count
falls across the party), fall back to **the canoes' volley is free but stays inside the whistle's three** (a help to a
weak fleet only) and note it in `SECRET-ITEMS.md`. No other fight changes, so `npm run level-curve` is untouched by
the item.

**The item card (`data/secretItems.ts`, a key item like the Wick; ShowcaseView's legendary card pops over the
conversation that gives it):**

```
id: 'caona_conch', name: "Caona's Conch", kind: 'key', price: 0, showcase: 'legendary',
text: "A queen conch cut for blowing, its lip worn smooth by one mouth. Fifty years in the bow of a canoe that
       never dried. Yari carries it for the canoes.",
boons: { fleetVolley: { count: SECRET_ITEMS.conch.volleys, name: CANOES_NAME } },
abilities: [
  { name: 'Conch Call', text: "Wherever the companies answer the whistle, Yucayeque's canoes answer the conch: one
     volley more, over the whistle's three, that the fleet's count never pays for." },
  { name: 'Heard on any shore', text: 'Yari blows it when the tide is called. The old people know the sound.' },
]
```

### 3.3 The three shown moments (all conditional on `item.caona_conch`; lines in 4.6 to 4.8)

1. **The tide call** (the head runner's `ready` node): Yari climbs the rock beside him and blows Caona's conch after
   his. An elder knows it. The canoe fisher says what it means for the fights.
2. **The whistle** (`_fire` and `_hold` nodes): one line each, with the `conch` sound the chapter already has.
3. **The caney** (`war_caney`, just before the paddle): Anaco knows the shell, and says in one line why the **carved
   paddle** is Xaraguá's seat token and the conch is not.

### 3.4 The seat token: no clash

The Chapter 11 review (3.10) and the Chapter 12 review (3.8) settled that Xaraguá's token is **the carved paddle**
(`item.token_xaragua`) and that *Caona's Conch* is this item. Nothing here touches the paddle, the eighth chair or
`seatClaim.ts`'s chair scene. Anaco's line draws the line out loud: "The paddle is a promise: it goes on the chair.
The conch is a voice: it stays with the canoes." The design's "free sea travel, no Guild fare" survives as one optional
Hearing line (4.8) and nothing more.

### 3.5 Gold, XP, Influence

| | Design | Build | Why |
|---|---|---|---|
| Gold | 150 | **150** | As designed; the same as The Ninth Thumbprint. Run `npm run economy` |
| XP | 120 | **60** (**Claude's call, Nov 16**) | What the other late secret quests pay (`littleLamps`, `letterFloor`, `patientHour`: 60). Chapter 11's route ends at 10,260 XP and level 29 is 10,338: 120 would lift some players a level before the Regent. With 60, a player who does every side quest ends Chapter 11 at 10,754 (level 29: inside `tests/sideQuestsLate.test.ts`'s one level over) and Chapter 12 at the cap. The route skips the quest, so the level-curve table's route lines do not move |
| Influence | +2 (Xaraguá) | **+2** | As designed, and as the chapter's other quests pay |

---

## 4. The staging, scene by scene (shown, not told)

Voices: Yari is direct and proud; Anissa is earnest and never jokes; Caona is short, commanding, dry ("Good."); the
shell diver speaks in sea sayings. Lines are in final form unless marked.

**Taíno words for the fluent reader (Nov 18):** this quest adds **none**. The only Taíno word in its lines is
*cacica*, already in the chapter ("Say the word, cacica."). The item is named in English; *guamo* (flagged in
`CAPITALS.md` and `SECRET-ITEMS.md`) stays out of the player's view. If the owner wants *guamo* on the item card, add
a row to `PHRASEBOOK-CHECK.md` section 2 before the 18th. The conch is shown as a signal horn and an heirloom, never
as a sacred object (guide 7.3).

### 4.1 The hill camp: the shell diver (`shell_diver_war_talk`)

Branches: `done` (has the conch), `waiting` (accepted), `ask` (by day), in that order.

`ask`:

- *[She gets up, walks two tiles to Yari, and looks at her: `walk npc:shell_diver_war`, `face` to the player, `look`.]*
- Shell diver: "Cacica. The canoes go out by the sea cave tonight, they tell me. Past the weed."
- Shell diver: "My grandmother dived that cave. She said Caona's own canoe is in there. Not the ones she hid for us. The one she hid for herself."
- Yari: "We left by that cave. In a canoe she hid." *[`look yari`]*
- Shell diver: "That was one of ours. Hers she put to sleep between two tides, Grandmother said. Behind the weed, where the tunnel turns."
- Shell diver: "I went in once, at low water. A pit, and a wreck in it, split like a pod."
- Yari: "Then it's gone."
- Shell diver: "A dugout that dries, splits. Every canoe maker's child knows it. Caona knew it. So why is hers lying in a pit that dries twice a day?"
- *[She turns to Gianna: `face` to the player.]* Shell diver: "Your envoy wears the old Marshal's sun. He was here that season. Ask the cave."
- Choices: **"We have until the tide. Tell me the way."** (sets `side.canoes_sleep.accepted`) / "After the harbor."
- On accept: *[she faces the sea, `face` down]* "Under the headland, where the gun was. Up the tunnel, and straight on where it turns. I won't go in again. At high tide the sea keeps what it finds." Then "(Where the Canoes Sleep is in the Quests page of the menu.)"

`waiting`: "Behind the weed, where the tunnel turns. Go while the tide is half."

`done` *[`look` at Yari]*: "...That is hers. Grandmother drew it for me in the sand. Blow it tonight, cacica. Let the Crown hear who is back."

### 4.2 The chamber, now (`weir_enter`, a once-only trigger at the spawn; `pit_look`; the objects)

- "Behind the weed the rock opens into a round chamber. A pit takes up most of it. Sea water moves in the bottom."
- *[Yari walks from the party to the lip, (8, 9), facing up; the camera follows: `walk yari`, `look yari`.]*
- "At the bottom lies a long canoe, room for twenty paddles, split from end to end."
- Yari: "She led the scouts in this."
- *[Anissa turns to Gianna: `face follower` to the player.]* Anissa (hint 1): "It gets wet and then dry, Gigi. Twice every day, for fifty years. Nothing could sleep like that." (sets `side.canoes_sleep.wreck_seen`)
- Yari: "We let the water out of one cave to read an oath. She meant to shut it into another, to keep a canoe. Something stopped her."

The objects, one line each: the gate ("A stone gate in the pit's sea wall, held up on a peg. The line that tripped it
rotted off long ago."); the post ("A post in the pit, bored through twice: once at half height, once near the top.");
the rockfall ("Steps were cut down into the pit here. They are under a rockfall."); the haul line ("A frayed line
through a hole in the rock, over the gate."); the fire ring ("A ring of fire-black stones on the shelf. The air
shimmers over it.").

### 4.3 The memory, first visit (`weir_echo_enter`, node `first`; sets `story.weir_echo_seen`)

- "The same chamber, fifty years ago, at night. Wind in the tunnel, and thunder out at sea. A fire on the shelf. The pit is dry." *[`fx: 'fade'`, then a `flash` and a `shake` for the storm.]*
- Anissa (far): "I'm holding the door, Gigi."
- *[Two scouts come in from the passage in file, two tiles apart, along the lip, down the cut steps and across the
  pit floor to (6, 6) and (8, 6): `enter scout_a`, `enter scout_b` (look `echo_yaguana`), the first `async`. When
  they stop, `sync`: the canoe lies between them.]* "Two scouts carry a long canoe down the cut steps, and set her on the sand."
- *[Caona comes in behind them and walks to Patricio on the shelf, (13, 9), facing right: `enter caona_w` (look `caona`), `look`.]*
- Caona: "Marshal. The Crown burns every hull it finds on a beach. This one they do not find."
- Caona: "A dugout sleeps wet or she splits. In here the sea comes in through the rock, and goes out again. It will not stay for me."
- *[A scout calls up from the pit: `look scout_a`.]* Scout: "The gate, Caona. Knock the peg and it drops."
- Caona: "Knock it now and we shut the sea out. Knock it at the top of the tide and whoever is down there drowns knocking."
- *[She turns to Patricio: `face caona_w` to the player.]* Caona: "You are the one who makes bridges stay down. Make water stay in." (sets `clue.sleep_wet`)
- *[The scouts climb out and go to the fire, (14, 7) and (15, 7); Caona walks to the lip, (10, 9), facing up: `walk`,
  then `sync` so the placed NPCs stand where the actors stopped.]*
- Patricio: "(The gate is at the bottom. The tide is at the top. One of us has to be in two places.)"

Later visits (node `again`): "The chamber, fifty years ago. The storm is still out at sea." plus the state line.

Talking to them:

- Caona, before the anchor: "She must float clear of the rock, Marshal. All the way up. Half a bed breaks her back."
- The first scout (at the fire): "Net floats, Marshal. Gourds, stopped with wax. They go up with the water whether you ask them or not."
- The second scout (the tempting advice): "The low hole, I'd say. It shuts sooner. There is a Crown cutter off the point."

### 4.4 The memory's controls

- **The net floats** (`weir_floats`): "A string of net floats by the fire: dried gourds, stopped with wax." Choice: "Take them." (`echo.floats`)
- **The gate** (`weir_gate`, reachable at Low): "The gate hangs on one peg. A trip line runs from the peg up the post." Choices: "Knock the peg out now." (Caona's refusal, 2.6) / "Leave it."
- **The tide post** (`weir_post`, at Low, with the floats): "The trip line runs up the post. Floats tied to it will pull the peg when the water has lifted them as high as the hole they are tied through." Choices: "Tie the floats through the low hole." (`echo.rig_low`, clears `rig_high`) / "Tie the floats through the top hole." (`echo.rig_high`, clears `rig_low`) / "Not yet." Without the floats: "A trip line and two holes. Nothing to tie to it."
- **The fire** (`weir_fire`): a line for the state ("Low water. The pit is wet sand." / "The tide is making. The pit is half full." / "High water. A hand under the lip." / "The tide is going. The pit is half full."), then "Sit by the fire until the tide moves." / "Not yet." Each sit: `fx: 'fade'`, the flags, `sync`.
  - To Rising: "The fire burns down a hand. Water comes up the channel, in through the gate's mouth, and climbs the pit to the low hole."
  - To High: "The water stands at the top of the post, a hand under the lip. For a few breaths it goes neither way."
  - To Falling, nothing shut: "The water goes out the way it came in." Caona: "The sea came in and went out again, Marshal. It does that."
  - To Low: "Low water. The pit is wet sand again."
- **The low hole trips** (at Rising, `echo.rig_low`): *[`sync`, `shake`]* "The water reaches the low hole. The floats lift, the line snaps tight, the peg jumps. The gate falls on half a pool." Scout: "Shut!" *[`look npc:caona_weir`]* Caona: "She is aground at the stern. Half a bed breaks her back." (sets `anchor.weir_half`) "(Anchor: this change will last into the present.)" "(The haul line at the lip lifts the gate again.)"
  - Sitting on to High after that: "Outside the gate the sea stands a man's height above the pool. Inside, half a bed."
- **The haul line** (`weir_haul`): with `anchor.weir_half`: "Haul the gate up." *[`shake`, `sync`]* "The gate comes up on its line. The half pool runs out with the tide." (`anchor.weir_half: false`, both `rig` flags cleared.) With `anchor.weir_high`: "It holds. Leave it."

### 4.5 The top of the tide (the fire's node `trip_high`), and the way back

In the memory:

- *[`sync`, a pause: `wait 900`.]* "Between the tide coming and the tide going, nothing moves. Then the floats lift the last hand's width."
- *[`shake`; the gate's look changes on `sync`.]* "The peg jumps. The gate falls, and the sea is shut in, brim to the lip." (sets `anchor.weir_high`, `anchor.weir_half: false`)
- *[The two scouts walk from the fire to the lip, (7, 9) and (9, 9); `sync`: the canoe floats against the lip.]* "The scouts bring her round to the lip on a line. She rides level, and touches nothing."
- *[Caona walks to (8, 9), facing up; `look`.]* "Caona takes the conch from her belt, and sets it in the bow under a fold of oiled cloth."
- Patricio: "You will want that tomorrow."
- Caona: "Tomorrow I have a Marshal. He is louder."
- Caona: "If they take me, they take a woman. Not the thing that calls the canoes."
- Patricio: "And when does she wake?"
- Caona: "When somebody who knows the song comes for her. Good."
- "(Anchor: this change will last into the present.)"

Back in the present (`weir_echo_return`):

- **Solved** (`anchor.weir_high`, first time): *[`fx: 'flash'`, `sync`.]* "The pit is a pool, brim-full and still, black as the inside of a shell. Against the lip floats a war canoe. Whole." *[`look` at the canoe; Anissa `face` to the player.]* Anissa: "It stayed, Gigi."
- **Half** (`anchor.weir_half`, first time; sets `.half_seen`): "The pit holds half a pool, black and still. The canoe lies canted on the rock, sound below the waterline and split above it." Yari: "Half of her slept." Then the hint that is due.
- **Nothing anchored:** the hint that is due (2.7).

### 4.6 The canoe (`sleeping_canoe`, node `first`; sets `item.caona_conch`, `side.canoes_sleep.done`)

- *[Yari walks to the lip beside the canoe, (8, 9), facing up, and the camera goes to her: `walk yari`, `look yari`.]*
- Yari: "She is wet to the gunwale. She never dried. Not once." *(mood: grief)*
- "Yari folds back the oiled cloth in the bow. Under it lies a conch, cut for blowing, its lip worn smooth by one mouth."
- Yari: "The songs say Caona could call a canoe to any shore with this. I thought it was only a song."
- Gianna: "It's yours."
- Yari: "It's the canoes'. I'll carry it for them." *(the legendary card shows here)*
- *[Yari turns to the party: `face yari` down.]* Yari: "She stays. After the harbor we come back for her, with twenty paddles."
- "(Yari carries Caona's Conch.)"

Later: "Caona's canoe, afloat and whole. She has waited fifty years. She can wait for twenty paddles."

### 4.7 The tide call (three lines added to the head runner's `ready` node, all `if: item.caona_conch`)

After the built line "The head runner puts the conch to his mouth. It sounds down the mountain, to the point, and to the bay.":

- *[Yari climbs the rock beside him, (15, 6), facing down; `look yari`; `fx: 'conch'`.]* "Yari climbs the rock beside him and lifts Caona's conch. Hers is lower, and it carries further." (sets `war.conch_called`)
- *[The three elders turn to the rock: `face` each to Yari's tile; `look npc:elder_undecided_war`.]* Elder (the undecided one): "That is Caona's. I heard it once. I was six."
- *[`look npc:canoe_fisher_war`]* Canoe fisher: "That one we don't wait for a whistle to answer, cacica."

Then the built exit of the canoe fisher and the scouts plays as it is. The builder checks Yari is back with the party
after the built fade (a `sync` on the last built line already redraws the party).

### 4.8 The whistle, the caney, and the Hearing

- **The whistle's `_fire` node** (after the built "Down the line the companies answer the whistle"): "Yari lifts Caona's conch. From the water, the canoes answer too." *(`fx: 'conch'`)*
- **The whistle's `_hold` node:** "The canoes answer the conch, not the whistle. One volley, from the water." *(`fx: 'conch'`)*
- **The caney** (`war_caney`, node `paddle`, before the built paddle lines): *[`look npc:anaco_free`]* Anaco: "And you found her shell. Then hear me, daughter. The paddle is a promise: it goes on the chair. The conch is a voice: it stays with the canoes."
- **The Hearing (optional; build only if the three endings share one place for Yari's "sits for a harbor" line):** Yari: "And Yucayeque's canoes carry the Council's letters down the coast. No fare. They answer a conch, not a purse." This is the design's "free sea travel, no Guild fare", kept as a fact of the ending.

---

## 5. Tests and checks

### 5.1 Sim tests (new file `quest/tests/canoesSleep.test.ts`, on the pattern of `seventhStone.test.ts` and `quietCells.test.ts`: the route's flags at the mark `war-camp`, then the quest)

1. **Found, not pointed to.** `secret: true`; no mystery entry, no nudge, no dot before it is accepted; the gold
   arrow never points at it while "Until the tide" is open (`guide.test.ts`'s rule for secret quests covers it).
2. **The giver.** The shell diver stands on `xaragua-camp` under `WAR_DAY_TEXT` on a free, reachable tile that hides
   nobody (`hidesEachOther`); she is gone once `story.tide_called` is set; declining leaves her offer open.
3. **Solvable.** From the camp: accept, the sea cave, the weed door, the chamber, the memory, the floats, the top
   hole, the fire twice, back, the canoe. Ends with `anchor.weir_high`, `item.caona_conch`,
   `side.canoes_sleep.done`, +150 gold, +60 XP, +2 Influence (Xaraguá).
4. **Wrong ways (each its own case).**
   - The peg by hand at Low: no anchor, no flag left.
   - The low hole, one sit: `anchor.weir_half`; the present shows the half pool and no canoe at the lip; `weir_haul`
     in the memory clears it; then the right way still solves.
   - A whole tide with nothing tied (four sits): no anchor; the state is Low again.
   - Leaving the memory with the floats tied: every `echo.` flag gone; the next visit is at Low, the floats by the fire.
   - At Rising, High and Falling the post's tile (11, 5) is not walkable in the memory; at Low it is.
5. **The door.** Without `side.canoes_sleep.accepted` the weed door is closed and plays `seacave_weed`; with a
   Chapter 2 escape-night save too.
6. **Skipping it changes nothing on the route.** The whole route runs to `the-end` unchanged; the flag snapshots at
   `war-camp`, `war-tide-ready`, `war-village` and `chapter11-end` are equal to the ones before the build (compare
   to `data/starts/chapters.json`, which must regenerate byte-identical); no `side.canoes_sleep.*`, `anchor.weir_*`
   or `item.caona_conch` flag is ever set on it.
7. **The reward is paid once.** Talking to the canoe again, re-entering the memory, and reloading a save after the
   reward pay nothing more; the showcase shows once (`shown.item.caona_conch`).
8. **It closes.** Accepted and unfinished at `act11.complete`: status `closed`, with the closed text; never accepted:
   never listed.
9. **The conch in the war** (in `tests/war.test.ts`): `withFleetVolley` adds exactly one volley named "Yucayeque's
   canoes" to a volley fight with the item, none without it, none to a fight without `volleys` (`pier_rael`,
   `caona_stand`, `claim_regent`); with the whistle held at 0 the canoes still fire one; a won fight spends from the
   pool only what the whistle asked.
10. **The conditional lines.** With the item the tide call, the whistle and the caney show their extra lines and
    `war.conch_called` is set; without it the three scenes' line lists are what they were (a snapshot of the
    visible lines before and after the build).
11. **The stale canoe.** With `story.escaped` set, `escape_canoe` is not on the sea cave map; a Chapter 2 save at the
    mark `seacave` still has it and still starts the Thorne fight.
12. **Stage cues.** Every cue in the new scenes names an actor that exists and walks only on open tiles
    (`stage.test.ts`'s checks run over the new scripts); nobody stops on another person's tile.

Existing suites that must stay green: `content.test.ts` (every flag read is set somewhere: the `echo.` and
`anchor.weir_*` flags are set by dialogue), `maps.test.ts` and `npm run validate:maps` (the new map, the new door),
`puzzles.test.ts` (the new `puzzles/xaragua_weir` solution and cheats), `sideQuestsLate.test.ts` (the level curve
with every quest done), `economy.test.ts`, `showcase.test.ts`, `act.test.ts`, `xaragua.test.ts`, `war.test.ts`.

Commands: `npm test`, `npm run typecheck`, `npm run lint`, `npm run maps:build`, `npm run validate:maps`,
`npm run level-curve`, `npm run economy`.

### 5.2 Smoke and screenshots (dev server; `?at=` with `&set=` and `&go=`, 390 px portrait)

| Check | URL after `http://localhost:5180/` | Look for |
|---|---|---|
| The giver | `?at=war-camp` | The shell diver at the camp, apart from the fire, not on anyone's tile; her talk mark |
| The weed, closed | `?at=war-camp&go=xaragua-seacave/seacave` | The day canoes and the guard; the weed over the crack; no stale escape canoe |
| The chamber, unsolved | `?at=war-camp&set=side.canoes_sleep.accepted&go=xaragua-weir/weir` | The pit, the wreck, the open gate, the rockfall, the shimmer on the shelf; the entry scene with Yari at the lip |
| The memory | the same, then Echo on the shelf | The storm, the scouts carrying the canoe down, Caona's walk; each of the four tide states after a sit |
| The half pool | `...&set=side.canoes_sleep.accepted,anchor.weir_half&go=xaragua-weir/weir` | Half water, the gate down, the canted wreck |
| Solved | `...&set=side.canoes_sleep.accepted,anchor.weir_high&go=xaragua-weir/weir` | The brim pool over the rim, the whole canoe at the lip, the conch card |
| The tide call | `?at=war-tide-ready&set=item.caona_conch` | Yari on the rock, the elders turning, nobody standing on anybody |
| A volley fight | `?at=war-village&set=item.caona_conch`, then the customs house | "Yucayeque's canoes: a volley!" after the companies' |
| Chapter 2 unchanged | `?at=seacave` | The escape plays as before; the weed line if walked into |

Add the chamber (unsolved and solved) to `tests/smoke.mjs`'s Chapter 11 checks if the harness allows `set` and `go`
there; otherwise these are by hand.

---

## 6. Every file to add or change

**New**

| File | What |
|---|---|
| `quest/tests/canoesSleep.test.ts` | Section 5.1 |
| `quest/puzzles/xaragua_weir/solution.json`, `cheats.json` | The solution and the four wrong ways |
| `quest/maps/xaragua-weir.tmj` | Generated by `npm run maps:build` |
| `docs/quest/reviews/reviewer-prompts/` (one prompt) | The owner's reviewer prompt for this build (owner request, Oct 21) |

**Changed: maps and data**

| File | What |
|---|---|
| `quest/tools/maps/xaragua.ts` | `xaraguaWeir()` (new map, section 2.3 B) and its export; the sea cave's door, weed, spawn, `seacave_war` trigger, `escape_canoe`'s `if`, the day canoes and guard; the camp's `shell_diver_war` in `warCamp()` |
| `quest/tools/maps/painter.ts` | Only if a legend character is needed for the steps or the pit sand (the built `cave_floor`, `cave_water`, `cave_wall` and stone pile may be enough) |
| `quest/src/data/war.ts` | A `WEIR` block of places (the tiles of 2.3 B), `CAMP.shellDiver`, the canoes' company name |
| `quest/src/data/maps.ts` | The new map's entry and name ("The sleeping pool") |
| `quest/src/data/npcs.ts`, `speakers.ts` | `shell_diver_war`, `caona_weir`, `echo_weir_scout_a`, `echo_weir_scout_b`, `seacave_canoe_guard` |
| `quest/src/data/objects.ts` | Names and inspect lines for the new objects |
| `quest/src/assets.config.ts`, `assets.pixels.ts` | Placeholder kinds: `weed_curtain`, `tide_half`, `pool_brim`, `dugout_wreck`, `weir_open`, `weir_shut`, `tide_post`, `net_floats`, `fire_ring_cold` (reuse `dugout`, the built fire and stone pile) |
| `quest/src/data/dialogue/xaraguaQuests.ts` (or a new `xaraguaConch.ts` registered in `data/dialogue.ts`) | Every conversation of section 4.1 to 4.6 |
| `quest/src/data/dialogue/xaraguaWar.ts` | The three conditional lines in `HEAD_RUNNER.ready`; one each in the whistle's `_fire` and `_hold`; one in `war_caney`'s `paddle` node |
| `quest/src/data/dialogue/xaragua.ts` | `seacave_weed`, `seacave_war`, the guard's talk |
| `quest/src/data/dialogue/seatClaim.ts` | Only the optional Hearing line (4.8) |
| `quest/src/data/sideQuests.ts` | The `canoes_sleep` quest beside X-6 to X-8 (`secret: true`, five steps, `closed: act11.complete`, reward 150 gold, 60 XP, +2 Influence) |
| `quest/src/data/sideQuestsLate.ts` | `LATE_XP.canoesSleep: 60` with its reason |
| `quest/src/data/secretItems.ts` | The `caona_conch` item |
| `quest/src/data/quests.ts` | Three Journal notes: "Between two tides" (on accepting), and "Something changed" for `anchor.weir_high` and for `anchor.weir_half` |
| `quest/src/data/content.ts` | `CONTROL_SETS` and `LATER_STEPS` entries (2.8) |
| `quest/src/data/puzzles.ts` | `xaragua_weir`: map `xaragua-weir`, spawn `weir`, the war-day flags plus `side.canoes_sleep.accepted`, goal `side.canoes_sleep.done` |
| `quest/src/config.ts` | `SECRET_ITEMS.conch = { volleys: 1 }` |

**Changed: engine and scenes (small)**

| File | What |
|---|---|
| `quest/src/engine/rpg.ts` | `BattleBoons.fleetVolley`; `battleBoons()` carries it |
| `quest/src/engine/war.ts` | `withFleetVolley()` (pure) |
| `quest/src/scenes/BattleScene.ts` | Line 320: apply it |
| `quest/tests/war.test.ts`, `secretItems.test.ts` | The new boon's cases |

**Changed: docs**

`docs/quest/design/SECRET-ITEMS.md` (the summary row and section 3: a "Built" note with every call below),
`SIDE-QUESTS.md` (the X-4 row and section: Chapter 11, the shell diver, 60 XP), `PUZZLES.md` (S-XAR: Chapter 11, the
new logic and hints, difficulty 3), `CAPITALS.md` (the sea cave row, the Echo scenes list, the proposed 10th Zetwal
book's "unlocks Conch Call's sea routes" clause), `COMBAT.md` 11 (the canoes' volley), `PLAN-ALL-CHAPTERS.md` ("After
the release" no longer lists the Conch), `reviews/2026-10-22-chapter11-outline.md` (the "Not built" line),
`reviews/questions-for-the-reviewer.md` (question 1: what was decided), `PHRASEBOOK-CHECK.md` (a line saying the quest
adds no Taíno word), `PLAYTHROUGH-GUIDE.md` (how to find it). `quest/src/data/rules.ts` is the board game's guide:
no change.

---

## 7. Build order (one builder, Nov 17 to 19; Nov 20 in hand)

1. **Nov 17, morning:** the engine boon and its tests (`rpg.ts`, `war.ts`, `BattleScene.ts`, `config.ts`); the item;
   the battle-sim check on the two fights.
2. **Nov 17, afternoon:** the map (`xaraguaWeir()`, the sea cave's additions, the camp NPC), placeholder art,
   `maps:build`, `validate:maps`; confirm `chapters.json` regenerates identical.
3. **Nov 18:** the conversations (4.1 to 4.6), the quest, the Journal notes, sparkles; the puzzle files.
4. **Nov 19, morning:** the conditional lines in the three built scenes; `canoesSleep.test.ts`; the whole suite.
5. **Nov 19, afternoon:** the dev-server pass of 5.2 at 390 px; docs; the reviewer prompt.

Cut list, in order, if a day is lost: the Hearing line; the dusk `pit_dry` object; the day canoes and guard (keep
`escape_canoe`'s `if`); the second scout's tempting line.

---

## 8. Decisions marked "Claude's call (Nov 16)"

| # | Decision | Reason in one line |
|---|---|---|
| 1 | The quest opens at the hill camp by day (`story.camp_reached, !story.tide_called`) and can be finished until `act11.complete` | The chapter's one calm stretch, and the puzzle does not need the present-day tide |
| 2 | The giver is the shell diver, not an old net-mender | She is built, she already speaks of the sea cave and its tides, and Yucayeque has no net-mender |
| 3 | The canoe is "the one Caona hid for herself", told apart in a line from the canoe of the Chapter 2 escape | The escape already found a canoe Caona hid; without the line this would read as the same find twice |
| 4 | A new small map behind a door in the sea cave, not a rebuild of the sea cave | Chapter 2's escape map stays as built and tested |
| 5 | The tide moves in the memory only; the present has no tide states and no resting | Chapter 11's own clock is "the lowest tide, at dusk"; a second clock in the cave would contradict it |
| 6 | The gate falls by a float line through one of two holes; the raft is dropped | It gives "drop it at High" a reason (he cannot be at the gate when the pit is full) and needs no pushed object |
| 7 | A shut gate holds what the pit held when it fell (a sealed pool), and a dugout that dries splits | The design's weir kept water with no stated reason; this is how such canoes are really kept |
| 8 | The wrong anchor (half a pool) is real, visible in the present, and reversible by the haul line | The grove's pattern (`anchor.grove_flat`): a mistake teaches, and never locks the puzzle |
| 9 | Difficulty 3, not 4 | One idea and one trap; the hints carry anyone through |
| 10 | No fight in the quest | Level 5 to 7 crabs mean nothing at 26, and Chapter 11's curve has no room |
| 11 | The reward is "the canoes answer": one free volley over the whistle's cap, not a larger pool | The route's pool (16) already exceeds what four fights can spend (12); only a volley over the cap is felt |
| 12 | The canoes fire even when the player holds the companies' fire | A player with an empty pool can only hold, and is the one who needs them |
| 13 | The canoes' volley is not added to the Strike's `pier_rael` | The second review made that fight volley-free on purpose |
| 14 | 60 XP, not 120; 150 gold and +2 Influence as designed | What the other late secret quests pay; 120 could lift a level before the Regent |
| 15 | Yari carries the conch (a key item, like Anissa's wick) | It is her great-grandmother's, and she is the one the canoes answer |
| 16 | The canoe stays in the pool ("After the harbor we come back for her") | Nothing to animate, and the harbor's dusk already has its canoes |
| 17 | No new Taíno word; *guamo* is not shown | The fluent reader's check is Nov 18 and the word is unverified |
| 18 | Anaco's line at the caney separates the paddle (the seat token) from the conch | The two reviews' fix (the token is the paddle) said out loud, so no player takes one for the other |
| 19 | Fix Chapter 11's stale escape canoe with this build, and stand the day's canoes in the cave | The quest sends every player past a line that says Thorne's longboat is still there |
| 20 | Hints come in place (the pit, then each return from the memory), the answer on the second failed return | Side quests have no hint timer; Z-4's rule (never at once) |
| 21 | The Hearing line is optional | It is one line in up to three ending nodes; worth it only if they share one place |

---

## 9. Questions for the owner (one at a time; the build goes ahead on the recommendation)

**Question 1: the Conch's effect.** Reason for asking: all nine secret items were approved on Oct 14 with their
effects, and this changes one of them from a map ability to an army effect.

1. **(Recommended) "The canoes answer":** one free volley from Yucayeque's canoes in the war's volley fights, Yari
   blowing the conch at the tide call, Anaco's line at the caney. Modest, shown, and usable in the game that is left.
2. Build the conch now with the scenes only and no effect in battle, and keep the designed *Conch Call* (a canoe on
   any shore, coves, free sea travel) for after the release, when there are sea places to go.
3. Do not build it for Nov 22; keep the design whole for after the release.

**Question 2: its chapter.** Reason for asking: on Oct 19 the owner chose to keep the Quill and the Conch "in their
own chapters", and review 1 agreed (Chapter 2, after the release). This outline puts it in Chapter 11.

1. **(Recommended) Chapter 11.** In the built Chapter 2 the sea cave opens only on the night of the escape, with
   Thorne waiting at its mouth: there is no calm visit to hang a puzzle on without rebuilding the escape. In
   Chapter 11 the cave is a known place, the canoes are waiting in it, and Yari is back as the one who can carry it.
2. Chapter 2, after the release, with the escape reworked to allow an earlier visit to the cave.

Neither answer changes the main story: the quest is optional and nothing on the route reads it.
