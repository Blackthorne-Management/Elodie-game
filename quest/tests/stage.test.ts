// Stage directions (owner rule, Oct 17: story moments are shown, not told): every staged scene names real looks
// and only moves people who are on stage; and the Crown attack is acted out, not narrated.

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
});
