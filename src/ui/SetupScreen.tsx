import { useState } from 'react';
import { useGame } from '../state/gameStore';
import { HistorySheet } from './HistorySheet';
import { BUILD } from '../state/history';
import { THRESHOLDS, TUNING } from '../config';

export function SetupScreen() {
  const start = useGame(s => s.start);
  const resume = useGame(s => s.resume);
  const hasSave = useGame(s => s.hasSave)();
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('tob-name') ?? ''; } catch { return ''; }
  });
  const [players, setPlayers] = useState(4);
  const [history, setHistory] = useState(false);
  const notice = useGame(s => s.notice);
  const dismissNotice = useGame(s => s.dismissNotice);

  function begin() {
    try { localStorage.setItem('tob-name', name); } catch { /* ignore */ }
    start(name, players);
  }

  return (
    <main className="setup">
      <img src={`${import.meta.env.BASE_URL}apple-touch-icon.png`} alt="" width="88" height="88" className="setup-icon" />
      <h1>Throne of Bloodlines</h1>
      <p className="tagline">Eight houses. One throne. Every death makes your bloodline stronger.</p>

      {notice && <button type="button" className="notice" onClick={dismissNotice}>{notice} <span aria-hidden>✕</span></button>}
      {hasSave && <button type="button" className="big" onClick={() => resume()}>Continue your game</button>}

      <section className="panel-card">
        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Optional: your house name is used" maxLength={16} />
        </label>
        <div className="field">
          <span>Players (you + {players - 1} bot{players === 2 ? '' : 's'})</span>
          <div className="seg eight">
            {[2, 3, 4, 5, 6, 7, 8].map(n => (
              <button key={n} type="button" className={players === n ? 'on' : ''} onClick={() => setPlayers(n)}>{n}</button>
            ))}
          </div>
        </div>
        <p className="muted small">Houses are drawn by lottery. Unclaimed house tiles are free for anyone to farm.</p>
        <button type="button" className="big" onClick={begin}>{hasSave ? 'Start a new game' : 'Begin'}</button>
      </section>

      <button type="button" className="secondary" onClick={() => setHistory(true)}>Past games &amp; logs</button>
      {history && <HistorySheet onClose={() => setHistory(false)} />}

      <details className="rules-brief">
        <summary>How to play</summary>
        <ol>
          <li><b>Move:</b> roll a die and move up to that many squares, turning as you like (no diagonals).</li>
          <li><b>Resources:</b> end on a Court, War or Trade tile to gain Influence, Fear or Wealth ({TUNING.tileAlone} if you're alone there, {TUNING.tileShared} if shared). Never from your own tile, nor the same tile twice in a row.</li>
          <li><b>Then one action:</b> attack a rival beside you (not diagonal) for damage equal to your Heart Tokens, <i>or</i> play a Hand Card, <i>or</i> offer a rival a 1-for-1 resource trade they may refuse. Only one.</li>
          <li><b>Opening truce:</b> no attacks during the first round.</li>
          <li><b>Reactions:</b> some Hand Cards are played on other players' turns, at the moment printed on them (when a rival rolls, plays a card, trades…).</li>
          <li><b>Cards:</b> at the end of your turn, draw back to 3. Instants resolve the moment they're drawn.</li>
          <li><b>Win:</b> reach {THRESHOLDS.normal.combined} resources in total with at least {THRESHOLDS.normal.minEach} in every pillar ({THRESHOLDS.small.combined} with {THRESHOLDS.small.minEach}+ each in 2–3 player games), stand on the Throne and Claim it. Eligible rivals may Challenge.</li>
          <li><b>The Throne is sanctuary:</b> no attacks onto or off its four squares, and no one dies there (Challenges for the Throne aside).</li>
          <li><b>Death</b> isn't the end: your heir rises with new powers. After Gen IV you become a Specter.</li>
        </ol>
      </details>
      <p className="muted small">Build {BUILD}</p>
    </main>
  );
}
