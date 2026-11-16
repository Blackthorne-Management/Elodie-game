// X-4 Where the Canoes Sleep (Chapter 11, secret; Caona's Conch): docs/quest/reviews/2026-11-16-conch-outline.md, built
// Nov 16 on its recommended answers (Chapter 11; "the canoes answer"). The shell diver at the hill camp by day, the weed in
// the sea cave (and the day's canoes there), the sleeping pool now and on a storm night fifty years ago, the tide moved by
// sitting at the scouts' fire, the floats that shut the gate at the top of the tide (the anchor), and the conch in the
// canoe's bow. The places are data/war.ts SEACAVE and WEIR; the map is tools/maps/xaragua.ts xaraguaWeir.
//
// The memory's tide is three echo flags (wiped on the way back, so every visit starts at Low): echo.tide_in (Rising, High
// and Falling), echo.tide_high (High), echo.tide_turned (Falling). It moves only while Patricio sits at the fire, on the
// shelf, so nobody ever stands where the water comes. Shown, not told (owner, Oct 17): whoever comes or goes walks on the
// map. Anissa is earnest and never jokes; her lines share no node with a comic one.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { WEIR } from '../war.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;

function say(speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, ...extra };
}

function nar(text: string, extra: Extra = {}): DialogueLine {
  return { speaker: '', text, ...extra };
}

function act(stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, stage, ...extra };
}

function script(id: string, nodes: Record<string, DialogueNode>): DialogueScript {
  return { id, start: 'start', nodes };
}

function at(x: number, y: number): { x: number; y: number } {
  return { x, y };
}

const has = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const all = (...c: Condition[]): Condition => ({ all: c });
const any = (...c: Condition[]): Condition => ({ any: c });

const G = 'gianna';
const A = 'anissa';
const AF = 'anissa_far';
const Y = 'yari';
const P = 'patricio';
const CA = 'caona';
const SD = 'shell_diver';
const SC = 'echo_weir_scout';
const GUARD = 'camp_scout';

const ACCEPTED = 'side.canoes_sleep.accepted';
const DONE = 'side.canoes_sleep.done';
const HIGH = 'anchor.weir_high';
const HALF = 'anchor.weir_half';
const TIDE_IN = 'echo.tide_in';
const TIDE_HIGH = 'echo.tide_high';
const TIDE_TURNED = 'echo.tide_turned';
const RIG_LOW = 'echo.rig_low';
const RIG_HIGH = 'echo.rig_high';
const FLOATS = 'echo.floats';

const ANCHOR_NOTE = nar('(Anchor: this change will last into the present.)');
const look = (actor: string): StageCue => ({ do: 'look', actor });
const sync: StageCue = { do: 'sync' };

// ---- The hill camp: the shell diver (the outline 4.1) -----------------------------------------------------------------

const ASK_CHOICES = [
  { text: 'Until the tide. Tell me the way.', next: 'accept', set: { [ACCEPTED]: true } },
  { text: 'After the harbor.', next: 'later' },
];

