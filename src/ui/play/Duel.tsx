import type { Game } from '../../engine/game';
import type { Decision } from '../../engine/types';
import { Portrait } from './Figures';
import { HOUSE_ART, ICONS } from '../../assets.config';
import { HUMAN } from '../../state/gameStore';

export interface DuelShow {
  seq: number;
  attacker: number;
  target: number;
  damage: number;
  kind: 'attack' | 'challenge';
  outcome: string | null;      // "Blocked!", "−3", "Falls!"
}

// The duel screen: attacker's card against the defender's. If you're the defender and can block,
// your choice is made here.
export function Duel({ g, duel, block, onAnswer, onClose }: {
  g: Game; duel: DuelShow; block: Decision | null; onAnswer: (i: number) => void; onClose: () => void;
}) {
  const a = g.p(duel.attacker), t = g.p(duel.target);
  const fighter = (id: number, hit: boolean) => {
    const p = g.p(id);
    return (
      <div className={`fcard2 ${hit ? 'hit' : ''}`} style={{ ['--c' as string]: HOUSE_ART[p.house].color }}>
        <Portrait house={p.house} gen={p.gen} className="big" />
        <div className="f-name">{id === HUMAN ? `${p.name} (you)` : p.name}</div>
        <div className="f-meta">{g.house(p).name.replace('House ', '')} · Gen {['I', 'II', 'III', 'IV'][p.gen - 1]}</div>
        <div className="f-hp">{p.specter ? ICONS.specter : `${ICONS.heart} ${p.hp}`}</div>
      </div>
    );
  };
  return (
    <div className="duel2" onClick={block ? undefined : onClose}>
      <h2>{duel.kind === 'challenge' ? 'Challenge for the Throne' : 'Attack!'}</h2>
      <div className="fighters2">
        {fighter(a.id, false)}
        <div className="vs2">VS</div>
        {fighter(t.id, !!duel.outcome && duel.outcome.startsWith('−'))}
      </div>
      {duel.outcome && <div className={`outcome ${duel.outcome.startsWith('−') ? 'dmg' : ''}`}>{duel.outcome}</div>}
      {block ? (
        <div className="respond2" onClick={e => e.stopPropagation()}>
          <div className="r-title">{block.prompt}</div>
          <div className="r-actions">
            {block.options.map((o, i) => (
              <button key={i} type="button" className={o.value === null ? 'take' : 'blockbtn'} onClick={() => onAnswer(i)}>{o.label}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="muted small">{a.name} strikes for {duel.damage}. Tap to continue.</div>
      )}
    </div>
  );
}
