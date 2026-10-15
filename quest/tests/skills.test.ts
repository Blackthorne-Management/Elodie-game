// Skills that grow (owner decision, Oct 15; engine/skills.ts and engine/battle.ts): spells learned by
// level and from books, ranks, spell slots, skills that come free with rare gear, weapon moves with
// cooldowns, the mage's staff bash, and the new effects (cleanse, revive, Slowed, Taunting).

import { describe, expect, it } from 'vitest';
import { MAGE_BASH_POWER, STATUS } from '../src/config.ts';
import { BATTLES, ENEMIES, GEAR_SKILLS, MOVES, SKILLS, SKILL_BOOK } from '../src/data/battles.ts';
import { BOOKS } from '../src/data/books.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleParty, isMove, reachable, spdOf, type PartyEntry } from '../src/engine/battle.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { equip } from '../src/engine/rpg.ts';
import { atRank, battleSkills, equippedSpells, gearSkills, knownSkills, learned, spellSlots, toggleSpell } from '../src/engine/skills.ts';

const gianna = RPG.members.find((m) => m.id === 'gianna')!;
const yari = RPG.members.find((m) => m.id === 'yari')!;
const sunthread = SKILLS.gianna!.find((s) => s.id === 'sunthread')!;
const def = BATTLES.intro_boar!;
const boar = ENEMIES.boar!;

describe('spells grow with Gianna', () => {
  it('ranks add power and effects at set levels, and show in the name', () => {
    expect(atRank(sunthread, 1)).toMatchObject({ name: 'Sunthread', power: 120, rank: 1 });
    expect(atRank(sunthread, 5)).toMatchObject({ name: 'Sunthread II', power: 140, rank: 2, statuses: ['marked'] });
    expect(atRank(sunthread, 12)).toMatchObject({ name: 'Sunthread III', power: 165, rank: 3, statuses: ['marked'] });
  });

  it('spells are learned by level, and Mend from reading five books of the Pòdlimyè library', () => {
    const flags = new FlagStore();
    const ids = (lv: number) => knownSkills(flags, SKILL_BOOK, gianna, lv).map((s) => s.id);
    expect(ids(1)).toEqual(['sunthread', 'limye_elodie']);
    expect(ids(2)).toEqual(['sunthread', 'limye_elodie', 'benediksyon']);
    expect(ids(4)).toEqual(['sunthread', 'limye_elodie', 'benediksyon', 'limye_pou_tout']);
    const mend = SKILLS.gianna!.find((s) => s.id === 'mend')!;
    const books = BOOKS.filter((b) => b.id.startsWith('zetwal_')).slice(0, 5);
    for (const b of books.slice(0, 4)) flags.set(`lore.${b.id}`, true);
    expect(learned(mend, 1, flags)).toBe(false);
    flags.set(`lore.${books[4]!.id}`, true);
    expect(learned(mend, 1, flags)).toBe(true);
    expect(ids(4)).toContain('mend');
  });

  it('only some spells can be equipped: 4 slots, 5 at level 10, 6 at level 20', () => {
    expect([spellSlots(1), spellSlots(9), spellSlots(10), spellSlots(20)]).toEqual([4, 4, 5, 6]);
  });

  it('the first spells learned fill the slots; after that the choice stands', () => {
    const flags = new FlagStore();
    for (const b of BOOKS.filter((x) => x.id.startsWith('zetwal_')).slice(0, 5)) flags.set(`lore.${b.id}`, true);
    // Level 4: five spells known, four slots.
    expect(equippedSpells(flags, SKILL_BOOK, gianna, 4)).toEqual(['sunthread', 'limye_elodie', 'benediksyon', 'mend']);
    expect(toggleSpell(flags, SKILL_BOOK, gianna, 4, 'limye_pou_tout')).toBe('full');
    expect(toggleSpell(flags, SKILL_BOOK, gianna, 4, 'benediksyon')).toBe('off');
    expect(toggleSpell(flags, SKILL_BOOK, gianna, 4, 'limye_pou_tout')).toBe('on');
    expect(equippedSpells(flags, SKILL_BOOK, gianna, 4)).toEqual(['sunthread', 'limye_elodie', 'mend', 'limye_pou_tout']);
    expect(toggleSpell(flags, SKILL_BOOK, gianna, 4, 'no_such_spell')).toBe('unknown');
  });

  it('skills that come with rare gear are free: they never take a slot', () => {
    const flags = new FlagStore();
    flags.set('item.lantern_staff', 1);
    expect(equip(flags, RPG, gianna, 'lantern_staff')).toBe('ok');
    const gear = gearSkills(flags, RPG, SKILL_BOOK, gianna, 1);
    expect(gear.map((s) => [s.id, s.source])).toEqual([['lantern_flare', 'Lantern Staff of Embers']]);
    const all = battleSkills(flags, RPG, SKILL_BOOK, gianna, 1);
    expect(all.map((s) => s.id)).toEqual(['sunthread', 'limye_elodie', 'lantern_flare']);
    expect(equippedSpells(flags, SKILL_BOOK, gianna, 1)).not.toContain('lantern_flare');
  });

  it('every rare or better item with a skill names one that exists', () => {
    for (const it of Object.values(RPG.items)) if (it.skill) expect(GEAR_SKILLS[it.skill], it.id).toBeDefined();
  });
});

