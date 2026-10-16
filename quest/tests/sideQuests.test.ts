// Pòdlimyè's Chapter 1 side quests (data/sideQuests.ts): each one played through its real dialogues,
// with the log's steps and the reward paid once. Plus the engine rules: parallel steps, and a book that
// joins its shelf only when its quest is done.

import { describe, expect, it } from 'vitest';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { CONTENT, validationContext } from '../src/data/content.ts';
import { shelfDialogueId } from '../src/data/books.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { gold, itemCount, pillarFlag, xp } from '../src/engine/rpg.ts';
import { rewardFlag, settleRewards, sideQuestStatus, visibleSteps } from '../src/engine/sideQuests.ts';
import { loadMaps } from '../tools/sim-setup.ts';

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
    for (const q of SIDE_QUESTS) {
      for (const s of q.steps) {
        const flag = (s.done as { flag: string }).flag;
        expect(setters.has(flag), `${q.id}: ${flag}`).toBe(true);
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

    talk(flags, 'soup_vendor_talk');
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
    expect(() => talk(flags, 'soup_vendor_talk', ['You look busy'])).toThrow(/no choice "You look busy"/);
  });

  it('Soup for the Cousins: three bowls, then three soups, 30 gold and Influence', () => {
    const flags = chapterOne();
    const q = quest('soup');
    talk(flags, 'soup_vendor_talk', ['You look busy', "I'll carry them"]);
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
    talk(flags, 'soup_vendor_talk');
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

  it('no quest step starts a fight: Chapter 1 quests never need story.zetwal_return', () => {
    for (const q of SIDE_QUESTS) expect(JSON.stringify(q)).not.toContain('zetwal_return');
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
    // Errands left: Yari reminds her; "Not yet" keeps the chapter open.
    expect(talk(flags, 'yari_talk', ['Not yet'])[0]).toContain('Did you finish what you had to do?');
    expect(flags.isSet('act1.complete')).toBe(false);
    talk(flags, 'yari_talk', ["Let's go anyway."]);
    expect(flags.isSet('act1.complete')).toBe(true);
  });

  it('with every errand done and the boar beaten, Yari says so', () => {
    const flags = new FlagStore({
      'story.yari_asked': true,
      'story.envoy_papers': true,
      'side.overdue.done': true,
      'side.soup.done': true,
      'side.cane_name.done': true,
      'encounter.wilds.boar.won': true,
    });
    expect(talk(flags, 'yari_talk', ["Let's go."])[0]).toContain('the boar sorry it met us');
    expect(flags.isSet('act1.complete')).toBe(true);
  });
});

describe("The Envoy's Papers (owner, Oct 15): the task at the Hall of the Accord", () => {
  it('the clerk needs the seal, the engraver has it, the clerk writes and seals the papers, the Chancellor signs', () => {
    const flags = new FlagStore({ 'party.anissa': true, 'story.yari_asked': true });
    expect(talk(flags, 'engraver_talk').join(' ')).not.toContain('Finished it this morning');
    talk(flags, 'hall_clerk_talk');
    expect(flags.isSet('story.papers_asked')).toBe(true);
    expect(talk(flags, 'engraver_talk').join(' ')).toContain('Finished it this morning');
    expect(itemCount(flags, 'elodie_seal')).toBe(1);
    talk(flags, 'hall_clerk_talk');
    expect(itemCount(flags, 'elodie_seal')).toBe(0);
    expect(itemCount(flags, 'draft_papers')).toBe(1);
    expect(flags.isSet('story.envoy_papers')).toBe(false);
    // The Chancellor signs last.
    talk(flags, 'chancellor_talk');
    expect(itemCount(flags, 'draft_papers')).toBe(0);
    expect(itemCount(flags, 'envoy_papers')).toBe(1);
    expect(flags.isSet('story.envoy_papers')).toBe(true);
    expect(talk(flags, 'engraver_talk').join(' ')).not.toContain('Finished it this morning');
  });

  it('before Yari asks, the clerk only talks about the Hall', () => {
    const flags = new FlagStore({ 'party.anissa': true });
    talk(flags, 'hall_clerk_talk');
    expect(flags.isSet('story.papers_asked')).toBe(false);
  });
});
