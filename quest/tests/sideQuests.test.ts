// Pòdlimyè's Chapter 1 side quests (data/sideQuests.ts): each one played through its real dialogues,
// with the log's steps and the reward paid once. Plus the engine rules: parallel steps, and a book that
// joins its shelf only when its quest is done.

import { describe, expect, it } from 'vitest';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { CONTENT, validationContext } from '../src/data/content.ts';
import { shelfDialogueId } from '../src/data/books.ts';
import { DEBATES } from '../src/data/debates.ts';
import type { Condition } from '../src/engine/conditions.ts';
import { debateFlag } from '../src/engine/debate.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { gold, itemCount, pillarFlag, xp } from '../src/engine/rpg.ts';
import { questPlace, rewardFlag, settleRewards, sideQuestStatus, visibleSteps } from '../src/engine/sideQuests.ts';
import { activeNpcs } from '../src/engine/world.ts';
import { ACT1 } from '../src/data/quests.ts';
import type { FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { goalFor, mysteryGoals, sideGoals, sideNudges } from '../src/engine/guide.ts';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { Sim } from '../src/engine/sim.ts';
import { applySave, newGame, toSaveData } from '../src/engine/state.ts';
import { loadMaps, newGameSim } from '../tools/sim-setup.ts';

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

const quest = (id: string) => SIDE_QUESTS.find((q) => q.id === id)!;

/** Flags as after the festival speech, the Sun Locket and the first Echo (the city has opened). */
function chapterOne(): FlagStore {
  const flags = new FlagStore();
  flags.set('story.elodie_left', true);
  flags.set('item.sun_locket', true);
  flags.set('story.warroom_echo', true);
  return flags;
}

describe('side quests: Pòdlimyè, Chapter 1', () => {
  it('every step flag is set by some dialogue, and every giver stands on a map', () => {
    const setters = new Set(Object.values(validationContext().dialogueSets ?? {}).flat());
    // A debate sets its outcome flags itself (engine/debate.ts), not a static dialogue.
    for (const d of DEBATES) for (const o of ['listened', 'joined', 'settled', 'won', 'mediated', 'provoked'] as const) setters.add(debateFlag(d.id, o));
    const flagsOf = (c: Condition): string[] => ('flag' in c ? [c.flag] : 'any' in c ? c.any.flatMap(flagsOf) : []);
    for (const q of SIDE_QUESTS) {
      for (const s of q.steps) {
        const flags = flagsOf(s.done);
        expect(flags.length, `${q.id}: ${JSON.stringify(s.done)}`).toBeGreaterThan(0);
        for (const flag of flags) expect(setters.has(flag), `${q.id}: ${flag}`).toBe(true);
      }
    }
    const npcs = Object.values(loadMaps()).flatMap((m) => m.npcs.map((n) => n.npc));
    for (const giver of ['archivist', 'soup_vendor', 'cane_cutter', 'echo_cane_worker']) expect(npcs, giver).toContain(giver);
  });

  it('The Overdue Shelf: three books in any order, Grandmother asks one question, then the archivist pays', () => {
    const flags = chapterOne();
    const q = quest('overdue');
    talk(flags, 'archivist_talk', ['Not today']);
    expect(sideQuestStatus(flags, q)).toBe('unknown');
    talk(flags, 'archivist_talk', ["I'll get them back"]);
    expect(sideQuestStatus(flags, q)).toBe('active');
    expect(visibleSteps(flags, q)).toHaveLength(4); // parallel: every step at once

    // One conversation (Oct 19): her greeting, the book, then her own errand (declined here).
    talk(flags, 'soup_vendor_talk', ['It smells wonderful', 'Not right now']);
    expect(flags.isSet('side.overdue.soup')).toBe(true);
    talk(flags, 'ferryman_talk');
    expect(flags.isSet('side.overdue.ferry')).toBe(true);

    // Grandmother wants the temple record read first, then the right answer.
    talk(flags, 'anicette_talk', ['About your overdue book']);
    expect(flags.isSet('side.overdue.vol2')).toBe(false);
    flags.set('lore.zetwal_ash_wars_temple', true);
    talk(flags, 'anicette_talk', ['About your overdue book', 'Four hundred']);
    expect(flags.isSet('side.overdue.vol2')).toBe(false);
    // "Never mind" falls through to her story lines (the war room is done by now: side quests open after it).
    expect(talk(flags, 'anicette_talk', ['Never mind']).some((t) => t.includes('I can see it in your face'))).toBe(true);
    talk(flags, 'anicette_talk', ['About your overdue book', 'Forty']);
    expect(flags.isSet('side.overdue.vol2')).toBe(true);

    // Volume Two is not on the shelf until the books are returned.
    const shelf = (f: FlagStore) => talk(f, shelfDialogueId('archive_tales'), ['Leave']);
    expect(shelf(flags).join()).not.toContain('Volume Two');
    talk(flags, 'archivist_talk');
    expect(sideQuestStatus(flags, q)).toBe('done');

    const before = gold(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((p) => p.id)).toEqual(['overdue']);
    expect(gold(flags, RPG)).toBe(before + 60);
    expect(xp(flags, RPG, 'gianna')).toBeGreaterThanOrEqual(50);
    expect(flags.get(pillarFlag('influence', 'zetwal'))).toBe(1);
    expect(settleRewards(flags, RPG, SIDE_QUESTS)).toEqual([]);
    expect(flags.isSet(rewardFlag(q))).toBe(true);
  });

  it('Volume Two joins the Tales shelf once the quest is done', () => {
    const flags = new FlagStore();
    const list = () => {
      const run = new DialogueRunner(CONTENT.dialogue[shelfDialogueId('archive_tales')]!, CONTENT.speakers, flags);
      const v = run.view();
      return v.kind === 'choice' ? v.choices.map((c) => c.text) : [];
    };
    expect(list()).not.toContain('Ash Wars Gossip, Volume Two');
    flags.set('side.overdue.done', true);
    expect(list()).toContain('Ash Wars Gossip, Volume Two');
  });

  it('side quests are not offered until the first Echo (owner decision, Oct 16)', () => {
    const flags = chapterOne();
    flags.set('story.warroom_echo', false);
    const lines = talk(flags, 'soup_vendor_talk', ['Save me a bowl']);
    expect(lines.join(' ')).toContain('Come back when the stall is open');
    expect(lines.join(' ')).not.toContain('My nephew');
    expect(flags.isSet('side.soup.accepted')).toBe(false);
  });

  it('Soup for the Cousins: three bowls, then three soups, 30 gold and Influence', () => {
    const flags = chapterOne();
    const q = quest('soup');
    // Her greeting flows straight into the errand (Oct 19: no second talk needed).
    talk(flags, 'soup_vendor_talk', ['Save me a bowl', "I'll carry them"]);
    expect(sideQuestStatus(flags, q)).toBe('active');
    talk(flags, 'town_guard_talk');
    talk(flags, 'elder_talk');
    // Still one bowl to go: the vendor reminds, and names only the ferryman.
    const remind = talk(flags, 'soup_vendor_talk');
    expect(remind.some((t) => t.includes('ferryman'))).toBe(true);
    expect(remind.some((t) => t.includes('neighbor'))).toBe(false);
    talk(flags, 'ferryman_talk');
    // The second time each one talks normally again.
    expect(talk(flags, 'elder_talk').some((t) => t.includes('argued with the whole council'))).toBe(true);
    // "Save me a bowl", remembered: she keeps her promise when the soup is delivered.
    expect(talk(flags, 'soup_vendor_talk').join(' ')).toContain("cousin's bowl, off the shelf, as promised");
    expect(sideQuestStatus(flags, q)).toBe('done');
    const soups = itemCount(flags, 'soup_pot');
    const before = gold(flags, RPG);
    settleRewards(flags, RPG, SIDE_QUESTS);
    expect(itemCount(flags, 'soup_pot')).toBe(soups + 3);
    expect(gold(flags, RPG)).toBe(before + 30);
  });

  it('A Name in the Cane: the stones, the Echo on the road, the list, then the charm', () => {
    const flags = chapterOne();
    const q = quest('cane_name');
    talk(flags, 'cane_cutter_talk', ['You seem far away', "I'll look for her name"]);
    expect(visibleSteps(flags, q).map((s) => s.done)).toEqual([false]); // one step at a time
    talk(flags, 'name_stones');
    expect(flags.isSet('side.cane_name.stones')).toBe(true);

    // The road's Echo zone opens only now (it needs the Locket and the stones).
    const road = loadMaps()['zetwal-road']!;
    const zone = road.echoZones.find((z) => z.id === 'cane_roses');
    expect(zone?.if).toEqual({ all: [{ flag: 'item.sun_locket' }, { flag: 'side.cane_name.stones' }] });
    expect(talk(flags, 'echo_cane_worker_talk').join(' ')).toContain('Rose-Aimée');
    expect(flags.isSet('clue.cane_name')).toBe(true);

    talk(flags, 'solange_list');
    expect(flags.isSet('side.cane_name.recorded')).toBe(true);
    talk(flags, 'cane_cutter_talk');
    expect(sideQuestStatus(flags, q)).toBe('done');
    settleRewards(flags, RPG, SIDE_QUESTS);
    expect(itemCount(flags, 'sun_charm')).toBe(1);
    expect(talk(flags, 'cane_cutter_talk').join(' ')).toContain('still sounds new');
  });

  // Decision A (Oct 19): the cutter is on the Cane Road before the lamp, at the name stones on the island after
  // it, and back on the road when Gianna comes home; the quest's arrows, place and nudge follow him.
  describe("the cane cutter's schedule", () => {
    const maps = loadMaps();
    const where = (flags: FlagStore) =>
      ['zetwal-road', 'zetwal-temple'].filter((m) => activeNpcs(maps[m]!, 'present', flags).some((n) => n.npc === 'cane_cutter'));
    const q = quest('cane_name');

    it('stands in one place at a time: the road, then the stones, then the road again', () => {
      const flags = chapterOne();
      expect(where(flags)).toEqual(['zetwal-road']);
      flags.set('story.anissa_woke', true);
      expect(where(flags)).toEqual(['zetwal-temple']);
      flags.set('story.zetwal_return', true);
      expect(where(flags)).toEqual(['zetwal-road']);
    });

    it('the quest points where he is: its start, the last step, the log and Anissa\'s nudge', () => {
      const flags = chapterOne();
      expect(mysteryGoals([q], flags)[0]?.goal.map).toBe('zetwal-road');
      expect(questPlace(q, flags)).toBe('The Cane Road');
      flags.set('story.anissa_woke', true);
      expect(mysteryGoals([q], flags)[0]?.goal).toMatchObject({ map: 'zetwal-temple', at: { x: 8, y: 4 } });
      expect(questPlace(q, flags)).toBe('The Temple island');
      expect(sideNudges([q], flags)[0]).toContain('name stones');
      for (const f of ['side.cane_name.accepted', 'side.cane_name.stones', 'clue.cane_name', 'side.cane_name.recorded']) flags.set(f, true);
      expect(sideGoals([q], flags)[0]?.goal.map).toBe('zetwal-temple');
      flags.set('story.zetwal_return', true);
      expect(sideGoals([q], flags)[0]?.goal.map).toBe('zetwal-road');
    });

    it('at the stones after the reading: he asks, and they read the stones together (step 1 on the spot)', () => {
      const flags = chapterOne();
      flags.set('story.bridge_crossed', true);
      flags.set('story.anissa_woke', true);
      const lines = talk(flags, 'cane_cutter_talk', ['Who were you listening for', "I'll look for her name"]).join(' ');
      expect(lines).toContain('I listened for one name');
      expect(lines).toContain('a veiled woman by the old mill'); // the pointer to the Quiet Crown's watcher stays
      expect(lines).not.toContain('names are read tonight');
      expect(flags.isSet('side.cane_name.stones')).toBe(true);
      expect(lines).toContain('the cutters of the Cane Road');
    });

    it('accepted on the road before the lamp, stones not read: at the stones he reads them with her', () => {
      const flags = chapterOne();
      talk(flags, 'cane_cutter_talk', ['You seem far away', "I'll look for her name"]);
      expect(flags.isSet('side.cane_name.stones')).toBe(false);
      flags.set('story.anissa_woke', true);
      talk(flags, 'cane_cutter_talk');
      expect(flags.isSet('side.cane_name.stones')).toBe(true);
    });

    it('told at the stones: he says her name to the lamp; on the road, he says it tonight', () => {
      const done = (atStones: boolean) => {
        const flags = chapterOne();
        for (const f of ['side.cane_name.accepted', 'side.cane_name.stones', 'clue.cane_name', 'side.cane_name.recorded']) flags.set(f, true);
        if (atStones) flags.set('story.anissa_woke', true);
        return talk(flags, 'cane_cutter_talk').join(' ');
      };
      expect(done(true)).toContain('The reading is over, but the lamp is still lit');
      expect(done(true)).toContain('says her name to it');
      expect(done(false)).toContain('Tonight I will say it so loud');
      expect(done(false)).not.toContain('says her name to it');
    });
  });

  it('no quest step starts a fight: Chapter 1 quests never need story.zetwal_return', () => {
    // (The cane cutter's placement reads it only to say where he is: on the road again once Gianna is home.)
    for (const q of SIDE_QUESTS) expect(JSON.stringify(q).replaceAll('{"notFlag":"story.zetwal_return"}', ''), q.id).not.toContain('zetwal_return');
  });
});

describe("Yari's request (owner, Oct 15): Gianna asks for time to finish her work first", () => {
  it('says "soon", Yari joins and waits at the dock, and the chapter ends only when Gianna says go', () => {
    const flags = new FlagStore({ 'party.anissa': true });
    const lines = talk(flags, 'yari_talk', ["Of course I'll come."]);
    expect(lines.some((l) => l.startsWith('Soon, Yari.'))).toBe(true);
    expect(flags.isSet('story.yari_asked')).toBe(true);
    expect(flags.isSet('act1.complete')).toBe(false);
    // No envoy papers yet (the Hall of the Accord): Yari will not sail.
    expect(talk(flags, 'yari_talk')[0]).toContain('No papers, no landing');
    expect(flags.isSet('act1.complete')).toBe(false);
    flags.set('story.envoy_papers', true);
    // The boar still loose (owner decision, Oct 16): Yari sends her to the Cane Road first.
    const boar = talk(flags, 'yari_talk').join(' ');
    expect(boar).toContain('boar still loose on the Cane Road');
    expect(boar).toContain('east gate');
    expect(flags.isSet('act1.complete')).toBe(false);
    flags.set('encounter.wilds.boar.won', true);
    // Errands left (owner, Oct 18): Yari will not sail until all three Pòdlimyè quests are done.
    const waiting = talk(flags, 'yari_talk').join(' ');
    expect(waiting).toContain('Not with work still waiting in Pòdlimyè');
    expect(flags.isSet('act1.complete')).toBe(false);
    for (const done of ['side.overdue.done', 'side.soup.done', 'side.cane_name.done']) {
      flags.set(done, true);
      expect(talk(flags, 'yari_talk').join(' ')).toContain('Not with work still waiting in Pòdlimyè');
      expect(flags.isSet('act1.complete')).toBe(false);
    }
    // The plaza's debate too (a lost one counts, mediating counts).
    flags.set('debate.zetwal_corner.joined', true);
    talk(flags, 'yari_talk', ["Let's go."]);
    expect(flags.isSet('act1.complete')).toBe(true);
  });

  it('with every errand done and the boar beaten, Yari says so', () => {
    const flags = new FlagStore({
      'story.yari_asked': true,
      'story.envoy_papers': true,
      'side.overdue.done': true,
      'side.soup.done': true,
      'side.cane_name.done': true,
      'debate.zetwal_corner.joined': true,
      'encounter.wilds.boar.won': true,
    });
    expect(talk(flags, 'yari_talk', ["Let's go."])[0]).toContain('the boar sorry it met us');
    expect(flags.isSet('act1.complete')).toBe(true);
  });
});

describe("The Envoy's Papers (owner, Oct 15): the task at the Hall of the Accord, in one visit (Batch D, Oct 19)", () => {
  const AFTER_LAMP = { 'party.anissa': true, 'story.anissa_woke': true, 'story.yari_asked': true };

  it('the clerk explains, the engraver walks the seal in, the clerk writes and seals the papers, the Chancellor signs', () => {
    const flags = new FlagStore(AFTER_LAMP);
    expect(talk(flags, 'engraver_talk').join(' ')).not.toContain('Finished it this morning');
    const hall = talk(flags, 'hall_clerk_talk').join(' ');
    // He comes because the lamps lit (review, Oct 19: a reason to walk in now), and hands the seal to the clerk.
    expect(hall).toContain('every lamp in the city lit at once');
    expect(hall).toContain('Here, clerk.');
    expect(itemCount(flags, 'elodie_seal')).toBe(0);
    expect(itemCount(flags, 'draft_papers')).toBe(1);
    expect(flags.isSet('story.papers_sealed')).toBe(true);
    expect(flags.isSet('story.papers_asked')).toBe(false);
    expect(flags.isSet('story.envoy_papers')).toBe(false);
    // The Chancellor signs last, in front of the Crown's consul.
    talk(flags, 'chancellor_talk', ['Say nothing']);
    expect(itemCount(flags, 'draft_papers')).toBe(0);
    expect(itemCount(flags, 'envoy_papers')).toBe(1);
    expect(flags.isSet('story.envoy_papers')).toBe(true);
    // Back in the Iron Market, the engraver says he delivered it himself.
    expect(talk(flags, 'engraver_talk').join(' ')).toContain('Delivered it myself');
  });

  it('the papers objective never sends anyone to the Iron Market', () => {
    const papers = ACT1.objectives.find((o) => o.id === 'papers')!;
    expect(papers.goals!.every((g) => g.map === 'zetwal-hall')).toBe(true);
    expect(papers.hints.join(' ')).not.toContain('Market');
  });

  it('before Yari asks, the clerk only talks about the Hall', () => {
    const flags = new FlagStore({ 'party.anissa': true });
    talk(flags, 'hall_clerk_talk');
    expect(flags.isSet('story.papers_sealed')).toBe(false);
  });

  // Saves made mid-errand before Batch D (review risk 6): every state still finishes.
  describe('old saves in the middle of the errand', () => {
    it('sent to the Market for the seal: at the clerk, the engraver walks in with it', () => {
      const flags = new FlagStore({ ...AFTER_LAMP, 'story.papers_asked': true });
      const lines = talk(flags, 'hall_clerk_talk').join(' ');
      expect(lines).toContain('Back from the Iron Market already?');
      expect(lines).toContain('Here, clerk.');
      expect(flags.isSet('story.papers_sealed')).toBe(true);
      talk(flags, 'chancellor_talk', ["Zetwal's waters"]);
      expect(flags.isSet('story.envoy_papers')).toBe(true);
    });

    it('sent to the Market for the seal: the engraver there still hands it over, and the clerk takes it', () => {
      const flags = new FlagStore({ ...AFTER_LAMP, 'story.papers_asked': true });
      expect(talk(flags, 'engraver_talk').join(' ')).toContain('Finished it this morning');
      expect(itemCount(flags, 'elodie_seal')).toBe(1);
      expect(talk(flags, 'engraver_talk').join(' ')).toContain('to the Hall with it');
      talk(flags, 'hall_clerk_talk');
      expect(itemCount(flags, 'elodie_seal')).toBe(0);
      expect(itemCount(flags, 'draft_papers')).toBe(1);
    });

    it('holding the seal: the clerk takes it and writes the papers', () => {
      const flags = new FlagStore({ ...AFTER_LAMP, 'story.papers_asked': true, 'item.elodie_seal': 1 });
      expect(talk(flags, 'hall_clerk_talk')[0]).toBe('The seal. Re-cut.');
      expect(itemCount(flags, 'elodie_seal')).toBe(0);
      expect(flags.isSet('story.papers_sealed')).toBe(true);
    });

    it('papers sealed: the Chancellor signs them (and the consul walks in)', () => {
      const flags = new FlagStore({ ...AFTER_LAMP, 'story.papers_asked': true, 'item.elodie_seal': 0, 'item.draft_papers': 1, 'story.papers_sealed': true });
      expect(talk(flags, 'chancellor_talk', ['Say nothing']).join(' ')).toContain('protection of the southern waters');
      expect(itemCount(flags, 'envoy_papers')).toBe(1);
    });

    it('each state, loaded from a save code in the Hall, plays through to signed papers; the arrow stays in the Hall', () => {
      const states: Record<string, unknown>[] = [
        { 'story.papers_asked': true },
        { 'story.papers_asked': true, 'item.elodie_seal': 1 },
        { 'story.papers_asked': true, 'item.elodie_seal': 0, 'item.draft_papers': 1, 'story.papers_sealed': true },
      ];
      const papers = ACT1.objectives.find((o) => o.id === 'papers')!;
      for (const extra of states) {
        const sim = hallSave({ ...AFTER_LAMP, 'item.sun_locket': true, ...extra });
        const f = sim.logic.state.flags;
        // (The Journal may first ask for the island's work, new since then; the papers' own arrow is in the Hall.)
        expect(goalFor(papers.goals, f)?.map, JSON.stringify(extra)).toBe('zetwal-hall');
        if (!f.isSet('story.papers_sealed')) sim.run(['goto 21,26', 'up', 'confirm', 'skip']);
        expect(goalFor(papers.goals, f)?.at).toEqual({ x: 32, y: 5 });
        sim.run(['goto 32,6', 'up', 'confirm', 'skip']);
        expect(f.isSet('story.envoy_papers'), JSON.stringify(extra)).toBe(true);
        expect(itemCount(f, 'envoy_papers')).toBe(1);
      }
    });
  });
});

/** A save in the Hall's entrance with these flags, written to a save code and read back, as a player loads it. */
function hallSave(flags: Record<string, unknown>): Sim {
  const maps = loadMaps();
  const state = newGame(maps['zetwal-hall']!, 'hall');
  state.flags.load(flags as FlagSnapshot);
  const decoded = decodeSave(encodeSave(toSaveData(state, 0)));
  if (!decoded.ok) throw new Error(decoded.error);
  const fresh = newGame(maps['zetwal-hall']!, 'hall');
  applySave(fresh, decoded.data);
  const sim = new Sim(new GameLogic(maps, CONTENT, fresh));
  sim.onBattle = () => [];
  sim.logic.enterMap();
  return sim;
}

describe('a save that finished Chapter 1 before the ferry existed (owner report, Oct 17)', () => {
  it('Yari still offers to sail, and the ferry lands in Yucayeque', () => {
    const sim = newGameSim(loadMaps(), 'zetwal-temple', 'temple_start');
    const f = sim.logic.state.flags;
    for (const k of ['party.anissa', 'story.anissa_woke', 'story.yari_asked', 'story.envoy_papers', 'encounter.wilds.boar.won', 'act1.complete', 'card.act1_end']) f.set(k, true);
    if (sim.logic.mode === 'dialogue') sim.run(['skip']); // the temple's welcome
    sim.run(['goto 16,17', 'down', 'confirm', 'skip']); // Yari's canoe at the dock
    expect(sim.logic.state.player.mapId).toBe('xaragua-village');
    expect(f.isSet('story.xaragua_arrived')).toBe(true);
  });
});

