// The official rule guide: every rule (src/data/rules.ts), every house and every card, with a contents list.
import { Fragment, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { CardDef } from '../engine/content';
import type { HouseId } from '../engine/types';
import { roman } from '../engine/game';
import { CONTENT } from '../data';
import { GEN_NOTES } from '../data/houses';
import { RULES } from '../data/rules';
import type { RuleBlock } from '../data/rules';
import { TILE_ART, UI_ART } from '../assets.config';
import { CardFrame } from './CardFrame';
import { cardTiming } from './cardKind';
import { Emblem } from './play/Figures';

// **bold** inline markup
export function Rich({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/).map((s, i) => (s.startsWith('**') ? <b key={i}>{s.slice(2, -2)}</b> : <Fragment key={i}>{s}</Fragment>))}</>;
}

function Block({ b }: { b: RuleBlock }) {
  if (typeof b === 'string') return <p><Rich text={b} /></p>;
  if ('quote' in b) return <blockquote><Rich text={b.quote} /></blockquote>;
  const items = 'list' in b ? b.list : b.steps;
  const Tag = 'list' in b ? 'ul' : 'ol';
  return <Tag>{items.map((x, i) => <li key={i}><Rich text={x} /></li>)}</Tag>;
}

const HOUSE_IDS = Object.keys(CONTENT.houses) as HouseId[];
const KINDS = [
  { id: 'all', label: 'All' }, { id: 'hand', label: 'Hand' }, { id: 'instant', label: 'Instant' },
  { id: 'reaction', label: 'Reaction' }, { id: 'elodie', label: 'Elodie' },
] as const;
type KindFilter = (typeof KINDS)[number]['id'];
const matchesKind = (c: CardDef, k: KindFilter) =>
  k === 'all' || (k === 'reaction' ? !!c.reaction : k === 'elodie' ? !!c.elodie : c.kind === k && !c.reaction);

function House({ id }: { id: HouseId }) {
  const h = CONTENT.houses[id];
  const notes = Object.entries(GEN_NOTES[id] ?? {}).map(([gen, t]) => ({ gen: Number(gen), text: t as string }));
  const rows: { gen: number; node: ReactNode }[] = [
    { gen: 1, node: <><b>{h.passiveName}</b> (passive): {h.passiveText[0]}</> },
    { gen: 3, node: <><b>{h.passiveName}</b> upgrades: {h.passiveText[1]}</> },
    ...(h.passiveAbility ? [{ gen: h.passiveAbility.gen, node: <><b>{h.passiveAbility.name}:</b> {h.passiveAbility.text}</> }] : []),
    ...notes.map(n => ({ gen: n.gen, node: <Rich text={`**${n.text.replace(': ', ':** ')}`} /> })),
    ...h.abilities.map(a => ({ gen: a.gen, node: <><b>{a.name}</b>{/^once per/i.test(a.text) ? '' : a.limit === 'game' ? ' (once per game)' : a.limit === 'round' ? ' (once per round)' : ''}: {a.text}</> })),
  ].sort((a, b) => a.gen - b.gen);
  return (
    <article className="rg-house">
      <header>
        <Emblem house={id} size={44} ring />
        <div>
          <h3>{h.name}</h3>
          <small>{h.homeland} · {h.culture} · {TILE_ART[h.tileType].label} tile · {h.identity}</small>
        </div>
      </header>
      <p className="rg-lore">{h.lore}</p>
      <ul className="rg-gens">
        {rows.map((r, i) => <li key={i}><span className="rg-gen">{roman(r.gen)}</span><span>{r.node}</span></li>)}
      </ul>
      <p className="muted small">Heart Tokens: {h.hp.map((x, i) => `${roman(i + 1)} ${x}`).join(' · ')}</p>
      {h.downsideText && <p className="muted small">{h.downsideText}</p>}
    </article>
  );
}

export function RulesGuide({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<KindFilter>('all');
  const [open, setOpen] = useState<CardDef | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const cards = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CONTENT.cards.filter(c => matchesKind(c, kind) && (!s || `${c.name} ${c.text} ${c.category}`.toLowerCase().includes(s)));
  }, [q, kind]);
  const toc = [...RULES.map(r => ({ id: r.id, title: r.title })), { id: 'houses', title: 'The Eight Houses' }, { id: 'card-list', title: 'Every Card' }];
  const go = (id: string) => body.current?.querySelector(`#rg-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="rg" role="dialog" aria-label="Rule guide">
      <div className="rg-bar">
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        <h2>Rule Guide</h2>
        <button type="button" className="icon-btn" onClick={() => body.current?.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to contents">☰</button>
      </div>
      <div className="rg-body" ref={body}>
        {UI_ART.logo && <img className="rg-logo" src={UI_ART.logo} alt="Bloodlines: The Race to Elodie's Grace" />}
        <p className="rg-sub">The official rules</p>
        <nav className="rg-toc frame" aria-label="Contents">
          <h3>Contents</h3>
          <ol>{toc.map(t => <li key={t.id}><button type="button" onClick={() => go(t.id)}>{t.title}</button></li>)}</ol>
        </nav>

        {RULES.map(sec => (
          <section key={sec.id} id={`rg-${sec.id}`} className="rg-sec">
            <h2>{sec.title}</h2>
            {sec.blocks.map((b, i) => <Block key={i} b={b} />)}
          </section>
        ))}

        <section id="rg-houses" className="rg-sec">
          <h2>The Eight Houses</h2>
          <p>Roman numerals show the generation each power arrives at. Every heir keeps all earlier powers.</p>
          {HOUSE_IDS.map(id => <House key={id} id={id} />)}
        </section>

        <section id="rg-card-list" className="rg-sec">
          <h2>Every Card</h2>
          <p>All {CONTENT.cards.length} cards in the Shared Action Deck. Tap a card to see it.</p>
          <input className="rg-search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search cards" aria-label="Search cards" />
          <div className="seg rg-kinds">
            {KINDS.map(k => <button key={k.id} type="button" className={kind === k.id ? 'on' : ''} onClick={() => setKind(k.id)}>{k.label}</button>)}
          </div>
          <p className="muted small">{cards.length} card{cards.length === 1 ? '' : 's'}</p>
          <ul className="rg-cards">
            {cards.map(c => (
              <li key={c.id}>
                <button type="button" onClick={() => setOpen(c)}>
                  <span className="rg-card-head"><b>{c.name}</b><small>#{c.id} · {c.reaction ? 'Reaction' : c.kind === 'hand' ? 'Hand' : 'Instant'} · {c.category}{c.elodie ? ' · Elodie' : ''}</small></span>
                  {cardTiming(c) && <small className="rg-when">{cardTiming(c)}</small>}
                  <span className="rg-text">{c.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <p className="muted small rg-end">Bloodlines: The Race to Elodie's Grace</p>
      </div>
      {open && (
        <div className="rg-card-view" onClick={() => setOpen(null)} role="dialog" aria-label={open.name}>
          <div className="rg-card-big"><CardFrame card={open} /></div>
          <button type="button" className="act2" onClick={() => setOpen(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
