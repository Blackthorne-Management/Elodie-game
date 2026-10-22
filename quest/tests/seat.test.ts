// Chapter 5, Eightgate (The Parley), beat by beat, from the scripted route's own marks: the chapter's starts (the
// Gold Gate, ?chapter=5; the Iron Gate, ?chapter=6), Chapter 4's caravan arriving, the herald and the inner arch, the
// Regent's welcome and Elodie under Crown eyes, Coco, the day's three required quests (the petition round, the four
// voices, Deserters' Road and its fight), the evening, the bell and the party split, the chain, the sealing (SIG-SEA:
// the drawers that moved, the wrong drawer, the thread), the keeper's law, the Parley (read aloud; the terms), the
// fitting (the private line), the Iron Gate; saves made mid-chapter; and the second review's fixes as content checks.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DISGUISE, MAP_MOODS, NPC_SPRITES } from '../src/assets.config.ts';
import { DEBATE_MEDIATE_INFLUENCE } from '../src/config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, battleReserve } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { DEBATES } from '../src/data/debates.ts';
import { COCO, ELODIE_LINES, SEAT_DIALOGUE } from '../src/data/dialogue/seat.ts';
import { CHAPTERS } from '../src/data/quests.ts';
import { RPG } from '../src/data/rpg.ts';
import { DRAWER_NUMBERS, DRAWER_PLATES, DRAWER_X0 } from '../src/data/seatArchive.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { Battle, battleItems, battleParty, type BattleEvent } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import type { DialogueLine, DialogueScript } from '../src/engine/dialogue.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { storyGoal } from '../src/engine/guide.ts';
import { currentObjective, questForJournal } from '../src/engine/quests.ts';
import { partyMembers, xpForLevel } from '../src/engine/rpg.ts';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { stageCues } from '../src/engine/stage.ts';
import { applySave, newGame, toSaveData } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';
import { qasimAction } from './qasimBot.ts';

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

/** Save to a code and load it into a fresh game (closing the app and opening it again). */
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

const lines = (id: string): DialogueLine[] => Object.values(CONTENT.dialogue[id]!.nodes).flatMap((n) => n.lines);
const texts = (id: string) => lines(id).map((l) => l.text);
const all: readonly DialogueScript[] = SEAT_DIALOGUE;
const allLines = all.flatMap((d) => Object.values(d.nodes).flatMap((n) => n.lines.map((l) => ({ d: d.id, l, speaker: l.speaker ?? n.speaker ?? '' }))));
const flagsOf = (sim: Sim) => sim.logic.state.flags;
const door = (map: string, id: string) => maps[map]!.doors.find((d) => d.id === id)!;

describe('the chapter starts, and Chapter 4\'s caravan arrives at the Gold Gate', () => {
  it('Chapter 4\'s card closes on the caravan road: the party lands in Eightgate\'s Gold Gate yard, and the arrival plays', () => {
    const sim = simAt('chapter4-end');
    expect(sim.logic.mode).toBe('card');
    sim.press('confirm');
    expect(sim.logic.state.player.mapId).toBe('seat-gateyard');
    expect(sim.logic.dialogueId).toBe('seat_arrive');
    // The caravan master walks up with Chapter 4's last line.
    expect(texts('seat_arrive')).toContain('The Dorini flag got you through the gate. It will not get you through a door.');
  });

  it('?chapter=5: the Gold Gate with the whole party; the caravan\'s arrival plays; then the arrow points at the arch', () => {
    const logic = startAt('5');
    const flags = logic.state.flags;
    expect(logic.state.player.mapId).toBe('seat-gateyard');
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira']);
    logic.enterMap();
    expect(logic.dialogueId).toBe('seat_arrive');
    const quest = questForJournal(CHAPTERS, 'seat-gateyard', flags);
    expect(quest?.id).toBe('act5');
    expect(currentObjective(quest!, flags)?.id).toBe('herald');
    expect(storyGoal(quest, flags, SIDE_QUESTS)).toEqual({ map: 'seat-gateyard', at: { x: 3, y: 10 } });
  });

  it('?chapter=6: on the Winter Plateau road after the card, the party whole, Chapter 5\'s clues kept', () => {
    const logic = startAt('6');
    const flags = logic.state.flags;
    expect(logic.state.player.mapId).toBe('skarragol-plateau');
    expect(flags.isSet('act5.complete') && flags.isSet('card.act5_end')).toBe(true);
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira']);
    for (const f of ['clue.seventh_clause_read', 'clue.elodie_locket_line', 'clue.elodie_tested_line', 'side.seats.stage1', 'belief.rael_traitor']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet('story.disguised') || flags.isSet('story.party_split')).toBe(false);
  });
});

