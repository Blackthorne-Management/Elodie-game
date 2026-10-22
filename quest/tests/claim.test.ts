// Chapter 12, the Claim, and the Epilogue, the Hearing (docs/quest/reviews/2026-10-22-chapter12-epilogue-outline.md with its
// second review and the owner's decisions of Oct 22): the owner's rules as content checks; every Chapter 11 variant (four
// houses, betrayed and turned, Trust and Strike) and every verdict, and the dark route (Azzy's Challenge), played to the end
// by the gold arrow; a lost Challenge's way back in; the wounds that carry; the last cards and the credits; and the fights
// against the roster four and a glass line in tier-24 gear, counting falls across the whole party.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GRUDGE_MAX } from '../src/config.ts';
import { ENEMIES, BATTLES, SKILL_BOOK, battleDef, battleReserve } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { DEBATES } from '../src/data/debates.ts';
import { CLAIM_DIALOGUE, CLAIM_OVERLAYS, SOLEMN_SCRIPTS } from '../src/data/dialogue/seatClaim.ts';
import { ENCOUNTERS } from '../src/data/encounters.ts';
import { RPG } from '../src/data/rpg.ts';
import { FLANK_HOUSES } from '../src/data/war.ts';
import { Battle, battleParty, settleBattle, woundsFor, type BattleEvent } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import type { Effect } from '../src/engine/game.ts';
import { GameLogic } from '../src/engine/game.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { recordLoss } from '../src/engine/gameOver.ts';
import { sharedXp, xpForLevel } from '../src/engine/rpg.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { newGame } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { skillsAction } from '../tools/battle-sim.ts';
import { goldWalk } from '../tools/gold-walk.ts';
import { loadMaps, newGameSim, readJson, winBattles } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string; flags: FlagSnapshot }>;

/** The game as the route leaves it at a marker. */
function simAt(mark: string): Sim {
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) return sim;
    sim.run([item]);
  }
  throw new Error(`No mark @${mark}`);
}

// ---- The chapter's lines -------------------------------------------------------------------------------------------------

const own = new Set(CLAIM_DIALOGUE.map((d) => d.id));
const overlaid = new Set(CLAIM_OVERLAYS.map((o) => o.id));
type Line = { d: string; node: string; speaker: string; text: string };
const lines: Line[] = [...own, ...overlaid].flatMap((id) =>
  Object.entries(CONTENT.dialogue[id]!.nodes)
    .filter(([node]) => own.has(id) || node.startsWith('m_'))
    .flatMap(([node, n]) => n.lines.map((l) => ({ d: id, node, speaker: l.speaker ?? n.speaker ?? '', text: l.text }))),
);
const CORNER = DEBATES.find((d) => d.id === 'seat_claim')!;
const debateLines: Line[] = (['passing', 'listen', 'won', 'lost', 'mediate', 'provoke', 'after'] as const).flatMap((part) =>
  CORNER[part].map((l) => ({ d: CORNER.id, node: part, speaker: l.speaker ?? '', text: l.text })),
);
const all = [...lines, ...debateLines];
const isAnissa = (s: string) => s === 'anissa' || s === 'anissa_far';

