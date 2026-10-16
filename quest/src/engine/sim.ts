// Headless play (guide Section 9, check 2): feeds a list of inputs to the same GameLogic the field
// scene uses, one input at a time, the way a player presses buttons. Puzzle solutions and the whole-act
// route are replayed with it in tests, and the Playwright smoke test uses it to know what the browser
// should show after each key.
//
// Route text, one entry per array item:
//   "up" "down" "left" "right" "confirm" "cancel" "echo"   one press
//   "up-left" "up-right" "down-left" "down-right"         one diagonal press (both keys at once); a
//                                                         refused diagonal slides along the wall, as
//                                                         in the browser
//   "right*4"                                             the same press 4 times
//   "skip"                                                press A until the dialogue closes (taking the
//                                                         first choice), so routes survive dialogue edits
//   "goto 12,9"                                           walk there by the shortest path (route files only;
//                                                         never through a door or a trigger on the way)
//   "@name"                                               a marker (the smoke test takes screenshots there)

import type { Effect, GameLogic } from './game.ts';
import { components, isDiagonal, onDoor, samePos, stepFrom } from './grid.ts';
import { DIRS, DIRS8, type Dir8, type Pos } from './types.ts';

export type Command = Dir8 | 'confirm' | 'cancel' | 'echo' | 'skip';
const COMMANDS: readonly string[] = [...DIRS8, 'confirm', 'cancel', 'echo', 'skip'];

export type RouteItem =
  | { kind: 'press'; cmd: Command; count: number }
  | { kind: 'goto'; to: Pos }
  | { kind: 'mark'; name: string };

export function parseRoute(lines: readonly string[]): RouteItem[] {
  return lines.map((raw, i) => {
    const line = raw.trim();
    if (line.startsWith('@')) return { kind: 'mark', name: line.slice(1) };
    const go = /^goto\s+(\d+)\s*,\s*(\d+)$/.exec(line);
    if (go) return { kind: 'goto', to: { x: Number(go[1]), y: Number(go[2]) } };
    const m = /^([a-z-]+)(?:\*(\d+))?$/.exec(line);
    if (!m || !COMMANDS.includes(m[1]!)) throw new Error(`Route entry ${i + 1} is not an input: "${raw}"`);
    return { kind: 'press', cmd: m[1] as Command, count: m[2] ? Number(m[2]) : 1 };
  });
}

/**
 * Shortest walk to `goal` in the current era, over open tiles not blocked by NPCs, never crossing a
 * door or a trigger that would fire on the way (the goal itself may be one). Null when unreachable.
 * Straight steps only unless `diagonal` (route files use straight steps, so they never depend on the
 * corner rule; tests use both and compare).
 */
export function findPath(logic: GameLogic, goal: Pos, diagonal = false): Dir8[] | null {
  const start = logic.state.player.pos;
  if (samePos(start, goal)) return [];
  const map = logic.map;
  const key = (p: Pos) => p.y * map.width + p.x;
  const npcs = logic.npcs();
  const from = new Map<number, { prev: number; dir: Dir8 }>();
  const dirs = diagonal ? DIRS8 : DIRS;
  const passable = (p: Pos) => logic.isOpen(p) && !npcs.some((n) => samePos(n.pos, p));
  const queue: Pos[] = [start];
  from.set(key(start), { prev: -1, dir: 'down' });
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const dir of dirs) {
      const next = stepFrom(cur, dir);
      const k = key(next);
      if (from.has(k) || !passable(next)) continue;
      if (isDiagonal(dir) && !components(dir).every((part) => passable(stepFrom(cur, part)))) continue;
      const isGoal = samePos(next, goal);
      if (!isGoal && (map.doors.some((d) => onDoor(d, next)) || logic.wouldFire(next))) continue;
      from.set(k, { prev: key(cur), dir });
      if (isGoal) {
        const path: Dir8[] = [];
        for (let at = k; at !== key(start); at = from.get(at)!.prev) path.push(from.get(at)!.dir);
        return path.reverse();
      }
      queue.push(next);
    }
  }
  return null;
}

