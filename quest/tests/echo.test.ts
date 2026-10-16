import { describe, expect, it } from 'vitest';
import type { GameContent } from '../src/engine/content.ts';
import type { DialogueScript } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { GameLogic, type Effect } from '../src/engine/game.ts';
import { Sim } from '../src/engine/sim.ts';
import { newGame } from '../src/engine/state.ts';
import { parseMap, type GameMap } from '../src/engine/tiledMap.ts';
import { checkSwap, echoPrompt, isOpen } from '../src/engine/world.ts';
import { makeMap, obj } from './helpers.ts';

const say = (id: string, text: string, set?: Record<string, boolean>): DialogueScript => ({
  id,
  start: 'a',
  nodes: { a: { lines: [{ text, set }] } },
});

const content: GameContent = {
  npcs: {
    ghost: { id: 'ghost', look: 'x', dialogue: 'ghost' },
    now: { id: 'now', look: 'x', dialogue: 'now' },
  },
  dialogue: Object.fromEntries(
    [
      say('ghost', 'I am from fifty years ago.'),
      say('now', 'I am from today.'),
      say('lever_echo', 'You pull the lever (memory only).', { 'echo.lever': true }),
      say('pin_echo', 'You pin it (anchor).', { 'anchor.pin': true }),
      say('arrive', 'You arrive.'),
      say('in', 'The memory opens.', { 'seen.in': true }),
      say('out', 'Back again.', { 'seen.out': true }),
      say('end', 'The end.', { 'the.end': true }),
    ].map((d) => [d.id, d]),
  ),
  speakers: {},
  cards: [{ id: 'fin', when: 'the.end', title: 'To be continued', lines: [] }],
  messages: {
    noZone: 'NO_ZONE',
    locked: 'LOCKED',
    blocked: 'The memory will not hold here',
    doorInEcho: 'DOOR',
    enterEcho: 'IN',
    leaveEcho: 'OUT',
  },
};

// A 7 x 5 map. Row 2 is a corridor with an Echo Zone at 1..2, a gap at 4 that a walkable object
// bridges in the present once `anchor.pin` is set, and a door at 6,0. In the Echo, row 1 has a pin
// (2,1, the anchor) and a lever (3,1, memory only) set into a wall.
function world(): GameMap {
  return parseMap(
    'w',
    makeMap({
      present: ['......D', '.......', '....#..', '.......', '.......'],
      echo: ['......D', '..##...', '....#..', '.......', '.......'],
      objects: {
        spawns: [obj('start', 1, 2)],
        doors: [obj('d', 6, 0, { target: 'd', exit: 'down' })],
        echo_zones: [obj('zone', 1, 2, { onEcho: 'in', onReturn: 'out' }, 2, 1), obj('locked', 0, 4, { if: 'key' }, 1, 1)],
        npcs: [obj('g', 2, 3, { npc: 'ghost', era: 'echo' }), obj('n', 3, 3, { npc: 'now' })],
        puzzle_objects: [
          obj('lever', 3, 1, { era: 'echo', dialogue: 'lever_echo' }),
          obj('pin', 2, 1, { era: 'echo', dialogue: 'pin_echo' }),
          obj('bridge', 4, 2, { era: 'present', walkable: true, if: 'anchor.pin' }),
          obj('gate', 0, 3, { era: 'echo', solid: true, if: 'echo.lever' }),
        ],
        triggers: [obj('t', 5, 2, { dialogue: 'end', flag: 'end.seen', once: true }), obj('enter', 0, 0, { dialogue: 'arrive', flag: 'arrived', once: true, onEnter: true })],
      },
    }),
  );
}

function logic(): GameLogic {
  const map = world();
  return new GameLogic({ w: map }, content, newGame(map, 'start'));
}

const kinds = (effects: Effect[]) => effects.map((e) => e.kind);

