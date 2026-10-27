// Game Over with the goddess (engine/gameOver.ts; the return tile in engine/game.ts): the count and the per-fight
// Grudge, fights meant to be lost, her lines by count, what each press does, the step back off a fight trigger,
// the after-fight marker, a full lost-and-won boar fight in the simulator, the save, and the content rule that
// every story fight has a way back in.

import { describe, expect, it } from 'vitest';
import { GAME_OVER, GRUDGE_MAX, GRUDGE_MAX_BOSS, GRUDGE_STEP } from '../src/config.ts';
import { BATTLES, battleDef } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { GAME_OVER_TEXT, GODDESS_WORDS } from '../src/data/gameOver.ts';
import { RPG } from '../src/data/rpg.ts';
import { RHYTHMS } from '../src/data/rhythms.ts';
import { DEBATES } from '../src/data/debates.ts';
import { battleItems, grudgeCap, settleBattle, type Battle, type BattleDef } from '../src/engine/battle.ts';
import type { GameContent } from '../src/engine/content.ts';
import type { DialogueScript } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { BATTLE_AFTER_FLAG, FIGHT_RETURN_FLAG, GameLogic, type Effect } from '../src/engine/game.ts';
import {
  GAME_OVER_COUNT_FLAG,
  applyGameOverAction,
  clearLosses,
  fallShotAt,
  fightLosses,
  gameOverCount,
  gameOverDurations,
  gameOverFallEnded,
  gameOverPress,
  goddessLines,
  grudgeFor,
  isRandomFight,
  lossesFlag,
  onLastScreen,
  recordLoss,
  type GameOverView,
} from '../src/engine/gameOver.ts';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { Sim } from '../src/engine/sim.ts';
import { applySave, newGame, toSaveData } from '../src/engine/state.ts';
import { parseMap } from '../src/engine/tiledMap.ts';
import { doorArrival } from '../src/engine/grid.ts';
import { loadMaps } from '../tools/sim-setup.ts';
import { makeMap, obj } from './helpers.ts';

const story = BATTLES.pier_marines!;

/** A random ambush def (the first group of a real table). */
function randomFight(): BattleDef {
  const id = Object.keys(CONTENT.encounters ?? {})
    .map((t) => CONTENT.encounters![t]!.groups.filter((g) => g.enemies?.length).map((g) => `encounter:${t}/${g.id}`))
    .flat()[0]!;
  return battleDef(id)!;
}

/** Test only (owner rule: no Chapter 3 content yet): a fight the story means the party to lose. */
const SCRIPTED_LOSS: BattleDef = {
  id: 'test_scripted_loss',
  title: 'Test',
  backdrop: 'cane_road',
  enemies: ['boar'],
  table: 'test',
  group: 'scripted',
  rewards: { xp: 0, gold: 0 },
  meantToLose: { scene: 'patrol_after' },
};

