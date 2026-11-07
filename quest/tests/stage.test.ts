// Stage directions (owner rule, Oct 17: story moments are shown, not told): every staged scene names real looks
// and only moves people who are on stage; and the Crown attack and Chapter 1's moments are acted out, not narrated.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { NPC_SPRITES } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { stageCues, stageProblems, type StageCue } from '../src/engine/stage.ts';
import type { DialogueScript } from '../src/engine/dialogue.ts';
import { hidesEachOther } from '../src/engine/partyPlacement.ts';
import { HARBOR } from '../src/data/muster.ts';
import { PIER_ROOT } from '../src/data/war.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const looks = new Set(Object.keys(NPC_SPRITES));
const script = (id: string): DialogueScript => CONTENT.dialogue[id]!;
const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string }>;

describe('stage directions', () => {
  it('every staged scene uses looks that exist and moves only people on stage', () => {
    const problems = Object.values(CONTENT.dialogue).flatMap((d) => stageProblems(d, looks, new Set(Object.keys(CONTENT.npcs))));
    expect(problems).toEqual([]);
  });

  it('flags a walk before an entrance, an unknown look, and a camera on nobody', () => {
    const bad: DialogueScript = {
      id: 'bad',
      start: 'a',
      nodes: {
        a: {
          lines: [
            { text: '', stage: [{ do: 'walk', actor: 'x', to: { x: 1, y: 1 } }] },
            { text: '', stage: [{ do: 'place', actor: 'y', look: 'nobody', at: { x: 1, y: 1 } }] },
            { text: '', stage: [{ do: 'look', actor: 'z' }] },
          ],
        },
      },
    };
    expect(stageProblems(bad, looks)).toHaveLength(3);
  });

  it('the Crown attack: the marines march in up to Gianna, run off after the fight, and Anaco is led out', () => {
    const into = stageCues(script('xaragua_proof'));
    const entered = (cues: StageCue[]) => cues.filter((c) => c.do === 'enter').map((c) => c.actor);
    const left = (cues: StageCue[]) => cues.filter((c) => c.do === 'exit').map((c) => c.actor);
    expect(entered(into)).toEqual(expect.arrayContaining(['marine', 'musketeer', 'lieutenant']));
    // The lieutenant ends up face to face with Gianna (at 9,6 by the council's doorway, Anissa at her side).
    const lt = into.find((c) => c.do === 'enter' && c.actor === 'lieutenant') as Extract<StageCue, { do: 'enter' }>;
    expect(Math.abs(lt.to.x - 9) + Math.abs(lt.to.y - 6)).toBe(2);
    const after = stageCues(script('caney_after'));
    expect(left(after)).toEqual(expect.arrayContaining(['marine', 'musketeer', 'lieutenant', 'anaco', 'captain']));
    expect(entered(after)).toEqual(expect.arrayContaining(['captain', 'guard_a', 'guard_b']));
    const lines = Object.values(script('caney_after').nodes).flatMap((n) => n.lines);
    expect(lines.some((l) => l.text.includes('Beaten by children'))).toBe(true);
    // Nothing is told in narration alone: every line is someone speaking.
    expect(lines.every((l) => l.speaker !== '')).toBe(true);
  });

  // Review 1 (Oct 21), finding 4: the captain comes with more men than the children just beat, muskets on the
  // elders, and says so; only then does Anaco give himself up.
  it('Anaco gives himself up to a firing line aimed at the elders, not to fewer men than were just beaten', () => {
    const after = stageCues(script('caney_after'));
    const guards = after.filter((c) => c.do === 'enter' && c.actor.startsWith('guard_'));
    expect(guards.length).toBeGreaterThanOrEqual(4);
    expect(guards.length).toBeLessThanOrEqual(6);
    for (const who of ['elder_charter', 'elder_resist', 'elder_undecided']) expect(after).toContainEqual(expect.objectContaining({ do: 'place', actor: who }));
    const lines = Object.values(script('caney_after').nodes).flatMap((n) => n.lines);
    const threat = lines.findIndex((l) => l.speaker === 'crown_captain' && l.text.includes('elders die first'));
    const chains = lines.findIndex((l) => l.text.includes('no use to me in chains'));
    expect(threat).toBeGreaterThan(0);
    expect(chains).toBeGreaterThan(threat);
  });
});