describe('attackers: many weapon moves with cooldowns, few SP skills', () => {
  it('Yari has more moves than skills, learned by level', () => {
    const flags = new FlagStore();
    const at = (lv: number) => battleSkills(flags, RPG, SKILL_BOOK, yari, lv);
    expect(at(1).filter(isMove).map((s) => s.id)).toEqual(['quick_shot', 'aimed_shot']);
    expect(at(4).filter(isMove).map((s) => s.id)).toEqual(['quick_shot', 'aimed_shot', 'pinning_shot', 'volley']);
    expect(at(4).filter((s) => !isMove(s)).map((s) => s.id)).toEqual(['trackers_mark']);
    expect(MOVES.yari!.every((m) => m.sp === 0)).toBe(true);
  });

  it('a move with a cooldown cannot be used again until its user has had that many turns', () => {
    const entry: PartyEntry = {
      id: 'yari', name: 'Yari', look: 'yari', level: 4,
      stats: { hp: 999, sp: 20, atk: 14, def: 7, mag: 6, spd: 13 },
      skills: MOVES.yari!, specials: [], anissaBond: false, row: 'back',
    };
    const b = new Battle(def, [entry], [{ ...boar, level: 30 }], [], { seed: 4 });
    b.start();
    const me = b.find('yari')!;
    const aimed = me.skills.find((s) => s.id === 'aimed_shot')!;
    expect(b.act({ kind: 'skill', skill: 'aimed_shot', target: 'boar#1' }).length).toBeGreaterThan(0);
    expect(me.sp).toBe(20); // moves cost no SP
    expect(b.canUse(me, aimed)).toBe(false);
    expect(b.act({ kind: 'skill', skill: 'aimed_shot', target: 'boar#1' })).toEqual([]);
    b.act({ kind: 'skill', skill: 'quick_shot', target: 'boar#1' });
    expect(b.canUse(me, aimed)).toBe(false);
    b.act({ kind: 'skill', skill: 'quick_shot', target: 'boar#1' });
    expect(b.canUse(me, aimed)).toBe(true);
  });
});

describe("Gianna's staff bash", () => {
  it('a plain staff only bashes; a spiked or bladed staff strikes properly', () => {
    const flags = new FlagStore({ 'party.anissa': true });
    expect(battleParty(flags, RPG, SKILL_BOOK)[0]!.bash).toBe(MAGE_BASH_POWER);
    flags.set('item.thorn_staff', 1);
    equip(flags, RPG, gianna, 'thorn_staff');
    const g = battleParty(flags, RPG, SKILL_BOOK)[0]!;
    expect(g.bash).toBe(100);
    expect(g.skills.map((s) => s.id)).toContain('briar_snare');
  });
});

