// Chapter 2's midpoint, the Crown attack (Oct 17): the two fights on the night the guns fire are real fights
// (owner rule, Oct 17: nothing trivial, every foe can hurt) yet winnable by the party the route brings there;
// and the occupied city: the townsfolk keep indoors, Yari and Anissa hide, the shops' keepers are gone.

import { describe, expect, it } from 'vitest';
import { ENEMIES, SKILL_BOOK, battleDef } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleParty } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { partyMembers } from '../src/engine/rpg.ts';
import { parseRoute } from '../src/engine/sim.ts';
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
});
