// Battles (engine/battle.ts runs them; scenes/BattleScene.ts draws them): skills by member, the enemies,
// and each scripted fight. Chapter 1 has one (owner decision, Oct 15): on the Cane Road, Gianna and
// Anissa run into a boar, which teaches the commands, Anissa's Spark and Surge, and her light.
// Numbers follow docs/quest/design/COMBAT.md.

import type { BattleDef, EnemyDef, SkillDef } from '../engine/battle.ts';

/** Skills each member knows (COMBAT 9; the rest arrive with their chapters). */
export const SKILLS: Readonly<Record<string, readonly SkillDef[]>> = {
  gianna: [
    { id: 'sunthread', name: 'Sunthread', sp: 5, kind: 'damage', power: 120, text: 'A thread of light at one foe.' },
    { id: 'limye_elodie', name: 'Limyè Elodie', sp: 6, kind: 'heal', power: 150, text: 'Elodie\'s light heals one ally.' },
  ],
};

export const ENEMIES: Readonly<Record<string, EnemyDef>> = {
  // The cane-field boar (kochon mawon): a brute, with a charge it warns about a turn ahead.
  boar: {
    id: 'boar',
    name: 'Cane-field boar',
    look: 'boar',
    level: 3,
    role: 'brute',
    moves: [
      { name: 'Tusk', power: 100 },
      { name: 'Charge', power: 150, every: 3, tell: 'The boar lowers its head and paws at the dirt...' },
    ],
  },
};

export const BATTLES: Readonly<Record<string, BattleDef>> = {
  intro_boar: {
    id: 'intro_boar',
    title: 'The Cane Road',
    enemies: ['boar'],
    table: 'wilds',
    group: 'boar',
    rewards: { xp: 40, gold: 12, items: [{ id: 'boar_tusk', n: 1 }] },
    tips: {
      start: "Gigi, your staff won't hurt it much. Your light will. Skill, then Sunthread.",
      spark: 'I can feel it, Gigi. Let me help. Choose Surge.',
      tell: "It's going to charge! Guard, Gigi!",
      lowHp: "You're hurt. Heal yourself, or drink the soup.",
    },
  },
};
