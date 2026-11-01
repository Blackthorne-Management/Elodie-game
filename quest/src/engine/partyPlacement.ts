// Where the walking party stands when it stops, and who must be brought on for a line (playtests, Nov 1).
// Pure TypeScript: the field scene asks, draws and walks them.
//
// People are drawn about two tiles tall on one-tile feet, so anyone standing on the tile straight in front of or
// behind someone else in the same column covers them (Anissa vanished behind Gianna in most scenes). While walking,
// the party keeps its trailing line; when it stops, the followers settle beside Gianna, or diagonally behind her,
// never in a column with her or with each other.

import type { Dir, Pos } from './types.ts';

/** How many rows a person's picture covers (32 px on 16 px tiles). */
export const PERSON_ROWS = 2;

/** Whether people on `a` and `b` would hide one another: the same column, closer than a picture is tall. */
export function hidesEachOther(a: Pos, b: Pos, rows = PERSON_ROWS): boolean {
  return a.x === b.x && a.y !== b.y && Math.abs(a.y - b.y) < rows;
}

export interface SettleInput {
  /** Gianna's tile and the way she faces. */
  player: Pos;
  facing: Dir;
  /** Where each follower stands now, in line order (Anissa first). One spot is chosen for each. */
  followers: readonly Pos[];
  /** Whether someone may stand on a tile: walkable, and no door, person, or prop drawn over it. */
  open: (p: Pos) => boolean;
  /** Whether the way there goes over a tile (walkable, people or not; default `open`): a narrow pier full of the party still leads on. */
  passable?: (p: Pos) => boolean;
  /** The map's size: the outer row and column are avoided (a head on the top row is cut off). */
  width: number;
  height: number;
  /** Whether a person standing on a tile is wholly on the screen (optional: everything is). */
  visible?: (p: Pos) => boolean;
  /** People not in the party whom the party should not cover (the map's people, the scene's actors). */
  others?: readonly Pos[];
  /** People of the party who stay where they are (nobody settles in their column either). */
  placed?: readonly Pos[];
  /** How many walking steps from Gianna a settled follower may stand at most (default 3). */
  reach?: number;
}

const VEC: Record<Dir, Pos> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

/** The open tiles a few steps from `from` (four ways, through open tiles only), with their step counts. */
function nearby(from: Pos, open: (p: Pos) => boolean, reach: number): Map<string, { at: Pos; steps: number }> {
  const seen = new Map<string, { at: Pos; steps: number }>([[`${from.x},${from.y}`, { at: from, steps: 0 }]]);
  let frontier = [from];
  for (let steps = 1; steps <= reach; steps++) {
    const next: Pos[] = [];
    for (const p of frontier) {
      for (const d of Object.values(VEC)) {
        const t = { x: p.x + d.x, y: p.y + d.y };
        const key = `${t.x},${t.y}`;
        if (seen.has(key) || !open(t)) continue;
        seen.set(key, { at: t, steps });
        next.push(t);
      }
    }
    frontier = next;
  }
  return seen;
}

/**
 * Where each follower settles when the party stops: on open tiles Gianna can walk to in a few steps, beside her in her
 * row first, then diagonally behind her, then further out; never on her tile, never in a column with her or another
 * of the party (that hides one of them), not in front of her, not on the map's outer edge, on the screen, off the
 * map's people's columns where possible, and as near as can be to where each already stands (no shuffling).
 * With nowhere open at all, a follower stays where they are.
 */
