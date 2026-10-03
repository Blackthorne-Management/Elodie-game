import { useEffect, useMemo, useRef, useState } from 'react';
import type { Game, TurnAction } from '../engine/game';
import { roman } from '../engine/game';
import type { Decision, Dir, LogEvent, PlayerState, Pos } from '../engine/types';
import { key, step } from '../engine/board';
import { makeRng } from '../engine/rng';
import { botChoose } from '../ai/bot';
import { HUMAN, SPEED_MS, useGame } from '../state/gameStore';
import type { Speed } from '../state/gameStore';
import { Board } from './Board';
import { CardFace, Crest, Hearts, HouseSheet, Resources, Sheet } from './parts';
import { ICONS } from '../assets.config';

const visible = (e: LogEvent) => !e.visibleTo || e.visibleTo.includes(HUMAN);

export function GameScreen() {
  const runner = useGame(s => s.runner)!;
  const version = useGame(s => s.version);
  const speed = useGame(s => s.speed);
  const setSpeed = useGame(s => s.setSpeed);
  const answer = useGame(s => s.answer);
  const quit = useGame(s => s.quit);
  const g = runner.game;
  const s = g.s;
  const d = runner.pending;
  const mine = d?.player === HUMAN ? d : null;

  const [zoom, setZoom] = useState(false);
  const [sheet, setSheet] = useState<null | { type: 'house'; id: number } | { type: 'log' } | { type: 'card'; id: number } | { type: 'menu' }>(null);
  const [dice, setDice] = useState<{ n: number; who: string; seq: number } | null>(null);
  const botRng = useRef(makeRng(s.setup.seed ^ 0x2545f491));
  const lastDice = useRef(0);

  // Bots answer their own decisions after a short pause.
  useEffect(() => {
    if (!d || !s.players[d.player].isBot) return;
    const t = setTimeout(() => answer(botChoose(g, d, botRng.current)), SPEED_MS[speed]);
    return () => clearTimeout(t);
  }, [version, speed, d, g, s.players, answer]);

  // Flash the die whenever a movement roll happens.
  useEffect(() => {
    const roll = [...s.log].reverse().find(e => e.kind === 'roll' && /rolls a/.test(e.text) && e.text.includes('rolls a') && e.seq > lastDice.current);
    if (!roll || roll.amount === undefined) return;
    lastDice.current = roll.seq;
    setDice({ n: roll.amount, who: roll.player !== undefined ? s.players[roll.player].name : '', seq: roll.seq });
    const t = setTimeout(() => setDice(cur => (cur?.seq === roll.seq ? null : cur)), speed === 'instant' ? 400 : 900);
    return () => clearTimeout(t);
  }, [version, s.log, s.players, speed]);

  // Squares the human can tap for the current decision.
  const highlights = useMemo(() => squareOptions(g, mine), [g, mine]);
  const me = s.players[HUMAN];
  const current = s.turn ? s.players[s.turn.player] : null;
  const turnActions = mine?.kind === 'turn' ? (mine as Decision<TurnAction>).options : [];
  const playable = new Map<number, number>();
  turnActions.forEach((o, i) => { if (o.value.type === 'card') playable.set(o.value.card, i); });

  const log = s.log.filter(visible);
  const recent = log.slice(-3);

  return (
    <div className="game">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={() => setSheet({ type: 'menu' })} aria-label="Menu">☰</button>
        <div className="round">Round {s.round}/{s.config.suddenDeathRound}</div>
        <div className="turn-of">
          {current && <><Crest house={current.house} size={20} /> {current.id === HUMAN ? 'Your turn' : `${current.name}'s turn`}</>}
        </div>
        <button type="button" className="icon-btn" onClick={() => setZoom(z => !z)} aria-label="Zoom board">{zoom ? '－' : '＋'}</button>
      </header>

      <div className="strip">
        {s.order.map(id => <PlayerChip key={id} g={g} p={s.players[id]} active={s.turn?.player === id} onClick={() => setSheet({ type: 'house', id })} />)}
      </div>

      <Board game={g} version={version} highlights={highlights} onPick={answer} focus={s.turn?.player ?? null} zoom={zoom} />

      <button type="button" className="feed" onClick={() => setSheet({ type: 'log' })}>
        {recent.map(e => <div key={e.seq} className={`feed-line k-${e.kind}`}>{e.text}</div>)}
      </button>

      <section className={`panel ${mine ? 'mine' : ''}`}>
        {runner.over ? null : mine ? (
          <DecisionPanel g={g} d={mine} onAnswer={answer} onCard={id => setSheet({ type: 'card', id })} />
        ) : d ? (
          <div className="waiting">
            <Crest house={s.players[d.player].house} size={22} />
            <span>{s.players[d.player].name} is deciding…</span>
          </div>
        ) : null}
      </section>

      {!me.specter && (
        <section className="hand">
          {me.hand.map(c => (
            <CardFace key={c} card={g.card(c)} small playable={playable.has(c)} onClick={() => setSheet({ type: 'card', id: c })} />
          ))}
          {me.hand.length === 0 && <div className="muted">No cards in hand</div>}
        </section>
      )}

      {dice && (
        <div className="dice" key={dice.seq}>
          <span className="die">{dice.n}</span>
          <span className="die-who">{dice.who}</span>
        </div>
      )}

      {runner.over && s.winner !== null && (
        <div className="gameover">
          <Crest house={s.players[s.winner].house} size={64} />
          <h1>{s.winner === HUMAN ? 'The Throne is yours' : `${s.players[s.winner].name} takes the Throne`}</h1>
          <p>{s.endReason}</p>
          <button type="button" className="big" onClick={quit}>New game</button>
        </div>
      )}

      {sheet?.type === 'house' && <HouseSheet game={g} p={s.players[sheet.id]} onClose={() => setSheet(null)} />}
      {sheet?.type === 'card' && (
        <Sheet title={g.card(sheet.id).name} onClose={() => setSheet(null)}>
          <CardFace card={g.card(sheet.id)} />
          {playable.has(sheet.id) && (
            <button type="button" className="big" onClick={() => { answer(playable.get(sheet.id)!); setSheet(null); }}>Play this card</button>
          )}
          {g.card(sheet.id).responseOnly && <p className="muted">Played only in response, when you are attacked or targeted.</p>}
        </Sheet>
      )}
      {sheet?.type === 'log' && (
        <Sheet title="Chronicle" onClose={() => setSheet(null)}>
          <div className="log">
            {[...log].reverse().slice(0, 200).map(e => <div key={e.seq} className={`feed-line k-${e.kind}`}><span className="muted">R{e.round}</span> {e.text}</div>)}
          </div>
        </Sheet>
      )}
      {sheet?.type === 'menu' && (
        <Sheet title="Menu" onClose={() => setSheet(null)}>
          <h3>Bot speed</h3>
          <div className="seg">
            {(['normal', 'fast', 'instant'] as Speed[]).map(x => (
              <button key={x} type="button" className={speed === x ? 'on' : ''} onClick={() => setSpeed(x)}>{x[0].toUpperCase() + x.slice(1)}</button>
            ))}
          </div>
          <h3>Thresholds</h3>
          <p>Claim the Throne with {g.thresholds(me).combined} combined or {g.thresholds(me).single} in one pillar.</p>
          <button type="button" className="big danger" onClick={() => { if (confirm('Abandon this game?')) { quit(); } }}>Abandon game</button>
        </Sheet>
      )}
    </div>
  );
}

