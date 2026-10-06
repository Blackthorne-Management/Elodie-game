// How bots judge cards: what a card is worth to hold, and how good it is to play right now.
import type { Game } from '../engine/game';
import type { Pillar, PlayerState } from '../engine/types';
import { PILLARS } from '../engine/types';
import { manhattan, onThrone, throneDistance } from '../engine/board';
import type { Personality } from './bot';

// Value of holding a card (used for discards, barters, Scout Ahead). Higher = keep.
const HOLD: Record<number, number> = {
  1: 3, 2: 2, 3: 2.5, 4: 2.5, 5: 2, 6: 2, 7: 1.5, 8: 2.5, 9: 2, 10: 1.5, 11: 2, 12: 2, 13: 2, 14: 1.5,
  15: 3, 16: 1.5, 17: 1, 18: 3, 19: 2.5, 20: 2.5, 21: 1.5, 22: 1.5, 23: 2, 24: 2.5, 25: 1.5, 26: 1, 27: 3,
  28: 3.5, 29: 3, 30: 3, 31: 2, 32: 3.5, 33: 2.5, 34: 2, 35: 2, 36: 2, 37: 1.5, 38: 1.5, 39: 1, 40: 2,
  41: 2, 42: 1.5, 43: 1, 44: 1.5, 45: 1, 46: 3, 47: 1.5, 48: 1, 49: 1, 50: 1.5, 51: 1.5, 52: 0.8, 53: 1,
  54: 1.5, 55: 2, 56: 2, 57: 2, 58: 4.5, 59: 5, 60: 4, 61: 4, 62: 4.5, 63: 3.5, 64: 3, 65: 4.5,
  121: 3, 122: 2, 123: 2.5, 124: 3.5, 125: 3, 126: 3.5,
};

export const cardValue = (_g: Game | null, id: number) => HOLD[id] ?? 1;

// Instants that help whoever resolves them (a spiteful Specter gives these to the weakest).
export const BENEFICIAL_INSTANTS = new Set([
  'Omen of Fire', "Gambler's Luck", 'Lucky Find', 'Coin Toss', "Fortune's Wheel", 'The Harvest',
  "Elodie's Blessing", "Elodie's Wrath", "Merchant's Windfall", "Smuggler's Luck", 'Highway Robbery',
  'Counting House', 'Toll Bridge', 'Treasure Map',
]);

function weight(g: Game, p: PlayerState, x: Pillar, pers: Personality) {
  const t = g.thresholds(p);
  return 1 + (pers.focus === x ? 0.3 : 0) + (p.res[x] >= t.single - 2 ? 0.5 : 0) + (p.res[x] < t.minEach ? 0.8 : 0);
}

const rivals = (g: Game, p: PlayerState) => g.others(p);
const topRival = (g: Game, p: PlayerState) =>
  rivals(g, p).reduce<PlayerState | null>((a, b) => (!a || g.total(b) > g.total(a) ? b : a), null);

// How good is playing card `id` right now? <= 0.3 means hold it.
export function playScore(g: Game, p: PlayerState, id: number, pers: Personality): number {
  const w = (x: Pillar) => weight(g, p, x, pers);
  const adj = g.adjacentTo(p);
  const lead = topRival(g, p);
  const t = g.s.turn;
  const stronger = adj.some(o => o.hp + g.hook(o, 'basicAttackBonus') >= p.hp);
  const pillarLoss = (x: Pillar) => (lead && lead.res[x] > 0 ? 0.9 : 0.1);

  switch (id) {
    case 1: return 2 * w('influence');
    case 2: return (adj.length ? 2 : 1) * w('influence');
    case 3: return 1.8 * w('influence');
    case 4: return w('influence') + pillarLoss('influence');
    case 5: return w('influence') + 0.2;
    case 6: return (p.res.fear === 0 ? 2 : 1) * w('influence');
    case 7: return g.onTileType(p, 'court') ? 2 * w('influence') : 0;
    case 8: return 2 * w('fear') - 0.4;
    case 9: return w('fear') + 0.6;
    case 10: return Math.min(2, adj.length) * w('fear');
    case 11: return p.hp >= 3 ? 2 * w('fear') - 0.8 : -1;
    case 12: return w('fear') + 0.4 * pers.aggression;
    case 13: return w('fear') + 0.2;
    case 14: return g.onTileType(p, 'war') ? 2 * w('fear') : 0;
    case 15: return 2 * w('wealth');
    case 16: return adj.some(o => o.res.wealth > 0) ? w('wealth') + 0.6 : 0;
    case 17: return p.pos ? Math.min(2, g.playersOn(p.pos).length - 1) * w('wealth') : 0;
    case 18: return 2 * w('wealth');
    case 19: return w('wealth') + 0.8;
    case 20: return w('wealth') + pillarLoss('wealth');
    case 21: return g.onTileType(p, 'trade') ? 2 * w('wealth') : 0;
    case 22: return w('wealth');
    case 23: return w('wealth') + 0.2;
    case 24: return (t?.attacks ?? 0) === 0 && !g.basicTargets(p).length ? 2 * w('wealth') - 0.8 * pers.aggression : 0.2;
    case 25: return w('wealth');
    case 26: return (t?.damageDealt ? Math.min(2, t.damageDealt) : 0.6 + pers.aggression) * w('wealth');
    case 27: return (p.gen >= 3 ? 3 : 2) * w('wealth');
    case 28: case 32: {
      const kill = rivals(g, p).some(o => o.hp <= 1);
      return kill ? 4 : 1.2 * pers.aggression;
    }
    case 29: case 30: return rivals(g, p).some(o => o.hp <= 1) ? 3 : 1 * pers.aggression + 0.3;
    case 31: return 0.6 + 0.4 * pers.aggression;
    case 33: return rivals(g, p).some(o => o.hand.length) ? 1.2 : 0;
    case 34: return pillarLoss('influence');
    case 35: return pillarLoss('fear');
    case 36: return pillarLoss('wealth');
    case 37: case 38: return lead && g.eligible(lead) ? 1.5 : 0.5;
    case 39: return 0.2;
    case 40: return lead ? 0.9 : 0;
    case 41: return t && !t.moved ? 0.8 : 0.4;
    case 42: return 0.2;
    case 43: return 0.4;
    case 44: return stronger ? 1.5 : 0.2;
    case 45: return 0.3 + 0.5 * pers.aggression;
    case 46: return g.eligible(p) && p.pos && throneDistance(p.pos) <= 8 && !onThrone(p.pos) ? 6 : 0.4;
    case 47: return p.pos && manhattan(p.pos, g.house(p).home) > 10 && stronger ? 1 : 0;
    case 48: case 52: case 53: return 0.2;
    case 49: return 0.3;
    case 50: return adj.some(o => o.hand.length) ? 1 : 0;
    case 51: return w('wealth') - 0.2;
    case 54: case 56: return stronger ? 1.8 : 0.1;
    case 55: return 1.5;
    case 57: return w('fear') - 0.2;
    default: return 0;
  }
}

export const anyResource = (p: PlayerState) => PILLARS.some(x => p.res[x] > 0);
