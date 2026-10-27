// The second batch of side quests built Oct 27 (src/data/sideQuestsLate.ts; the owner, Oct 27: every optional side quest
// for the Nov 22 release): each walked through in the simulator from the route's own save at that point (the route never
// takes them), paid once, closed when the story moves past it. The level curve with all of them done is checked with the
// first batch's in tests/sideQuestsLate.test.ts.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { LATE_XP } from '../src/data/sideQuestsLate.ts';
import { CHAPEL, ERRAND, FEAST_FLAGS, WATCHES } from '../src/data/ardencia.ts';
import { SAKK_FLAGS, SAFFRON_FLAGS, INVOICE_FLAGS } from '../src/data/aldoria.ts';
import { SECRET_ITEMS } from '../src/config.ts';
import { buyPrice, gold, sellPrice } from '../src/engine/rpg.ts';
import { localPillar, sharedXp } from '../src/engine/rpg.ts';
import { settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { mysteryQuests } from '../src/engine/guide.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
const quest = (id: string) => SIDE_QUESTS.find((q) => q.id === id)!;

/** The game as the route leaves it at a marker (its nth time: the route has two "@dusk"). */
function simAt(mark: string, nth = 1): Sim {
  const sim = newGameSim(maps);
  let seen = 0;
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark && ++seen === nth) return sim;
    sim.run([item]);
  }
  throw new Error(`No mark @${mark}`);
}

/** No ambushes on this walk (the wild sections roll their own; these tests walk the quests, not the dice). */
function calm(sim: Sim): Sim {
  (sim.logic as unknown as { encounterZoneAt: () => undefined }).encounterZoneAt = () => undefined;
  return sim;
}

/** Press A through a conversation's lines until it offers a choice, then pick the k-th. */
function choose(sim: Sim, k: number): void {
  for (let i = 0; i < 40 && sim.logic.mode === 'dialogue' && sim.logic.view().kind !== 'choice'; i++) sim.run(['confirm']);
  expect(sim.logic.view().kind).toBe('choice');
  sim.run([...(k > 0 ? [`down*${k}`] : []), 'confirm']);
}

/** What one quest pays when it is settled (and that it pays only once). */
function paid(flags: FlagStore, id: string): number {
  const xp = sharedXp(flags, RPG);
  expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain(id);
  expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain(id);
  return sharedXp(flags, RPG) - xp;
}

// ---- Chapter 3 ----------------------------------------------------------------------------------------------------

/** The morning of the trial: the day's three things done, Ar-1's night over, the party in the Lower Town. */
function trialMorning(): Sim {
  const sim = simAt('bread-night');
  settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
  expect(sim.logic.map.id).toBe('ardencia-lower');
  sim.run(['goto 31,9']);
  expect(sim.logic.map.id).toBe('ardencia-town');
  return sim;
}