describe('the count and the Grudge', () => {
  it('a loss adds one to the count and to that fight; the Grudge is +10% per loss, never above +30%', () => {
    const flags = new FlagStore();
    expect(gameOverCount(flags)).toBe(0);
    expect(grudgeFor(flags, story)).toBe(0);
    const first = recordLoss(flags, story);
    expect(first).toEqual({ kind: 'gameOver', count: 1, grudge: GRUDGE_STEP });
    expect(flags.get(GAME_OVER_COUNT_FLAG)).toBe(1);
    expect(fightLosses(flags, story)).toBe(1);
    expect(lossesFlag(story)).toBe('gameover.xaragua_story.pier');
    for (let i = 0; i < 5; i++) recordLoss(flags, story);
    expect(gameOverCount(flags)).toBe(6);
    expect(grudgeFor(flags, story)).toBeCloseTo(GRUDGE_MAX);
    // Another fight has its own Grudge.
    expect(grudgeFor(flags, BATTLES.caney_breach!)).toBe(0);
  });

  // Review 1 (Oct 21), finding 1: a chapter's boss lost three times has had the fight.
  it("a boss's Grudge keeps climbing to GRUDGE_MAX_BOSS, and the battle takes all of it", () => {
    const flags = new FlagStore();
    const boss = BATTLES.thorne_blockade!;
    expect(boss.boss).toBe(true);
    for (let i = 0; i < 3; i++) recordLoss(flags, boss);
    expect(grudgeFor(flags, boss)).toBeCloseTo(0.3);
    for (let i = 0; i < 5; i++) recordLoss(flags, boss);
    expect(grudgeFor(flags, boss)).toBeCloseTo(GRUDGE_MAX_BOSS);
    expect(GRUDGE_MAX_BOSS).toBeGreaterThan(GRUDGE_MAX);
    expect(grudgeCap(boss)).toBe(GRUDGE_MAX_BOSS);
    expect(grudgeCap(story)).toBe(GRUDGE_MAX);
    // Only the chapter bosses (Chapter 2: Thorne; Chapter 6: Grimvald; Chapter 7: the Paper Fox; Chapter 8: Seth Dhanraj;
    // Chapter 9: the Hushed; Chapter 11: the house that sailed to the Crown, Thorne at the customs house, Hale, Rael; Chapter
    // 12: the Lord Regent at the Claim. Azzy's Challenge is not a boss: nobody climbs a Grudge against a brother).
    expect(Object.values(BATTLES).filter((b) => b.boss).map((b) => b.id)).toEqual([
      'harbor_flank_skarragol', 'harbor_flank_kuroshi', 'harbor_flank_jwaladesh', 'harbor_flank_al_doria', 'customs_thorne', 'flagship_hale',
      'pier_rael', 'claim_regent', 'mangrove_crew', 'assize_hushed', 'oil_store_dhanraj', 'fjord_grimvald', 'file_house_fox', 'thorne_blockade',
    ]);
  });

  it('a win clears that fight\'s losses (and so its Grudge); the count stays', () => {
    const flags = new FlagStore();
    recordLoss(flags, story);
    recordLoss(flags, story);
    clearLosses(flags, story);
    expect(grudgeFor(flags, story)).toBe(0);
    expect(flags.has(lossesFlag(story))).toBe(false);
    expect(gameOverCount(flags)).toBe(2);
  });

  it('a random ambush counts a Game Over but gives no Grudge (owner decision, Oct 19)', () => {
    const ambush = randomFight();
    expect(isRandomFight(ambush)).toBe(true);
    const flags = new FlagStore();
    expect(recordLoss(flags, ambush)).toEqual({ kind: 'gameOver', count: 1, grudge: 0 });
    expect(flags.has(lossesFlag(ambush))).toBe(false);
    expect(grudgeFor(flags, ambush)).toBe(0);
  });
});

describe('fights meant to be lost', () => {
  it('never show the goddess, never count and give no Grudge; their scene plays instead', () => {
    const flags = new FlagStore();
    expect(recordLoss(flags, SCRIPTED_LOSS)).toEqual({ kind: 'scripted', scene: 'patrol_after' });
    expect(gameOverCount(flags)).toBe(0);
    expect(flags.has(lossesFlag(SCRIPTED_LOSS))).toBe(false);
    expect(grudgeFor(flags, SCRIPTED_LOSS)).toBe(0);
  });

  it('a win sets no won flag (the story goes on with the scene either way)', () => {
    const flags = new FlagStore();
    settleBattle(flags, RPG, { def: SCRIPTED_LOSS, items: battleItems(flags, RPG), outcome: 'won', goldSpent: 0, party: [] } as unknown as Battle);
    expect(flags.has('encounter.test.scripted.won')).toBe(false);
  });

  it('every one names a scene that exists and none is a random ambush', () => {
    const marked = [...Object.values(BATTLES), SCRIPTED_LOSS].filter((b) => b.meantToLose);
    expect(marked.length).toBeGreaterThan(0);
    for (const b of marked) {
      expect(CONTENT.dialogue[b.meantToLose!.scene], b.id).toBeDefined();
      expect(isRandomFight(b), b.id).toBe(false);
    }
    // Chapters 1 and 2 have none; Chapter 3 has the Trial of Blades; Chapter 8 the duel in the yard (a sparring match
    // that ends either way, the second review's 3.9).
    expect(Object.values(BATTLES).filter((b) => b.meantToLose).map((b) => b.id)).toEqual(['duel_yard_vikram', 'rael_trial']);
  });

  it('after one, the game logic plays its scene whether the party fell or won', () => {
    const sim = boarSim();
    expect(sim.logic.battleOver(false, 'patrol_after').some((e) => e.kind === 'dialogue')).toBe(true);
    expect(sim.logic.dialogueId).toBe('patrol_after');
  });
});

