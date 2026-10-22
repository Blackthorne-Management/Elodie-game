// Chapter 11, The War of the Harbor (Yucayeque, Xaraguá again; docs/quest/reviews/2026-10-22-chapter11-outline.md with
// its second review's fixes): the armies' volleys, Rael's `avoid`, a phase's `leave`, a fight's `onLoss`, the Rise out of
// a memory; the owner's rules as content checks (Anissa never jokes and shares no node with a comic line, the locked rule
// before the Turn, the signet at the public lie and never in the truth, the family's facts); every person placed on a
// Xaraguá map has a line; the four houses betrayed and turned, each with Trust and Strike, play through; what Chapter 12
// is handed; the side quests close; and the fights against the roster four and a glass line in tier-24 gear, volleys on,
// counting falls across the whole party (the outline's Built section has the tables).

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MAP_MOODS } from '../src/assets.config.ts';
import { MUSIC_OVERRIDES } from '../src/audio.config.ts';
import { ARMY_VOLLEY_PER, GRUDGE_MAX_BOSS, VOLLEY } from '../src/config.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, battleDef, battleReserve } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { DEBATES } from '../src/data/debates.ts';
import { WAR_DIALOGUE, WAR_OVERLAYS } from '../src/data/dialogue/xaraguaWar.ts';
import { RPG } from '../src/data/rpg.ts';
import { WAR_SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { COMPANIES, FLANK_HOUSES } from '../src/data/war.ts';
import { VOLLEY_BATTLES } from '../src/data/warBattles.ts';
import { Battle, battleItems, battleParty, settleBattle, type BattleEvent } from '../src/engine/battle.ts';
import { DialogueRunner, type DialogueScript } from '../src/engine/dialogue.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { recordLoss } from '../src/engine/gameOver.ts';
import { sharedXp, xpForLevel } from '../src/engine/rpg.ts';
import { questClosed, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { newGame } from '../src/engine/state.ts';
import { activeNpcs } from '../src/engine/world.ts';
import { VOLLEYS_LEFT_FLAG, VOLLEY_POOL_FLAG, poolFromArmies, spentFlag, volleysFor, volleysFlag, warTick } from '../src/engine/war.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { skillsAction } from '../tools/battle-sim.ts';
import { goldWalk } from '../tools/gold-walk.ts';
import { loadMaps, newGameSim, readJson, winBattles } from '../tools/sim-setup.ts';

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

// ---- The chapter's lines (its own scripts, its overlays as the game runs them, the elders' debate) ----------------------

const war = new Map(WAR_DIALOGUE.map((d) => [d.id, d]));
const overlaid = new Set(WAR_OVERLAYS.map((o) => o.id));
const SCRIPTS: DialogueScript[] = [...WAR_DIALOGUE, ...[...overlaid].map((id) => CONTENT.dialogue[id]!)];
type Line = { d: string; node: string; speaker: string; text: string; fx?: string };
const lines: Line[] = SCRIPTS.flatMap((d) =>
  Object.entries(d.nodes)
    .filter(([node]) => war.has(d.id) || node.startsWith('m_'))
    .flatMap(([node, n]) => n.lines.map((l) => ({ d: d.id, node, speaker: l.speaker ?? n.speaker ?? '', text: l.text, fx: l.fx }))),
);
const ELDERS = DEBATES.find((d) => d.id === 'xaragua_harbor')!;
const debateLines: Line[] = (['passing', 'listen', 'won', 'lost', 'mediate', 'provoke', 'after'] as const).flatMap((part) =>
  ELDERS[part].map((l) => ({ d: ELDERS.id, node: part, speaker: l.speaker ?? '', text: l.text })),
);
const all = [...lines, ...debateLines];

// ---- The armies' volleys ---------------------------------------------------------------------------------------------------

describe('the armies\' volleys (engine/war.ts; the second review\'s 3.4)', () => {
  it('the pool is one volley for every ARMY_VOLLEY_PER soldiers, counted once as the fleet lands', () => {
    const f = new FlagStore({ 'army.zetwal': 60, 'army.skarragol': 47, 'army.al_doria': 0 });
    expect(poolFromArmies(f, Object.keys(f.snapshot()))).toBe(Math.floor(107 / ARMY_VOLLEY_PER));
    warTick(f);
    expect(f.get(VOLLEY_POOL_FLAG)).toBeUndefined(); // not before the landing
    f.set('story.war_begun', true);
    warTick(f);
    expect(f.get(VOLLEY_POOL_FLAG)).toBe(10);
    expect(f.get(VOLLEYS_LEFT_FLAG)).toBe(10);
    // Counted once: a house that walks in later does not grow the pool; what a won fight spent comes off.
    f.set('army.kuroshi', 40);
    f.set(spentFlag('headland_battery'), 3);
    warTick(f);
    expect(f.get(VOLLEY_POOL_FLAG)).toBe(10);
    expect(f.get(VOLLEYS_LEFT_FLAG)).toBe(7);
  });

  it('a fight opens with what the whistle asked (at most VOLLEY.cap), fired in turn by the companies at sea', () => {
    const def = BATTLES.headland_battery!;
    const f = new FlagStore({ 'army.zetwal': 60, 'army.skarragol': 47, [volleysFlag(def.id)]: 5 });
    const v = volleysFor(f, def, COMPANIES);
    expect(v.count).toBe(VOLLEY.cap);
    const name = (army: string) => COMPANIES.find((c) => c.army === army)!.name;
    expect(v.names).toEqual([name('zetwal'), name('skarragol'), name('zetwal')].slice(0, VOLLEY.cap));
    expect(volleysFor(f, BATTLES.pier_rael!, COMPANIES).count).toBe(0); // no volleys on the pier with the envoy in the line
    expect(volleysFor(new FlagStore({ [volleysFlag(def.id)]: 3 }), def, COMPANIES).count).toBe(0); // nobody at sea
  });

  it('a volley never fells, a boss takes half, a won fight spends them and a lost one gives them back', () => {
    const flags = partyAt(25, 'best');
    flags.set(volleysFlag('customs_thorne'), 3);
    const def = BATTLES.customs_thorne!;
    const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((e) => ENEMIES[e]!), [], {
      seed: 1,
      reserve: battleReserve(def),
      volleys: volleysFor(flags, def, COMPANIES),
    });
    const events = b.start();
    const hits = events.filter((e): e is Extract<BattleEvent, { kind: 'damage' }> => e.kind === 'damage' && e.from === 'volley');
    expect(hits.length).toBe(3 * 3);
    for (const e of b.enemies) expect(e.hp, e.enemyId).toBeGreaterThanOrEqual(1);
    const boss = b.enemies.find((e) => e.boss)!;
    const plain = b.enemies.find((e) => !e.boss)!;
    const first = (key: string) => hits.find((h) => h.to === key)!.amount;
    expect(first(boss.key)).toBeLessThan(first(plain.key));
    // Won: the spent volleys are written; lost: nothing is.
    const won = new FlagStore(flags.snapshot());
    settleBattle(won, RPG, { def, items: battleItems(won, RPG), outcome: 'won', goldSpent: 0, party: [] } as unknown as Battle);
    expect(won.get(spentFlag(def.id))).toBe(3);
    const lost = new FlagStore(flags.snapshot());
    recordLoss(lost, def);
    expect(lost.get(spentFlag(def.id))).toBeUndefined();
    expect(VOLLEY_BATTLES).toEqual(['headland_battery', ...FLANK_HOUSES.map((h) => `harbor_flank_${h.house}`), 'customs_thorne', 'flagship_hale']);
  });
});

// ---- avoid, leave, onLoss, the Rise out of a memory ------------------------------------------------------------------------

describe('the Strike, Hale\'s loss and Caona\'s stand (the second review\'s 3.3, 3.8 and section 6)', () => {
  it('Rael never strikes Gianna, not even with an area move, and his guards step back at the Broken Army', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const flags = partyAt(27, 'best');
      const def = BATTLES.pier_rael!;
      const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((e) => ENEMIES[e]!), [], { seed, reserve: battleReserve(def) });
      const events: BattleEvent[] = [...b.start()];
      for (let t = 0; t < 400 && !b.outcome; t++) events.push(...b.act(skillsAction(b)));
      const rael = b.enemies.find((e) => e.enemyId === 'rael_harbor')!;
      const gianna = b.party.find((p) => p.key === 'gianna')!;
      expect(events.some((e) => (e.kind === 'damage' || e.kind === 'miss') && e.from === rael.key && e.to === gianna.key), `seed ${seed}`).toBe(false);
      expect(b.outcome, `seed ${seed}`).toBe('won');
      // Below 15% only Rael is left on the pier: Rivera, Jaime and the halberdiers have gone back to the longboat.
      for (const e of b.enemies.filter((x) => x.enemyId !== 'rael_harbor')) expect(e.active && !e.down, `${e.enemyId} seed ${seed}`).toBe(false);
      expect(events.some((e) => e.kind === 'down' && e.who === gianna.key)).toBe(false);
    }
  });

  it('Hale lost: party.rael goes with the loss, so no roster Rael is left behind', () => {
    const flags = new FlagStore({ 'party.rael': true });
    recordLoss(flags, BATTLES.flagship_hale!);
    expect(flags.get('party.rael')).toBe(false);
    expect(RPG.members.find((m) => m.id === 'rael')!.joins).toEqual({ all: [{ flag: 'party.rael' }, { flag: 'fight.return' }, { notFlag: 'story.harbor_taken' }] });
  });

  it('Caona\'s stand lost: the party rises in the present by the shimmer, the memory\'s flags gone, the pin still in, and Echo plays the stand again', () => {
    const sim = simAt('war-anaco-freed');
    const flags = sim.logic.state.flags;
    let lostOnce = false;
    sim.onBattle = (id) => {
      if (id !== 'caona_stand' || lostOnce) return undefined;
      lostOnce = true;
      recordLoss(flags, battleDef(id)!);
      sim.logic.riseFromFight();
      return [];
    };
    sim.run(['goto 21,20', 'echo', 'skip']);
    expect(sim.battles).toContain('caona_stand');
    expect(sim.logic.era).toBe('present');
    expect(sim.logic.mode).toBe('field');
    expect(Object.keys(flags.snapshot()).filter((k) => k.startsWith('echo.'))).toEqual([]);
    expect(flags.isSet('anchor.chain_post')).toBe(false);
    expect(flags.isSet('encounter.war_story.caona.won')).toBe(false);
    // Echo again: the stand plays again (the gameOver test's "way back in" for a memory's fight).
    winBattles(sim);
    const before = sim.battles.length;
    sim.run(['echo', 'skip']);
    expect(sim.battles.slice(before)).toEqual(['caona_stand']);
    expect(sim.logic.era).toBe('echo');
  });
});

