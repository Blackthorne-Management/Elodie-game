// The gold-arrow walk (review 1, Oct 21, finding 2): a player who follows nothing but the gold arrow. From a new
// game it walks to the story's goal (engine/guide.ts storyGoal) or to the door the arrow names (waypoint), talks
// to or acts on whatever is at the goal (steps onto it, presses Echo on a shimmer, faces it and presses A), and
// takes the first choice of every conversation. It never looks around: when the arrow brings it back to a state it
// has already been in (same flags, map, tile, era), the arrow has failed the player, and the walk records a stall
// and stops. tests/goldWalk.test.ts runs it to the end of Chapter 2; `node --experimental-strip-types
// tools/gold-walk.ts` prints its numbers.

import { CHAPTERS } from '../src/data/quests.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import type { GameLogic } from '../src/engine/game.ts';
import { onDoor, samePos, stepFrom } from '../src/engine/grid.ts';
import { storyGoal, waypoint, type Waypoint } from '../src/engine/guide.ts';
import { currentObjective, questForJournal } from '../src/engine/quests.ts';
import { findPath, type Sim } from '../src/engine/sim.ts';
import type { GameMap } from '../src/engine/tiledMap.ts';
import { DIRS, type Dir, type Dir8, type Pos } from '../src/engine/types.ts';
import { loadMaps, newGameSim } from './sim-setup.ts';

export interface GoldWalk {
  /** Tiles walked. */
  steps: number;
  /** Map changes. */
  mapChanges: number;
  /** Where the arrow failed (empty on a clean walk). */
  stalls: string[];
  /** Whether `until` held at the end. */
  finished: boolean;
  /** Objectives in the order the walk met them (`chapter/objective`). */
  objectives: string[];
  sim: Sim;
}

/** A shortest walk to `goal` that may cross step triggers (never a door but the goal): the fallback when findPath has none. */
function pathThroughTriggers(logic: GameLogic, goal: Pos): Dir[] | null {
  const map = logic.map;
  const start = logic.state.player.pos;
  const key = (p: Pos) => p.y * map.width + p.x;
  const npcs = logic.npcs();
  const from = new Map<number, { prev: number; dir: Dir }>([[key(start), { prev: -1, dir: 'down' }]]);
  const queue: Pos[] = [start];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const dir of DIRS) {
      const next = stepFrom(cur, dir);
      const k = key(next);
      if (from.has(k) || !logic.isOpen(next) || npcs.some((n) => samePos(n.pos, next))) continue;
      const isGoal = samePos(next, goal);
      if (!isGoal && map.doors.some((d) => onDoor(d, next))) continue;
      from.set(k, { prev: key(cur), dir });
      if (isGoal) {
        const path: Dir[] = [];
        for (let at = k; at !== key(start); at = from.get(at)!.prev) path.push(from.get(at)!.dir);
        return path.reverse();
      }
      queue.push(next);
    }
  }
  return null;
}

/** Choices a player takes only when nothing else is offered. */
const DISMISS = /^(never mind|not yet|not now|leave it|walk on|no\b|maybe later|later|goodbye|close|nothing)/i;

const pathTo = (logic: GameLogic, to: Pos) => findPath(logic, to) ?? pathThroughTriggers(logic, to);

/** The straight direction from `a` to the neighbouring tile `b`. */
function towards(a: Pos, b: Pos): Dir {
  if (b.x > a.x) return 'right';
  if (b.x < a.x) return 'left';
  return b.y > a.y ? 'down' : 'up';
}

/** Walk until we arrive, the map or era changes, or something starts (a dialogue, a card). */
function walk(sim: Sim, path: readonly Dir8[], count: { steps: number }): void {
  const { mapId } = sim.logic.state.player;
  const era = sim.logic.era;
  for (const dir of path) {
    const before = { ...sim.logic.state.player.pos };
    sim.press(dir);
    if (!samePos(before, sim.logic.state.player.pos)) count.steps++;
    if (sim.logic.mode !== 'field' || sim.logic.state.player.mapId !== mapId || sim.logic.era !== era) return;
  }
}

/** Do what the arrow asks at a waypoint: walk to the door, or to the goal and use it. False: nothing to do (stall). */
function act(sim: Sim, wp: Waypoint, count: { steps: number }): string | null {
  const logic = sim.logic;
  const here = logic.state.player.pos;
  if (!wp.final) {
    const path = pathTo(logic, wp.at);
    if (!path) return `no path to the door at ${wp.at.x},${wp.at.y}`;
    walk(sim, path, count);
    return null;
  }
  const occupied = (p: Pos) => !logic.isOpen(p) || logic.npcs().some((n) => samePos(n.pos, p));
  if (samePos(here, wp.at)) {
    // On the goal: press Echo on a shimmer, else press A facing the way we came.
    if (logic.swapCheck().ok) sim.press('echo');
    else sim.press('confirm');
    return null;
  }
  if (!occupied(wp.at)) {
    const path = pathTo(logic, wp.at);
    if (path) {
      walk(sim, path, count);
      return null;
    }
  }
  // The goal is a person or a thing (or out of reach): stand next to it, face it, press A.
  if (Math.abs(here.x - wp.at.x) + Math.abs(here.y - wp.at.y) === 1) {
    sim.press(towards(here, wp.at));
    if (logic.mode === 'field' && samePos(here, logic.state.player.pos)) sim.press('confirm');
    return null;
  }
  let best: Dir8[] | null = null;
  for (const d of DIRS) {
    const side = stepFrom(wp.at, d);
    if (occupied(side)) continue;
    const path = pathTo(logic, side);
    if (path && (!best || path.length < best.length)) best = path;
  }
  if (!best) return `no way to reach ${wp.at.x},${wp.at.y}`;
  walk(sim, best, count);
  return null;
}

