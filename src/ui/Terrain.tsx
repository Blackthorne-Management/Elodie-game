import { memo } from 'react';
import type { HouseDef } from '../engine/content';
import { BOARD_SIZE } from '../config';
import { UNIT, terrainUrl } from './terrainSvg';

// The overhead map's ground: the same terrain picture the 2.5D view uses.
function TerrainView({ houses }: { houses: HouseDef[] }) {
  const size = BOARD_SIZE * UNIT;
  return <image href={terrainUrl(houses)} x={0} y={0} width={size} height={size} preserveAspectRatio="none" />;
}

export const Terrain = memo(TerrainView);