describe('the owner\'s rules as content checks', () => {
  const COMIC = new Set(['salkhi', 'samira', 'vikram', 'edmund']);
  const JOKE = /ha!|\bjoke|funny|just saying|dreadful|terribly|hah\b|heh\b/i;

  it('no comic line shares a node with Anissa\'s', () => {
    for (const d of new Set(all.map((l) => l.d))) {
      const ls = all.filter((l) => l.d === d);
      for (const node of new Set(ls.map((l) => l.node))) {
        const n = ls.filter((l) => l.node === node);
        if (!n.some((l) => isAnissa(l.speaker))) continue;
        expect(n.filter((l) => COMIC.has(l.speaker)).map((l) => l.text), `${d}/${node}`).toEqual([]);
      }
    }
  });

  it('nothing in the rooms, the Hall, the Claim, the Hearing or the endings is a joke; Anissa never jokes and is never a fighter', () => {
    for (const id of SOLEMN_SCRIPTS) {
      expect(CONTENT.dialogue[id], id).toBeDefined();
      for (const l of all.filter((x) => x.d === id)) {
        expect(l.text, id).not.toMatch(JOKE);
        expect(COMIC.has(l.speaker) && l.text.endsWith('!') && /\b(ha|ho)\b/i.test(l.text), `${id}: ${l.text}`).toBe(false);
      }
    }
    const anissa = all.filter((l) => isAnissa(l.speaker));
    expect(anissa.length).toBeGreaterThan(6);
    for (const l of anissa) expect(l.text, l.d).not.toMatch(JOKE);
    expect(anissa.map((l) => l.text)).toContain('I\'ll hold the door, Gigi.');
    expect(RPG.members.find((m) => m.id === 'anissa')!.support).toBe(true);
  });

  it('the Regent never speaks to Anissa, and his Hush the Light is the chapter\'s only Seize (Gianna steps in)', () => {
    for (const l of all.filter((x) => x.speaker === 'regent')) expect(l.text, l.d).not.toMatch(/\bAnissa\b|^child\b|, child\b|little one/i);
    const claim = Object.values(BATTLES).filter((b) => b.table === 'claim_story');
    const moves = claim.flatMap((b) => [...b.enemies.flatMap((e) => ENEMIES[e]!.moves), ...(b.phases ?? []).flatMap((p) => p.moves ?? [])]);
    expect([...new Set(moves.filter((m) => m.seize).map((m) => m.name))]).toEqual(['Hush the Light']);
    // Anissa has no tips in Azzy's Challenge: her line is said before it.
    expect(BATTLES.claim_azzy!.tips).toEqual({});
  });

  it('old Patricio speaks at the Claim of the sealing only, at the chair, and is silent at the Hearing', () => {
    const his = all.filter((l) => l.speaker === 'patricio_old');
    expect(his.length).toBeGreaterThan(0);
    for (const l of his) {
      expect(l.node === 'patricio' || l.d === 'patricio_claim_talk', `${l.d}/${l.node}`).toBe(true);
      expect(l.text).not.toMatch(/married|marriage|wife|husband/i);
    }
    const hearing = new Set(['hearing_arrivals', 'hearing', 'chamberlain_hearing_talk', 'ending', 'patricio_gallery_talk']);
    expect(all.filter((l) => hearing.has(l.d) && l.speaker === 'patricio_old')).toEqual([]);
  });

  it('nobody dies: every foe of the Claim withdraws, and Azzy\'s Challenge binds', () => {
    const ids = new Set(Object.values(BATTLES).filter((b) => b.table === 'claim_story').flatMap((b) => [...b.enemies, ...(b.phases?.flatMap((p) => p.enter ?? []) ?? [])]));
    for (const id of ids) expect(ENEMIES[id]!.withdraws, id).toBeDefined();
    expect(BATTLES.claim_azzy!.binds).toBe(true);
    expect(BATTLES.claim_azzy!.fighters).toEqual(['gianna']);
  });
});

// ---- Every variant plays to the end --------------------------------------------------------------------------------------

/** Chapter 11's start with the Muster's night rewritten: house `h` the buyer, sailed (betrayed) or turned. */
function startWith(h: string, night: 'betrayed' | 'turned'): Sim {
  const at = starts['11']!;
  const flags: FlagSnapshot = { ...at.flags };
  for (const k of Object.keys(flags)) if (/^muster\.(betrayer\.|gone\.)|^muster\.(betrayed|turned|turned_paid)$/.test(k)) delete flags[k];
  flags['army.al_doria'] = 21;
  flags['muster.betrayer'] = h;
  flags[`muster.betrayer.${h}`] = true;
  flags[`army.${h}`] = 0;
  if (night === 'betrayed') {
    flags['muster.betrayed'] = true;
    flags[`muster.gone.${h}`] = true;
  } else {
    flags['muster.turned'] = true;
    flags['muster.turned_army'] = 16;
  }
  const state = newGame(maps[at.map]!, at.spawn);
  state.flags.load(flags);
  const sim = new Sim(new GameLogic(maps, CONTENT, state));
  winBattles(sim);
  sim.logic.enterMap();
  return sim;
}

function pick(sim: Sim, text: string) {
  const v = sim.logic.view();
  if (v.kind !== 'choice') throw new Error(`no choice for "${text}"`);
  const i = v.choices.findIndex((c) => c.text === text);
  if (i < 0) throw new Error(`no "${text}" in ${v.choices.map((c) => c.text).join(' / ')}`);
  sim.cursor = i;
  sim.press('confirm');
}