// Chapter 1, the same in the demo and the full game (owner, Oct 17: identical up to leaving Zetwal).
describe('Chapter 1 is acted out on the map', () => {
  it('Mother walks out through the east gate; Grandmother turns to the drawer for the locket', () => {
    const elodie = stageCues(script('elodie_talk'));
    expect(elodie).toContainEqual(expect.objectContaining({ do: 'exit', actor: 'npc:elodie' }));
    const locket = stageCues(script('anicette_talk'));
    expect(locket.filter((c: StageCue) => c.do === 'face' && c.actor === 'npc:anicette')).toHaveLength(2);
  });

  // Demo review, Oct 17 (finding 7): the lamp night and Yari's arrival are shown, not told.
  it('the lamp: the island lights up, the pilgrims come in for the names, and a hooded figure watches, then leaves', () => {
    const cues = stageCues(script('gaze_lamp'));
    expect(cues).toContainEqual({ do: 'sync' }); // the lamp and the lanterns catch
    const entered = cues.filter((c) => c.do === 'enter').map((c) => c.actor);
    expect(entered).toEqual(expect.arrayContaining(['pilgrim_a', 'pilgrim_b', 'pilgrim_c', 'pilgrim_d', 'hooded']));
    const exits = cues.filter((c) => c.do === 'exit');
    expect(exits.map((c) => c.actor).sort()).toEqual(['hooded', 'pilgrim_a', 'pilgrim_b', 'pilgrim_c', 'pilgrim_d']);
    expect(exits.find((c) => c.actor === 'hooded')).toMatchObject({ to: { x: 15, y: 18 } }); // down to the dock
  });

  // Batch D (Oct 19): the back third's moments are acted out too.
  it('the engraver walks in through the front doors to the clerk\'s desk, turns to Gianna, and walks out', () => {
    const cues = stageCues(script('hall_clerk_talk'));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'enter', actor: 'engraver', look: 'engraver', from: { x: 19, y: 28 } }));
    expect(cues).toContainEqual({ do: 'face', actor: 'engraver', facing: 'left' }); // "Let me see you..."
    expect(cues).toContainEqual(expect.objectContaining({ do: 'exit', actor: 'engraver', to: { x: 19, y: 28 } }));
  });

  it("the Crown's consul walks in from the gallery, glances away, and walks out of the Hall for good", () => {
    const cues = stageCues(script('chancellor_talk'));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'walk', actor: 'npc:crown_consul', to: { x: 33, y: 6 } }));
    expect(cues).toContainEqual({ do: 'face', actor: 'npc:crown_consul', facing: 'down-left' });
    const exit = cues.findIndex((c) => c.do === 'exit' && c.actor === 'npc:crown_consul');
    expect(exit).toBeGreaterThan(0);
    expect(cues[exit + 1]).toEqual({ do: 'sync' }); // gone from the map at once (zetwal-hall.ts `if`)
  });

  it('at dawn Grandmother walks across to the dock and Grandfather walks down from the temple; Yari and Anissa board', () => {
    const cues = stageCues(script('yari_talk'));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'enter', actor: 'anicette', look: 'anicette' }));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'walk', actor: 'npc:patricio_old' }));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'exit', actor: 'yari', to: { x: 16, y: 18 } }));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'exit', actor: 'follower', to: { x: 16, y: 18 } }));
  });

  it('the cane cutter turns to the stones to read them with Gianna, and walks up to the lamp to say her name', () => {
    const cues = stageCues(script('cane_cutter_talk'));
    expect(cues).toContainEqual({ do: 'face', actor: 'npc:cane_cutter', facing: 'left' });
    expect(cues).toContainEqual(expect.objectContaining({ do: 'walk', actor: 'npc:cane_cutter', to: { x: 15, y: 4 } }));
  });

  it("Yari comes up from her canoe to meet them, and turns to Gianna", () => {
    const cues = stageCues(script('yari_talk'));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'enter', actor: 'yari', from: { x: 16, y: 18 } }));
    expect(cues).toContainEqual({ do: 'face', actor: 'yari', facing: 'player' });
  });
});

