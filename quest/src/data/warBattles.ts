// The War of the Harbor's foes and fights (Chapter 11; the outline section 5 with its second review's 3.3, 3.4, 3.13 and
// 3.14, every fix taken; COMBAT.md 13.2 and 13.3 #3b, #8, #9). Spread into data/battles.ts ENEMIES and BATTLES. Tuned
// with tools/battle-sim.ts and tests/war.test.ts against the roster four and a glass line in tier-24 gear, volleys on (the
// common case: a full fleet), counting falls across the whole party (the outline's Built section has the tables).
//
// Nobody dies: every named foe withdraws at 0 HP. Anissa is never a target: the flank's Husher is the chapter's only
// Seize (Gianna steps in, as built). Rael at the Harbor Strike never strikes Gianna (EnemyDef.avoid) and only Binds
// (BattleDef.binds); his guards step back at the Broken Army (BattlePhase.leave). No Seize in the Strike.

import type { BattleDef, EnemyDef, EnemyMove } from '../engine/battle.ts';

// ---- The Crown at the harbor (COMBAT 13.2's Harbor rows), levels 25 to 28 ------------------------------------------

const marine = (id: string, level: number, name = 'Crown Marine'): EnemyDef => ({
  id,
  name,
  look: 'crown_marine',
  level,
  role: 'skirmisher',
  bribable: true,
  moves: [
    { name: 'Bayonet', power: 110 },
    { name: 'Fix bayonets', power: 150, every: 3, tell: 'The marine lowers his bayonet and sets his feet...' },
  ],
});
const musketeer = (id: string, level: number, armored = false): EnemyDef => ({
  id,
  name: armored ? 'Musketeer in a Breastplate' : 'Crown Musketeer',
  look: 'crown_musketeer',
  level,
  role: 'caster',
  ...(armored ? { armored: true } : { bribable: true }),
  moves: [
    { name: 'Bayonet jab', power: 90 },
    { name: 'Volley', power: 180, every: 2, tell: 'The musketeer kneels and takes aim...' },
  ],
});
/** The Crown Officer (Chapter 9's shape): Rally gives one of his men Inspired every third turn. */
const officer = (id: string, level: number, rallies: string): EnemyDef => ({
  id,
  name: 'Crown Officer',
  look: 'crown_officer',
  level,
  role: 'brute',
  bribable: true,
  withdraws: { line: 'The officer sits down on the sand, and stays there.' },
  moves: [
    { name: 'Sabre', power: 105 },
    { name: 'Rally', power: 0, ally: rallies, statuses: ['inspired'], every: 3, tell: 'The officer raises his sabre: "Steady!"' },
  ],
});

/** The betrayer's house: the move his house is known for, every second turn, harder once he is cornered. */
function betrayer(
  id: string,
  name: string,
  look: string,
  move: EnemyMove,
  hard: EnemyMove,
  line: string,
  scale: { hp: number; atk: number } = { hp: 7, atk: 1.3 },
): { def: EnemyDef; hard: readonly EnemyMove[] } {
  return {
    def: {
      id,
      name,
      look,
      level: 26,
      role: 'brute',
      boss: true,
      hpScale: scale.hp,
      atkScale: scale.atk,
      withdraws: { line, speaker: name },
      moves: [{ name: 'Blade', power: 115 }, move],
    },
    hard: [{ name: 'Blade', power: 125 }, hard],
  };
}

