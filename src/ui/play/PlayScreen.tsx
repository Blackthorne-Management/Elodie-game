// The play view: your character card on top, the 2.5D stage in the middle, your hand below.
// Rivals' turns play out on the stage (you see that they play a card, never which one), attacks open
// the duel screen, and the mini-map opens the overhead map.
import { useEffect, useRef, useState } from 'react';
import type { Game, TurnAction } from '../../engine/game';
import type { Decision, Dir, LogEvent, Pos } from '../../engine/types';
import { DIR_NAMES, inBoard, key, manhattan, samePos, step } from '../../engine/board';
import { makeRng } from '../../engine/rng';
import { botChoose } from '../../ai/bot';
import { HUMAN, SPEED_MS, useGame } from '../../state/gameStore';
import type { Speed } from '../../state/gameStore';
import { snapshot } from '../../state/history';
import { Board } from '../Board';
import { CardFace, HouseSheet, Sheet } from '../parts';
import { GameLogActions } from '../HistorySheet';
import { Emblem, HeroCard, RivalChip } from './Figures';
import { Stage } from './Stage';
import { Hand } from './Hand';
import { Duel } from './Duel';
import type { DuelShow } from './Duel';
import { useWalkers } from './walkers';
import { CARD_ART } from '../../assets.config';

const STEP_MS: Record<Speed, number> = { normal: 150, fast: 70, instant: 0 };
const SHOW_MS: Record<Speed, number> = { normal: 1500, fast: 700, instant: 0 };

// Rivals' cards stay hidden: the log says that they played a card, not which.
function displayText(g: Game, e: LogEvent): string {
  if ((e.kind === 'card' || e.kind === 'block') && e.player !== undefined && e.player !== HUMAN && e.cards) {
    let t = e.text;
    for (const c of e.cards) t = t.replace(g.card(c).name, 'a card');
    return t;
  }
  return e.text;
}
const visible = (e: LogEvent) => !e.visibleTo || e.visibleTo.includes(HUMAN);

type SheetState = null | { type: 'house'; id: number } | { type: 'log' } | { type: 'card'; id: number } | { type: 'menu' };