describe('the Gold Gate, the herald and the Hall', () => {
  it('the inner arch is shut until the herald comes; the Sealbearer rules on the envoy\'s papers (review 3.7)', () => {
    const sim = simAt('seat');
    sim.run(['skip']);
    expect(sim.logic.doorOpen(door('seat-gateyard', 'yard_concourse'))).toBe(false);
    expect(sim.logic.doorOpen(door('seat-gateyard', 'yard_fields'))).toBe(false);
    sim.run(['goto 4,10', 'left', 'skip']);
    expect(flagsOf(sim).isSet('story.herald_met')).toBe(true);
    expect(sim.logic.doorOpen(door('seat-gateyard', 'yard_concourse'))).toBe(true);
    expect(texts('herald_arch')).toContain("Your papers say envoy. A house has one voice at a Parley, and Zetwal's is already seated.");
  });

  it('the welcome: the Regent names each of them and says nothing to Anissa; Elodie cuts Gianna off before "Rael" (review 3.1)', () => {
    const sim = simAt('welcome');
    sim.run(['goto 23,6', 'up', 'goto 21,15', 'up']);
    expect(sim.logic.dialogueId).toBe('hall_welcome');
    sim.run(['skip']);
    const flags = flagsOf(sim);
    for (const f of ['story.regent_met', 'story.elodie_hall', 'clue.elodie_locket_line']) expect(flags.isSet(f), f).toBe(true);
    const welcome = allLines.filter((x) => x.d === 'hall_welcome');
    // The Regent's lines never name her; the look is the threat.
    for (const x of welcome.filter((y) => y.speaker === 'regent')) expect(x.l.text).not.toMatch(/Anissa|little one|glow/i);
    // Gianna starts the sentence; Elodie stops her, and says the Locket line low.
    const said = welcome.map((x) => x.l.text);
    expect(said).toContain('Mother. In Ardencia, Lord Rael—');
    expect(said.indexOf("The envoy's household will report to the envoy's rooms.")).toBe(said.indexOf('Mother. In Ardencia, Lord Rael—') + 1);
    expect(said).toContain(ELODIE_LINES.locket);
    // Anaco is under guard in the customs house (review 3.14).
    expect(said.some((t) => t.includes('under guard in the customs house'))).toBe(true);
  });

  it('nobody says "Rael" and "father" in the same line anywhere in Eightgate, and no line glosses Elodie\'s two', () => {
    for (const x of allLines) {
      expect(/Rael/.test(x.l.text) && /father/i.test(x.l.text), `${x.d}: ${x.l.text}`).toBe(false);
      expect(/truth/i.test(x.l.text) && /father/i.test(x.l.text), `${x.d}: ${x.l.text}`).toBe(false);
    }
  });

  it('Elodie says exactly two true lines, word for word: one in the Hall under the clerk\'s pen, one behind the curtain', () => {
    const where = (text: string) => allLines.filter((x) => x.l.text === text).map((x) => x.d);
    expect(where(ELODIE_LINES.locket)).toEqual(['hall_welcome']);
    expect(where(ELODIE_LINES.tested)).toEqual(['fitting']);
    // The clerk is staged in the welcome; the fitting stages no clerk and no Sealbearer.
    const actors = (id: string) => stageCues(CONTENT.dialogue[id]!).map((c) => ('actor' in c ? c.actor : ''));
    expect(actors('hall_welcome')).toContain('npc:parley_clerk');
    expect(actors('fitting').some((a) => /clerk|sealbearer/.test(a))).toBe(false);
    // Review 3.8: "No. He wouldn't." is gone; a hand on Anissa's head instead.
    expect(allLines.some((x) => x.l.text.includes("He wouldn't"))).toBe(false);
    expect(texts('fitting')).toContain("Elodie puts her hand on Anissa's head, and says nothing.");
  });

  it('the chamberlain steps into their path on the way out with Se-5; Yari carries the petition', () => {
    const sim = simAt('petitions');
    const flags = flagsOf(sim);
    expect(flags.isSet('side.seats.accepted') && flags.isSet('item.petition')).toBe(true);
    // Before the round, each envoy has only an idle line.
    const fresh = new FlagStore();
    fresh.set('story.elodie_hall', true);
    expect(evaluate({ all: [{ flag: 'side.seats.accepted' }, { notFlag: 'side.seats.skarragol' }] }, fresh)).toBe(false);
  });
});

