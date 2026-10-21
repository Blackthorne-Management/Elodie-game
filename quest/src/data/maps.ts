// Map registry. Each map is a Tiled .tmj file in quest/maps, bundled as text and parsed at boot.

import type { TiledMap } from '../engine/tiledMap.ts';
import testVillage from '../../maps/test-village.tmj?raw';
import ardenciaFlats from '../../maps/ardencia-flats.tmj?raw';
import ardenciaTown from '../../maps/ardencia-town.tmj?raw';
import ardenciaAlcazar from '../../maps/ardencia-alcazar.tmj?raw';
import ardenciaLower from '../../maps/ardencia-lower.tmj?raw';
import ardenciaLibrary from '../../maps/ardencia-library.tmj?raw';
import ardenciaForge from '../../maps/ardencia-forge.tmj?raw';
import ardenciaTunnel from '../../maps/ardencia-tunnel.tmj?raw';
import ardenciaCamp from '../../maps/ardencia-camp.tmj?raw';
import xaraguaVillage from '../../maps/xaragua-village.tmj?raw';
import xaraguaPlaza from '../../maps/xaragua-plaza.tmj?raw';
import xaraguaBeach from '../../maps/xaragua-beach.tmj?raw';
import xaraguaConuco from '../../maps/xaragua-conuco.tmj?raw';
import xaraguaMountain from '../../maps/xaragua-mountain.tmj?raw';
import xaraguaCamp from '../../maps/xaragua-camp.tmj?raw';
import xaraguaCaney from '../../maps/xaragua-caney.tmj?raw';
import xaraguaSong from '../../maps/xaragua-song.tmj?raw';
import xaraguaCustoms from '../../maps/xaragua-customs.tmj?raw';
import xaraguaCave from '../../maps/xaragua-cave.tmj?raw';
import xaraguaRecord from '../../maps/xaragua-record.tmj?raw';
import xaraguaCellar from '../../maps/xaragua-cellar.tmj?raw';
import xaraguaSeaCave from '../../maps/xaragua-seacave.tmj?raw';
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
  'xaragua-village': xaraguaVillage,
  'xaragua-plaza': xaraguaPlaza,
  'xaragua-beach': xaraguaBeach,
  'xaragua-conuco': xaraguaConuco,
  'xaragua-mountain': xaraguaMountain,
  'xaragua-camp': xaraguaCamp,
  'xaragua-caney': xaraguaCaney,
  'xaragua-song': xaraguaSong,
  'xaragua-customs': xaraguaCustoms,
  'xaragua-cave': xaraguaCave,
  'xaragua-record': xaraguaRecord,
  'xaragua-cellar': xaraguaCellar,
  'xaragua-seacave': xaraguaSeaCave,
  'ardencia-flats': ardenciaFlats,
  'ardencia-town': ardenciaTown,
  'ardencia-alcazar': ardenciaAlcazar,
  'ardencia-lower': ardenciaLower,
  'ardencia-library': ardenciaLibrary,
  'ardencia-forge': ardenciaForge,
  'ardencia-tunnel': ardenciaTunnel,
  'ardencia-camp': ardenciaCamp,
};

export function loadRawMaps(): Record<string, TiledMap> {
  return Object.fromEntries(Object.entries(MAP_SOURCES).map(([id, text]) => [id, JSON.parse(text) as TiledMap]));
}
