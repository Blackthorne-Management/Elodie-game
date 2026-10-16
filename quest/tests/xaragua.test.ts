// Chapter 2, Yucayeque: the people and places build (Oct 16). Its vendors run their shops, its books earn
// Influence in Xaraguá (not Zetwal), its debate corner argues there, and every Taíno word is in the
// phrasebook waiting for the reviewer.

import { describe, expect, it } from 'vitest';
import { BOOKS, SHELVES, loreFlag } from '../src/data/books.ts';
import { DEBATES } from '../src/data/debates.ts';
import { GLOSSARIES } from '../src/data/lang.ts';
import { NPCS } from '../src/data/npcs.ts';
import { RPG } from '../src/data/rpg.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { localPillar } from '../src/engine/rpg.ts';
import { loadMaps, newGameSim } from '../tools/sim-setup.ts';

const maps = loadMaps();
const xaraguaMaps = Object.values(maps).filter((m) => m.id.startsWith('xaragua-'));
const placed = new Set(xaraguaMaps.flatMap((m) => m.npcs.map((n) => n.npc)));

describe('Yucayeque: people and places', () => {
  it('the market vendors run their own shops, selling real items, and stand on the map', () => {
    for (const [npc, shop] of [['casabe_baker', 'xaragua_food'], ['carver', 'xaragua_carver'], ['bow_maker', 'xaragua_bows']] as const) {
      expect(NPCS[npc]!.shop).toBe(shop);
      expect(placed.has(npc), npc).toBe(true);
      const def = RPG.shops[shop]!;
      expect(def.city).toBe('xaragua');
      for (const id of def.stock) expect(RPG.items[id], id).toBeDefined();
    }
  });

  it('nine books in the Song House and four records in the Caney, on shelves that stand there', () => {
    const shelvesOn = (map: string) => maps[map]!.objects.filter((o) => SHELVES.some((s) => s.id === o.id)).map((o) => o.id);
    const books = (ids: string[]) => SHELVES.filter((s) => ids.includes(s.id)).flatMap((s) => s.books);
    expect(books(shelvesOn('xaragua-song'))).toHaveLength(9);
    expect(books(shelvesOn('xaragua-caney'))).toHaveLength(4);
  });

  it('reading them earns Influence in Xaraguá, not in Zetwal', () => {
    const flags = new FlagStore();
    const ours = BOOKS.filter((b) => b.id.startsWith('xaragua_'));
    for (const b of ours) flags.set(loreFlag(b.id), true);
    expect(localPillar(flags, RPG, 'influence', 'xaragua')).toBe(ours.length);
    expect(localPillar(flags, RPG, 'influence', 'zetwal')).toBe(0);
  });

  it('the debate corner argues in Xaraguá, its two speakers stand by the fire, and Reason needs a Xaraguá book', () => {
    const d = DEBATES.find((x) => x.id === 'xaragua_springs')!;
    expect(d.city).toBe('xaragua');
    expect(placed.has('debate_roots_elder') && placed.has('debate_pilgrim')).toBe(true);
    expect(d.reasonNeeds.every((f) => f.startsWith('lore.xaragua_'))).toBe(true);
  });

  it('every Taíno word waits for the reviewer', () => {
    const taino = GLOSSARIES.find((g) => g.language.startsWith('Taíno'))!;
    expect(taino.entries.map((e) => e.word)).toContain('Guatiao');
    expect(taino.entries.every((e) => !e.verified)).toBe(true);
  });

  it('a conversation ends with an autosave (so a story talk is never lost to a reload)', () => {
    const sim = newGameSim(maps, 'xaragua-beach', 'beach');
    sim.run(['goto 25,10', 'down']);
    const before = sim.saves;
    sim.run(['confirm', 'skip']);
    expect(sim.logic.mode).toBe('field');
    expect(sim.saves).toBe(before + 1);
  });
});
