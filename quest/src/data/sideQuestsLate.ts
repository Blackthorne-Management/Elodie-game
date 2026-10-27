// The side quests once kept for after the release, built Oct 27 for the Nov 22 release (the owner, Oct 27): Chapter 7's
// K-1 Definitely Not a Spy and K-4 The Letter in the Floor (the Nightingale Key), Chapter 8's J-1 Win Every Argument and
// J-4 Oil for the Little Lamps (the Unbroken Wick), Chapter 9's Al-1 Terribly Sorry, Al-4 The Clock That Waits (the
// Patient Hour) and Al-5 Tea With Lady Rosalind (docs/quest/design/SIDE-QUESTS.md, SECRET-ITEMS.md 4, 7 and 8, with
// their "Built" notes). All optional: the route never takes them, and each closes when its chapter's ship sails.
//
// What they pay (Claude's call, the levels pass's rule): small XP, so a player who does every one of them ends each
// chapter at most one level over its target (the played line's slack), and the line without side quests is unchanged.
// The design's gold and pillars are kept.

import type { Condition } from '../engine/conditions.ts';
import type { RpgContent } from '../engine/rpg.ts';
import type { SideQuestDef } from '../engine/sideQuests.ts';
import { CLOCKMAKER_DAWN, CLOCK_TOWER, KEEP, LETTERS, TOWER_CLOCK, TOWNHOUSE_DOOR } from './aldermoor.ts';
import { ARGUERS, BAZAAR, HARBOR, OIL_STORE } from './jwaladesh.ts';
import { CAMP, CHAPEL, ERRAND, FEAST, FEAST_FLAGS, TRIAL_MORNING } from './ardencia.ts';
import { FLOOR_MAKER, HALL, NIGHTINGALE, PIER, QUARTER, SAYO_DOOR, SAYO_HOUSE } from './kuroshi.ts';

const f = (flag: string): Condition => ({ flag });
const all = (...c: Condition[]): Condition => ({ all: c });

/** XP each pays (Claude's call; tests/sideQuestsLate.test.ts checks the curve with all of them done). */
export const LATE_XP = {
  // Chapters 3 to 6 (built Oct 27, second batch): Chapter 6 ends 74 XP short of level 18 on the route, and Z-4 already takes
  // 30 of it, so everything from Chapter 3 to Chapter 6 together (fights included) stays under 44 (Claude's call).
  feast: 5,
  oldErrand: 5,
  arrows: 2,
  notASpy: 40,
  letterFloor: 60,
  argue: 30,
  littleLamps: 60,
  sorry: 40,
  patientHour: 60,
  tea: 40,
} as const;

// ---- Chapter 3 (Cenizal) -------------------------------------------------------------------------------------------

const ALCAZAR = 'ardencia-alcazar';
const soldier = (x: number, y: number) => ({ map: 'ardencia-camp', at: { x, y: y + 1 } });