describe('her words', () => {
  it('the first time, she introduces herself: the six approved lines, Gianna asking about her mother', () => {
    const lines = goddessLines(1, GODDESS_WORDS);
    expect(lines.map((l) => l.text)).toEqual([
      'Rise, child of the Limyè line. You do not know me, but I have known you since your first breath.',
      'I am Elodie. I wove this realm, and I remember all of it.',
      'Elodie? Like my mother?',
      'Your grandmother gave her my name the night she was born, and asked me to watch over her. I have. I watch over you too.',
      'I do not rule this world. I only remember it. So I will give you back the moment before.',
      'Go. Walk, mend, make ready. The fight will wait for you.',
    ]);
    expect(lines.map((l) => l.speaker)).toEqual(['goddess', 'goddess', 'gianna', 'goddess', 'goddess', 'goddess']);
  });

  it('after that, her first line by the count (always with the number), then the closing line', () => {
    expect(goddessLines(2, GODDESS_WORDS).map((l) => l.text)).toEqual([
      'I have caught you 2 times now. I remember every one.',
      'Go. Walk, mend, make ready. The fight will wait for you.',
    ]);
    expect(goddessLines(9, GODDESS_WORDS)[0]!.text).toBe('I have caught you 9 times now. I remember every one.');
    expect(GAME_OVER.manyFrom).toBe(10);
    expect(goddessLines(10, GODDESS_WORDS)[0]!.text).toBe('10 times. I remember every fall, and every time you stood again.');
    for (const n of [2, 9, 10, 50]) {
      const lines = goddessLines(n, GODDESS_WORDS);
      expect(lines[0]!.text).toContain(String(n));
      expect(lines.every((l) => l.speaker === 'goddess')).toBe(true);
    }
  });

  it('her name is never a label: it is only spoken in the first meeting', () => {
    for (const t of Object.values(GAME_OVER_TEXT)) expect(t).not.toMatch(/Elodie/);
    for (const n of [2, 10]) for (const l of goddessLines(n, GODDESS_WORDS)) expect(l.text).not.toMatch(/Elodie/);
    expect(goddessLines(1, GODDESS_WORDS).filter((l) => l.text.includes('Elodie')).length).toBe(2);
  });
});

