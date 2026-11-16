// X-4 Where the Canoes Sleep (Chapter 11's secret side quest, Caona's Conch; docs/quest/reviews/2026-11-16-conch-outline.md
// section 5.1, built Nov 16): the shell diver at the hill camp by day, found and never pointed to; the weed in the sea cave;
// the sleeping pool now and fifty years ago, its tide moved only by sitting at the fire; the floats through the top hole
// (the anchor), the wrong ways and what each leaves; the reward paid once; the quest closed with the chapter; the conch's
// lines at the tide call, the whistle and the caney; the stale escape canoe gone after Chapter 2; and the route untouched.
// (The puzzle's solution and cheats are replayed in tests/puzzles.test.ts, puzzle `xaragua_weir`; the canoes' volley in
// battle is tests/war.test.ts.)

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTENT } from '../src/data/content.ts';
import { PUZZLES } from '../src/data/puzzles.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { CAMP, SEACAVE, WEIR } from '../src/data/war.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { isWalkable } from '../src/engine/grid.ts';
import { mysteryQuests, sideNudges } from '../src/engine/guide.ts';
import { hidesEachOther } from '../src/engine/partyPlacement.ts';
import { gold, itemCount, localPillar, sharedXp } from '../src/engine/rpg.ts';
import { questClosed, settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { pendingShowcases } from '../src/engine/showcase.ts';
import { parseRoute, type Sim } from '../src/engine/sim.ts';
import { stageCues } from '../src/engine/stage.ts';
import { activeNpcs, activeObjects, isOpen } from '../src/engine/world.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps, newGameSim, puzzleFiles, puzzleSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const camp = maps['xaragua-camp']!;
const seacave = maps['xaragua-seacave']!;
const weir = maps['xaragua-weir']!;
const quest = SIDE_QUESTS.find((q) => q.id === 'canoes_sleep')!;
const puzzle = PUZZLES.find((p) => p.id === 'xaragua_weir')!;
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { flags: FlagSnapshot }>;

const ACCEPTED = 'side.canoes_sleep.accepted';
const QUEST_FLAG = /^(side\.canoes_sleep\.|anchor\.weir_|item\.caona_conch$|war\.conch_called$|story\.weir_|story\.shell_diver_asked$|clue\.sleep_wet$)/;

/** The route's flags at each marker it passes (one walk of the route for the whole file). */
const AT: Record<string, FlagSnapshot> = (() => {
  const out: Record<string, FlagSnapshot> = {};
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark') out[item.name] = sim.logic.state.flags.snapshot();
    sim.run([item]);
  }
  out['the-end'] = sim.logic.state.flags.snapshot();
  return out;
})();

const flagsOf = (snap: FlagSnapshot) => {
  const f = new FlagStore();
  f.load(snap);
  return f;
};

/** Plays a conversation to its end, taking the choices that start with each pick in turn; returns the lines shown. */
function talk(flags: FlagStore, id: string, picks: string[] = []): string[] {
  const r = new DialogueRunner(CONTENT.dialogue[id]!, CONTENT.speakers, flags);
  const out: string[] = [];
  for (let v = r.view(), i = 0; v.kind !== 'end' && i < 200; v = r.view(), i++) {
    out.push(v.text);
    if (v.kind === 'choice') {
      const want = picks.shift();
      const c = v.choices.find((x) => want !== undefined && x.text.startsWith(want));
      if (!c) throw new Error(`${id}: no choice "${want}" in ${v.choices.map((x) => x.text).join(' / ')}`);
      r.choose(c.index);
    } else r.advance();
  }
  expect(picks, `${id}: unused picks`).toEqual([]);
  return out;
}

/** Reads the dialogue the sim is in to its end (first choice each time), returning what it showed. */
function readOut(sim: Sim): string[] {
  const out: string[] = [];
  for (let i = 0; i < 300 && sim.logic.mode === 'dialogue'; i++) {
    const v = sim.logic.view();
    if (v.kind === 'end') break;
    out.push(v.text);
    sim.press('confirm');
  }
  return out;
}