describe('the day in the city: the three required quests', () => {
  it('the petition round: seven doors and a wall, then the chamberlain; stage 1 needs all eight', () => {
    const sim = simAt('petitions');
    sim.run(['goto 32,28', 'right', 'confirm', 'skip']);
    expect(flagsOf(sim).isSet('side.seats.stage1')).toBe(false);
    const done = simAt('hall-books');
    for (const h of ['al_doria', 'skarragol', 'kuroshi', 'jwaladesh', 'aldermoor', 'ardencia', 'zetwal', 'xaragua']) expect(flagsOf(done).isSet(`side.seats.${h}`), h).toBe(true);
    expect(flagsOf(done).isSet('side.seats.stage1')).toBe(true);
    // Ironvow's envoy looks at Azzy once (review 5.3); Elodie takes the paper as the envoy.
    expect(texts('envoy_ironvow_talk')).toContain("Your mother's people would know you, boy.");
    expect(texts('elodie_hall_talk')).toContain('I will read it into the Parley. The record will show that Zetwal did.');
  });

  it('the four voices: each round has its own speaker, Reason needs a Hall book, Mediate needs the built 5 (review 3.10)', () => {
    const def = DEBATES.find((d) => d.id === 'seat_voices')!;
    expect(def.city).toBe('seat');
    expect(new Set(def.rounds.map((r) => r.speaker)).size).toBe(3);
    expect(def.ally).toBe('gaze_keeper');
    expect(def.reasonNeeds).toContain('lore.seat_regent_commission');
    expect(DEBATE_MEDIATE_INFLUENCE).toBe(5);
    const sim = simAt('voices');
    expect(flagsOf(sim).isSet('lore.seat_regent_commission')).toBe(true);
    const after = simAt('deserters');
    expect(flagsOf(after).isSet('debate.seat_voices.settled')).toBe(true);
  });

  it('Deserters\' Road: the camp plays the fight again until it is won; the three answers are remembered; Pay needs 120 gold', () => {
    const def = BATTLES.deserters_road!;
    expect(def.meantToLose).toBeUndefined();
    expect(def.sideQuest).toBe('deserters');
    expect(def.endsWithBoss).toBe(true);
    // Review 3.3: no floor (a foe with a floor and no finale never falls); everyone withdraws instead.
    for (const id of def.enemies) {
      expect(ENEMIES[id]!.floor, id).toBeUndefined();
      expect(ENEMIES[id]!.withdraws, id).toBeDefined();
    }
    const camp = maps['seat-fields']!.triggers.find((t) => t.id === 'deserters_camp')!;
    expect(camp.once).toBeFalsy();
    // Each answer: the flag, the pilgrim's report, and (Pay) the purse.
    for (const [presses, flag] of [[[], 'side.deserters.spared'], [['down'], 'side.deserters.paid'], [['down', 'down'], 'side.deserters.broken']] as const) {
      const sim = simAt('deserters');
      sim.run(['goto 46,16', 'right', 'goto 6,14', 'down', 'confirm', 'skip', 'goto 15,18', 'down', 'goto 30,15', 'down']);
      // The Sergeant's toll, the fight (won as the battle scene ends it), then the Parley on the map.
      const before = flagsOf(sim).get('gold') as number;
      for (let i = 0; i < 30 && sim.logic.view().kind !== 'choice'; i++) sim.press('confirm');
      expect(sim.battles.at(-1)).toBe('deserters_road');
      const gold = flagsOf(sim).get('gold') as number;
      // The fight paid its gold (120, and Samira's tenth).
      expect(gold).toBeGreaterThan(before);
      sim.run([...presses, 'confirm', 'skip']);
      expect(flagsOf(sim).isSet(flag), flag).toBe(true);
      expect(flagsOf(sim).isSet('side.deserters.fought')).toBe(true);
      expect(flagsOf(sim).get('gold')).toBe(flag === 'side.deserters.paid' ? gold - 120 : gold);
    }
    // Without the purse the Pay answer is not offered.
    const choice = CONTENT.dialogue.deserters_parley!.nodes.start!.choices!.find((c) => c.text === 'Samira. Pay them.')!;
    const poor = new FlagStore();
    poor.set('party.samira', true);
    poor.set('gold', 119);
    expect(evaluate(choice.if, poor)).toBe(false);
    poor.set('gold', 120);
    expect(evaluate(choice.if, poor)).toBe(true);
  });

  it('Deserters\' Road is winnable at level 14 by a fair player, and nobody falls: the Sergeant yields and his men go with him', () => {
    const start = new FlagStore(starts['5']!.flags);
    const base = RPG.xpRules.reduce((n, r) => n + r.flags.filter((f) => start.isSet(f)).length * r.each, 0);
    start.set('xp.shared', xpForLevel(RPG, 14) - base);
    const def = BATTLES.deserters_road!;
    let won = 0;
    for (let seed = 1; seed <= 20; seed++) {
      const b = new Battle(def, battleParty(start, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), battleItems(start, RPG), { seed, gold: 0, reserve: battleReserve(def) });
      const events: BattleEvent[] = [...b.start()];
      let warned = false;
      for (let i = 0; i < 300 && !b.outcome; i++) {
        const evs = b.act(qasimAction(b, { guards: true, bribes: false }, warned));
        warned = evs.some((e) => e.kind === 'text' && /barks|crouches/.test(e.text));
        events.push(...evs);
      }
      if (b.outcome === 'won') won++;
      expect(events.some((e) => e.kind === 'down' && b.enemies.some((x) => x.key === e.who)), `seed ${seed}: a deserter fell`).toBe(false);
    }
    expect(won).toBe(20);
  });

  it('until the bell: Coco says what is left; the evening comes when the third is done, and the workshop is the way on', () => {
    const sim = simAt('voices');
    const flags = flagsOf(sim);
    const left = lines('coralie_seat_talk').filter((l) => l.if && evaluate(l.if, flags)).map((l) => l.text);
    expect(left).toEqual(['The fountain is still shouting.', 'The pilgrims are still at the gate.']);
    const eve = MAP_MOODS.find((m) => m.maps.includes('seat-concourse'))!;
    expect(evaluate(eve.if, flags)).toBe(false);
    const evening = simAt('bell');
    expect(evaluate(eve.if, flagsOf(evening))).toBe(true);
    const quest = questForJournal(CHAPTERS, 'seat-gateyard', flagsOf(evening));
    expect(currentObjective(quest!, flagsOf(evening))?.id).toBe('seamstresses');
  });
});

