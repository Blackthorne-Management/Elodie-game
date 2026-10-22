// The gold-arrow walk (review 1, Oct 21, finding 2; tools/gold-walk.ts): a player who follows nothing but the gold
// arrow, talks to or acts on whatever it points at and takes the first sensible choice, must finish Chapters 1 and
// 2 without once being left with an arrow at their own feet or no arrow at all (the Echo puzzles were exactly that).
// Also the detours a first-time player takes: popping out of the war room's memory before the aide has spoken, and
// coming back from the bridgehead's memory before the pawl is pinned.

import { describe, expect, it } from 'vitest';
import { ACT1, ACT2, ACT3, ACT4, ACT5, ACT6, ACT7, ACT8, ACT9, ACT10, ACT11 } from '../src/data/quests.ts';
import { CONTENT } from '../src/data/content.ts';
import { GameLogic } from '../src/engine/game.ts';
import { Sim, findPath } from '../src/engine/sim.ts';
import { newGame } from '../src/engine/state.ts';
import { goldWalk } from '../tools/gold-walk.ts';
import { loadMaps, newGameSim, winBattles } from '../tools/sim-setup.ts';

const maps = loadMaps();

/** Walk to a tile on this map and press Echo there (a player trying the shimmer again). */
function echoAt(sim: Sim, x: number, y: number): void {
  const path = findPath(sim.logic, { x, y });
  if (!path) throw new Error(`no way to ${x},${y}`);
  for (const d of path) sim.press(d);
  sim.press('echo');
  for (let i = 0; i < 200 && sim.logic.mode === 'dialogue'; i++) sim.press('confirm');
}

describe('following only the gold arrow', () => {
  const walk = goldWalk({ maps });

  it('finishes Chapters 1 and 2 with no stall', () => {
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    expect(walk.sim.logic.state.flags.isSet('act1.complete')).toBe(true);
    expect(walk.sim.logic.state.flags.isSet('story.escaped')).toBe(true);
  });

  it('meets every objective of both chapters, in order', () => {
    // The pier fight starts as the ferry lands, before the walk ever decides anything in Chapter 2.
    const expected = [...ACT1.objectives.map((o) => `act1/${o.id}`), ...ACT2.objectives.filter((o) => o.id !== 'pier').map((o) => `act2/${o.id}`)];
    expect(walk.objectives).toEqual(expected);
  });

  it('takes the short way (review 1 measured 2,068 steps and 59 map changes before the occupied city was cut)', () => {
    expect(walk.steps).toBeLessThan(2300);
    expect(walk.mapChanges).toBeLessThan(60);
  });
});

describe('following only the gold arrow on, through Chapters 3, 4 and 5', () => {
  // On from the end of Chapter 2 (the merge of Chapters 3 to 5, Oct 22: their goals now name the person or thing,
  // the door, or the shimmer, and every Echo puzzle has its echoGoals).
  const start = goldWalk({ maps });
  const walk = goldWalk({ maps, sim: start.sim, through: 'act5' });

  it('finishes Chapter 5 with no stall', () => {
    expect(start.stalls).toEqual([]);
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    for (const f of ['act3.complete', 'act4.complete', 'story.hollis_agreed', 'anchor.ribbon_thread']) expect(walk.sim.logic.state.flags.isSet(f), f).toBe(true);
  });

  it('meets every objective in order (the ones that begin and end inside one scene are never stopped on)', () => {
    const skip: Record<string, readonly string[]> = { act3: ['request', 'guests'], act4: ['lead', 'blades', 'word'], act5: ['road', 'terms'] };
    const expected = [ACT3, ACT4, ACT5].flatMap((q) => q.objectives.filter((o) => !skip[q.id]!.includes(o.id)).map((o) => `${q.id}/${o.id}`));
    expect(walk.objectives).toEqual(expected);
  });

  it('takes a reasonable way (measured Oct 22: 1,810 steps and 48 map changes)', () => {
    expect(walk.steps).toBeLessThan(2100);
    expect(walk.mapChanges).toBeLessThan(60);
  });
});