const HRAFN = betrayer(
  'betrayer_skarragol',
  'Hrafn',
  'hrafn',
  { name: 'Warpath', power: 100, area: true, every: 2, tell: 'Hrafn lowers the horse-tail and comes at the whole line...' },
  { name: 'Warpath', power: 125, area: true, every: 2, tell: 'Hrafn lowers the horse-tail and comes at the whole line...' },
  'Enough. The Throne can collect its harbor itself.',
  { hp: 8.5, atk: 1.2 },
);
const RETAINER = betrayer(
  'betrayer_kuroshi',
  'The Suzumori retainer',
  'retainer_neutral',
  { name: 'Marionette', power: 100, magic: true, statuses: ['hushed'], every: 2, tell: 'The retainer\'s fan opens. One of you stops moving your own hands...' },
  { name: 'Marionette', power: 140, magic: true, area: true, statuses: ['hushed'], chance: 0.5, every: 2, tell: 'The fan opens wide. All of you, this time...' },
  'Neutral. I am neutral. I yield.',
);
const STEWARD = betrayer(
  'betrayer_jwaladesh',
  'The Agnivansh steward',
  'agnivansh_steward',
  { name: 'Endless War', power: 0, ally: 'betrayer_jwaladesh', statuses: ['inspired'], every: 3, tell: 'The steward lifts the brass lamp: "The flame does not tire."' },
  { name: 'Lamp Oil', power: 105, area: true, statuses: ['burning'], chance: 0.35, every: 2, tell: 'The steward tips the brass lamp. Oil runs across the sand toward you...' },
  'Enough. The lamp is out. Let it stay out.',
  { hp: 9, atk: 1.0 },
);
const ADMIRAL = betrayer(
  'betrayer_al_doria',
  'The Dorini admiral',
  'dorini_admiral',
  { name: 'Paid Off', power: 115, statuses: ['stunned'], every: 2, tell: 'The admiral opens his ledger: "You. Stand there. You\'ve been paid."' },
  { name: 'Foreclose', power: 140, area: true, statuses: ['weakened'], every: 2, tell: 'The admiral tears a page out of the ledger: "Everything you carry is collateral."' },
  'Enough. Invoice me.',
);
const BETRAYERS = [HRAFN, RETAINER, STEWARD, ADMIRAL] as const;

/** Rael at the Harbor Strike (COMBAT 13.3 #3b, the second review's 3.3: the hard route on purpose). */
const RAEL_HARBOR_UNLEASHED: readonly EnemyMove[] = [
  { name: 'Sword', power: 125 },
  { name: 'Grito de Guerra', power: 70, area: true, statuses: ['stunned'], chance: 0.5, every: 2, tell: 'Rael draws a long breath. The pier goes quiet...' },
  { name: 'La Marca', power: 100, statuses: ['marked'], powerPerBound: 30, every: 3 },
];
const RAEL_HARBOR_CORNERED: readonly EnemyMove[] = [
  { name: 'Sword', power: 130 },
  { name: 'Reinado de Cenizas', power: 130, powerPerBound: 40, area: true, every: 3, tell: 'Rael lifts his blade over his head. The boards around him start to smoke. Guard, everyone!' },
];
/** The Broken Army (15%): his guards have stepped back; he only Binds, and waits for her to stop. */
const RAEL_BROKEN_ARMY: readonly EnemyMove[] = [
  { name: 'Cord', power: 90 },
  { name: 'Stand down', power: 0, area: true, statuses: ['weakened'], every: 2, tell: 'He is not striking. He is waiting for you to stop.' },
];

/** Hale's Champion's Duel (50%): one of you alone, and the rest called to the rail. */
const HALE_DUEL: readonly EnemyMove[] = [
  { name: 'Axe', power: 130 },
  { name: 'Challenge', power: 190, every: 2, tell: 'Hale points his axe at one of you: "You. Just you."' },
  { name: 'Call to the rail', power: 60, area: true, statuses: ['stunned'], chance: 0.4, every: 3, tell: 'Hale\'s whistle: "To the rail!" Boots on the boards behind you...' },
];

/** Thorne's Protection Fee (50%; COMBAT 13.3 #1, the second review's 3.14: stage two gets a shape). */
const THORNE_FEE: readonly EnemyMove[] = [
  { name: 'Sword cane', power: 115 },
  { name: 'Protection Fee', power: 120, statuses: ['weakened'], every: 2, tell: 'Thorne opens a ledger: "Your protection, Miss Limyè, is in arrears."' },
  { name: 'The Charter, read aloud', power: 90, area: true, every: 3, tell: 'Thorne unrolls the Charter: "Clause the seventh..."' },
];

