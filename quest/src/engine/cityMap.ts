// The city map (the menu's Map page): a capital drawn from its real maps. Outdoor sections are
// placed on one shared grid (each at its `at` tile), so the city keeps the true shape of its streets,
// shores and fields; indoor sections (a house, the archive) become buildings where their door
// stands outside; a path or bridge joins two outdoor sections whose doors lead to each other. Pure
// TypeScript, unit tested; ui/GameMenu.ts draws it.

import type { CityDef } from './rpg.ts';
import type { Door } from './tiledMap.ts';
import type { Pos } from './types.ts';

/** What the layout needs from a map. */
export interface CityMapSource {
  width: number;
  height: number;
  doors: readonly Door[];
}

export interface PlacedSection {
  map: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CityBuilding {
  map: string;
  name: string;
  /** The building's door, on the city grid. */
  pos: Pos;
}

export interface CityConnector {
  from: Pos;
  to: Pos;
}

export interface CityLayout {
  /** The city grid's size in tiles (everything is shifted so the top-left is 0,0). */
  width: number;
  height: number;
  sections: PlacedSection[];
  buildings: CityBuilding[];
  connectors: CityConnector[];
}

/** Lay out a city from its maps. Throws if a section's map is missing or a building has no door outside. */
export function cityLayout(city: CityDef, maps: Readonly<Record<string, CityMapSource>>): CityLayout {
  const get = (id: string): CityMapSource => {
    const m = maps[id];
    if (!m) throw new Error(`City ${city.id}: no map ${id}`);
    return m;
  };
  const outdoor = city.sections.filter((s) => s.at);
  const minX = Math.min(...outdoor.map((s) => s.at!.x));
  const minY = Math.min(...outdoor.map((s) => s.at!.y));
  const sections: PlacedSection[] = outdoor.map((s) => {
    const m = get(s.map);
    return { map: s.map, name: s.name, x: s.at!.x - minX, y: s.at!.y - minY, w: m.width, h: m.height };
  });
  const byMap = new Map(sections.map((s) => [s.map, s]));
  const onGrid = (s: PlacedSection, p: Pos): Pos => ({ x: s.x + p.x, y: s.y + p.y });

  const buildings: CityBuilding[] = [];
  for (const s of city.sections) {
    if (s.at) continue;
    const door = doorInto(s.map, sections, maps);
    if (!door) throw new Error(`City ${city.id}: no outdoor door leads into ${s.map}`);
    buildings.push({ map: s.map, name: s.name, pos: onGrid(door.section, door.door.pos) });
  }

  // A connector for each pair of outdoor doors that lead to each other (each pair once).
  const connectors: CityConnector[] = [];
  for (const s of sections) {
    for (const d of get(s.map).doors) {
      const other = byMap.get(d.targetMap);
      if (!other || other.map <= s.map) continue;
      const back = get(other.map).doors.find((t) => t.id === d.target);
      if (back) connectors.push({ from: onGrid(s, d.pos), to: onGrid(other, back.pos) });
    }
  }

  return {
    width: Math.max(...sections.map((s) => s.x + s.w)),
    height: Math.max(...sections.map((s) => s.y + s.h)),
    sections,
    buildings,
    connectors,
  };
}

/** The outdoor door that leads into an indoor map (following doors through other indoor maps). */
function doorInto(
  map: string,
  sections: readonly PlacedSection[],
  maps: Readonly<Record<string, CityMapSource>>,
): { section: PlacedSection; door: Door } | null {
  for (const s of sections) {
    const door = maps[s.map]?.doors.find((d) => d.targetMap === map);
    if (door) return { section: s, door };
  }
  return null;
}

/** Where the player is on the city grid: their tile outdoors, or the building's door indoors. */
export function cityPosition(layout: CityLayout, mapId: string, pos: Pos): Pos | null {
  const s = layout.sections.find((p) => p.map === mapId);
  if (s) return { x: s.x + pos.x, y: s.y + pos.y };
  return layout.buildings.find((b) => b.map === mapId)?.pos ?? null;
}

/** True when two placed sections overlap. */
export function overlaps(a: PlacedSection, b: PlacedSection): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}
