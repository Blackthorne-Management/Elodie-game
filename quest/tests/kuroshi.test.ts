// Chapter 7, The Fog Files (Kirinoura; docs/quest/reviews/2026-10-21-chapter7-outline.md with its second review): the
// chapter starts (?chapter=7 and 8), the owner's rules as content checks (Salkhi, Anissa, Kayla's lines against the
// locked rule, the Crown never joined to the girl who glows, the closed hand never named), the gate until the lantern
// hour and the dusk, Haru as a fighter who leads in his own chapter, the fog maze's wrong ways and the blind walk (the
// review's 3.7 and 3.8), the marsh road shut until the causeway is lit, the stacks' fail-safe, the screens' anchor
// (3.1), the Paper Fox in disguise with Kagemimi and Sold Secrets (3.6) against two bots, the side quests closing, the
// price and the token.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MAP_MOODS } from '../src/assets.config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK, SKILLS, battleReserve } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { KUROSHI_DIALOGUE } from '../src/data/dialogue/kuroshi.ts';
import { CODE, MAZE } from '../src/data/kuroshi.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { Battle, battleItems, battleParty, type Action, type BattleEvent } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { localPillar, partyMembers } from '../src/engine/rpg.ts';
import { closedNotes, settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { newGame } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { skillsAction } from '../tools/battle-sim.ts';
import { mazePosts } from '../tools/maps/kuroshi.ts';
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

const scriptLines = (id: string) => Object.values(CONTENT.dialogue[id]!.nodes).flatMap((n) => n.lines.map((l) => ({ ...l, speaker: l.speaker ?? n.speaker ?? '' })));
const allLines = KUROSHI_DIALOGUE.flatMap((d) => scriptLines(d.id).map((l) => ({ d: d.id, ...l })));

/** Read every line of a dialogue now, pressing A (the first choice), and return the texts. */
function said(logic: GameLogic): string[] {
  const out: string[] = [];
  for (let i = 0; i < 60 && logic.mode === 'dialogue'; i++) {
    const v = logic.view();
    if (v.kind !== 'end') out.push(v.text);
    if (v.kind === 'choice') logic.choose(v.choices[0]!.index);
    else logic.advance();
  }
  return out;
}

describe('the chapter starts', () => {
  it('?chapter=7: Kirinoura\'s pier off the longship with the party of Chapter 6, the landing plays, the ambushes switch on', () => {
    const at7 = starts['7']!;
    expect(at7.map).toBe('kuroshi-pier');
    const state = newGame(maps[at7.map]!, at7.spawn);
    state.flags.load(at7.flags);
    const logic = new GameLogic(maps, CONTENT, state);
    expect(partyMembers(state.flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa']);
    logic.enterMap();
    expect(logic.dialogueId).toBe('pier_arrive');
    expect(state.flags.isSet('story.kuroshi_arrived')).toBe(true);
    expect(state.flags.isSet('item.torvald_letter')).toBe(true);
  });

  it('?chapter=8: Kirinoura\'s pier after the card, Haru with them, the Fog Files, the clues and the Suzumori token in hand', () => {
    const at8 = starts['8']!;
    const flags = new FlagStore(at8.flags);
    expect(at8.map).toBe('kuroshi-pier');
    expect(partyMembers(flags, RPG, 'present').map((m) => m.id)).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru']);
    for (const f of ['act7.complete', 'card.act7_end', 'ally.kuroshi', 'item.token_suzumori', 'item.token_ironvow', 'item.fog_files', 'clue.buyers_mark', 'clue.ardencia_outflows', 'story.haru_left_kirinoura', 'belief.rael_traitor']) {
      expect(flags.isSet(f), f).toBe(true);
    }
  });
});

describe('the owner\'s rules as content checks', () => {
  it('Salkhi never speaks in a scene with Anissa\'s lines in it, and never about her', () => {
    for (const d of KUROSHI_DIALOGUE) {
      const ls = scriptLines(d.id);
      const salkhi = ls.filter((l) => l.speaker === 'salkhi');
      if (salkhi.length === 0) continue;
      expect(ls.some((l) => l.speaker === 'anissa' || l.speaker === 'anissa_far'), d.id).toBe(false);
      for (const l of salkhi) expect(l.text, d.id).not.toMatch(/Anissa|small one|little one|the girl/i);
    }
  });

  it('Kayla says what the files say: never that he is good, never the arrows; she does not name the closed hand', () => {
    const kayla = allLines.filter((l) => l.speaker === 'kayla');
    expect(kayla.length).toBeGreaterThan(15);
    for (const l of kayla) {
      expect(l.text, l.d).not.toMatch(/\bgood\b|innocent|feeds|the arrows|Quiet Crown|Rodriguez|Alcázar/i);
    }
    // Her one line about him reads both ways; she says she does not know where the gold went.
    expect(kayla.map((l) => l.text)).toContain('He writes to me twice a year. He never says anything. That is how I know he is still himself.');
    expect(kayla.map((l) => l.text)).toContain('I did not say that. I said I do not know.');
  });

  it('the buying-list names no house, and nobody calls the closed hand the Quiet Crown\'s (that join is Chapter 9\'s)', () => {
    for (const l of allLines) if (/closed hand/i.test(l.text)) expect(l.text, l.d).not.toMatch(/Quiet Crown|Dorini|Ironvow|Suzumori|Agnivansh/);
    for (const l of allLines) if (/\b(Crown|Regent)\b/.test(l.text)) expect(l.text, l.d).not.toMatch(/glow|little one/i);
  });

  it('Anissa is never a foe\'s target and never jokes; "definitely not a spy" is said once', () => {
    // The Husher's Seize goes to Gianna, who steps in front (engine/battle.ts); no Chapter 7 move aims at Anissa.
    for (const id of ['lantern_moth', 'fog_cutpurse', 'husher', 'paper_decoy', 'paper_fox']) for (const m of ENEMIES[id]!.moves) expect(m.ally, `${id}/${m.name}`).toBeUndefined();
    const anissa = allLines.filter((l) => l.speaker === 'anissa');
    expect(anissa.length).toBeGreaterThan(5);
    for (const l of anissa) expect(l.text).not.toMatch(/ha!|\bjoke|funny|swapped/i);
    expect(allLines.filter((l) => /definitely not a spy/i.test(l.text))).toHaveLength(1);
  });

  it('nobody dies: the Fox, the cutpurses and the Hushers withdraw at 0 HP', () => {
    for (const id of ['paper_fox', 'fog_cutpurse', 'husher']) expect(ENEMIES[id]!.withdraws, id).toBeDefined();
  });
});

describe('the day and the lantern hour', () => {
  it('the Hall\'s gate stays shut until K-2 and the debate are done, and the guard says what is left', () => {
    const sim = simAt('kirinoura-letter');
    const door = maps['kuroshi-quarter']!.doors.find((d) => d.id === 'quarter_hall')!;
    expect(sim.logic.doorOpen(door)).toBe(false);
    sim.logic.closedDoor(door);
    const lines = said(sim.logic);
    expect(lines).toContain('The clerk in the library is still waiting.');
    expect(lines).toContain('The keepers are still at it on the middle bridge.');
    expect(sim.logic.doorOpen(door)).toBe(false);
    expect(simAt('kirinoura-dusk').logic.doorOpen(door)).toBe(true);
  });

  it('dusk comes when the second of the two is done, and lasts until dawn after the Fox', () => {
    const mood = MAP_MOODS.find((m) => m.maps.includes('kuroshi-quarter'))!;
    const day = new FlagStore({ 'side.spy_ledger.done': true });
    expect(evaluate(mood.if, day)).toBe(false);
    day.set('debate.kuroshi_silence.settled', true);
    expect(evaluate(mood.if, day)).toBe(true);
    day.set('story.quarter_dawn', true);
    expect(evaluate(mood.if, day)).toBe(false);
  });

  it('Haru joins at the lantern hour, walks with the party and fights second in his own chapter', () => {
    const flags = simAt('kirinoura-haru').logic.state.flags;
    expect(flags.isSet('party.haru')).toBe(true);
    expect(battleParty(flags, RPG, SKILL_BOOK).map((p) => p.id)).toEqual(['gianna', 'haru', 'yari', 'azzy', 'samira', 'bayarmaa']);
    flags.set('act7.complete', true);
    expect(battleParty(flags, RPG, SKILL_BOOK).map((p) => p.id)).toEqual(['gianna', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru']);
    expect(SKILLS.haru!.find((s) => s.id === 'kagemimi')!.reveal).toBe(true);
  });
});

describe('the fog maze (SIG-KUR part 1) and the marsh', () => {
  it('each plaza\'s three posts show the code for its way on, read left to right', () => {
    const fog = maps['kuroshi-fogmaze']!;
    MAZE.plazas.forEach((c, i) => {
      const code = CODE[MAZE.route[i]!];
      mazePosts(c).forEach(([x, y], k) => {
        const lit = fog.objects.find((o) => o.id === `post_${i + 1}_${k + 1}_lit`)!;
        expect([lit.area.x, lit.area.y]).toEqual([x, y]);
        expect(lit.kind).toBe(`post_${code[k]}`);
      });
    });
  });

  it('a wrong way turns the party back to the plaza it left, not to the gate (the review\'s 3.7)', () => {
    const sim = simAt('kirinoura-maze');
    sim.run(['goto 14,27', 'echo', 'skip', 'echo', 'goto 15,25', 'skip', 'goto 10,21', 'skip', 'goto 13,19', 'skip']);
    const p = sim.logic.state.player;
    expect([p.mapId, p.pos.x, p.pos.y]).toEqual(['kuroshi-fogmaze', MAZE.plazas[1]!.x, MAZE.plazas[1]!.y]);
  });

  it('walked blind, without the code, the far gap turns the party back to the gate (the review\'s 3.8)', () => {
    const sim = simAt('kirinoura-maze');
    sim.run(['goto 15,25', 'skip', 'goto 10,21', 'skip', 'goto 10,15', 'skip', 'goto 16,11', 'skip', 'goto 22,7', 'skip', 'goto 17,4', 'skip', 'goto 17,1', 'skip']);
    expect(sim.logic.state.flags.isSet('story.maze_walked')).toBe(false);
    expect(sim.logic.state.player.pos).toEqual({ x: 16, y: 28 });
  });

  it('the marsh road is shut by the fog order from both sides until the causeway is lit (no way round the maze)', () => {
    const flags = simAt('kirinoura-haru').logic.state.flags;
    const quarter = maps['kuroshi-quarter']!.doors.find((d) => d.id === 'quarter_marsh')!;
    const marsh = maps['kuroshi-marsh']!.doors.find((d) => d.id === 'marsh_quarter')!;
    expect(evaluate(quarter.if, flags)).toBe(false);
    expect(evaluate(marsh.if, flags)).toBe(false);
    flags.set('story.causeway_lit', true);
    expect(evaluate(quarter.if, flags) && evaluate(marsh.if, flags)).toBe(true);
  });

  it('the lit posts bring the boats home and show the causeway; the press is the fifth thumbprint', () => {
    const flags = simAt('kirinoura-filehouse').logic.state.flags;
    for (const f of ['story.boats_home', 'story.causeway_lit', 'side.lanterns.done']) expect(flags.isSet(f), f).toBe(true);
  });
});

describe('the sealed stacks (K-2) and Kayla', () => {
  it('stepping into the cutpurses\' sightline is the fight; after it the stacks are clear (the stealth\'s fail-safe)', () => {
    const sim = simAt('kirinoura-stacks');
    sim.run(['goto 19,5', 'skip']);
    expect(sim.battles.at(-1)).toBe('stacks_cutpurses');
    expect(sim.logic.state.flags.isSet('story.stacks_cleared')).toBe(true);
    expect(sim.logic.npcs().some((n) => n.npc === 'stacks_cutpurse')).toBe(false);
  });

  it('the ledger needs the rule from the memory; back on Kayla\'s desk it pays, and her glyph card reads the spy map', () => {
    const flags = simAt('kirinoura-dusk').logic.state.flags;
    for (const f of ['clue.shelf_mark', 'side.spy_ledger.done', 'item.kayla_glyphs']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.get('item.spy_ledger')).toBe(false);
    // The map wall reads the pins only with her card (the review's 3.4).
    const map = CONTENT.dialogue.sayo_map!;
    expect(JSON.stringify(map.nodes.start)).toContain('item.kayla_glyphs');
  });
});

describe('the screens (SIG-KUR part 2): the anchor is the key (the review\'s 3.1)', () => {
  it('the middle screen reads the anchor in the present: pegged, it shows north; loose, it rests east', () => {
    const fh = maps['kuroshi-filehouse']!;
    const held = fh.objects.find((o) => o.id === 'screen_4_held')!;
    const loose = fh.objects.find((o) => o.id === 'screen_4_loose')!;
    expect(evaluate(held.if, new FlagStore({ 'anchor.screen_peg': true }))).toBe(true);
    expect(evaluate(loose.if, new FlagStore({}))).toBe(true);
    expect(loose.kind).toBe('screen_loose');
  });

  it('on the route, the peg is set in Sayo\'s war room and four pushes open the lanes', () => {
    const sim = simAt('kirinoura-fox');
    const flags = sim.logic.state.flags;
    for (const f of ['clue.sayo_network', 'anchor.screen_peg', 'rotor.screens.solved', 'story.spy_map_read']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.get('choice.patricio_sayo')).toBe('cost');
  });
});

/** A fair player for the Fox (tools/battle-sim.ts `skills`): Kagemimi first, area blows on paper, heal, the best blow. */
function playFox(seed: number, flags: FlagStore, plan: 'skills' | 'attack'): { won: boolean; events: BattleEvent[]; falls: number } {
  const def = BATTLES.file_house_fox!;
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), plan === 'skills' ? battleItems(flags, RPG) : [], { seed, reserve: battleReserve(def) });
  const events: BattleEvent[] = [...b.start()];
  const party = new Set(b.party.map((c) => c.key));
  for (let i = 0; i < 400 && !b.outcome; i++) {
    const foe = b.enemies.find((e) => !e.down)!;
    const action: Action = plan === 'skills' ? skillsAction(b) : { kind: 'attack', target: foe.key };
    events.push(...b.act(action));
  }
  const falls = events.filter((e) => e.kind === 'down' && party.has(e.who)).length;
  return { won: b.outcome === 'won', events, falls };
}

describe('the Paper Fox (the review\'s 3.6)', () => {
  const flags = simAt('kirinoura-fox').logic.state.flags;
  const fair = Array.from({ length: 30 }, (_, i) => playFox(i + 1, flags, 'skills'));
  const plain = Array.from({ length: 30 }, (_, i) => playFox(i + 1, flags, 'attack'));

  it('a player who uses the kit wins at the route\'s level, not without danger; Attack alone mostly loses, and the tip names the answer', () => {
    expect(fair.filter((r) => r.won).length).toBe(30);
    expect(fair.some((r) => r.falls > 0)).toBe(true);
    expect(plain.filter((r) => r.won).length).toBeLessThanOrEqual(10);
    expect(BATTLES.file_house_fox!.tips?.start).toMatch(/Kagemimi/);
    expect(BATTLES.file_house_fox!.rewards.xp).toBe(140);
    expect(BATTLES.file_house_fox!.boss).toBe(true);
    expect(BATTLES.file_house_fox!.meantToLose).toBeUndefined();
  });

  it('he starts among his decoys, masked; Kagemimi finds him out; the second phase reads a file; he yields', () => {
    for (const r of fair.filter((x) => x.won)) {
      const texts = r.events.flatMap((e) => (e.kind === 'text' ? [e.text] : []));
      const found = texts.findIndex((t) => t.includes('is found out'));
      const phase = texts.indexOf('You keep files too. Everyone does.');
      const yields = texts.indexOf('Enough. Take the files. They were never mine to sell.');
      expect(found).toBeGreaterThan(-1);
      expect(phase).toBeGreaterThan(-1);
      expect(yields).toBeGreaterThan(phase);
    }
    const b = new Battle(BATTLES.file_house_fox!, battleParty(flags, RPG, SKILL_BOOK), BATTLES.file_house_fox!.enemies.map((id) => ENEMIES[id]!), [], { seed: 4, reserve: battleReserve(BATTLES.file_house_fox!) });
    expect(b.enemies.every((e) => e.masked && e.name.startsWith('Paper Fox? '))).toBe(true);
  });

  it('Sold Secrets turns a fighter\'s own best blow on them in some fights', () => {
    const read = fair.flatMap((r) => r.events).filter((e) => e.kind === 'text' && e.text.includes('reads from a file'));
    expect(read.length).toBeGreaterThan(0);
  });
});

describe('the side quests (K-2, K-3) and the debate', () => {
  it('all three are done on the route and pay; K-2 +2 and K-3 +1 Influence at Kuroshi', () => {
    const flags = simAt('kirinoura-fox').logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    for (const id of ['spy_ledger', 'lanterns', 'silence']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('done');
    expect(flags.isSet('debate.kuroshi_silence.won')).toBe(true);
  });

  it('the required three close if the story is somehow past them (a quest never dangles)', () => {
    const flags = new FlagStore({ 'side.spy_ledger.accepted': true, 'side.lanterns.accepted': true, 'debate.kuroshi_silence.listened': true, 'story.haru_met': true, 'ally.kuroshi': true });
    for (const id of ['spy_ledger', 'lanterns', 'silence']) expect(sideQuestStatus(flags, SIDE_QUESTS.find((q) => q.id === id)!), id).toBe('closed');
    expect(closedNotes(SIDE_QUESTS, flags).map((n) => n.id)).toEqual(['spy_ledger', 'lanterns', 'silence']);
  });
});

describe('the petition, the price and the token', () => {
  it('on the route: the receipts, the petition signed and Samira\'s offer laid on the dais; the alliance and the crane', () => {
    const flags = simAt('chapter7-end').logic.state.flags;
    for (const f of ['ally.kuroshi', 'item.token_suzumori', 'story.price_receipts', 'choice.petition_signed', 'choice.samira_names', 'choice.fox_spared', 'story.haru_left_kirinoura']) {
      expect(flags.isSet(f), f).toBe(true);
    }
    // Influence at Kuroshi counts the books too; what the dais counts is the receipts (2), the petition, Samira, the Fox.
    expect(localPillar(flags, RPG, 'influence', 'kuroshi')).toBeGreaterThanOrEqual(5);
  });
});
