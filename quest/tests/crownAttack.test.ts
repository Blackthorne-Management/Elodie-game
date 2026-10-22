// Chapter 2's midpoint, the Crown attack (Oct 17): the two fights on the night the guns fire are real fights
// (owner rule, Oct 17: nothing trivial, every foe can hurt) yet winnable by the party the route brings there;
// and the occupied city: the townsfolk keep indoors, Yari and Anissa hide, the shops' keepers are gone.

import { describe, expect, it } from 'vitest';
import { GRUDGE_MAX, GRUDGE_MAX_BOSS } from '../src/config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, battleDef } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleParty } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { partyMembers } from '../src/engine/rpg.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { flagsAt, simulate } from '../tools/battle-sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));

/** The route played up to a marker. */
function playTo(mark: string) {
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) break;
    sim.run([item]);
  }
  return sim;
}

/** A plain plan: Surge when ready, Sunthread with SP, otherwise attack the first foe standing; no healing. */
function fight(id: string, seed: number, flags: Parameters<typeof battleParty>[0]) {
  const def = battleDef(id)!;
  const enemies = def.enemies.map((e) => ENEMIES[e]!).map((e) => (def.level ? { ...e, level: def.level } : e));
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), enemies, [], { seed });
  b.start();
  const maxHp = b.party.reduce((n, c) => n + c.maxHp, 0);
  for (let t = 0; t < 200 && !b.outcome; t++) {
    const me = b.actor!;
    const foe = b.enemies.find((e) => !e.down)!;
    if (b.canSurge()) b.act({ kind: 'surge' });
    else if (me.key === 'gianna' && me.sp >= 5) b.act({ kind: 'skill', skill: 'sunthread', target: foe.key });
    else b.act({ kind: 'attack', target: foe.key });
  }
  return { won: b.outcome === 'won', lost: 1 - b.party.reduce((n, c) => n + c.hp, 0) / maxHp };
}