const DAY = AT['war-camp']!;
const solution = puzzleFiles('xaragua_weir').solution;
const cheats = puzzleFiles('xaragua_weir').cheats;

describe('X-4: found, not pointed to (the outline 5.1, 1 and 2)', () => {
  it('is a secret quest: no mystery entry, no nudge, nothing to show before it is taken', () => {
    expect(quest.secret).toBe(true);
    expect(quest.nudge).toBeUndefined();
    expect(quest.available).toBeUndefined();
    const f = flagsOf(DAY);
    expect(mysteryQuests(SIDE_QUESTS, f).map((q) => q.id)).not.toContain('canoes_sleep');
    expect(sideNudges(SIDE_QUESTS, f).join(' ')).not.toMatch(/canoe|weed|shell/i);
    expect(sideQuestStatus(f, quest)).toBe('unknown');
  });

  it('the shell diver sits at the camp by day on a free, open tile, hiding nobody, and is gone once the tide is called', () => {
    const f = flagsOf(DAY);
    const people = activeNpcs(camp, 'present', f);
    const her = people.find((n) => n.npc === 'shell_diver_war')!;
    expect(her.pos).toEqual(CAMP.shellDiver);
    expect(isOpen(camp, 'present', { x: her.pos.x + 1, y: her.pos.y }, f)).toBe(true);
    for (const n of people.filter((p) => p !== her)) {
      expect(hidesEachOther(n.pos, her.pos) || (n.pos.x === her.pos.x && n.pos.y === her.pos.y), n.npc).toBe(false);
    }
    expect(activeNpcs(camp, 'present', flagsOf(AT['war-village']!)).some((n) => n.npc === 'shell_diver_war')).toBe(false);
  });

  it('declining leaves her offer open; taking it puts it in the Quests page', () => {
    const f = flagsOf(DAY);
    expect(talk(f, 'shell_diver_war_talk', ['After the harbor']).join(' ')).toContain('Caona\'s own canoe');
    expect(f.isSet(ACCEPTED)).toBe(false);
    expect(talk(f, 'shell_diver_war_talk', ['Until the tide']).join(' ')).toContain('straight on where it turns');
    expect(sideQuestStatus(f, quest)).toBe('active');
    expect(talk(f, 'shell_diver_war_talk').join(' ')).toContain('Go while the tide is half');
  });
});

describe('X-4: the weed, the sea cave by day, and the stale canoe (the outline 1.4 and 2.3 A)', () => {
  it('the weed is a closed door until the quest is taken, in Chapter 11 and on Chapter 2\'s escape night', () => {
    const door = seacave.doors.find((d) => d.id === 'seacave_weir')!;
    expect(door.closed).toBe('seacave_weed');
    expect(door.targetMap).toBe('xaragua-weir');
    for (const snap of [DAY, AT['seacave']!]) {
      const f = flagsOf(snap);
      expect(f.isSet(ACCEPTED)).toBe(false);
      expect(activeObjects(seacave, 'present', f).some((o) => o.id === 'seacave_weed')).toBe(true);
    }
    expect(talk(flagsOf(DAY), 'seacave_weed').join(' ')).toContain('Cold air breathes through it');
    const open = flagsOf({ ...DAY, [ACCEPTED]: true });
    expect(activeObjects(seacave, 'present', open).some((o) => o.id === 'seacave_weed')).toBe(false);
  });

  it('after the escape the hidden canoe is gone from the ledge; on the escape night it is there and starts the Thorne fight', () => {
    expect(activeObjects(seacave, 'present', flagsOf(DAY)).some((o) => o.id === 'escape_canoe')).toBe(false);
    const night = flagsOf(AT['seacave']!);
    expect(activeObjects(seacave, 'present', night).some((o) => o.id === 'escape_canoe')).toBe(true);
    const lines = talk(night, 'escape_canoe').join(' ');
    expect(lines).toContain('Still here');
    expect(night.isSet('story.thorne_ambush')).toBe(true);
    // By day in Chapter 11: the day's canoes in the inlet and the scout who keeps them.
    const day = flagsOf(DAY);
    expect(activeObjects(seacave, 'present', day).filter((o) => o.id.startsWith('seacave_dugout_'))).toHaveLength(SEACAVE.dugouts.length);
    expect(activeNpcs(seacave, 'present', day).map((n) => n.npc)).toContain('seacave_canoe_guard');
    expect(talk(day, 'seacave_canoe_guard_talk').join(' ')).toContain('when the conch goes');
  });
});

