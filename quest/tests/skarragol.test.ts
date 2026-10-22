// Chapter 6, The Stolen Standard (Ordvik; docs/quest/reviews/2026-10-21-chapter6-outline.md with its second review):
// the chapter starts (?chapter=6 and 7), the fair, the Moot and Bayarmaa's bond, the gate until the horn, the fjord's
// two eras and five swaps with Sarnai's raid in the memory (the review's 3.2), the herd and its fail-safe, Grimvald's
// three phases (the review's 3.3), Bayarmaa as a fighter who leads in her own chapter (3.9), S-5's three answers (3.5),
// S-3's wolf run, the price and the token (3.6), the side quests closing, and the owner's rules as content checks.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MAP_MOODS } from '../src/assets.config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, SKILLS, battleReserve } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { SKARRAGOL_DIALOGUE } from '../src/data/dialogue/skarragol.ts';
import { RPG } from '../src/data/rpg.ts';
import { FJORD, HERD } from '../src/data/skarragol.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { Battle, battleItems, battleParty, type Action, type BattleEvent } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { isWalkable } from '../src/engine/grid.ts';
import { gold, localPillar, partyMembers } from '../src/engine/rpg.ts';
import { closedNotes, settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { newGame } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

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

/** A game at a map's spawn with these flags (a save loaded there). */
function at(map: string, spawn: string, flags: FlagSnapshot): Sim {
  const state = newGame(maps[map]!, spawn);
  state.flags.load(flags);
  const sim = new Sim(new GameLogic(maps, CONTENT, state));
  sim.logic.enterMap();
  return sim;
}

const DUSK: FlagSnapshot = { ...starts['6']!.flags, 'story.skarragol_arrived': true, 'story.fair_seen': true, 'story.moot_seen': true, 'party.bayarmaa': true, 'story.fjord_set_out': true, 'story.fjord_seen': true };
const scriptLines = (id: string) => Object.values(CONTENT.dialogue[id]!.nodes).flatMap((n) => n.lines.map((l) => ({ ...l, speaker: l.speaker ?? n.speaker ?? '' })));
const allLines = SKARRAGOL_DIALOGUE.flatMap((d) => scriptLines(d.id).map((l) => ({ d: d.id, ...l })));

describe('the chapter starts', () => {
  it('Chapter 6\'s card closes on the quay and the longship sails south to Kirinoura (Chapter 7)', () => {
    const sim = simAt('chapter6-end');
    expect(sim.logic.mode).toBe('card');
    sim.press('confirm');
    expect(sim.logic.state.player.mapId).toBe('kuroshi-pier');
    expect(sim.logic.dialogueId).toBe('pier_arrive');
  });

  it('Chapter 5\'s card closes at the Iron Gate and the party walks up the winter road onto the plateau', () => {
    const sim = simAt('chapter5-end');
    expect(sim.logic.mode).toBe('card');
    sim.press('confirm');
    expect(sim.logic.state.player.mapId).toBe('skarragol-plateau');
    expect(sim.logic.dialogueId).toBe('plateau_arrive');
  });

  it('?chapter=6: the Winter Plateau road with the party of Chapter 5, the arrival plays, the ambushes switch on', () => {
    const at6 = starts['6']!;
    expect(at6.map).toBe('skarragol-plateau');
    const state = newGame(maps[at6.map]!, at6.spawn);
    state.flags.load(at6.flags);
    const logic = new GameLogic(maps, CONTENT, state);
    expect(partyMembers(state.flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira']);
    logic.enterMap();
    expect(logic.dialogueId).toBe('plateau_arrive');
    expect(state.flags.isSet('story.skarragol_arrived')).toBe(true);
  });

  it('?chapter=7: Kirinoura\'s pier off the longship, Bayarmaa with them, the token and Torvald\'s letter in the bag', () => {
    const at7 = starts['7']!;
    const flags = new FlagStore(at7.flags);
    expect(at7.map).toBe('kuroshi-pier');
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa']);
    for (const f of ['act6.complete', 'card.act6_end', 'item.token_ironvow', 'item.torvald_letter', 'ally.skarragol', 'story.bayarmaa_cleared']) expect(flags.isSet(f), f).toBe(true);
  });
});

describe('the owner\'s rules as content checks', () => {
  it('Salkhi never speaks in a scene with Anissa\'s lines in it, and never about her', () => {
    for (const d of SKARRAGOL_DIALOGUE) {
      const ls = scriptLines(d.id);
      const salkhi = ls.filter((l) => l.speaker === 'salkhi');
      if (salkhi.length === 0) continue;
      expect(ls.some((l) => l.speaker === 'anissa' || l.speaker === 'anissa_far'), d.id).toBe(false);
      for (const l of salkhi) expect(l.text, d.id).not.toMatch(/Anissa|small one|little one|the girl/i);
    }
  });

  it('no line joins the Crown or the Regent to the girl who glows (that join is Chapter 9\'s)', () => {
    for (const l of allLines) {
      if (/\b(Crown|Regent)\b/.test(l.text)) expect(l.text, l.d).not.toMatch(/glow|little one/i);
    }
  });

  it('Anissa is never a foe\'s target: no Chapter 6 enemy move seizes or aims at her, and her lines never joke', () => {
    for (const id of ['steppe_wolf', 'steppe_reaver', 'camp_lookout', 'ordu_champion', 'grimvald']) for (const m of ENEMIES[id]!.moves) expect(m.seize, `${id}/${m.name}`).toBeUndefined();
    const anissa = allLines.filter((l) => l.speaker === 'anissa');
    expect(anissa.length).toBeGreaterThan(3);
    for (const l of anissa) expect(l.text).not.toMatch(/ha!|\bjoke|funny/i);
  });

  it('nobody dies: Grimvald, the reavers, the lookout and the champion withdraw at 0 HP', () => {
    for (const id of ['grimvald', 'steppe_reaver', 'camp_lookout', 'ordu_champion']) expect(ENEMIES[id]!.withdraws, id).toBeDefined();
  });
});

describe('the Moot and the gate until the horn', () => {
  it('Bayarmaa joins at the Moot under the envoy\'s bond and walks with the party; she fights in her own chapter', () => {
    const sim = simAt('ordvik-moot');
    const flags = sim.logic.state.flags;
    expect(flags.isSet('party.bayarmaa')).toBe(true);
    const party = battleParty(flags, RPG, SKILL_BOOK);
    // The first four fight: Gianna, then Bayarmaa (she leads until the chapter ends), then the roster.
    expect(party.map((p) => p.id)).toEqual(['gianna', 'bayarmaa', 'yari', 'azzy', 'samira']);
    flags.set('act6.complete', true);
    expect(battleParty(flags, RPG, SKILL_BOOK).map((p) => p.id)).toEqual(['gianna', 'yari', 'azzy', 'samira', 'bayarmaa']);
  });

  it('the fjord path stays shut until the three are done, and Bayarmaa says what is left', () => {
    const sim = simAt('ordvik-saga');
    const door = maps['skarragol-fair']!.doors.find((d) => d.id === 'fair_fjord')!;
    expect(sim.logic.doorOpen(door)).toBe(false);
    sim.logic.closedDoor(door);
    const said: string[] = [];
    for (let i = 0; i < 20 && sim.logic.mode === 'dialogue'; i++) {
      const v = sim.logic.view();
      if (v.kind !== 'end') said.push(v.text);
      sim.press('confirm');
    }
    expect(said).toContain('The herders are still counting sacks.');
    expect(said).toContain('The traders are still shouting.');
    expect(said).not.toContain('The white coat is still in the field.');
  });

  it('dusk comes when the third thing is done, and lasts until the standard comes home at dawn', () => {
    const mood = MAP_MOODS.find((m) => m.maps.includes('skarragol-fair'))!;
    const day = new FlagStore({ 'side.grandson.done': true, 'side.winter_stores.done': true });
    expect(evaluate(mood.if, day)).toBe(false);
    day.set('debate.skarragol_oath.settled', true);
    expect(evaluate(mood.if, day)).toBe(true);
    day.set('story.standard_home', true);
    expect(evaluate(mood.if, day)).toBe(false);
  });
});

describe('the frozen fjord (SIG-SKA)', () => {
  const fjord = maps['skarragol-fjord']!;
  it('every zone is a floe in both eras; between them each stretch is walkable in exactly one era', () => {
    for (const z of FJORD.zones) for (let x = z.x; x < z.x + z.w; x++) for (let y = z.y; y < z.y + z.h; y++) {
      expect(isWalkable(fjord, 'present', { x, y }) && isWalkable(fjord, 'echo', { x, y }), `${x},${y}`).toBe(true);
    }
    // The ice then (stretches 1, 3, 5); the floes now (2, 4).
    for (const [x, y] of [[6, 24], [17, 19], [28, 15]]) expect([isWalkable(fjord, 'echo', { x, y }), isWalkable(fjord, 'present', { x, y })]).toEqual([true, false]);
    for (const [x, y] of [[12, 22], [23, 17]]) expect([isWalkable(fjord, 'present', { x, y }), isWalkable(fjord, 'echo', { x, y })]).toEqual([true, false]);
  });

  it('five swaps cross it, and Sarnai\'s raid plays as Patricio steps onto the far shore in the memory, with no sixth', () => {
    const sim = at('skarragol-fjord', 'fjord_path', DUSK);
    const before = sim.pressed.length;
    sim.run(readJson<string[]>('puzzles/skarragol_fjord/solution.json'));
    expect(sim.pressed.slice(before).filter((c) => c === 'echo').length).toBe(5);
    expect(sim.logic.state.flags.isSet('clue.herd_whistle')).toBe(true);
    expect(sim.logic.era).toBe('echo');
    // The memory's own flags go on the way back; the whistle (a clue) stays.
    sim.press('echo');
    expect(sim.logic.era).toBe('present');
    expect(sim.logic.state.flags.isSet('clue.herd_whistle')).toBe(true);
    expect(sim.logic.state.flags.isSet('echo.raid_ridden')).toBe(false);
  });

  it('a player back in the present on the far shore before the raid sees it on the next Echo there (the zone\'s onEcho)', () => {
    const z6 = FJORD.zones[5]!;
    const sim = at('skarragol-fjord', 'fjord_path', { ...DUSK, 'story.fjord_crossed': true });
    sim.logic.state.player.pos = { x: z6.x + 1, y: z6.y };
    sim.press('echo');
    expect(sim.logic.dialogueId).toBe('raid_onecho');
    sim.press('skip');
    expect(sim.logic.state.flags.isSet('clue.herd_whistle')).toBe(true);
  });

  it('the herd: six horses, one place each at a time; two whistles open both gaps, the approach unseen', () => {
    for (const h of HERD) {
      for (const state of [{}, { 'story.herd_called': true }, { 'story.herd_called': true, 'story.herd_called_2': true }] as FlagSnapshot[]) {
        const flags = new FlagStore(state);
        expect(maps['skarragol-fjord']!.npcs.filter((n) => n.npc === h.id && evaluate(n.if, flags)), h.id).toHaveLength(1);
      }
    }
    const sim = simAt('ordvik-raid');
    sim.run(['echo', 'goto 20,10', 'up', 'confirm', 'skip']);
    const flags = sim.logic.state.flags;
    expect(flags.isSet('story.herd_called')).toBe(true);
    expect(sim.logic.npcs().some((n) => n.pos.x === FJORD.westGap.x && n.pos.y === FJORD.westGap.y)).toBe(false);
    sim.run(['goto 12,6', 'up', 'confirm', 'skip']);
    expect(flags.isSet('story.herd_unseen')).toBe(true);
    expect(sim.logic.npcs().some((n) => n.pos.x === FJORD.eastGap.x && n.pos.y === FJORD.eastGap.y)).toBe(false);
  });

  it('the fail-safe: talking to a lookout is a fight, and after it the gaps are open (no stealth needed, no soft-lock)', () => {
    const sim = simAt('ordvik-raid');
    sim.run(['echo', 'goto 9,9', 'up', 'confirm', 'skip']);
    expect(sim.battles.at(-1)).toBe('camp_lookouts');
    const flags = sim.logic.state.flags;
    expect(flags.isSet('story.lookouts_beaten')).toBe(true);
    expect(flags.isSet('story.herd_unseen')).toBe(false);
    expect(sim.logic.npcs().some((n) => n.npc.startsWith('lookout_'))).toBe(false);
    sim.run(['goto 27,4', 'goto 27,3', 'skip']);
    expect(sim.battles.at(-1)).toBe('fjord_grimvald');
  });
});

/** A fair player for Grimvald: Surge when Anissa is ready, Guard on his tell, heal the badly hurt, else hit hardest. */
function grimvaldAction(b: Battle, warned: boolean): Action {
  const me = b.actor!;
  const foes = b.enemies.filter((e) => !e.down);
  const boss = foes.find((e) => e.enemyId === 'grimvald');
  if (b.canSurge()) return { kind: 'surge' };
  if (warned) return { kind: 'guard' };
  const heal = me.skills.find((s) => s.kind === 'heal' && s.target === 'ally' && !s.gold && b.canUse(me, s));
  const hurt = b.fighters.filter((a) => !a.down).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0];
  if (heal && hurt && hurt.hp / hurt.maxHp < 0.4) return { kind: 'skill', skill: heal.id, target: hurt.key };
  const pick = foes.find((e) => e.enemyId !== 'grimvald') ?? boss ?? foes[0]!;
  const best = me.skills.filter((s) => s.kind === 'damage' && s.target === 'enemy' && !s.gold && b.canUse(me, s)).sort((x, y) => y.power - x.power)[0];
  return best ? { kind: 'skill', skill: best.id, target: pick.key } : { kind: 'attack', target: pick.key };
}

function playGrimvald(seed: number, flags: FlagStore): { won: boolean; events: BattleEvent[] } {
  const def = BATTLES.fjord_grimvald!;
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), battleItems(flags, RPG), { seed, reserve: battleReserve(def) });
  const events: BattleEvent[] = [...b.start()];
  let warned = false;
  for (let i = 0; i < 400 && !b.outcome; i++) {
    const evs = b.act(grimvaldAction(b, warned));
    for (const e of evs) {
      if (e.kind === 'text' && e.text.includes('turns his horse')) warned = true;
      if ((e.kind === 'damage' || e.kind === 'miss') && e.move === 'Trample') warned = false;
    }
    events.push(...evs);
  }
  return { won: b.outcome === 'won', events };
}

