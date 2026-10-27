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
import { FLOOR_MAKER, HALL, NIGHTINGALE, PIER, QUARTER, SAYO_DOOR, SAYO_HOUSE } from './kuroshi.ts';

const f = (flag: string): Condition => ({ flag });
const all = (...c: Condition[]): Condition => ({ all: c });

/** XP each pays (Claude's call; tests/sideQuestsLate.test.ts checks the curve with all of them done). */
export const LATE_XP = { notASpy: 40, letterFloor: 60, argue: 30, littleLamps: 60, sorry: 40, patientHour: 60, tea: 40 } as const;

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

/** Every side quest built Oct 27, in chapter order. */
export const LATE_SIDE_QUESTS: readonly SideQuestDef[] = [...KUROSHI];

/** Pillars that follow a quest's answers (data/rpg.ts pillarRules). */
export const LATE_PILLAR_RULES: RpgContent['pillarRules'] = [];