// Review Nov 1, finding 8: people stacked in staged scenes. Sprites are two tiles tall, so two people in one column on
// neighbouring rows hide each other; a staged group keeps a free row between people in a file, and nobody shares a tile.
describe('staged groups stand apart', () => {
  type Spot = { x: number; y: number };
  /**
   * Who stands in one column on neighbouring rows (or one tile) once each line's cues have played, from the scene's first
   * staged line (before it, the party stands where it walked in: the followers' own placement).
   */
  function crowding(id: string, start: Record<string, Spot>): string[] {
    const at = new Map<string, Spot>(Object.entries(start));
    const out: string[] = [];
    let staged = false;
    for (const n of Object.values(script(id).nodes)) {
      for (const l of n.lines) {
        staged ||= (l.stage ?? []).length > 0;
        if (!staged) continue;
        for (const c of l.stage ?? []) {
          if (c.do === 'place') at.set(c.actor, c.at);
          else if (c.do === 'enter' || c.do === 'walk') at.set(c.actor, c.to);
          else if (c.do === 'exit') at.delete(c.actor);
        }
        const people = [...at.entries()];
        for (let i = 0; i < people.length; i++) {
          for (let j = i + 1; j < people.length; j++) {
            const [a, p] = people[i]!;
            const [b, q] = people[j]!;
            if (p.x === q.x && Math.abs(p.y - q.y) <= 1) out.push(`${id} "${l.text.slice(0, 30)}": ${a} ${p.x},${p.y} and ${b} ${q.x},${q.y}`);
          }
        }
      }
    }
    return [...new Set(out)];
  }

  it('the pier, the caney, the forge, the reveal and the boar keep a free row between people in a file', () => {
    // Review Nov 7, finding 11: the Yucayeque scene plays at the pier's root on the sand (data/war.ts PIER_ROOT).
    const R = PIER_ROOT;
    const pier = { player: R.gianna, follower: R.anissa, pier_marine_a: R.marines[0], pier_marine_b: R.marines[1] };
    expect(crowding('xaragua_arrival', { ...pier, 'npc:marine_sergeant': R.sergeant })).toEqual([]);
    expect(crowding('pier_after', { player: R.gianna, follower: R.anissa })).toEqual([]);
    expect(crowding('xaragua_proof', { player: { x: 9, y: 6 }, follower: { x: 10, y: 6 } })).toEqual([]);
    expect(crowding('caney_after', { player: { x: 9, y: 6 }, follower: { x: 10, y: 6 } })).toEqual([]);
    expect(crowding('forge_arrive', { player: { x: 26, y: 9 } })).toEqual([]);
    expect(crowding('boar_ambush', { player: { x: 9, y: 12 }, follower: { x: 8, y: 12 } })).toEqual([]);
    expect(crowding('rael_after', { player: { x: 32, y: 9 } })).toEqual([]);
  });

  // Review Nov 7, finding 9: not a list of scenes but every one. Whoever a line brings on (place, enter, and a walk of
  // someone it brought on) stands clear of the others it brings on: nobody one above the other in a column with no free
  // row between (a line-up side by side is fine). People already on the map are the named scenes' check above.
  it('every line that brings people on keeps a free row between those it brings on', () => {
    const out: string[] = [];
    for (const d of Object.values(CONTENT.dialogue)) {
      for (const [node, n] of Object.entries(d.nodes)) {
        for (const l of n.lines) {
          const set = new Map<string, Spot>();
          for (const c of l.stage ?? []) {
            if (c.do === 'place') set.set(c.actor, c.at);
            else if (c.do === 'enter') set.set(c.actor, c.to);
            else if (c.do === 'walk' && set.has(c.actor)) set.set(c.actor, c.to);
            else if (c.do === 'exit') set.delete(c.actor);
          }
          const people = [...set.entries()];
          for (const [i, [a, p]] of people.entries()) {
            for (const [b, q] of people.slice(i + 1)) {
              if (hidesEachOther(p, q) || (p.x === q.x && p.y === q.y)) out.push(`${d.id}/${node} "${l.text.slice(0, 30)}": ${a} ${p.x},${p.y} and ${b} ${q.x},${q.y}`);
            }
          }
        }
      }
    }
    expect(out).toEqual([]);
  });

  // Review Nov 7, finding 1: the Muster lands on the sand, not on the two-tile pier where nine people stood in columns.
  it('the Muster lands on the sand at the pier\'s root; the family stop a free row off; Anissa comes to Gianna\'s side', () => {
    const harbor = loadMaps()['zetwal-harbor']!;
    const spawn = harbor.spawns.find((sp) => sp.id === 'muster_landing')!;
    expect(spawn.pos).toEqual(HARBOR.landing);
    expect(harbor.triggers.find((t) => t.dialogue === 'muster_landing')?.area).toMatchObject({ x: HARBOR.landing.x, y: HARBOR.landing.y });
    // The beach rows (9 and 10), off the pier (x 30 and 31 from row 11).
    expect(HARBOR.landing.y).toBeLessThan(11);
    const cues = stageCues(script('muster_landing'));
    for (const c of cues) if (c.do === 'enter') expect(Math.abs(c.to.y - HARBOR.landing.y), c.actor).toBeGreaterThanOrEqual(2);
    expect(cues).toContainEqual(expect.objectContaining({ do: 'walk', actor: 'follower', to: { x: HARBOR.landing.x - 1, y: HARBOR.landing.y } }));
    expect(starts['10']).toMatchObject({ map: 'zetwal-harbor', spawn: 'muster_landing' });
  });

  it('the boar charges out of the cane onto the map before the fight, and the harbor camera crosses to the ships', () => {
    expect(stageCues(script('boar_ambush'))).toContainEqual(expect.objectContaining({ do: 'enter', actor: 'boar', look: 'cane_boar' }));
    const harbor = stageCues(script('muster_landing'));
    for (const spot of ['harbor', 'west_piers', 'east_piers']) expect(harbor).toContainEqual({ do: 'look', actor: spot });
  });
});

