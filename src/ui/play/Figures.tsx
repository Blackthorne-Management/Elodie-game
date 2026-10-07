// Character art pieces for the play view: portrait, emblem, the hero card and rival chips.
import type { Game } from '../../engine/game';
import { roman } from '../../engine/game';
import type { HouseId, PlayerState } from '../../engine/types';
import { PILLARS } from '../../engine/types';
import { HOUSE_ART, ICONS, PILLAR_ART, PORTRAITS, PORTRAIT_CROP } from '../../assets.config';
import { claimGoal } from '../claimGoal';

// The character's full-body picture. In small spots (the hero card) it shows from the head down.
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

// A round head-and-shoulders medallion cut from the character's picture (the house crest until it's painted).
export function Medallion({ house, gen, size = 44 }: { house: HouseId; gen: number; size?: number }) {
  const url = PORTRAITS[house][gen - 1];
  const art = HOUSE_ART[house];
  return (
    <span className="medal" style={{ ['--c' as string]: art.color, width: size, height: size, fontSize: size * 0.42 }}>
      {url
        ? <span className="disc-face" style={{ backgroundImage: `url("${url}")`, backgroundSize: `${PORTRAIT_CROP.pawnZoom * 100}% auto`, backgroundPosition: `50% ${PORTRAIT_CROP.pawnY}` }} />
        : art.crest ? <img src={art.crest} alt="" /> : <span className="medal-initial">{art.initial}</span>}
    </span>
  );
}

// Heart Tokens as a row of hearts: filled for each one held, dark for each one lost.
export function HeartRow({ p }: { p: PlayerState }) {
  if (p.specter) return <span className="hearts3 specter">{ICONS.specter} Specter</span>;
  return (
    <span className="hearts3" aria-label={`${p.hp} of ${p.maxHp} Heart Tokens`}>
      {Array.from({ length: p.maxHp }, (_, i) => <span key={i} className={i < p.hp ? 'on' : 'off'}>♥</span>)}
    </span>
  );
}

// Your banner: portrait, name, hearts, and the three resources.
export function HeroCard({ g, p, dim, onOpen }: { g: Game; p: PlayerState; dim?: boolean; onOpen: () => void }) {
  const h = g.house(p);
  const t = g.thresholds(p);
  return (
    <button type="button" className={`banner3 frame ${dim ? 'dim' : ''}`} onClick={onOpen} aria-label={`${p.name}: open your house`}>
      <Medallion house={p.house} gen={p.gen} size={58} />
      <span className="b3-mid">
        <span className="b3-name">{p.name}{g.eligible(p) && <span className="elig" title="Can claim the Throne"> {ICONS.eligible}</span>}{g.findEffect('newborn', p.id) && <span className="newborn" title="New heir: can't be attacked until the end of your first turn"> {ICONS.newborn}</span>}</span>
        <span className="b3-house">{h.name.replace('House ', '')} · Gen {roman(p.gen)}</span>
        <HeartRow p={p} />
        <span className="b3-goal" title={`Claim at ${claimGoal(t)}`}>Claim: {t.combined} total, {t.minEach}+ each</span>
      </span>
      <span className="b3-res">
        {PILLARS.map(x => (
          <span key={x} className="b3-pillar">
            <img src={PILLAR_ART[x].icon} alt="" />
            <b>{p.res[x]}</b>
            <small>{PILLAR_ART[x].label}</small>
          </span>
        ))}
      </span>
    </button>
  );
}

// One seat in the turn tracker: `n` is its place in the turn order; `done` = already played this round.
export function RivalChip({ g, p, n, active, done, me, onOpen }: { g: Game; p: PlayerState; n: number; active: boolean; done: boolean; me?: boolean; onOpen: () => void }) {
  return (
    <button type="button" className={`seat3 ${active ? 'active' : ''} ${done ? 'done' : ''} ${me ? 'me' : ''} ${p.specter ? 'specter' : ''}`} onClick={onOpen}
      aria-label={`${n}. ${me ? 'You' : p.name}${active ? ', playing now' : done ? ', played this round' : ''}`}>
      <Medallion house={p.house} gen={p.gen} size={40} />
      <span className="seat3-n">{done ? '✓' : n}</span>
      {g.eligible(p) && <span className="seat3-elig" title="Can claim the Throne">{ICONS.eligible}</span>}
      {g.findEffect('newborn', p.id) && <span className="seat3-newborn" title="New heir: can't be attacked yet">{ICONS.newborn}</span>}
      <span className="seat3-name">{me ? 'You' : p.name}</span>
      <span className="seat3-stats">
        {p.specter ? <i className="sp">{ICONS.specter}</i> : <><i className="h">♥</i>{p.hp}</>}
        <i className="r">✦</i>{g.total(p)}
      </span>
    </button>
  );
}