describe('following only the gold arrow on, through Chapter 6', () => {
  // On from the end of Chapter 5 (Chapter 6, Oct 22): the fair, the Moot, the day's three things, the fjord's five swaps
  // zone by zone (the reach_zN triggers move the arrow on), Sarnai's raid, the herd's two whistles, Grimvald, the horn.
  const start = goldWalk({ maps });
  const mid = goldWalk({ maps, sim: start.sim, through: 'act5' });
  const walk = goldWalk({ maps, sim: mid.sim, through: 'act6' });

  it('finishes Chapter 6 with no stall', () => {
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    for (const f of ['party.bayarmaa', 'clue.herd_whistle', 'story.herd_unseen', 'story.grimvald_beaten', 'ally.skarragol', 'act6.complete']) expect(walk.sim.logic.state.flags.isSet(f), f).toBe(true);
  });

  it('meets every objective in order (the arrival, the ride round and the price are inside the scenes that begin them)', () => {
    expect(walk.objectives).toEqual(ACT6.objectives.filter((o) => !['road', 'round', 'price'].includes(o.id)).map((o) => `act6/${o.id}`));
  });

  it('takes a reasonable way (measured Oct 22: 446 steps and 11 map changes)', () => {
    expect(walk.steps).toBeLessThan(600);
    expect(walk.mapChanges).toBeLessThan(20);
  });
});

describe('following only the gold arrow on, through Chapter 7', () => {
  // On from the end of Chapter 6 (Chapter 7, Oct 22): the pier, the letter, the day (Kayla and K-2's stacks, the debate,
  // the fishers), the lantern hour, the maze's code in the memory and its six plazas one by one, the marsh posts lit
  // post by post (the arrow points at a post still showing the wrong light; the player turns it), the back door, Sayo's
  // war room and the peg, the screens push by push, the map, the Fox, the files with Kayla, the petition, the pier.
  const start = goldWalk({ maps });
  const mid = goldWalk({ maps, sim: start.sim, through: 'act5' });
  const six = goldWalk({ maps, sim: mid.sim, through: 'act6' });
  const walk = goldWalk({ maps, sim: six.sim, through: 'act7' });

  it('finishes Chapter 7 with no stall', () => {
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    for (const f of ['party.haru', 'clue.lantern_code', 'story.maze_walked', 'side.lanterns.done', 'anchor.screen_peg', 'rotor.screens.solved', 'story.fox_beaten', 'clue.buyers_mark', 'ally.kuroshi', 'act7.complete']) {
      expect(walk.sim.logic.state.flags.isSet(f), f).toBe(true);
    }
  });

  it('meets every objective in order (the landing is inside the scene that begins it)', () => {
    expect(walk.objectives).toEqual(ACT7.objectives.filter((o) => o.id !== 'mist').map((o) => `act7/${o.id}`));
  });

  it('takes a reasonable way (measured Oct 22: 720 steps and 16 map changes)', () => {
    expect(walk.steps).toBeLessThan(900);
    expect(walk.mapChanges).toBeLessThan(25);
  });
});

