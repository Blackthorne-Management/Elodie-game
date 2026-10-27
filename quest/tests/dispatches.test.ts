// The four pieces docs/PRODUCTION.md listed as "not built yet" for Chapters 10 to 12 (built Oct 27): the contract boards'
// dispatches (the Speaker's to the Temple island, salt to the hill camp, the Compact's roll to the north gate), the Quill's
// Chapter 10 bonus at the name stones, the beach market's second stock once the harbor is taken, and the voyage from
// Yucayeque to Ardencia's strand before the Ash Road. (The books' second looks are in tests/books.test.ts.)

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTENT } from '../src/data/content.ts';
import { REALM_MAP } from '../src/data/realmMap.ts';
import { RPG } from '../src/data/rpg.ts';
import { VOYAGES } from '../src/data/voyages.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { isWalkable } from '../src/engine/grid.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { localPillar } from '../src/engine/rpg.ts';
import { stageCues } from '../src/engine/stage.ts';
import { seaRoute } from '../src/engine/voyage.ts';
import { activeNpcs } from '../src/engine/world.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();

/** Plays a conversation to its end, taking the named choices in order; returns every line shown. */
function play(id: string, flags: FlagStore, picks: string[] = []): string[] {
  const script = CONTENT.dialogue[id];
  if (!script) throw new Error(`no dialogue ${id}`);
  const r = new DialogueRunner(script, CONTENT.speakers, flags);
  const out: string[] = [];
  for (let v = r.view(), i = 0; v.kind !== 'end' && i < 200; v = r.view(), i++) {
    out.push(v.text);
    if (v.kind === 'choice') {
      const want = picks.shift();
      const c = v.choices.find((x) => x.text === want);
      if (!c) throw new Error(`${id}: no choice "${want}" in ${v.choices.map((x) => x.text).join(' / ')}`);
      r.choose(c.index);
    } else r.advance();
  }
  return out;
}

const flagsOf = (snap: FlagSnapshot) => {
  const f = new FlagStore();
  f.load(snap);
  return f;
};

const MUSTER: FlagSnapshot = { 'story.muster_begun': true };
const WAR: FlagSnapshot = { 'act10.complete': true, 'story.war_begun': true, 'story.landed': true };
const CLAIM: FlagSnapshot = { 'act11.complete': true, 'army.free_brasador': 12 };