export function settleSpots(input: SettleInput): Pos[] {
  const { player, facing, followers, open, width, height } = input;
  const reach = input.reach ?? 3;
  const ahead = VEC[facing];
  const tiles = [...nearby(player, input.passable ?? open, reach).values()].filter((t) => t.steps > 0 && open(t.at));
  const placed: Pos[] = [player, ...(input.placed ?? [])];
  const out: Pos[] = [];
  for (const [i, now] of followers.entries()) {
    let best: { at: Pos; cost: number } | null = null;
    for (const t of tiles) {
      const { at } = t;
      if (placed.some((p) => p.x === at.x && p.y === at.y)) continue;
      const dx = at.x - player.x;
      const dy = at.y - player.y;
      const forward = dx * ahead.x + dy * ahead.y;
      const side = Math.abs(dx * ahead.y - dy * ahead.x);
      const far = Math.max(Math.abs(dx), Math.abs(dy));
      let cost = 2 * far + (t.steps - far);
      if (forward > 0) cost += side === 0 ? 3 : 1.5; // in front of her: in her way, or half in it
      if (forward < 0) cost += 0.5; // a row back: beside her reads better
      if (side === 0 && ahead.y !== 0) cost += 2; // straight behind her in her column
      if (placed.some((p) => hidesEachOther(p, at))) cost += 50;
      if ((input.others ?? []).some((p) => hidesEachOther(p, at))) cost += 6;
      if (at.x <= 0 || at.y <= 0 || at.x >= width - 1 || at.y >= height - 1) cost += 6;
      if (input.visible && !input.visible(at)) cost += 20;
      // Next to the one ahead in the line keeps the line together; near where they stand saves a walk.
      const lead = i > 0 ? out[i - 1]! : player;
      if (i > 0 && Math.max(Math.abs(lead.x - at.x), Math.abs(lead.y - at.y)) > 1) cost += 1;
      cost += 0.1 * Math.hypot(now.x - at.x, now.y - at.y);
      if (!best || cost < best.cost) best = { at, cost };
    }
    const spot = best?.at ?? now;
    out.push({ ...spot });
    placed.push(spot);
  }
  return out;
}

/**
 * Where someone brought on to stand at `spot` walks in from: the farthest open tile a few steps away, away from where
 * Gianna faces where there is a choice (as if they had been just behind the party). `spot` itself if nothing is open.
 */
export function entryTile(spot: Pos, facing: Dir, open: (p: Pos) => boolean, steps = 3): Pos {
  const ahead = VEC[facing];
  let best: { at: Pos; score: number } | null = null;
  for (const t of nearby(spot, open, steps).values()) {
    const away = -((t.at.x - spot.x) * ahead.x + (t.at.y - spot.y) * ahead.y);
    const score = t.steps * 2 + away;
    if (!best || score > best.score) best = { at: t.at, score };
  }
  return { ...(best?.at ?? spot) };
}

/**
 * Who must be brought on before a line shows (owner rule, Oct 17: shown, not told; Oct 29: only one companion walks):
 * the line's speaker, when they are a companion in the party who is neither walking the map nor already on stage.
 * Narration (no speaker) brings on a companion it names, given `narration` and the names.
 */
export function mustBringOn(
  line: { speaker: string | null; text: string; staged: boolean },
  party: { companions: readonly string[]; members: readonly string[]; onMap: ReadonlySet<string>; names?: Readonly<Record<string, string>> },
): string[] {
  const absent = (id: string) => party.companions.includes(id) && party.members.includes(id) && !party.onMap.has(id);
  if (line.speaker) return absent(line.speaker) ? [line.speaker] : [];
  if (line.staged || !party.names) return [];
  return party.companions.filter((id) => {
    const name = party.names![id];
    return !!name && absent(id) && new RegExp(`\\b${name}\\b`).test(line.text);
  });
}

/**
 * The camera's top edge in a conversation (playtest Nov 1: the box covered the speakers at the map's bottom): moved
 * down, past the map's edge if need be, until everyone in `feet` (world y of the bottoms of their pictures) stands
 * above `boxTop` (screen y), as long as the highest head (pictures `personPx` tall) stays on the screen.
 */
export function dialogueCameraY(scrollY: number, feet: readonly number[], boxTop: number, personPx: number): number {
  if (feet.length === 0) return scrollY;
  const lowest = Math.max(...feet);
  const highest = Math.min(...feet) - personPx;
  const need = lowest - scrollY - boxTop;
  if (need <= 0) return scrollY;
  const room = highest - scrollY; // how far down before the highest head leaves the top
  return scrollY + Math.max(0, Math.min(need, room));
}
