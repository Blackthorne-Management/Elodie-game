// The ally ledger and the Muster (engine/ally.ts; the Chapter 10 outline 7.0 with its second review's 3.5 and 3.11): the
// share each house is paid, the book cap and the half-value rule, the mediation's payment, the gifts, the buyer named by
// the least share with the full tie order, the 60 percent gate with its evidence, the armies, the night's turned house
// and the Concord bonuses paid once.

import { describe, expect, it } from 'vitest';
import { ALLY_PRICES, CONCORD_START, MUSTER } from '../src/config.ts';
import { RPG } from '../src/data/rpg.ts';
import { allyLedger, allyShare, armyFor, cappedPillar, leastPaid, musterJournal, musterTick, resolveMuster } from '../src/engine/ally.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';

/** Every price paid in full in its own currency (the city's flag), the realm's Fear at 8. */
const PAID: FlagSnapshot = {
  'story.muster_begun': true,
  'pillar.influence.al_doria': 10,
  'pillar.wealth.skarragol': 10,
  'pillar.influence.kuroshi': 10,
  'pillar.wealth.jwaladesh': 8,
  'pillar.fear.aldermoor': 8,
};
const flagsOf = (more: FlagSnapshot = {}) => new FlagStore({ ...PAID, ...more });

describe('the ledger: what each house is paid', () => {
  it('reads the city pillar in the price currency, the other two at half, the realm Fear for Free Brasador and the dissidents', () => {
    const f = flagsOf({ 'pillar.fear.skarragol': 2, 'pillar.influence.skarragol': 1 });
    expect(allyShare(f, RPG, 'skarragol').points).toBe(11.5);
    expect(allyShare(f, RPG, 'free_brasador', Object.keys(f.snapshot())).points).toBe(10);
    expect(allyShare(f, RPG, 'aldermoor', Object.keys(f.snapshot())).share).toBe(10 / 8);
  });

  it('counts lore books at most three toward a price (the Chapter 4 review: thirteen books are not a price paid)', () => {
    const books = RPG.pillarRules.find((r) => r.pillar === 'influence' && r.city === 'al_doria' && r.flags[0]!.startsWith('lore.'))!.flags;
    const f = new FlagStore(Object.fromEntries(books.map((b) => [b, true])));
    expect(books.length).toBeGreaterThan(MUSTER.bookCap);
    expect(cappedPillar(f, RPG, 'influence', 'al_doria')).toBe(MUSTER.bookCap);
    expect(allyShare(f, RPG, 'al_doria').points).toBe(MUSTER.bookCap);
  });

  it('a mediation pays two toward the Influence house that is its ally, and gifts pay a Wealth house a point each', () => {
    const f = new FlagStore({ 'debate.zetwal_feud_merchants.mediated': true, 'debate.zetwal_feud_temple.mediated': true, 'muster.gift.skarragol': 3 });
    expect(allyShare(f, RPG, 'al_doria').points).toBe(MUSTER.mediationBonus);
    expect(allyShare(f, RPG, 'kuroshi').points).toBe(MUSTER.mediationBonus);
    expect(allyShare(f, RPG, 'skarragol').points).toBe(3);
    expect(allyShare(f, RPG, 'jwaladesh').points).toBe(0);
  });
});

describe('the buyer: least paid, first bought', () => {
  it('is the least share among the four road houses (never Free Brasador or the dissidents)', () => {
    const f = flagsOf({ 'pillar.wealth.jwaladesh': 4, 'pillar.fear.aldermoor': 0 });
    expect(leastPaid(f, RPG).house).toBe('jwaladesh');
  });

  it('breaks a tie in the order Dorini, Ironvow, Agnivansh, Suzumori (the guide, then the roads)', () => {
    expect(leastPaid(flagsOf(), RPG).house).toBe('al_doria');
    expect(leastPaid(flagsOf({ 'pillar.influence.al_doria': 12 }), RPG).house).toBe('skarragol');
    expect(leastPaid(flagsOf({ 'pillar.influence.al_doria': 12, 'pillar.wealth.skarragol': 12 }), RPG).house).toBe('jwaladesh');
    expect(leastPaid(flagsOf({ 'pillar.influence.al_doria': 12, 'pillar.wealth.skarragol': 12, 'pillar.wealth.jwaladesh': 10 }), RPG).house).toBe('kuroshi');
  });
});