// ---- The owner's rules as content checks -----------------------------------------------------------------------------------

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

  it('Anissa never jokes, is never a fighter, and holds the lamp in the Song House', () => {
    const anissa = all.filter((l) => l.speaker === 'anissa' || l.speaker === 'anissa_far');
    expect(anissa.length).toBeGreaterThan(8);
    for (const l of anissa) expect(l.text, l.d).not.toMatch(/ha!|\bjoke|funny|just saying|dreadful|terribly/i);
    expect(anissa.map((l) => l.text)).toContain('I\'m holding it.');
    // No foe of the chapter is set to strike her: the flank's Husher Seizes (Gianna steps in, as built); nobody else does.
    const seizers = Object.values(ENEMIES).filter((e) => e.moves.some((m) => m.seize) && Object.values(BATTLES).some((b) => b.table === 'war_story' && b.enemies.includes(e.id)));
    expect(seizers.map((e) => e.id)).toEqual(['flank_husher']);
    expect(RPG.members.find((m) => m.id === 'anissa')!.support).toBe(true);
  });

  it('the locked rule: before the Turn nothing says Rael is good, and his family and guard do not speak', () => {
    const AFTER = new Set(['hale_again', 'rael_again', 'hale_after', 'rael_strike_after', 'harbor_truth', 'war_song', 'war_caney', 'benny_war_talk', 'nancy_war_talk', 'harbor_turn']);
    const FAMILY = new Set(['rael', 'benny_old', 'nancy', 'rivera', 'jaime']);
    for (const l of all.filter((x) => !AFTER.has(x.d))) {
      expect(l.text, l.d).not.toMatch(/\bhe is good|he's good|innocent|feeds the|the arrows|on our side|never betrayed|loyal to us|he was testing/i);
      expect(FAMILY.has(l.speaker), `${l.d}: ${l.speaker}`).toBe(false);
    }
    // At the Turn, Rael speaks his public lie before the choice, with the signet's glow; nothing of the truth is said there.
    const turn = CONTENT.dialogue.harbor_turn!;
    const before = turn.nodes[turn.start]!;
    const reached = [before, ...Object.values(turn.nodes).filter((n) => n.choices?.some((c) => c.text === 'Hold the pier.'))];
    const pre = reached.flatMap((n) => n.lines);
    expect(pre.some((l) => l.speaker === 'rael' && l.fx === 'signet')).toBe(true);
    for (const l of pre) expect(l.text).not.toMatch(/Quiet Crown|married|tested/i);
  });

  it('the signet glows at the public lie and never in the truth; the Locket and the signet glow together on the Accounts', () => {
    const truth = lines.filter((l) => l.d === 'harbor_truth');
    expect(truth.filter((l) => l.fx === 'signet')).toEqual([]);
    expect(truth.some((l) => l.fx === 'token' && /Both halves glow/.test(l.text))).toBe(true);
    expect(truth.some((l) => /the signet is a plain ring/.test(l.text))).toBe(true);
  });

  it('the family\'s facts: Rael married their mother, Benny is his father, Nancy is not his mother, Patricia is a great-grandmother', () => {
    const text = all.map((l) => l.text).join(' ');
    expect(text).toMatch(/Your mother and I married twenty-five years ago/);
    expect(text).toMatch(/I brought my father where I meant to stand/);
    expect(text).toMatch(/Titi Aiyana said the hands/);
    expect(text).toMatch(/My father kept his oath and it cost him everything/); // STORY 11 beat 4's private line, verbatim
    expect(text).not.toMatch(/(his|your father's|Rael's) mother,? Nancy|Nancy,? (his|Rael's) mother|grandmother Nancy/i);
    expect(text).not.toMatch(/Grandmother Patricia|grandfather Benny/i);
    expect(JSON.stringify(CONTENT.dialogue)).not.toMatch(/Grandmother Patricia/);
    // Azzy stays in the party on Strike, furious (owner, Oct 22): he says nothing to his father in the truth.
    expect(lines.find((l) => l.d === 'harbor_truth' && /Azzy says nothing to his father/.test(l.text))).toBeDefined();
  });

  it('nobody dies: every foe of the war withdraws', () => {
    const ids = new Set(Object.values(BATTLES).filter((b) => b.table === 'war_story').flatMap((b) => [...b.enemies, ...b.phases?.flatMap((p) => p.enter ?? []) ?? []]));
    for (const id of ids) if (ENEMIES[id]!.boss || /flank_|harbor_|hale|rael|old_|thorne/.test(id)) expect(ENEMIES[id]!.withdraws, id).toBeDefined();
  });
});

// ---- Every person on a Xaraguá map has a line ------------------------------------------------------------------------------

describe('Yucayeque\'s people at war, and after', () => {
  const xmaps = Object.values(maps).filter((m) => m.id.startsWith('xaragua-'));
  const run = (dialogue: string, f: FlagStore) => {
    const d = CONTENT.dialogue[dialogue];
    if (!d) return [];
    const r = new DialogueRunner(d, CONTENT.speakers, new FlagStore(f.snapshot()));
    const out: string[] = [];
    for (let i = 0; i < 60 && !r.done; i++) {
      const v = r.view();
      if (v.kind !== 'end') out.push(v.text);
      if (v.kind === 'choice') r.choose(v.choices[0]!.index);
      else r.advance();
    }
    return out;
  };
  const moments: [string, string][] = [
    ['the camp by day', 'war-camp'],
    ['the village by dusk', 'war-village'],
    ['the free harbor', 'war-song'],
  ];
  for (const [name, mark] of moments) {
    it(`everyone standing on a Xaraguá map has a line: ${name}`, () => {
      const f = simAt(mark).logic.state.flags;
      for (const m of xmaps) {
        for (const n of activeNpcs(m, 'present', f)) {
          const def = CONTENT.npcs[n.npc]!;
          if (def.dialogue.startsWith('debate:')) continue;
          expect(run(def.dialogue, f).length, `${m.id}/${n.objectId} (${def.dialogue})`).toBeGreaterThan(0);
        }
      }
    });
  }
  it('the lamp-oil seller only speaks at war: no shop sells lamp oil, and the cassava-bread stall stays the baker\'s', () => {
    expect(CONTENT.npcs.lamp_oil_war!.shop).toBeUndefined();
    const breadSellers = Object.values(CONTENT.npcs).filter((n) => n.shop === 'xaragua_food').map((n) => n.id);
    expect(breadSellers.every((id) => id.startsWith('casabe_baker'))).toBe(true);
  });
});

// ---- Every variant plays through -------------------------------------------------------------------------------------------

/** Chapter 11's start with the Muster's night rewritten: house `h` the buyer, sailed (betrayed) or turned. */
function startWith(h: string, night: 'betrayed' | 'turned'): Sim {
  const at = starts['11']!;
  const flags: FlagSnapshot = { ...at.flags };
  for (const k of Object.keys(flags)) if (/^muster\.(betrayer\.|gone\.)|^muster\.(betrayed|turned|turned_paid)$/.test(k)) delete flags[k];
  flags['army.al_doria'] = 21;
  flags['muster.betrayer'] = h;
  flags[`muster.betrayer.${h}`] = true;
  flags[`army.${h}`] = 0;
  if (night === 'betrayed') {
    flags['muster.betrayed'] = true;
    flags[`muster.gone.${h}`] = true;
  } else {
    flags['muster.turned'] = true;
    flags['muster.turned_army'] = 16;
  }
  const state = newGame(maps[at.map]!, at.spawn);
  state.flags.load(flags);
  const sim = new Sim(new GameLogic(maps, CONTENT, state));
  winBattles(sim);
  sim.logic.enterMap();
  return sim;
}

/** Walk the chapter by the arrow, taking `turn` at the Turn. */
function playChapter(sim: Sim, turn: 'Hold the pier.' | 'Strike first.') {
  const atTurn = (s: Sim) => {
    if (s.logic.mode !== 'dialogue' || s.logic.dialogueId !== 'harbor_turn') return false;
    const v = s.logic.view();
    return v.kind === 'choice' && v.choices.some((c) => c.text === 'Strike first.');
  };
  const first = goldWalk({ maps, sim, through: 'act11', until: atTurn });
  const v = sim.logic.view();
  if (v.kind !== 'choice') throw new Error('no Turn');
  sim.cursor = v.choices.findIndex((c) => c.text === turn);
  sim.press('confirm');
  const rest = goldWalk({ maps, sim, through: 'act11' });
  return { stalls: [...first.stalls, ...rest.stalls], finished: rest.finished };
}

describe('the four houses, betrayed and turned, each with Trust and Strike, play through', () => {
  for (const h of FLANK_HOUSES) {
    for (const night of ['betrayed', 'turned'] as const) {
      for (const turn of ['Hold the pier.', 'Strike first.'] as const) {
        it(`${h.house}, ${night}, ${turn === 'Hold the pier.' ? 'Trust' : 'Strike'}`, () => {
          const sim = startWith(h.house, night);
          // The house's companion leads the flank's fight (betrayed), and the house that stood fights nobody on the sand.
          let leader = '';
          const win = sim.onBattle!;
          sim.onBattle = (id) => {
            if (id.startsWith('harbor_flank_')) leader = battleParty(sim.logic.state.flags, RPG, SKILL_BOOK)[1]!.id;
            return win(id);
          };
          const out = playChapter(sim, turn);
          const f = sim.logic.state.flags;
          expect(out.stalls).toEqual([]);
          expect(out.finished).toBe(true);
          const flank = sim.battles.filter((b) => b.startsWith('harbor_flank_'));
          if (night === 'betrayed') {
            expect(flank).toEqual([`harbor_flank_${h.house}`]);
            expect(leader).toBe(h.companion);
            expect(f.isSet('choice.flank_spared') || f.isSet('choice.flank_bound')).toBe(true);
          } else {
            expect(flank).toEqual([]);
            expect(f.isSet('war.house_stood')).toBe(true);
          }
          expect(sim.battles).toContain(turn === 'Hold the pier.' ? 'flagship_hale' : 'pier_rael');
          expect(f.isSet(turn === 'Hold the pier.' ? 'story.harbor_won' : 'story.fleet_escaped')).toBe(true);
          for (const flag of ['story.harbor_taken', 'clue.ash_road_read', 'story.wounded_sheltered', 'act11.complete', 'item.token_xaragua', 'story.regent_retreated']) {
            expect(f.isSet(flag), flag).toBe(true);
          }
          // Rael is never left in the roster after the pier; Azzy stays (furious, on Strike).
          expect(f.get('party.rael') === true).toBe(false);
          expect(f.isSet('party.azzy')).toBe(true);
          expect(f.get('belief.rael_traitor')).toBe(false);
        });
      }
    }
  }
});

// ---- What Chapter 12 is handed ---------------------------------------------------------------------------------------------

describe('?chapter=12, and what Chapter 12 is handed', () => {
  it('Eightgate\'s Ardencia Gate, with the harbor taken, the truth read and the war\'s choices kept', () => {
    const at = starts['12']!;
    expect([at.map, at.spawn]).toEqual(['seat-concourse', 'ardencia_gate']);
    const f = new FlagStore(at.flags);
    for (const flag of ['act11.complete', 'card.act11_end', 'story.harbor_taken', 'story.harbor_won', 'war.trust', 'war.turn_made', 'story.anaco_freed', 'ally.xaragua', 'clue.ash_road_read', 'story.wounded_sheltered', 'story.regent_retreated', 'item.token_xaragua', 'story.thorne_taken']) {
      expect(f.isSet(flag), flag).toBe(true);
    }
    expect(f.get('choice.truth_answer')).toBe('tested');
    expect(f.get('belief.rael_traitor')).toBe(false);
    expect(f.get('party.rael')).toBe(false);
    expect(f.isSet('choice.thorne_spared') !== f.isSet('choice.thorne_broken')).toBe(true);
    expect(f.isSet('travel.next')).toBe(false);
    // Every "war over" condition reads story.harbor_taken: the war's ambush table is off once it is set.
    const zone = maps['xaragua-mountain']!.encounters.find((z) => z.id === 'mountain_war')!;
    expect(JSON.stringify(zone.if)).toContain('story.harbor_taken');
  });
});

// ---- The war's light and music ---------------------------------------------------------------------------------------------

describe('the war\'s light and music on Yucayeque\'s maps', () => {
  it('smoke by day, red at the tide, the lamps of the free harbor after; the war\'s drums, then the city\'s own song', () => {
    const mood = (f: FlagSnapshot) => MAP_MOODS.find((m) => m.maps.includes('xaragua-village') && evaluate(m.if, new FlagStore(f)))?.color;
    const music = (f: FlagSnapshot) => MUSIC_OVERRIDES.find((m) => m.maps.includes('xaragua-village') && evaluate(m.if, new FlagStore(f)))?.music;
    const occupied = { 'story.crown_attack': true };
    const day = { ...occupied, 'story.war_begun': true };
    const dusk = { ...day, 'story.tide_called': true };
    const free = { ...dusk, 'story.harbor_taken': true };
    expect(new Set([mood(occupied), mood(day), mood(dusk), mood(free)]).size).toBe(4);
    expect([music(occupied), music(day), music(dusk), music(free)]).toEqual(['crown_customs', 'harbor_war', 'harbor_war', 'yucayeque']);
  });
});

// ---- The side quests close -------------------------------------------------------------------------------------------------

describe('Chapter 11\'s side quests close', () => {
  it('done on the route, and closed (not left open) for a player who skipped them, once the card shows', () => {
    const done = new FlagStore(starts['12']!.flags);
    for (const q of WAR_SIDE_QUESTS) expect(sideQuestStatus(done, q), q.id).toBe('done');
    const skipped = new FlagStore(Object.fromEntries(Object.entries(starts['12']!.flags).filter(([k]) => !k.startsWith('side.') && !k.startsWith('debate.xaragua_harbor'))));
    for (const q of WAR_SIDE_QUESTS) expect(questClosed(q, skipped), q.id).toBe(true);
  });
});

// ---- The fights ------------------------------------------------------------------------------------------------------------

/** Tier-24 gear for every fighter (best) or as the route leaves them (start), and the party at a level. */
function partyAt(level: number, gear: 'best' | 'start', extra: FlagSnapshot = {}): FlagStore {
  const f = new FlagStore({ ...starts['11']!.flags, ...extra });
  const rules = sharedXp(f, RPG) - f.getNumber('xp.shared');
  f.set('xp.shared', xpForLevel(RPG, level) - rules);
  for (const m of RPG.members) {
    if (m.era !== 'present' || m.support) continue;
    f.set(`xp.${m.id}`, 0);
    if (gear === 'best' && m.id !== 'rael') {
      f.set(`equip.${m.id}.armor`, m.class === 'mage' ? 'muster_robe' : m.class === 'archer' ? 'oilcloth_coat' : 'scale_armour');
      if (m.class === 'warrior') f.set(`equip.${m.id}.weapon`, 'kingsmere_blade_of_force');
    }
  }
  return f;
}

const GLASS = ['gianna', 'yari', 'vikram', 'haru'];
type Result = { won: boolean; actions: number; falls: number; bound: number };

function fight(id: string, seed: number, flags: FlagStore, order: 'roster' | 'glass', volleys: number, grudge = 0): Result {
  const def = battleDef(id)!;
  flags.set(volleysFlag(id), volleys);
  let party = battleParty(flags, RPG, SKILL_BOOK, def.era ?? 'present');
  if (order === 'glass') party = [...GLASS.map((g) => party.find((p) => p.id === g)!), ...party.filter((p) => !GLASS.includes(p.id))];
  const b = new Battle(def, party, def.enemies.map((e) => ENEMIES[e]!), [], { seed, grudge, reserve: battleReserve(def), volleys: volleysFor(flags, def, COMPANIES) });
  const keys = new Set(b.party.map((c) => c.key));
  let falls = 0;
  let bound = 0;
  const count = (es: readonly BattleEvent[]) => {
    for (const e of es) {
      if ((e.kind === 'down' || e.kind === 'bound') && keys.has(e.who)) falls++;
      if (e.kind === 'bound' && keys.has(e.who)) bound++;
    }
  };
  count(b.start());
  let actions = 0;
  for (; actions < 400 && !b.outcome; actions++) count(b.act(skillsAction(b)));
  return { won: b.outcome === 'won', actions, falls, bound };
}

function runs(id: string, level: number, gear: 'best' | 'start', order: 'roster' | 'glass', volleys: number, n: number, extra: FlagSnapshot = {}, grudge = 0) {
  const rs = Array.from({ length: n }, (_, i) => fight(id, 700 + i, partyAt(level, gear, extra), order, volleys, grudge));
  return {
    won: rs.filter((r) => r.won).length,
    actions: rs.reduce((s, r) => s + r.actions, 0) / n,
    withFall: rs.filter((r) => r.falls > 0).length / n,
    withBound: rs.filter((r) => r.bound > 0).length / n,
    n,
  };
}

const flankFlags = (h: string): FlagSnapshot => ({ 'muster.betrayed': true, 'muster.betrayer': h, [`muster.betrayer.${h}`]: true, 'story.headland_won': true });

describe('the fights, against the roster four and a glass line in tier-24 gear, volleys on (the second review\'s gates)', () => {
  it('the headland and the picket: won every seed, nobody down', () => {
    for (const id of ['headland_battery', 'thumbprint_picket']) {
      for (const order of ['roster', 'glass'] as const) {
        const r = runs(id, 25, 'best', order, 3, 15);
        expect(r.won, id).toBe(15);
        expect(r.withFall, id).toBe(0);
      }
    }
  });

  for (const h of FLANK_HOUSES) {
    it(`the flank (${h.house}): 26 to 34 actions at 25, a fall in some fights and never a loss; the boss Grudge wins every seed in start gear`, () => {
      const r = runs(`harbor_flank_${h.house}`, 25, 'best', 'roster', 3, 20, flankFlags(h.house));
      console.log(`flank ${h.house} at 25: ${r.actions.toFixed(1)} actions, a fall in ${Math.round(r.withFall * 100)}%`);
      expect(r.won).toBe(20);
      expect(r.actions).toBeGreaterThanOrEqual(26);
      expect(r.actions).toBeLessThanOrEqual(34);
      expect(r.withFall).toBeGreaterThan(0.05);
      expect(r.withFall).toBeLessThanOrEqual(0.6);
      expect(runs(`harbor_flank_${h.house}`, 25, 'start', 'glass', 0, 10, flankFlags(h.house), GRUDGE_MAX_BOSS).won).toBe(10);
    });
  }

  it('Thorne: about 18 to 22 actions at the band\'s floor (the second review\'s 3.14), nobody down', () => {
    const r = runs('customs_thorne', 25, 'best', 'roster', 3, 20);
    expect(r.won).toBe(20);
    expect(r.actions).toBeGreaterThanOrEqual(17);
    expect(r.actions).toBeLessThanOrEqual(23);
  });

  it('Caona\'s stand: the Echo three win every seed at 25 to 28', () => {
    for (const lv of [25, 26, 27, 28]) expect(runs('caona_stand', lv, 'best', 'roster', 0, 15).won, `at ${lv}`).toBe(15);
  });

  it('Hale with Rael in the four: 26 to 34 actions at 25, a fall in some fights, never a loss', () => {
    const r = runs('flagship_hale', 25, 'best', 'roster', 3, 20, { 'party.rael': true, 'fight.return': true });
    console.log(`hale at 25: ${r.actions.toFixed(1)} actions, a fall in ${Math.round(r.withFall * 100)}%`);
    expect(r.won).toBe(20);
    expect(r.actions).toBeGreaterThanOrEqual(26);
    expect(r.actions).toBeLessThanOrEqual(34);
    expect(r.withFall).toBeGreaterThan(0.05);
    expect(runs('flagship_hale', 25, 'start', 'glass', 0, 10, { 'party.rael': true, 'fight.return': true }, GRUDGE_MAX_BOSS).won).toBe(10);
  });

  it('the Strike is the hard route on purpose: a Bound in about half the fights at 27, a loss in at most one in eight, the boss Grudge wins every seed in start gear', () => {
    const r = runs('pier_rael', 27, 'best', 'roster', 0, 30);
    console.log(`strike at 27: ${r.actions.toFixed(1)} actions, a Bound in ${Math.round(r.withBound * 100)}%`);
    expect(r.withBound).toBeGreaterThanOrEqual(0.35);
    expect(r.n - r.won).toBeLessThanOrEqual(r.n / 8);
    expect(r.actions).toBeLessThanOrEqual(40);
    expect(runs('pier_rael', 25, 'start', 'glass', 0, 15, {}, GRUDGE_MAX_BOSS).won).toBe(15);
    expect(runs('pier_rael', 25, 'start', 'roster', 0, 15, {}, GRUDGE_MAX_BOSS).won).toBe(15);
  });
});
