// Stage directions (owner rule, Oct 17: story moments are shown, not told): every staged scene names real looks
// and only moves people who are on stage; and the Crown attack and Chapter 1's moments are acted out, not narrated.

import { describe, expect, it } from 'vitest';
import { NPC_SPRITES } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { stageCues, stageProblems, type StageCue } from '../src/engine/stage.ts';
import type { DialogueScript } from '../src/engine/dialogue.ts';

const looks = new Set(Object.keys(NPC_SPRITES));
const script = (id: string): DialogueScript => CONTENT.dialogue[id]!;

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
    const pier = { player: { x: 21, y: 25 }, follower: { x: 21, y: 26 }, pier_marine_a: { x: 22, y: 21 }, pier_marine_b: { x: 21, y: 21 } };
    expect(crowding('xaragua_arrival', { ...pier, 'npc:marine_sergeant': { x: 21, y: 23 } })).toEqual([]);
    expect(crowding('pier_after', { player: { x: 21, y: 25 }, follower: { x: 21, y: 26 } })).toEqual([]);
    expect(crowding('xaragua_proof', { player: { x: 9, y: 6 }, follower: { x: 10, y: 6 } })).toEqual([]);
    expect(crowding('caney_after', { player: { x: 9, y: 6 }, follower: { x: 10, y: 6 } })).toEqual([]);
    expect(crowding('forge_arrive', { player: { x: 26, y: 9 } })).toEqual([]);
    expect(crowding('boar_ambush', { player: { x: 9, y: 12 }, follower: { x: 8, y: 12 } })).toEqual([]);
    expect(crowding('rael_after', { player: { x: 32, y: 9 } })).toEqual([]);
  });

  it('the boar charges out of the cane onto the map before the fight, and the harbor camera crosses to the ships', () => {
    expect(stageCues(script('boar_ambush'))).toContainEqual(expect.objectContaining({ do: 'enter', actor: 'boar', look: 'cane_boar' }));
    const harbor = stageCues(script('muster_landing'));
    for (const spot of ['harbor', 'west_piers', 'east_piers']) expect(harbor).toContainEqual({ do: 'look', actor: spot });
  });
});