const atChoice = (id: string, text: string) => (s: Sim) => {
  if (s.logic.mode !== 'dialogue' || s.logic.dialogueId !== id) return false;
  const v = s.logic.view();
  return v.kind === 'choice' && v.choices.some((c) => c.text === text);
};

type Turn = 'Hold the pier.' | 'Strike first.';
type Why = 'Because I didn\'t believe him.' | 'The realm had to see him beaten.';
type Verdict = 'Pardon, with conditions.' | 'Exile.' | 'Execution.';

/** Chapter 11 from its start, then Chapter 12 and the Epilogue, by the arrow, with the given answers; cards and credits seen. */
function playToTheEnd(sim: Sim, turn: Turn, why: Why | null, verdict: Verdict) {
  const stalls: string[] = [];
  const walk = (through: string, until?: (s: Sim) => boolean) => {
    const w = goldWalk({ maps, sim, through, until });
    stalls.push(...w.stalls);
    return w;
  };
  const cards: string[] = [];
  let credits = 0;
  const close = sim.logic.closeCard.bind(sim.logic);
  sim.logic.closeCard = (): Effect[] => {
    if (sim.logic.card) cards.push(sim.logic.card.id);
    const out = close();
    credits += out.filter((e) => e.kind === 'credits').length;
    return out;
  };
  walk('act11', atChoice('harbor_turn', 'Strike first.'));
  pick(sim, turn);
  walk('act11');
  if (why) {
    walk('act12', atChoice('claim_arrive', why));
    pick(sim, why);
  }
  walk('act12');
  walk('epilogue', atChoice('chamberlain_hearing_talk', 'Exile.'));
  pick(sim, verdict);
  if (verdict !== 'Pardon, with conditions.') pick(sim, verdict); // the confirm
  const last = walk('epilogue');
  for (let i = 0; i < 30 && sim.logic.mode !== 'field'; i++) sim.press('confirm');
  return { stalls, finished: last.finished, cards, credits };
}

function expectTheEnd(sim: Sim, out: ReturnType<typeof playToTheEnd>, end: 'just' | 'hollow' | 'iron') {
  const f = sim.logic.state.flags;
  expect(out.stalls).toEqual([]);
  expect(out.finished).toBe(true);
  expect(sim.logic.mode).toBe('field');
  for (const flag of ['act12.complete', 'story.claim_won', 'story.regent_arrested', 'story.rael_surrendered', 'story.hearing_heard', 'end.done', 'story.ending_seen', 'side.seats.done']) {
    expect(f.isSet(flag), flag).toBe(true);
  }
  expect(f.isSet(`ending.${end}`), `ending.${end}`).toBe(true);
  expect(f.isSet(`end.${end}`)).toBe(true);
  expect(typeof f.get('stability.score')).toBe('number');
  // The last cards in a row, then the credits once.
  expect(out.cards.slice(-5)).toEqual(['the_end', 'cast_1', 'cast_2', 'cast_3', 'cast_4']);
  expect(out.cards).toContain(`end_${end}`);
  expect(out.credits).toBe(1);
  expect(f.get('party.rael') === true).toBe(false);
  // Rael at the Hearing is never a fighter again; the companions are back on the field after it.
  expect(f.isSet('story.hall_seated')).toBe(false);
  // The Hall stays open after the end.
  const hallOut = maps['seat-hall']!.doors.find((d) => d.id === 'hall_out')!;
  expect(evaluate(hallOut.if, f)).toBe(true);
  const hallIn = maps['seat-concourse']!.doors.find((d) => d.id === 'concourse_hall')!;
  expect(evaluate(hallIn.if, f)).toBe(true);
}

describe('every Chapter 11 variant plays through the Claim and the Hearing to the end (pardon)', () => {
  for (const h of FLANK_HOUSES) {
    for (const night of ['betrayed', 'turned'] as const) {
      for (const turn of ['Hold the pier.', 'Strike first.'] as const) {
        it(`${h.house}, ${night}, ${turn === 'Hold the pier.' ? 'Trust' : 'Strike'}`, () => {
          const sim = startWith(h.house, night);
          const out = playToTheEnd(sim, turn, turn === 'Strike first.' ? 'Because I didn\'t believe him.' : null, 'Pardon, with conditions.');
          const f = sim.logic.state.flags;
          // Trust and a full row of chairs is the Just Throne; the Strike's cost makes it Hollow (the second review's 3.5).
          expectTheEnd(sim, out, turn === 'Hold the pier.' ? 'just' : 'hollow');
          expect(sim.battles.filter((b) => b.startsWith('claim_'))).toEqual(['claim_regent']);
          expect(f.isSet('claim.challenge')).toBe(false);
          // The betrayer's chair: bare if the house sailed for the Crown, set if it turned.
          expect(f.isSet(`seat.bare.${h.house}`)).toBe(night === 'betrayed');
          expect(f.isSet('item.chain_of_office')).toBe(true);
        });
      }
    }
  }
});

