// Map registry. Each map is a Tiled .tmj file in quest/maps, bundled as text and parsed at boot.

import type { TiledMap } from '../engine/tiledMap.ts';
import testVillage from '../../maps/test-village.tmj?raw';

export const MAP_SOURCES: Readonly<Record<string, string>> = {
  'test-village': testVillage,
};

export function loadRawMaps(): Record<string, TiledMap> {
  return Object.fromEntries(Object.entries(MAP_SOURCES).map(([id, text]) => [id, JSON.parse(text) as TiledMap]));
}