const SHELL_DIVER: DialogueScript = script('shell_diver_war_talk', {
  start: {
    lines: [],
    next: [{ if: has('item.caona_conch'), to: 'done' }, { if: has(ACCEPTED), to: 'waiting' }, { if: has('story.shell_diver_asked'), to: 'again' }, { to: 'ask' }],
  },
  ask: {
    lines: [
      // She gets up from where she sits apart and turns to Yari (Claude's call, Nov 16: a turn, not a walk, so she never
      // steps onto whoever came to talk to her).
      act([{ do: 'face', actor: 'npc:shell_diver_war', facing: 'player' }, look('npc:shell_diver_war')], SD, 'Cacica. The canoes go out by the sea cave tonight, they tell me. Past the weed.'),
      say(SD, 'My grandmother dived that cave. She said Caona\'s own canoe is in there.'),
      say(SD, 'Not the ones she hid for us. The one she hid for herself.'),
      act([look(Y)], Y, 'We left by that cave. In a canoe she hid.'),
      act([look('npc:shell_diver_war')], SD, 'That was one of ours. Hers she put to sleep between two tides, Grandmother said. Behind the weed, where the tunnel turns.'),
      say(SD, 'I went in once, at low water. A pit, and a wreck in it, split like a pod.'),
      say(Y, 'Then it\'s gone.'),
      say(SD, 'A dugout that dries, splits. Every canoe maker\'s child knows it. Caona knew it.'),
      say(SD, 'So why is hers lying in a pit that dries twice a day?'),
      act([{ do: 'face', actor: 'npc:shell_diver_war', facing: 'player' }], SD, 'Your envoy wears the old Marshal\'s sun. He was here that season. Ask the cave.', { set: { 'story.shell_diver_asked': true } }),
    ],
    choices: ASK_CHOICES,
  },
  again: {
    lines: [act([{ do: 'face', actor: 'npc:shell_diver_war', facing: 'player' }], SD, 'Caona\'s canoe, cacica. Behind the weed, where the tunnel turns. Will you go?')],
    choices: ASK_CHOICES,
  },
  accept: {
    lines: [
      act([{ do: 'face', actor: 'npc:shell_diver_war', facing: 'down' }], SD, 'Under the headland, where the gun was. Up the tunnel, and straight on where it turns.'),
      say(SD, 'I won\'t go in again. At high tide the sea keeps what it finds.'),
      nar('(Where the Canoes Sleep is in the Quests page of the menu.)'),
    ],
  },
  later: { lines: [say(SD, 'After the harbor the canoes are gone, cacica. So is the day.')] },
  waiting: { lines: [say(SD, 'Behind the weed, where the tunnel turns. Go while the tide is half.')] },
  done: {
    lines: [
      act([{ do: 'face', actor: 'npc:shell_diver_war', facing: 'player' }, look(Y)], SD, '...That is hers. Grandmother drew it for me in the sand.'),
      say(SD, 'Blow it tonight, cacica. Let the Crown hear who is back.'),
    ],
  },
});

// ---- The sea cave by day (the outline 1.4 and 2.3 A) -------------------------------------------------------------------

const SEACAVE_WEED: DialogueScript = script('seacave_weed', {
  start: { lines: [nar('A curtain of weed hangs over a crack in the rock. Cold air breathes through it.')] },
});

const SEACAVE_WAR: DialogueScript = script('seacave_war', {
  start: { lines: [nar('By day the tide is half out. The tunnel is ankle-deep, and somewhere ahead paddles knock on wood.')] },
});

const CANOE_GUARD: DialogueScript = script('seacave_canoe_guard_talk', {
  start: { lines: [], next: [{ if: has(ACCEPTED), to: 'pool' }, { to: 'wait' }] },
  wait: { lines: [act([{ do: 'face', actor: 'npc:seacave_canoe_guard', facing: 'player' }], GUARD, 'The canoes go when the conch goes, cacica. Not before.')] },
  pool: {
    lines: [
      act([{ do: 'face', actor: 'npc:seacave_canoe_guard', facing: 'player' }], GUARD, 'The old people\'s pool? Behind the weed. We don\'t go in.'),
      say(GUARD, 'There\'s a dead canoe in it.'),
    ],
  },
});

// ---- The sleeping pool, now (the outline 4.2) ----------------------------------------------------------------------------

const HINT_1 = 'It gets wet and then dry, Gigi. Twice every day, for fifty years. Nothing could sleep like that.';

const WEIR_ENTER: DialogueScript = script('weir_enter', {
  start: {
    lines: [
      nar('Behind the weed the rock opens into a round chamber. A pit takes up most of it. Sea water moves in the bottom.', { fx: 'fade', set: { 'story.weir_entered': true } }),
      act([{ do: 'walk', actor: Y, to: at(WEIR.lipYari.x, WEIR.lipYari.y), facing: 'up' }, look(Y)], '', 'At the bottom lies a long canoe, room for twenty paddles, split from end to end.'),
      say(Y, 'She led the scouts in this.'),
      act([{ do: 'face', actor: 'follower', facing: 'player' }], A, HINT_1, { set: { 'side.canoes_sleep.wreck_seen': true } }),
      act([look(Y)], Y, 'We let the water out of one cave to read an oath. She meant to shut it into another, to keep a canoe. Something stopped her.'),
    ],
  },
});