describe('the contract boards\' dispatches (Chapters 10 to 12)', () => {
  it('Chapter 10: the chief courier gives the Speaker\'s dispatch; the acolyte at the lamp takes it (+1 Influence in Zetwal)', () => {
    const f = flagsOf(MUSTER);
    const before = localPillar(f, RPG, 'influence', 'zetwal');
    // The acolyte has only her Muster line until the dispatch is carried.
    expect(play('acolyte_talk', f).join(' ')).toContain('opposite doors');
    play('chief_courier_talk', f, ['Not now.']);
    expect(f.isSet('muster.dispatch_carried')).toBe(false);
    play('chief_courier_talk', f, ['I\'ll carry it.']);
    expect(f.isSet('muster.dispatch_carried')).toBe(true);
    expect(play('chief_courier_talk', f).join(' ')).toContain('The acolyte at the lamp');
    const given = play('acolyte_talk', f).join(' ');
    expect(given).toContain('every night the fleet is at sea');
    expect(f.isSet('muster.dispatch_done')).toBe(true);
    expect(localPillar(f, RPG, 'influence', 'zetwal')).toBe(before + 1);
    // Once: the acolyte goes back to her line, the courier to his birds.
    expect(play('acolyte_talk', f).join(' ')).toContain('opposite doors');
    expect(play('chief_courier_talk', f).join(' ')).toContain('We know.');
    // The courier stands in the Hall and the acolyte on the Temple island all chapter (no condition keeps them off).
    const placed = (map: string, npc: string) => activeNpcs(maps[map]!, 'present', f).some((n) => n.npc === npc);
    expect(placed('zetwal-hall', 'chief_courier')).toBe(true);
    expect(placed('zetwal-temple', 'acolyte')).toBe(true);
  });

  it('Chapter 10: the dispatch is the Muster\'s only (no offer before it, none once the fleet has sailed)', () => {
    expect(play('chief_courier_talk', new FlagStore()).join(' ')).not.toContain('contract board');
    expect(play('chief_courier_talk', flagsOf({ ...MUSTER, 'act10.complete': true })).join(' ')).not.toContain('contract board');
  });

  it('Chapter 11: salt from the beach pans to the behique at the hill camp (+1 Influence in Xaraguá), then her lamp as before', () => {
    const f = flagsOf(WAR);
    const before = localPillar(f, RPG, 'influence', 'xaragua');
    expect(play('camp_leader_beach_talk', f, ['The gun first.'])[0]).toBe('The gun first, envoy. Then up the hill.');
    expect(f.isSet('war.salt_carried')).toBe(false);
    play('camp_leader_beach_talk', f, ['I\'ll carry it up.']);
    expect(f.isSet('war.salt_carried')).toBe(true);
    const healer = play('healer_war_talk', f);
    expect(healer.join(' ')).toContain('Boiled water and salt');
    // Straight on into the built ask: the lamp at the hamacas (Anissa's promise).
    expect(healer.at(-1)).toBe('I\'ll hold it.');
    expect(f.isSet('war.salt_done') && f.isSet('story.lamp_promised')).toBe(true);
    expect(localPillar(f, RPG, 'influence', 'xaragua')).toBe(before + 1);
    expect(play('healer_war_talk', f)).toEqual(['Clean cloth, boiled water, and the lamp. That is a hospital.']);
    // Without the salt the healer is exactly as built.
    expect(play('healer_war_talk', flagsOf(WAR)).at(-1)).toBe('I\'ll hold it.');
    // The giver is on the sand until the gun is taken; the behique at the hill camp by day.
    const placed = (map: string, npc: string, snap: FlagSnapshot) => activeNpcs(maps[map]!, 'present', flagsOf(snap)).some((n) => n.npc === npc);
    expect(placed('xaragua-beach', 'camp_leader_beach', WAR)).toBe(true);
    expect(placed('xaragua-camp', 'healer_war', WAR)).toBe(true);
  });

  it('Chapter 12: the Hall\'s roll from the contract board to Tío Joaquin at the north gate (+1 Influence in Eightgate)', () => {
    const f = flagsOf(CLAIM);
    const before = localPillar(f, RPG, 'influence', 'seat');
    play('seat_contract_board', f, ['Leave it.']);
    expect(f.isSet('claim.dispatch_carried')).toBe(false);
    // Joaquin says his built line until he has the roll.
    expect(play('gate_free_brasador_talk', f).join(' ')).toContain('Free Brasador holds the north gate');
    play('seat_contract_board', f, ['Take the roll.']);
    expect(play('seat_contract_board', f).join(' ')).toContain('Tío Joaquin holds it');
    expect(play('gate_free_brasador_talk', f).join(' ')).toContain('Now I have it in writing');
    expect(f.isSet('claim.dispatch_done')).toBe(true);
    expect(localPillar(f, RPG, 'influence', 'seat')).toBe(before + 1);
    expect(play('gate_free_brasador_talk', f).join(' ')).toContain('Free Brasador holds the north gate');
    expect(play('seat_contract_board', f).join(' ')).toContain('paper is gone');
    // No Free Brasador at the gate (no company to carry it to): the board as built. Before Chapter 12 and after the
    // Hearing is called: as built too.
    const built = play('seat_contract_board', new FlagStore());
    expect(play('seat_contract_board', flagsOf({ 'act11.complete': true }))).toEqual(built);
    expect(play('seat_contract_board', flagsOf({ ...CLAIM, 'story.hearing_called': true }))).toEqual(built);
    expect(activeNpcs(maps['seat-concourse']!, 'present', f).some((n) => n.npc === 'gate_free_brasador_captain')).toBe(true);
  });

  it('none of the three is on the arrow\'s gate: the route\'s chapters finish without them', () => {
    const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
    const sim = newGameSim(maps);
    for (const item of route) {
      sim.run([item]);
      if (item.kind === 'mark' && item.name === 'chapter12-end') break;
    }
    const f = sim.logic.state.flags;
    expect(f.isSet('story.hearing_called')).toBe(true);
    for (const flag of ['muster.dispatch_done', 'war.salt_done', 'claim.dispatch_done', 'muster.quill_stone']) expect(f.isSet(flag), flag).toBe(false);
  });
});