describe('X-4: the sleeping pool (the outline 2.3 B to 2.6)', () => {
  it('solvable from the camp: the weed, the chamber, the memory, the floats through the top hole, the fire twice, the conch', () => {
    const f = flagsOf(DAY);
    // Whatever the route left unpaid is paid first, so the difference below is this quest's alone.
    settleRewards(f, RPG, SIDE_QUESTS);
    talk(f, 'shell_diver_war_talk', ['Until the tide']);
    // Down the mountain and along the beach to the cave (a save there, as the browser loads one).
    const sim = puzzleSim({ ...puzzle, map: 'xaragua-seacave', spawn: 'seacave', flags: f.snapshot() }, maps);
    expect(readOut(sim).join(' ')).toContain('By day the tide is half out');
    const before = { gold: gold(f, RPG), xp: sharedXp(f, RPG), influence: localPillar(f, RPG, 'influence', 'xaragua') };
    sim.run(['goto 4,7', 'up']);
    expect(sim.logic.state.player.mapId).toBe('xaragua-weir');
    expect(readOut(sim).join(' ')).toContain('split from end to end');
    sim.run(['up', ...solution.slice(1)]);
    const g = sim.logic.state.flags;
    expect(g.isSet('anchor.weir_high')).toBe(true);
    expect(g.isSet('anchor.weir_half')).toBe(false);
    expect(itemCount(g, 'caona_conch')).toBe(1);
    expect(g.isSet('side.canoes_sleep.done')).toBe(true);
    settleRewards(g, RPG, SIDE_QUESTS);
    expect(gold(g, RPG) - before.gold).toBe(150);
    expect(sharedXp(g, RPG) - before.xp).toBe(60);
    expect(localPillar(g, RPG, 'influence', 'xaragua') - before.influence).toBe(2);
    expect(sideQuestStatus(g, quest)).toBe('done');
    // The legendary card shows once.
    expect(pendingShowcases(g, RPG).map((i) => i.id)).toContain('caona_conch');
  });

  it('the solution from a fresh save solves it, and no cheat does', () => {
    const sim = puzzleSim(puzzle, maps);
    sim.run(solution);
    expect(sim.logic.state.flags.isSet('side.canoes_sleep.done')).toBe(true);
    for (const [name, inputs] of Object.entries(cheats)) {
      const s = puzzleSim(puzzle, maps);
      s.run(inputs);
      expect(s.logic.state.flags.isSet('side.canoes_sleep.done'), name).toBe(false);
      expect(s.logic.state.flags.isSet('anchor.weir_high'), name).toBe(false);
    }
  });

  it('the peg by hand at low water: Caona stops him, nothing changes', () => {
    const f = flagsOf({ ...puzzle.flags, 'story.weir_echo_seen': true, 'clue.sleep_wet': true });
    expect(talk(f, 'weir_gate', ['Knock']).join(' ')).toContain('She would be dry by morning');
    expect(Object.keys(f.snapshot()).filter((k) => k.startsWith('anchor.') && f.isSet(k))).toEqual([]);
  });

  it('the low hole, one sit: half a pool now; the haul line in the memory lifts it; the right way still solves after', () => {
    const f = flagsOf({ ...puzzle.flags, 'story.weir_echo_seen': true, 'clue.sleep_wet': true, 'echo.floats': true });
    talk(f, 'weir_post', ['Tie the floats through the low']);
    expect(talk(f, 'weir_fire', ['Sit']).join(' ')).toContain('The gate falls on half a pool');
    expect(f.isSet('anchor.weir_half')).toBe(true);
    // Now: the half pool, the gate down, no canoe at the lip.
    const now = flagsOf({ ...f.snapshot() });
    const objs = activeObjects(weir, 'present', now).map((o) => o.id);
    expect(objs).toContain('pool_half');
    expect(objs).toContain('weir_gate_shut_old');
    expect(objs).toContain('canoe_wreck');
    expect(objs).not.toContain('sleeping_canoe');
    // Waiting on to High: the sea outside, half a bed inside, and no trip.
    expect(talk(f, 'weir_fire', ['Sit']).join(' ')).toContain('a man\'s height above the pool');
    expect(f.isSet('anchor.weir_high')).toBe(false);
    // The haul line lifts it; round to Low; the top hole; twice to High.
    talk(f, 'weir_haul', ['Haul']);
    expect(f.isSet('anchor.weir_half')).toBe(false);
    talk(f, 'weir_fire', ['Sit']);
    talk(f, 'weir_fire', ['Sit']);
    expect(f.isSet('echo.tide_in')).toBe(false);
    talk(f, 'weir_post', ['Tie the floats through the top']);
    talk(f, 'weir_fire', ['Sit']);
    expect(talk(f, 'weir_fire', ['Sit']).join(' ')).toContain('brim to the lip');
    expect(f.isSet('anchor.weir_high')).toBe(true);
  });

  it('a whole tide with nothing tied: Low again, no anchor, and Caona says so', () => {
    const f = flagsOf({ ...puzzle.flags, 'story.weir_echo_seen': true, 'clue.sleep_wet': true });
    const said: string[] = [];
    for (let i = 0; i < 4; i++) said.push(...talk(f, 'weir_fire', ['Sit']));
    expect(said.join(' ')).toContain('It does that');
    for (const k of ['echo.tide_in', 'echo.tide_high', 'echo.tide_turned', 'anchor.weir_half', 'anchor.weir_high']) expect(f.isSet(k), k).toBe(false);
  });

  it('leaving the memory with the floats tied wipes every echo flag: the next visit starts at Low with the floats by the fire', () => {
    const sim = puzzleSim(puzzle, maps);
    sim.run(solution.slice(0, 20));
    const f = sim.logic.state.flags;
    expect(f.isSet('echo.rig_high')).toBe(true);
    sim.run(['down*2', 'left*6', 'down*3', 'right*9', 'up*2', 'echo', 'skip']);
    expect(sim.logic.state.player.era).toBe('present');
    expect(Object.keys(f.snapshot()).filter((k) => k.startsWith('echo.') && f.isSet(k))).toEqual([]);
    sim.run(['echo']);
    expect(readOut(sim).join(' ')).toContain('Low water. The pit is wet sand.');
    expect(activeObjects(weir, 'echo', f).some((o) => o.id === 'weir_floats')).toBe(true);
  });

  it('the post\'s tile in the pit is dry sand at Low only; the shelf and the Echo zone are never under water', () => {
    const base = { ...puzzle.flags, 'story.weir_echo_seen': true };
    const at = (snap: FlagSnapshot) => isOpen(weir, 'echo', WEIR.postStand, flagsOf({ ...base, ...snap }));
    expect(at({})).toBe(true);
    expect(at({ 'echo.tide_in': true })).toBe(false);
    expect(at({ 'echo.tide_in': true, 'echo.tide_high': true })).toBe(false);
    expect(at({ 'echo.tide_in': true, 'echo.tide_turned': true })).toBe(false);
    expect(at({ 'anchor.weir_half': true })).toBe(false);
    expect(at({ 'anchor.weir_high': true })).toBe(false);
    for (const snap of [{}, { 'echo.tide_in': true, 'echo.tide_high': true }, { 'anchor.weir_high': true }] as FlagSnapshot[]) {
      for (let x = WEIR.zone.x; x < WEIR.zone.x + WEIR.zone.w; x++) {
        expect(isOpen(weir, 'echo', { x, y: WEIR.zone.y }, flagsOf({ ...base, ...snap }))).toBe(true);
        expect(isOpen(weir, 'present', { x, y: WEIR.zone.y }, flagsOf({ ...base, ...snap }))).toBe(true);
      }
    }
    // Now, the pit is water and the steps are under the rockfall.
    expect(isWalkable(weir, 'present', WEIR.steps)).toBe(false);
    expect(isWalkable(weir, 'echo', WEIR.steps)).toBe(true);
  });

  it('Anissa\'s hints come in place: the pit, then the first return, then the answer on the second', () => {
    const sim = puzzleSim(puzzle, maps);
    const entry = readOut(sim).join(' ');
    expect(entry).toContain('Twice every day, for fifty years');
    sim.run(['up*2', 'right*11', 'up', 'echo', 'skip', 'echo']);
    expect(readOut(sim).join(' ')).toContain('What goes up with the water');
    sim.run(['echo', 'skip', 'echo']);
    expect(readOut(sim).join(' ')).toContain('tie them through the top hole');
  });

  it('the reward is paid once: the canoe again, the memory again and a reloaded save pay nothing more', () => {
    const sim = puzzleSim(puzzle, maps);
    sim.run(solution);
    const f = sim.logic.state.flags;
    settleRewards(f, RPG, SIDE_QUESTS);
    const paid = { gold: gold(f, RPG), xp: sharedXp(f, RPG) };
    sim.run(['confirm']);
    expect(readOut(sim).join(' ')).toContain('She can wait for twenty paddles');
    sim.run(['right*8', 'up', 'echo', 'skip', 'echo', 'skip']);
    const again = flagsOf(f.snapshot());
    expect(settleRewards(again, RPG, SIDE_QUESTS)).toEqual([]);
    expect(gold(again, RPG)).toBe(paid.gold);
    expect(sharedXp(again, RPG)).toBe(paid.xp);
    expect(itemCount(again, 'caona_conch')).toBe(1);
  });

  it('it closes with the chapter: taken and unfinished, closed; never taken, never listed', () => {
    const end = AT['chapter11-end']!;
    const taken = flagsOf({ ...end, 'act11.complete': true, [ACCEPTED]: true });
    expect(questClosed(quest, taken)).toBe(true);
    expect(quest.closedText).toContain('still behind the weed');
    const never = flagsOf({ ...end, 'act11.complete': true });
    expect(sideQuestStatus(never, quest)).toBe('unknown');
  });
});

