import { memo } from 'react';
import type { HouseDef } from '../engine/content';
import { BOARD_SIZE } from '../config';
import { UNIT, terrainUrl } from './terrainSvg';
import { BOARD_ART } from '../assets.config';

// The overhead map's ground: the same picture the 2.5D view uses (the painted board, else drawn terrain).
function TerrainView({ houses }: { houses: HouseDef[] }) {
  const size = BOARD_SIZE * UNIT;
  const m = BOARD_ART.image ? BOARD_ART.imageMargin * UNIT : 0;
  return <image href={BOARD_ART.image ?? terrainUrl(houses)} x={-m} y={-m} width={size + 2 * m} height={size + 2 * m} preserveAspectRatio="none" />;
}

export const Terrain = memo(TerrainView);
