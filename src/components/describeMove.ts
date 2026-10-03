import type { Move, Target } from '../engine/types';

const WHO: Record<Target, string> = {
  enemy: 'one foe', allEnemies: 'all foes', self: 'self', ally: 'an ally',
  lowestAlly: 'weakest ally', allAllies: 'the team',
};

// One short line for the move picker, built from the move's effects.
export function describeMove(m: Move): string {
  return m.effects.map(e => {
    switch (e.kind) {
      case 'damage': return `Hit ${WHO[e.target]}${e.hits ? ` ×${e.hits}` : ''}`;
      case 'heal': return `Heal ${WHO[e.target]}`;
      case 'status': return `${e.chance < 1 ? 'May ' : ''}${e.status} ${WHO[e.target]}`;
      case 'shield': return `Shield ${WHO[e.target]}`;
      case 'cleanse': return `Cleanse ${WHO[e.target]}`;
      case 'revive': return 'Revive an ally';
    }
  }).join(' · ');
}

export const targetsOneFoe = (m: Move) => m.effects.some(e => 'target' in e && e.target === 'enemy');
