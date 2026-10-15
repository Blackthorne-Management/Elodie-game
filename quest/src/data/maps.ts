// Map registry. Each map is a Tiled .tmj file in quest/maps, bundled as text and parsed at boot.

import type { TiledMap } from '../engine/tiledMap.ts';
import testVillage from '../../maps/test-village.tmj?raw';
import zetwalArchive from '../../maps/zetwal-archive.tmj?raw';
import zetwalHall from '../../maps/zetwal-hall.tmj?raw';
import zetwalHarbor from '../../maps/zetwal-harbor.tmj?raw';
import zetwalHeights from '../../maps/zetwal-heights.tmj?raw';
import zetwalHouse from '../../maps/zetwal-house.tmj?raw';
import zetwalMarket from '../../maps/zetwal-market.tmj?raw';
import zetwalRoad from '../../maps/zetwal-road.tmj?raw';
import zetwalSquare from '../../maps/zetwal-square.tmj?raw';
import zetwalTemple from '../../maps/zetwal-temple.tmj?raw';
import zetwalTown from '../../maps/zetwal-town.tmj?raw';

export const MAP_SOURCES: Readonly<Record<string, string>> = {
  'test-village': testVillage,
  'zetwal-town': zetwalTown,
  'zetwal-house': zetwalHouse,
  'zetwal-temple': zetwalTemple,
  'zetwal-archive': zetwalArchive,
  'zetwal-hall': zetwalHall,
  'zetwal-road': zetwalRoad,
  'zetwal-market': zetwalMarket,
  'zetwal-harbor': zetwalHarbor,
  'zetwal-heights': zetwalHeights,
  'zetwal-square': zetwalSquare,
};

export function loadRawMaps(): Record<string, TiledMap> {
  return Object.fromEntries(Object.entries(MAP_SOURCES).map(([id, text]) => [id, JSON.parse(text) as TiledMap]));
}