export class Sim {
  readonly logic: GameLogic;
  /** Choice cursor in the dialogue box. */
  cursor = 0;
  /** Toasts and refusals, in order. */
  readonly log: string[] = [];
  saves = 0;
  /** Every input pressed, after expanding repeats and `goto`. */
  readonly pressed: Command[] = [];
  /** Battles started, in order. */
  readonly battles: string[] = [];
  /** Plays a battle the way the battle scene would end it (tools/sim-setup.ts wins it); unset, battles are only logged. */
  onBattle: ((id: string) => void) | null = null;

  constructor(logic: GameLogic) {
    this.logic = logic;
  }

  /** The presses a route item stands for, from the current state. */
  expand(item: RouteItem): Command[] {
    if (item.kind === 'mark') return [];
    if (item.kind === 'press') return Array.from({ length: item.count }, () => item.cmd);
    if (this.logic.mode !== 'field') throw new Error(`goto ${item.to.x},${item.to.y} while in ${this.logic.mode}`);
    const path = findPath(this.logic, item.to);
    if (!path) {
      const p = this.logic.state.player;
      throw new Error(`No path from ${p.mapId} ${p.pos.x},${p.pos.y} (${p.era}) to ${item.to.x},${item.to.y}`);
    }
    return path;
  }

  run(route: readonly string[] | readonly RouteItem[]): this {
    const items = typeof route[0] === 'string' ? parseRoute(route as string[]) : (route as RouteItem[]);
    for (const item of items) for (const cmd of this.expand(item)) this.press(cmd);
    return this;
  }

  press(cmd: Command): void {
    this.pressed.push(cmd);
    this.apply(cmd);
  }

  private apply(cmd: Command): void {
    const logic = this.logic;
    switch (logic.mode) {
      case 'field':
        if (cmd === 'confirm') this.handle(logic.interact());
        else if (cmd === 'echo') this.handle(logic.swap());
        else if (cmd !== 'cancel' && cmd !== 'skip') {
          const step = logic.tryStep(cmd, true);
          if (step.ok) this.handle(logic.finishStep(step.to));
          else if (step.reason === 'door_in_echo') this.log.push(logic.content.messages.doorInEcho);
          else if (step.reason === 'door_closed') this.handle(logic.closedDoor(step.door));
        }
        break;
      case 'dialogue': {
        if (cmd === 'skip') {
          for (let i = 0; i < 1000 && logic.mode === 'dialogue'; i++) this.apply('confirm');
          if (logic.mode === 'dialogue') throw new Error('skip: the dialogue never ended');
          break;
        }
        const view = logic.view();
        if (view.kind === 'choice' && (cmd === 'up' || cmd === 'down')) {
          const n = view.choices.length;
          this.cursor = (this.cursor + (cmd === 'up' ? -1 : 1) + n) % n;
        } else if (cmd === 'confirm' || cmd === 'cancel') {
          if (view.kind === 'choice') {
            if (cmd === 'confirm') this.afterView(logic.choose(view.choices[this.cursor]!.index));
          } else this.afterView(logic.advance());
        }
        break;
      }
      case 'card':
        if (cmd === 'confirm') this.handle(logic.closeCard());
        break;
    }
  }

  private afterView(effects: Effect[]): void {
    this.cursor = 0;
    this.handle(effects);
  }

  private handle(effects: Effect[]): void {
    for (const e of effects) {
      if (e.kind === 'toast' || e.kind === 'refused') this.log.push(e.text);
      else if (e.kind === 'save') this.saves++;
      else if (e.kind === 'dialogue') this.cursor = 0;
      else if (e.kind === 'map') this.handle(this.logic.enterMap());
      else if (e.kind === 'battle') {
        this.battles.push(e.battle);
        this.onBattle?.(e.battle);
      }
    }
  }
}