describe('the screen', () => {
  const view = (v: Partial<GameOverView>): GameOverView => ({ phase: 'words', line: 0, lines: 6, typing: false, ...v });

  it('during the fall, B skips to the last screen and A or a tap does nothing', () => {
    const fall = view({ phase: 'fall' });
    expect(gameOverPress(fall, 'confirm')).toEqual({ kind: 'none' });
    expect(gameOverPress(fall, 'tap')).toEqual({ kind: 'none' });
    expect(gameOverPress(fall, 'cancel')).toEqual({ kind: 'skip' });
    const skipped = applyGameOverAction(fall, { kind: 'skip' });
    expect(skipped).toEqual(view({ line: 5 }));
    expect(onLastScreen(skipped)).toBe(true);
  });

  it('reading: A or a tap finishes a typing line, then moves on; no line moves on by itself', () => {
    expect(gameOverPress(view({ typing: true }), 'tap')).toEqual({ kind: 'finish' });
    expect(gameOverPress(view({ typing: true }), 'confirm')).toEqual({ kind: 'finish' });
    expect(gameOverPress(view({}), 'tap')).toEqual({ kind: 'next' });
    expect(applyGameOverAction(view({ line: 2 }), { kind: 'next' })).toEqual(view({ line: 3, typing: true }));
    // B jumps past the lines to the last screen (the count is never skipped past).
    expect(gameOverPress(view({ line: 1 }), 'cancel')).toEqual({ kind: 'skip' });
    expect(gameOverPress(view({ line: 5, typing: true }), 'cancel')).toEqual({ kind: 'skip' });
    // The fall over: the first line types out.
    expect(gameOverFallEnded(view({ phase: 'fall' }))).toEqual(view({ typing: true }));
  });

  it('on the last screen A rises; a stray tap or B does nothing; rising takes no presses', () => {
    const last = view({ line: 5 });
    expect(gameOverPress(last, 'confirm')).toEqual({ kind: 'rise' });
    expect(gameOverPress(last, 'tap')).toEqual({ kind: 'none' });
    expect(gameOverPress(last, 'cancel')).toEqual({ kind: 'none' });
    expect(applyGameOverAction(last, { kind: 'rise' }).phase).toBe('rise');
    for (const p of ['confirm', 'cancel', 'tap'] as const) {
      expect(gameOverPress(view({ phase: 'rise' }), p)).toEqual({ kind: 'none' });
      expect(gameOverPress(view({ phase: 'done' }), p)).toEqual({ kind: 'none' });
    }
  });

  it('follows the storyboard\'s clock, and reduced motion is shorter plain fades', () => {
    expect(GAME_OVER.fallS).toBe(6);
    expect(GAME_OVER.loopS).toBe(4);
    expect(GAME_OVER.riseS).toBe(1.5);
    expect(fallShotAt(0).shot).toBe('dark');
    expect(fallShotAt(1.2).shot).toBe('dusk');
    expect(fallShotAt(1.5).shot).toBe('letters');
    expect(fallShotAt(3.2).shot).toBe('unravel');
    expect(fallShotAt(4.5)).toEqual({ shot: 'loom', k: 0 });
    expect(fallShotAt(6).k).toBe(1);
    expect(gameOverDurations(false)).toEqual({ fallS: 6, riseS: 1.5 });
    const r = gameOverDurations(true);
    expect(r.fallS).toBeLessThan(6);
    expect(r.riseS).toBeLessThan(1.5);
  });
});

// ---- Where the party goes back to ------------------------------------------------------------------

const fightScript: DialogueScript = { id: 'fight', start: 'a', nodes: { a: { lines: [{ text: 'A boar!', set: { 'battle.next': 'boar', 'gate.shut': true } }] } } };
const testContent: GameContent = {
  npcs: { guard: { id: 'guard', name: 'Guard', look: 'guard', dialogue: 'fight' } } as unknown as GameContent['npcs'],
  dialogue: { fight: fightScript },
  speakers: {},
  cards: [],
  messages: { noZone: '', locked: '', blocked: '', doorInEcho: '', enterEcho: '', leaveEcho: '' },
};

/**
 * A 7 x 3 field: a fight line down column 4 that fires every time; 3,1 is another trigger (a pressure plate,
 * no dialogue); a guard appears at 3,0 once the fight has started (`gate.shut`).
 */
function lineLogic(): GameLogic {
  const map = parseMap(
    't',
    makeMap({
      present: ['.......', '.......', '.......'],
      objects: {
        spawns: [obj('start', 0, 1)],
        triggers: [obj('line', 4, 0, { dialogue: 'fight' }, 1, 3), obj('plate', 3, 1, {})],
        npcs: [obj('guard', 3, 0, { if: 'gate.shut' })],
      },
    }),
  );
  return new GameLogic({ t: map }, testContent, newGame(map, 'start'), 1);
}

