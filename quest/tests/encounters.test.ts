// Random encounters in a capital's wild section (engine/game.ts rollEncounter): only inside a zone,
// only in the present, never in the first grace steps, from the zone's table, and replayable by seed.

import { describe, expect, it } from 'vitest';
import { ENCOUNTER_GRACE_STEPS } from '../src/config.ts';
import type { GameContent } from '../src/engine/content.ts';
import { GameLogic, encounterFlag, type Effect } from '../src/engine/game.ts';
import { newGame } from '../src/engine/state.ts';
import { parseMap } from '../src/engine/tiledMap.ts';
import { CONTENT } from '../src/data/content.ts';
import { loadMaps } from '../tools/sim-setup.ts';
import { makeMap, obj } from './helpers.ts';

const content: GameContent = {
  npcs: {},
  dialogue: {},
  speakers: {},
  cards: [],
  messages: { noZone: '', locked: '', blocked: '', doorInEcho: '', enterEcho: '', leaveEcho: '' },
  encounters: {
    road: {
      id: 'road',
      groups: [
        { id: 'bandits', weight: 3, level: 6, foes: ['Bandit', 'Bandit'], intro: 'Bandits!', won: 'They flee.', fled: 'You run.' },
        { id: 'hushers', weight: 1, level: 9, foes: ['Husher'], intro: 'A Husher!', won: 'It fades.', fled: 'You run.' },
      ],
    },
  },
};

// A 12 x 3 corridor: columns 6..11 of the middle row are wild; the zone in row 0 is locked by a flag.
function logic(seed = 7, zoneIf?: string): GameLogic {
  const map = parseMap(
    'w',
    makeMap({
      present: ['............', '............', '............'],
      objects: {
        spawns: [obj('start', 0, 1)],
        encounters: [obj('wild', 6, 0, { table: 'road', ...(zoneIf ? { if: zoneIf } : {}) }, 6, 3)],
      },
    }),
  );
  return new GameLogic({ w: map }, content, newGame(map, 'start'), seed);
}

/** Pace back and forth inside the zone until an ambush (or give up); returns the steps it took. */
function paceUntilAmbush(g: GameLogic, limit = 2000): { steps: number; effects: Effect[] } {
  let dir: 'right' | 'left' = 'right';
  for (let steps = 1; steps <= limit; steps++) {
    let a = g.tryStep(dir);
    if (!a.ok) {
      dir = dir === 'right' ? 'left' : 'right';
      a = g.tryStep(dir);
    }
    if (!a.ok) throw new Error('stuck');
    const effects = g.finishStep(a.to);
    if (effects.some((e) => e.kind === 'encounter')) return { steps, effects };
    if (g.state.player.pos.x <= 6) dir = 'right';
    if (g.state.player.pos.x >= 11) dir = 'left';
  }
  return { steps: limit, effects: [] };
}

function walkInto(g: GameLogic): void {
  for (let i = 0; i < 6; i++) g.finishStep((g.tryStep('right') as { ok: true; to: { x: number; y: number } }).to);
}

describe('random encounters', () => {
  it('never happen outside a zone', () => {
    const g = logic();
    for (let i = 0; i < 400; i++) {
      const a = g.tryStep(i % 10 < 5 ? 'right' : 'left');
      if (a.ok && a.to.x < 6) expect(g.finishStep(a.to).some((e) => e.kind === 'encounter')).toBe(false);
    }
  });

  it('wait out the grace steps, then start a fight from the table and flash first', () => {
    const g = logic();
    walkInto(g);
    const { steps, effects } = paceUntilAmbush(g);
    expect(steps).toBeGreaterThan(ENCOUNTER_GRACE_STEPS - 1);
    expect(effects[0]).toMatchObject({ kind: 'encounter', table: 'road' });
    expect(g.mode).toBe('dialogue');
    expect(g.view()).toMatchObject({ kind: 'choice', text: expect.stringMatching(/Bandits!|A Husher!/) });
  });

  it('Fight wins and Run escapes, each remembered as a flag', () => {
    for (const [choice, outcome] of [[0, 'won'], [1, 'fled']] as const) {
      const g = logic(11);
      walkInto(g);
      const { effects } = paceUntilAmbush(g);
      const enc = effects.find((e) => e.kind === 'encounter') as { table: string; group: string };
      g.choose(choice);
      while (g.mode === 'dialogue') g.advance();
      expect(g.state.flags.isSet(encounterFlag('road', enc.group, outcome))).toBe(true);
    }
  });

  it('follow the seed exactly, and both groups turn up over many fights', () => {
    const run = (seed: number) => {
      const g = logic(seed);
      walkInto(g);
      const out: string[] = [];
      for (let i = 0; i < 40; i++) {
        const { steps, effects } = paceUntilAmbush(g);
        out.push(`${steps}:${(effects[0] as { group: string }).group}`);
        g.choose(0);
        while (g.mode === 'dialogue') g.advance();
      }
      return out;
    };
    expect(run(5)).toEqual(run(5));
    const groups = run(5).map((s) => s.split(':')[1]);
    expect(new Set(groups)).toEqual(new Set(['bandits', 'hushers']));
    expect(groups.filter((x) => x === 'bandits').length).toBeGreaterThan(groups.filter((x) => x === 'hushers').length);
  });

  it('stay quiet while the zone is locked', () => {
    const g = logic(3, 'story.gate_open');
    walkInto(g);
    expect(paceUntilAmbush(g, 300).effects).toEqual([]);
    g.state.flags.set('story.gate_open', true);
    expect(paceUntilAmbush(g).effects[0]).toMatchObject({ kind: 'encounter' });
  });

  it('the Cane Road is peaceful in Chapter 1 and turns violent once the story returns to Zetwal', () => {
    const maps = loadMaps();
    const road = maps['zetwal-road']!;
    const g = new GameLogic(maps, CONTENT, newGame(road, 'road'), 9);
    g.state.player.pos = { x: 20, y: 12 };
    const pace = (n: number) => {
      for (let i = 0; i < n; i++) {
        const a = g.tryStep(i % 20 < 10 ? 'right' : 'left');
        if (!a.ok) continue;
        if (g.finishStep(a.to).some((e) => e.kind === 'encounter')) return true;
      }
      return false;
    };
    expect(pace(1000)).toBe(false);
    g.state.flags.set('story.zetwal_return', true);
    expect(pace(1000)).toBe(true);
  });

  it('every zone in the game points at a table that exists, with sensible groups', () => {
    for (const table of Object.values(CONTENT.encounters ?? {})) {
      expect(table.groups.length, table.id).toBeGreaterThan(0);
      for (const g of table.groups) {
        expect(g.foes.length, g.id).toBeGreaterThan(0);
        for (const line of [g.intro, g.won, g.fled]) expect(line.length, g.id).toBeLessThanOrEqual(128);
      }
    }
  });
});
