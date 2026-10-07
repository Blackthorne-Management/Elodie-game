// Your record on this device: wins, houses, feats and the last few games.
import { useState } from 'react';
import type { HouseId } from '../engine/types';
import { CONTENT } from '../data';
import { loadRecords, resetRecords, summarise } from '../state/stats';
import { Emblem } from './play/Figures';

const houseName = (h: HouseId) => CONTENT.houses[h].name.replace('House ', '');

export function StatsPanel() {
  const [games, setGames] = useState(loadRecords);
  const st = summarise(games);
  if (!st.played) {
    return (
      <section className="stats frame">
        <h2>Your Record</h2>
        <p className="muted">Your record begins with your first game. Wins, favourite houses and feats will gather here.</p>
      </section>
    );
  }
  const feats: [string, string | number][] = [
    ['Fastest win', st.fastestWin ? `Round ${st.fastestWin}` : '—'],
    ['Best streak', st.bestStreak],
    ['Rivals slain', st.kills],
    ['Heirs lost', st.deaths],
    ['Throne claims', st.claims],
    ['Sudden Death wins', st.suddenDeathWins],
    ['Became a Specter', st.specters],
    ['Current streak', st.streak],
  ];
  return (
    <section className="stats frame">
      <h2>Your Record</h2>
      <div className="stats-big">
        <span><b>{st.wins}</b>Wins</span>
        <span><b>{st.played}</b>Games</span>
        <span><b>{Math.round(st.rate * 100)}%</b>Win rate</span>
      </div>

      <div className="stats-recent" aria-label="Last games">
        {st.recent.map(g => (
          <span key={g.at} className={g.won ? 'won' : 'lost'} title={`${houseName(g.house)}: ${g.won ? 'won' : 'lost'} in round ${g.rounds}`}>
            <Emblem house={g.house} size={34} ring />
            <i>{g.won ? 'W' : 'L'}</i>
          </span>
        ))}
      </div>

      <div className="stats-highlights">
        {st.bestHouse && <Highlight label="Most wins with" house={st.bestHouse.house} note={`${st.bestHouse.wins} win${st.bestHouse.wins === 1 ? '' : 's'}`} />}
        {st.favourite && <Highlight label="Most played" house={st.favourite.house} note={`${st.favourite.played} game${st.favourite.played === 1 ? '' : 's'}`} />}
        {st.nemesis && <Highlight label="Your nemesis" house={st.nemesis.house} note={`beat you ${st.nemesis.times}×`} />}
      </div>

      <dl className="stats-feats">
        {feats.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>

      <details className="stats-houses">
        <summary>By house</summary>
        <table>
          <thead><tr><th>House</th><th>Played</th><th>Won</th></tr></thead>
          <tbody>
            {st.houses.map(h => (
              <tr key={h.house}><td><Emblem house={h.house} size={22} /> {houseName(h.house)}</td><td>{h.played}</td><td>{h.wins}</td></tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="link-btn" onClick={() => {
          if (confirm('Erase your record on this device? This cannot be undone.')) { resetRecords(); setGames([]); }
        }}>Reset record</button>
      </details>
    </section>
  );
}

function Highlight({ label, house, note }: { label: string; house: HouseId; note: string }) {
  return (
    <div className="stats-hl">
      <Emblem house={house} size={40} ring />
      <span><small>{label}</small><b>{houseName(house)}</b><small>{note}</small></span>
    </div>
  );
}
