// Chapter 9, The Regent's Keep (Kingsmere, Aldermoor; docs/quest/reviews/2026-10-22-chapter9-outline.md with its second
// review's fixes): the chapter starts (?chapter=9 and 10), the owner's rules as content checks (Salkhi, Anissa, Vikram's
// breath, Jordyn's and Sebastian's lines against the locked rule, the Crown never joined to the girl who glows, the
// Journal's almoner disowned), the day until the eve (a condition), the archive's cabinets (the year mirrored, the house
// the lie is about), the courtroom (the clerk's tree; a Game Over never walks the party out mid-trial), Edmund leading in
// his chapter, the Hushed against two bots, the side quests closing, the price and its floor.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MAP_MOODS } from '../src/assets.config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, battleReserve } from '../src/data/battles.ts';
import { HONEST_DRAWER, PACT_DRAWER, cabinetOf } from '../src/data/aldermoor.ts';
import { CONTENT } from '../src/data/content.ts';
import { ALDERMOOR_DIALOGUE } from '../src/data/dialogue/aldermoor.ts';
import { JOURNAL_NOTES } from '../src/data/quests.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { Battle, battleItems, battleParty, type Action, type BattleEvent } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { recordLoss } from '../src/engine/gameOver.ts';
import { localPillar, partyMembers } from '../src/engine/rpg.ts';
import { closedNotes, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { type Sim, findPath, parseRoute } from '../src/engine/sim.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { skillsAction } from '../tools/battle-sim.ts';
import { loadMaps, newGameSim, puzzleFiles, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string; flags: FlagSnapshot }>;

/** The game as the route leaves it at a marker. */
function simAt(mark: string): Sim {
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) return sim;
    sim.run([item]);
  }
  throw new Error(`No mark @${mark}`);
}

type Line = { d: string; node: string; speaker: string; text: string };
const allLines: Line[] = ALDERMOOR_DIALOGUE.flatMap((d) =>
  Object.entries(d.nodes).flatMap(([node, n]) => n.lines.map((l) => ({ d: d.id, node, speaker: l.speaker ?? n.speaker ?? '', text: l.text }))),
);
const byScript = (id: string) => allLines.filter((l) => l.d === id);