describe('resolving the Muster at the step into the night', () => {
  it('names the buyer, pledges every army (the buyer\'s at 0 until the night), and the levy', () => {
    const f = flagsOf({ 'pillar.wealth.skarragol': 3 });
    const buyer = resolveMuster(f, RPG, Object.keys(f.snapshot()));
    expect(buyer.house).toBe('skarragol');
    expect(f.get('muster.betrayer')).toBe('skarragol');
    expect(f.isSet('muster.betrayer.skarragol')).toBe(true);
    expect(f.get('army.skarragol')).toBe(0);
    expect(f.get('army.al_doria')).toBe(ALLY_PRICES.al_doria!.army);
    expect(f.get('army.zetwal')).toBe(MUSTER.levy);
    expect(f.isSet('muster.resolved')).toBe(true);
  });

  it('opens the exposed route only at 60 percent paid with the buyer\'s list and the smugglers\' ledger', () => {
    const at = (wealth: number, more: FlagSnapshot) => {
      const f = flagsOf({ 'pillar.wealth.skarragol': wealth, ...more });
      resolveMuster(f, RPG);
      return f.isSet('muster.exposed_possible');
    };
    const evidence = { 'clue.buyers_mark': true, 'side.muskets.done': true };
    expect(at(6, evidence)).toBe(true);
    expect(at(5, evidence)).toBe(false);
    expect(at(6, { 'clue.buyers_mark': true })).toBe(false);
  });

  it('a house that argued a feud brings nine tenths, both sides, won or lost; a mediated one brings all; overpaying adds a tenth a point', () => {
    const def = ALLY_PRICES.skarragol!;
    expect(armyFor(new FlagStore(), def, 1)).toBe(def.army);
    expect(armyFor(new FlagStore({ 'debate.zetwal_feud_merchants.joined': true }), def, 1)).toBe(Math.round(def.army * MUSTER.joinedShare));
    expect(armyFor(new FlagStore({ 'debate.zetwal_feud_merchants.joined': true, 'debate.zetwal_feud_merchants.mediated': true }), def, 1)).toBe(def.army);
    expect(armyFor(new FlagStore(), def, 1.2)).toBe(Math.round(def.army * (1 + 2 * MUSTER.overpayPerPoint)));
    expect(armyFor(new FlagStore(), def, 0.5)).toBe(def.army / 2);
  });

  it('runs once, from the scene that asks; the turned house then brings three quarters', () => {
    const f = flagsOf({ 'pillar.wealth.skarragol': 7, 'clue.buyers_mark': true, 'side.muskets.done': true });
    musterTick(f, RPG);
    expect(f.get('muster.share.skarragol')).toBe(70);
    expect(f.get('muster.short.skarragol')).toBe(3);
    expect(f.isSet('muster.resolved')).toBe(false);
    f.set('muster.resolve', true);
    musterTick(f, RPG);
    expect(f.isSet('muster.exposed_possible')).toBe(true);
    const turned = f.get('muster.turned_army');
    expect(turned).toBe(Math.round(Math.round(ALLY_PRICES.skarragol!.army * 0.7) * MUSTER.turnedShare));
    // Paying more after the night changes nothing: the shares are no longer written.
    f.set('muster.gift.skarragol', 3);
    musterTick(f, RPG);
    expect(f.get('muster.share.skarragol')).toBe(70);
    f.set('muster.turned', true);
    musterTick(f, RPG);
    expect(f.get('army.skarragol')).toBe(turned);
  });

  it('pays the chapter\'s Concord bonuses once each (the four accounts, the lonely cutter)', () => {
    const f = new FlagStore({ 'clue.four_accounts': true });
    musterTick(f, RPG);
    musterTick(f, RPG);
    expect(f.get('concord')).toBe(CONCORD_START + 3);
    f.set('side.lonely_cutter.done', true);
    musterTick(f, RPG);
    expect(f.get('concord')).toBe(CONCORD_START + 6);
  });

  it('the Journal shows each house\'s share from the landing, and its soldiers once pledged', () => {
    const f = flagsOf();
    expect(musterJournal(f, RPG)[1]).toBe('The Dorini marines: 10 of Influence 10.');
    resolveMuster(f, RPG);
    expect(musterJournal(f, RPG)[2]).toBe(`The Ironvow fleet: 10 of Wealth 10. Soldiers: ${ALLY_PRICES.skarragol!.army}.`);
    expect(allyLedger(f, RPG).map((s) => s.house)).toEqual(Object.keys(ALLY_PRICES));
  });
});
