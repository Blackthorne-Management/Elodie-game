// Online play: hosting, joining, the lobby (invite, house vote) and picking houses. Once the game starts, the normal
// play screen takes over.
import { useState } from 'react';
import type { HouseId } from '../engine/types';
import { CONTENT } from '../data';
import { inviteText } from '../net/protocol';
import { useOnline } from '../state/onlineStore';
import { Emblem } from './play/Figures';

const HOUSE_IDS = Object.keys(CONTENT.houses) as HouseId[];
const houseName = (h: HouseId) => CONTENT.houses[h].name.replace('House ', '');
const joinUrl = (code: string) => `${location.origin}${location.pathname}?join=${code}`;

function ErrorLine() {
  const error = useOnline(s => s.error);
  const clear = useOnline(s => s.clearError);
  return error ? <button type="button" className="notice" onClick={clear}>{error} <span aria-hidden>✕</span></button> : null;
}

export function HostPanel({ name }: { name: string }) {
  const host = useOnline(s => s.host);
  const busy = useOnline(s => s.busy);
  const [total, setTotal] = useState(4);
  const [humans, setHumans] = useState(2);
  const people = Math.min(humans, total);
  return (
    <>
      <div className="field">
        <span>Players at the table</span>
        <div className="seg eight">
          {[2, 3, 4, 5, 6, 7, 8].map(n => (
            <button key={n} type="button" className={total === n ? 'on' : ''} onClick={() => setTotal(n)}>{n}</button>
          ))}
        </div>
      </div>
      <div className="field">
        <span>People ({people} people, {total - people} bot{total - people === 1 ? '' : 's'})</span>
        <div className="seg eight">
          {Array.from({ length: total }, (_, i) => i + 1).map(n => (
            <button key={n} type="button" className={people === n ? 'on' : ''} onClick={() => setHumans(n)}>{n}</button>
          ))}
        </div>
      </div>
      <p className="muted small">You get a game code and a message to send your friends. Bots fill the other seats.</p>
      <ErrorLine />
      <button type="button" className="big" disabled={busy} onClick={() => void host(name, total, people)}>{busy ? 'Creating…' : 'Host a game'}</button>
    </>
  );
}

export function JoinPanel({ name, code0 }: { name: string; code0: string }) {
  const join = useOnline(s => s.join);
  const busy = useOnline(s => s.busy);
  const [code, setCode] = useState(code0);
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  return (
    <>
      <label className="field">
        <span>Game code</span>
        <input className="code-input" value={clean} onChange={e => setCode(e.target.value)} placeholder="ABC234" maxLength={6}
          autoCapitalize="characters" autoCorrect="off" spellCheck={false} inputMode="text" />
      </label>
      <ErrorLine />
      <button type="button" className="big" disabled={busy || clean.length !== 6} onClick={() => void join(clean, name)}>
        {busy ? 'Joining…' : 'Join the game'}
      </button>
    </>
  );
}

