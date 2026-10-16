// The party and the purse (engine/rpg.ts): gold apart from the Wealth score, pillars per city and
// realm-wide, party members by story flags, stats with gear, the bag limit, equipment swaps, shops.

import { describe, expect, it } from 'vitest';
import { FlagStore } from '../src/engine/flags.ts';
import {
  addItem,
  armies,
  bagFree,
  bagUsed,
  buy,
  cityOf,
  equip,
  equipped,
  globalPillar,
  gold,
  itemCount,
  localPillar,
  partyMembers,
  removeItem,
  sell,
  sellPrice,
  level,
  levelBand,
  levelForXp,
  stats,
  tooHeavy,
  unequip,
  xpForLevel,
  type RpgContent,
  canWear,
  suits,
  itemLevel,
  itemStatsAt,
  rarityOf,
  itemBonus,
  knownPassives,
} from '../src/engine/rpg.ts';
import { rewardText, settleRewards, sideQuestStatus, visibleSteps, type SideQuestDef } from '../src/engine/sideQuests.ts';
import { NPCS } from '../src/data/npcs.ts';
import { RPG } from '../src/data/rpg.ts';

const rpg: RpgContent = {
  classWeapons: { mage: ['staff'], archer: ['bow'], warrior: ['blade'] },
  items: {
    soup: { id: 'soup', name: 'Soup', kind: 'consumable', price: 30, heals: 40, text: '' },
    staff: { id: 'staff', name: 'Staff', kind: 'gear', slot: 'weapon', weapon: 'staff', price: 100, stats: { mag: 4 }, text: '' },
    staff2: { id: 'staff2', name: 'Better staff', kind: 'gear', slot: 'weapon', weapon: 'staff', price: 200, stats: { mag: 7 }, text: '' },
    charm: { id: 'charm', name: 'Charm', kind: 'gear', slot: 'charm', price: 60, stats: { def: 1, spd: 1 }, text: '' },
    locket: { id: 'locket', name: 'Locket', kind: 'key', price: 0, text: '' },
  },
  members: [
    { id: 'gi', name: 'Gi', role: 'Mage', house: 'K', portrait: 'gi', era: 'present', class: 'mage', base: { hp: 40, sp: 30, atk: 6, def: 6, mag: 14, spd: 9 }, growth: { hp: 5, sp: 4, atk: 1, def: 1, mag: 2, spd: 1 }, start: { weapon: 'staff' } },
    { id: 'an', name: 'An', role: 'Support', house: 'K', portrait: 'an', era: 'present', support: true, joins: { flag: 'party.an' }, base: { hp: 0, sp: 0, atk: 0, def: 0, mag: 0, spd: 0 }, growth: { hp: 0, sp: 0, atk: 0, def: 0, mag: 0, spd: 0 } },
    { id: 'pa', name: 'Pa', role: 'Warden', house: 'K', portrait: 'pa', era: 'echo', class: 'warrior', base: { hp: 70, sp: 10, atk: 13, def: 12, mag: 3, spd: 7 }, growth: { hp: 8, sp: 1, atk: 2, def: 2, mag: 0, spd: 1 } },
  ],
  shops: { stall: { id: 'stall', name: 'Stall', city: 'z', stock: ['soup', 'charm', 'staff2'] } },
  cities: { z: { id: 'z', name: 'Z', house: 'K', sections: [{ map: 'z-town', name: 'Town', at: { x: 0, y: 0 } }] } },
  realm: [],
  pillarRules: [{ pillar: 'influence', city: 'z', flags: ['lore.a', 'lore.b'], each: 1 }],
  startingGold: 150,
  bagLimit: 5,
  xpRules: [{ flags: ['step.one', 'step.two'], each: 25 }],
  levels: { cap: 30, xpBase: 50, xpExponent: 1.6, gearUnderlevelShare: 0.5, bands: { trivial: 3, hard: 2, deadly: 5 } },
};

describe('gold and the pillars', () => {
  it('gold starts at the starting purse and is not the Wealth score', () => {
    const f = new FlagStore();
    expect(gold(f, rpg)).toBe(150);
    expect(localPillar(f, rpg, 'wealth', 'z')).toBe(0);
    buy(f, rpg, rpg.shops.stall!, 'soup');
    expect(gold(f, rpg)).toBe(120);
    expect(localPillar(f, rpg, 'wealth', 'z')).toBe(0);
  });

  it('a pillar is earned per city, from its own flag plus rules (lore read there), and adds up realm-wide', () => {
    const f = new FlagStore({ 'lore.a': true, 'pillar.influence.z': 2, 'pillar.influence.far': 3, 'pillar.fear.z': 1 });
    expect(localPillar(f, rpg, 'influence', 'z')).toBe(3);
    expect(localPillar(f, rpg, 'influence', 'far')).toBe(3);
    expect(globalPillar(f, rpg, 'influence', Object.keys(f.snapshot()))).toBe(6);
    expect(globalPillar(f, rpg, 'fear', Object.keys(f.snapshot()))).toBe(1);
  });

  it('military might is every pledged army', () => {
    const f = new FlagStore({ 'army.xaragua': 120, 'army.skarragol': 80 });
    expect(armies(f, Object.keys(f.snapshot()))).toBe(200);
  });
});

