// Map registry. Each map is a Tiled .tmj file in quest/maps, bundled as text and parsed at boot.

import type { TiledMap } from '../engine/tiledMap.ts';
import testVillage from '../../maps/test-village.tmj?raw';
import aldoriaQuay from '../../maps/aldoria-quay.tmj?raw';
import aldoriaBazaar from '../../maps/aldoria-bazaar.tmj?raw';
import aldoriaMajlis from '../../maps/aldoria-majlis.tmj?raw';
import aldoriaLedgers from '../../maps/aldoria-ledgers.tmj?raw';
import aldoriaVault from '../../maps/aldoria-vault.tmj?raw';
import aldoriaDesert from '../../maps/aldoria-desert.tmj?raw';
import seatGateyard from '../../maps/seat-gateyard.tmj?raw';
import seatConcourse from '../../maps/seat-concourse.tmj?raw';
import seatHall from '../../maps/seat-hall.tmj?raw';
import seatQuarter from '../../maps/seat-quarter.tmj?raw';
import seatWorkshop from '../../maps/seat-workshop.tmj?raw';
import seatArchive from '../../maps/seat-archive.tmj?raw';
import seatFields from '../../maps/seat-fields.tmj?raw';
import skarragolPlateau from '../../maps/skarragol-plateau.tmj?raw';
import skarragolFair from '../../maps/skarragol-fair.tmj?raw';
import skarragolMoot from '../../maps/skarragol-moot.tmj?raw';
import skarragolSaga from '../../maps/skarragol-saga.tmj?raw';
import skarragolQuay from '../../maps/skarragol-quay.tmj?raw';
import skarragolFjord from '../../maps/skarragol-fjord.tmj?raw';
import kuroshiPier from '../../maps/kuroshi-pier.tmj?raw';
import kuroshiQuarter from '../../maps/kuroshi-quarter.tmj?raw';
import kuroshiLibrary from '../../maps/kuroshi-library.tmj?raw';
import kuroshiHall from '../../maps/kuroshi-hall.tmj?raw';
import kuroshiFilehouse from '../../maps/kuroshi-filehouse.tmj?raw';
import kuroshiFogmaze from '../../maps/kuroshi-fogmaze.tmj?raw';
import kuroshiMarsh from '../../maps/kuroshi-marsh.tmj?raw';
import jwaladeshHarbor from '../../maps/jwaladesh-harbor.tmj?raw';
import jwaladeshBazaar from '../../maps/jwaladesh-bazaar.tmj?raw';
import jwaladeshRooftops from '../../maps/jwaladesh-rooftops.tmj?raw';
import jwaladeshLibrary from '../../maps/jwaladesh-library.tmj?raw';
import jwaladeshCourt from '../../maps/jwaladesh-court.tmj?raw';
import jwaladeshSaltflats from '../../maps/jwaladesh-saltflats.tmj?raw';
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
  'aldoria-quay': aldoriaQuay,
  'aldoria-bazaar': aldoriaBazaar,
  'aldoria-majlis': aldoriaMajlis,
  'aldoria-ledgers': aldoriaLedgers,
  'aldoria-vault': aldoriaVault,
  'aldoria-desert': aldoriaDesert,
  'seat-gateyard': seatGateyard,
  'seat-concourse': seatConcourse,
  'seat-hall': seatHall,
  'seat-quarter': seatQuarter,
  'seat-workshop': seatWorkshop,
  'seat-archive': seatArchive,
  'seat-fields': seatFields,
  'skarragol-plateau': skarragolPlateau,
  'skarragol-fair': skarragolFair,
  'skarragol-moot': skarragolMoot,
  'skarragol-saga': skarragolSaga,
  'skarragol-quay': skarragolQuay,
  'skarragol-fjord': skarragolFjord,
  'kuroshi-pier': kuroshiPier,
  'kuroshi-quarter': kuroshiQuarter,
  'kuroshi-library': kuroshiLibrary,
  'kuroshi-hall': kuroshiHall,
  'kuroshi-filehouse': kuroshiFilehouse,
  'kuroshi-fogmaze': kuroshiFogmaze,
  'kuroshi-marsh': kuroshiMarsh,
  'jwaladesh-harbor': jwaladeshHarbor,
  'jwaladesh-bazaar': jwaladeshBazaar,
  'jwaladesh-rooftops': jwaladeshRooftops,
  'jwaladesh-library': jwaladeshLibrary,
  'jwaladesh-court': jwaladeshCourt,
  'jwaladesh-saltflats': jwaladeshSaltflats,
};

export function loadRawMaps(): Record<string, TiledMap> {
  return Object.fromEntries(Object.entries(MAP_SOURCES).map(([id, text]) => [id, JSON.parse(text) as TiledMap]));
}