describe('the bell, the chain and the Archive', () => {
  it('the veils go on and the party splits: Yari, Azzy and Samira stay at the workshop; the disguise looks exist', () => {
    const sim = simAt('chain');
    const flags = flagsOf(sim);
    expect(flags.isSet(DISGUISE.flag) && flags.isSet('story.party_split')).toBe(true);
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa']);
    expect(NPC_SPRITES[DISGUISE.player]).toBeDefined();
    expect(NPC_SPRITES[DISGUISE.anissa]).toBeDefined();
    // The chain stays across the door until Coco talks it off.
    expect(sim.logic.doorOpen(door('seat-concourse', 'concourse_archive'))).toBe(false);
    sim.run(['down', 'goto 12,1', 'up', 'goto 9,9', 'up', 'skip']);
    expect(sim.logic.doorOpen(door('seat-concourse', 'concourse_archive'))).toBe(true);
  });

  it('the drawers moved (review 3.4): drawer 4 is sixth from the left today, fourth in the memory, under the Stillwater plate', () => {
    expect([...DRAWER_NUMBERS].sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const today = DRAWER_NUMBERS.indexOf(4);
    expect(today).toBe(5);
    expect(DRAWER_PLATES[today]).toBe('Stillwater');
    const archive = maps['seat-archive']!;
    const echo4 = archive.objects.find((o) => o.id === 'drawer_e4')!;
    const thread = archive.objects.find((o) => o.id === 'drawer_four')!;
    expect(echo4.area.x).toBe(DRAWER_X0 + 3);
    expect(thread.area.x).toBe(DRAWER_X0 + today);
    expect(thread.area.x).not.toBe(echo4.area.x);
    expect(archive.anchors.map((a) => a.flag)).toEqual(['anchor.ribbon_thread']);
  });

  it('a wrong drawer in the memory costs a re-watch: the thread goes back to the table and the clerk files the page again', () => {
    const sim = simAt('sealing');
    sim.run(['goto 13,10', 'echo', 'skip', 'goto 13,8', 'up', 'confirm', 'skip']);
    expect(flagsOf(sim).isSet('echo.thread')).toBe(true);
    sim.run(['goto 15,2', 'up', 'confirm', 'skip']);
    expect(flagsOf(sim).isSet('echo.thread')).toBe(false);
    expect(flagsOf(sim).isSet('anchor.ribbon_thread')).toBe(false);
    // The page is filed again, so the thread can be taken again and tied right.
    sim.run(['goto 13,8', 'up', 'confirm', 'skip', 'goto 13,2', 'up', 'confirm', 'skip']);
    expect(flagsOf(sim).isSet('anchor.ribbon_thread')).toBe(true);
  });

  it('the sealing: Benny refuses aloud and walks out; Patricio\'s choice outlives the memory, its own flags do not', () => {
    const sim = simAt('sealing');
    sim.run(['goto 13,10', 'echo']);
    const said = (sim.logic.dialogueId === 'sealing_enter' ? texts('sealing_enter') : []);
    expect(said).toContain('Aloud, so the boy writes it: Ardencia refuses the seventh page.');
    sim.run(['skip', 'goto 13,10', 'echo', 'skip']);
    const flags = flagsOf(sim);
    expect(flags.get('choice.patricio_protest')).toBe('time');
    expect(flags.isSet('story.sealing_seen')).toBe(true);
    expect(flags.isSet('echo.filed') || flags.isSet('echo.benny_left')).toBe(false);
  });

  it('the keeper\'s law: Reason (the Witness) needs a book from the shelves; Compassion sends Gianna to them; Scripture works', () => {
    const law = CONTENT.dialogue.hollis_talk!.nodes.law!;
    const reason = law.choices!.find((c) => c.text.startsWith('Reason'))!;
    const flags = new FlagStore();
    expect(evaluate(reason.if, flags)).toBe(false);
    flags.set('lore.seat_founding_compact', true);
    expect(evaluate(reason.if, flags)).toBe(true);
    expect(CONTENT.dialogue.hollis_talk!.nodes.compassion!.next).toBeUndefined();
    expect(CONTENT.dialogue.hollis_talk!.nodes.scripture!.next).toBe('open');
    const sim = simAt('parley');
    expect(flagsOf(sim).isSet('story.hollis_agreed')).toBe(true);
    expect(flagsOf(sim).isSet(DISGUISE.flag)).toBe(false);
  });
});

describe('the Parley, the fitting and the Iron Gate', () => {
  it('read aloud at Elodie\'s demand before every house (owner decision); the clause only, no new law (review 3.2)', () => {
    const said = texts('parley');
    expect(said.indexOf('Zetwal demands the reading.')).toBeLessThan(said.indexOf('"The harbor of Xaraguá and its waters are given into the keeping of the Crown of Aldermoor,'));
    expect(said).toContain('No signature. The clerk\'s seal alone. And the seventh ribbon carries no witness knot.');
    for (const t of said) {
      expect(t).not.toMatch(/Witnessed by the Dorini|Signed by the Marshal|in force|waited some years/);
    }
    const sim = simAt('fitting');
    const flags = flagsOf(sim);
    for (const f of ['clue.seventh_clause_read', 'story.terms_refused', 'story.party_rejoined']) expect(flags.isSet(f), f).toBe(true);
    expect(['asked', 'protest']).toContain(flags.get('choice.refusal'));
    // The Seventh Clause joins the Hall's shelf once it has been read.
    const shelf = CONTENT.dialogue['shelf.hall_records']!.nodes.list!.choices!.filter((c) => c.text === 'The Seventh Clause');
    expect(evaluate(shelf[0]!.if, flags)).toBe(true);
    expect(evaluate(shelf[0]!.if, new FlagStore())).toBe(false);
  });

  it('the fitting: Elodie and Azzy, Elodie and Samira before the curtain; no joke behind it (review 3.11, 5.1, 5.2)', () => {
    expect(texts('fitting_front')).toContain('Azriel.');
    expect(texts('fitting_front').some((t) => t.startsWith('Samira Dorini.'))).toBe(true);
    expect(allLines.filter((x) => x.d === 'fitting' && x.speaker === 'samira')).toEqual([]);
    // Skarragol is east and up (review 3.9): nobody sends them north.
    for (const x of allLines) expect(x.l.text, x.d).not.toMatch(/go north|North!|north road/);
    expect(texts('fitting')).toContain('If someone were going, they would go east first, up onto the winter plateau.');
  });

  it('Coco: her welcome remembers the bazaar, and every line that turns on what she knows is in one place (COCO)', () => {
    const welcome = texts('coco_welcome');
    for (const t of [COCO.askedHer, COCO.notYet, COCO.notInThatHall]) expect(welcome).toContain(t);
    expect(texts('coco_plan')).toContain(COCO.weddingCoat);
    expect(texts('fitting')).toContain(COCO.staysPinning);
    // She never says Rael's name.
    for (const x of allLines.filter((y) => y.speaker === 'coralie')) expect(x.l.text, x.d).not.toMatch(/Rael/);
  });

  it('Anissa never jokes in Chapter 5, and the Crown never names her', () => {
    for (const x of allLines.filter((y) => y.speaker === 'anissa')) expect(x.l.text, x.d).not.toMatch(/invoice|price|dinar|tear the seams/i);
    for (const x of allLines.filter((y) => ['regent', 'sealbearer', 'parley_clerk', 'herald', 'legate'].includes(y.speaker))) {
      expect(x.l.text, x.d).not.toMatch(/Anissa|glow/);
    }
  });

  it('the Iron Gate: Coco waves them off east; the card; the pilgrims and their escort at the gate when spared', () => {
    const sim = simAt('chapter5-end');
    expect(sim.logic.mode).toBe('card');
    expect(flagsOf(sim).isSet('act5.complete')).toBe(true);
    expect(texts('iron_gate')).toContain("East! Up onto the plateau! Bring me a colour I haven't got!");
    const escort = maps['seat-concourse']!.npcs.find((n) => n.npc === 'deserter_escort')!;
    expect(evaluate(escort.if, flagsOf(sim))).toBe(true);
  });
});

describe('saves made mid-chapter', () => {
  it('a save in the Archive in the veils (the party split) loads in the veils, and the sealing still plays', () => {
    const sim = reload(simAt('sealing'));
    const flags = flagsOf(sim);
    expect(sim.logic.state.player.mapId).toBe('seat-archive');
    expect(flags.isSet(DISGUISE.flag) && flags.isSet('story.party_split')).toBe(true);
    sim.run(['goto 13,10', 'echo']);
    expect(sim.logic.dialogueId).toBe('sealing_enter');
  });

  it('a save after the keeper agreed loads with the steps\' scene still to play, and the Parley after it', () => {
    const sim = reload(simAt('parley'));
    sim.run(['goto 13,18', 'down', 'goto 16,6', 'right']);
    expect(sim.logic.dialogueId).toBe('parley_steps');
    sim.run(['skip', 'goto 23,6', 'up', 'up', 'up']);
    expect(sim.logic.dialogueId).toBe('parley');
  });

  it('a save in the evening still sends the party to Coco\'s beds, and the bell plays there', () => {
    const sim = reload(simAt('bell'));
    sim.run(['goto 1,9', 'left', 'goto 23,32', 'down', 'goto 18,7', 'up']);
    expect(sim.logic.dialogueId).toBe('seamstresses');
  });
});
