import type { StatusId } from '../engine/types';

const LABELS: Record<StatusId, string> = {
  burn: 'Burn', chill: 'Chill', freeze: 'Frozen', root: 'Rooted', shield: 'Shield',
  taunt: 'Taunt', dodge: 'Dodge', regen: 'Regen', atkUp: 'Atk+', atkDown: 'Atk−',
  defUp: 'Def+', defDown: 'Def−', spdUp: 'Spd+', blind: 'Blind',
};
const GOOD: StatusId[] = ['shield', 'taunt', 'dodge', 'regen', 'atkUp', 'defUp', 'spdUp'];

export function StatusBadge({ id }: { id: StatusId }) {
  return <span className={`badge ${GOOD.includes(id) ? 'good' : 'bad'}`}>{LABELS[id]}</span>;
}
