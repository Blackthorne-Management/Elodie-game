// Chapter 3, Ardencia (The Trial of Blades), beat by beat, from the scripted route's own marks: the chapter starts
// (?chapter=3 and ?chapter=4), the gate, the Echo zones that open only when the story allows, the day before noon,
// the Lower Town by night, the trial as a fight meant to be lost, the saves the review asked for (in the middle of
// the trial, the question, the cell, the bats, the tunnel's end and the camp), the forge's channels and lever, the
// tunnel that shuts behind the party, and the city shut to them after the escape.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BATTLES, battleDef } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { CHAPTERS } from '../src/data/quests.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import type { FlagSnapshot } from '../src/engine/flags.ts';
import { FIGHT_RETURN_FLAG, GameLogic } from '../src/engine/game.ts';
import { recordLoss } from '../src/engine/gameOver.ts';
import { storyGoal } from '../src/engine/guide.ts';
import { currentObjective, questForJournal } from '../src/engine/quests.ts';
import { partyMembers } from '../src/engine/rpg.ts';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { applySave, newGame, toSaveData } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));

/** The game as the route leaves it at a marker. */
function simAt(mark: string): Sim {
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) return sim;
    sim.run([item]);
  }
  throw new Error(`No mark @${mark}`);
}

/** Save to a code and load it into a fresh game (what closing the app and opening it again does). */
function reload(sim: Sim): Sim {
  const decoded = decodeSave(encodeSave(toSaveData(sim.logic.state, 0)));
  if (!decoded.ok) throw new Error(decoded.error);
  const state = newGame(maps[decoded.data.mapId]!, maps[decoded.data.mapId]!.spawns[0]!.id);
  applySave(state, decoded.data);
  const fresh = newGameSim(maps);
  fresh.logic.reset(state);
  fresh.logic.enterMap();
  return fresh;
}

const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string; flags: FlagSnapshot }>;

function startAt(chapter: string): GameLogic {
  const at = starts[chapter]!;
  const state = newGame(maps[at.map]!, at.spawn);
  state.flags.load(at.flags);
  return new GameLogic(maps, CONTENT, state);
}

describe('the chapter starts', () => {
  it('?chapter=3: on the long pier after Chapter 2\'s card; the trader waits; the Journal opens Chapter 3 at "Sail for Ardencia"', () => {
    const logic = startAt('3');
    expect(logic.state.player.mapId).toBe('zetwal-harbor');
    expect(logic.npcs().map((n) => n.npc)).toContain('trader_captain');
    const quest = questForJournal(CHAPTERS, 'zetwal-harbor', logic.state.flags);
    expect(quest?.id).toBe('act3');
    expect(currentObjective(quest!, logic.state.flags)?.id).toBe('sail');
    expect(storyGoal(quest, logic.state.flags, SIDE_QUESTS)).toEqual({ map: 'zetwal-harbor', at: { x: 30, y: 14 } });
  });

  it('Chapter 2\'s ending names Rael as Benny\'s son, and Ardencia as across the strait (the voyage)', () => {
    const text = JSON.stringify([CONTENT.dialogue.zetwal_return, CONTENT.dialogue.patricio_home_talk]);
    expect(text).toContain("Benny\\'s son rules Ardencia".replace("\\'", "'"));
    expect(text).toContain('as his father did');
    expect(text).toContain('why his father said yes');
    expect(text).not.toContain('grandson');
    expect(text).not.toContain('east, past the Cane Road');
    expect(text).toContain('across the strait');
  });

  it('?chapter=4: on the strand camp with Azzy in the party and Benny in the Echo party; nothing left to travel', () => {
    const logic = startAt('4');
    expect(logic.state.player.mapId).toBe('ardencia-camp');
    const flags = logic.state.flags;
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy']);
    expect(partyMembers(flags, RPG, 'echo').map((m) => m.id)).toContain('benny');
    expect(flags.isSet('act3.complete') && flags.isSet('card.act3_end')).toBe(true);
    expect(flags.isSet('travel.next')).toBe(false);
    expect(logic.enterMap()).toEqual([]);
  });
});

