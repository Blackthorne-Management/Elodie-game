// Chapter 2's side quests in Yucayeque (Oct 20; docs/quest/reviews/2026-10-19-chapter2-side-quests-outline.md and
// its owner decisions): Cut Nets, The Hutia's Hoard, Oil From a Stranger, Medicine for the Cacique and the debate
// (Owned or Remembered), each played through its real dialogues; the gate (the lamp-oil seller lends the cave lamp
// at dusk, once all five are done); the arrow's single climb; every quest closing at the Crown attack; old saves.

import { describe, expect, it } from 'vitest';
import { MAP_MOODS } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { ACT2, JOURNAL_NOTES } from '../src/data/quests.ts';
import { RPG } from '../src/data/rpg.ts';
import { CHAPTER2_QUESTS, CHAPTER2_QUESTS_DONE, SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { mysteryGoals, mysteryQuests, sideGoals, sideNudges, storyGoal, waypoint } from '../src/engine/guide.ts';
import { currentObjective } from '../src/engine/quests.ts';
import { gold, itemCount, pillarFlag, sharedXp } from '../src/engine/rpg.ts';
import { closedNotes, rewardFlag, settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { activeNpcs } from '../src/engine/world.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();
const quest = (id: string) => SIDE_QUESTS.find((q) => q.id === id)!;

/** Talk to `id`, picking the choices whose text starts with each of `picks` in turn; returns every line shown. */
function talk(flags: FlagStore, id: string, picks: string[] = []): string[] {
  const script = CONTENT.dialogue[id];
  if (!script) throw new Error(`no dialogue ${id}`);
  const run = new DialogueRunner(script, CONTENT.speakers, flags);
  const seen: string[] = [];
  const queue = [...picks];
  for (let i = 0; i < 200 && !run.done; i++) {
    const v = run.view();
    if (v.kind === 'end') break;
    seen.push(v.text);
    if (v.kind === 'choice') {
      const want = queue.shift();
      const c = want === undefined ? undefined : v.choices.find((ch) => ch.text.startsWith(want));
      if (!c) throw new Error(`${id}: no choice "${want}" in ${v.choices.map((ch) => ch.text).join(' / ')}`);
      run.choose(c.index);
    } else run.advance();
  }
  expect(queue, `${id}: unused picks`).toEqual([]);
  return seen;
}

/** Yucayeque the day Thorne warns Gianna off: the pier won, Anaco met, the council defied, Thorne seen. */
const DAY: FlagSnapshot = {
  'item.sun_locket': true,
  'encounter.xaragua_story.pier.won': true,
  'story.anaco_met': true,
  'story.council_defied': true,
  'story.thorne_met': true,
};
const day = (more: FlagSnapshot = {}) => new FlagStore({ ...DAY, ...more });
const ALL_DONE: FlagSnapshot = {
  'side.nets.done': true,
  'side.hutia.done': true,
  'side.oil.done': true,
  'side.medicine.done': true,
  'debate.xaragua_springs.joined': true,
};

describe("Chapter 2's side quests: the shape", () => {
  it('five quests gate the lamp, listed in walking order with the debate last', () => {
    expect([...CHAPTER2_QUESTS]).toEqual(['nets', 'hutia', 'oil', 'medicine', 'springs']);
    const order = SIDE_QUESTS.map((q) => q.id).filter((id) => (CHAPTER2_QUESTS as readonly string[]).includes(id));
    expect(order).toEqual([...CHAPTER2_QUESTS]);
    for (const id of CHAPTER2_QUESTS) expect(quest(id).place, id).not.toBe('Yucayeque');
  });

  it('each pays 20 to 30 XP (review D1); the request and the gate pay no story XP, and the lamp pays once', () => {
    for (const id of CHAPTER2_QUESTS) {
      const xp = quest(id).reward.xp ?? 0;
      expect(xp, id).toBeGreaterThanOrEqual(20);
      expect(xp, id).toBeLessThanOrEqual(30);
    }
    const byId = Object.fromEntries(ACT2.objectives.map((o) => [o.id, o]));
    expect(byId.lamp_ask!.noXp).toBe(true);
    expect(byId.dusk!.noXp).toBe(true);
    expect(byId.dusk!.followSide).toBe(true);
    const storyFlags = RPG.xpRules[1]!.flags; // the story steps by chapter: index 1 is Chapter 2's
    expect(storyFlags.filter((f) => f === 'item.oil_lamp')).toHaveLength(1);
    expect(storyFlags).not.toContain('story.lamp_asked');
    for (const o of ACT2.objectives.filter((x) => !x.noXp)) expect(JSON.stringify(o.done), o.id).not.toMatch(/side\.|debate\./);
  });

  it('the objectives run Thorne, the request, dusk, the lamp, the cave', () => {
    const ids = ACT2.objectives.map((o) => o.id);
    expect(ids.slice(ids.indexOf('thorne'), ids.indexOf('cave') + 1)).toEqual(['thorne', 'lamp_ask', 'dusk', 'lamp', 'cave']);
  });

  it('every giver stands in the free city, and every quest thing is drawn from the art config', () => {
    const givers: Record<string, [string, string]> = {
      nets: ['xaragua-village', 'canoe_fisher'],
      hutia: ['xaragua-conuco', 'conuco_kid'],
      oil: ['xaragua-village', 'lamp_oil_seller'],
      medicine: ['xaragua-caney', 'behique'],
    };
    for (const [id, [map, npc]] of Object.entries(givers)) {
      const flags = day();
      const here = activeNpcs(maps[map]!, 'present', flags).find((n) => n.npc === npc);
      expect(here?.pos, id).toEqual(quest(id).start![0]!.at);
    }
    const tiles = new Set<string>(CONTENT.objects ? Object.keys(CONTENT.objects) : []);
    for (const o of ['net_village', 'net_beach', 'net_salt', 'old_ceiba', 'ceiba_sapling', 'old_stumps', 'young_grove']) expect(tiles.has(o), o).toBe(true);
  });
});

describe('mystery quests: offered from their moment, until the Crown takes the city', () => {
  it('nets, the hutia and the debate after the pier; the oil after Thorne; the medicine after Anaco', () => {
    const ids = (f: FlagStore) => mysteryQuests(SIDE_QUESTS, f).map((q) => q.id);
    expect(ids(new FlagStore({}))).not.toContain('nets');
    const pier = new FlagStore({ 'encounter.xaragua_story.pier.won': true });
    expect(ids(pier)).toEqual(expect.arrayContaining(['nets', 'hutia', 'springs']));
    expect(ids(pier)).not.toContain('oil');
    expect(ids(pier)).not.toContain('medicine');
    const all = day();
    expect(ids(all)).toEqual(expect.arrayContaining([...CHAPTER2_QUESTS]));
    for (const id of CHAPTER2_QUESTS) {
      expect(sideNudges(SIDE_QUESTS, all), id).toContain(quest(id).nudge);
      expect(quest(id).nudge!.length, id).toBeLessThanOrEqual(128);
      const goal = mysteryGoals(SIDE_QUESTS, all).find((m) => m.id === id)!.goal;
      expect(waypoint(maps, 'xaragua-village', goal, all), id).not.toBeNull();
    }
  });

  // Review D4, and review 1 (Oct 21) finding 5: closed, not just hidden.
  it('every one closes at the attack: not offered any more, and one left half done shows as closed, with what became of it', () => {
    const half: FlagSnapshot = { 'side.nets.accepted': true, 'side.hutia.accepted': true, 'side.oil.accepted': true, 'side.medicine.accepted': true, 'debate.xaragua_springs.listened': true };
    const before = day(half);
    for (const id of CHAPTER2_QUESTS) expect(sideQuestStatus(before, quest(id)), id).toBe('active');
    expect(closedNotes(SIDE_QUESTS, before)).toEqual([]);
    const after = day({ ...half, 'story.crown_attack': true });
    for (const id of CHAPTER2_QUESTS) {
      expect(sideQuestStatus(after, quest(id)), id).toBe('closed');
      expect(quest(id).closedText, id).toMatch(/^Closed: /);
      expect(mysteryQuests(SIDE_QUESTS, after).map((q) => q.id), id).not.toContain(id);
      expect(sideGoals(SIDE_QUESTS, after).map((g) => g.id), id).not.toContain(id);
    }
    // The Journal says what became of each.
    expect(closedNotes(SIDE_QUESTS, after).map((n) => n.id)).toEqual([...CHAPTER2_QUESTS]);
    expect(closedNotes(SIDE_QUESTS, after).find((n) => n.id === 'springs')?.text).toBe('Closed: the fire is out. The pilgrim is gone.');
    // Never accepted: it simply is not offered any more (never closed, never a mystery).
    const untouched = day({ 'story.crown_attack': true });
    for (const id of CHAPTER2_QUESTS) expect(sideQuestStatus(untouched, quest(id)), id).toBe('unknown');
    expect(mysteryQuests(SIDE_QUESTS, untouched).filter((q) => (CHAPTER2_QUESTS as readonly string[]).includes(q.id))).toEqual([]);
    expect(closedNotes(SIDE_QUESTS, untouched)).toEqual([]);
  });

  it('a quest finished before the attack stays done after it', () => {
    const f = day({ ...ALL_DONE, 'story.crown_attack': true });
    for (const id of CHAPTER2_QUESTS) expect(sideQuestStatus(f, quest(id)), id).toBe('done');
  });
});

describe('Cut Nets (no fight)', () => {
  it('the fisher asks; three nets in any order; he and Yari mend them; the reward is paid once', () => {
    const f = day();
    expect(talk(f, 'canoe_fisher_talk', ["I'll bring them"]).join(' ')).toContain('Three nets were drying');
    expect(sideQuestStatus(f, quest('nets'))).toBe('active');
    talk(f, 'cut_net_salt');
    talk(f, 'cut_net_village');
    expect(talk(f, 'canoe_fisher_talk').join(' ')).toContain('by the drawn-up canoes');
    expect(talk(f, 'cut_net_beach').join(' ')).toContain('That is all three');
    talk(f, 'canoe_fisher_talk');
    expect(f.isSet('side.nets.done')).toBe(true);
    const gold0 = gold(f, RPG);
    expect(settleRewards(f, RPG, SIDE_QUESTS).map((q) => q.id)).toEqual(['nets']);
    expect(gold(f, RPG)).toBe(gold0 + 70);
    expect(itemCount(f, 'net_float_charm')).toBe(1);
    expect(f.get(pillarFlag('influence', 'xaragua'))).toBe(1);
    expect(settleRewards(f, RPG, SIDE_QUESTS)).toEqual([]);
    expect(f.isSet(rewardFlag(quest('nets')))).toBe(true);
  });

  it('a net only rolls up once the fisher has asked; the nets are gone from the sand once taken', () => {
    const f = day();
    talk(f, 'cut_net_village');
    expect(f.isSet('side.nets.village')).toBe(false);
    const net = () => maps['xaragua-village']!.objects.find((o) => o.id === 'net_village')!;
    expect(evaluate(net().if!, f)).toBe(true);
    f.set('side.nets.village', true);
    expect(evaluate(net().if!, f)).toBe(false);
  });
});

describe("The Hutia's Hoard (growth puzzle M-XAR-1)", () => {
  it('the girl asks; the trail leads to the ceiba; staked in the memory, it grows a fork to climb; the bead goes home', () => {
    const f = day();
    talk(f, 'conuco_kid_talk', ["We'll find"]);
    expect(talk(f, 'old_ceiba').join(' ')).toContain('far out of reach');
    expect(f.isSet('side.hutia.tree')).toBe(true);
    expect(f.isSet('side.hutia.hoard')).toBe(false);
    // Without the stake the hollow stays out of reach, and Anissa hints.
    expect(talk(f, 'old_ceiba').join(' ')).toContain('Small trees grow the way they are held');
    talk(f, 'ceiba_sapling', ['Stake it']);
    expect(f.isSet('anchor.hutia_stake')).toBe(true);
    talk(f, 'old_ceiba');
    expect(f.isSet('side.hutia.hoard')).toBe(true);
    expect(f.isSet('item.hutia_bead')).toBe(true);
    talk(f, 'conuco_kid_talk');
    expect(f.isSet('side.hutia.done')).toBe(true);
    expect(f.get('item.hutia_bead')).toBe(0);
    settleRewards(f, RPG, SIDE_QUESTS);
    expect(itemCount(f, 'brass_button_charm')).toBe(1);
    expect(JOURNAL_NOTES.find((n) => n.when === 'anchor.hutia_stake')).toBeDefined();
  });

  it('the shimmer at the roots opens only once the hollow has been seen', () => {
    const zone = maps['xaragua-conuco']!.echoZones.find((z) => z.id === 'ceiba_roots')!;
    expect(evaluate(zone.if!, day({ 'side.hutia.accepted': true }))).toBe(false);
    expect(evaluate(zone.if!, day({ 'side.hutia.accepted': true, 'side.hutia.tree': true }))).toBe(true);
  });
});

describe('Oil From a Stranger', () => {
  it('offered in the refusal at the lamp; the jars go to the camp; the leader shows the post; the thumbprint note', () => {
    const f = day();
    expect(talk(f, 'lamp_oil_seller_talk', ["I'll carry"]).join(' ')).toContain('let him watch us do ordinary things all day.');
    expect(f.isSet('story.lamp_asked')).toBe(true);
    expect(f.isSet('item.oil_lamp')).toBe(false);
    expect(f.isSet('item.oil_jars')).toBe(true);
    talk(f, 'camp_leader_talk');
    expect(f.isSet('side.oil.delivered')).toBe(true);
    expect(f.get('item.oil_jars')).toBe(0);
    expect(talk(f, 'ash_thumbprint').join(' ')).toContain('grey thumbprint');
    expect(f.isSet('side.oil.done')).toBe(true);
    expect(JOURNAL_NOTES.find((n) => n.when === 'side.oil.done')?.id).toBe('ash_thumbprint');
  });

  it('ends at the camp (review D2): its last stop is the post, not the seller', () => {
    const steps = quest('oil').steps;
    expect(steps.at(-1)!.goals![0]!.map).toBe('xaragua-camp');
  });
});

describe('Medicine for the Cacique (growth puzzle M-XAR-2)', () => {
  it("offered at Anaco's bedside, in the conversation where the story meets him", () => {
    const f = new FlagStore({ 'item.sun_locket': true, 'encounter.xaragua_story.pier.won': true });
    const lines = talk(f, 'anaco_talk', ["I'll look"]).join(' ');
    expect(lines).toContain('A word, before you go to the council');
    expect(f.isSet('story.anaco_met')).toBe(true);
    expect(f.isSet('side.medicine.accepted')).toBe(true);
  });

  it('declined there, the healer offers again in the caney', () => {
    const f = new FlagStore({ 'item.sun_locket': true, 'encounter.xaragua_story.pier.won': true });
    talk(f, 'anaco_talk', ['Not now']);
    expect(f.isSet('side.medicine.accepted')).toBe(false);
    talk(f, 'behique_talk', ["I'll look"]);
    expect(f.isSet('side.medicine.accepted')).toBe(true);
  });

  it('stumps; planted on the flat the road crews cut it again; behind the rocks it grows; the bark cures Anaco', () => {
    const f = day({ 'side.medicine.accepted': true });
    talk(f, 'old_stumps');
    expect(f.isSet('side.medicine.stumps')).toBe(true);
    // The memory: the healer gives seed; the flat is the wrong place.
    f.set('echo.camp_memory', true);
    expect(talk(f, 'grove_spot_rocks').join(' ')).not.toContain('press the seed');
    talk(f, 'echo_scout_healer_talk');
    expect(f.isSet('echo.grove_seeds')).toBe(true);
    talk(f, 'grove_spot_flat', ['Plant']);
    expect(f.isSet('anchor.grove_flat')).toBe(true);
    expect(talk(f, 'old_stumps').join(' ')).toContain('cut for the road all the same');
    talk(f, 'grove_spot_rocks', ['Plant']);
    expect(f.isSet('anchor.healer_grove')).toBe(true);
    const grove = maps['xaragua-camp']!.objects.find((o) => o.id === 'young_grove')!;
    expect(evaluate(grove.if!, f)).toBe(true);
    talk(f, 'young_grove');
    expect(f.isSet('side.medicine.bark')).toBe(true);
    expect(talk(f, 'behique_talk').join(' ')).toContain('Tell the elders I will stand when they sit.');
    expect(f.isSet('side.medicine.done')).toBe(true);
    expect(f.get('item.grove_bark')).toBe(0);
    settleRewards(f, RPG, SIDE_QUESTS);
    expect(f.get(pillarFlag('influence', 'xaragua'))).toBe(2);
  });

  it('in the occupied city, the cave healer knows the grove bark went with the caney', () => {
    const f = new FlagStore({ 'side.medicine.done': true });
    expect(talk(f, 'refugee_healer_talk').join(' ')).toContain('The grove bark went with the caney');
  });
});

describe('the gate: the lamp at dusk', () => {
  it('the seller says what is still left until every quest is done, then lends the lamp as the night canoe comes in', () => {
    const f = day({ 'story.lamp_asked': true, 'side.oil.accepted': true });
    const wait = talk(f, 'lamp_oil_seller_talk').join(' ');
    expect(wait).toContain('Dusk, envoy. The glass is still on you.');
    expect(wait).toContain('cut nets');
    expect(wait).toContain('pilgrim');
    expect(f.isSet('item.oil_lamp')).toBe(false);
    for (const [k, v] of Object.entries(ALL_DONE)) f.set(k, v);
    expect(evaluate(CHAPTER2_QUESTS_DONE, f)).toBe(true);
    const dusk = talk(f, 'lamp_oil_seller_talk').join(' ');
    expect(dusk).toContain('the glass has gone in');
    expect(dusk).toContain('night canoe');
    expect(f.isSet('item.oil_lamp')).toBe(true);
  });

  it('the Journal: the request, then dusk (through the side quests), then the lamp', () => {
    const f = day();
    expect(currentObjective(ACT2, f)?.id).toBe('lamp_ask');
    f.set('story.lamp_asked', true);
    expect(currentObjective(ACT2, f)?.id).toBe('dusk');
    for (const [k, v] of Object.entries(ALL_DONE)) f.set(k, v);
    expect(currentObjective(ACT2, f)?.id).toBe('lamp');
    f.set('item.oil_lamp', true);
    expect(currentObjective(ACT2, f)?.id).toBe('cave');
  });

  it('dusk is shown: the free city takes on the evening once the quests are done, until the attack', () => {
    const dusk = MAP_MOODS.find((m) => evaluate(m.if, day(ALL_DONE)) && m.maps.includes('xaragua-village'));
    expect(dusk).toBeDefined();
    expect(evaluate(dusk!.if, day())).toBe(false);
    expect(evaluate(dusk!.if, day({ ...ALL_DONE, 'story.crown_attack': true }))).toBe(false);
  });

  it('the cave mouth remembers the promise', () => {
    const f = day({ 'story.lamp_asked': true });
    expect(talk(f, 'petroglyph_cave_mouth').join(' ')).toContain('She said dusk.');
  });
});

describe('the arrow during the gate', () => {
  it('goes to a stop on the map the player is on before one elsewhere', () => {
    const f = day({ 'story.lamp_asked': true, 'side.oil.accepted': true, 'side.medicine.accepted': true });
    // Oil and Medicine are accepted (up the mountain), but on the village the fisher is right here.
    expect(storyGoal(ACT2, f, SIDE_QUESTS, 'xaragua-village')).toEqual(quest('nets').start![0]);
    expect(storyGoal(ACT2, f, SIDE_QUESTS, 'xaragua-conuco')).toEqual(quest('hutia').start![0]);
  });

  it('one climb (review D2): at the hill camp it does both mountain quests before leading down', () => {
    const f = day({ ...ALL_DONE, 'story.lamp_asked': true, 'side.oil.accepted': true, 'side.medicine.accepted': true });
    f.set('side.oil.done', false);
    f.set('side.medicine.done', false);
    const camp = () => storyGoal(ACT2, f, SIDE_QUESTS, 'xaragua-camp')!;
    expect(camp().map).toBe('xaragua-camp');
    f.set('side.oil.delivered', true);
    f.set('side.oil.done', true);
    expect(camp().map).toBe('xaragua-camp');
    f.set('side.medicine.stumps', true);
    f.set('anchor.healer_grove', true);
    expect(camp().map).toBe('xaragua-camp');
    f.set('side.medicine.bark', true);
    expect(camp().map).toBe('xaragua-caney');
  });
});

describe('old saves', () => {
  it('a save with the lamp already lent (before this build) has passed the gate; the seller still offers the jars', () => {
    const f = day({ 'item.oil_lamp': true });
    expect(currentObjective(ACT2, f)?.id).toBe('cave');
    talk(f, 'lamp_oil_seller_talk', ["I'll carry"]);
    expect(f.isSet('side.oil.accepted')).toBe(true);
  });

  it('a save just past Thorne gets the request and the gate', () => {
    expect(currentObjective(ACT2, day())?.id).toBe('lamp_ask');
  });

  it('a save already past the attack shows none of the five, and no dots', () => {
    const f = day({ 'item.oil_lamp': true, 'story.proof_shown': true, 'story.crown_attack': true });
    const ch2 = mysteryQuests(SIDE_QUESTS, f).map((q) => q.id).filter((id) => (CHAPTER2_QUESTS as readonly string[]).includes(id));
    expect(ch2).toEqual([]);
    expect(sideGoals(SIDE_QUESTS, f)).toEqual([]);
    expect(currentObjective(ACT2, f)?.id).not.toBe('dusk');
  });

  it('the story XP the request and the gate pay is nothing: the shared XP of the party is the same', () => {
    const f = day();
    const xp0 = sharedXp(f, RPG);
    f.set('story.lamp_asked', true);
    expect(sharedXp(f, RPG)).toBe(xp0);
  });
});

describe('every quest closes with the free city (data)', () => {
  it('each one closes at the attack (its `closed` condition reads it), with a line for the Journal', () => {
    for (const id of CHAPTER2_QUESTS) {
      const q = quest(id);
      expect(JSON.stringify(q.closed), id).toContain('story.crown_attack');
      expect(q.closedText, id).toBeTruthy();
    }
  });
});
