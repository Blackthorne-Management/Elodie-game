// The Claim's foes and fights (Chapter 12; the outline section 5 with its second review's 3.4 and the decisions after it:
// the Regent at HP x6, ATK x1.6, MAG x2.0 with a group attack every second turn, one version of him; Azzy at HP x4, ATK x1.2;
// the tier-28 shop cut). Spread into data/battles.ts ENEMIES and BATTLES. Tuned with tools/battle-sim.ts and
// tests/claim.test.ts against the roster four and a glass line in tier-24 gear, counting falls across the whole party (the
// outline's Built section has the tables).
//
// Nobody dies: the Regent and his Sealbearers withdraw at 0 HP, and Azzy's Challenge binds (BattleDef.binds). Anissa is never
// a target: the Regent's Hush the Light is the built Seize (Gianna steps in) and the chapter's only one. The claimant strikes
// first in both Challenges (BattleDef.opensFirst; rules-decisions [42]) and her wounds carry from the Regent's into Azzy's
// (keepsWounds / wounded; owner decision, Oct 22).

import type { BattleDef, EnemyDef, EnemyMove } from '../engine/battle.ts';

/** A Regent's Sealbearer at the Claim (Chapter 9's, re-levelled; each stands in front of him: `protects`). */
const sealbearer = (id: string, level: number): EnemyDef => ({
  id,
  name: "Regent's Sealbearer",
  look: 'sealbearer',
  level,
  role: 'caster',
  armored: true,
  protects: 'regent_claim',
  withdraws: { line: 'The Sealbearer sets the seal down on the floor of the Hall, and steps back to the wall.' },
  moves: [
    { name: 'Writ', power: 100, magic: true, statuses: ['weakened'], chance: 0.6 },
    { name: 'Seal', power: 130, magic: true, statuses: ['hushed'], every: 3, tell: 'The Sealbearer lifts the Throne\'s seal...' },
  ],
});

/** The Regent's second phase: The Charter, read (his voice, Thorne's move), a spell at the whole party every second turn. */
const REGENT_CHARTER: readonly EnemyMove[] = [
  { name: 'The Chain of Office', power: 120 },
  { name: 'The Charter, read', power: 110, magic: true, area: true, statuses: ['hushed'], chance: 0.5, every: 2, tell: 'The Regent opens the Charter and begins to read it aloud. The Hall goes quiet around the words...' },
];
/** The third: One Hand, a blow at everyone every second turn, and Hush the Light (the Seize: Gianna steps in) every third. */
const REGENT_ONE_HAND: readonly EnemyMove[] = [
  { name: 'The Chain of Office', power: 120 },
  { name: 'One Hand', power: 130, area: true, statuses: ['weakened'], every: 2, tell: 'The Regent closes one hand on the chain of office. "One hand. One Hall."' },
  { name: 'Hush the Light', power: 0, seize: 3, statuses: ['marked'], every: 3, tell: 'The Regent looks past Gianna, at the one behind her, the way he looks at a page...' },
];

export const CLAIM_ENEMIES: Readonly<Record<string, EnemyDef>> = {
  // The Lord Regent Aldric Vane (COMBAT 13.3 #10 as tuned by the second review's 3.4): he fights with his chain of office, not a
  // sword (Clause Twelve: no steel inside the eight gates, save a Challenge). Level 30, a tank and a boss.
  regent_claim: {
    id: 'regent_claim',
    name: 'The Lord Regent',
    look: 'regent',
    level: 30,
    role: 'tank',
    boss: true,
    hpScale: 6,
    atkScale: 1.6,
    magScale: 2.0,
    withdraws: { line: '...It is a tile.', speaker: 'The Lord Regent' },
    moves: [
      { name: 'The Chain of Office', power: 120 },
      { name: 'Patience', power: 60, area: true, statuses: ['weakened'], every: 2, tell: 'The Regent waits. The Hall waits with him...' },
    ],
  },
  claim_sealbearer: sealbearer('claim_sealbearer', 29),
  // Azzy, the Challenge (the dark route only; Vikram's duel the precedent): his father's moves, his own temper. HP x4, ATK x1.2.
  azzy_claim: {
    id: 'azzy_claim',
    name: 'Azzy',
    look: 'azzy',
    level: 29,
    role: 'brute',
    hpScale: 4,
    atkScale: 1.2,
    withdraws: { line: '...Then it\'s yours.', speaker: 'Azzy' },
    moves: [
      { name: 'Blade', power: 110 },
      { name: 'La Marca', power: 100, statuses: ['marked'], every: 3, tell: 'He holds the blade the way the Trial held it. His father\'s guard...' },
      { name: 'Grito', power: 0, statuses: ['stunned'], chance: 0.6, every: 4, tell: 'Azzy draws a long breath. The Hall goes quiet...' },
    ],
  },
};

const CLAIM = 'claim_story';

export const CLAIM_BATTLES: Readonly<Record<string, BattleDef>> = {
  // The Regent's Challenge (beat 4): the Regent with two Sealbearers in front of him and one more at one third (tuned down
  // from one at two thirds and two at one third, with the Charter at 110 and One Hand at 130, to keep the roster four
  // under 40 actions at the route's level; the owner's HP, ATK and MAG scales stand). Game Over applies; the way back in is the tile (and the Regent on the dais's step).
  claim_regent: {
    id: 'claim_regent',
    title: 'The Claim',
    backdrop: 'throne_hall',
    enemies: ['claim_sealbearer', 'regent_claim', 'claim_sealbearer'],
    table: CLAIM,
    group: 'regent',
    rewards: { xp: 420, gold: 800, items: [{ id: 'chain_of_office', n: 1 }] },
    endsWithBoss: true,
    boss: true,
    opensFirst: 'gianna',
    keepsWounds: true,
    phases: [
      {
        below: 0.66,
        speaker: 'The Lord Regent',
        text: 'The Charter stands. It is written.',
        moves: REGENT_CHARTER,
      },
      {
        below: 0.33,
        speaker: 'The Lord Regent',
        text: 'One hand. One Hall. Hush, and give her to me.',
        moves: REGENT_ONE_HAND,
        enter: ['claim_sealbearer'],
        enterText: 'One more Sealbearer comes down the heralds\' stair and steps in front of him, seal raised.',
      },
    ],
    tips: {
      start: 'The grey ones stand in front of him, Gigi. Hit them all at once.',
      spark: 'Surge, Gigi! Through them!',
      tell: 'Guard, everyone!',
      lowHp: 'He\'s looking at me. Stay in front, Gigi.',
    },
  },
  // Azzy's Challenge (the dark route: Strike, and "the realm had to see him beaten"; owner decision, Oct 22): after the Regent,
  // Gianna alone, with her wounds from his fight. It binds; nobody is paid for fighting family. No Anissa tips (the second
  // review's 3.10): her line is said before it.
  claim_azzy: {
    id: 'claim_azzy',
    title: 'Two Claimants',
    backdrop: 'throne_hall',
    enemies: ['azzy_claim'],
    table: CLAIM,
    group: 'azzy',
    rewards: { xp: 0, gold: 0 },
    endsWithBoss: true,
    binds: true,
    fighters: ['gianna'],
    opensFirst: 'gianna',
    wounded: true,
    tips: {},
  },
};