describe('X-4: the conch in the war\'s scenes (the outline 4.7 and 4.8)', () => {
  const linesOf = (id: string, node: string, f: FlagStore) => {
    const n = CONTENT.dialogue[id]!.nodes[node]!;
    return n.lines.filter((l) => !l.if || new DialogueRunner({ id: 'x', start: 's', nodes: { s: { lines: [l] } } }, CONTENT.speakers, f).view().kind !== 'end').map((l) => l.text);
  };

  it('with the conch the tide call, the whistle and the caney gain their lines; without it they read as built', () => {
    const without = flagsOf(AT['war-tide-ready']!);
    const withIt = flagsOf({ ...AT['war-tide-ready']!, 'item.caona_conch': true });
    const plain = linesOf('war_head_runner', 'ready', without);
    const conch = linesOf('war_head_runner', 'ready', withIt);
    expect(conch.length - plain.length).toBe(3);
    expect(conch.join(' ')).toContain('Hers is lower, and it carries further');
    expect(plain.join(' ')).not.toMatch(/Caona/);
    for (const node of ['h_fire', 't_fire', 't_hold', 'hale_fire', 'hale_hold']) {
      const d = Object.values(CONTENT.dialogue).find((s) => s.nodes[node])!;
      expect(linesOf(d.id, node, withIt).length - linesOf(d.id, node, without).length, node).toBe(1);
    }
    const caneyWith = linesOf('war_caney', 'paddle', withIt).join(' ');
    expect(caneyWith).toContain('The paddle is a promise');
    expect(linesOf('war_caney', 'paddle', without).join(' ')).not.toContain('shell');
    // The tide call remembers it played.
    const f = flagsOf({ ...AT['war-tide-ready']!, 'item.caona_conch': true });
    talk(f, 'war_head_runner');
    expect(f.isSet('war.conch_called')).toBe(true);
    expect(f.isSet('story.tide_called')).toBe(true);
  });

  it('every scene of the quest is staged with actors that exist, on open tiles, nobody stopping on another', () => {
    const ids = ['shell_diver_war_talk', 'weir_enter', 'weir_echo_enter', 'weir_fire', 'weir_echo_return', 'sleeping_canoe', 'weir_haul', 'weir_gate'];
    const echoFlags = flagsOf({ ...puzzle.flags, 'story.weir_echo_seen': true });
    for (const id of ids) {
      const cues = stageCues(CONTENT.dialogue[id]!);
      const isWeir = id !== 'shell_diver_war_talk';
      for (const c of cues) {
        if ((c.do === 'enter' || c.do === 'walk') && isWeir) {
          const era = id.startsWith('weir_echo_enter') || id === 'weir_fire' ? 'echo' : 'present';
          expect(isOpen(weir, era, c.to, echoFlags) || (c.to.x === WEIR.scoutsPit[0]!.x && era === 'echo'), `${id} ${c.actor} to ${c.to.x},${c.to.y}`).toBe(true);
        }
      }
    }
    // The first visit: the scouts set the canoe down a row apart from it, side by side; Caona meets Patricio on the shelf.
    const first = stageCues(CONTENT.dialogue.weir_echo_enter!);
    const enters = first.filter((c) => c.do === 'enter');
    expect(enters.map((c) => c.actor)).toEqual(['scout_a', 'scout_b', 'caona_w']);
    for (const c of enters) if (c.do === 'enter') expect(isWalkable(weir, 'echo', c.to), c.actor).toBe(true);
    // Their places after the scene are the map's placements (nobody on anybody, nobody over the Echo zone).
    const people = activeNpcs(weir, 'echo', echoFlags);
    expect(people.map((n) => n.npc).sort()).toEqual(['caona_weir', 'echo_weir_scout_a', 'echo_weir_scout_b']);
    for (const n of people) {
      expect(n.pos.y === WEIR.zone.y && n.pos.x >= WEIR.zone.x && n.pos.x < WEIR.zone.x + WEIR.zone.w, n.npc).toBe(false);
      for (const m of people) if (m !== n) expect(hidesEachOther(n.pos, m.pos), `${n.npc} ${m.npc}`).toBe(false);
    }
    const lip = activeNpcs(weir, 'echo', flagsOf({ ...puzzle.flags, 'anchor.weir_high': true }));
    for (const n of lip) for (const m of lip) if (m !== n) expect(hidesEachOther(n.pos, m.pos), `${n.npc} ${m.npc}`).toBe(false);
  });
});

describe('X-4: skipping it changes nothing on the route (the outline 1.3)', () => {
  it('the route never sets a quest flag, from the camp to the end', () => {
    for (const [mark, snap] of Object.entries(AT)) {
      const set = Object.keys(snap).filter((k) => QUEST_FLAG.test(k) && snap[k] !== false);
      expect(set, mark).toEqual([]);
    }
  });

  it('the chapter starts the dev shortcut loads carry none of it', () => {
    for (const [n, s] of Object.entries(starts)) {
      expect(Object.keys(s.flags).filter((k) => QUEST_FLAG.test(k)), `chapter ${n}`).toEqual([]);
    }
  });
});