describe('Noyan Grimvald (the review\'s 3.3)', () => {
  const flags = simAt('ordvik-herd').logic.state.flags;
  const runs = Array.from({ length: 30 }, (_, i) => playGrimvald(i + 1, flags));

  it('a fair player wins at the route\'s level, and the fight is paid by data (120 XP); Game Over applies', () => {
    expect(runs.filter((r) => r.won).length).toBeGreaterThanOrEqual(28);
    expect(BATTLES.fjord_grimvald!.rewards.xp).toBe(120);
    expect(BATTLES.fjord_grimvald!.meantToLose).toBeUndefined();
    expect(BATTLES.fjord_grimvald!.boss).toBe(true);
  });

  it('every won fight shows all three phases in order: unhorsed, then the standard falls, then he yields', () => {
    for (const r of runs.filter((x) => x.won)) {
      const texts = r.events.flatMap((e) => (e.kind === 'text' ? [e.text] : []));
      const horse = texts.indexOf('Horse! To me!');
      const falls = texts.findIndex((t) => t.startsWith('The Ironvow standard falls from his hand'));
      const yields = texts.indexOf('Enough! The standard is yours. Keep the horse.');
      expect(horse).toBeGreaterThan(-1);
      expect(falls).toBeGreaterThan(horse);
      expect(yields).toBeGreaterThan(falls);
    }
  });

  it('a Surge made before he is unhorsed does not carry the standard\'s fall in with it (a Surge counts in its own phase)', () => {
    for (const r of runs.filter((x) => x.won)) {
      const i = r.events.findIndex((e) => e.kind === 'text' && e.text === 'Horse! To me!');
      const next = r.events.slice(i + 1, i + 6).filter((e) => e.kind === 'text').map((e) => (e as { text: string }).text);
      expect(next.some((t) => t.startsWith('The Ironvow standard falls'))).toBe(false);
    }
  });

  it('the start tip names the answer: the skills, and Guard on the Trample', () => {
    expect(BATTLES.fjord_grimvald!.tips?.start).toMatch(/light/);
    expect(BATTLES.fjord_grimvald!.tips?.start).toMatch(/Guard/);
  });
});