export const WAR_ENEMIES: Readonly<Record<string, EnemyDef>> = {
  // The headland battery (stage one).
  war_officer: officer('war_officer', 26, 'war_musketeer'),
  war_musketeer: musketeer('war_musketeer', 25),
  war_breastplate: musketeer('war_breastplate', 25, true),
  // The picket on the gardens' road (The Ninth Thumbprint).
  picket_marine: marine('picket_marine', 26),
  picket_officer: officer('picket_officer', 26, 'picket_marine'),
  // The flank: each house's two, and the one more at half the captain's HP; the Quiet Crown's hand among them.
  flank_reaver: {
    id: 'flank_reaver',
    bribable: true,
    name: 'Steppe Reaver',
    look: 'steppe_reaver',
    level: 25,
    role: 'skirmisher',
    withdraws: { line: 'The reaver wheels away down the sand.' },
    moves: [
      { name: 'Sabre', power: 110 },
      { name: "Raider's Charge", power: 150, every: 3, tell: 'The reaver wheels and lowers the sabre...' },
    ],
  },
  flank_cutpurse: {
    id: 'flank_cutpurse',
    name: 'Fog Cutpurse',
    look: 'fog_cutpurse',
    level: 25,
    role: 'skirmisher',
    bribable: true,
    withdraws: { line: 'The cutpurse is gone behind the palms.' },
    moves: [
      { name: 'Knife', power: 105 },
      { name: 'Smoke bomb', power: 70, area: true, statuses: ['weakened'], chance: 0.5, every: 3, tell: 'The cutpurse bites a fuse...' },
    ],
  },
  flank_enforcer: {
    id: 'flank_enforcer',
    name: 'Oil Enforcer',
    look: 'oil_enforcer',
    level: 25,
    role: 'skirmisher',
    bribable: true,
    resist: ['fire'],
    withdraws: { line: 'The enforcer drops his cudgel and wades out to the hull.' },
    moves: [
      { name: 'Cudgel', power: 90 },
      { name: 'Oil Flask', power: 90, statuses: ['burning'], chance: 0.6, every: 3, tell: 'The enforcer uncorks a flask...' },
    ],
  },
  flank_raider: {
    id: 'flank_raider',
    name: 'Caravan Raider',
    look: 'caravan_raider',
    level: 25,
    role: 'skirmisher',
    bribable: true,
    withdraws: { line: 'The raider takes his purse back to the boat.' },
    moves: [
      { name: 'Scimitar', power: 115 },
      { name: 'Sand Toss', power: 70, statuses: ['weakened'], chance: 0.5, every: 3, tell: 'The raider scoops up a fistful of sand...' },
    ],
  },
  flank_husher: {
    id: 'flank_husher',
    name: 'Husher',
    look: 'husher',
    level: 26,
    role: 'caster',
    resist: ['light'],
    withdraws: { line: 'The Husher walks backwards into the sea, and is gone.' },
    moves: [
      { name: 'Whisper', power: 95, magic: true },
      { name: 'Hush', power: 70, magic: true, statuses: ['hushed'], every: 3, tell: 'The Husher lifts a finger to the veil. The beach goes quiet...' },
      { name: 'Seize', power: 0, seize: 3, statuses: ['marked'], every: 4, tell: 'The Husher is looking past you, at the back of the line...' },
    ],
  },
  ...Object.fromEntries(BETRAYERS.map((b) => [b.def.id, b.def])),
  // Stage two: Governor Thorne at his desk (the second review's 3.14: HP x4, a second phase, about 18 to 22 actions).
  thorne_war: {
    id: 'thorne_war',
    name: 'Governor Thorne',
    look: 'thorne',
    level: 27,
    role: 'tank',
    boss: true,
    hpScale: 5,
    atkScale: 1.15,
    weak: ['light'],
    withdraws: { line: 'Get me OUT! ...There is no out. Very well.', speaker: 'Governor Thorne' },
    moves: [
      { name: 'Sword cane', power: 110 },
      { name: 'Pistol shot', power: 190, every: 3, tell: 'Thorne cocks a silver pistol and takes his time aiming...' },
      { name: 'The Charter, read aloud', power: 80, area: true, every: 3, tell: 'Thorne unrolls the Charter: "Clause the seventh..."' },
    ],
  },
  customs_marine: marine('customs_marine', 26),
  customs_breastplate: musketeer('customs_breastplate', 26, true),
  // Caona's stand, fifty years ago (the Echo battle): the Crown's marines in the old uniform, coming off the longboats.
  old_marine: { ...marine('old_marine', 27, 'Crown Marine (old uniform)'), look: 'old_crown_marine', withdraws: { line: 'The marine wades back to the longboat.' } },
  old_musketeer: { ...musketeer('old_musketeer', 27), name: 'Crown Musketeer (old uniform)', look: 'old_crown_musketeer', withdraws: { line: 'The musketeer climbs back into the longboat.' } },
  // Trust: Captain-General Hale, the Regent's Champion (COMBAT 13.3 #9), and the Patience's boarders.
  hale: {
    id: 'hale',
    name: 'Captain-General Hale',
    look: 'hale',
    level: 28,
    role: 'tank',
    boss: true,
    hpScale: 7,
    atkScale: 1.45,
    withdraws: { line: 'The Regent will hear of this.', speaker: 'Captain-General Hale' },
    moves: [
      { name: 'Axe', power: 120 },
      { name: 'Boarders', power: 135, area: true, every: 2, tell: 'Hale\'s whistle: boats hit the pier...' },
    ],
  },
  hale_marine: { ...marine('hale_marine', 28), withdraws: { line: 'The boarder jumps back into the boat.' } },
  harbor_sealbearer: {
    id: 'harbor_sealbearer',
    name: "Regent's Sealbearer",
    look: 'sealbearer',
    level: 28,
    role: 'caster',
    armored: true,
    withdraws: { line: 'The Sealbearer lowers the seal, and steps down into the boat.' },
    moves: [
      { name: 'Writ', power: 100, magic: true, statuses: ['weakened'], chance: 0.6 },
      { name: 'Seal', power: 130, magic: true, statuses: ['hushed'], every: 3, tell: 'The Sealbearer lifts the Throne\'s seal...' },
    ],
  },
  // Strike: Rael's vanguard (COMBAT 13.3 #3b). He wears no Promesa: no floor (he gave it to Rivera to hold).
  rael_harbor: {
    id: 'rael_harbor',
    name: 'Rael',
    look: 'rael',
    level: 28,
    role: 'tank',
    boss: true,
    hpScale: 4.5,
    atkScale: 2.0,
    atkPerBound: 0.1,
    avoid: 'gianna',
    withdraws: { line: 'Enough. Enough. Rivera, the boats.', speaker: 'Rael' },
    moves: [
      { name: 'Blade', power: 125 },
      { name: 'La Marca', power: 100, statuses: ['marked'], powerPerBound: 30, every: 3, tell: 'Rael marks one of you with the flat of his blade.' },
    ],
  },
  harbor_rivera: {
    id: 'harbor_rivera',
    name: 'Captain Rivera',
    look: 'rivera',
    level: 27,
    role: 'tank',
    protects: 'rael_harbor',
    withdraws: { line: 'Stand back, Captain.', speaker: 'Rael' },
    moves: [
      { name: 'Halberd', power: 110 },
      { name: 'Hook', power: 95, statuses: ['stunned'], chance: 0.6, every: 2, tell: 'Rivera turns his halberd, hook first...' },
    ],
  },
  harbor_jaime: {
    id: 'harbor_jaime',
    name: 'Jaime',
    look: 'jaime',
    level: 27,
    role: 'caster',
    withdraws: { line: 'Enough, Jaime. Step back.', speaker: 'Rael' },
    moves: [
      { name: 'Ash Bolt', power: 95, magic: true },
      { name: 'Ash Storm', power: 120, magic: true, area: true, every: 2, tell: 'Jaime lifts both hands. The air over the pier begins to burn...' },
    ],
  },
  harbor_halberdier: {
    id: 'harbor_halberdier',
    name: 'Brasador Halberdier',
    look: 'brasador_halberdier',
    level: 27,
    role: 'tank',
    withdraws: { line: 'The halberdier steps back to the longboat.' },
    moves: [
      { name: 'Halberd', power: 110 },
      { name: 'Hook', power: 90, statuses: ['stunned'], chance: 0.5, every: 3, tell: 'The halberdier turns his blade, hook first...' },
    ],
  },
};