describe('the party', () => {
  it('members join by story flag, per era', () => {
    const f = new FlagStore();
    expect(partyMembers(f, rpg, 'present').map((m) => m.id)).toEqual(['gi']);
    f.set('party.an', true);
    expect(partyMembers(f, rpg, 'present').map((m) => m.id)).toEqual(['gi', 'an']);
    expect(partyMembers(f, rpg, 'echo').map((m) => m.id)).toEqual(['pa']);
  });

  it('stats are the base, plus levels, plus what is worn', () => {
    const f = new FlagStore();
    const gi = rpg.members[0]!;
    expect(stats(f, rpg, gi).mag).toBe(18); // 14 + staff 4
    f.set('xp.gi', 152); // level 3
    expect(stats(f, rpg, gi).mag).toBe(22); // 14 + 2 x 2 + 4
    expect(stats(f, rpg, gi).hp).toBe(50);
  });
});

describe('the bag', () => {
  it('holds up to the limit; key items never count', () => {
    const f = new FlagStore();
    expect(addItem(f, rpg, 'soup', 5)).toBe(true);
    expect(bagUsed(f, rpg)).toBe(5);
    expect(addItem(f, rpg, 'soup')).toBe(false);
    expect(itemCount(f, 'soup')).toBe(5);
    expect(addItem(f, rpg, 'locket')).toBe(true);
    expect(bagFree(f, rpg)).toBe(0);
    expect(removeItem(f, 'soup', 2)).toBe(true);
    expect(bagFree(f, rpg)).toBe(2);
    expect(removeItem(f, 'soup', 9)).toBe(false);
  });
});

describe('equipment', () => {
  it('swapping gear needs no space and keeps the bag count; removing needs a free place', () => {
    const f = new FlagStore();
    const gi = rpg.members[0]!;
    addItem(f, rpg, 'staff2');
    addItem(f, rpg, 'soup', 4);
    expect(equip(f, rpg, gi, 'staff2')).toBe('ok');
    expect(equipped(f, gi, 'weapon')).toBe('staff2');
    expect(itemCount(f, 'staff')).toBe(1);
    expect(bagUsed(f, rpg)).toBe(5);
    expect(unequip(f, rpg, gi, 'weapon')).toBe('bag_full');
    removeItem(f, 'soup');
    expect(unequip(f, rpg, gi, 'weapon')).toBe('ok');
    expect(equipped(f, gi, 'weapon')).toBeNull();
  });

  it('only the right people can wear an item, and support members wear nothing', () => {
    const f = new FlagStore({ 'item.staff2': 1, 'item.charm': 1 });
    expect(equip(f, rpg, rpg.members[2]!, 'staff2')).toBe('cannot_wear');
    expect(equip(f, rpg, rpg.members[1]!, 'charm')).toBe('cannot_wear');
    expect(equip(f, rpg, rpg.members[2]!, 'charm')).toBe('ok');
  });
});

describe('shops', () => {
  it('buy needs the gold and the space; sell pays half and never takes key items', () => {
    const f = new FlagStore({ gold: 100 });
    const stall = rpg.shops.stall!;
    expect(buy(f, rpg, stall, 'staff2')).toBe('no_gold');
    expect(buy(f, rpg, stall, 'locket')).toBe('not_for_sale');
    expect(buy(f, rpg, stall, 'charm')).toBe('ok');
    expect(gold(f, rpg)).toBe(40);
    expect(sell(f, rpg, 'charm')).toBe('ok');
    expect(gold(f, rpg)).toBe(40 + sellPrice(rpg.items.charm!));
    f.set('item.locket', true);
    expect(sell(f, rpg, 'locket')).toBe('cannot_sell');
    addItem(f, rpg, 'soup', 5);
    expect(buy(f, rpg, stall, 'soup')).toBe('bag_full');
  });
});

