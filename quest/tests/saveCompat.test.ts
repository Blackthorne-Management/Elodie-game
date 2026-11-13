// Saves across fixes (guide 9.1, Claude's call, Nov 13). The owner plays the whole quest over four sittings, with fixes
// shipped between them: a save made on one build must load on the next to a playable game, never a crash, a dead
// end or a new game. Real saves are taken at every autosave of the scripted route (routes/zetwal-act1.json), then
// loaded under the content changes a fix makes: a redrawn or shrunk map, a renamed or removed map, item or flag, a
// memory's shimmer moved, a damaged position, a code pasted back from a phone's notes app.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SAVE_CODE_PREFIX, SAVE_VERSION } from '../src/config.ts';
import { CONTENT } from '../src/data/content.ts';
import { RPG } from '../src/data/rpg.ts';
import { SAVE_FALLBACKS } from '../src/data/saveFallbacks.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { bagContents, partyMembers, stats } from '../src/engine/rpg.ts';
import { checksum, decodeSave, encodeSave, type SaveData } from '../src/engine/save.ts';
import { safeSpawn, standable, type SaveFallbacks } from '../src/engine/saveCompat.ts';
import { sideQuestStatus } from '../src/engine/sideQuests.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { applySave, loadStoredSave, newGame, placeSave, toSaveData } from '../src/engine/state.ts';
import type { GameMap } from '../src/engine/tiledMap.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps, newGameSim, readJson, winBattles } from '../tools/sim-setup.ts';

const maps = loadMaps();

interface RouteSave {
  mark: string;
  data: SaveData;
}

/** Every autosave the scripted route makes, as the save code it would write (read back). */
function routeSaves(): RouteSave[] {
  const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
  const sim = newGameSim(maps);
  const out: RouteSave[] = [];
  let mark = 'start';
  for (const item of route) {
    if (item.kind === 'mark') {
      mark = item.name;
      continue;
    }
    for (const cmd of sim.expand(item)) {
      const before = sim.saves;
      sim.press(cmd);
      if (sim.saves === before) continue;
      const decoded = decodeSave(encodeSave(toSaveData(sim.logic.state, 1_763_000_000_000)));
      if (!decoded.ok) throw new Error(decoded.error);
      out.push({ mark, data: decoded.data });
    }
  }
  return out;
}

const SAVES = routeSaves();
/** One save in every 40, every save waiting on a journey (taken on a chapter's card) and every save in a memory. */
const CHECKPOINTS = SAVES.filter((s, i) => i % 40 === 0 || typeof s.data.flags['travel.next'] === 'string' || s.data.era === 'echo');
/** The checkpoints that stand where they were saved (not waiting on a journey, which moves the party anyway). */
const STANDING = CHECKPOINTS.filter((s) => !s.data.flags['travel.next']);
const last = <T>(xs: readonly T[]): T => xs[xs.length - 1]!;

/**
 * Load a save as the browser does (runtime.ts loadStoredGame: place it, apply it, drop any running scene, run the
 * on-enter scenes), then play on until the field is free: every scene skipped, every card closed. It must end in
 * the field, on a tile the party can stand on and leave.
 */
function loadAndPlay(data: SaveData, on: Readonly<Record<string, GameMap>> = maps, fb: SaveFallbacks = SAVE_FALLBACKS) {
  const placed = placeSave(data, on, fb);
  if (!placed) throw new Error(`save at ${data.mapId} ${data.x},${data.y} did not place`);
  const map = on[placed.data.mapId]!;
  const state = newGame(map, '');
  applySave(state, placed.data);
  const sim = new Sim(new GameLogic(on, CONTENT, state));
  winBattles(sim);
  sim.logic.reset();
  for (const e of sim.logic.enterMap()) if (e.kind === 'battle') sim.onBattle?.(e.battle);
  for (let i = 0; i < 40 && sim.logic.mode !== 'field'; i++) {
    if (sim.logic.mode === 'dialogue') sim.run(['skip']);
    else sim.press('confirm');
  }
  const p = sim.logic.state.player;
  const playable = sim.logic.mode === 'field' && !!on[p.mapId] && standable(on[p.mapId]!, p.pos, p.era, sim.logic.state.flags);
  return { placed, sim, playable };
}

/** A copy of the maps with one map replaced. */
function withMap(map: GameMap, id = map.id): Record<string, GameMap> {
  return { ...maps, [id]: { ...map, id } };
}