describe('the other verdicts, and the dark route', () => {
  it('Exile: the Hollow Throne on any save', () => {
    const sim = startWith('al_doria', 'betrayed');
    expectTheEnd(sim, playToTheEnd(sim, 'Hold the pier.', null, 'Exile.'), 'hollow');
    expect(sim.logic.state.flags.isSet('hearing.exile')).toBe(true);
  });

  it('Execution: the Iron Throne on any save', () => {
    const sim = startWith('al_doria', 'betrayed');
    expectTheEnd(sim, playToTheEnd(sim, 'Hold the pier.', null, 'Execution.'), 'iron');
    expect(sim.logic.state.flags.isSet('hearing.execution')).toBe(true);
  });

  it('"The realm had to see him beaten": Azzy\'s Challenge after the Regent, Gianna alone, then the Hollow Throne', () => {
    const sim = startWith('skarragol', 'betrayed');
    const out = playToTheEnd(sim, 'Strike first.', 'The realm had to see him beaten.', 'Pardon, with conditions.');
    expectTheEnd(sim, out, 'hollow');
    const f = sim.logic.state.flags;
    expect(sim.battles.filter((b) => b.startsWith('claim_'))).toEqual(['claim_regent', 'claim_azzy']);
    expect(f.isSet('claim.azzy_challenged')).toBe(true);
    expect(Object.keys(f.snapshot()).filter((k) => k.startsWith('wounds.'))).toEqual([]);
  });

  it('"Because I didn\'t believe him" on the Strike: no Challenge; Azzy shares or renounces', () => {
    const sim = startWith('kuroshi', 'turned');
    playToTheEnd(sim, 'Strike first.', 'Because I didn\'t believe him.', 'Execution.');
    const f = sim.logic.state.flags;
    expect(sim.battles).not.toContain('claim_azzy');
    expect(f.isSet('claim.azzy_share') || f.isSet('claim.azzy_renounced')).toBe(true);
    expect(f.isSet('ending.iron')).toBe(true);
  });
});

describe('after the end', () => {
  it('a save made after the credits loads in the field, with no card to show again', () => {
    const sim = startWith('jwaladesh', 'turned');
    playToTheEnd(sim, 'Hold the pier.', null, 'Pardon, with conditions.');
    const s = sim.logic.state;
    const again = newGame(maps[s.player.mapId]!, '');
    again.flags.load(s.flags.snapshot());
    again.player.pos = { ...s.player.pos };
    const logic = new GameLogic(maps, CONTENT, again);
    const fx = logic.enterMap();
    expect(fx.some((e) => e.kind === 'card' || e.kind === 'credits')).toBe(false);
    expect(logic.mode).toBe('field');
  });
});

// ---- A lost Challenge's way back in ----------------------------------------------------------------------------------------

describe('a lost Challenge has a way back in', () => {
  it('the Regent lost: the party rises in the Hall, and the tile plays the Claim again', () => {
    const sim = simAt('claim-tile');
    const flags = sim.logic.state.flags;
    let lostOnce = false;
    const win = sim.onBattle!;
    sim.onBattle = (id) => {
      if (id !== 'claim_regent' || lostOnce) return win(id);
      lostOnce = true;
      recordLoss(flags, battleDef(id)!);
      sim.logic.riseFromFight();
      return [];
    };
    sim.run(['goto 21,4', 'up', 'skip']);
    expect(lostOnce).toBe(true);
    expect(flags.isSet('story.regent_beaten')).toBe(false);
    for (let i = 0; i < 20 && sim.logic.mode !== 'field'; i++) sim.press('confirm');
    expect(sim.logic.state.player.mapId).toBe('seat-hall');
    const before = sim.battles.length;
    sim.run(['goto 21,5', 'goto 21,4', 'up', 'skip']);
    expect(sim.battles.slice(before)).toEqual(['claim_regent']);
    expect(flags.isSet('story.regent_beaten')).toBe(true);
  });
});

