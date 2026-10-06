import type { ReactNode } from 'react';
import type { CardDef } from '../engine/content';
import type { Game } from '../engine/game';
import { roman } from '../engine/game';
import type { PlayerState } from '../engine/types';
import { PILLARS } from '../engine/types';
import { CARD_ART, HOUSE_ART, ICONS, PILLAR_ART, PORTRAITS } from '../assets.config';
import { CardFrame } from './CardFrame';

export function Crest({ house, size = 32 }: { house: PlayerState['house']; size?: number }) {
  const art = HOUSE_ART[house];
  return (
    <span className="crest" style={{ background: art.color, width: size, height: size, fontSize: size * 0.5 }}>
      {art.crest ? <img src={art.crest} alt="" /> : art.initial}
    </span>
  );
}

export function Resources({ p, compact }: { p: PlayerState; compact?: boolean }) {
  return (
    <span className={`res ${compact ? 'compact' : ''}`}>
      {PILLARS.map(x => (
        <span key={x} style={{ color: PILLAR_ART[x].color }} title={PILLAR_ART[x].label}>
          {PILLAR_ART[x].glyph}{p.res[x]}
        </span>
      ))}
    </span>
  );
}

export function Hearts({ p }: { p: PlayerState }) {
  if (p.specter) return <span className="hearts specter">{ICONS.specter} Specter</span>;
  return <span className="hearts">{ICONS.heart}{p.hp}/{p.maxHp}</span>;
}

export function CardSheetFace({ card }: { card: CardDef }) {
  return <div className="cardsheet"><CardFrame card={card} /></div>;
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={title} onClick={e => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

// The character card (tarot): full-body art under the character overlay, the generation and crest in its
// medallions, and this generation's passive and abilities in the panel.
export function CharacterCard({ game, p }: { game: Game; p: PlayerState }) {
  const h = game.house(p);
  const art = PORTRAITS[p.house][p.gen - 1];
  const level = p.gen >= 3 ? 2 : 1;
  const abilities = h.abilities.filter(a => a.gen <= p.gen);
  return (
    <div className="charcard2" style={{ ['--c' as string]: HOUSE_ART[p.house].color }}>
      {art ? <img className="art" src={art} alt={`${p.name}, Gen ${roman(p.gen)}`} /> : <span className="silhouette" aria-hidden />}
      {CARD_ART.overlays.character && <img className="ov" src={CARD_ART.overlays.character} alt="" />}
      <div className="cc-name">{h.name.replace('House ', '')}</div>
      <div className="cc-gen" aria-label={`Generation ${roman(p.gen)}`}>{roman(p.gen)}</div>
      <div className="cc-crest"><Crest house={p.house} size={24} /></div>
      <div className="cc-panel">
        <div className="cc-type">{h.homeland} · Gen {roman(p.gen)} · {h.hp[p.gen - 1]} ♥</div>
        <div className="cc-lines">
          <span><b>{h.passiveName}:</b> {h.passiveText[level - 1]}</span>
          {abilities.map(a => <span key={a.id}><b>{a.name}:</b> {a.text}</span>)}
        </div>
      </div>
    </div>
  );
}

export function HouseSheet({ game, p, onClose }: { game: Game; p: PlayerState; onClose: () => void }) {
  const h = game.house(p);
  const level = p.gen >= 3 ? 2 : 1;
  return (
    <Sheet title={h.name} onClose={onClose}>
      <CharacterCard game={game} p={p} />
      <div className="house-head">
        <Crest house={p.house} size={48} />
        <div>
          <strong>{p.name}</strong>
          <div className="muted">{h.homeland} · {h.culture} · {h.identity}</div>
          <div><Hearts p={p} /> · Gen {roman(p.gen)} · <Resources p={p} /></div>
        </div>
      </div>
      <p className="lore">{h.lore}</p>
      <h3>Passive: {h.passiveName}</h3>
      <p>{h.passiveText[level - 1]}</p>
      {p.legacy && p.legacy !== p.house && <p>Legacy: {game.house(p.legacy).passiveName} ({game.house(p.legacy).passiveText[0]})</p>}
      {p.extraPassive && <p>Tide of Ancestors: {game.house(p.extraPassive).passiveName}</p>}
      {h.abilities.length > 0 && <h3>Abilities</h3>}
      {h.abilities.map(a => (
        <p key={a.id} className={p.gen >= a.gen ? '' : 'muted'}>
          <b>Gen {roman(a.gen)} · {a.name}</b> — {a.text}
        </p>
      ))}
      <h3>Heart Tokens by generation</h3>
      <p>{h.hp.map((x, i) => `${roman(i + 1)}: ${x}`).join(' · ')}</p>
      {h.downsideText && <p className="muted">{h.downsideText}</p>}
      <p className="muted">
        Kills {p.kills} · Reckonings {p.reckonings} · Grudges held: {p.grudges.length ? p.grudges.map(id => game.p(id).name).join(', ') : 'none'}
      </p>
    </Sheet>
  );
}