export function PlayScreen() {
  const runner = useGame(s => s.runner)!;
  const version = useGame(s => s.version);
  const speed = useGame(s => s.speed);
  const setSpeed = useGame(s => s.setSpeed);
  const answer = useGame(s => s.answer);
  const quit = useGame(s => s.quit);
  const startedAt = useGame(s => s.startedAt);
  const g = runner.game;
  const s = g.s;
  const d = runner.pending;
  const mine = d?.player === HUMAN ? d : null;
  const me = s.players[HUMAN];

  const { shown, walking, place } = useWalkers(s, version, STEP_MS[speed]);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [showMap, setShowMap] = useState(false);
  const [duel, setDuel] = useState<DuelShow | null>(null);
  const [banner, setBanner] = useState<{ seq: number; player: number; text: string } | null>(null);
  const [dice, setDice] = useState<{ n: number; who: string; seq: number } | null>(null);
  const [pathState, setPathState] = useState<{ id: number; steps: Pos[] }>({ id: -1, steps: [] });
  const busyUntil = useRef(0);
  const lastSeen = useRef(s.seq);
  const botRng = useRef(makeRng(s.setup.seed ^ 0x2545f491));
  const [tick, setTick] = useState(0);
  const decisionId = runner.answers.length;
  // The step path belongs to the current decision; a new decision starts fresh.
  const path = pathState.id === decisionId ? pathState.steps : [];
  const setPath = (f: (p: Pos[]) => Pos[]) => setPathState({ id: decisionId, steps: f(path) });

  // Turn new log events into things to watch: rivals playing cards, duels, dice.
  useEffect(() => {
    const fresh = s.log.filter(e => e.seq > lastSeen.current);
    lastSeen.current = s.seq;
    const show = SHOW_MS[speed];
    for (let i = 0; i < fresh.length; i++) {
      const e = fresh[i];
      if (e.kind === 'roll' && /rolls a/.test(e.text) && e.amount !== undefined) {
        setDice({ n: e.amount, who: e.player !== undefined ? s.players[e.player].name : '', seq: e.seq });
      }
      if (!show) continue;
      if ((e.kind === 'card' || (e.kind === 'instant' && e.player !== HUMAN)) && e.player !== undefined && e.player !== HUMAN) {
        setBanner({ seq: e.seq, player: e.player, text: e.kind === 'card' ? 'is playing a card…' : `draws ${displayText(g, e).split('draws ')[1] ?? 'an event'}` });
        busyUntil.current = Math.max(busyUntil.current, Date.now() + show * 0.8);
      }
      if (e.kind === 'attack' && e.player !== undefined && e.target !== undefined) {
        let outcome: string | null = null;
        for (const f of fresh.slice(i + 1)) {
          if (f.kind === 'attack' || f.kind === 'turn') break;
          if (f.kind === 'block' && f.player === e.target) { outcome = 'Blocked!'; break; }
          if (f.kind === 'damage' && f.player === e.target) outcome = `−${f.amount}`;
          if (f.kind === 'death' && f.player === e.target) { outcome = `${outcome ?? ''} Falls!`.trim(); break; }
        }
        setDuel({ seq: e.seq, attacker: e.player, target: e.target, damage: e.amount ?? 0, kind: e.tag === 'challenge' ? 'challenge' : 'attack', outcome });
        busyUntil.current = Math.max(busyUntil.current, Date.now() + show * 1.2);
      }
    }
  }, [version, s, g, speed]);

  // Overlays fade on their own.
  useEffect(() => { if (!banner) return; const t = setTimeout(() => setBanner(null), SHOW_MS[speed] * 0.8 || 1); return () => clearTimeout(t); }, [banner, speed]);
  useEffect(() => { if (!dice) return; const t = setTimeout(() => setDice(null), speed === 'instant' ? 400 : 900); return () => clearTimeout(t); }, [dice, speed]);
  useEffect(() => {
    if (!duel || d?.kind === 'block' && d.player === HUMAN) return;
    const t = setTimeout(() => setDuel(null), SHOW_MS[speed] * 1.2 || 1);
    return () => clearTimeout(t);
  }, [duel, speed, d]);

  // Bots answer once the table has finished showing what just happened.
  useEffect(() => {
    if (!d || !s.players[d.player].isBot) return;
    if (walking !== null) return;
    const wait = Math.max(SPEED_MS[speed], busyUntil.current - Date.now());
    const t = setTimeout(() => {
      if (busyUntil.current > Date.now()) { setTick(x => x + 1); return; }
      answer(botChoose(g, d, botRng.current));
    }, wait);
    return () => clearTimeout(t);
  }, [version, speed, d, g, s.players, answer, walking, tick]);

  // ---- your move: step with arrows or tap a destination
  const moveMode = mine?.kind === 'move' ? moveInfo(g, mine) : null;
  const start = moveMode?.from ?? null;
  const end = path.at(-1) ?? start;
  const stepsLeft = moveMode?.free ? moveMode.max - path.length : 0;

  function commitAt(dest: Pos) {
    if (!mine || !moveMode) return;
    if (path.length) place(HUMAN, dest);     // you already walked there; don't replay the walk
    const i = mine.options.findIndex(o => o.value === null ? samePos(dest, moveMode.from) : 'x' in (o.value as object) ? samePos(o.value as Pos, dest) : false);
    if (i >= 0) answer(i);
  }

  const lit = new Map<string, () => void>();
  {
    const m = lit;
    if (mine && moveMode) {
      mine.options.forEach((o, i) => {
        const to = optionDest(o.value, moveMode.from);
        // Tapping a square walks you there from wherever your steps have reached.
        if (to && !m.has(key(to))) m.set(key(to), () => { if (path.length && end) place(HUMAN, end); answer(i); });
      });
    } else if (mine?.kind === 'square') {
      mine.options.forEach((o, i) => m.set(key(o.value as Pos), () => answer(i)));
    }
  }

  const arrows = !moveMode?.free || !end || stepsLeft <= 0 ? [] : DIR_NAMES.map(dir => ({ dir, to: step(end, dir) }))
    .filter(a => inBoard(a.to) && manhattan(a.to, moveMode.from) <= moveMode.max)
    .map(a => ({ ...a, onTap: () => setPath(p => [...p, a.to]) }));

  // ---- camera: your move, else whoever is walking or acting, else you
  const activeId = s.turn?.player ?? null;
  const focusId = walking ?? (mine ? HUMAN : activeId ?? HUMAN);
  // While you step, the camera holds still unless you wander far from where you started.
  // While you step, the camera follows the middle of your path: it drifts half a step per tap
  // instead of lurching, and keeps both where you started and where you are in view.
  const stepFocus = moveMode && start && end ? { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 } : null;
  const focus: Pos = stepFocus || shown[focusId] || shown[HUMAN] || { x: 9, y: 9 };

  // ---- your turn's actions
  const turnOpts = mine?.kind === 'turn' ? (mine as Decision<TurnAction>).options : [];
  const playable = new Map<number, number>();
  turnOpts.forEach((o, i) => { if (o.value.type === 'card') playable.set(o.value.card, i); });
  const buttons = turnOpts.map((o, i) => ({ o, i })).filter(({ o }) => o.value.type !== 'card');

  const feed = s.log.filter(visible).slice(-2);
  const rivals = [...s.order.slice(s.order.indexOf(HUMAN) + 1), ...s.order.slice(0, s.order.indexOf(HUMAN))].map(id => s.players[id]);
  const blockDecision = mine?.kind === 'block' ? mine : null;
  const duelToShow = duel ?? (blockDecision ? fromBlock(blockDecision) : null);
  const genericDecision = mine && !['turn', 'move', 'square', 'block'].includes(mine.kind) ? mine : null;

  return (
    <div className="play">
      <div className="rivals2">
        {rivals.map(p => <RivalChip key={p.id} g={g} p={p} active={activeId === p.id} onOpen={() => setSheet({ type: 'house', id: p.id })} />)}
        <button type="button" className="icon-btn menu-btn" onClick={() => setSheet({ type: 'menu' })} aria-label="Menu">☰</button>
      </div>

      <HeroCard g={g} p={me} dim={!mine && activeId !== HUMAN} onOpen={() => setSheet({ type: 'house', id: HUMAN })} />

      <Stage game={g} shown={shown} focus={focus} lit={lit} path={path} arrows={arrows} ghost={moveMode?.free ? end : null}
        active={activeId} onToken={id => setSheet({ type: 'house', id })}>
        <button type="button" className="feed2" onClick={() => setSheet({ type: 'log' })}>
          {feed.map(e => <span key={e.seq}>{displayText(g, e)}</span>)}
        </button>
        {moveMode && <div className="steps2">{moveMode.free ? `${stepsLeft} step${stepsLeft === 1 ? '' : 's'} left · or tap a lit square` : mine!.prompt}</div>}
        {banner && (
          <div className="banner2" key={banner.seq}>
            <Emblem house={s.players[banner.player].house} size={22} /> {s.players[banner.player].name} {banner.text}
            <span className="flying-card" style={{ background: CARD_ART.back }} />
          </div>
        )}
        <button type="button" className="minimap2" onClick={() => setShowMap(true)} aria-label="Open the map">
          <Board game={g} version={version} highlights={new Map()} onPick={() => {}} focus={activeId} zoom={false} />
          <span>MAP</span>
        </button>
      </Stage>

      <div className="bar2">
        {runner.over ? null : moveMode?.free ? (
          <>
            <div className="dpad" aria-label="Step">
              {(['north', 'west', 'east', 'south'] as Dir[]).map(dir => {
                const a = arrows.find(x => x.dir === dir);
                return <button key={dir} type="button" className={`dp-${dir}`} disabled={!a} onClick={a?.onTap} aria-label={`Step ${dir}`}>{DPAD[dir]}</button>;
              })}
            </div>
            <div className="move-btns">
              <button type="button" className="act2" disabled={!path.length} onClick={() => setPath(p => p.slice(0, -1))}>↶ Undo step</button>
              <button type="button" className="act2 gold" onClick={() => end && commitAt(end)}>{path.length ? 'Stop here' : 'Stay here'}</button>
            </div>
          </>
        ) : moveMode ? (
          <div className="opts2">{mine!.options.map((o, i) => <button key={i} type="button" className="act2" onClick={() => answer(i)}>{o.label}</button>)}</div>
        ) : mine?.kind === 'turn' ? (
          <div className="opts2">
            {buttons.map(({ o, i }) => (
              <button key={i} type="button" className={`act2 t-${o.value.type}`} onClick={() => answer(i)}>{o.value.type === 'roll' ? '🎲 Roll and move' : o.label}</button>
            ))}
          </div>
        ) : mine?.kind === 'square' ? (
          <div className="hint2">{mine.prompt} — tap a lit square.</div>
        ) : (
          <div className="hint2">{d && !mine ? `${s.players[d.player].name}'s turn · Round ${s.round}/${s.config.suddenDeathRound}` : ''}</div>
        )}
      </div>

      {!me.specter && <Hand g={g} cards={me.hand} playable={playable} onPlay={answer} onRead={id => setSheet({ type: 'card', id })} dim={!mine} />}

      {dice && <div className="dice" key={dice.seq}><span className="die">{dice.n}</span><span className="die-who">{dice.who}</span></div>}

      {duelToShow && !runner.over && <Duel g={g} duel={duelToShow} block={blockDecision} onAnswer={answer} onClose={() => setDuel(null)} />}

      {genericDecision && (
        <div className="ask2">
          <div className="ask2-prompt">{genericDecision.prompt}</div>
          <div className="opts2">
            {genericDecision.options.map((o, i) => <button key={i} type="button" className="act2" onClick={() => answer(i)}>{o.label}</button>)}
          </div>
        </div>
      )}

      {showMap && (
        <div className="mapview">
          <div className="mapview-head"><b>The Realm · Round {s.round}/{s.config.suddenDeathRound}</b>
            <button type="button" className="act2" onClick={() => setShowMap(false)}>Back to view</button></div>
          <Board game={g} version={version} highlights={new Map([...lit.keys()].map((k, i) => [k, i]))}
            onPick={i => { [...lit.values()][i]?.(); setShowMap(false); }} focus={activeId} zoom={false} />
          <p className="muted small">Circles show each house's emblem; the gold ring marks whose turn it is. Tap a lit square to choose it.</p>
        </div>
      )}

      {runner.over && s.winner !== null && (
        <div className="gameover">
          <Emblem house={s.players[s.winner].house} size={64} />
          <h1>{s.winner === HUMAN ? 'The Throne is yours' : `${s.players[s.winner].name} takes the Throne`}</h1>
          <p>{s.endReason}</p>
          <button type="button" className="big" onClick={quit}>New game</button>
        </div>
      )}

      {sheet?.type === 'house' && <HouseSheet game={g} p={s.players[sheet.id]} onClose={() => setSheet(null)} />}
      {sheet?.type === 'card' && (
        <Sheet title={g.card(sheet.id).name} onClose={() => setSheet(null)}>
          <CardFace card={g.card(sheet.id)} />
          {playable.has(sheet.id) && <button type="button" className="big" onClick={() => { answer(playable.get(sheet.id)!); setSheet(null); }}>Play this card</button>}
          {g.card(sheet.id).responseOnly && <p className="muted">Played only in response, when you are attacked or targeted.</p>}
        </Sheet>
      )}
      {sheet?.type === 'log' && (
        <Sheet title="Chronicle" onClose={() => setSheet(null)}>
          <div className="log">{[...s.log].filter(visible).reverse().slice(0, 250).map(e => <div key={e.seq} className={`feed-line k-${e.kind}`}><span className="muted">R{e.round}</span> {displayText(g, e)}</div>)}</div>
        </Sheet>
      )}
      {sheet?.type === 'menu' && (
        <Sheet title="Menu" onClose={() => setSheet(null)}>
          <h3>Game speed</h3>
          <div className="seg">
            {(['normal', 'fast', 'instant'] as Speed[]).map(x => (
              <button key={x} type="button" className={speed === x ? 'on' : ''} onClick={() => setSpeed(x)}>{x[0].toUpperCase() + x.slice(1)}</button>
            ))}
          </div>
          <h3>Winning</h3>
          <p>Reach {g.thresholds(me).combined} combined or {g.thresholds(me).single} in one pillar, stand on the Throne and Claim it.</p>
          <h3>Report a problem</h3>
          <p className="muted small">Something odd happened? Copy or download this game's full log and send it to Claude.</p>
          <GameLogActions game={snapshot(runner, runner.over ? 'won' : 'in progress', startedAt)} />
          <button type="button" className="big danger" onClick={() => { if (confirm('Abandon this game? It will be kept in Past games.')) quit(); }}>Abandon game</button>
        </Sheet>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- helpers

const DPAD: Record<Dir, string> = { north: '↑', south: '↓', east: '→', west: '←' };

function moveInfo(g: Game, d: Decision): { from: Pos; max: number; free: boolean } | null {
  const mover = g.p((d.context?.player as number | undefined) ?? d.player);
  const from = (d.context?.from as Pos | undefined) ?? mover.pos;
  if (!from) return null;
  const free = !!d.context?.free && mover.id === HUMAN;
  return { from, max: (d.context?.max as number | undefined) ?? 1, free };
}

function optionDest(v: unknown, from: Pos): Pos | null {
  if (v === null) return from;
  if (typeof v === 'object' && v && 'd' in v) {
    const m = v as { d: Dir; n: number };
    return m.n === 0 ? from : step(from, m.d, m.n);
  }
  if (typeof v === 'object' && v && 'x' in v) return v as Pos;
  return null;
}

function fromBlock(d: Decision): DuelShow | null {
  const a = d.context?.attack as { attacker: number; target: number; damage: number; kind: string } | undefined;
  if (!a) return null;
  return { seq: -1, attacker: a.attacker, target: a.target, damage: a.damage, kind: a.kind === 'challenge' ? 'challenge' : 'attack', outcome: null };
}