describe('new effects', () => {
  const party = (skills = SKILLS.gianna!, hp = 42): PartyEntry => ({
    id: 'gianna', name: 'Gianna', look: 'gianna', level: 14,
    stats: { hp, sp: 60, atk: 6, def: 7, mag: 18, spd: 9 },
    skills, specials: [], anissaBond: true, row: 'back',
  });

  it('Limyè Elodie II clears bad statuses', () => {
    const heal = atRank(SKILLS.gianna!.find((s) => s.id === 'limye_elodie')!, 6);
    const b = new Battle(def, [party([heal])], [boar], [], { seed: 2 });
    b.start();
    const me = b.find('gianna')!;
    me.statuses.push({ id: 'marked', turns: 3, fresh: false }, { id: 'inspired', turns: 3, fresh: false });
    const ev = b.act({ kind: 'skill', skill: 'limye_elodie', target: 'gianna' });
    expect(ev).toContainEqual({ kind: 'status', to: 'gianna', status: 'marked', on: false });
    expect(me.statuses.map((s) => s.id)).not.toContain('marked');
  });

  it('Say Their Names (the Quill) raises every fallen ally at 30% HP, once per battle', () => {
    const quill = GEAR_SKILLS.say_their_names!;
    const ally: PartyEntry = { ...party([]), id: 'yari', name: 'Yari', anissaBond: false, stats: { hp: 50, sp: 10, atk: 12, def: 7, mag: 6, spd: 1 } };
    const b = new Battle(def, [party([quill]), ally], [boar], [], { seed: 2 });
    b.start();
    const y = b.find('yari')!;
    y.hp = 0;
    y.down = true;
    for (let i = 0; i < 10 && b.actor?.key !== 'gianna'; i++) b.act({ kind: 'guard' });
    const ev = b.act({ kind: 'skill', skill: 'say_their_names' });
    expect(ev).toContainEqual({ kind: 'revive', who: 'yari', hp: 15 });
    expect(y.down).toBe(false);
    expect(b.canUse(b.find('gianna')!, quill)).toBe(false);
  });

  it('Slowed makes turns come later; Taunting draws one-target attacks first', () => {
    const b = new Battle(def, [party()], [boar], [], { seed: 2 });
    const foe = b.find('boar#1')!;
    const before = spdOf(foe);
    foe.statuses.push({ id: 'slowed', turns: 3, fresh: false });
    expect(spdOf(foe)).toBeCloseTo(before * STATUS.slowed.spd);
    const g = b.find('gianna')!;
    const other = { ...g, key: 'azzy', row: 'front' as const, statuses: [] };
    g.statuses.push({ id: 'taunting', turns: 2, fresh: false });
    expect(reachable([g, other]).map((c) => c.key)).toEqual(['gianna']);
  });
});

describe('battle weapons (owner, Oct 15: one empty-handed stance, the weapon drawn into the hand)', () => {
  it('every weapon has a battle picture: a painted stance for staffs and bows, a drawing with a grip for blades', async () => {
    const { WEAPON_ART } = await import('../src/assets.config.ts');
    const { existsSync } = await import('node:fs');
    const holder: Record<string, string> = { staff: 'gianna', bow: 'yari' };
    for (const it of Object.values(RPG.items)) {
      if (it.slot !== 'weapon') continue;
      const art = it.art ?? it.id;
      const look = holder[it.weapon ?? ''];
      if (look) {
        expect(existsSync(`art/battle/${look}-${art}.png`), `${it.id}: art/battle/${look}-${art}.png`).toBe(true);
        continue;
      }
      const drawing = WEAPON_ART[art];
      expect(drawing, it.id).toBeDefined();
      const w = drawing!.rows[0]!.length;
      expect(drawing!.rows.every((r) => r.length === w), it.id).toBe(true);
      const at = drawing!.rows[drawing!.grip.y]?.[drawing!.grip.x];
      expect(at !== undefined && at !== '.', `${it.id} grip`).toBe(true);
    }
  });

});