function walkTo(g: GameLogic, steps: ('right' | 'left' | 'up' | 'down' | 'up-right' | 'down-right')[]): Effect[] {
  let out: Effect[] = [];
  for (const d of steps) {
    const a = g.tryStep(d);
    if (!a.ok) throw new Error(`blocked going ${d}`);
    out = g.finishStep(a.to);
  }
  return out;
}

/** Read the fight's dialogue to its end; returns the battle it starts. */
function readToFight(g: GameLogic): string | undefined {
  let effects: Effect[] = [];
  for (let i = 0; i < 20 && g.mode === 'dialogue'; i++) effects = g.advance();
  return effects.find((e): e is Extract<Effect, { kind: 'battle' }> => e.kind === 'battle')?.battle;
}

describe('the moment before the fight', () => {
  it('off a fight trigger, the party steps back to the tile it came from; walking on fights again', () => {
    const g = lineLogic();
    walkTo(g, ['down', 'right', 'right', 'right', 'right']);
    // 0,2 -> 1,2 -> 2,2 -> 3,2 -> 4,2: the line.
    expect(g.mode).toBe('dialogue');
    expect(readToFight(g)).toBe('boar');
    expect(g.state.flags.get(FIGHT_RETURN_FLAG)).toBe('t/3,2');
    g.riseFromFight();
    expect(g.state.player.pos).toEqual({ x: 3, y: 2 });
    expect(g.mode).toBe('field');
    expect(g.state.flags.has(FIGHT_RETURN_FLAG)).toBe(false);
    expect(g.wouldFire(g.state.player.pos)).toBe(false);
    walkTo(g, ['right']);
    expect(g.mode).toBe('dialogue');
  });

  it('stays put when the tile behind is taken (a person now stands there) or is another trigger', () => {
    // Up the top row: 3,0 is where the guard appears once the fight starts.
    const g = lineLogic();
    walkTo(g, ['up-right', 'right', 'right']);
    expect(g.state.player.pos).toEqual({ x: 3, y: 0 });
    walkTo(g, ['right']);
    readToFight(g);
    expect(g.state.flags.get(FIGHT_RETURN_FLAG)).toBe('t/4,0');
    // Across the middle row, over the pressure plate at 3,1 onto the line: the plate is no place to stand.
    const h = lineLogic();
    walkTo(h, ['right', 'right', 'right']);
    expect(h.state.player.pos).toEqual({ x: 3, y: 1 });
    expect(h.mode).toBe('field');
    walkTo(h, ['right']);
    readToFight(h);
    expect(h.state.flags.get(FIGHT_RETURN_FLAG)).toBe('t/4,1');
  });

  it('a fight from a conversation leaves the party where it stood', () => {
    const g = lineLogic();
    g.state.flags.set('gate.shut', true);
    walkTo(g, ['up-right', 'right']);
    expect(g.state.player.pos).toEqual({ x: 2, y: 0 });
    // Facing the guard at 3,0.
    expect(g.interact().some((e) => e.kind === 'talk')).toBe(true);
    expect(readToFight(g)).toBe('boar');
    expect(g.state.flags.get(FIGHT_RETURN_FLAG)).toBe('t/2,0');
  });

  it('clears the after-fight scene on a loss and on a load, and a load steps back off the line', () => {
    const maps = loadMaps();
    const state = newGame(maps['zetwal-road']!, 'road');
    state.player.pos = { x: 9, y: 12 };
    state.flags.load({ [FIGHT_RETURN_FLAG]: 'zetwal-road/8,12', [BATTLE_AFTER_FLAG]: 'pier_after', [GAME_OVER_COUNT_FLAG]: 3 });
    const code = encodeSave(toSaveData(state, 0));
    const decoded = decodeSave(code);
    if (!decoded.ok) throw new Error(decoded.error);
    const loaded = newGame(maps['zetwal-road']!, 'road');
    applySave(loaded, decoded.data);
    const g = new GameLogic(maps, CONTENT, loaded);
    g.reset();
    expect(g.state.player.pos).toEqual({ x: 8, y: 12 });
    expect(g.state.flags.has(BATTLE_AFTER_FLAG)).toBe(false);
    expect(g.state.flags.has(FIGHT_RETURN_FLAG)).toBe(false);
    // The count rides in the save (a save code carries it to another device).
    expect(gameOverCount(g.state.flags)).toBe(3);
  });
});

