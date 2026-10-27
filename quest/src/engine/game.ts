// The game's rules in one place, shared by the Phaser field scene (which animates them) and the
// headless simulator (which replays puzzle solutions in tests): stepping, doors, triggers, talking,
// using puzzle objects, the Echo swap with anchors, dialogue, and end-of-act cards. Every action
// returns a list of effects for the caller to show. Pure TypeScript: no Phaser, no DOM.

import { encounterFlag } from './encounterFlags.ts';
import { ENCOUNTER_CHANCE_PER_STEP, ENCOUNTER_GRACE_STEPS, STARTING_GOLD } from '../config.ts';
import { evaluate, flagsIn } from './conditions.ts';
import { debateScript } from './debate.ts';
import { cardFlag, type CardDef, type EncounterGroup, type EncounterTable, type GameContent } from './content.ts';
import { DialogueRunner, type DialogueScript, type DialogueView } from './dialogue.ts';
import { FlagStore, type FlagSnapshot } from './flags.ts';
import { Rng } from './rng.ts';
import { ROTOR_PUSH_FLAG, pushRotor } from './rotor.ts';
import { components, doorArrival, doorAt, facingTiles, inBounds, isDiagonal, samePos, stepFrom } from './grid.ts';
import type { GameState } from './state.ts';
import { rectContains, type CrowdZone, type Door, type GameMap, type NpcPlacement, type PuzzleObject, type Trigger } from './tiledMap.ts';
import type { Dir8, Era, Pos } from './types.ts';
import { ECHO_FLAG_PREFIX, activeNpcs, activeObjects, activeTriggers, checkSwap, isOpen, npcBlocks, type SwapCheck } from './world.ts';

/** Flags remembering that the player has used or looked at a puzzle object (the use marker goes away). */
export const SEEN_FLAG_PREFIX = 'seen.';

export function seenFlag(mapId: string, objectId: string): string {
  return `${SEEN_FLAG_PREFIX}${mapId}.${objectId}`;
}

/**
 * Where the party goes back to after a lost fight (engine/gameOver.ts): set when a fight starts, as
 * "<map>/<x>,<y>", and cleared when it ends. A Game Over's Rise and a reload in the middle of a fight both use it.
 */
export const FIGHT_RETURN_FLAG = 'fight.return';
/** The scene a dialogue queued for after its fight is won (the pier: the marines flee, the fisher speaks). */
export const BATTLE_AFTER_FLAG = 'battle.after';
/** Gold a conversation charges (a number), paid when it ends. */
export const GOLD_PAY_FLAG = 'gold.pay';
/** Gold a conversation hands over (a number), added when it ends (Chapter 6: the Crown's purse, kept). */
export const GOLD_GAIN_FLAG = 'gold.gain';

/** What the player is facing, with the name its label shows. */
export type Target =
  | { kind: 'npc'; name: string; npc: NpcPlacement }
  | { kind: 'object'; name: string; object: PuzzleObject }
  | { kind: 'door'; name: string; door: Door };

/**
 * An interaction marker: `talk` over a person with something new to say (talking would change a
 * flag), `use` over an object not used yet or with something left to do. `pos` is the tile the marker
 * floats over (x may be a half tile, centred over a wide object).
 */
export interface Marker {
  kind: 'talk' | 'use';
  id: string;
  pos: Pos;
}

/** How deep the marker check follows dialogue choices. */
const NEWS_CHOICE_DEPTH = 3;

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
  | { kind: 'card'; card: CardDef }
  /** Back from the memory with anchors newly set: these present objects changed (the scene makes them glow). */
  | { kind: 'changed'; objects: string[]; flags: string[] }
  /** An ambush in a wild section (the scene flashes; a group with `enemies` then fights a real battle). */
  | { kind: 'encounter'; table: string; group: string }
  /** A vendor's greeting ended: open their shop. */
  | { kind: 'shop'; shop: string }
  /** A dialogue named a battle (flag `battle.next`): the scene runs it (data/battles.ts). */
  | { kind: 'battle'; battle: string }
  /** A rhythm lock to play (flag `rhythm.next` = "<id>" or "<id>:slow"); the scene reports back with finishRhythm. */
  | { kind: 'rhythm'; lock: string; slow: boolean }
  /** A sea voyage plays before the party lands (data/voyages.ts; flag `voyage.next` beside `travel.next`). */
  | { kind: 'voyage'; voyage: string }
  /** The game's last card closed (CardDef.credits): the end credits, then the title (Chapter 12). */
  | { kind: 'credits' }
  /** A step sounded (GameContent.onStep: the nightingale floor): a pitch at a tile, 0 for a silent board. */
  | { kind: 'note'; pitch: number; at: Pos };