describe('following only the gold arrow on, through Chapter 8', () => {
  // On from the end of Chapter 7 (Chapter 8, Oct 22): the voyage, the quay and the stair, Aiyana's roof, the Court and
  // the duel, the day (the runners' hearth and the relay up the runners' way, the priest and the salt road, the spice
  // row), the night lamp, Arjun's night (the taper, the spare mirror, the bracket), the roofs mirror by mirror, the
  // flame, the Seth, the price, the quay.
  const start = goldWalk({ maps });
  const mid = goldWalk({ maps, sim: start.sim, through: 'act5' });
  const six = goldWalk({ maps, sim: mid.sim, through: 'act6' });
  const seven = goldWalk({ maps, sim: six.sim, through: 'act7' });
  const walk = goldWalk({ maps, sim: seven.sim, through: 'act8' });

  it('finishes Chapter 8 with no stall', () => {
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    for (const f of ['story.aiyana_met', 'story.court_heard', 'side.lamp_relay.done', 'side.anonymous_oil.done', 'debate.jwaladesh_hesitation.settled', 'anchor.chain_lamp', 'anchor.tower_mirror', 'story.beam_at_temple', 'party.vikram', 'story.dhanraj_beaten', 'ally.jwaladesh', 'act8.complete']) {
      expect(walk.sim.logic.state.flags.isSet(f), f).toBe(true);
    }
  });

  it('meets every objective in order (the landing is inside the scene that begins it)', () => {
    expect(walk.objectives).toEqual(ACT8.objectives.filter((o) => o.id !== 'chain').map((o) => `act8/${o.id}`));
  });

  it('takes a reasonable way (measured Oct 22: 767 steps and 19 map changes)', () => {
    expect(walk.steps).toBeLessThan(950);
    expect(walk.mapChanges).toBeLessThan(30);
  });
});

