// Sea voyages between capitals (owner request, Oct 17: no more teleporting; a canoe out to a ship, then the
// ship's route on the realm map). This plots the route: a walk over the realm map's sea cells (data/realmMap.ts,
// traced from the board) through the voyage's waypoints, so the ship never crosses land, thinned to a smooth
// line. Pure TypeScript, tested in tests/voyage.test.ts; scenes/VoyageScene.ts draws it.

import type { RealmMapData } from '../data/realmMap.ts';
import type { Pos } from './types.ts';

export interface VoyageDef {
  id: string;
  /** Where the ship sets out and lands (realm map cells, at sea), and the cells it must pass on the way. */
  start: Pos;
  via: readonly Pos[];
  end: Pos;
  /** Shown while the ship sails, each from that share of the way (0..1). */
  captions: readonly { at: number; text: string }[];
  /** The harbor the canoe leaves from, named on the opening picture. */
  harbor: string;
  /** The opening picture's captions: paddling out, then aboard. */
  paddle: string;
  aboard: string;
  /** The shore it leaves (its roofs), and whether it is night. */
  shore: 'zetwal' | 'xaragua' | 'ardencia' | 'skarragol' | 'kuroshi' | 'jwaladesh' | 'aldermoor';
  night?: boolean;
  music: string;
  /**
   * The ship the party sails on (an object drawing; default the Zetwal trader, `zetwal_ship`), and how they reach it:
   * `boat` (default) rows out from the pier to the ship waiting offshore; `pier` means the ship itself casts off from
   * the pier with the party aboard (the Ironvow longship out of Ordvik, the trader at the head of the fleet).
   */
  ship?: string;
  boarding?: 'boat' | 'pier';
  /** Ships sailing with them (object drawings), drawn behind on the harbor and trailing on the map: a fleet. */
  fleet?: readonly string[];
}

/** The people in the rowing boat: the ones walking the map (Gianna, Anissa, Azzy, one companion; owner, Oct 29). */
export function boatCrew(walking: { anissa: boolean; azzy: boolean; companion: string | null }): string[] {
  const crew: string[] = [];
  if (walking.companion) crew.push(walking.companion);
  crew.push('gianna');
  if (walking.anissa) crew.push('anissa');
  if (walking.azzy) crew.push('azzy');
  return crew;
}

function isSea(map: RealmMapData, p: Pos): boolean {
  return p.x >= 0 && p.y >= 0 && p.x < map.width && p.y < map.height && map.key[map.rows[p.y]![p.x]!] === 'sea';
}

/** Cells this close to the realm map's edge cost more to sail: the painting's border is not open sea to look at. */
const EDGE_MARGIN = 4;

/**
 * The shortest walk over sea cells from `a` to `b` (8 directions), both ends included; null when cut off. Diagonal
 * steps cost the square root of two and cells by the map's edge a little more (review Nov 4: with every step costing
 * the same, many walks tied and the one chosen ran along the map's top row, the ship half off the picture).
 */
function seaLeg(map: RealmMapData, a: Pos, b: Pos): Pos[] | null {
  const key = (p: Pos) => p.y * map.width + p.x;
  const edgeCost = (p: Pos) => {
    const d = Math.min(p.x, p.y, map.width - 1 - p.x, map.height - 1 - p.y);
    return d >= EDGE_MARGIN ? 0 : (EDGE_MARGIN - d) * 0.75;
  };
  const dist = new Map<number, number>([[key(a), 0]]);
  const prev = new Map<number, Pos | null>([[key(a), null]]);
  const done = new Set<number>();
  // A binary heap of [cost, cell].
  const heap: [number, Pos][] = [[0, a]];
  const push = (item: [number, Pos]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const up = (i - 1) >> 1;
      if (heap[up]![0] <= heap[i]![0]) break;
      [heap[up], heap[i]] = [heap[i]!, heap[up]!];
      i = up;
    }
  };
  const pop = (): [number, Pos] => {
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && heap[l]![0] < heap[m]![0]) m = l;
        if (r < heap.length && heap[r]![0] < heap[m]![0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i]!, heap[m]!];
        i = m;
      }
    }
    return top;
  };
  while (heap.length > 0) {
    const [cost, cur] = pop();
    const k = key(cur);
    if (done.has(k)) continue;
    done.add(k);
    if (cur.x === b.x && cur.y === b.y) {
      const out: Pos[] = [];
      for (let at: Pos | null = cur; at; at = prev.get(key(at)) ?? null) out.push(at);
      return out.reverse();
    }
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const next = { x: cur.x + dx, y: cur.y + dy };
        if (!isSea(map, next)) continue;
        const nk = key(next);
        const c = cost + (dx && dy ? Math.SQRT2 : 1) + edgeCost(next);
        if (c < (dist.get(nk) ?? Infinity)) {
          dist.set(nk, c);
          prev.set(nk, cur);
          push([c, next]);
        }
      }
    }
  }
  return null;
}

/** The whole route through the waypoints, over sea only. Throws when a waypoint is on land or cut off. */
export function seaRoute(map: RealmMapData, voyage: Pick<VoyageDef, 'id' | 'start' | 'via' | 'end'>): Pos[] {
  const points = [voyage.start, ...voyage.via, voyage.end];
  for (const p of points) if (!isSea(map, p)) throw new Error(`Voyage ${voyage.id}: ${p.x},${p.y} is not at sea`);
  const route: Pos[] = [];
  for (let i = 1; i < points.length; i++) {
    const leg = seaLeg(map, points[i - 1]!, points[i]!);
    if (!leg) throw new Error(`Voyage ${voyage.id}: no sea way from ${points[i - 1]!.x},${points[i - 1]!.y}`);
    route.push(...(i === 1 ? leg : leg.slice(1)));
  }
  return route;
}

/** Every `step`th cell of the route, plus the last (a smoother line to draw and sail along). */
export function thinRoute(route: readonly Pos[], step = 4): Pos[] {
  const out = route.filter((_, i) => i % step === 0);
  const last = route[route.length - 1];
  if (last && out[out.length - 1] !== last) out.push(last);
  return out;
}

/** The point a share `t` (0..1) of the way along a polyline, by length. */
export function along(points: readonly Pos[], t: number): Pos {
  if (points.length === 0) return { x: 0, y: 0 };
  if (t >= 1) return points[points.length - 1]!;
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i]!.x, p.y - points[i]!.y));
  const total = lengths.reduce((a, b) => a + b, 0);
  let left = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i]! || i === lengths.length - 1) {
      const f = lengths[i]! > 0 ? Math.min(1, left / lengths[i]!) : 0;
      const a = points[i]!;
      const b = points[i + 1]!;
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
    }
    left -= lengths[i]!;
  }
  return points[points.length - 1]!;
}