describe('the game content', () => {
  it('the fishmonger runs the fish stall (owner decision, Oct 16)', () => {
    expect(NPCS.fishmonger!.shop).toBe('zetwal_fish');
    expect(RPG.shops.zetwal_fish!.stock).toEqual(['pwason_fri', 'lanbi_fritters', 'spiny_lobster']);
    for (const id of RPG.shops.zetwal_fish!.stock) expect(RPG.items[id]?.kind).toBe('consumable');
  });
  it('every shop sells real items, every start item exists, and every item has a price unless it is a key item', () => {
    for (const s of Object.values(RPG.shops)) for (const id of s.stock) expect(RPG.items[id], `${s.id}: ${id}`).toBeDefined();
    for (const m of RPG.members) for (const id of Object.values(m.start ?? {})) expect(RPG.items[id!], `${m.id}: ${id}`).toBeDefined();
    for (const it of Object.values(RPG.items)) {
      if (it.kind === 'key' || it.rarity === 'legendary') expect(it.price, it.id).toBe(0);
      else expect(it.price, it.id).toBeGreaterThan(0);
      if (it.kind === 'gear') expect(it.slot, it.id).toBeDefined();
      // Named weapons ("X of Y") are the longest; the menus split them into two lines.
      expect(it.name.length, it.id).toBeLessThanOrEqual(34);
    }
  });

  it('every city section is a real map, listed once', () => {
    for (const c of Object.values(RPG.cities)) {
      const maps = c.sections.map((s) => s.map);
      expect(new Set(maps).size, c.id).toBe(maps.length);
    }
    expect(cityOf(RPG, 'zetwal-road')?.section.name).toBe('The Cane Road');
  });

  it('the realm has the eight countries and Eightgate', () => {
    expect(RPG.realm.length).toBe(9);
  });
});

describe('levels', () => {
  it('follow the XP curve to the cap; the party shares story XP, each member adds their own', () => {
    expect([1, 2, 3, 4, 5].map((n) => xpForLevel(rpg, n))).toEqual([0, 50, 152, 290, 459]);
    expect(levelForXp(rpg, 49)).toBe(1);
    expect(levelForXp(rpg, 50)).toBe(2);
    expect(levelForXp(rpg, 10 ** 9)).toBe(30);
    const f = new FlagStore({ 'step.one': true, 'step.two': true });
    expect(level(f, rpg, 'gi')).toBe(2);
    f.set('xp.gi', 102);
    expect(level(f, rpg, 'gi')).toBe(3);
    expect(level(f, rpg, 'pa')).toBe(2);
  });

  it('colour a foe against the party: grey, white, orange, red', () => {
    expect(levelBand(rpg, 5, 1)).toBe('trivial');
    expect(levelBand(rpg, 5, 6)).toBe('even');
    expect(levelBand(rpg, 5, 7)).toBe('hard');
    expect(levelBand(rpg, 5, 10)).toBe('deadly');
  });

  it('gear above your level is too heavy: half its bonus, rounded down', () => {
    const heavy = { ...rpg, items: { ...rpg.items, staff2: { ...rpg.items.staff2!, level: 4 } } };
    const f = new FlagStore({ 'item.staff2': 1 });
    const gi = heavy.members[0]!;
    equip(f, heavy, gi, 'staff2');
    expect(tooHeavy(f, heavy, gi, heavy.items.staff2!)).toBe(true);
    expect(stats(f, heavy, gi).mag).toBe(14 + 3); // 7 halved, rounded down
    f.set('xp.gi', 291);
    expect(stats(f, heavy, gi).mag).toBe(14 + 2 * 3 + 7);
  });
});

describe('side quests', () => {
  const q: SideQuestDef = {
    id: 'lost_book',
    title: 'The Lost Book',
    giver: 'Archivist',
    place: 'Temple Archive',
    level: 2,
    summary: 'Find a book.',
    accepted: { flag: 'side.lost_book.accepted' },
    steps: [
      { text: 'Ask around.', done: { flag: 'side.lost_book.asked' } },
      { text: 'Bring it back.', done: { flag: 'side.lost_book.returned' } },
    ],
    done: { flag: 'side.lost_book.returned' },
    reward: { gold: 40, xp: 60, items: [{ id: 'charm', n: 1 }], pillar: { pillar: 'influence', city: 'z', amount: 1 } },
  };

  it('move from unknown to active to done, showing steps up to the current one', () => {
    const f = new FlagStore();
    expect(sideQuestStatus(f, q)).toBe('unknown');
    f.set('side.lost_book.accepted', true);
    expect(sideQuestStatus(f, q)).toBe('active');
    expect(visibleSteps(f, q)).toEqual([{ text: 'Ask around.', done: false }]);
    f.set('side.lost_book.asked', true);
    expect(visibleSteps(f, q).map((s) => s.done)).toEqual([true, false]);
    f.set('side.lost_book.returned', true);
    expect(sideQuestStatus(f, q)).toBe('done');
  });

  it('pay their reward exactly once', () => {
    const f = new FlagStore({ 'side.lost_book.accepted': true, 'side.lost_book.returned': true });
    expect(settleRewards(f, rpg, [q]).map((x) => x.id)).toEqual(['lost_book']);
    expect(gold(f, rpg)).toBe(190);
    expect(level(f, rpg, 'gi')).toBe(2);
    expect(itemCount(f, 'charm')).toBe(1);
    expect(localPillar(f, rpg, 'influence', 'z')).toBe(1);
    expect(settleRewards(f, rpg, [q])).toEqual([]);
    expect(gold(f, rpg)).toBe(190);
    expect(rewardText(q, rpg)).toBe('+40 gold, +60 XP, Charm, +1 influence');
  });
});