function PlayerChip({ g, p, active, onClick }: { g: Game; p: PlayerState; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`chip ${active ? 'active' : ''} ${p.specter ? 'specter' : ''}`} onClick={onClick}>
      <Crest house={p.house} size={26} />
      <span className="chip-body">
        <span className="chip-name">
          {p.name}{p.id === HUMAN ? ' (you)' : ''} {g.eligible(p) && <span className="elig" title="Can claim the Throne">{ICONS.eligible}</span>}
        </span>
        <span className="chip-stats"><Hearts p={p} /> · {roman(p.gen)} · {p.hand.length}🂠</span>
        <Resources p={p} compact />
      </span>
    </button>
  );
}

// ---------------------------------------------------------------- decisions

function DecisionPanel({ g, d, onAnswer, onCard }: { g: Game; d: Decision; onAnswer: (i: number) => void; onCard: (id: number) => void }) {
  if (d.kind === 'turn') {
    const opts = (d as Decision<TurnAction>).options;
    const t = g.s.turn;
    const buttons = opts.map((o, i) => ({ o, i })).filter(({ o }) => o.value.type !== 'card');
    const cards = opts.filter(o => o.value.type === 'card').length;
    return (
      <div>
        <div className="prompt">
          Your turn{t ? ` · ${t.moved ? 'moved' : 'not moved yet'}${t.actions >= t.actionsAllowed ? ' · action used' : t.moved ? ' · attack or play a card' : ''}` : ''}
        </div>
        <div className="actions">
          {buttons.map(({ o, i }) => (
            <button key={i} type="button" className={`act act-${o.value.type}`} onClick={() => onAnswer(i)}>{o.label}</button>
          ))}
        </div>
        {cards > 0 && <div className="hint">Tap a glowing card below to play it.</div>}
      </div>
    );
  }

  if (d.kind === 'move') return <MovePanel d={d} onAnswer={onAnswer} />;

  const isCard = ['card', 'discard', 'specter', 'block'].includes(d.kind);
  return (
    <div>
      <div className="prompt">{d.prompt}</div>
      {d.kind === 'square' && <div className="hint">Tap a highlighted square on the board (＋ to zoom).</div>}
      {d.kind !== 'square' && (
        <div className={`actions ${isCard ? 'cards' : ''}`}>
          {d.options.map((o, i) => {
            const cardId = typeof o.value === 'number' && isCard ? o.value : null;
            return (
              <div key={i} className="opt">
                <button type="button" className="act" onClick={() => onAnswer(i)}>{o.label}</button>
                {cardId !== null && <button type="button" className="icon-btn small" onClick={() => onCard(cardId)} aria-label="Read card">?</button>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MovePanel({ d, onAnswer }: { d: Decision; onAnswer: (i: number) => void }) {
  // Group "North 1..6" style options into rows; "Stay"/"Step" options become plain buttons.
  const rows = new Map<string, { n: number; i: number }[]>();
  const plain: { label: string; i: number }[] = [];
  d.options.forEach((o, i) => {
    const v = o.value as { d: Dir; n: number } | Pos | null;
    if (v && typeof v === 'object' && 'd' in v && v.n > 0) rows.set(v.d, [...(rows.get(v.d) ?? []), { n: v.n, i }]);
    else if (v === null || 'd' in (v as object) || o.label.startsWith('Step')) plain.push({ label: o.label, i });
    // Free moves list every reachable square: those are picked on the board.

  });
  return (
    <div>
      <div className="prompt">{d.prompt}</div>
      <div className="hint">{rows.size ? 'Tap a highlighted square, or choose below.' : 'Tap a highlighted square on the board (＋ zooms in).'}</div>
      {[...rows.entries()].map(([dir, xs]) => (
        <div key={dir} className="move-row">
          <span className="move-dir">{ARROW[dir as Dir]} {dir}</span>
          {xs.map(x => <button key={x.i} type="button" className="num" onClick={() => onAnswer(x.i)}>{x.n}</button>)}
        </div>
      ))}
      <div className="actions">
        {plain.map(x => <button key={x.i} type="button" className="act" onClick={() => onAnswer(x.i)}>{x.label}</button>)}
      </div>
    </div>
  );
}

const ARROW: Record<Dir, string> = { north: '↑', south: '↓', east: '→', west: '←' };

function squareOptions(g: Game, d: Decision | null): Map<string, number> {
  const out = new Map<string, number>();
  if (!d) return out;
  if (d.kind === 'move') {
    const from = (d.context?.from as Pos | undefined) ?? g.p((d.context?.player as number) ?? d.player).pos;
    d.options.forEach((o, i) => {
      const v = o.value as { d: Dir; n: number } | Pos | null;
      if (!from) return;
      const to = v === null ? from : 'd' in v ? (v.n === 0 ? from : step(from, v.d, v.n)) : v;
      if (!out.has(key(to))) out.set(key(to), i);
    });
  } else if (d.kind === 'square') {
    d.options.forEach((o, i) => out.set(key(o.value as Pos), i));
  } else if (d.kind === 'player') {
    d.options.forEach((o, i) => {
      const p = typeof o.value === 'number' ? g.p(o.value) : null;
      if (p?.pos && !out.has(key(p.pos))) out.set(key(p.pos), i);
    });
  }
  return out;
}