// ---- The wounds that carry, and the claimant first ---------------------------------------------------------------------------

/** Tier-24 gear for every fighter (best) or as the route leaves them (start), the party at a level, from Chapter 12's start. */
function partyAt(level: number, gear: 'best' | 'start', extra: FlagSnapshot = {}): FlagStore {
  const f = new FlagStore({ ...starts['12']!.flags, ...extra });
  const rules = sharedXp(f, RPG) - f.getNumber('xp.shared');
  f.set('xp.shared', xpForLevel(RPG, level) - rules);
  for (const m of RPG.members) {
    if (m.era !== 'present' || m.support) continue;
    f.set(`xp.${m.id}`, 0);
    if (gear === 'best' && m.id !== 'rael') {
      f.set(`equip.${m.id}.armor`, m.class === 'mage' ? 'muster_robe' : m.class === 'archer' ? 'oilcloth_coat' : 'scale_armour');
      if (m.class === 'warrior') f.set(`equip.${m.id}.weapon`, 'kingsmere_blade_of_force');
    }
  }
  return f;
}

const GLASS = ['gianna', 'yari', 'vikram', 'haru'];
type Result = { won: boolean; actions: number; falls: number; battle: Battle };

function fight(id: string, seed: number, flags: FlagStore, order: 'roster' | 'glass', grudge = 0): Result {
  const def = battleDef(id)!;
  let party = battleParty(flags, RPG, SKILL_BOOK, def.era ?? 'present');
  if (order === 'glass') party = [...GLASS.map((g) => party.find((p) => p.id === g)!), ...party.filter((p) => !GLASS.includes(p.id))];
  const enemies = def.enemies.map((e) => ENEMIES[e]!).map((e) => (def.level ? { ...e, level: def.level } : e));
  const b = new Battle(def, party, enemies, [], { seed, grudge, reserve: battleReserve(def), wounds: woundsFor(flags, def, party.map((p) => p.id)) });
  const keys = new Set(b.party.map((c) => c.key));
  let falls = 0;
  const count = (es: readonly BattleEvent[]) => {
    for (const e of es) if ((e.kind === 'down' || e.kind === 'bound') && keys.has(e.who)) falls++;
  };
  count(b.start());
  let actions = 0;
  for (; actions < 400 && !b.outcome; actions++) count(b.act(skillsAction(b)));
  return { won: b.outcome === 'won', actions, falls, battle: b };
}

function runs(id: string, level: number, gear: 'best' | 'start', order: 'roster' | 'glass', n: number, extra: FlagSnapshot = {}, grudge = 0) {
  const rs = Array.from({ length: n }, (_, i) => fight(id, 700 + i, partyAt(level, gear, extra), order, grudge));
  return {
    won: rs.filter((r) => r.won).length,
    actions: rs.reduce((s, r) => s + r.actions, 0) / n,
    withFall: rs.filter((r) => r.falls > 0).length / n,
    n,
  };
}

describe('the claimant strikes first, and Gianna\'s wounds carry from the Regent\'s Challenge into Azzy\'s', () => {
  it('Gianna acts first in both, foes included', () => {
    for (const id of ['claim_regent', 'claim_azzy']) {
      const def = battleDef(id)!;
      const party = battleParty(partyAt(29, 'best'), RPG, SKILL_BOOK);
      const b = new Battle(def, party, def.enemies.map((e) => ENEMIES[e]!), [], { seed: 5, reserve: battleReserve(def) });
      b.start();
      expect(b.actor?.key, id).toBe('gianna');
    }
  });

  it('a won Regent writes the wounds (never below the floor), Azzy\'s opens with them, and a won Challenge clears them', () => {
    const f = partyAt(30, 'best');
    const r = fight('claim_regent', 701, f, 'roster');
    expect(r.won).toBe(true);
    settleBattle(f, RPG, r.battle);
    const g = f.get('wounds.gianna');
    expect(typeof g).toBe('number');
    expect(g as number).toBeGreaterThanOrEqual(0.25);
    f.set('party.azzy', false);
    const def = battleDef('claim_azzy')!;
    const party = battleParty(f, RPG, SKILL_BOOK);
    const b = new Battle(def, party, def.enemies.map((e) => ENEMIES[e]!), [], { seed: 3, reserve: battleReserve(def), wounds: woundsFor(f, def, party.map((p) => p.id)) });
    b.start();
    expect(b.party.map((c) => c.key)).toEqual(['gianna']);
    const gi = b.party[0]!;
    expect(gi.hp).toBe(Math.max(1, Math.round(gi.maxHp * (g as number))));
    const z = fight('claim_azzy', 703, f, 'roster');
    if (z.won) {
      settleBattle(f, RPG, z.battle);
      expect(Object.keys(f.snapshot()).filter((k) => k.startsWith('wounds.'))).toEqual([]);
    }
  });
});

