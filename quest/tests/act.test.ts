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
  /** What the party owns and knows when Chapter 1's card shows (items, gear, gold, XP, spells, members). */
  const KEPT = /^(item\.|equip\.|gold$|xp|spells\.|party\.|lore\.)/;
  let atChapterEnd: Record<string, unknown> = {};
  for (const item of route) {
    if (item.kind === 'mark' && item.name === 'end-card') {
      atChapterEnd = Object.fromEntries(Object.entries(sim.logic.state.flags.snapshot()).filter(([k]) => KEPT.test(k)));
    }
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

  it('the party keeps everything from one chapter to the next: bag, gear, gold, XP, spells, members, books', () => {
    expect(Object.keys(atChapterEnd).length).toBeGreaterThan(5);
    expect(atChapterEnd['item.boar_tusk'] ?? atChapterEnd['equip.gianna.charm']).toBeTruthy();
    const now = sim.logic.state.flags.snapshot();
    for (const [k, v] of Object.entries(atChapterEnd)) {
      // The story itself moves Anissa: she hides in the cave once the Crown attacks (Chapter 2's midpoint).
      if (k === 'party.anissa') continue;
      // Counts and totals only grow on the way (the pier fight pays XP, gold and casabe); the rest is unchanged.
      if (typeof v === 'number') expect(now[k] as number, k).toBeGreaterThanOrEqual(v);
      else expect(now[k], k).toEqual(v);
    }
  });

  it('Chapter 2: the pier, Anaco, the council, Thorne, the cave, the lock, the proof, the attack, the occupied city, Thorne; home to Zetwal', () => {
    expect(sim.battles).toEqual(['intro_boar', 'pier_marines', 'caney_breach', 'village_patrol', 'thorne_blockade']);
    expect(chapter2).toEqual(['pier', 'anaco', 'council', 'thorne', 'lamp', 'cave', 'areito', 'lock', 'proof', 'escape', 'held', 'visit', 'word', 'blockade']);
    expect(sim.logic.state.flags.isSet('clue.seventh_clause')).toBe(true);
    expect(sim.logic.state.flags.isSet('card.xaragua_falls')).toBe(true);
    expect(sim.logic.state.flags.isSet('card.act2_end')).toBe(true);
    expect(sim.logic.state.player.mapId).toBe('zetwal-harbor');
  });

  it('the petroglyph cave: the sluice opened in the memory drains it, the areíto gives the last bar, the stones open the record house', () => {
    const flags = sim.logic.state.flags;
    expect(flags.isSet('anchor.cave_sluice')).toBe(true);
    expect(flags.isSet('clue.drum_pattern')).toBe(true);
    expect(flags.isSet('clue.drum_full')).toBe(true);
    expect(sim.rhythms).toEqual(['record_lock']);
    expect(flags.isSet('story.lock_opened')).toBe(true);
    expect(flags.isSet('story.oath_found')).toBe(true);
    // Caona joins the Echo party at the areíto.
    expect(flags.isSet('story.caona_joined')).toBe(true);
    expect(speakers.has('Caona')).toBe(true);
  });

  it('meets every objective, in order', () => {
    expect(objectives).toEqual([...ACT1.objectives.map((o) => o.id), 'complete']);
  });

  it('visits every Zetwal map and swaps eras', () => {
    // Chapter 1's maps, the temple archive (the Overdue Shelf, required before sailing), and (at the end of
    // Chapter 2) home to Pòdlimyè's Old Harbor. Not the Iron Market: since Batch D (Oct 19) the engraver brings
    // the seal to the Hall, and the Market is the city's shop street, off the story's way.
    const story = ACT1.maps.filter((m) => m !== 'zetwal-market');
    expect(new Set(maps.filter((m) => m.startsWith('zetwal-')))).toEqual(new Set([...story, 'zetwal-archive', 'zetwal-harbor']));
    for (const m of ['xaragua-village', 'xaragua-plaza', 'xaragua-caney', 'xaragua-customs']) expect(maps).toContain(m);
    expect(eras.filter((e) => e === 'echo').length).toBeGreaterThanOrEqual(2);
    expect(sim.log).toContain('Something old stirs here, but it will not open to you yet.');
  });

  it('hears from the family', () => {
    // The engraver and the Crown's consul play their scenes in the Hall (Batch D, Oct 19).
    for (const name of ['Gianna', 'Elodie', 'Anissa', 'Anissa (at the door)', 'Anicette', 'Patricio', 'Aide', 'Yari', 'Engraver', "The Crown's consul", 'Cacique Anaco', 'Governor Thorne', 'Marine sergeant']) {
      expect(speakers).toContain(name);
    }
  });

  it('autosaves along the way', () => {
    expect(sim.saves).toBeGreaterThan(5);
  });
});