/** The map with one tile walled off in an era (a fix redrew the map where the party stood). */
function walled(map: GameMap, era: 'present' | 'echo', tiles: readonly { x: number; y: number }[]): GameMap {
  const layer = [...map.collide[era]];
  for (const t of tiles) layer[t.y * map.width + t.x] = 1;
  return { ...map, collide: { ...map.collide, [era]: layer } };
}

describe('saves across fixes: the route as it stands (Nov 13)', () => {
  it('the route makes saves in every chapter, on cards (a journey pending) and in memories', () => {
    expect(SAVES.length).toBeGreaterThan(300);
    expect(SAVES.some((s) => typeof s.data.flags['travel.next'] === 'string')).toBe(true);
    expect(SAVES.some((s) => s.data.era === 'echo')).toBe(true);
    expect(last(SAVES).data.flags['story.hearing_called']).toBeTruthy();
  });

  it('every autosave loads where it was made, or where its journey was going, and plays', () => {
    const failed: string[] = [];
    for (const s of SAVES) {
      const placed = placeSave(s.data, maps, SAVE_FALLBACKS);
      if (!placed || placed.moved) failed.push(`@${s.mark} ${s.data.mapId} ${s.data.x},${s.data.y}`);
    }
    expect(failed).toEqual([]);
    for (const s of CHECKPOINTS) expect(loadAndPlay(s.data).playable, `@${s.mark}`).toBe(true);
  });

  it('a save on a chapter card lands where the journey goes (the card was closed by the reload, not the player)', () => {
    const onCard = SAVES.filter((s) => typeof s.data.flags['travel.next'] === 'string');
    for (const s of onCard) {
      const [mapId, spawnId] = (s.data.flags['travel.next'] as string).split('/');
      const spawn = maps[mapId!]!.spawns.find((p) => p.id === spawnId)!;
      const { placed, playable } = loadAndPlay(s.data);
      expect(placed.data).toMatchObject({ mapId, x: spawn.pos.x, y: spawn.pos.y, era: 'present' });
      expect(placed.data.flags['travel.next']).toBeUndefined();
      expect(placed.data.flags['voyage.next']).toBeUndefined();
      expect(playable, `@${s.mark}`).toBe(true);
    }
  });

  it("the safe spawns are the chapter starts, in order, and each can be stood on with that chapter's story", () => {
    const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string; flags: FlagSnapshot }>;
    const spawns = SAVE_FALLBACKS.safeSpawns!;
    expect(spawns.slice(1).map((s) => ({ map: s.map, spawn: s.spawn }))).toEqual(Object.values(starts).map((s) => ({ map: s.map, spawn: s.spawn })));
    Object.values(starts).forEach((start, i) => {
      const s = spawns[i + 1]!;
      expect(start.flags[s.after], s.after).toBeTruthy();
      // The next chapter's flag is not yet set at this start (so this is the latest safe spawn reached).
      if (spawns[i + 2]) expect(start.flags[spawns[i + 2]!.after], spawns[i + 2]!.after).toBeFalsy();
      const spawn = maps[s.map]!.spawns.find((p) => p.id === s.spawn)!;
      expect(standable(maps[s.map]!, spawn.pos, 'present', new FlagStore(start.flags)), `${s.map}/${s.spawn}`).toBe(true);
    });
    expect(maps[spawns[0]!.map]!.spawns.some((p) => p.id === spawns[0]!.spawn)).toBe(true);
  });
});