export function Lobby() {
  const lobby = useOnline(s => s.lobby);
  const vote = useOnline(s => s.vote);
  const start = useOnline(s => s.start);
  const pick = useOnline(s => s.pick);
  const leave = useOnline(s => s.leave);
  const busy = useOnline(s => s.busy);
  const [copied, setCopied] = useState(false);
  if (!lobby) return <main className="setup lobby"><p className="muted">Connecting…</p><ErrorLine /></main>;

  const me = lobby.seats[lobby.me];
  const hostName = lobby.seats[0]?.name ?? '';
  const url = joinUrl(lobby.code);
  const message = inviteText(lobby.code, url, hostName);
  const waiting = lobby.seats.filter(x => !x.joined).length;
  const people = lobby.seats.filter(x => !x.bot);

  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title: 'Bloodlines', text: message, url }); return; }
    } catch { /* fall back to copying */ }
    try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ }
  }

  if (lobby.status === 'picking') {
    const turn = lobby.pickTurn;
    const mine = turn === lobby.me;
    const taken = new Set(lobby.seats.map(x => x.house).filter(Boolean));
    return (
      <main className="setup lobby">
        <h2 className="lobby-title">Choosing houses</h2>
        <section className="panel-card frame">
          <p className="small">Everyone agreed to pick. The dice decide who picks first, then picking goes clockwise.</p>
          {lobby.pickRolls && lobby.pickOrder && (
            <p className="small muted">
              Rolls: {lobby.pickRolls[0].map((n, j) => `${lobby.seats[j]?.name || `Seat ${j + 1}`} ${n}`).join(' · ')}
              {lobby.pickRolls.length > 1 ? ' (ties re-rolled)' : ''}. {lobby.seats[lobby.pickOrder[0]]?.name} picks first.
            </p>
          )}
          <ol className="pick-order">
            {(lobby.pickOrder ?? []).map(seat => {
              const x = lobby.seats[seat];
              return (
                <li key={seat} className={seat === turn ? 'now' : ''}>
                  <span>{x.name || `Seat ${seat + 1}`}{x.bot ? ' (bot)' : ''}{seat === lobby.me ? ' (you)' : ''}</span>
                  <b>{x.house ? houseName(x.house) : seat === turn ? 'choosing…' : ''}</b>
                </li>
              );
            })}
          </ol>
          {mine ? (
            <div className="house-pick" role="radiogroup" aria-label="Your house">
              {HOUSE_IDS.map(h => (
                <button key={h} type="button" role="radio" aria-checked={false} disabled={taken.has(h) || busy} className={taken.has(h) ? 'taken' : ''}
                  onClick={() => void pick(h)}>
                  <Emblem house={h} size={36} ring />
                  <span><b>{houseName(h)}</b><small>{taken.has(h) ? 'Taken' : CONTENT.houses[h].identity}</small></span>
                </button>
              ))}
            </div>
          ) : <p className="muted">Waiting for {turn !== null ? lobby.seats[turn]?.name : '…'} to pick.</p>}
        </section>
        <ErrorLine />
      </main>
    );
  }

  return (
    <main className="setup lobby">
      <h2 className="lobby-title">Game code</h2>
      <div className="lobby-code" aria-label={`Game code ${lobby.code.split('').join(' ')}`}>{lobby.code}</div>
      <section className="panel-card frame">
        <p className="small">Send this to your friends:</p>
        <p className="invite">{message}</p>
        <div className="setup-rules">
          <button type="button" className="act2 gold" onClick={() => void share()}>Share invite</button>
          <button type="button" className="act2" onClick={() => void copy()}>{copied ? 'Copied!' : 'Copy message'}</button>
        </div>
      </section>

      <section className="panel-card frame">
        <h3 className="lobby-h">Players ({lobby.total})</h3>
        <ul className="seats-list">
          {lobby.seats.map(x => (
            <li key={x.seat} className={x.joined ? '' : 'open'}>
              <span className="seat-n">{x.seat + 1}</span>
              <span className="seat-name">{x.bot ? 'Bot' : x.joined ? x.name : 'Waiting for a friend…'}
                {x.seat === 0 && ' (host)'}{x.seat === lobby.me && ' (you)'}</span>
              {!x.bot && x.joined && <span className={`seat-vote ${x.vote ? 'yes' : ''}`}>{x.vote ? 'Pick' : 'Lottery'}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-card frame">
        <h3 className="lobby-h">Houses</h3>
        <p className="small">Houses are drawn by lottery unless <b>every</b> person agrees to pick. One "no" means the lottery.</p>
        <label className="check">
          <input type="checkbox" checked={me?.vote ?? false} onChange={e => void vote(e.target.checked)} />
          <span>I'd like us to pick our houses</span>
        </label>
        <p className="muted small">
          {lobby.pickAgreed ? 'Everyone agrees: you will pick, in dice order.' : `Lottery for now (${people.filter(x => x.vote).length} of ${people.length} want to pick).`}
        </p>
      </section>

      <ErrorLine />
      {lobby.host
        ? <button type="button" className="big" disabled={busy || waiting > 0} onClick={() => void start()}>
            {waiting > 0 ? `Waiting for ${waiting} more…` : busy ? 'Starting…' : 'Start the game'}
          </button>
        : <p className="muted">Waiting for {hostName || 'the host'} to start the game.</p>}
      <button type="button" className="act2" onClick={() => { if (confirm(lobby.host ? 'Close this game for everyone?' : 'Leave this game?')) void leave(); }}>
        {lobby.host ? 'Close the game' : 'Leave'}
      </button>
    </main>
  );
}
