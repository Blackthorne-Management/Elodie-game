import type { Combatant } from '../engine/damage';
import type { StatusId } from '../engine/types';
import { HpBar } from './HpBar';
import { StatusBadge } from './StatusBadge';
import { TypeIcon } from './TypeIcon';

export interface Floater { id: number; text: string; kind: 'damage' | 'crit' | 'heal' | 'miss' }
export interface CardFx { kind: 'hit' | 'heal' | 'act'; n: number }

interface Props {
  unit: Combatant;
  hp: number;
  statuses: StatusId[];
  floaters: Floater[];
  fx?: CardFx;
  selected?: boolean;
  note?: string;
  onClick?: () => void;
}

export function PetCard({ unit, hp, statuses, floaters, fx, selected, note, onClick }: Props) {
  const fainted = hp <= 0;
  const cls = ['card', fainted && 'fainted', selected && 'selected', onClick && !fainted && 'tappable']
    .filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} onClick={onClick} disabled={!onClick || fainted}>
      <div key={fx?.n} className={`card-body ${fx ? `fx-${fx.kind}` : ''}`}>
        <div className="portrait" style={{ background: `var(--${unit.type})` }}>
          <TypeIcon type={unit.type} size={unit.actsTwice ? 30 : 22} />
        </div>
        <div className="card-name">{unit.name}</div>
        <HpBar hp={hp} maxHp={unit.maxHp} />
        <div className="badges">{statuses.map(s => <StatusBadge key={s} id={s} />)}</div>
        {note && <div className="card-note">{note}</div>}
      </div>
      {floaters.map(f => <span key={f.id} className={`floater ${f.kind}`}>{f.text}</span>)}
    </button>
  );
}