const PIT_LOOK: DialogueScript = script('pit_look', {
  start: { lines: [], next: [{ if: has(HALF), to: 'half' }, { to: 'wreck' }] },
  wreck: {
    lines: [
      nar('Sea water moves in the bottom of the pit, in and out under a stone gate in its sea wall. The gate stands up on a peg.'),
      nar('At the bottom lies a long canoe, room for twenty paddles, split from end to end.'),
      nar('A post stands in the pit, bored through twice: once at half height, once near the top. The steps down are under a rockfall.'),
    ],
    next: [{ if: not('side.canoes_sleep.wreck_seen'), to: 'hint' }],
  },
  hint: { lines: [act([{ do: 'face', actor: 'follower', facing: 'player' }], A, HINT_1, { set: { 'side.canoes_sleep.wreck_seen': true } })] },
  half: {
    lines: [
      nar('Half a pool, black and still, behind the shut gate.'),
      nar('The canoe lies canted on the rock, sound below the waterline and split above it.'),
    ],
  },
});

// ---- The memory: the first visit, and the rest (the outline 4.3) ----------------------------------------------------------

/** The memory's tide, as the fire tells it. */
const TIDE_LINES: DialogueLine[] = [
  { if: has(HIGH), speaker: '', text: 'Below the lip the pool stands brim-full behind the shut gate, and the canoe rides in it.' },
  { if: all(not(HIGH), has(HALF)), speaker: '', text: 'Inside the shut gate, half a pool. Out in the channel the sea comes and goes.' },
  { if: all(not(HIGH), not(HALF), has(TIDE_HIGH)), speaker: '', text: 'High water. A hand under the lip.' },
  { if: all(not(HIGH), not(HALF), has(TIDE_TURNED)), speaker: '', text: 'The tide is going. The pit is half full.' },
  { if: all(not(HIGH), not(HALF), has(TIDE_IN), not(TIDE_HIGH), not(TIDE_TURNED)), speaker: '', text: 'The tide is making. The pit is half full.' },
  { if: all(not(HIGH), not(HALF), not(TIDE_IN)), speaker: '', text: 'Low water. The pit is wet sand.' },
];

const PASSAGE = at(WEIR.spawn.x, WEIR.spawn.y + 1);
const PASSAGE_2 = at(WEIR.spawn.x + 1, WEIR.spawn.y + 1);

const WEIR_ECHO_ENTER: DialogueScript = script('weir_echo_enter', {
  start: { lines: [], next: [{ if: not('story.weir_echo_seen'), to: 'first' }, { to: 'again' }] },
  first: {
    lines: [
      nar('The same chamber, fifty years ago, at night. Wind in the tunnel, and thunder out at sea. A fire on the shelf. The pit is dry.', { fx: 'flash' }),
      say(AF, 'I\'m holding the door, Gigi.', { fx: 'shake' }),
      act(
        [
          { do: 'enter', actor: 'scout_a', look: 'echo_yaguana', from: PASSAGE, to: WEIR.scoutsPit[0]!, facing: 'up', async: true },
          { do: 'enter', actor: 'scout_b', look: 'echo_yaguana', from: PASSAGE_2, to: WEIR.scoutsPit[1]!, facing: 'up' },
          look('scout_b'),
        ],
        '',
        'Two scouts carry a long canoe in from the passage, down the cut steps, and set her on the sand.',
        { set: { 'echo.canoe_down': true } },
      ),
      act(
        [sync, { do: 'enter', actor: 'caona_w', look: 'caona', from: PASSAGE, to: WEIR.caonaShelf, facing: 'right' }, look('caona_w')],
        CA,
        'Marshal. The Crown burns every hull it finds on a beach. This one they do not find.',
      ),
      say(CA, 'A dugout sleeps wet or she splits. In here the sea comes in through the rock, and goes out again. It will not stay for me.'),
      act([look('scout_a')], SC, 'The gate, Caona. Knock the peg and it drops.'),
      act([look('caona_w')], CA, 'Knock it now and we shut the sea out. Knock it at the top of the tide and whoever is down there drowns knocking.'),
      act([{ do: 'face', actor: 'caona_w', facing: 'player' }], CA, 'You are the one who makes bridges stay down. Make water stay in.', { set: { 'clue.sleep_wet': true } }),
      act(
        [
          { do: 'walk', actor: 'scout_a', to: WEIR.scouts[0]!, facing: 'right', async: true },
          { do: 'walk', actor: 'scout_b', to: WEIR.scouts[1]!, facing: 'left', async: true },
          { do: 'walk', actor: 'caona_w', to: WEIR.caona, facing: 'up' },
          look('player'),
        ],
        '',
        'The scouts climb out of the pit to the fire. Caona goes to the lip, and looks down at her canoe.',
        { set: { 'story.weir_echo_seen': true } },
      ),
      act([sync], P, '(The gate is at the bottom. The tide is at the top. One of us has to be in two places.)'),
    ],
  },
  again: { lines: [nar('The chamber, fifty years ago. The storm is still out at sea.'), ...TIDE_LINES] },
});

