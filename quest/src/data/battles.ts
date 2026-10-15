// Battles (engine/battle.ts runs them; scenes/BattleScene.ts draws them): skills by member, the enemies,
// and each scripted fight. Chapter 1 has one (owner decision, Oct 15): on the Cane Road, Gianna and
// Anissa run into a boar, which teaches the commands, Anissa's Spark and Surge, and her light.
// Numbers follow docs/quest/design/COMBAT.md.

import type { BattleDef, EnemyDef, SkillDef } from '../engine/battle.ts';

/** Skills each member knows (COMBAT 9; the rest arrive with their chapters). */
export const SKILLS: Readonly<Record<string, readonly SkillDef[]>> = {
  gianna: [
    { id: 'sunthread', name: 'Sunthread', sp: 5, kind: 'damage', power: 120, target: 'enemy', element: 'light', text: 'A thread of light at one foe.' },
    { id: 'limye_elodie', name: 'Limyè Elodie', sp: 6, kind: 'heal', power: 150, target: 'ally', element: 'light', text: "Elodie's light heals one ally." },
    // Chapter 1 additions (owner, Oct 15: mages heal the team and give buffs).
    { id: 'limye_pou_tout', name: 'Limyè pou Tout', sp: 10, kind: 'heal', power: 80, target: 'allAllies', element: 'light', text: 'Light for all: heals the whole party a little.' },
    { id: 'benediksyon', name: 'Benediksyon', sp: 4, kind: 'status', power: 0, target: 'ally', status: 'inspired', text: 'A blessing: one ally deals a quarter more damage for 3 turns.' },
  ],
  yari: [
    { id: 'volley', name: 'Volley', sp: 6, kind: 'damage', stat: 'atk', power: 60, target: 'randomEnemies', hits: 3, text: 'Three arrows at random foes.' },
    { id: 'arrow_rain', name: 'Arrow Rain', sp: 9, kind: 'damage', stat: 'atk', power: 75, target: 'allEnemies', element: 'wind', text: 'Arrows on the wind, at every foe.' },
    { id: 'trackers_mark', name: "Tracker's Mark", sp: 4, kind: 'status', power: 0, target: 'enemy', status: 'marked', text: 'Marks one foe: it takes a quarter more damage for 3 turns.' },
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
    backdrop: 'cane_road',
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
