// The whole of Act I, Zetwal, played headlessly from a new game by the scripted route the smoke test
// also drives in the browser (routes/zetwal-act1.json).

import { describe, expect, it } from 'vitest';
import { ACT1 } from '../src/data/quests.ts';
import { currentObjective } from '../src/engine/quests.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));

describe('Act I: Zetwal, start to finish', () => {
  const sim = newGameSim(loadMaps());
  const objectives: string[] = [];
  const eras: string[] = [];
  const maps: string[] = [];
  const speakers = new Set<string>();
  const listen = () => {
    const view = sim.logic.view();
    if (view.kind !== 'end' && view.speaker) speakers.add(view.speaker.name);
  };
  for (const item of route) {
    for (const cmd of sim.expand(item)) {
      if (cmd === 'skip') {
        // Press A line by line (what skip does), noting who speaks.
        for (let i = 0; i < 500 && sim.logic.mode === 'dialogue'; i++) {
          listen();
          sim.press('confirm');
        }
      } else sim.press(cmd);
      listen();
      const id = currentObjective(ACT1, sim.logic.state.flags)?.id ?? 'complete';
      if (objectives.at(-1) !== id) objectives.push(id);
      if (eras.at(-1) !== sim.logic.era) eras.push(sim.logic.era);
      if (maps.at(-1) !== sim.logic.state.player.mapId) maps.push(sim.logic.state.player.mapId);
    }
  }

  it('reaches the end of the act and shows the card, then lets the player walk again', () => {
    expect(sim.logic.state.flags.isSet('act1.complete')).toBe(true);
    expect(sim.logic.state.flags.isSet('card.act1_end')).toBe(true);
    expect(sim.logic.mode).toBe('field');
  });

  it('meets every objective, in order', () => {
    expect(objectives).toEqual([...ACT1.objectives.map((o) => o.id), 'complete']);
  });

  it('visits every Zetwal map and swaps eras', () => {
    expect(new Set(maps)).toEqual(new Set(ACT1.maps));
    expect(eras.filter((e) => e === 'echo').length).toBeGreaterThanOrEqual(2);
    expect(sim.log).toContain('Something old stirs here, but it will not open to you yet.');
  });

  it('hears from the family', () => {
    for (const name of ['Gianna', 'Elodie', 'Anissa', 'Anissa (at the door)', 'Anicette', 'Patricio', 'Aide', 'Yari']) {
      expect(speakers).toContain(name);
    }
  });

  it('autosaves along the way', () => {
    expect(sim.saves).toBeGreaterThan(5);
  });
});
