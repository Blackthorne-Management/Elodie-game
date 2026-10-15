// Skills outside battle (owner decision, Oct 15): what each member knows, at what rank, and what they
// take into a fight. Mages grow a spellbook: spells are learned by level or from library books, grow
// stronger in ranks (I, II, III) at set levels, and only SPELL_SLOTS of them can be equipped. Attackers
// have many weapon moves with cooldowns and few SP skills. Rare or better gear can bring one more skill
// or move, free (it never takes a slot). Pure TypeScript; battle.ts runs the skills.

import { SPELL_SLOTS } from '../config.ts';
import type { FlagReader, FlagStore } from './flags.ts';
import { SLOTS, equipped, type MemberDef, type RpgContent } from './rpg.ts';
import type { SkillDef } from './battle.ts';

/** Every skill a member can ever have: spells and SP skills, weapon moves, and the skills gear brings. */
export interface SkillBook {
  /** SP skills by member (a mage's spells). */
  skills: Readonly<Record<string, readonly SkillDef[]>>;
  /** Weapon moves by member (cooldowns, no SP). */
  moves: Readonly<Record<string, readonly SkillDef[]>>;
  /** The skills items bring, by skill id (ItemDef.skill). */
  gear: Readonly<Record<string, SkillDef>>;
}

const ROMAN = ['', '', ' II', ' III', ' IV'];

/** A skill as it stands at `level`: every rank reached applied in turn (power, statuses, cleanse, text). */
export function atRank(skill: SkillDef, level: number): SkillDef {
  let s: SkillDef = { ...skill, rank: 1 };
  for (const r of skill.ranks ?? []) {
    if (level < r.level) break;
    s = {
      ...s,
      rank: (s.rank ?? 1) + 1,
      power: r.power ?? s.power,
      statuses: r.statuses ? [...new Set([...(s.statuses ?? []), ...r.statuses])] : s.statuses,
      cleanse: r.cleanse ?? s.cleanse,
      text: r.text ?? s.text,
    };
  }
  return { ...s, name: `${skill.name}${ROMAN[s.rank ?? 1] ?? ''}` };
}

/** The next rank a skill will reach, if any (for the Equip screen). */
export function nextRank(skill: SkillDef, level: number): { level: number; text: string } | null {
  const r = (skill.ranks ?? []).find((x) => x.level > level);
  return r ? { level: r.level, text: r.text ?? '' } : null;
}

/** Whether a member has learned a skill: by level, and (for book spells) by having read enough books. */
export function learned(skill: SkillDef, level: number, flags: FlagReader): boolean {
  const l = skill.learn;
  if (!l) return true;
  if (l.level !== undefined && level < l.level) return false;
  if (l.lore) {
    const read = l.lore.books.filter((b) => !!flags.get(`lore.${b}`)).length;
    if (read < l.lore.count) return false;
  }
  return true;
}

/** How to learn a skill not known yet (for the Equip screen). */
export function howToLearn(skill: SkillDef): string {
  const l = skill.learn;
  if (!l) return '';
  const parts: string[] = [];
  if (l.level !== undefined) parts.push(`Lv ${l.level}`);
  if (l.lore) parts.push(`read ${l.lore.count} ${l.lore.where} books`);
  return parts.join(', ');
}

/** How many spells a mage can equip at a level. */
export function spellSlots(level: number): number {
  let n = 0;
  for (const s of SPELL_SLOTS) if (level >= s.level) n = s.slots;
  return n;
}

export function usesSlots(m: MemberDef): boolean {
  return m.class === 'mage';
}

function spellsFlag(memberId: string): string {
  return `spells.${memberId}`;
}

/** A member's SP skills learned so far, at their ranks. */
export function knownSkills(flags: FlagReader, book: SkillBook, m: MemberDef, level: number): SkillDef[] {
  return (book.skills[m.id] ?? []).filter((s) => learned(s, level, flags)).map((s) => atRank(s, level));
}

/** A member's weapon moves learned so far, at their ranks. */
export function knownMoves(flags: FlagReader, book: SkillBook, m: MemberDef, level: number): SkillDef[] {
  return (book.moves[m.id] ?? []).filter((s) => learned(s, level, flags)).map((s) => atRank(s, level));
}

/**
 * The spells a mage has equipped (ids, in book order). Until the player chooses, the first spells
 * learned fill the slots; afterwards the choice stands (a spell learned later goes in by hand).
 */
export function equippedSpells(flags: FlagReader, book: SkillBook, m: MemberDef, level: number): string[] {
  const known = knownSkills(flags, book, m, level).map((s) => s.id);
  if (!usesSlots(m)) return known;
  const raw = flags.get(spellsFlag(m.id));
  const chosen = typeof raw === 'string' ? raw.split(',').filter(Boolean) : known;
  return known.filter((id) => chosen.includes(id)).slice(0, spellSlots(level));
}

/** Put a spell in a slot or take it out. 'full': every slot is taken. */
export function toggleSpell(flags: FlagStore, book: SkillBook, m: MemberDef, level: number, id: string): 'on' | 'off' | 'full' | 'unknown' {
  const known = knownSkills(flags, book, m, level).map((s) => s.id);
  if (!known.includes(id)) return 'unknown';
  const now = equippedSpells(flags, book, m, level);
  let next: string[];
  let r: 'on' | 'off';
  if (now.includes(id)) {
    next = now.filter((x) => x !== id);
    r = 'off';
  } else {
    if (now.length >= spellSlots(level)) return 'full';
    next = known.filter((x) => x === id || now.includes(x));
    r = 'on';
  }
  flags.set(spellsFlag(m.id), next.join(','));
  return r;
}

/** The skills and moves a member's gear brings (free), each marked with the item it comes from. */
export function gearSkills(flags: FlagReader, rpg: RpgContent, book: SkillBook, m: MemberDef, level: number): SkillDef[] {
  return SLOTS.flatMap((slot) => {
    const id = equipped(flags, m, slot);
    const item = id ? rpg.items[id] : undefined;
    const skill = item?.skill ? book.gear[item.skill] : undefined;
    return skill ? [{ ...atRank(skill, level), source: item!.name }] : [];
  });
}

/** Everything a member takes into a fight: equipped spells (or all SP skills), moves, and gear skills. */
export function battleSkills(flags: FlagReader, rpg: RpgContent, book: SkillBook, m: MemberDef, level: number): SkillDef[] {
  const on = new Set(equippedSpells(flags, book, m, level));
  const skills = knownSkills(flags, book, m, level).filter((s) => on.has(s.id));
  return [...knownMoves(flags, book, m, level), ...skills, ...gearSkills(flags, rpg, book, m, level)];
}