const CENIZAL: readonly SideQuestDef[] = [
  // Ar-3: the contract board, the elders' feast, Elder Ferrán's salt tax (his blades, or the hall's book and three questions).
  {
    id: 'feast',
    title: 'The Elders\' Feast',
    giver: 'The contract board',
    place: 'The Upper Town\'s plaza',
    level: 10,
    summary: 'The elders want discreet guards at their feast, the morning of the trial. A guard who hears nothing is paid well.',
    accepted: f(FEAST_FLAGS.accepted),
    available: TRIAL_MORNING,
    start: [{ map: 'ardencia-town', at: { x: FEAST.board.x, y: FEAST.board.y + 1 } }],
    nudge: 'There is a new notice on the contract board, Gigi. The elders are having a feast.',
    steps: [
      { text: 'Stand guard at the elders\' feast, inside the elders\' hall door in the Alcázar.', done: f(FEAST_FLAGS.heard), goals: [{ map: ALCAZAR, at: { x: FEAST.hallDoor.x, y: FEAST.hallDoor.y } }] },
      {
        text: 'Twelve in the hundred, nine years: under Elder Ferrán\'s stair on the plaza, or in the hall\'s salt-tax book in the records room.',
        done: { any: [f(FEAST_FLAGS.tally), f(FEAST_FLAGS.book)] },
        goals: [{ map: ALCAZAR, at: { x: FEAST.taxBook.x, y: FEAST.taxBook.y + 1 } }],
      },
      { text: 'Elder Ferrán, at the elders\' table.', done: f(FEAST_FLAGS.done), goals: [{ map: ALCAZAR, at: { x: FEAST.ferran.x, y: FEAST.ferran.y + 1 } }] },
    ],
    done: f(FEAST_FLAGS.done),
    closed: f('story.noon'),
    closedText: 'Closed: noon came. Elder Ferrán went up to the gallery to watch the law work.',
    reward: { gold: 300, xp: LATE_XP.feast },
  },
  // Ar-4 (S-ARD): old Benny's promise in the crypt under the chapel, the cloister crossed in two eras, La Promesa de Benny.
  {
    id: 'old_errand',
    title: 'The Old Lord\'s Errand',
    giver: 'Old Lord Benny',
    place: 'The quiet rooms, in the Alcázar',
    level: 11,
    secret: true,
    summary: 'Old Benny wrote a promise before his son was born and left it in an iron box in the crypt under the chapel. Nobody has read it.',
    accepted: f(ERRAND.accepted),
    available: all(f('side.treasurer.done'), { notFlag: 'story.trial_fought' }),
    start: [{ map: ALCAZAR, at: { x: 4, y: 15 } }],
    steps: [
      { text: 'Old Benny, in the quiet rooms.', done: f(ERRAND.accepted), goals: [{ map: ALCAZAR, at: { x: 4, y: 15 } }] },
      {
        text: 'The crypt off the cloister\'s north walk is bolted from inside. Rael\'s guards keep the walks now; Benny\'s kept them then, elsewhere.',
        done: f(ERRAND.anchor),
        goals: [{ map: 'ardencia-chapel', at: { x: CHAPEL.doorway.x, y: CHAPEL.doorway.y + 1 } }],
        echoGoals: [{ map: 'ardencia-chapel', at: { x: CHAPEL.bennyYoung.x, y: CHAPEL.bennyYoung.y - 1 } }],
      },
      { text: 'The iron box in the crypt.', done: f(ERRAND.promise), goals: [{ map: 'ardencia-chapel', at: { x: CHAPEL.niche.x - 1, y: CHAPEL.niche.y } }] },
      { text: 'Up Benny\'s own stair, to the old lord.', done: f(ERRAND.done), goals: [{ map: ALCAZAR, at: { x: 4, y: 15 } }] },
    ],
    done: f(ERRAND.done),
    closed: f('story.trial_fought'),
    closedText: 'Closed: the trial, and the forge. The promise is still in its iron box under the chapel.',
    reward: { gold: 250, xp: LATE_XP.oldErrand, pillar: { pillar: 'influence', city: 'ardencia', amount: 2 } },
  },
  // Ar-5: five of Azzy's company at the strand camp; three saw every shot land wide; Azzy will not hear it.
  {
    id: 'arrows',
    title: 'The Arrows Missed',
    giver: 'A Free Brasador soldier',
    place: 'The strand camp',
    level: 11,
    summary: 'Every shot from the wall landed wide, and those were the best shots in Ardencia. Azzy says they missed. His company is not so sure.',
    accepted: f('side.arrows.accepted'),
    available: all(f('act3.complete'), { notFlag: 'story.aldoria_arrived' }),
    start: [soldier(9, 5)],
    nudge: 'The soldier by the fire keeps looking up at the wall, Gigi.',
    parallel: true,
    steps: [
      { text: 'The soldier by the fire.', done: f('side.arrows.a'), goals: [soldier(9, 5)] },
      { text: 'The soldier by the coffee.', done: f('side.arrows.b'), goals: [soldier(11, 7)] },
      { text: 'The soldier by the tents.', done: f('side.arrows.c'), goals: [soldier(12, 5)] },
      { text: 'The crossbowman from the gatehouse.', done: f('side.arrows.d'), goals: [soldier(CAMP.soldierD.x, CAMP.soldierD.y)] },
      { text: 'The musketeer from the wall.', done: f('side.arrows.e'), goals: [soldier(CAMP.soldierE.x, CAMP.soldierE.y)] },
    ],
    done: f('side.arrows.done'),
    closed: f('story.aldoria_arrived'),
    closedText: 'Closed: the trader sailed. Free Brasador still argues about the wall.',
    reward: { xp: LATE_XP.arrows, pillar: { pillar: 'fear', city: 'ardencia', amount: 2 } },
  },
];