describe('Ar-3 The Elders\' Feast (Cenizal, the morning of the trial)', () => {
  it('opens only on the morning of the trial, from the contract board; the route never takes it', () => {
    const before = simAt('debate').logic.state.flags;
    expect(mysteryQuests([quest('feast')], before)).toEqual([]);
    const flags = trialMorning().logic.state.flags;
    expect(mysteryQuests([quest('feast')], flags).map((q) => q.id)).toEqual(['feast']);
    const end = simAt('chapter3-end').logic.state.flags;
    expect(sideQuestStatus(end, quest('feast'))).toBe('unknown');
    expect(mysteryQuests([quest('feast')], end)).toEqual([]);
  });

  it('the board, the feast (the steward, the servants, Ferrán\'s boast), the hall\'s book and three questions: +2 Influence', () => {
    const sim = trialMorning();
    const flags = sim.logic.state.flags;
    sim.run(['goto 22,14', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, quest('feast'))).toBe('active');
    // Up the plaza into the Alcázar, to the elders' hall door.
    sim.run(['goto 19,7', 'up']);
    expect(sim.logic.map.id).toBe('ardencia-alcazar');
    sim.run(['goto 10,7', 'skip']);
    expect(flags.isSet(FEAST_FLAGS.heard)).toBe(true);
    // Ferrán before the book: he sends the guard back to the door.
    sim.run(['goto 3,6', 'up', 'confirm', 'skip']);
    expect(flags.isSet(FEAST_FLAGS.done)).toBe(false);
    // The records room's salt-tax book.
    sim.run(['goto 23,3', 'up', 'confirm', 'skip']);
    expect(flags.isSet(FEAST_FLAGS.book)).toBe(true);
    // Three questions: a wrong answer, then the book twice; lost (one of three), then won on the second pot.
    sim.run(['goto 3,6', 'up', 'confirm']);
    choose(sim, 0);
    choose(sim, 0);
    choose(sim, 1);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet(FEAST_FLAGS.done)).toBe(false);
    sim.run(['up', 'confirm']);
    choose(sim, 0);
    choose(sim, 1);
    choose(sim, 1);
    choose(sim, 2);
    sim.run(['skip']);
    for (const f of [FEAST_FLAGS.done, FEAST_FLAGS.influence]) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet(FEAST_FLAGS.fear)).toBe(false);
    const influence = localPillar(flags, RPG, 'influence', 'ardencia');
    expect(influence - localPillar(new FlagStore({ ...flags.snapshot(), [FEAST_FLAGS.influence]: false }), RPG, 'influence', 'ardencia')).toBe(2);
    expect(paid(flags, 'feast')).toBe(LATE_XP.feast);
  });

  it('or the Fear route: Ferrán\'s blades at his door (the fight), the tally from under his stair, the key in Gianna\'s hand', () => {
    const sim = trialMorning();
    const flags = sim.logic.state.flags;
    sim.run(['goto 22,14', 'up', 'confirm', 'skip', 'goto 19,7', 'up', 'goto 10,7', 'skip', 'goto 16,21']);
    expect(sim.logic.map.id).toBe('ardencia-town');
    sim.run(['goto 5,5', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sim.battles.at(-1)).toBe('feast_blades');
    sim.run(['skip']);
    expect(flags.isSet(FEAST_FLAGS.tally)).toBe(true);
    sim.run(['goto 19,7', 'up', 'goto 3,6', 'up', 'confirm', 'skip']);
    for (const f of [FEAST_FLAGS.done, FEAST_FLAGS.fear]) expect(flags.isSet(f), f).toBe(true);
    const fear = localPillar(flags, RPG, 'fear', 'ardencia');
    expect(fear - localPillar(new FlagStore({ ...flags.snapshot(), [FEAST_FLAGS.fear]: false }), RPG, 'fear', 'ardencia')).toBe(2);
    expect(paid(flags, 'feast')).toBe(LATE_XP.feast);
  });
});

describe('Ar-4 The Old Lord\'s Errand (secret: La Promesa de Benny)', () => {
  it('is never a mystery quest; old Benny offers it after Ar-2, and Zelia unlocks the chapel stair', () => {
    const sim = simAt('old-benny');
    const flags = sim.logic.state.flags;
    expect(mysteryQuests(SIDE_QUESTS, flags).map((q) => q.id)).not.toContain('old_errand');
    expect(sideQuestStatus(flags, quest('old_errand'))).toBe('unknown');
    sim.run(['confirm', 'skip']);
    expect(sideQuestStatus(flags, quest('old_errand'))).toBe('active');
  });

  it('the cloister: seen now or then is back to the stair; the five swaps, young Benny, the bolt, the box, Benny\'s stair', () => {
    const sim = simAt('old-benny');
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    sim.run(['confirm', 'skip', 'goto 31,16', 'right']);
    expect(sim.logic.map.id).toBe('ardencia-chapel');
    sim.run(['skip']);
    expect(sim.logic.state.player.pos).toEqual(CHAPEL.gate);
    // Straight along the south walk now: the guard by the well sees (Anissa's first hint), and back to the stair.
    sim.run(['right*4', 'skip']);
    expect(flags.get(ERRAND.seen)).toBe(1);
    expect(sim.logic.state.player.pos).toEqual(CHAPEL.gate);
    // The way across (puzzles/ardencia_cloister).
    sim.run(readJson<string[]>('puzzles/ardencia_cloister/solution.json'));
    for (const f of [ERRAND.asked, ERRAND.anchor, ERRAND.promise]) expect(flags.isSet(f), f).toBe(true);
    // Up Benny's stair into the quiet rooms, and the letter read to him.
    sim.run(['left*6']);
    expect(sim.logic.map.id).toBe('ardencia-alcazar');
    sim.run(['goto 4,15', 'left', 'confirm', 'skip']);
    expect(flags.isSet(ERRAND.done)).toBe(true);
    const influence = localPillar(flags, RPG, 'influence', 'ardencia');
    expect(paid(flags, 'old_errand')).toBe(LATE_XP.oldErrand);
    expect(localPillar(flags, RPG, 'influence', 'ardencia') - influence).toBe(2);
    expect(flags.isSet('item.benny_promise')).toBe(true);
  });

  it('each watch sees in its own era only, and the strips lie where the walk must cross them', () => {
    expect(WATCHES.map((w) => w.era)).toEqual(['present', 'echo', 'present', 'echo', 'present']);
    const map = maps['ardencia-chapel']!;
    for (const w of WATCHES) {
      const t = map.triggers.find((x) => x.id === `seen_${w.id}`)!;
      expect(t.era, w.id).toBe(w.era);
      // The strip spans the whole walk it lies on (no tile of the walk beside it to slip past).
      expect(t.area.width * t.area.height, w.id).toBe(2);
    }
  });
});