describe('the Crown attack (Chapter 2 midpoint)', () => {
  const before = playTo('oath').logic.state.flags;

  for (const id of ['caney_breach', 'village_patrol']) {
    it(`${id}: winnable with a plain plan, and it hurts`, () => {
      const runs = Array.from({ length: 40 }, (_, i) => fight(id, 300 + i, before));
      expect(runs.filter((r) => r.won).length).toBeGreaterThanOrEqual(36);
      expect(runs.reduce((n, r) => n + r.lost, 0) / runs.length).toBeGreaterThanOrEqual(0.25);
    });
  }

  it('after the refuge, Yari and Anissa hide: Gianna walks the occupied city alone', () => {
    const sim = playTo('refuge');
    const flags = sim.logic.state.flags;
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna']);
    expect(flags.isSet('story.anaco_taken')).toBe(true);
    expect(sim.logic.state.player.mapId).toBe('xaragua-cave');
    // The cave holds the resistance, Yari and Anissa.
    const here = sim.logic.npcs().map((n) => n.npc);
    for (const who of ['resistance_leader', 'yari_hidden', 'anissa_hidden']) expect(here).toContain(who);
  });

  it('the occupied city: vendors and townsfolk are gone, marines stand guard', () => {
    const sim = playTo('refuge');
    const npcsOn = (mapId: string) => {
      const map = maps[mapId]!;
      return map.npcs.filter((n) => n.era !== 'echo' && evaluate(n.if, sim.logic.state.flags)).map((n) => n.npc);
    };
    expect(npcsOn('xaragua-beach')).not.toContain('casabe_baker');
    expect(npcsOn('xaragua-beach')).toContain('occ_marine_beach');
    expect(npcsOn('xaragua-village')).not.toContain('lamp_oil_seller');
    expect(npcsOn('xaragua-caney')).toContain('crown_captain');
    expect(npcsOn('xaragua-caney')).not.toContain('anaco');
  });

  it('the occupied city: Anaco is placed only by all three clues; the cellar opens to the envoy\'s demand; the bark comes first', () => {
    const sim = playTo('escape-plan');
    const flags = sim.logic.state.flags;
    for (const f of ['story.bark_asked', 'clue.held_seller', 'clue.held_ledger', 'clue.held_guard', 'story.anaco_found', 'story.visit_granted', 'story.anaco_visited', 'clue.sea_cave_route', 'story.escape_planned']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    // The bark was given to Anaco.
    expect(flags.get('item.fever_bark')).toBe(0);
    // The runner took the word: Yari is still hidden until the night of the tide.
    expect(flags.isSet('story.word_runner_seen')).toBe(true);
    expect(flags.get('story.yari_hidden')).toBe(true);
    // The checkpoints lift once the papers are shown, on the way to the beach.
    expect(flags.isSet('story.papers_checked')).toBe(false);
    expect(playTo('tonight').logic.state.flags.isSet('story.papers_checked')).toBe(true);
  });

  // Review 1, finding 3: no walk back to the cave. Yari and Anissa meet Gianna at the sea cave mouth.
  it('the night of the tide: Yari and Anissa come to the sea cave mouth, and the way in opens', () => {
    const flags = playTo('tonight').logic.state.flags;
    expect(flags.isSet('story.escape_night')).toBe(true);
    expect(flags.get('story.yari_hidden')).toBe(false);
    expect(flags.isSet('party.anissa')).toBe(true);
    const sim = playTo('tonight');
    expect(sim.logic.state.player.mapId).toBe('xaragua-beach');
  });

  it('the occupied city takes one stop for two clues, and no climb to the caney', () => {
    const sim = playTo('shutters');
    const flags = sim.logic.state.flags;
    expect(flags.isSet('clue.held_seller') && flags.isSet('clue.held_guard')).toBe(true);
    // Two clues are not enough: the register is still to read, and the cellar door is shut without the Governor's word.
    expect(flags.isSet('story.anaco_found')).toBe(false);
    const door = maps['xaragua-customs']!.doors.find((d) => d.id === 'customs_cellar')!;
    expect(evaluate(door.if, flags)).toBe(false);
    // From the refuge to the sea cave, the route never goes back to the cave, up to the plaza or into the caney.
    const route = readJson<string[]>('routes/zetwal-act1.json');
    const from = route.indexOf('@refuge');
    const to = route.indexOf('@seacave');
    const s2 = playTo('refuge');
    const visited: string[] = [];
    for (const item of parseRoute(route.slice(from + 1, to))) {
      s2.run([item]);
      if (visited.at(-1) !== s2.logic.state.player.mapId) visited.push(s2.logic.state.player.mapId);
    }
    expect(visited).toEqual(['xaragua-cave', 'xaragua-conuco', 'xaragua-village', 'xaragua-customs', 'xaragua-cellar', 'xaragua-customs', 'xaragua-village', 'xaragua-beach', 'xaragua-seacave']);
  });

  it('Thorne (the chapter boss) falls to a plain plan most of the time, and hurts', () => {
    const tonight = playTo('tonight').logic.state.flags;
    const runs = Array.from({ length: 40 }, (_, i) => fight('thorne_blockade', 700 + i, tonight));
    expect(runs.filter((r) => r.won).length).toBeGreaterThanOrEqual(36);
    expect(runs.reduce((n, r) => n + r.lost, 0) / runs.length).toBeGreaterThanOrEqual(0.3);
  });
});

// Review 1 (Oct 21), finding 1: Thorne was the first fight the Attack button could not win, after five that all fell
// to it, and the Grudge could not climb it. Now the patrol on the night of the attack asks for the skills (a
// breastplate turns plain blows), Anissa names the answer at Thorne, and a boss's Grudge climbs to +50%. Plans as
// tools/battle-sim.ts plays them, with the party exactly as the route leaves it.
describe('the fights teach the skills before the boss (review 1, finding 1)', () => {
  const patrol = flagsAt('patrol');
  const thorne = flagsAt('seacave');

  it('village_patrol: Attack alone loses more often than it wins the first time, the skills win every time', () => {
    expect(simulate('village_patrol', patrol, 'attack', 0).wins).toBeLessThanOrEqual(20);
    expect(simulate('village_patrol', patrol, 'attack', GRUDGE_MAX).wins).toBeGreaterThanOrEqual(30); // never a wall
    const spells = simulate('village_patrol', patrol, 'spells', 0);
    expect(spells.wins).toBe(40);
    expect(spells.hurt).toBeGreaterThanOrEqual(0.15); // still a fight
    expect(BATTLES.village_patrol!.tips?.start).toMatch(/breastplate/i);
  });

  it('Thorne: Attack alone loses most first tries but wins at the boss Grudge; the skills win every time', () => {
    expect(BATTLES.thorne_blockade!.boss).toBe(true);
    expect(simulate('thorne_blockade', thorne, 'attack', 0).wins).toBeLessThanOrEqual(15);
    expect(simulate('thorne_blockade', thorne, 'attack', GRUDGE_MAX).wins).toBeGreaterThanOrEqual(25);
    expect(simulate('thorne_blockade', thorne, 'attack', GRUDGE_MAX_BOSS).wins).toBeGreaterThanOrEqual(34);
    expect(simulate('thorne_blockade', thorne, 'spells', 0).wins).toBe(40);
  });

  it('with the skills, Thorne is still the hardest fight of the chapter', () => {
    const boss = simulate('thorne_blockade', thorne, 'spells', 0).hurt;
    expect(boss).toBeGreaterThan(simulate('village_patrol', patrol, 'spells', 0).hurt);
    expect(boss).toBeGreaterThan(simulate('caney_breach', flagsAt('attack'), 'spells', 0).hurt);
  });

  it("Anissa's first tip at Thorne is the answer: the light (and never a joke)", () => {
    const tip = BATTLES.thorne_blockade!.tips!.start!;
    expect(tip).toMatch(/light/i);
    expect(tip).toMatch(/Sunthread/);
  });

});