export type StepAttempt =
  | { ok: true; to: Pos }
  | { ok: false; reason: 'busy' | 'bounds' | 'blocked' | 'occupied' | 'door_in_echo' | 'corner' }
  /** A door whose `if` does not hold yet: the caller plays its `closed` dialogue (closedDoor). */
  | { ok: false; reason: 'door_closed'; door: Door };

export class GameLogic {
  readonly maps: Readonly<Record<string, GameMap>>;
  readonly content: GameContent;
  state: GameState;
  mode: Mode = 'field';
  card: CardDef | null = null;
  private runner: DialogueRunner | null = null;
  private afterDialogue: Effect[] = [];
  /** Anchor flags already set when the player stepped into the memory (null: not known, e.g. loaded in the Echo). */
  private anchorsAtEntry: Set<string> | null = null;
  /** Random encounters: the dice, and steps walked in a wild zone since arriving or the last fight. */
  private readonly rng: Rng;
  private wildSteps = 0;
  /** The tile the last step left (the way back from a fight trigger), or null after a load or a new game. */
  private prevStep: { mapId: string; era: Era; pos: Pos } | null = null;

  /**
   * Where the encounter dice stand (a save does not carry them: a new session rolls new ambushes). The smoke test's
   * SMOKE_FROM start reads it to load a save mid-route and roll on as the whole route would have.
   */
  get diceState(): number {
    return this.rng.seed;
  }

  constructor(maps: Readonly<Record<string, GameMap>>, content: GameContent, state: GameState, seed = 1) {
    this.maps = maps;
    this.content = content;
    this.state = state;
    this.rng = new Rng(seed);
  }

