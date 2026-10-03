// Character art pieces for the play view: portrait, emblem, the hero card and rival chips.
import type { Game } from '../../engine/game';
import { roman } from '../../engine/game';
import type { HouseId, PlayerState } from '../../engine/types';
import { PILLARS } from '../../engine/types';
import { HOUSE_ART, ICONS, PILLAR_ART, PORTRAITS } from '../../assets.config';
import { claimGoal } from '../claimGoal';

export function Portrait({ house, gen, className = '' }: { house: HouseId; gen: number; className?: string }) {
  const url = PORTRAITS[house][gen - 1];
  const color = HOUSE_ART[house].color;
  return (
    <div className={`portrait ${className}`} style={{ ['--c' as string]: color }}>
      {url ? <img src={url} alt="" /> : <span className="silhouette" aria-hidden />}
      <span className="portrait-gen">{roman(gen)}</span>
    </div>
  );
}

export function Emblem({ house, size = 26, ring }: { house: HouseId; size?: number; ring?: boolean }) {
  const art = HOUSE_ART[house];
  return (
    <span className={`emblem ${ring ? 'ring' : ''}`} style={{ ['--c' as string]: art.color, width: size, height: size, fontSize: size * 0.48 }}>
      {art.crest ? <img src={art.crest} alt="" /> : art.initial}
    </span>
  );
}

export function Res({ p, short }: { p: PlayerState; short?: boolean }) {
  return (
    <span className="res2">
      {PILLARS.map(x => (
        <span key={x} style={{ color: PILLAR_ART[x].color }}>{PILLAR_ART[x].glyph}{short ? '' : ' '}{p.res[x]}</span>
      ))}
    </span>
  );
}

export function HeroCard({ g, p, dim, onOpen }: { g: Game; p: PlayerState; dim?: boolean; onOpen: () => void }) {
  const h = g.house(p);
  const t = g.thresholds(p);
  const abilities = g.abilitiesOf(p);
  return (
    <button type="button" className={`hero2 ${dim ? 'dim' : ''}`} onClick={onOpen}>
      <Portrait house={p.house} gen={p.gen} />
      <span className="hero2-body">
        <span className="hero2-name">{p.name} {g.eligible(p) && <span className="elig" title="Can claim the Throne">{ICONS.eligible}</span>}</span>
        <span className="hero2-house">{h.name.replace('House ', '')} · {h.homeland} · Gen {roman(p.gen)}</span>
        <span className="hero2-stats">
          {p.specter ? <span className="hearts specter">{ICONS.specter} Specter</span> : <span className="hearts">{ICONS.heart} {p.hp}/{p.maxHp}</span>}
          <Res p={p} />
        </span>
        <span className="hero2-goal">Claim at {claimGoal(t)}</span>
        {abilities.length > 0 && (
          <span className="hero2-chips">{abilities.map(a => <span key={a.id} className="ab-chip">{a.name}</span>)}</span>
        )}
      </span>
    </button>
  );
}

export function RivalChip({ g, p, active, onOpen }: { g: Game; p: PlayerState; active: boolean; onOpen: () => void }) {
  return (
    <button type="button" className={`rival2 ${active ? 'active' : ''} ${p.specter ? 'specter' : ''}`} onClick={onOpen}>
      <Emblem house={p.house} size={26} />
      <span className="rival2-body">
        <span className="rival2-name">{p.name} {g.eligible(p) && <span className="elig">{ICONS.eligible}</span>}</span>
        <span className="rival2-stats">
          {p.specter ? <span className="hearts specter">{ICONS.specter}</span> : <span className="hearts">{ICONS.heart}{p.hp}</span>}
          <Res p={p} short />
        </span>
      </span>
    </button>
  );
}