describe('gear classes, rarities and relics (owner decision, Oct 15)', () => {
  const member = (id: string) => RPG.members.find((m) => m.id === id)!;
  const item = (id: string) => RPG.items[id]!;

  it('only mages hold staffs, only archers bows, only warriors blades; armour and charms fit anyone', () => {
    const gianna = member('gianna');
    const yari = member('yari');
    const patricio = member('patricio');
    expect(canWear(RPG, item('archivist_staff'), gianna)).toBe(true);
    expect(canWear(RPG, item('archivist_staff'), yari)).toBe(false);
    expect(canWear(RPG, item('yaguana_bow'), yari)).toBe(true);
    expect(canWear(RPG, item('yaguana_bow'), gianna)).toBe(false);
    expect(canWear(RPG, item('cane_machete'), patricio)).toBe(true);
    expect(canWear(RPG, item('cane_machete'), gianna)).toBe(false);
    for (const m of [gianna, yari, patricio]) {
      expect(canWear(RPG, item('iron_cuirass'), m), m.id).toBe(true);
      expect(canWear(RPG, item('sea_glass_charm'), m), m.id).toBe(true);
      expect(canWear(RPG, item('solange_quill'), m), m.id).toBe(true);
    }
    expect(canWear(RPG, item('archivist_robe'), member('anissa'))).toBe(false);
    expect(suits(item('archivist_robe'), gianna)).toBe(true);
    expect(suits(item('iron_cuirass'), gianna)).toBe(false);
    expect(suits(item('iron_cuirass'), patricio)).toBe(true);
  });

  it('every weapon has a kind, every armour a kind, every gear item a slot that matches', () => {
    for (const it of Object.values(RPG.items)) {
      if (it.kind !== 'gear') continue;
      if (it.slot === 'weapon') expect(it.weapon, it.id).toBeDefined();
      if (it.slot === 'armor') expect(it.armor, it.id).toBeDefined();
      expect(it.slot === 'relic', it.id).toBe(it.rarity === 'legendary');
      // Rare and above add something: a special property, or a skill that comes with the item (owner, Oct 15).
      if (it.rarity === 'rare' || it.rarity === 'epic' || it.rarity === 'legendary') expect(it.special ?? it.skill, it.id).toBeDefined();
    }
  });

  it('legendary relics grow with their wearer and are never too heavy; the rest keep a set level', () => {
    const quill = item('solange_quill');
    expect(itemLevel(quill, 7)).toBe(7);
    expect(itemStatsAt(quill, 1)).toEqual({ mag: 2, sp: 4 });
    expect(itemStatsAt(quill, 5)).toEqual({ mag: 4, sp: 8 });
    const f = new FlagStore();
    expect(tooHeavy(f, RPG, member('gianna'), quill)).toBe(false);
    expect(itemLevel(item('sunwood_staff'), 9)).toBe(4);
    expect(rarityOf(item('archivist_staff'))).toBe('common');
  });

  it('heavy armour costs speed even when worn too early (a penalty is never halved)', () => {
    const f = new FlagStore();
    const yari = member('yari');
    expect(itemBonus(f, RPG, yari, item('iron_cuirass'))).toEqual({ def: 4, hp: 7, spd: -1 });
  });

  it('relics take no bag space and cannot be sold', () => {
    const f = new FlagStore();
    expect(addItem(f, RPG, 'solange_quill')).toBe(true);
    expect(bagUsed(f, RPG)).toBe(0);
    expect(sell(f, RPG, 'solange_quill')).toBe('cannot_sell');
    expect(equip(f, RPG, member('yari'), 'solange_quill')).toBe('ok');
    expect(equipped(f, member('yari'), 'relic')).toBe('solange_quill');
  });

  it('passives show once the player knows them', () => {
    const gianna = member('gianna');
    expect(knownPassives(new FlagStore(), gianna).map((p) => p.name)).toEqual(["Archivist's thrift"]);
    expect(knownPassives(new FlagStore({ 'party.anissa': true }), gianna).map((p) => p.name)).toContain("Anissa's Light");
  });
});
