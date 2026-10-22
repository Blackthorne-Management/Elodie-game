// Chapter 10, The Muster (Pòdlimyè; docs/quest/reviews/2026-10-22-chapter10-outline.md with its second review's fixes):
// the chapter starts (?chapter=10 and 11, and what Chapter 11 is handed), the owner's rules as content checks (no comedy
// in a node with Anissa's lines, Rahel and Patricia against the locked rule, the family's facts, Free Brasador as Azzy's
// company, Anissa's two lines), every person of Pòdlimyè given a Chapter 10 line or kept off the map, the day, dusk,
// night and dawn as conditions that never overlap, the Speaker's gate, the night in all four houses both ways (and a
// reload at night), Z-6's crew against two bots at 23 to 25 in tier-24 gear, the Cane Road's return, and the side quests
// and the gifts closing.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ALLY_PRICES } from '../src/config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, battleDef, battleReserve } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { DEBATES } from '../src/data/debates.ts';
import { MUSTER_DIALOGUE, MUSTER_OVERLAYS } from '../src/data/dialogue/zetwalMuster.ts';
import { ENCOUNTERS } from '../src/data/encounters.ts';
import { DAWN, DAY, DUSK, MUSTER_HOUSES, NIGHT, SEATED_PARTS } from '../src/data/muster.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { allyShare } from '../src/engine/ally.ts';
import { Battle, battleParty, type Action } from '../src/engine/battle.ts';
import { evaluate, flagsIn } from '../src/engine/conditions.ts';
import { DialogueRunner, flagsReadBy, type DialogueScript } from '../src/engine/dialogue.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { sharedXp, xpForLevel } from '../src/engine/rpg.ts';
import { sideQuestStatus } from '../src/engine/sideQuests.ts';
import { type Sim, parseRoute } from '../src/engine/sim.ts';
import { activeNpcs } from '../src/engine/world.ts';
import { newGame } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { skillsAction } from '../tools/battle-sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string; flags: FlagSnapshot }>;

/** The game as the route leaves it at a marker (one run, cut at each marker asked for). */
function simAt(mark: string): Sim {
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) return sim;
    sim.run([item]);
  }
  throw new Error(`No mark @${mark}`);
}

const muster = new Map(MUSTER_DIALOGUE.map((d) => [d.id, d]));
const overlaid = new Set(MUSTER_OVERLAYS.map((o) => o.id));
/** Every Chapter 10 script: the chapter's own, the overlays (as the game runs them), and the three feuds' lines. */
const SCRIPTS: DialogueScript[] = [...MUSTER_DIALOGUE, ...[...overlaid].map((id) => CONTENT.dialogue[id]!)];
type Line = { d: string; node: string; speaker: string; text: string };
const lines: Line[] = SCRIPTS.flatMap((d) =>
  Object.entries(d.nodes)
    .filter(([node]) => muster.has(d.id) || node.startsWith('m_'))
    .flatMap(([node, n]) => n.lines.map((l) => ({ d: d.id, node, speaker: l.speaker ?? n.speaker ?? '', text: l.text }))),
);
const FEUDS = DEBATES.filter((d) => d.id.startsWith('zetwal_feud_'));
const feudLines: Line[] = FEUDS.flatMap((d) =>
  (['passing', 'listen', 'won', 'lost', 'mediate', 'provoke', 'after'] as const).flatMap((part) => d[part].map((l) => ({ d: d.id, node: part, speaker: l.speaker ?? '', text: l.text }))),
);
const all = [...lines, ...feudLines];

