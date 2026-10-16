// Content checks: dialogue structure, speakers and looks, text that fits the dialogue box, every flag
// a condition reads is set somewhere (catches typos), the Journal, and the phrasebook.

import { DEBATES } from '../src/data/debates.ts';
import { debateFlag } from '../src/engine/debate.ts';
import { describe, expect, it } from 'vitest';
import { NPC_SPRITES, OBJECT_ART, PALETTE, PORTRAITS, TILESET, TILE_ART } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { LATER_STORY_FLAGS } from '../src/data/encounters.ts';
import { BATTLES } from '../src/data/battles.ts';
import { encounterFlag } from '../src/engine/encounterFlags.ts';
import { GLOSSARIES } from '../src/data/lang.ts';
import { PUZZLES } from '../src/data/puzzles.ts';
import { ACT1, JOURNAL_NOTES } from '../src/data/quests.ts';
import { flagsIn } from '../src/engine/conditions.ts';
import { checkDialogue, flagsReadBy, flagsSetBy } from '../src/engine/dialogue.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();

/** Every flag that something can set. */
function flagsSet(): Set<string> {
  const out = new Set<string>();
  for (const d of Object.values(CONTENT.dialogue)) for (const f of flagsSetBy(d)) out.add(f);
  for (const m of Object.values(maps)) for (const t of m.triggers) if (t.flag) out.add(t.flag);
  for (const c of CONTENT.cards) out.add(`card.${c.id}`);
  // A won battle sets its encounter flag (engine/battle.ts settleBattle).
  for (const b of Object.values(BATTLES)) out.add(encounterFlag(b.table, b.group, 'won'));
  // A debate sets its outcome flags (engine/debate.ts).
  for (const d of DEBATES) for (const o of ['listened', 'won', 'mediated', 'provoked'] as const) out.add(debateFlag(d.id, o));
  return out;
}

/** Every flag something reads. */
function flagsRead(): Map<string, string> {
  const out = new Map<string, string>();
  const add = (f: string, where: string) => out.set(f, where);
  for (const [id, d] of Object.entries(CONTENT.dialogue)) for (const f of flagsReadBy(d)) add(f, `dialogue ${id}`);
  for (const m of Object.values(maps)) {
    for (const thing of [...m.npcs, ...m.triggers, ...m.objects, ...m.echoZones, ...m.encounters]) {
      for (const f of flagsIn(thing.if)) add(f, `map ${m.id}`);
    }
  }
  for (const o of ACT1.objectives) for (const f of flagsIn(o.done)) add(f, `objective ${o.id}`);
  for (const n of JOURNAL_NOTES) add(n.when, `journal note ${n.id}`);
  for (const c of CONTENT.cards) add(c.when, `card ${c.id}`);
  for (const p of PUZZLES) for (const f of flagsIn(p.goal)) add(f, `puzzle ${p.id}`);
  return out;
}

describe('dialogue content', () => {
  it('passes the dialogue checker', () => {
    expect(checkDialogue(CONTENT.dialogue, CONTENT.speakers)).toEqual([]);
  });

  it('every NPC has a dialogue and a look; every speaker has a portrait', () => {
    for (const npc of Object.values(CONTENT.npcs)) {
      expect(CONTENT.dialogue[npc.dialogue] ?? CONTENT.debates?.[npc.dialogue], npc.id).toBeDefined();
      expect(NPC_SPRITES[npc.look], npc.id).toBeDefined();
    }
    for (const s of Object.values(CONTENT.speakers)) expect(PORTRAITS[s.portrait ?? ''], s.id).toBeDefined();
  });

  it('every encounter zone on a map uses a table that exists', () => {
    for (const map of Object.values(maps)) {
      for (const z of map.encounters) expect(CONTENT.encounters?.[z.table], `${map.id}/${z.id}`).toBeDefined();
    }
  });

  it('every NPC has a name for the label, and the cast have their own looks', () => {
    for (const npc of Object.values(CONTENT.npcs)) expect(npc.name, npc.id).toBeTruthy();
    for (const look of ['gianna', 'patricio_young', 'anissa', 'elodie', 'anicette', 'patricio_old', 'yari', 'quiet_crown_m_medium', 'quiet_crown_f_medium']) {
      expect(NPC_SPRITES[look], look).toBeDefined();
    }
    // At a glance: no two of the cast share hair style, headgear and outfit colour.
    const cast = ['gianna', 'patricio_young', 'anissa', 'elodie', 'anicette', 'patricio_old', 'yari', 'quiet_crown_m_medium', 'quiet_crown_f_medium'].map((k) => {
      const l = NPC_SPRITES[k]!;
      return `${l.hairStyle}/${l.headgear ?? '-'}/${l.outfit}`;
    });
    expect(new Set(cast).size).toBe(cast.length);
  });

  it('every line fits the dialogue box (4 lines, or 3 with a translation)', () => {
    for (const d of Object.values(CONTENT.dialogue)) {
      for (const node of Object.values(d.nodes)) {
        for (const l of node.lines) {
          const limit = l.translation ? 100 : 128;
          expect(l.text.length, `${d.id}: ${l.text}`).toBeLessThanOrEqual(limit);
        }
        for (const c of node.choices ?? []) expect(c.text.length, `${d.id}: ${c.text}`).toBeLessThanOrEqual(36);
      }
    }
  });

  it('every flag that is read is set somewhere (no typos)', () => {
    const set = flagsSet();
    const unknown = [...flagsRead()].filter(([f]) => !set.has(f) && !LATER_STORY_FLAGS.includes(f));
    expect(unknown).toEqual([]);
  });

  it('memory-only flags are set only in the memory and anchors only by anchor objects', () => {
    const anchorDialogues = new Set(
      Object.values(maps).flatMap((m) => m.anchors.map((a) => m.objects.find((o) => o.id === a.object)?.dialogue)),
    );
    for (const [id, d] of Object.entries(CONTENT.dialogue)) {
      for (const f of flagsSetBy(d).filter((x) => x.startsWith('anchor.'))) {
        expect(anchorDialogues.has(id), `${id} sets ${f}`).toBe(true);
      }
    }
  });
});