describe('saves across fixes: a map changed under the save', () => {
  it('the saved tile became a wall: the nearest open tile the party can leave, on the same map, in the same era', () => {
    for (const s of STANDING) {
      const d = s.data;
      const map = maps[d.mapId]!;
      const on = withMap(walled(map, d.era, [{ x: d.x, y: d.y }]));
      const { placed, playable } = loadAndPlay(d, on);
      expect(placed.moved).toBe(true);
      expect(placed.data.mapId).toBe(d.mapId);
      expect(Math.max(Math.abs(placed.data.x - d.x), Math.abs(placed.data.y - d.y)), `@${s.mark}`).toBeLessThanOrEqual(3);
      expect(playable, `@${s.mark}`).toBe(true);
    }
  });

  it('the saved spot was walled into a pocket: the party is moved out of it, never left sealed in', () => {
    for (const s of STANDING.filter((c) => c.data.era === 'present').slice(0, 8)) {
      const d = s.data;
      const map = maps[d.mapId]!;
      // A ring of wall around the tile: it is still open, but nothing joins it to a way in or out.
      const ring = [-1, 0, 1].flatMap((dx) => [-1, 0, 1].map((dy) => ({ x: d.x + dx, y: d.y + dy }))).filter((t) => (t.x !== d.x || t.y !== d.y) && t.x >= 0 && t.y >= 0 && t.x < map.width && t.y < map.height);
      const on = withMap(walled(map, 'present', ring));
      const { placed, playable } = loadAndPlay(d, on);
      if (map.spawns.some((sp) => sp.pos.x === d.x && sp.pos.y === d.y)) continue; // a spawn is a way in itself
      expect(placed.moved, `@${s.mark}`).toBe(true);
      expect(playable, `@${s.mark}`).toBe(true);
    }
  });

  it('the map shrank (the save is off its edge): the nearest tile inside it', () => {
    for (const s of STANDING) {
      const map = maps[s.data.mapId]!;
      const { placed, playable } = loadAndPlay({ ...s.data, x: map.width + 3, y: Math.min(s.data.y, map.height + 3) });
      expect(placed.moved).toBe(true);
      expect(placed.data.mapId).toBe(s.data.mapId);
      expect(playable, `@${s.mark}`).toBe(true);
    }
  });

  it("a memory's shimmer moved (no way back to the present from the saved spot): the party is put back in the present", () => {
    const inEcho = CHECKPOINTS.filter((s) => s.data.era === 'echo');
    expect(inEcho.length).toBeGreaterThan(0);
    for (const s of inEcho) {
      const map = maps[s.data.mapId]!;
      const flags = { ...s.data.flags, 'echo.test_only': true };
      const { placed, playable, sim } = loadAndPlay({ ...s.data, flags }, withMap({ ...map, echoZones: [] }));
      expect(placed.data.era).toBe('present');
      // Leaving the memory wipes its own flags, as any return does.
      expect(Object.keys(sim.logic.state.flags.snapshot()).some((k) => k.startsWith('echo.'))).toBe(false);
      expect(playable, `@${s.mark}`).toBe(true);
    }
  });

  it('a renamed map: the save follows the rename, on its own tile', () => {
    for (const s of STANDING) {
      const d = s.data;
      const on: Record<string, GameMap> = { ...maps, 'renamed-map': { ...maps[d.mapId]!, id: 'renamed-map' } };
      delete on[d.mapId];
      const fb: SaveFallbacks = { ...SAVE_FALLBACKS, renames: { maps: { [d.mapId]: 'renamed-map' } } };
      const { placed, playable } = loadAndPlay({ ...d, flags: { ...d.flags, [`visited.${d.mapId}`]: true } }, on, fb);
      expect(placed).toMatchObject({ moved: false, data: { mapId: 'renamed-map', x: d.x, y: d.y } });
      expect(placed.data.flags['visited.renamed-map']).toBe(true);
      expect(playable, `@${s.mark}`).toBe(true);
    }
  });

  it("a removed map: the chapter's safe spawn, with all the progress kept", () => {
    for (const s of STANDING) {
      const d = s.data;
      const on: Record<string, GameMap> = { ...maps };
      delete on[d.mapId];
      const flags = new FlagStore(d.flags);
      const expected = [...SAVE_FALLBACKS.safeSpawns!].reverse().find((sp) => (!sp.after || flags.isSet(sp.after)) && on[sp.map]);
      // Chapter 1 with its own town gone has nowhere to go: a new game (the old save kept, state.ts loadStoredSave).
      if (!expected) {
        expect(placeSave(d, on, SAVE_FALLBACKS)).toBeNull();
        continue;
      }
      const { placed, playable, sim } = loadAndPlay(d, on);
      expect(placed.data.mapId, `@${s.mark}`).toBe(expected.map);
      expect(placed.moved).toBe(true);
      for (const key of ['gold', 'party.anissa', 'act1.complete', 'act5.complete']) {
        if (d.flags[key] !== undefined) expect(sim.logic.state.flags.has(key), key).toBe(true);
      }
      expect(playable, `@${s.mark}`).toBe(true);
    }
  });

  it("a journey's destination renamed or removed: the rename is followed, else the chapter's safe spawn", () => {
    const onCard = SAVES.filter((s) => typeof s.data.flags['travel.next'] === 'string');
    for (const s of onCard) {
      const [mapId] = (s.data.flags['travel.next'] as string).split('/');
      const renamed: Record<string, GameMap> = { ...maps, 'new-landing': { ...maps[mapId!]!, id: 'new-landing' } };
      delete renamed[mapId!];
      const a = loadAndPlay(s.data, renamed, { ...SAVE_FALLBACKS, renames: { maps: { [mapId!]: 'new-landing' } } });
      expect(a.placed).toMatchObject({ moved: false, data: { mapId: 'new-landing' } });
      expect(a.playable).toBe(true);
      const gone: Record<string, GameMap> = { ...maps };
      delete gone[mapId!];
      const b = loadAndPlay(s.data, gone);
      expect(b.placed.moved).toBe(true);
      expect(b.placed.data.flags['travel.next']).toBeUndefined();
      expect(b.playable, `@${s.mark}`).toBe(true);
    }
  });

  it('every map: a save off its edge with the finished story still lands somewhere the party can leave', () => {
    const story = last(SAVES).data;
    for (const map of Object.values(maps)) {
      const placed = placeSave({ ...story, mapId: map.id, x: map.width + 2, y: map.height + 2, era: 'present' }, maps, SAVE_FALLBACKS);
      expect(placed, map.id).not.toBeNull();
      const at = maps[placed!.data.mapId]!;
      expect(standable(at, { x: placed!.data.x, y: placed!.data.y }, placed!.data.era, new FlagStore(placed!.data.flags)), map.id).toBe(true);
    }
  });
});