  /** Drop any running dialogue or card (after a load or a new game). */
  reset(state: GameState = this.state): void {
    this.state = state;
    this.mode = 'field';
    this.card = null;
    this.runner = null;
    this.afterDialogue = [];
    this.anchorsAtEntry = null;
    this.wildSteps = 0;
    this.prevStep = null;
    // A save taken as a fight began (closed in the middle of it, or on the Game Over screen): the moment
    // before the fight, off the trigger's tile, and no stale after-fight scene to play at the next win.
    this.leaveLostFight();
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

  /** The crowds walking this map now (the present only; pictures, never in the way). */
  crowds(): CrowdZone[] {
    if (this.era !== 'present') return [];
    return (this.map.crowds ?? []).filter((c) => !c.if || evaluate(c.if, this.state.flags));
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

  /**
   * Face `dir` and say whether a step that way is allowed (the caller animates, then calls finishStep).
   * Diagonal steps follow grid.ts `tryMove`: the two straight neighbours must be open too (no corner
   * cutting). With `slide` (held input: the stick, keys, the scene and the simulator), a refused
   * diagonal slides along the wall instead: the horizontal part, else the vertical part; the player
   * then faces the way they actually step.
   */
  tryStep(dir: Dir8, slide = false): StepAttempt {
    if (this.mode !== 'field') return { ok: false, reason: 'busy' };
    const p = this.state.player;
    p.facing = dir;
    const attempt = this.checkStep(p.pos, dir);
    if (attempt.ok || !slide || !isDiagonal(dir)) return attempt;
    for (const part of components(dir)) {
      const along = this.checkStep(p.pos, part);
      if (along.ok) {
        p.facing = part;
        return along;
      }
    }
    return attempt;
  }

  private checkStep(from: Pos, dir: Dir8): StepAttempt {
    const to = stepFrom(from, dir);
    if (!inBounds(this.map, to)) return { ok: false, reason: 'bounds' };
    if (this.era === 'echo' && doorAt(this.map, to)) return { ok: false, reason: 'door_in_echo' };
    const door = doorAt(this.map, to);
    if (door && !this.doorOpen(door)) return { ok: false, reason: 'door_closed', door };
    if (!this.isOpen(to)) return { ok: false, reason: 'blocked' };
    if (npcBlocks(this.map, this.era, to, this.state.flags)) return { ok: false, reason: 'occupied' };
    if (isDiagonal(dir)) {
      for (const part of components(dir)) {
        const side = stepFrom(from, part);
        if (!this.isOpen(side) || npcBlocks(this.map, this.era, side, this.state.flags)) return { ok: false, reason: 'corner' };
      }
    }
    return { ok: true, to };
  }

  /** Whether a door lets the player through now (a door with no `if` always does). */
  doorOpen(door: Door): boolean {
    return !door.if || evaluate(door.if, this.state.flags);
  }

  /** Walked into a closed door: play its `closed` dialogue (someone says why not). */
  closedDoor(door: Door): Effect[] {
    if (this.mode !== 'field' || this.doorOpen(door) || !door.closed) return [];
    return this.startDialogue(door.closed);
  }

  /** Land on `to`: doors, then step triggers. Walking onto a walkable object (a bridge) counts as using it. */
  finishStep(to: Pos): Effect[] {
    this.prevStep = { mapId: this.state.player.mapId, era: this.era, pos: { ...this.state.player.pos } };
    this.state.player.pos = { ...to };
    const walkedOn = this.objects().filter(
      (o) => o.walkable && rectContains(o.area, to) && !this.state.flags.isSet(seenFlag(this.map.id, o.id)),
    );
    for (const o of walkedOn) this.state.flags.set(seenFlag(this.map.id, o.id), true);
    const seen: Effect[] = walkedOn.length > 0 ? [{ kind: 'sync' }] : [];
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
    // A step that sounds (the nightingale floor, Chapter 7): its note, and what it opened.
    const answer = this.content.onStep?.({ mapId: this.map.id, era: this.era, pos: { ...to } }, this.state.flags);
    if (answer) {
      if (answer.note !== undefined) seen.push({ kind: 'note', pitch: answer.note, at: { ...to } });
      if (answer.sync) seen.push({ kind: 'sync' });
      if (answer.toast) seen.push({ kind: 'toast', text: answer.toast });
    }
    const trigger = activeTriggers(this.map, this.era, this.state.flags).find(
      (t) => !t.onEnter && rectContains(t.area, to) && this.canFire(t),
    );
    if (trigger) return [...seen, ...this.fire(trigger)];
    return [...seen, ...this.rollEncounter(to)];
  }

  /** The encounter zone active here, if any (present only: the memory has no ambushes). */
  encounterZoneAt(pos: Pos) {
    if (this.era !== 'present') return undefined;
    return this.map.encounters.find((z) => rectContains(z.area, pos) && (!z.if || evaluate(z.if, this.state.flags)));
  }

  /**
   * A step in a wild zone: after ENCOUNTER_GRACE_STEPS safe steps, each step has an
   * ENCOUNTER_CHANCE_PER_STEP chance of an ambush from the zone's table (weighted). A group with
   * `enemies` is a real battle; one without falls back to the text stand-in (encounterScript).
   */
  private rollEncounter(pos: Pos): Effect[] {
    const zone = this.encounterZoneAt(pos);
    const table = zone && this.content.encounters?.[zone.table];
    if (!zone || !table || table.groups.length === 0) return [];
    this.wildSteps++;
    if (this.wildSteps <= ENCOUNTER_GRACE_STEPS || this.rng.next() >= ENCOUNTER_CHANCE_PER_STEP) return [];
    this.wildSteps = 0;
    const group = pickGroup(table, this.rng);
    // Owner rule (Oct 17): an ambush is always a real fight. The foes appear, then the battle starts.
    if (group.enemies?.length) {
      this.state.flags.set('battle.next', `encounter:${table.id}/${group.id}`);
      const intro: DialogueScript = { id: `encounter.${table.id}.${group.id}`, start: 'appear', nodes: { appear: { lines: [{ text: group.intro, fx: 'shake' }] } } };
      return [{ kind: 'encounter', table: table.id, group: group.id }, ...this.startScript(intro, [{ kind: 'save' }])];
    }
    return [{ kind: 'encounter', table: table.id, group: group.id }, ...this.startScript(encounterScript(table, group), [{ kind: 'save' }])];
  }

  /** Run the map's on-enter triggers. Call after every map change, new game or load (they are once-only). */
  enterMap(): Effect[] {
    this.wildSteps = 0;
    this.state.flags.set(`visited.${this.map.id}`, true); // the city map shows where the player has been
    if (this.mode !== 'field') return [];
    const trigger = activeTriggers(this.map, this.era, this.state.flags).find((t) => t.onEnter && this.canFire(t));
    return trigger ? this.fire(trigger) : [];
  }

  /**
   * Confirm in the field: talk to the NPC or use the object the player faces (grid.ts `facingTiles`:
   * for a diagonal facing, the diagonal tile first, then the sprite's side). An object with no dialogue
   * of its own shows its one-line description (data/objects.ts).
   */
  interact(): Effect[] {
    if (this.mode !== 'field') return [];
    const p = this.state.player;
    const npcs = this.npcs();
    const objects = this.objects();
    for (const tile of facingTiles(p.pos, p.facing)) {
      const npc = npcs.find((n) => samePos(n.pos, tile));
      if (npc) {
        const def = this.content.npcs[npc.npc]!;
        // Every conversation ends with an autosave (a story talk, like meeting Governor Thorne, is never lost).
        const after: Effect[] = def.shop ? [{ kind: 'shop', shop: def.shop }, { kind: 'save' }] : [{ kind: 'save' }];
        return [{ kind: 'talk', npc }, ...this.startDialogue(def.dialogue, after)];
      }
      const here = objects.filter((o) => rectContains(o.area, tile));
      const used = here.find((o) => o.dialogue);
      if (used?.dialogue) {
        this.state.flags.set(seenFlag(this.map.id, used.id), true);
        return this.startDialogue(used.dialogue, [{ kind: 'save' }]);
      }
      const looked = [...here].reverse().find((o) => this.content.objects?.[o.id]?.inspect);
      if (looked) {
        this.state.flags.set(seenFlag(this.map.id, looked.id), true);
        return this.startScript(inspectScript(looked.id, this.content.objects![looked.id]!.inspect!));
      }
    }
    return [];
  }

  /** The NPC, object or door the player faces, when it has a name to show. */
  targetAhead(): Target | null {
    if (this.mode !== 'field') return null;
    const p = this.state.player;
    const npcs = this.npcs();
    const objects = this.objects();
    for (const tile of facingTiles(p.pos, p.facing)) {
      const npc = npcs.find((n) => samePos(n.pos, tile));
      if (npc) {
        const name = this.content.npcs[npc.npc]?.name;
        if (name) return { kind: 'npc', name, npc };
        continue;
      }
      // The last active object wins: later objects show a state (the lit lamp over the lamp).
      const object = [...objects].reverse().find((o) => rectContains(o.area, tile) && this.content.objects?.[o.id]);
      if (object) return { kind: 'object', name: this.content.objects![object.id]!.name, object };
      const door = this.era === 'present' ? doorAt(this.map, tile) : undefined;
      const doorName = door && (this.content.doors?.[`${this.map.id}/${door.id}`] ?? this.content.doors?.[door.id]);
      if (door && doorName) return { kind: 'door', name: doorName, door };
    }
    return null;
  }

  /** Markers for this era and these flags (see Marker). */
  markers(): Marker[] {
    const out: Marker[] = [];
    for (const n of this.npcs()) {
      const def = this.content.npcs[n.npc]!;
      if (this.hasNews(def.dialogue)) out.push({ kind: 'talk', id: `npc:${n.objectId}`, pos: { ...n.pos } });
    }
    const taken = new Set<string>();
    for (const o of this.objects()) {
      const inspect = this.content.objects?.[o.id]?.inspect;
      if (!o.dialogue && !inspect) continue;
      const fresh = !this.state.flags.isSet(seenFlag(this.map.id, o.id)) || (!!o.dialogue && this.hasNews(o.dialogue));
      const pos = { x: o.area.x + (o.area.width - 1) / 2, y: o.area.y };
      const key = `${pos.x},${pos.y}`;
      if (!fresh || taken.has(key)) continue;
      taken.add(key);
      out.push({ kind: 'use', id: `obj:${o.id}`, pos });
    }
    return out;
  }

  /**
   * Whether playing a dialogue now would change any flag (on some path through its choices, up to
   * NEWS_CHOICE_DEPTH deep): the person has something new to say. A dry run on a copy of the flags.
   */
  hasNews(dialogueId: string): boolean {
    const script = this.content.dialogue[dialogueId];
    if (!script) return false;
    const base = this.state.flags.snapshot();
    const changed = (flags: FlagStore) => {
      const now = flags.snapshot();
      const keys = new Set([...Object.keys(base), ...Object.keys(now)]);
      for (const k of keys) if (base[k] !== now[k]) return true;
      return false;
    };
    const explore = (path: readonly number[]): boolean => {
      const flags = new FlagStore(base as FlagSnapshot);
      const runner = new DialogueRunner(script, this.content.speakers, flags, this.content.react);
      let depth = 0;
      for (let i = 0; i < 500 && !runner.done; i++) {
        const view = runner.view();
        if (view.kind === 'choice') {
          if (depth < path.length) {
            runner.choose(view.choices[path[depth]!]!.index);
            depth++;
            continue;
          }
          if (changed(flags)) return true;
          if (depth >= NEWS_CHOICE_DEPTH) return false;
          return view.choices.some((_, k) => explore([...path, k]));
        }
        runner.advance();
      }
      return changed(flags);
    };
    return explore([]);
  }

  /**
   * The Echo swap (guide 6.1). Allowed only in an active Echo Zone and only onto a tile that is open
   * in the other era; the position is kept. Returning to the present wipes the memory's own `echo.`
   * flags, so only anchors (their `anchor.` flags) carry changes back.
   */
  /** Whether an Echo would work where the player stands (and why not). */
  swapCheck(): SwapCheck {
    const p = this.state.player;
    return checkSwap(this.map, p.era, p.pos, this.state.flags);
  }

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
    let changed: Effect | null = null;
    if (check.to === 'present') {
      for (const name of Object.keys(this.state.flags.snapshot())) {
        if (name.startsWith(ECHO_FLAG_PREFIX)) this.state.flags.clear(name);
      }
      changed = this.anchorChanges();
      this.anchorsAtEntry = null;
    } else {
      this.anchorsAtEntry = new Set(this.map.anchors.map((a) => a.flag).filter((f) => this.state.flags.isSet(f)));
    }
    const effects: Effect[] = [
      { kind: 'era', era: check.to },
      { kind: 'sync' },
      { kind: 'toast', text: check.to === 'echo' ? m.enterEcho : m.leaveEcho },
    ];
    if (changed) effects.push(changed);
    const scene = check.to === 'echo' ? check.zone.onEcho : check.zone.onReturn;
    if (scene) effects.push(...this.startDialogue(scene));
    return effects;
  }

  /** Anchors set during this visit to the memory, and the present objects that read them. */
  private anchorChanges(): Effect | null {
    if (!this.anchorsAtEntry) return null;
    const before = this.anchorsAtEntry;
    const flags = this.map.anchors.map((a) => a.flag).filter((f) => this.state.flags.isSet(f) && !before.has(f));
    if (flags.length === 0) return null;
    const objects = this.objects('present')
      .filter((o) => flagsIn(o.if).some((f) => flags.includes(f)))
      .map((o) => o.id);
    return { kind: 'changed', objects, flags };
  }

  // ---- Dialogue ------------------------------------------------------------------------------

  /** Start a dialogue; `after` effects are returned when it ends (or at once if it shows nothing). */
  startDialogue(id: string, after: Effect[] = []): Effect[] {
    const debate = this.content.debates?.[id];
    if (debate) {
      const ctx = this.content.debateContext?.(this.state.flags, debate) ?? { influence: 0, mediateNeeds: Infinity };
      return this.startScript(debateScript(debate, this.state.flags, ctx), after);
    }
    const script = this.content.dialogue[id];
    if (!script) throw new Error(`Unknown dialogue ${id}`);
    return this.startScript(script, after);
  }

  private startScript(script: DialogueScript, after: Effect[] = []): Effect[] {
    this.runner = new DialogueRunner(script, this.content.speakers, this.state.flags, this.content.react);
    this.afterDialogue = after;
    if (this.runner.done) return this.finishDialogue();
    this.mode = 'dialogue';
    return [{ kind: 'dialogue' }];
  }

  /** The conversation running now, if any. */
  get dialogueId(): string | null {
    return this.mode === 'dialogue' ? (this.runner?.scriptId ?? null) : null;
  }

  view(): DialogueView {
    const v = this.runner?.view() ?? { kind: 'end' };
    const format = this.content.formatText;
    if (!format || v.kind === 'end' || !v.text.includes('{')) return v;
    return { ...v, text: format(v.text, this.state.flags) };
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

  /**
   * A battle has ended. After a win, the scene a dialogue queued for it (flag `battle.after`) plays at once:
   * the pier's marines flee and the fisher speaks. After a loss it is dropped (talking to the foes again
   * queues it again).
   */
  battleOver(won: boolean, then?: string): Effect[] {
    const flags = this.state.flags;
    const after = flags.get(BATTLE_AFTER_FLAG);
    flags.clear(BATTLE_AFTER_FLAG);
    this.forgetFightReturn();
    if (this.mode !== 'field') return [];
    // A fight meant to be lost: its scene, after a loss or a win alike.
    if (then) return this.startDialogue(then, [{ kind: 'save' }]);
    if (!won || typeof after !== 'string' || !after) return [];
    return this.startDialogue(after, [{ kind: 'save' }]);
  }

  /** The fight is over: a reload must not step the party back any more. */
  forgetFightReturn(): void {
    this.state.flags.clear(FIGHT_RETURN_FLAG);
  }

  /**
   * After a Game Over (engine/gameOver.ts): the moment before the fight. The party stands where it began (one
   * step back off a fight trigger, so walking on fights again), the after-fight scene is dropped (talking to the
   * foes again queues it again), and the field is free. A lost fight changed nothing else (items, gold and XP
   * only change on a win), so the game in memory already is that moment. The caller saves and redraws.
   */
  riseFromFight(): void {
    this.mode = 'field';
    this.card = null;
    this.runner = null;
    this.afterDialogue = [];
    this.leaveLostFight();
    // A fight lost inside a memory (Chapter 11: Caona's stand) rises in the present, where the shimmer is: the memory's
    // own flags go as they do on any return (an anchor set in it stays), and Echo takes the party back in.
    if (this.state.player.era === 'echo') {
      this.state.player.era = 'present';
      for (const name of Object.keys(this.state.flags.snapshot())) {
        if (name.startsWith(ECHO_FLAG_PREFIX)) this.state.flags.clear(name);
      }
      this.anchorsAtEntry = null;
    }
  }

  /** Back to the fight's return tile (when one is set and still open), and clear the fight's markers. */
  private leaveLostFight(): void {
    const flags = this.state.flags;
    const ret = flags.get(FIGHT_RETURN_FLAG);
    flags.clear(FIGHT_RETURN_FLAG);
    flags.clear(BATTLE_AFTER_FLAG);
    flags.clear('battle.next');
    const at = typeof ret === 'string' ? parseFightReturn(ret) : null;
    const p = this.state.player;
    const map = at && this.maps[at.mapId];
    if (at && map && at.mapId === p.mapId && isOpen(map, p.era, at.pos, flags)) p.pos = { ...at.pos };
  }

  /**
   * Where a fight starting now sends the party back to: where they stand, or, when that tile would fire a
   * trigger again (the boar's line across the Cane Road), the tile they stepped from, if it is open, on this map
   * and in this era, and is neither a door nor another trigger. Otherwise they stay put: the fight's foe
   * waits on the map (tests/gameOver.test.ts checks every fight has a way back in).
   */
  fightReturn(): { mapId: string; pos: Pos } {
    const p = this.state.player;
    const prev = this.prevStep;
    const back = this.wouldFire(p.pos) && prev && prev.mapId === p.mapId && prev.era === p.era && this.safeReturn(prev.pos);
    return { mapId: p.mapId, pos: { ...(back ? prev.pos : p.pos) } };
  }

  private safeReturn(pos: Pos): boolean {
    return (
      inBounds(this.map, pos) &&
      this.isOpen(pos) &&
      !npcBlocks(this.map, this.era, pos, this.state.flags) &&
      !doorAt(this.map, pos) &&
      !this.wouldFire(pos) &&
      !activeTriggers(this.map, this.era, this.state.flags).some((t) => rectContains(t.area, pos))
    );
  }

  /** A rhythm lock was played (scenes/FieldScene.ts, or the simulator): set its flags on success, then its scene. */
  finishRhythm(lock: string, ok: boolean): Effect[] {
    const def = this.content.rhythms?.[lock];
    if (!def || this.mode !== 'field') return [];
    if (ok) for (const [k, v] of Object.entries(def.success)) this.state.flags.set(k, v);
    return this.startDialogue(ok ? def.successDialogue : def.failDialogue, [{ kind: 'save' }]);
  }

  closeCard(): Effect[] {
    if (this.mode !== 'card') return [];
    const closed = this.card;
    this.mode = 'field';
    this.card = null;
    // Cards in a row (Chapter 12: The End, then the cast): the next one waiting shows at once.
    const next = this.pendingCard();
    if (next) return [{ kind: 'sync' }, ...this.showCard(next)];
    return [{ kind: 'sync' }, ...(closed?.credits ? [{ kind: 'credits' } as Effect] : []), ...this.travel()];
  }

  /** The first card whose flag is set and that has not been shown. */
  private pendingCard(): CardDef | undefined {
    const flags = this.state.flags;
    return this.content.cards.find((c) => flags.isSet(c.when) && !flags.isSet(cardFlag(c)));
  }

  private showCard(card: CardDef): Effect[] {
    this.state.flags.set(cardFlag(card), true);
    this.mode = 'card';
    this.card = card;
    return [{ kind: 'card', card }, { kind: 'save' }]; // the end of an act is always saved
  }

  /**
   * A journey a scene asked for (flag `travel.next` = "<map>/<spawn>", e.g. the ferry to Xaraguá): the
   * party arrives at that spawn in the present, and the caller enters the new map. After a card, the
   * journey waits until the card is closed.
   */
  private travel(): Effect[] {
    const flags = this.state.flags;
    const next = flags.get('travel.next');
    if (typeof next !== 'string' || !next) return [];
    flags.clear('travel.next');
    const [mapId, spawnId] = next.split('/');
    const map = this.maps[mapId ?? ''];
    const spawn = map?.spawns.find((s) => s.id === spawnId);
    if (!map || !spawn) throw new Error(`travel.next "${next}" leads nowhere`);
    this.state.player = { ...this.state.player, mapId: map.id, pos: { ...spawn.pos }, facing: spawn.facing, era: 'present' };
    const voyage = flags.get('voyage.next');
    flags.clear('voyage.next');
    return [...(typeof voyage === 'string' && voyage ? [{ kind: 'voyage', voyage } as Effect] : []), { kind: 'map' }, { kind: 'save' }];
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
    this.content.afterDialogue?.(flags);
    // A price paid in a conversation (flag `gold.pay`: Samira's invoice), taken from the purse.
    const pay = flags.get(GOLD_PAY_FLAG);
    flags.clear(GOLD_PAY_FLAG);
    if (typeof pay === 'number' && pay > 0) {
      const purse = flags.get('gold');
      flags.set('gold', Math.max(0, (typeof purse === 'number' ? purse : STARTING_GOLD) - pay));
    }
    const gain = flags.get(GOLD_GAIN_FLAG);
    flags.clear(GOLD_GAIN_FLAG);
    if (typeof gain === 'number' && gain > 0) {
      const purse = flags.get('gold');
      flags.set('gold', (typeof purse === 'number' ? purse : STARTING_GOLD) + gain);
    }
    // A screen pushed in the file house (engine/rotor.ts): turn it and its neighbours, and say what happened.
    const push = flags.get(ROTOR_PUSH_FLAG);
    flags.clear(ROTOR_PUSH_FLAG);
    if (typeof push === 'string' && push) {
      const [rotorId, index] = push.split(':');
      const rotor = this.content.rotors?.[rotorId ?? ''];
      if (rotor) {
        const r = pushRotor(rotor, flags, Number(index));
        const m = this.content.messages;
        if (r.ok) effects.push({ kind: 'toast', text: r.solved ? (m.rotorSolved ?? 'Every screen faces north.') : (m.rotorTurned ?? 'The screens turn.') });
        else if (r.reason === 'pegged') effects.push({ kind: 'refused', text: m.rotorPegged ?? 'That screen is pegged fast.' });
      }
    }
    const battle = flags.get('battle.next');
    if (typeof battle === 'string' && battle) {
      flags.clear('battle.next');
      // Remember the moment before the fight (set before the autosave above is written by the caller).
      const back = this.fightReturn();
      flags.set(FIGHT_RETURN_FLAG, `${back.mapId}/${back.pos.x},${back.pos.y}`);
      effects.push({ kind: 'battle', battle });
    }
    const rhythm = flags.get('rhythm.next');
    if (typeof rhythm === 'string' && rhythm) {
      flags.clear('rhythm.next');
      const [lock, tempo] = rhythm.split(':');
      effects.push({ kind: 'rhythm', lock: lock!, slow: tempo === 'slow' });
    }
    const card = this.pendingCard();
    if (card) {
      effects.push(...this.showCard(card));
      return effects;
    }
    effects.push(...this.travel());
    return effects;
  }
}

/** Reads FIGHT_RETURN_FLAG ("<map>/<x>,<y>"); null when it is not one. */
export function parseFightReturn(value: string): { mapId: string; pos: Pos } | null {
  const m = /^(.+)\/(-?\d+),(-?\d+)$/.exec(value);
  return m ? { mapId: m[1]!, pos: { x: Number(m[2]), y: Number(m[3]) } } : null;
}

/** A group from an encounter table, by weight. */
export function pickGroup(table: EncounterTable, rng: Rng): EncounterGroup {
  const total = table.groups.reduce((n, g) => n + (g.weight ?? 1), 0);
  let roll = rng.next() * total;
  for (const g of table.groups) {
    roll -= g.weight ?? 1;
    if (roll < 0) return g;
  }
  return table.groups[table.groups.length - 1]!;
}

export { encounterFlag };

/**
 * The text stand-in for an ambush group with no `enemies` (every group a map rolls today has them, and
 * fights a real battle): the foes appear, Fight always wins, Run always escapes. Both outcomes are remembered as flags so later scenes (and the battle system) can
 * read them.
 */
export function encounterScript(table: EncounterTable, group: EncounterGroup): DialogueScript {
  return {
    id: `encounter.${table.id}.${group.id}`,
    start: 'appear',
    nodes: {
      appear: {
        lines: [{ text: group.intro, fx: 'shake' }],
        choices: [
          { text: 'Fight', next: 'won' },
          { text: 'Run', next: 'fled' },
        ],
      },
      won: { set: { [encounterFlag(table.id, group.id, 'won')]: true }, lines: [{ text: group.won }] },
      fled: { set: { [encounterFlag(table.id, group.id, 'fled')]: true }, lines: [{ text: group.fled }] },
    },
  };
}

/** The one-line description an object shows when it has no dialogue of its own (no speaker). */
function inspectScript(objectId: string, text: string): DialogueScript {
  return { id: `inspect.${objectId}`, start: 'look', nodes: { look: { lines: [{ text }] } } };
}