describe('Bayarmaa\'s skills (COMBAT 9.4)', () => {
  const skill = (id: string) => SKILLS.bayarmaa!.find((s) => s.id === id)!;
  it('Raider\'s Charge halves her wait; The Great Raid gives her the next turn at once, once a battle; Hoofbeat stuns', () => {
    expect(skill('raiders_charge').weight).toBe(0.5);
    expect(skill('great_raid').weight).toBe(0);
    expect(skill('great_raid').once).toBe(true);
    expect(skill('hoofbeat').statuses).toEqual(['stunned']);
    expect(skill('hoofbeat').bossChance).toBe(0.25);
    const flags = simAt('ordvik-moot').logic.state.flags;
    const def = BATTLES.winter_wolves!;
    const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ({ ...ENEMIES[id]!, level: 16 })), [], { seed: 3 });
    b.start();
    // Ironvow's Oath: she acts before the rest of the party.
    const firstParty = (() => {
      for (let i = 0; i < 20; i++) {
        if (b.actor?.side === 'party') return b.actor.key;
        b.act({ kind: 'guard' });
      }
      return null;
    })();
    expect(firstParty).toBe('bayarmaa');
    const foe = b.enemies.find((e) => !e.down)!;
    b.act({ kind: 'skill', skill: 'great_raid', target: foe.key });
    expect(b.actor?.key).toBe('bayarmaa');
  });
});