// Review Nov 7, finding 2: after a fight the foes are only pictures (gone when the fight starts) or NPCs a flag hides, so a
// line saying they run, ride, go out, scatter or flee must be acted out (place them where they stood, then exit them).
describe('the foes who leave after a fight are seen to go', () => {
  it('every scene a fight plays after, whose narration sends someone off, has them exit on the map', () => {
    const after = new Set<string>();
    const read = (set: Readonly<Record<string, unknown>> | undefined) => {
      const v = set?.['battle.after'];
      if (typeof v === 'string') after.add(v);
    };
    for (const d of Object.values(CONTENT.dialogue)) {
      for (const n of Object.values(d.nodes)) {
        read(n.set);
        for (const l of n.lines) read(l.set);
        for (const c of n.choices ?? []) read(c.set);
      }
    }
    expect(after.size).toBeGreaterThan(20);
    const leaving = /\b(runs?|ran|rides?|rode|go(?:es)? out|went out|scatters?|scattered|flees?|fled|bolts?)\b/i;
    const told: string[] = [];
    for (const id of after) {
      const d = script(id);
      expect(d, id).toBeDefined();
      const said = Object.values(d.nodes).flatMap((n) => n.lines.filter((l) => !(l.speaker ?? n.speaker) && leaving.test(l.text)));
      if (said.length > 0 && !stageCues(d).some((c) => c.do === 'exit')) told.push(`${id}: ${said[0]!.text}`);
    }
    expect(told).toEqual([]);
  });
});