describe('saves across fixes: ids the new build does not know', () => {
  const late = last(STANDING).data;

  it('unknown flags, items, gear, party members and quest steps load without a crash; worn gear that is gone comes off', () => {
    const flags: FlagSnapshot = {
      ...late.flags,
      'story.removed_scene': true,
      'item.removed_item': 3,
      'shown.item.removed_item': true,
      'equip.gianna.weapon': 'removed_blade',
      'party.removed_member': true,
      'quest.removed.step': 2,
      'side.removed_quest.stage': 'started',
    };
    const { placed, sim, playable } = loadAndPlay({ ...late, flags });
    expect(playable).toBe(true);
    expect(placed.data.flags['equip.gianna.weapon']).toBe('');
    const f = sim.logic.state.flags;
    expect(() => {
      for (const m of [...partyMembers(f, RPG, 'present'), ...partyMembers(f, RPG, 'echo')]) stats(f, RPG, m);
      bagContents(f, RPG);
      for (const q of SIDE_QUESTS) sideQuestStatus(f, q);
      sim.logic.markers();
    }).not.toThrow();
    expect(bagContents(f, RPG).some(([it]) => it.id === 'removed_item')).toBe(false);
  });

  it('a renamed item keeps its count, its worn slot and its shown card', () => {
    const [id, item] = Object.entries(RPG.items).find(([, it]) => it.slot === 'weapon')!;
    const flags: FlagSnapshot = { ...late.flags, 'item.old_name': 2, 'shown.item.old_name': true, 'equip.gianna.weapon': 'old_name' };
    delete flags[`item.${id}`];
    delete flags[`shown.item.${id}`];
    const fb: SaveFallbacks = { ...SAVE_FALLBACKS, renames: { items: { old_name: id } } };
    const placed = placeSave({ ...late, flags }, maps, fb)!;
    expect(placed.data.flags[`item.${id}`]).toBe(2);
    expect(placed.data.flags[`shown.item.${id}`]).toBe(true);
    expect(placed.data.flags['equip.gianna.weapon']).toBe(item.id);
    expect(placed.data.flags['item.old_name']).toBeUndefined();
  });

  it('a renamed story flag carries over (so a scene the player has seen does not play again)', () => {
    const placed = placeSave({ ...late, flags: { ...late.flags, 'story.old_flag': true } }, maps, { ...SAVE_FALLBACKS, renames: { flags: { 'story.old_flag': 'story.new_flag' } } })!;
    expect(placed.data.flags).toMatchObject({ 'story.new_flag': true });
    expect(placed.data.flags['story.old_flag']).toBeUndefined();
  });

  it('a save taken as a fight began, its after-fight scene since removed: the field, with no scene to play', () => {
    const flags: FlagSnapshot = { ...late.flags, 'battle.after': 'removed_scene', 'fight.return': `${late.mapId}/${late.x},${late.y}`, 'battle.next': 'removed_battle' };
    const { sim, playable } = loadAndPlay({ ...late, flags });
    expect(playable).toBe(true);
    expect(sim.logic.state.flags.has('battle.after')).toBe(false);
    expect(() => sim.logic.battleOver(true)).not.toThrow();
    expect(sim.logic.mode).toBe('field');
  });

  it('a save never holds a conversation: one taken while a scene was running loads in the field', () => {
    // Saves are written as a scene ends, so the code has nowhere to keep a line or a choice: a removed or renamed
    // dialogue node cannot strand a save. The route's saves made while a scene was still on screen prove it.
    const shape = Object.keys(late).sort();
    expect(shape).toEqual(['era', 'facing', 'flags', 'mapId', 'savedAt', 'settings', 'version', 'x', 'y']);
    expect(loadAndPlay(late).sim.logic.mode).toBe('field');
  });
});

