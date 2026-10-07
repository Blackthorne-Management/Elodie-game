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
import { CardSheetFace, HouseSheet, Sheet } from '../parts';
import { GameLogActions } from '../HistorySheet';
import { Emblem, HeroCard, RivalChip } from './Figures';
import { claimGoal } from '../claimGoal';
import { Stage } from './Stage';
import { Hand } from './Hand';
import { Duel } from './Duel';
import { CardRow, PeekSheet } from './Peek';
import { Die } from './Die';
import { peekTitle } from './peekTitle';
import type { PeekGroup } from './Peek';
import type { DuelShow } from './Duel';
import { useMotion } from './motion';
import { CARD_ART, UI_ART } from '../../assets.config';

const WALK_SPEED: Record<Speed, number> = { normal: 6.5, fast: 13, instant: Infinity };   // squares per second
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
// Decisions whose options are cards (picking from a hand, the deck or the discard pile).
const CARD_CHOICES = new Set(['card', 'discard', 'specter']);
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

  const { motion, busy: walking } = useMotion(s, version, WALK_SPEED[speed], me.pos ?? { x: 9, y: 9 });
  const [sheet, setSheet] = useState<SheetState>(null);
  const [showMap, setShowMap] = useState(false);
  const [duel, setDuel] = useState<DuelShow | null>(null);
  const [banner, setBanner] = useState<{ seq: number; player: number; text: string } | null>(null);
  const [dice, setDice] = useState<{ n: number; who: string; seq: number } | null>(null);
  const [pathState, setPathState] = useState<{ id: number; steps: Pos[] }>({ id: -1, steps: [] });
  const busyUntil = useRef(0);
  const [peek, setPeek] = useState<PeekGroup[]>([]);
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
    // Cards revealed to you (a rival's hand, the top of the deck) open face up, like your own hand.
    const peeks = fresh.filter(e => e.kind === 'reveal' && visible(e) && e.cards && (e.tag === 'deck' || e.player !== HUMAN))
      .map(e => ({ seq: e.seq, title: peekTitle(e.text), cards: e.cards! }));
    if (peeks.length) setPeek(p => [...p, ...peeks]);
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
    if (walking || peek.length) return;
    const wait = Math.max(SPEED_MS[speed], busyUntil.current - Date.now());
    const t = setTimeout(() => {
      if (busyUntil.current > Date.now()) { setTick(x => x + 1); return; }
      answer(botChoose(g, d, botRng.current));
    }, wait);
    return () => clearTimeout(t);
  }, [version, speed, d, g, s.players, answer, walking, tick, peek.length]);

  // ---- your move: step with arrows or tap a destination
  const moveMode = mine?.kind === 'move' ? moveInfo(g, mine) : null;
  const start = moveMode?.from ?? null;
  const end = path.at(-1) ?? start;
  const stepsLeft = moveMode?.free ? moveMode.max - path.length : 0;

  function commitAt(dest: Pos) {
    if (!mine || !moveMode) return;
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
        if (to && !m.has(key(to))) m.set(key(to), () => answer(i));
      });
    } else if (mine?.kind === 'square') {
      mine.options.forEach((o, i) => m.set(key(o.value as Pos), () => answer(i)));
    }
  }

  const arrows = !moveMode?.free || !end || stepsLeft <= 0 ? [] : DIR_NAMES.map(dir => ({ dir, to: step(end, dir) }))
    .filter(a => inBoard(a.to) && manhattan(a.to, moveMode.from) <= moveMode.max)
    .map(a => ({ ...a, onTap: () => setPath(p => [...p, a.to]) }));

  // ---- camera: while you step it holds on the middle of your path; otherwise it follows whoever is
  // walking, then settles on whoever is acting.
  const activeId = s.turn?.player ?? null;
  const stepFocus = moveMode?.free && start && end ? { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 } : null;
  const restOn = s.players[mine ? HUMAN : activeId ?? HUMAN].pos ?? me.pos ?? { x: 9, y: 9 };
  const focusKey = stepFocus ? `${stepFocus.x},${stepFocus.y}` : `${restOn.x},${restOn.y}`;
  useEffect(() => { motion.setFocus(stepFocus ?? restOn, !stepFocus); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [motion, focusKey]);
  // Keep whoever is playing visible in the turn tracker.
  const trackerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = trackerRef.current, chip = box?.querySelector<HTMLElement>('.seat3.active');
    if (!box || !chip) return;
    const horizontal = box.scrollWidth > box.clientWidth;
    if (horizontal) box.scrollTo({ left: chip.offsetLeft - box.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' });
    else box.scrollTo({ top: chip.offsetTop - box.clientHeight / 2 + chip.offsetHeight / 2, behavior: 'smooth' });
  }, [activeId]);
  // Your steps move your character on the board right away (the engine only hears about it when you confirm).
  const ghostKey = moveMode?.free && end ? `${end.x},${end.y}` : '';
  useEffect(() => { if (moveMode?.free && end) motion.walkTo(HUMAN, end); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [motion, ghostKey]);

  // ---- your turn's actions
  const turnOpts = mine?.kind === 'turn' ? (mine as Decision<TurnAction>).options : [];
  const playable = new Map<number, number>();
  turnOpts.forEach((o, i) => { if (o.value.type === 'card') playable.set(o.value.card, i); });
  const buttons = turnOpts.map((o, i) => ({ o, i })).filter(({ o }) => o.value.type !== 'card');

  const feed = s.log.filter(visible).slice(-2);
  // The turn tracker: everyone in turn order; earlier seats have played this round.
  const nowIdx = s.turn ? s.order.indexOf(s.turn.player) : -1;
  const blockDecision = mine?.kind === 'block' ? mine : null;
  const duelToShow = duel ?? (blockDecision ? fromBlock(blockDecision) : null);
  const genericDecision = mine && !['turn', 'move', 'square', 'block'].includes(mine.kind) ? mine : null;
  const cardOptions = genericDecision ? genericDecision.options.map((o, i) => ({ card: o.value as number, i })).filter(o => typeof o.card === 'number') : [];

  return (
    <div className="play">
      <div className="rivals2 frame">
        <div className="round3" aria-label={`Round ${s.round} of ${s.config.suddenDeathRound}`}>
          <span>Round</span><b>{s.round}</b><span>of {s.config.suddenDeathRound}</span>
        </div>
        <div className="seats3" ref={trackerRef}>
          {s.order.map((id, i) => (
            <RivalChip key={id} g={g} p={s.players[id]} n={i + 1} me={id === HUMAN} active={activeId === id} done={nowIdx >= 0 && i < nowIdx}
              onOpen={() => setSheet({ type: 'house', id })} />
          ))}
        </div>
        <button type="button" className="icon-btn menu-btn" onClick={() => setSheet({ type: 'menu' })} aria-label="Menu">☰</button>
      </div>

      <HeroCard g={g} p={me} dim={!mine && activeId !== HUMAN} onOpen={() => setSheet({ type: 'house', id: HUMAN })} />

      <Stage game={g} motion={motion} lit={lit} path={path} arrows={arrows}
        active={activeId} onToken={id => setSheet({ type: 'house', id })}>
        <span className="candle l" aria-hidden><img src={UI_ART.candle} alt="" /></span>
        <span className="candle r" aria-hidden><img src={UI_ART.candle} alt="" /></span>
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
              <button key={i} type="button" className={`act2 plaque t-${o.value.type}`} onClick={() => answer(i)}>
                {UI_ART.actions[o.value.type] && <img src={UI_ART.actions[o.value.type]} alt="" />}<span>{o.label}</span>
              </button>
            ))}
          </div>
        ) : mine?.kind === 'square' ? (
          <div className="hint2">{mine.prompt} — tap a lit square.</div>
        ) : (
          <div className="hint2">{d && !mine ? `${s.players[d.player].name}'s turn · Round ${s.round}/${s.config.suddenDeathRound}` : ''}</div>
        )}
      </div>

      {!me.specter && <Hand g={g} cards={me.hand} playable={playable} onPlay={answer} onRead={id => setSheet({ type: 'card', id })} dim={!mine} />}

      {dice && <div className="dice" key={dice.seq}><Die n={dice.n} /><span className="die-who">{dice.who} rolls {dice.n}</span></div>}

      {duelToShow && !runner.over && <Duel g={g} duel={duelToShow} block={blockDecision} onAnswer={answer} onClose={() => setDuel(null)} />}

      {genericDecision && (
        <div className="ask2">
          <div className="ask2-prompt">{genericDecision.prompt}</div>
          {/* A Reaction you could play: show it in full. */}
          {genericDecision.kind === 'reaction' && typeof genericDecision.context?.card === 'number' && (
            <CardRow g={g} cards={[genericDecision.context.card]} />
          )}
          {CARD_CHOICES.has(genericDecision.kind) ? (
            <>
              {/* Choosing between cards: see each one in full, as if holding it. */}
              <CardRow g={g} cards={cardOptions.map(c => c.card)} onChoose={i => answer(cardOptions[i].i)} />
              <div className="opts2">
                {genericDecision.options.map((o, i) => typeof o.value === 'number' ? null : <button key={i} type="button" className="act2" onClick={() => answer(i)}>{o.label}</button>)}
              </div>
            </>
          ) : (
            <div className="opts2">
              {genericDecision.options.map((o, i) => <button key={i} type="button" className="act2" onClick={() => answer(i)}>{o.label}</button>)}
            </div>
          )}
        </div>
      )}

      {peek.length > 0 && <PeekSheet g={g} groups={peek} onClose={() => setPeek([])} />}

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
          <CardSheetFace card={g.card(sheet.id)} />
          {playable.has(sheet.id) && <button type="button" className="big" onClick={() => { answer(playable.get(sheet.id)!); setSheet(null); }}>Play this card</button>}
          {g.card(sheet.id).responseOnly && <p className="muted">Played only in response, when you are attacked or targeted.</p>}
        </Sheet>
      )}
      {sheet?.type === 'log' && (
        <Sheet title="Chronicle" onClose={() => setSheet(null)}>
          <div className="log">{[...s.log].filter(visible).reverse().slice(0, 250).map(e => e.kind === 'reveal' && e.cards?.length
            ? <button key={e.seq} type="button" className={`feed-line k-${e.kind} peekable`} onClick={() => { setSheet(null); setPeek([{ seq: e.seq, title: peekTitle(e.text), cards: e.cards! }]); }}>
                <span className="muted">R{e.round}</span> {displayText(g, e)} <span className="peek-hint">See cards</span></button>
            : <div key={e.seq} className={`feed-line k-${e.kind}`}><span className="muted">R{e.round}</span> {displayText(g, e)}</div>)}</div>
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
          <p>Reach {claimGoal(g.thresholds(me))}, stand on the Throne and Claim it.</p>
          <h3>Report a problem</h3>
          <p className="muted small">Something odd happened? Copy or download this game's full log and send it to Claude.</p>
          <GameLogActions game={snapshot(runner, runner.over ? 'won' : 'in progress', startedAt)} />
          <button type="button" className="big danger" onClick={() => { if (confirm("Abandon this game? It won't count toward your record.")) quit(); }}>Abandon game</button>
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