describe('the gate of Cenizal', () => {
  it('is shut until the halberdiers have fetched Azzy, and shut again once the party has escaped', () => {
    const sim = simAt('ardencia');
    const gate = maps['ardencia-flats']!.doors.find((d) => d.id === 'flats_town')!;
    expect(sim.logic.doorOpen(gate)).toBe(false);
    sim.logic.state.flags.set('story.azzy_met', true);
    expect(sim.logic.doorOpen(gate)).toBe(true);
    sim.logic.state.flags.set('story.ardencia_escaped', true);
    expect(sim.logic.doorOpen(gate)).toBe(false);
  });
});

describe('the day before noon', () => {
  it('the court gate stays shut, and Azzy names what is left, from the flags', () => {
    const sim = simAt('audience');
    const logic = sim.logic;
    expect(logic.objects().length).toBeGreaterThan(0);
    logic.state.player = { ...logic.state.player, mapId: 'ardencia-town', pos: { x: 28, y: 9 }, facing: 'up', era: 'present' };
    expect(logic.isOpen({ x: 29, y: 9 })).toBe(false);
    logic.interact();
    const lines: string[] = [];
    for (let i = 0; i < 20 && logic.mode === 'dialogue'; i++) {
      const v = logic.view();
      if (v.kind === 'end') break;
      lines.push(v.text);
      if (v.kind === 'choice') {
        logic.choose(v.choices.length - 1);
        break;
      }
      logic.advance();
    }
    expect(lines).toContain('Noon is hours off.');
    expect(lines.join(' ')).toContain('treasurer');
    expect(lines.join(' ')).toContain('arguing about bread');
    expect(logic.state.flags.isSet('story.noon')).toBe(false);
  });

  it('the records room\'s memory opens only once the steward has let the party in', () => {
    const sim = simAt('audience');
    const logic = sim.logic;
    logic.state.player = { ...logic.state.player, mapId: 'ardencia-alcazar', pos: { x: 26, y: 6 }, era: 'present' };
    expect(logic.swapCheck()).toMatchObject({ ok: false, reason: 'locked' });
    logic.state.flags.set('side.treasurer.zelia', true);
    expect(logic.swapCheck().ok).toBe(true);
  });

  it('the Lower Town by night: the street empties, the cook stays, Azzy waits; dawn clears it', () => {
    const sim = simAt('bread-night');
    const logic = sim.logic;
    expect(logic.state.flags.isSet('side.bread.done')).toBe(true);
    expect(logic.state.flags.get('story.cart_night')).toBe(false);
    logic.state.player = { ...logic.state.player, mapId: 'ardencia-lower', pos: { x: 28, y: 9 } };
    const day = logic.npcs().map((n) => n.npc);
    expect(day).toContain('debate_widow');
    logic.state.flags.set('story.cart_night', true);
    const night = logic.npcs().map((n) => n.npc);
    expect(night).not.toContain('debate_widow');
    expect(night).not.toContain('soup_line_a');
    expect(night).toContain('amanda');
  });
});