// ---- The memory's controls (the outline 4.4 and 4.5) -----------------------------------------------------------------------

const FLOATS_SCRIPT: DialogueScript = script('weir_floats', {
  start: {
    lines: [nar('A string of net floats by the fire: dried gourds, stopped with wax.')],
    choices: [{ text: 'Take them.', next: 'taken', set: { [FLOATS]: true } }, { text: 'Leave them.' }],
  },
  taken: { lines: [act([sync], '', '(Patricio carries the net floats.)')] },
});

const GATE: DialogueScript = script('weir_gate', {
  start: { lines: [], next: [{ if: has(HIGH), to: 'kept' }, { if: has(HALF), to: 'half' }, { to: 'peg' }] },
  peg: {
    lines: [nar('The gate hangs on one peg. A trip line runs from the peg up the post.')],
    choices: [{ text: 'Knock the peg out now.', next: 'refused' }, { text: 'Leave it.' }],
  },
  refused: { lines: [act([look('npc:caona_weir')], CA, 'Shut it now and you shut the sea out, Marshal. She would be dry by morning.'), act([look('player')], '', 'Patricio leaves the peg where it is.')] },
  half: { lines: [nar('The gate is down on half a pool. The haul line at the lip would lift it.')] },
  kept: { lines: [nar('The gate is down. Behind it the sea is shut in, brim to the lip.')] },
});

const POST: DialogueScript = script('weir_post', {
  start: {
    lines: [],
    next: [
      { if: any(has(RIG_LOW), has(RIG_HIGH)), to: 'tied' },
      { if: has(FLOATS), to: 'tie' },
      { to: 'bare' },
    ],
  },
  bare: { lines: [nar('A post in the pit, bored through twice: once at half height, once near the top. A trip line and two holes. Nothing to tie to it.')] },
  tie: {
    lines: [nar('The trip line runs up the post. Floats tied to it pull the peg when the water lifts them as high as their hole.')],
    choices: [
      { text: 'Tie the floats through the low hole.', next: 'tied_low', set: { [RIG_LOW]: true, [RIG_HIGH]: false } },
      { text: 'Tie the floats through the top hole.', next: 'tied_high', set: { [RIG_HIGH]: true, [RIG_LOW]: false } },
      { text: 'Not yet.' },
    ],
  },
  tied_low: { lines: [nar('Patricio ties the floats to the trip line, through the low hole.')] },
  tied_high: { lines: [nar('Patricio ties the floats to the trip line, through the top hole, near the lip.')] },
  tied: {
    lines: [
      { if: has(RIG_LOW), speaker: '', text: 'The floats hang from the trip line, tied through the low hole.' },
      { if: has(RIG_HIGH), speaker: '', text: 'The floats hang from the trip line, tied through the top hole.' },
    ],
    choices: [{ text: 'Untie them.', next: 'untied', set: { [RIG_LOW]: false, [RIG_HIGH]: false } }, { text: 'Leave them.' }],
  },
  untied: { lines: [nar('(Patricio carries the net floats.)')] },
});

const HAUL: DialogueScript = script('weir_haul', {
  start: { lines: [], next: [{ if: has(HIGH), to: 'kept' }, { if: has(HALF), to: 'half' }, { to: 'plain' }] },
  plain: { lines: [nar('A line through a hole in the rock, over the gate, to lift it if it falls.')] },
  half: {
    lines: [nar('The haul line runs over the shut gate.')],
    choices: [{ text: 'Haul the gate up.', next: 'hauled' }, { text: 'Leave it.' }],
  },
  hauled: {
    lines: [
      nar('Patricio hauls on the line.', { set: { [HALF]: false, [RIG_LOW]: false, [RIG_HIGH]: false } }),
      act([sync], '', 'The gate comes up on its line, and the floats with it. The sea moves in and out of the pit again.', { fx: 'shake' }),
      nar('(Patricio carries the net floats.)'),
    ],
  },
  kept: { lines: [nar('The haul line runs over the gate. It holds. Leave it.')] },
});