// ---- A whole lost-and-won boar fight in the simulator ---------------------------------------------------

/** On the Cane Road by the gate, with Anissa, Yari asked: the boar charges at the line (x 9). */
function boarSim(): Sim {
  const maps = loadMaps();
  const state = newGame(maps['zetwal-road']!, 'road');
  state.flags.load({ 'party.anissa': true, 'story.yari_asked': true });
  return new Sim(new GameLogic(maps, CONTENT, state));
}

describe('losing the boar and coming back', () => {
  it('Rise puts the party one step west of the line; the boar charges only when they walk on; the retry has +10%; a win clears it', () => {
    const sim = boarSim();
    const flags = sim.logic.state.flags;
    const seen: { battle: string; grudge: number }[] = [];
    let lose = true;
    sim.onBattle = (id) => {
      const def = battleDef(id)!;
      seen.push({ battle: id, grudge: grudgeFor(flags, def) });
      if (lose) {
        expect(recordLoss(flags, def).kind).toBe('gameOver');
        sim.logic.riseFromFight();
        return [];
      }
      settleBattle(flags, RPG, { def, items: battleItems(flags, RPG), outcome: 'won', goldSpent: 0, party: [] } as unknown as Battle);
      clearLosses(flags, def);
      return sim.logic.battleOver(true);
    };
    const start = sim.logic.state.player.pos;
    expect(start).toEqual({ x: 2, y: 12 });
    for (let x = start.x; x < 9; x++) sim.press('right');
    expect(sim.logic.state.player.pos).toEqual({ x: 9, y: 12 });
    sim.press('skip');
    expect(seen).toEqual([{ battle: 'intro_boar', grudge: 0 }]);
    // Back before the fight, one step back the way they came, free on the map.
    expect(sim.logic.mode).toBe('field');
    expect(sim.logic.state.player.pos).toEqual({ x: 8, y: 12 });
    expect(gameOverCount(flags)).toBe(1);
    expect(flags.get('gameover.wilds.boar')).toBe(1);
    expect(flags.has(BATTLE_AFTER_FLAG)).toBe(false);
    // Free to walk away west and come back: nothing fires off the line.
    sim.press('left');
    sim.press('right');
    expect(sim.logic.mode).toBe('field');
    expect(seen.length).toBe(1);
    // Walk on: the boar charges again ("The boar is back"), with the Grudge.
    lose = false;
    sim.press('right');
    expect(sim.logic.mode).toBe('dialogue');
    expect(sim.logic.view()).toMatchObject({ text: 'The boar is back, snorting, blocking the road.' });
    sim.press('skip');
    expect(seen.at(-1)).toEqual({ battle: 'intro_boar', grudge: GRUDGE_STEP });
    expect(flags.get('encounter.wilds.boar.won')).toBe(true);
    expect(flags.has('gameover.wilds.boar')).toBe(false);
    expect(gameOverCount(flags)).toBe(1);
    expect(flags.has(FIGHT_RETURN_FLAG)).toBe(false);
  });
});

// ---- Content: every fight can be fought again ------------------------------------------------------

/** Every `battle.next` a dialogue script can set (in any node, line or choice). */
function battlesStarted(script: unknown): Set<string> {
  const out = new Set<string>();
  const walk = (v: unknown): void => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) return v.forEach(walk);
    const o = v as Record<string, unknown>;
    const set = o.set as Record<string, unknown> | undefined;
    if (set && typeof set['battle.next'] === 'string') out.add(set['battle.next'] as string);
    for (const x of Object.values(o)) walk(x);
  };
  walk(script);
  return out;
}