// ---- Chapter 7 (Kirinoura) ------------------------------------------------------------------------------------------

const KUROSHI_DAWN: Condition = all(f('story.quarter_dawn'), f('party.haru'));

const KUROSHI: readonly SideQuestDef[] = [
  // K-1: Yari makes Haru show how he followed them, at the three places he was seen.
  {
    id: 'not_a_spy',
    title: 'Definitely Not a Spy',
    giver: 'Yari',
    place: 'The tea house screen',
    level: 19,
    summary: 'Haru followed the party three times before he spoke to them. Yari wants to see how, at every place, before she believes he is not a spy.',
    accepted: f('side.not_a_spy.accepted'),
    available: KUROSHI_DAWN,
    start: [{ map: 'kuroshi-quarter', at: { x: QUARTER.screen.x, y: QUARTER.screen.y + 1 } }],
    nudge: 'Yari keeps looking at the tea house screen, Gigi. And then at Haru.',
    parallel: true,
    steps: [
      { text: 'The puddle on the pier, by the lantern pile.', done: f('side.not_a_spy.pier'), goals: [{ map: 'kuroshi-pier', at: { x: PIER.puddle.x, y: PIER.sightRow } }] },
      { text: 'The tea house screen on the west bank.', done: f('side.not_a_spy.screen'), goals: [{ map: 'kuroshi-quarter', at: { x: QUARTER.screen.x, y: QUARTER.screenRow } }] },
      { text: 'The screen in the Hall\'s corridor.', done: f('side.not_a_spy.shoes'), goals: [{ map: 'kuroshi-hall', at: { x: HALL.shoes.x - 2, y: HALL.shoes.y } }] },
    ],
    done: f('side.not_a_spy.done'),
    closed: f('act7.complete'),
    closedText: 'Closed: the trader sailed. Yari still says he is a very bad spy.',
    reward: { gold: 200, xp: LATE_XP.notASpy, pillar: { pillar: 'influence', city: 'kuroshi', amount: 1 } },
  },
  // K-4 (S-KUR): the old floor-maker, Lady Sayo's House, the singing floor, the Nightingale Key.
  {
    id: 'letter_floor',
    title: 'The Letter in the Floor',
    giver: 'The old floor-maker',
    place: 'Lady Sayo\'s House',
    level: 19,
    summary: 'Lady Sayo\'s last message to the Marshal is locked in her listening room, in a box that opens for one tune walked on a singing floor. The floor has been relaid since.',
    accepted: f('side.letter_floor.accepted'),
    available: KUROSHI_DAWN,
    start: [{ map: 'kuroshi-quarter', at: { ...FLOOR_MAKER } }],
    nudge: 'An old man by the shut house on the west canal keeps looking at Haru, Gigi.',
    steps: [
      { text: 'The old floor-maker by Lady Sayo\'s door.', done: f('side.letter_floor.accepted'), goals: [{ map: 'kuroshi-quarter', at: { ...FLOOR_MAKER } }] },
      {
        text: 'The floor was laid differently fifty years ago. Where the entry shimmers, listen to it.',
        done: f('clue.sayo_tune'),
        goals: [{ map: 'kuroshi-quarter', at: { x: SAYO_DOOR.x + 1, y: SAYO_DOOR.y } }, { map: 'kuroshi-sayo-house', at: { x: SAYO_HOUSE.zone.x + 1, y: SAYO_HOUSE.zone.y } }],
        echoGoals: [{ map: 'kuroshi-sayo-house', at: { x: SAYO_HOUSE.zone.x + 1, y: SAYO_HOUSE.zone.y } }],
      },
      {
        text: 'The tune rests on a silent board, and no board is silent now. In the memory, nail one where the rest must fall; then walk the tune.',
        done: f(NIGHTINGALE.open),
        goals: [{ map: 'kuroshi-sayo-house', at: { x: SAYO_HOUSE.floor.x, y: SAYO_HOUSE.floor.y + 4 } }],
        echoGoals: [{ map: 'kuroshi-sayo-house', at: { x: SAYO_HOUSE.floor.x + 2, y: SAYO_HOUSE.floor.y + 5 } }],
      },
      { text: 'The lacquer box beyond the floor.', done: f('side.letter_floor.done'), goals: [{ map: 'kuroshi-sayo-house', at: { x: SAYO_HOUSE.box.x, y: SAYO_HOUSE.box.y + 1 } }] },
    ],
    done: f('side.letter_floor.done'),
    closed: f('act7.complete'),
    closedText: 'Closed: the trader sailed. The box is still shut under the far wall, and the floor still sings.',
    reward: { gold: 300, xp: LATE_XP.letterFloor, pillar: { pillar: 'influence', city: 'kuroshi', amount: 2 } },
  },
];