/** Sitting by the fire: the tide moves on one step (Low, Rising, High, Falling, Low), with the fire's line. */
const FIRE: DialogueScript = script('weir_fire', {
  start: {
    lines: [],
    next: [
      { if: has(HIGH), to: 'kept' },
      { if: not('clue.sleep_wet'), to: 'early' },
      { if: has(TIDE_HIGH), to: 'high' },
      { if: has(TIDE_TURNED), to: 'falling' },
      { if: has(TIDE_IN), to: 'rising' },
      { to: 'low' },
    ],
  },
  early: { lines: [nar('The scouts\' fire on the shelf, out of the wind.')] },
  kept: { lines: [nar('The scouts\' fire on the shelf.'), TIDE_LINES[0]!] },
  low: { lines: [nar('The scouts\' fire on the shelf.'), ...TIDE_LINES.slice(1)], choices: [{ text: 'Sit by the fire till the tide moves.', next: 'to_rising' }, { text: 'Not yet.' }] },
  rising: { lines: [nar('The scouts\' fire on the shelf.'), ...TIDE_LINES.slice(1)], choices: [{ text: 'Sit by the fire till the tide moves.', next: 'to_high' }, { text: 'Not yet.' }] },
  high: { lines: [nar('The scouts\' fire on the shelf.'), ...TIDE_LINES.slice(1)], choices: [{ text: 'Sit by the fire till the tide moves.', next: 'to_falling' }, { text: 'Not yet.' }] },
  falling: { lines: [nar('The scouts\' fire on the shelf.'), ...TIDE_LINES.slice(1)], choices: [{ text: 'Sit by the fire till the tide moves.', next: 'to_low' }, { text: 'Not yet.' }] },
  to_rising: {
    set: { [TIDE_IN]: true, [TIDE_HIGH]: false, [TIDE_TURNED]: false },
    lines: [
      { if: not(HALF), speaker: '', text: 'The fire burns down a hand. Water comes up the channel, in through the gate\'s mouth, and climbs the pit to the low hole.', stage: [sync], fx: 'fade' },
      { if: has(HALF), speaker: '', text: 'The fire burns down a hand. Out in the channel the sea climbs the shut gate. Inside, the half pool lies still.', stage: [sync], fx: 'fade' },
    ],
    next: [{ if: all(has(RIG_LOW), not(HALF)), to: 'trip_low' }],
  },
  to_high: {
    set: { [TIDE_HIGH]: true },
    lines: [
      { if: not(HALF), speaker: '', text: 'The water stands at the top of the post, a hand under the lip. For a few breaths it goes neither way.', stage: [sync], fx: 'fade' },
      { if: has(HALF), speaker: '', text: 'Outside the gate the sea stands a man\'s height above the pool. Inside, half a bed.', stage: [sync], fx: 'fade' },
    ],
    next: [{ if: all(has(RIG_HIGH), not(HALF)), to: 'trip_high' }],
  },
  to_falling: {
    set: { [TIDE_HIGH]: false, [TIDE_TURNED]: true },
    lines: [
      { if: not(HALF), speaker: '', text: 'The water goes out the way it came in.', stage: [sync], fx: 'fade' },
      { if: not(HALF), speaker: CA, text: 'The sea came in and went out again, Marshal. It does that.', stage: [look('npc:caona_weir')] },
      { if: has(HALF), speaker: '', text: 'Out in the channel the sea goes down again. Inside the gate, the half pool stays.', stage: [sync], fx: 'fade' },
    ],
  },
  to_low: {
    set: { [TIDE_IN]: false, [TIDE_TURNED]: false },
    lines: [
      { if: not(HALF), speaker: '', text: 'Low water. The pit is wet sand again.', stage: [sync], fx: 'fade' },
      { if: has(HALF), speaker: '', text: 'Low water outside. Inside the gate, the half pool stays.', stage: [sync], fx: 'fade' },
    ],
  },
  // The low hole: the gate falls at half (the wrong anchor; the haul line lifts it again).
  trip_low: {
    lines: [
      nar('The water reaches the low hole. The floats lift, the line snaps tight, the peg jumps.', { set: { [HALF]: true } }),
      act([sync], '', 'The gate falls on half a pool.', { fx: 'shake' }),
      act([look('npc:echo_weir_scout_a')], SC, 'Shut!'),
      act([look('npc:caona_weir')], CA, 'She is aground at the stern. Half a bed breaks her back.'),
      act([look('player')], '', '(Anchor: this change will last into the present.)'),
      nar('(The haul line at the lip lifts the gate again.)'),
    ],
  },
  // The top hole: the sea shuts its own gate at the top of the tide (the anchor). The scouts and Caona walk to the lip as
  // their places move there (the map's sync walks them).
  trip_high: {
    lines: [
      act([{ do: 'wait', ms: 900 }], '', 'Between the tide coming and the tide going, nothing moves. Then the floats lift the last hand\'s width.'),
      nar('The peg jumps.', { set: { [HIGH]: true, [HALF]: false } }),
      act([sync], '', 'The gate falls, and the sea is shut in, brim to the lip.', { fx: 'shake' }),
      act([{ do: 'mark', actor: 'canoe', at: at(WEIR.canoeLip.x + 1, WEIR.canoeLip.y) }, look('canoe')], '', 'The scouts bring her round to the lip on a line. She rides level, and touches nothing.'),
      act([look('npc:caona_weir')], '', 'Caona takes the conch from her belt, and sets it in the bow under a fold of oiled cloth.'),
      act([look('player')], P, 'You will want that tomorrow.'),
      act([look('npc:caona_weir')], CA, 'Tomorrow I have a Marshal. He is louder.'),
      say(CA, 'If they take me, they take a woman. Not the thing that calls the canoes.'),
      act([look('player')], P, 'And when does she wake?'),
      act([look('npc:caona_weir')], CA, 'When somebody who knows the song comes for her. Good.'),
      ANCHOR_NOTE,
    ],
  },
});