describe('the chapter starts, and what Chapter 11 is handed', () => {
  it('?chapter=10: the long pier, and the landing plays as the party arrives', () => {
    const at = starts['10']!;
    expect([at.map, at.spawn]).toEqual(['zetwal-harbor', 'harbor_return']);
    const state = newGame(maps[at.map]!, at.spawn);
    state.flags.load(at.flags);
    expect(state.flags.isSet('story.muster_begun')).toBe(false);
    const logic = new GameLogic(maps, CONTENT, state);
    logic.enterMap();
    expect(logic.dialogueId).toBe('muster_landing');
    expect(state.flags.isSet('story.muster_begun')).toBe(true);
  });

  it('?chapter=11: the Canoe Beach below Yucayeque, with the seven armies pledged, the buyer named and the night\'s outcome', () => {
    const at = starts['11']!;
    expect([at.map, at.spawn]).toEqual(['xaragua-beach', 'landing']);
    const flags = new FlagStore(at.flags);
    for (const f of ['act10.complete', 'card.act10_end', 'story.fleet_sailed', 'muster.resolved', 'story.betrayal_seen', 'item.marshal_whistle', 'item.smugglers_ledger', 'side.muskets.done', 'side.lonely_cutter.done', 'clue.four_accounts', 'story.blessing', 'story.patricio_told']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    for (const h of [...Object.keys(ALLY_PRICES), 'zetwal']) expect(typeof flags.get(`army.${h}`), h).toBe('number');
    const buyer = flags.get('muster.betrayer');
    expect(MUSTER_HOUSES.map((h) => h.house)).toContain(buyer);
    expect(flags.isSet(`muster.betrayer.${String(buyer)}`)).toBe(true);
    expect(flags.isSet('muster.betrayed') !== flags.isSet('muster.turned')).toBe(true);
    expect(flags.isSet('travel.next')).toBe(false);
  });
});

describe('the owner\'s rules as content checks', () => {
  const COMIC = new Set(['salkhi', 'samira', 'vikram', 'edmund']);

  it('no comic line shares a node with Anissa\'s, and Salkhi never speaks in a scene with her lines', () => {
    for (const d of new Set(all.map((l) => l.d))) {
      const ls = all.filter((l) => l.d === d);
      for (const node of new Set(ls.map((l) => l.node))) {
        const n = ls.filter((l) => l.node === node);
        if (!n.some((l) => l.speaker === 'anissa' || l.speaker === 'anissa_far')) continue;
        expect(n.filter((l) => COMIC.has(l.speaker)).map((l) => l.text), `${d}/${node}`).toEqual([]);
      }
      if (ls.some((l) => l.speaker === 'salkhi')) expect(ls.some((l) => l.speaker === 'anissa'), d).toBe(false);
    }
  });

  it('Anissa never jokes, and says her name twice: to Patricia at the lamp, and to the seven lines at dusk (owner, Oct 22)', () => {
    const anissa = all.filter((l) => l.speaker === 'anissa');
    expect(anissa.length).toBeGreaterThan(8);
    for (const l of anissa) expect(l.text, l.d).not.toMatch(/ha!|\bjoke|funny|just saying/i);
    expect(anissa.find((l) => l.d === 'patricia_talk' && l.text === 'Anissa. I hold the door.')).toBeDefined();
    expect(anissa.find((l) => l.d === 'patricio_muster_talk' && l.text === 'Anissa. I hold the door. Hold yours.')).toBeDefined();
    expect(anissa.map((l) => l.text)).toContain('Eight. You didn\'t count us.');
  });

  it('Rahel and Patricia keep the locked rule: nothing of Rael that reads one way, and no Rael clue at all', () => {
    for (const who of ['rahel', 'patricia']) {
      const ls = all.filter((l) => l.speaker === who);
      expect(ls.length, who).toBeGreaterThan(5);
      for (const l of ls) {
        expect(l.text, `${who} in ${l.d}`).not.toMatch(/good|innocent|feeds|the arrows|thumbprint|oath|other half|worth keeping|in the room|Rael|signet|locket/i);
      }
    }
    // Rahel's one line about her son, and nothing after it but "So they say." (the second review's 3.2).
    expect(all.map((l) => l.text)).toContain('My son does not explain himself. He never did. I stopped asking him to when he was nine.');
    expect(all.map((l) => l.text)).toContain('So they say.');
  });

  it('the family\'s facts: five children, Benny\'s peppers (not a husband\'s), Azzy\'s name a soldier\'s, no braid', () => {
    const text = all.map((l) => l.text).join(' ');
    expect(text).toMatch(/I have five children/);
    expect(text).not.toMatch(/six children|your husband|grandfather's name/i);
    expect(text).toMatch(/Benny's peppers/);
    expect(text).toMatch(/a soldier's name/);
    expect(text).not.toMatch(/braid/i);
  });

  it('Free Brasador is Azzy\'s company: Joaquin only carried it, and Azzy calls it to order at the whistle', () => {
    const text = all.map((l) => l.text);
    expect(text).toContain('Your company, captain. I only carried it.');
    expect(all.find((l) => l.speaker === 'azzy' && l.text === '¡Firmes!')).toBeDefined();
  });

  it('old Patricio is not at the blessing, and the kitchen calls nobody a grandmother (open question 13 stays open)', () => {
    const blessing = CONTENT.dialogue.patricia_talk!.nodes;
    expect(JSON.stringify(blessing.blessing) + JSON.stringify(blessing.name)).not.toMatch(/patricio/);
    expect(JSON.stringify(CONTENT.dialogue.muster_kitchen!.nodes)).not.toMatch(/grandmothers/i);
    expect(maps['zetwal-temple']!.npcs.find((n) => n.npc === 'patricio_old')!.if).toEqual({ notFlag: 'story.muster_begun' });
  });

  it('nobody dies: the crew withdraws; the betrayer is shown, the Quiet Crown\'s mark on his satchel, and named nowhere in daylight', () => {
    for (const id of ['crew_chief', 'crew_smuggler', 'crew_lookout']) expect(ENEMIES[id]!.withdraws, id).toBeDefined();
    expect(all.map((l) => l.text).join(' ')).toMatch(/closed hand/);
    for (const l of lines.filter((x) => x.d !== 'night_quay' && x.d !== 'muster_night_walk')) expect(l.text, l.d).not.toMatch(/\bbought\b.*captain|The Throne paid/i);
  });
});

describe('Pòdlimyè\'s own people at the Muster (the second review\'s 3.6)', () => {
  const day = new FlagStore({ ...starts['10']!.flags, 'story.muster_begun': true, 'story.pier_met': true });
  const mapsZetwal = Object.values(maps).filter((m) => m.id.startsWith('zetwal-'));

  it('everyone standing on a Zetwal map has a Chapter 10 line, or a condition that keeps them off it', () => {
    for (const m of mapsZetwal) {
      for (const n of activeNpcs(m, 'present', day)) {
        const def = CONTENT.npcs[n.npc]!;
        const own = muster.has(def.dialogue) || def.dialogue.startsWith('debate:');
        const over = overlaid.has(def.dialogue);
        const placed = flagsIn(n.if).some((f) => f.startsWith('story.') && f !== 'story.anissa_woke' && f !== 'story.zetwal_return');
        const reads = flagsReadBy(CONTENT.dialogue[def.dialogue] ?? { id: '', start: '', nodes: {} }).includes('story.muster_begun');
        expect(own || over || placed || reads, `${m.id}/${n.objectId} (${def.dialogue})`).toBe(true);
      }
    }
  });

  it('the people who belong to other chapters are off the maps: the veiled woman, the Marshal at the lamp, the pier\'s old pair, the festival', () => {
    const ids = (map: string) => activeNpcs(maps[map]!, 'present', day).map((n) => n.npc);
    expect(ids('zetwal-road')).not.toContain('road_watcher');
    expect(ids('zetwal-temple')).not.toContain('patricio_old');
    expect(ids('zetwal-harbor')).not.toContain('patricio_harbor');
    expect(ids('zetwal-town')).not.toContain('pilgrim');
    expect(ids('zetwal-town')).not.toContain('smith');
    expect(ids('zetwal-town')).toContain('smith_muster');
    const crowds = (maps['zetwal-town']!.crowds ?? []).filter((c) => !c.if || evaluate(c.if, day)).map((c) => c.id);
    expect(crowds).not.toContain('plaza_evening');
  });
});

describe('the day, the dusk, the night and the dawn', () => {
  it('are conditions that partition the chapter: exactly one holds at each step', () => {
    const steps: FlagSnapshot[] = [
      { 'story.muster_begun': true },
      { 'story.muster_begun': true, 'story.council_voted': true, 'story.chain_raised': true },
      { 'story.muster_begun': true, 'story.council_voted': true, 'story.inspection_done': true },
      { 'story.muster_begun': true, 'story.council_voted': true, 'story.inspection_done': true, 'story.betrayal_seen': true },
    ];
    steps.forEach((s, i) => {
      const f = new FlagStore(s);
      expect([DAY, DUSK, NIGHT, DAWN].map((c) => evaluate(c, f)), `step ${i}`).toEqual([0, 1, 2, 3].map((k) => k === i));
    });
  });

  it('the Speaker words the gate from the flags until the city is seated, then calls the vote', () => {
    const run = (f: FlagSnapshot) => {
      const r = new DialogueRunner(CONTENT.dialogue.council_speaker_talk!, CONTENT.speakers, new FlagStore({ 'story.muster_begun': true, 'story.council_condition': true, ...f }));
      const out: string[] = [];
      for (let i = 0; i < 50 && !r.done; i++) {
        const v = r.view();
        if (v.kind !== 'end') out.push(v.text);
        if (v.kind === 'choice') r.choose(0);
        else r.advance();
      }
      return out;
    };
    const none = run({});
    for (const p of SEATED_PARTS) expect(none).toContain(p.left);
    const seated = Object.fromEntries(SEATED_PARTS.map((p) => [p.flag, true]));
    expect(run(seated).join(' ')).toMatch(/Those for, stand/);
  });
});

describe('the night under the point, in all four houses, both ways', () => {
  for (const h of MUSTER_HOUSES) {
    for (const exposed of [true, false]) {
      it(`${h.house}: ${exposed ? 'exposed (the house turns, Jordyn arrests him)' : 'not exposable (he sails, his company with him)'}`, () => {
        const sim = simAt('muster-night');
        const flags = sim.logic.state.flags;
        for (const m of MUSTER_HOUSES) flags.clear(`muster.betrayer.${m.house}`);
        flags.set('muster.betrayer', h.house);
        flags.set(`muster.betrayer.${h.house}`, true);
        flags.set('muster.turned_army', 21);
        if (exposed) flags.set('muster.exposed_possible', true);
        else flags.clear('muster.exposed_possible');
        // A reload at night: the captain stands on the quay (the walk was a picture).
        expect(activeNpcs(maps['zetwal-harbor']!, 'present', flags).map((n) => n.npc)).toContain(`${h.captain}_quay`);
        sim.run(['goto 1,23', 'left', 'goto 8,4', 'left']);
        expect(sim.logic.dialogueId).toBe('night_quay');
        const said: string[] = [];
        for (let i = 0; i < 400 && sim.logic.mode === 'dialogue'; i++) {
          const v = sim.logic.view();
          if (v.kind !== 'end' && v.speaker) said.push(`${v.speaker.id}: ${v.text}`);
          sim.press('confirm');
        }
        expect(flags.isSet('story.betrayal_seen')).toBe(true);
        expect(said.some((s) => s.startsWith(`${h.companion}:`))).toBe(true);
        expect(said).toContain('anissa: He walked like the lady with the basket, Gigi. Like he already knew where he was going.');
        if (exposed) {
          expect(flags.isSet('muster.turned') && !flags.isSet('muster.betrayed')).toBe(true);
          expect(flags.get(`army.${h.house}`)).toBe(21);
          expect(said.some((s) => s.startsWith('jordyn: Captain of nothing'))).toBe(true);
        } else {
          expect(flags.isSet('muster.betrayed') && flags.isSet(`muster.gone.${h.house}`)).toBe(true);
          expect(activeNpcs(maps['zetwal-harbor']!, 'present', flags).some((n) => n.npc === `${h.captain}_quay`)).toBe(false);
        }
        // Dawn: the tide at the long pier sails the fleet.
        sim.run(['goto 30,11', 'down', 'skip']);
        expect(flags.isSet('act10.complete')).toBe(true);
      });
    }
  }
});

/** Tier-24 gear for every fighter, and the party at a level (the second review's 3.13: the built roster order). */
function partyAt(level: number): FlagStore {
  const f = new FlagStore({ ...starts['10']!.flags });
  const rules = sharedXp(f, RPG) - f.getNumber('xp.shared');
  f.set('xp.shared', xpForLevel(RPG, level) - rules);
  for (const m of RPG.members) {
    if (m.era !== 'present' || m.support) continue;
    f.set(`xp.${m.id}`, 0);
    f.set(`equip.${m.id}.armor`, m.class === 'mage' ? 'muster_robe' : m.class === 'archer' ? 'oilcloth_coat' : 'scale_armour');
    if (m.class === 'warrior') f.set(`equip.${m.id}.weapon`, 'kingsmere_blade_of_force');
  }
  return f;
}

function fightCrew(seed: number, flags: FlagStore, plan: 'fair' | 'plain'): { won: boolean; turns: number; falls: number } {
  const def = BATTLES.mangrove_crew!;
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), [], { seed, reserve: battleReserve(def) });
  const party = new Set(b.party.map((c) => c.key));
  let falls = 0;
  const count = (es: readonly { kind: string; who?: string }[]) => {
    for (const e of es) if (e.kind === 'down' && e.who && party.has(e.who)) falls++;
  };
  count(b.start());
  let turns = 0;
  for (; turns < 400 && !b.outcome; turns++) {
    const chief = b.enemies.find((e) => !e.down && e.enemyId === 'crew_chief') ?? b.enemies.find((e) => !e.down)!;
    const action: Action = plan === 'fair' ? skillsAction(b) : { kind: 'attack', target: chief.key };
    count(b.act(action));
  }
  return { won: b.outcome === 'won', turns, falls };
}

describe('Z-6\'s crew at the smugglers\' landing (the outline section 5, the second review\'s 3.13)', () => {
  it('the chief at 25, HP x3 and ATK x1.3, the crew standing in front of him, the lookouts whistling a bandit once', () => {
    const c = ENEMIES.crew_chief!;
    expect([c.level, c.hpScale, c.atkScale, c.boss]).toEqual([25, 3, 1.3, true]);
    for (const id of ['crew_smuggler', 'crew_lookout']) expect(ENEMIES[id]!.protects, id).toBe('crew_chief');
    const whistle = ENEMIES.crew_lookout!.moves.find((m) => m.hire);
    expect(whistle).toMatchObject({ hire: 'cane_bandit', once: true });
    expect(battleReserve(BATTLES.mangrove_crew!).cane_bandit!.level).toBe(24);
    expect(BATTLES.mangrove_crew!.endsWithBoss).toBe(true);
  });

  for (const level of [23, 24, 25]) {
    it(`in tier-24 gear at ${level}: the fair bot wins every seed, falling less than once a fight; rushing the chief is slower and costlier`, () => {
      const flags = partyAt(level);
      const fair = Array.from({ length: 30 }, (_, i) => fightCrew(i + 1, flags, 'fair'));
      const plain = Array.from({ length: 30 }, (_, i) => fightCrew(i + 1, flags, 'plain'));
      const avg = (rs: typeof fair, k: 'turns' | 'falls') => rs.reduce((n, r) => n + r[k], 0) / rs.length;
      console.log(`crew at ${level}: fair ${fair.filter((r) => r.won).length}/30, ${avg(fair, 'turns').toFixed(1)} actions, ${avg(fair, 'falls').toFixed(2)} falls (${fair.filter((r) => r.falls > 0).length} with one); plain ${plain.filter((r) => r.won).length}/30, ${avg(plain, 'turns').toFixed(1)} actions, ${avg(plain, 'falls').toFixed(2)} falls`);
      expect(fair.filter((r) => r.won).length).toBe(30);
      expect(avg(fair, 'falls')).toBeLessThan(1);
      // protects: the crew steps in front of him, so rushing the chief is slower and costs more falls than cutting them down.
      expect(avg(plain, 'turns')).toBeGreaterThan(avg(fair, 'turns'));
      expect(avg(plain, 'falls')).toBeGreaterThan(avg(fair, 'falls'));
    });
  }

  it('the Cane Road\'s return: trios at 24 to 25, every group won at 24 by the fair bot with nobody down on average', () => {
    const table = ENCOUNTERS.cane_road_muster!;
    expect(table.groups.every((g) => (g.enemies?.length ?? 0) === 3 && g.level >= 24 && g.level <= 25)).toBe(true);
    const flags = partyAt(24);
    for (const g of table.groups) {
      const def = battleDef(`encounter:cane_road_muster/${g.id}`)!;
      const runs = Array.from({ length: 20 }, (_, i) => {
        const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ({ ...ENEMIES[id]!, level: def.level! })), [], { seed: 300 + i, reserve: battleReserve(def) });
        const party = new Set(b.party.map((c) => c.key));
        let falls = 0;
        const count = (es: readonly { kind: string; who?: string }[]) => {
          for (const e of es) if (e.kind === 'down' && e.who && party.has(e.who)) falls++;
        };
        count(b.start());
        let t = 0;
        for (; t < 300 && !b.outcome; t++) count(b.act(skillsAction(b)));
        return { won: b.outcome === 'won', t, falls };
      });
      const falls = runs.reduce((n, r) => n + r.falls, 0) / runs.length;
      console.log(`cane road ${g.id} at 24: ${runs.filter((r) => r.won).length}/20, ${(runs.reduce((n, r) => n + r.t, 0) / runs.length).toFixed(1)} actions, ${falls.toFixed(2)} falls`);
      expect(runs.every((r) => r.won), g.id).toBe(true);
      expect(falls, g.id).toBeLessThan(1);
    }
  });
});