describe('following only the gold arrow on, through Chapter 9', () => {
  // On from the end of Chapter 8 (Chapter 9, Oct 22): the voyage north, the Mere Stair and the notice, the heath road,
  // the press-gang on the Cross and Edmund, the audience, the day (the printer and the bog chapel for Al-3, the three
  // families, the debate, Jordyn in the close, Sebastian at the organ), the eve, the recital, the postern by night, the
  // filing floor's memory, the cabinets dial by dial and seal by seal, the panel behind the shelf (Al-2), caught, the
  // cells, the Assize, the Hushed, the price at dawn, the stair home.
  const start = goldWalk({ maps });
  const mid = goldWalk({ maps, sim: start.sim, through: 'act5' });
  const six = goldWalk({ maps, sim: mid.sim, through: 'act6' });
  const seven = goldWalk({ maps, sim: six.sim, through: 'act7' });
  const eight = goldWalk({ maps, sim: seven.sim, through: 'act8' });
  const walk = goldWalk({ maps, sim: eight.sim, through: 'act9' });

  it('finishes Chapter 9 with no stall', () => {
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    for (const f of ['party.edmund', 'story.jordyn_offer', 'story.sebastian_met', 'side.purge_list.done', 'story.families_warned', 'debate.aldermoor_one_hand.settled', 'story.recital_begun', 'clue.crown_pact', 'anchor.thomas_record', 'side.crown_chronicle.done', 'story.caught', 'story.hushed_beaten', 'ally.aldermoor_dissidents', 'act9.complete']) {
      expect(walk.sim.logic.state.flags.isSet(f), f).toBe(true);
    }
  });

  it('meets every objective in order (the landing, the Hushed and the price are inside the scenes that begin them)', () => {
    const inside = ['mere', 'hushed', 'price'];
    expect(walk.objectives).toEqual(ACT9.objectives.filter((o) => !inside.includes(o.id)).map((o) => `act9/${o.id}`));
  });

  it('takes a reasonable way (measured Oct 22: 574 steps and 15 map changes)', () => {
    expect(walk.steps).toBeLessThan(750);
    expect(walk.mapChanges).toBeLessThan(25);
  });

  describe('and on through Chapter 10, both ways the night can go', () => {
    // On from the end of Chapter 9 (Chapter 10, Oct 22): the long pier, the camps on the plaza, the Speaker's gate, the
    // three feuds, Jordyn's watch, the kitchen, the blessing at the lamp, Patricio's stone, Z-6 (the crew and the mill)
    // and Z-3 (the lonely cutter) as the arrow finds them, the vote, the whistle, the night under the point and the tide.
    // The night goes the way the shares say; a second walk forces the other way (each from where the first stood at dusk).
    const ten = goldWalk({ maps, sim: walk.sim, through: 'act10', until: (s) => s.logic.state.flags.isSet('story.inspection_done') && s.logic.mode === 'field' });
    const dusk = ten.sim.logic.state.flags.snapshot();
    const player = structuredClone(ten.sim.logic.state.player);
    const exposedFirst = ten.sim.logic.state.flags.isSet('muster.exposed_possible');
    const night = goldWalk({ maps, sim: ten.sim, through: 'act10' });
    // The other way: the same dusk, with the exposed route open if it was shut (or shut if it was open).
    const state = newGame(maps[player.mapId]!, maps[player.mapId]!.spawns[0]!.id);
    state.player = player;
    state.flags.load(dusk);
    if (exposedFirst) state.flags.clear('muster.exposed_possible');
    else state.flags.set('muster.exposed_possible', true);
    const otherSim = new Sim(new GameLogic(maps, CONTENT, state));
    winBattles(otherSim);
    const otherNight = goldWalk({ maps, sim: otherSim, through: 'act10' });

    it('finishes Chapter 10 with no stall', () => {
      expect(ten.stalls).toEqual([]);
      expect(night.stalls).toEqual([]);
      expect(night.finished).toBe(true);
      for (const f of ['story.muster_begun', 'story.council_voted', 'side.muskets.done', 'side.lonely_cutter.done', 'story.blessing', 'story.inspection_done', 'story.betrayal_seen', 'act10.complete']) {
        expect(night.sim.logic.state.flags.isSet(f), f).toBe(true);
      }
      expect(night.sim.logic.state.flags.isSet(exposedFirst ? 'muster.turned' : 'muster.betrayed')).toBe(true);
      expect(otherNight.stalls).toEqual([]);
      expect(otherNight.finished).toBe(true);
      expect(otherNight.sim.logic.state.flags.isSet(exposedFirst ? 'muster.betrayed' : 'muster.turned')).toBe(true);
      expect(otherNight.sim.logic.state.flags.isSet('act10.complete')).toBe(true);
    });

    it('meets every objective in order (the seated city, the night and the tide are inside the scenes that begin them)', () => {
      const met = [...ten.objectives, ...night.objectives];
      expect(met).toEqual(ACT10.objectives.filter((o) => met.includes(`act10/${o.id}`)).map((o) => `act10/${o.id}`));
      expect(met.length).toBeGreaterThanOrEqual(ACT10.objectives.length - 3);
    });

    it('takes a reasonable way (measured Oct 22: 921 steps and 25 map changes; the night 95 steps either way)', () => {
      console.log(`chapter 10 gold walk: ${ten.steps + night.steps} steps, ${ten.mapChanges + night.mapChanges} map changes; night ${exposedFirst ? 'exposed' : 'sailed'} (${night.steps} steps; the other way ${otherNight.steps})`);
      expect(ten.steps + night.steps).toBeLessThan(1400);
      expect(ten.mapChanges + night.mapChanges).toBeLessThan(40);
    });

    describe('and on through Chapter 11, from either night', () => {
      // On from the end of Chapter 10 (Chapter 11, Oct 22): the landing, the gun on the headland, the flank (the house that
      // sailed) or the house that stood, the gardens' road, the camp, the elders, the Ninth Thumbprint and Harbors Lie as the
      // arrow finds them, the conch, the village by dusk, Thorne, Anaco, Caona's stand in the pier's memory, the chain, the
      // Turn (the first choice: hold the pier), Hale, the truth, the Song House and the caney. Each night walks on.
      const eleven = goldWalk({ maps, sim: night.sim, through: 'act11' });
      const otherEleven = goldWalk({ maps, sim: otherNight.sim, through: 'act11' });

      it('finishes Chapter 11 with no stall, betrayed and turned', () => {
        for (const w of [eleven, otherEleven]) {
          expect(w.stalls).toEqual([]);
          expect(w.finished).toBe(true);
          const f = w.sim.logic.state.flags;
          for (const flag of ['story.landed', 'story.headland_won', 'war.flank_done', 'story.camp_reached', 'debate.xaragua_harbor.settled', 'side.ninth_thumbprint.done', 'side.harbors_lie.done', 'story.tide_called', 'story.thorne_taken', 'story.anaco_freed', 'story.chain_dropped', 'war.trust', 'story.harbor_taken', 'clue.ash_road_read', 'story.wounded_sheltered', 'act11.complete']) {
            expect(f.isSet(flag), flag).toBe(true);
          }
          expect(f.get('party.rael')).toBe(false);
        }
        // The betrayed night fights the flank on the beach; the turned night's house stands with the fleet instead.
        const flank = (w: typeof eleven) => w.sim.battles.filter((b) => b.startsWith('harbor_flank_'));
        expect(flank(exposedFirst ? otherEleven : eleven)).toHaveLength(1);
        expect(flank(exposedFirst ? eleven : otherEleven)).toHaveLength(0);
        expect((exposedFirst ? eleven : otherEleven).sim.logic.state.flags.isSet('war.house_stood')).toBe(true);
      });

      it('meets every objective in order (the landing, and the pier\'s end on Trust, are inside the scenes that begin them)', () => {
        const inside = ['landed', 'pier_end'];
        for (const w of [eleven, otherEleven]) expect(w.objectives).toEqual(ACT11.objectives.filter((o) => !inside.includes(o.id)).map((o) => `act11/${o.id}`));
      });

      it('takes a reasonable way (measured Oct 22: 599 steps and 21 map changes, either night)', () => {
        console.log(`chapter 11 gold walk: ${eleven.steps} steps, ${eleven.mapChanges} map changes; the other night ${otherEleven.steps} steps`);
        expect(eleven.steps).toBeLessThan(800);
        expect(otherEleven.steps).toBeLessThan(800);
        expect(eleven.mapChanges).toBeLessThan(30);
      });
    });
  });
});