describe('the Quill\'s Chapter 10 bonus at the name stones (SECRET-ITEMS.md 1)', () => {
  it('with Solange\'s Quill, Yari walks to the seventh stone and hears the name from the list: +2 Influence in Xaraguá, once', () => {
    const f = flagsOf({ ...MUSTER, 'item.solange_quill': true });
    const before = localPillar(f, RPG, 'influence', 'xaragua');
    const lines = play('name_stones', f);
    expect(lines.join(' ')).toContain('A Yaguana name, on Zetwal\'s list');
    expect(f.isSet('muster.quill_stone')).toBe(true);
    expect(localPillar(f, RPG, 'influence', 'xaragua')).toBe(before + 2);
    // Shown, not told: Yari walks to the stone and turns to Gianna.
    const cues = stageCues(CONTENT.dialogue.name_stones!).filter((c) => c.do !== 'wait' && c.do !== 'sync' && c.actor === 'yari');
    expect(cues.map((c) => c.do)).toEqual(['walk', 'look', 'face']);
    // Once: the stones as built afterwards.
    expect(play('name_stones', f)).toEqual(play('name_stones', new FlagStore()));
    expect(localPillar(f, RPG, 'influence', 'xaragua')).toBe(before + 2);
  });

  it('without the Quill (Z-4 The Seventh Stone not done in Chapter 1), or outside the Muster, the stones are as built', () => {
    const built = play('name_stones', new FlagStore());
    expect(play('name_stones', flagsOf(MUSTER))).toEqual(built);
    expect(play('name_stones', flagsOf({ 'item.solange_quill': true }))).toEqual(built);
    expect(play('name_stones', flagsOf({ ...MUSTER, 'act10.complete': true, 'item.solange_quill': true }))).toEqual(built);
  });

  it('Yari\'s tile beside the stones is open ground on the Temple island', () => {
    const m = maps['zetwal-temple']!;
    const stones = m.objects.find((o) => o.id === 'name_stones')!;
    expect(stones).toBeDefined();
    const cue = stageCues(CONTENT.dialogue.name_stones!).find((c) => c.do === 'walk' && c.actor === 'yari');
    const to = cue && 'to' in cue ? cue.to : null;
    expect(to).not.toBeNull();
    expect(to!.y).toBe(stones.area.y);
    expect(to!.x).toBe(stones.area.x + stones.area.width);
    expect(isWalkable(m, 'present', to!)).toBe(true);
  });
});