describe('the Echo swap (guide 6.1)', () => {
  it('works only inside an Echo Zone, and keeps the position', () => {
    const g = logic();
    g.state.player.pos = { x: 0, y: 2 };
    expect(g.swap()).toEqual([{ kind: 'refused', text: 'NO_ZONE' }]);
    expect(g.era).toBe('present');
    g.state.player.pos = { x: 1, y: 2 };
    const effects = g.swap();
    expect(kinds(effects)).toEqual(['era', 'sync', 'toast', 'dialogue']);
    expect(g.era).toBe('echo');
    expect(g.state.player.pos).toEqual({ x: 1, y: 2 });
    expect(g.view()).toMatchObject({ kind: 'line', text: 'The memory opens.' });
  });

  it('a zone whose condition does not hold is locked', () => {
    const g = logic();
    g.state.player.pos = { x: 0, y: 4 };
    expect(g.swap()).toEqual([{ kind: 'refused', text: 'LOCKED' }]);
    g.state.flags.set('key', true);
    expect(kinds(g.swap())[0]).toBe('era');
  });

  it('is refused with "The memory will not hold here" when the tile is closed in the other era', () => {
    const map = world();
    const flags = new FlagStore();
    expect(checkSwap(map, 'present', { x: 1, y: 2 }, flags)).toMatchObject({ ok: true, to: 'echo' });
    // An Echo NPC standing on the tile, or an Echo object closing it, blocks the swap at run time
    // (the map validator keeps both out of zones, so real maps never hit this).
    map.npcs.push({ objectId: 99, npc: 'ghost', pos: { x: 1, y: 2 }, facing: 'down', era: 'echo' });
    expect(checkSwap(map, 'present', { x: 1, y: 2 }, flags)).toEqual({ ok: false, reason: 'blocked' });
    const g = new GameLogic({ w: map }, content, newGame(map, 'start'));
    expect(g.swap()).toEqual([{ kind: 'refused', text: 'The memory will not hold here' }]);
    expect(g.era).toBe('present');
  });

  it('uses each era’s collision, and the era’s own NPCs', () => {
    const g = logic();
    g.state.player.pos = { x: 2, y: 2 };
    expect(g.tryStep('down')).toEqual({ ok: true, to: { x: 2, y: 3 } }); // the ghost is only in the echo
    g.swap();
    g.advance();
    expect(g.tryStep('down')).toMatchObject({ ok: false, reason: 'occupied' });
    expect(g.isOpen({ x: 3, y: 1 })).toBe(false); // a wall in the echo
    expect(isOpen(g.map, 'echo', { x: 3, y: 1 }, g.state.flags)).toBe(false);
    expect(isOpen(g.map, 'present', { x: 3, y: 1 }, g.state.flags)).toBe(true);
    expect(g.npcs('present').map((n) => n.npc)).toEqual(['now']);
    expect(g.npcs('echo').map((n) => n.npc)).toEqual(['ghost']);
  });

  it('doors do not work inside the memory', () => {
    const g = logic();
    g.state.player.era = 'echo';
    g.state.player.pos = { x: 6, y: 1 };
    expect(g.tryStep('up')).toEqual({ ok: false, reason: 'door_in_echo' });
    g.state.player.era = 'present';
    expect(g.tryStep('up')).toMatchObject({ ok: true });
  });
});