describe('the chapter starts', () => {
  it('?chapter=9: the foot of the Mere Stair, Vikram with them, the ledger and three tokens in hand, Edmund not yet met', () => {
    const at9 = starts['9']!;
    expect([at9.map, at9.spawn]).toEqual(['aldermoor-heath', 'mere_stair']);
    const flags = new FlagStore(at9.flags);
    expect(flags.isSet('act8.complete') && flags.isSet('party.vikram')).toBe(true);
    expect(flags.isSet('party.edmund')).toBe(false);
    expect(flags.isSet('story.aldermoor_arrived')).toBe(false);
  });

  it('?chapter=10: Zetwal\'s harbour after the voyage home, Edmund with them, the pact and the record in hand', () => {
    const at10 = starts['10']!;
    expect([at10.map, at10.spawn]).toEqual(['zetwal-harbor', 'harbor_return']);
    const flags = new FlagStore(at10.flags);
    for (const f of ['act9.complete', 'card.act9_end', 'party.edmund', 'ally.aldermoor_dissidents', 'clue.crown_pact', 'anchor.thomas_record', 'item.crown_pact', 'item.thomas_record']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toContain('edmund');
  });
});

describe('the owner\'s rules as content checks', () => {
  it('Salkhi never speaks in a scene with Anissa\'s lines in it, and never about her', () => {
    for (const d of ALDERMOOR_DIALOGUE) {
      const ls = byScript(d.id);
      const salkhi = ls.filter((l) => l.speaker === 'salkhi');
      if (salkhi.length === 0) continue;
      expect(ls.some((l) => l.speaker === 'anissa'), d.id).toBe(false);
      for (const l of salkhi) expect(l.text, d.id).not.toMatch(/Anissa|small one|little one|the girl/i);
    }
  });

  it('Vikram\'s breathing is never in a node with Anissa\'s lines', () => {
    for (const d of ALDERMOOR_DIALOGUE) {
      for (const node of Object.keys(d.nodes)) {
        const ls = allLines.filter((l) => l.d === d.id && l.node === node);
        if (!ls.some((l) => l.speaker === 'anissa')) continue;
        for (const l of ls.filter((x) => x.speaker === 'vikram')) expect(l.text, `${d.id}/${node}`).not.toMatch(/\.\.\.|breath/i);
      }
    }
  });

  it('Jordyn and Sebastian keep to the locked rule: never anyone\'s goodness, the arrows or the thumbprints', () => {
    for (const who of ['jordyn', 'sebastian']) {
      const ls = allLines.filter((l) => l.speaker === who);
      expect(ls.length, who).toBeGreaterThan(8);
      for (const l of ls) expect(l.text, `${who} in ${l.d}`).not.toMatch(/\bgood\b|innocent|feeds|the arrows|thumbprint|Cenizal/i);
    }
    // The second review's fix: Sebastian's bill names the man, and Jordyn's line about her father is the law, not him.
    expect(allLines.map((l) => l.text).join(' ')).toMatch(/Grandpapa's name/);
  });

  it('nobody joins the Crown to the girl who glows; Anissa never jokes; the Journal has the Crown disown its almoner', () => {
    for (const l of allLines) if (/\b(Crown|Regent)\b/.test(l.text)) expect(l.text, l.d).not.toMatch(/glow|little one/i);
    const anissa = allLines.filter((l) => l.speaker === 'anissa');
    expect(anissa.length).toBeGreaterThan(8);
    for (const l of anissa) expect(l.text).not.toMatch(/ha!|\bjoke|funny|just saying/i);
    for (const n of JOURNAL_NOTES) if (/\bRegent\b|\bCrown\b/.test(n.text) && /almoner/i.test(n.text)) expect(n.text).toMatch(/disowns/);
    expect(JOURNAL_NOTES.some((n) => /almoner/i.test(n.text))).toBe(true);
  });

  it('the Almoner is the veiled woman by the mill: Anissa knows her, and her own line comes back to her', () => {
    const node = ALDERMOOR_DIALOGUE.find((d) => d.id === 'assize_clerk_talk')!.nodes.anissa!;
    const shown = (f: FlagSnapshot) => node.lines.filter((l) => !l.if || evaluate(l.if, new FlagStore(f))).map((l) => l.text);
    expect(shown({ 'story.watcher_met': true }).join(' ')).toMatch(/lady by the mill/);
    expect(shown({ 'story.watcher_met': true, 'choice.warned_watcher': true }).join(' ')).toMatch(/told me to stay away/);
    expect(shown({ 'story.watcher_met': true }).join(' ')).toMatch(/no one/);
    expect(shown({}).join(' ')).toMatch(/basket/);
    expect(allLines.map((l) => l.text)).toContain('You wanted a face. It is no one\'s. That is the point of us.');
  });

  it('nobody dies: the Hushed, her veils and the Sealbearers withdraw at 0 HP', () => {
    for (const id of ['the_hushed', 'court_husher', 'heath_husher', 'al_sealbearer', 'crown_officer', 'moor_constable']) expect(ENEMIES[id]!.withdraws, id).toBeDefined();
  });
});

describe('the day, the eve and the night', () => {
  it('the eve is a condition: the lamps come when the four of the day are done, and go when the recital begins', () => {
    const eve = MAP_MOODS.find((m) => m.maps.includes('aldermoor-cross') && JSON.stringify(m.if).includes('recital_begun'))!;
    const day = new FlagStore({ 'side.purge_list.done': true, 'debate.aldermoor_one_hand.settled': true, 'story.sebastian_met': true });
    expect(evaluate(eve.if, day)).toBe(false);
    day.set('story.jordyn_offer', true);
    expect(evaluate(eve.if, day)).toBe(true);
    day.set('story.recital_begun', true);
    expect(evaluate(eve.if, day)).toBe(false);
  });

  it('the postern opens with the Toccata, and Anissa holds the door in the memory (she is never left in the loft)', () => {
    const door = maps['aldermoor-keep']!.doors.find((d) => d.id === 'keep_postern')!;
    expect(evaluate(door.if, new FlagStore({ 'story.jordyn_offer': true }))).toBe(false);
    expect(evaluate(door.if, new FlagStore({ 'story.postern_open': true }))).toBe(true);
    expect(evaluate(door.if, new FlagStore({ 'story.postern_open': true, 'story.caught': true }))).toBe(false);
    expect(allLines.find((l) => l.speaker === 'anissa' && /I can hold the door/.test(l.text))).toBeDefined();
    expect(allLines.filter((l) => /loft/.test(l.text) && /Anissa/.test(l.text) && /stay|wait/i.test(l.text))).toEqual([]);
  });
});

describe('the archive (SIG-ALM part 1): the year mirrored, under the house the lie is about', () => {
  it('the pact is in the thirty-second year (23 mirrored), under the Brasador red; the honest year holds a slip', () => {
    expect(PACT_DRAWER.year).toBe(Number(String(HONEST_DRAWER.year).split('').reverse().join('')));
    expect(PACT_DRAWER.seal).toBe('red');
    expect(cabinetOf(PACT_DRAWER.year)).toBe(4);
    expect(cabinetOf(HONEST_DRAWER.year)).toBe(3);
    expect(allLines.map((l) => l.text).join(' ')).toMatch(/removed to the Lord Regent's keeping/);
  });

  it('the archive door will not let the party out without the pact, the record and the chronicle', () => {
    const notYet = maps['aldermoor-keep']!.triggers.find((t) => t.id === 'archive_not_yet')!;
    const caught = maps['aldermoor-keep']!.triggers.find((t) => t.id === 'caught')!;
    const night = { 'story.recital_begun': true, 'story.keep_archive_entered': true };
    expect(evaluate(notYet.if, new FlagStore({ ...night, 'clue.crown_pact': true, 'anchor.thomas_record': true }))).toBe(true);
    const all = new FlagStore({ ...night, 'clue.crown_pact': true, 'anchor.thomas_record': true, 'side.crown_chronicle.done': true });
    expect(evaluate(notYet.if, all)).toBe(false);
    expect(evaluate(caught.if, all)).toBe(true);
  });

  it('on the route: Patricio leaned on the panel, the shelf moved, the drawer found, then caught at the door', () => {
    const flags = simAt('aldermoor-assize').logic.state.flags;
    for (const f of ['clue.first_revisiting', 'anchor.thomas_record', 'clue.crown_pact', 'side.crown_chronicle.done', 'story.caught', 'evidence.crown_pact', 'evidence.thomas_record']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    expect([flags.get('archive.c4.year'), flags.get('archive.c4.seal')]).toEqual([1, 1]);
  });
});

describe('the Assize (SIG-ALM part 2)', () => {
  it('the clerk\'s tree: the record alone is a word against a word; the three together read it into the roll', () => {
    const { cheats } = puzzleFiles('aldermoor_assize');
    expect(Object.keys(cheats).some((c) => /without the court's roll/.test(c))).toBe(true);
    expect(Object.keys(cheats).some((c) => /steward pressed three times/.test(c))).toBe(true);
    expect(Object.keys(cheats).some((c) => /pact laid/.test(c))).toBe(true);
    expect(allLines.map((l) => l.text)).toContain('A margin against a public edition is a word against a word. The court needs the court.');
  });

  it('a Game Over at the Hushed leaves the party in the court by the dock, the watch on the door, and the dock\'s edge starts the fight again', () => {
    const s = simAt('aldermoor-assize');
    s.onBattle = (id) => {
      recordLoss(s.logic.state.flags, BATTLES[id]!);
      s.logic.riseFromFight();
      return [];
    };
    // The clerk's tree as the puzzle's solution plays it, up to the fight.
    for (const item of parseRoute(puzzleFiles('aldermoor_assize').solution)) {
      for (const cmd of s.expand(item)) if (!s.battles.includes('assize_hushed')) s.press(cmd);
    }
    const f = s.logic.state.flags;
    expect(s.battles.at(-1)).toBe('assize_hushed');
    expect(s.logic.mode).toBe('field');
    expect(f.isSet('story.record_read')).toBe(true);
    expect(f.isSet('story.hushed_beaten')).toBe(false);
    const p = s.logic.state.player;
    expect(p.mapId).toBe('aldermoor-keep');
    // The court is still sitting: no way out to the hall, and the watch on the door.
    expect(findPath(s.logic, { x: 20, y: 12 })).toBeNull();
    // The dock's edge (one row above the dock) starts it again, and a win plays the scene after.
    const again = maps['aldermoor-keep']!.triggers.find((t) => t.id === 'hushed_again')!;
    expect(evaluate(again.if, f)).toBe(true);
    expect(again.dialogue).toBe('hushed_again');
    expect(JSON.stringify(CONTENT.dialogue.hushed_again!.nodes)).toContain('assize_after');
  });
});

describe('Edmund joins at the press-gang on the Cross and leads in his chapter', () => {
  it('he fights second, after Gianna, until the chapter ends; then last', () => {
    const flags = simAt('aldermoor-assize').logic.state.flags;
    expect(battleParty(flags, RPG, SKILL_BOOK).map((p) => p.id)).toEqual(['gianna', 'edmund', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram']);
    const edmund = battleParty(flags, RPG, SKILL_BOOK).find((p) => p.id === 'edmund')!;
    expect(edmund.skills.map((s) => s.id)).toEqual(expect.arrayContaining(['shield_wall', 'tea_break']));
    expect(edmund.skills.find((s) => s.id === 'tea_break')?.healShare).toBe(0.15);
    flags.set('act9.complete', true);
    expect(battleParty(flags, RPG, SKILL_BOOK).map((p) => p.id).at(-1)).toBe('edmund');
  });
});

/** A fair player (tools/battle-sim.ts `skills`), or one who only presses Attack. */
function playHushed(seed: number, flags: FlagStore, plan: 'skills' | 'attack'): { won: boolean; events: BattleEvent[]; falls: number; turns: number } {
  const def = BATTLES.assize_hushed!;
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), plan === 'skills' ? battleItems(flags, RPG) : [], { seed, reserve: battleReserve(def) });
  const events: BattleEvent[] = [...b.start()];
  const party = new Set(b.party.map((c) => c.key));
  let turns = 0;
  for (; turns < 400 && !b.outcome; turns++) {
    const foe = b.enemies.find((e) => !e.down)!;
    const action: Action = plan === 'skills' ? skillsAction(b) : { kind: 'attack', target: foe.key };
    events.push(...b.act(action));
  }
  const falls = events.filter((e) => e.kind === 'down' && party.has(e.who)).length;
  return { won: b.outcome === 'won', events, falls, turns };
}

describe('the Hushed (the second review\'s 3.1)', () => {
  const flags = simAt('aldermoor-assize').logic.state.flags;
  const fair = Array.from({ length: 30 }, (_, i) => playHushed(i + 1, flags, 'skills'));
  const plain = Array.from({ length: 30 }, (_, i) => playHushed(i + 1, flags, 'attack'));

  it('a caster boss at HP x7 and MAG x1.25, her veils in front of her, light resisted, and the tip says so', () => {
    const h = ENEMIES.the_hushed!;
    expect([h.level, h.hpScale, h.magScale, h.boss]).toEqual([24, 7, 1.25, true]);
    expect(h.resist).toContain('light');
    expect(ENEMIES.court_husher!.protects).toBe('the_hushed');
    const tip = BATTLES.assize_hushed!.tips?.start ?? '';
    expect(tip).toMatch(/plain blows/i);
    // Gianna's light spells are resisted (and are skills, which Hush takes), so the tip never promises them; Anissa's
    // Light is no skill and still comes (the second review's 3.9 wording).
    expect(tip).not.toMatch(/your light/i);
    expect(tip).toMatch(/My light still comes/);
    expect(tip).toMatch(/Edmund/);
  });

  it('a player who uses the kit wins at the route\'s level, not without danger; Attack alone is slower and falls more', () => {
    expect(fair.filter((r) => r.won).length).toBe(30);
    expect(fair.some((r) => r.falls > 0)).toBe(true);
    expect(fair.reduce((n, r) => n + r.falls, 0) / 30).toBeLessThan(1.5);
    const avg = (rs: typeof fair, k: 'turns' | 'falls') => rs.reduce((n, r) => n + r[k], 0) / rs.length;
    expect(avg(plain, 'turns')).toBeGreaterThan(avg(fair, 'turns'));
    expect(avg(plain, 'falls')).toBeGreaterThan(avg(fair, 'falls'));
  });

  it('she hushes, she whispers at Anissa and Gianna steps in, the veil comes off, two more veils, she kneels', () => {
    const texts = fair.flatMap((r) => r.events).flatMap((e) => (e.kind === 'text' ? [e.text] : []));
    expect(texts).toContain('Enough noise. Now the little one.');
    expect(texts).toContain('You wanted a face. Here.');
    expect(texts).toContain('The veil comes off. Two more veils come down the gallery stair.');
    expect(texts.some((t) => t.includes('down on one knee'))).toBe(true);
  });
});

describe('the side quests (Al-2, Al-3) and the debate', () => {
  it('all three are done on the route', () => {
    const flags = simAt('aldermoor-assize').logic.state.flags;
    for (const id of ['purge_list', 'crown_chronicle', 'one_hand']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('done');
    for (const f of ['family.pie', 'family.tea', 'family.constable', 'story.families_warned', 'clue.list_leaked']) expect(flags.isSet(f), f).toBe(true);
  });

  it('they close if the story is somehow past them (a quest never dangles)', () => {
    const flags = new FlagStore({ 'side.purge_list.accepted': true, 'side.crown_chronicle.accepted': true, 'debate.aldermoor_one_hand.listened': true, 'story.recital_begun': true, 'story.caught': true });
    for (const id of ['purge_list', 'crown_chronicle', 'one_hand']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('closed');
    expect(closedNotes(SIDE_QUESTS, flags).map((n) => n.id)).toEqual(['purge_list', 'crown_chronicle', 'one_hand']);
  });
});

describe('the price and the dissidents', () => {
  // Al-3's Fear (3) comes with its reward (the field pays it): counted here as the route's settle does.
  const fear = (f: Record<string, boolean>) => localPillar(new FlagStore({ 'story.hushed_beaten': true, 'story.jordyn_defected': true, ...f }), RPG, 'fear', 'aldermoor') + 3;

  it('Fear is paid in choices and can be short: the floor is 5, the most 6 (the dissidents say "not yet")', () => {
    expect(fear({ 'choice.hushed_tried': true })).toBe(5);
    expect(fear({ 'choice.hushed_broken': true })).toBe(6);
    const lines = byScript('ald_price_scene').map((l) => l.text);
    expect(lines).toContain('Not afraid enough. Not yet. Your Muster can collect the rest.');
  });

  it('on the route: the alliance, seven of the watch, the evidence back in hand, home by the trader', () => {
    const sim = simAt('chapter9-end');
    const flags = sim.logic.state.flags;
    for (const f of ['ally.aldermoor_dissidents', 'story.jordyn_defected', 'story.edmund_defied', 'act9.complete', 'item.crown_pact', 'item.thomas_record', 'item.crown_chronicle']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    expect(flags.get('army.aldermoor')).toBe(7);
    sim.press('confirm');
    expect(sim.logic.state.player.mapId).toBe('zetwal-harbor');
  });
});
