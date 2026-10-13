// The game's rules in one place, shared by the Phaser field scene (which animates them) and the
// headless simulator (which replays puzzle solutions in tests): stepping, doors, triggers, talking,
// using puzzle objects, the Echo swap with anchors, dialogue, and end-of-act cards. Every action
// returns a list of effects for the caller to show. Pure TypeScript: no Phaser, no DOM.

import { cardFlag, type CardDef, type GameContent } from './content.ts';
import { DialogueRunner, type DialogueView } from './dialogue.ts';
import { doorArrival, doorAt, inBounds, samePos, stepFrom } from './grid.ts';
import type { GameState } from './state.ts';
import { rectContains, type GameMap, type NpcPlacement, type PuzzleObject, type Trigger } from './tiledMap.ts';
import type { Dir, Era, Pos } from './types.ts';
import { ECHO_FLAG_PREFIX, activeNpcs, activeObjects, activeTriggers, checkSwap, isOpen, npcBlocks } from './world.ts';

export type Mode = 'field' | 'dialogue' | 'card';

export type Effect =
  /** The player is on another map now (the scene rebuilds). */
  | { kind: 'map' }
  /** The Echo swap happened. */
  | { kind: 'era'; era: Era }
  | { kind: 'toast'; text: string }
  /** A refused swap or step (soft sound plus the message). */
  | { kind: 'refused'; text: string }
  /** Autosave now. */
  | { kind: 'save' }
  /** Flags may have changed: redraw NPCs and puzzle objects. */
  | { kind: 'sync' }
  /** A dialogue started (read it with `view()`). */
  | { kind: 'dialogue' }
  /** The player started talking to this NPC (the scene turns it to face the player). */
  | { kind: 'talk'; npc: NpcPlacement }
  | { kind: 'card'; card: CardDef };

export type StepAttempt =
  | { ok: true; to: Pos }
  | { ok: false; reason: 'busy' | 'bounds' | 'blocked' | 'occupied' | 'door_in_echo' };

export class GameLogic {
  readonly maps: Readonly<Record<string, GameMap>>;
  readonly content: GameContent;
  state: GameState;
  mode: Mode = 'field';
  card: CardDef | null = null;
  private runner: DialogueRunner | null = null;
  private afterDialogue: Effect[] = [];

  constructor(maps: Readonly<Record<string, GameMap>>, content: GameContent, state: GameState) {
    this.maps = maps;
    this.content = content;
    this.state = state;
  }

  /** Drop any running dialogue or card (after a load or a new game). */
  reset(state: GameState = this.state): void {
    this.state = state;
    this.mode = 'field';
    this.card = null;
    this.runner = null;
    this.afterDialogue = [];
  }

  get map(): GameMap {
    const map = this.maps[this.state.player.mapId];
    if (!map) throw new Error(`Unknown map ${this.state.player.mapId}`);
    return map;
  }

  get era(): Era {
    return this.state.player.era;
  }

  npcs(era: Era = this.era): NpcPlacement[] {
    return activeNpcs(this.map, era, this.state.flags).filter((n) => !!this.content.npcs[n.npc]);
  }

  objects(era: Era = this.era): PuzzleObject[] {
    return activeObjects(this.map, era, this.state.flags);
  }

  isOpen(pos: Pos, era: Era = this.era): boolean {
    return isOpen(this.map, era, pos, this.state.flags);
  }

  /** Whether stepping onto this tile would fire a trigger (route planning avoids them). */
  wouldFire(pos: Pos): boolean {
    return activeTriggers(this.map, this.era, this.state.flags).some(
      (t) => !t.onEnter && rectContains(t.area, pos) && this.canFire(t),
    );
  }

  // ---- Field ---------------------------------------------------------------------------------

  /** Face `dir` and say whether a step that way is allowed (the caller animates, then calls finishStep). */
  tryStep(dir: Dir): StepAttempt {
    if (this.mode !== 'field') return { ok: false, reason: 'busy' };
    const p = this.state.player;
    p.facing = dir;
    const to = stepFrom(p.pos, dir);
    if (!inBounds(this.map, to)) return { ok: false, reason: 'bounds' };
    if (this.era === 'echo' && doorAt(this.map, to)) return { ok: false, reason: 'door_in_echo' };
    if (!this.isOpen(to)) return { ok: false, reason: 'blocked' };
    if (npcBlocks(this.map, this.era, to, this.state.flags)) return { ok: false, reason: 'occupied' };
    return { ok: true, to };
  }

  /** Land on `to`: doors, then step triggers. */
  finishStep(to: Pos): Effect[] {
    this.state.player.pos = { ...to };
    const door = doorAt(this.map, to);
    if (door && this.era === 'present') {
      const targetMap = this.maps[door.targetMap];
      const target = targetMap?.doors.find((d) => d.id === door.target);
      if (!targetMap || !target) throw new Error(`Door ${door.id} on ${this.map.id} leads nowhere`);
      const arrival = doorArrival(target);
      this.state.player = { ...this.state.player, mapId: targetMap.id, pos: arrival.pos, facing: arrival.facing };
      // The caller runs enterMap() once it has switched maps (after this autosave).
      return [{ kind: 'map' }, { kind: 'save' }];
    }
    const trigger = activeTriggers(this.map, this.era, this.state.flags).find(
      (t) => !t.onEnter && rectContains(t.area, to) && this.canFire(t),
    );
    return trigger ? this.fire(trigger) : [];
  }

