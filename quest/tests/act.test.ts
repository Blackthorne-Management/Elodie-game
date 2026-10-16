// The whole of Chapter 1, Zetwal, and the opening of Chapter 2 in Xaraguá, played headlessly from a new
// game by the scripted route the smoke test also drives in the browser (routes/zetwal-act1.json).

import { describe, expect, it } from 'vitest';
import { ACT1, ACT2 } from '../src/data/quests.ts';
import { currentObjective } from '../src/engine/quests.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));

describe('Chapter 1, Zetwal, start to finish, and the opening of Chapter 2', () => {
  const sim = newGameSim(loadMaps());
  const objectives: string[] = [];
  const chapter2: string[] = [];
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
      if (ACT2.maps.includes(sim.logic.state.player.mapId)) {
        const id2 = currentObjective(ACT2, sim.logic.state.flags)?.id ?? 'complete';
        if (chapter2.at(-1) !== id2) chapter2.push(id2);
      }
      if (eras.at(-1) !== sim.logic.era) eras.push(sim.logic.era);
      if (maps.at(-1) !== sim.logic.state.player.mapId) maps.push(sim.logic.state.player.mapId);
    }
  }

  it('reaches the end of the act and shows the card, then the ferry lands in Xaraguá', () => {
    expect(sim.logic.state.flags.isSet('act1.complete')).toBe(true);
    expect(sim.logic.state.flags.isSet('card.act1_end')).toBe(true);
    expect(sim.logic.state.flags.isSet('story.xaragua_arrived')).toBe(true);
    expect(sim.logic.mode).toBe('field');
  });

  it('Chapter 2 opens: the pier fight, Anaco, the council, Thorne, then the cave is next', () => {
    expect(sim.battles).toEqual(['intro_boar', 'pier_marines']);
    expect(chapter2).toEqual(['pier', 'anaco', 'council', 'thorne', 'oath']);
    expect(sim.logic.state.flags.isSet('clue.seventh_clause')).toBe(true);
    expect(sim.logic.state.player.mapId).toBe('xaragua-customs');
  });

  it('meets every objective, in order', () => {
    expect(objectives).toEqual([...ACT1.objectives.map((o) => o.id), 'complete']);
  });

  it('visits every Zetwal map and swaps eras', () => {
    expect(new Set(maps.filter((m) => m.startsWith('zetwal-')))).toEqual(new Set(ACT1.maps));
    for (const m of ['xaragua-village', 'xaragua-plaza', 'xaragua-caney', 'xaragua-customs']) expect(maps).toContain(m);
    expect(eras.filter((e) => e === 'echo').length).toBeGreaterThanOrEqual(2);
    expect(sim.log).toContain('Something old stirs here, but it will not open to you yet.');
  });

  it('hears from the family', () => {
    for (const name of ['Gianna', 'Elodie', 'Anissa', 'Anissa (at the door)', 'Anicette', 'Patricio', 'Aide', 'Yari', 'Cacique Anaco', 'Governor Thorne', 'Marine sergeant']) {
      expect(speakers).toContain(name);
    }
  });

  it('autosaves along the way', () => {
    expect(sim.saves).toBeGreaterThan(5);
  });
});