const WAR = 'war_story';

/** The betrayer's flank, one fight per house (written once: the second review's section 7). */
function flank(house: string, b: (typeof BETRAYERS)[number], foe: string): BattleDef {
  return {
    id: `harbor_flank_${house}`,
    title: 'Sails Behind Us',
    backdrop: 'canoe_beach',
    enemies: [foe, b.def.id, 'flank_husher', foe],
    table: WAR,
    group: `flank_${house}`,
    rewards: { xp: 160, gold: 400 },
    endsWithBoss: true,
    boss: true,
    volleys: true,
    phases: [{ below: 0.5, speaker: b.def.name, text: 'Again. And this time, all of you.', moves: b.hard, enter: [foe], enterText: 'One more of his house wades in from the hull.' }],
    tips: {
      start: 'The veil is looking at me, Gigi. Hit the one with the blade first.',
      spark: 'Surge, Gigi!',
      tell: 'Guard, everyone!',
      lowHp: 'Heal, Gigi.',
    },
  };
}

export const WAR_BATTLES: Readonly<Record<string, BattleDef>> = {
  // Stage one: the Crown's field gun on the headland (the outline beat 1). Paid flat (data).
  headland_battery: {
    id: 'headland_battery',
    title: 'The Gun on the Headland',
    backdrop: 'canoe_beach',
    enemies: ['war_musketeer', 'war_officer', 'war_breastplate'],
    table: WAR,
    group: 'headland',
    rewards: { xp: 80, gold: 200 },
    volleys: true,
    tips: {
      start: 'The one with the breastplate, Gigi. Your light goes through it.',
      spark: 'Surge, Gigi!',
      tell: 'They\'re aiming! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  harbor_flank_skarragol: flank('skarragol', HRAFN, 'flank_reaver'),
  harbor_flank_kuroshi: flank('kuroshi', RETAINER, 'flank_cutpurse'),
  harbor_flank_jwaladesh: flank('jwaladesh', STEWARD, 'flank_enforcer'),
  harbor_flank_al_doria: flank('al_doria', ADMIRAL, 'flank_raider'),
  // The Ninth Thumbprint: the Crown's picket on the gardens' road (required by the tide's gate: the story's fight, as Z-6's
  // crew was in Chapter 10).
  thumbprint_picket: {
    id: 'thumbprint_picket',
    title: 'The Gardens\' Road',
    backdrop: 'mountain_path',
    enemies: ['picket_marine', 'picket_officer', 'picket_marine'],
    table: WAR,
    group: 'picket',
    sideQuest: 'ninth_thumbprint',
    rewards: { xp: 40, gold: 120 },
    tips: {
      start: 'They want the jars, Gigi. The officer first: he makes them braver.',
      spark: 'Surge, Gigi!',
      tell: 'Bayonets! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Stage two: Governor Thorne in the customs house (the second review's 3.14). Game Over's way back in: Thorne at his desk.
  customs_thorne: {
    id: 'customs_thorne',
    title: 'Governor Thorne',
    backdrop: 'yucayeque_night',
    enemies: ['customs_marine', 'thorne_war', 'customs_breastplate'],
    table: WAR,
    group: 'thorne',
    rewards: { xp: 140, gold: 350 },
    endsWithBoss: true,
    boss: true,
    volleys: true,
    phases: [{ below: 0.5, speaker: 'Governor Thorne', text: 'You are behind on your protection, Miss Limyè. Considerably.', moves: THORNE_FEE }],
    tips: {
      start: 'He hates the light, Gigi. He always did.',
      spark: 'All my light, Gigi! Surge!',
      tell: 'He\'s aiming! Guard!',
      lowHp: 'Gigi, heal!',
    },
  },
  // Stage three: Caona's stand on the pier, fifty years ago (the Echo battle; the pier assault folded into it: the second
  // review's 3.15). The Echo three fight; Anissa holds the door in the present.
  caona_stand: {
    id: 'caona_stand',
    title: 'Caona\'s Stand',
    backdrop: 'yucayeque_pier',
    enemies: ['old_marine', 'old_musketeer', 'old_marine', 'old_marine'],
    table: WAR,
    group: 'caona',
    rewards: { xp: 60, gold: 0 },
    era: 'echo',
  },
  // Trust: the Regent's Champion at the pier's end, with Rael in the four (party.rael, set by the Turn's line; a loss takes it
  // back: onLoss, the second review's 3.8).
  flagship_hale: {
    id: 'flagship_hale',
    title: 'The Regent\'s Champion',
    backdrop: 'yucayeque_pier',
    enemies: ['hale_marine', 'hale', 'harbor_sealbearer', 'hale_marine'],
    table: WAR,
    group: 'hale',
    rewards: { xp: 180, gold: 600, items: [{ id: 'boarding_axe_of_force', n: 1 }] },
    endsWithBoss: true,
    boss: true,
    volleys: true,
    onLoss: { 'party.rael': false },
    phases: [
      {
        below: 0.5,
        speaker: 'Captain-General Hale',
        text: 'One of you. The Regent asked me to make it quick.',
        moves: HALE_DUEL,
        enter: ['hale_marine', 'hale_marine'],
        enterText: 'Two more boarders come up over the pier\'s end.',
      },
    ],
    tips: {
      start: 'He wants one of you alone, Gigi. Stay together.',
      spark: 'Surge, Gigi!',
      tell: 'Guard, everyone!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Strike: Rael's vanguard (COMBAT 13.3 #3b; the second review's 3.3: the hard route on purpose). No volleys: the companies
  // will not fire on the pier with the envoy in the line. He only Binds; he never strikes Gianna.
  pier_rael: {
    id: 'pier_rael',
    title: 'The Harbor Strike',
    backdrop: 'yucayeque_pier',
    enemies: ['harbor_rivera', 'rael_harbor', 'harbor_jaime'],
    table: WAR,
    group: 'rael',
    rewards: { xp: 180, gold: 0 },
    endsWithBoss: true,
    boss: true,
    binds: true,
    phases: [
      {
        below: 0.66,
        speaker: 'Rael',
        text: 'Rivera. Bring them up.',
        moves: RAEL_HARBOR_UNLEASHED,
        enter: ['harbor_halberdier', 'harbor_halberdier'],
        enterText: 'Two halberdiers come up the pier from the longboat.',
      },
      { below: 0.33, speaker: 'Rael', text: 'Again.', moves: RAEL_HARBOR_CORNERED },
      {
        below: 0.15,
        speaker: 'Rael',
        text: 'Enough. Rivera, the boats. All of you.',
        moves: RAEL_BROKEN_ARMY,
        leave: ['harbor_rivera', 'harbor_jaime', 'harbor_halberdier'],
      },
    ],
    tips: {
      start: 'He isn\'t angry, Gigi. He won\'t touch you. That\'s worse.',
      spark: 'Take my light, Gigi.',
      tell: 'Guard, everyone!',
      lowHp: 'Heal them, Gigi. Please.',
    },
  },
};

/** Every fight with volleys (the whistle asks before each). */
export const VOLLEY_BATTLES: readonly string[] = Object.values(WAR_BATTLES).filter((b) => b.volleys).map((b) => b.id);