// ---- Chapter 8 (Agnipur) -------------------------------------------------------------------------------------------

const AGNIPUR_DAWN: Condition = all(f('story.dhanraj_beaten'), { notFlag: 'act8.complete' });
const arguer = (who: keyof typeof ARGUERS) => ({ map: 'jwaladesh-bazaar', at: { x: ARGUERS[who].x, y: ARGUERS[who].y + 1 } });

const AGNIPUR: readonly SideQuestDef[] = [
  // J-1: the three who out-argued Vikram, won back by a bout or by Gianna's answer.
  {
    id: 'argue',
    title: 'Win Every Argument',
    giver: 'Vikram',
    place: 'The Lamp Bazaar',
    level: 21,
    summary: 'Three people in the bazaar out-argued Vikram while he was out of breath. He wants every argument back: by the blade, or by the envoy\'s answer.',
    accepted: f('side.argue.accepted'),
    available: all(AGNIPUR_DAWN, f('party.vikram')),
    start: [arguer('spice')],
    nudge: 'Vikram keeps glaring at a spice-seller, Gigi. And at a dyer. And at an old man on the temple steps.',
    parallel: true,
    steps: [
      { text: 'The spice-seller on the spice row.', done: f('side.argue.spice'), goals: [arguer('spice')] },
      { text: 'The dyer by the dyers\' lane.', done: f('side.argue.dyer'), goals: [arguer('dyer')] },
      { text: 'The old wrestler on the temple steps.', done: f('side.argue.wrestler'), goals: [arguer('wrestler')] },
    ],
    done: f('side.argue.done'),
    closed: f('act8.complete'),
    closedText: 'Closed: the trader sailed. Vikram says he would have won the rest.',
    reward: { gold: 300, xp: LATE_XP.argue },
  },
  // J-4 (S-JWA): the shrine child, the balance lock, the lamp-maker's jars, the Unbroken Wick.
  {
    id: 'little_lamps',
    title: 'Oil for the Little Lamps',
    giver: 'The shrine child',
    place: 'The spice row',
    level: 21,
    summary: 'A child\'s street shrine burned for fifty years on its own sealed oil, until the Seth\'s men took the jar. It is behind a door with scales on it.',
    accepted: f('side.little_lamps.accepted'),
    available: AGNIPUR_DAWN,
    start: [{ map: 'jwaladesh-bazaar', at: { x: BAZAAR.shrineChild.x, y: BAZAAR.shrineChild.y + 1 } }],
    nudge: 'The little girl by the dark shrine is still waiting for her oil, Gigi.',
    steps: [
      { text: 'The shrine child on the spice row.', done: f('side.little_lamps.accepted'), goals: [{ map: 'jwaladesh-bazaar', at: { x: BAZAAR.shrineChild.x, y: BAZAAR.shrineChild.y + 1 } }] },
      {
        text: 'The balance lock in the oil store wants a measure. The store remembers the night the riders came home.',
        done: f('clue.five_home'),
        goals: [{ map: 'jwaladesh-bazaar', at: { ...BAZAAR.harbor } }, { map: 'jwaladesh-harbor', at: { x: OIL_STORE.zone.x + 1, y: OIL_STORE.zone.y } }],
        echoGoals: [{ map: 'jwaladesh-harbor', at: { x: OIL_STORE.zone.x + 1, y: OIL_STORE.zone.y } }],
      },
      {
        text: 'The measure of those who came home, poured exactly, sealed in the lamp-maker\'s reservoir.',
        done: f('story.lock_balanced'),
        goals: [{ map: 'jwaladesh-harbor', at: { x: HARBOR.balanceLock.x, y: HARBOR.balanceLock.y + 1 } }],
        echoGoals: [{ map: 'jwaladesh-harbor', at: { x: OIL_STORE.lampMaker.x, y: OIL_STORE.lampMaker.y + 1 } }],
      },
      { text: 'The reservoir to the shrine child.', done: f('side.little_lamps.done'), goals: [{ map: 'jwaladesh-bazaar', at: { x: BAZAAR.shrineChild.x, y: BAZAAR.shrineChild.y + 1 } }] },
    ],
    done: f('side.little_lamps.done'),
    closed: f('act8.complete'),
    closedText: 'Closed: the trader sailed. The runners will fill her lamp. It will go out again.',
    reward: { xp: LATE_XP.littleLamps, pillar: { pillar: 'influence', city: 'jwaladesh', amount: 2 } },
  },
];

