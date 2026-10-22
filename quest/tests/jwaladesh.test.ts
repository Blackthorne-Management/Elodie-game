// Chapter 8, The Dying Flame (Agnipur; docs/quest/reviews/2026-10-22-chapter8-outline.md with its second review): the
// chapter starts (?chapter=8 and 9), the owner's rules as content checks (Salkhi, Anissa, Vikram's breath, Aiyana's and
// the carter's lines against the locked rule, the Crown never joined to the girl who glows), the Court's doors, the day
// until the night lamp (a condition), Vikram as a fighter who leads in his own chapter, the duel (Gianna alone, a
// sparring match that ends either way), the relay's gusts and the runners' way, Arjun's anchors, the roof mirrors (the
// beam only when the route is right), Seth Dhanraj against two bots, the side quests closing, the price and the token.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MAP_MOODS } from '../src/assets.config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, battleReserve } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { JWALADESH_DIALOGUE } from '../src/data/dialogue/jwaladesh.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { Battle, battleItems, battleParty, type Action, type BattleEvent } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { recordLoss } from '../src/engine/gameOver.ts';
import { localPillar, partyMembers } from '../src/engine/rpg.ts';
import { closedNotes, settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { newGame } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { skillsAction } from '../tools/battle-sim.ts';
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

/** Play the route on from one marker to the next with this game (its own battle handler). */
function runBetween(sim: Sim, from: string, to: string): void {
  let on = false;
  for (const item of route) {
    if (item.kind === 'mark' && item.name === from) on = true;
    else if (item.kind === 'mark' && item.name === to && on) return;
    else if (on) sim.run([item]);
  }
}

type Line = { d: string; node: string; speaker: string; text: string };
const allLines: Line[] = JWALADESH_DIALOGUE.flatMap((d) =>
  Object.entries(d.nodes).flatMap(([node, n]) => n.lines.map((l) => ({ d: d.id, node, speaker: l.speaker ?? n.speaker ?? '', text: l.text }))),
);
const byScript = (id: string) => allLines.filter((l) => l.d === id);

/** Read every line of a dialogue now, pressing A (the first choice), and return the texts. */
function said(logic: GameLogic): string[] {
  const out: string[] = [];
  for (let i = 0; i < 80 && logic.mode === 'dialogue'; i++) {
    const v = logic.view();
    if (v.kind !== 'end') out.push(v.text);
    if (v.kind === 'choice') logic.choose(v.choices[0]!.index);
    else logic.advance();
  }
  return out;
}

describe('the chapter starts', () => {
  it('?chapter=8: Agnipur\'s quay off the Zetwal trader with the party of Chapter 7, the landing plays', () => {
    const at8 = starts['8']!;
    expect([at8.map, at8.spawn]).toEqual(['jwaladesh-harbor', 'landing']);
    const state = newGame(maps[at8.map]!, at8.spawn);
    state.flags.load(at8.flags);
    const logic = new GameLogic(maps, CONTENT, state);
    expect(partyMembers(state.flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru']);
    logic.enterMap();
    expect(logic.dialogueId).toBe('harbor_arrive');
    expect(state.flags.isSet('story.jwaladesh_arrived')).toBe(true);
    // The Salt Flats' pans roll from the landing on; the salt road itself never does.
    const flats = maps['jwaladesh-saltflats']!;
    expect(flats.encounters.length).toBe(2);
    for (const z of flats.encounters) {
      expect(z.table).toBe('salt_flats');
      expect(evaluate(z.if, state.flags)).toBe(true);
      expect(z.area.y + z.area.height <= 13 || z.area.y >= 15).toBe(true);
    }
  });

  it('?chapter=9: Agnipur\'s quay after the card, Vikram with them, the ledger and three tokens in hand', () => {
    const at9 = starts['9']!;
    const flags = new FlagStore(at9.flags);
    expect(at9.map).toBe('jwaladesh-harbor');
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram']);
    for (const f of ['act8.complete', 'card.act8_end', 'ally.jwaladesh', 'item.token_agnivansh', 'item.token_suzumori', 'item.token_ironvow', 'item.dhanraj_ledger', 'clue.crown_holds_oil', 'story.vikram_left_agnipur', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
  });
});

describe('the owner\'s rules as content checks', () => {
  it('Salkhi never speaks in a scene with Anissa\'s lines in it, and never about her', () => {
    for (const d of JWALADESH_DIALOGUE) {
      const ls = byScript(d.id);
      const salkhi = ls.filter((l) => l.speaker === 'salkhi');
      if (salkhi.length === 0) continue;
      expect(ls.some((l) => l.speaker === 'anissa'), d.id).toBe(false);
      for (const l of salkhi) expect(l.text, d.id).not.toMatch(/Anissa|small one|little one|the girl/i);
    }
  });

  it('Vikram\'s breathing is never in a node with Anissa\'s lines (the outline\'s own test)', () => {
    for (const d of JWALADESH_DIALOGUE) {
      for (const node of Object.keys(d.nodes)) {
        const ls = allLines.filter((l) => l.d === d.id && l.node === node);
        if (!ls.some((l) => l.speaker === 'anissa')) continue;
        for (const l of ls.filter((x) => x.speaker === 'vikram')) expect(l.text, `${d.id}/${node}`).not.toMatch(/\.\.\.|breath/i);
      }
    }
  });

  it('Aiyana says what she measures: never Cenizal, never her brother\'s goodness, the arrows or the thumbprints', () => {
    const aiyana = allLines.filter((l) => l.speaker === 'aiyana');
    expect(aiyana.length).toBeGreaterThan(15);
    for (const l of aiyana) expect(l.text, l.d).not.toMatch(/\bgood\b|innocent|feeds|the arrows|thumbprint|Cenizal|Rael|Rodriguez|Locket/i);
    // The second review's 3.5: no rod line, no "Cenizal on a roof".
    expect(aiyana.map((l) => l.text).join(' ')).not.toMatch(/held it level|on a roof/i);
  });

  it('the carter says the back gate to Gianna\'s face, then sets off down the road while the next line reads (never spoken from off the map)', () => {
    const seals = JWALADESH_DIALOGUE.find((d) => d.id === 'salt_road_after')!.nodes['seals']!.lines;
    const said = seals.findIndex((l) => l.text.startsWith('The Court\'s back gate.'));
    expect(seals[said]!.stage ?? []).toEqual([]);
    const off = seals[said + 1]!;
    expect(off.stage).toEqual([expect.objectContaining({ do: 'exit', actor: 'npc:carter', async: true })]);
    expect(off.set?.['story.salt_road_cleared']).toBe(true);
  });

  it('the carter gives the thumbprints no man behind them; Azzy\'s line ends on Gianna\'s, and he says nothing', () => {
    const carter = allLines.filter((l) => l.speaker === 'carter');
    for (const l of carter) expect(l.text).not.toMatch(/\bhe\b|\bhim\b|\bhis\b/i);
    expect(carter.map((l) => l.text)).toContain('Seven, if you count right. Somebody is feeding the realm. Not for a goddess.');
    const north = byScript('price_scene').filter((l) => l.node === 'north').map((l) => l.text);
    expect(north.indexOf('Then they know what he is.')).toBeLessThan(north.indexOf('Azzy looks at his hands, and says nothing.'));
    expect(north.join(' ')).not.toMatch(/what you are/);
  });

  it('nobody joins the Crown to the girl who glows; Anissa is never a foe\'s target and never jokes', () => {
    for (const l of allLines) if (/\b(Crown|Regent)\b/.test(l.text)) expect(l.text, l.d).not.toMatch(/glow|little one/i);
    for (const id of ['oil_enforcer', 'store_enforcer', 'ember_jackal', 'vikram_duel', 'seth_dhanraj']) {
      for (const m of ENEMIES[id]!.moves) {
        expect(m.seize, `${id}/${m.name}`).toBeUndefined();
        if (m.ally) expect(m.ally).toBe(id === 'seth_dhanraj' ? 'seth_dhanraj' : undefined);
      }
    }
    const anissa = allLines.filter((l) => l.speaker === 'anissa');
    expect(anissa.length).toBeGreaterThan(5);
    for (const l of anissa) expect(l.text).not.toMatch(/ha!|\bjoke|funny|just saying/i);
  });

  it('nobody dies: the Seth, his enforcers and Vikram withdraw at 0 HP; the flame was never out', () => {
    for (const id of ['seth_dhanraj', 'oil_enforcer', 'store_enforcer', 'vikram_duel']) expect(ENEMIES[id]!.withdraws, id).toBeDefined();
    expect(allLines.map((l) => l.text)).toContain('Low. Never out. And everyone in the colonnade can see it.');
    expect(allLines.map((l) => l.text).join(' ')).not.toMatch(/wick catches/i);
  });
});

describe('the Court, the duel and the day until the night lamp', () => {
  it('the Court\'s doors wait for Aiyana; the chamberlain says noon', () => {
    const door = maps['jwaladesh-bazaar']!.doors.find((d) => d.id === 'bazaar_court')!;
    expect(evaluate(door.if, new FlagStore({ 'story.vikram_seen': true }))).toBe(false);
    expect(evaluate(door.if, new FlagStore({ 'story.aiyana_met': true }))).toBe(true);
    expect(door.closed).toBe('court_doors_wait');
  });

  it('the duel is Gianna alone, a sparring match: no goddess, no Grudge, no XP, and the same scene after it, either way', () => {
    const def = BATTLES.duel_yard_vikram!;
    expect(def.fighters).toEqual(['gianna']);
    expect(def.meantToLose?.scene).toBe('vikram_after');
    expect(def.rewards).toEqual({ xp: 0, gold: 0 });
    const flags = simAt('jwaladesh-court').logic.state.flags;
    const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), [], { seed: 3, reserve: battleReserve(def) });
    expect(b.party.map((p) => p.key)).toEqual(['gianna']);
    // Lost: the scene plays with the lost line; won: with the won line, and choice.duel_won.
    for (const lost of [true, false]) {
      const s = simAt('jwaladesh-court');
      const win = s.onBattle!;
      s.onBattle = (id) => {
        const d = BATTLES[id]!;
        if (!d.meantToLose) return win(id);
        if (lost) recordLoss(s.logic.state.flags, d);
        return s.logic.battleOver(!lost, d.meantToLose.scene);
      };
      // On along the route from the bazaar to the Court's colonnade, the duel, and the scene after it.
      runBetween(s, 'jwaladesh-court', 'jwaladesh-day');
      expect(s.battles.at(-1)).toBe('duel_yard_vikram');
      const f = s.logic.state.flags;
      expect(f.isSet('story.court_heard')).toBe(true);
      expect(f.isSet('choice.duel_lost')).toBe(lost);
      expect(f.isSet('choice.duel_won')).toBe(!lost);
    }
  });

  it('the night is a condition: it comes when the third of the day\'s things is done, and ends when the store is opened', () => {
    const mood = MAP_MOODS.find((m) => m.maps.includes('jwaladesh-bazaar'))!;
    const day = new FlagStore({ 'side.lamp_relay.done': true, 'side.anonymous_oil.done': true });
    expect(evaluate(mood.if, day)).toBe(false);
    day.set('debate.jwaladesh_hesitation.settled', true);
    expect(evaluate(mood.if, day)).toBe(true);
    day.set('story.dhanraj_beaten', true);
    expect(evaluate(mood.if, day)).toBe(false);
  });

  it('the chain tower stays shut until the night lamp, and its guard says what is left', () => {
    const sim = simAt('jwaladesh-day');
    const gate = maps['jwaladesh-harbor']!.triggers.find((t) => t.id === 'tower_open')!;
    expect(evaluate(gate.if, sim.logic.state.flags)).toBe(false);
    expect(evaluate(gate.if, simAt('jwaladesh-night').logic.state.flags)).toBe(true);
    expect(JSON.stringify(CONTENT.dialogue.tower_enforcer_talk!.nodes)).toContain('The runners are still on the temple steps, Gigi.');
  });
});

describe('the relay (J-2; M-JWA-1): the runners\' way, not the main street', () => {
  it('on the main street the wind puts the lamp out and the run starts again from the stair\'s head', () => {
    const sim = simAt('jwaladesh-day');
    const flags = sim.logic.state.flags;
    flags.set('side.lamp_relay.accepted', true);
    flags.set('clue.relay_route', true);
    flags.set('item.relay_lamp', true);
    sim.logic.state.player.mapId = 'jwaladesh-bazaar';
    const fresh = newGame(maps['jwaladesh-bazaar']!, 'stair_head');
    fresh.flags.load(flags.snapshot());
    const s = new Sim(new GameLogic(maps, CONTENT, fresh));
    s.run(['up*7', 'skip']);
    expect(s.logic.state.player.pos).toEqual({ x: 21, y: 27 });
    expect(s.logic.state.flags.isSet('side.lamp_relay.done')).toBe(false);
    // With the lamp in hand the bazaar's doors stay shut: the lamp goes up the hill.
    const harbor = maps['jwaladesh-bazaar']!.doors.find((d) => d.id === 'bazaar_harbor')!;
    expect(s.logic.doorOpen(harbor)).toBe(false);
  });

  it('on the route the lamp went up the runners\' way: no gust, and the bracelet paid', () => {
    const flags = simAt('jwaladesh-night').logic.state.flags;
    for (const f of ['side.lamp_relay.done', 'clue.relay_route']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet('item.relay_lamp')).toBe(false);
  });
});

describe('Arjun\'s night and the roofs (SIG-JWA)', () => {
  it('the lamp and the mirror are Echo objects whose change is read by the present lamp, bracket and beam', () => {
    const h = maps['jwaladesh-harbor']!;
    expect(h.anchors.map((a) => [a.object, a.flag]).sort()).toEqual([['arjun_bracket', 'anchor.tower_mirror'], ['arjun_lamp', 'anchor.chain_lamp']]);
    const lit = h.objects.find((o) => o.id === 'chain_lamp_lit')!;
    expect(evaluate(lit.if, new FlagStore({ 'anchor.chain_lamp': true }))).toBe(true);
    // Arjun stands beside the platform, not on it (the validator's rule; the review's 3.8 (7)).
    const zone = h.echoZones[0]!.area;
    const arjun = h.npcs.find((n) => n.npc === 'arjun')!;
    expect(arjun.pos.x >= zone.x && arjun.pos.x < zone.x + zone.width && arjun.pos.y === zone.y).toBe(false);
  });

  it('on the route: two hands on the taper, the mirror bolted, the charge played; the roofs open on both anchors', () => {
    const flags = simAt('jwaladesh-roofs').logic.state.flags;
    for (const f of ['clue.arjun_seen', 'anchor.chain_lamp', 'anchor.tower_mirror', 'clue.arjun_charge', 'story.rooftops_entered']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.get('choice.patricio_arjun')).toBe('seven');
    const ladder = maps['jwaladesh-bazaar']!.doors.find((d) => d.id === 'bazaar_roofs')!;
    expect(evaluate(ladder.if, new FlagStore({ 'anchor.chain_lamp': true }))).toBe(false);
  });

  it('the beam is drawn only when the route is right; the old line lands on brick', () => {
    const roofs = maps['jwaladesh-rooftops']!;
    const beams = roofs.objects.filter((o) => /^beam_\d$/.test(o.id));
    expect(beams.length).toBe(4);
    const right = new FlagStore({ 'anchor.chain_lamp': true, 'anchor.tower_mirror': true, 'mirror.1_e': true, 'mirror.2_n': true, 'mirror.3_n': true });
    for (const b of beams) expect(evaluate(b.if, right)).toBe(false);
    right.set('story.beam_at_temple', true);
    for (const b of beams) expect(evaluate(b.if, right)).toBe(true);
    const brick = roofs.objects.find((o) => o.id === 'beam_brick')!;
    expect(evaluate(brick.if, new FlagStore({ 'anchor.chain_lamp': true, 'anchor.tower_mirror': true, 'mirror.1_n': true }))).toBe(true);
  });

  it('Anissa holds the last mirror (the disc is hers after), and Vikram\'s Keeper line is no joke', () => {
    const flags = simAt('jwaladesh-flame').logic.state.flags;
    for (const f of ['story.beam_at_temple', 'item.aiyana_disc']) expect(flags.isSet(f), f).toBe(true);
    expect(allLines.find((l) => l.speaker === 'vikram' && /Keeper of the Flame/.test(l.text))).toBeDefined();
  });
});

describe('Vikram joins at the flame and leads in his chapter', () => {
  it('he tears the curtain and joins before the boss; he fights second, after Gianna, until the chapter ends', () => {
    const flags = simAt('jwaladesh-store').logic.state.flags;
    for (const f of ['story.flame_seen', 'party.vikram', 'story.anissa_keeper']) expect(flags.isSet(f), f).toBe(true);
    expect(battleParty(flags, RPG, SKILL_BOOK).map((p) => p.id)).toEqual(['gianna', 'vikram', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru']);
    const vikram = battleParty(flags, RPG, SKILL_BOOK).find((p) => p.id === 'vikram')!;
    expect(vikram.passives?.map((p) => p.kind)).toEqual(['spLess', 'turnOnFell']);
    expect(vikram.skills.some((s) => s.id === 'ember_cut' && s.element === 'fire')).toBe(true);
    flags.set('act8.complete', true);
    expect(battleParty(flags, RPG, SKILL_BOOK).map((p) => p.id)).toEqual(['gianna', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram']);
  });
});

/** A fair player (tools/battle-sim.ts `skills`), or one who only presses Attack. */
function playDhanraj(seed: number, flags: FlagStore, plan: 'skills' | 'attack'): { won: boolean; events: BattleEvent[]; falls: number; turns: number } {
  const def = BATTLES.oil_store_dhanraj!;
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

describe('Seth Dhanraj (the review\'s 3.1)', () => {
  const flags = simAt('jwaladesh-store').logic.state.flags;
  const fair = Array.from({ length: 30 }, (_, i) => playDhanraj(i + 1, flags, 'skills'));
  const plain = Array.from({ length: 30 }, (_, i) => playDhanraj(i + 1, flags, 'attack'));

  it('a player who uses the kit wins at the route\'s level, not without danger; Attack alone loses, and the tip names the answer', () => {
    expect(fair.filter((r) => r.won).length).toBe(30);
    expect(fair.some((r) => r.falls > 0)).toBe(true);
    expect(fair.reduce((n, r) => n + r.falls, 0) / 30).toBeLessThan(1.5);
    expect(plain.filter((r) => r.won).length).toBeLessThanOrEqual(3);
    // The enforcers step in front of him: the plain bot is never faster than the fair one.
    const avg = (rs: typeof fair) => rs.reduce((n, r) => n + r.turns, 0) / rs.length;
    expect(avg(plain)).toBeGreaterThan(avg(fair));
    const def = BATTLES.oil_store_dhanraj!;
    expect(def.tips?.start).toMatch(/Surge/);
    expect(def.tips?.start).toMatch(/fire/i);
    // The tip says his oil takes fire once the wall is down: he does not resist fire.
    expect(ENEMIES.seth_dhanraj!.resist ?? []).not.toContain('fire');
    expect(def.boss).toBe(true);
    expect(def.meantToLose).toBeUndefined();
    expect(def.phases?.[0]?.ignite).toBe(true);
  });

  it('the Oil Wall goes up, a Surge breaks it, the price goes up with two more enforcers, his oil catches, he yields', () => {
    const texts = fair.flatMap((r) => r.events).flatMap((e) => (e.kind === 'text' ? [e.text] : []));
    expect(texts.some((t) => t.includes('shatters'))).toBe(true);
    expect(texts).toContain('Then the price goes up.');
    expect(texts).toContain('Two more enforcers come in from the back with flasks.');
    expect(texts.some((t) => t.includes('catches'))).toBe(true);
    expect(texts).toContain('Enough. The oil is yours. It was always going to be somebody\'s.');
  });
});

describe('the side quests (J-2, J-3) and the debate', () => {
  it('all three are done on the route; J-3 is the seventh thumbprint', () => {
    const flags = simAt('jwaladesh-night').logic.state.flags;
    for (const id of ['lamp_relay', 'anonymous_oil', 'hesitation']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('done');
    expect(flags.isSet('story.salt_road_cleared')).toBe(true);
    expect(allLines.map((l) => l.text)).toContain('On every seal: a grey thumbprint, pressed in ash.');
  });

  it('the required three close if the story is somehow past them (a quest never dangles)', () => {
    const flags = new FlagStore({ 'side.lamp_relay.accepted': true, 'side.anonymous_oil.accepted': true, 'debate.jwaladesh_hesitation.listened': true, 'story.tower_open': true });
    for (const id of ['lamp_relay', 'anonymous_oil', 'hesitation']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('closed');
    expect(closedNotes(SIDE_QUESTS, flags).map((n) => n.id)).toEqual(['lamp_relay', 'anonymous_oil', 'hesitation']);
  });
});

describe('the price, the crane and the token', () => {
  const wealth = (f: Record<string, boolean>) => localPillar(new FlagStore({ 'side.lamp_relay.done': true, 'side.anonymous_oil.done': true, ...f }), RPG, 'wealth', 'jwaladesh');

  it('Wealth 8 is paid in choices: the floor is 4 (so Agnivansh can be the least paid), the most 10', () => {
    // The quests' Wealth comes with their rewards (the field pays them): counted here as the route's settle does.
    const base = (f: Record<string, boolean>) => wealth(f) + 3;
    expect(base({ 'choice.dhanraj_broken': true })).toBe(4);
    expect(base({ 'choice.dhanraj_spared': true, 'choice.advances_given': true })).toBe(10);
  });

  it('on the route: the store signed over, the advances given, the crane back in hand, the alliance and the lamp', () => {
    const flags = simAt('chapter8-end').logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    for (const f of ['ally.jwaladesh', 'item.token_agnivansh', 'item.token_suzumori', 'story.crane_accepted', 'choice.dhanraj_spared', 'choice.advances_given', 'story.vikram_left_agnipur']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    expect(localPillar(flags, RPG, 'wealth', 'jwaladesh')).toBeGreaterThanOrEqual(8);
  });

  it('Chapter 7\'s trader sails across the bay to Agnipur (the voyage), and the chapter ends on its quay', () => {
    const sim = simAt('chapter7-end');
    const lines = said(sim.logic);
    expect(lines).toEqual([]);
    expect(sim.logic.mode).toBe('card');
    sim.press('confirm');
    expect(sim.logic.state.player.mapId).toBe('jwaladesh-harbor');
  });
});