// ---- The fights --------------------------------------------------------------------------------------------------------------

describe('the fights, against the roster four and a glass line in tier-24 gear (the second review\'s gates)', () => {
  it('the Regent: won every seed at 28 to 30, about 40 actions at most at the route\'s level, a fall in about one fight in four', () => {
    for (const lv of [28, 30]) {
      for (const order of ['roster', 'glass'] as const) {
        const r = runs('claim_regent', lv, 'best', order, 20);
        console.log(`regent at ${lv}, ${order}: ${r.actions.toFixed(1)} actions, a fall in ${Math.round(r.withFall * 100)}%`);
        expect(r.won, `${lv} ${order}`).toBe(20);
        expect(r.actions, `${lv} ${order}`).toBeLessThanOrEqual(lv === 30 ? 41 : 43);
        expect(r.actions, `${lv} ${order}`).toBeGreaterThanOrEqual(18);
        if (lv === 30 && order === 'roster') {
          expect(r.withFall).toBeGreaterThan(0.05);
          expect(r.withFall).toBeLessThanOrEqual(0.4);
        }
      }
    }
  });

  it('the Regent: start gear wins every seed at the boss Grudge', () => {
    for (const order of ['roster', 'glass'] as const) expect(runs('claim_regent', 28, 'start', order, 10, {}, 0.5).won, order).toBe(10);
  });

  it('Azzy\'s Challenge after the Regent, with the wounds: Gianna alone wins most at 28 and every seed at 30; a lost one is won again', () => {
    const challenge = (lv: number, grudge: number, n: number) =>
      Array.from({ length: n }, (_, i) => {
        const f = partyAt(lv, 'best');
        const r = fight('claim_regent', 700 + i, f, 'roster');
        settleBattle(f, RPG, r.battle);
        f.set('party.azzy', false);
        return fight('claim_azzy', 900 + i, f, 'roster', grudge);
      });
    const at28 = challenge(28, 0, 20);
    const at30 = challenge(30, 0, 20);
    console.log(`azzy after the regent: ${at28.filter((r) => r.won).length}/20 at 28, ${at30.filter((r) => r.won).length}/20 at 30`);
    expect(at28.filter((r) => r.won).length).toBeGreaterThanOrEqual(16);
    expect(at30.filter((r) => r.won).length).toBe(20);
    expect(at28.every((r) => r.actions <= 25)).toBe(true);
    // A lost Challenge is played again with the same wounds (they carry until it is won), the Grudge behind her: most
    // of those win too, and every seed lost at 28 is won on the next try.
    expect(challenge(28, GRUDGE_MAX, 10).filter((r) => r.won).length).toBeGreaterThanOrEqual(8);
    for (const [i, r] of at28.entries()) {
      if (r.won) continue;
      const f = partyAt(28, 'best');
      settleBattle(f, RPG, fight('claim_regent', 700 + i, f, 'roster').battle);
      f.set('party.azzy', false);
      expect(fight('claim_azzy', 1900 + i, f, 'roster', GRUDGE_MAX / 3).won, `seed ${i}`).toBe(true);
    }
  });

  it('the Crossroads Fields: every group won at 28, four to nine actions, nobody down on average', () => {
    const table = ENCOUNTERS.crossroads_war!;
    for (const g of table.groups) {
      const r = runs(`encounter:crossroads_war/${g.id}`, 28, 'best', 'roster', 15);
      console.log(`crossroads ${g.id} at 28: ${r.actions.toFixed(1)} actions, a fall in ${Math.round(r.withFall * 100)}%`);
      expect(r.won, g.id).toBe(15);
      expect(r.actions, g.id).toBeLessThanOrEqual(12);
      expect(r.withFall, g.id).toBeLessThan(0.34);
    }
  });
});