// ---- Chapter 9 (Kingsmere) ------------------------------------------------------------------------------------------

const LAST_DAWN: Condition = all(f('story.hushed_beaten'), { notFlag: 'act9.complete' });
const ON_THE_CROSS = new Set(['sergeant', 'constable']);
const IN_THE_KEEP = new Set(['footman']);
const letterGoal = (who: keyof typeof LETTERS) => ({
  map: ON_THE_CROSS.has(who) ? 'aldermoor-cross' : IN_THE_KEEP.has(who) ? 'aldermoor-keep' : 'aldermoor-heath',
  at: { x: LETTERS[who].x, y: LETTERS[who].y + 1 },
});
const TOWER_ZONE = { map: 'aldermoor-clocktower', at: { x: CLOCK_TOWER.zone.x + 1, y: CLOCK_TOWER.zone.y } };

const KINGSMERE: readonly SideQuestDef[] = [
  // Al-1: Edmund's five letters, by hand.
  {
    id: 'sorry',
    title: 'Terribly Sorry',
    giver: 'Edmund (and his mother)',
    place: 'The Regent\'s hall',
    level: 22,
    summary: 'Edmund has written to everyone he has hit: a press-gang sergeant, a constable, a highwayman, a goose and the Regent\'s footman. His mother says a Stillwater apologises in person.',
    accepted: f('side.sorry.accepted'),
    available: all(f('party.edmund'), f('story.regent_refused'), { notFlag: 'story.recital_begun' }, { notFlag: 'act9.complete' }),
    start: [{ map: 'aldermoor-keep', at: { x: KEEP.council[3]!.x - 1, y: KEEP.council[3]!.y } }],
    nudge: 'Edmund\'s mother is on the Regent\'s council, Gigi. She said something about letters.',
    parallel: true,
    steps: [
      { text: 'The press-gang\'s sergeant, on the square by the south road.', done: f('side.sorry.sergeant'), goals: [letterGoal('sergeant')] },
      { text: 'The constable on the square\'s north-east corner.', done: f('side.sorry.constable'), goals: [letterGoal('constable')] },
      { text: 'The highwayman in the heather, north of the heath road.', done: f('side.sorry.bandit'), goals: [letterGoal('bandit')] },
      { text: 'The goose on the heath, by the mere.', done: f('side.sorry.goose'), goals: [letterGoal('goose')] },
      { text: 'The Regent\'s footman in the great hall.', done: f('side.sorry.footman'), goals: [letterGoal('footman')] },
    ],
    done: f('side.sorry.done'),
    closed: f('act9.complete'),
    closedText: 'Closed: the trader sailed with letters still in Edmund\'s coat. He says he will post them.',
    reward: { gold: 400, xp: LATE_XP.sorry, pillar: { pillar: 'influence', city: 'aldermoor', amount: 1 } },
  },
  // Al-4 (S-ALM): the clockmaker, the tower clock, Agatha's vault, the Patient Hour.
  {
    id: 'patient_hour',
    title: 'The Clock That Waits',
    giver: 'The clockmaker',
    place: 'The Market Cross',
    level: 24,
    summary: 'The keep\'s tower clock stopped the night Thomas Stillwater wrote his record, and Dame Agatha keyed a vault behind its face to one hour.',
    accepted: f('side.patient_hour.accepted'),
    available: LAST_DAWN,
    start: [{ map: 'aldermoor-cross', at: { x: CLOCKMAKER_DAWN.x, y: CLOCKMAKER_DAWN.y + 1 } }],
    nudge: 'The clockmaker from the gallery is by the keep\'s gate, Gigi. Looking up at the tower.',
    steps: [
      { text: 'The clockmaker by the keep\'s gate.', done: f('side.patient_hour.accepted'), goals: [{ map: 'aldermoor-cross', at: { x: CLOCKMAKER_DAWN.x, y: CLOCKMAKER_DAWN.y + 1 } }] },
      {
        text: 'The tower door in the great hall\'s north wall. The tower remembers the night Thomas wrote.',
        done: f('clue.tower_night'),
        goals: [{ map: 'aldermoor-keep', at: { x: KEEP.clockDoor.x, y: KEEP.clockDoor.y + 1 } }, TOWER_ZONE],
        echoGoals: [TOWER_ZONE],
      },
      {
        text: 'Stop the clock on the hour Thomas wrote, before the watchman climbs. A key with gears, a spring, and a quill.',
        done: f(TOWER_CLOCK.anchor),
        goals: [TOWER_ZONE],
        echoGoals: [{ map: 'aldermoor-clocktower', at: { x: CLOCK_TOWER.winder.x, y: CLOCK_TOWER.winder.y + 1 } }],
      },
      { text: 'Agatha\'s vault, beside the clock\'s face.', done: f('side.patient_hour.done'), goals: [{ map: 'aldermoor-clocktower', at: { x: CLOCK_TOWER.vault.x, y: CLOCK_TOWER.vault.y + 1 } }] },
    ],
    done: f('side.patient_hour.done'),
    closed: f('act9.complete'),
    closedText: 'Closed: the trader sailed. The tower clock still reads an hour nobody can see for rust.',
    reward: { gold: 400, xp: LATE_XP.patientHour, pillar: { pillar: 'influence', city: 'aldermoor', amount: 2 } },
  },
  // Al-5: tea with Lady Rosalind at the last dawn; three cups, Thomas's record.
  {
    id: 'tea',
    title: 'Tea With Lady Rosalind',
    giver: 'Lady Rosalind Stillwater',
    place: 'Lady Rosalind\'s house',
    level: 24,
    summary: 'Lady Rosalind withdrew from the Regent\'s council in front of the whole court. Over three cups of tea she wants to be persuaded she was right.',
    accepted: f('side.tea.accepted'),
    available: LAST_DAWN,
    start: [{ map: 'aldermoor-cross', at: { x: TOWNHOUSE_DOOR.x, y: TOWNHOUSE_DOOR.y + 1 } }],
    nudge: 'Edmund keeps looking at his mother\'s door on the square, Gigi.',
    steps: [{ text: 'Three cups at Lady Rosalind\'s. Her father\'s record wins them.', done: f('side.tea.done'), goals: [{ map: 'aldermoor-cross', at: { x: TOWNHOUSE_DOOR.x, y: TOWNHOUSE_DOOR.y + 1 } }] }],
    done: f('side.tea.done'),
    closed: f('act9.complete'),
    closedText: 'Closed: the trader sailed. Lady Rosalind is still reading her father\'s record.',
    reward: { xp: LATE_XP.tea, pillar: { pillar: 'influence', city: 'aldermoor', amount: 2 } },
  },
];

/** Every side quest built Oct 27, in chapter order. */
export const LATE_SIDE_QUESTS: readonly SideQuestDef[] = [...CENIZAL, ...KUROSHI, ...AGNIPUR, ...KINGSMERE];

/** Pillars that follow a quest's answers (data/rpg.ts pillarRules): J-1's Fear by the blade, or Influence by the word. */
export const LATE_PILLAR_RULES: RpgContent['pillarRules'] = [
  // Ar-3: +2 Fear by the blades, or +2 Influence by the book (Ardencia).
  { pillar: 'fear', city: 'ardencia', flags: [FEAST_FLAGS.fear], each: 2 },
  { pillar: 'influence', city: 'ardencia', flags: [FEAST_FLAGS.influence], each: 2 },
  { pillar: 'fear', city: 'jwaladesh', flags: ['side.argue.fear'], each: 1 },
  { pillar: 'influence', city: 'jwaladesh', flags: ['side.argue.influence'], each: 1 },
];
