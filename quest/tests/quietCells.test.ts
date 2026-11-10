// The Nightingale Key's hidden conversations (data/quietCells.ts, data/dialogue/quietCells.ts; SECRET-ITEMS.md 8, built
// Nov 10): in each of the six capitals from Chapter 7 on, the Quiet Crown cell member stands where the chapter's own
// save puts the party, carries the Key's sigil, talks only with the Key, can be answered wrongly with nothing lasting,
// and on the right word walks off the map once, for Concord once and a Journal line. The scripted route never takes them.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CELL_CONCORD, STABILITY } from '../src/config.ts';
import { CONTENT } from '../src/data/content.ts';
import { CELL_TALKS } from '../src/data/dialogue/quietCells.ts';
import { JOURNAL_NOTES } from '../src/data/quests.ts';
import { CELL_IDS, KEY_HELD, QUIET_CELLS, cellLeft, type CellId } from '../src/data/quietCells.ts';
import { quietCrownLook } from '../src/data/secrets.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { concord } from '../src/engine/debate.ts';
import type { FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { journalNotes } from '../src/engine/quests.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { stageCues } from '../src/engine/stage.ts';
import { hidesEachOther } from '../src/engine/partyPlacement.ts';
import { newGame } from '../src/engine/state.ts';
import { isWalkable } from '../src/engine/grid.ts';
import { loadMaps, newGameSim, readJson, winBattles } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));

/** Where the route stands in each capital's calm hours (the mark's flags), and the route's end. */
const MARKS: Readonly<Record<CellId, string>> = {
  kirinoura: 'kirinoura-petition',
  agnipur: 'jwaladesh-price',
  kingsmere: 'aldermoor-dawn',
  podlimye: 'muster-camp',
  yucayeque: 'war-camp',
  eightgate: 'claim-night',
};
const snaps = new Map<string, FlagSnapshot>();
{
  const want = new Set([...Object.values(MARKS), 'the-end']);
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && want.has(item.name)) snaps.set(item.name, sim.logic.state.flags.snapshot());
    sim.run([item]);
  }
}

/** The game with that mark's story, Gianna standing below the person (facing them is one press up). */
function simAt(id: CellId, extra: FlagSnapshot = {}): Sim {
  const c = QUIET_CELLS[id];
  const state = newGame(maps[c.map]!, '');
  state.flags.load({ ...snaps.get(MARKS[id])!, ...extra });
  state.player.pos = { x: c.at.x, y: c.at.y + 1 };
  const sim = new Sim(new GameLogic(maps, CONTENT, state));
  winBattles(sim);
  return sim;
}

/** Talk to them; at the choice, take the k-th offered (the cursor moves down k), then play it out. */
function talk(sim: Sim, k: number | null): void {
  sim.run(['up', 'confirm']);
  expect(sim.logic.mode).toBe('dialogue');
  for (let i = 0; i < 20 && sim.logic.mode === 'dialogue' && sim.logic.view().kind !== 'choice'; i++) sim.run(['confirm']);
  if (k === null) return;
  expect(sim.logic.view().kind).toBe('choice');
  sim.run([...Array<string>(k).fill('down'), 'confirm', 'skip']);
  expect(sim.logic.mode).toBe('field');
}

/** The answer that reaches them, by its place among the choices offered at that mark. */
function winIndex(id: CellId, sim: Sim): number {
  const offered = CELL_TALKS[id].answers.filter((a) => !a.if || evaluate(a.if, sim.logic.state.flags));
  return offered.findIndex((a) => !a.reply);
}

const placed = (id: CellId, sim: Sim) => sim.logic.npcs().some((n) => n.npc === QUIET_CELLS[id].npc);

describe('the six cell members stand in their capitals, under the Key\'s sigil', () => {
  for (const id of CELL_IDS) {
    it(`${id}: on ${QUIET_CELLS[id].map} in the chapter's calm hours, with a qc_ look, clear of everyone`, () => {
      const c = QUIET_CELLS[id];
      const map = maps[c.map]!;
      const p = map.npcs.find((n) => n.npc === c.npc && n.pos.x === c.at.x && n.pos.y === c.at.y);
      expect(p, id).toBeDefined();
      expect(quietCrownLook(CONTENT.npcs[c.npc]!.look), id).toBe(true);
      const sim = simAt(id);
      expect(placed(id, sim), id).toBe(true);
      // Anissa's spot and the exit are on the map's floor; she never stands over the person or Gianna beside them.
      for (const spot of [c.anissa, c.exit]) expect(spot.x >= 0 && spot.y >= 0 && spot.x < map.width && spot.y < map.height, id).toBe(true);
      expect(isWalkable(map, 'present', c.anissa), id).toBe(true);
      expect(hidesEachOther(c.anissa, c.at), id).toBe(false);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) expect(hidesEachOther(c.anissa, { x: c.at.x + dx, y: c.at.y + dy }), `${id} ${dx},${dy}`).toBe(false);
      expect(sim.logic.npcs().some((n) => n.pos.x === c.anissa.x && n.pos.y === c.anissa.y), id).toBe(false);
    });
  }
});