describe('the side quests, the feuds and the camps', () => {
  it('Z-6, Z-3 and the three feuds are done on the route, and close if the fleet sails without them', () => {
    const flags = simAt('muster-vote').logic.state.flags;
    for (const id of ['muskets', 'lonely_cutter', 'feud_merchants', 'feud_temple', 'feud_crown']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('done');
    const late = new FlagStore({ 'side.muskets.accepted': true, 'side.lonely_cutter.accepted': true, 'debate.zetwal_feud_crown.listened': true, 'act10.complete': true });
    for (const id of ['muskets', 'lonely_cutter', 'feud_crown']) expect(sideQuestStatus(late, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('closed');
  });

  it('a mediated feud pays two toward its Influence house\'s price, and the Dorini give their seal when paid in full', () => {
    const f = new FlagStore({ 'pillar.influence.al_doria': 8 });
    expect(allyShare(f, RPG, 'al_doria').points).toBe(8);
    f.set('debate.zetwal_feud_merchants.mediated', true);
    expect(allyShare(f, RPG, 'al_doria').points).toBe(10);
    const r = new DialogueRunner(CONTENT.dialogue.dorini_admiral_talk!, CONTENT.speakers, new FlagStore({ 'muster.share.al_doria': 100 }));
    for (let i = 0; i < 10 && !r.done; i++) r.advance();
    const g = new FlagStore({ 'muster.share.al_doria': 100 });
    const r2 = new DialogueRunner(CONTENT.dialogue.dorini_admiral_talk!, CONTENT.speakers, g);
    for (let i = 0; i < 10 && !r2.done; i++) r2.advance();
    expect(g.isSet('item.token_dorini')).toBe(true);
  });

  it('gold given at the Ironvow camp counts a point a hundred, until the whistle closes the count', () => {
    const f = new FlagStore({ gold: 1000, 'muster.short.skarragol': 3 });
    const r = new DialogueRunner(CONTENT.dialogue.ironvow_camp_talk!, CONTENT.speakers, f);
    r.advance();
    expect(r.view().kind).toBe('choice');
    r.choose(0);
    expect(f.get('muster.gift.skarragol')).toBe(1);
    expect(f.get('gold.pay')).toBe(100);
    const closed = new FlagStore({ gold: 1000, 'story.inspection_done': true });
    const r3 = new DialogueRunner(CONTENT.dialogue.ironvow_camp_talk!, CONTENT.speakers, closed);
    expect(r3.view()).toMatchObject({ kind: 'line', text: expect.stringContaining('The whistle closed it') });
  });
});