describe('the side quests (S-5 and S-3) and the debate', () => {
  it('S-5\'s three answers are remembered for the Claim, each with its pillar; the bout ends by her stepping back', () => {
    const sim = simAt('ordvik-saga');
    expect(sim.logic.state.flags.get('choice.azzy_ordu')).toBe('influence');
    expect(localPillar(sim.logic.state.flags, RPG, 'influence', 'skarragol')).toBeGreaterThanOrEqual(2);
    // Fear: the champion's bout.
    const fear = simAt('ordvik-moot');
    fear.run(['goto 17,25', 'goto 34,9', 'up', 'confirm', 'confirm*6', 'down', 'confirm', 'skip']);
    expect(fear.logic.state.flags.get('choice.azzy_ordu')).toBe('fear');
    expect(fear.battles.at(-1)).toBe('ordu_bout');
    expect(fear.logic.state.flags.isSet('side.grandson.bout_won')).toBe(true);
    expect(localPillar(fear.logic.state.flags, RPG, 'fear', 'skarragol')).toBe(2);
    // Share: the corral rail.
    const share = simAt('ordvik-moot');
    share.run(['goto 17,25', 'goto 34,9', 'up', 'confirm', 'confirm*6', 'down*2', 'confirm', 'skip']);
    expect(share.logic.state.flags.get('choice.azzy_ordu')).toBe('share');
    expect(share.logic.state.flags.isSet('side.grandson.done')).toBe(true);
  });

  it('S-3: the wolves, the boulder rolled in the memory, the wall now, the fourth thumbprint; its Echo waits for the fight', () => {
    const flags = simAt('ordvik-dusk').logic.state.flags;
    for (const f of ['side.winter_stores.wolves', 'anchor.wolf_run', 'side.winter_stores.done']) expect(flags.isSet(f), f).toBe(true);
    const zone = maps['skarragol-plateau']!.echoZones[0]!;
    expect(evaluate(zone.if, new FlagStore({ 'item.sun_locket': true }))).toBe(false);
  });

  it('the required three close if the story is somehow past them (a quest never dangles)', () => {
    const flags = new FlagStore({ 'side.grandson.accepted': true, 'side.winter_stores.accepted': true, 'debate.skarragol_oath.listened': true, 'story.fjord_crossed': true });
    for (const id of ['grandson', 'winter_stores', 'oath']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('closed');
    expect(closedNotes(SIDE_QUESTS, flags).map((n) => n.id)).toEqual(['grandson', 'winter_stores', 'oath']);
  });
});

describe('the horn, the price and the token (the review\'s 3.6)', () => {
  it('on the route: the purse, Samira\'s salt, the jarl\'s gold and the stores make Wealth 8 of 10; the alliance and the token', () => {
    const flags = simAt('chapter6-end').logic.state.flags;
    // The field pays finished side quests as it goes (S-3's +1 Wealth); the headless route settles them here.
    settleRewards(flags, RPG, SIDE_QUESTS);
    expect(localPillar(flags, RPG, 'wealth', 'skarragol')).toBe(8);
    for (const f of ['ally.skarragol', 'item.token_ironvow', 'item.torvald_letter', 'story.bayarmaa_cleared', 'choice.grimvald_spared']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.get('item.crown_purse')).toBe(false);
  });

  it('keeping the purse pays its 300 gold into the bag instead of Wealth on the table', () => {
    const sim = simAt('ordvik-horn');
    // Back to the moment before the horn: the same scene with the other choice.
    const fresh = simAt('ordvik-dawn');
    // The side quests are paid before the horn, as the field pays them.
    settleRewards(fresh.logic.state.flags, RPG, SIDE_QUESTS);
    const before = gold(fresh.logic.state.flags, RPG);
    fresh.run(['goto 22,9', 'goto 17,6']);
    for (let i = 0; i < 200 && fresh.logic.mode === 'dialogue'; i++) {
      const v = fresh.logic.view();
      if (v.kind === 'choice' && v.choices.some((c) => c.text === 'Keep the purse.')) {
        fresh.press('down');
        fresh.press('confirm');
      } else if (v.kind === 'choice' && v.choices.some((c) => c.text === 'Not this time.')) {
        fresh.press('down');
        fresh.press('confirm');
      } else fresh.press('confirm');
    }
    expect(fresh.logic.state.flags.isSet('ally.skarragol')).toBe(true);
    expect(gold(fresh.logic.state.flags, RPG)).toBe(before + 300);
    settleRewards(fresh.logic.state.flags, RPG, SIDE_QUESTS);
    expect(localPillar(fresh.logic.state.flags, RPG, 'wealth', 'skarragol')).toBe(2);
    expect(sim.logic.state.flags.isSet('story.standard_planted')).toBe(true);
  });
});
