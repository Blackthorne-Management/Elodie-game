// Z-4 The Seventh Stone (Chapter 1's secret side quest; SIDE-QUESTS.md Z-4, SECRET-ITEMS.md 1, PUZZLES.md S-ZET): the
// mourner gives it after the lamp, nothing points to it before, the first reading plays in the temple's memory each
// visit until the seventh stone is carved, the stones answer only in the reading's order, Solange's Quill is given once,
// the main route never needs it, and with the Quill the Chapter 10 Muster scene at the name stones now plays.
// (The puzzle's solution and cheats are replayed in tests/puzzles.test.ts, puzzle `zetwal_stones`.)

import { describe, expect, it } from 'vitest';
import { CONTENT } from '../src/data/content.ts';
import { LATER_STORY_FLAGS } from '../src/data/encounters.ts';
import { PUZZLES } from '../src/data/puzzles.ts';
import { RPG } from '../src/data/rpg.ts';
import { PLINTH, PLINTH_STEP, READING_ORDER, STONES, Z4 } from '../src/data/seventhStone.ts';
import { isWalkable } from '../src/engine/grid.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { TEMPLE } from '../src/data/muster.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { mysteryQuests, sideNudges, storyGoal } from '../src/engine/guide.ts';
import { currentObjective, questForJournal } from '../src/engine/quests.ts';
import { CHAPTERS } from '../src/data/quests.ts';
import { gold, itemCount, localPillar, xp } from '../src/engine/rpg.ts';
import { settleRewards, sideQuestStatus, visibleSteps } from '../src/engine/sideQuests.ts';
import { showcaseView, pendingShowcases } from '../src/engine/showcase.ts';
import { parseRoute, type Sim } from '../src/engine/sim.ts';
import { stageCues } from '../src/engine/stage.ts';
import { activeNpcs, activeObjects } from '../src/engine/world.ts';
import { loadMaps, newGameSim, puzzleFiles, puzzleSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const temple = maps['zetwal-temple']!;
const quest = SIDE_QUESTS.find((q) => q.id === 'seventh_stone')!;
const puzzle = PUZZLES.find((p) => p.id === 'zetwal_stones')!;

/** Plays a conversation to its end, taking the choices that start with each pick in turn; returns the lines shown. */
function talk(flags: FlagStore, id: string, picks: string[] = []): string[] {
  const r = new DialogueRunner(CONTENT.dialogue[id]!, CONTENT.speakers, flags);
  const out: string[] = [];
  for (let v = r.view(), i = 0; v.kind !== 'end' && i < 200; v = r.view(), i++) {
    out.push(v.text);
    if (v.kind === 'choice') {
      const want = picks.shift();
      const c = v.choices.find((x) => want !== undefined && x.text.startsWith(want));
      if (!c) throw new Error(`${id}: no choice "${want}" in ${v.choices.map((x) => x.text).join(' / ')}`);
      r.choose(c.index);
    } else r.advance();
  }
  expect(picks, `${id}: unused picks`).toEqual([]);
  return out;
}

const flagsOf = (snap: FlagSnapshot) => {
  const f = new FlagStore();
  f.load(snap);
  return f;
};

/** After the lamp, the quest not taken. */
const AFTER_LAMP: FlagSnapshot = { ...puzzle.flags, [Z4.accepted]: false };

/** Reads the dialogue the sim is in to its end (first choice each time), returning what it showed. */
function readOut(sim: Sim): string[] {
  const out: string[] = [];
  for (let i = 0; i < 300 && sim.logic.mode === 'dialogue'; i++) {
    const v = sim.logic.view();
    if (v.kind === 'end') break;
    out.push(v.text);
    sim.press('confirm');
  }
  return out;
}

describe('Z-4 The Seventh Stone: found, not pointed to', () => {
  it('is a secret quest: never a mystery quest, no nudge from Anissa, not on the arrow while the errands are left', () => {
    expect(quest.secret).toBe(true);
    expect(quest.nudge).toBeUndefined();
    expect(quest.available).toBeUndefined();
    const f = flagsOf(AFTER_LAMP);
    expect(mysteryQuests(SIDE_QUESTS, f).map((q) => q.id)).not.toContain('seventh_stone');
    expect(sideNudges(SIDE_QUESTS, f).join(' ')).not.toContain('seventh');
  });

  it('the mourner offers it only after the lamp; "Some other night" leaves it, "I\'ll try" takes it', () => {
    const before = flagsOf({ ...AFTER_LAMP, 'story.anissa_woke': false });
    expect(talk(before, 'mourner_talk').join(' ')).toContain('third stone');
    expect(before.isSet(Z4.accepted)).toBe(false);
    const f = flagsOf(AFTER_LAMP);
    const offer = talk(f, 'mourner_talk', ['Some other night']).join(' ');
    expect(offer).toContain('The seventh is blank');
    expect(f.isSet(Z4.accepted)).toBe(false);
    expect(sideQuestStatus(f, quest)).toBe('unknown');
    expect(talk(f, 'mourner_talk', ["I'll try"]).join(' ')).toContain('sunwise from the plinth');
    expect(sideQuestStatus(f, quest)).toBe('active');
    expect(visibleSteps(f, quest).map((s) => s.done)).toEqual([false]);
  });

  it('the Chapter 1 route never takes it, the arrow for the errands never leads to it, and Yari sails without it', () => {
    const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
    const sim = newGameSim(maps);
    let checked = false;
    for (const item of route) {
      sim.run([item]);
      const f = sim.logic.state.flags;
      const here = questForJournal(CHAPTERS, sim.logic.state.player.mapId, f);
      if (!checked && here && currentObjective(here, f)?.id === 'errands') {
        // "Unfinished business" follows the side quests; taken now, Z-4 is on the Quests page but not on that arrow.
        const probe = flagsOf({ ...f.snapshot(), [Z4.accepted]: true });
        expect(sideQuestStatus(probe, quest)).toBe('active');
        for (const mapId of ['zetwal-temple', 'zetwal-town']) {
          const goal = storyGoal(questForJournal(CHAPTERS, mapId, probe), probe, SIDE_QUESTS, mapId, 'present');
          expect(goal, mapId).not.toBeNull();
          expect(quest.steps.flatMap((s) => [...(s.goals ?? []), ...(s.echoGoals ?? [])]).some((g) => g.map === goal!.map && g.at.x === goal!.at.x && g.at.y === goal!.at.y), mapId).toBe(false);
        }
        checked = true;
      }
      if (item.kind === 'mark' && item.name === 'yucayeque') break;
    }
    expect(checked).toBe(true);
    const f = sim.logic.state.flags;
    expect(f.isSet('act1.complete')).toBe(true);
    expect(f.isSet(Z4.accepted)).toBe(false);
    expect(itemCount(f, 'solange_quill')).toBe(0);
  });
});

describe('Z-4: the stones, the memory and the plinth', () => {
  it('the seven stones ring Solange\'s plinth, open on one side; the seventh is beside the Muster\'s tile for Yari', () => {
    // Every stone is solid ground; the plinth is a solid object; its one open side is the step in front of it.
    for (const p of Object.values(STONES)) expect(isWalkable(temple, 'present', p), `${p.x},${p.y}`).toBe(false);
    expect(activeObjects(temple, 'present', flagsOf({})).some((o) => o.id === 'solange_plinth' && o.solid && o.area.x === PLINTH.x && o.area.y === PLINTH.y)).toBe(true);
    expect(isWalkable(temple, 'present', PLINTH_STEP)).toBe(true);
    expect(isWalkable(temple, 'echo', PLINTH_STEP)).toBe(true);
    expect(Object.keys(STONES)).toHaveLength(7);
    expect(STONES[7]).toEqual({ x: TEMPLE.seventhStone.x - 1, y: TEMPLE.seventhStone.y });
    expect(READING_ORDER).toEqual([3, 1, 5, 2, 6, 4, 7]);
  });

  it('the memory plays the first reading as each visit begins, until the seventh is carved; the readers walk it out', () => {
    const sim = puzzleSim(puzzle, maps);
    sim.run(['down*2', 'right*2', 'down', 'right', 'echo']);
    const first = readOut(sim).join(' ');
    expect(first).toContain('The first reading of the names');
    expect(first).toContain("That is not a Zetwal name");
    expect(sim.logic.state.flags.isSet(Z4.watched)).toBe(true);
    // Back and in again: it plays again (the order is shown once a visit).
    sim.run(['echo', 'skip', 'echo']);
    expect(readOut(sim).join(' ')).toContain('The first reading of the names');
    // The order the chimes sound in is the stones' order, the seventh silent.
    const script = CONTENT.dialogue.temple_echo_enter!;
    const chimes = script.nodes.z4_reading!.lines.map((l) => l.fx).filter((x): x is string => !!x);
    expect(chimes).toEqual(READING_ORDER.slice(0, 6).map((n) => `stone_${n}`));
    // Shown, not told: six readers come in and go, the scout walks to the seventh stone, the stonecutter leaves.
    const cues = stageCues(script);
    expect(cues.filter((c) => c.do === 'enter').map((c) => c.actor).sort()).toEqual([1, 2, 3, 4, 5, 6].map((n) => `reader_${n}`));
    expect(cues.filter((c) => c.do === 'exit').map((c) => c.actor).sort()).toEqual(['reader_1', 'reader_2', 'reader_3', 'reader_4', 'reader_5', 'reader_6', 'stonecutter'].sort());
    expect(cues).toContainEqual(expect.objectContaining({ do: 'walk', actor: 'npc:echo_caona_scout' }));
  });

  it('wrong stones knock and start the order again; Anissa\'s second hint at three, the answer at five', () => {
    const f = flagsOf({ ...puzzle.flags });
    expect(talk(f, 'name_stone_3').join(' ')).toContain('third stone');
    expect(f.get(Z4.seq)).toBe(1);
    expect(talk(f, 'name_stone_1').join(' ')).toContain('first stone');
    expect(f.get(Z4.seq)).toBe(2);
    expect(talk(f, 'name_stone_6').join(' ')).toContain('dull knock');
    expect(f.get(Z4.seq)).toBe(0);
    talk(f, 'name_stone_6');
    expect(talk(f, 'name_stone_6').join(' ')).toContain('Watch who goes where');
    talk(f, 'name_stone_6');
    expect(talk(f, 'name_stone_6').join(' ')).toContain('3, 1, 5, 2, 6, 4, then the seventh');
    expect(talk(f, 'name_stone_6')).toEqual(['The sixth stone gives a dull knock, and all seven fall silent.']);
    // The seventh is dead until it is carved, and touching it changes nothing.
    for (const n of [3, 1, 5, 2, 6, 4]) talk(f, `name_stone_${n}`);
    expect(f.get(Z4.seq)).toBe(6);
    expect(talk(f, 'name_stone_7').join(' ')).toContain('silent under');
    expect(f.get(Z4.seq)).toBe(6);
    f.set(Z4.anchor, true);
    expect(talk(f, 'name_stone_7').join(' ')).toContain('all seven sing');
    expect(f.isSet(Z4.answered)).toBe(true);
  });

  it('the plinth gives Solange\'s Quill once, with the Sun Locket\'s kind of showcase, and the reward is paid once', () => {
    const sim = puzzleSim(puzzle, maps).run(puzzleFiles(puzzle.id).solution);
    const f = sim.logic.state.flags;
    expect(f.isSet(Z4.done)).toBe(true);
    expect(itemCount(f, 'solange_quill')).toBe(1);
    expect(pendingShowcases(f, RPG).map((i) => i.id)).toContain('solange_quill');
    expect(showcaseView(f, RPG.items.solange_quill!).banner).toBe('Legendary item');
    // The plinth again: empty; still one Quill.
    expect(talk(f, 'solange_plinth').join(' ')).toContain('drawer empty');
    expect(itemCount(f, 'solange_quill')).toBe(1);
    const g = gold(f, RPG);
    const x = xp(f, RPG, 'gianna');
    const inf = localPillar(f, RPG, 'influence', 'zetwal');
    expect(settleRewards(f, RPG, SIDE_QUESTS).map((q) => q.id)).toContain('seventh_stone');
    expect(gold(f, RPG)).toBe(g + 80);
    expect(xp(f, RPG, 'gianna')).toBe(x + 30);
    expect(localPillar(f, RPG, 'influence', 'zetwal')).toBe(inf + 1);
    expect(itemCount(f, 'solange_quill')).toBe(1);
    expect(settleRewards(f, RPG, SIDE_QUESTS).map((q) => q.id)).not.toContain('seventh_stone');
    // Done: the stones go back to the name stones as built, and the mourner listens.
    expect(activeObjects(temple, 'present', f).some((o) => o.id.startsWith('name_stone_'))).toBe(false);
    expect(talk(f, 'mourner_talk').join(' ')).toContain('Seven voices');
  });

  it('closes unfinished when the fleet sails (Chapter 10); never offered once it is closed', () => {
    const f = flagsOf({ ...puzzle.flags, 'story.fleet_sailed': true });
    expect(sideQuestStatus(f, quest)).toBe('closed');
    const g = flagsOf({ ...AFTER_LAMP, 'story.fleet_sailed': true });
    expect(sideQuestStatus(g, quest)).toBe('unknown');
  });
});

describe('Z-4 and the Quill\'s Chapter 10 bonus (SECRET-ITEMS.md 1)', () => {
  it('Solange\'s Quill is set by Chapter 1 now, so it is no longer a later chapter\'s flag', () => {
    expect(LATER_STORY_FLAGS).not.toContain('item.solange_quill');
  });

  it('with the Quill from Z-4, the Muster scene at the name stones plays: Yari at the carved seventh stone, +2 in Xaraguá', () => {
    const sim = puzzleSim(puzzle, maps).run(puzzleFiles(puzzle.id).solution);
    const f = sim.logic.state.flags;
    // Chapter 10: home again (the cane cutter is back on his road), the Muster begun.
    f.set('story.zetwal_return', true);
    f.set('story.muster_begun', true);
    // At the Muster the stones are the name stones as built again, and the seventh still has its sun.
    const at = (x: number, y: number) => activeObjects(temple, 'present', f).filter((o) => o.area.x <= x && x < o.area.x + o.area.width && o.area.y <= y && y < o.area.y + o.area.height);
    const seventh = at(STONES[7]!.x, STONES[7]!.y);
    expect(seventh.find((o) => o.dialogue)?.id).toBe('name_stones');
    expect(seventh.map((o) => o.id)).toContain('seventh_stone_sun');
    expect(activeNpcs(temple, 'present', f).some((n) => n.pos.x === TEMPLE.seventhStone.x && n.pos.y === TEMPLE.seventhStone.y)).toBe(false);
    const before = localPillar(f, RPG, 'influence', 'xaragua');
    expect(talk(f, 'name_stones').join(' ')).toContain('A Yaguana name, on Zetwal\'s list');
    expect(localPillar(f, RPG, 'influence', 'xaragua')).toBe(before + 2);
  });
});
