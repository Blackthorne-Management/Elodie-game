// Chapter 4, Al-Doria (The Ledger), beat by beat, from the scripted route's own marks: the chapter's starts (the
// strand, ?chapter=4; the gate yard, ?chapter=5), the Journal on the camp both chapters share, the voyage, the quay,
// Samira's invoice, the Majlis, the day in the city and its dusk, Appraise This with Coralie, Sweet Water and the
// cistern's Echo, the vault (the balance door that needs the memory, the sun lock, the witness's chest), Qasim and the
// way back in after a Game Over, saves made mid-scene, Layla's word and the caravan at first light.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MAP_MOODS } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { LAYLA } from '../src/data/dialogue/aldoria.ts';
import { CHAPTERS } from '../src/data/quests.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { REALM_MAP } from '../src/data/realmMap.ts';
import { VOYAGES } from '../src/data/voyages.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { flagsSetBy } from '../src/engine/dialogue.ts';
import type { FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { storyGoal } from '../src/engine/guide.ts';
import { currentObjective, questForJournal } from '../src/engine/quests.ts';
import { partyMembers } from '../src/engine/rpg.ts';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { applySave, newGame, toSaveData } from '../src/engine/state.ts';
import { seaRoute } from '../src/engine/voyage.ts';
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

/** Every line of a scene, as text. */
const lines = (id: string) => Object.values(CONTENT.dialogue[id]!.nodes).flatMap((n) => n.lines);

describe('the strand at first light (beat 0) and the chapter starts', () => {
  it('?chapter=4: on the strand; the Journal opens Chapter 4 at "Sail for Al-Doria" and the arrow points at the trader', () => {
    const logic = startAt('4');
    expect(logic.state.player.mapId).toBe('ardencia-camp');
    const quest = questForJournal(CHAPTERS, 'ardencia-camp', logic.state.flags);
    expect(quest?.id).toBe('act4');
    expect(currentObjective(quest!, logic.state.flags)?.id).toBe('sail');
    expect(storyGoal(quest, logic.state.flags, SIDE_QUESTS)).toEqual({ map: 'ardencia-camp', at: { x: 8, y: 9 } });
  });

  it('before Chapter 3 ends, the same camp shows Chapter 3 (review 3.5: the camp belongs to both chapters)', () => {
    const flags = startAt('4').state.flags;
    flags.clear('act3.complete');
    expect(questForJournal(CHAPTERS, 'ardencia-camp', flags)?.id).toBe('act3');
  });

  it('the trader sails at first light; the sergeant pledges the strand; Yari keeps the fare coin (once only)', () => {
    const sim = simAt('strand');
    sim.run(['goto 8,9', 'down', 'confirm', 'skip']);
    const flags = sim.logic.state.flags;
    expect(sim.logic.state.player.mapId).toBe('aldoria-quay');
    expect(flags.isSet('story.aldoria_arrived')).toBe(true);
    expect(flags.get('item.brasador_coin')).toBe(true);
    // Free Brasador's flag and note were Chapter 3's; beat 0 does not set them again.
    expect(flagsSetBy(CONTENT.dialogue.camp_trader_talk!)).not.toContain('ally.free_brasador');
    // The double-grant guard: with the coin already in the bag (Chapter 2's oil quest), Yari's lines are skipped.
    const coinLines = lines('camp_trader_talk').filter((l) => l.text.includes('fare') || l.text.includes('Not Crown'));
    expect(coinLines.length).toBe(2);
    for (const l of coinLines) expect(l.if).toEqual({ notFlag: 'item.brasador_coin' });
  });

  it('the voyage stays at sea, passes Zetwal on the open sea, and lands off Al-Doria\'s east coast (review 3.12)', () => {
    const v = VOYAGES.ardencia_aldoria!;
    const path = seaRoute(REALM_MAP, v);
    const sea = (x: number, y: number) => REALM_MAP.key[REALM_MAP.rows[y]![x]!] === 'sea';
    expect(path.every((p) => sea(p.x, p.y))).toBe(true);
    const end = path[path.length - 1]!;
    expect(Math.hypot(end.x - REALM_MAP.capitals.al_doria!.x, end.y - REALM_MAP.capitals.al_doria!.y)).toBeLessThan(14);
    expect(Math.max(...path.map((p) => p.x))).toBeGreaterThan(115);
  });

  it('?chapter=5: Eightgate\'s Gold Gate after the card, with Samira in the party, the pass and the coin read', () => {
    const logic = startAt('5');
    const flags = logic.state.flags;
    expect(logic.state.player.mapId).toBe('seat-gateyard');
    expect(flags.isSet('act4.complete') && flags.isSet('card.act4_end')).toBe(true);
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toContain('samira');
    for (const f of ['item.dorini_pass', 'item.benny_half_sheet', 'clue.sealed_seventh', 'clue.brasador_coin', 'belief.rael_traitor']) expect(flags.isSet(f), f).toBe(true);
  });
});

describe('the quay and the bazaar', () => {
  it('the quay gate stays shut until its clerk has read the papers', () => {
    const sim = simAt('aldoria');
    const gate = maps['aldoria-quay']!.doors.find((d) => d.id === 'quay_bazaar')!;
    expect(sim.logic.doorOpen(gate)).toBe(false);
    sim.run(['goto 9,10', 'skip', 'goto 15,2', 'skip']);
    expect(sim.logic.state.flags.isSet('story.quay_crates')).toBe(true);
    expect(sim.logic.doorOpen(gate)).toBe(true);
  });

  it("Samira's invoice: paying costs two gold; refusing costs nothing but a late fee on the slip", () => {
    for (const [choice, paid] of [[0, true], [1, false]] as const) {
      const sim = simAt('samira');
      const before = sim.logic.state.flags.get('gold') as number;
      sim.run(['goto 21,29']);
      for (let i = 0; i < 10 && sim.logic.view().kind !== 'choice'; i++) sim.press('confirm');
      if (choice === 1) sim.press('down');
      sim.run(['confirm', 'skip']);
      const flags = sim.logic.state.flags;
      expect(flags.get('choice.samira_invoice')).toBe(paid ? 'paid' : 'unpaid');
      expect(flags.get('gold')).toBe(paid ? before - 2 : before);
      expect(flags.isSet('gold.pay')).toBe(false);
    }
  });

  it('Samira looks at Anissa and does not price her (no joke in reach of Anissa)', () => {
    const text = lines('samira_walkup').map((l) => l.text);
    expect(text).toContain("I can't price that. I don't price what I can't price.");
  });

  it('the Majlis refuses; Layla\'s lines all come from one place (the owner question is open)', () => {
    const sim = simAt('majlis');
    sim.run(['goto 22,5', 'skip', 'goto 14,7', 'skip']);
    expect(sim.logic.state.flags.isSet('story.vault_refused')).toBe(true);
    const spoken = Object.values(CONTENT.dialogue).flatMap((d) => Object.values(d.nodes).flatMap((n) => n.lines.filter((l) => (l.speaker ?? n.speaker) === 'layla').map((l) => l.text)));
    expect(spoken.length).toBeGreaterThan(5);
    for (const t of spoken) expect(Object.values(LAYLA)).toContain(t);
  });
});

describe('until dusk', () => {
  const door = maps['aldoria-bazaar']!.doors.find((d) => d.id === 'bazaar_vault')!;

  it('the green door stays shut all day; Samira says from the flags what is left', () => {
    const sim = simAt('appraise');
    expect(sim.logic.doorOpen(door)).toBe(false);
    const npcs = () => sim.logic.npcs().map((n) => n.npc);
    expect(npcs()).toContain('guild_doorman');
    sim.logic.state.flags.set('side.appraise.accepted', true);
    sim.logic.state.flags.set('side.appraise.done', true);
    const said: string[] = [];
    sim.logic.state.player = { ...sim.logic.state.player, pos: { x: 11, y: 23 }, facing: 'up' };
    sim.logic.interact();
    for (let i = 0; i < 10 && sim.logic.mode === 'dialogue'; i++) {
      const v = sim.logic.view();
      if (v.kind !== 'end') said.push(v.text);
      sim.logic.advance();
    }
    expect(said).toContain('The priest and the merchant are still at it by the fountain.');
    expect(said).toContain('And the children at the fountain are still thirsty.');
  });

  it('dusk is the door\'s own condition: a debate settled last still brings the night and Samira to the door', () => {
    const sim = simAt('appraise');
    const flags = sim.logic.state.flags;
    const mood = MAP_MOODS.find((m) => m.maps.includes('aldoria-bazaar'))!;
    flags.set('side.appraise.done', true);
    flags.set('side.sweet_water.done', true);
    expect(evaluate(mood.if, flags)).toBe(false);
    // The debate is settled by its own script (engine/debate.ts), which runs no story scene: no extra flag is needed.
    flags.set('debate.aldoria_bargain.settled', true);
    expect(evaluate(mood.if, flags)).toBe(true);
    const npcs = sim.logic.npcs().map((n) => n.npc);
    expect(npcs).not.toContain('guild_doorman');
    expect(sim.logic.npcs().find((n) => n.npc === 'samira')?.pos).toEqual({ x: 12, y: 10 });
    // It stays night after the vault, until the caravan's first light (review 3.9).
    flags.set('story.vault_entered', true);
    expect(evaluate(mood.if, flags)).toBe(true);
    flags.set('story.caravan_dawn', true);
    expect(evaluate(mood.if, flags)).toBe(false);
  });

  it('Appraise This: a wrong pick costs only a line and the player looks again; Coralie counts the knots', () => {
    const sim = simAt('appraise');
    sim.run(['goto 11,23', 'up', 'confirm', 'skip', 'goto 13,23']);
    expect(sim.logic.dialogueId).toBe('coralie_meet');
    sim.run(['skip', 'goto 15,22', 'up', 'confirm', 'confirm', 'confirm', 'skip']);
    expect(sim.logic.state.flags.isSet('side.appraise.coin')).toBe(false);
    sim.run(['up', 'confirm', 'confirm', 'down*3', 'confirm', 'skip']);
    expect(sim.logic.state.flags.isSet('side.appraise.coin')).toBe(true);
    const carpet = lines('carpet_stall').map((l) => l.speaker);
    expect(carpet).toContain('coralie');
  });

  it('Coralie: met in the cloth row, she will not tell (her sister\'s to tell), and sails on before the vault', () => {
    const meet = lines('coralie_meet').map((l) => l.text);
    expect(meet).toContain("That is your mother's to tell, chérie. Not mine.");
    expect(meet).toContain("She'll be at Eightgate. Make her tell you.");
    const sim = simAt('ledgers');
    const flags = sim.logic.state.flags;
    expect(flags.isSet('story.coralie_left')).toBe(true);
    expect(flags.isSet('story.vault_entered')).toBe(false);
    expect(sim.logic.npcs().map((n) => n.npc)).not.toContain('coralie');
  });

  it('Sweet Water: the cistern\'s memory opens only once the water-carrier has spoken; the pin makes the fountain run', () => {
    const sim = simAt('sweet-water');
    const logic = sim.logic;
    sim.run(['goto 21,15', 'up', 'confirm', 'skip', 'goto 43,14']);
    logic.state.player = { ...logic.state.player, pos: { x: 29, y: 7 } };
    expect(logic.swapCheck()).toMatchObject({ ok: false, reason: 'locked' });
    logic.state.flags.set('side.sweet_water.carrier', true);
    expect(logic.swapCheck().ok).toBe(true);
    const fountain = () => logic.objects('present').map((o) => o.id);
    logic.state.player = { ...logic.state.player, mapId: 'aldoria-bazaar', pos: { x: 22, y: 16 } };
    logic.reset(logic.state);
    expect(fountain()).toContain('dry_fountain_al');
    logic.state.flags.set('anchor.cistern_pin', true);
    expect(fountain()).toContain('running_fountain');
    expect(fountain()).not.toContain('dry_fountain_al');
  });
});

describe('the guild vault (SIG-ALD)', () => {
  it('Anissa holds the door at the Echo\'s edge, not alone on the stair (review 3.2)', () => {
    const arrive = lines('vault_arrive');
    const anissa = arrive.find((l) => l.speaker === 'anissa')!;
    expect(anissa.text).toContain("I'll hold the door, Gigi. I always do.");
    const walk = anissa.stage!.find((c) => c.do === 'walk')!;
    expect(walk).toMatchObject({ actor: 'follower' });
  });

  it('the right weights without the memory do not hold (review 3.6); with Yusuf\'s twenty-five they open the door', () => {
    const sim = simAt('balance');
    const flags = sim.logic.state.flags;
    expect(flags.isSet('story.vault_echo')).toBe(true);
    flags.clear('story.vault_echo');
    sim.run(['goto 10,10', 'down', 'confirm', 'skip', 'goto 9,10', 'down', 'confirm', 'skip', 'goto 6,10', 'down', 'confirm', 'skip', 'goto 12,6', 'up', 'confirm', 'skip']);
    expect(flags.isSet('story.vault_outer')).toBe(false);
    expect(sim.logic.isOpen({ x: 13, y: 7 })).toBe(false);
    flags.set('story.vault_echo', true);
    sim.run(['confirm', 'skip']);
    expect(flags.isSet('story.vault_outer')).toBe(true);
    expect(sim.logic.isOpen({ x: 13, y: 7 })).toBe(true);
  });

  it('the twelve boxes stand in the strongroom the guild opens; only the witness\'s niche has the sun lock (review 3.4)', () => {
    const sim = simAt('chest');
    const logic = sim.logic;
    expect(logic.objects('present').map((o) => o.id)).toContain('box_seven');
    expect(logic.state.flags.isSet('story.vault_inner')).toBe(true);
    logic.state.flags.clear('story.vault_inner');
    logic.state.flags.clear('anchor.vault_sunlock');
    expect(logic.isOpen({ x: 22, y: 7 })).toBe(false);
    expect(logic.isOpen({ x: 16, y: 7 })).toBe(true);
  });

  it('the chest: Benny signed six pages and not the seventh; Caona was never asked (review 3.3)', () => {
    const text = lines('witness_chest').map((l) => l.text);
    expect(text).toContain('Patricio. Yusuf. Benny. Sarnai. Sayo. Arjun.');
    expect(text).toContain('Not Caona. She was never asked.');
    expect(text).toContain('Six pages he signed. The seventh, he would not.');
    expect(text.join(' ')).not.toContain('Not Benny');
  });

  it('Samira joins before the fight, in front of the man who strikes her off; Anissa steps behind Gianna first', () => {
    const sim = simAt('chest');
    sim.onBattle = () => [];
    sim.run(['goto 23,7', 'right', 'confirm', 'skip']);
    const flags = sim.logic.state.flags;
    expect(sim.battles.at(-1)).toBe('qasim_vault');
    expect(flags.isSet('party.samira') && flags.isSet('clue.sealed_seventh')).toBe(true);
    const chest = lines('witness_chest');
    const anissaStep = chest.findIndex((l) => l.stage?.some((c) => c.do === 'walk' && c.actor === 'follower'));
    const join = chest.findIndex((l) => l.set?.['party.samira']);
    const fight = chest.findIndex((l) => l.set?.['battle.next'] === 'qasim_vault');
    expect(anissaStep).toBeGreaterThan(-1);
    expect(anissaStep).toBeLessThan(join);
    expect(join).toBeLessThan(fight);
  });

  it('after a Game Over the blade at the stair\'s foot sends the party back to Qasim; a reload mid-fight keeps the way back', () => {
    const sim = simAt('chest');
    sim.onBattle = () => [];
    sim.run(['goto 23,7', 'right', 'confirm', 'skip']);
    sim.logic.riseFromFight();
    const back = reload(sim);
    expect(back.logic.npcs().map((n) => n.npc)).toContain('stair_blade');
    back.onBattle = () => [];
    back.run(['goto 5,4', 'up', 'confirm', 'skip']);
    expect(back.battles).toEqual(['qasim_vault']);
  });

  it('Layla\'s word plays again from a save made after the win, until the pass is given', () => {
    const sim = simAt('chest');
    sim.run(['goto 23,7', 'right', 'confirm']);
    const flags = sim.logic.state.flags;
    flags.set('encounter.aldoria_story.qasim.won', true);
    sim.logic.reset(sim.logic.state);
    sim.logic.state.player = { ...sim.logic.state.player, pos: { x: 21, y: 7 } };
    sim.run(['left']);
    expect(sim.logic.dialogueId).toBe('layla_descends');
    sim.run(['skip']);
    expect(flags.isSet('story.layla_pass') && flags.isSet('item.dorini_pass')).toBe(true);
    expect(sim.logic.npcs().map((n) => n.npc)).not.toContain('stair_blade');
  });
});

describe('the caravan gate at first light', () => {
  it('the purse, the coin read right by Samira and wrong by Gianna, the siblings, and the card', () => {
    const text = lines('caravan_dawn').map((l) => l.text);
    expect(text).toContain(LAYLA.purse);
    expect(text).toContain('Someone in Ardencia pays someone in Xaraguá, and not through any bank I know.');
    expect(text).toContain('My father pays the resistance so he can sell it.');
    const sim = simAt('caravan');
    sim.run(['goto 43,14', 'goto 2,12', 'skip']);
    expect(sim.logic.mode).toBe('card');
    expect(sim.logic.state.flags.isSet('act4.complete')).toBe(true);
  });

  it('Anissa never jokes in Chapter 4: no money or invoice in her mouth', () => {
    const anissa = ['quay_arrive', 'samira_steps', 'coralie_meet', 'vault_arrive', 'witness_chest', 'caravan_dawn', 'majlis_audience']
      .flatMap((id) => lines(id))
      .filter((l) => l.speaker === 'anissa')
      .map((l) => l.text);
    expect(anissa.length).toBeGreaterThan(4);
    for (const t of anissa) expect(t).not.toMatch(/\b(money|invoice|bill|fee|cheap|rich)\b/i);
  });
});