describe('the beach market\'s second stock once the harbor is taken (Chapter 11)', () => {
  const FREE: FlagSnapshot = { ...WAR, 'story.tide_called': true, 'story.harbor_taken': true };
  const shops: Record<string, string> = { casabe_baker_free: 'xaragua_food_free', carver_free: 'xaragua_carver_free', bow_maker_free: 'xaragua_bows_free' };

  it('the three stand at their burned stalls with their Chapter 11 line, then the new stock', () => {
    const beach = maps['xaragua-beach']!;
    const here = activeNpcs(beach, 'present', flagsOf(FREE)).map((n) => n.npc);
    for (const [npc, shop] of Object.entries(shops)) {
      expect(here, npc).toContain(npc);
      expect(CONTENT.npcs[npc]!.shop).toBe(shop);
      // Their line is the war's overlay (the stall burned, the griddle didn't).
      expect(play(CONTENT.npcs[npc]!.dialogue, flagsOf(FREE)).length).toBe(1);
    }
    expect(play('casabe_baker_talk', flagsOf(FREE))[0]).toContain('The griddle didn');
    // Not before the harbor is taken.
    const war = activeNpcs(beach, 'present', flagsOf(WAR)).map((n) => n.npc);
    for (const npc of Object.keys(shops)) expect(war).not.toContain(npc);
  });

  it('each second stock leads with something new and keeps the old beside it; no tier-28 piece (Eightgate stocks those)', () => {
    for (const [base, free] of [['xaragua_food', 'xaragua_food_free'], ['xaragua_carver', 'xaragua_carver_free'], ['xaragua_bows', 'xaragua_bows_free']] as const) {
      const old = RPG.shops[base]!.stock;
      const now = RPG.shops[free]!.stock;
      expect(now.every((id) => !!RPG.items[id]), free).toBe(true);
      expect(old.every((id) => now.includes(id)), `${free} keeps ${base}'s stock`).toBe(true);
      expect(old.includes(now[0]!), `${free} leads with something new`).toBe(false);
      expect(Math.max(...now.map((id) => RPG.items[id]!.level ?? 0)), free).toBeLessThan(28);
      expect(RPG.shops[free]!.city).toBe('xaragua');
    }
    expect(RPG.items.harbor_cotton!.level).toBe(24);
    expect(RPG.items.carved_cannon_charm!.level).toBe(26);
  });
});

describe('the voyage to Eightgate (Chapter 11\'s end into Chapter 12)', () => {
  it('the caney names the voyage by route: Ardencia\'s sails lead on Trust, the trader on Strike', () => {
    for (const [route, voyage] of [['war.trust', 'xaragua_ardencia'], ['war.strike', 'xaragua_ardencia_strike']] as const) {
      const f = flagsOf({ ...WAR, 'story.harbor_taken': true, [route]: true });
      play('war_caney', f);
      expect(f.get('voyage.next')).toBe(voyage);
      expect(f.get('travel.next')).toBe('seat-concourse/ardencia_gate');
    }
    expect(VOYAGES.xaragua_ardencia!.captions.map((c) => c.text).join(' ')).toContain('Ardencia\'s sails lead the strait');
    expect(VOYAGES.xaragua_ardencia_strike!.captions.map((c) => c.text).join(' ')).toContain('Nobody\'s sails are black');
  });

  it('both sail at sea from Yucayeque north up the strait to Ardencia\'s strand (where Chapter 4\'s voyage set out)', () => {
    for (const id of ['xaragua_ardencia', 'xaragua_ardencia_strike']) {
      const v = VOYAGES[id]!;
      const route = seaRoute(REALM_MAP, v);
      expect(route[0]).toEqual(VOYAGES.xaragua_zetwal!.start);
      expect(route.at(-1)).toEqual(VOYAGES.ardencia_aldoria!.start);
      expect(v.shore).toBe('xaragua');
      expect(v.night).toBeFalsy();
    }
  });

  it('on the route, Chapter 11\'s card closes on the voyage, then the party stands at the Ardencia Gate', () => {
    const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
    const sim = newGameSim(maps);
    for (const item of route) {
      if (item.kind === 'mark' && item.name === 'chapter11-end') break;
      sim.run([item]);
    }
    expect(sim.logic.mode).toBe('card');
    const effects = sim.logic.closeCard();
    expect(effects).toContainEqual({ kind: 'voyage', voyage: 'xaragua_ardencia' });
    expect(sim.logic.state.player.mapId).toBe('seat-concourse');
    expect(sim.logic.state.flags.isSet('voyage.next')).toBe(false);
  });
});

// The Chapter 12 start a test may load (?chapter=12) begins at the gate itself, after the voyage: nothing left to sail.
describe('?chapter=12 starts after the voyage', () => {
  it('no voyage or journey is pending in the start', () => {
    const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { flags: FlagSnapshot }>;
    const f = starts['12']?.flags ?? {};
    expect(f['voyage.next']).toBeUndefined();
    expect(f['travel.next']).toBeUndefined();
  });
});