// The memory's people (the outline 4.3: the tempting advice is the second scout's).
const CAONA_WEIR: DialogueScript = script('caona_weir_talk', {
  start: { lines: [], next: [{ if: has(HIGH), to: 'kept' }, { to: 'ask' }] },
  ask: { lines: [say(CA, 'She must float clear of the rock, Marshal. All the way up. Half a bed breaks her back.')] },
  kept: { lines: [say(CA, 'She floats. Somebody will come for her.')] },
});
const SCOUT_A: DialogueScript = script('echo_weir_scout_a_talk', {
  start: { lines: [], next: [{ if: has(HIGH), to: 'kept' }, { to: 'floats' }] },
  floats: { lines: [say(SC, 'Net floats, Marshal. Gourds, stopped with wax. They go up with the water whether you ask them or not.')] },
  kept: { lines: [say(SC, 'I never saw a gate shut itself before.')] },
});
const SCOUT_B: DialogueScript = script('echo_weir_scout_b_talk', {
  start: { lines: [], next: [{ if: has(HIGH), to: 'kept' }, { to: 'low' }] },
  low: { lines: [say(SC, 'The low hole, I\'d say. It shuts sooner. There is a Crown cutter off the point.')] },
  kept: { lines: [say(SC, 'The top hole. I\'d have said the low one. Don\'t tell her.')] },
});

// ---- Back in the present (the outline 4.5 and 2.7: Anissa's hints, the answer last) -----------------------------------------

const HINT_2 = ['Grandfather can only stand at the gate when the pit is empty. But it has to shut when the pit is full.', 'What goes up with the water, all by itself?'];
const HINT_3 = [
  'In the memory, at low water, take the net floats from beside the fire.',
  'Go down the steps and tie them through the top hole of the post.',
  'Then sit by the fire twice, until the tide is all the way in. The floats pull the peg.',
];
const FIRST_HAUL = 'The gate is down on half a pool, Gigi. First the haul line at the lip, to lift it.';