describe('every story fight has a way back in', () => {
  const maps = loadMaps();
  const starts = (dialogue: string | undefined) => (dialogue ? battlesStarted(CONTENT.dialogue[dialogue]) : new Set<string>());

  it('each fight a conversation starts is meant to be lost, or has a foe on a map or a trigger that starts it again', () => {
    const started = new Set<string>();
    for (const d of Object.values(CONTENT.dialogue)) for (const b of battlesStarted(d)) started.add(b);
    expect([...started].sort()).toEqual([
      'argue_dyer', 'argue_spice', 'argue_wrestler', 'assize_hushed', 'bog_chapel_cell', 'camp_lookouts', 'caney_breach', 'caona_stand', 'claim_azzy', 'claim_regent', 'customs_thorne', 'deserters_road', 'duel_yard_vikram',
      'file_house_fox', 'fjord_grimvald', 'flagship_hale', 'harbor_flank_al_doria', 'harbor_flank_jwaladesh', 'harbor_flank_kuroshi',
      'harbor_flank_skarragol', 'headland_battery', 'intro_boar', 'mangrove_crew', 'marsh_moths', 'oil_store_dhanraj', 'ordu_bout', 'pier_marines',
      'pier_rael', 'press_gang_cross', 'qasim_vault', 'quay_watch', 'rael_trial', 'salt_road_enforcers', 'stacks_cutpurses', 'thorne_blockade',
      'thumbprint_picket', 'tunnel_bats', 'village_patrol', 'winter_wolves',
    ]);
    for (const id of started) {
      const def = battleDef(id);
      expect(def, id).toBeDefined();
      if (def!.meantToLose) continue;
      const foe = Object.values(maps).some((m) => m.npcs.some((n) => starts(CONTENT.npcs[n.npc]?.dialogue).has(id)));
      const trigger = Object.values(maps).some((m) => m.triggers.some((t) => !t.once && !t.onEnter && starts(t.dialogue).has(id)));
      // Or a thing on the map that starts it again when used (Chapter 7: the marsh posts bring the moths back).
      const thing = Object.values(maps).some((m) => m.objects.some((o) => starts(o.dialogue).has(id)));
      // Or an Echo zone whose memory plays it again on every swap in (Chapter 11: Caona's stand on the pier; the Rise
      // brings the party back to the present, engine/game.ts riseFromFight).
      const echo = Object.values(maps).some((m) => m.echoZones.some((z) => starts(z.onEcho).has(id)));
      expect(foe || trigger || thing || echo, `${id}: nobody waits on the map to fight it again`).toBe(true);
    }
  });

  it('no fight trigger fires on entering a map again (Rise would land straight back in the fight)', () => {
    for (const m of Object.values(maps)) {
      for (const t of m.triggers) {
        if (!t.onEnter || starts(t.dialogue).size === 0) continue;
        expect(t.once && !!t.flag, `${m.id}/${t.id}`).toBe(true);
      }
    }
  });

  it('a fight trigger never covers a spawn or a door\'s arrival tile (where there is no tile to step back to)', () => {
    for (const m of Object.values(maps)) {
      for (const t of m.triggers) {
        if (t.once || t.onEnter || starts(t.dialogue).size === 0) continue;
        const inside = (p: { x: number; y: number }) =>
          p.x >= t.area.x && p.y >= t.area.y && p.x < t.area.x + t.area.width && p.y < t.area.y + t.area.height;
        for (const s of m.spawns) expect(inside(s.pos), `${m.id}/${t.id} covers spawn ${s.id}`).toBe(false);
        for (const d of m.doors) expect(inside(doorArrival(d).pos), `${m.id}/${t.id} covers door ${d.id}`).toBe(false);
      }
    }
  });

  it('debates and rhythm locks are not fights: they never start a battle (so never a Game Over)', () => {
    for (const r of Object.values(RHYTHMS)) {
      expect(starts(r.failDialogue).size, r.failDialogue).toBe(0);
      expect(starts(r.successDialogue).size, r.successDialogue).toBe(0);
    }
    expect(JSON.stringify(DEBATES)).not.toContain('battle.next');
  });
});