describe('each conversation opens only with the Key', () => {
  for (const id of CELL_IDS) {
    it(`${id}: without the Key, an ordinary word and nothing set`, () => {
      const sim = simAt(id);
      const before = sim.logic.state.flags.snapshot();
      talk(sim, null);
      expect(sim.logic.view().kind).not.toBe('choice');
      sim.run(['skip']);
      const after = sim.logic.state.flags.snapshot();
      expect(Object.keys(after).filter((k) => k.startsWith('cell.'))).toEqual([]);
      expect(after.concord).toBe(before.concord);
    });
  }
});

describe('a wrong word changes nothing; the right one walks them off once', () => {
  for (const id of CELL_IDS) {
    it(`${id}: "Not today", then again, then out of the cell for Concord +${CELL_CONCORD} and a Journal line`, () => {
      const sim = simAt(id, { [KEY_HELD]: true });
      const flags = sim.logic.state.flags;
      const start = concord(flags);
      // Every wrong answer: nothing of theirs is set, Concord stands, and they are still there.
      const wrong = CELL_TALKS[id].answers.filter((a) => !a.if || evaluate(a.if, flags));
      wrong.forEach((a, k) => {
        if (!a.reply) return;
        talk(sim, k);
        expect(flags.isSet(cellLeft(id)), `${id} ${a.text}`).toBe(false);
        expect(concord(flags)).toBe(start);
        expect(placed(id, sim)).toBe(true);
      });
      // "Not now" (the last choice) ends it too.
      talk(sim, wrong.length);
      expect(flags.isSet(cellLeft(id))).toBe(false);
      // The right word.
      talk(sim, winIndex(id, sim));
      expect(flags.isSet(cellLeft(id))).toBe(true);
      expect(concord(flags)).toBe(Math.min(100, start + CELL_CONCORD));
      expect(placed(id, sim)).toBe(false);
      expect(journalNotes(JOURNAL_NOTES, flags).map((n) => n.id)).toContain(`cell_${id}`);
      // Never twice: the bonus is paid once, however many conversations follow.
      CONTENT.afterDialogue?.(flags);
      expect(concord(flags)).toBe(start + CELL_CONCORD);
    });
  }

  it('a failed try leaves the whole save as it was (save for what the chapter writes after any conversation)', () => {
    const sim = simAt('kirinoura', { [KEY_HELD]: true });
    const before = sim.logic.state.flags.snapshot();
    talk(sim, 0);
    expect(sim.logic.state.flags.snapshot()).toEqual(before);
  });
});

describe('the scenes are acted out on the map', () => {
  for (const id of CELL_IDS) {
    it(`${id}: Anissa walks up to speak, and they walk off the map`, () => {
      const c = QUIET_CELLS[id];
      const script = CONTENT.dialogue[`${c.npc}_talk`]!;
      const cues = stageCues(script);
      expect(cues).toContainEqual(expect.objectContaining({ do: 'walk', actor: 'follower', to: { ...c.anissa } }));
      expect(cues).toContainEqual({ do: 'exit', actor: `npc:${c.npc}`, to: { ...c.exit } });
      // Their flag is set on the line that walks them off (shown, not told).
      const exitLine = Object.values(script.nodes).flatMap((n) => n.lines).find((l) => l.stage?.some((s) => s.do === 'exit'));
      expect(exitLine?.set?.[cellLeft(id)]).toBe(true);
    });
  }

  it('each winning scene is five to twelve lines from the first word, with no Rael', () => {
    for (const id of CELL_IDS) {
      const t = CELL_TALKS[id];
      const lines = t.meet.length + 7 + (t.companion ? 1 : 0);
      expect(lines, id).toBeGreaterThanOrEqual(5);
      expect(lines, id).toBeLessThanOrEqual(12);
      expect(JSON.stringify(t), id).not.toMatch(/Rael/);
    }
  });
});

describe('the route and the ending', () => {
  it('the scripted route never holds the Key or takes one of them', () => {
    const end = snaps.get('the-end')!;
    expect(end[KEY_HELD]).toBeUndefined();
    for (const id of CELL_IDS) expect(end[cellLeft(id)], id).toBeUndefined();
    expect(readFileSync(new URL('../routes/zetwal-act1.json', import.meta.url), 'utf8')).not.toMatch(/cell\./);
  });

  it('all six together move the ending\'s Concord part by at most three points of Stability', () => {
    const part = (c: number) => Math.max(-STABILITY.concordMax, Math.min(STABILITY.concordMax, Math.round((c - STABILITY.concordFrom) / STABILITY.concordPer)));
    for (let c = 0; c <= 100; c++) expect(part(Math.min(100, c + CELL_IDS.length * CELL_CONCORD)) - part(c)).toBeLessThanOrEqual(3);
  });
});
