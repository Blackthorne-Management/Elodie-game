import { FLOORS_PER_ACT, FLOORS_PER_ENEMY_LEVEL, FLOORS_PER_REGION, MINI_BOSS_EVERY } from '../config';

export const REGIONS = ['gale', 'rain', 'sun', 'frost', 'bloom', 'eye'] as const;
export type Region = typeof REGIONS[number];
export type FloorKind = 'normal' | 'miniBoss' | 'regionBoss';

// Any floor number becomes its Act, region, kind and enemy level, so no floor is stored by hand.
export function floorInfo(floor: number) {
  const act = Math.floor((floor - 1) / FLOORS_PER_ACT) + 1;    // 9 and up = Endless Storm
  const inAct = (floor - 1) % FLOORS_PER_ACT;                   // 0-149
  const region: Region = REGIONS[Math.floor(inAct / FLOORS_PER_REGION)];
  const inRegion = (inAct % FLOORS_PER_REGION) + 1;             // 1-25
  const kind: FloorKind = inRegion === FLOORS_PER_REGION ? 'regionBoss'
    : inRegion % MINI_BOSS_EVERY === 0 ? 'miniBoss' : 'normal';
  const enemyLevel = 1 + Math.floor(floor / FLOORS_PER_ENEMY_LEVEL);
  return { act, region, inRegion, kind, enemyLevel, endless: act > 8 };
}

// First floor of the region a floor belongs to.
export const regionStart = (floor: number) => floor - floorInfo(floor).inRegion + 1;