describe('the Trial of Blades: lost, never won, and never lost to a reload', () => {
  it('walking into the ring at noon brings Rael and starts the fight meant to be lost', () => {
    const sim = simAt('noon');
    const def = BATTLES.rael_trial!;
    expect(def.meantToLose?.scene).toBe('rael_after');
    expect(battleDef('rael_trial')).toBe(def);
    // Stop the simulator's automatic end, to look at the moment the fight begins.
    sim.onBattle = () => [];
    sim.run(['goto 32,9', 'skip']);
    expect(sim.battles.at(-1)).toBe('rael_trial');
    expect(sim.logic.state.flags.get(FIGHT_RETURN_FLAG)).toBeTruthy();
  });

  it('closing the app in the middle of the fight: back at the court gate side of the ring, and walking in starts it again', () => {
    const sim = simAt('noon');
    sim.onBattle = () => [];
    sim.run(['goto 32,9', 'skip']);
    const back = reload(sim);
    expect(back.logic.state.flags.isSet('story.trial_fought')).toBe(false);
    expect(back.logic.state.flags.isSet(FIGHT_RETURN_FLAG)).toBe(false);
    const { x } = back.logic.state.player.pos;
    expect(x).toBeLessThan(32);
    back.onBattle = () => [];
    back.run(['goto 32,9', 'skip']);
    expect(back.battles).toEqual(['rael_trial']);
  });

  it('closing the app during the question: the fight is over (saved as it ended), and the question plays again on the sand', () => {
    const sim = simAt('noon');
    sim.onBattle = (id) => {
      // As the battle scene ends a fight meant to be lost: its flags, the save, then its scene.
      recordLoss(sim.logic.state.flags, battleDef(id)!);
      sim.logic.forgetFightReturn();
      return sim.logic.battleOver(false, 'rael_after');
    };
    sim.run(['goto 32,9']);
    for (let i = 0; i < 12; i++) sim.press('confirm');
    expect(sim.logic.dialogueId).toBe('rael_after');
    const back = reload(sim);
    expect(back.logic.state.flags.isSet('story.trial_fought')).toBe(true);
    expect(back.logic.mode).toBe('field');
    // One step on the sand and the question is asked again; then the walk to the forge.
    back.run(['left']);
    expect(back.logic.dialogueId).toBe('rael_after');
    back.run(['skip']);
    expect(back.logic.state.player.mapId).toBe('ardencia-forge');
    expect(back.logic.state.flags.isSet('story.forge_open')).toBe(true);
    expect(back.battles).toEqual([]);
  });

  it('the question: the court cleared, the halves glow, four sentences, the lie with the signet glowing, Rivera at the door', () => {
    const lines = CONTENT.dialogue.rael_after!.nodes.start!.lines;
    const text = lines.map((l) => l.text);
    expect(text).toContain('Mine: who gave you that locket?');
    expect(text).toContain('Elodie Limyè is my wife. You and your sister are my daughters.');
    expect(text).toContain('Azzy is your brother.');
    expect(text.join(' ')).not.toMatch(/\bAzriel\b/);
    expect(lines.some((l) => l.fx === 'token' && l.set?.['story.signet_glowed'])).toBe(true);
    expect(lines.some((l) => l.fx === 'signet' && l.text.startsWith('The envoy of Zetwal broke no law'))).toBe(true);
    // Jaime leaves with the elders; Rivera shuts the door and stays.
    const cues = lines.flatMap((l) => l.stage ?? []);
    expect(cues.some((c) => c.do === 'exit' && c.actor === 'jaime')).toBe(true);
    expect(cues.some((c) => c.do === 'exit' && c.actor === 'rivera')).toBe(false);
    // Never a joke from Anissa here: she speaks only of the light.
    expect(lines.filter((l) => l.speaker === 'anissa').map((l) => l.text)).toEqual(["It's the same light, Gigi. His ring and your locket. They're one thing.", 'Gigi. His ring lit again.']);
  });
});

