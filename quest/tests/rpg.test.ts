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
  stats,
  unequip,
  type RpgContent,
} from '../src/engine/rpg.ts';
import { RPG } from '../src/data/rpg.ts';

const rpg: RpgContent = {
  items: {
    soup: { id: 'soup', name: 'Soup', kind: 'consumable', price: 30, heals: 40, text: '' },
    staff: { id: 'staff', name: 'Staff', kind: 'gear', slot: 'weapon', price: 100, stats: { mag: 4 }, users: ['gi'], text: '' },
    staff2: { id: 'staff2', name: 'Better staff', kind: 'gear', slot: 'weapon', price: 200, stats: { mag: 7 }, users: ['gi'], text: '' },
    charm: { id: 'charm', name: 'Charm', kind: 'gear', slot: 'charm', price: 60, stats: { def: 1, spd: 1 }, text: '' },
    locket: { id: 'locket', name: 'Locket', kind: 'key', price: 0, text: '' },
  },
  members: [
    { id: 'gi', name: 'Gi', role: 'Mage', house: 'K', portrait: 'gi', era: 'present', base: { hp: 40, sp: 30, atk: 6, def: 6, mag: 14, spd: 9 }, growth: { hp: 5, sp: 4, atk: 1, def: 1, mag: 2, spd: 1 }, start: { weapon: 'staff' } },
    { id: 'an', name: 'An', role: 'Support', house: 'K', portrait: 'an', era: 'present', support: true, joins: { flag: 'party.an' }, base: { hp: 0, sp: 0, atk: 0, def: 0, mag: 0, spd: 0 }, growth: { hp: 0, sp: 0, atk: 0, def: 0, mag: 0, spd: 0 } },
    { id: 'pa', name: 'Pa', role: 'Warden', house: 'K', portrait: 'pa', era: 'echo', base: { hp: 70, sp: 10, atk: 13, def: 12, mag: 3, spd: 7 }, growth: { hp: 8, sp: 1, atk: 2, def: 2, mag: 0, spd: 1 } },
  ],
  shops: { stall: { id: 'stall', name: 'Stall', city: 'z', stock: ['soup', 'charm', 'staff2'] } },
  cities: { z: { id: 'z', name: 'Z', house: 'K', sections: [{ map: 'z-town', name: 'Town', box: { x: 0, y: 0, w: 2, h: 2 } }], links: [] } },
  realm: [],
  pillarRules: [{ pillar: 'influence', city: 'z', flags: ['lore.a', 'lore.b'], each: 1 }],
  startingGold: 150,
  bagLimit: 5,
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
    f.set('level.gi', 3);
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
  it('every shop sells real items, every start item exists, and every item has a price unless it is a key item', () => {
    for (const s of Object.values(RPG.shops)) for (const id of s.stock) expect(RPG.items[id], `${s.id}: ${id}`).toBeDefined();
    for (const m of RPG.members) for (const id of Object.values(m.start ?? {})) expect(RPG.items[id!], `${m.id}: ${id}`).toBeDefined();
    for (const it of Object.values(RPG.items)) {
      if (it.kind === 'key') expect(it.price, it.id).toBe(0);
      else expect(it.price, it.id).toBeGreaterThan(0);
      if (it.kind === 'gear') expect(it.slot, it.id).toBeDefined();
      expect(it.name.length, it.id).toBeLessThanOrEqual(22);
    }
  });

  it('every city section is a real map, sections do not overlap, and links join sections', () => {
    for (const c of Object.values(RPG.cities)) {
      const maps = c.sections.map((s) => s.map);
      expect(new Set(maps).size, c.id).toBe(maps.length);
      for (const [a, b] of c.links) expect(maps.includes(a) && maps.includes(b), `${a}-${b}`).toBe(true);
      for (const s of c.sections) {
        for (const t of c.sections) {
          if (s === t) continue;
          const apart = s.box.x + s.box.w <= t.box.x || t.box.x + t.box.w <= s.box.x || s.box.y + s.box.h <= t.box.y || t.box.y + t.box.h <= s.box.y;
          expect(apart, `${s.name} / ${t.name}`).toBe(true);
        }
      }
    }
    expect(cityOf(RPG, 'zetwal-road')?.section.name).toBe('The Cane Road');
  });

  it('the realm map has the eight capitals and Elodie’s Seat', () => {
    expect(RPG.realm.length).toBe(9);
    for (const p of RPG.realm) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(100);
    }
  });
});
