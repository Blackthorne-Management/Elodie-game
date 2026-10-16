// The world's dynamic rules, on top of a map's static layers: which NPCs, puzzle objects, triggers and
// Echo Zones are active for an era and the current flags, whether a tile is open, and whether the Echo
// swap is allowed here (guide 6.1). Pure TypeScript.

import { evaluate } from './conditions.ts';
import type { FlagReader } from './flags.ts';
import { inBounds, isWalkable, onDoor, otherEra, samePos } from './grid.ts';
import { rectContains, type EchoZone, type GameMap, type NpcPlacement, type PuzzleObject, type Trigger } from './tiledMap.ts';
import type { Era, EraScope, Pos } from './types.ts';

/** Flags in this namespace belong to the memory: they are wiped when the player returns to the present. */
export const ECHO_FLAG_PREFIX = 'echo.';
/** Flags in this namespace are carried from the memory into the present by anchors. */
export const ANCHOR_FLAG_PREFIX = 'anchor.';

export function inScope(scope: EraScope, era: Era): boolean {
  return scope === 'both' || scope === era;
}

export function activeNpcs(map: GameMap, era: Era, flags: FlagReader): NpcPlacement[] {
  return map.npcs.filter((n) => inScope(n.era, era) && evaluate(n.if, flags));
}

export function activeObjects(map: GameMap, era: Era, flags: FlagReader): PuzzleObject[] {
  return map.objects.filter((o) => inScope(o.era, era) && evaluate(o.if, flags));
}

export function activeTriggers(map: GameMap, era: Era, flags: FlagReader): Trigger[] {
  return map.triggers.filter((t) => inScope(t.era, era) && evaluate(t.if, flags));
}

/** The Echo Zone at a tile, whether or not its condition holds. */
export function zoneAt(map: GameMap, pos: Pos): EchoZone | undefined {
  return map.echoZones.find((z) => rectContains(z.area, pos));
}

/**
 * Whether a tile can be stood on in an era right now. The era's collision layer is the base; active
 * puzzle objects then open (`walkable`, e.g. a lowered bridge) or close (`solid`) their tiles. Doors do
 * not work inside the memory, so in the Echo a door tile is closed.
 */
export function isOpen(map: GameMap, era: Era, pos: Pos, flags: FlagReader): boolean {
  if (!inBounds(map, pos)) return false;
  if (era === 'echo' && map.doors.some((d) => onDoor(d, pos))) return false;
  let open = isWalkable(map, era, pos);
  for (const o of activeObjects(map, era, flags)) {
    if (!rectContains(o.area, pos)) continue;
    if (o.solid) return false;
    if (o.walkable) open = true;
  }
  return open;
}

/** Whether an active NPC stands on a tile in an era. */
export function npcBlocks(map: GameMap, era: Era, pos: Pos, flags: FlagReader): boolean {
  return activeNpcs(map, era, flags).some((n) => samePos(n.pos, pos));
}

export type SwapCheck =
  | { ok: true; to: Era; zone: EchoZone }
  /** no_zone: not in an Echo Zone. locked: in one, but its condition does not hold (no Locket yet).
   *  blocked: the tile is not open in the other era ("The memory will not hold here"). */
  | { ok: false; reason: 'no_zone' | 'locked' | 'blocked' };

/** The Echo swap rule (guide 6.1). */
export function checkSwap(map: GameMap, era: Era, pos: Pos, flags: FlagReader): SwapCheck {
  const zone = zoneAt(map, pos);
  if (!zone) return { ok: false, reason: 'no_zone' };
  if (!evaluate(zone.if, flags)) return { ok: false, reason: 'locked' };
  const to = otherEra(era);
  if (!isOpen(map, to, pos, flags) || npcBlocks(map, to, pos, flags)) return { ok: false, reason: 'blocked' };
  return { ok: true, to, zone };
}

/**
 * What to show while the player stands where an Echo would work (owner request, Oct 16): the key to
 * press, named as the player's controls name it. Nothing where it would not work (no zone, locked, or
 * no room in the other era).
 */
export function echoPrompt(check: SwapCheck, controls: 'keys' | 'touch'): string | null {
  if (!check.ok) return null;
  return controls === 'touch' ? 'Press Echo to Echo' : 'Press E to Echo';
}