describe('Ar-5 The Arrows Missed (the strand camp)', () => {
  it('five of Azzy\'s company; three saw every shot land wide; Azzy will not hear it; +2 Fear', () => {
    const sim = simAt('strand');
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    const q = quest('arrows');
    expect(mysteryQuests([q], flags).map((x) => x.id)).toEqual(['arrows']);
    sim.run(['goto 9,6', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    sim.run(['goto 11,8', 'up', 'confirm', 'skip', 'goto 12,6', 'up', 'confirm', 'skip', 'goto 5,6', 'left', 'confirm', 'skip']);
    expect(flags.isSet('side.arrows.done')).toBe(false);
    sim.run(['goto 15,10', 'right', 'confirm', 'skip']);
    for (const f of ['side.arrows.done', 'clue.arrows_missed']) expect(flags.isSet(f), f).toBe(true);
    const fear = localPillar(flags, RPG, 'fear', 'ardencia');
    expect(paid(flags, 'arrows')).toBe(LATE_XP.arrows);
    expect(localPillar(flags, RPG, 'fear', 'ardencia') - fear).toBe(2);
  });

  it('closes when the trader sails', () => {
    const flags = simAt('aldoria').logic.state.flags;
    expect(mysteryQuests([quest('arrows')], flags)).toEqual([]);
    expect(sideQuestStatus(flags, quest('arrows'))).toBe('unknown');
    void readFileSync;
  });
});

// ---- Chapter 4 ----------------------------------------------------------------------------------------------------

describe('A-2 The Missing Saffron (Bab al-Dhahab, the night of the vault)', () => {
  it('the board at dusk, the merchant, the tracks, the raiders (the blade), the nephew home; +1 Wealth and the tea', () => {
    const sim = calm(simAt('dusk', 2));
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    expect(sim.logic.map.id).toBe('aldoria-bazaar');
    expect(mysteryQuests([quest('saffron')], flags).map((q) => q.id)).toEqual(['saffron']);
    sim.run(['goto 14,9', 'left', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sideQuestStatus(flags, quest('saffron'))).toBe('active');
    sim.run(['goto 43,14']);
    expect(sim.logic.map.id).toBe('aldoria-desert');
    sim.run(['goto 3,8', 'left', 'confirm', 'skip']);
    expect(flags.isSet(SAFFRON_FLAGS.asked)).toBe(true);
    sim.run(['goto 22,15', 'skip']);
    expect(flags.isSet(SAFFRON_FLAGS.tracks)).toBe(true);
    sim.run(['goto 37,22', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sim.battles.at(-1)).toBe('saffron_raiders');
    sim.run(['skip']);
    for (const f of [SAFFRON_FLAGS.freed, SAFFRON_FLAGS.fought]) expect(flags.isSet(f), f).toBe(true);
    sim.run(['goto 3,8', 'left', 'confirm', 'skip']);
    expect(flags.isSet(SAFFRON_FLAGS.done)).toBe(true);
    const wealth = localPillar(flags, RPG, 'wealth', 'al_doria');
    expect(paid(flags, 'saffron')).toBe(LATE_XP.saffron);
    expect(localPillar(flags, RPG, 'wealth', 'al_doria') - wealth).toBe(1);
    expect(flags.get('item.spiced_tea')).toBe(3);
  });

  it('or the purse: a hundred gold and the raiders walk off east', () => {
    const sim = calm(simAt('dusk', 2));
    const flags = sim.logic.state.flags;
    sim.run(['goto 14,9', 'left', 'confirm']);
    choose(sim, 0);
    sim.run(['skip', 'goto 43,14', 'goto 3,8', 'left', 'confirm', 'skip', 'goto 22,15', 'skip']);
    flags.set('gold', 500);
    sim.run(['goto 37,22', 'up', 'confirm']);
    choose(sim, 1);
    sim.run(['skip']);
    expect(flags.isSet(SAFFRON_FLAGS.freed)).toBe(true);
    expect(flags.isSet(SAFFRON_FLAGS.fought)).toBe(false);
    expect(gold(flags, RPG)).toBe(400);
  });
});

/** After the Merchant-Prince's word, up the vault stair into the bazaar at night. */
function afterLayla(): Sim {
  const sim = simAt('layla');
  settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
  sim.run(['goto 4,0']);
  expect(sim.logic.map.id).toBe('aldoria-bazaar');
  return sim;
}

describe('A-4 The Uncashed Note (secret: the Sakk of Yusuf)', () => {
  it('the old moneychanger; the war-time bazaar\'s trades; a wrong deposit pays fifty and is amended; indigo opens box seven', () => {
    const sim = afterLayla();
    const flags = sim.logic.state.flags;
    expect(mysteryQuests(SIDE_QUESTS, flags).map((q) => q.id)).not.toContain('uncashed');
    sim.run(['goto 4,23', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sideQuestStatus(flags, quest('uncashed'))).toBe('active');
    // Into the war-time bazaar: the coins straight into box seven (a wrong deposit).
    sim.run(['echo', 'skip', 'goto 5,22', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.get(SAKK_FLAGS.deposit)).toBe('coins');
    sim.run(['goto 5,23', 'echo', 'skip']);
    expect(sim.logic.era).toBe('present');
    // Box seven now: a small sakk, fifty gold.
    const purse = gold(flags, RPG);
    sim.run(['goto 10,11', 'goto 15,10', 'down', 'confirm', 'skip']);
    expect(flags.isSet(SAKK_FLAGS.small)).toBe(true);
    expect(gold(flags, RPG) - purse).toBe(50);
    expect(flags.isSet(SAKK_FLAGS.done)).toBe(false);
    // Back to the row: amend, then the chain (coins, dates, salt, peppers, indigo) and the indigo deposited.
    sim.run(['goto 4,0', 'goto 4,23', 'echo', 'skip', 'goto 5,22', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet(SAKK_FLAGS.anchor)).toBe(false);
    for (const [x, who] of [[2, 'dates'], [6, 'salt'], [8, 'peppers'], [10, 'indigo']] as const) {
      sim.run([`goto ${x},23`, 'up', 'confirm']);
      choose(sim, 0);
      sim.run(['skip']);
      expect(flags.get(SAKK_FLAGS.goods), who).toBe(who);
    }
    sim.run(['goto 5,22', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip', 'goto 5,23', 'echo', 'skip']);
    expect(flags.get(SAKK_FLAGS.deposit)).toBe('indigo');
    sim.run(['goto 10,11', 'goto 15,10', 'down', 'confirm', 'skip']);
    for (const f of [SAKK_FLAGS.done, 'item.sakk_yusuf']) expect(flags.isSet(f), f).toBe(true);
    expect(paid(flags, 'uncashed')).toBe(LATE_XP.uncashed);
  });

  it('carried: every shop 15% off and 60% for what is sold; Samira cashes one coupon a chapter at a shop', () => {
    const tea = RPG.items.mint_tea!;
    const none = new FlagStore({});
    const held = new FlagStore({ 'item.sakk_yusuf': true });
    expect(buyPrice(tea, none, RPG)).toBe(tea.price);
    expect(buyPrice(tea, held, RPG)).toBe(Math.ceil(tea.price * (1 - SECRET_ITEMS.sakk.discount)));
    expect(sellPrice(tea, none, RPG)).toBe(Math.floor(tea.price / 2));
    expect(sellPrice(tea, held, RPG)).toBe(Math.floor(tea.price * SECRET_ITEMS.sakk.sellShare));
    const sim = afterLayla();
    const flags = sim.logic.state.flags;
    flags.set('item.sakk_yusuf', true);
    const purse = gold(flags, RPG);
    sim.run(['goto 36,23', 'up', 'confirm', 'skip']);
    expect(gold(flags, RPG) - purse).toBe(SECRET_ITEMS.sakk.coupon);
    expect(sim.log.at(-1)).toContain('coupons');
    sim.run(['confirm', 'skip']);
    expect(gold(flags, RPG) - purse).toBe(SECRET_ITEMS.sakk.coupon);
  });
});

describe('A-5 Invoice for the Crown (the quay, the night before the caravan)', () => {
  it('Samira\'s last invoice on the quay; the factor pays for his own crates: +1 Influence, and her first heartfelt line', () => {
    const sim = afterLayla();
    const flags = sim.logic.state.flags;
    expect(mysteryQuests([quest('invoice')], flags).map((q) => q.id)).toEqual(['invoice']);
    sim.run(['goto 21,31', 'skip']);
    expect(sim.logic.map.id).toBe('aldoria-quay');
    expect(sideQuestStatus(flags, quest('invoice'))).toBe('active');
    sim.run(['goto 23,13', 'down', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    for (const f of [INVOICE_FLAGS.done, INVOICE_FLAGS.influence]) expect(flags.isSet(f), f).toBe(true);
    const influence = localPillar(flags, RPG, 'influence', 'al_doria');
    expect(influence - localPillar(new FlagStore({ ...flags.snapshot(), [INVOICE_FLAGS.influence]: false }), RPG, 'influence', 'al_doria')).toBe(1);
    expect(paid(flags, 'invoice')).toBe(LATE_XP.invoice);
  });

  it('or Samira collects: the guards from the ship, and +1 Fear', () => {
    const sim = afterLayla();
    const flags = sim.logic.state.flags;
    sim.run(['goto 21,31', 'skip', 'goto 23,13', 'down', 'confirm']);
    choose(sim, 1);
    sim.run(['skip']);
    expect(sim.battles.at(-1)).toBe('factor_guards');
    sim.run(['skip']);
    for (const f of [INVOICE_FLAGS.done, INVOICE_FLAGS.fear]) expect(flags.isSet(f), f).toBe(true);
  });

  it('the route walks past all three: none is taken, and all close at first light', () => {
    const flags = simAt('chapter4-end').logic.state.flags;
    for (const id of ['saffron', 'uncashed', 'invoice']) {
      expect(sideQuestStatus(flags, quest(id)), id).toBe('unknown');
      expect(mysteryQuests([quest(id)], flags), id).toEqual([]);
    }
  });
});

// ---- Chapter 6 ----------------------------------------------------------------------------------------------------

/** Ordvik at dawn after the price: out of the Moot onto the fair. */
function ordvikDawn(): Sim {
  const sim = calm(simAt('ordvik-horn'));
  settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
  expect(sim.logic.state.flags.isSet('ally.skarragol')).toBe(true);
  sim.run(['goto 17,25']);
  expect(sim.logic.map.id).toBe('skarragol-fair');
  return sim;
}

describe('S-1 Salkhi Has Opinions (Ordvik, at dawn)', () => {
  it('the foal at the folds, the felt for the saddle, the bay in the corral; then no more sighing at Azzy; +1 Wealth', () => {
    const sim = ordvikDawn();
    const flags = sim.logic.state.flags;
    sim.run(['goto 25,12', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, quest('salkhi'))).toBe('active');
    // The foal, on the plateau.
    sim.run(['goto 45,15']);
    expect(sim.logic.map.id).toBe('skarragol-plateau');
    sim.run(['goto 28,14', 'right', 'confirm', 'skip']);
    expect(flags.isSet('side.salkhi.foal')).toBe(true);
    sim.run(['goto 0,15']);
    // The felt, from the horse-trader.
    flags.set('gold', 500);
    sim.run(['goto 20,21', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet('side.salkhi.saddle')).toBe(true);
    // The bay in the corral.
    sim.run(['goto 5,24', 'left', 'confirm', 'skip']);
    expect(flags.isSet('side.salkhi.rival')).toBe(true);
    sim.run(['goto 25,12', 'up', 'confirm', 'skip']);
    expect(flags.isSet('side.salkhi.done')).toBe(true);
    const wealth = localPillar(flags, RPG, 'wealth', 'skarragol');
    expect(paid(flags, 'salkhi')).toBe(LATE_XP.salkhi);
    expect(localPillar(flags, RPG, 'wealth', 'skarragol') - wealth).toBe(1);
  });
});

describe('S-2\'s race: the first snow (Ordvik, at dawn)', () => {
  it('the judge by the corral; the stride tapped right; the grey mare by a nose; the purse to the fleet\'s winter', () => {
    const sim = ordvikDawn();
    const flags = sim.logic.state.flags;
    sim.run(['goto 12,24', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sim.rhythms.at(-1)).toBe('salkhi_race');
    for (const f of ['side.race.won', 'side.race.done']) expect(flags.isSet(f), f).toBe(true);
    const wealth = localPillar(flags, RPG, 'wealth', 'skarragol');
    expect(paid(flags, 'race')).toBe(LATE_XP.race);
    expect(localPillar(flags, RPG, 'wealth', 'skarragol') - wealth).toBe(1);
  });

  it('a lost race plays its own scene and can be run again', () => {
    const sim = ordvikDawn();
    const flags = sim.logic.state.flags;
    sim.run(['goto 12,24', 'up']);
    // The browser reports a stride tapped wrong (the simulator always taps it right).
    flags.set('side.race.accepted', true);
    sim.logic.finishRhythm('salkhi_race', false);
    expect(sim.logic.dialogueId).toBe('race_lost');
    sim.run(['skip']);
    expect(flags.isSet('side.race.done')).toBe(false);
    sim.run(['up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet('side.race.done')).toBe(true);
  });
});

describe('S-4 The Cairn of Nine Riders (secret: Sarnai\'s Bridle Bell)', () => {
  it('the old herder with Bayarmaa; the sky from the stone at the third horn; the seventh cairn; Salkhi and the capstone', () => {
    const sim = ordvikDawn();
    const flags = sim.logic.state.flags;
    expect(mysteryQuests(SIDE_QUESTS, flags).map((q) => q.id)).not.toContain('cairn');
    sim.run(['goto 45,15', 'goto 32,6', 'left', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, quest('cairn'))).toBe('active');
    expect(flags.isSet('clue.mare_sketch')).toBe(true);
    sim.run(['goto 36,7', 'up']);
    sim.run(readJson<string[]>('puzzles/skarragol_cairn/solution.json'));
    for (const f of ['clue.cairn_sighted', 'anchor.bridle_buried', 'side.cairn.done', 'item.sarnai_bell']) expect(flags.isSet(f), f).toBe(true);
    const wealth = localPillar(flags, RPG, 'wealth', 'skarragol');
    expect(paid(flags, 'cairn')).toBe(LATE_XP.cairn);
    expect(localPillar(flags, RPG, 'wealth', 'skarragol') - wealth).toBe(2);
  });

  it('the route walks past Ordvik\'s three: none taken, and all close when the longship sails', () => {
    const flags = simAt('chapter6-end').logic.state.flags;
    for (const id of ['salkhi', 'race', 'cairn']) expect(sideQuestStatus(flags, quest(id)), id).toBe('unknown');
  });
});