const WEIR_ECHO_RETURN: DialogueScript = script('weir_echo_return', {
  start: {
    lines: [],
    next: [
      { if: all(has(HIGH), not('side.canoes_sleep.pool_seen')), to: 'solved' },
      { if: all(not(HIGH), has(HALF), not('side.canoes_sleep.half_seen')), to: 'half' },
      { if: all(not(HIGH), not('side.canoes_sleep.hint2')), to: 'hint2' },
      { if: not(HIGH), to: 'hint3' },
    ],
  },
  solved: {
    set: { 'side.canoes_sleep.pool_seen': true },
    lines: [
      act([sync, { do: 'mark', actor: 'canoe', at: at(WEIR.canoeLip.x + 1, WEIR.canoeLip.y) }, look('canoe')], '', 'The pit is a pool, brim-full and still, black as the inside of a shell. Against the lip floats a war canoe. Whole.', { fx: 'flash' }),
      act([{ do: 'face', actor: 'follower', facing: 'player' }, look('player')], A, 'It stayed, Gigi.'),
    ],
  },
  half: {
    set: { 'side.canoes_sleep.half_seen': true },
    lines: [
      act([sync], '', 'The pit holds half a pool, black and still. The canoe lies canted on the rock, sound below the waterline and split above it.'),
      act([look(Y)], Y, 'Half of her slept.'),
    ],
    next: [{ if: not('side.canoes_sleep.hint2'), to: 'hint2' }, { to: 'hint3' }],
  },
  hint2: {
    set: { 'side.canoes_sleep.hint2': true },
    lines: [act([{ do: 'face', actor: 'follower', facing: 'player' }, look('player')], A, HINT_2[0]!), say(A, HINT_2[1]!), { if: has(HALF), speaker: A, text: FIRST_HAUL }],
  },
  hint3: {
    set: { 'side.canoes_sleep.hint3': true },
    lines: [
      { if: has(HALF), speaker: A, text: FIRST_HAUL, stage: [{ do: 'face', actor: 'follower', facing: 'player' }, look('player')] },
      act([{ do: 'face', actor: 'follower', facing: 'player' }, look('player')], A, HINT_3[0]!),
      ...HINT_3.slice(1).map((t) => say(A, t)),
    ],
  },
});

// ---- The canoe, and the conch (the outline 4.6) ----------------------------------------------------------------------------

const SLEEPING_CANOE: DialogueScript = script('sleeping_canoe', {
  start: { lines: [], next: [{ if: has('item.caona_conch'), to: 'after' }, { to: 'first' }] },
  first: {
    lines: [
      // Yari goes to the bow, at the canoe's east end (a tile clear of where Gianna stands to look at her).
      act([{ do: 'walk', actor: Y, to: at(WEIR.canoeLip.x + WEIR.canoeLip.w, WEIR.canoeLip.y + 1), facing: 'up' }, look(Y)], Y, 'She is wet to the gunwale. She never dried. Not once.', { mood: 'grief' }),
      nar('Yari folds back the oiled cloth in the bow. Under it lies a conch, cut for blowing, its lip worn smooth by one mouth.'),
      say(Y, 'The songs say Caona could call a canoe to any shore with this. I thought it was only a song.'),
      act([look('player')], G, 'It\'s yours.'),
      act([look(Y)], Y, 'It\'s the canoes\'. I\'ll carry it for them.', { set: { 'item.caona_conch': true, [DONE]: true } }),
      act([{ do: 'face', actor: Y, facing: 'down' }], Y, 'She stays. After the harbor we come back for her, with twenty paddles.'),
      nar('(Yari carries Caona\'s Conch.)'),
    ],
  },
  after: { lines: [nar('Caona\'s canoe, afloat and whole. She has waited fifty years. She can wait for twenty paddles.')] },
});

export const CONCH_DIALOGUE: readonly DialogueScript[] = [
  SHELL_DIVER,
  SEACAVE_WEED,
  SEACAVE_WAR,
  CANOE_GUARD,
  WEIR_ENTER,
  PIT_LOOK,
  WEIR_ECHO_ENTER,
  FLOATS_SCRIPT,
  GATE,
  POST,
  HAUL,
  FIRE,
  CAONA_WEIR,
  SCOUT_A,
  SCOUT_B,
  WEIR_ECHO_RETURN,
  SLEEPING_CANOE,
];