describe('Act I quest', () => {
  it('has 3 hints per objective, from nudge to answer, and short titles', () => {
    for (const o of ACT1.objectives) {
      expect(o.hints.length, o.id).toBe(3);
      expect(o.title.length, o.id).toBeLessThanOrEqual(30);
    }
    expect(new Set(ACT1.objectives.map((o) => o.id)).size).toBe(ACT1.objectives.length);
  });

  it('the bridge hint starts with the line from the guide', () => {
    expect(ACT1.objectives.find((o) => o.id === 'bridge')!.hints[0]).toBe('Gigi, what if the old bridge could just... go back?');
  });

  it('lists only maps that exist', () => {
    for (const m of ACT1.maps) expect(maps[m]).toBeDefined();
  });
});

describe('phrasebook (guide 8)', () => {
  const entries = GLOSSARIES.flatMap((g) => g.entries);

  it('entries are complete, and none is marked verified yet', () => {
    for (const e of entries) {
      expect(e.word && e.language && e.translation).toBeTruthy();
      expect(e.verified).toBe(false);
    }
  });

  it('every line that carries a translation uses glossary words', () => {
    const words = entries.map((e) => e.word.replace(/[?!.]/g, '').toLowerCase());
    for (const d of Object.values(CONTENT.dialogue)) {
      if (d.id.startsWith('keeper') || d.id === 'keeper_talk') continue; // the Phase 1 placeholder
      for (const node of Object.values(d.nodes)) {
        for (const l of node.lines.filter((x) => x.translation)) {
          const foreign = l.text.split(/[!?.]/)[0]!.trim().toLowerCase();
          expect(words.some((w) => foreign.startsWith(w)), `${d.id}: ${l.text}`).toBe(true);
        }
      }
    }
  });
});

describe('objects and art', () => {
  it('every puzzle object on every map has a name (and every door a label)', () => {
    for (const m of Object.values(maps)) {
      for (const o of m.objects) expect(CONTENT.objects?.[o.id], `${m.id} ${o.id}`).toBeDefined();
      for (const d of m.doors) expect(CONTENT.doors?.[`${m.id}/${d.id}`] ?? CONTENT.doors?.[d.id], `${m.id} ${d.id}`).toBeTruthy();
    }
  });

  it('every object kind is a tile or a large drawing; the story objects have drawings', () => {
    const tiles = new Set(TILESET.tiles.map((t) => t.name));
    for (const m of Object.values(maps)) for (const o of m.objects) if (o.kind) expect(tiles.has(o.kind) || !!OBJECT_ART[o.kind], o.kind).toBe(true);
    for (const t of ['sign', 'shrine', 'barrel', 'crate', 'well', 'winch', 'winch_rust', 'pawl', 'pawl_rust', 'pawl_pinned', 'rope_broken', 'raised_bridge', 'bridge', 'bridge_old', 'monument', 'stone_pile', 'door', 'loose_board', 'name_stone']) {
      expect(TILE_ART[t], t).toBeDefined();
    }
    for (const k of ['gaze_lamp', 'gaze_lamp_lit', 'war_table', 'war_table_echo', 'chain_bridge_up']) expect(OBJECT_ART[k], k).toBeDefined();
  });

  it('pixel drawings are rectangular, 16 x 16 for tiles, and use only the palette', () => {
    const check = (name: string, rows: readonly string[]) => {
      const w = rows[0]!.length;
      for (const r of rows) {
        expect(r.length, name).toBe(w);
        for (const c of r) expect(c === '.' || PALETTE[c] !== undefined, `${name}: "${c}"`).toBe(true);
      }
    };
    for (const [name, art] of Object.entries(TILE_ART)) {
      expect([art.rows[0]!.length, art.rows.length], name).toEqual([16, 16]);
      expect(TILESET.tiles.some((t) => t.name === name), `${name} is a tile`).toBe(true);
      if (art.under) expect(TILESET.tiles.some((t) => t.name === art.under), name).toBe(true);
      check(name, art.rows);
    }
    for (const [name, art] of Object.entries(OBJECT_ART)) check(name, art.rows);
    expect(Object.keys(PALETTE).length).toBeGreaterThanOrEqual(30);
    expect(Object.keys(PALETTE).length).toBeLessThanOrEqual(34);
  });

  it('tile gids are 1..n in order (they are positions in the .tmj files)', () => {
    expect(TILESET.tiles.map((t) => t.gid)).toEqual(TILESET.tiles.map((_, i) => i + 1));
  });
});