describe('anchors: only they carry changes into the present', () => {
  it('memory-only flags are wiped on the way back; anchor flags stay and change the present', () => {
    const sim = new Sim(logic());
    sim.logic.state.player.pos = { x: 2, y: 2 };
    sim.run(['echo', 'skip', 'right', 'up', 'confirm', 'skip']); // lever at 3,1 (memory only)
    expect(sim.logic.state.flags.isSet('echo.lever')).toBe(true);
    expect(sim.logic.objects().map((o) => o.id)).toContain('gate');
    expect(sim.logic.isOpen({ x: 0, y: 3 })).toBe(false);
    sim.run(['left', 'up', 'confirm', 'skip']); // pin at 2,1 (the anchor), from 2,2
    expect(sim.logic.state.flags.isSet('anchor.pin')).toBe(true);
    expect(sim.logic.isOpen({ x: 4, y: 2 }, 'present')).toBe(true);
    sim.run(['echo', 'skip']);
    expect(sim.logic.era).toBe('present');
    expect(sim.logic.state.flags.has('echo.lever')).toBe(false);
    expect(sim.logic.state.flags.isSet('anchor.pin')).toBe(true);
    expect(sim.logic.state.flags.isSet('seen.out')).toBe(true);
    // The bridge (a present object that reads the anchor) now opens the gap at 4,2.
    expect(sim.logic.objects().map((o) => o.id)).toEqual(['bridge']);
    sim.run(['right*3']);
    expect(sim.logic.state.player.pos).toEqual({ x: 5, y: 2 });
  });

  it('without the anchor the gap stays closed', () => {
    const sim = new Sim(logic());
    sim.run(['right*4']);
    expect(sim.logic.state.player.pos).toEqual({ x: 3, y: 2 });
  });
});

describe('game logic', () => {
  it('runs on-enter scenes once', () => {
    const g = logic();
    expect(kinds(g.enterMap())).toEqual(['dialogue']);
    expect(g.advance().map((e) => e.kind)).toEqual(['save', 'sync']);
    expect(g.enterMap()).toEqual([]);
  });

  it('a step trigger plays its dialogue, then the card its flag unlocks, once', () => {
    const sim = new Sim(logic());
    sim.logic.state.flags.set('anchor.pin', true);
    sim.run(['right*4']);
    expect(sim.logic.mode).toBe('dialogue');
    sim.run(['skip']);
    expect(sim.logic.mode).toBe('card');
    expect(sim.logic.card?.title).toBe('To be continued');
    expect(sim.logic.state.flags.isSet('card.fin')).toBe(true);
    sim.run(['confirm']);
    expect(sim.logic.mode).toBe('field');
    sim.run(['left', 'right']);
    expect(sim.logic.mode).toBe('field');
  });

  it('talks to the NPC in front, with a talk effect', () => {
    const g = logic();
    g.state.player.pos = { x: 3, y: 2 };
    g.state.player.facing = 'down';
    const effects = g.interact();
    expect(effects[0]).toMatchObject({ kind: 'talk', npc: { npc: 'now' } });
    expect(g.view()).toMatchObject({ text: 'I am from today.' });
    expect(g.tryStep('left')).toEqual({ ok: false, reason: 'busy' });
  });

  it('ignores input it cannot use in the current mode', () => {
    const g = logic();
    expect(g.advance()).toEqual([]);
    expect(g.closeCard()).toEqual([]);
    g.enterMap();
    expect(g.swap()).toEqual([]);
    expect(g.interact()).toEqual([]);
  });
});

describe('route text', () => {
  it('rejects anything that is not an input', () => {
    const sim = new Sim(logic());
    expect(() => sim.run(['jump'])).toThrow(/not an input/);
    expect(() => sim.run(['goto 9,9'])).toThrow(/No path/);
  });

  it('goto walks the shortest open path and never through a trigger', () => {
    const sim = new Sim(logic());
    sim.logic.state.flags.set('anchor.pin', true);
    sim.run(['goto 6,2']);
    expect(sim.logic.state.player.pos).toEqual({ x: 6, y: 2 });
    expect(sim.logic.state.flags.isSet('end.seen')).toBe(false);
  });
});

describe('the Echo prompt (owner request, Oct 16)', () => {
  it('names the key for keyboards and the button for touch, only where an Echo works', () => {
    const ok = { ok: true, to: 'echo', zone: {} } as unknown as Parameters<typeof echoPrompt>[0];
    expect(echoPrompt(ok, 'keys')).toBe('Press E to Echo');
    expect(echoPrompt(ok, 'touch')).toBe('Press Echo to Echo');
    for (const reason of ['no_zone', 'locked', 'blocked'] as const) {
      expect(echoPrompt({ ok: false, reason }, 'keys')).toBeNull();
      expect(echoPrompt({ ok: false, reason }, 'touch')).toBeNull();
    }
  });
});