  /** Run the map's on-enter triggers. Call after every map change, new game or load (they are once-only). */
  enterMap(): Effect[] {
    if (this.mode !== 'field') return [];
    const trigger = activeTriggers(this.map, this.era, this.state.flags).find((t) => t.onEnter && this.canFire(t));
    return trigger ? this.fire(trigger) : [];
  }

  /** Confirm in the field: talk to the NPC or use the object in front of the player. */
  interact(): Effect[] {
    if (this.mode !== 'field') return [];
    const p = this.state.player;
    const front = stepFrom(p.pos, p.facing);
    const npc = this.npcs().find((n) => samePos(n.pos, front));
    if (npc) {
      const def = this.content.npcs[npc.npc]!;
      return [{ kind: 'talk', npc }, ...this.startDialogue(def.dialogue)];
    }
    const obj = this.objects().find((o) => o.dialogue && rectContains(o.area, front));
    if (obj?.dialogue) return this.startDialogue(obj.dialogue);
    return [];
  }

  /**
   * The Echo swap (guide 6.1). Allowed only in an active Echo Zone and only onto a tile that is open
   * in the other era; the position is kept. Returning to the present wipes the memory's own `echo.`
   * flags, so only anchors (their `anchor.` flags) carry changes back.
   */
  swap(): Effect[] {
    if (this.mode !== 'field') return [];
    const p = this.state.player;
    const check = checkSwap(this.map, p.era, p.pos, this.state.flags);
    const m = this.content.messages;
    if (!check.ok) {
      const text = check.reason === 'no_zone' ? m.noZone : check.reason === 'locked' ? m.locked : m.blocked;
      return [{ kind: 'refused', text }];
    }
    p.era = check.to;
    if (check.to === 'present') {
      for (const name of Object.keys(this.state.flags.snapshot())) {
        if (name.startsWith(ECHO_FLAG_PREFIX)) this.state.flags.clear(name);
      }
    }
    const effects: Effect[] = [
      { kind: 'era', era: check.to },
      { kind: 'sync' },
      { kind: 'toast', text: check.to === 'echo' ? m.enterEcho : m.leaveEcho },
    ];
    const scene = check.to === 'echo' ? check.zone.onEcho : check.zone.onReturn;
    if (scene) effects.push(...this.startDialogue(scene));
    return effects;
  }

  // ---- Dialogue ------------------------------------------------------------------------------

  /** Start a dialogue; `after` effects are returned when it ends (or at once if it shows nothing). */
  startDialogue(id: string, after: Effect[] = []): Effect[] {
    const script = this.content.dialogue[id];
    if (!script) throw new Error(`Unknown dialogue ${id}`);
    this.runner = new DialogueRunner(script, this.content.speakers, this.state.flags);
    this.afterDialogue = after;
    if (this.runner.done) return this.finishDialogue();
    this.mode = 'dialogue';
    return [{ kind: 'dialogue' }];
  }

  view(): DialogueView {
    return this.runner?.view() ?? { kind: 'end' };
  }

  /** Move past the current line (no effect while a choice waits). */
  advance(): Effect[] {
    if (this.mode !== 'dialogue' || !this.runner) return [];
    this.runner.advance();
    return this.runner.done ? this.finishDialogue() : [];
  }

  choose(index: number): Effect[] {
    if (this.mode !== 'dialogue' || !this.runner) return [];
    this.runner.choose(index);
    return this.runner.done ? this.finishDialogue() : [];
  }

  closeCard(): Effect[] {
    if (this.mode !== 'card') return [];
    this.mode = 'field';
    this.card = null;
    return [{ kind: 'sync' }];
  }

  // ---- Internals -----------------------------------------------------------------------------

  private canFire(t: Trigger): boolean {
    return !(t.once && t.flag && this.state.flags.isSet(t.flag));
  }

  private fire(t: Trigger): Effect[] {
    if (t.flag) this.state.flags.set(t.flag, true);
    if (t.dialogue) return this.startDialogue(t.dialogue, [{ kind: 'save' }]);
    return [{ kind: 'sync' }, { kind: 'save' }];
  }

  private finishDialogue(): Effect[] {
    this.runner = null;
    this.mode = 'field';
    const effects: Effect[] = [...this.afterDialogue, { kind: 'sync' }];
    this.afterDialogue = [];
    const flags = this.state.flags;
    const card = this.content.cards.find((c) => flags.isSet(c.when) && !flags.isSet(cardFlag(c)));
    if (card) {
      flags.set(cardFlag(card), true);
      this.mode = 'card';
      this.card = card;
      effects.push({ kind: 'card', card }, { kind: 'save' }); // the end of an act is always saved
    }
    return effects;
  }
}
