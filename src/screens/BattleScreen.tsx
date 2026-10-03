import { useEffect, useRef, useState } from 'react';
import type { Battle, BattleEvent, Choice } from '../engine/battle';
import type { Combatant } from '../engine/damage';
import type { Rng } from '../engine/rng';
import type { StatusId } from '../engine/types';
import { runRound } from '../engine/battle';
import { aiChoose } from '../engine/ai';
import { stormMultiplier } from '../engine/damage';
import { PetCard } from '../components/PetCard';
import type { CardFx, Floater } from '../components/PetCard';
import { describeMove, targetsOneFoe } from '../components/describeMove';
import { GRACE_MAX, PLAYBACK_MS, PLAYBACK_MS_FAST } from '../config';

type View = Record<string, { hp: number; statuses: StatusId[] }>;

const viewOf = (b: Battle): View =>
  Object.fromEntries(b.units.map(u => [u.key, { hp: u.hp, statuses: u.statuses.map(s => s.id) }]));

interface Props {
  initial: Battle;
  rng: Rng;
  onFinish: (winner: 'player' | 'enemy') => void;
}

export function BattleScreen({ initial, rng, onFinish }: Props) {
  const [battle, setBattle] = useState(initial);
  const [view, setView] = useState(() => viewOf(initial));
  const [playback, setPlayback] = useState<{ next: Battle; i: number } | null>(null);
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [target, setTarget] = useState<string | null>(null);
  const [auto, setAuto] = useState(false);
  const [fast, setFast] = useState(false);
  const [floaters, setFloaters] = useState<Record<string, Floater[]>>({});
  const [fx, setFx] = useState<Record<string, CardFx>>({});
  const [caption, setCaption] = useState('Choose a move for each Skyling');
  const nextId = useRef(0);

  const delay = fast ? PLAYBACK_MS_FAST : PLAYBACK_MS;
  const enemies = battle.units.filter(u => u.side === 'enemy');
  const players = battle.units.filter(u => u.side === 'player');
  const busy = playback !== null || battle.winner !== undefined;
  const active = busy ? undefined : players.find(u => u.hp > 0 && !choices[u.key]);
  const defaultTarget = active ? aiChoose(active, battle).targetKey : undefined;
  const shownTarget = target ?? defaultTarget;

  function startRound(picked: Record<string, Choice>) {
    const next = runRound(battle, picked, rng);
    setChoices({});
    setTarget(null);
    setPlayback({ next, i: 0 });
  }

  function pickMove(moveId: string) {
    if (!active) return;
    const picked = { ...choices, [active.key]: { moveId, targetKey: shownTarget } };
    setTarget(null);
    const allChosen = players.every(u => u.hp <= 0 || picked[u.key]);
    if (allChosen) startRound(picked);
    else setChoices(picked);
  }

  function unpick(key: string) {
    const rest = { ...choices };
    delete rest[key];
    setChoices(rest);
    setTarget(null);
  }

  function float(key: string, text: string, kind: Floater['kind']) {
    const f = { id: nextId.current++, text, kind };
    setFloaters(all => ({ ...all, [key]: [...(all[key] ?? []), f] }));
    setTimeout(() => setFloaters(all => ({ ...all, [key]: (all[key] ?? []).filter(x => x.id !== f.id) })), 900);
  }

  function flash(key: string, kind: CardFx['kind']) {
    setFx(all => ({ ...all, [key]: { kind, n: nextId.current++ } }));
  }

  function show(e: BattleEvent, next: Battle) {
    const unit = (key: string) => next.units.find(u => u.key === key)!;
    switch (e.t) {
      case 'move': {
        const u = unit(e.who);
        const m = u.moves.find(x => x.id === e.move);
        setCaption(`${u.name} used ${m?.name ?? e.move}!`);
        flash(e.who, 'act');
        break;
      }
      case 'damage':
        setView(v => ({ ...v, [e.target]: { ...v[e.target], hp: Math.max(0, v[e.target].hp - e.amount) } }));
        float(e.target, e.crit ? `${e.amount}!` : `${e.amount}`, e.crit ? 'crit' : 'damage');
        flash(e.target, 'hit');
        break;
      case 'heal':
        setView(v => {
          const max = unit(e.target).maxHp;
          return { ...v, [e.target]: { ...v[e.target], hp: Math.min(max, v[e.target].hp + e.amount) } };
        });
        float(e.target, `+${e.amount}`, 'heal');
        flash(e.target, 'heal');
        break;
      case 'status':
        setView(v => {
          const cur = v[e.target].statuses;
          return cur.includes(e.status) ? v : { ...v, [e.target]: { ...v[e.target], statuses: [...cur, e.status] } };
        });
        break;
      case 'miss':
        float(e.target, 'Miss', 'miss');
        break;
      case 'skip':
        setCaption(`${unit(e.who).name} is frozen solid!`);
        break;
      case 'faint':
        setCaption(`${unit(e.target).name} fainted!`);
        break;
      case 'end':
        setCaption(e.winner === 'player' ? 'The skies are clear!' : 'Your team was defeated…');
        break;
    }
  }

  // Play the round's log back one event at a time.
  useEffect(() => {
    if (!playback) return;
    const { next, i } = playback;
    if (i >= next.log.length) {
      setBattle(next);
      setView(viewOf(next));
      setPlayback(null);
      if (!next.winner) setCaption(auto ? 'Auto-battling…' : 'Choose a move for each Skyling');
      return;
    }
    const t = setTimeout(() => {
      show(next.log[i], next);
      setPlayback({ next, i: i + 1 });
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback, delay]);

  // Auto-battle: the AI picks for the player too.
  useEffect(() => {
    if (!auto || busy) return;
    const t = setTimeout(() => startRound({}), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, busy, battle]);

  const card = (u: Combatant, onClick?: () => void, note?: string, selected?: boolean) => (
    <PetCard
      key={u.key}
      unit={u}
      hp={view[u.key].hp}
      statuses={view[u.key].statuses}
      floaters={floaters[u.key] ?? []}
      fx={fx[u.key]}
      selected={selected}
      note={note}
      onClick={onClick}
    />
  );

  const shownRound = battle.round + (playback ? 1 : 0);
  const storm = stormMultiplier(shownRound);
  const activeMoves = active?.moves ?? [];
  const rooted = active?.statuses.some(s => s.id === 'root') ?? false;
  const aimNeeded = activeMoves.some(targetsOneFoe);

  return (
    <div className="battle">
      <header className="battle-top">
        <div className="round">
          Round {shownRound}
          {storm > 1 && <div className="storm">Storm ×{storm.toFixed(1)}</div>}
        </div>
        <div className="grace" title="Elodie's Grace">
          <div className="grace-fill" style={{ width: `${((playback?.next ?? battle).grace / GRACE_MAX) * 100}%` }} />
          <span>Grace</span>
        </div>
        <button type="button" className={`toggle ${auto ? 'on' : ''}`} onClick={() => setAuto(a => !a)}>Auto</button>
        <button type="button" className={`toggle ${fast ? 'on' : ''}`} onClick={() => setFast(f => !f)}>2×</button>
      </header>

      <section className="row enemies">
        {enemies.map(u => {
          const aimed = !!active && aimNeeded && shownTarget === u.key;
          return card(u, active && aimNeeded ? () => setTarget(u.key) : undefined, aimed ? 'Target' : undefined, aimed);
        })}
      </section>

      <div className="caption" aria-live="polite">{caption}</div>

      <section className="row players">
        {players.map(u => {
          const c = choices[u.key];
          const note = c ? u.moves.find(m => m.id === c.moveId)?.name : undefined;
          return card(u, c && !busy ? () => unpick(u.key) : undefined, note, active?.key === u.key);
        })}
      </section>

      <footer className="picker">
        {battle.winner && !playback ? (
          <div className="result">
            <h2>{battle.winner === 'player' ? 'Victory!' : 'Defeated'}</h2>
            <button type="button" className="big" onClick={() => onFinish(battle.winner!)}>
              {battle.winner === 'player' ? 'Continue' : 'Try again'}
            </button>
          </div>
        ) : active && !auto ? (
          <>
            <div className="picker-title">
              <strong>{active.name}</strong>
              {aimNeeded && <span> · tap a foe to aim</span>}
            </div>
            <div className="moves">
              {activeMoves.map(m => {
                const cd = active.cooldowns[m.id] ?? 0;
                const locked = cd > 0 || (rooted && m.slot !== 'basic');
                return (
                  <button key={m.id} type="button" className={`move ${m.slot}`} disabled={locked} onClick={() => pickMove(m.id)}>
                    <span className="move-name">{m.name}</span>
                    <span className="move-desc">{cd > 0 ? `Ready in ${cd}` : rooted && m.slot !== 'basic' ? 'Rooted' : describeMove(m)}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </footer>
    </div>
  );
}