describe('the arrow in the Echo, after a detour', () => {
  it('out of the war room before the aide has spoken: Gianna knows she was interrupted, and the arrow still finishes Chapter 1', () => {
    const sim = newGameSim(maps);
    const first = goldWalk({ maps, sim, until: (s) => s.logic.era === 'echo' && s.logic.mode === 'field' });
    expect(first.stalls).toEqual([]);
    expect(sim.logic.state.player.mapId).toBe('zetwal-house');
    expect(sim.logic.state.flags.isSet('story.warroom_echo')).toBe(false);
    // Echo again at once, before talking to anyone.
    sim.press('echo');
    const lines: string[] = [];
    for (let i = 0; i < 50 && sim.logic.mode === 'dialogue'; i++) {
      const v = sim.logic.view();
      if (v.kind !== 'end') lines.push(v.text);
      sim.press('confirm');
    }
    expect(lines).toContain('I need to go back. Someone was bringing him something.');
    expect(lines.join(' ')).not.toContain('leave the orders there');
    expect(sim.logic.state.flags.isSet('story.warroom_returned')).toBe(true);
    const rest = goldWalk({ maps, sim, until: (s) => s.logic.state.flags.isSet('act1.complete') });
    expect(rest.stalls).toEqual([]);
    expect(rest.finished).toBe(true);
  });

  it('back from the bridgehead with the bridge lowered but not pinned: the arrow leads back in, to the pawl, and across', () => {
    const sim = newGameSim(maps);
    goldWalk({ maps, sim, until: (s) => s.logic.state.flags.isSet('echo.chain_bridge_down') && s.logic.mode === 'field' });
    expect(sim.logic.era).toBe('echo');
    echoAt(sim, 28, 10);
    expect(sim.logic.era).toBe('present');
    expect(sim.logic.state.flags.isSet('story.bridge_crept_seen')).toBe(true);
    const rest = goldWalk({ maps, sim, until: (s) => s.logic.state.flags.isSet('story.bridge_crossed') });
    expect(rest.stalls).toEqual([]);
    expect(rest.finished).toBe(true);
  });
});