export interface GoldWalkOptions {
  maps?: Record<string, GameMap>;
  /** Carry on from this game (default: a new one). */
  sim?: Sim;
  /** Stop once this holds (default: the last objective of `through` done). */
  until?: (sim: Sim) => boolean;
  /** The chapter (quest id) whose end is the default stop (default 'act2'). */
  through?: string;
  /** At most this many decisions (a line of dialogue, a walk, a press at the goal). */
  maxActions?: number;
}

/** Follow the gold arrow until `until` holds, a stall, or `maxActions` decisions. */
export function goldWalk(opts: GoldWalkOptions = {}): GoldWalk {
  const maps = opts.maps ?? loadMaps();
  const sim = opts.sim ?? newGameSim(maps);
  const until = opts.until;
  const maxActions = opts.maxActions ?? 20000;
  const logic = sim.logic;
  const flags = logic.state.flags;
  const last = CHAPTERS.find((q) => q.id === (opts.through ?? 'act2'));
  if (!last) throw new Error(`no chapter ${opts.through}`);
  const done = until ?? (() => currentObjective(last, flags) === null);
  const count = { steps: 0 };
  let mapChanges = 0;
  let lastMap = logic.state.player.mapId;
  const stalls: string[] = [];
  const objectives: string[] = [];
  const seen = new Set<string>();
  const menus = new Map<string, number>();
  for (let i = 0; i < maxActions; i++) {
    const p = logic.state.player;
    if (p.mapId !== lastMap) {
      mapChanges++;
      lastMap = p.mapId;
    }
    if (done(sim)) return { steps: count.steps, mapChanges, stalls, finished: true, objectives, sim };
    if (logic.mode === 'dialogue') {
      // The first sensible choice (never "Never mind", "Not yet", "Walk on" while there is another); every other
      // line, A. A menu met again (a bookshelf, a quiz answered wrong, a debate after
      // listening) gets its next sensible choice, the way a player tries something else.
      const view = logic.view();
      if (view.kind === 'choice') {
        const sensible = view.choices.filter((c) => !DISMISS.test(c.text));
        const options = sensible.length > 0 ? sensible : view.choices;
        const key = `${view.text}|${view.choices.map((c) => c.text).join("/")}`;
        const asked = menus.get(key) ?? 0;
        // Capped at the menu's length: once every choice has been tried, a menu met again is a loop (a stall).
        menus.set(key, Math.min(asked + 1, options.length));
        const pick = options[Math.min(asked, options.length - 1)]!;
        sim.cursor = view.choices.indexOf(pick);
      } else sim.cursor = 0;
      sim.press('confirm');
      continue;
    }
    if (logic.mode !== 'field') {
      sim.press('confirm');
      continue;
    }
    const quest = questForJournal(CHAPTERS, p.mapId, flags);
    const objective = quest ? currentObjective(quest, flags) : null;
    const where = `${quest?.id ?? '-'}/${objective?.id ?? '-'} on ${p.mapId} ${p.pos.x},${p.pos.y} (${logic.era})`;
    if (objective && objectives.at(-1) !== `${quest!.id}/${objective.id}`) objectives.push(`${quest!.id}/${objective.id}`);
    const goal = storyGoal(quest, flags, SIDE_QUESTS, p.mapId, logic.era);
    if (!goal) {
      stalls.push(`${where}: no goal`);
      break;
    }
    // In the Echo the field scene draws only an Echo goal's arrow (FieldScene refreshGuide).
    if (logic.era === 'echo' && !goal.echo) {
      stalls.push(`${where}: no arrow in the Echo (the goal is ${goal.map} ${goal.at.x},${goal.at.y})`);
      break;
    }
    const wp = waypoint(maps, p.mapId, goal, flags);
    if (!wp) {
      stalls.push(`${where}: no way to ${goal.map} ${goal.at.x},${goal.at.y}`);
      break;
    }
    // The choices tried so far are part of the state: a quiz answered wrong, met again, is a new try, not a loop.
    const state = `${JSON.stringify(flags.snapshot())}|${p.mapId}|${p.pos.x},${p.pos.y}|${logic.era}|${p.facing}|${JSON.stringify([...menus])}`;
    if (seen.has(state)) {
      stalls.push(`${where}: back where it was, arrow at ${wp.map} ${wp.at.x},${wp.at.y}${wp.final ? '' : ' (door)'}`);
      break;
    }
    seen.add(state);
    const problem = act(sim, wp, count);
    if (problem) {
      stalls.push(`${where}: ${problem}`);
      break;
    }
  }
  return { steps: count.steps, mapChanges, stalls, finished: done(sim), objectives, sim };
}

const isMain = process.argv[1] !== undefined && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  // `tools/gold-walk.ts act5` walks to the end of Chapter 5 (default: Chapter 2).
  const out = goldWalk({ through: process.argv[2] ?? 'act2' });
  console.log(`steps ${out.steps}, map changes ${out.mapChanges}, finished ${out.finished}`);
  console.log(`stalls: ${out.stalls.length ? out.stalls.join('\n  ') : 'none'}`);
  console.log(out.objectives.join(' > '));
}