describe('saves across fixes: damaged or pasted codes', () => {
  const code = encodeSave(last(SAVES).data);

  it('a long real code survives a phone notes app: wrapped lines, spaces, invisible characters, words around it', () => {
    const wrapped = code.match(/.{1,37}/g)!.join('\r\n  ');
    const zeroWidth = code.slice(0, 50) + '​' + code.slice(50, 900) + '﻿ ' + code.slice(900);
    const chatty = `My save (Nov 17):\n"${code}".\nThanks!`;
    const lower = 'bq' + code.slice(2);
    for (const pasted of [wrapped, zeroWidth, chatty, lower, ` ${code}\n`]) {
      const r = decodeSave(pasted);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.data).toEqual(decodeSave(code).ok && (decodeSave(code) as { data: SaveData }).data);
    }
  });

  it('a pair of dashes turned into a long dash by smart punctuation reads back', () => {
    const body = Buffer.from(JSON.stringify([SAVE_VERSION, 'zetwal-town', 3, 4, 0, 0, { a: 'ûïû' }, 0, 0, 1])).toString('base64url');
    const withDashes = `${SAVE_CODE_PREFIX}${SAVE_VERSION}.${body}.${checksum(body)}`;
    if (withDashes.includes('--')) expect(decodeSave(withDashes.replace('--', '—')).ok).toBe(true);
    // Whether or not this payload has a dash pair, the long dash maps back before the checksum is read.
    expect(decodeSave(`${SAVE_CODE_PREFIX}${SAVE_VERSION}.ab—cd.${checksum('ab--cd')}`)).toMatchObject({ ok: false, error: expect.stringMatching(/unreadable/) });
  });

  it('a save whose position was written as nothing (NaN) loads on its map at the first way in', () => {
    const d = last(STANDING).data;
    const body = Buffer.from(JSON.stringify([SAVE_VERSION, d.mapId, null, null, 0, 0, d.flags, 0, 0, 1])).toString('base64url');
    const r = decodeSave(`${SAVE_CODE_PREFIX}${SAVE_VERSION}.${body}.${checksum(body)}`);
    expect(r).toMatchObject({ ok: true, defaulted: ['position'] });
    if (!r.ok) return;
    const { placed, playable } = loadAndPlay(r.data);
    expect(placed.data.mapId).toBe(d.mapId);
    expect(playable).toBe(true);
  });

  it('every save version up to this one reads (a version bump migrates, never rejects)', () => {
    const d = last(SAVES).data;
    for (let v = 1; v <= SAVE_VERSION; v++) {
      const fields = [v, d.mapId, d.x, d.y, 0, 0, d.flags, 0, 0, ...(v >= 2 ? [1] : [])];
      const body = Buffer.from(JSON.stringify(fields)).toString('base64url');
      expect(decodeSave(`${SAVE_CODE_PREFIX}${v}.${body}.${checksum(body)}`).ok, `version ${v}`).toBe(true);
    }
  });

  it('a corrupted stored save is kept aside and a stored save pasted with line breaks loads', () => {
    const store = new Map<string, string>([['k', code.slice(0, -20)]]);
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) };
    expect(loadStoredSave(storage, 'k', maps, SAVE_FALLBACKS)).toMatchObject({ status: 'invalid', kept: code.slice(0, -20) });
    store.set('k', code.replace(/(.{60})/g, '$1\n'));
    expect(loadStoredSave(storage, 'k', maps, SAVE_FALLBACKS)).toMatchObject({ status: 'loaded' });
  });

  it("the safe spawn fallback reads the save's own chapter", () => {
    const early = SAVES[0]!.data;
    expect(safeSpawn(early, maps, SAVE_FALLBACKS)).toMatchObject({ mapId: 'zetwal-town' });
    expect(safeSpawn(last(SAVES).data, maps, SAVE_FALLBACKS)).toMatchObject({ mapId: 'seat-concourse' });
  });
});