describe('the forge fortress', () => {
  it('a reload before the key: the cell scene plays again until Gianna holds it', () => {
    const sim = simAt('forge');
    // In the cell, before Azzy's scene finished (as if the app closed on the way in): the arrival plays again.
    const state = sim.logic.state;
    state.flags.clear('story.forge_open');
    state.flags.set('story.forge_arrived', true);
    state.player = { ...state.player, mapId: 'ardencia-forge', pos: { x: 26, y: 9 } };
    sim.logic.reset(state);
    expect(sim.logic.enterMap()).toEqual([]);
    sim.run(['left']);
    expect(sim.logic.dialogueId).toBe('forge_arrive');
    sim.run(['skip']);
    expect(sim.logic.state.flags.isSet('story.forge_open')).toBe(true);
  });

  it('the far wall opens only with the lever pulled fifty years ago and Azzy with them; the walkway clears gate by gate', () => {
    const sim = simAt('forge');
    const logic = sim.logic;
    const wall = maps['ardencia-forge']!.doors.find((d) => d.id === 'forge_tunnel')!;
    expect(logic.doorOpen(wall)).toBe(false);
    expect(logic.isOpen({ x: 18, y: 9 })).toBe(false);
    logic.state.flags.set('anchor.forge_gate_a', true);
    expect(logic.isOpen({ x: 18, y: 9 })).toBe(true);
    expect(logic.isOpen({ x: 13, y: 9 })).toBe(false);
    logic.state.flags.set('anchor.benny_lever', true);
    expect(logic.doorOpen(wall)).toBe(false);
    logic.state.flags.set('party.azzy', true);
    expect(logic.doorOpen(wall)).toBe(true);
  });

  it('a wrong turn in the memory is visible and harmless: the fire still crosses the walkway', () => {
    const sim = simAt('forge-echo');
    sim.run(['goto 20,7', 'left', 'confirm', 'down', 'confirm', 'skip', 'goto 21,9', 'echo', 'skip']);
    expect(sim.logic.state.flags.get('anchor.forge_gate_a')).toBe(false);
    expect(sim.logic.isOpen({ x: 19, y: 9 })).toBe(false);
  });
});

describe('Benny\'s tunnel and the sea road', () => {
  it('the wall shuts behind the party; the bats fight again after a Game Over; Amanda unbars the far end', () => {
    const sim = simAt('tunnel');
    const logic = sim.logic;
    const back = maps['ardencia-tunnel']!.doors.find((d) => d.id === 'tunnel_in')!;
    expect(logic.doorOpen(back)).toBe(false);
    // A lost fight: the moment before it, and walking on fights again.
    sim.onBattle = () => [];
    sim.run(['goto 17,5', 'skip']);
    expect(sim.battles.at(-1)).toBe('tunnel_bats');
    logic.riseFromFight();
    expect(logic.state.player.pos.x).toBe(18);
    sim.run(['left', 'skip']);
    expect(sim.battles.filter((b) => b === 'tunnel_bats')).toHaveLength(2);
    // Won: the far end, barred until Amanda lifts the bar (again, from a save made before she did).
    logic.state.flags.set('encounter.ardencia_story.bats.won', true);
    expect(logic.isOpen({ x: 1, y: 5 })).toBe(false);
    sim.run(['goto 4,5']);
    expect(logic.dialogueId).toBe('tunnel_end');
    sim.run(['skip']);
    expect(logic.isOpen({ x: 1, y: 5 })).toBe(true);
  });

  it('after the escape: the tunnel mouth and the city gate are shut, the strand road\'s patrols switch on, and the camp ends the chapter', () => {
    const sim = simAt('sea-road');
    sim.run(['goto 5,10', 'skip', 'goto 5,15', 'skip']);
    const logic = sim.logic;
    expect(logic.state.flags.isSet('story.ardencia_escaped')).toBe(true);
    const mouth = maps['ardencia-flats']!.doors.find((d) => d.id === 'flats_tunnel')!;
    expect(logic.doorOpen(mouth)).toBe(false);
    expect(logic.encounterZoneAt({ x: 8, y: 8 })?.table).toBe('cinder_patrols');
    // A save on the strand before the camp's scene finished: one step at the fire plays it again.
    sim.run(['goto 0,19']);
    expect(logic.dialogueId).toBe('camp_arrive');
    const state = logic.state;
    state.flags.clear('act3.complete');
    logic.reset(state);
    sim.run(['goto 17,8']);
    expect(logic.dialogueId).toBe('camp_arrive');
  });
});
